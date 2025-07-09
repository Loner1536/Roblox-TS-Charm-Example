#!/bin/zsh

set -e

PROJECT_NAME=$(basename "$(pwd)")

# Clean output directories
echo "Cleaning previous build..."
rm -rf out dist

# Compile TypeScript
echo "Compiling TypeScript with roblox-ts..."
npx rbxtsc

# Generate sourcemap
echo "Generating sourcemap..."
rojo sourcemap default.project.json -o sourcemap.json

# Use darklua on compiled Lua in `out/`
echo "Running darklua on compiled Lua files..."
darklua process -c .darklua.json out/ dist/out

# Build the .rbxl place file
echo "Building with Rojo..."
rojo build default.project.json -o "$PROJECT_NAME.rbxl"

# Open the place file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$PROJECT_NAME.rbxl"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start "$PROJECT_NAME.rbxl"
else
    # Linux/Unix fallback
    xdg-open "$PROJECT_NAME.rbxl" 2>/dev/null || echo "Could not open file"
fi

# Clean up temporary processed files
echo "Cleaning up..."
rm -rf dist
