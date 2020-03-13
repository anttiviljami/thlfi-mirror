#!/bin/bash

find build -type f -name '*\?*' | while read file; do
  basename="`echo $file | sed 's/\?.*\./\./'`"
  echo $basename
  mv -v $file $basename
done

find build -type f -name '*\?*' | while read file; do
  basename=${file%\?*}
  mv -v $file $basename
done
