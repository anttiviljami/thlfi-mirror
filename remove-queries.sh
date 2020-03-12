#!/bin/bash

find build -type f -name '*?*' | while read file; do
  basename=${file%\?*}
  mv -v $file $basename
done
