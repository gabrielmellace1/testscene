#!/usr/bin/env bash
echo 'foo_Bar' | sed 's/\([a-z0-9]\)\([A-Z]\)/\1_\L\2/g'