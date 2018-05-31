/* eslint-env mocha */

const fs = require("fs-extra-plus");
const path = require("path");
const crypto = require("crypto");

const thisModulePath = "data-object";
const thisModule = require("./../../app/utils/" + thisModulePath);

const defaultValue = 0.01;

const rcfile = path.join(process.cwd(), ".chigairc.json");
const customPath = "./test/_tmp/custom";

/** creates a data-object as argument */
const createItem = (uri, options) => {
	let item = { "viewport": {} };
	item.uri = uri;
	item.options = options;
	return item;
};

describe(`the module ${thisModulePath}`, () => {

	describe("should work as expected for the option \"path\". It", () => {

		it("should return a data object with: a numeric threshold", (async () => {
			let result;
			result = await thisModule(createItem("http://", {}));
			result.threshold.should.be.a("number");
		}));

		it("should return a data object with: a given numeric threshold, \"threshold\"", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "threshold" : 10}));
			result.threshold.should.be.a("number").and.equal(10);
		}));

		it("should return a data object with: a default numeric threshold if no \"threshold\" is given", (async () => {
			let result;
			result = await thisModule(createItem("http://", { }));
			result.threshold.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric threshold width if \"threshold\" is null", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "threshold": null }));
			result.threshold.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric threshold width if \"threshold\" is undefined", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "threshold": undefined }));
			result.threshold.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric threshold if \"threshold\" is false", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "threshold": false }));
			result.threshold.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric threshold if \"threshold\" is true", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "threshold": true }));
			result.threshold.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric threshold if \"threshold\" is NaN", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "threshold": NaN }));
			result.threshold.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object where the passed options take precedence over .chigairc.json for \"threshold\"", (async () => {
			await fs.remove(rcfile);
			await fs.writeFile(rcfile, JSON.stringify({"threshold": 0.9}));
			let result;
			let expectation = 0.99;
			let item = createItem("http://",{ "threshold": expectation});
			result = await thisModule(item);
			await fs.remove(rcfile);
			result.threshold.should.equal(expectation);
		}));

	});
});
