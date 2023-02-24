#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cd $SCRIPT_DIR/../..

./bin/docker/stop.sh && docker-compose run --service-ports dev ./bin/start.sh
