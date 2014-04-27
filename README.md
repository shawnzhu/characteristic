# Characteristic - Feature flag configuration for Node.js

Feature flag implementation in Node.

Inspired by [Etsy Feature API](https://github.com/etsy/feature)

## API

	var Feature = require("characteristic")();

	Feature.isEnabled("my_feature");

It returns `true` if `my_feature` is enabled.



## Configuration

It loads default configuration file from `<project-root>/config/<node-env>.yml`:

    ---
    features:
      zero-downtime: on
      flying-phone: off

Using customized configuration file path:

    var Feature = require("characteristic")("./foo/custom-config.yml");