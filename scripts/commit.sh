#!/bin/bash

read -p "Commit message: " message
grunt build
git add -A
git commit -m "$message"
git push
