#!/bin/bash

mkdir -p build/combo || true

find build -type f -name 'combo?*' | while read file; do
  filename=`node hashfile.js $(basename "$file")`
  mv -v $file build/combo/$filename
done
