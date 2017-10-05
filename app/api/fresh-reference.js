/**
 * @module api/fresh-reference
 * @exports an async function
 * @description
 * Creates a fresh reference for a given set of items.
 * It ensures the arguments have the correct form.
 * It creates the data-objects.
 * It removes the current reference item.
 * It creates a new screenshot (regression item).
 * It sets the freshly created screenshot as regression item.
 * It sets the "fresh" flag to true.
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

// imports
let fs = require("fs-extra-plus");
let screenshot = require("./../adapter/puppeteer");
let reference = require("./../utils/reference-item");
let dataObject = require("./../utils/data-object");

// whoami
const currentModule = "api/fresh-reference";

/**
 * Handles the regression test for a list of items.
 * Each item requires a property "uri" and can have
 * an optional set of options.
 * @async
 * @exports an async function
 * @memberof module:api/fresh-reference
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
		await fs.remove(screenshotItem.reference_item);
		screenshotItem = await screenshot(screenshotItem);
		screenshotItem = await reference(screenshotItem);
		return screenshotItem;
	}));

	return items;
};
