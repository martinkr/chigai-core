/**
 * @module adapter/puppeteer
 * @exports an async function
 * @description
 * The puppeteet adapter.
 * This module integrates chrome's headless node API
 * It makes screenshots from the given uris and saves them as PNG files.
 * It creates the PNG used as regression item.
 * It sets the flag "screenshot" on the data-object:
 * - true if the regression item was created successfully
 * - false if the regression item was not created successfully
 *
 * "Puppeteer is a Node library which provides a high-level API to control headless Chrome over the DevTools Protocol."
 * @see https://github.com/GoogleChrome/puppeteer
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

// imports
const puppeteer = require("puppeteer");
const fs = require("fs-extra-plus");

// whoami
const currentModule = "adapter/puppeteer";

/**
 * Creates the screenshots (regression_item) for the comparison.
 * Uses https://github.com/GoogleChrome/puppeteer as headless node API
 * @async
 * @exports an async function
 * @memberof module:adapter/puppeteer
 * @param {Object} item a data-object generated by ".data-object.js"
 * @returns {Object|Error} a promise of the data-object with a new property "screenshot", "true" if the image was generated or throws an error
 */
module.exports = async (item) => {


	let browser;
	let page;
	let viewport;
	// TODO: clone item;
	if (!item.uri) {
		throw new Error(`${currentModule} missing location item.uri`);
	}

	// create viewport object
	viewport = {
		"width": !!Number(item.viewport.width) && typeof (item.viewport.width) !== "boolean" ? Number(item.viewport.width) : 1024,
		"height": !!Number(item.viewport.height) && typeof (item.viewport.height) !== "boolean" ? Number(item.viewport.height) : 786
	};

	try {
		// remove regression item beforehand
		/* istanbul ignore if */
		if (await fs.pathExists(item.regression_item) === true) {
			await fs.remove(item.regression_item);
		}

		// await fs.ensureDir(item.path);

		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport(viewport);
		await page.goto(item.uri);

		if (Number(item.wait) > 0) {
			await page.waitFor(Number(item.wait));
		}

		await page.screenshot({
			"fullPage": true,
			"path": item.regression_item
		});
		await browser.close();
		item.screenshot = true;
		return item;
	} catch (err) {
		console.log(`${currentModule} failed: Error ${err}`)
		throw new Error(`${currentModule} failed: Error ${err}`)
		// return false;
	}

};
