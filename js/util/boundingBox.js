define([], function() {
    "use strict";

    /**
     * @exports util/boundingBox
     */
    var module = { 
        /**
         * Create a bounding box.
         * @constructor
         * @param {(float|Point)} arg0 - The x coordinate of left side, or upper-left point.
         * @param {(float|Point)} arg1 - The y coordinate of top side, or bottom-right point.
         * @param {float} arg2 - The width of the box.
         * @param {float} arg3 - The height of the box.
         */
        BoundingBox: function(arg0, arg1, arg2, arg3) {
            // Private instance methods/fields
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
                // Return null because no valid intersection.
                return null;
            }

            this.center = {
                x: x + w / 2,
                y: y + h / 2
            };
              
            /** Minimum x coordinate. */
            this.x = x;

            /** Minimum y coordinate. */
            this.y = y;

            /** Width of the bounding box. */
            this.width = w;

            /** Height of the bounding box. */
            this.height = h;

            /** Center of the bounding box. */
            this.center = center;
            
            /**
             * Check if the bounding box contains a point.
             * @param {Point} point -- The point to check for.
             * @return {boolean}
             */
            this.containsPoint = function(point) {
                return (point.x >= x && point.x < x + w &&
                        point.y >= y && point.y < y + h);
            };

            /**
             * Get the intersection of this bounding box
             * and another bounding box.
             * @param {BoundingBox} otherBbox -- Another bounding box instance.
             * @return {BoundingBox}
             */
            this.intersection = function(otherBbox) {
                x1 = Math.max(bbox.x, otherBbox.x);
                y1 = Math.max(bbox.y, otherBbox.y);
                x2 = Math.min(bbox.x + bbox.width,
                        otherBbox.x + otherBbox.width);
                y2 = Math.min(bbox.y + bbox.height,
                        otherBbox.y + otherBbox.height);
                return new BoundingBox(x1, y1, x2 - x1, y2 - y1);
            };

        // This line makes bounding boxes immutable.
        Object.freeze(this);
    }
};

    return module; 
});

