define(['util/boundingCube',
        'util/mathExtensions'
        ], function(BoundingCube,
            MathExt) {
    "use strict";

    // Private class methods/fields

    /**
     * @exports util/polyhedron
     */
    var module = {
        /**
         * Generate a BoundingCube for a polyhedron.
         *
         * @param {Array.<Point>} points - An array of points defining the polyhedron.
         * @return {BoundingCube} - A BoundingCube that contains all of the points.
         */
        generateBcube: function(points) {
            var minX = points[0].x,
                maxX = points[0].x,
                minY = points[0].y,
                maxY = points[0].y,
                minZ = points[0].z,
                maxZ = points[0].z;

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
                if (minZ > point.z) {
                    minZ = point.z;
                }
                if (maxZ < point.z) {
                    maxZ = point.z;
                }
            }

            return new BoundingCube.BoundingCube(minX, minY, minZ, maxX - minX, maxY - minY, maxZ - minZ);
        },

        /**
         * Polyhedron
         *
         * @constructor
         * @param {Array.<Point>} points    -   An array of points that describe the polyhedron.
         * @param {CanvasDrawer} drawer     -   A CanvasDrawer to draw the polyhedron onto the canvas.
         * @param {Object} drawingSettings  -   A dictionary of drawing options.
         */
        Polyhedron: function(points, drawer, drawingSettings) {
            // Private instance methods/fields

            var EXTRA_BOUNDS = drawingSettings.lineWidth;            
            var _this = this;

            /**
             * Generate a 2d box to clear the canvas with.
             * 
             * @return {Box}    A box with properties x, y, width, height.
             */
            var clearingBox = {x: 0, y: 0, w: 0, h: 0};

            // Public instance methods/fields
            
            _this.points = points;
            _this.bcube = module.generateBcube(_this.points);
            

            /**
             * Get the CanvasDrawer.
             *
             * @return {CanvasDrawer} - The current canvas drawer.
             */
            _this.getCanvasDrawer = function() {
                return drawer;
            };

            // TODO: should there be a setter for the drawer?
            
            /**
             * Set the drawing settings for the rectangle. TODO: valid settings are...
             *
             * @param {Object} settings - An object with drawing settings.
             * @return {void}
             */
            _this.setDrawingSettings = function(settings) {
                drawingSettings = settings;
            };

            /**
             * Draw the rectangle onto the canvas using the CanvasDrawer.
             *
             * @return {void}
             */
            _this.draw = function() {
                drawer.beginPath();
                drawer.setContextSettings(drawingSettings);
                var points2d = MathExt.projectIsometric(_this.points);
                drawer.drawLine(points2d[0], points2d[1], true);

                var minX = points2d[0].x,
                    maxX = points2d[0].x,
                    minY = points2d[0].y,
                    maxY = points2d[0].y;

                var numPoints = points.length;
                for (var i = 1; i < numPoints; i++) {
                    var point = points2d[i];
                    drawer.drawLine(points2d[i], points2d[(i + 1) % numPoints]);
                }

                drawer.closePath();
                drawer.fill();
                drawer.stroke();
            };

            /**
             * Clear the shape.
             * 
             * @return {void}
             */
            _this.clear = function() {
                drawer.clearCanvas();
            };
        }
    };

    return module; 
});
