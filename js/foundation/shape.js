/**
    Abstract class that implements basic rendering methods for simple shapes.

    @class Shape
 */
define(['foundation/canvasDrawer', 'util/boundingBox', 'util/factory'],
    function(CanvasDrawer, BoundingBox, Factory) {
        "use strict";
        //////////////////////////////////
        // Private class methods/fields //
        //////////////////////////////////
        /**
       @module foundation/shape
     */
        var module = {
            /////////////////////////////////
            // Public class methods/fields //
            /////////////////////////////////
            /**
           Shape abstract class

           @class Shape
           @constructor
           @param {float} x                     x coordinate of top-left
           @param {float} y                     y coordinate of top-left
           @param {float} width                 Width of shape
           @param {float} height                Height of shape
           @param {CanvasDrawer} drawer         CanvasDrawer to draw image to canvas
           @param {Object} drawingSettings      Settings for the CanvasDrawer
         */
            Shape: function(x, y, width, height, drawer, drawingSettings) {
                var _this = this;
                /////////////////////////////////////
                // Private instance methods/fields //
                /////////////////////////////////////
                drawingSettings.angle = drawingSettings.angle || 0;
                console.debug(x, y, width, height, drawingSettings.angle);
                // Make floats into integers
                x = Math.round(x);
                y = Math.round(y);
                width = Math.round(width);
                height = Math.round(height);
                // Bbox with rounded numbers
                var bbox = new BoundingBox.BoundingBox(x, y, width, height);
                ////////////////////////////////////
                // Public instance methods/fields //
                ////////////////////////////////////
                Object.defineProperties(this, {
                    /**
                   x coordinate of top-left of Shape instance

                   @property x
                   @type {integer}
                 */
                    x: {
                        get: function() {
                            return x;
                        },
                        set: function(newX) {
                            if (x !== newX) {
                                var dx = newX - x;
                                x = Math.round(newX);
                                _this.boundingBox.x = x;
                                // Allow subclass to handle update too
                                if (_this.updateShape !== undefined) {
                                    _this.updateShape(dx, 0);
                                }
                            }
                        }
                    },
                    /**
                   y coordinate of top-left of Shape instance

                   @property y
                   @type {integer}
                 */
                    y: {
                        get: function() {
                            return y;
                        },
                        set: function(newY) {
                            if (y !== newY) {
                                var dy = newY - y;
                                y = Math.round(newY);
                                _this.boundingBox.y = y;
                                // Allow subclass to handle update too
                                if (_this.updateShape !== undefined) {
                                    _this.updateShape(0, dy);
                                }
                            }
                        }
                    },
                    /**
                   Width of Shape instance

                   @property width
                   @type {integer}
                 */
                    width: {
                        get: function() {
                            return width;
                        },
                        set: function(newWidth) {
                            newWidth = Math.round(newWidth);
                            if (newWidth !== width) {
                                width = newWidth;
                                bbox = new BoundingBox.BoundingBox(x, y,
                                    width, height);
                            }
                        }
                    },
                    /**
                   Height of Shape instance

                   @property height
                   @type {integer}
                 */
                    height: {
                        get: function() {
                            return height;
                        },
                        set: function(newHeight) {
                            newHeight = Math.round(newHeight);
                            if (newHeight !== height) {
                                height = newHeight;
                                bbox = new BoundingBox.BoundingBox(x, y,
                                    width, height);
                            }
                        }
                    },
                    /**
                   BoundingBox of Shape instance

                   @property boundingBox
                   @type {BoundingBox}
                 */
                    boundingBox: {
                        get: function() {
                            return bbox;
                        }
                    },
                    /**
                   Drawing settings of Shape instance

                   @property drawingSettings
                   @type {Object}
                 */
                    drawingSettings: {
                        get: function() {
                            return drawingSettings;
                        },
                        set: function(newSettings) {
                            drawingSettings = newSettings;
                            drawingSettings.angle = drawingSettings.angle ||
                                0;
                        }
                    }
                });
                /**
               Clear and draw Shape onto canvas

               @method update
               @return {void}
             */
                this.update = function() {
                    this.clear();
                    this.draw();
                };
                /**
               Draw Shape instance onto the canvas

               @method draw
               @return {void}
             */
                this.draw = function() {
                    drawer.save().translate(this.center.x, this.center.y).rotate(
                        this.drawingSettings.angle);
                    this.drawShape(drawer);
                    drawer.restore();
                };
                /**
               Clear the Shape instance

               @method clear
               @return {void}
             */
                this.clear = function() {
                    var lineWidth = this.drawingSettings.lineWidth || 1;
                    drawer.save().translate(this.center.x, this.center.y).rotate(
                        this.drawingSettings.angle).clearRect(-this.width -
                        lineWidth, -this.height - lineWidth, (this.width +
                            lineWidth) * 2, (this.height + lineWidth) * 2).restore();
                };
                /**
                Draw BoundingBox of Shape instance

                @method drawBoundingBox
                @return {void}
             */
                this.drawBoundingBox = function() {
                    // As long as angle is not undefined, 0, or otherwise falsy
                    if (this.drawingSettings.angle) {
                        drawer.save();
                        drawer.rotate(this.drawingSettings.angle);
                    }
                    var x = _this.boundingBox.x,
                        y = _this.boundingBox.y,
                        w = _this.boundingBox.width,
                        h = _this.boundingBox.height,
                        lineWidth = _this.drawingSettings.lineWidth || 1;
                    drawer.strokeRect(x + lineWidth, y + lineWidth, w - 2 *
                        lineWidth, h - 2 * lineWidth);
                    if (this.drawingSettings.angle) {
                        drawer.restore();
                    }
                };
                /**
                Check if a point is within the Shape instance

                @method collisionTest
                @param  {Point} point A 2D point
                @return {boolean} Whether or not the point is within the Shape
             */
                this.collisionTest = function(point) {
                    // Return result of subclass's test.
                    return _this.hitTest(point);
                };
            },
            /**
            Circle shape

            @class Circle
            @extends Shape
         */
            /**
           @class Circle
           @constructor
           @param   {float} x x coordinate of circle
           @param   {float} y y coordinate of circle
           @param   {float} radius Radius of the circle
           @param   {CanvasDrawer} drawer CanvasDrawer to draw circle
           @param   {Object} drawingSettings Dictionary of drawing options
         */
            Circle: function(x, y, radius, drawer, drawingSettings) {
                var _this = this;
                /////////////////////////////////////
                // Private instance methods/fields //
                /////////////////////////////////////
                radius = Math.round(radius);
                var lineWidth = drawingSettings.lineWidth || 0;
                // Extend Shape constructor
                module.Shape.call(_this, x, y, radius * 2, radius * 2, drawer,
                    drawingSettings);
                ////////////////////////////////////
                // Public instance methods/fields //
                ////////////////////////////////////
                Object.defineProperties(this, {
                    /**
                   Center of circle

                   @property center
                   @type {Point)
                 */
                    center: {
                        value: {
                            x: x,
                            y: y
                        }
                    },
                    /**
                   Radius of circle

                   @property radius
                   @type {float)
                 */
                    radius: {
                        get: function() {
                            return radius;
                        },
                        set: function(newRadius) {
                            radius = Math.floor(newRadius);
                            this.width = radius * 2;
                            this.height = radius * 2;
                        }
                    }
                });
                /**
                Draw circle onto canvas.

                @return {void}
             */
                this.drawShape = function(canvasDrawer) {
                    canvasDrawer.beginPath();
                    canvasDrawer.contextSettings = _this.drawingSettings;
                    var lineWidth = this.drawingSettings.lineWidth || 1;
                    canvasDrawer.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
                    canvasDrawer.stroke();
                    canvasDrawer.fill();
                };
                this.hitTest = function(point) {
                    var dx = this.x + this.radius - point.x,
                        dy = this.y + this.radius - point.y;
                    return dx * dx + dy * dy <= this.radius * this.radius;
                };
            },
            /**
            Rectangle

            @class Rectangle
            @extends Shape
        */
            /**
            @class Rectangle
            @constructor
            @extends {Polygon}
            @param   {float} x The x coordinate of the rectangle's upper left corner.
            @param   {float} y The y coordinate of the rectangle's upper left corner.
            @param   {float} width The width of the rectangle.
            @param   {float} height The height of the rectangle.
            @param   {CanvasDrawer} drawer A CanvasDrawer to draw the rectangle onto the canvas.
            @param   {Object} drawingSettings A dictionary of drawing options.
         */
            Rectangle: function(x, y, width, height, drawer, drawingSettings) {
                ////////////////////////////////////
                // Public instance methods/fields //
                ////////////////////////////////////
                var w2 = width / 2,
                    h2 = height / 2;
                // Extend Polygon constructor
                module.Polygon.call(this, {
                    x: x + w2,
                    y: y + h2
                }, [{
                    x: -w2,
                    y: -h2
                }, {
                    x: w2,
                    y: -h2
                }, {
                    x: w2,
                    y: h2
                }, {
                    x: -w2,
                    y: h2
                }], drawer, drawingSettings);
            },
            /**
            Polygon class

            @class Polygon
            @extends Shapes
         */
            /**
           Generate a BoundingBox for a polygon

           @method  generateBbox
           @static
           @param   {Array} points An array of points describing the polygon
           @param   {Point} center Center of polygon
           @return  {BoundingBox} A BoundingBox containing all of the points
         */
            generateBbox: function(points, center) {
                var minX = points[0].x,
                    maxX = points[0].x,
                    minY = points[0].y,
                    maxY = points[0].y,
                    numPoints = points.length;
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
                var w = maxX - minX,
                    h = maxY - minY;
                return new BoundingBox.BoundingBox(center.x - w / 2, center.y -
                    h / 2, w, h);
            },
            findPolygonCenter: function(points) {
                var numPoints = points.length,
                    cx = 0,
                    cy = 0,
                    area = 0;
                for (var i = 0; i < numPoints - 1; i++) {
                    var p1 = points[i],
                        p2 = points[i + 1],
                        k = p1.x * p2.y - p2.x * p1.y;
                    cx += (p1.x + p2.x) * k;
                    cy += (p1.y + p2.y) * k;
                    area += k;
                }
                area *= 0.5;
                cx /= area * 6;
                cy /= area * 6;
                return {
                    x: cx,
                    y: cy
                };
            },
            /**
           @class Polygon
           @constructor
           @param   {Point} [center=0,0] The center of the polygon
           @param   {Array} points An array of points that describe the polygon,
           Should be relative to the center so rotation can be performed more
           easily.
           @param   {CanvasDrawer} drawer A CanvasDrawer to draw the polygon
            onto the canvas
           @param   {Object} drawingSettings A dictionary of drawing options.
         */
            Polygon: function(center, points, drawer, drawingSettings) {
                var _this = this;
                /////////////////////////////////////
                // Private instance methods/fields //
                /////////////////////////////////////
                center = center || {
                    x: 0,
                    y: 0
                };
                // Variables necessary for Shape constructor.
                // NOTE: Do not use these variables directly (i.e. x versus this.x).
                var bbox = module.generateBbox(points, center),
                    x = bbox.x,
                    y = bbox.y,
                    width = bbox.width,
                    height = bbox.height;
                /**
               Iterate through each point in the polygon.

               @method forEachPoint
               @private
               @param  {Function} f Function to be called on each point
               @return {void}
             */
                function forEachPoint(f) {
                    var numPoints = _this.points.length;
                    for (var i = 0; i < numPoints; i++) {
                        var point = _this.points[i];
                        f(point, i);
                    }
                }
                ////////////////////////////////////
                // Public instance methods/fields //
                ////////////////////////////////////
                // Extend Shape constructor
                module.Shape.call(this, x, y, width, height, drawer,
                    drawingSettings);
                Object.defineProperties(this, {
                    /**
                   Points of Polygon instance

                   @property points
                   @type {Array}
                 */
                    points: {
                        get: function() {
                            return points;
                        },
                        set: function(newPoints) {
                            points = newPoints;
                            _this.boundingBox = generateBbox(this.points);
                        }
                    },
                    /**
                    Center of polygon

                    @property center
                    @type {Point}
                 */
                    center: {
                        get: function() {
                            return center;
                        },
                        set: function(newCenter) {
                            center = newCenter;
                            _this.boundingBox.x = center.x - _this.boundingBox
                                .width / 2;
                            _this.boundingBox.y = center.y - _this.boundingBox
                                .height / 2;
                        }
                    }
                });
                this.updateShape = function(dx, dy) {
                    _this.center.x += dx;
                    _this.center.y += dy;
                };
                /**
               Draw the rectangle onto the canvas using the CanvasDrawer.
               @return {void}
             */
                this.drawShape = function(canvasDrawer) {
                    canvasDrawer.beginPath().contextSettings = this.drawingSettings;
                    var pts = this.points,
                        numPoints = pts.length,
                        p1 = {
                            x: pts[0].x,
                            y: pts[0].y
                        },
                        p2 = {
                            x: pts[1].x,
                            y: pts[1].y
                        };
                    canvasDrawer.drawLine(p1, p2, true);
                    for (var i = 1; i < numPoints; i++) {
                        p1 = {
                            x: pts[i].x,
                            y: pts[i].y
                        };
                        p2 = {
                            x: pts[(i + 1) % numPoints].x,
                            y: pts[(i + 1) % numPoints].y
                        };
                        canvasDrawer.drawLine(p1, p2);
                    }
                    canvasDrawer.closePath().fill().stroke();
                };
                /**
                Hit testing based on
                <a href="http://stackoverflow.com/a/2922778/1930331</a>.

                @param {Point} point A point
                @return {boolean} If the point is in the polygon
             */
                this.hitTest = function(point) {
                    var cx = this.center.x,
                        cy = this.center.y,
                        nvert = this.points.length,
                        i,
                        j,
                        c = false;
                    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
                        if (((this.points[i].y + cy > point.y) !== (this.points[
                            j].y + cy > point.y)) && (point.x < (this.points[
                            j].x - this.points[i].x) * (point.y - this.points[
                            i].y - cy) / (this.points[j].y - this.points[
                            i].y) + this.points[i].x + cx)) {
                            c = !c;
                        }
                    }
                    return c;
                };
            }
        };
        return module;
    });
