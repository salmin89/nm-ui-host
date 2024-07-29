
import createResponseFn from './protocol';

const sendResponse = createResponseFn(handleMessage);

function handleMessage(msg) {
  sendResponse(msg);
}