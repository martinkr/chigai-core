
/**
 * Specs for the results to jons module.
 * It takes an array of result items (which currently contains one result)
 * It ensures the results.json is present in the "output path" (where the screenshots are)
 * It reads the result.json which contains an array of result items
 * It replaces a prior item in the file (by hash) or adds the current item to the array.
 * It saves the file.
 *
 * @copyright 2018 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */
const fs = require("fs-extra-plus");
const path = require("path");
const crypto = require("crypto");

const thisModulePath = "utils/results-to-json";
const thisModule = require("./../../app/" + thisModulePath).write;

// setup data
const dataFile = "results.json";
const dataPathDefault = path.join(__dirname, "screenshots");
const pathFile = path.join(dataPathDefault,"/",dataFile);
const hash = crypto.createHash("sha512").update(`http://localhost:3000/static` + 1024 + 786).digest("hex");

/** creates a data-object as argument */
const createItem = (suffix, counter) => {
	let item = {}
	item.hash = suffix ? hash + suffix : hash;
	item.path = dataPathDefault;
	item.count = counter ? counter : 0;
	return item;
};

describe(`the module ${thisModulePath}`, () => {

	afterEach((done) => {
		done();
	});

	beforeEach(async () => {
		await fs.emptyDir(dataPathDefault);
		await fs.ensureFile(pathFile);
	})

	after(async() => {
	});

	describe("should take on argument, an \"array\"", () => {

		it("should throw if the first argument is an \"object\" instead of an \"array\"", (async () => {
			try {
				await thisModule({});
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if the first argument is a \"Number\" instead of an \"array\"", (async () => {
			try {
				await thisModule(1);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if the first argument is a \"String\" instead of an \"array\"", (async () => {
			try {
				await thisModule("string");
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if the first argument is an \"Object\" instead of an \"array\"", (async () => {
			try {
				await thisModule({});
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if the first argument is a Boolean \"true\" instead of an \"array\"", (async () => {
			try {
				await thisModule(true);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if the first argument is a Boolean \"false\" instead of an \"array\"", (async () => {
			try {
				await thisModule(false);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if the first argument is \"null\" instead of an \"array\"", (async () => {
			try {
				await thisModule(null);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if the first argument is \"undefined\" instead of an \"array\"", (async () => {
			try {
				await thisModule(undefined);
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if the first argument is missing instead of an \"array\"", (async () => {
			try {
				await thisModule();
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should take an \"array\" as an argument", (async () => {
			let result;
			result = await thisModule([]);
			result.should.be.ok;
		}));

		it("should take an empty \"array\" as an argument and return true", (async () => {
			let result;
			result = await thisModule([]);
			result.should.be.ok;
		}));

		it("should take an \"array\" with one item as an argument and return true", (async () => {
			let result;
			result = await thisModule([createItem()]);
			result.should.be.ok;
		}));

	});

	describe("should work as expected", () => {



		it("should ensure the data.json is available", (async() => {
			let result;
			await fs.remove(pathFile);
			await thisModule([createItem()]);
			result = await fs.pathExists(pathFile);
			result.should.be.ok;
		}));



		it("should do nothing and return true if there's nothing in the file and no item", (async() => {
			let result;
			await fs.remove(pathFile);
			result = await thisModule([]);

			result.should.be.true;
		}));

		it("should do nothing and return true if there's an empty array in the file and no item", (async() => {
			let result;
			await fs.remove(pathFile);
			await fs.outputJson(pathFile, []);

			result = await thisModule([]);
			result.should.be.true;

			result = await fs.readJSON(pathFile);
			result.should.be.deep.equal([]);
		}));

		it("should write an array with the item if there's an empty array in the file and one item", (async() => {
			let result;
			let item = createItem();
			await fs.remove(pathFile);
			await fs.outputJson(pathFile, []);

			await thisModule([item]);

			result = await fs.readJSON(pathFile);
			result.should.be.deep.equal([item]);
		}));

		it("should write an array with two items if there's one item in the array of the file and one item", (async() => {
			let result;
			let item1 = createItem();
			let item2 = createItem("_1");
			await fs.remove(pathFile);
			await fs.outputJson(pathFile, [item1]);


			await thisModule([item2]);

			result = await fs.readJSON(pathFile);
			result.should.be.deep.equal([item1,item2]);
		}));

		it("should write an array with one updated item if there's one item in the array which is the same item at the begining", (async() => {
			let result;
			let item1 = createItem();
			let item1_1 =  createItem(null, 1);
			let item2 = createItem("_1");
			let item3 = createItem("_2");
			let item4 = createItem("_3");
			await fs.remove(pathFile);
			await fs.outputJson(pathFile, [item1,item2,item3,item4]);

			await thisModule([item1_1]);

			result = await fs.readJSON(pathFile);
			result.should.be.deep.equal([item1_1,item2,item3,item4]);
		}));

		it("should write an array with one updated item if there's one item in the array which is the same item at the end ", (async() => {
			let result;
			let item1 = createItem();
			let item2 = createItem("_1");
			let item3 = createItem("_2");
			let item4 = createItem("_3");
			let item4_1 =  createItem("_3", 1);
			await fs.remove(pathFile);
			await fs.outputJson(pathFile, [item1,item2,item3,item4]);

			await thisModule([item4_1]);

			result = await fs.readJSON(pathFile);
			result.should.be.deep.equal([item1,item2,item3,item4_1]);
		}));

		it("should write an array with one updated item if there's one item in the array which is the same item in the middle", (async() => {
			let result;
			let item1 = createItem();
			let item2 = createItem("_1");
			let item2_1 =  createItem("_1", 1);
			let item3 = createItem("_2");
			let item4 = createItem("_3");
			await fs.remove(pathFile);
			await fs.outputJson(pathFile, [item1,item2,item3,item4]);

			await thisModule([item2_1]);

			result = await fs.readJSON(pathFile);
			result.should.be.deep.equal([item1,item2_1,item3,item4]);
		}));

		it("should work even if the existing file is not an array aka corrupt", (async() => {
			let result;
			let item1 = createItem();
			await fs.remove(pathFile);
			await fs.outputJson(pathFile, {"should":"be an array not an object"});

			result = await thisModule([item1]);
			result.should.be.true;

			result = await fs.readJSON(pathFile);
			result.should.be.deep.equal([item1]);
		}));


	});
});
