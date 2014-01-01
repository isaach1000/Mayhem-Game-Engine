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
    require(['util/graph'], function(Graph) {
        'use strict';

        var graph = new Graph.Graph(),
            a = graph.addNode('a'),
            b = graph.addNode('b'),
            c = graph.addNode('c');
        graph.addEdge(a, b);
        graph.addEdge(a, c);
        graph.addEdge(b, c);
        graph.addEdge(c, b);
        graph.addEdge(c, a);
        var dict = graph.toDictionary();
        console.debug(JSON.stringify(dict));
    });
});