# typeof-utility 

> Extended functions for defining and converting data types.

This library does not use dependencies.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save typeof-utility
```

## Usage

All functions

```js
import * as Utils from 'typeof-utility';
```

Or individual functions

```js
import {isString, isNumber, isNumeric} from 'typeof-utility';
```

```js
const text = "text", infinityValue = 1/0, textNumber = "1";

typeof text === "string"; // boolean -> TRUE
typeof infinityValue === "number"; // boolean -> TRUE
typeof textNumber === "number"; // boolean -> FALSE

isString(text); // boolean -> TRUE, equiv `typeof text === "string"`
isNumber(infinityValue); // boolean -> FALSE
isNumber(textNumber); // boolean -> FALSE
isNumeric(textNumber); // boolean -> TRUE
```

## Documents

| **Function** | **Description** |  
| --- | --- |
| instanceOf(left:&#160;any,&#160;right:&#160;any):&#160;boolean | Default `instanceof` wrapper. | 
| typeOf(value:&#160;any):&#160;boolean | Default `typeof` wrapper. | 
| isNumber(value:&#160;any):&#160;boolean | Value is number, not NaN and is finite. | 
| isNumeric(value:&#160;any):&#160;boolean | Value is number or a string convertible to a number, not NaN and is finite. | 
| isScalar(value:&#160;any):&#160;boolean | Value is null, undefined, string, boolean or number. | 
| isFunc(value:&#160;any):&#160;boolean | Value is function. | 
| isObject(value:&#160;any):&#160;boolean | Value is object, not null. | 
| isPlainObject(value:&#160;any):&#160;boolean | Returns true if an object was created by the Object constructor. | 
| isString(value:&#160;any):&#160;boolean | Value is string. | 
| isBool(value:&#160;any):&#160;boolean | Value is boolean. | 
| isNull(value:&#160;any):&#160;boolean | Value is null or undefined. | 
| isSymbol(value:&#160;any):&#160;boolean | Value is classified as a Symbol primitive or object. | 
| isDOMElement(value:&#160;any):&#160;boolean | Value is likely a DOM element. | 
| isWindowElement(value:&#160;any):&#160;boolean | Object is window. | 
| isEmpty(value:&#160;any):&#160;boolean | Value is an empty object, collection, map, or set. | 
| isWeb(value:&#160;any):&#160;boolean | The script works in the browser. | 
| isCli(value:&#160;any):&#160;boolean | The script is running as a CLI. | 
| type(value:&#160;any):&#160;string | Extended Value Type <br> Possible values: `Null`, `Undefined`, `Array`, `Date`, `RegExp`, `Event`, `Node`, `Window`, `NodeList`, `Object`, `Number`, `NaN`, `Infinity`, `Symbol`, `String`, `Boolean`, `Function` | 
| toString(value:&#160;any):&#160;string | Convert value to string. <br> Warning: if the value is a function, it will be called | 

### License

Copyright © 2019, [GoshaV Maniako](https://github.com/rozaverta).
Released under the [MIT License](LICENSE).