
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

// mock dependencies
const stubAndReturn = ((value) => {
	thisModule = proxyquire("./../../app/" + thisModulePath,
		{
			"./../adapter/puppeteer": (item) => { return new Promise((resolve, reject) => { item.screenshot = value; resolve(item); }); },
			"./../adapter/blink-diff": (item) => { return new Promise((resolve, reject) => { item.match = value; resolve(item); }); },
			"./../utils/reference-item": (item) => { return new Promise((resolve, reject) => { item.fresh = value; resolve(item); }); }
		}
	);
});

// setup data
const dataPath = path.join("./test/", "data");
const hash = crypto.createHash("sha512").update(`http://localhost:${port}/static` + 500 + 500).digest("hex");
const regressionItem = path.join(dataPath, hash + "regression.png");
const referenceItem = path.join(dataPath, hash + "reference.png");
const differenceItem = path.join(dataPath, hash + "difference.png");

/** creates a data-object as argument */
const createItem = () => {
	let item = {}
	item.uri = `http://localhost:${port}/static`;
	item.viewportWidth = 500;
	item.viewportHeight = 500;
	item.hash = hash;
	item.regression_item = regressionItem;
	item.reference_item = referenceItem;
	item.difference_item = differenceItem;
	return item;
};

describe(`the module ${thisModulePath}`, () => {

	afterEach((done) => {
		testServer.close();
		done();
	});

	beforeEach(async () => {
		testServer = server.listen(port);
	});

	after(async() => {
		await fs.emptyDir(path.join("./", "screenshots"));
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
				await thisModule([{ "foo": "bar" }]);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

	});

	describe("should work as expected", () => {

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

	});

});
