define(['util/graph'], function(Graph) {
	'use strict';

	describe('Graph', function() {
		it('add nodes and edges', function() {
			var graph = new Graph.Graph(),
				node1 = graph.addNode(1),
				node2 = graph.addNode(2),
				edge = graph.addEdge(node1, node2);

			node1.edges.forEach(function(e) {
				expect(e).toBe(edge);
			});
			
			expect(node2.edges.length).toBe(0);
		});
	});

});
