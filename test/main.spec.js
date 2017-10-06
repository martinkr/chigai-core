
/**
 * Specs for the main entry point
 * This module provides the external api of chigai-core
 * The specs are true end-to-end tests.
 *
 * @copyright 2016, 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */
// const fs = require("fs-extra-plus");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs-extra-plus");

const thisModulePath = "main";
const thisModule = require("./../app/" + thisModulePath);

const port = 3000;
const server = require("chigai-mock-server");
let testServer;

const uriDynamic = `http://localhost:${port}/random`;
const uriStatic = `http://localhost:${port}/static`;


describe(`the module ${thisModulePath}`, () => {

	afterEach((done) => {
		testServer.close();
		done();
	});

	beforeEach(async () => {
		testServer = server.listen(port);
		await fs.emptyDir(path.join("./", "screenshots"));
	});

	after(async() => {
		await fs.emptyDir(path.join("./", "screenshots"));
	});

	describe("should provide an API for regression testing. It:", () => {

		it("should export a function \"regression\"", (async () => {
			thisModule.regression.should.be.a("function");
		}));

		it("should throw if theres no argument for uri", (async () => {
			try {
				await thisModule.regression(null);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if theres no argument for uri", (async () => {
			try {
				await thisModule.regression(null);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should return an array", (async () => {
			let result;
			result = await thisModule.regression(uriStatic, {"vw": 500, "vh": 500});
			result.should.be.an("array");
		}));

		it("should return an array with one item", (async () => {
			let result;
			result = await thisModule.regression(uriStatic, {"vw": 500, "vh": 500});
			result.should.have.a.lengthOf(1);
		}));

		it("should create a screenshot of the given url - the regression item", (async () => {
			let result;
			let resultItem;
			let exists;
			result = await thisModule.regression(uriStatic, { "vw": 500, "vh": 500 });
			resultItem = result.shift();
			exists = await fs.pathExists((resultItem.regression_item));
			resultItem.screenshot.should.be.ok;
			exists.should.be.ok;
		}));

		it("should create the reference item if none exists", (async () => {
			let result;
			let resultItem;
			let exists;
			result = await thisModule.regression(uriStatic, { "vw": 500, "vh": 500 });
			resultItem = result.shift();
			exists = await fs.pathExists((resultItem.reference_item));
			resultItem.screenshot.should.be.ok;
			resultItem.fresh.should.be.ok;
			exists.should.be.ok;
		}));

		it("should create the difference image", (async () => {
			let result;
			let resultItem;
			let exists;
			result = await thisModule.regression(uriStatic, { "vw": 500, "vh": 500 });
			resultItem = result.shift();
			exists = await fs.pathExists((resultItem.difference_item));
			resultItem.screenshot.should.be.ok;
			exists.should.be.ok;
		}));

		it("should set \"match\" to true if the images are considered being the same", (async () => {
			let result;
			let resultItem;
			// first
			result = await thisModule.regression(uriStatic, { "vw": 500, "vh": 500 });
			// compare
			result = await thisModule.regression(uriStatic, { "vw": 500, "vh": 500 });
			resultItem = result.shift();
			resultItem.match.should.be.ok;
		}));

		it("should set \"match\" to false if the images are considered being different", (async () => {
			let result;
			let resultItem;
			// first
			await thisModule.regression(uriDynamic, { "vw": 500, "vh": 500 });
			// compare
			result = await thisModule.regression(uriDynamic, { "vw": 500, "vh": 500, "threshold": 0.000001});
			resultItem = result.shift();
			resultItem.match.should.not.be.ok;
		}));

		it("should just display message on \"-d\" / \"dry run\" and return \"false\"", (async () => {
			let result;
			result = await thisModule.regression(uriDynamic, { "d": true });
			result.should.not.be.ok;
		}));

	});


	describe("should provide an API for setting a new reference. It:", () => {

		it("should export a function \"reference\"", (async () => {
			thisModule.reference.should.be.a("function");
		}));

		it("should throw if theres no argument for uri", (async () => {
			try {
				await thisModule.reference(null);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if theres no argument for uri", (async () => {
			try {
				await thisModule.reference(null);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should return an array", (async () => {
			let result;
			result = await thisModule.reference(uriStatic, { "vw": 500, "vh": 500 });
			result.should.be.an("array");
		}));

		it("should return an array with one item", (async () => {
			let result;
			result = await thisModule.reference(uriStatic, { "vw": 500, "vh": 500 });
			result.should.have.a.lengthOf(1);
		}));

		it("should create a reference item if none exists", (async () => {
			let result;
			let resultItem;
			let exists;
			result = await thisModule.reference(uriStatic, { "vw": 500, "vh": 500 });
			resultItem = result.shift();
			exists = await fs.pathExists((resultItem.reference_item));
			resultItem.fresh.should.be.ok;
			exists.should.be.ok;
		}));

		it("should create the reference item if there's already an existing one", (async () => {
			let result;
			let resultItem;
			let exists;
			result = await thisModule.reference(uriStatic, { "vw": 500, "vh": 500 });
			resultItem = result.shift();
			exists = await fs.pathExists((resultItem.reference_item));
			resultItem.fresh.should.be.ok;
			exists.should.be.ok;
		}));

		it("should just display message on \"-d\" / \"dry run\" and return \"false\"", (async () => {
			let result;
			result = await thisModule.reference(uriDynamic, { "d": true });
			result.should.not.be.ok;
		}));



	});

});
