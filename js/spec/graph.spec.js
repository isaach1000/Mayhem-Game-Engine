define(['util/graph'], function(Graph) {
    'use strict';

    describe('Graph', function() {
        var
        graph = new Graph.Graph(),
            node1 = graph.addNode(1),
            node2 = graph.addNode(2),
            node3 = graph.addNode(3),
            node4 = graph.addNode(4),
            edge12 = graph.addEdge(node1, node2),
            edge13 = graph.addEdge(node1, node3),
            edge42 = graph.addEdge(node4, node2),
            edge43 = graph.addEdge(node4, node3),
            edge41 = graph.addEdge(node4, node1);

        it('add nodes and edges', function() {
            var edges = [edge12, edge13];
            node1.edges.forEach(function(edge) {
                expect(edges).toContain(edge);
            });

            expect(node2.edges.length).toBe(0);
        });

        it('remove edges', function() {
            graph.removeEdge(node4, node1);
        });

        it('depth first search', function() {
            var
            index = 0,
                validNodes = [
                    [node1, node4],
                    [node2, node3],
                    [node2, node3],
                    [node1, node4],
                ];

            graph.depthFirstSearch(function(node) {
                var validNodeGroup = validNodes[index];
                index++;
                expect(validNodeGroup).toContain(node);
            });
        });

        it('breadth first search', function() {
            var
            index = 0,
                validNodes = [
                    [node1, node4],
                    [node2, node3],
                    [node2, node3],
                    [node1, node4],
                ];

            graph.breadthFirstSearch(function(node) {
                var validNodeGroup = validNodes[index];
                index++;
                expect(validNodeGroup).toContain(node);
            });
        });

        it('dijkstra\'s algorithm', function() {
            
        });

    });

});
