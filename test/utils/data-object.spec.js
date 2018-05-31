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

	describe("should rely on all arguments and handle all errors", () => {

		it("should throw if there's no first argument (location)", (async() => {
			try {
				await thisModule(createItem(null, {}));
			} catch (error) {
				return  error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should throw if the first argument is not a string", (async () => {
			try {
				await thisModule(createItem([], {}));
			} catch (error) {
				return  error.should.be.an.instanceof(Error);
			}
			throw new Error("should throw");
		}));

		it("should use a default value for \"options\" if there's no second argument", (async() => {
			let result;
			result = await thisModule(createItem("http://"));
			result.should.be.an("object");
		}));


	});

	describe("should work as expected", () => {

		it("should return an object", (async() => {
			let result;
			result = await thisModule(createItem("http://", {}));
			result.should.be.an("object");
		}));


		it("should return a data object with: an uri", (async() => {
			let result;
			result = await thisModule(createItem("http://", {}));
			result.uri.should.be.a("string");
		}));

		it("should return a data object with: a timestamp_iso", (async () => {
			let result;
			result = await thisModule(createItem("http://", {}));
			result.timestamp_iso.should.be.a("string");
		}));

		it("should return a data object with: a hash", (async () => {
			let result;
			result = await thisModule(createItem("http://", {}));
			result.hash.should.be.a("string");
		}));

		it("should return a data object with: a hash based on uri, vw, vh", (async () => {
			let result;
			result = await thisModule(createItem("http://", {"vw": 100, "vh": 200, "wait": 100 }));
			result.hash.should.equal( (() => crypto.createHash("sha512").update("http://" + 100 + 200 + 100).digest("hex"))());
		}));

		it("should return a data object with: a path for the screenshots", (async () => {
			let result;
			result = await thisModule(createItem("http://", {}));
			result.path.should.be.a("string");
		}));

		it("should return a data object with: a numeric threshold", (async () => {
			let result;
			result = await thisModule(createItem("http://", {}));
			result.threshold.should.be.a("number");
		}));

		it("should return a data object with: a numeric viewport width", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": 500 }));
			result.viewport.width.should.be.a("number");
		}));

		it("should return a data object with: a numeric viewport height", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": 500 }));
			result.viewport.height.should.be.a("number");
		}));


	});
});
