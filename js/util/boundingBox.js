define([], function() {
    "use strict";

    /**
     * @exports util/boundingBox
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * Create a BoundingBox.
         * @constructor
         * @param {(float|Point)} arg0  - The x coordinate of left side, or left-top point.
         * @param {(float|Point)} arg1  - The y coordinate of front side, or right-bottom point.
         * @param {float} arg2          - Width of the box.
         * @param {float} arg3          - Height of the box.
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
                // Return null, because it is not a valid box.
                return null;
            }
              

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
        
            /** Minimum x coordinate. */
            this.x = x;

            /** Minimum y coordinate. */
            this.y = y;

            /** Width of the BoundingBox. */
            this.width = w;

            /** Height of the BoundingBox. */
            this.height = h;

            /** Center of the BoundingBox. */
            this.center = {
                x: x + w / 2,
                y: y + h / 2
            };

            this.points = [];
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 2; j++) {
                    this.points.push({
                        x: this.x + this.width * i,
                        y: this.y + this.height * j
                    });
                }
            }

            /**
             * Check if this BoundingBox contains another BoundingBox.
             * @param {BoundingBox} bbox - The other BoundingBox
             * @return {boolean} True if contains the other BoundingBox, false otherwise.
             */
            this.containsBoundingBox = function(bbox) {
                return (bbox.x >= x && bbox.x + bbox.width <= x + w &&
                        bbox.y >= y && bbox.y + bbox.height <= y + h);
            };

            /**
             * Get the intersection of this BoundingBox
             * and another BoundingBox.
             * @param {BoundingBox} otherBbox - Another BoundingBox instance.
             * @return {BoundingBox}
             */
            this.intersection = function(otherBbox) {
                x1 = Math.max(bbox.x, otherBbox.x);
                y1 = Math.max(bbox.y, otherBbox.y);
                x2 = Math.min(bbox.x + bbox.width,
                        otherBbox.x + otherBbox.width);
                y2 = Math.min(bbox.y + bbox.length,
                        otherBbox.y + otherBbox.length);
                return new BoundingBox(x1, y1, z1, x2 - x1, y2 - y1);
            };

            // This line makes BoundingBox instances immutable.
            Object.freeze(this);
        }
    };

    return module; 
});

