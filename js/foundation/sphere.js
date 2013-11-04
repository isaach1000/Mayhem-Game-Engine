define(['util/boundingCube'], function(BoundingCube) {
    "use strict";

    // Private class methods/fields
    
    /**
     * @exports foundation/sphere
     */
    var module = {
        // Public class methods/fields
        
        /**
         * Sphere
         *
         * @constructor
         * @param {float} x                 -   The x coordinate of the sphere on the canvas.
         * @param {float} y                 -   The y coordinate of the sphere on the canvas.
         * @param {float} radius            -   The radius of the sphere.
         * @param {CanvasDrawer} drawer     -   A CanvasDrawer to draw the sphere onto the canvas.
         * @param {Object} drawingSettings  -   A dictionary of drawing options.
         */
        Sphere: function(x, y, z, radius, drawer, drawingSettings) {
            // Private instance methods/fields

            var boundingCube = new BoundingCube.BoundingCube(x, y, radius * 2, radius * 2);

            // Public instance methods/fields
            
            this.x = x;
            this.y = y;
            this.z = z;
            this.radius = radius;

            this.getBoundingCube = function() {
                return boundingCube;
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
             * Set the drawing settings for the sphere. TODO: valid settings are...
             *
             * @param {Object} settings - An object with drawing settings.
             * @return {void}
             */
            this.setDrawingSettings = function(settings) {
                drawingSettings = settings;
            }

            /**
             * Draw the sphere onto the canvas using the CanvasDrawer.
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
