
/**
 * Specs for the config-file utility module
 * This module checks for a .chigailrc.json file.
 * It provides an API for getting config options
 * and makes sure all modules can work with the options
 *
 * @copyright 2016, 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/* eslint-env mocha */
const fs = require("fs-extra-plus");
const path = require("path");


const thisModulePath = "utils/config-file";
const thisModule = require("./../../app/" + thisModulePath);

const rcfile = path.join(process.cwd(), ".chigairc.json");
const defaults = { "path": path.join(process.cwd(), "./screenshots") };
const customPath = "./test/_tmp/custom";
const rcfileOptions = { "path": path.join(process.cwd(), customPath) };


// setup data

describe(`the module ${thisModulePath}`, () => {

	before(async() => {
	});


	after(async() => {
	});

	describe("should return the default options if no rcfile is present", () => {
		beforeEach(async () => {
			await fs.remove(rcfile);
		});

		it("should return the label for default ", (async () => {
			let result = await thisModule();
			// exists = await fs.pathExists(result.regression_item);
			result.from.should.equal("default");
		}));

		it("should return the default path ", (async () => {
			let result = await thisModule();
			// exists = await fs.pathExists(result.regression_item);
			result.path.should.equal(defaults.path);
		}));

	});


	describe("should return the default options if the rcfile is invalid", () => {
		beforeEach(async () => {
			await fs.remove(rcfile);
			await fs.writeFile(rcfile, "{invalid:json}");
		});

		after(async() => {
			await fs.remove(rcfile);
		});

		it("should return the label for default ", (async () => {
			let result = await thisModule();
			// exists = await fs.pathExists(result.regression_item);
			result.from.should.equal("default");
		}));

		it("should return the default path ", (async () => {
			let result = await thisModule();
			// exists = await fs.pathExists(result.regression_item);
			result.path.should.equal(defaults.path);
		}));

	});

	describe("should return the default options for a key if this key is missing", () => {
		beforeEach(async () => {
			await fs.remove(rcfile);
		});

		after(async() => {
			await fs.remove(rcfile);
		});

		it("should return the label for the .chigairc.json file ", (async () => {
			await fs.writeFile(rcfile, JSON.stringify({"x": true}));
			let result = await thisModule();
			// exists = await fs.pathExists(result.regression_item);
			result.from.should.have.a.string(".chigairc.json");
		}));

		it("should return the default path if the path is missing  ", (async () => {
			await fs.writeFile(rcfile, JSON.stringify({"x": true}));
			let result = await thisModule();
			// exists = await fs.pathExists(result.regression_item);
			result.path.should.equal(defaults.path);
		}));

	});
	describe("should work as expected and it", () => {

		beforeEach(async () => {
			await fs.remove(rcfile);
			await fs.writeFile(rcfile, JSON.stringify({"path": customPath}));
		});

		after(async() => {
			await fs.remove(rcfile);
		});

		it("should return the label for the .chigairc.json file ", (async () => {
			let result = await thisModule();
			// exists = await fs.pathExists(result.regression_item);
			result.from.should.have.a.string(".chigairc.json");
		}));

		it("should return the custom path ", (async () => {
			let result = await thisModule();
			// exists = await fs.pathExists(result.regression_item);
			result.path.should.equal(rcfileOptions.path);
		}));

		it("should create the custom path if it's not already there", (async () => {
			let result;
			await fs.remove(rcfileOptions.path);
			await thisModule();
			result = await fs.pathExists(rcfileOptions.path);
			result.should.be.ok;
		}));

	});
});
