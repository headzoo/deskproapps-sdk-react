#!/usr/bin/env bash

NPM_ROOT=$(npm root -g);
BABEL="${NPM_ROOT}/@deskproapps/dpat/node_modules/.bin/babel"

${BABEL} "$@"


