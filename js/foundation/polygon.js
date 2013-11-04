define([
        'foundation/shape',
        'util/boundingBox'
    ], function(Shape,
        BoundingBox) {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
     * @exports util/polygon
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        
        /**
         * Generate a BoundingBox for a polygon.
         *
         * @param {Array.<Point>} points - An array of points describing the polygon.
         * @return {BoundingBox} - A BoundingBox that contains all of the points.
         */
        generateBbox: function(points) {
            var minX = points[0].x,
                maxX = points[0].x,
                minY = points[0].y,
                maxY = points[0].y;
            var numPoints = points.length;
            for (var i = 0; i < numPoints; i++) {
                var point = points[i];
                if (minX > point.x) {
                    minX = point.x;
                }
                if (maxX < point.x) {
                    maxX = point.x;
                }
                if (minY > point.y) {
                    minY = point.y;
                }
                if (maxY < point.y) {
                    maxY = point.y;
                }
            }
            return new BoundingBox.BoundingBox(minX, minY, maxX, maxY);
        },

        /**
         * Polygon
         *
         * @constructor
         * @extends {Shape}
         * @param {Array.<Point>} points    -   An array of points that describe the polygon.
         * @param {CanvasDrawer} drawer     -   A CanvasDrawer to draw the polygon onto the canvas.
         * @param {Object} drawingSettings  -   A dictionary of drawing options.
         */
        Polygon: function(points, drawer, drawingSettings) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            
            var bbox = module.generateBbox(points);
            var x = bbox.x,
                y = bbox.y,
                w = bbox.w,
                h = bbox.h;


            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            // Extend Shape constructor
            Shape.Shape.call(this, x, y, w, h, drawer, drawingSettings);

            /**
             * Draw the rectangle onto the canvas using the CanvasDrawer.
             *
             * @return {void}
             */
            this.draw = function() {
                drawer.beginPath();
                drawer.contextSettings = drawingSettings;
                var numPoints = points.length;
                drawer.drawLine(points[0], points[1], true);
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
