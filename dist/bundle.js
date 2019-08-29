'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var get = function get(object, property, defaultValue) {
  return object ? object[property] || defaultValue : defaultValue;
}; // Basic set of functions to manage the state of async actions and reducers


var isDone = function isDone(asyncStatus) {
  return get(asyncStatus, 'status') === 'DONE';
};

var getError = function getError(asyncStatus) {
  return get(asyncStatus, 'status') === 'ERROR' && get(asyncStatus, 'error', null);
};

var isLoading = function isLoading(asyncStatus) {
  return get(asyncStatus, 'status') === 'START';
};

var getPayload = function getPayload(asyncStatus) {
  return get(asyncStatus, 'payload', null);
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

/**
 * Basic async actions structure
 * @param {string} storeKey unique identifier for the store
 */

function AsyncActions(storeKey) {
  this.START = createAction("START_".concat(storeKey));
  this.DONE = createAction("DONE_".concat(storeKey));
  this.ERROR = createAction("ERROR_".concat(storeKey));
  this.RESET = createAction("RESET_".concat(storeKey));

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

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var ASYNC_INITIAL_STATE = {
  status: null,
  payload: null,
  error: null
  /**
   * Handlers for async actions
   * The reducer is used on the afected property to avoid structure changes on how the library behaves
   * Status is managed by the library and cannot be altered, but the payloads can be updated using custom
   * reducers
   */

};

var handleStart = function handleStart(reducer) {
  return function (state, action) {
    return {
      status: 'START',
      payload: reducer(state.payload, action),
      error: null
    };
  };
};

var handleDone = function handleDone(reducer) {
  return function (state, action) {
    return {
      status: 'DONE',
      payload: reducer(state.payload, action),
      error: null
    };
  };
};

var handleError = function handleError(reducer) {
  return function (state, action) {
    return {
      status: 'ERROR',
      payload: state.payload,
      error: reducer(state.error, action)
    };
  };
};

var handleReset = function handleReset(reducer) {
  return function (state, action) {
    return {
      status: null,
      payload: reducer(state.payload, action),
      error: null
    };
  };
};
/** default reducer for async handling */


var defaultReducer = function defaultReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      _ref$payload = _ref.payload,
      payload = _ref$payload === void 0 ? null : _ref$payload;

  return payload || state;
};
/**
 * Basic action handler creator for async actions
 * @param {object} actions Async actions
 */


var createActionsHandler = function createActionsHandler(actions) {
  var _ref3;

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      start = _ref2.start,
      done = _ref2.done,
      reset = _ref2.reset,
      error = _ref2.error;

  return _ref3 = {}, _defineProperty(_ref3, actions.START, handleStart(start || defaultReducer)), _defineProperty(_ref3, actions.DONE, handleDone(done || defaultReducer)), _defineProperty(_ref3, actions.ERROR, handleError(error || defaultReducer)), _defineProperty(_ref3, actions.RESET, handleReset(reset || defaultReducer)), _ref3;
};
/**
 * Create a reducer config to handle async actions
 * @param {*} asyncActions Set of actions that include every state of a fetch process
 * @param {*} asyncHandlers Set of action reducers
 * @returns {object} config to be used on a reducer
 */


var createAsyncReducerConfig = function createAsyncReducerConfig(asyncActions, asyncHandlers) {
  var config = {}; // If isnt an AsyncActions all the keys of the object are put into the main reducer

  if (AsyncActions.prototype.isPrototypeOf(asyncActions)) {
    // eslint-disable-line 
    config = createActionsHandler(asyncActions, asyncHandlers);
  } else {
    // @TODO CONTROL THAT THEY ARE NORMAL OBJECTS
    Object.keys(asyncActions).forEach(function (actionKey) {
      config = _objectSpread({}, config, createActionsHandler(asyncActions[actionKey], asyncHandlers));
    });
  }

  return config;
};
/**
 * Create a reducer function to handle async actions
 * @param {*} asyncActions Set of actions that include every state of a fetch process
 * @param {*} asyncHandlers Set of action reducers
 * @returns {function} async reducer
 */


var createAsyncReducer = function createAsyncReducer(asyncActions, asyncHandlers) {
  return createReducer(ASYNC_INITIAL_STATE, createAsyncReducerConfig(asyncActions, asyncHandlers));
};

/**
 * Gets the async state properties for connection
 * @param {object} asyncProp Async state property
 */

var getAsyncProperties = function getAsyncProperties(asyncProp) {
  return {
    payload: getPayload(asyncProp),
    loading: isLoading(asyncProp),
    done: isDone(asyncProp),
    error: getError(asyncProp)
  };
};

/**
 * Fuses in one property the given argument properties
 * @param {any} previous previous property
 * @param {any} connected connected property
 */

var fuseProps = function fuseProps(own, connected) {
  var newProp = connected;

  if (typeof own !== 'undefined') {
    newProp = {
      own: own,
      connected: connected
    };
  }

  return newProp;
};

var getAsyncKeys = function getAsyncKeys(getter) {
  return getter && _typeof(getter) === 'object' ? Object.keys(getter) : ['asyncProp'];
};

var getGetterAsyncProps = function getGetterAsyncProps(state, props) {
  var getter = props.getter;
  var newAsyncProps = {};
  getAsyncKeys(getter).forEach(function (key) {
    var newProp = getAsyncProperties(getter[key](state));
    newAsyncProps[key] = fuseProps(props[key], newProp);
  });
  return newAsyncProps;
};

exports.createAsyncActions = createAsyncActions;
exports.createAsyncReducer = createAsyncReducer;
exports.getAsyncProps = getAsyncProperties;
exports.getError = getError;
exports.getGetterAsyncProps = getGetterAsyncProps;
exports.getPayload = getPayload;
exports.isDone = isDone;
exports.isLoading = isLoading;
