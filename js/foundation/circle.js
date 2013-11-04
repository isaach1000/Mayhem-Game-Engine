define(['util/objectUtility', 'util/boundingBox'], function(ObjUtil, BoundingBox) {
    "use strict";

    // Private class methods/fields
    
    /**
     * @exports foundation/circle
     */
    var module = {
        // Public class methods/fields
        
        /**
         * Circle
         *
         * @constructor
         * @param {float} x                 -   The x coordinate of the circle on the canvas.
         * @param {float} y                 -   The y coordinate of the circle on the canvas.
         * @param {float} radius            -   The radius of the circle.
         * @param {CanvasDrawer} drawer     -   A CanvasDrawer to draw the circle onto the canvas.
         * @param {Object} drawingSettings  -   A dictionary of drawing options.
         */
        Circle: function(x, y, radius, drawer, drawingSettings) {
            // Private instance methods/fields

            var boundingBox = new BoundingBox.BoundingBox(x, y, radius * 2, radius * 2);

            // Public instance methods/fields
            
            this.x = x;
            this.y = y;
            this.radius = radius;

            this.getBoundingBox = function() {
                return boundingBox;
            };

            Object.defineProperty(this, 'drawingSettings', {
                get: function() {
                    return ObjUtil.clone(drawingSettings);
                },
                set: function(newSettings) {
                    drawingSettings = newSettings;
                }
            });

            /**
             * Draw the circle onto the canvas using the CanvasDrawer.
             *
             * @return {void}
             */
            this.draw = function() {
                drawer.beginPath();
                drawer.setContextSettings(drawingSettings);
                drawer.arc(this.x, this.y, this.radius, this.radius, 0, Math.PI * 2, true);
                drawer.fill();
                drawer.stroke();
            };

            /**
             * Clear the shape.
             * 
             * @return {void}
             */
            this.clear = function() {
                var bigRadius = this.radius + 3;
                drawer.clearRect(this.x - bigRadius, this.y - bigRadius, 2 * bigRadius, 2 * bigRadius);
            };
        }
    };

    return module; 
});
