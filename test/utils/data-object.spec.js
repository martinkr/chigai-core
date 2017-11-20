/* eslint-env mocha */

const fs = require("fs-extra-plus");
const path = require("path");
const crypto = require("crypto");

const thisModulePath = "data-object";
const thisModule = require("./../../app/utils/" + thisModulePath);

/** creates a data-object as argument */
const createItem = (uri, options) => {
	let item = {}
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

		it("should return a data object with: a custom path if \"path\" is a given option", (async () => {
			let result;
			result = await thisModule(createItem("http://", {"path": "./../myscreenshots"}));
			result.path.should.equal(path.join(process.cwd(), "./../myscreenshots"));
		}));


		it("should return a data object with: a hash based on uri, vw, vh", (async () => {
			let result;
			result = await thisModule(createItem("http://", {"vw": 100, "vh": 200 }));
			result.hash.should.equal( (() => crypto.createHash("sha512").update("http://" + 100 + 200).digest("hex"))());
		}));

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
			result.threshold.should.be.a("number").and.equal(0.01);
		}));

		it("should return a data object with: a default numeric threshold width if \"threshold\" is null", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "threshold": null }));
			result.threshold.should.be.a("number").and.equal(0.01);
		}));

		it("should return a data object with: a default numeric threshold width if \"threshold\" is undefined", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "threshold": undefined }));
			result.threshold.should.be.a("number").and.equal(0.01);
		}));

		it("should return a data object with: a default numeric threshold if \"threshold\" is false", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "threshold": false }));
			result.threshold.should.be.a("number").and.equal(0.01);
		}));

		it("should return a data object with: a default numeric threshold if \"threshold\" is true", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "threshold": true }));
			result.threshold.should.be.a("number").and.equal(0.01);
		}));

		it("should return a data object with: a default numeric threshold if \"threshold\" is NaN", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "threshold": NaN }));
			result.threshold.should.be.a("number").and.equal(0.01);
		}));



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
			result.viewport.width.should.be.a("number").and.equal(1024);
		}));

		it("should return a data object with: a default numeric viewport width if \"vw\" is null", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": null }));
			result.viewport.width.should.be.a("number").and.equal(1024);
		}));

		it("should return a data object with: a default numeric viewport width if \"vw\" is undefined", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": undefined }));
			result.viewport.width.should.be.a("number").and.equal(1024);
		}));

		it("should return a data object with: a default numeric viewport width if \"vw\" is false", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": false }));
			result.viewport.width.should.be.a("number").and.equal(1024);
		}));

		it("should return a data object with: a default numeric viewport width if \"vw\" is true", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": true }));
			result.viewport.width.should.be.a("number").and.equal(1024);
		}));

		it("should return a data object with: a default numeric viewport width if \"vw\" is NaN", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vw": NaN }));
			result.viewport.width.should.be.a("number").and.equal(1024);
		}));



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
			result.viewport.height.should.be.a("number").and.equal(786);
		}));

		it("should return a data object with: a default numeric viewport height if \"vh\" is null", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": null }));
			result.viewport.height.should.be.a("number").and.equal(786);
		}));

		it("should return a data object with: a default numeric viewport height if \"vh\" is undefined", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": undefined }));
			result.viewport.height.should.be.a("number").and.equal(786);
		}));

		it("should return a data object with: a default numeric viewport height if \"vh\" is false", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": false }));
			result.viewport.height.should.be.a("number").and.equal(786);
		}));

		it("should return a data object with: a default numeric viewport height if \"vh\" is true", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": true }));
			result.viewport.height.should.be.a("number").and.equal(786);
		}));

		it("should return a data object with: a default numeric viewport height if \"vh\" is NaN", (async () => {
			let result;
			result = await thisModule(createItem("http://", { "vh": NaN }));
			result.viewport.height.should.be.a("number").and.equal(786);
		}));


	});
});
