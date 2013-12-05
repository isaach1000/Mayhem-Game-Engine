// @formatter:off
define([
        'util/hashset',
        'util/hashtable'
    ], function(Hashset, Hashtable) {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    // TODO


    /**
     * @exports util/graph
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        // TODO

        /**
         * Graph
         * @constructor
         */
        Graph: function() {
            var _this = this;

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var nodes = new Hashset.Hashset(),
                adjacencyList = new Hashtable.Hashtable();
            
            // Private inner Node class
            function Node(data) {
                this.data = data;
                var edges = new Hashset.Hashset();
                adjacencyList.put(this, edges);

                Object.defineProperties(this, {
                    edges: {
                        get: function() {
                            return adjacencyList.get(this);
                        }
                    }
                });
            }

            // Private inner Edge class
            function Edge(tail, head) {
                this.tail = tail;
                this.head = head;
                this.weight = 0;
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            this.addNode = function(data) {
                var node = new Node(data);
                nodes.add(node);
                return node;
            };

            this.addEdge = function(tail, head) {
                var edge = new Edge(tail, head);
                adjacencyList.get(tail).add(edge);
                return edge;
            };
        }
    };

    return module;
});
