define([], function() {
    "use strict";

    var module;

    // Private class methods/fields

    module = {
        // Public class methods/fields
    
        // Constructor
        createBoundingBox: function() {
            var bbox;
            
            // Private instance methods/fields
            var x, y, w, h;
            switch (arguments.length) {
            case 2:
                var point1 = arguments[0];
                var point2 = arguments[1];
                x = point1.x;
                y = point1.y;
                w = point2.x - point1.x;
                h = point2.y - point1.y;
                break;
            case 4:
                x = arguments[0];
                y = arguments[1];
                w = arguments[2];
                h = arguments[3];
                break;
            }

            var center = {
                x: x + w / 2,
                y: y + h / 2
            };

            bbox = {
                // Public fields
                
                x: x,
                y: y,
                width: w,
                height: h,
                center: center,


                // Public methods

                containsPoint: function(point) {
                    return (point.x >= x && point.x < x + w &&
                            point.y >= y && point.y < y + h);
                },

                intersection: function(otherBbox) {
                    x1 = Math.max(bbox.x, otherBbox.x);
                    y1 = Math.max(bbox.y, otherBbox.y);
                    x2 = Math.min(bbox.x + bbox.width,
                            otherBbox.x + otherBbox.width);
                    y2 = Math.min(bbox.y + bbox.height,
                            otherBbox.y + otherBbox.height);
                    return module.createBoundingBox(x1, y1, x2 - x1, y2 - y1);
                }
            };

            // This line makes bounding boxes immutable.
            Object.freeze(bbox);

            return bbox;
        }
    };

    return module; 
});

