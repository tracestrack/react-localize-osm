#!/usr/bin/env bash

npm ci

npm run build 
rm -rf docs
mv build docs
echo "localize.osm.tracestrack.com" > docs/CNAME
git add .