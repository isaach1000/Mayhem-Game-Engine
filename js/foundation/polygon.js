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
         * @param {CanvascanvasDrawer} drawer   -   A CanvasDrawer to draw the polygon onto the canvas.
         * @param {Object} drawingSettings  -   A dictionary of drawing options.
         */
        Polygon: function(points, drawer, drawingSettings) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var bbox = module.generateBbox(points),
                x = bbox.x,
               	y = bbox.y,
                w = bbox.width,
                h = bbox.height;


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
             * Draw the rectangle onto the canvas using the CanvascanvasDrawer.
             *
             * @return {void}
             */
            this.drawShape = function(canvasDrawer) {
                canvasDrawer.beginPath();
                canvasDrawer.contextSettings = this.drawingSettings;

                var pts = this.points,
                    numPoints = pts.length;
                canvasDrawer.drawLine(pts[0], pts[1], true);
                for (var i = 1; i < numPoints; i++) {
                    var point = pts[i];
                    canvasDrawer.drawLine(pts[i], pts[(i + 1) % numPoints]);
                }

				canvasDrawer.closePath();
                canvasDrawer.fill();
                canvasDrawer.stroke();
            };
            
            /**
             * Hit testing based on <a href="http://stackoverflow.com/a/2922778/1930331">this answer</a>.
             * @param {Point}		- A point
             * @return {boolean}	If the point is in the polygon
             */
            this.hitTest = function(point) {
				var nvert = this.points.length;
				var i, j, c = false;
  				for (i = 0, j = nvert-1; i < nvert; j = i++) {
    				if ( ((this.points[i].y > point.y) != (this.points[j].y > point.y)) &&
     					(point.x < (this.points[j].x - this.points[i].x) * (point.y-this.points[i].y) / (this.points[j].y - this.points[i].y) + this.points[i].x) ) {
       					c = !c;
       				}
  				}
  				return c;
			};
        }
    };

    return module; 
});
