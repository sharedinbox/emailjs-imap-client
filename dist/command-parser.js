"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAPPEND = parseAPPEND;
exports.parseBODYSTRUCTURE = parseBODYSTRUCTURE;
exports.parseCOPY = parseCOPY;
exports.parseENVELOPE = parseENVELOPE;
exports.parseFETCH = parseFETCH;
exports.parseNAMESPACE = parseNAMESPACE;
exports.parseNAMESPACEElement = parseNAMESPACEElement;
exports.parseSEARCH = parseSEARCH;
exports.parseSELECT = parseSELECT;
var _emailjsAddressparser = _interopRequireDefault(require("emailjs-addressparser"));
var _emailjsImapHandler = require("emailjs-imap-handler");
var _ramda = require("ramda");
var _emailjsMimeCodec = require("emailjs-mime-codec");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Parses NAMESPACE response
 *
 * @param {Object} response
 * @return {Object} Namespaces object
 */
function parseNAMESPACE(response) {
  if (!response.payload || !response.payload.NAMESPACE || !response.payload.NAMESPACE.length) {
    return false;
  }
  const attributes = [].concat(response.payload.NAMESPACE.pop().attributes || []);
  if (!attributes.length) {
    return false;
  }
  return {
    personal: parseNAMESPACEElement(attributes[0]),
    users: parseNAMESPACEElement(attributes[1]),
    shared: parseNAMESPACEElement(attributes[2])
  };
}

/**
 * Parses a NAMESPACE element
 *
 * @param {Object} element
 * @return {Object} Namespaces element object
 */
function parseNAMESPACEElement(element) {
  if (!element) {
    return false;
  }
  element = [].concat(element || []);
  return element.map(ns => {
    if (!ns || !ns.length) {
      return false;
    }
    return {
      prefix: ns[0].value,
      delimiter: ns[1] && ns[1].value // The delimiter can legally be NIL which maps to null
    };
  });
}

/**
 * Parses SELECT response
 *
 * @param {Object} response
 * @return {Object} Mailbox information object
 */
function parseSELECT(response) {
  if (!response || !response.payload) {
    return;
  }
  const mailbox = {
    readOnly: response.code === 'READ-ONLY'
  };
  const existsResponse = response.payload.EXISTS && response.payload.EXISTS.pop();
  const flagsResponse = response.payload.FLAGS && response.payload.FLAGS.pop();
  const okResponse = response.payload.OK;
  if (existsResponse) {
    mailbox.exists = existsResponse.nr || 0;
  }
  if (flagsResponse && flagsResponse.attributes && flagsResponse.attributes.length) {
    mailbox.flags = flagsResponse.attributes[0].map(flag => (flag.value || '').toString().trim());
  }
  [].concat(okResponse || []).forEach(ok => {
    switch (ok && ok.code) {
      case 'PERMANENTFLAGS':
        mailbox.permanentFlags = [].concat(ok.permanentflags || []);
        break;
      case 'UIDVALIDITY':
        mailbox.uidValidity = Number(ok.uidvalidity) || 0;
        break;
      case 'UIDNEXT':
        mailbox.uidNext = Number(ok.uidnext) || 0;
        break;
      case 'HIGHESTMODSEQ':
        mailbox.highestModseq = ok.highestmodseq || '0'; // keep 64bit uint as a string
        break;
      case 'NOMODSEQ':
        mailbox.noModseq = true;
        break;
    }
  });
  return mailbox;
}

/**
 * Parses message envelope from FETCH response. All keys in the resulting
 * object are lowercase. Address fields are all arrays with {name:, address:}
 * structured values. Unicode strings are automatically decoded.
 *
 * @param {Array} value Envelope array
 * @param {Object} Envelope object
 */
function parseENVELOPE(value) {
  const envelope = {};
  if (value[0] && value[0].value) {
    envelope.date = value[0].value;
  }
  if (value[1] && value[1].value) {
    envelope.subject = (0, _emailjsMimeCodec.mimeWordsDecode)(value[1] && value[1].value);
  }
  if (value[2] && value[2].length) {
    envelope.from = processAddresses(value[2]);
  }
  if (value[3] && value[3].length) {
    envelope.sender = processAddresses(value[3]);
  }
  if (value[4] && value[4].length) {
    envelope['reply-to'] = processAddresses(value[4]);
  }
  if (value[5] && value[5].length) {
    envelope.to = processAddresses(value[5]);
  }
  if (value[6] && value[6].length) {
    envelope.cc = processAddresses(value[6]);
  }
  if (value[7] && value[7].length) {
    envelope.bcc = processAddresses(value[7]);
  }
  if (value[8] && value[8].value) {
    envelope['in-reply-to'] = value[8].value;
  }
  if (value[9] && value[9].value) {
    envelope['message-id'] = value[9].value;
  }
  return envelope;
}

/*
 * ENVELOPE lists addresses as [name-part, source-route, username, hostname]
 * where source-route is not used anymore and can be ignored.
 * To get comparable results with other parts of the email.js stack
 * browserbox feeds the parsed address values from ENVELOPE
 * to addressparser and uses resulting values instead of the
 * pre-parsed addresses
 */
function processAddresses(list = []) {
  return list.map(addr => {
    const name = (0, _ramda.pathOr)('', ['0', 'value'], addr).trim();
    const address = (0, _ramda.pathOr)('', ['2', 'value'], addr) + '@' + (0, _ramda.pathOr)('', ['3', 'value'], addr);
    const formatted = name ? encodeAddressName(name) + ' <' + address + '>' : address;
    const parsed = (0, _emailjsAddressparser.default)(formatted).shift(); // there should be just a single address
    parsed.name = (0, _emailjsMimeCodec.mimeWordsDecode)(parsed.name);
    return parsed;
  });
}

/**
 * If needed, encloses with quotes or mime encodes the name part of an e-mail address
 *
 * @param {String} name Name part of an address
 * @returns {String} Mime word encoded or quoted string
 */
function encodeAddressName(name) {
  if (!/^[\w ']*$/.test(name)) {
    if (/^[\x20-\x7e]*$/.test(name)) {
      return JSON.stringify(name);
    } else {
      return (0, _emailjsMimeCodec.mimeWordEncode)(name, 'Q', 52);
    }
  }
  return name;
}

/**
 * Parses message body structure from FETCH response.
 *
 * @param {Array} value BODYSTRUCTURE array
 * @param {Object} Envelope object
 */
function parseBODYSTRUCTURE(node, path = []) {
  const curNode = {};
  let i = 0;
  let part = 0;
  if (path.length) {
    curNode.part = path.join('.');
  }

  // multipart
  if (Array.isArray(node[0])) {
    curNode.childNodes = [];
    while (Array.isArray(node[i])) {
      curNode.childNodes.push(parseBODYSTRUCTURE(node[i], path.concat(++part)));
      i++;
    }

    // multipart type
    curNode.type = 'multipart/' + ((node[i++] || {}).value || '').toString().toLowerCase();

    // extension data (not available for BODY requests)

    // body parameter parenthesized list
    if (i < node.length - 1) {
      if (node[i]) {
        curNode.parameters = attributesToObject(node[i]);
      }
      i++;
    }
  } else {
    // content type
    curNode.type = [((node[i++] || {}).value || '').toString().toLowerCase(), ((node[i++] || {}).value || '').toString().toLowerCase()].join('/');

    // body parameter parenthesized list
    if (node[i]) {
      curNode.parameters = attributesToObject(node[i]);
    }
    i++;

    // id
    if (node[i]) {
      curNode.id = ((node[i] || {}).value || '').toString();
    }
    i++;

    // description
    if (node[i]) {
      curNode.description = ((node[i] || {}).value || '').toString();
    }
    i++;

    // encoding
    if (node[i]) {
      curNode.encoding = ((node[i] || {}).value || '').toString().toLowerCase();
    }
    i++;

    // size
    if (node[i]) {
      curNode.size = Number((node[i] || {}).value || 0) || 0;
    }
    i++;
    if (curNode.type === 'message/rfc822') {
      // message/rfc adds additional envelope, bodystructure and line count values

      // envelope
      if (node[i]) {
        curNode.envelope = parseENVELOPE([].concat(node[i] || []));
      }
      i++;
      if (node[i]) {
        curNode.childNodes = [
        // rfc822 bodyparts share the same path, difference is between MIME and HEADER
        // path.MIME returns message/rfc822 header
        // path.HEADER returns inlined message header
        parseBODYSTRUCTURE(node[i], path)];
      }
      i++;

      // line count
      if (node[i]) {
        curNode.lineCount = Number((node[i] || {}).value || 0) || 0;
      }
      i++;
    } else if (/^text\//.test(curNode.type)) {
      // text/* adds additional line count values

      // line count
      if (node[i]) {
        curNode.lineCount = Number((node[i] || {}).value || 0) || 0;
      }
      i++;
    }

    // extension data (not available for BODY requests)

    // md5
    if (i < node.length - 1) {
      if (node[i]) {
        curNode.md5 = ((node[i] || {}).value || '').toString().toLowerCase();
      }
      i++;
    }
  }

  // the following are shared extension values (for both multipart and non-multipart parts)
  // not available for BODY requests

  // body disposition
  if (i < node.length - 1) {
    if (Array.isArray(node[i]) && node[i].length) {
      curNode.disposition = ((node[i][0] || {}).value || '').toString().toLowerCase();
      if (Array.isArray(node[i][1])) {
        curNode.dispositionParameters = attributesToObject(node[i][1]);
      }
    }
    i++;
  }

  // body language
  if (i < node.length - 1) {
    if (node[i]) {
      curNode.language = [].concat(node[i]).map(val => (0, _ramda.propOr)('', 'value', val).toLowerCase());
    }
    i++;
  }

  // body location
  // NB! defined as a "string list" in RFC3501 but replaced in errata document with "string"
  // Errata: http://www.rfc-editor.org/errata_search.php?rfc=3501
  if (i < node.length - 1) {
    if (node[i]) {
      curNode.location = ((node[i] || {}).value || '').toString();
    }
    i++;
  }
  return curNode;
}
function attributesToObject(attrs = [], keyTransform = _ramda.toLower, valueTransform = _emailjsMimeCodec.mimeWordsDecode) {
  const vals = attrs.map((0, _ramda.prop)('value'));
  const keys = vals.filter((_, i) => i % 2 === 0).map(keyTransform);
  const values = vals.filter((_, i) => i % 2 === 1).map(valueTransform);
  return (0, _ramda.fromPairs)((0, _ramda.zip)(keys, values));
}

/**
 * Parses FETCH response
 *
 * @param {Object} response
 * @return {Object} Message object
 */
function parseFETCH(response) {
  if (!response || !response.payload || !response.payload.FETCH || !response.payload.FETCH.length) {
    return [];
  }
  const list = [];
  const messages = {};
  response.payload.FETCH.forEach(item => {
    const params = [].concat([].concat(item.attributes || [])[0] || []); // ensure the first value is an array
    let message;
    let i, len, key;
    if (messages[item.nr]) {
      // same sequence number is already used, so merge values instead of creating a new message object
      message = messages[item.nr];
    } else {
      messages[item.nr] = message = {
        '#': item.nr
      };
      list.push(message);
    }
    for (i = 0, len = params.length; i < len; i++) {
      if (i % 2 === 0) {
        key = (0, _emailjsImapHandler.compiler)({
          attributes: [params[i]]
        }).toLowerCase().replace(/<\d+>$/, '');
        continue;
      }
      message[key] = parseFetchValue(key, params[i]);
    }
  });
  return list;
}

/**
 * Parses a single value from the FETCH response object
 *
 * @param {String} key Key name (uppercase)
 * @param {Mized} value Value for the key
 * @return {Mixed} Processed value
 */
function parseFetchValue(key, value) {
  if (!value) {
    return null;
  }
  if (!Array.isArray(value)) {
    switch (key) {
      case 'uid':
      case 'rfc822.size':
        return Number(value.value) || 0;
      case 'modseq':
        // do not cast 64 bit uint to a number
        return value.value || '0';
    }
    return value.value;
  }
  switch (key) {
    case 'flags':
    case 'x-gm-labels':
      value = [].concat(value).map(flag => flag.value || '');
      break;
    case 'envelope':
      value = parseENVELOPE([].concat(value || []));
      break;
    case 'bodystructure':
      value = parseBODYSTRUCTURE([].concat(value || []));
      break;
    case 'modseq':
      value = (value.shift() || {}).value || '0';
      break;
  }
  return value;
}

/**
  * Binary Search - from npm module binary-search, license CC0
  *
  * @param {Array} haystack Ordered array
  * @param {any} needle Item to search for in haystack
  * @param {Function} comparator Function that defines the sort order
  * @return {Number} Index of needle in haystack or if not found,
  *     -Index-1 is the position where needle could be inserted while still
  *     keeping haystack ordered.
  */
function binSearch(haystack, needle, comparator = (a, b) => a - b) {
  var mid, cmp;
  var low = 0;
  var high = haystack.length - 1;
  while (low <= high) {
    // Note that "(low + high) >>> 1" may overflow, and results in
    // a typecast to double (which gives the wrong results).
    mid = low + (high - low >> 1);
    cmp = +comparator(haystack[mid], needle);
    if (cmp < 0.0) {
      // too low
      low = mid + 1;
    } else if (cmp > 0.0) {
      // too high
      high = mid - 1;
    } else {
      // key found
      return mid;
    }
  }

  // key not found
  return ~low;
}
;

/**
 * Parses SEARCH response. Gathers all untagged SEARCH responses, fetched seq./uid numbers
 * and compiles these into a sorted array.
 *
 * @param {Object} response
 * @return {Array} Sorted Seq./UID number list
 */
function parseSEARCH(response) {
  const list = [];
  if (!response) {
    throw new Error('parseSEARCH can not parse undefined response');
  }
  if (!response.payload || !response.payload.SEARCH || !response.payload.SEARCH.length) {
    return list;
  }
  response.payload.SEARCH.forEach(result => (result.attributes || []).forEach(nr => {
    nr = Number(nr && nr.value || nr) || 0;
    const idx = binSearch(list, nr);
    if (idx < 0) {
      list.splice(-idx - 1, 0, nr);
    }
  }));
  return list;
}
;

/**
 * Parses COPY and UID COPY response.
 * https://tools.ietf.org/html/rfc4315
 * @param {Object} response
 * @returns {{destSeqSet: string, srcSeqSet: string}} Source and
 * destination uid sets if available, undefined if not.
 */
function parseCOPY(response) {
  const copyuid = response && response.copyuid;
  if (copyuid) {
    return {
      srcSeqSet: copyuid[1],
      destSeqSet: copyuid[2]
    };
  }
}

/**
 * Parses APPEND (upload) response.
 * https://tools.ietf.org/html/rfc4315
 * @param {Object} response
 * @returns {String} The uid assigned to the uploaded message if available.
 */
function parseAPPEND(response) {
  return response && response.appenduid && response.appenduid[1];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJwYXJzZU5BTUVTUEFDRSIsInJlc3BvbnNlIiwicGF5bG9hZCIsIk5BTUVTUEFDRSIsImxlbmd0aCIsImF0dHJpYnV0ZXMiLCJjb25jYXQiLCJwb3AiLCJwZXJzb25hbCIsInBhcnNlTkFNRVNQQUNFRWxlbWVudCIsInVzZXJzIiwic2hhcmVkIiwiZWxlbWVudCIsIm1hcCIsIm5zIiwicHJlZml4IiwidmFsdWUiLCJkZWxpbWl0ZXIiLCJwYXJzZVNFTEVDVCIsIm1haWxib3giLCJyZWFkT25seSIsImNvZGUiLCJleGlzdHNSZXNwb25zZSIsIkVYSVNUUyIsImZsYWdzUmVzcG9uc2UiLCJGTEFHUyIsIm9rUmVzcG9uc2UiLCJPSyIsImV4aXN0cyIsIm5yIiwiZmxhZ3MiLCJmbGFnIiwidG9TdHJpbmciLCJ0cmltIiwiZm9yRWFjaCIsIm9rIiwicGVybWFuZW50RmxhZ3MiLCJwZXJtYW5lbnRmbGFncyIsInVpZFZhbGlkaXR5IiwiTnVtYmVyIiwidWlkdmFsaWRpdHkiLCJ1aWROZXh0IiwidWlkbmV4dCIsImhpZ2hlc3RNb2RzZXEiLCJoaWdoZXN0bW9kc2VxIiwibm9Nb2RzZXEiLCJwYXJzZUVOVkVMT1BFIiwiZW52ZWxvcGUiLCJkYXRlIiwic3ViamVjdCIsIm1pbWVXb3Jkc0RlY29kZSIsImZyb20iLCJwcm9jZXNzQWRkcmVzc2VzIiwic2VuZGVyIiwidG8iLCJjYyIsImJjYyIsImxpc3QiLCJhZGRyIiwibmFtZSIsInBhdGhPciIsImFkZHJlc3MiLCJmb3JtYXR0ZWQiLCJlbmNvZGVBZGRyZXNzTmFtZSIsInBhcnNlZCIsInBhcnNlQWRkcmVzcyIsInNoaWZ0IiwidGVzdCIsIkpTT04iLCJzdHJpbmdpZnkiLCJtaW1lV29yZEVuY29kZSIsInBhcnNlQk9EWVNUUlVDVFVSRSIsIm5vZGUiLCJwYXRoIiwiY3VyTm9kZSIsImkiLCJwYXJ0Iiwiam9pbiIsIkFycmF5IiwiaXNBcnJheSIsImNoaWxkTm9kZXMiLCJwdXNoIiwidHlwZSIsInRvTG93ZXJDYXNlIiwicGFyYW1ldGVycyIsImF0dHJpYnV0ZXNUb09iamVjdCIsImlkIiwiZGVzY3JpcHRpb24iLCJlbmNvZGluZyIsInNpemUiLCJsaW5lQ291bnQiLCJtZDUiLCJkaXNwb3NpdGlvbiIsImRpc3Bvc2l0aW9uUGFyYW1ldGVycyIsImxhbmd1YWdlIiwidmFsIiwicHJvcE9yIiwibG9jYXRpb24iLCJhdHRycyIsImtleVRyYW5zZm9ybSIsInRvTG93ZXIiLCJ2YWx1ZVRyYW5zZm9ybSIsInZhbHMiLCJwcm9wIiwia2V5cyIsImZpbHRlciIsIl8iLCJ2YWx1ZXMiLCJmcm9tUGFpcnMiLCJ6aXAiLCJwYXJzZUZFVENIIiwiRkVUQ0giLCJtZXNzYWdlcyIsIml0ZW0iLCJwYXJhbXMiLCJtZXNzYWdlIiwibGVuIiwia2V5IiwiY29tcGlsZXIiLCJyZXBsYWNlIiwicGFyc2VGZXRjaFZhbHVlIiwiYmluU2VhcmNoIiwiaGF5c3RhY2siLCJuZWVkbGUiLCJjb21wYXJhdG9yIiwiYSIsImIiLCJtaWQiLCJjbXAiLCJsb3ciLCJoaWdoIiwicGFyc2VTRUFSQ0giLCJFcnJvciIsIlNFQVJDSCIsInJlc3VsdCIsImlkeCIsInNwbGljZSIsInBhcnNlQ09QWSIsImNvcHl1aWQiLCJzcmNTZXFTZXQiLCJkZXN0U2VxU2V0IiwicGFyc2VBUFBFTkQiLCJhcHBlbmR1aWQiXSwic291cmNlcyI6WyIuLi9zcmMvY29tbWFuZC1wYXJzZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhcnNlQWRkcmVzcyBmcm9tICdlbWFpbGpzLWFkZHJlc3NwYXJzZXInXG5pbXBvcnQgeyBjb21waWxlciB9IGZyb20gJ2VtYWlsanMtaW1hcC1oYW5kbGVyJ1xuaW1wb3J0IHsgemlwLCBmcm9tUGFpcnMsIHByb3AsIHBhdGhPciwgcHJvcE9yLCB0b0xvd2VyIH0gZnJvbSAncmFtZGEnXG5pbXBvcnQgeyBtaW1lV29yZEVuY29kZSwgbWltZVdvcmRzRGVjb2RlIH0gZnJvbSAnZW1haWxqcy1taW1lLWNvZGVjJ1xuXG4vKipcbiAqIFBhcnNlcyBOQU1FU1BBQ0UgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2VcbiAqIEByZXR1cm4ge09iamVjdH0gTmFtZXNwYWNlcyBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTkFNRVNQQUNFIChyZXNwb25zZSkge1xuICBpZiAoIXJlc3BvbnNlLnBheWxvYWQgfHwgIXJlc3BvbnNlLnBheWxvYWQuTkFNRVNQQUNFIHx8ICFyZXNwb25zZS5wYXlsb2FkLk5BTUVTUEFDRS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBbXS5jb25jYXQocmVzcG9uc2UucGF5bG9hZC5OQU1FU1BBQ0UucG9wKCkuYXR0cmlidXRlcyB8fCBbXSlcbiAgaWYgKCFhdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwZXJzb25hbDogcGFyc2VOQU1FU1BBQ0VFbGVtZW50KGF0dHJpYnV0ZXNbMF0pLFxuICAgIHVzZXJzOiBwYXJzZU5BTUVTUEFDRUVsZW1lbnQoYXR0cmlidXRlc1sxXSksXG4gICAgc2hhcmVkOiBwYXJzZU5BTUVTUEFDRUVsZW1lbnQoYXR0cmlidXRlc1syXSlcbiAgfVxufVxuXG4vKipcbiAqIFBhcnNlcyBhIE5BTUVTUEFDRSBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnRcbiAqIEByZXR1cm4ge09iamVjdH0gTmFtZXNwYWNlcyBlbGVtZW50IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VOQU1FU1BBQ0VFbGVtZW50IChlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZWxlbWVudCA9IFtdLmNvbmNhdChlbGVtZW50IHx8IFtdKVxuICByZXR1cm4gZWxlbWVudC5tYXAoKG5zKSA9PiB7XG4gICAgaWYgKCFucyB8fCAhbnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcHJlZml4OiBuc1swXS52YWx1ZSxcbiAgICAgIGRlbGltaXRlcjogbnNbMV0gJiYgbnNbMV0udmFsdWUgLy8gVGhlIGRlbGltaXRlciBjYW4gbGVnYWxseSBiZSBOSUwgd2hpY2ggbWFwcyB0byBudWxsXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFBhcnNlcyBTRUxFQ1QgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2VcbiAqIEByZXR1cm4ge09iamVjdH0gTWFpbGJveCBpbmZvcm1hdGlvbiBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU0VMRUNUIChyZXNwb25zZSkge1xuICBpZiAoIXJlc3BvbnNlIHx8ICFyZXNwb25zZS5wYXlsb2FkKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBjb25zdCBtYWlsYm94ID0ge1xuICAgIHJlYWRPbmx5OiByZXNwb25zZS5jb2RlID09PSAnUkVBRC1PTkxZJ1xuICB9XG4gIGNvbnN0IGV4aXN0c1Jlc3BvbnNlID0gcmVzcG9uc2UucGF5bG9hZC5FWElTVFMgJiYgcmVzcG9uc2UucGF5bG9hZC5FWElTVFMucG9wKClcbiAgY29uc3QgZmxhZ3NSZXNwb25zZSA9IHJlc3BvbnNlLnBheWxvYWQuRkxBR1MgJiYgcmVzcG9uc2UucGF5bG9hZC5GTEFHUy5wb3AoKVxuICBjb25zdCBva1Jlc3BvbnNlID0gcmVzcG9uc2UucGF5bG9hZC5PS1xuXG4gIGlmIChleGlzdHNSZXNwb25zZSkge1xuICAgIG1haWxib3guZXhpc3RzID0gZXhpc3RzUmVzcG9uc2UubnIgfHwgMFxuICB9XG5cbiAgaWYgKGZsYWdzUmVzcG9uc2UgJiYgZmxhZ3NSZXNwb25zZS5hdHRyaWJ1dGVzICYmIGZsYWdzUmVzcG9uc2UuYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICBtYWlsYm94LmZsYWdzID0gZmxhZ3NSZXNwb25zZS5hdHRyaWJ1dGVzWzBdLm1hcCgoZmxhZykgPT4gKGZsYWcudmFsdWUgfHwgJycpLnRvU3RyaW5nKCkudHJpbSgpKVxuICB9XG5cbiAgW10uY29uY2F0KG9rUmVzcG9uc2UgfHwgW10pLmZvckVhY2goKG9rKSA9PiB7XG4gICAgc3dpdGNoIChvayAmJiBvay5jb2RlKSB7XG4gICAgICBjYXNlICdQRVJNQU5FTlRGTEFHUyc6XG4gICAgICAgIG1haWxib3gucGVybWFuZW50RmxhZ3MgPSBbXS5jb25jYXQob2sucGVybWFuZW50ZmxhZ3MgfHwgW10pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdVSURWQUxJRElUWSc6XG4gICAgICAgIG1haWxib3gudWlkVmFsaWRpdHkgPSBOdW1iZXIob2sudWlkdmFsaWRpdHkpIHx8IDBcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ1VJRE5FWFQnOlxuICAgICAgICBtYWlsYm94LnVpZE5leHQgPSBOdW1iZXIob2sudWlkbmV4dCkgfHwgMFxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnSElHSEVTVE1PRFNFUSc6XG4gICAgICAgIG1haWxib3guaGlnaGVzdE1vZHNlcSA9IG9rLmhpZ2hlc3Rtb2RzZXEgfHwgJzAnIC8vIGtlZXAgNjRiaXQgdWludCBhcyBhIHN0cmluZ1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnTk9NT0RTRVEnOlxuICAgICAgICBtYWlsYm94Lm5vTW9kc2VxID0gdHJ1ZVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfSlcblxuICByZXR1cm4gbWFpbGJveFxufVxuXG4vKipcbiAqIFBhcnNlcyBtZXNzYWdlIGVudmVsb3BlIGZyb20gRkVUQ0ggcmVzcG9uc2UuIEFsbCBrZXlzIGluIHRoZSByZXN1bHRpbmdcbiAqIG9iamVjdCBhcmUgbG93ZXJjYXNlLiBBZGRyZXNzIGZpZWxkcyBhcmUgYWxsIGFycmF5cyB3aXRoIHtuYW1lOiwgYWRkcmVzczp9XG4gKiBzdHJ1Y3R1cmVkIHZhbHVlcy4gVW5pY29kZSBzdHJpbmdzIGFyZSBhdXRvbWF0aWNhbGx5IGRlY29kZWQuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWUgRW52ZWxvcGUgYXJyYXlcbiAqIEBwYXJhbSB7T2JqZWN0fSBFbnZlbG9wZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRU5WRUxPUEUgKHZhbHVlKSB7XG4gIGNvbnN0IGVudmVsb3BlID0ge31cblxuICBpZiAodmFsdWVbMF0gJiYgdmFsdWVbMF0udmFsdWUpIHtcbiAgICBlbnZlbG9wZS5kYXRlID0gdmFsdWVbMF0udmFsdWVcbiAgfVxuXG4gIGlmICh2YWx1ZVsxXSAmJiB2YWx1ZVsxXS52YWx1ZSkge1xuICAgIGVudmVsb3BlLnN1YmplY3QgPSBtaW1lV29yZHNEZWNvZGUodmFsdWVbMV0gJiYgdmFsdWVbMV0udmFsdWUpXG4gIH1cblxuICBpZiAodmFsdWVbMl0gJiYgdmFsdWVbMl0ubGVuZ3RoKSB7XG4gICAgZW52ZWxvcGUuZnJvbSA9IHByb2Nlc3NBZGRyZXNzZXModmFsdWVbMl0pXG4gIH1cblxuICBpZiAodmFsdWVbM10gJiYgdmFsdWVbM10ubGVuZ3RoKSB7XG4gICAgZW52ZWxvcGUuc2VuZGVyID0gcHJvY2Vzc0FkZHJlc3Nlcyh2YWx1ZVszXSlcbiAgfVxuXG4gIGlmICh2YWx1ZVs0XSAmJiB2YWx1ZVs0XS5sZW5ndGgpIHtcbiAgICBlbnZlbG9wZVsncmVwbHktdG8nXSA9IHByb2Nlc3NBZGRyZXNzZXModmFsdWVbNF0pXG4gIH1cblxuICBpZiAodmFsdWVbNV0gJiYgdmFsdWVbNV0ubGVuZ3RoKSB7XG4gICAgZW52ZWxvcGUudG8gPSBwcm9jZXNzQWRkcmVzc2VzKHZhbHVlWzVdKVxuICB9XG5cbiAgaWYgKHZhbHVlWzZdICYmIHZhbHVlWzZdLmxlbmd0aCkge1xuICAgIGVudmVsb3BlLmNjID0gcHJvY2Vzc0FkZHJlc3Nlcyh2YWx1ZVs2XSlcbiAgfVxuXG4gIGlmICh2YWx1ZVs3XSAmJiB2YWx1ZVs3XS5sZW5ndGgpIHtcbiAgICBlbnZlbG9wZS5iY2MgPSBwcm9jZXNzQWRkcmVzc2VzKHZhbHVlWzddKVxuICB9XG5cbiAgaWYgKHZhbHVlWzhdICYmIHZhbHVlWzhdLnZhbHVlKSB7XG4gICAgZW52ZWxvcGVbJ2luLXJlcGx5LXRvJ10gPSB2YWx1ZVs4XS52YWx1ZVxuICB9XG5cbiAgaWYgKHZhbHVlWzldICYmIHZhbHVlWzldLnZhbHVlKSB7XG4gICAgZW52ZWxvcGVbJ21lc3NhZ2UtaWQnXSA9IHZhbHVlWzldLnZhbHVlXG4gIH1cblxuICByZXR1cm4gZW52ZWxvcGVcbn1cblxuLypcbiAqIEVOVkVMT1BFIGxpc3RzIGFkZHJlc3NlcyBhcyBbbmFtZS1wYXJ0LCBzb3VyY2Utcm91dGUsIHVzZXJuYW1lLCBob3N0bmFtZV1cbiAqIHdoZXJlIHNvdXJjZS1yb3V0ZSBpcyBub3QgdXNlZCBhbnltb3JlIGFuZCBjYW4gYmUgaWdub3JlZC5cbiAqIFRvIGdldCBjb21wYXJhYmxlIHJlc3VsdHMgd2l0aCBvdGhlciBwYXJ0cyBvZiB0aGUgZW1haWwuanMgc3RhY2tcbiAqIGJyb3dzZXJib3ggZmVlZHMgdGhlIHBhcnNlZCBhZGRyZXNzIHZhbHVlcyBmcm9tIEVOVkVMT1BFXG4gKiB0byBhZGRyZXNzcGFyc2VyIGFuZCB1c2VzIHJlc3VsdGluZyB2YWx1ZXMgaW5zdGVhZCBvZiB0aGVcbiAqIHByZS1wYXJzZWQgYWRkcmVzc2VzXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NBZGRyZXNzZXMgKGxpc3QgPSBbXSkge1xuICByZXR1cm4gbGlzdC5tYXAoKGFkZHIpID0+IHtcbiAgICBjb25zdCBuYW1lID0gKHBhdGhPcignJywgWycwJywgJ3ZhbHVlJ10sIGFkZHIpKS50cmltKClcbiAgICBjb25zdCBhZGRyZXNzID0gKHBhdGhPcignJywgWycyJywgJ3ZhbHVlJ10sIGFkZHIpKSArICdAJyArIChwYXRoT3IoJycsIFsnMycsICd2YWx1ZSddLCBhZGRyKSlcbiAgICBjb25zdCBmb3JtYXR0ZWQgPSBuYW1lID8gKGVuY29kZUFkZHJlc3NOYW1lKG5hbWUpICsgJyA8JyArIGFkZHJlc3MgKyAnPicpIDogYWRkcmVzc1xuICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlQWRkcmVzcyhmb3JtYXR0ZWQpLnNoaWZ0KCkgLy8gdGhlcmUgc2hvdWxkIGJlIGp1c3QgYSBzaW5nbGUgYWRkcmVzc1xuICAgIHBhcnNlZC5uYW1lID0gbWltZVdvcmRzRGVjb2RlKHBhcnNlZC5uYW1lKVxuICAgIHJldHVybiBwYXJzZWRcbiAgfSlcbn1cblxuLyoqXG4gKiBJZiBuZWVkZWQsIGVuY2xvc2VzIHdpdGggcXVvdGVzIG9yIG1pbWUgZW5jb2RlcyB0aGUgbmFtZSBwYXJ0IG9mIGFuIGUtbWFpbCBhZGRyZXNzXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBwYXJ0IG9mIGFuIGFkZHJlc3NcbiAqIEByZXR1cm5zIHtTdHJpbmd9IE1pbWUgd29yZCBlbmNvZGVkIG9yIHF1b3RlZCBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gZW5jb2RlQWRkcmVzc05hbWUgKG5hbWUpIHtcbiAgaWYgKCEvXltcXHcgJ10qJC8udGVzdChuYW1lKSkge1xuICAgIGlmICgvXltcXHgyMC1cXHg3ZV0qJC8udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5hbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtaW1lV29yZEVuY29kZShuYW1lLCAnUScsIDUyKVxuICAgIH1cbiAgfVxuICByZXR1cm4gbmFtZVxufVxuXG4vKipcbiAqIFBhcnNlcyBtZXNzYWdlIGJvZHkgc3RydWN0dXJlIGZyb20gRkVUQ0ggcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWUgQk9EWVNUUlVDVFVSRSBhcnJheVxuICogQHBhcmFtIHtPYmplY3R9IEVudmVsb3BlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VCT0RZU1RSVUNUVVJFIChub2RlLCBwYXRoID0gW10pIHtcbiAgY29uc3QgY3VyTm9kZSA9IHt9XG4gIGxldCBpID0gMFxuICBsZXQgcGFydCA9IDBcblxuICBpZiAocGF0aC5sZW5ndGgpIHtcbiAgICBjdXJOb2RlLnBhcnQgPSBwYXRoLmpvaW4oJy4nKVxuICB9XG5cbiAgLy8gbXVsdGlwYXJ0XG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGVbMF0pKSB7XG4gICAgY3VyTm9kZS5jaGlsZE5vZGVzID0gW11cbiAgICB3aGlsZSAoQXJyYXkuaXNBcnJheShub2RlW2ldKSkge1xuICAgICAgY3VyTm9kZS5jaGlsZE5vZGVzLnB1c2gocGFyc2VCT0RZU1RSVUNUVVJFKG5vZGVbaV0sIHBhdGguY29uY2F0KCsrcGFydCkpKVxuICAgICAgaSsrXG4gICAgfVxuXG4gICAgLy8gbXVsdGlwYXJ0IHR5cGVcbiAgICBjdXJOb2RlLnR5cGUgPSAnbXVsdGlwYXJ0LycgKyAoKG5vZGVbaSsrXSB8fCB7fSkudmFsdWUgfHwgJycpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuXG4gICAgLy8gZXh0ZW5zaW9uIGRhdGEgKG5vdCBhdmFpbGFibGUgZm9yIEJPRFkgcmVxdWVzdHMpXG5cbiAgICAvLyBib2R5IHBhcmFtZXRlciBwYXJlbnRoZXNpemVkIGxpc3RcbiAgICBpZiAoaSA8IG5vZGUubGVuZ3RoIC0gMSkge1xuICAgICAgaWYgKG5vZGVbaV0pIHtcbiAgICAgICAgY3VyTm9kZS5wYXJhbWV0ZXJzID0gYXR0cmlidXRlc1RvT2JqZWN0KG5vZGVbaV0pXG4gICAgICB9XG4gICAgICBpKytcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gY29udGVudCB0eXBlXG4gICAgY3VyTm9kZS50eXBlID0gW1xuICAgICAgKChub2RlW2krK10gfHwge30pLnZhbHVlIHx8ICcnKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCksICgobm9kZVtpKytdIHx8IHt9KS52YWx1ZSB8fCAnJykudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG4gICAgXS5qb2luKCcvJylcblxuICAgIC8vIGJvZHkgcGFyYW1ldGVyIHBhcmVudGhlc2l6ZWQgbGlzdFxuICAgIGlmIChub2RlW2ldKSB7XG4gICAgICBjdXJOb2RlLnBhcmFtZXRlcnMgPSBhdHRyaWJ1dGVzVG9PYmplY3Qobm9kZVtpXSlcbiAgICB9XG4gICAgaSsrXG5cbiAgICAvLyBpZFxuICAgIGlmIChub2RlW2ldKSB7XG4gICAgICBjdXJOb2RlLmlkID0gKChub2RlW2ldIHx8IHt9KS52YWx1ZSB8fCAnJykudG9TdHJpbmcoKVxuICAgIH1cbiAgICBpKytcblxuICAgIC8vIGRlc2NyaXB0aW9uXG4gICAgaWYgKG5vZGVbaV0pIHtcbiAgICAgIGN1ck5vZGUuZGVzY3JpcHRpb24gPSAoKG5vZGVbaV0gfHwge30pLnZhbHVlIHx8ICcnKS50b1N0cmluZygpXG4gICAgfVxuICAgIGkrK1xuXG4gICAgLy8gZW5jb2RpbmdcbiAgICBpZiAobm9kZVtpXSkge1xuICAgICAgY3VyTm9kZS5lbmNvZGluZyA9ICgobm9kZVtpXSB8fCB7fSkudmFsdWUgfHwgJycpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuICAgIH1cbiAgICBpKytcblxuICAgIC8vIHNpemVcbiAgICBpZiAobm9kZVtpXSkge1xuICAgICAgY3VyTm9kZS5zaXplID0gTnVtYmVyKChub2RlW2ldIHx8IHt9KS52YWx1ZSB8fCAwKSB8fCAwXG4gICAgfVxuICAgIGkrK1xuXG4gICAgaWYgKGN1ck5vZGUudHlwZSA9PT0gJ21lc3NhZ2UvcmZjODIyJykge1xuICAgICAgLy8gbWVzc2FnZS9yZmMgYWRkcyBhZGRpdGlvbmFsIGVudmVsb3BlLCBib2R5c3RydWN0dXJlIGFuZCBsaW5lIGNvdW50IHZhbHVlc1xuXG4gICAgICAvLyBlbnZlbG9wZVxuICAgICAgaWYgKG5vZGVbaV0pIHtcbiAgICAgICAgY3VyTm9kZS5lbnZlbG9wZSA9IHBhcnNlRU5WRUxPUEUoW10uY29uY2F0KG5vZGVbaV0gfHwgW10pKVxuICAgICAgfVxuICAgICAgaSsrXG5cbiAgICAgIGlmIChub2RlW2ldKSB7XG4gICAgICAgIGN1ck5vZGUuY2hpbGROb2RlcyA9IFtcbiAgICAgICAgICAvLyByZmM4MjIgYm9keXBhcnRzIHNoYXJlIHRoZSBzYW1lIHBhdGgsIGRpZmZlcmVuY2UgaXMgYmV0d2VlbiBNSU1FIGFuZCBIRUFERVJcbiAgICAgICAgICAvLyBwYXRoLk1JTUUgcmV0dXJucyBtZXNzYWdlL3JmYzgyMiBoZWFkZXJcbiAgICAgICAgICAvLyBwYXRoLkhFQURFUiByZXR1cm5zIGlubGluZWQgbWVzc2FnZSBoZWFkZXJcbiAgICAgICAgICBwYXJzZUJPRFlTVFJVQ1RVUkUobm9kZVtpXSwgcGF0aClcbiAgICAgICAgXVxuICAgICAgfVxuICAgICAgaSsrXG5cbiAgICAgIC8vIGxpbmUgY291bnRcbiAgICAgIGlmIChub2RlW2ldKSB7XG4gICAgICAgIGN1ck5vZGUubGluZUNvdW50ID0gTnVtYmVyKChub2RlW2ldIHx8IHt9KS52YWx1ZSB8fCAwKSB8fCAwXG4gICAgICB9XG4gICAgICBpKytcbiAgICB9IGVsc2UgaWYgKC9edGV4dFxcLy8udGVzdChjdXJOb2RlLnR5cGUpKSB7XG4gICAgICAvLyB0ZXh0LyogYWRkcyBhZGRpdGlvbmFsIGxpbmUgY291bnQgdmFsdWVzXG5cbiAgICAgIC8vIGxpbmUgY291bnRcbiAgICAgIGlmIChub2RlW2ldKSB7XG4gICAgICAgIGN1ck5vZGUubGluZUNvdW50ID0gTnVtYmVyKChub2RlW2ldIHx8IHt9KS52YWx1ZSB8fCAwKSB8fCAwXG4gICAgICB9XG4gICAgICBpKytcbiAgICB9XG5cbiAgICAvLyBleHRlbnNpb24gZGF0YSAobm90IGF2YWlsYWJsZSBmb3IgQk9EWSByZXF1ZXN0cylcblxuICAgIC8vIG1kNVxuICAgIGlmIChpIDwgbm9kZS5sZW5ndGggLSAxKSB7XG4gICAgICBpZiAobm9kZVtpXSkge1xuICAgICAgICBjdXJOb2RlLm1kNSA9ICgobm9kZVtpXSB8fCB7fSkudmFsdWUgfHwgJycpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuICAgICAgfVxuICAgICAgaSsrXG4gICAgfVxuICB9XG5cbiAgLy8gdGhlIGZvbGxvd2luZyBhcmUgc2hhcmVkIGV4dGVuc2lvbiB2YWx1ZXMgKGZvciBib3RoIG11bHRpcGFydCBhbmQgbm9uLW11bHRpcGFydCBwYXJ0cylcbiAgLy8gbm90IGF2YWlsYWJsZSBmb3IgQk9EWSByZXF1ZXN0c1xuXG4gIC8vIGJvZHkgZGlzcG9zaXRpb25cbiAgaWYgKGkgPCBub2RlLmxlbmd0aCAtIDEpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShub2RlW2ldKSAmJiBub2RlW2ldLmxlbmd0aCkge1xuICAgICAgY3VyTm9kZS5kaXNwb3NpdGlvbiA9ICgobm9kZVtpXVswXSB8fCB7fSkudmFsdWUgfHwgJycpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZVtpXVsxXSkpIHtcbiAgICAgICAgY3VyTm9kZS5kaXNwb3NpdGlvblBhcmFtZXRlcnMgPSBhdHRyaWJ1dGVzVG9PYmplY3Qobm9kZVtpXVsxXSlcbiAgICAgIH1cbiAgICB9XG4gICAgaSsrXG4gIH1cblxuICAvLyBib2R5IGxhbmd1YWdlXG4gIGlmIChpIDwgbm9kZS5sZW5ndGggLSAxKSB7XG4gICAgaWYgKG5vZGVbaV0pIHtcbiAgICAgIGN1ck5vZGUubGFuZ3VhZ2UgPSBbXS5jb25jYXQobm9kZVtpXSkubWFwKCh2YWwpID0+IHByb3BPcignJywgJ3ZhbHVlJywgdmFsKS50b0xvd2VyQ2FzZSgpKVxuICAgIH1cbiAgICBpKytcbiAgfVxuXG4gIC8vIGJvZHkgbG9jYXRpb25cbiAgLy8gTkIhIGRlZmluZWQgYXMgYSBcInN0cmluZyBsaXN0XCIgaW4gUkZDMzUwMSBidXQgcmVwbGFjZWQgaW4gZXJyYXRhIGRvY3VtZW50IHdpdGggXCJzdHJpbmdcIlxuICAvLyBFcnJhdGE6IGh0dHA6Ly93d3cucmZjLWVkaXRvci5vcmcvZXJyYXRhX3NlYXJjaC5waHA/cmZjPTM1MDFcbiAgaWYgKGkgPCBub2RlLmxlbmd0aCAtIDEpIHtcbiAgICBpZiAobm9kZVtpXSkge1xuICAgICAgY3VyTm9kZS5sb2NhdGlvbiA9ICgobm9kZVtpXSB8fCB7fSkudmFsdWUgfHwgJycpLnRvU3RyaW5nKClcbiAgICB9XG4gICAgaSsrXG4gIH1cblxuICByZXR1cm4gY3VyTm9kZVxufVxuXG5mdW5jdGlvbiBhdHRyaWJ1dGVzVG9PYmplY3QgKGF0dHJzID0gW10sIGtleVRyYW5zZm9ybSA9IHRvTG93ZXIsIHZhbHVlVHJhbnNmb3JtID0gbWltZVdvcmRzRGVjb2RlKSB7XG4gIGNvbnN0IHZhbHMgPSBhdHRycy5tYXAocHJvcCgndmFsdWUnKSlcbiAgY29uc3Qga2V5cyA9IHZhbHMuZmlsdGVyKChfLCBpKSA9PiBpICUgMiA9PT0gMCkubWFwKGtleVRyYW5zZm9ybSlcbiAgY29uc3QgdmFsdWVzID0gdmFscy5maWx0ZXIoKF8sIGkpID0+IGkgJSAyID09PSAxKS5tYXAodmFsdWVUcmFuc2Zvcm0pXG4gIHJldHVybiBmcm9tUGFpcnMoemlwKGtleXMsIHZhbHVlcykpXG59XG5cbi8qKlxuICogUGFyc2VzIEZFVENIIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlXG4gKiBAcmV0dXJuIHtPYmplY3R9IE1lc3NhZ2Ugb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUZFVENIIChyZXNwb25zZSkge1xuICBpZiAoIXJlc3BvbnNlIHx8ICFyZXNwb25zZS5wYXlsb2FkIHx8ICFyZXNwb25zZS5wYXlsb2FkLkZFVENIIHx8ICFyZXNwb25zZS5wYXlsb2FkLkZFVENILmxlbmd0aCkge1xuICAgIHJldHVybiBbXVxuICB9XG5cbiAgY29uc3QgbGlzdCA9IFtdXG4gIGNvbnN0IG1lc3NhZ2VzID0ge31cblxuICByZXNwb25zZS5wYXlsb2FkLkZFVENILmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSBbXS5jb25jYXQoW10uY29uY2F0KGl0ZW0uYXR0cmlidXRlcyB8fCBbXSlbMF0gfHwgW10pIC8vIGVuc3VyZSB0aGUgZmlyc3QgdmFsdWUgaXMgYW4gYXJyYXlcbiAgICBsZXQgbWVzc2FnZVxuICAgIGxldCBpLCBsZW4sIGtleVxuXG4gICAgaWYgKG1lc3NhZ2VzW2l0ZW0ubnJdKSB7XG4gICAgICAvLyBzYW1lIHNlcXVlbmNlIG51bWJlciBpcyBhbHJlYWR5IHVzZWQsIHNvIG1lcmdlIHZhbHVlcyBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IG1lc3NhZ2Ugb2JqZWN0XG4gICAgICBtZXNzYWdlID0gbWVzc2FnZXNbaXRlbS5ucl1cbiAgICB9IGVsc2Uge1xuICAgICAgbWVzc2FnZXNbaXRlbS5ucl0gPSBtZXNzYWdlID0ge1xuICAgICAgICAnIyc6IGl0ZW0ubnJcbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChtZXNzYWdlKVxuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHBhcmFtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKGkgJSAyID09PSAwKSB7XG4gICAgICAgIGtleSA9IGNvbXBpbGVyKHtcbiAgICAgICAgICBhdHRyaWJ1dGVzOiBbcGFyYW1zW2ldXVxuICAgICAgICB9KS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLzxcXGQrPiQvLCAnJylcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIG1lc3NhZ2Vba2V5XSA9IHBhcnNlRmV0Y2hWYWx1ZShrZXksIHBhcmFtc1tpXSlcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGxpc3Rcbn1cblxuLyoqXG4gKiBQYXJzZXMgYSBzaW5nbGUgdmFsdWUgZnJvbSB0aGUgRkVUQ0ggcmVzcG9uc2Ugb2JqZWN0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBLZXkgbmFtZSAodXBwZXJjYXNlKVxuICogQHBhcmFtIHtNaXplZH0gdmFsdWUgVmFsdWUgZm9yIHRoZSBrZXlcbiAqIEByZXR1cm4ge01peGVkfSBQcm9jZXNzZWQgdmFsdWVcbiAqL1xuZnVuY3Rpb24gcGFyc2VGZXRjaFZhbHVlIChrZXksIHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlICd1aWQnOlxuICAgICAgY2FzZSAncmZjODIyLnNpemUnOlxuICAgICAgICByZXR1cm4gTnVtYmVyKHZhbHVlLnZhbHVlKSB8fCAwXG4gICAgICBjYXNlICdtb2RzZXEnOiAvLyBkbyBub3QgY2FzdCA2NCBiaXQgdWludCB0byBhIG51bWJlclxuICAgICAgICByZXR1cm4gdmFsdWUudmFsdWUgfHwgJzAnXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS52YWx1ZVxuICB9XG5cbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlICdmbGFncyc6XG4gICAgY2FzZSAneC1nbS1sYWJlbHMnOlxuICAgICAgdmFsdWUgPSBbXS5jb25jYXQodmFsdWUpLm1hcCgoZmxhZykgPT4gKGZsYWcudmFsdWUgfHwgJycpKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdlbnZlbG9wZSc6XG4gICAgICB2YWx1ZSA9IHBhcnNlRU5WRUxPUEUoW10uY29uY2F0KHZhbHVlIHx8IFtdKSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYm9keXN0cnVjdHVyZSc6XG4gICAgICB2YWx1ZSA9IHBhcnNlQk9EWVNUUlVDVFVSRShbXS5jb25jYXQodmFsdWUgfHwgW10pKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdtb2RzZXEnOlxuICAgICAgdmFsdWUgPSAodmFsdWUuc2hpZnQoKSB8fCB7fSkudmFsdWUgfHwgJzAnXG4gICAgICBicmVha1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8qKlxuICAqIEJpbmFyeSBTZWFyY2ggLSBmcm9tIG5wbSBtb2R1bGUgYmluYXJ5LXNlYXJjaCwgbGljZW5zZSBDQzBcbiAgKlxuICAqIEBwYXJhbSB7QXJyYXl9IGhheXN0YWNrIE9yZGVyZWQgYXJyYXlcbiAgKiBAcGFyYW0ge2FueX0gbmVlZGxlIEl0ZW0gdG8gc2VhcmNoIGZvciBpbiBoYXlzdGFja1xuICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgRnVuY3Rpb24gdGhhdCBkZWZpbmVzIHRoZSBzb3J0IG9yZGVyXG4gICogQHJldHVybiB7TnVtYmVyfSBJbmRleCBvZiBuZWVkbGUgaW4gaGF5c3RhY2sgb3IgaWYgbm90IGZvdW5kLFxuICAqICAgICAtSW5kZXgtMSBpcyB0aGUgcG9zaXRpb24gd2hlcmUgbmVlZGxlIGNvdWxkIGJlIGluc2VydGVkIHdoaWxlIHN0aWxsXG4gICogICAgIGtlZXBpbmcgaGF5c3RhY2sgb3JkZXJlZC5cbiAgKi9cbmZ1bmN0aW9uIGJpblNlYXJjaCAoaGF5c3RhY2ssIG5lZWRsZSwgY29tcGFyYXRvciA9IChhLCBiKSA9PiBhIC0gYikge1xuICB2YXIgbWlkLCBjbXBcbiAgdmFyIGxvdyA9IDBcbiAgdmFyIGhpZ2ggPSBoYXlzdGFjay5sZW5ndGggLSAxXG5cbiAgd2hpbGUgKGxvdyA8PSBoaWdoKSB7XG4gICAgLy8gTm90ZSB0aGF0IFwiKGxvdyArIGhpZ2gpID4+PiAxXCIgbWF5IG92ZXJmbG93LCBhbmQgcmVzdWx0cyBpblxuICAgIC8vIGEgdHlwZWNhc3QgdG8gZG91YmxlICh3aGljaCBnaXZlcyB0aGUgd3JvbmcgcmVzdWx0cykuXG4gICAgbWlkID0gbG93ICsgKGhpZ2ggLSBsb3cgPj4gMSlcbiAgICBjbXAgPSArY29tcGFyYXRvcihoYXlzdGFja1ttaWRdLCBuZWVkbGUpXG5cbiAgICBpZiAoY21wIDwgMC4wKSB7XG4gICAgICAvLyB0b28gbG93XG4gICAgICBsb3cgPSBtaWQgKyAxXG4gICAgfSBlbHNlIGlmIChjbXAgPiAwLjApIHtcbiAgICAgIC8vIHRvbyBoaWdoXG4gICAgICBoaWdoID0gbWlkIC0gMVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBrZXkgZm91bmRcbiAgICAgIHJldHVybiBtaWRcbiAgICB9XG4gIH1cblxuICAvLyBrZXkgbm90IGZvdW5kXG4gIHJldHVybiB+bG93XG59O1xuXG4vKipcbiAqIFBhcnNlcyBTRUFSQ0ggcmVzcG9uc2UuIEdhdGhlcnMgYWxsIHVudGFnZ2VkIFNFQVJDSCByZXNwb25zZXMsIGZldGNoZWQgc2VxLi91aWQgbnVtYmVyc1xuICogYW5kIGNvbXBpbGVzIHRoZXNlIGludG8gYSBzb3J0ZWQgYXJyYXkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlXG4gKiBAcmV0dXJuIHtBcnJheX0gU29ydGVkIFNlcS4vVUlEIG51bWJlciBsaXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNFQVJDSCAocmVzcG9uc2UpIHtcbiAgY29uc3QgbGlzdCA9IFtdXG5cbiAgaWYgKCFyZXNwb25zZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncGFyc2VTRUFSQ0ggY2FuIG5vdCBwYXJzZSB1bmRlZmluZWQgcmVzcG9uc2UnKVxuICB9XG5cbiAgaWYgKCFyZXNwb25zZS5wYXlsb2FkIHx8ICFyZXNwb25zZS5wYXlsb2FkLlNFQVJDSCB8fCAhcmVzcG9uc2UucGF5bG9hZC5TRUFSQ0gubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGxpc3RcbiAgfVxuXG4gIHJlc3BvbnNlLnBheWxvYWQuU0VBUkNILmZvckVhY2gocmVzdWx0ID0+XG4gICAgKHJlc3VsdC5hdHRyaWJ1dGVzIHx8IFtdKS5mb3JFYWNoKG5yID0+IHtcbiAgICAgIG5yID0gTnVtYmVyKChuciAmJiBuci52YWx1ZSkgfHwgbnIpIHx8IDBcbiAgICAgIGNvbnN0IGlkeCA9IGJpblNlYXJjaChsaXN0LCBucilcbiAgICAgIGlmIChpZHggPCAwKSB7XG4gICAgICAgIGxpc3Quc3BsaWNlKC1pZHggLSAxLCAwLCBucilcbiAgICAgIH1cbiAgICB9KVxuICApXG5cbiAgcmV0dXJuIGxpc3Rcbn07XG5cbi8qKlxuICogUGFyc2VzIENPUFkgYW5kIFVJRCBDT1BZIHJlc3BvbnNlLlxuICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzQzMTVcbiAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZVxuICogQHJldHVybnMge3tkZXN0U2VxU2V0OiBzdHJpbmcsIHNyY1NlcVNldDogc3RyaW5nfX0gU291cmNlIGFuZFxuICogZGVzdGluYXRpb24gdWlkIHNldHMgaWYgYXZhaWxhYmxlLCB1bmRlZmluZWQgaWYgbm90LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDT1BZIChyZXNwb25zZSkge1xuICBjb25zdCBjb3B5dWlkID0gcmVzcG9uc2UgJiYgcmVzcG9uc2UuY29weXVpZFxuICBpZiAoY29weXVpZCkge1xuICAgIHJldHVybiB7XG4gICAgICBzcmNTZXFTZXQ6IGNvcHl1aWRbMV0sXG4gICAgICBkZXN0U2VxU2V0OiBjb3B5dWlkWzJdXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUGFyc2VzIEFQUEVORCAodXBsb2FkKSByZXNwb25zZS5cbiAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM0MzE1XG4gKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2VcbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB1aWQgYXNzaWduZWQgdG8gdGhlIHVwbG9hZGVkIG1lc3NhZ2UgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBUFBFTkQgKHJlc3BvbnNlKSB7XG4gIHJldHVybiByZXNwb25zZSAmJiByZXNwb25zZS5hcHBlbmR1aWQgJiYgcmVzcG9uc2UuYXBwZW5kdWlkWzFdXG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBb0U7QUFFcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBU0EsY0FBYyxDQUFFQyxRQUFRLEVBQUU7RUFDeEMsSUFBSSxDQUFDQSxRQUFRLENBQUNDLE9BQU8sSUFBSSxDQUFDRCxRQUFRLENBQUNDLE9BQU8sQ0FBQ0MsU0FBUyxJQUFJLENBQUNGLFFBQVEsQ0FBQ0MsT0FBTyxDQUFDQyxTQUFTLENBQUNDLE1BQU0sRUFBRTtJQUMxRixPQUFPLEtBQUs7RUFDZDtFQUVBLE1BQU1DLFVBQVUsR0FBRyxFQUFFLENBQUNDLE1BQU0sQ0FBQ0wsUUFBUSxDQUFDQyxPQUFPLENBQUNDLFNBQVMsQ0FBQ0ksR0FBRyxFQUFFLENBQUNGLFVBQVUs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