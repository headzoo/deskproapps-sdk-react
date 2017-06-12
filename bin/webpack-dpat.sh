#!/usr/bin/env bash

NPM_ROOT=$(npm root -g);
WEBPACK="${NPM_ROOT}/@deskproapps/dpat/node_modules/.bin/webpack"

[ -z "${DPA_PACKAGE}" ] && DPA_PACKAGE='compact standalone'

for package_mode in ${DPA_PACKAGE}; do
    DPA_PACKAGE_MODE=${package_mode} ${WEBPACK} "$@"
done

