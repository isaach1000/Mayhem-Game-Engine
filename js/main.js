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

require(['jquery', 'level/mainLevel'], function($, MainLevel) {
    'use strict';
    $(function() {
        /*var mainLevel = new MainLevel.MainLevel();
        mainLevel.start();*/
        var worker = new Worker('build/task.js');
        worker.addEventListener('message', function(ev) {
            alert(ev.data);
        });
        worker.postMessage('Worker succeeded in echo!');
    });
});
