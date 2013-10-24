define([], function() {
    "use strict";

    // Private class methods/fields

    /**
     * @exports util/polygon
     */
    var module = {
        /**
         * Polygon
         *
         * @constructor
         * @param {Array.<Point>} arrayOfPoints - An array of points that describe the polygon.
         */
        Polygon: function(arrayOfPoints) {
            // Private instance methods/fields, `var privateFoo = 4; var bar = function() {...};` etc.
            
            // Public instance methods/fields, `this.x = x; this.y = function() {...};` etc.
            this.points = [];
        }
    };

    return module; 
});

