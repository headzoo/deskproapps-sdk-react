#!/usr/bin/env bash

SOURCE_BRANCH="master"
# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "{$TRAVIS_PULL_REQUEST}" == "false" ] && [ "${TRAVIS_BRANCH}" == "${SOURCE_BRANCH}" ]; then
    exit 0
else
    exit 1
fi