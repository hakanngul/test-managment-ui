#!/bin/bash

# Script to start all services (MongoDB, API server, and Vite)
# Created by Augment Agent

echo "Starting all services..."

# Check if MongoDB is running
if ! docker ps | grep -q mongodb; then
    echo "Starting MongoDB..."
    ./start-mongodb.sh
    # Wait for MongoDB to start
    sleep 5
else
    echo "MongoDB is already running."
fi

# Start the API server and Vite in development mode
echo "Starting API server and Vite..."
npm run dev:all
