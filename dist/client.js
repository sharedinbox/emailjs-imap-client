"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TIMEOUT_NOOP = exports.TIMEOUT_IDLE = exports.TIMEOUT_CONNECTION = exports.STATE_SELECTED = exports.STATE_NOT_AUTHENTICATED = exports.STATE_LOGOUT = exports.STATE_CONNECTING = exports.STATE_AUTHENTICATED = exports.DEFAULT_CLIENT_ID = void 0;
var _ramda = require("ramda");
var _emailjsUtf = require("emailjs-utf7");
var _commandParser = require("./command-parser");
var _commandBuilder = require("./command-builder");
var _logger = _interopRequireDefault(require("./logger"));
var _imap = _interopRequireDefault(require("./imap"));
var _common = require("./common");
var _specialUse = require("./special-use");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
const TIMEOUT_CONNECTION = 90 * 1000; // Milliseconds to wait for the IMAP greeting from the server
exports.TIMEOUT_CONNECTION = TIMEOUT_CONNECTION;
const TIMEOUT_NOOP = 60 * 1000; // Milliseconds between NOOP commands while idling
exports.TIMEOUT_NOOP = TIMEOUT_NOOP;
const TIMEOUT_IDLE = 60 * 1000; // Milliseconds until IDLE command is cancelled
exports.TIMEOUT_IDLE = TIMEOUT_IDLE;
const STATE_CONNECTING = 1;
exports.STATE_CONNECTING = STATE_CONNECTING;
const STATE_NOT_AUTHENTICATED = 2;
exports.STATE_NOT_AUTHENTICATED = STATE_NOT_AUTHENTICATED;
const STATE_AUTHENTICATED = 3;
exports.STATE_AUTHENTICATED = STATE_AUTHENTICATED;
const STATE_SELECTED = 4;
exports.STATE_SELECTED = STATE_SELECTED;
const STATE_LOGOUT = 5;
exports.STATE_LOGOUT = STATE_LOGOUT;
const DEFAULT_CLIENT_ID = {
  name: 'emailjs-imap-client'
};

/**
 * emailjs IMAP client
 *
 * @constructor
 *
 * @param {String} [host='localhost'] Hostname to conenct to
 * @param {Number} [port=143] Port number to connect to
 * @param {Object} [options] Optional options object
 */
exports.DEFAULT_CLIENT_ID = DEFAULT_CLIENT_ID;
class Client {
  constructor(host, port, options = {}) {
    this.timeoutConnection = TIMEOUT_CONNECTION;
    this.timeoutNoop = TIMEOUT_NOOP;
    this.timeoutIdle = TIMEOUT_IDLE;
    this.serverId = false; // RFC 2971 Server ID as key value pairs

    // Event placeholders
    this.oncert = null;
    this.onupdate = null;
    this.onselectmailbox = null;
    this.onclosemailbox = null;
    this._host = host;
    this._clientId = (0, _ramda.propOr)(DEFAULT_CLIENT_ID, 'id', options);
    this._state = false; // Current state
    this._authenticated = false; // Is the connection authenticated
    this._capability = []; // List of extensions the server supports
    this._humanReadable = '';
    this._okGreeting = '';
    this._selectedMailbox = false; // Selected mailbox
    this._enteredIdle = false;
    this._idleTimeout = false;
    this._enableCompression = !!options.enableCompression;
    this._auth = options.auth;
    this._requireTLS = !!options.requireTLS;
    this._ignoreTLS = !!options.ignoreTLS;
    this.client = new _imap.default(host, port, options); // IMAP client object

    // Event Handlers
    this.client.onerror = this._onError.bind(this);
    this.client.oncert = cert => this.oncert && this.oncert(cert); // allows certificate handling for platforms w/o native tls support
    this.client.onidle = () => this._onIdle(); // start idling

    // Default handlers for untagged responses
    this.client.setHandler('capability', response => this._untaggedCapabilityHandler(response)); // capability updates
    this.client.setHandler('ok', response => this._untaggedOkHandler(response)); // notifications
    this.client.setHandler('exists', response => this._untaggedExistsHandler(response)); // message count has changed
    this.client.setHandler('expunge', response => this._untaggedExpungeHandler(response)); // message has been deleted
    this.client.setHandler('fetch', response => this._untaggedFetchHandler(response)); // message has been updated (eg. flag change)

    // Activate logging
    this.createLogger();
    this.logLevel = (0, _ramda.propOr)(_common.LOG_LEVEL_ALL, 'logLevel', options);
  }

  /**
   * Called if the lower-level ImapClient has encountered an unrecoverable
   * error during operation. Cleans up and propagates the error upwards.
   */
  _onError(err) {
    // make sure no idle timeout is pending anymore
    clearTimeout(this._idleTimeout);

    // propagate the error upwards
    this.onerror && this.onerror(err);
  }

  //
  //
  // PUBLIC API
  //
  //

  /**
   * Initiate connection and login to the IMAP server
   *
   * @returns {Promise} Promise when login procedure is complete
   */
  connect() {
    var _this = this;
    return _asyncToGenerator(function* () {
      try {
        yield _this.openConnection();
        yield _this.upgradeConnection();
        try {
          yield _this.updateId(_this._clientId);
        } catch (err) {
          if (err.command === 'BAD') {
            // Do not fail connection even though ID command turns out BAD, e.g.
            // poczta.o2.pl lists ID capability both before and after login while
            // it only works after login.
            _this.logger.warn('Failed to update server id!', err.message);
          } else {
            // Re-throw other errors (e.g. socket errors).
            throw err;
          }
        }
        yield _this.login(_this._auth);
        yield _this.compressConnection();
        _this.logger.debug('Connection established, ready to roll!');
        _this.client.onerror = _this._onError.bind(_this);
      } catch (err) {
        _this.logger.error('Could not connect to server', err);
        _this.close(err); // we don't really care whether this works or not
        throw err;
      }
    })();
  }

  /**
   * Initiate connection to the IMAP server
   *
   * @returns {Promise} capability of server without login
   */
  openConnection() {
    return new Promise((resolve, reject) => {
      const connectionTimeout = setTimeout(() => reject(new Error('Timeout connecting to server')), this.timeoutConnection);
      this.logger.debug('Connecting to', this.client.host, ':', this.client.port);
      this._changeState(STATE_CONNECTING);
      this.client.connect().then(() => {
        this.logger.debug('Socket opened, waiting for greeting from the server...');
        this.client.onready = () => {
          clearTimeout(connectionTimeout);
          this._changeState(STATE_NOT_AUTHENTICATED);
          /* The human-readable string on connection startup is the OK-greeting
             See https://tools.ietf.org/html/rfc3501#section-7.1.1
             and diagram in https://tools.ietf.org/html/rfc3501#section-3.4 */
          this._okGreeting = this._humanReadable;
          this.updateCapability().then(() => resolve(this._capability));
        };
        this.client.onerror = err => {
          clearTimeout(connectionTimeout);
          reject(err);
        };
      }).catch(reject);
    });
  }

  /**
   * Logout
   *
   * Send LOGOUT, to which the server responds by closing the connection.
   * Use is discouraged if network status is unclear! If networks status is
   * unclear, please use #close instead!
   *
   * LOGOUT details:
   *   https://tools.ietf.org/html/rfc3501#section-6.1.3
   *
   * @returns {Promise} Resolves when server has closed the connection
   */
  logout() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      _this2._changeState(STATE_LOGOUT);
      _this2.logger.debug('Logging out...');
      yield _this2.client.logout();
      clearTimeout(_this2._idleTimeout);
    })();
  }

  /**
   * Force-closes the current connection by closing the TCP socket.
   *
   * @returns {Promise} Resolves when socket is closed
   */
  close(err) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      _this3._changeState(STATE_LOGOUT);
      clearTimeout(_this3._idleTimeout);
      _this3.logger.debug('Closing connection...');
      yield _this3.client.close(err);
      clearTimeout(_this3._idleTimeout);
    })();
  }

  /**
   * Runs ID command, parses ID response, sets this.serverId
   *
   * ID details:
   *   http://tools.ietf.org/html/rfc2971
   *
   * @param {Object} id ID as JSON object. See http://tools.ietf.org/html/rfc2971#section-3.3 for possible values
   * @returns {Promise} Resolves when response has been parsed
   */
  updateId(id) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      if (_this4._capability.indexOf('ID') < 0) return;
      _this4.logger.debug('Updating id...');
      const command = 'ID';
      const attributes = id ? [(0, _ramda.flatten)(Object.entries(id))] : [null];
      const response = yield _this4.exec({
        command,
        attributes
      }, 'ID');
      const list = (0, _ramda.flatten)((0, _ramda.pathOr)([], ['payload', 'ID', '0', 'attributes', '0'], response).map(Object.values));
      const keys = list.filter((_, i) => i % 2 === 0);
      const values = list.filter((_, i) => i % 2 === 1);
      _this4.serverId = (0, _ramda.fromPairs)((0, _ramda.zip)(keys, values));
      _this4.logger.debug('Server id updated!', _this4.serverId);
    })();
  }
  _shouldSelectMailbox(path, ctx) {
    if (!ctx) {
      return true;
    }
    const previousSelect = this.client.getPreviouslyQueued(['SELECT', 'EXAMINE'], ctx);
    if (previousSelect && previousSelect.request.attributes) {
      const pathAttribute = previousSelect.request.attributes.find(attribute => attribute.type === 'STRING');
      if (pathAttribute) {
        return pathAttribute.value !== path;
      }
    }
    return this._selectedMailbox !== path;
  }

  /**
   * Runs SELECT or EXAMINE to open a mailbox
   *
   * SELECT details:
   *   http://tools.ietf.org/html/rfc3501#section-6.3.1
   * EXAMINE details:
   *   http://tools.ietf.org/html/rfc3501#section-6.3.2
   *
   * @param {String} path Full path to mailbox
   * @param {Object} [options] Options object
   * @returns {Promise} Promise with information about the selected mailbox
   */
  selectMailbox(path, options = {}) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      const query = {
        command: options.readOnly ? 'EXAMINE' : 'SELECT',
        attributes: [{
          type: 'STRING',
          value: path
        }]
      };
      if (options.condstore && _this5._capability.indexOf('CONDSTORE') >= 0) {
        query.attributes.push([{
          type: 'ATOM',
          value: 'CONDSTORE'
        }]);
      }
      _this5.logger.debug('Opening', path, '...');
      const response = yield _this5.exec(query, ['EXISTS', 'FLAGS', 'OK'], {
        ctx: options.ctx
      });
      const mailboxInfo = (0, _commandParser.parseSELECT)(response);
      _this5._changeState(STATE_SELECTED);
      if (_this5._selectedMailbox !== path && _this5.onclosemailbox) {
        yield _this5.onclosemailbox(_this5._selectedMailbox);
      }
      _this5._selectedMailbox = path;
      if (_this5.onselectmailbox) {
        yield _this5.onselectmailbox(path, mailboxInfo);
      }
      return mailboxInfo;
    })();
  }

  /**
   * Subscribe to a mailbox with the given path
   *
   * SUBSCRIBE details:
   *   https://tools.ietf.org/html/rfc3501#section-6.3.6
   *
   * @param {String} path
   *     The path of the mailbox you would like to subscribe to.
   * @returns {Promise}
   *     Promise resolves if mailbox is now subscribed to or was so already.
   */
  subscribeMailbox(path) {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      _this6.logger.debug('Subscribing to mailbox', path, '...');
      return _this6.exec({
        command: 'SUBSCRIBE',
        attributes: [path]
      });
    })();
  }

  /**
   * Unsubscribe from a mailbox with the given path
   *
   * UNSUBSCRIBE details:
   *   https://tools.ietf.org/html/rfc3501#section-6.3.7
   *
   * @param {String} path
   *     The path of the mailbox you would like to unsubscribe from.
   * @returns {Promise}
   *     Promise resolves if mailbox is no longer subscribed to or was not before.
   */
  unsubscribeMailbox(path) {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      _this7.logger.debug('Unsubscribing to mailbox', path, '...');
      return _this7.exec({
        command: 'UNSUBSCRIBE',
        attributes: [path]
      });
    })();
  }

  /**
   * Runs NAMESPACE command
   *
   * NAMESPACE details:
   *   https://tools.ietf.org/html/rfc2342
   *
   * @returns {Promise} Promise with namespace object
   */
  listNamespaces() {
    var _this8 = this;
    return _asyncToGenerator(function* () {
      if (_this8._capability.indexOf('NAMESPACE') < 0) return false;
      _this8.logger.debug('Listing namespaces...');
      const response = yield _this8.exec('NAMESPACE', 'NAMESPACE');
      return (0, _commandParser.parseNAMESPACE)(response);
    })();
  }

  /**
   * Runs LIST and LSUB commands. Retrieves a tree of available mailboxes
   *
   * LIST details:
   *   http://tools.ietf.org/html/rfc3501#section-6.3.8
   * LSUB details:
   *   http://tools.ietf.org/html/rfc3501#section-6.3.9
   *
   * @returns {Promise} Promise with list of mailboxes
   */
  listMailboxes() {
    var _this9 = this;
    return _asyncToGenerator(function* () {
      const tree = {
        root: true,
        children: []
      };
      _this9.logger.debug('Listing mailboxes...');
      const listResponse = yield _this9.exec({
        command: 'LIST',
        attributes: ['', '*']
      }, 'LIST');
      const list = (0, _ramda.pathOr)([], ['payload', 'LIST'], listResponse);
      list.forEach(item => {
        const attr = (0, _ramda.propOr)([], 'attributes', item);
        if (attr.length < 3) return;
        const path = (0, _ramda.pathOr)('', ['2', 'value'], attr);
        const delim = (0, _ramda.pathOr)('/', ['1', 'value'], attr);
        const branch = _this9._ensurePath(tree, path, delim);
        branch.flags = (0, _ramda.propOr)([], '0', attr).map(({
          value
        }) => value || '');
        branch.listed = true;
        (0, _specialUse.checkSpecialUse)(branch);
      });
      const lsubResponse = yield _this9.exec({
        command: 'LSUB',
        attributes: ['', '*']
      }, 'LSUB');
      const lsub = (0, _ramda.pathOr)([], ['payload', 'LSUB'], lsubResponse);
      lsub.forEach(item => {
        const attr = (0, _ramda.propOr)([], 'attributes', item);
        if (attr.length < 3) return;
        const path = (0, _ramda.pathOr)('', ['2', 'value'], attr);
        const delim = (0, _ramda.pathOr)('/', ['1', 'value'], attr);
        const branch = _this9._ensurePath(tree, path, delim);
        (0, _ramda.propOr)([], '0', attr).map((flag = '') => {
          branch.flags = (0, _ramda.union)(branch.flags, [flag]);
        });
        branch.subscribed = true;
      });
      return tree;
    })();
  }

  /**
   * Create a mailbox with the given path.
   *
   * CREATE details:
   *   http://tools.ietf.org/html/rfc3501#section-6.3.3
   *
   * @param {String} path
   *     The path of the mailbox you would like to create.
   * @returns {Promise}
   *     Promise resolves if mailbox was created.
   *     In the event the server says NO [ALREADYEXISTS], we treat that as success.
   */
  createMailbox(path) {
    var _this10 = this;
    return _asyncToGenerator(function* () {
      _this10.logger.debug('Creating mailbox', path, '...');
      try {
        yield _this10.exec({
          command: 'CREATE',
          attributes: [path]
        });
      } catch (err) {
        if (err && err.code === 'ALREADYEXISTS') {
          return;
        }
        throw err;
      }
    })();
  }

  /**
   * Delete a mailbox with the given path.
   *
   * DELETE details:
   *   https://tools.ietf.org/html/rfc3501#section-6.3.4
   *
   * @param {String} path
   *     The path of the mailbox you would like to delete.
   * @returns {Promise}
   *     Promise resolves if mailbox was deleted.
   */
  deleteMailbox(path) {
    this.logger.debug('Deleting mailbox', path, '...');
    return this.exec({
      command: 'DELETE',
      attributes: [path]
    });
  }

  /**
   * Runs FETCH command
   *
   * FETCH details:
   *   http://tools.ietf.org/html/rfc3501#section-6.4.5
   * CHANGEDSINCE details:
   *   https://tools.ietf.org/html/rfc4551#section-3.3
   *
   * @param {String} path The path for the mailbox which should be selected for the command. Selects mailbox if necessary
   * @param {String} sequence Sequence set, eg 1:* for all messages
   * @param {Object} [items] Message data item names or macro
   * @param {Object} [options] Query modifiers
   * @returns {Promise} Promise with the fetched message info
   */
  listMessages(path, sequence, items = [{
    fast: true
  }], options = {}) {
    var _this11 = this;
    return _asyncToGenerator(function* () {
      _this11.logger.debug('Fetching messages', sequence, 'from', path, '...');
      const command = (0, _commandBuilder.buildFETCHCommand)(sequence, items, options);
      const response = yield _this11.exec(command, 'FETCH', {
        precheck: ctx => _this11._shouldSelectMailbox(path, ctx) ? _this11.selectMailbox(path, {
          ctx
        }) : Promise.resolve()
      });
      return (0, _commandParser.parseFETCH)(response);
    })();
  }

  /**
   * Runs SEARCH command
   *
   * SEARCH details:
   *   http://tools.ietf.org/html/rfc3501#section-6.4.4
   *
   * @param {String} path The path for the mailbox which should be selected for the command. Selects mailbox if necessary
   * @param {Object} query Search terms
   * @param {Object} [options] Query modifiers
   * @returns {Promise} Promise with the array of matching seq. or uid numbers
   */
  search(path, query, options = {}) {
    var _this12 = this;
    return _asyncToGenerator(function* () {
      _this12.logger.debug('Searching in', path, '...');
      const command = (0, _commandBuilder.buildSEARCHCommand)(query, options);
      const response = yield _this12.exec(command, 'SEARCH', {
        precheck: ctx => _this12._shouldSelectMailbox(path, ctx) ? _this12.selectMailbox(path, {
          ctx
        }) : Promise.resolve()
      });
      return (0, _commandParser.parseSEARCH)(response);
    })();
  }

  /**
   * Runs STORE command
   *
   * STORE details:
   *   http://tools.ietf.org/html/rfc3501#section-6.4.6
   *
   * @param {String} path The path for the mailbox which should be selected for the command. Selects mailbox if necessary
   * @param {String} sequence Message selector which the flag change is applied to
   * @param {Array} flags
   * @param {Object} [options] Query modifiers
   * @returns {Promise} Promise with the array of matching seq. or uid numbers
   */
  setFlags(path, sequence, flags, options) {
    let key = '';
    let list = [];
    if (Array.isArray(flags) || typeof flags !== 'object') {
      list = [].concat(flags || []);
      key = '';
    } else if (flags.add) {
      list = [].concat(flags.add || []);
      key = '+';
    } else if (flags.set) {
      key = '';
      list = [].concat(flags.set || []);
    } else if (flags.remove) {
      key = '-';
      list = [].concat(flags.remove || []);
    }
    this.logger.debug('Setting flags on', sequence, 'in', path, '...');
    return this.store(path, sequence, key + 'FLAGS', list, options);
  }

  /**
   * Runs STORE command
   *
   * STORE details:
   *   http://tools.ietf.org/html/rfc3501#section-6.4.6
   *
   * @param {String} path The path for the mailbox which should be selected for the command. Selects mailbox if necessary
   * @param {String} sequence Message selector which the flag change is applied to
   * @param {String} action STORE method to call, eg "+FLAGS"
   * @param {Array} flags
   * @param {Object} [options] Query modifiers
   * @returns {Promise} Promise with the array of matching seq. or uid numbers
   */
  store(path, sequence, action, flags, options = {}) {
    var _this13 = this;
    return _asyncToGenerator(function* () {
      const command = (0, _commandBuilder.buildSTORECommand)(sequence, action, flags, options);
      const response = yield _this13.exec(command, 'FETCH', {
        precheck: ctx => _this13._shouldSelectMailbox(path, ctx) ? _this13.selectMailbox(path, {
          ctx
        }) : Promise.resolve()
      });
      return (0, _commandParser.parseFETCH)(response);
    })();
  }

  /**
   * Runs APPEND command
   *
   * APPEND details:
   *   http://tools.ietf.org/html/rfc3501#section-6.3.11
   *
   * @param {String} destination The mailbox where to append the message
   * @param {String} message The message to append
   * @param {Array} options.flags Any flags you want to set on the uploaded message. Defaults to [\Seen]. (optional)
   * @returns {Promise} Promise with the array of matching seq. or uid numbers
   */
  upload(destination, message, options = {}) {
    var _this14 = this;
    return _asyncToGenerator(function* () {
      const flags = (0, _ramda.propOr)(['\\Seen'], 'flags', options).map(value => ({
        type: 'atom',
        value
      }));
      const command = {
        command: 'APPEND',
        attributes: [{
          type: 'atom',
          value: destination
        }, flags, {
          type: 'literal',
          value: message
        }]
      };
      _this14.logger.debug('Uploading message to', destination, '...');
      const response = yield _this14.exec(command);
      return (0, _commandParser.parseAPPEND)(response);
    })();
  }

  /**
   * Deletes messages from a selected mailbox
   *
   * EXPUNGE details:
   *   http://tools.ietf.org/html/rfc3501#section-6.4.3
   * UID EXPUNGE details:
   *   https://tools.ietf.org/html/rfc4315#section-2.1
   *
   * If possible (byUid:true and UIDPLUS extension supported), uses UID EXPUNGE
   * command to delete a range of messages, otherwise falls back to EXPUNGE.
   *
   * NB! This method might be destructive - if EXPUNGE is used, then any messages
   * with \Deleted flag set are deleted
   *
   * @param {String} path The path for the mailbox which should be selected for the command. Selects mailbox if necessary
   * @param {String} sequence Message range to be deleted
   * @param {Object} [options] Query modifiers
   * @returns {Promise} Promise
   */
  deleteMessages(path, sequence, options = {}) {
    var _this15 = this;
    return _asyncToGenerator(function* () {
      // add \Deleted flag to the messages and run EXPUNGE or UID EXPUNGE
      _this15.logger.debug('Deleting messages', sequence, 'in', path, '...');
      const useUidPlus = options.byUid && _this15._capability.indexOf('UIDPLUS') >= 0;
      const uidExpungeCommand = {
        command: 'UID EXPUNGE',
        attributes: [{
          type: 'sequence',
          value: sequence
        }]
      };
      yield _this15.setFlags(path, sequence, {
        add: '\\Deleted'
      }, options);
      const cmd = useUidPlus ? uidExpungeCommand : 'EXPUNGE';
      return _this15.exec(cmd, null, {
        precheck: ctx => _this15._shouldSelectMailbox(path, ctx) ? _this15.selectMailbox(path, {
          ctx
        }) : Promise.resolve()
      });
    })();
  }

  /**
   * Copies a range of messages from the active mailbox to the destination mailbox.
   * Silent method (unless an error occurs), by default returns no information.
   *
   * COPY details:
   *   http://tools.ietf.org/html/rfc3501#section-6.4.7
   *
   * @param {String} path The path for the mailbox which should be selected for the command. Selects mailbox if necessary
   * @param {String} sequence Message range to be copied
   * @param {String} destination Destination mailbox path
   * @param {Object} [options] Query modifiers
   * @param {Boolean} [options.byUid] If true, uses UID COPY instead of COPY
   * @returns {Promise} Promise
   */
  copyMessages(path, sequence, destination, options = {}) {
    var _this16 = this;
    return _asyncToGenerator(function* () {
      _this16.logger.debug('Copying messages', sequence, 'from', path, 'to', destination, '...');
      const response = yield _this16.exec({
        command: options.byUid ? 'UID COPY' : 'COPY',
        attributes: [{
          type: 'sequence',
          value: sequence
        }, {
          type: 'atom',
          value: destination
        }]
      }, null, {
        precheck: ctx => _this16._shouldSelectMailbox(path, ctx) ? _this16.selectMailbox(path, {
          ctx
        }) : Promise.resolve()
      });
      return (0, _commandParser.parseCOPY)(response);
    })();
  }

  /**
   * Moves a range of messages from the active mailbox to the destination mailbox.
   * Prefers the MOVE extension but if not available, falls back to
   * COPY + EXPUNGE
   *
   * MOVE details:
   *   http://tools.ietf.org/html/rfc6851
   *
   * @param {String} path The path for the mailbox which should be selected for the command. Selects mailbox if necessary
   * @param {String} sequence Message range to be moved
   * @param {String} destination Destination mailbox path
   * @param {Object} [options] Query modifiers
   * @returns {Promise} Promise
   */
  moveMessages(path, sequence, destination, options = {}) {
    var _this17 = this;
    return _asyncToGenerator(function* () {
      _this17.logger.debug('Moving messages', sequence, 'from', path, 'to', destination, '...');
      if (_this17._capability.indexOf('MOVE') === -1) {
        // Fallback to COPY + EXPUNGE
        yield _this17.copyMessages(path, sequence, destination, options);
        return _this17.deleteMessages(path, sequence, options);
      }

      // If possible, use MOVE
      return _this17.exec({
        command: options.byUid ? 'UID MOVE' : 'MOVE',
        attributes: [{
          type: 'sequence',
          value: sequence
        }, {
          type: 'atom',
          value: destination
        }]
      }, ['OK'], {
        precheck: ctx => _this17._shouldSelectMailbox(path, ctx) ? _this17.selectMailbox(path, {
          ctx
        }) : Promise.resolve()
      });
    })();
  }

  /**
   * Runs COMPRESS command
   *
   * COMPRESS details:
   *   https://tools.ietf.org/html/rfc4978
   */
  compressConnection() {
    var _this18 = this;
    return _asyncToGenerator(function* () {
      if (!_this18._enableCompression || _this18._capability.indexOf('COMPRESS=DEFLATE') < 0 || _this18.client.compressed) {
        return false;
      }
      _this18.logger.debug('Enabling compression...');
      yield _this18.exec({
        command: 'COMPRESS',
        attributes: [{
          type: 'ATOM',
          value: 'DEFLATE'
        }]
      });
      _this18.client.enableCompression();
      _this18.logger.debug('Compression enabled, all data sent and received is deflated!');
    })();
  }

  /**
   * Runs LOGIN or AUTHENTICATE XOAUTH2 command
   *
   * LOGIN details:
   *   http://tools.ietf.org/html/rfc3501#section-6.2.3
   * XOAUTH2 details:
   *   https://developers.google.com/gmail/xoauth2_protocol#imap_protocol_exchange
   *
   * @param {String} auth.user
   * @param {String} auth.pass
   * @param {String} auth.xoauth2
   */
  login(auth) {
    var _this19 = this;
    return _asyncToGenerator(function* () {
      let command;
      const options = {};
      if (!auth) {
        throw new Error('Authentication information not provided');
      }
      if (_this19._capability.indexOf('AUTH=XOAUTH2') >= 0 && auth && auth.xoauth2) {
        command = {
          command: 'AUTHENTICATE',
          attributes: [{
            type: 'ATOM',
            value: 'XOAUTH2'
          }, {
            type: 'ATOM',
            value: (0, _commandBuilder.buildXOAuth2Token)(auth.user, auth.xoauth2),
            sensitive: true
          }]
        };
        options.errorResponseExpectsEmptyLine = true; // + tagged error response expects an empty line in return
      } else {
        command = {
          command: 'login',
          attributes: [{
            type: 'STRING',
            value: auth.user || ''
          }, {
            type: 'STRING',
            value: auth.pass || '',
            sensitive: true
          }]
        };
      }
      _this19.logger.debug('Logging in...');
      const response = yield _this19.exec(command, 'capability', options);
      /*
       * update post-auth capabilites
       * capability list shouldn't contain auth related stuff anymore
       * but some new extensions might have popped up that do not
       * make much sense in the non-auth state
       */
      if (response.capability && response.capability.length) {
        // capabilites were listed with the OK [CAPABILITY ...] response
        _this19._capability = response.capability;
      } else if (response.payload && response.payload.CAPABILITY && response.payload.CAPABILITY.length) {
        // capabilites were listed with * CAPABILITY ... response
        _this19._capability = response.payload.CAPABILITY.pop().attributes.map((capa = '') => capa.value.toUpperCase().trim());
      } else {
        // capabilities were not automatically listed, reload
        yield _this19.updateCapability(true);
      }
      _this19._changeState(STATE_AUTHENTICATED);
      _this19._authenticated = true;
      _this19.logger.debug('Login successful, post-auth capabilites updated!', _this19._capability);
    })();
  }

  /**
   * Run an IMAP command.
   *
   * @param {Object} request Structured request object
   * @param {Array} acceptUntagged a list of untagged responses that will be included in 'payload' property
   */
  exec(request, acceptUntagged, options) {
    var _this20 = this;
    return _asyncToGenerator(function* () {
      _this20.breakIdle();
      const response = yield _this20.client.enqueueCommand(request, acceptUntagged, options);
      if (response && response.capability) {
        _this20._capability = response.capability;
      }
      return response;
    })();
  }

  /**
   * The connection is idling. Sends a NOOP or IDLE command
   *
   * IDLE details:
   *   https://tools.ietf.org/html/rfc2177
   */
  enterIdle() {
    if (this._enteredIdle) {
      return;
    }
    const supportsIdle = this._capability.indexOf('IDLE') >= 0;
    this._enteredIdle = supportsIdle && this._selectedMailbox ? 'IDLE' : 'NOOP';
    this.logger.debug('Entering idle with ' + this._enteredIdle);
    if (this._enteredIdle === 'NOOP') {
      this._idleTimeout = setTimeout(() => {
        this.logger.debug('Sending NOOP');
        this.exec('NOOP');
      }, this.timeoutNoop);
    } else if (this._enteredIdle === 'IDLE') {
      this.client.enqueueCommand({
        command: 'IDLE'
      });
      this._idleTimeout = setTimeout(() => {
        this.client.send('DONE\r\n');
        this._enteredIdle = false;
        this.logger.debug('Idle terminated');
      }, this.timeoutIdle);
    }
  }

  /**
   * Stops actions related idling, if IDLE is supported, sends DONE to stop it
   */
  breakIdle() {
    if (!this._enteredIdle) {
      return;
    }
    clearTimeout(this._idleTimeout);
    if (this._enteredIdle === 'IDLE') {
      this.client.send('DONE\r\n');
      this.logger.debug('Idle terminated');
    }
    this._enteredIdle = false;
  }

  /**
   * Runs STARTTLS command if needed
   *
   * STARTTLS details:
   *   http://tools.ietf.org/html/rfc3501#section-6.2.1
   *
   * @param {Boolean} [forced] By default the command is not run if capability is already listed. Set to true to skip this validation
   */
  upgradeConnection() {
    var _this21 = this;
    return _asyncToGenerator(function* () {
      // skip request, if already secured
      if (_this21.client.secureMode) {
        return false;
      }

      // skip if STARTTLS not available or starttls support disabled
      if ((_this21._capability.indexOf('STARTTLS') < 0 || _this21._ignoreTLS) && !_this21._requireTLS) {
        return false;
      }
      _this21.logger.debug('Encrypting connection...');
      yield _this21.exec('STARTTLS');
      _this21._capability = [];
      _this21.client.upgrade();
      return _this21.updateCapability();
    })();
  }

  /**
   * Runs CAPABILITY command
   *
   * CAPABILITY details:
   *   http://tools.ietf.org/html/rfc3501#section-6.1.1
   *
   * Doesn't register untagged CAPABILITY handler as this is already
   * handled by global handler
   *
   * @param {Boolean} [forced] By default the command is not run if capability is already listed. Set to true to skip this validation
   */
  updateCapability(forced) {
    var _this22 = this;
    return _asyncToGenerator(function* () {
      // skip request, if not forced update and capabilities are already loaded
      if (!forced && _this22._capability.length) {
        return;
      }

      // If STARTTLS is required then skip capability listing as we are going to try
      // STARTTLS anyway and we re-check capabilities after connection is secured
      if (!_this22.client.secureMode && _this22._requireTLS) {
        return;
      }
      _this22.logger.debug('Updating capability...');
      return _this22.exec('CAPABILITY');
    })();
  }
  hasCapability(capa = '') {
    return this._capability.indexOf(capa.toUpperCase().trim()) >= 0;
  }
  getOkGreeting() {
    return this._okGreeting;
  }

  // Default handlers for untagged responses

  /**
   * Checks if an untagged OK includes [CAPABILITY] tag and updates capability object
   * Also stores the human readable string from the untagged response
   * See https://tools.ietf.org/html/rfc3501#section-7.1.1
   *
   * @param {Object} response Parsed server response
   * @param {Function} next Until called, server responses are not processed
   */
  _untaggedOkHandler(response) {
    if (response) {
      if (response.capability) {
        this._capability = response.capability;
      }
      this._humanReadable = response.humanReadable;
    }
  }

  /**
   * Updates capability object
   *
   * @param {Object} response Parsed server response
   * @param {Function} next Until called, server responses are not processed
   */
  _untaggedCapabilityHandler(response) {
    this._capability = (0, _ramda.pipe)((0, _ramda.propOr)([], 'attributes'), (0, _ramda.map)(({
      value
    }) => (value || '').toUpperCase().trim()))(response);
  }

  /**
   * Updates existing message count
   *
   * @param {Object} response Parsed server response
   * @param {Function} next Until called, server responses are not processed
   */
  _untaggedExistsHandler(response) {
    if (response && Object.prototype.hasOwnProperty.call(response, 'nr')) {
      this.onupdate && this.onupdate(this._selectedMailbox, 'exists', response.nr);
    }
  }

  /**
   * Indicates a message has been deleted
   *
   * @param {Object} response Parsed server response
   * @param {Function} next Until called, server responses are not processed
   */
  _untaggedExpungeHandler(response) {
    if (response && Object.prototype.hasOwnProperty.call(response, 'nr')) {
      this.onupdate && this.onupdate(this._selectedMailbox, 'expunge', response.nr);
    }
  }

  /**
   * Indicates that flags have been updated for a message
   *
   * @param {Object} response Parsed server response
   * @param {Function} next Until called, server responses are not processed
   */
  _untaggedFetchHandler(response) {
    this.onupdate && this.onupdate(this._selectedMailbox, 'fetch', [].concat((0, _commandParser.parseFETCH)({
      payload: {
        FETCH: [response]
      }
    }) || []).shift());
  }

  // Private helpers

  /**
   * Indicates that the connection started idling. Initiates a cycle
   * of NOOPs or IDLEs to receive notifications about updates in the server
   */
  _onIdle() {
    if (!this._authenticated || this._enteredIdle) {
      // No need to IDLE when not logged in or already idling
      return;
    }
    this.logger.debug('Client started idling');
    this.enterIdle();
  }

  /**
   * Updates the IMAP state value for the current connection
   *
   * @param {Number} newState The state you want to change to
   */
  _changeState(newState) {
    if (newState === this._state) {
      return;
    }
    this.logger.debug('Entering state: ' + newState);

    // if a mailbox was opened, emit onclosemailbox and clear selectedMailbox value
    if (this._state === STATE_SELECTED && this._selectedMailbox) {
      this.onclosemailbox && this.onclosemailbox(this._selectedMailbox);
      this._selectedMailbox = false;
    }
    this._state = newState;
  }

  /**
   * Ensures a path exists in the Mailbox tree
   *
   * @param {Object} tree Mailbox tree
   * @param {String} path
   * @param {String} delimiter
   * @return {Object} branch for used path
   */
  _ensurePath(tree, path, delimiter) {
    const names = path.split(delimiter);
    let branch = tree;
    for (let i = 0; i < names.length; i++) {
      let found = false;
      for (let j = 0; j < branch.children.length; j++) {
        if (this._compareMailboxNames(branch.children[j].name, (0, _emailjsUtf.imapDecode)(names[i]))) {
          branch = branch.children[j];
          found = true;
          break;
        }
      }
      if (!found) {
        branch.children.push({
          name: (0, _emailjsUtf.imapDecode)(names[i]),
          delimiter: delimiter,
          path: names.slice(0, i + 1).join(delimiter),
          children: []
        });
        branch = branch.children[branch.children.length - 1];
      }
    }
    return branch;
  }

  /**
   * Compares two mailbox names. Case insensitive in case of INBOX, otherwise case sensitive
   *
   * @param {String} a Mailbox name
   * @param {String} b Mailbox name
   * @returns {Boolean} True if the folder names match
   */
  _compareMailboxNames(a, b) {
    return (a.toUpperCase() === 'INBOX' ? 'INBOX' : a) === (b.toUpperCase() === 'INBOX' ? 'INBOX' : b);
  }
  createLogger(creator = _logger.default) {
    const logger = creator((this._auth || {}).user || '', this._host);
    this.logger = this.client.logger = {
      debug: (...msgs) => {
        if (_common.LOG_LEVEL_DEBUG >= this.logLevel) {
          logger.debug(msgs);
        }
      },
      info: (...msgs) => {
        if (_common.LOG_LEVEL_INFO >= this.logLevel) {
          logger.info(msgs);
        }
      },
      warn: (...msgs) => {
        if (_common.LOG_LEVEL_WARN >= this.logLevel) {
          logger.warn(msgs);
        }
      },
      error: (...msgs) => {
        if (_common.LOG_LEVEL_ERROR >= this.logLevel) {
          logger.error(msgs);
        }
      }
    };
  }
}
exports.default = Client;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJUSU1FT1VUX0NPTk5FQ1RJT04iLCJUSU1FT1VUX05PT1AiLCJUSU1FT1VUX0lETEUiLCJTVEFURV9DT05ORUNUSU5HIiwiU1RBVEVfTk9UX0FVVEhFTlRJQ0FURUQiLCJTVEFURV9BVVRIRU5USUNBVEVEIiwiU1RBVEVfU0VMRUNURUQiLCJTVEFURV9MT0dPVVQiLCJERUZBVUxUX0NMSUVOVF9JRCIsIm5hbWUiLCJDbGllbnQiLCJjb25zdHJ1Y3RvciIsImhvc3QiLCJwb3J0Iiwib3B0aW9ucyIsInRpbWVvdXRDb25uZWN0aW9uIiwidGltZW91dE5vb3AiLCJ0aW1lb3V0SWRsZSIsInNlcnZlcklkIiwib25jZXJ0Iiwib251cGRhdGUiLCJvbnNlbGVjdG1haWxib3giLCJvbmNsb3NlbWFpbGJveCIsIl9ob3N0IiwiX2NsaWVudElkIiwicHJvcE9yIiwiX3N0YXRlIiwiX2F1dGhlbnRpY2F0ZWQiLCJfY2FwYWJpbGl0eSIsIl9odW1hblJlYWRhYmxlIiwiX29rR3JlZXRpbmciLCJfc2VsZWN0ZWRNYWlsYm94IiwiX2VudGVyZWRJZGxlIiwiX2lkbGVUaW1lb3V0IiwiX2VuYWJsZUNvbXByZXNzaW9uIiwiZW5hYmxlQ29tcHJlc3Npb24iLCJfYXV0aCIsImF1dGgiLCJfcmVxdWlyZVRMUyIsInJlcXVpcmVUTFMiLCJfaWdub3JlVExTIiwiaWdub3JlVExTIiwiY2xpZW50IiwiSW1hcENsaWVudCIsIm9uZXJyb3IiLCJfb25FcnJvciIsImJpbmQiLCJjZXJ0Iiwib25pZGxlIiwiX29uSWRsZSIsInNldEhhbmRsZXIiLCJyZXNwb25zZSIsIl91bnRhZ2dlZENhcGFiaWxpdHlIYW5kbGVyIiwiX3VudGFnZ2VkT2tIYW5kbGVyIiwiX3VudGFnZ2VkRXhpc3RzSGFuZGxlciIsIl91bnRhZ2dlZEV4cHVuZ2VIYW5kbGVyIiwiX3VudGFnZ2VkRmV0Y2hIYW5kbGVyIiwiY3JlYXRlTG9nZ2VyIiwibG9nTGV2ZWwiLCJMT0dfTEVWRUxfQUxMIiwiZXJyIiwiY2xlYXJUaW1lb3V0IiwiY29ubmVjdCIsIm9wZW5Db25uZWN0aW9uIiwidXBncmFkZUNvbm5lY3Rpb24iLCJ1cGRhdGVJZCIsImNvbW1hbmQiLCJsb2dnZXIiLCJ3YXJuIiwibWVzc2FnZSIsImxvZ2luIiwiY29tcHJlc3NDb25uZWN0aW9uIiwiZGVidWciLCJlcnJvciIsImNsb3NlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJjb25uZWN0aW9uVGltZW91dCIsInNldFRpbWVvdXQiLCJFcnJvciIsIl9jaGFuZ2VTdGF0ZSIsInRoZW4iLCJvbnJlYWR5IiwidXBkYXRlQ2FwYWJpbGl0eSIsImNhdGNoIiwibG9nb3V0IiwiaWQiLCJpbmRleE9mIiwiYXR0cmlidXRlcyIsImZsYXR0ZW4iLCJPYmplY3QiLCJlbnRyaWVzIiwiZXhlYyIsImxpc3QiLCJwYXRoT3IiLCJtYXAiLCJ2YWx1ZXMiLCJrZXlzIiwiZmlsdGVyIiwiXyIsImkiLCJmcm9tUGFpcnMiLCJ6aXAiLCJfc2hvdWxkU2VsZWN0TWFpbGJveCIsInBhdGgiLCJjdHgiLCJwcmV2aW91c1NlbGVjdCIsImdldFByZXZpb3VzbHlRdWV1ZWQiLCJyZXF1ZXN0IiwicGF0aEF0dHJpYnV0ZSIsImZpbmQiLCJhdHRyaWJ1dGUiLCJ0eXBlIiwidmFsdWUiLCJzZWxlY3RNYWlsYm94IiwicXVlcnkiLCJyZWFkT25seSIsImNvbmRzdG9yZSIsInB1c2giLCJtYWlsYm94SW5mbyIsInBhcnNlU0VMRUNUIiwic3Vic2NyaWJlTWFpbGJveCIsInVuc3Vic2NyaWJlTWFpbGJveCIsImxpc3ROYW1lc3BhY2VzIiwicGFyc2VOQU1FU1BBQ0UiLCJsaXN0TWFpbGJveGVzIiwidHJlZSIsInJvb3QiLCJjaGlsZHJlbiIsImxpc3RSZXNwb25zZSIsImZvckVhY2giLCJpdGVtIiwiYXR0ciIsImxlbmd0aCIsImRlbGltIiwiYnJhbmNoIiwiX2Vuc3VyZVBhdGgiLCJmbGFncyIsImxpc3RlZCIsImNoZWNrU3BlY2lhbFVzZSIsImxzdWJSZXNwb25zZSIsImxzdWIiLCJmbGFnIiwidW5pb24iLCJzdWJzY3JpYmVkIiwiY3JlYXRlTWFpbGJveCIsImNvZGUiLCJkZWxldGVNYWlsYm94IiwibGlzdE1lc3NhZ2VzIiwic2VxdWVuY2UiLCJpdGVtcyIsImZhc3QiLCJidWlsZEZFVENIQ29tbWFuZCIsInByZWNoZWNrIiwicGFyc2VGRVRDSCIsInNlYXJjaCIsImJ1aWxkU0VBUkNIQ29tbWFuZCIsInBhcnNlU0VBUkNIIiwic2V0RmxhZ3MiLCJrZXkiLCJBcnJheSIsImlzQXJyYXkiLCJjb25jYXQiLCJhZGQiLCJzZXQiLCJyZW1vdmUiLCJzdG9yZSIsImFjdGlvbiIsImJ1aWxkU1RPUkVDb21tYW5kIiwidXBsb2FkIiwiZGVzdGluYXRpb24iLCJwYXJzZUFQUEVORCIsImRlbGV0ZU1lc3NhZ2VzIiwidXNlVWlkUGx1cyIsImJ5VWlkIiwidWlkRXhwdW5nZUNvbW1hbmQiLCJjbWQiLCJjb3B5TWVzc2FnZXMiLCJwYXJzZUNPUFkiLCJtb3ZlTWVzc2FnZXMiLCJjb21wcmVzc2VkIiwieG9hdXRoMiIsImJ1aWxkWE9BdXRoMlRva2VuIiwidXNlciIsInNlbnNpdGl2ZSIsImVycm9yUmVzcG9uc2VFeHBlY3RzRW1wdHlMaW5lIiwicGFzcyIsImNhcGFiaWxpdHkiLCJwYXlsb2FkIiwiQ0FQQUJJTElUWSIsInBvcCIsImNhcGEiLCJ0b1VwcGVyQ2FzZSIsInRyaW0iLCJhY2NlcHRVbnRhZ2dlZCIsImJyZWFrSWRsZSIsImVucXVldWVDb21tYW5kIiwiZW50ZXJJZGxlIiwic3VwcG9ydHNJZGxlIiwic2VuZCIsInNlY3VyZU1vZGUiLCJ1cGdyYWRlIiwiZm9yY2VkIiwiaGFzQ2FwYWJpbGl0eSIsImdldE9rR3JlZXRpbmciLCJodW1hblJlYWRhYmxlIiwicGlwZSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsIm5yIiwiRkVUQ0giLCJzaGlmdCIsIm5ld1N0YXRlIiwiZGVsaW1pdGVyIiwibmFtZXMiLCJzcGxpdCIsImZvdW5kIiwiaiIsIl9jb21wYXJlTWFpbGJveE5hbWVzIiwiaW1hcERlY29kZSIsInNsaWNlIiwiam9pbiIsImEiLCJiIiwiY3JlYXRvciIsImNyZWF0ZURlZmF1bHRMb2dnZXIiLCJtc2dzIiwiTE9HX0xFVkVMX0RFQlVHIiwiaW5mbyIsIkxPR19MRVZFTF9JTkZPIiwiTE9HX0xFVkVMX1dBUk4iLCJMT0dfTEVWRUxfRVJST1IiXSwic291cmNlcyI6WyIuLi9zcmMvY2xpZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1hcCwgcGlwZSwgdW5pb24sIHppcCwgZnJvbVBhaXJzLCBwcm9wT3IsIHBhdGhPciwgZmxhdHRlbiB9IGZyb20gJ3JhbWRhJ1xuaW1wb3J0IHsgaW1hcERlY29kZSB9IGZyb20gJ2VtYWlsanMtdXRmNydcbmltcG9ydCB7XG4gIHBhcnNlQVBQRU5ELFxuICBwYXJzZUNPUFksXG4gIHBhcnNlTkFNRVNQQUNFLFxuICBwYXJzZVNFTEVDVCxcbiAgcGFyc2VGRVRDSCxcbiAgcGFyc2VTRUFSQ0hcbn0gZnJvbSAnLi9jb21tYW5kLXBhcnNlcidcbmltcG9ydCB7XG4gIGJ1aWxkRkVUQ0hDb21tYW5kLFxuICBidWlsZFhPQXV0aDJUb2tlbixcbiAgYnVpbGRTRUFSQ0hDb21tYW5kLFxuICBidWlsZFNUT1JFQ29tbWFuZFxufSBmcm9tICcuL2NvbW1hbmQtYnVpbGRlcidcblxuaW1wb3J0IGNyZWF0ZURlZmF1bHRMb2dnZXIgZnJvbSAnLi9sb2dnZXInXG5pbXBvcnQgSW1hcENsaWVudCBmcm9tICcuL2ltYXAnXG5pbXBvcnQge1xuICBMT0dfTEVWRUxfRVJST1IsXG4gIExPR19MRVZFTF9XQVJOLFxuICBMT0dfTEVWRUxfSU5GTyxcbiAgTE9HX0xFVkVMX0RFQlVHLFxuICBMT0dfTEVWRUxfQUxMXG59IGZyb20gJy4vY29tbW9uJ1xuXG5pbXBvcnQge1xuICBjaGVja1NwZWNpYWxVc2Vcbn0gZnJvbSAnLi9zcGVjaWFsLXVzZSdcblxuZXhwb3J0IGNvbnN0IFRJTUVPVVRfQ09OTkVDVElPTiA9IDkwICogMTAwMCAvLyBNaWxsaXNlY29uZHMgdG8gd2FpdCBmb3IgdGhlIElNQVAgZ3JlZXRpbmcgZnJvbSB0aGUgc2VydmVyXG5leHBvcnQgY29uc3QgVElNRU9VVF9OT09QID0gNjAgKiAxMDAwIC8vIE1pbGxpc2Vjb25kcyBiZXR3ZWVuIE5PT1AgY29tbWFuZHMgd2hpbGUgaWRsaW5nXG5leHBvcnQgY29uc3QgVElNRU9VVF9JRExFID0gNjAgKiAxMDAwIC8vIE1pbGxpc2Vjb25kcyB1bnRpbCBJRExFIGNvbW1hbmQgaXMgY2FuY2VsbGVkXG5cbmV4cG9ydCBjb25zdCBTVEFURV9DT05ORUNUSU5HID0gMVxuZXhwb3J0IGNvbnN0IFNUQVRFX05PVF9BVVRIRU5USUNBVEVEID0gMlxuZXhwb3J0IGNvbnN0IFNUQVRFX0FVVEhFTlRJQ0FURUQgPSAzXG5leHBvcnQgY29uc3QgU1RBVEVfU0VMRUNURUQgPSA0XG5leHBvcnQgY29uc3QgU1RBVEVfTE9HT1VUID0gNVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DTElFTlRfSUQgPSB7XG4gIG5hbWU6ICdlbWFpbGpzLWltYXAtY2xpZW50J1xufVxuXG4vKipcbiAqIGVtYWlsanMgSU1BUCBjbGllbnRcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gW2hvc3Q9J2xvY2FsaG9zdCddIEhvc3RuYW1lIHRvIGNvbmVuY3QgdG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbcG9ydD0xNDNdIFBvcnQgbnVtYmVyIHRvIGNvbm5lY3QgdG9cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gT3B0aW9uYWwgb3B0aW9ucyBvYmplY3RcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IHtcbiAgY29uc3RydWN0b3IgKGhvc3QsIHBvcnQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMudGltZW91dENvbm5lY3Rpb24gPSBUSU1FT1VUX0NPTk5FQ1RJT05cbiAgICB0aGlzLnRpbWVvdXROb29wID0gVElNRU9VVF9OT09QXG4gICAgdGhpcy50aW1lb3V0SWRsZSA9IFRJTUVPVVRfSURMRVxuXG4gICAgdGhpcy5zZXJ2ZXJJZCA9IGZhbHNlIC8vIFJGQyAyOTcxIFNlcnZlciBJRCBhcyBrZXkgdmFsdWUgcGFpcnNcblxuICAgIC8vIEV2ZW50IHBsYWNlaG9sZGVyc1xuICAgIHRoaXMub25jZXJ0ID0gbnVsbFxuICAgIHRoaXMub251cGRhdGUgPSBudWxsXG4gICAgdGhpcy5vbnNlbGVjdG1haWxib3ggPSBudWxsXG4gICAgdGhpcy5vbmNsb3NlbWFpbGJveCA9IG51bGxcblxuICAgIHRoaXMuX2hvc3QgPSBob3N0XG4gICAgdGhpcy5fY2xpZW50SWQgPSBwcm9wT3IoREVGQVVMVF9DTElFTlRfSUQsICdpZCcsIG9wdGlvbnMpXG4gICAgdGhpcy5fc3RhdGUgPSBmYWxzZSAvLyBDdXJyZW50IHN0YXRlXG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IGZhbHNlIC8vIElzIHRoZSBjb25uZWN0aW9uIGF1dGhlbnRpY2F0ZWRcbiAgICB0aGlzLl9jYXBhYmlsaXR5ID0gW10gLy8gTGlzdCBvZiBleHRlbnNpb25zIHRoZSBzZXJ2ZXIgc3VwcG9ydHNcbiAgICB0aGlzLl9odW1hblJlYWRhYmxlID0gJydcbiAgICB0aGlzLl9va0dyZWV0aW5nID0gJydcbiAgICB0aGlzLl9zZWxlY3RlZE1haWxib3ggPSBmYWxzZSAvLyBTZWxlY3RlZCBtYWlsYm94XG4gICAgdGhpcy5fZW50ZXJlZElkbGUgPSBmYWxzZVxuICAgIHRoaXMuX2lkbGVUaW1lb3V0ID0gZmFsc2VcbiAgICB0aGlzLl9lbmFibGVDb21wcmVzc2lvbiA9ICEhb3B0aW9ucy5lbmFibGVDb21wcmVzc2lvblxuICAgIHRoaXMuX2F1dGggPSBvcHRpb25zLmF1dGhcbiAgICB0aGlzLl9yZXF1aXJlVExTID0gISFvcHRpb25zLnJlcXVpcmVUTFNcbiAgICB0aGlzLl9pZ25vcmVUTFMgPSAhIW9wdGlvbnMuaWdub3JlVExTXG5cbiAgICB0aGlzLmNsaWVudCA9IG5ldyBJbWFwQ2xpZW50KGhvc3QsIHBvcnQsIG9wdGlvbnMpIC8vIElNQVAgY2xpZW50IG9iamVjdFxuXG4gICAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgICB0aGlzLmNsaWVudC5vbmVycm9yID0gdGhpcy5fb25FcnJvci5iaW5kKHRoaXMpXG4gICAgdGhpcy5jbGllbnQub25jZXJ0ID0gKGNlcnQpID0+ICh0aGlzLm9uY2VydCAmJiB0aGlzLm9uY2VydChjZXJ0KSkgLy8gYWxsb3dzIGNlcnRpZmljYXRlIGhhbmRsaW5nIGZvciBwbGF0Zm9ybXMgdy9vIG5hdGl2ZSB0bHMgc3VwcG9ydFxuICAgIHRoaXMuY2xpZW50Lm9uaWRsZSA9ICgpID0+IHRoaXMuX29uSWRsZSgpIC8vIHN0YXJ0IGlkbGluZ1xuXG4gICAgLy8gRGVmYXVsdCBoYW5kbGVycyBmb3IgdW50YWdnZWQgcmVzcG9uc2VzXG4gICAgdGhpcy5jbGllbnQuc2V0SGFuZGxlcignY2FwYWJpbGl0eScsIChyZXNwb25zZSkgPT4gdGhpcy5fdW50YWdnZWRDYXBhYmlsaXR5SGFuZGxlcihyZXNwb25zZSkpIC8vIGNhcGFiaWxpdHkgdXBkYXRlc1xuICAgIHRoaXMuY2xpZW50LnNldEhhbmRsZXIoJ29rJywgKHJlc3BvbnNlKSA9PiB0aGlzLl91bnRhZ2dlZE9rSGFuZGxlcihyZXNwb25zZSkpIC8vIG5vdGlmaWNhdGlvbnNcbiAgICB0aGlzLmNsaWVudC5zZXRIYW5kbGVyKCdleGlzdHMnLCAocmVzcG9uc2UpID0+IHRoaXMuX3VudGFnZ2VkRXhpc3RzSGFuZGxlcihyZXNwb25zZSkpIC8vIG1lc3NhZ2UgY291bnQgaGFzIGNoYW5nZWRcbiAgICB0aGlzLmNsaWVudC5zZXRIYW5kbGVyKCdleHB1bmdlJywgKHJlc3BvbnNlKSA9PiB0aGlzLl91bnRhZ2dlZEV4cHVuZ2VIYW5kbGVyKHJlc3BvbnNlKSkgLy8gbWVzc2FnZSBoYXMgYmVlbiBkZWxldGVkXG4gICAgdGhpcy5jbGllbnQuc2V0SGFuZGxlcignZmV0Y2gnLCAocmVzcG9uc2UpID0+IHRoaXMuX3VudGFnZ2VkRmV0Y2hIYW5kbGVyKHJlc3BvbnNlKSkgLy8gbWVzc2FnZSBoYXMgYmVlbiB1cGRhdGVkIChlZy4gZmxhZyBjaGFuZ2UpXG5cbiAgICAvLyBBY3RpdmF0ZSBsb2dnaW5nXG4gICAgdGhpcy5jcmVhdGVMb2dnZXIoKVxuICAgIHRoaXMubG9nTGV2ZWwgPSBwcm9wT3IoTE9HX0xFVkVMX0FMTCwgJ2xvZ0xldmVsJywgb3B0aW9ucylcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgaWYgdGhlIGxvd2VyLWxldmVsIEltYXBDbGllbnQgaGFzIGVuY291bnRlcmVkIGFuIHVucmVjb3ZlcmFibGVcbiAgICogZXJyb3IgZHVyaW5nIG9wZXJhdGlvbi4gQ2xlYW5zIHVwIGFuZCBwcm9wYWdhdGVzIHRoZSBlcnJvciB1cHdhcmRzLlxuICAgKi9cbiAgX29uRXJyb3IgKGVycikge1xuICAgIC8vIG1ha2Ugc3VyZSBubyBpZGxlIHRpbWVvdXQgaXMgcGVuZGluZyBhbnltb3JlXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2lkbGVUaW1lb3V0KVxuXG4gICAgLy8gcHJvcGFnYXRlIHRoZSBlcnJvciB1cHdhcmRzXG4gICAgdGhpcy5vbmVycm9yICYmIHRoaXMub25lcnJvcihlcnIpXG4gIH1cblxuICAvL1xuICAvL1xuICAvLyBQVUJMSUMgQVBJXG4gIC8vXG4gIC8vXG5cbiAgLyoqXG4gICAqIEluaXRpYXRlIGNvbm5lY3Rpb24gYW5kIGxvZ2luIHRvIHRoZSBJTUFQIHNlcnZlclxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGVuIGxvZ2luIHByb2NlZHVyZSBpcyBjb21wbGV0ZVxuICAgKi9cbiAgYXN5bmMgY29ubmVjdCAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMub3BlbkNvbm5lY3Rpb24oKVxuICAgICAgYXdhaXQgdGhpcy51cGdyYWRlQ29ubmVjdGlvbigpXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMudXBkYXRlSWQodGhpcy5fY2xpZW50SWQpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKGVyci5jb21tYW5kID09PSAnQkFEJykge1xuICAgICAgICAgIC8vIERvIG5vdCBmYWlsIGNvbm5lY3Rpb24gZXZlbiB0aG91Z2ggSUQgY29tbWFuZCB0dXJucyBvdXQgQkFELCBlLmcuXG4gICAgICAgICAgLy8gcG9jenRhLm8yLnBsIGxpc3RzIElEIGNhcGFiaWxpdHkgYm90aCBiZWZvcmUgYW5kIGFmdGVyIGxvZ2luIHdoaWxlXG4gICAgICAgICAgLy8gaXQgb25seSB3b3JrcyBhZnRlciBsb2dpbi5cbiAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKCdGYWlsZWQgdG8gdXBkYXRlIHNlcnZlciBpZCEnLCBlcnIubWVzc2FnZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZS10aHJvdyBvdGhlciBlcnJvcnMgKGUuZy4gc29ja2V0IGVycm9ycykuXG4gICAgICAgICAgdGhyb3cgZXJyXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5sb2dpbih0aGlzLl9hdXRoKVxuICAgICAgYXdhaXQgdGhpcy5jb21wcmVzc0Nvbm5lY3Rpb24oKVxuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ0Nvbm5lY3Rpb24gZXN0YWJsaXNoZWQsIHJlYWR5IHRvIHJvbGwhJylcbiAgICAgIHRoaXMuY2xpZW50Lm9uZXJyb3IgPSB0aGlzLl9vbkVycm9yLmJpbmQodGhpcylcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdDb3VsZCBub3QgY29ubmVjdCB0byBzZXJ2ZXInLCBlcnIpXG4gICAgICB0aGlzLmNsb3NlKGVycikgLy8gd2UgZG9uJ3QgcmVhbGx5IGNhcmUgd2hldGhlciB0aGlzIHdvcmtzIG9yIG5vdFxuICAgICAgdGhyb3cgZXJyXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlIGNvbm5lY3Rpb24gdG8gdGhlIElNQVAgc2VydmVyXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBjYXBhYmlsaXR5IG9mIHNlcnZlciB3aXRob3V0IGxvZ2luXG4gICAqL1xuICBvcGVuQ29ubmVjdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGNvbm5lY3Rpb25UaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiByZWplY3QobmV3IEVycm9yKCdUaW1lb3V0IGNvbm5lY3RpbmcgdG8gc2VydmVyJykpLCB0aGlzLnRpbWVvdXRDb25uZWN0aW9uKVxuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ0Nvbm5lY3RpbmcgdG8nLCB0aGlzLmNsaWVudC5ob3N0LCAnOicsIHRoaXMuY2xpZW50LnBvcnQpXG4gICAgICB0aGlzLl9jaGFuZ2VTdGF0ZShTVEFURV9DT05ORUNUSU5HKVxuICAgICAgdGhpcy5jbGllbnQuY29ubmVjdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnU29ja2V0IG9wZW5lZCwgd2FpdGluZyBmb3IgZ3JlZXRpbmcgZnJvbSB0aGUgc2VydmVyLi4uJylcblxuICAgICAgICB0aGlzLmNsaWVudC5vbnJlYWR5ID0gKCkgPT4ge1xuICAgICAgICAgIGNsZWFyVGltZW91dChjb25uZWN0aW9uVGltZW91dClcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VTdGF0ZShTVEFURV9OT1RfQVVUSEVOVElDQVRFRClcbiAgICAgICAgICAvKiBUaGUgaHVtYW4tcmVhZGFibGUgc3RyaW5nIG9uIGNvbm5lY3Rpb24gc3RhcnR1cCBpcyB0aGUgT0stZ3JlZXRpbmdcbiAgICAgICAgICAgICBTZWUgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM1MDEjc2VjdGlvbi03LjEuMVxuICAgICAgICAgICAgIGFuZCBkaWFncmFtIGluIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNTAxI3NlY3Rpb24tMy40ICovXG4gICAgICAgICAgdGhpcy5fb2tHcmVldGluZyA9IHRoaXMuX2h1bWFuUmVhZGFibGVcbiAgICAgICAgICB0aGlzLnVwZGF0ZUNhcGFiaWxpdHkoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzb2x2ZSh0aGlzLl9jYXBhYmlsaXR5KSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xpZW50Lm9uZXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KGNvbm5lY3Rpb25UaW1lb3V0KVxuICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKHJlamVjdClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIExvZ291dFxuICAgKlxuICAgKiBTZW5kIExPR09VVCwgdG8gd2hpY2ggdGhlIHNlcnZlciByZXNwb25kcyBieSBjbG9zaW5nIHRoZSBjb25uZWN0aW9uLlxuICAgKiBVc2UgaXMgZGlzY291cmFnZWQgaWYgbmV0d29yayBzdGF0dXMgaXMgdW5jbGVhciEgSWYgbmV0d29ya3Mgc3RhdHVzIGlzXG4gICAqIHVuY2xlYXIsIHBsZWFzZSB1c2UgI2Nsb3NlIGluc3RlYWQhXG4gICAqXG4gICAqIExPR09VVCBkZXRhaWxzOlxuICAgKiAgIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNTAxI3NlY3Rpb24tNi4xLjNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHdoZW4gc2VydmVyIGhhcyBjbG9zZWQgdGhlIGNvbm5lY3Rpb25cbiAgICovXG4gIGFzeW5jIGxvZ291dCAoKSB7XG4gICAgdGhpcy5fY2hhbmdlU3RhdGUoU1RBVEVfTE9HT1VUKVxuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdMb2dnaW5nIG91dC4uLicpXG4gICAgYXdhaXQgdGhpcy5jbGllbnQubG9nb3V0KClcbiAgICBjbGVhclRpbWVvdXQodGhpcy5faWRsZVRpbWVvdXQpXG4gIH1cblxuICAvKipcbiAgICogRm9yY2UtY2xvc2VzIHRoZSBjdXJyZW50IGNvbm5lY3Rpb24gYnkgY2xvc2luZyB0aGUgVENQIHNvY2tldC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHdoZW4gc29ja2V0IGlzIGNsb3NlZFxuICAgKi9cbiAgYXN5bmMgY2xvc2UgKGVycikge1xuICAgIHRoaXMuX2NoYW5nZVN0YXRlKFNUQVRFX0xPR09VVClcbiAgICBjbGVhclRpbWVvdXQodGhpcy5faWRsZVRpbWVvdXQpXG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0Nsb3NpbmcgY29ubmVjdGlvbi4uLicpXG4gICAgYXdhaXQgdGhpcy5jbGllbnQuY2xvc2UoZXJyKVxuICAgIGNsZWFyVGltZW91dCh0aGlzLl9pZGxlVGltZW91dClcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIElEIGNvbW1hbmQsIHBhcnNlcyBJRCByZXNwb25zZSwgc2V0cyB0aGlzLnNlcnZlcklkXG4gICAqXG4gICAqIElEIGRldGFpbHM6XG4gICAqICAgaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMjk3MVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gaWQgSUQgYXMgSlNPTiBvYmplY3QuIFNlZSBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMyOTcxI3NlY3Rpb24tMy4zIGZvciBwb3NzaWJsZSB2YWx1ZXNcbiAgICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHdoZW4gcmVzcG9uc2UgaGFzIGJlZW4gcGFyc2VkXG4gICAqL1xuICBhc3luYyB1cGRhdGVJZCAoaWQpIHtcbiAgICBpZiAodGhpcy5fY2FwYWJpbGl0eS5pbmRleE9mKCdJRCcpIDwgMCkgcmV0dXJuXG5cbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnVXBkYXRpbmcgaWQuLi4nKVxuXG4gICAgY29uc3QgY29tbWFuZCA9ICdJRCdcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gaWQgPyBbZmxhdHRlbihPYmplY3QuZW50cmllcyhpZCkpXSA6IFtudWxsXVxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5leGVjKHsgY29tbWFuZCwgYXR0cmlidXRlcyB9LCAnSUQnKVxuICAgIGNvbnN0IGxpc3QgPSBmbGF0dGVuKHBhdGhPcihbXSwgWydwYXlsb2FkJywgJ0lEJywgJzAnLCAnYXR0cmlidXRlcycsICcwJ10sIHJlc3BvbnNlKS5tYXAoT2JqZWN0LnZhbHVlcykpXG4gICAgY29uc3Qga2V5cyA9IGxpc3QuZmlsdGVyKChfLCBpKSA9PiBpICUgMiA9PT0gMClcbiAgICBjb25zdCB2YWx1ZXMgPSBsaXN0LmZpbHRlcigoXywgaSkgPT4gaSAlIDIgPT09IDEpXG4gICAgdGhpcy5zZXJ2ZXJJZCA9IGZyb21QYWlycyh6aXAoa2V5cywgdmFsdWVzKSlcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnU2VydmVyIGlkIHVwZGF0ZWQhJywgdGhpcy5zZXJ2ZXJJZClcbiAgfVxuXG4gIF9zaG91bGRTZWxlY3RNYWlsYm94IChwYXRoLCBjdHgpIHtcbiAgICBpZiAoIWN0eCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aW91c1NlbGVjdCA9IHRoaXMuY2xpZW50LmdldFByZXZpb3VzbHlRdWV1ZWQoWydTRUxFQ1QnLCAnRVhBTUlORSddLCBjdHgpXG4gICAgaWYgKHByZXZpb3VzU2VsZWN0ICYmIHByZXZpb3VzU2VsZWN0LnJlcXVlc3QuYXR0cmlidXRlcykge1xuICAgICAgY29uc3QgcGF0aEF0dHJpYnV0ZSA9IHByZXZpb3VzU2VsZWN0LnJlcXVlc3QuYXR0cmlidXRlcy5maW5kKChhdHRyaWJ1dGUpID0+IGF0dHJpYnV0ZS50eXBlID09PSAnU1RSSU5HJylcbiAgICAgIGlmIChwYXRoQXR0cmlidXRlKSB7XG4gICAgICAgIHJldHVybiBwYXRoQXR0cmlidXRlLnZhbHVlICE9PSBwYXRoXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkTWFpbGJveCAhPT0gcGF0aFxuICB9XG5cbiAgLyoqXG4gICAqIFJ1bnMgU0VMRUNUIG9yIEVYQU1JTkUgdG8gb3BlbiBhIG1haWxib3hcbiAgICpcbiAgICogU0VMRUNUIGRldGFpbHM6XG4gICAqICAgaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzUwMSNzZWN0aW9uLTYuMy4xXG4gICAqIEVYQU1JTkUgZGV0YWlsczpcbiAgICogICBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNTAxI3NlY3Rpb24tNi4zLjJcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggRnVsbCBwYXRoIHRvIG1haWxib3hcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBPcHRpb25zIG9iamVjdFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aXRoIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzZWxlY3RlZCBtYWlsYm94XG4gICAqL1xuICBhc3luYyBzZWxlY3RNYWlsYm94IChwYXRoLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBxdWVyeSA9IHtcbiAgICAgIGNvbW1hbmQ6IG9wdGlvbnMucmVhZE9ubHkgPyAnRVhBTUlORScgOiAnU0VMRUNUJyxcbiAgICAgIGF0dHJpYnV0ZXM6IFt7IHR5cGU6ICdTVFJJTkcnLCB2YWx1ZTogcGF0aCB9XVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmNvbmRzdG9yZSAmJiB0aGlzLl9jYXBhYmlsaXR5LmluZGV4T2YoJ0NPTkRTVE9SRScpID49IDApIHtcbiAgICAgIHF1ZXJ5LmF0dHJpYnV0ZXMucHVzaChbeyB0eXBlOiAnQVRPTScsIHZhbHVlOiAnQ09ORFNUT1JFJyB9XSlcbiAgICB9XG5cbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnT3BlbmluZycsIHBhdGgsICcuLi4nKVxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5leGVjKHF1ZXJ5LCBbJ0VYSVNUUycsICdGTEFHUycsICdPSyddLCB7IGN0eDogb3B0aW9ucy5jdHggfSlcbiAgICBjb25zdCBtYWlsYm94SW5mbyA9IHBhcnNlU0VMRUNUKHJlc3BvbnNlKVxuXG4gICAgdGhpcy5fY2hhbmdlU3RhdGUoU1RBVEVfU0VMRUNURUQpXG5cbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRNYWlsYm94ICE9PSBwYXRoICYmIHRoaXMub25jbG9zZW1haWxib3gpIHtcbiAgICAgIGF3YWl0IHRoaXMub25jbG9zZW1haWxib3godGhpcy5fc2VsZWN0ZWRNYWlsYm94KVxuICAgIH1cbiAgICB0aGlzLl9zZWxlY3RlZE1haWxib3ggPSBwYXRoXG4gICAgaWYgKHRoaXMub25zZWxlY3RtYWlsYm94KSB7XG4gICAgICBhd2FpdCB0aGlzLm9uc2VsZWN0bWFpbGJveChwYXRoLCBtYWlsYm94SW5mbylcbiAgICB9XG5cbiAgICByZXR1cm4gbWFpbGJveEluZm9cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmUgdG8gYSBtYWlsYm94IHdpdGggdGhlIGdpdmVuIHBhdGhcbiAgICpcbiAgICogU1VCU0NSSUJFIGRldGFpbHM6XG4gICAqICAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM1MDEjc2VjdGlvbi02LjMuNlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiAgICAgVGhlIHBhdGggb2YgdGhlIG1haWxib3ggeW91IHdvdWxkIGxpa2UgdG8gc3Vic2NyaWJlIHRvLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICogICAgIFByb21pc2UgcmVzb2x2ZXMgaWYgbWFpbGJveCBpcyBub3cgc3Vic2NyaWJlZCB0byBvciB3YXMgc28gYWxyZWFkeS5cbiAgICovXG4gIGFzeW5jIHN1YnNjcmliZU1haWxib3ggKHBhdGgpIHtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnU3Vic2NyaWJpbmcgdG8gbWFpbGJveCcsIHBhdGgsICcuLi4nKVxuICAgIHJldHVybiB0aGlzLmV4ZWMoeyBjb21tYW5kOiAnU1VCU0NSSUJFJywgYXR0cmlidXRlczogW3BhdGhdIH0pXG4gIH1cblxuICAvKipcbiAgICogVW5zdWJzY3JpYmUgZnJvbSBhIG1haWxib3ggd2l0aCB0aGUgZ2l2ZW4gcGF0aFxuICAgKlxuICAgKiBVTlNVQlNDUklCRSBkZXRhaWxzOlxuICAgKiAgIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNTAxI3NlY3Rpb24tNi4zLjdcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogICAgIFRoZSBwYXRoIG9mIHRoZSBtYWlsYm94IHlvdSB3b3VsZCBsaWtlIHRvIHVuc3Vic2NyaWJlIGZyb20uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKiAgICAgUHJvbWlzZSByZXNvbHZlcyBpZiBtYWlsYm94IGlzIG5vIGxvbmdlciBzdWJzY3JpYmVkIHRvIG9yIHdhcyBub3QgYmVmb3JlLlxuICAgKi9cbiAgYXN5bmMgdW5zdWJzY3JpYmVNYWlsYm94IChwYXRoKSB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ1Vuc3Vic2NyaWJpbmcgdG8gbWFpbGJveCcsIHBhdGgsICcuLi4nKVxuICAgIHJldHVybiB0aGlzLmV4ZWMoeyBjb21tYW5kOiAnVU5TVUJTQ1JJQkUnLCBhdHRyaWJ1dGVzOiBbcGF0aF0gfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIE5BTUVTUEFDRSBjb21tYW5kXG4gICAqXG4gICAqIE5BTUVTUEFDRSBkZXRhaWxzOlxuICAgKiAgIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMyMzQyXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggbmFtZXNwYWNlIG9iamVjdFxuICAgKi9cbiAgYXN5bmMgbGlzdE5hbWVzcGFjZXMgKCkge1xuICAgIGlmICh0aGlzLl9jYXBhYmlsaXR5LmluZGV4T2YoJ05BTUVTUEFDRScpIDwgMCkgcmV0dXJuIGZhbHNlXG5cbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnTGlzdGluZyBuYW1lc3BhY2VzLi4uJylcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZXhlYygnTkFNRVNQQUNFJywgJ05BTUVTUEFDRScpXG4gICAgcmV0dXJuIHBhcnNlTkFNRVNQQUNFKHJlc3BvbnNlKVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1bnMgTElTVCBhbmQgTFNVQiBjb21tYW5kcy4gUmV0cmlldmVzIGEgdHJlZSBvZiBhdmFpbGFibGUgbWFpbGJveGVzXG4gICAqXG4gICAqIExJU1QgZGV0YWlsczpcbiAgICogICBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNTAxI3NlY3Rpb24tNi4zLjhcbiAgICogTFNVQiBkZXRhaWxzOlxuICAgKiAgIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM1MDEjc2VjdGlvbi02LjMuOVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aXRoIGxpc3Qgb2YgbWFpbGJveGVzXG4gICAqL1xuICBhc3luYyBsaXN0TWFpbGJveGVzICgpIHtcbiAgICBjb25zdCB0cmVlID0geyByb290OiB0cnVlLCBjaGlsZHJlbjogW10gfVxuXG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0xpc3RpbmcgbWFpbGJveGVzLi4uJylcbiAgICBjb25zdCBsaXN0UmVzcG9uc2UgPSBhd2FpdCB0aGlzLmV4ZWMoeyBjb21tYW5kOiAnTElTVCcsIGF0dHJpYnV0ZXM6IFsnJywgJyonXSB9LCAnTElTVCcpXG4gICAgY29uc3QgbGlzdCA9IHBhdGhPcihbXSwgWydwYXlsb2FkJywgJ0xJU1QnXSwgbGlzdFJlc3BvbnNlKVxuICAgIGxpc3QuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGF0dHIgPSBwcm9wT3IoW10sICdhdHRyaWJ1dGVzJywgaXRlbSlcbiAgICAgIGlmIChhdHRyLmxlbmd0aCA8IDMpIHJldHVyblxuXG4gICAgICBjb25zdCBwYXRoID0gcGF0aE9yKCcnLCBbJzInLCAndmFsdWUnXSwgYXR0cilcbiAgICAgIGNvbnN0IGRlbGltID0gcGF0aE9yKCcvJywgWycxJywgJ3ZhbHVlJ10sIGF0dHIpXG4gICAgICBjb25zdCBicmFuY2ggPSB0aGlzLl9lbnN1cmVQYXRoKHRyZWUsIHBhdGgsIGRlbGltKVxuICAgICAgYnJhbmNoLmZsYWdzID0gcHJvcE9yKFtdLCAnMCcsIGF0dHIpLm1hcCgoeyB2YWx1ZSB9KSA9PiB2YWx1ZSB8fCAnJylcbiAgICAgIGJyYW5jaC5saXN0ZWQgPSB0cnVlXG4gICAgICBjaGVja1NwZWNpYWxVc2UoYnJhbmNoKVxuICAgIH0pXG5cbiAgICBjb25zdCBsc3ViUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmV4ZWMoeyBjb21tYW5kOiAnTFNVQicsIGF0dHJpYnV0ZXM6IFsnJywgJyonXSB9LCAnTFNVQicpXG4gICAgY29uc3QgbHN1YiA9IHBhdGhPcihbXSwgWydwYXlsb2FkJywgJ0xTVUInXSwgbHN1YlJlc3BvbnNlKVxuICAgIGxzdWIuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgYXR0ciA9IHByb3BPcihbXSwgJ2F0dHJpYnV0ZXMnLCBpdGVtKVxuICAgICAgaWYgKGF0dHIubGVuZ3RoIDwgMykgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHBhdGggPSBwYXRoT3IoJycsIFsnMicsICd2YWx1ZSddLCBhdHRyKVxuICAgICAgY29uc3QgZGVsaW0gPSBwYXRoT3IoJy8nLCBbJzEnLCAndmFsdWUnXSwgYXR0cilcbiAgICAgIGNvbnN0IGJyYW5jaCA9IHRoaXMuX2Vuc3VyZVBhdGgodHJlZSwgcGF0aCwgZGVsaW0pXG4gICAgICBwcm9wT3IoW10sICcwJywgYXR0cikubWFwKChmbGFnID0gJycpID0+IHsgYnJhbmNoLmZsYWdzID0gdW5pb24oYnJhbmNoLmZsYWdzLCBbZmxhZ10pIH0pXG4gICAgICBicmFuY2guc3Vic2NyaWJlZCA9IHRydWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIHRyZWVcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBtYWlsYm94IHdpdGggdGhlIGdpdmVuIHBhdGguXG4gICAqXG4gICAqIENSRUFURSBkZXRhaWxzOlxuICAgKiAgIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM1MDEjc2VjdGlvbi02LjMuM1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiAgICAgVGhlIHBhdGggb2YgdGhlIG1haWxib3ggeW91IHdvdWxkIGxpa2UgdG8gY3JlYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICogICAgIFByb21pc2UgcmVzb2x2ZXMgaWYgbWFpbGJveCB3YXMgY3JlYXRlZC5cbiAgICogICAgIEluIHRoZSBldmVudCB0aGUgc2VydmVyIHNheXMgTk8gW0FMUkVBRFlFWElTVFNdLCB3ZSB0cmVhdCB0aGF0IGFzIHN1Y2Nlc3MuXG4gICAqL1xuICBhc3luYyBjcmVhdGVNYWlsYm94IChwYXRoKSB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0NyZWF0aW5nIG1haWxib3gnLCBwYXRoLCAnLi4uJylcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5leGVjKHsgY29tbWFuZDogJ0NSRUFURScsIGF0dHJpYnV0ZXM6IFtwYXRoXSB9KVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gJ0FMUkVBRFlFWElTVFMnKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhyb3cgZXJyXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBhIG1haWxib3ggd2l0aCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICpcbiAgICogREVMRVRFIGRldGFpbHM6XG4gICAqICAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM1MDEjc2VjdGlvbi02LjMuNFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiAgICAgVGhlIHBhdGggb2YgdGhlIG1haWxib3ggeW91IHdvdWxkIGxpa2UgdG8gZGVsZXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICogICAgIFByb21pc2UgcmVzb2x2ZXMgaWYgbWFpbGJveCB3YXMgZGVsZXRlZC5cbiAgICovXG4gIGRlbGV0ZU1haWxib3ggKHBhdGgpIHtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnRGVsZXRpbmcgbWFpbGJveCcsIHBhdGgsICcuLi4nKVxuICAgIHJldHVybiB0aGlzLmV4ZWMoeyBjb21tYW5kOiAnREVMRVRFJywgYXR0cmlidXRlczogW3BhdGhdIH0pXG4gIH1cblxuICAvKipcbiAgICogUnVucyBGRVRDSCBjb21tYW5kXG4gICAqXG4gICAqIEZFVENIIGRldGFpbHM6XG4gICAqICAgaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzUwMSNzZWN0aW9uLTYuNC41XG4gICAqIENIQU5HRURTSU5DRSBkZXRhaWxzOlxuICAgKiAgIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM0NTUxI3NlY3Rpb24tMy4zXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIFRoZSBwYXRoIGZvciB0aGUgbWFpbGJveCB3aGljaCBzaG91bGQgYmUgc2VsZWN0ZWQgZm9yIHRoZSBjb21tYW5kLiBTZWxlY3RzIG1haWxib3ggaWYgbmVjZXNzYXJ5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZXF1ZW5jZSBTZXF1ZW5jZSBzZXQsIGVnIDE6KiBmb3IgYWxsIG1lc3NhZ2VzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbaXRlbXNdIE1lc3NhZ2UgZGF0YSBpdGVtIG5hbWVzIG9yIG1hY3JvXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gUXVlcnkgbW9kaWZpZXJzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdGhlIGZldGNoZWQgbWVzc2FnZSBpbmZvXG4gICAqL1xuICBhc3luYyBsaXN0TWVzc2FnZXMgKHBhdGgsIHNlcXVlbmNlLCBpdGVtcyA9IFt7IGZhc3Q6IHRydWUgfV0sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdGZXRjaGluZyBtZXNzYWdlcycsIHNlcXVlbmNlLCAnZnJvbScsIHBhdGgsICcuLi4nKVxuICAgIGNvbnN0IGNvbW1hbmQgPSBidWlsZEZFVENIQ29tbWFuZChzZXF1ZW5jZSwgaXRlbXMsIG9wdGlvbnMpXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmV4ZWMoY29tbWFuZCwgJ0ZFVENIJywge1xuICAgICAgcHJlY2hlY2s6IChjdHgpID0+IHRoaXMuX3Nob3VsZFNlbGVjdE1haWxib3gocGF0aCwgY3R4KSA/IHRoaXMuc2VsZWN0TWFpbGJveChwYXRoLCB7IGN0eCB9KSA6IFByb21pc2UucmVzb2x2ZSgpXG4gICAgfSlcbiAgICByZXR1cm4gcGFyc2VGRVRDSChyZXNwb25zZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIFNFQVJDSCBjb21tYW5kXG4gICAqXG4gICAqIFNFQVJDSCBkZXRhaWxzOlxuICAgKiAgIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM1MDEjc2VjdGlvbi02LjQuNFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBUaGUgcGF0aCBmb3IgdGhlIG1haWxib3ggd2hpY2ggc2hvdWxkIGJlIHNlbGVjdGVkIGZvciB0aGUgY29tbWFuZC4gU2VsZWN0cyBtYWlsYm94IGlmIG5lY2Vzc2FyeVxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnkgU2VhcmNoIHRlcm1zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gUXVlcnkgbW9kaWZpZXJzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdGhlIGFycmF5IG9mIG1hdGNoaW5nIHNlcS4gb3IgdWlkIG51bWJlcnNcbiAgICovXG4gIGFzeW5jIHNlYXJjaCAocGF0aCwgcXVlcnksIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdTZWFyY2hpbmcgaW4nLCBwYXRoLCAnLi4uJylcbiAgICBjb25zdCBjb21tYW5kID0gYnVpbGRTRUFSQ0hDb21tYW5kKHF1ZXJ5LCBvcHRpb25zKVxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5leGVjKGNvbW1hbmQsICdTRUFSQ0gnLCB7XG4gICAgICBwcmVjaGVjazogKGN0eCkgPT4gdGhpcy5fc2hvdWxkU2VsZWN0TWFpbGJveChwYXRoLCBjdHgpID8gdGhpcy5zZWxlY3RNYWlsYm94KHBhdGgsIHsgY3R4IH0pIDogUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9KVxuICAgIHJldHVybiBwYXJzZVNFQVJDSChyZXNwb25zZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIFNUT1JFIGNvbW1hbmRcbiAgICpcbiAgICogU1RPUkUgZGV0YWlsczpcbiAgICogICBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNTAxI3NlY3Rpb24tNi40LjZcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggVGhlIHBhdGggZm9yIHRoZSBtYWlsYm94IHdoaWNoIHNob3VsZCBiZSBzZWxlY3RlZCBmb3IgdGhlIGNvbW1hbmQuIFNlbGVjdHMgbWFpbGJveCBpZiBuZWNlc3NhcnlcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlcXVlbmNlIE1lc3NhZ2Ugc2VsZWN0b3Igd2hpY2ggdGhlIGZsYWcgY2hhbmdlIGlzIGFwcGxpZWQgdG9cbiAgICogQHBhcmFtIHtBcnJheX0gZmxhZ3NcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBRdWVyeSBtb2RpZmllcnNcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2l0aCB0aGUgYXJyYXkgb2YgbWF0Y2hpbmcgc2VxLiBvciB1aWQgbnVtYmVyc1xuICAgKi9cbiAgc2V0RmxhZ3MgKHBhdGgsIHNlcXVlbmNlLCBmbGFncywgb3B0aW9ucykge1xuICAgIGxldCBrZXkgPSAnJ1xuICAgIGxldCBsaXN0ID0gW11cblxuICAgIGlmIChBcnJheS5pc0FycmF5KGZsYWdzKSB8fCB0eXBlb2YgZmxhZ3MgIT09ICdvYmplY3QnKSB7XG4gICAgICBsaXN0ID0gW10uY29uY2F0KGZsYWdzIHx8IFtdKVxuICAgICAga2V5ID0gJydcbiAgICB9IGVsc2UgaWYgKGZsYWdzLmFkZCkge1xuICAgICAgbGlzdCA9IFtdLmNvbmNhdChmbGFncy5hZGQgfHwgW10pXG4gICAgICBrZXkgPSAnKydcbiAgICB9IGVsc2UgaWYgKGZsYWdzLnNldCkge1xuICAgICAga2V5ID0gJydcbiAgICAgIGxpc3QgPSBbXS5jb25jYXQoZmxhZ3Muc2V0IHx8IFtdKVxuICAgIH0gZWxzZSBpZiAoZmxhZ3MucmVtb3ZlKSB7XG4gICAgICBrZXkgPSAnLSdcbiAgICAgIGxpc3QgPSBbXS5jb25jYXQoZmxhZ3MucmVtb3ZlIHx8IFtdKVxuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdTZXR0aW5nIGZsYWdzIG9uJywgc2VxdWVuY2UsICdpbicsIHBhdGgsICcuLi4nKVxuICAgIHJldHVybiB0aGlzLnN0b3JlKHBhdGgsIHNlcXVlbmNlLCBrZXkgKyAnRkxBR1MnLCBsaXN0LCBvcHRpb25zKVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1bnMgU1RPUkUgY29tbWFuZFxuICAgKlxuICAgKiBTVE9SRSBkZXRhaWxzOlxuICAgKiAgIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM1MDEjc2VjdGlvbi02LjQuNlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBUaGUgcGF0aCBmb3IgdGhlIG1haWxib3ggd2hpY2ggc2hvdWxkIGJlIHNlbGVjdGVkIGZvciB0aGUgY29tbWFuZC4gU2VsZWN0cyBtYWlsYm94IGlmIG5lY2Vzc2FyeVxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VxdWVuY2UgTWVzc2FnZSBzZWxlY3RvciB3aGljaCB0aGUgZmxhZyBjaGFuZ2UgaXMgYXBwbGllZCB0b1xuICAgKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uIFNUT1JFIG1ldGhvZCB0byBjYWxsLCBlZyBcIitGTEFHU1wiXG4gICAqIEBwYXJhbSB7QXJyYXl9IGZsYWdzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gUXVlcnkgbW9kaWZpZXJzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdGhlIGFycmF5IG9mIG1hdGNoaW5nIHNlcS4gb3IgdWlkIG51bWJlcnNcbiAgICovXG4gIGFzeW5jIHN0b3JlIChwYXRoLCBzZXF1ZW5jZSwgYWN0aW9uLCBmbGFncywgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgY29tbWFuZCA9IGJ1aWxkU1RPUkVDb21tYW5kKHNlcXVlbmNlLCBhY3Rpb24sIGZsYWdzLCBvcHRpb25zKVxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5leGVjKGNvbW1hbmQsICdGRVRDSCcsIHtcbiAgICAgIHByZWNoZWNrOiAoY3R4KSA9PiB0aGlzLl9zaG91bGRTZWxlY3RNYWlsYm94KHBhdGgsIGN0eCkgPyB0aGlzLnNlbGVjdE1haWxib3gocGF0aCwgeyBjdHggfSkgOiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH0pXG4gICAgcmV0dXJuIHBhcnNlRkVUQ0gocmVzcG9uc2UpXG4gIH1cblxuICAvKipcbiAgICogUnVucyBBUFBFTkQgY29tbWFuZFxuICAgKlxuICAgKiBBUFBFTkQgZGV0YWlsczpcbiAgICogICBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNTAxI3NlY3Rpb24tNi4zLjExXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkZXN0aW5hdGlvbiBUaGUgbWFpbGJveCB3aGVyZSB0byBhcHBlbmQgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gYXBwZW5kXG4gICAqIEBwYXJhbSB7QXJyYXl9IG9wdGlvbnMuZmxhZ3MgQW55IGZsYWdzIHlvdSB3YW50IHRvIHNldCBvbiB0aGUgdXBsb2FkZWQgbWVzc2FnZS4gRGVmYXVsdHMgdG8gW1xcU2Vlbl0uIChvcHRpb25hbClcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2l0aCB0aGUgYXJyYXkgb2YgbWF0Y2hpbmcgc2VxLiBvciB1aWQgbnVtYmVyc1xuICAgKi9cbiAgYXN5bmMgdXBsb2FkIChkZXN0aW5hdGlvbiwgbWVzc2FnZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZmxhZ3MgPSBwcm9wT3IoWydcXFxcU2VlbiddLCAnZmxhZ3MnLCBvcHRpb25zKS5tYXAodmFsdWUgPT4gKHsgdHlwZTogJ2F0b20nLCB2YWx1ZSB9KSlcbiAgICBjb25zdCBjb21tYW5kID0ge1xuICAgICAgY29tbWFuZDogJ0FQUEVORCcsXG4gICAgICBhdHRyaWJ1dGVzOiBbXG4gICAgICAgIHsgdHlwZTogJ2F0b20nLCB2YWx1ZTogZGVzdGluYXRpb24gfSxcbiAgICAgICAgZmxhZ3MsXG4gICAgICAgIHsgdHlwZTogJ2xpdGVyYWwnLCB2YWx1ZTogbWVzc2FnZSB9XG4gICAgICBdXG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ1VwbG9hZGluZyBtZXNzYWdlIHRvJywgZGVzdGluYXRpb24sICcuLi4nKVxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5leGVjKGNvbW1hbmQpXG4gICAgcmV0dXJuIHBhcnNlQVBQRU5EKHJlc3BvbnNlKVxuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgbWVzc2FnZXMgZnJvbSBhIHNlbGVjdGVkIG1haWxib3hcbiAgICpcbiAgICogRVhQVU5HRSBkZXRhaWxzOlxuICAgKiAgIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM1MDEjc2VjdGlvbi02LjQuM1xuICAgKiBVSUQgRVhQVU5HRSBkZXRhaWxzOlxuICAgKiAgIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM0MzE1I3NlY3Rpb24tMi4xXG4gICAqXG4gICAqIElmIHBvc3NpYmxlIChieVVpZDp0cnVlIGFuZCBVSURQTFVTIGV4dGVuc2lvbiBzdXBwb3J0ZWQpLCB1c2VzIFVJRCBFWFBVTkdFXG4gICAqIGNvbW1hbmQgdG8gZGVsZXRlIGEgcmFuZ2Ugb2YgbWVzc2FnZXMsIG90aGVyd2lzZSBmYWxscyBiYWNrIHRvIEVYUFVOR0UuXG4gICAqXG4gICAqIE5CISBUaGlzIG1ldGhvZCBtaWdodCBiZSBkZXN0cnVjdGl2ZSAtIGlmIEVYUFVOR0UgaXMgdXNlZCwgdGhlbiBhbnkgbWVzc2FnZXNcbiAgICogd2l0aCBcXERlbGV0ZWQgZmxhZyBzZXQgYXJlIGRlbGV0ZWRcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggVGhlIHBhdGggZm9yIHRoZSBtYWlsYm94IHdoaWNoIHNob3VsZCBiZSBzZWxlY3RlZCBmb3IgdGhlIGNvbW1hbmQuIFNlbGVjdHMgbWFpbGJveCBpZiBuZWNlc3NhcnlcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlcXVlbmNlIE1lc3NhZ2UgcmFuZ2UgdG8gYmUgZGVsZXRlZFxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFF1ZXJ5IG1vZGlmaWVyc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZVxuICAgKi9cbiAgYXN5bmMgZGVsZXRlTWVzc2FnZXMgKHBhdGgsIHNlcXVlbmNlLCBvcHRpb25zID0ge30pIHtcbiAgICAvLyBhZGQgXFxEZWxldGVkIGZsYWcgdG8gdGhlIG1lc3NhZ2VzIGFuZCBydW4gRVhQVU5HRSBvciBVSUQgRVhQVU5HRVxuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdEZWxldGluZyBtZXNzYWdlcycsIHNlcXVlbmNlLCAnaW4nLCBwYXRoLCAnLi4uJylcbiAgICBjb25zdCB1c2VVaWRQbHVzID0gb3B0aW9ucy5ieVVpZCAmJiB0aGlzLl9jYXBhYmlsaXR5LmluZGV4T2YoJ1VJRFBMVVMnKSA+PSAwXG4gICAgY29uc3QgdWlkRXhwdW5nZUNvbW1hbmQgPSB7IGNvbW1hbmQ6ICdVSUQgRVhQVU5HRScsIGF0dHJpYnV0ZXM6IFt7IHR5cGU6ICdzZXF1ZW5jZScsIHZhbHVlOiBzZXF1ZW5jZSB9XSB9XG4gICAgYXdhaXQgdGhpcy5zZXRGbGFncyhwYXRoLCBzZXF1ZW5jZSwgeyBhZGQ6ICdcXFxcRGVsZXRlZCcgfSwgb3B0aW9ucylcbiAgICBjb25zdCBjbWQgPSB1c2VVaWRQbHVzID8gdWlkRXhwdW5nZUNvbW1hbmQgOiAnRVhQVU5HRSdcbiAgICByZXR1cm4gdGhpcy5leGVjKGNtZCwgbnVsbCwge1xuICAgICAgcHJlY2hlY2s6IChjdHgpID0+IHRoaXMuX3Nob3VsZFNlbGVjdE1haWxib3gocGF0aCwgY3R4KSA/IHRoaXMuc2VsZWN0TWFpbGJveChwYXRoLCB7IGN0eCB9KSA6IFByb21pc2UucmVzb2x2ZSgpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3BpZXMgYSByYW5nZSBvZiBtZXNzYWdlcyBmcm9tIHRoZSBhY3RpdmUgbWFpbGJveCB0byB0aGUgZGVzdGluYXRpb24gbWFpbGJveC5cbiAgICogU2lsZW50IG1ldGhvZCAodW5sZXNzIGFuIGVycm9yIG9jY3VycyksIGJ5IGRlZmF1bHQgcmV0dXJucyBubyBpbmZvcm1hdGlvbi5cbiAgICpcbiAgICogQ09QWSBkZXRhaWxzOlxuICAgKiAgIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM1MDEjc2VjdGlvbi02LjQuN1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBUaGUgcGF0aCBmb3IgdGhlIG1haWxib3ggd2hpY2ggc2hvdWxkIGJlIHNlbGVjdGVkIGZvciB0aGUgY29tbWFuZC4gU2VsZWN0cyBtYWlsYm94IGlmIG5lY2Vzc2FyeVxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VxdWVuY2UgTWVzc2FnZSByYW5nZSB0byBiZSBjb3BpZWRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRlc3RpbmF0aW9uIERlc3RpbmF0aW9uIG1haWxib3ggcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFF1ZXJ5IG1vZGlmaWVyc1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmJ5VWlkXSBJZiB0cnVlLCB1c2VzIFVJRCBDT1BZIGluc3RlYWQgb2YgQ09QWVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZVxuICAgKi9cbiAgYXN5bmMgY29weU1lc3NhZ2VzIChwYXRoLCBzZXF1ZW5jZSwgZGVzdGluYXRpb24sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdDb3B5aW5nIG1lc3NhZ2VzJywgc2VxdWVuY2UsICdmcm9tJywgcGF0aCwgJ3RvJywgZGVzdGluYXRpb24sICcuLi4nKVxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5leGVjKHtcbiAgICAgIGNvbW1hbmQ6IG9wdGlvbnMuYnlVaWQgPyAnVUlEIENPUFknIDogJ0NPUFknLFxuICAgICAgYXR0cmlidXRlczogW1xuICAgICAgICB7IHR5cGU6ICdzZXF1ZW5jZScsIHZhbHVlOiBzZXF1ZW5jZSB9LFxuICAgICAgICB7IHR5cGU6ICdhdG9tJywgdmFsdWU6IGRlc3RpbmF0aW9uIH1cbiAgICAgIF1cbiAgICB9LCBudWxsLCB7XG4gICAgICBwcmVjaGVjazogKGN0eCkgPT4gdGhpcy5fc2hvdWxkU2VsZWN0TWFpbGJveChwYXRoLCBjdHgpID8gdGhpcy5zZWxlY3RNYWlsYm94KHBhdGgsIHsgY3R4IH0pIDogUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9KVxuICAgIHJldHVybiBwYXJzZUNPUFkocmVzcG9uc2UpXG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgYSByYW5nZSBvZiBtZXNzYWdlcyBmcm9tIHRoZSBhY3RpdmUgbWFpbGJveCB0byB0aGUgZGVzdGluYXRpb24gbWFpbGJveC5cbiAgICogUHJlZmVycyB0aGUgTU9WRSBleHRlbnNpb24gYnV0IGlmIG5vdCBhdmFpbGFibGUsIGZhbGxzIGJhY2sgdG9cbiAgICogQ09QWSArIEVYUFVOR0VcbiAgICpcbiAgICogTU9WRSBkZXRhaWxzOlxuICAgKiAgIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzY4NTFcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggVGhlIHBhdGggZm9yIHRoZSBtYWlsYm94IHdoaWNoIHNob3VsZCBiZSBzZWxlY3RlZCBmb3IgdGhlIGNvbW1hbmQuIFNlbGVjdHMgbWFpbGJveCBpZiBuZWNlc3NhcnlcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlcXVlbmNlIE1lc3NhZ2UgcmFuZ2UgdG8gYmUgbW92ZWRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRlc3RpbmF0aW9uIERlc3RpbmF0aW9uIG1haWxib3ggcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFF1ZXJ5IG1vZGlmaWVyc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZVxuICAgKi9cbiAgYXN5bmMgbW92ZU1lc3NhZ2VzIChwYXRoLCBzZXF1ZW5jZSwgZGVzdGluYXRpb24sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdNb3ZpbmcgbWVzc2FnZXMnLCBzZXF1ZW5jZSwgJ2Zyb20nLCBwYXRoLCAndG8nLCBkZXN0aW5hdGlvbiwgJy4uLicpXG5cbiAgICBpZiAodGhpcy5fY2FwYWJpbGl0eS5pbmRleE9mKCdNT1ZFJykgPT09IC0xKSB7XG4gICAgICAvLyBGYWxsYmFjayB0byBDT1BZICsgRVhQVU5HRVxuICAgICAgYXdhaXQgdGhpcy5jb3B5TWVzc2FnZXMocGF0aCwgc2VxdWVuY2UsIGRlc3RpbmF0aW9uLCBvcHRpb25zKVxuICAgICAgcmV0dXJuIHRoaXMuZGVsZXRlTWVzc2FnZXMocGF0aCwgc2VxdWVuY2UsIG9wdGlvbnMpXG4gICAgfVxuXG4gICAgLy8gSWYgcG9zc2libGUsIHVzZSBNT1ZFXG4gICAgcmV0dXJuIHRoaXMuZXhlYyh7XG4gICAgICBjb21tYW5kOiBvcHRpb25zLmJ5VWlkID8gJ1VJRCBNT1ZFJyA6ICdNT1ZFJyxcbiAgICAgIGF0dHJpYnV0ZXM6IFtcbiAgICAgICAgeyB0eXBlOiAnc2VxdWVuY2UnLCB2YWx1ZTogc2VxdWVuY2UgfSxcbiAgICAgICAgeyB0eXBlOiAnYXRvbScsIHZhbHVlOiBkZXN0aW5hdGlvbiB9XG4gICAgICBdXG4gICAgfSwgWydPSyddLCB7XG4gICAgICBwcmVjaGVjazogKGN0eCkgPT4gdGhpcy5fc2hvdWxkU2VsZWN0TWFpbGJveChwYXRoLCBjdHgpID8gdGhpcy5zZWxlY3RNYWlsYm94KHBhdGgsIHsgY3R4IH0pIDogUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1bnMgQ09NUFJFU1MgY29tbWFuZFxuICAgKlxuICAgKiBDT01QUkVTUyBkZXRhaWxzOlxuICAgKiAgIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM0OTc4XG4gICAqL1xuICBhc3luYyBjb21wcmVzc0Nvbm5lY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fZW5hYmxlQ29tcHJlc3Npb24gfHwgdGhpcy5fY2FwYWJpbGl0eS5pbmRleE9mKCdDT01QUkVTUz1ERUZMQVRFJykgPCAwIHx8IHRoaXMuY2xpZW50LmNvbXByZXNzZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdFbmFibGluZyBjb21wcmVzc2lvbi4uLicpXG4gICAgYXdhaXQgdGhpcy5leGVjKHtcbiAgICAgIGNvbW1hbmQ6ICdDT01QUkVTUycsXG4gICAgICBhdHRyaWJ1dGVzOiBbe1xuICAgICAgICB0eXBlOiAnQVRPTScsXG4gICAgICAgIHZhbHVlOiAnREVGTEFURSdcbiAgICAgIH1dXG4gICAgfSlcbiAgICB0aGlzLmNsaWVudC5lbmFibGVDb21wcmVzc2lvbigpXG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0NvbXByZXNzaW9uIGVuYWJsZWQsIGFsbCBkYXRhIHNlbnQgYW5kIHJlY2VpdmVkIGlzIGRlZmxhdGVkIScpXG4gIH1cblxuICAvKipcbiAgICogUnVucyBMT0dJTiBvciBBVVRIRU5USUNBVEUgWE9BVVRIMiBjb21tYW5kXG4gICAqXG4gICAqIExPR0lOIGRldGFpbHM6XG4gICAqICAgaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzUwMSNzZWN0aW9uLTYuMi4zXG4gICAqIFhPQVVUSDIgZGV0YWlsczpcbiAgICogICBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9nbWFpbC94b2F1dGgyX3Byb3RvY29sI2ltYXBfcHJvdG9jb2xfZXhjaGFuZ2VcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGF1dGgudXNlclxuICAgKiBAcGFyYW0ge1N0cmluZ30gYXV0aC5wYXNzXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhdXRoLnhvYXV0aDJcbiAgICovXG4gIGFzeW5jIGxvZ2luIChhdXRoKSB7XG4gICAgbGV0IGNvbW1hbmRcbiAgICBjb25zdCBvcHRpb25zID0ge31cblxuICAgIGlmICghYXV0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdXRoZW50aWNhdGlvbiBpbmZvcm1hdGlvbiBub3QgcHJvdmlkZWQnKVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9jYXBhYmlsaXR5LmluZGV4T2YoJ0FVVEg9WE9BVVRIMicpID49IDAgJiYgYXV0aCAmJiBhdXRoLnhvYXV0aDIpIHtcbiAgICAgIGNvbW1hbmQgPSB7XG4gICAgICAgIGNvbW1hbmQ6ICdBVVRIRU5USUNBVEUnLFxuICAgICAgICBhdHRyaWJ1dGVzOiBbXG4gICAgICAgICAgeyB0eXBlOiAnQVRPTScsIHZhbHVlOiAnWE9BVVRIMicgfSxcbiAgICAgICAgICB7IHR5cGU6ICdBVE9NJywgdmFsdWU6IGJ1aWxkWE9BdXRoMlRva2VuKGF1dGgudXNlciwgYXV0aC54b2F1dGgyKSwgc2Vuc2l0aXZlOiB0cnVlIH1cbiAgICAgICAgXVxuICAgICAgfVxuXG4gICAgICBvcHRpb25zLmVycm9yUmVzcG9uc2VFeHBlY3RzRW1wdHlMaW5lID0gdHJ1ZSAvLyArIHRhZ2dlZCBlcnJvciByZXNwb25zZSBleHBlY3RzIGFuIGVtcHR5IGxpbmUgaW4gcmV0dXJuXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbW1hbmQgPSB7XG4gICAgICAgIGNvbW1hbmQ6ICdsb2dpbicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IFtcbiAgICAgICAgICB7IHR5cGU6ICdTVFJJTkcnLCB2YWx1ZTogYXV0aC51c2VyIHx8ICcnIH0sXG4gICAgICAgICAgeyB0eXBlOiAnU1RSSU5HJywgdmFsdWU6IGF1dGgucGFzcyB8fCAnJywgc2Vuc2l0aXZlOiB0cnVlIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdMb2dnaW5nIGluLi4uJylcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZXhlYyhjb21tYW5kLCAnY2FwYWJpbGl0eScsIG9wdGlvbnMpXG4gICAgLypcbiAgICAgKiB1cGRhdGUgcG9zdC1hdXRoIGNhcGFiaWxpdGVzXG4gICAgICogY2FwYWJpbGl0eSBsaXN0IHNob3VsZG4ndCBjb250YWluIGF1dGggcmVsYXRlZCBzdHVmZiBhbnltb3JlXG4gICAgICogYnV0IHNvbWUgbmV3IGV4dGVuc2lvbnMgbWlnaHQgaGF2ZSBwb3BwZWQgdXAgdGhhdCBkbyBub3RcbiAgICAgKiBtYWtlIG11Y2ggc2Vuc2UgaW4gdGhlIG5vbi1hdXRoIHN0YXRlXG4gICAgICovXG4gICAgaWYgKHJlc3BvbnNlLmNhcGFiaWxpdHkgJiYgcmVzcG9uc2UuY2FwYWJpbGl0eS5sZW5ndGgpIHtcbiAgICAgIC8vIGNhcGFiaWxpdGVzIHdlcmUgbGlzdGVkIHdpdGggdGhlIE9LIFtDQVBBQklMSVRZIC4uLl0gcmVzcG9uc2VcbiAgICAgIHRoaXMuX2NhcGFiaWxpdHkgPSByZXNwb25zZS5jYXBhYmlsaXR5XG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5wYXlsb2FkICYmIHJlc3BvbnNlLnBheWxvYWQuQ0FQQUJJTElUWSAmJiByZXNwb25zZS5wYXlsb2FkLkNBUEFCSUxJVFkubGVuZ3RoKSB7XG4gICAgICAvLyBjYXBhYmlsaXRlcyB3ZXJlIGxpc3RlZCB3aXRoICogQ0FQQUJJTElUWSAuLi4gcmVzcG9uc2VcbiAgICAgIHRoaXMuX2NhcGFiaWxpdHkgPSByZXNwb25zZS5wYXlsb2FkLkNBUEFCSUxJVFkucG9wKCkuYXR0cmlidXRlcy5tYXAoKGNhcGEgPSAnJykgPT4gY2FwYS52YWx1ZS50b1VwcGVyQ2FzZSgpLnRyaW0oKSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2FwYWJpbGl0aWVzIHdlcmUgbm90IGF1dG9tYXRpY2FsbHkgbGlzdGVkLCByZWxvYWRcbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlQ2FwYWJpbGl0eSh0cnVlKVxuICAgIH1cblxuICAgIHRoaXMuX2NoYW5nZVN0YXRlKFNUQVRFX0FVVEhFTlRJQ0FURUQpXG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IHRydWVcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnTG9naW4gc3VjY2Vzc2Z1bCwgcG9zdC1hdXRoIGNhcGFiaWxpdGVzIHVwZGF0ZWQhJywgdGhpcy5fY2FwYWJpbGl0eSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW4gYW4gSU1BUCBjb21tYW5kLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdCBTdHJ1Y3R1cmVkIHJlcXVlc3Qgb2JqZWN0XG4gICAqIEBwYXJhbSB7QXJyYXl9IGFjY2VwdFVudGFnZ2VkIGEgbGlzdCBvZiB1bnRhZ2dlZCByZXNwb25zZXMgdGhhdCB3aWxsIGJlIGluY2x1ZGVkIGluICdwYXlsb2FkJyBwcm9wZXJ0eVxuICAgKi9cbiAgYXN5bmMgZXhlYyAocmVxdWVzdCwgYWNjZXB0VW50YWdnZWQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmJyZWFrSWRsZSgpXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmNsaWVudC5lbnF1ZXVlQ29tbWFuZChyZXF1ZXN0LCBhY2NlcHRVbnRhZ2dlZCwgb3B0aW9ucylcbiAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuY2FwYWJpbGl0eSkge1xuICAgICAgdGhpcy5fY2FwYWJpbGl0eSA9IHJlc3BvbnNlLmNhcGFiaWxpdHlcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH1cblxuICAvKipcbiAgICogVGhlIGNvbm5lY3Rpb24gaXMgaWRsaW5nLiBTZW5kcyBhIE5PT1Agb3IgSURMRSBjb21tYW5kXG4gICAqXG4gICAqIElETEUgZGV0YWlsczpcbiAgICogICBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMjE3N1xuICAgKi9cbiAgZW50ZXJJZGxlICgpIHtcbiAgICBpZiAodGhpcy5fZW50ZXJlZElkbGUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBzdXBwb3J0c0lkbGUgPSB0aGlzLl9jYXBhYmlsaXR5LmluZGV4T2YoJ0lETEUnKSA+PSAwXG4gICAgdGhpcy5fZW50ZXJlZElkbGUgPSBzdXBwb3J0c0lkbGUgJiYgdGhpcy5fc2VsZWN0ZWRNYWlsYm94ID8gJ0lETEUnIDogJ05PT1AnXG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0VudGVyaW5nIGlkbGUgd2l0aCAnICsgdGhpcy5fZW50ZXJlZElkbGUpXG5cbiAgICBpZiAodGhpcy5fZW50ZXJlZElkbGUgPT09ICdOT09QJykge1xuICAgICAgdGhpcy5faWRsZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ1NlbmRpbmcgTk9PUCcpXG4gICAgICAgIHRoaXMuZXhlYygnTk9PUCcpXG4gICAgICB9LCB0aGlzLnRpbWVvdXROb29wKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fZW50ZXJlZElkbGUgPT09ICdJRExFJykge1xuICAgICAgdGhpcy5jbGllbnQuZW5xdWV1ZUNvbW1hbmQoe1xuICAgICAgICBjb21tYW5kOiAnSURMRSdcbiAgICAgIH0pXG4gICAgICB0aGlzLl9pZGxlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmNsaWVudC5zZW5kKCdET05FXFxyXFxuJylcbiAgICAgICAgdGhpcy5fZW50ZXJlZElkbGUgPSBmYWxzZVxuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnSWRsZSB0ZXJtaW5hdGVkJylcbiAgICAgIH0sIHRoaXMudGltZW91dElkbGUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0b3BzIGFjdGlvbnMgcmVsYXRlZCBpZGxpbmcsIGlmIElETEUgaXMgc3VwcG9ydGVkLCBzZW5kcyBET05FIHRvIHN0b3AgaXRcbiAgICovXG4gIGJyZWFrSWRsZSAoKSB7XG4gICAgaWYgKCF0aGlzLl9lbnRlcmVkSWRsZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2lkbGVUaW1lb3V0KVxuICAgIGlmICh0aGlzLl9lbnRlcmVkSWRsZSA9PT0gJ0lETEUnKSB7XG4gICAgICB0aGlzLmNsaWVudC5zZW5kKCdET05FXFxyXFxuJylcbiAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdJZGxlIHRlcm1pbmF0ZWQnKVxuICAgIH1cbiAgICB0aGlzLl9lbnRlcmVkSWRsZSA9IGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogUnVucyBTVEFSVFRMUyBjb21tYW5kIGlmIG5lZWRlZFxuICAgKlxuICAgKiBTVEFSVFRMUyBkZXRhaWxzOlxuICAgKiAgIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM1MDEjc2VjdGlvbi02LjIuMVxuICAgKlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtmb3JjZWRdIEJ5IGRlZmF1bHQgdGhlIGNvbW1hbmQgaXMgbm90IHJ1biBpZiBjYXBhYmlsaXR5IGlzIGFscmVhZHkgbGlzdGVkLiBTZXQgdG8gdHJ1ZSB0byBza2lwIHRoaXMgdmFsaWRhdGlvblxuICAgKi9cbiAgYXN5bmMgdXBncmFkZUNvbm5lY3Rpb24gKCkge1xuICAgIC8vIHNraXAgcmVxdWVzdCwgaWYgYWxyZWFkeSBzZWN1cmVkXG4gICAgaWYgKHRoaXMuY2xpZW50LnNlY3VyZU1vZGUpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIC8vIHNraXAgaWYgU1RBUlRUTFMgbm90IGF2YWlsYWJsZSBvciBzdGFydHRscyBzdXBwb3J0IGRpc2FibGVkXG4gICAgaWYgKCh0aGlzLl9jYXBhYmlsaXR5LmluZGV4T2YoJ1NUQVJUVExTJykgPCAwIHx8IHRoaXMuX2lnbm9yZVRMUykgJiYgIXRoaXMuX3JlcXVpcmVUTFMpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdFbmNyeXB0aW5nIGNvbm5lY3Rpb24uLi4nKVxuICAgIGF3YWl0IHRoaXMuZXhlYygnU1RBUlRUTFMnKVxuICAgIHRoaXMuX2NhcGFiaWxpdHkgPSBbXVxuICAgIHRoaXMuY2xpZW50LnVwZ3JhZGUoKVxuICAgIHJldHVybiB0aGlzLnVwZGF0ZUNhcGFiaWxpdHkoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1bnMgQ0FQQUJJTElUWSBjb21tYW5kXG4gICAqXG4gICAqIENBUEFCSUxJVFkgZGV0YWlsczpcbiAgICogICBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNTAxI3NlY3Rpb24tNi4xLjFcbiAgICpcbiAgICogRG9lc24ndCByZWdpc3RlciB1bnRhZ2dlZCBDQVBBQklMSVRZIGhhbmRsZXIgYXMgdGhpcyBpcyBhbHJlYWR5XG4gICAqIGhhbmRsZWQgYnkgZ2xvYmFsIGhhbmRsZXJcbiAgICpcbiAgICogQHBhcmFtIHtCb29sZWFufSBbZm9yY2VkXSBCeSBkZWZhdWx0IHRoZSBjb21tYW5kIGlzIG5vdCBydW4gaWYgY2FwYWJpbGl0eSBpcyBhbHJlYWR5IGxpc3RlZC4gU2V0IHRvIHRydWUgdG8gc2tpcCB0aGlzIHZhbGlkYXRpb25cbiAgICovXG4gIGFzeW5jIHVwZGF0ZUNhcGFiaWxpdHkgKGZvcmNlZCkge1xuICAgIC8vIHNraXAgcmVxdWVzdCwgaWYgbm90IGZvcmNlZCB1cGRhdGUgYW5kIGNhcGFiaWxpdGllcyBhcmUgYWxyZWFkeSBsb2FkZWRcbiAgICBpZiAoIWZvcmNlZCAmJiB0aGlzLl9jYXBhYmlsaXR5Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gSWYgU1RBUlRUTFMgaXMgcmVxdWlyZWQgdGhlbiBza2lwIGNhcGFiaWxpdHkgbGlzdGluZyBhcyB3ZSBhcmUgZ29pbmcgdG8gdHJ5XG4gICAgLy8gU1RBUlRUTFMgYW55d2F5IGFuZCB3ZSByZS1jaGVjayBjYXBhYmlsaXRpZXMgYWZ0ZXIgY29ubmVjdGlvbiBpcyBzZWN1cmVkXG4gICAgaWYgKCF0aGlzLmNsaWVudC5zZWN1cmVNb2RlICYmIHRoaXMuX3JlcXVpcmVUTFMpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdVcGRhdGluZyBjYXBhYmlsaXR5Li4uJylcbiAgICByZXR1cm4gdGhpcy5leGVjKCdDQVBBQklMSVRZJylcbiAgfVxuXG4gIGhhc0NhcGFiaWxpdHkgKGNhcGEgPSAnJykge1xuICAgIHJldHVybiB0aGlzLl9jYXBhYmlsaXR5LmluZGV4T2YoY2FwYS50b1VwcGVyQ2FzZSgpLnRyaW0oKSkgPj0gMFxuICB9XG5cbiAgZ2V0T2tHcmVldGluZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29rR3JlZXRpbmdcbiAgfVxuXG4gIC8vIERlZmF1bHQgaGFuZGxlcnMgZm9yIHVudGFnZ2VkIHJlc3BvbnNlc1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYW4gdW50YWdnZWQgT0sgaW5jbHVkZXMgW0NBUEFCSUxJVFldIHRhZyBhbmQgdXBkYXRlcyBjYXBhYmlsaXR5IG9iamVjdFxuICAgKiBBbHNvIHN0b3JlcyB0aGUgaHVtYW4gcmVhZGFibGUgc3RyaW5nIGZyb20gdGhlIHVudGFnZ2VkIHJlc3BvbnNlXG4gICAqIFNlZSBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzUwMSNzZWN0aW9uLTcuMS4xXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBQYXJzZWQgc2VydmVyIHJlc3BvbnNlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG5leHQgVW50aWwgY2FsbGVkLCBzZXJ2ZXIgcmVzcG9uc2VzIGFyZSBub3QgcHJvY2Vzc2VkXG4gICAqL1xuICBfdW50YWdnZWRPa0hhbmRsZXIgKHJlc3BvbnNlKSB7XG4gICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2UuY2FwYWJpbGl0eSkge1xuICAgICAgICB0aGlzLl9jYXBhYmlsaXR5ID0gcmVzcG9uc2UuY2FwYWJpbGl0eVxuICAgICAgfVxuICAgICAgdGhpcy5faHVtYW5SZWFkYWJsZSA9IHJlc3BvbnNlLmh1bWFuUmVhZGFibGVcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBjYXBhYmlsaXR5IG9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgUGFyc2VkIHNlcnZlciByZXNwb25zZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXh0IFVudGlsIGNhbGxlZCwgc2VydmVyIHJlc3BvbnNlcyBhcmUgbm90IHByb2Nlc3NlZFxuICAgKi9cbiAgX3VudGFnZ2VkQ2FwYWJpbGl0eUhhbmRsZXIgKHJlc3BvbnNlKSB7XG4gICAgdGhpcy5fY2FwYWJpbGl0eSA9IHBpcGUoXG4gICAgICBwcm9wT3IoW10sICdhdHRyaWJ1dGVzJyksXG4gICAgICBtYXAoKHsgdmFsdWUgfSkgPT4gKHZhbHVlIHx8ICcnKS50b1VwcGVyQ2FzZSgpLnRyaW0oKSlcbiAgICApKHJlc3BvbnNlKVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgZXhpc3RpbmcgbWVzc2FnZSBjb3VudFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgUGFyc2VkIHNlcnZlciByZXNwb25zZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXh0IFVudGlsIGNhbGxlZCwgc2VydmVyIHJlc3BvbnNlcyBhcmUgbm90IHByb2Nlc3NlZFxuICAgKi9cbiAgX3VudGFnZ2VkRXhpc3RzSGFuZGxlciAocmVzcG9uc2UpIHtcbiAgICBpZiAocmVzcG9uc2UgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3BvbnNlLCAnbnInKSkge1xuICAgICAgdGhpcy5vbnVwZGF0ZSAmJiB0aGlzLm9udXBkYXRlKHRoaXMuX3NlbGVjdGVkTWFpbGJveCwgJ2V4aXN0cycsIHJlc3BvbnNlLm5yKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgYSBtZXNzYWdlIGhhcyBiZWVuIGRlbGV0ZWRcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlIFBhcnNlZCBzZXJ2ZXIgcmVzcG9uc2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV4dCBVbnRpbCBjYWxsZWQsIHNlcnZlciByZXNwb25zZXMgYXJlIG5vdCBwcm9jZXNzZWRcbiAgICovXG4gIF91bnRhZ2dlZEV4cHVuZ2VIYW5kbGVyIChyZXNwb25zZSkge1xuICAgIGlmIChyZXNwb25zZSAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzcG9uc2UsICducicpKSB7XG4gICAgICB0aGlzLm9udXBkYXRlICYmIHRoaXMub251cGRhdGUodGhpcy5fc2VsZWN0ZWRNYWlsYm94LCAnZXhwdW5nZScsIHJlc3BvbnNlLm5yKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCBmbGFncyBoYXZlIGJlZW4gdXBkYXRlZCBmb3IgYSBtZXNzYWdlXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBQYXJzZWQgc2VydmVyIHJlc3BvbnNlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG5leHQgVW50aWwgY2FsbGVkLCBzZXJ2ZXIgcmVzcG9uc2VzIGFyZSBub3QgcHJvY2Vzc2VkXG4gICAqL1xuICBfdW50YWdnZWRGZXRjaEhhbmRsZXIgKHJlc3BvbnNlKSB7XG4gICAgdGhpcy5vbnVwZGF0ZSAmJiB0aGlzLm9udXBkYXRlKHRoaXMuX3NlbGVjdGVkTWFpbGJveCwgJ2ZldGNoJywgW10uY29uY2F0KHBhcnNlRkVUQ0goeyBwYXlsb2FkOiB7IEZFVENIOiBbcmVzcG9uc2VdIH0gfSkgfHwgW10pLnNoaWZ0KCkpXG4gIH1cblxuICAvLyBQcml2YXRlIGhlbHBlcnNcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoYXQgdGhlIGNvbm5lY3Rpb24gc3RhcnRlZCBpZGxpbmcuIEluaXRpYXRlcyBhIGN5Y2xlXG4gICAqIG9mIE5PT1BzIG9yIElETEVzIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9ucyBhYm91dCB1cGRhdGVzIGluIHRoZSBzZXJ2ZXJcbiAgICovXG4gIF9vbklkbGUgKCkge1xuICAgIGlmICghdGhpcy5fYXV0aGVudGljYXRlZCB8fCB0aGlzLl9lbnRlcmVkSWRsZSkge1xuICAgICAgLy8gTm8gbmVlZCB0byBJRExFIHdoZW4gbm90IGxvZ2dlZCBpbiBvciBhbHJlYWR5IGlkbGluZ1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ0NsaWVudCBzdGFydGVkIGlkbGluZycpXG4gICAgdGhpcy5lbnRlcklkbGUoKVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIElNQVAgc3RhdGUgdmFsdWUgZm9yIHRoZSBjdXJyZW50IGNvbm5lY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5ld1N0YXRlIFRoZSBzdGF0ZSB5b3Ugd2FudCB0byBjaGFuZ2UgdG9cbiAgICovXG4gIF9jaGFuZ2VTdGF0ZSAobmV3U3RhdGUpIHtcbiAgICBpZiAobmV3U3RhdGUgPT09IHRoaXMuX3N0YXRlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnRW50ZXJpbmcgc3RhdGU6ICcgKyBuZXdTdGF0ZSlcblxuICAgIC8vIGlmIGEgbWFpbGJveCB3YXMgb3BlbmVkLCBlbWl0IG9uY2xvc2VtYWlsYm94IGFuZCBjbGVhciBzZWxlY3RlZE1haWxib3ggdmFsdWVcbiAgICBpZiAodGhpcy5fc3RhdGUgPT09IFNUQVRFX1NFTEVDVEVEICYmIHRoaXMuX3NlbGVjdGVkTWFpbGJveCkge1xuICAgICAgdGhpcy5vbmNsb3NlbWFpbGJveCAmJiB0aGlzLm9uY2xvc2VtYWlsYm94KHRoaXMuX3NlbGVjdGVkTWFpbGJveClcbiAgICAgIHRoaXMuX3NlbGVjdGVkTWFpbGJveCA9IGZhbHNlXG4gICAgfVxuXG4gICAgdGhpcy5fc3RhdGUgPSBuZXdTdGF0ZVxuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZXMgYSBwYXRoIGV4aXN0cyBpbiB0aGUgTWFpbGJveCB0cmVlXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0cmVlIE1haWxib3ggdHJlZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGVsaW1pdGVyXG4gICAqIEByZXR1cm4ge09iamVjdH0gYnJhbmNoIGZvciB1c2VkIHBhdGhcbiAgICovXG4gIF9lbnN1cmVQYXRoICh0cmVlLCBwYXRoLCBkZWxpbWl0ZXIpIHtcbiAgICBjb25zdCBuYW1lcyA9IHBhdGguc3BsaXQoZGVsaW1pdGVyKVxuICAgIGxldCBicmFuY2ggPSB0cmVlXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZm91bmQgPSBmYWxzZVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBicmFuY2guY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvbXBhcmVNYWlsYm94TmFtZXMoYnJhbmNoLmNoaWxkcmVuW2pdLm5hbWUsIGltYXBEZWNvZGUobmFtZXNbaV0pKSkge1xuICAgICAgICAgIGJyYW5jaCA9IGJyYW5jaC5jaGlsZHJlbltqXVxuICAgICAgICAgIGZvdW5kID0gdHJ1ZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgYnJhbmNoLmNoaWxkcmVuLnB1c2goe1xuICAgICAgICAgIG5hbWU6IGltYXBEZWNvZGUobmFtZXNbaV0pLFxuICAgICAgICAgIGRlbGltaXRlcjogZGVsaW1pdGVyLFxuICAgICAgICAgIHBhdGg6IG5hbWVzLnNsaWNlKDAsIGkgKyAxKS5qb2luKGRlbGltaXRlciksXG4gICAgICAgICAgY2hpbGRyZW46IFtdXG4gICAgICAgIH0pXG4gICAgICAgIGJyYW5jaCA9IGJyYW5jaC5jaGlsZHJlblticmFuY2guY2hpbGRyZW4ubGVuZ3RoIC0gMV1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJyYW5jaFxuICB9XG5cbiAgLyoqXG4gICAqIENvbXBhcmVzIHR3byBtYWlsYm94IG5hbWVzLiBDYXNlIGluc2Vuc2l0aXZlIGluIGNhc2Ugb2YgSU5CT1gsIG90aGVyd2lzZSBjYXNlIHNlbnNpdGl2ZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYSBNYWlsYm94IG5hbWVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGIgTWFpbGJveCBuYW1lXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBmb2xkZXIgbmFtZXMgbWF0Y2hcbiAgICovXG4gIF9jb21wYXJlTWFpbGJveE5hbWVzIChhLCBiKSB7XG4gICAgcmV0dXJuIChhLnRvVXBwZXJDYXNlKCkgPT09ICdJTkJPWCcgPyAnSU5CT1gnIDogYSkgPT09IChiLnRvVXBwZXJDYXNlKCkgPT09ICdJTkJPWCcgPyAnSU5CT1gnIDogYilcbiAgfVxuXG4gIGNyZWF0ZUxvZ2dlciAoY3JlYXRvciA9IGNyZWF0ZURlZmF1bHRMb2dnZXIpIHtcbiAgICBjb25zdCBsb2dnZXIgPSBjcmVhdG9yKCh0aGlzLl9hdXRoIHx8IHt9KS51c2VyIHx8ICcnLCB0aGlzLl9ob3N0KVxuICAgIHRoaXMubG9nZ2VyID0gdGhpcy5jbGllbnQubG9nZ2VyID0ge1xuICAgICAgZGVidWc6ICguLi5tc2dzKSA9PiB7IGlmIChMT0dfTEVWRUxfREVCVUcgPj0gdGhpcy5sb2dMZXZlbCkgeyBsb2dnZXIuZGVidWcobXNncykgfSB9LFxuICAgICAgaW5mbzogKC4uLm1zZ3MpID0+IHsgaWYgKExPR19MRVZFTF9JTkZPID49IHRoaXMubG9nTGV2ZWwpIHsgbG9nZ2VyLmluZm8obXNncykgfSB9LFxuICAgICAgd2FybjogKC4uLm1zZ3MpID0+IHsgaWYgKExPR19MRVZFTF9XQVJOID49IHRoaXMubG9nTGV2ZWwpIHsgbG9nZ2VyLndhcm4obXNncykgfSB9LFxuICAgICAgZXJyb3I6ICguLi5tc2dzKSA9PiB7IGlmIChMT0dfTEVWRUxfRVJST1IgPj0gdGhpcy5sb2dMZXZlbCkgeyBsb2dnZXIuZXJyb3IobXNncykgfSB9XG4gICAgfVxuICB9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