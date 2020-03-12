#!/bin/bash

##
# converts dir/file.html -> dir/file/index.html
##

find build -type f -name '*.html' -not -name 'index.html' | while read file; do
  dirname=${file%.*}
  mkdir -pv $dirname;
  mv -v $file ${dirname}/index.html;
done
