/**
 * Creates an object given uri-encoded key-values pairs:
 * getObjectFromHashParams("a=true&b=0&c=Hello%20world")
 * => {a: true, b: 0, c: "Hello world"}
 */
function getObjectFromHashParams (str) {
  let pairs = str.split(/&/),
      ret = {};
  for (let i = 0; i < pairs.length; i++) {
    let kv = pairs[i].split(/=/);
    if (kv.length == 2) {
      ret[decodeURIComponent(kv[0])] = parseToPrimitive(decodeURIComponent(kv[1]));
    }
  }
  return ret;
}

function parseToPrimitive(value) {
  try {
    return JSON.parse(val(value));
  } catch(e){
    return val(value).toString();
  }
}

/**
 * Inverse of the above function
 */
function getHashParamsFromObject (obj) {
  let hashPartBuffer = [];
  for (let k in obj) {
    hashPartBuffer.push(encodeURIComponent(k), '=', encodeURIComponent(val(obj[k])), '&');
  }
  if (hashPartBuffer.length) {    // Remove the last '&'
    hashPartBuffer.pop();
  }
  return hashPartBuffer.join('');
}

/**
 * Given some defaults {a: false, b: false}
 * and the the state   {a: true,  b: false, c: true},
 * this will check only those properties that are in the defaults ("a" and "b"), and make
 * any that differ into a url parameter, producing "a=true" for the above.
 */
function getDiffedHashParams (state, defaults) {
  let diff = {};
  for (let k in defaults) {
    if (state.hasOwnProperty(k) && val(state[k]) !== val(defaults[k])) {
      diff[k] = state[k]
    }
  }
  return getHashParamsFromObject(diff);
}

/**
 * The authorable props all come in via the defaults
 * Compare these to the newProps to get the diff of the changes
 * Then we can export those diffs vs defaults as lightweight objects
 */
function getModelDiff(newProps, defaults) {
  // defaults are all authorable props
  // the newProps need to be compared
  let result = {};
  for (let k in newProps) {
    if (defaults.hasOwnProperty(k)) {
      // this property is authorable
      if (newProps[k].hasOwnProperty("value") && defaults[k].value != newProps[k].value) {
        result[k] = newProps[k];
      }
    }
  }
  // atom positions and velocities are handled separately
  if (newProps.atoms) {
    result.atoms = newProps.atoms;
  }
  return result;
}

/**
 * Loading a diff is more straight-forward than conversion from hash params
 * since the diff will be in json format already. Merge in the atoms separately
 * as they are rendered in the lab window directly, and not in the authoring panel
 */
function loadModelDiff(diffProps, defaults) {
  let ret = JSON.parse(JSON.stringify(defaults)); // deep clone
  for (let k in ret) {
    if (diffProps.hasOwnProperty(k)) {
      ret[k] = diffProps[k]
    }
  }
  if (diffProps.atoms) {
    ret.atoms = diffProps.atoms;
  }
  return ret;
}

/**
 * Given the defaults {a: false, b: false}
 * and the hash       "a=true&z=true",
 * this will check only those properties that are in the defaults ("a" and "b"), and
 * update any that are defined in the hash, producing {a:true, b: false} for the above.
 */
function getStateFromHashWithDefaults (hash, defaults) {
  let hashObj = getObjectFromHashParams(hash);
  let ret = JSON.parse(JSON.stringify(defaults)); // deep clone
  for (let k in ret) {
    if (hashObj.hasOwnProperty(k)) {
      if (ret[k].hasOwnProperty("value")) {
        ret[k].value = hashObj[k];
      } else {
        ret[k] = hashObj[k]
      }
    }
  }
  return ret;
}

// We can pass in either primitives or objects of form {value: val, ...}
function val(prop) {
  if (prop.hasOwnProperty("value")) {
    return prop.value;
  }
  return prop;
}

// parse URL parameters
function getURLParam(name, defaultValue = null) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return defaultValue;
  if (!results[2]) return true;
  const value = decodeURIComponent(results[2].replace(/\+/g, " "));
  return value;
}

module.exports = {
  getObjectFromHashParams,
  getHashParamsFromObject,
  getDiffedHashParams,
  getStateFromHashWithDefaults,
  parseToPrimitive,
  getURLParam,
  getModelDiff,
  loadModelDiff
}
