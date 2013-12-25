require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        jasmine: 'lib/jasmine/jasmine',
        'jasmine-html': 'lib/jasmine/jasmine-html'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        }
    }
});
require(['jquery', 'underscore', 'jasmine-html'], function($, _, jasmine) {
    "use strict";
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;
    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);
    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };
    //////////////////////////////////
    // Specify the modules to test. //
    //////////////////////////////////
    var specs = ['player', 'hash', 'graph', 'hash', 'minheap'];
    specs = _.map(specs, function(moduleName) {
        return 'js/spec/' + moduleName + '.spec.js';
    });
    $(document).ready(function() {
        require(specs, function(spec) {
            jasmineEnv.execute();
        });
    });

    function execJasmine() {
        jasmineEnv.execute();
    }
});
