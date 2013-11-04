define([], function() {
    "use strict";

    /**
     * @exports util/boundingCube
     */
    var module = {
        // Public class methods/fields

        /**
         * Create a BoundingCube.
         * @constructor
         * @param {(float|Point)} arg0  - The x coordinate of left side, or left-back-top point.
         * @param {(float|Point)} arg1  - The y coordinate of front side, or right-front-bottom point.
         * @param {(float|Point)} arg2  - The z coordinate of bottom side, or width of the cube.
         * @param {float} arg3          - Width of the cube.
         * @param {float} arg4          - Length of the cube.
         * @param {float} arg5          - Height of the cube.
         */
        BoundingCube: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            // Private instance methods/fields
            var x, y, z, w, l, h;
            switch (arguments.length) {
            case 2:
                var point1 = arg0;
                var point2 = arg1;
                x = point1.x;
                y = point1.y;
                z = point1.z;
                w = point2.x - point1.x;
                l = point2.y - point1.y;
                h = point2.z - point1.z;
                break;
            case 6:
                x = arg0;
                y = arg1;
                z = arg2;
                w = arg3;
                l = arg4;
                h = arg5;
                break;
            }

            if (w < 0 || l < 0 || h < 0) {
                // Return null, because it is not a valid cube.
                return null;
            }
              
            /** Minimum x coordinate. */
            this.x = x;

            /** Minimum y coordinate. */
            this.y = y;

            /** Minimum z coordinate. */
            this.z = z;

            /** Width of the BoundingCube. */
            this.width = w;

            /** Length of the BoundingCube. */
            this.length = l;

            /** Height of the BoundingCube. */
            this.height = h;

            /** Center of the BoundingCube. */
            this.center = {
                x: x + w / 2,
                y: y + l / 2,
                z: z + h / 2
            };

            this.points = [];
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 2; j++) {
                    for (var k = 0; k < 2; k++) {
                        this.points.push({
                            x: this.x + this.width * i,
                            y: this.y + this.length * j,
                            z: this.z + this.height * k
                        });
                    }
                }
            }

            /**
             * Check if this BoundingCube contains another BoundingCube.
             * @param {BoundingCube} bcube - The other BoundingCube
             * @return {boolean} True if contains the other BoundingCube, false otherwise.
             */
            this.containsBoundingCube = function(bcube) {
                return (bcube.x >= x && bcube.x + bcube.width <= x + w &&
                        bcube.y >= y && bcube.y + bcube.length <= y + l &&
                        bcube.z >= z && bcube.z + bcube.height <= z + h);
            };

            /**
             * Get the intersection of this BoundingCube
             * and another BoundingCube.
             * @param {BoundingCube} otherBcube - Another BoundingCube instance.
             * @return {BoundingCube}
             */
            this.intersection = function(otherBcube) {
                x1 = Math.max(bcube.x, otherBcube.x);
                y1 = Math.max(bcube.y, otherBcube.y);
                z1 = Math.max(bcube.z, otherBcube.z);
                x2 = Math.min(bcube.x + bcube.width,
                        otherBcube.x + otherBcube.width);
                y2 = Math.min(bcube.y + bcube.length,
                        otherBcube.y + otherBcube.length);
                z2 = Math.min(bcube.z + bcube.height,
                    otherBcube.z + otherBcube.height);
                return new BoundingCube(x1, y1, z1, x2 - x1, y2 - y1, z2 - z1);
            };

            // This line makes BoundingCube instances immutable.
            Object.freeze(this);
        }
    };

    return module; 
});

