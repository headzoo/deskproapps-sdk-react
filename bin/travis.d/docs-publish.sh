#!/usr/bin/env bash

set -e # Exit with nonzero exit code if anything fails

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(cd ${DIR}/../../ && pwd)"
DEPLOY_KEY_ROOT="${PROJECT_ROOT}/src/travis"

REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}

git config user.name "Travis CI"
git config user.email "${COMMIT_AUTHOR_EMAIL}"
git config --global push.default matching
git config core.autocrlf false
git config core.safecrlf false

# Commit the "changes", i.e. the new version.
git add docs/reference

CHANGES=$(git status --short docs/reference | head -n 1)
# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if [ -z "${CHANGES}" ]; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

git commit -m "Publishing documentation"

# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${DEPLOY_KEY_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${DEPLOY_KEY_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K ${ENCRYPTED_KEY} -iv ${ENCRYPTED_IV} -in src/travis/deploy-key.enc -out src/travis/deploy-key -d
## openssl aes-256-cbc -K $encrypted_3778a32db008_key -iv $encrypted_3778a32db008_iv -in deploy-key.enc -out ${DEPLOY_KEY_ROOT}/deploy-key -d

chmod 600 src/travis/deploy-key
eval `ssh-agent -s`
ssh-add src/travis/deploy-key

# Now that we're all set up, we can push.
git push ${SSH_REPO} HEAD:${TRAVIS_BRANCH}