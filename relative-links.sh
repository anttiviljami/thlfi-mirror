#!/bin/bash

find build -type f -name '*.html' | while read file; do
  echo $file
  sed -i "" -E "s/https:\/\/thl.fi\//\//g" $file
  sed -i "" -E "s/https:\/\/thl.fi/https:\/\/thl.viljami.io/g" $file
done
