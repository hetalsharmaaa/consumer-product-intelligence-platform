#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Building Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Setting up Backend..."
cd backend
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files (which will include the frontend build)
python manage.py collectstatic --no-input
