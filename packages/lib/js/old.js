#!/usr/bin/env node

var stream = require('stream');
var util = require('util');
var fs = require('fs')

function Input() {
    stream.Transform.call(this);

    // Transform bytes...
    this._writableState.objectMode = false;
    // ...into objects.
    this._readableState.objectMode = true;

    // Unparsed data.
    this.buf = typeof Buffer.alloc === 'function' ? Buffer.alloc(0) : new Buffer(0);
    // Parsed length.
    this.len = null;
}

util.inherits(Input, stream.Transform);

Input.prototype._transform = function(chunk, encoding, done) {
    // Save this chunk.
    this.buf = Buffer.concat([ this.buf, chunk ]);

    var self = this;

    function parseBuf() {
        // Do we have a length yet?
        if (typeof self.len !== 'number') {
            // Nope. Do we have enough bytes for the length?
            if (self.buf.length >= 4) {
                // Yep. Parse the bytes.
                self.len = self.buf.readUInt32LE(0);
                // Remove the length bytes from the buffer.
                self.buf = self.buf.slice(4);
            }
        }

        // Do we have a length yet? (We may have just parsed it.)
        if (typeof self.len === 'number') {
            // Yep. Do we have enough bytes for the message?
            if (self.buf.length >= self.len) {
                // Yep. Slice off the bytes we need.
                var message = self.buf.slice(0, self.len);
                // Remove the bytes for the message from the buffer.
                self.buf = self.buf.slice(self.len);
                // Clear the length so we know we need to parse it again.
                self.len = null;
                // Parse the message bytes.
                var obj = JSON.parse(message.toString());
                // Enqueue it for reading.
                self.push(obj);
                // We could have more messages in the buffer so check again.
                parseBuf();
            }
        }
    }

    // Check for a parsable buffer (both length and message).
    parseBuf();

    // We're done.
    done();
};

function Output() {
    stream.Transform.call(this);

    this._writableState.objectMode = true;
    this._readableState.objectMode = false;
}

util.inherits(Output, stream.Transform);

Output.prototype._transform = function(chunk, encoding, done) {
    var len = typeof Buffer.alloc === 'function' ? Buffer.alloc(4) : new Buffer(4);
    var buf = typeof Buffer.from === 'function'
        ? Buffer.from(JSON.stringify(chunk))
        : new Buffer(JSON.stringify(chunk));

    len.writeUInt32LE(buf.length, 0);

    this.push(Buffer.concat([len, buf]));

    done();
};

function Transform(handler) {
    stream.Transform.call(this);

    this._writableState.objectMode = true;
    this._readableState.objectMode = true;

    this.handler = handler;
}

util.inherits(Transform, stream.Transform);

Transform.prototype._transform = function(msg, encoding, done) {
    this.handler(msg, this.push.bind(this), done);
};

function Debug() {
    stream.Transform.call(this);

    this._writableState.objectMode = true;
    this._readableState.objectMode = false;
}

util.inherits(Debug, stream.Transform);

Debug.prototype._transform = function(chunk, encoding, done) {
    this.push(JSON.stringify(chunk) + '\n');

    done();
};


const nativeMessage = {
  Input,
  Output,
  Transform,
  Debug
}



var input = new nativeMessage.Input()
var transform = new nativeMessage.Transform(messageHandler)
var output = new nativeMessage.Output()

process.stdin.pipe(input).pipe(transform).pipe(output).pipe(process.stdout)

var subscriptions = {}

var timer = setInterval(function () {
  if (subscriptions.time) {
    output.write({ time: new Date().toISOString() })
  }
}, 1000)

input.on('end', function () {
  clearInterval(timer)
})

function messageHandler(msg, push, done) {
  if (msg.readdir) {
    fs.readdir(msg.readdir, function (err, files) {
      if (err) {
        push({ error: err.message || err })
      } else {
        files.forEach(function (file) {
          push({ file: file })
        })
      }

      done()
    })
  } else if (msg.subscribe) {
    subscriptions[msg.subscribe] = true
    push({ subscribed: msg.subscribe })
    done()
  } else if (msg.unsubscribe) {
    delete subscriptions[msg.unsubscribe]
    push({ unsubscribed: msg.unsubscribe })
    done()
  } else {
    // Just echo the message:
    push({...msg, response: 'old.js'})
    done()
  }
}
