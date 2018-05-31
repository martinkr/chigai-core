/* eslint-env mocha */

const fs = require("fs-extra-plus");
const path = require("path");
const crypto = require("crypto");

const thisModulePath = "data-object";
const thisModule = require("./../../app/utils/" + thisModulePath);

const defaultValue = 786;

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

	describe("should work as expected for the option \"vh\". It", () => {

		it("should return a data object with: a numeric viewport height", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": 500 }));
			result.viewport.height.should.be.a("number");
		}));

		it("should return a data object with: a given numeric viewport height, \"vh\" ", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": 500 }));
			result.viewport.height.should.be.a("number").and.equal(500);
		}));

		it("should return a data object with: a default numeric viewport height if no \"vh\" is given", (async () => {
			let result;
			result = await thisModule(createItem("http://", { }));
			result.viewport.height.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric viewport height if \"vh\" is null", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": null }));
			result.viewport.height.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric viewport height if \"vh\" is undefined", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": undefined }));
			result.viewport.height.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric viewport height if \"vh\" is false", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": false }));
			result.viewport.height.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric viewport height if \"vh\" is true", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": true }));
			result.viewport.height.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object with: a default numeric viewport height if \"vh\" is NaN", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": NaN }));
			result.viewport.height.should.be.a("number").and.equal(defaultValue);
		}));

		it("should return a data object where the passed options take precedence over .chigairc.json for \"vh\"", (async () => {
			await fs.remove(rcfile);
			await fs.writeFile(rcfile, JSON.stringify({"vh": 99}));
			let result;
			let expectation = 999;
			let item = createItem("http://",{ "vh": expectation});
			result = await thisModule(item);
			await fs.remove(rcfile);
			result.viewport.height.should.equal(expectation);
		}));


	});
});
