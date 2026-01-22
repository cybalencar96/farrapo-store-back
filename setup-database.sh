#!/bin/bash

# Database setup script for Farrapo Store
# This script will create the development and test databases

echo "Setting up PostgreSQL databases for Farrapo Store..."
echo ""

# Check if PostgreSQL is running
if ! sudo service postgresql status > /dev/null 2>&1; then
    echo "Starting PostgreSQL service..."
    sudo service postgresql start
fi

# Create development database
echo "Creating development database (farrapo_dev)..."
sudo -u postgres psql -c "CREATE DATABASE farrapo_dev;" 2>/dev/null && echo "✓ Database 'farrapo_dev' created" || echo "⚠ Database 'farrapo_dev' may already exist"

# Create test database
echo "Creating test database (farrapo_test)..."
sudo -u postgres psql -c "CREATE DATABASE farrapo_test;" 2>/dev/null && echo "✓ Database 'farrapo_test' created" || echo "⚠ Database 'farrapo_test' may already exist"

# Check if postgres user has a password
echo ""
echo "Checking postgres user configuration..."
echo "Note: If you set a password for the postgres user, update the .env files accordingly."
echo ""

# List databases
echo "Current databases:"
sudo -u postgres psql -c "\l" | grep -E "farrapo|Name"

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. If you set a password for the 'postgres' user, update .env.dev and .env.test files"
echo "2. Run 'npm run dev' to start the development server"
echo "3. If you need to restore the database schema, run:"
echo "   sudo -u postgres psql -d farrapo_dev -f farrapo_dump.sql"
