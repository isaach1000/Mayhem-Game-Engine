var $ = require('../lib/jquery'),
    _ = require('underscore'),
    jasmine = require('../jasmine-html');

var jasmineEnv = jasmine.getEnv();
jasmineEnv.updateInterval = 1000;
var htmlReporter = new jasmine.HtmlReporter();
jasmineEnv.addReporter(htmlReporter);
jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
};
//////////////////////////////////
// Specify the module.exportss to test. //
//////////////////////////////////
var specs = ['hash', 'graph', 'shape', 'minHeap',
    'mathExtensions'];
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
