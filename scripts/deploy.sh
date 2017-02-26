#!/usr/bin/env bash
echo 'create deploy artifact'
zip -r dist.zip .elasticbeanstalk .tmp api config mocks ng views app.js Gruntfile.js package.json
