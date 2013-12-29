// @formatter:off
define([], function() {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
     * @exports util/graph
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * Graph
         * @constructor
         */
		Graph: function() {
			// Other methods in class...
			this.dijkstra = function(source) {

				nodes.forEach(function(node) {
					node.dist = Infinity;
					node.visited = false;
					delete node.previous; // sets node.previous to undefined
				});

				source.dist = 0;

				var queue = new MinHeap.MinHeap(function(graphNode1, graphNode2) {
					return graphNode1.dist - graphNode2.dist;
				});
				queue.add(source);

				while (queue.length !== 0) {
					var u = queue.poll();
					u.visited = true;

					u.neighbors.forEach(function(v) {
						var alt = u.dist + 1; // assuming all edges have equal distance
						if (alt < v.dist) {
							v.dist = alt;
							v.previous = u;
							if (!v.visited) {
								queue.add(v);
							}
						}
					});
				}
			};
			//...
		}
    };

    return module;
});
#endif
