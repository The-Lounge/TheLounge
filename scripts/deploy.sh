#!/usr/bin/env bash
echo 'create deploy artifact'
zip -r dist.zip .elasticbeanstalk app Gruntfile.js package.json