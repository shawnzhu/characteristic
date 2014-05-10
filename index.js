var yaml = require("js-yaml"),
    fs   = require("fs"),
    path = require("path");

module.exports = function (configFilePath) {
    var api = Object.create(null),
        currentConfigFilePath = configFilePath,
        defaultConfigFilePath = path.join(
            process.cwd(),
            "config",
            (process.NODE_ENV || "development") + ".yml");
        ;

    function contains (featureUsers, user) {
        var userName = (user.name || user);

        if (userName === undefined) {
            return false;
        } else {
            switch (typeof featureUsers) {
                case "string":
                    return featureUsers === userName;
                case "object":
                    return featureUsers.indexOf(userName) > -1;
                default:
                    return false;
            }
        }
    }

    api.reload = function (newConfigPath, callback) {
        var doc, configPath;

        switch (typeof newConfigPath) {
            case "string":
                configPath = newConfigPath;
                break;
            case "function":
                callback = newConfigPath;
            case "undefined":
            default:
                configPath = currentConfigFilePath || defaultConfigFilePath;
        }

        doc = yaml.safeLoad(fs.readFileSync(configPath, "utf8"));
        currentConfigFilePath = configPath;
        features = doc["features"];

        if (callback) { callback(); }
    };

    api.isEnabled = function (feature) {
        var status = features[feature],
            enabled = false;

        if (!status) {
            return false;
        }

        if (status.users) {
            enabled = contains(status.users, this.user);
        } else if (status.groups) {
            enabled = contains(status.groups, this.group);
        } else {
            enabled = (status !== undefined) && (status !== "off");
        }

        return enabled;
    };

    api.variant = function (feature) {
        var data = features[feature];
        if (data instanceof Array) {
            var randomIndex = Math.floor(Math.random() * data.length);
            return data[randomIndex];
        } else {
            return undefined;
        }
    };

    api.reload(configFilePath);

    return api;
}