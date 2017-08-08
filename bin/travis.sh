#!/usr/bin/env bash

set -e # Exit with nonzero exit code if anything fails

PARAMS=""
COMMAND=
SCRIPT=
while (( "$#" )); do
  case "$1" in
    --publish)
      if [ "${COMMAND}" = "docs" ] && [ -z "${SCRIPT}" ]; then
        SCRIPT="${COMMAND} ${1}"
      fi

      shift
      ;;
    --should-publish)
      if [ "${COMMAND}" = "docs" ] && [ -z "${SCRIPT}" ]; then
        SCRIPT="${COMMAND} ${1}"
      fi

      shift 1
      ;;
    --) # end argument parsing
      shift
      break
      ;;
    -*|--*=) # unsupported flags
      echo "Error: Unsupported flag $1" >&2
      exit 1
      ;;
    *)
      # first positional argument is the command
      if [ -z "${PARAMS}" ]; then
        COMMAND="${1}"
      fi
      # preserve positional arguments
      PARAM="$PARAMS $1"
      shift
      ;;
  esac
done
# set positional arguments in their proper place
eval set -- "${PARAMS}"


if [ -z "${SCRIPT}" ]; then
    echo "Error: unsupported or missing command" >&2
    exit 1
fi

if [  "docs --should-publish" == "${SCRIPT}" ]; then
   bin/travis.d/docs-should-publish.sh
elif [  "docs --publish" == "${SCRIPT}" ]; then
  bin/travis.d/docs-publish.sh
fi

if [ -n "${SCRIPT}" ] && [ $? -eq 0 ]; then
  exit 0
elif [ -n "${SCRIPT}" ] && [ $? -ne 0 ]; then
  echo "Error: ${SCRIPT} exited with non-zero status" >&2
  exit 1
else
  exit 0
fi

