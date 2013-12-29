// @formatter:off
define([], function() {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
     * @exports util/kruskal
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * Kruskal
         * @constructor
         */
        Kruskal: function(set) {
            var _this = this;

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            var visitedSet = new Hashset.Hashset();

            function makeSet(node) {
            	set.add(node);
            	n.neighbors.forEach(function(otherNode) {
            		makeSetHelper(otherNode, set, visitedSet);
            	});
            }

			function makeSetHelper(n, set, visitedSet) {
   				if (visitedSet.contains(n)) {
    				return;
    			}
    			set.add(n);
				n.neighbors.forEach(function(otherNode) {
					makeSetHelper(otherNode, set, visitedSet); });
				}

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            this.kruskal = function(set) {
            	makeSet(node);
            };
        }
    };

    return module;
});
#endif
