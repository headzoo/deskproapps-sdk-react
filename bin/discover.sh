#!/usr/bin/env bash

to_real_path()
{
    TESTPATH=${1} ${NODE} <<REALPATH
const fs = require('fs');
try {
    const path = fs.realpathSync(process.env.TESTPATH);
    console.log(path);
} catch (e) {}

REALPATH
}

NPM_ROOT=$(npm root -g);
DPAT='@deskproapps/dpat'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

LOCAL_DPAT="$( cd "${DIR}/../node_modules/" && pwd )/${DPAT}"
GLOBAL_DPAT="$( cd "${NPM_ROOT}" && pwd -L )/${DPAT}"

LOCAL_DPAT="$(to_real_path ${LOCAL_DPAT})"
GLOBAL_DPAT="$(to_real_path ${GLOBAL_DPAT})"

DPAT_ROOT=
if [ ! -z ${LOCAL_DPAT} ]; then
    DPAT_ROOT=${LOCAL_DPAT}
elif [ ! -z ${GLOBAL_DPAT} ]; then
    DPAT_ROOT=${GLOBAL_DPAT}
fi

echo ${DPAT_ROOT};