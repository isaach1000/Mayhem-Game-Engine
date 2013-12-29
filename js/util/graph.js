/**
    Graph abstract data structure to represent maze structure.

    @class Graph
 */
define([
    'underscore',
    'util/hash',
    'util/minheap'
], function(_, Hash, MinHeap) {
    'use strict';
    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
       @module util/graph
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
           @class Graph
           @constructor
         */
        Graph: function() {
            var _this = this;
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var nodes = new Hash.Hashset(),
                edges = new Hash.Hashset(),
                adjacencyList = new Hash.Hashtable();


            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            Object.defineProperties(this, {
                nodes: {
                    get: function() {
                        return nodes;
                    }
                },

                edges: {
                    get: function() {
                        return edges;
                    }
                },

                adjacencyList: {
                    get: function() {
                        return adjacencyList;
                    }
                }
            });

            /**
                Inner GraphNode class

                @class GraphNode
                @for Graph
                @constructor
                @param  {[type]} data [description]
             */
            function GraphNode(data) {
                var thisNode = this;
                this.data = data;
                var edges = new Hash.Hashset();
                adjacencyList.put(this, edges);

                Object.defineProperties(this, {
                    /**
                        Edges of node

                        @property edges
                        @type {Hashset}
                     */
                    edges: {
                        get: function() {
                            return adjacencyList.get(thisNode);
                        }
                    },

                    /**
                        Neighbors of node

                        @property neighbors
                        @type {Hashset}
                     */
                    neighbors: {
                        get: function() {
                            var neighborSet = new Hash.Hashset();
                            thisNode.edges.forEach(function(edge) {
                                neighborSet.add(edge.head);
                            });
                            return neighborSet;
                        }
                    }
                });

                /**
                    Find all the nodes that are reachable from this node

                    @for Graph
                    @method reachableNodes
                    @return {Hashset} Set of reachable nodes
                 */
                this.reachableNodes = function() {
                    // Inner helper function
                    function reachableNodesHelper(node, set, visitedSet) {
                        if (visitedSet.contains(node)) {
                            return;
                        }
                        set.add(node);
                        node.neighbors.forEach(function(otherNode) {
                            reachableNodesHelper(otherNode, set,
                                visitedSet);
                        });
                    }

                    // Main code
                    var reachableSet = new Hash.Hashset();
                    reachableNodesHelper(thisNode, reachableSet,
                        new Hash.Hashset());
                    return reachableSet;
                };
            }

            /**
                @class GraphEdge
                @for Graph
                @constructor
                @param  {[type]} tail [description]
                @param  {[type]} head [description]
             */
            function GraphEdge(tail, head) {
                /**
                    Tail node of edge

                    @property tail
                    @type {GraphNode}
                 */
                this.tail = tail;

                /**
                    Head node of edge

                    @property head
                    @type {GraphNode}
                 */
                this.head = head;

                /**
                    Weight of edge

                    @property weight
                    @type {number}
                    @for Graph
                 */
                this.weight = 0;
            }

            /**
                Add a node to the graph

                @param   {Object} data Data to be stored in the node
                @return  {GraphNode} A node with the data
             */
            this.addNode = function(data) {
                var node = new GraphNode(data);
                nodes.add(node);
                return node;
            };

            /**
                Add an edge to the graph

                @param   {GraphNode} tail The origin node of the edge
                @param   {GraphNode} head The destination node of the edge
                @return  {GraphEdge} A directed edge connecting the nodes
             */
            this.addEdge = function(tail, head) {
                var edge = new GraphEdge(tail, head);
                edges.add(edge);
                adjacencyList.get(tail).add(edge);
                return edge;
            };

            /**
               Remove an edge from the graph

               @param   {GraphNode} tail       The origin node of the edge
               @param   {GraphNode} head       The destination node of the edge
               @return  {void}
             */
            this.removeEdge = function(tail, head) {
                var removeEdge;
                tail.edges.forEach(function(edge) {
                    if (edge.tail === tail && edge.head === head) {
                        removeEdge = edge;
                        // Terminate iter
                        return true;
                    }
                });
                edges.remove(removeEdge);
                tail.edges.remove(removeEdge);
            };

            /**
                Perform a depth first search of the graph

                @method depthFirstSearch
                @param {Function} func The operation to perform on the visited
                nodes
             */
            this.depthFirstSearch = function(func) {
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

                // Main code
                var visitedSet = new Hash.Hashset(),
                    doneSearching = false;
                nodes.forEach(function(node) {
                    if (doneSearching === true) {
                        return;
                    }
                    doneSearching = depthFirstSearchHelper(node);
                });
            };

            /**
               Perform a breadth first search on the graph

               @method breadthFirstSearch
               @param {function} func The operation to perform on the visited
               nodes
               @return {void}
             */
            this.breadthFirstSearch = function(func) {
                var visitedSet = new Hash.Hashset(),
                    nodeQueue = [],
                    nodeQueueIndex = 0;
                nodes.forEach(function(node) {
                    nodeQueue.push(node);
                });
                while (nodeQueueIndex < nodeQueue.length) {
                    var node = nodeQueue[nodeQueueIndex++],
                        doneSearching = breadthFirstSearchHelper(node);
                    if (doneSearching) {
                        return; // Terminate the search
                    }
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
                    return doneSearching;
                }
            };

            /**
                Dijkstra's algorithm

                @method dijkstra
                @param  {GraphNode} source Source node
                @return {void}
             */
            this.dijkstra = function(source) {
                nodes.forEach(function(node) {
                    node.weight = Infinity;
                    node.visited = false;
                    // Set node.previous to undefined
                    delete node.previous;
                });

                // Distance of source to itself is 0
                source.weight = 0;

                var queue = new MinHeap.MinHeap(function(graphNode1,
                    graphNode2) {
                    if (isFinite(graphNode1.weight) && isFinite(
                        graphNode2)) {
                        return graphNode1.weight - graphNode2.weight;
                    } else if (isFinite(graphNode1)) {
                        return -1;
                    } else if (isFinite(graphNode2)) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                queue.add(source);

                // Function to use as parameter in forEach function below
                var relaxEdge = function(v) {
                    // Assuming all edges have equal distance, the distance
                    // between all nodes is 1
                    var alt = u.weight + 1;
                    if (alt < v.weight) {
                        v.weight = alt;
                        v.previous = u;
                        if (!v.visited) {
                            queue.add(v);
                        }
                    }
                };

                while (queue.length !== 0) {
                    var u = queue.poll();
                    u.visited = true;
                    u.neighbors.forEach(relaxEdge);
                }
            };

            this.kruskal = function(set) {
                var minSpanningTree = new module.Graph(),
                    clonedNodesTable = new Hash.Hashtable();

                nodes.forEach(function(node) {
                    var nodeClone = minSpanningTree.addNode(node.data);
                    clonedNodesTable.put(node, nodeClone);
                });

                var edgeArr = edges.toArray();
                edgeArr.sort(function(edge1, edge2) {
                    return edge1.weight - edge2.weight;
                });
                edgeArr.forEach(function(edge) {
                    var tailClone = clonedNodesTable.get(edge.tail),
                        tailSet = tailClone.reachableNodes(),
                        headClone = clonedNodesTable.get(edge.head),
                        headSet = headClone.reachableNodes();

                    if (!tailSet.equals(headSet)) {
                        minSpanningTree.addEdge(tailClone, headClone);
                    }
                });
                return minSpanningTree;
            };

        }
    };

    return module;
});
