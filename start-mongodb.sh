#!/bin/bash

# Script to start MongoDB using Docker
# Created by Augment Agent

echo "Starting MongoDB on port 27017..."
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin mongo:latest

echo "MongoDB is running. You can initialize the database with: npm run init-mongodb"
