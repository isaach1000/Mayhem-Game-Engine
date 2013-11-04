define([
    'foundation/polyhedron',
    'util/boundingCube',
    'util/mathExtensions'
    ], function(Polyhedron,
        BoundingCube,
        MathExt) {
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
         * @param {float}           x               - The x coordinate of the rectangle on the canvas.
         * @param {float}           y               - The y coordinate of the rectangle on the canvas.
         * @param {float}           width           - The width of the rectangle.
         * @param {float}           height          - The height of the rectangle.
         * @param {CanvasDrawer}    drawer          - A CanvasDrawer to draw the rectangle onto the canvas.
         * @param {Object}          drawingSettings - A dictionary of drawing options.
         */
        Rectangle: function(x, y, width, length, drawer, drawingSettings) {
            // Private instance methods/fields
            
            this.bcube = new BoundingCube.BoundingCube(x, y, 0, width, length, 0);
            var polyhedron = new Polyhedron.Polyhedron([
                {x: x, y: y, z: 0},
                {x: x + width, y: y, z: 0},
                {x: x + width, y: y + length, z: 0},
                {x: x, y: y + length, z: 0}
            ], drawer, drawingSettings);

            
            // Public instance methods/fields
                       
            /**
             * getCanvasDrawer
             *
             * @return {CanvasDrawer} - The current canvas drawer.
             */
            this.getCanvasDrawer = function() {
                return drawer;
            };

            /**
             * Set the drawing settings for the rectangle. TODO: valid settings are...
             *
             * @param {Object} settings - An object with drawing settings.
             * @return {void}
             */
            this.setDrawingSettings = function(settings) {
                drawingSettings = settings;
            };

            /**
             * Draw the rectangle onto the canvas using the CanvasDrawer.
             *
             * @return {void}
             */
            this.draw = function() {
                polyhedron.draw();
            };

            /**
             * Clear the shape.
             * 
             * @return {void}
             */
            this.clear = function() {
                polyhedron.clear();
            };
        }
    };

    return module;
});

