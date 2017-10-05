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
let compare = require("./../adapter/blink-diff");
let screenshot = require("./../adapter/puppeteer");
let reference = require("./../utils/reference-item");
let dataObject = require("./../utils/data-object");

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

	items = items.map((item) => {
		return dataObject(item);
	});

	await Promise.all(items.map(async (item) => {
		let screenshotItem = item;
		screenshotItem = await screenshot(screenshotItem);
		screenshotItem = await reference(screenshotItem);
		screenshotItem = await compare(screenshotItem);
		return screenshotItem;
	}));

	return items;
};
