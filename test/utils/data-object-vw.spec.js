/* eslint-env mocha */

const fs = require("fs-extra-plus");
const path = require("path");
const crypto = require("crypto");

const thisModulePath = "data-object";
const thisModule = require("./../../app/utils/" + thisModulePath);


const rcfile = path.join(process.cwd(), ".chigairc.json");
const customPath = "./test/_tmp/custom";

const defaultValue = 1024;

/** creates a data-object as argument */
const createItem = (uri, options) => {
	let item = { "viewport": {} };
	item.uri = uri;
	item.options = options;
	return item;
};

describe(`the module ${thisModulePath}`, () => {

	describe("should work as expected for the option \"vw\". It", () => {

		it("should return a data object with: a numeric viewport width", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": 500 }));
			result.viewport.width.should.be.a("number");
		}));

		it("should return a data object with: a given numeric viewport width, \"vw\" ", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": 500 }));
			result.viewport.width.should.be.a("number").and.equal(500);
		}));

		it("should return a data object with: a default numeric viewport width if no \"vw\" is given", (async () => {
			let result;
			result = await thisModule(createItem("http://", { }));
			result.viewport.width.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric viewport width if \"vw\" is null", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": null }));
			result.viewport.width.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric viewport width if \"vw\" is undefined", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": undefined }));
			result.viewport.width.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric viewport width if \"vw\" is false", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": false }));
			result.viewport.width.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric viewport width if \"vw\" is true", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": true }));
			result.viewport.width.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric viewport width if \"vw\" is NaN", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": NaN }));
			result.viewport.width.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object where the passed options take precedence over .chigairc.json for \"vw\"", (async () => {
			await fs.remove(rcfile);
			await fs.writeFile(rcfile, JSON.stringify({"vw": 99}));
			let result;
			let expectation = 999;
			let item = createItem("http://",{ "vw": expectation});
			result = await thisModule(item);
			await fs.remove(rcfile);
			result.viewport.width.should.equal(expectation);
		}));

	});
});
