var yaml = require("js-yaml"),
    fs   = require("fs"),
    path = require("path");

module.exports = function (configFilePath) {
    var api = Object.create(null),
        configFilePath = configFilePath || path.join(
            process.cwd(),
            "config",
            (process.NODE_ENV || "development") + ".yml"),
        doc = yaml.safeLoad(
            fs.readFileSync(configFilePath, "utf8")
        );

        features = doc["features"];

    api.isEnabled = function (feature) {
        var status = features[feature];
        return status !== undefined && status !== "off";
    }

    api.variant = function (feature) {
        var data = features[feature];
        if (data instanceof Array) {
            var randomIndex = Math.floor(Math.random() * data.length);
            return data[randomIndex];
        } else {
            return undefined;
        }
    }

    return api;
}