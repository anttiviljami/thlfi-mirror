#!/bin/bash

find build -type f -name '*\?css_fast_load*' | while read file; do
  basename="`echo $file | sed 's/\?css_fast_load=0&js_fast_load=0//'`"
  echo $basename
  mv -v $file $basename
done

find build -type f -name '*\?*' | while read file; do
  basename=${file%\?*}
  mv -v $file $basename
done
