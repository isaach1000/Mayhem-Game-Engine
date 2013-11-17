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
    
    var workerError = function(e) {
        console.log(e);
    };
    
    $(document).ready(function() {   
        /*var mainWorker = new Worker('js/workerStartup.js'),
            ctxReceiver = new WorkerReceiver.WorkerReceiver(console);        
        mainWorker.addEventListener('message', receiver.handleMessage);
        mainWorker.addEventListener('error', workerError);
        mainWorker.postMessage();*/
       
       new MainLevel.MainLevel();
    });
});
