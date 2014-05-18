;(function(self, undefined) {
	'use strict';

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MathExtensions = require('../util/mathExtensions');

/**
    Enum for key arrow input

    @class Direction
 */
module.exports = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    MIN: 37,

    toString: function(dir) {
        return ['left', 'up', 'right', 'down'][dir - module.exports.MIN];
    },

    all: function() {
        return [module.exports.RIGHT, module.exports.DOWN, module.exports.LEFT,
            module.exports.UP];
    },

    opposite: function(dir) {
        return module.exports.all()[dir - module.exports.MIN];
    },

    contains: function(dir) {
        return module.exports.all().indexOf(dir) !== -1;
    },

    random: function() {
        return module.exports.MIN + MathExtensions.randomInt(4);
    }
};

},{"../util/mathExtensions":6}],2:[function(require,module,exports){
var WorkerTasks = require('./worker/workerTasks.js');

addEventListener('message', function(ev) {
    var data = ev.data;

    if (data.graph !== undefined &&
        data.source !== undefined &&
        data.destination !== undefined) {
        var
            graph = WorkerTasks.constructGraph(data.graph),
            sourceNode = graph.getNode(data.source),
            destinationNode = graph.getNode(data.destination),
            path = WorkerTasks.getPath(graph, sourceNode, destinationNode);

        self.postMessage({
            moves: path,
            responseId: data.messageId
        });
    }
});

},{"./worker/workerTasks.js":8}],3:[function(require,module,exports){
/**
   A class to represent the bounds of shapes in the canvas. Simplifies
   calculations certain involving complex shapes. Specifically effective for
   hit-testing.

   @class BoundingBox
 */

/**
   @module util/boundingBox
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////
    /**
        Create a BoundingBox.

        @class BoundingBox
        @constructor
        @param {(float|Point)} arg0 The x coordinate of left side, or left-top point.
        @param {(float|Point)} arg1 The y coordinate of front side, or right-bottom point.
        @param {float} arg2 Width of the box.
        @param {float} arg3 Height of the box.
     */
    BoundingBox: function(arg0, arg1, arg2, arg3) {
        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var x, y, w, h;
        switch (arguments.length) {
            case 2:
                var point1 = arg0;
                var point2 = arg1;
                x = point1.x;
                y = point1.y;
                w = point2.x - point1.x;
                h = point2.y - point1.y;
                break;
            case 4:
                x = arg0;
                y = arg1;
                w = arg2;
                h = arg3;
                break;
        }
        if (w < 0 || h < 0) {
            throw new Error('Invalid dimensions for BoundingBox.');
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        Object.defineProperties(this, {
            /**
                x coordinate of top-left of BoundingBox instance

                @property x
                @type {float}
             */
            x: {
                get: function() {
                    return x;
                },
                set: function(newX) {
                    x = newX;
                }
            },

            /**
                y coordinate of top-left of BoundingBox instance

                @property y
                @type {float}
             */
            y: {
                get: function() {
                    return y;
                },
                set: function(newY) {
                    y = newY;
                }
            },

            /**
                Width of BoundingBox instance

                @property width
                @type {float}
             */
            width: {
                get: function() {
                    return w;
                }
            },

            /**
                Height of BoundingBox instance

                @property height
                @type {float}
             */
            height: {
                get: function() {
                    return h;
                }
            },

            /**
                Center of BoundingBox instance

                @property center
                @type {Object}
             */
            center: {
                get: function() {
                    return {
                        x: this.x + this.width / 2,
                        y: this.y + this.height / 2
                    };
                }
            }
        });

        /**
            Check if this BoundingBox contains another BoundingBox

            @method containsBoundingBox
            @param {BoundingBox} bbox The other BoundingBox
            @return {boolean} True if contains the other BoundingBox, false
            otherwise.
         */
        this.containsBoundingBox = function(bbox) {
            return (bbox.x >= x && bbox.x + bbox.width <= x + w && bbox
                .y >= y && bbox.y + bbox.height <= y + h);
        };

        /**
            Check if this BoundingBox contains a point

            @method containsPoint
            @param {BoundingBox} bbox The point
            @return {boolean} True if contains the point, false otherwise
         */
        this.containsPoint = function(point) {
            return point.x >= x && point.x <= x + w && point.y >= y &&
                point.y <= y + h;
        };

        /**
            Check if this BoundingBox instance intersects another
            BoundingBox instance. Based on
            <a href="http://stackoverflow.com/a/13390495/1930331">>this</a>
            StackOverflow answer.
            @method intersects
            @param  {[type]} bbox [description]
            @return {[type]} [description]
         */
        this.intersects = function(bbox) {
            return !(this.x + this.width < bbox.x || bbox.x + bbox.width <
                this.x || this.y + this.height < bbox.y || bbox.y +
                bbox.height < this.y);
        };

        /**
            Get the intersection of this BoundingBox
            and another BoundingBox

            @method intersection
            @param {BoundingBox} bbox Another BoundingBox instance.
            @return {BoundingBox}
         */
        this.intersection = function(bbox) {
            var x1 = Math.max(this.x, bbox.x),
                y1 = Math.max(this.y, bbox.y),
                x2 = Math.min(this.x + this.width, bbox.x +
                    bbox.width),
                y2 = Math.min(this.y + this.height, bbox.y +
                    bbox.height),
                intWidth = x2 - x1,
                intHeight = y2 - y1;
            if (intWidth < 0 || intHeight < 0) {
                return null;
            }
            return new module.exports.BoundingBox(x1, y1, intWidth, intWidth);
        };
    }
};

},{}],4:[function(require,module,exports){
var _ = require('underscore'),
    Hash = require('./hash'),
    MinHeap = require('./minHeap');

/**
    Graph abstract data structure to represent maze structure.

    @class Graph
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

/**
   @module util/graph
 */
module.exports = {
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
            @param {GraphNode} tail Tail node of edge
            @param {GraphNode} head Head node of edge
            @param {number} [weight=0] Weight of edge
            @param {Object} [data=undefined] Data object for edge
         */
        function GraphEdge(tail, head, weight, data) {
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
            this.weight = weight || 0;

            this.data = data;
        }

        /**
            Add a node to the graph

            @method addNode
            @param   {Object} data Data to be stored in the node
            @return  {GraphNode} A node with the data
         */
        this.addNode = function(data) {
            var node = new GraphNode(data);
            this.nodes.add(node);
            return node;
        };

        /**
            Get a node with the given data

            @method getNode
            @param  {Object} data The data in the desired node
            @return {GraphNode} The desired node
         */
        this.getNode = function(data) {
            var ret;
            this.nodes.forEach(function(node) {
                if (node.data === data) {
                    ret = node;
                    return true;
                }
            });
            return ret;
        };

        /**
            Add an edge to the graph

            @method addEdge
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
            Get edge with given tail and head.

            @method getEdge
            @param  {GraphNode} tail Tail node
            @param  {GraphNode} head Head node
            @return {GraphEdge} If edge exists, the edge, otherwise,
            undefined.
         */
        this.getEdge = function(tail, head) {
            return this.adjacencyList.get(tail).toArray()
                .filter(function(edge) {
                    return edge.head === head;
                })[0];
        };

        /**
            Remove an edge from the graph

            @method removeEdge
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
            @param {Function} f The operation to perform on the visited
            nodes
            @return {void}
         */
        this.depthFirstSearch = function(f) {
            // Inner helper function
            function depthFirstSearchHelper(node) {
                if (visitedSet.contains(node)) {
                    return true;
                }
                visitedSet.add(node);
                var doneSearching = f(node);
                if (doneSearching !== true) {
                    var ret;
                    node.neighbors.forEach(function(neighbor) {
                        ret = depthFirstSearchHelper(neighbor) ||
                            ret;
                    });
                    return ret;
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
           @param {function} f The operation to perform on the visited
           nodes
           @return {void}
         */
        this.breadthFirstSearch = function(f) {
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
                var doneSearching = f(node) || false;
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

        /**
            Kruskal's algorithm

            @method kruskal
            @return {Graph} Graph of minimum spanning tree
         */
        this.kruskal = function() {
            var minSpanningTree = new module.exports.Graph(),
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

},{"./hash":5,"./minHeap":7,"underscore":9}],5:[function(require,module,exports){
var _ = require('underscore');

/**
   Hash class used to generate hashcodes for JavaScript objects. The hashcode
   is stored as a property of the object, but it is set to non-enumerable and
   cannot be changed, thereby guaranteeing the consistency of hashcodes.

   @module util/hash
   @class Hash
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////
var currentHash = 0,
    INIT_CAPACITY = 16,
    LOAD_FACTOR = 0.5;
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
        Return a hashcode for this object. Does not conform to the Java
        standard that two objects that are structurally identical should
        yield the same hashcode.

        @method hashcode
        @static
        @param   {Object} object Object to get hashcode for
        @return  {integer} Hashcode for object
     */
    hashcode: function(object) {
        if (object._hashId === undefined) {
            Object.defineProperty(object, '_hashId', {
                value: currentHash,
                enumerable: false
            });
            currentHash++;
        }
        return object._hashId;
    },

    /**
        Hashset data structure used to store unique objects without
        duplicates. The hashset will add identical items of the same type,
        as long as they are not the exact same object (or the hashcode
        property is identical). For more info, see the {{#crossLink Hash}}
        {{/crossLink}}.

       @class Hashset
    */

    /**
       @class Hashset
       @constructor
     */
    Hashset: function() {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var bucket = new Array(INIT_CAPACITY),
            size = 0,
            capacity = INIT_CAPACITY,
            indicesTaken = [];

        /**
           Resolve a collision in the hashset.

           @method resolveCollision
           @private
           @param  {Object} object
           @param  {integer} index Index where collision occurred
           @return {boolean} Whether or not the item was added to the set
         */
        function resolveCollision(object, index) {
            var location = bucket[index];
            if (_.isArray(location)) {
                if (_.contains(location, object)) {
                    return false;
                } else {
                    location.push(object);
                    return true;
                }
            } else {
                bucket[index] = [location, object];
                return true;
            }
        }
        /**
           Add the index of a location that is currently occupied in the
           array

           @method addIndex
           @private
           @param  {integer} idx Index of occupied location
         */
        function addIndex(idx) {
            // Add idx to the sorted indicesTaken array
            var spot = _.sortedIndex(indicesTaken, idx);
            if (indicesTaken[spot] !== idx) {
                indicesTaken.splice(spot, 0, idx);
            }
        }

        /**
           Helper method to rehash the array when the objects inserted
           exceeds half of the total capacity

           @method rehash
           @private
           @return {void}
         */
        function rehash() {
            // Create new bucket that is double the size
            var
                oldBucket = bucket,
                oldIndices = indicesTaken,
                hashTarget;

            capacity *= 2;
            bucket = new Array(capacity);
            indicesTaken = [];
            // Transfer all elements to new array
            var idxLen = oldIndices.length;
            for (var i = 0; i < idxLen; i++) {
                var object = oldBucket[oldIndices[i]];
                if (_.isArray(object)) {
                    var subArray = object,
                        subArrayLen = subArray.length;
                    for (var j = 0; j < subArrayLen; j++) {
                        var element = subArray[j];
                        hashTarget = element.key || element;
                        insert(element, hashTarget);
                    }
                } else {
                    hashTarget = object.key || object;
                    insert(object, hashTarget);
                }
            }
        }

        /**
           Insert an object into the internal array.

           @method insert
           @private
           @param  {Object} object An object to insert into the array
           @param  {Object} [hashTarget=`object`] An object used to generate
           a hashcode
           @return {boolean} Whether or not the object was inserted into the
           array
         */
        function insert(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            var index = module.exports.hashcode(hashTarget) % capacity,
                location = bucket[index];
            var locKey;
            if (location) {
                locKey = location.key;
            }
            if (location === undefined) {
                bucket[index] = object;
                addIndex(index);
                return true;
            } else if (location === object || originalTarget === locKey) {
                return false;
            } else {
                return resolveCollision(object, index);
            }
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        Object.defineProperties(this, {
            /**
               The size of the Hashset

               @property length
               @type {integer}
             */
            length: {
                get: function() {
                    return size;
                }
            }
        });
        /**
           Add an object

           @method add
           @param   {Object} object Object to add
           @param   {Object} [hashTarget] Object to hash
           @return  {boolean} Whether or not the insertion was successful
         */
        this.add = function(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                object)) {
                return false;
            }
            var inserted = insert(object, hashTarget);
            if (inserted) {
                size++;
                if (size / capacity > LOAD_FACTOR) {
                    rehash();
                }
                return true;
            }
            return false;
        };

        /**
            Get the union of this set with another set

            @method union
            @param  {Hashset} otherSet Other set
            @return {Hashset} Union of both set
         */
        this.union = function(otherSet) {
            var unionSet = new Hash.Hashset();
            _this.forEach(function(elem) {
                unionSet.add(elem);
            });
            otherSet.forEach(function(elem) {
                unionSet.add(elem);
            });
            return unionSet;
        };

        /**
           Clear the Hashset instance of all elements

           @method clear
           @return  {void}
         */
        this.clear = function() {
            bucket = new Array(INIT_CAPACITY);
            size = 0;
            capacity = INIT_CAPACITY;
            indicesTaken = [];
        };

        /**
           Check if an object is an element of this set

           @method contains
           @param   {Object} object An object that may be an element
           @return  {boolean} Whether or not the object is an element
         */
        this.contains = function(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                object)) {
                return false;
            }
            var index = module.exports.hashcode(hashTarget) % capacity,
                location = bucket[index];
            var locKey;
            if (location) {
                locKey = location.key;
            }
            if (location === object || originalTarget === locKey) {
                return true;
            } else if (_.isArray(location)) {
                for (var i = 0; i < location.length; i++) {
                    var elem = location[i];
                    var elemKey;
                    if (elem) {
                        elemKey = elem.key;
                    }
                    if (elem === object || originalTarget === elemKey) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
            Check if this Hashset instance is the same as another
            @method equals
            @param  {Hashset} otherSet Other set to compare with
            @return {boolean} True if equal, false otherwise
         */
        this.equals = function(otherSet) {
            if (this.length !== otherSet.length) {
                return false;
            }

            var result = true;
            this.forEach(function(elem) {
                if (!otherSet.contains(elem)) {
                    result = false;
                    // Terminate iteration
                    return true;
                }
            });
            return result;
        };

        /**
           Remove an object

           @method remove
           @param {Object} object An object
           @return {boolean} True if removed object from set, false if
           object could not be removed from set
         */
        this.remove = function(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                object)) {
                return false;
            }
            var contained = _this.contains(object, originalTarget);
            if (contained) {
                var index = module.exports.hashcode(hashTarget) % capacity,
                    location = bucket[index];
                var locKey;
                if (location) {
                    locKey = location.key;
                }
                if (location === object || locKey === originalTarget) {
                    // Set bucket at index to undefined
                    delete bucket[index];
                    indicesTaken = _.without(indicesTaken, index);
                    size--;
                    return true;
                } else {
                    for (var i = 0; i < location.length; i++) {
                        if (location[i] === object) {
                            // Set location at i to undefined
                            delete location[i];
                            size--;
                            return true;
                        }
                    }
                }
            }
            return false;
        };

        /**
            Get the object from the set
            @method get

            @param  {Object} object Object to get
            @param  {Object} hashTarget Object to hash
            @return {Object} Object from set if it exists, null otherwise.
         */
        this.get = function(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            var index = module.exports.hashcode(hashTarget) % capacity,
                location = bucket[index];
            var locKey;
            if (location) {
                locKey = location.key;
            }
            if (location === undefined) {
                return null;
            } else if (location === object || locKey === originalTarget) {
                return location;
            } else {
                var arrLen = location.length;
                for (var i = 0; i < arrLen; i++) {
                    var element = location[i],
                        elemKey = element.key;
                    if (element === object || elemKey ===
                        originalTarget) {
                        return element;
                    }
                }
                return null;
            }
        };

        /**
            Apply function to each object in Hashset instance

            @method forEach
            @param  {Function} f Function that takes an element of the
            Hashset as a parameter. Function can terminate forEach method by
            returning true.
            @return {void}
         */
        this.forEach = function(f) {
            var numIndices = indicesTaken.length,
                result;

            for (var i = 0; i < numIndices; i++) {
                var idx = indicesTaken[i],
                    current = bucket[idx];
                if (_.isArray(current)) {
                    var arrLen = current.length;
                    for (var j = 0; j < arrLen; j++) {
                        var element = current[j];
                        result = f(element);
                        if (result === true) {
                            return;
                        }
                    }
                } else {
                    result = f(current);
                    if (result === true) {
                        return;
                    }
                }
            }
        };

        /**
            Get the elements in the Hashset instance in an array

            @method toArray
            @return {Array} Array of elements
         */
        this.toArray = function() {
            var arr = [];
            this.forEach(function(elem) {
                arr.push(elem);
            });
            return arr;
        };
    },

    /**
        Hashtable implementation to map objects to other objects.

        @class Hashtable
     */

    /**
        @class Hashtable
        @constructor
     */
    Hashtable: function() {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var hashset = new module.exports.Hashset();

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        /**
            Put new entry in Hashtable

            @method put
            @param  {Object} key Entry key
            @param  {Object} value Entry value
            @return {boolean} True if successfully added new entry, false
            otherwise
         */
        this.put = function(key, value) {
            var entry = {
                key: key,
                value: value
            };
            return hashset.add(entry, key);
        };

        /**
            Get value of entry with given key.

            @method get
            @param  {Object} key Key for entry
            @return {Object} Value of entry
         */
        this.get = function(key) {
            return hashset.get(key, key).value;
        };

        /**
            Check whether or not Hashtable contains a given key

            @method containsKey
            @param  {Object} key The key to check for
            @return {boolean} Whether or not key is in Hashtable
         */
        this.containsKey = function(key) {
            return hashset.contains(key, key);
        };

        /**
            Remove an entry from Hashtable instance
            @method remove
            @param  {Object} key Key of entry to remove
            @return {boolean} Whether or not entry was successfully removed
         */
        this.remove = function(key) {
            return hashset.remove(key, key);
        };

        /**
            Clear all entries from Hashtable instance
            @method clear
            @return {void}
         */
        this.clear = function() {
            hashset.clear();
        };

        /**
            Apply function to each entry in Hashtable instance

            @method forEach
            @param  {Function} f Function that takes entry as parameter.
            Entry has key and value properties.
            @return {void}
         */
        this.forEach = function(f) {
            hashset.forEach(function(entry) {
                f(entry.key, entry.value);
            });
        };

        Object.defineProperties(this, {
            length: {
                get: function() {
                    return hashset.length;
                }
            }
        });
    }
};

},{"underscore":9}],6:[function(require,module,exports){
var _ = require('underscore'),
    BoundingBox = require('./boundingBox');

/**
   Math extensions

   @class MathExtensions
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////
/**
   @module util/mathExtensions
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
       Generate a random integer.

       @method  randomInt
       @static
       @param   {integer} [minimum=0] The minimum for the random integer
       (inclusive)
       @param   {integer} maximum The maximum for the random integer
       (not inclusive)
       @return  {integer} A random integer within the specified range.
     */
    randomInt: function(minimum, maximum) {
        return Math.floor(module.exports.randomFloat.apply(this, arguments));
    },

    /**
       Generate a random float.

       @method randomFloat
       @static
       @param   {float} [minimum=0] The minimum for the random float
       (inclusive)
       @param   {float} maximum The maximum for the random float
       (not inclusive)
       @return  {float} A random float within the specified range.
     */
    randomFloat: function(minimum, maximum) {
        var min, max, range;
        switch (arguments.length) {
            case 1:
                min = 0;
                max = minimum;
                break;
            case 2:
                min = minimum;
                max = maximum;
                break;
        }
        range = max - min;
        return Math.random() * range + min;
    },

    /**
        Iterate randomly from 0 to a given maximum. Stores the range of
        numbers internally inside an array, so do not use with large
        numbers.

        @method randomIterator
        @param  {number} max Maximum (not inclusive)
        @param  {Function} f Function to apply to index. Takes a number as a
        parameter. Function can exit iteration by returning true.
        @return {void}
     */
    randomIterator: function(max, f) {
        var range = [];
        for (var i = 0; i < max; i++) {
            range.push(i);
        }
        while (range.length > 0) {
            var randomIdx = module.exports.randomInt(range.length),
                done = f(range[randomIdx]);
            if (done === true) {
                return;
            }
            range.splice(randomIdx, 1);
        }
    },

    /**
        Get the dot product of two vectors.

        @method dotProduct
        @static
        @param  {Array} vector1 A vector of numbers
        @param  {Array} vector2 A vector of numbers (same length as vector1)
        @return {float} The dot product of the two vectors.
     */
    dotProduct: function(vector1, vector2) {
        var total = 0;
        if (vector1.length !== vector2.length) {
            return null;
        }
        for (var i = 0; i < vector1.length; i += 1) {
            total += vector1[i] * vector2[i];
        }
        return total;
    },

    /**
        Rotation matrix

        @method rotationMatrix
        @param  {number}    angle Counterclockwise angle in radian
        @return {Matrix}    Rotation matrix
     */
    rotationMatrix: function(angle) {
        return new module.exports.Matrix([
            Math.cos(angle), -Math.sin(angle), 0,
            Math.sin(angle), Math.cos(angle), 0,
            0, 0, 1
        ], 3, 3);
    },

    /**
        Build a matrix from a 2d array

        @method buildMatrix
        @static
        @param  {Array}     rows 2d array
        @return {Matrix}    Matrix from 2d array
     */
    buildMatrix: function(rows) {
        var
            numRows = rows.length,
            numColumns = rows[0].length;

        return new module.exports.Matrix(_.flatten(rows), numRows, numColumns);
    },

    /**
        A matrix to represent transformations, etc.

        @class Matrix
        @constructor
        @param {Array} entriesArray An array with all of the values in the
        matrix
        @param {number} numRows Number of rows in the matrix
        @param {number} numRows Number of column in the matrix
    */
    Matrix: function(entriesArray, numRows, numColumns) {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var rows;

        /**
            Add the elements of a matrix to this matrix

            @method addAll
            @private
            @param  {Matrix} matrix      Other matrix
            @param  {number} coefficient Coefficient to multiply elements of
            other matrix before addition
            @return {Matrix} Result of addition
         */
        function addAll(matrix, coefficient) {
            var newEntries = [];
            if (_this.numRows !== matrix.numRows || _this.numColumns !==
                matrix.numColumns) {
                return null;
            }
            _this.forEachEntry(function(entry, row, column) {
                var sum = entry + coefficient * matrix.get(row,
                    column);
                newEntries.push(sum);
            });
            return new module.exports.Matrix(newEntries, _this.numRows,
                _this.numColumns);
        }

        /**
            Generate rows of the matrix

            @method generateRows
            @private
            @return {void}
         */
        function generateRows() {
            // Store the matrix in a 2d array.
            rows = [];
            for (var i = 0; i < _this.numRows; i += 1) {
                var row = [];
                for (var j = 0; j < _this.numColumns; j += 1) {
                    row.push(entriesArray[i * _this.numColumns + j]);
                }
                rows.push(row);
            }
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        this.numRows = numRows;
        this.numColumns = numColumns;

        /**
            Apply a function to each element in the matrix (in order)

            @method forEachEntry
            @param  {Function} f Function that takes element as parameter
            @return {void}
         */
        this.forEachEntry = function(f) {
            for (var i = 0; i < numRows; i += 1) {
                for (var j = 0; j < numColumns; j += 1) {
                    f(rows[i][j], i, j);
                }
            }
        };

        /**
            Get an element from the matrix

            @method get
            @param  {integer} row Index of the row to select
            @param  {integer} column Index of the column to select
            @return {number} Number at row and column
         */
        this.get = function(row, column) {
            return rows[row][column];
        };

        /**
            Get an element from the matrix

            @method set
            @param  {integer} row Index of the row to select
            @param  {integer} column Index of the column to select
            @param  {number}  value Number at row and column
            @return {void}
         */
        this.set = function(row, column, value) {
            rows[row][column] = value;
        };

        /**
            Get a row from the matrix

            @method getRow
            @param  {integer}  rowIndex Index of row
            @return {Array} Row as array
         */
        this.getRow = function(rowIndex) {
            // Return a clone of the row.
            return rows[rowIndex].slice(0);
        };

        /**
            Get a column from the matrix

            @method getColumn
            @param  {integer} columnIndex Index of column
            @return {Array} Column as array
         */
        this.getColumn = function(columnIndex) {
            var column = [];
            for (var i = 0; i < _this.numRows; i += 1) {
                column.push(rows[i][columnIndex]);
            }
            return column;
        };

        /**
            Get a 2d array representing the matrix

            @method toArray2D
            @return {Array} 2d array of matrix
         */
        this.toArray2D = function() {
            var arr = [];
            this.forEachEntry(function(entry, i, j) {
                while (i >= arr.length) {
                    arr.push([]);
                }
                arr[i].push(entry);
            });
            return arr;
        };

        /**
            Add this matrix with another matrix

            @method add
            @param  {Matrix} matrix Another matrix
            @return {Matrix} The resulting matrix
         */
        this.add = function(matrix) {
            return addAll(matrix, 1);
        };

        /**
            Subtract another matrix from this matrix

            @method subtract
            @param  {Matrix} matrix Another matrix
            @return {Matrix} The resulting matrix
         */
        this.subtract = function(matrix) {
            return addAll(matrix, -1);
        };

        /**
            Multiply this matrix with another matrix

            @method multiply
            @param  {Matrix} matrix Another matrix
            @return {Matrix} The resulting matrix
         */
        this.multiply = function(matrix) {
            var newEntries = [],
                vector1, vector2, dotProduct;
            if (_this.numColumns !== matrix.numRows) {
                return null;
            }
            for (var i = 0; i < _this.numRows; i += 1) {
                vector1 = _this.getRow(i);
                for (var j = 0; j < matrix.numColumns; j += 1) {
                    vector2 = matrix.getColumn(j);
                    dotProduct = module.exports.dotProduct(vector1, vector2);
                    newEntries.push(dotProduct);
                }
            }
            return new module.exports.Matrix(newEntries, this.numRows,
                matrix.numColumns);
        };

        /**
            Multiply the matrix by a coefficient

            @method multiplyCoefficient
            @param  {number} k Coefficient
            @return {Matrix} New matrix multiplied by coefficient
         */
        this.multiplyCoefficient = function(k) {
            var newEntries = [];
            this.forEachEntry(function(entry, i, j) {
                newEntries.push(entry * k);
            });
            return new module.exports.Matrix(newEntries, this.numRows,
                this.numRows);
        };

        /**
            LU Decomposition (only for square matrices). Based on
            <a href="http://rosettacode.org/wiki/LU_decomposition#Python">
            this</a> article.

            @method luDecomposition
            @return {Object} Lower, upper, and pivot matrices in hash with
            keys l, u, and p respectively
         */
        this.luDecomposition = function() {
            // Inner helper function
            function pivotize() {
                var
                    n = _this.numRows,
                    id = [],
                    maxIter = function(i) {
                        return _this.get(i, j);
                    };

                for (var j = 0; j < n; j++) {
                    id.push([]);
                    for (var i = 0; i < n; i++) {
                        id[j].push((i === j ? 1 : 0));
                    }
                }
                for (j = 0; j < n; j++) {
                    var row = _.max(_.range(j, n), maxIter);
                    if (j !== row) {
                        var tmp = id[j];
                        id[j] = id[row];
                        id[row] = tmp;
                    }
                }
                return module.exports.buildMatrix(id);
            }

            // Main function
            var n = _this.numRows,
                l = [],
                u = [],
                p = pivotize(),
                i, j, k;
            var a2 = p.multiply(_this).toArray2D();
            for (i = 0; i < n; i++) {
                l.push([]);
                u.push([]);
                for (j = 0; j < n; j++) {
                    l[i].push(0);
                    u[i].push(0);
                }
            }
            for (j = 0; j < n; j++) {
                l[j][j] = 1;
                for (i = 0; i <= j; i++) {
                    var s1 = 0;
                    for (k = 0; k < i; k++) {
                        s1 += u[k][j] * l[i][k];
                    }
                    u[i][j] = a2[i][j] - s1;
                }
                for (i = j; i < n; i++) {
                    var s2 = 0;
                    for (k = 0; k < j; k++) {
                        s2 += u[k][j] * l[i][k];
                    }
                    l[i][j] = (a2[i][j] - s2) / u[j][j];
                }
            }
            return {
                l: module.exports.buildMatrix(l),
                u: module.exports.buildMatrix(u),
                p: p
            };
        };

        /**
            Get the determinant of the matrix (must be a square matrix)

            @method determinant
            @return {number}    The determinant
         */
        this.determinant = function() {
            var luDec = this.luDecomposition(),
                l = luDec.l,
                u = luDec.u,
                p = luDec.p,
                det = 1;

            for (var i = 0; i < this.numRows; i++) {
                det *= l.get(i, i) * u.get(i, i) * p.get(i, i);
            }

            return det;
        };

        /**
            Get the inverse of the matrix (must be a square matrix)

            @method inverse
            @return {Matrix}    The inverse matrix
         */
        this.inverse = function() {
            if (this.numRows === 3) {
                var
                    a = this.get(0, 0),
                    b = this.get(0, 1),
                    c = this.get(0, 2),
                    d = this.get(1, 0),
                    e = this.get(1, 1),
                    f = this.get(1, 2),
                    g = this.get(2, 0),
                    h = this.get(2, 1),
                    i = this.get(2, 2),
                    det = a * (e * i - f * h) - b * (i * d - f * g) +
                    c * (d * h - e * g),
                    inv = new module.exports.Matrix([
                        (e * i - f * h), -(b * i - c * h), (b * f -
                            c * e),
                        -(d * i - f * g), (a * i - c * g), -(a * f - c * d),
                        (d * h - e * g), -(a * h - b * g), (a * e -
                            b * d)
                    ], 3, 3);
                return inv.multiplyCoefficient(1 / det);
            } else {
                // TODO: n by n matrix inverse
            }
        };

        // Call generateRows to do setup
        generateRows();
    },

    /**
        Transformation matrix class

        @class Transformation
        @constructor
     */
    Transformation: function() {
        var _this = this;

        ////////////////////////////
        // Private fields/methods //
        ////////////////////////////

        var
            matrix = new module.exports.Matrix([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ], 3, 3),
            angle = 0;

        ///////////////////////////
        // Public fields/methods //
        ///////////////////////////

        Object.defineProperties(this, {
            /**
                Translation in x

                @property tx
                @type {number}
             */
            tx: {
                get: function() {
                    return matrix.get(0, 2);
                },
                set: function(value) {
                    matrix.set(0, 2, value);
                }
            },

            /**
                Translation in y

                @property ty
                @type {number}
             */
            ty: {
                get: function() {
                    return matrix.get(1, 2);
                },
                set: function(value) {
                    matrix.set(1, 2, value);
                }
            },

            /**
                Scale in x

                @property sx
                @type {number}
             */
            sx: {
                get: function() {
                    return matrix.get(0, 0);
                },
                set: function(value) {
                    matrix.set(0, 0, value);
                }
            },

            /**
                Scale in y

                @property sy
                @type {number}
             */
            sy: {
                get: function() {
                    return matrix.get(1, 1);
                },
                set: function(value) {
                    matrix.set(1, 1, value);
                }
            },

            /**
                Shear in x

                @property x
                @type {number}
             */
            shx: {
                get: function() {
                    return matrix.get(0, 1);
                },
                set: function(value) {
                    matrix.set(0, 1, value);
                }
            },

            /**
                Shear in y

                @property y
                @type {number}
             */
            shy: {
                get: function() {
                    return matrix.get(1, 0);
                },
                set: function(value) {
                    matrix.set(1, 0, value);
                }
            },

            /**
                Angle of rotation (counterclockwise in radian)

                @property angle
                @type {number}
             */
            angle: {
                get: function() {
                    return angle;
                },
                set: function(newAngle) {
                    // Subtract current angle to reset and add new angle
                    this.rotate(-angle + newAngle);
                }
            }
        });

        /**
            Translate matrix from its current position

            @method translate
            @param  {number}  dx x offset
            @param  {number}  dy y offset
            @return {void}
         */
        this.translate = function(dx, dy) {
            matrix.set(0, 2, dx);
            matrix.set(1, 2, dy);
        };

        /**
            Rotate matrix

            @method rotate
            @param  {number} rotateAngle Counterclockwise angle in radian
            @return {void}
         */
        this.rotate = function(rotateAngle) {
            angle = (angle + rotateAngle) % (Math.PI * 2);
            var rotationMatrix = module.exports.rotationMatrix(rotateAngle);
            matrix = matrix.multiply(rotationMatrix);
        };

        /**
            Apply this transformation to a point

            @method applyToPoint
            @param  {Point}     point Point to apply transformation to
            @return {Point}     New point with transformation applied
         */
        this.applyToPoint = function(point) {
            var
                coords = new module.exports.Matrix([point.x, point.y, 1], 3, 1),
                newCoords = matrix.multiply(coords),
                x = newCoords.get(0, 0),
                y = newCoords.get(1, 0);
            return {
                x: x,
                y: y
            };
        };

        /**
            Apply the inverse of the transformation to a point to do
            collision detection

            @method adjustPoint
            @param  {Point}    point Point to apply transformation to
            @return {Point}    A new point with the transformation
         */
        this.adjustPoint = function(point) {
            var
                coords = new module.exports.Matrix([point.x, point.y, 1], 3, 1),
                newCoords = matrix.inverse().multiply(coords),
                x = newCoords.get(0, 0),
                y = newCoords.get(1, 0);
            return {
                x: x,
                y: y
            };
        };
    }
};

},{"./boundingBox":3,"underscore":9}],7:[function(require,module,exports){
//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////
var DEFAULT_SIZE = 16;
/**
   @module util/minHeap
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////
    /**
       @class MinHeap
       @constructor
       @param {Function|number} [arg1=numeric_comparator|16] Comparator function (if one argument) or size (if two arguments)
       @param {Function} [arg2=numeric_comparator] Comparator function
     */
    MinHeap: function() {
        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var size = DEFAULT_SIZE,
            comparator = function(data1, data2) {
                return data1 - data2;
            };
        if (arguments.length === 2) {
            // parameters are size then comparator
            size = arguments[0];
            comparator = arguments[1];
        } else if (arguments.length === 1) {
            comparator = arguments[0];
        } else if (arguments.length > 2) {
            throw new Error(
                'Invalid parameters for MinHeap constructor');
        }
        var _this = this,
            data = new Array(size),
            heapSize = 0;

        /**
            Get index in array of left child

            @method getLeftChildIndex
            @private
            @param  {number} nodeIndex Index of parent
            @return {number} Index of left child in array
         */
        function getLeftChildIndex(nodeIndex) {
            return 2 * nodeIndex + 1;
        }

        /**
            Get index in array of right child

            @method getRightChildIndex
            @private
            @param  {number} nodeIndex Index of parent
            @return {number} Index of right child in array
         */
        function getRightChildIndex(nodeIndex) {
            return 2 * nodeIndex + 2;
        }

        /**
            Get index of parent

            @method getParentIndex
            @private
            @param  {number} nodeIndex Index of child
            @return {number} Index of parent
         */
        function getParentIndex(nodeIndex) {
            return Math.floor((nodeIndex + 1) / 2) - 1;
        }

        /**
            Heapify

            @method bubbleUp
            @private
            @param  {number} nodeIndex Index to bubbleUp
            @return {void}
         */
        function bubbleUp(nodeIndex) {
            if (nodeIndex === 0) {
                return;
            }
            var parentIndex = getParentIndex(nodeIndex);
            if (comparator(data[parentIndex], data[nodeIndex]) > 0 &&
                parentIndex >= 0) {
                var newNodeIndex = data[parentIndex];
                data[parentIndex] = data[nodeIndex];
                data[nodeIndex] = newNodeIndex;
                nodeIndex = parentIndex;
                bubbleUp(nodeIndex);
            } else {
                return;
            }
        }

        /**
            Remove minimum element from heap

            @method removeMin
            @private
            @return {Object} Data of minimum node
         */
        function removeMin() {
            if (heapSize === 0) {
                return;
            }
            data[0] = data[heapSize - 1];
            heapSize--;
            if (heapSize > 0) {
                bubbleDown(0);
            }
        }

        /**
            Heapify

            @method bubbleDown
            @private
            @param  {number} nodeIndex Index of node to modify
            @return {void}
         */
        function bubbleDown(nodeIndex) {
            var leftChildIndex = getLeftChildIndex(nodeIndex),
                rightChildIndex = getRightChildIndex(nodeIndex),
                smallerValueIndex;
            // This long if else assigns the smaller child
            if (leftChildIndex < heapSize && rightChildIndex < heapSize) {
                if (comparator(data[leftChildIndex], data[
                    rightChildIndex]) < 0) {
                    smallerValueIndex = leftChildIndex;
                } else {
                    smallerValueIndex = rightChildIndex;
                }
            } else if (leftChildIndex < heapSize) {
                smallerValueIndex = leftChildIndex;
            } else if (rightChildIndex < heapSize) {
                smallerValueIndex = rightChildIndex;
            } else {
                return;
            }
            if (smallerValueIndex >= 0 && comparator(data[
                smallerValueIndex], data[nodeIndex]) < 0) {
                var temp = data[nodeIndex];
                data[nodeIndex] = data[smallerValueIndex];
                data[smallerValueIndex] = temp;
                nodeIndex = smallerValueIndex;
                bubbleDown(nodeIndex);
            }
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        /**
            Add object to MinHeap

            @method add
            @param  {Object} object Object to add
            @return {void}
         */
        this.add = function(object) {
            heapSize++;
            var currentIndex = heapSize - 1;
            data[currentIndex] = object;
            bubbleUp(currentIndex);
        };

        /**
            Return the minimum element and extract it

            @method poll
            @return {Object} The minimum element
         */
        this.poll = function() {
            var min = data[0];
            removeMin();
            return min;
        };

        /**
            Return the minimum element without extracting it

            @method peek
            @return {Object} The minimum element
         */
        this.peek = function() {
            return data[0];
        };

        /**
            Clear the MinHeap of all elements

            @method clear
            @return {void}
         */
        this.clear = function() {
            heapSize = 0;
            data.forEach(function(element, index) {
                delete data[index];
            });
        };

        Object.defineProperties(this, {
            /**
                Number of elements in the MinHeap

                @property length
                @type {number}
             */
            length: {
                get: function() {
                    return heapSize;
                }
            }
        });
    }
};

},{}],8:[function(require,module,exports){
var
    Graph = require('../util/graph'),
    Direction = require('../enum/direction');

/**
    Functions to call from worker

    @module worker/workerTasks
 */
module.exports = {
    /**
        Build a graph object from a JSON object passed from the worker

        @method constructGraph
        @param  {Object} dictionary JSON object representing graph
        @return {Graph} Graph representing JSON object
     */
    constructGraph: function(dictionary) {
        var
            graph = new Graph.Graph(),
            key;
        // Add the nodes to the graph
        for (key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
                key = parseInt(key);
                graph.addNode(key);
            }
        }
        // Add the edges
        for (key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
                key = parseInt(key);

                var
                    node = graph.getNode(key),
                    neighborArr = dictionary[key],
                    neighborArrLen = neighborArr.length,
                    edge,
                    neighborKey,
                    neighbor,
                    direction;

                for (var index = 0; index < neighborArrLen; index++) {
                    neighborKey = neighborArr[index];
                    if (neighborKey !== undefined) {
                        neighbor = graph.getNode(neighborKey);
                        direction = index + Direction.MIN;
                        edge = graph.addEdge(node, neighbor);
                        edge.data = direction;
                    }
                }
            }
        }
        return graph;
    },

    /**
        Get path from source node to destinaton node

        @method getPath
        @param  {Graph} graph Graph
        @param  {GraphNode} source Source node to start from
        @param  {GraphNode} dest Destination node to stop at
        @return {Array} Array of Direction enums representing the path
     */
    getPath: function(graph, source, dest) {
        var
            currentNode,
            path = [];

        graph.dijkstra(source, dest);

        currentNode = dest;
        while (currentNode.previous !== undefined) {
            var dir = graph.getEdge(currentNode.previous, currentNode).data;
            path.push(dir);
            currentNode = currentNode.previous;
        }

        return path.reverse();
    }
};

},{"../enum/direction":1,"../util/graph":4}],9:[function(require,module,exports){
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the 
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from an array.
  // If **n** is not specified, returns a single random element from the array.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (arguments.length < 2 || guard) {
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

},{}]},{},[2])
}(self));
