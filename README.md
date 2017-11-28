# chigai-core [![Build Status](https://travis-ci.org/martinkr/chigai-core.svg?branch=master)](https://travis-ci.org/martinkr/chigai-core)
Modern visual regression testing with ```puppeteer``` and ```blink-diff```

## Visual regression testing
Visual regression testing: compare your current state against your baseline.
It's nothing new. We've done this for ages. Comparing two images. Looking at the current version and the previous one. Searching for the difference. On our own. Manually.

Well, Chiagi does this automatically. It takes a screenshot from a given URI and compares it to the previous version.

## Automated. Always
Chigai is designed to be used in your tests. You can use it in your favourite testrunner. As a regression tool. If your layout changes, it won't go on unnoticed.

## How to use this?
Chigai-Core provides the core functionalities: The regression testing of a given url and creating a fresh reference item beforehand.
Chigai-core is not meant to be used directly. Use the CLI or the API modules. They provide a clean facade for the core functions.

## Regression testing
Provide a url and options such as the viewport width (default: 1024), viewport height (default: 720) or a threshold (default: 0.01 = 1%) for the image comparison. Chigai-core creates a new screenshot of the whole page and compares it to the last specified reference. If their difference is lower than the given threshold, ```match```will be ```true```. Otherwise, ```match``` becomes ```false```.

Chigai creates a unique identifier from the url, the viewport size and the timeout.

## API

Chigai-Core provides two public APIs:

### ```regression(uri, options)```
Handles the regression test for an items. Each item requires a property "uri" and can have an optional set of options. It returns an ```async``` function and finaly a return object.

### ```reference(uri, options)```
Creates a new reference for an item. Each item requires a property "uri" and can have an optional set of options. It returns an ```async``` function and finaly a return object.

### Configuration options
Options can either be passed as arguments per call or globally  via .chigairs.json file. The options-object takes precedence.

#### ```vw```
Default: ```1024```. The with of the viewport you cant to screenshot. This will be part of the unique identifier.
#### ```vh```
Default: ```786```. The height of the viewport you cant to screenshot. This will be part of the unique identifier.

#### ```threshold```
Default: ```0.01```. The threshold to use for the comparison. This will not be part of the unique identifier.

#### ```path```
Default: ```./screenshots``` There's the possiblitly to pass a custom path to chigai. It's relative to your working directory.
Use this to share your reference items (e.g. via source control, rsync ...).

#### ```wait```
Default: ```0```. Wait this amount of miliseconds after the page's ```load-event``` before making the screenshot. This will not be part of the unique identifier.

#### .chigai.json
You can store project wide setttings in this file. It takes the same key-value-pairs as the options-object. Plus an additional ```path``` property.


```JavaScript
{
	"path" : "./myscreenshots",
	"threshold": 0.5,
	"vw": 1200,
	"vh" : 800,
	"wait": 5000
}
```

### Return Object
Each API returns an object with the following properties:

#### ```viewport```
An object with two properties, ```width``` and ```height```, indicating the viewport size of the screenshot.
#### ```uri```
 The screnshotted location
#### ```threshold```
 The threshold used for the comparison
#### ```wait```
 The delay between ```load``` and screenshotting
#### ```path```
 The path to the screenshots
#### ```timestamp_iso```
 An ISO-Timestamp of the screenshot
#### ```hash```
 The unique identifier of this screenshot. Based on the `uri`, `viewport width`, `viewport height` and `wait`
#### ```regression_item```
 The path to the regression item. The latest screenshot of this location.
#### ```reference_item```
 The path to the reference item. The reference screenshot of this location.
#### ```difference_item```
 The path to an image showing the difference between the reference and the regression item.
#### ```match```
 Boolean, true if the difference is below the threshold, aka "success".
#### ```screenshot```
 Boolean, true if the screenshotting of the current location was successful.
#### ```fresh```
 Boolean, true if this pass resulted in a fresh reference item: none available or forced.


## Fresh reference
If you know you changed the layout, just set a new reference item before running the tests again.

## Installation
```$ yarn add chigai-core```

## Example
Chigai-core is not meant to be used directly. Use the CLI or the API modules. They provide a clean facade for the core functions.

## Tech Stack
- ECMAScript 2018 on ```nodejs v8.5.0```
- ```blink-diff v1.0.1```
- ```fs-extra-plus v0.1.3```
- ```puppeteer v0.11.0```
- 100% code coverage using ```mocha v3.5.2```, ```chai v4.1.2``` and ```nyc v11.2.1```,

## Resources
- [GoogleChrome/puppeteer - Headless Chrome Node API](https://github.com/GoogleChrome/puppeteer)
- [yahoo/blink-diff - A lightweight image comparison tool](https://github.com/yahoo/blink-diff)

## License
Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).

Copyright (c) 2016, 2017 Martin Krause <github@mkrause.info> [http://martinkr.github.io)](http://martinkr.github.io)
