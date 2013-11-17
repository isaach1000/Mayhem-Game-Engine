require.config({
    baseUrl : 'js',
    paths : {
        jquery : 'lib/jquery',
        underscore : 'lib/underscore',
        jasmine : 'lib/jasmine/jasmine',
        'jasmine-html' : 'lib/jasmine/jasmine-html'
    },
    shim : {
        underscore : {
            exports : '_'
        },
        jasmine : {
            exports : 'jasmine'
        },
        'jasmine-html' : {
            deps : ['jasmine'],
            exports : 'jasmine'
        }
    }
});

// @formatter:off
require(['jquery', 'jasmine-html'], function($, jasmine) {
        "use strict";
// @formatter:on

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    // Specify the scripts to test.
    var specs = ['js/spec/player.spec.js'];

    $(document).ready(function() {
        require(specs, function(spec) {
            jasmineEnv.execute();
        });
    });

    function execJasmine() {
        jasmineEnv.execute();
    }

});
