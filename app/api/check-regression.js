/**
 * @module api/check-regression
 * @exports an async function
 * @description
 * Handles the regresion test for the provided items.
 * It ensures the arguments have the correct form.
 * It creates the data-objects.
 * It makes screenshots.
 * It ensrures that there are reference items.
 * It compares the screenshot (regression item) against the reference item.
 * It returns an array of results.
 *
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

// imports
const fs = require("fs-extra-plus");
const compare = require("./../adapter/blink-diff");
const screenshot = require("./../adapter/puppeteer");
const reference = require("./../utils/reference-item");
const toJson = require("./../utils/results-to-json");
const dataObject = require("./../utils/data-object");

// whoami
const currentModule = "api/check-regression"

/**
 * Handles the regression test for a list of items.
 * Each item requires a property "uri" and can have
 * an optional set of options.
 * @async
 * @exports an async function
 * @memberof module:api/check-regression
 * @param {Array} items an array of items with uri and options
 * @returns {Array} an array of object with the results
 */
module.exports = async (items) => {
	if (!items || Array.isArray(items) === false) {
		throw new Error(`${currentModule} missing items`);
	}

	items = await Promise.all(items.map(async (item) => {
		return await dataObject(item);
	}));

	items = await Promise.all(items.map(async (item) => {
		let screenshotItem = item;
		await fs.ensureDir(screenshotItem.path);
		screenshotItem = await screenshot(screenshotItem);
		screenshotItem = await reference(screenshotItem);
		screenshotItem = await compare(screenshotItem);
		return screenshotItem;
	}));

	try {
		await toJson.write(items);
	} catch (err) {
		/* istanbul ignore next */
		return err;
	}

	return items;
};
