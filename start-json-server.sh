#!/bin/bash

# Install json-server if not already installed
if ! command -v json-server &> /dev/null
then
    echo "json-server not found, installing..."
    npm install -g json-server
fi

# Start json-server
echo "Starting JSON Server on port 3001..."
json-server --watch data/db.json --port 3001
