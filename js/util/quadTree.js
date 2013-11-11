define(['util/boundingBox'], function(BoundingBox) {
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
         * @param {BoundingBox} bbox
         */
        QuadTree: function(bbox) {
            // Private instance methods/fields
            var quadTreeNW, quadTreeNE, quadTreeSW, quadTreeSE,
                subtrees = [quadTreeNW, quadTreeNE, quadTreeSW, quadTreeSE],
                shapes = [],

            /**
             * Create four quadTrees which fully divide this quadTree into four
             * quads of equal area.
             *
             * @private
             * @return {void} 
             */
            subdivide = function() {
                var bboxNW = new BoundingBox(bbox.x, bbox.y,
                                    bbox.width / 2, bbox.height / 2),
                    bboxNE = new BoundingBox(bbox.x + bbox.width / 2, bbox.y,
                                                bbox.width / 2, bbox.height / 2),
                    bboxSW = new BoundingBox(bbox.x, bbox.y + bbox.height / 2,
                                                 bbox.width / 2, bbox.height / 2),
                    bboxSE = new BoundingBox(bbox.x + bbox.width / 2,
                                                 bbox.y + bbox.height / 2,
                                                 bbox.width / 2, bbox.height / 2);
                
                quadTreeNW = new module.QuadTree(bboxNW);
                quadTreeNE = new module.QuadTree(bboxNE);
                quadTreeSW = new module.QuadTree(bboxSW);
                quadTreeSE = new module.QuadTree(bboxSE); 
            };
              
            /** The bounding box of the QuadTree's coordinates. */
            this.boundingBox = bbox;
            
            /**
             * Insert a shape into the QuadTree.
             *
             * @param {Object.<bbox>} shape -- The shape to insert.
             * @return {boolean} Whether or not insertion was successful.
             */
            this.insert = function(shape) {
                var i, subtreesLen = subtrees.length;
                
                if (!bbox.containsBoundingBox(shape.boundingBox)) {
                    // BoundingBox cannot be inserted.
                    return false;
                }
                
                // If there is space in this quadTree, add the shape here.
                if (shapes.length < module.QT_NODE_CAPACITY) {
                    shapes.push(shape);
                    return true;
                }
                // Otherwise, we need to subdivide then add the shape to
                // whichever node will accept it.
                if (quadTreeNW === undefined) {
                    this.subdivide();
                }
                
                for (i = 0; i < subtreesLen; i += 1) {
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
             * Query the tree for boxes within a range.
             *
             * @param {BoundingBox} rangeBbox   - The query range bounding box.
             * @return {Array.<BoundingBox>}    An array of boxes within the range.
             */
            this.queryRange = function(rangeBbox) {
                // Prepare an array of results.
                var results = [], i, shape, box, numShapes = shapes.length, 
                    subtreesLen = subtrees.length, subtree;
                    
                if (bbox.intersection(rangeBbox) !== null) {
                    for (i = 0; i < numShapes; i += 1) {
                        shape = shapes[i];
                        box = shape.boundingBox;
                        if (rangeBbox.intersection(box) !== null) {
                            results.push(shape);
                        }
                    }
                }
                // If there are no subtrees, return results.
                if (quadTreeNW === undefined) {
                    return results;
                }
                // Get the results of the subtrees.
                for (i = 0; i < subtreesLen; i += 1) {
                    subtree = subtrees[i];
                    results = results.concat(subtree.queryRange(rangeBbox));
                }
                return results;
            };
        }
    };

    return module; 
});

