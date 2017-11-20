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
const fs = require("fs-extra-plus");
const screenshot = require("./../adapter/puppeteer");
const reference = require("./../utils/reference-item");
const dataObject = require("./../utils/data-object");

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
		await fs.ensureDir(screenshotItem.path);
		await fs.remove(screenshotItem.reference_item);
		await fs.ensureDir(screenshotItem.path);
		screenshotItem = await screenshot(screenshotItem);
		screenshotItem = await reference(screenshotItem);
		return screenshotItem;
	}));

	return items;
};
