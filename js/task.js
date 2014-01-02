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



        var g = new Graph.Graph();
        console.debug(g);

        var source = g.addNode(0);
        g.addNode(1);
        g.addNode(2);
        g.addNode(3);
        g.addNode(4);
        var dest = g.addNode(5);
        g.addNode(6);
        g.addNode(7);
        g.addNode(8);
        g.addNode(9);
        g.addNode(10);


        g.addEdge(source, g.getNode(2));
        g.addEdge(g.getNode(2), g.getNode(3));
        g.addEdge(g.getNode(3), g.getNode(4));
        g.addEdge(g.getNode(4), dest);
        g.addEdge(source, g.getNode(6));
        g.addEdge(g.getNode(6), g.getNode(7));
        g.addEdge(g.getNode(7), g.getNode(8));
        g.addEdge(g.getNode(8), dest);
        g.addEdge(source, g.getNode(9));
        g.addEdge(g.getNode(9), g.getNode(10));
        g.addEdge(g.getNode(10), dest);

        //g.dijsktra(source);


        var neighs = source.neighbors;
        neighs.forEach(function(
            neighbor) {
            console.debug(neighbor.data);
        });


        /*var
        obj = {
            0: [1, 2, 3],
            1: [0, 3],
            2: [0, 2],
            3: [1, 2]
        },
            graph = Graph.construct(obj);

        nodes = graph.getNode(0).neighbors;

        nodes.forEach(function(neighbor) {
            console.debug(neighbor.data);
        });*/
    });
});
