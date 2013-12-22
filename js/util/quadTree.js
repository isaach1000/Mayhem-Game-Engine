/**
   A QuadTree is a data structure for optimizing hit-testing. Based on
   this <a href="http://en.wikipedia.org/wiki/Quadtree">Wikipedia article</a>.

   @class QuadTree
 */
define(['util/boundingBox'], function(BoundingBox) {
    "use strict";

    /**
       @module util/quadTree
     */
    var module = {
        QT_NODE_CAPACITY: 4,

        /**
           @constructor
           @param {BoundingBox} bbox
         */
        QuadTree: function(bbox) {
            // Private instance methods/fields
            var
            quadTreeNW, quadTreeNE, quadTreeSW, quadTreeSE,
                subtrees = [quadTreeNW, quadTreeNE, quadTreeSW, quadTreeSE],
                shapes = [];

            /**
                 Create four quadTrees which fully divide this quadTree into four
                 quads of equal area.

                 @method subdivide
                 @private
                 @return {void}
               */
            function subdivide() {
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
            }

            /**
               The bounding box of the QuadTree's coordinates.

               @property boundingBox
               @type {BoundingBox}
             */
            this.boundingBox = bbox;

            /**
               Insert a shape into the QuadTree.

               @method insert
               @param {Object} shape The shape to insert.
               @chainable
             */
            this.insert = function(shape) {
                var i, subtreesLen = subtrees.length;

                if (!bbox.containsBoundingBox(shape.boundingBox)) {
                    // BoundingBox cannot be inserted.
                    return this;
                }

                // If there is space in this quadTree, add the shape here.
                if (shapes.length < module.QT_NODE_CAPACITY) {
                    shapes.push(shape);
                    return this;
                }
                // Otherwise, we need to subdivide then add the shape to
                // whichever node will accept it.
                if (quadTreeNW === undefined) {
                    this.subdivide();
                }

                for (i = 0; i < subtreesLen; i += 1) {
                    if (subtrees[i].insert(shape)) {
                        return this;
                    }
                }

                // If no child can insert the shape, insert it into the parent
                // despite the capacity limit. The shape is probably lying
                // on a border.
                shapes.push(shape);
                return this;
            };

            /**
               Query the tree for shapes within a range.

               @method queryRange
               @param {BoundingBox} rangeBbox   - The query range bounding box.
               @return {Array}    An array of shapes within the range.
             */
            this.queryRange = function(rangeBbox) {
                // Prepare an array of results.
                var results = [],
                    i, shape, box, numShapes = shapes.length,
                    subtreesLen = subtrees.length,
                    subtree;

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

            /**
                Query the tree for shapes that intersect a point.

                @method query
                @param  {Point} point A point
                @return {Array} An array of shapes intersecting the point
             */
            this.query = function(point) {
                var bbox = new BoundingBox.BoundingBox(point.x, point.y, 1, 1);
                return this.queryRange(bbox);
            };
        }
    };

    return module;
});
