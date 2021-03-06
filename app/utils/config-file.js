/**
 * @module utils/confif-file
 * @exports an async function
 * @description
 * This module checks if there's a config file
 * It provides an API for getting config options
 * and makes sure all modules can work with the options
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

// imports
const fs = require("fs-extra-plus");
const path = require("path");
const defaults = { "from": "default", "path": path.join(process.cwd(), "./screenshots") , "vw": 1024,"vh": 786, "threshold": 0.01, "wait": 0};
const rcfile = path.join(process.cwd(), ".chigairc.json");

/**
 * Loads an verifies the configuration file settings
 * @async
 * @exports an async function
 * @memberof module:utils/config-file
 * @returns {Object} an object all settings from the rc-file
 */
module.exports = async() => {
	try {
		let chigairc;
		let screenshotPath;
		chigairc = await fs.readJson(rcfile);

		// check the path
		if(chigairc.path) {
			screenshotPath = path.join(process.cwd(), chigairc.path)
		} else {
			screenshotPath = defaults.path;
		}
		await fs.ensureDir(screenshotPath);

		if (!chigairc.threshold) {
			chigairc.threshold = defaults.threshold;
		}

		if (!chigairc.wait) {
			chigairc.wait = defaults.wait;
		}

		if (!chigairc.vh) {
			chigairc.vh = defaults.vh;
		}

		if(!chigairc.vw) {
			chigairc.vw = defaults.vw;
		}

		// return options
		return {
			"from": rcfile,
			"path": screenshotPath,
			"threshold": chigairc.threshold,
			"vh": chigairc.vh,
			"vw": chigairc.vw,
			"wait": chigairc.wait
		};
	} catch (error) {
		// return defaults
		return defaults;
	}
}
