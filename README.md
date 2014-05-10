# Characteristic - Feature flag configuration for Node.js

[![Build Status](https://drone.io/github.com/shawnzhu/characteristic/status.png)](https://drone.io/github.com/shawnzhu/characteristic/latest)

Feature flag implementation in Node.

Inspired by [Etsy Feature API](https://github.com/etsy/feature)

## API

    var Feature = require("characteristic")();

    Feature.isEnabled("my_feature");

It returns `true` if `my_feature` is enabled.

According to web application, use binding to apply feature flag on request object when `request.user` or `request.group` exists:

    function(request, response, next) {
        var enabled = Feature.isEnabled.bind(request)("my_feature");
        // enabled is true if my_feature is enabled for current user
    }



## Configuration

It loads default configuration file from `<project-root>/config/<node-env>.yml`:

    ---
    features:
      zero-downtime: on
      flying-phone: off
      super-power:
        users: [hulk, thor, superman]
      hero:
        groups: [shield, avengers]

Uses customized configuration file path:

    var Feature = require("characteristic")("./foo/custom-config.yml");

Reload configuration:

    Feature.reload();

    // reload with new config path
    Feature.reload("./bar/custom-config.yml");