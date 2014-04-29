var path = require("path"),
    Feature = require("../")(path.join(__dirname, "data", "test.yml"));

module.exports = {
    featureEnabled: function (test) {
        test.ok(Feature.isEnabled("zero-downtime"));
        test.done();
    },

    featureDisabled: function (test) {
        test.equal(Feature.isEnabled("flying-phone"), false);
        test.done();
    },

    featureVariant: function (test) {
        var varFeature = Feature.variant("background-color");
        test.ok(["red", "blue", "yellow"].some(function (color) {
            return varFeature === color;
        }));
        test.done();
    },

    featureNullExist: function (test) {
        test.equal(Feature.variant("zombie"), undefined);
        test.done();
    }
}
