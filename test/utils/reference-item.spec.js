/**
 * Specs for the reference-item utility module
 * This module ensures the existence of a reference item.
 * It creates a new reference item for the comparison if none exists.
 * The fresh reference item is just a copy of the regression item.
 * It sets the flag "fresh" on the data-object:
 * - true if it had to create a fresh reference item
 * - false if the reference item already existed
 *
 * @copyright 2016, 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */
const fs = require("fs-extra-plus");
const path = require("path");
const crypto = require("crypto");

const thisModulePath = "utils/reference-item";
const thisModule = require("./../../app/" + thisModulePath);

const dataPath = path.join("./test/", "data");


// setup data

const hash = crypto.createHash("sha512").update("http://rebel-mother.surge.sh" + 1024 + 786).digest("hex");
const regressionItem = path.join("./", "screenshots", hash + "_regression.png");
const referenceItem = path.join("./", "screenshots", hash + "_reference.png");


/** creates a data-object as argument */
const createItem = () => {
	let item = { "viewport": {} };
	item.uri = "http://rebel-mother.surge.sh";
	item.viewport.width = 500;
	item.viewport.height = 500;
	item.hash = hash;
	item.regression_item = regressionItem;
	item.reference_item = referenceItem;
	return item;
};

describe(`the module ${thisModulePath}`, () => {

	beforeEach(async () => {
		await fs.emptyDir(dataPath);
		await fs.ensureFile(regressionItem);
		await fs.ensureFile(referenceItem);
	});


	after(async () => {
		await fs.emptyDir(path.join("./", "screenshots"));
	});

	describe("should rely on all arguments and handle all errors", () => {

		it("should throw if theres no argument ", (async () => {
			try {
				await thisModule(null);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if the argument is not an object", (async () => {
			try {
				await thisModule([{}]);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if the regression_item does not exists", (async () => {
			try {
				await fs.remove(regressionItem);
				await thisModule(createItem());
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

	});

	describe("should work as expected", () => {

		it("should return an object", (async () => {
			let result;
			result = await thisModule(createItem());
			result.should.be.an("object");
		}));

		it("should create a regression item if none exists", (async () => {
			let result;
			let exists;
			await fs.remove(referenceItem);
			result = await thisModule(createItem());
			exists = await fs.pathExists(result.regression_item);
			exists.should.be.ok;
		}));

		it("should set a flag if there was no regression_item", (async () => {
			let result;
			let exists;
			await fs.remove(referenceItem);
			result = await thisModule(createItem());
			result.fresh.should.be.ok;
		}));

		it("should be no flag if there was a regression_item", (async () => {
			let result;
			await fs.ensureFile(regressionItem);
			result = await thisModule(createItem());
			result.fresh.should.not.be.ok;
		}));

	});
});
