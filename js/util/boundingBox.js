require([], function() {
    "use strict";

    var module;

    // Private class methods/fields

    module = {
        // Public class methods/fields
    
        // Constructor
        create: function() {
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
                // Public instance methods/fields
                
                containsPoint: function(point) {
                    // TODO
                },

                intersection: function(otherBbox) {
                    // TODO
                }
            };

            return bbox;
        }
    };

    return module; 
});

