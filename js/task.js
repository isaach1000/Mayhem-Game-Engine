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
        var graph = new Graph.Graph();
        var a = graph.addNode("a");
        var b = graph.addNode("b");
        var c = graph.addNode("c");
        graph.addEdge(a, b);
        graph.addEdge(a, c);
        graph.addEdge(c, b);
        graph.addEdge(c, a);
        console.debug(graph.toDictionary());
    });
}

// This code triggers the main code when it receives an event
self.addEventListener('message', function(ev) {
    messageHandler(ev);
});
