
/**
 * Specs for the puppeteer adapter
 * This module integrates chrome's headless node API
 * It makes screenshots from the given uris and saves them as PNG files.
 * It creates the PNG used as regression item.
 * It sets the flag "screenshot" on the data-object:
 * - true if the regression item was created successfully
 * - false if the regression item was not created successfully
 *
 *
 * "Puppeteer is a Node library which provides a high-level API to control headless Chrome over the DevTools Protocol."
 * @see https://github.com/GoogleChrome/puppeteer
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

const thisModulePath = "adapter/puppeteer";
const thisModule = require("./../../app/" + thisModulePath);

const port = 3000;
const server = require("chigai-mock-server");
let testServer;

/** creates a data-object as argument */
const createItem = () => {
	let item = {}
	item.uri = `http://localhost:${port}/static`;
	item.viewportWidth = 500;
	item.viewportHeight = 500;
	item.hash = crypto.createHash("sha512").update(item.uri + item.viewportWidth + item.viewportHeight).digest("hex");
	item.regression_item = path.join("./", "screenshots", item.hash + "_regression.png");
	return item;
};


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

	describe("should handle errors", () => {

		it("should throw if there's no location \"item.uri\"", (async() => {
			try {
				await thisModule((() => {
					let ret = createItem();
					delete ret.uri;
					return ret;
				})());
			} catch (error) {
				return  error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if there's an error in puppeteer", (async() => {
			try {
				await thisModule((() => {
					let ret = createItem();
					ret.uri = "Invalid";
					return ret;
				})());
			} catch (error) {
				return  error.should.be.an.instanceof(Error);
			}
		}));

	});

	describe("should work as expected", () => {

		it("should create a screenshot based on the item", (async() => {
			let result;
			result = await thisModule(createItem());
			result.screenshot.should.be.ok;
		}));

		it("should save the screenshot properly", (async() => {
			let result;
			result = await thisModule(createItem());
			result = await fs.pathExists(result.regression_item);
			result.should.be.ok;
		}));

		it("should save the screenshot even if theres no viewport specifiec", (async() => {
			let result;
			result = await thisModule((() => {
				let ret = createItem();
				delete ret.viewportWidth;
				delete ret.viewportHeight;
				return ret;
			})());
			result = await fs.pathExists(result.regression_item);
			result.should.be.ok;
		}));


	});
});
