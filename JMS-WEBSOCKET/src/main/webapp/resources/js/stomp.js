
(function() {
  var Byte, Client, Frame, Stomp,
    __hasProp = {}.hasOwnProperty;

  Byte = {
    LF: '\x0A',
    NULL: '\x00'
  };

  Frame = (function() {

    function Frame(command, headers, body) {
      this.command = command;
      this.headers = headers != null ? headers : {};
      this.body = body != null ? body : '';
    }

    Frame.prototype.toString = function() {
      var lines, name, value, _ref;
      lines = [this.command];
      _ref = this.headers;
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        value = _ref[name];
        lines.push("" + name + ":" + value);
      }
      if (this.body) {
        lines.push("content-length:" + ('' + this.body).length);
      }
      lines.push(Byte.LF + this.body);
      return lines.join(Byte.LF);
    };

    Frame._unmarshallSingle = function(data) {
      var body, chr, command, divider, headerLines, headers, i, idx, len, line, start, trim, _i, _j, _ref, _ref1;
      divider = data.search(RegExp("" + Byte.LF + Byte.LF));
      headerLines = data.substring(0, divider).split(Byte.LF);
      command = headerLines.shift();
      headers = {};
      trim = function(str) {
        return str.replace(/^\s+|\s+$/g, '');
      };
      line = idx = null;
      for (i = _i = 0, _ref = headerLines.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        line = headerLines[i];
        idx = line.indexOf(':');
        headers[trim(line.substring(0, idx))] = trim(line.substring(idx + 1));
      }
      body = '';
      start = divider + 2;
      if (headers['content-length']) {
        len = parseInt(headers['content-length']);
        body = ('' + data).substring(start, start + len);
      } else {
        chr = null;
        for (i = _j = start, _ref1 = data.length; start <= _ref1 ? _j < _ref1 : _j > _ref1; i = start <= _ref1 ? ++_j : --_j) {
          chr = data.charAt(i);
          if (chr === Byte.NULL) {
            break;
          }
          body += chr;
        }
      }
      return new Frame(command, headers, body);
    };

    Frame.unmarshall = function(datas) {
      var data;
      return (function() {
        var _i, _len, _ref, _results;
        _ref = datas.split(RegExp("" + Byte.NULL + Byte.LF + "*"));
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          data = _ref[_i];
          if ((data != null ? data.length : void 0) > 0) {
            _results.push(Frame._unmarshallSingle(data));
          }
        }
        return _results;
      })();
    };

    Frame.marshall = function(command, headers, body) {
      var frame;
      frame = new Frame(command, headers, body);
      return frame.toString() + Byte.NULL;
    };

    return Frame;

  })();

  Client = (function() {

    function Client(ws) {
      this.ws = ws;
      this.ws.binaryType = "arraybuffer";
      this.counter = 0;
      this.connected = false;
      this.heartbeat = {
        outgoing: 10000,
        incoming: 10000
      };
      this.subscriptions = {};
    }

    Client.prototype._transmit = function(command, headers, body) {
      var out;
      out = Frame.marshall(command, headers, body);
      if (typeof this.debug === "function") {
        this.debug(">>> " + out);
      }
      return this.ws.send(out);
    };

    Client.prototype._setupHeartbeat = function(headers) {
      var serverIncoming, serverOutgoing, ttl, v, _ref, _ref1,
        _this = this;
      if ((_ref = headers.version) !== Stomp.VERSIONS.V1_1 && _ref !== Stomp.VERSIONS.V1_2) {
        return;
      }
      _ref1 = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = headers['heart-beat'].split(",");
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          v = _ref1[_i];
          _results.push(parseInt(v));
        }
        return _results;
      })(), serverOutgoing = _ref1[0], serverIncoming = _ref1[1];
      if (!(this.heartbeat.outgoing === 0 || serverIncoming === 0)) {
        ttl = Math.max(this.heartbeat.outgoing, serverIncoming);
        if (typeof this.debug === "function") {
          this.debug("send PING every " + ttl + "ms");
        }
        this.pinger = typeof window !== "undefined" && window !== null ? window.setInterval(function() {
          _this.ws.send(Byte.LF);
          return typeof _this.debug === "function" ? _this.debug(">>> PING") : void 0;
        }, ttl) : void 0;
      }
      if (!(this.heartbeat.incoming === 0 || serverOutgoing === 0)) {
        ttl = Math.max(this.heartbeat.incoming, serverOutgoing);
        if (typeof this.debug === "function") {
          this.debug("check PONG every " + ttl + "ms");
        }
        return this.ponger = typeof window !== "undefined" && window !== null ? window.setInterval(function() {
          var delta;
          delta = Date.now() - _this.serverActivity;
          if (delta > ttl * 2) {
            if (typeof _this.debug === "function") {
              _this.debug("did not receive server activity for the last " + delta + "ms");
            }
            return _this.ws.close();
          }
        }, ttl) : void 0;
      }
    };

    Client.prototype.connect = function(login, passcode, connectCallback, errorCallback, vhost) {
      var _this = this;
      this.connectCallback = connectCallback;
      if (typeof this.debug === "function") {
        this.debug("Opening Web Socket...");
      }
      this.ws.onmessage = function(evt) {
        var arr, c, data, frame, onreceive, _i, _len, _ref, _results;
        data = typeof ArrayBuffer !== 'undefined' && evt.data instanceof ArrayBuffer ? (arr = new Uint8Array(evt.data), typeof _this.debug === "function" ? _this.debug("--- got data length: " + arr.length) : void 0, ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = arr.length; _i < _len; _i++) {
            c = arr[_i];
            _results.push(String.fromCharCode(c));
          }
          return _results;
        })()).join('')) : evt.data;
        _this.serverActivity = Date.now();
        if (data === Byte.LF) {
          if (typeof _this.debug === "function") {
            _this.debug("<<< PONG");
          }
          return;
        }
        if (typeof _this.debug === "function") {
          _this.debug("<<< " + data);
        }
        _ref = Frame.unmarshall(data);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          frame = _ref[_i];
          switch (frame.command) {
            case "CONNECTED":
              if (typeof _this.debug === "function") {
                _this.debug("connected to server " + frame.headers.server);
              }
              _this.connected = true;
              _this._setupHeartbeat(frame.headers);
              _results.push(typeof _this.connectCallback === "function" ? _this.connectCallback(frame) : void 0);
              break;
            case "MESSAGE":
              onreceive = _this.subscriptions[frame.headers.subscription];
              _results.push(typeof onreceive === "function" ? onreceive(frame) : void 0);
              break;
            case "RECEIPT":
              _results.push(typeof _this.onreceipt === "function" ? _this.onreceipt(frame) : void 0);
              break;
            case "ERROR":
              _results.push(typeof errorCallback === "function" ? errorCallback(frame) : void 0);
              break;
            default:
              _results.push(typeof _this.debug === "function" ? _this.debug("Unhandled frame: " + frame) : void 0);
          }
        }
        return _results;
      };
      this.ws.onclose = function() {
        var msg;
        msg = "Whoops! Lost connection to " + _this.ws.url;
        if (typeof _this.debug === "function") {
          _this.debug(msg);
        }
        _this._cleanUp();
        return typeof errorCallback === "function" ? errorCallback(msg) : void 0;
      };
      return this.ws.onopen = function() {
        var headers;
        if (typeof _this.debug === "function") {
          _this.debug('Web Socket Opened...');
        }
        headers = {
          "accept-version": Stomp.VERSIONS.supportedVersions(),
          "heart-beat": [_this.heartbeat.outgoing, _this.heartbeat.incoming].join(',')
        };
        if (vhost) {
          headers.host = vhost;
        }
        if (login) {
          headers.login = login;
        }
        if (passcode) {
          headers.passcode = passcode;
        }
        return _this._transmit("CONNECT", headers);
      };
    };

    Client.prototype.disconnect = function(disconnectCallback) {
      this._transmit("DISCONNECT");
      this.ws.onclose = null;
      this.ws.close();
      this._cleanUp();
      return typeof disconnectCallback === "function" ? disconnectCallback() : void 0;
    };

    Client.prototype._cleanUp = function() {
      this.connected = false;
      if (this.pinger) {
        if (typeof window !== "undefined" && window !== null) {
          window.clearInterval(this.pinger);
        }
      }
      if (this.ponger) {
        return typeof window !== "undefined" && window !== null ? window.clearInterval(this.ponger) : void 0;
      }
    };

    Client.prototype.send = function(destination, headers, body) {
      if (headers == null) {
        headers = {};
      }
      if (body == null) {
        body = '';
      }
      headers.destination = destination;
      return this._transmit("SEND", headers, body);
    };

    Client.prototype.subscribe = function(destination, callback, headers) {
      if (headers == null) {
        headers = {};
      }
      if (!headers.id) {
        headers.id = "sub-" + this.counter++;
      }
      headers.destination = destination;
      this.subscriptions[headers.id] = callback;
      this._transmit("SUBSCRIBE", headers);
      return headers.id;
    };

    Client.prototype.unsubscribe = function(id) {
      delete this.subscriptions[id];
      return this._transmit("UNSUBSCRIBE", {
        id: id
      });
    };

    Client.prototype.begin = function(transaction) {
      return this._transmit("BEGIN", {
        transaction: transaction
      });
    };

    Client.prototype.commit = function(transaction) {
      return this._transmit("COMMIT", {
        transaction: transaction
      });
    };

    Client.prototype.abort = function(transaction) {
      return this._transmit("ABORT", {
        transaction: transaction
      });
    };

    Client.prototype.ack = function(messageID, subscription, headers) {
      if (headers == null) {
        headers = {};
      }
      headers["message-id"] = messageID;
      headers.subscription = subscription;
      return this._transmit("ACK", headers);
    };

    Client.prototype.nack = function(messageID, subscription, headers) {
      if (headers == null) {
        headers = {};
      }
      headers["message-id"] = messageID;
      headers.subscription = subscription;
      return this._transmit("NACK", headers);
    };

    return Client;

  })();

  Stomp = {
    libVersion: "2.0.0-next",
    VERSIONS: {
      V1_0: '1.0',
      V1_1: '1.1',
      V1_2: '1.2',
      supportedVersions: function() {
        return '1.1,1.0';
      }
    },
    client: function(url, protocols) {
      var klass, ws;
      if (protocols == null) {
        protocols = ['v10.stomp', 'v11.stomp'];
      }
      klass = Stomp.WebSocketClass || WebSocket;
      ws = new klass(url, protocols);
      return new Client(ws);
    },
    over: function(ws) {
      return new Client(ws);
    },
    Frame: Frame
  };

  if (typeof window !== "undefined" && window !== null) {
    window.Stomp = Stomp;
  } else if (typeof exports !== "undefined" && exports !== null) {
    exports.Stomp = Stomp;
    Stomp.WebSocketClass = require('./test/server.mock.js').StompServerMock;
  } else {
    self.Stomp = Stomp;
  }

}).call(this);
