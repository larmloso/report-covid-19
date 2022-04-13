#!/usr/bin/env sh

set -e

npm run build

cd dist

git init
git add -A 
git commit -m "deploy 2"
git push -f git@github.com:larmloso/report-covid-19.git master:gh-pages

cd -