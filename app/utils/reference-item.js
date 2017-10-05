/**
 * @module utils/reference-item
 * @exports an async function
 * @description
 * This module ensures the existence of a reference item.
 * It creates a new reference item for the comparison if none exists.
 * The fresh reference item is just a copy of the regression item.
 * It sets the flag "fresh" on the data-object:
 * - true if it had to create a fresh reference item
 * - false if the reference item already existed
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

// imports
const fs = require("fs-extra-plus");
const currentModule = "utils/reference-item";

/**
 * Ensures the existence of a reference item
 * @async
 * @exports an async function
 * @memberof module:utils/reference-item
 * @param {object}  with the properties "uri" the location to screenshot and "[options]" additional options, e.g. viewport sizes
 * @returns {Object} an object all necessary properties for this item
 */
module.exports = async(item) => {

	if (!item || Array.isArray(item) || typeof(item) !== "object") {
		throw new Error(`${currentModule} missing arguments`);
	}

	let regressionItemAvailable = await fs.pathExists(item.regression_item);
	if (regressionItemAvailable !== true) {
		throw new Error(`${currentModule} missing regression item ${item.regression_item}`);
	}

	let referenceItemAvailable = await fs.pathExists(item.reference_item);
	if (referenceItemAvailable !== true) {
		try {
			await fs.copy(item.regression_item, item.reference_item);
			item.fresh = true;
		} catch (error) {
			/* istanbul ignore next */
			throw new Error(`${currentModule} failed on copy ${item.regression_item} to ${item.reference_item}`);
		}
	} else {
		item.fresh = false;
	}

	return item;
}
