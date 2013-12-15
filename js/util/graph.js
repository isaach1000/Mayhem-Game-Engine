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
     * @module util/graph
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
                var thisNode = this;
                this.data = data;
                var edges = new Hashset.Hashset();

                adjacencyList.put(this, edges);

                Object.defineProperties(this, {
                    edges: {
                        get: function() {
                            return adjacencyList.get(thisNode);
                        }
                    },
                    neighbors: {
                        get: function() {
                            var neighborSet = new Hashset.Hashset();
                            thisNode.edges.forEach(function(edge) {
                                neighborSet.add(edge.head);
                            });
                            return neighborSet;
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

            /**
             * Add a node to the graph
             * @param   {Object} data     Data to be stored in the node
             * @return  {Node}          A node with the data
             */
            this.addNode = function(data) {
                var node = new Node(data);
                nodes.add(node);
                return node;
            };

            /**
             * Add an edge to the graph
             * @param   {Node} tail       The origin node of the edge
             * @param   {Node} head       The destination node of the edge
             * @return  {Edge}          A directed edge connecting the nodes
             */
            this.addEdge = function(tail, head) {
                var edge = new Edge(tail, head);
                adjacencyList.get(tail).add(edge);
                return edge;
            };

            /**
             * Remove an edge from the graph
             * @param   {Node} tail       The origin node of the edge
             * @param   {Node} head       The destination node of the edge
             * @return  {void}
             */
            this.removeEdge = function(tail, head) {
                var removeEdge;
                tail.edges.forEach(function(edge) {
                    if (edge.tail === tail && edge.head === head) {
                        removeEdge = edge;
                    }
                });
                tail.edges.remove(removeEdge);
            };

            /**
             * Perform a depth first search of the graph
             * @param {function} func The operation to perform on the visited nodes
             */
            this.depthFirstSearch = function(func) {
                var
                    visitedSet = new Hashset.Hashset(),
                    doneSearching = false;

                nodes.forEach(function(node) {
                    if (doneSearching === true) {
                        return;
                    }
                    doneSearching = depthFirstSearchHelper(node);
                });

                // Inner helper function
                function depthFirstSearchHelper(node) {
                    if (visitedSet.contains(node)) {
                        return true;
                    }
                    visitedSet.add(node);
                    var doneSearching = func(node) || true;
                    if (doneSearching !== true) {
                        node.neighbors.forEach(function(neighbor) {
                            return depthFirstSearchHelper(neighbor);
                        });
                    }
                    return doneSearching;
                }
            };

            /**
             * Perform a breadth first search on the graph
             * @param {function} func The operation to perform on the visited nodes
             */
            this.breadthFirstSearch = function(func) {
                var
                    visitedSet = new Hashset.Hashset(),
                    nodeQueue = [],
                    nodeQueueIndex = 0;

                nodes.forEach(function(node) {
                    nodeQueue.push(node);
                });

                while (nodeQueueIndex < nodeQueue.length) {
                    var node = nodeQueue[nodeQueueIndex++];
                    breadthFirstSearchHelper(node);
                }

                // Inner helper function
                function breadthFirstSearchHelper(node) {
                    if (visitedSet.contains(node)) {
                        return; // Skip this node
                    }
                    visitedSet.add(node);
                    var doneSearching = func(node) || false;
                    if (doneSearching !== true) {
                        node.neighbors.forEach(function(neighbor) {
                            nodeQueue.push(neighbor);
                        });
                    }
                }
            };
        }
    };

    return module;
});