var $ = require('../lib/jquery'),
    _ = require('underscore'),
    jasmine = require('../jasmine-html');

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

var jasmineEnv = jasmine.getEnv();
jasmineEnv.updateInterval = 1000;
var htmlReporter = new jasmine.HtmlReporter();
jasmineEnv.addReporter(htmlReporter);
jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
};
//////////////////////////////////
// Specify the thisModules to test. //
//////////////////////////////////
var specs = ['hash', 'graph', 'shape', 'minHeap',
    'mathExtensions'];
specs = _.map(specs, function(thisModuleName) {
    return 'js/spec/' + thisModuleName + '.spec.js';
});
$(document).ready(function() {
    require(specs, function(spec) {
        jasmineEnv.execute();
    });
});

function execJasmine() {
    jasmineEnv.execute();
}
