/**
 * @module utils/results-to-json
 * @exports an async function
 * @description
 * This module writes the result items to the results.json
 * in the screenshot directory of the chigai instance
 *
 * @copyright 2018 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

// imports
const fs = require("fs-extra-plus");
const path = require("path");
const dataFile = "results.json";

/**
 * Reads the file content
 * @param {String} location the file's paths
 * @return {Array} the file's content or an empty array
 */
const _getContentFromFile = async (location) => {
	let _fileContent;

	try {
		_fileContent = await fs.readJson(location);
	} catch (err) {
		_fileContent = [];
	}

	if (Array.isArray(_fileContent) === false) {
		_fileContent = [];
	}

	return _fileContent;
};

/**
 * Updates the content array received from the file.
 * Adds new items and updates existing ones.
 * @param {Array} the file's content array
 * @param {Object} the new item
 * @return {Array} the updated content array
 */
const _updateContent = (array, newItem) => {

	const _index = array.findIndex((item) => {
		return item.hash === newItem.hash && item.path === newItem.path;
	});

	if (_index === -1) {
		array.push(newItem);
	}
	else {
		array.splice(_index, 1, newItem);
	}

	return array;
};

/**
 * Writes the result items to a json file
 * @async
 * @exports an async function
 * @memberof module:utils/results-to-json
 * @returns {Object} the original result items
 */

const _write = async (data) => {

	if (Array.isArray(data) === false) {
		throw new Error();
	}

	try {
		await Promise.all(data.map(async (dataItem) => {
			let _fileContent;
			let _filePath = path.join(dataItem.path, "/", dataFile);
			try {
				await fs.ensureFile(_filePath);
				_fileContent = await _getContentFromFile(_filePath);
				_fileContent = _updateContent(_fileContent, dataItem);
				await fs.writeJson(_filePath, _fileContent);
			} catch (err) {
				/* istanbul ignore next */
				throw new Error(err);
			}
			return true;
		}));
	} catch (err) {
		/* istanbul ignore next */
		throw new Error(err);
	}

	return true;

};


module.exports.write = _write;
