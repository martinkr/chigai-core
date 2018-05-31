/**
 * Specs for the regression check module.
 * Handles the regresion test for the provided items
 * It ensures the arguments have the correct form.
 * It creates the data-objects.
 * It makes screenshots.
 * It ensrures that there are reference items.
 * It compares the screenshot (regression item) against the reference item.
 * It returns an array of results.
 *
 * The specs use stubs for all dependencies.
 * There are specs for the dependend modules.
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

const fs = require("fs-extra-plus");
const path = require("path");
const crypto = require("crypto");

const proxyquire = require("proxyquire").noCallThru();

const thisModulePath = "api/check-regression";
let thisModule = require("./../../app/" + thisModulePath);


const port = 3000;
const server = require("chigai-mock-server");
let testServer;

// create stubs for spying on them
let stubResultsToJson = {
	"write": (items) => new Promise((resolve, reject) => {
		resolve(items);
	})
};
let spyResultsToJson = sinon.spy(stubResultsToJson, "write");
// mock dependencies
const stubAndReturn = ((value) => {
	thisModule = proxyquire("./../../app/" + thisModulePath, {
		"./../adapter/puppeteer": (item) => {
			return new Promise((resolve, reject) => {
				item.screenshot = value;
				resolve(item);
			});
		},
		"./../adapter/blink-diff": (item) => {
			return new Promise((resolve, reject) => {
				item.match = value;
				resolve(item);
			});
		},
		"./../utils/reference-item": (item) => {
			return new Promise((resolve, reject) => {
				item.fresh = value;
				resolve(item);
			});
		},
		"./../utils/results-to-json": {
			"write": spyResultsToJson
		},
	});
});

// setup data
const dataPathDefault = path.join("./test/", "data");
const dataPathCustom = path.join("./", "/test/_tmp/customfolder");
const hash = crypto.createHash("sha512").update(`http://localhost:${port}/static` + 500 + 500).digest("hex");
const regressionItem = path.join(dataPathDefault, hash + "regression.png");
const referenceItem = path.join(dataPathDefault, hash + "reference.png");
const differenceItem = path.join(dataPathDefault, hash + "difference.png");

/** creates a data-object as argument */
const createItem = () => {
	let item = {
		"viewport": {}
	};
	item.uri = `http://localhost:${port}/static`;
	item.viewport.width = 500;
	item.viewport.height = 500;
	item.hash = hash;
	item.regression_item = regressionItem;
	item.reference_item = referenceItem;
	item.difference_item = differenceItem;
	item.options = {};
	return item;
};


describe(`the module ${thisModulePath}`, () => {

	afterEach((done) => {
		spyResultsToJson.resetHistory();
		testServer.close();
		done();
	});

	beforeEach(async () => {
		testServer = server.listen(port);
	});

	after(async () => {
		await fs.emptyDir(dataPathDefault);
		await fs.remove(dataPathCustom);
		spyResultsToJson.restore();
	});

	describe("should handle errors", () => {

		it("should throw if there's no argument)", (async () => {
			try {
				await thisModule(null);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if the argument is not an array", (async () => {
			try {
				await thisModule({});
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if there's no array as argument", (async () => {
			try {
				await thisModule({});
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if there's no propery \"uri\" in the object", (async () => {
			try {
				await thisModule([{
					"foo": "bar"
				}]);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

	});

	describe("should work as expected", () => {

		it("should ensure the screenshot directory is available", (async () => {
			let result;
			let item = createItem();
			item.options.path = dataPathCustom;
			stubAndReturn(true);
			result = await thisModule([item]);
			result = await fs.pathExists(dataPathCustom);
			result.should.be.ok;
		}));

		it("should give one result for one item ", (async () => {
			let result;
			stubAndReturn(true);
			result = await thisModule([createItem()]);
			result.should.have.a.lengthOf(1);
		}));

		it("should give two result for two itemx ", (async () => {
			let result;
			stubAndReturn(true);
			result = await thisModule([createItem(), createItem()]);
			result.should.have.a.lengthOf(2);
		}));

		it("should return an array", (async () => {
			let result;
			stubAndReturn(true);
			result = await thisModule([createItem()]);
			result.should.be.an("array");
		}));

		// screenshot
		it("should return an array of result objects indicating \"screenshot successfull\" ", (async () => {
			let result;
			stubAndReturn(true);
			result = await thisModule([createItem()]);
			(result.shift().screenshot).should.be.true
		}));

		it("should return an array of result objects indicating \"screenshot failed\" ", (async () => {
			let result;
			stubAndReturn(false);
			result = await thisModule([createItem()]);
			(result.shift().screenshot).should.be.false
		}));

		// reference
		it("should return an array of result objects indicating \"reference was freshly created\" ", (async () => {
			let result;
			stubAndReturn(true);
			result = await thisModule([createItem()]);
			(result.shift().fresh).should.be.true
		}));

		it("should return an array of result objects indicating \"reference was already present\" ", (async () => {
			let result;
			stubAndReturn(false);
			result = await thisModule([createItem()]);
			(result.shift().fresh).should.be.false
		}));

		// compare
		it("should return an array of result objects indicating \"comparison successfull\" ", (async () => {
			let result;
			stubAndReturn(true);
			result = await thisModule([createItem()]);
			(result.shift().match).should.be.true
		}));


		it("should return an array of result objects indicating \"comparison failed\" ", (async () => {
			let result;
			stubAndReturn(false);
			result = await thisModule([createItem()]);
			(result.shift().match).should.be.false
		}));

		// write to json
		it("should write the results to file by calling the \"utils/results-to-json\" module", (async () => {
			stubAndReturn(false);
			await thisModule([createItem()]);
			spyResultsToJson.should.have.been.calledOnce;
		}));


	});

});
