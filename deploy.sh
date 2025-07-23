#!/bin/bash

# Recording System Deployment Script
# This script helps deploy the recording system to a VPS or local server

set -e  # Exit on any error

# Ensure script runs from the directory where it's located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Starting Recording System Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check and install build tools
check_build_tools() {
    print_status "Checking for build tools..."
    
    local missing_tools=()
    
    if ! command -v gcc &> /dev/null && ! command -v g++ &> /dev/null; then
        missing_tools+=("build-essential")
    fi
    
    if ! command -v python3 &> /dev/null; then
        missing_tools+=("python3")
    fi
    
    if ! command -v make &> /dev/null; then
        missing_tools+=("make")
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        print_warning "Missing build tools required for native modules: ${missing_tools[*]}"
        print_status "Attempting to install build tools..."
        
        # Try to install build tools (works on Ubuntu/Debian)
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y build-essential python3 make
        elif command -v yum &> /dev/null; then
            sudo yum groupinstall -y "Development Tools" && sudo yum install -y python3
        elif command -v apk &> /dev/null; then
            sudo apk add --no-cache build-base python3 make
        else
            print_error "Could not automatically install build tools."
            print_error "Please manually install: build-essential, python3, make"
            print_error "On Ubuntu/Debian: sudo apt install build-essential python3 make"
            print_error "On CentOS/RHEL: sudo yum groupinstall 'Development Tools' && sudo yum install python3"
            exit 1
        fi
    else
        print_status "Build tools are available."
    fi
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check and install build tools first
check_build_tools

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Installing dependencies..."

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install

# Install backend dependencies
print_status "Installing backend dependencies..."
cd server
rm -rf node_modules package-lock.json
npm install
npm rebuild
cd ..

# Build frontend
print_status "Building frontend..."
npm run build

# Check if .env file exists in server directory
if [ ! -f "server/.env" ]; then
    print_warning "No .env file found in server directory."
    print_status "Creating .env file from example..."
    cp server/env.example server/.env
    print_warning "Please edit server/.env with your actual configuration values."
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    npm install -g pm2
fi

# Start the application with PM2
print_status "Starting application with PM2..."
cd server
pm2 delete recording-system 2>/dev/null || true
pm2 start server.js --name "recording-system"
pm2 save
pm2 startup
cd ..

print_status "Deployment completed successfully!"
print_status "Your application should now be running on port 5000"
print_status "To check the status, run: pm2 status"
print_status "To view logs, run: pm2 logs recording-system"
print_status "To restart the application, run: pm2 restart recording-system"

# Display PM2 status
echo ""
print_status "Current PM2 status:"
pm2 status 