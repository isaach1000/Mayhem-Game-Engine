require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore'
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});

require([
    'jquery',
    'level/mainLevel'
], function($,
    MainLevel) {
    "use strict";
    
    $(document).ready(function() {
       new MainLevel.MainLevel();
    });
});
