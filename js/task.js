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

        var
        obj = {
            0: [1, 2, 3],
            1: [0, 3],
            2: [0, 2],
            3: [1, 2]
        },
            graph = Graph.construct(obj);

        nodes = graph.getNode(1).neighbors;

        nodes.forEach(function(neighbor) {
            // TODO
        });
    });
});
