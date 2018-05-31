/* eslint-env mocha */

const fs = require("fs-extra-plus");
const path = require("path");
const crypto = require("crypto");

const thisModulePath = "data-object";
const thisModule = require("./../../app/utils/" + thisModulePath);


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

		it("should return a data object with: a path for the screenshots", (async () => {
			let result;
			result = await thisModule(createItem("http://", {}));
			result.path.should.be.a("string");
		}));

		it("should return a data object with: a default path \"./screenshots\"", (async () => {
			let result;
			result = await thisModule(createItem("http://", {}));
			result.path.should.equal(path.join(process.cwd(), "./screenshots"));
		}));

		it("should return a data object with: a custom path if there's a .chigairc.json file", (async () => {
			await fs.remove(rcfile);
			await fs.writeFile(rcfile, JSON.stringify({"path": customPath}));
			let result;
			result = await thisModule(createItem("http://"));
			await fs.remove(rcfile);
			result.path.should.equal(path.resolve(customPath));
		}));

		it("should return a data object where the passed options take precedence over .chigairc.json for \"path\"", (async () => {
			await fs.remove(rcfile);
			await fs.writeFile(rcfile, JSON.stringify({"path": customPath}));
			let result;
			let expectation = "foobar"
			let item = createItem("http://",{ "path": expectation});
			result = await thisModule(item);
			await fs.remove(rcfile);
			result.path.should.equal(path.resolve(expectation));
		}));

	});
});
