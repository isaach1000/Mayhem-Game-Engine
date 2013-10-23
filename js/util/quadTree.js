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
            var quadtreeNW, quadtreeNE, quadtreeSW, quadtreeSE;
            var subtrees = [quadtreeNW, quadtreeNE, quadtreeSW, quadtreeSE];
            var points = [];

            /**
             * Create four quadtrees which fully divide this quadtree into four
             * quads of equal area.
             *
             * @private
             * @return {void} 
             */
            var subdivide = function() {
                // TODO
                //var bboxNW = BoundingBox;
            };
              
            /** The bounding box of the QuadTree's coordinates. */
            this.boundingBox = bbox;
            
            /**
             * Insert a point into the QuadTree.
             *
             * @param {Point} point -- The point to insert.
             * @return {boolean} -- Whether or not insertion was successful.
             */
            this.insert = function(point) {
                if (!bbox.containsPoint(point)) {
                    // Point cannot be inserted.
                    return false;
                }
                
                // If there is space in this quadtree, add the point here.
                if (points.length < QT_NODE_CAPACITY) {
                    points.push(point);
                    return true;
                }
                // Otherwise, we need to subdivide then add the point to
                // whichever node will accept it.
                if (quadtreeNW == null) {
                    this.subdivide();
                }
                var subtreesLen = subtrees.length;
                for (var i = 0; i < subtreesLen; i++) {
                    if (subtrees[i].insert(point)) {
                        return true;
                    }
                }
                return false;
            };

            /**
             * Query the tree for points within a range.
             *
             * @param {BoundingBox} rangeBbox -- The query range bounding box.
             * @return {Array.<Point>} -- An array of points within the range.
             */
            this.queryRange = function(rangeBbox) {
                // Prepare an array of results.
                var results = [];
                if (bbox.boundingBox.intersection(rangeBbox) == null) {
                    var pointsLen = points.length;
                    for (var i = 0; i < pointsLen; i++) {
                        var point = points[i];
                        if (rangeBbox.containsPoint(point)) {
                            results.push(point);
                        }
                    }
                }
                // If there are no subtrees, return results.
                if (quadtreeNW == null) {
                    return results;
                }
                // Get the results of the subtrees.
                var subtreesLen = subtrees.length;
                for (var i = 0; i < subtreesLen; i++) {
                    var subtree = subtrees[i];
                    results = results.concat(subtree.queryRange(rangeBbox));
                }
                return result;
            };
        }
    };

    return module; 
});

