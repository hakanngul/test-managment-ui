#!/bin/bash

# Script to stop MongoDB Docker container
# Created by Augment Agent

echo "Stopping MongoDB Docker container..."
docker stop mongodb
docker rm mongodb

echo "MongoDB container stopped and removed."
