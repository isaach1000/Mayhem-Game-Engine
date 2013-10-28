define(['util/boundingBox'], function(BoundingBox) {
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

            /**
             * getCanvasDrawer
             *
             * @return {CanvasDrawer} - The current canvas drawer.
             */
            this.getCanvasDrawer = function() {
                return drawer;
            };
            
            /**
             * Set the drawing settings for the circle. TODO: valid settings are...
             *
             * @param {Object} settings - An object with drawing settings.
             * @return {void}
             */
            this.setDrawingSettings = function(settings) {
                drawingSettings = settings;
            }

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
