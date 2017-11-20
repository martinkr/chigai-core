
/**
 * Specs for the fresh-reference module.
 * Creates a fresh reference for a given set of items.
 * It ensures the arguments have the correct form.
 * It creates the data-objects.
 * It removes the current reference item.
 * It creates a new screenshot (regression item).
 * It sets the freshly created screenshot as regression item.
 * It sets the "fresh" flag to true.
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

const thisModulePath = "api/fresh-reference";
// const thisModule = require("./../../app/" + thisModulePath);
let thisModule;

const port = 3000;
const server = require("chigai-mock-server");
let testServer;


// mock dependencies
const stubAndReturn = ((value) => {
	thisModule = proxyquire("./../../app/" + thisModulePath,
		{
			"./../adapter/puppeteer": (item) => { return new Promise((resolve, reject) => {item.screenshot = value; resolve(item); }); },
			"./../utils/reference-item": (item) => { return new Promise((resolve, reject) => { item.fresh = value; resolve(item); }); }
		}
	);
});

// setup data
const dataPathDefault = path.join("./", "screenshots");
const dataPathCustom = path.join("./", "/test/_tmp/customfolder");
const hash = crypto.createHash("sha512").update(`http://localhost:${port}/static` + 1024 + 786).digest("hex");
const regressionItem = path.join("./", "screenshots", hash + "_regression.png");
const referenceItem = path.join("./", "screenshots", hash + "_reference.png");

/** creates a data-object as argument */
const createItem = () => {
	let item = {}
	item.uri = `http://localhost:${port}/static`;
	item.hash = hash;
	item.options = {};
	return item;
};

describe(`the module ${thisModulePath}`, () => {

	afterEach((done) => {
		testServer.close();
		done();
	});

	beforeEach(async () => {
		testServer = server.listen(port);
		await fs.remove(dataPathCustom);
		await fs.emptyDir(dataPathDefault);
		await fs.ensureFile(regressionItem);
		await fs.ensureFile(referenceItem);
		stubAndReturn(true);
	})

	after(async() => {
		await fs.emptyDir(path.join("./", "screenshots"));
	});

	describe("should handle errors", () => {

		it("should throw if there's no argument", (async() => {
			try {
				await thisModule(null);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}

			throw new Error("should throw");
		}));

		it("should throw if there's no array as argument", (async () => {
			try {
				await thisModule({});
			} catch (error) {
				return  error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if there's no propery \"uri\" in the object", (async() => {
			try {
				await thisModule([{"foo": "bar"}]);
			} catch (error) {
				return  error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

	});

	describe("should work as expected", () => {

		it("should ensure the screenshot directory is available", (async() => {
			let result;
			let item = createItem();
			item.options.path = dataPathCustom;
			// stubAndReturn(true);
			result = await thisModule([item]);
			result = await fs.pathExists(dataPathCustom);
			result.should.be.ok;
		}));

		it("should return an array", (async() => {
			let result;
			// stubAndReturn(true);
			result = await thisModule([createItem()]);
			result.should.be.an("array");
		}));

		it("should return one result if one item was given", (async() => {
			let result;
			// stubAndReturn(true);
			result = await thisModule([createItem()]);
			result.should.have.a.lengthOf(1);
		}));

		it("should return two results if two items were given", (async() => {
			let result;
			// stubAndReturn(true);
			result = await thisModule([createItem(),createItem()]);
			result.should.have.a.lengthOf(2);
		}));

		it("should set \"fresh\" to true", (async() => {
			let result;
			// stubAndReturn(true);
			result = await thisModule([createItem()]);
			(result.shift().fresh).should.be.ok
		}));

	});
});
