/**
 * @module data-object
 * @exports a sync function
 * @description
 * This moduel creates the argument "data object".
 * This module validates all properties on the "data object"
 * The object has all required properties.
 * Necesary for all downstream functions.
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

// imports
const path = require("path");
const crypto = require("crypto");
const configFile = require("./config-file.js");

// whoami
const currentModule = "data-object"

/**
 * Creates and valdiates the data object
 * @TODO: WRITE TESTS FOR PASSED OPTIONS TAKES PRECEDENCE
 * @sync
 * @exports an async function
 * @memberof module:data-object
 * @param {object}  with the properties "uri" the location to screenshot and "[options]" additional options, e.g. viewport sizes
 * @returns {Object} an object containing all necessary properties
 */
module.exports = async (object) => {

	const uri = object.uri;
	const config = await configFile();
	const options = Object.assign({}, config, object.options);

	const screenshotsPath = options.path;
	if (!uri || typeof (uri) !== "string") {
		throw new Error(`${currentModule} missing location item.uri`);
	}

	let item = { viewport: {} };
	item.uri = uri;
	// item.threshold = 0.01;
	item.threshold = !!Number(options.threshold) && typeof(options.threshold) !== "boolean" ? Number(options.threshold) : config.threshold;
	item.viewport.width = !!Number(options.vw) && typeof(options.vw) !== "boolean" ? Number(options.vw) : config.vw;
	item.viewport.height = !!Number(options.vh) && typeof(options.vh) !== "boolean" ? Number(options.vh) : config.vh;

	item.timestamp_iso = new Date(new Date().getTime()).toString();
	item.hash = crypto.createHash("sha512").update(uri + item.viewport.width + item.viewport.height).digest("hex");
	item.path = path.resolve(screenshotsPath);
	item.regression_item = path.resolve(screenshotsPath, item.hash+"_regression.png");
	item.reference_item = path.resolve(screenshotsPath, item.hash+"_reference.png");
	item.difference_item = path.resolve(screenshotsPath, item.hash + "_difference.png");
	item.match = undefined;
	item.screenshot = undefined;
	item.fresh = undefined;
	item.debug = ` ${item.uri}: vw ${item.viewport.width}, vh${item.viewport.height} => hash: ${item.hash}`;
	return item;
}
