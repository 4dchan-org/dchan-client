#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cd $SCRIPT_DIR/../dapp
cp -n docker-compose.dev.yml docker-compose.yml
cd $SCRIPT_DIR/..
cp -n docker-compose.dev.yml docker-compose.yml
