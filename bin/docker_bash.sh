#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
echo $SCRIPT_DIR
cd $SCRIPT_DIR/../dapp

docker-compose down && docker-compose run --service-ports dapp bash
