#!/bin/bash

# Path to Node.js executable
NODE_EXECUTABLE=$(which node)

# Path to your Node.js script
SCRIPT_PATH="$(pwd)/ui-messaging-host/apps/nodejs/index.js"

# Execute the Node.js script with additional arguments
$NODE_EXECUTABLE $SCRIPT_PATH "$@"

