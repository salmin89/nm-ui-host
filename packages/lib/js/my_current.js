#!/usr/bin/env node

"use strict";

const createResponseFn = function (handleMessage) {
  process.stdin.on('close', function () {
      process.exit();
  });
  process.stdin.on('end', function () {
      process.exit();
  });
  process.stdin.on('error', function () {
      process.exit();
  });
  process.stdin.on('uncaughtException', function (err) {
      sendMessage({ error: err.toString() });
  });
  process.stdin.on('readable', function () {
      process.title = 'node - NativeMessagingHost (ITM)';
      let input = [];
      let chunk;
      while ((chunk = process.stdin.read())) {
          input.push(chunk);
      }
      input = Buffer.concat(input);
      const msgLen = input.readUInt32LE(0);
      const dataLen = msgLen + 4;
      if (input.length >= dataLen) {
          const content = input.slice(4, dataLen);
          const json = JSON.parse(content.toString());
          handleMessage(json);
      }
  });
  function sendMessage(msg) {
      const buffer = Buffer.from(JSON.stringify(msg));
      const header = Buffer.alloc(4);
      header.writeUInt32LE(buffer.length, 0);
      const data = Buffer.concat([header, buffer]);
      process.stdout.write(data);
  }
  return sendMessage;
};

module.exports = {
    createResponseFn,
    run: function (handleMessage) {
        const sendResponse = createResponseFn(handleMessage);
        function handleMessage(msg) {
            sendResponse({...msg, response: 'my_current.js'});
        }
    }
};
