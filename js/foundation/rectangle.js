define([
    'foundation/polygon',
    'util/boundingBox',
    'util/matrix'
    ], function(Polygon,
        BoundingBox,
        Matrix) {
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
        Rectangle: function(x, y, width, height, drawer, drawingSettings) {
            // Private instance methods/fields
            
            this.bbox = new BoundingBox.BoundingBox(x, y, width, height);
            var polygon = new Polygon.Polygon([
                {x: x, y: y},
                {x: x + width, y: y},
                {x: x + width, y: y + height},
                {x: x, y: y + height}
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

            // TODO: should there be a setter for the drawer?
            
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
             * Change coordinates to isometric.
             * @return {void}
             */
            this.projectIsometric = function() {
                for (var i = 0; i < 4; i++) {
                    var point = polygon.points[i];
                    var cartesian = new Matrix.Matrix([point.x, 0, point.y], 3, 1);
                    var isometric = Matrix.ISOMETRIC_MATRIX.multiply(cartesian);
                    point.x = isometric.get(0, 0);
                    point.y = isometric.get(1, 0);
                }
            };

            /**
             * Draw the rectangle onto the canvas using the CanvasDrawer.
             *
             * @return {void}
             */
            this.draw = function() {
                polygon.draw();
            };

            /**
             * Clear the shape.
             * 
             * @return {void}
             */
            this.clear = function() {
                polygon.clear();
            };
        }
    };

    return module;
});

