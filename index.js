"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.instanceOf = instanceOf;
exports.typeOf = typeOf;
exports.isNumber = isNumber;
exports.isNumeric = isNumeric;
exports.isScalar = isScalar;
exports.isFunc = isFunc;
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.isString = isString;
exports.isBool = isBool;
exports.isNull = isNull;
exports.isSymbol = isSymbol;
exports.isDOMElement = isDOMElement;
exports.isWindowElement = isWindowElement;
exports.isEmpty = isEmpty;
exports.isWeb = isWeb;
exports.isCli = isCli;
exports.type = type;
exports.toString = toString;

var baseTypeFunction = "function";
var baseTypeUndefined = "undefined";
var baseTypeString = "string";
var baseTypeNumber = "number";
var baseTypeBoolean = "boolean";
var baseTypeObject = "object";

function instanceOf(left, right) {
	if (
		right != null &&
		typeof Symbol !== baseTypeUndefined &&
		right[Symbol.hasInstance]
	) {
		return right[Symbol.hasInstance](left);
	} else {
		return left instanceof right;
	}
}

function typeOf(value) {
	if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
		typeOf = function typeOf(value) {
			return typeof value;
		};
	} else {
		typeOf = function typeOf(value) {
			return value &&
			typeof Symbol === "function" &&
			value.constructor === Symbol &&
			value !== Symbol.prototype
				? "symbol"
				: typeof value;
		};
	}
	return typeOf(value);
}

var isEvent = (typeof Event === "undefined" !== baseTypeUndefined);
var objectPrototype = Object.prototype;

var objectToString = function objectToString(value) {
	return objectPrototype.toString.call(value);
};

var objectIsObject = function objectIsObject(value) {
	return objectToString(value) === "[object Object]";
};

var browser = false,
	nodeJs = false;

try {
	browser = new Function("try{return this===window}catch(e){return false}")();
} catch (e) {
	browser =
		(typeof window) !== baseTypeUndefined && window.setTimeout === setTimeout;
}

try {
	nodeJs = new Function("try{return this===global}catch(e){return false}")();
} catch (e) {
	nodeJs = (typeof global) !== baseTypeUndefined && global.setTimeout === setTimeout;
}

if (!nodeJs && !browser) {
	nodeJs = Boolean((typeof module) !== baseTypeUndefined && module.exports);
}

var tof = typeof Node;
var isNodeNative = tof === baseTypeObject;

if (
	!isNodeNative &&
	tof === baseTypeFunction &&
	(typeof document) !== baseTypeUndefined
) {
	isNodeNative = instanceOf(document.createElement("span"), Node);
}

if (!Array.isArray) {
	Array.isArray = function(value) {
		return objectToString(value) === "[object Array]";
	};
}

function isNumber(value) {
	return typeOf(value) === baseTypeNumber && !isNaN(value) && isFinite(value);
}

function isNumeric(value) {
	var tof = typeOf(value);

	if (tof !== baseTypeNumber) {
		if (tof === baseTypeString) {
			value /= 1;
		} else {
			return false;
		}
	}

	return !isNaN(value) && isFinite(value);
}

function isScalar(value) {
	if (value == null) {
		return true;
	}

	var tof = typeOf(value);
	return (
		tof === baseTypeString || tof === baseTypeNumber || tof === baseTypeBoolean
	);
}

function isFunc(value) {
	return typeOf(value) === baseTypeFunction;
}

function isObject(value) {
	return typeOf(value) === baseTypeObject && value !== null;
}

function isPlainObject(value) {
	var objectConstructor, objectConstructorPrototype;
	return (
		isObject(value) &&
		objectIsObject(value) &&
		isFunc((objectConstructor = value.constructor)) &&
		objectIsObject(
			(objectConstructorPrototype = objectConstructor.prototype)
		) &&
		objectConstructorPrototype.hasOwnProperty("isPrototypeOf")
	);
}

function isString(value) {
	return typeOf(value) === baseTypeString;
}

function isBool(value) {
	return typeOf(value) === baseTypeBoolean;
}

function isNull(value) {
	return typeOf(value) === baseTypeUndefined || value === null;
}

function isSymbol(value) {
	return (
		typeOf(value) === "symbol" ||
		(isObject(value) && objectToString(value) === "[object Symbol]")
	);
}

function isDOMElement(object) {
	if (isNodeNative) {
		return instanceOf(object, Node) && value.nodeType === 1;
	} else if (browser) {
		return (
			objectIsObject(object) && object.nodeType === 1 && !isPlainObject(value)
		);
	} else {
		return false;
	}
}

function isWindowElement(element) {
	if (!browser) {
		return false;
	}

	if (window === element) {
		return true;
	}

	var type = objectToString(element);

	if (type === "[object Window]" || type === "[object DOMWindow]") {
		return true;
	}

	if ("self" in element) {
		var self,
			hasSelf = element.hasOwnProperty("self");

		try {
			if (hasSelf) {
				self = element.self;
			}

			delete element.self;

			if (hasSelf) {
				element.self = self;
			}
		} catch (e) {
			return true;
		}
	}

	return false;
}

function isEmpty(value) {
	if (isNull(value) || !value) {
		return true;
	}

	if (Array.isArray(value)) {
		return value.length < 1;
	}

	if (isDOMElement(value)) {
		return !!value.firstChild;
	}

	if (typeOf(value) === baseTypeObject) {
		for (var key in value) {
			if (objectPrototype.hasOwnProperty.call(value, key)) {
				return false;
			}
		}

		return true;
	}

	return false;
}

function isWeb() {
	return browser;
}

function isCli() {
	return nodeJs;
}

function type(object) {
	if (object == null) {
		return object === null ? "Null" : "Undefined";
	}

	var tof = typeOf(value);

	if (tof === baseTypeObject) {
		if (Array.isArray(object)) return "Array";
		if (instanceOf(object, Date)) return "Date";
		if (instanceOf(object, RegExp)) return "RegExp";
		if (isEvent && instanceOf(object, Event)) return "Event";
		if (isDOMElement(object)) return "Node";
		if (isWindowElement(object)) return "Window";
		tof = objectToString(object);
		if (tof === "[object HTMLCollection]" || tof === "[object NodeList]")
			return "NodeList";
		if (tof === "[object Symbol]")
			return "Symbol";

		return "Object";
	}

	if (tof === baseTypeNumber) {
		if (isNaN(object)) return "NaN";
		if (!isFinite(object)) return "Infinity";
	}

	return tof[0].toUpperCase() + tof.substr(1);
}

function toString(value) {
	var tof = typeOf(value);

	if (tof === baseTypeFunction) {
		tof = typeOf((value = value()));
	}

	if (tof === baseTypeString) {
		return value;
	}

	if (value === null || tof === baseTypeUndefined) {
		return "";
	}

	if (tof === baseTypeBoolean) {
		return value ? "1" : "0";
	}

	if (tof === baseTypeNumber) {
		return isNaN(value) || !isFinite(value) ? "" : String(value);
	}

	if (tof === baseTypeObject && isFunc(value.toString)) {
		return value + "";
	}

	return objectToString(value);
}
