importScripts('lib/require.js');

require.config({
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
    'worker/workerMessenger',
    'worker/workerReceiver'
], function(WorkerMessenger,
    WorkerReceiver) {
    "use strict";
    
    var messenger = new WorkerMessenger.WorkerMessenger();
});
