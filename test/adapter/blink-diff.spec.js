/**
 * Specs for the blink-diff adapter
 *
 * Blink-Diff: "A lightweight image comparison tool http://yahoo.github.io/blink-diff/"
 * @see https://github.com/yahoo/blink-diff
 *
 * @copyright 2016, 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */

const fs = require("fs-extra-plus");
const path = require("path");
const dataPath = path.join("./test/", "fixtures");
const crypto = require("crypto");

const thisModulePath = "adapter/blink-diff";
const thisModule = require("./../../app/" + thisModulePath);

const port = 3000;
const server = require("chigai-mock-server");
let testServer;

/** creates a data-object as argument */
const createItem = () => {
	let item = {
		"viewport": {}
	};
	item.uri = `http://localhost:${port}/static`;
	item.threshold = 0.01;
	item.viewport.width = 500;
	item.viewport.height = 500;
	item.hash = crypto.createHash("sha512").update(item.uri + item.viewport.width + item.viewport.height).digest("hex");
	item.regression_item = path.join(dataPath, "first" + ".png");
	item.reference_item = path.join(dataPath, "second" + ".png");
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

	after(async () => {
		await fs.emptyDir(path.join("./", "screenshots"));
	});

	describe("should handle errors", () => {

		it("should catch blink-diff errors", (async () => {
			try {
				await thisModule((() => {
					let ret = createItem();
					delete ret.regression_item;
					delete ret.reference_item;
					return ret;
				})());
			} catch (error) {
				return error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));


	});

	describe("should work as expected", () => {

		it("should return false if the images differ", (async () => {
			let result;
			result = await thisModule((() => {
				let ret = createItem();
				ret.regression_item = path.join(dataPath, "first" + ".png");
				ret.reference_item = path.join(dataPath, "second" + ".png");
				return ret;
			})());
			result.match.should.not.be.ok;
		}));

		it("should return true if the images are the same", (async () => {
			let result;
			result = await thisModule((() => {
				let ret = createItem();
				ret.regression_item = path.join(dataPath, "first" + ".png");
				ret.reference_item = path.join(dataPath, "first" + ".png");
				return ret;
			})());
			result.match.should.be.ok;
		}));


	});
});
