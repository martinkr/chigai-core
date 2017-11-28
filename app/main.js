
/**
 * @module app/main
 * @exports an async function
 *
 * @description
 * "Chigai: css regression made simple"
 * The chigai main entry point.
 * Defines the API fo the core components
 *
 * regression: makes regression test
 * reference: sets a fresh reference
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

const regression = require("./api/check-regression.js");
const reference = require("./api/fresh-reference.js");

const API = {

	/**
	 * Handles the regression test for an item.
	 * Each item requires a property "uri" and can have
	 * an optional set of options.
	 * @async
	 * @exports an async function
	 * @memberof module:app/main
	 * @param {String} uri the uri to screenshot
	 * @param {Object} [options] additional options, vw, vh, threshold
	 * @returns {Array} an array of object with the results
	 */
	"regression": async (uri, options) => {
		if (options.d) {
			console.log(`[chigai-core] called \"regression\" on: \"${uri}\" with \"${options}\"`);
			return false;
		}
		return await regression([{ "uri": uri, "options": options }]);
	},

	/**
	 * Creates a new reference for an item.
	 * Each item requires a property "uri" and can have
	 * an optional set of options.
	 * @async
	 * @exports an async function
	 * @memberof module:app/main
	 * @param {String} uri the uri to screenshot
	 * @param {Object} [options] additional options, vw, vh, threshold
	 * @returns {Array} an array of object with the results
	 */
	"reference": async (uri, options) => {
		if (options.d) {
			console.log(`[chigai-core] called \"reference\" on: \"${uri}\" with \"${options}\"`);
			return false;
		}
		return await reference([{ "uri": uri, "options": options }]);
	}
};

module.exports = API;
