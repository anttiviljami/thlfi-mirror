#!/bin/bash

links=$(cat $1)

cd content

for link in $links; do
  echo $link
  wget --quiet -k -K -E -r -l 10 -p -N -F --domains thl.fi $link
done

