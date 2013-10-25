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
         * @param {Array.<Point>} points    -   An array of points that describe the polygon.
         * @param {CanvasDrawer} drawer     -   A CanvasDrawer to draw the rectangle of the canvas.
         * @param {Object} drawingSettings  -   A dictionary of drawing options.
         */
        Polygon: function(points, drawer, drawingSettings) {
            // Public instance methods/fields

            /**
             * getCanvasDrawer
             *
             * @return {CanvasDrawer} - The current canvas drawer.
             */
            this.getCanvasDrawer = function() {
                return drawer;
            };

            // TODO: should there be a setter for the drawer?
            
            /**
             * Set the drawing settings for the rectangle. TODO: valid settings are...
             *
             * @param {Object} settings - An object with drawing settings.
             * @return {void}
             */
            this.setDrawingSettings = function(settings) {
                drawingSettings = settings;
            }

            /**
             * Draw the rectangle onto the canvas using the CanvasDrawer.
             *
             * @return {void}
             */
            this.draw = function() {
                drawer.setContextSettings(drawingSettings);
                drawer.beginPath();
                var numPoints = points.length;
                drawer.drawLine(points[0], points[1], true)
                for (var i = 1; i < numPoints; i++) {
                    var point = points[i];
                    drawer.drawLine(points[i], points[(i + 1) % numPoints]);
                }
                drawer.closePath();
                drawer.fill();
                drawer.stroke();
            };
        }
    };

    return module; 
});
