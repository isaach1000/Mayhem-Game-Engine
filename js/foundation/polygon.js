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
            return new BoundingBox.BoundingBox(minX, minY, maxX - minX, maxY - minY);
        },

        /**
         * Polygon
         *
         * @constructor
         * @extends {Shape}
         * @param {Array.<Point>} points    -   An array of points that describe the polygon.
         * @param {CanvasbbDrawer} drawer   -   A CanvasDrawer to draw the polygon onto the canvas.
         * @param {Object} drawingSettings  -   A dictionary of drawing options.
         */
        Polygon: function(points, drawer, drawingSettings) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            
            var _this = this;

            var bbox = module.generateBbox(points),
                x = bbox.x,
               	y = bbox.y,
                w = bbox.width,
                h = bbox.height;

            // TODO: fix lineWidth more completely
            var adjustPoints = function() {
                var numPoints = _this.points.length,
                    lineWidth = drawingSettings.lineWidth || 0,
                    center = _this.boundingBox.center,
                    ret = [];
                for (var i = 0; i < numPoints; i++) {
                    var adjPt = {
                        x: _this.points[i].x - _this.boundingBox.x,
                        y: _this.points[i].y - _this.boundingBox.y
                    };
                    if (adjPt.x < center.x) {
                    	adjPt.x += lineWidth;
                    }
                    else {
                    	adjPt.x -= lineWidth;
                    }
                    if (adjPt.y < center.y) {
                    	adjPt.y += lineWidth;
                    }
                    else {
                    	adjPt.y -= lineWidth;
                    }
                    ret.push(adjPt);
                }
                return ret;
            };

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            // Extend Shape constructor
            Shape.Shape.call(this, x, y, w, h, drawer, drawingSettings);

            Object.defineProperties(this, {
                /**
                 * Points of Polygon instance
                 * @type {Array.<Point>}
                 * @memberof module:foundation/polygon.Polygon
                 * @instance
                 */
                points: {
                    get: function() {
                        return points;
                    },
                    set: function(newPoints) {
                        points = newPoints;
                        this.boundingBox = generateBbox(this.points);
                    }
                }
            });

            /**
             * Draw the rectangle onto the canvas using the CanvasbbDrawer.
             *
             * @return {void}
             */
            this.drawShape = function(bbDrawer) {
                bbDrawer.beginPath();
                bbDrawer.contextSettings = this.drawingSettings;

                var adjPoints = adjustPoints(),
                    numPoints = adjPoints.length;
                bbDrawer.drawLine(adjPoints[0], adjPoints[1], true);
                for (var i = 1; i < numPoints; i++) {
                    var point = adjPoints[i];
                    bbDrawer.drawLine(adjPoints[i], adjPoints[(i + 1) % numPoints]);
                }

                bbDrawer.closePath();
                bbDrawer.fill();
                bbDrawer.stroke();
            };
        }
    };

    return module; 
});
