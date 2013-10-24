define([], function() {
    "use strict";

    // Private class methods/fields
    
    /**
     * @exports foundation/rectangle 
     */
    var module = {
        // Public class methods/fields
        
        /**
         * Rectangle
         *
         * @constructor
         * @param {float} x                 -   The x coordinate of the rectangle on the canvas.
         * @param {float} y                 -   The y coordinate of the rectangle on the canvas.
         * @param {float} width             -   The width of the rectangle.
         * @param {float} height            -   The height of the rectangle.
         * @param {CanvasDrawer} drawer     -   A CanvasDrawer to draw the rectangle of the canvas.
         * @param {Object} drawingSettings  -   A dictionary of drawing options.
         */
        Rectangle: function(x, y, width, height, drawer, drawingSettings) {
            // Private instance methods/fields             


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
                drawer.rect(x, y, width, height);
                drawer.stroke();
                drawer.fill();
            };
        }
    };

    return module;
});

