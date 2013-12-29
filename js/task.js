// This function contains all of the logic for the worker
function messageHandler(mainEvent) {
    importScripts('./lib/require.js');

    require.config({
        baseUrl: './',
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

    require(['util/graph'], function(Graph) {
        function runGraph() {
            // TODO: generate graph from ev.data
            return mainEvent.data;
        }

        self.postMessage(runGraph());
    });
}

// This code triggers the main code when it receives an event
self.addEventListener('message', function(ev) {
    messageHandler(ev);
});
