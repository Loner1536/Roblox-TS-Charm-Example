#!/bin/zsh

set -e

bash scripts/shell/install-packages.sh
bash scripts/shell/compile-network.sh

stylua --check src
