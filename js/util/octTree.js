define(['util/boundingCube'], function(BoundingCube) {
    "use strict";
    
    /**
     * QuadTree for hit-testing. Based on http://en.wikipedia.org/wiki/Quadtree.
     * 
     * @exports util/quadTree
     */
    var module = {
        QT_NODE_CAPACITY: 4,

        /**
         * @constructor
         * @param {BoundingCube} bcube
         */
        QuadTree: function(bcube) {
            // Private instance methods/fields
            var quadTreeNW, quadTreeNE, quadTreeSW, quadTreeSE;
            var subtrees = [quadTreeNW, quadTreeNE, quadTreeSW, quadTreeSE];
            var shapes = [];

            /**
             * Create four quadTrees which fully divide this quadTree into four
             * quads of equal area.
             *
             * @private
             * @return {void} 
             */
            var subdivide = function() {
                var bcubeNW = new BoundingCube(bcube.x, bcube.y,
                                    bcube.width / 2, bcube.height / 2);
                quadTreeNW = new QuadTree(bcubeNW);

                var bcubeNE = new BoundingCube(bcube.x + bcube.width / 2, bcube.y,
                                            bcube.width / 2, bcube.height / 2);
                quadTreeNE = new QuadTree(bcubeNE);

                var bcubeSW = new BoundingCube(bcube.x, bcube.y + bcube.height / 2,
                                             bcube.width / 2, bcube.height / 2);
                quadTreeSW = new QuadTree(bcubeSW);

                var bcubeSE = new BoundingCube(bcube.x + bcube.width / 2,
                                             bcube.y + bcube.height / 2,
                                             bcube.width / 2, bcube.height / 2);
                quadTreeSE = new QuadTree(bcubeSE); 
            };
              
            /** The bounding cube of the QuadTree's coordinates. */
            this.boundingCube = bcube;
            
            /**
             * Insert a shape into the QuadTree.
             *
             * @param {Object.<bcube>} shape -- The shape to insert.
             * @return {boolean} Whether or not insertion was successful.
             */
            this.insert = function(shape) {
                if (!bcube.containsBoundingCube(shape.bcube)) {
                    // BoundingCube cannot be inserted.
                    return false;
                }
                
                // If there is space in this quadTree, add the shape here.
                if (shapes.length < module.QT_NODE_CAPACITY) {
                    shapes.push(shape);
                    return true;
                }
                // Otherwise, we need to subdivide then add the shape to
                // whichever node will accept it.
                if (quadTreeNW == null) {
                    this.subdivide();
                }
                var subtreesLen = subtrees.length;
                for (var i = 0; i < subtreesLen; i++) {
                    if (subtrees[i].insert(shape)) {
                        return true;
                    }
                }

                // If no child can insert the shape, insert it into the parent
                // despite the capacity limit. The shape is probably lying
                // on a border.
                shapes.push(shape);
                return true;
            };

            /**
             * Query the tree for cubees within a range.
             *
             * @param {BoundingCube} rangeBcube -- The query range bounding cube.
             * @return {Array.<BoundingCube>} An array of cubees within the range.
             */
            this.queryRange = function(rangeBcube) {
                // Prepare an array of results.
                var results = [];
                if (bcube.boundingCube.intersection(rangeBcube) == null) {
                    var cubeesLen = cubees.length;
                    for (var i = 0; i < cubeesLen; i++) {
                        var cube = cubees[i];
                        if (rangeBcube.containsBoundingCube(cube)) {
                            results.push(cube);
                        }
                    }
                }
                // If there are no subtrees, return results.
                if (quadTreeNW == null) {
                    return results;
                }
                // Get the results of the subtrees.
                var subtreesLen = subtrees.length;
                for (var i = 0; i < subtreesLen; i++) {
                    var subtree = subtrees[i];
                    results = results.concat(subtree.queryRange(rangeBcube));
                }
                return result;
            };
        }
    };

    return module; 
});

