// Quadtree for hit-testing. Based on http://en.wikipedia.org/wiki/Quadtree. 

define(['util/boundingBox'], function(BoundingBox) {
    "use strict";

    var module;

    // Private class methods/fields

    module = {
        // Public class methods/fields
        var QT_NODE_CAPACITY = 4;

        // Constructor
        create: function(bbox) {
            var quadtree;

            // Private instance methods/fields
            var quadtreeNW, quadtreeNE, quadtreeSW, quadtreeSE;
            var subtrees = [quadtreeNW, quadtreeNE, quadtreeSW, quadtreeSE];
            var points = [];

            quadtree = {
                // Public instance methods/fields
                
                insert: function(point) {
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
                    if (northwest == null) {
                        quadtree.subdivide();
                    }

                    var subtreesLen = subtrees.length;
                    for (var i = 0; i < subtreesLen; i++) {
                        if (subtrees[i].insert(point)) {
                            return true;
                        }
                    }

                    return false;
                },

                subdivide: function() {
                    // TODO
                },

                queryRange: function() {
                    // TODO
                }
            };

            return quadtree;
        }
    };

    return module; 
});

