#!/bin/bash

# Script to kill processes running on ports 5173 and 3001
# Created by Augment Agent

echo "Searching for processes on ports 5173 and 3001..."

# Find and kill process on port 5173
PORT_5173_PID=$(lsof -ti:5173)
if [ -n "$PORT_5173_PID" ]; then
    echo "Found process with PID $PORT_5173_PID running on port 5173. Killing it..."
    kill -15 $PORT_5173_PID
    sleep 1
    # Check if process still exists and force kill if necessary
    if ps -p $PORT_5173_PID > /dev/null; then
        echo "Process still running. Force killing..."
        kill -9 $PORT_5173_PID
    fi
    echo "Process on port 5173 has been terminated."
else
    echo "No process found running on port 5173."
fi

# Find and kill process on port 3001
PORT_3001_PID=$(lsof -ti:3001)
if [ -n "$PORT_3001_PID" ]; then
    echo "Found process with PID $PORT_3001_PID running on port 3001. Killing it..."
    kill -15 $PORT_3001_PID
    sleep 1
    # Check if process still exists and force kill if necessary
    if ps -p $PORT_3001_PID > /dev/null; then
        echo "Process still running. Force killing..."
        kill -9 $PORT_3001_PID
    fi
    echo "Process on port 3001 has been terminated."
else
    echo "No process found running on port 3001."
fi

echo "Script completed."
