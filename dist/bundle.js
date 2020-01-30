'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var INITIAL = null;
var STARTED = 'STARTED';
var DONE = 'DONE';
var ERROR = 'ERROR';
var CANCELLED = 'CANCELLED';
var START_ACTION = 'start';
var PROGRESS_ACTION = 'progress';
var DONE_ACTION = 'done';
var ERROR_ACTION = 'error';
var CANCEL_ACTION = 'cancel';
var RESET_ACTION = 'reset';
var AVAILABLE_ACTIONS = [START_ACTION, PROGRESS_ACTION, DONE_ACTION, ERROR_ACTION, CANCEL_ACTION, RESET_ACTION];

var get = function get(object, property, defaultValue) {
  return object ? object[property] || defaultValue : defaultValue;
}; // Basic set of functions to manage the state of async actions and reducers


var isLoading = function isLoading(asyncStatus) {
  return get(asyncStatus, 'status') === STARTED;
};

var isDone = function isDone(asyncStatus) {
  return get(asyncStatus, 'status') === DONE;
};

var hasError = function hasError(asyncStatus) {
  return get(asyncStatus, 'status') === ERROR;
};

var isCancelled = function isCancelled(asyncStatus) {
  return get(asyncStatus, 'status') === CANCELLED;
};

var getError = function getError(asyncStatus) {
  return get(asyncStatus, 'error', null);
};

var getPayload = function getPayload(asyncStatus) {
  return get(asyncStatus, 'payload', null);
};

var getStateShape = function getStateShape() {
  var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL;
  var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return {
    status: status,
    payload: payload,
    error: error
  };
};
/**
 * Basic action structure
 * @param {string} type unique identifier for the store
 * @return {funtion} action creator that returns an object with type and payload
 */


function Action(type) {
  return function () {
    var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    return {
      type: type,
      payload: payload
    };
  };
}

var createAction = function createAction(type) {
  var action = new Action(type);

  action.toString = function () {
    return type;
  };

  action.type = type;
  return action;
};

var createReducer = function createReducer(initialState, actionMap) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return typeof actionMap[action.type] === 'function' ? actionMap[action.type](state, action) : state;
  };
};

function getAsyncKeys(storeKey) {
  return AVAILABLE_ACTIONS.reduce(function (keys, key) {
    keys[key] = "".concat(key.toUpperCase(), "_").concat(storeKey);
    return keys;
  }, {});
}
/**
 * Basic async actions structure
 * @param {string} storeKey unique identifier for the store
 */


function AsyncActions(storeKey) {
  var _this = this;

  var asyncKeys = getAsyncKeys(storeKey);
  AVAILABLE_ACTIONS.forEach(function (key) {
    _this[key] = createAction(asyncKeys[key]);
  });

  this.toString = function () {
    return storeKey;
  };
}
/**
 * Create a set of basic async actions using a unique identifier
 * @param {string} storeKey unique identifier for the store
 */


var createAsyncActions = function createAsyncActions(storeKey) {
  return new AsyncActions(storeKey);
};
/**
 * Checks if the given object is an instance of async actions
 * @param {*} action Object to be checked
 * @returns {Boolean}
 */


var isAsyncActions = function isAsyncActions(action) {
  return AsyncActions.prototype.isPrototypeOf(action);
}; // eslint-disable-line

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/** default reducer for async handling */

var defaultReducer = function defaultReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$payload = _ref.payload,
      payload = _ref$payload === void 0 ? null : _ref$payload;

  return payload || state;
};

var initialValueReducer = function initialValueReducer(initialValue) {
  return function () {
    return initialValue || null;
  };
};

var nullifierReducer = function nullifierReducer() {
  return null;
};
/**
 * Async node reducer builder
 * @param {String*} status Desired status on the final node
 * @param {*} payloadReducer Payload reducer
 * @param {*} errorReducer Error reducer
 * @returns {function} Reducer
 */


var getAsyncNodeReducer = function getAsyncNodeReducer() {
  var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL;
  var payloadReducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultReducer;
  var errorReducer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultReducer;
  return function (state, action) {
    return {
      status: status,
      payload: payloadReducer(state.payload, action),
      error: errorReducer(state.error, action)
    };
  };
};
/**
 * Checks the config properties
 * @param {*} config
 */


var checkProps = function checkProps(config) {
  var keys = Object.keys(config);
  return !!keys.length && Object.keys(config).every(function (key) {
    return AVAILABLE_ACTIONS.includes(key) && typeof config[key] === 'function';
  });
};
/**
 * Checks if the object has a shape that can be used to build the reducers
 * @param {*} config Property to be checked
 */


var isValidConfig = function isValidConfig(config) {
  // At least one of the properties is present AND is a function
  return config instanceof Object ? checkProps(config) : false;
};
/**
 * Handlers for async actions
 * The reducer is used on the afected property to avoid structure changes on how the library behaves
 * Status is managed by the library and cannot be altered, but the payloads can be updated using custom
 * reducers
 */


var handleStart = function handleStart(payloadReducer) {
  var errorReducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nullifierReducer;
  return getAsyncNodeReducer(STARTED, payloadReducer, errorReducer);
};

var handleProgress = function handleProgress(payloadReducer) {
  var errorReducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nullifierReducer;
  return getAsyncNodeReducer(STARTED, payloadReducer, errorReducer);
};

var handleDone = function handleDone(payloadReducer) {
  var errorReducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nullifierReducer;
  return getAsyncNodeReducer(DONE, payloadReducer, errorReducer);
};

var handleError = function handleError() {
  var payloadReducer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : nullifierReducer;
  var errorReducer = arguments.length > 1 ? arguments[1] : undefined;
  return getAsyncNodeReducer(ERROR, payloadReducer, errorReducer);
};

var handleCancel = function handleCancel() {
  var payloadReducer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : nullifierReducer;
  var errorReducer = arguments.length > 1 ? arguments[1] : undefined;
  return getAsyncNodeReducer(CANCELLED, payloadReducer, errorReducer);
}; // @TODO to initial value??


var handleReset = function handleReset(initialPayload) {
  return function () {
    var payloadReducer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialValueReducer(initialPayload);
    var errorReducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nullifierReducer;
    return getAsyncNodeReducer(INITIAL, payloadReducer, errorReducer);
  };
};
/**
 * Basic action handler creator for async actions
 * @param {object} actions Async actions
 * @param {object} payloadReducers Object with a key for every reducer on every state
 * @param {object} errorReducers Object with a key for every reducer on every state
 */


var createActionsHandler = function createActionsHandler(initialPayload, actions) {
  var _ref2;

  var payloadReducers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var errorReducers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return _ref2 = {}, _defineProperty(_ref2, actions.start, handleStart(payloadReducers.start, errorReducers.start)), _defineProperty(_ref2, actions.progress, handleProgress(payloadReducers.progress, errorReducers.flush)), _defineProperty(_ref2, actions.done, handleDone(payloadReducers.done, errorReducers.done)), _defineProperty(_ref2, actions.error, handleError(payloadReducers.error, errorReducers.error)), _defineProperty(_ref2, actions.cancel, handleCancel(payloadReducers.cancel, errorReducers.cancel)), _defineProperty(_ref2, actions.reset, handleReset(initialPayload)(payloadReducers.reset, errorReducers.reset)), _ref2;
};
/**
 * Formats an individual handler to shape it to asyncActionKey => object => reducers
 * @param {Object} handler Any object containing the key that are either asyncActionObjects or objects with the reducer hooks
 */


var formatHandler = function formatHandler(handler) {
  var formatted = {};

  if (handler) {
    if (isAsyncActions(handler)) {
      formatted = _defineProperty({}, handler, {});
    } else if (_typeof(handler) === 'object') {
      formatted = Object.keys(handler).reduce(function (current, prop) {
        if (isAsyncActions(handler[prop])) {
          current[handler[prop]] = {};
        } else if (isValidConfig(handler[prop])) {
          current[prop] = handler[prop];
        } else {
          throw new Error("\n            The handler must be an AsyncAction or a config object for with one of the async hooks properties:\n            ".concat(AVAILABLE_ACTIONS.join(), "\n          "));
        }

        return current;
      }, {});
    } else {
      throw new Error('The handler must be an object with async actions/objects or async actions objects');
    }
  } else {
    throw new Error('The handler must be defined');
  }

  return formatted;
};
/**
 * Given a set of objects as arguments, each one of those containing the async key identifiers, merges them all and eliminates
 * repeated ones
 * @param  {Object} payload Payload handlers with reducers
 * @param  {Object} error Error handlers with reducers
 * @return {Array} Handler keys merged without repetition
 */


var mergeHandlers = function mergeHandlers(payload, error) {
  var handlers = new Set(Object.keys(payload).concat(Object.keys(error)));
  return _toConsumableArray(handlers);
};
/**
 * Create a reducer config to handle async actions
 * @param {*} payloadHandlers Set of actions that include every state of a fetch process
 * @param {*} errorHandlers Set of actions that include every state of a fetch process
 * @returns {object} config to be used on a reducer
 */


var createAsyncReducerConfig = function createAsyncReducerConfig(initialPayload, payloadHandlers) {
  var errorHandlers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var formattedPayloadHandlers = formatHandler(payloadHandlers);
  var formattedErrorHandlers = formatHandler(errorHandlers);
  return mergeHandlers(formattedPayloadHandlers, formattedErrorHandlers).reduce(function (config, asyncKey) {
    var payloadHandler = formattedPayloadHandlers[asyncKey];
    var errorHandler = formattedErrorHandlers[asyncKey];
    return _objectSpread2({}, config, {}, createActionsHandler(initialPayload, getAsyncKeys(asyncKey), payloadHandler, errorHandler));
  }, {});
};
/**
 * Create a reducer function to handle async actions
 * @param {*} intiialPayload Initial value of the payload, preferrably serializable
 * @param {Function} payloadReducer Function used to reduce the payload on the different states
 * @param {Function} errorReducerConfig Function used to reduce the error on the different states
 */


var createAsyncReducer = function createAsyncReducer(initialPayload, payloadHandlers, errorHandlers) {
  return createReducer(getStateShape(INITIAL, initialPayload, null), createAsyncReducerConfig(initialPayload, payloadHandlers, errorHandlers));
};

/**
 * Gets the async state status properties for connection
 * @param {object} asyncProp Async state property
 */

var getAsyncStatus = function getAsyncStatus(asyncProp) {
  return {
    loading: isLoading(asyncProp),
    done: isDone(asyncProp),
    cancel: isCancelled(asyncProp),
    error: hasError(asyncProp)
  };
};
/**
 * Gets the async state properties for connection
 * @param {object} asyncProp Async state property
 */


var getAsyncProperties = function getAsyncProperties(asyncProp) {
  return {
    status: getAsyncStatus(asyncProp),
    payload: getPayload(asyncProp),
    error: getError(asyncProp)
  };
};

exports.createAsyncActions = createAsyncActions;
exports.createAsyncReducer = createAsyncReducer;
exports.getAsyncProps = getAsyncProperties;
exports.getError = getError;
exports.getPayload = getPayload;
exports.hasError = hasError;
exports.isCancelled = isCancelled;
exports.isDone = isDone;
exports.isLoading = isLoading;
