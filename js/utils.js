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
 * Given the defaults {a: false, b: false}
 * and the hash       "a=true&z=true",
 * this will check only those properties that are in the defaults ("a" and "b"), and
 * update any that are defined in the hash, producing {a:true, b: false} for the above.
 */
function getStateFromHashWithDefaults (hash, defaults) {
  let hashObj = getObjectFromHashParams(hash),
      ret = JSON.parse(JSON.stringify(defaults)); // deep clone
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

module.exports = {
  getObjectFromHashParams,
  getHashParamsFromObject,
  getDiffedHashParams,
  getStateFromHashWithDefaults,
  parseToPrimitive
}