#!/bin/zsh

set -e

echo "Installing NPM packages..."
npm install

bash scripts/shell/compile-network.sh

echo "Cleaning dist output..."
rm -rf out dist

echo "Running initial roblox-ts compile..."
npx rbxtsc

echo "Running initial blink + sourcemap..."
blink .blink
rojo sourcemap default.project.json -o sourcemap.json

echo "Running darklua on compiled Lua files..."
darklua process -c .darklua.json out/ dist/out

echo "Killing any existing Rojo servers..."
pkill rojo || true

echo "Starting Rojo server..."
rojo serve default.project.json &
ROJO_PID=$!

echo "Starting io-serve..."
npx io-serve &
IO_SERVE_PID=$!

echo "Starting file watchers..."

# Resilient rbxtsc watcher (restarts on crash/error)
(
  while true; do
    echo "Starting rbxtsc watcher..."
    npx rbxtsc -w || echo "rbxtsc crashed. Restarting in 2s..."
    sleep 2
  done
) &
TSC_WATCH_PID=$!

# Watch darklua on changes to out/, run in background
find out/ -type f | entr -d bash -c 'darklua process -c .darklua.json out/ dist/out' &
DARKLUA_WATCH_PID=$!

blink .blink --watch &
BLINK_WATCH_PID=$!

rojo sourcemap default.project.json -o sourcemap.json --watch &
SOURCEMAP_WATCH_PID=$!

wait $ROJO_PID $IO_SERVE_PID $TSC_WATCH_PID $DARKLUA_WATCH_PID $BLINK_WATCH_PID $SOURCEMAP_WATCH_PID
