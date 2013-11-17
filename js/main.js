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
    'worker/workerMessenger',
    'worker/workerReceiver'
], function($,
    WorkerMessenger,
    WorkerReceiver) {
    "use strict";
    
    var workerError = function(e) {
        console.log(e);
    };
    
    $(document).ready(function() {
        var mainWorker = new Worker('js/workerStartup.js'),
            messenger = new WorkerMessenger.WorkerMessenger(mainWorker),
            receiver = new WorkerReceiver.WorkerReceiver(myArray);
        
        mainWorker.addEventListener('message', receiver.handleMessage);
        mainWorker.addEventListener('error', workerError);
        mainWorker.postMessage();
    });
});
