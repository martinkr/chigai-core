/* eslint-env mocha */

const fs = require("fs-extra-plus");
const path = require("path");
const crypto = require("crypto");

const thisModulePath = "data-object";
const thisModule = require("./../../app/utils/" + thisModulePath);


const rcfile = path.join(process.cwd(), ".chigairc.json");
const customPath = "./test/_tmp/custom";

const defaultValue = 0;

/** creates a data-object as argument */
const createItem = (uri, options) => {
	let item = { "viewport": {} };
	item.uri = uri;
	item.options = options;
	return item;
};

describe(`the module ${thisModulePath}`, () => {

	describe("should work as expected for the option \"wait\". It", () => {

		it("should return a data object with: a numeric wait-property", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "wait": 500 }));
			result.wait.should.be.a("number");
		}));

		it("should return a data object with: a given numeric wait-property, \"wait\" ", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "wait": 500 }));
			result.wait.should.be.a("number").and.equal(500);
		}));

		it("should return a data object with: a default numeric wait-property if no \"wait\" is given", (async () => {
			let result;
			result = await thisModule(createItem("http://", { }));
			result.wait.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric wait-property if \"wait\" is null", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "wait": null }));
			result.wait.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric wait-property if \"wait\" is undefined", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "wait": undefined }));
			result.wait.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric wait-property if \"wait\" is false", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "wait": false }));
			result.wait.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric wait-property if \"wait\" is true", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "wait": true }));
			result.wait.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric wait-property if \"wait\" is NaN", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "wait": NaN }));
			result.wait.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object where the passed options take precedence over .chigairc.json for \"wait\"", (async () => {
			await fs.remove(rcfile);
			await fs.writeFile(rcfile, JSON.stringify({"wait": 99}));
			let result;
			let expectation = 999;
			let item = createItem("http://",{ "wait": expectation});
			result = await thisModule(item);
			await fs.remove(rcfile);
			result.wait.should.equal(expectation);
		}));


	});
});
