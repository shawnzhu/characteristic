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
    }
}
