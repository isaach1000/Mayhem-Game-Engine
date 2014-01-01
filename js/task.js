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

addEventListener('message', function(mainEvent) {
    console.debug('hello');
});

require(['util/graph'], function(Graph) {
    'use strict';

    var graph = new Graph.Graph();
    var a = graph.addNode('a');
    var b = graph.addNode('b');
    var c = graph.addNode('c');
    graph.addEdge(a, b);
    graph.addEdge(a, c);
    graph.addEdge(b, c);
    graph.addEdge(c, b);
    graph.addEdge(c, a);
    var dict = graph.toDictionary();
    console.debug(JSON.stringify(dict));
});
