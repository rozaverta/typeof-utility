const baseTypeFunction = 'function';
const baseTypeUndefined = 'undefined';
const baseTypeString = 'string';
const baseTypeNumber = 'number';
const baseTypeBoolean = 'boolean';
const baseTypeObject = 'object';

/**
 * Default `instanceof` wrapper.
 *
 * @param {*} left
 * @param {*} right
 * @returns {boolean}
 */
export function instanceOf(left, right) {
	return left instanceof right;
}

/**
 * Default `typeof` wrapper.
 *
 * @param {*} value
 * @returns {"undefined"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"}
 */
export function typeOf(value) {
	return typeof value;
}

const isEvent = typeof Event !== 'undefined';
const objectPrototype = Object.prototype;
const objectToString = value => objectPrototype.toString.call(value);
const objectIsObject = value => objectToString(value) === '[object Object]';

let browser = false, nodeJs = false;

try {
	browser = (new Function("try{return this===window}catch(e){return false}"))();
} catch (e) {
	browser = typeof window !== 'undefined' && window.setTimeout === setTimeout;
}

try {
	nodeJs = (new Function("try{return this===global}catch(e){return false}"))();
} catch (e) {
	nodeJs = typeof global !== 'undefined' && global.setTimeout === setTimeout;
}

if (!nodeJs && !browser) {
	nodeJs = Boolean(typeof module !== 'undefined' && module.exports)
}

let tof = typeof Node;
let isNodeNative = tof === baseTypeObject;

if (!isNodeNative && tof === baseTypeFunction && typeof document !== 'undefined') {
	isNodeNative = instanceOf(document.createElement("span"), Node);
}

if (!Array.isArray) {
	Array.isArray = value => objectToString(value) === '[object Array]';
}

/**
 * Value is number, not NaN and is finite.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isNumber(value) {
	return typeOf(value) === baseTypeNumber && !isNaN(value) && isFinite(value);
}

/**
 * Value is number or a string convertible to a number, not NaN and is finite.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isNumeric(value) {
	let tof = typeOf(value);

	if (tof !== baseTypeNumber) {
		if (tof === baseTypeString) {
			value /= 1;
		} else {
			return false
		}
	}

	return !isNaN(value) && isFinite(value)
}

/**
 * Value is null, undefined, string, boolean or number.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isScalar(value) {
	if (value == null) {
		return true
	}

	let tof = typeOf(value);
	return tof === baseTypeString || tof === baseTypeNumber || tof === baseTypeBoolean;
}

/**
 * Value is function.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isFunc(value) {
	return typeOf(value) === baseTypeFunction
}

/**
 * Value is object, not null.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isObject(value) {
	return typeOf(value) === baseTypeObject && value !== null
}

/**
 * Returns true if an object was created by the Object constructor.
 *
 * @author Jon Schlinkert <https://github.com/jonschlinkert>
 * @param {*} value
 * @returns {boolean}
 */
export function isPlainObject(value) {
	let objectConstructor, objectConstructorPrototype;
	return isObject(value)
		&& objectIsObject(value)
		&& isFunc(objectConstructor = value.constructor)
		&& objectIsObject(objectConstructorPrototype = objectConstructor.prototype)
		&& objectConstructorPrototype.hasOwnProperty('isPrototypeOf');
}

/**
 * Value is string.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isString(value) {
	return typeOf(value) === baseTypeString
}

/**
 * Value is boolean.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isBool(value) {
	return typeOf(value) === baseTypeBoolean
}

/**
 * Value is null or undefined.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isNull(value) {
	return typeOf(value) === baseTypeUndefined || value === null
}

/**
 * Value is classified as a Symbol primitive or object.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isSymbol(value) {
	return typeOf(value) === 'symbol' || (isObject(value) && objectToString(value) === '[object Symbol]');
}

/**
 * Value is likely a DOM element.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isDOMElement(value) {
	if (isNodeNative) {
		return instanceOf(value, Node) && value.nodeType === 1
	} else if (browser) {
		return objectIsObject(value) && value.nodeType === 1 && !isPlainObject(value)
	} else {
		return false
	}
}

/**
 * Object is window.
 *
 * @param {*} element
 * @returns {boolean}
 */
export function isWindowElement(element) {
	if (!browser) {
		return false
	}

	if (window === element) {
		return true
	}

	let type = objectToString(element);
	if (type === "[object Window]" || type === "[object DOMWindow]") {
		return true
	}

	if ('self' in element) {
		//`'self' in element` is true if
		//the property exists on the object _or_ the prototype
		//`element.hasOwnProperty('self')` is true only if
		//the property exists on the object
		let self, hasSelf = element.hasOwnProperty('self');

		try {
			if (hasSelf) {
				self = element.self;
			}
			delete element.self;
			if (hasSelf) {
				element.self = self;
			}
		} catch (e) {
			//IE 7&8 throw an error when window.self is deleted
			return true;
		}
	}

	return false
}

/**
 * Value is an empty object, collection, map, or set.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isEmpty(value) {
	if (isNull(value) || !value) {
		return true
	}
	if (Array.isArray(value)) {
		return value.length < 1
	}
	if (isDOMElement(value)) {
		return !!value.firstChild
	}
	if (typeOf(value) === baseTypeObject) {
		for (const key in value) {
			if (objectPrototype.hasOwnProperty.call(value, key)) {
				return false;
			}
		}
		return true
	}
	return false
}

/**
 * The script works in the browser.
 *
 * @returns {boolean}
 */
export function isWeb() {
	return browser
}

/**
 * The script is running as a CLI.
 *
 * @returns {boolean}
 */
export function isCli() {
	return nodeJs
}

/**
 * Extended Value Type
 *
 * Possible values:
 * Null, Undefined, Array, Date, RegExp, Event, Node, Window, NodeList, Object,
 * Number, NaN, Infinity, Symbol, String, Boolean, Function
 *
 * @param {*} value
 * @returns {string}
 */
export function type(value) {
	if (value == null) {
		return value === null ? 'Null' : 'Undefined'
	}

	let tof = typeOf(value);

	if (tof === baseTypeObject) {
		if (Array.isArray(value)) return 'Array';
		if (instanceOf(value, Date)) return 'Date';
		if (instanceOf(value, RegExp)) return 'RegExp';
		if (isEvent && instanceOf(value, Event)) return 'Event';
		if (isDOMElement(value)) return 'Node';
		if (isWindowElement(value)) return 'Window';

		tof = objectToString(value);
		if (tof === '[object HTMLCollection]' || tof === '[object NodeList]') return 'NodeList';
		if (tof === '[object Symbol]') return 'Symbol';

		return 'Object'
	}

	if (tof === baseTypeNumber) {
		if (isNaN(value)) return 'NaN';
		if (!isFinite(value)) return 'Infinity'
	}

	return tof[0].toUpperCase() + tof.substr(1);
}

/**
 * Convert value to string.
 * Warning: if the value is a function, it will be called
 *
 * @param {*} value
 * @returns {string}
 */
export function toString(value) {
	let tof = typeOf(value);

	if (tof === baseTypeFunction) {
		tof = typeOf(value = value())
	}

	if (tof === baseTypeString) {
		return value
	}

	if (value === null || tof === baseTypeUndefined) {
		return '';
	}

	if (tof === baseTypeBoolean) {
		return value ? '1' : '0';
	}

	if (tof === baseTypeNumber) {
		return isNaN(value) || !isFinite(value) ? '' : String(value);
	}

	if (tof === baseTypeObject && isFunc(value.toString)) {
		return value + "";
	}

	return objectToString(value);
}