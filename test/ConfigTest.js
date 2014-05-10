var request = require("supertest"),
    connect = require("connect"),
    path = require("path"),

    Feature = require("../")(path.join(__dirname, "data", "test.yml"));

function assertSuperPower(req, res) {
    var enabled = Feature.isEnabled.bind(req)("super-power");
    res.statusCode = (enabled) ? 200 : 404;
    res.end("");
}

function assertHero(req, res) {
    var enabled = Feature.isEnabled.bind(req)("hero");
    res.statusCode = (enabled) ? 200 : 404;
    res.end("");
}

function setUserOrGroup(req, res, next) {
    if (req.query.user) {
        req.user = {name: req.query.user};
    }

    if (req.query.group) {
        req.group = {name: req.query.group};
    }

    next();
}

var testApp = connect();
    testApp.use(connect.query())
        .use(setUserOrGroup)
        .use("/super-power", assertSuperPower)
        .use("/hero", assertHero);

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
    },

    featureEnabledForSpecificUser: function (test) {
        request(testApp)
            .get("/super-power?user=superman")
            .expect(200)
            .end(test.done);
    },

    featureDisabledForSpecificUser: function (test) {
        request(testApp)
            .get("/super-power?user=Padmé")
            .expect(404)
            .end(test.done);
    },

    featureEnabledForSpecificGroup: function (test) {
        request(testApp)
            .get("/hero?group=avengers")
            .expect(200)
            .end(test.done);
    },

    featureDisabledForSpecificGroup: function (test) {
        request(testApp)
            .get("/hero?group=empire")
            .expect(404)
            .end(test.done);
    },

    reloadableConfig: function (test) {
        Feature.reload(function () {
            test.equal(Feature.isEnabled("flying-phone"), false);
            test.done();
        });
    },

    reloadWithNewPath: function (test) {
        var newConfigPath = path.join(__dirname, "data", "feature4reload.yml");
        Feature.reload(newConfigPath, function() {
            test.ok(Feature.isEnabled("flying-phone"));
            test.done();
        });
    }
}
