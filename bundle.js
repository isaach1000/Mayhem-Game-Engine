;(function(self, undefined) {
	'use strict';

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MathExtensions = require('../util/mathExtensions');

/**
    Enum for key arrow input

    @class Direction
 */
module.exports = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    MIN: 37,

    toString: function(dir) {
        return ['left', 'up', 'right', 'down'][dir - module.exports.MIN];
    },

    opposite: function(dir) {
        return [module.exports.RIGHT, module.exports.DOWN, module.exports.LEFT,
            module.exports.UP]
        [dir -
            module.exports.MIN];
    },

    random: function() {
        return module.exports.MIN + MathExtensions.randomInt(4);
    }
};

},{"../util/mathExtensions":20}],2:[function(require,module,exports){
var $ = require('../lib/jquery');

/**
    Handle inputHandler from keyboard and mouse

    @class InputHandler
 */


//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

/**
    @module events/inputHandler
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
         @class InputHandler
         @constructor
         @param {string} domSelector Selector for target element
     */
    InputHandler: function(domSelector) {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var
        eventHandlers = {},
            $domElement = $(domSelector);

        function addHandler(eventName, handler) {
            if (eventHandlers[eventName] === undefined) {
                eventHandlers[eventName] = [];
                $domElement.on(eventName, function(event) {
                    eventHandlers[eventName].forEach(function(
                        handler) {
                        var currentDate = new Date();
                        if (currentDate - handler._lastTime >=
                            handler._delay) {
                            handler._lastTime = currentDate;
                            handler(event);
                        }
                    });
                });
            }
            eventHandlers[eventName].push(handler);
        }

        function removeHandler(eventName, handler) {
            if (eventHandler[eventName] !== undefined) {
                var index = eventHandlers[eventName].indexOf(handler);
                if (index >= 0) {
                    eventHandler[eventName].splice(index, 1);
                }
            }
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        /**
            Bind a handler to an event

            @method bind
            @param  {string} eventName Name of the event
            @param  {Function} handler Handler to unbind
            @param  {number} [delay=0] Minimum delay between calls to handler
            @return {void}
        */
        this.bind = function(eventName, handler, delay) {
            handler._delay = delay || 0;
            handler._lastTime = 0;
            addHandler(eventName, handler);
        };

        /**
            Unbind a handler from an event

            @method unbind
            @param  {string} eventName Name of the event
            @param  {Function} handler Handler to unbind
            @return {void}
         */
        this.unbind = function(eventName, handler) {
            removeHandler(eventName, handler);
        };
    }
};

},{"../lib/jquery":8}],3:[function(require,module,exports){
var _ = require('underscore');

/**
   Defines the behavior of animations.

   @class Animation
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////
/**
   Based on <a href="http://www.html5canvastutorials.com">
   html5canvastutorials</a>
   @method requestAnimFrame
   @private
   @param  {Function} callback A function to perform after one frame
   @return {void}
*/
var requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
    };
})();

/**
  @module foundation/animation
*/
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////
    /**
        @class Animation
        @constructor
        @param   {drawable} drawable The drawable to animate.
        @param   {Function} frameFunction A function that updates the
        animation. Return true to terminate the animation. It may take the
        duration in milliseconds from the beginning of the animation as a
        parameter. For example,
        <code><pre>
        function(time, timeDiff) {
            shape.x = Math.floor(time / 100);
            return time > 1000;
        }
        </pre></code>
        @param   {Function} callback A function to perform at the completion
        of the animation.
     */
    Animation: function(drawable, frameFunction, callback) {
        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////
        var startTime, lastCallTime;

        function animate() {
            drawable.clear();
            var
            callTime = new Date(),
                shouldTerminate = frameFunction(callTime - startTime,
                    callTime - lastCallTime);
            lastCallTime = new Date();
            drawable.draw();
            if (shouldTerminate !== true) {
                requestAnimFrame(animate);
            } else if (_.isFunction(callback)) {
                callback();
            }
        }
        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        /**
            Start the animation.

            @method start
            @return {void}
         */
        this.start = function() {
            startTime = lastCallTime = new Date();
            animate();
        };
    },
    /**
        Create an easing.

        @method easing
        @static
        @param  {Polygon|Rectangle|Circle} drawable The drawable to animate.
        @param  {float} endX The x to go to.
        @param  {float} endY The y to go to.
        @param  {int} duration The number of milliseconds for the animation.
        @param  {Function} callback A function to perform at the completion of the animation.
        @return {Animation} An animation representing the easing
    */
    easing: function(drawable, endX, endY, duration, callback) {
        var startX = drawable.x,
            startY = drawable.y,
            distX = endX - startX,
            distY = endY - startY,
            durationX = distX / duration,
            durationY = distY / duration;

        var frameFunction = function(durationElapsed) {
            drawable.x = startX + durationX * durationElapsed;
            drawable.y = startY + durationY * durationElapsed;
            return drawable.x < endX && drawable.y < endY &&
                durationElapsed < duration;
        };

        return new module.exports.Animation(drawable, frameFunction, callback);
    }
};

},{"underscore":23}],4:[function(require,module,exports){
var _ = require('underscore'),
    MathExtensions = require('../util/mathExtensions');

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

/**
   @module foundation/canvasDrawer
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
        CanvasDrawer for drawing to a canvas. Wrapper class for HTML5
        CanvasRenderingContext2D.

        @class CanvasDrawer
        @constructor
        @param {Context} ctx Context of canvas
        @param {float} width Width of canvas
        @param {float} height Height of canvas
     */
    CanvasDrawer: function(ctx, width, height) {
        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var _this = this,
            ctxSettings;


        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        Object.defineProperties(this, {
            /**
               Width of the canvas

               @type {float}
               @property width
             */
            width: {
                get: function() {
                    return width;
                }
            },

            /**
               Height of the canvas

               @property height
               @type {float}
             */
            height: {
                get: function() {
                    return height;
                }
            },

            /**
               Properties of the context. Valid settings include:
               lineWidth, fillStyle, strokeStyle, font.

               @property contextSettings
               @type {Object}
             */
            contextSettings: {
                get: function() {
                    return ctxSettings;
                },
                set: function(settings) {
                    var VALID_SETTINGS = [
                        'lineWidth',
                        'fillStyle',
                        'strokeStyle',
                        'font',
                        'textAlign'
                    ],
                        success = true,
                        property;
                    for (property in settings) {
                        if (settings.hasOwnProperty(property)) {
                            success = (success && _.contains(
                                VALID_SETTINGS, property));
                            if (success) {
                                ctx[property] = settings[property];
                            }
                        }
                    }
                    if (success) {
                        ctxSettings = settings;
                    }
                }
            }
        });

        /**
            Draw a line between two points

            @method drawLine
            @param {(float|Point)} point1 x coordinate of the first point
            or the first point
            @param {(float|Point)} point2 y coordinate of the first point
            or the second point
            @param {boolean} [moveFirst=false] If true, uses moveTo method
            @chainable
         */
        this.drawLine = function(point1, point2, moveFirst) {
            if (moveFirst) {
                ctx.moveTo(point1.x, point1.y);
            }
            ctx.lineTo(point2.x, point2.y);
            return this;
        };

        /**
            Wrapper for <code>context.stroke</code>

            @method stroke
            @chainable
         */
        this.stroke = function() {
            ctx.stroke();
            return this;
        };

        /**
            Wrapper for <code>context.fill</code>

            @method fill
            @chainable
         */
        this.fill = function() {
            ctx.fill();
            return this;
        };

        /**
            Wrapper for <code>context.beginPath</code>

            @method beginPath
            @chainable
         */
        this.beginPath = function() {
            ctx.beginPath();
            return this;
        };

        /**
            Wrapper for <code>context.closePath</code>

            @method closePath
            @chainable
         */
        this.closePath = function() {
            ctx.closePath();
            return this;
        };

        /**
            Wrapper for <code>context.rect</code>

            @method rect
            @param  {float}  x   x coordinate
            @param  {float}  y   y coordinate
            @param  {float}  w   Width of rectangle
            @param  {float}  h   Height of rectangle
            @chainable
         */
        this.rect = function(x, y, w, h) {
            ctx.rect(x, y, w, h);
            return this;
        };

        /**
            Wrapper for <code>context.arc</code>

            @method arc
            @param  {float}      x          x coordinate
            @param  {float}      y          y coordinate
            @param  {float}      radius     Radius of arc
            @param  {float}      startAngle Start angle of arc
            @param  {float}      endAngle   End angle of arc
            @param  {boolean}    ccw        Move counterclockwise
            @chainable
         */
        this.arc = function(x, y, radius, startAngle, endAngle, ccw) {
            ctx.arc(x, y, radius, startAngle, endAngle, ccw);
            return this;
        };

        /**
            Wrapper for <code>context.clearRect</code>

            @method clearRect
            @param  {float} x Minimum x of area.
            @param  {float} y Minimum y of area.
            @param  {float} width Width of area.
            @param  {float} height Height of area.
            @chainable
         */
        this.clearRect = function(x, y, width, height) {
            ctx.clearRect(x, y, width, height);
            return this;
        };

        /**
            Clear entire canvas

            @method clearCanvas
            @chainable
         */
        this.clearCanvas = function() {
            this.clearRect(0, 0, this.width, this.height);
            return this;
        };

        /**
           Wrapper for <code>context.save</code>

           @method save
           @chainable
         */
        this.save = function() {
            ctx.save();
            return this;
        };

        /**
            Wrapper for <code>context.restore</code>

            @method restore
            @chainable
         */
        this.restore = function() {
            ctx.restore();
            return this;
        };

        /**
            Wrapper for <code>context.restore</code>

            @method transform
            @param  {Transformation|number}  [a] Either a transformation or
            <em>a</em> of transformation matrix
            @param  {number}  b <em>b</em> of transformation matrix
            @param  {number}  c <em>c</em> of transformation matrix
            @param  {number}  d <em>d</em> of transformation matrix
            @param  {number}  e <em>e</em> of transformation matrix
            @param  {number}  f <em>f</em> of transformation matrix
            @chainable
         */
        this.transform = function(a, b, c, d, e, f) {
            if (a instanceof MathExtensions.Transformation) {
                var transformation = a;
                a = transformation.sx;
                b = transformation.shx;
                c = transformation.shy;
                d = transformation.sy;
                e = transformation.tx;
                f = transformation.ty;
            }
            ctx.transform(a, b, c, d, e, f);
            return this;
        };

        /**
            Wrapper for <code>context.translate</code>

            @method translate
            @param  {float} x x coordinate of destination
            @param  {float} y y coordinate of destination
            @chainable
         */
        this.translate = function(x, y) {
            ctx.translate(x, y);
            return this;
        };

        /**
            Wrapper for <code>context.rotate</code>

            @method rotate
            @param   {float} angle Angle of rotation
            @return  {void}
         */
        this.rotate = function(angle) {
            ctx.rotate(angle);
            return this;
        };

        /**
            Wrapper for <code>context.fillRect</code>

            @method fillRect
            @param  {float} x x coordinate of top-left of rectangle
            @param  {float} y y coordinate of top-left of rectangle
            @param  {float} w Width of rectangle
            @param  {float} h Height of rectangle
            @chainable
         */
        this.fillRect = function(x, y, w, h) {
            ctx.fillRect(x, y, w, h);
            return this;
        };

        /**
            Wrapper for <code>context.strokeRect</code>

            @method strokeRect
            @param  {float} x x coordinate of top-left of rectangle
            @param  {float} y y coordinate of top-left of rectangle
            @param  {float} w Width of rectangle
            @param  {float} h Height of rectangle
            @chainable
         */
        this.strokeRect = function(x, y, w, h) {
            ctx.strokeRect(x, y, w, h);
            return this;
        };


        /**
            Wrapper for <code>context.fillText</code>

            @method fillText
            @param  {string} text Text to draw
            @param  {float} x x coordinate
            @param  {float} y y coordinate
            @param  {float} [maxWidth] Maximum width to draw
            @chainable
         */
        this.fillText = function(text, x, y, maxWidth) {
            ctx.fillText.apply(ctx, arguments);
            return this;
        };

        /**
            Wrapper for <code>context.getImageData</code>

            @method getImageData
            @param  {float} x x coordinate of top-left of image
            @param  {float} y y coordinate of top-left of image
            @param  {float} width Width of image
            @param  {float} height Height of image
            @return {Array} Image data
         */
        this.getImageData = function(x, y, w, h) {
            return ctx.getImageData(x, y, w, h);
        };
        /**
            Wrapper for <code>context.putImageData</code>

            @method putImageData
            @param  {Array} imageData Image data
            @param  {float} x x coordinate of top-left of image
            @param  {float} y y coordinate of top-left of image
            @chainable
         */
        this.putImageData = function(imageData, x, y) {
            ctx.putImageData(imageData, x, y);
            return this;
        };
    }
};

},{"../util/mathExtensions":20,"underscore":23}],5:[function(require,module,exports){
var CanvasDrawer = require('./canvasDrawer'),
    BoundingBox = require('../util/boundingBox'),
    MathExtensions = require('../util/mathExtensions');

/**
    Abstract class that implements basic rendering methods for simple shapes.

    @class Shape
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

/**
       @module foundation/shape
     */

module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
           Generate a BoundingBox for a polygon

           @method  generateBbox
           @static
           @param   {Array} points An array of points describing the polygon
           @return  {BoundingBox} A BoundingBox containing all of the points
         */
    generateBbox: function(points) {
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
        return new BoundingBox.BoundingBox(minX, minY, w, h);
    },

    /**
            Find center of a polygon

            @method findPolygonCenter
            @static
            @param  {Array} points An array of the points of the polygon
            @return {Point} Center of polygon
         */
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
           Shape abstract class

           @class Shape
           @constructor
           @param {number} x                     x coordinate of top-left
           @param {number} y                     y coordinate of top-left
           @param {number} width                 Width of shape
           @param {number} height                Height of shape
           @param {CanvasDrawer} drawer         CanvasDrawer to draw image
           to canvas
           @param {Object} drawingSettings      Settings for the CanvasDrawer
         */
    Shape: function(x, y, width, height, drawer, drawingSettings) {
        var _this = this;
        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        // Make floats into integers
        x = Math.round(x);
        y = Math.round(y);
        width = Math.round(width);
        height = Math.round(height);

        // Bbox with rounded numbers
        var
        bbox = new BoundingBox.BoundingBox(x, y, width, height),
            transformation = new MathExtensions.Transformation();

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        Object.defineProperties(this, {
            /**
                    x coordinate of Shape instance

                    @property x
                    @type {integer}
                 */
            x: {
                get: function() {
                    return x;
                },
                set: function(newX) {
                    if (x !== newX) {
                        x = Math.round(newX);
                        _this.transformation.tx = x;
                        _this.boundingBox.x = x;
                    }
                }
            },

            /**
                    y coordinate of Shape instance

                    @property y
                    @type {integer}
                 */
            y: {
                get: function() {
                    return y;
                },
                set: function(newY) {
                    if (y !== newY) {
                        y = Math.round(newY);
                        _this.transformation.ty = y;
                        _this.boundingBox.y = y;
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
                        _this.boundingBox.width = width;
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
                        _this.boundingBox.height = height;
                    }
                }
            },

            /**
                    Angle of rotation of shape

                    @property angle
                    @type {number}
                 */
            angle: {
                get: function() {
                    return _this.transformation.angle;
                },
                set: function(value) {
                    _this.transformation.angle = value;
                    _this._updateBoundingBox();
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
                },
                set: function(newBbox) {
                    bbox = newBbox;
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
                    _this.transformation.angle = drawingSettings.angle;
                }
            },

            /**
                    Transformation matrix

                    @property transformation
                    @type {Transformation}
                 */
            transformation: {
                get: function() {
                    return transformation;
                },
                set: function(newTransformation) {
                    transformation = newTransformation;
                    _this.updateBoundingBox();
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
            drawer.save().transform(this.transformation);
            this._drawShape(drawer);
            drawer.restore();
        };

        /**
               Clear the Shape instance

               @method clear
               @return {void}
             */
        this.clear = function() {
            var lineWidth = this.drawingSettings.lineWidth || 1;
            drawer.save().transform(this.transformation).clearRect(-
                this.width - lineWidth, -this.height - lineWidth, (this
                    .width + lineWidth) * 2, (this.height + lineWidth) *
                2).restore();
        };

        /**
                Draw BoundingBox of Shape instance

                @method drawBoundingBox
                @return {void}
             */
        this.drawBoundingBox = function() {
            var
            x = _this.boundingBox.x,
                y = _this.boundingBox.y,
                w = _this.boundingBox.width,
                h = _this.boundingBox.height,
                lineWidth = _this.drawingSettings.lineWidth || 1;

            drawer.contextSettings = {
                strokeStyle: 'yellow'
            };
            drawer.strokeRect(x, y, w - lineWidth, h - lineWidth);
        };
        /**
                Check if a point is within the Shape instance

                @method collisionTest
                @param  {Point} point A 2D point
                @return {boolean} Whether or not the point is within the Shape
             */
        this.collisionTest = function(point) {
            // Return result of subclass's test.
            return _this._hitTest(point);
        };

        this.rotate = function(angle) {
            this.transformation.rotate(angle);
            this._updateBoundingBox();
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
           @param   {number} x x coordinate of <strong>center</strong> of
           circle
           @param   {number} y y coordinate of <strong>center</strong> of
           circle
           @param   {number} radius Radius of the circle
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
        module.exports.Shape.call(_this, -radius, -radius,
            radius * 2, radius * 2, drawer,
            drawingSettings);

        this.transformation.tx = x;
        this.transformation.ty = y;

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        Object.defineProperties(this, {
            /**
                    Radius of circle

                    @property radius
                    @type {number)
                */
            radius: {
                get: function() {
                    return radius;
                },
                set: function(newRadius) {
                    radius = Math.floor(newRadius);
                    _this.width = radius * 2;
                    _this.height = radius * 2;
                }
            }
        });

        /**
                Draw circle onto canvas.

                @method _drawShape
                @protected
                @return {void}
            */
        this._drawShape = function(canvasDrawer) {
            canvasDrawer.beginPath();
            canvasDrawer.contextSettings = _this.drawingSettings;
            var lineWidth = this.drawingSettings.lineWidth || 1;
            canvasDrawer.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
            canvasDrawer.stroke();
            canvasDrawer.fill();
        };

        /**
                _hitTest to call from collisionTest

                @method _hitTest
                @protected
                @param  {Point} point [description]
                @return {boolean} [description]
             */
        this._hitTest = function(point) {
            var dx = this.x + this.radius - point.x,
                dy = this.y + this.radius - point.y;
            return dx * dx + dy * dy <= this.radius * this.radius;
        };

        /**
                Update boundingBox

                @method _updateBoundingBox
                @protected
                @return {void}
             */
        this._updateBoundingBox = function() {
            this.boundingBox = new BoundingBox.BoundingBox(this.x,
                this.y, this.radius * 2, this.radius * 2);
        };
    },

    /**
            Rectangle

            @class Rectangle
            @extends Polygon
        */

    /**
            @class Rectangle
            @constructor
            @param   {number} x The x coordinate of the rectangle's top-left
            @param   {number} y The y coordinate of the rectangle's top-left
            @param   {number} width The width of the rectangle
            @param   {number} height The height of the rectangle
            @param   {CanvasDrawer} drawer A CanvasDrawer to draw the
            rectangle onto the canvas
            @param   {Object} drawingSettings A dictionary of drawing options
         */
    Rectangle: function(x, y, width, height, drawer, drawingSettings) {
        ////////////////////////////////////
        // Private instance methods/fields //
        ////////////////////////////////////

        var w2 = width / 2,
            h2 = height / 2;

        // Extend Polygon constructor
        module.exports.Polygon.call(this, {
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
            Polygon

            @class Polygon
            @extends Shape
        */

    /**
            @class Polygon
            @constructor
            @param   {Point} [center=0,0] The center of the polygon
            @param   {Array} points An array of points that describe the
            polygon. Should be relative to the center so rotation can be
            performed more easily.
            @param   {CanvasDrawer} drawer A CanvasDrawer to draw the
            polygon onto the canvas
            @param   {Object} drawingSettings A dictionary of drawing
            options
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

        var bbox = module.exports.generateBbox(points);
        bbox.x += center.x;
        bbox.y += center.y;

        // Variables necessary for Shape constructor
        var
        x = bbox.x,
            y = bbox.y,
            width = bbox.width,
            height = bbox.height;

        // Extend Shape constructor
        module.exports.Shape.call(this, x, y, width, height, drawer,
            drawingSettings);

        this.transformation.tx = center.x;
        this.transformation.ty = center.y;

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
                    _this._updateBoundingBox();
                }
            },
        });

        /**
                Draw the rectangle onto the canvas using the CanvasDrawer.

                @method _drawShape
                @protected
                @return {void}
             */
        this._drawShape = function(canvasDrawer) {
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
                <a href="http://stackoverflow.com/a/2922778/1930331">this
                </a> StackOverflow answer.

                @method _hitTest
                @protected
                @param {Point} point A point
                @return {boolean} If the point is in the polygon
             */
        this._hitTest = function(point) {
            var p = this.transformation.adjustPoint(point),
                nvert = this.points.length,
                i,
                j,
                c = false;
            for (i = 0, j = nvert - 1; i < nvert; j = i++) {
                if (((this.points[i].y > p.y) !== (this.points[
                    j].y > p.y)) && (p.x < (this.points[
                    j].x - this.points[i].x) * (p.y - this.points[
                    i].y) / (this.points[j].y - this.points[
                    i].y) + this.points[i].x)) {
                    c = !c;
                }
            }
            return c;
        };

        this._updateBoundingBox = function() {
            var transformedPoints = this.points.map(function(p) {
                return _this.transformation.applyToPoint(p);
            });
            this.boundingBox = module.exports.generateBbox(transformedPoints);
        };
    }
};

},{"../util/boundingBox":16,"../util/mathExtensions":20,"./canvasDrawer":4}],6:[function(require,module,exports){
var
CanvasDrawer = require('../foundation/canvasDrawer'),
    Factory = require('../util/factory'),
    BoundingBox = require('../util/boundingBox'),
    Physics = require('../util/physics'),
    InputHandler = require('../events/inputHandler');

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

/**
   @module level/levelBase
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
       @class LevelBase
       @constructor
     */
    LevelBase: function() {
        var _this = this;

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        /**
            Create a canvas with the dimensions this.WIDTH by this.HEIGHT

            @method createCanvas
            @param  {string} [id] String to use as HTML id
            @return {JQueryObject} A new jQuery object of the new canvas
         */
        this.createCanvas = function(id) {
            return Factory.createCanvas({
                id: id,
                width: this.WIDTH + this.MARGIN + 'px',
                height: this.HEIGHT + this.MARGIN + 'px'
            });
        };

        /**
            Create a canvas with the createCanvas method and return a new
            CanvasDrawer for that canvas

            @method createContext
            @param  {string} [id] String to use as HTML id
            @return {CanvasDrawer} CanvasDrawer for new canvas
         */
        this.createContext = function(id) {
            var
            $canvas = this.createCanvas(id),
                w = this.WIDTH,
                h = this.HEIGHT,
                ctx = $canvas[0].getContext('2d');
            return new CanvasDrawer.CanvasDrawer(ctx, w, h);
        };

        /**
            Width of canvas

            @property WIDTH
            @type {number}
         */
        this.WIDTH = 1000;

        /**
            Height of canvas

            @property HEIGHT
            @type {number}
         */
        this.HEIGHT = 600;

        /**
            Margin add to width and height when creating canvas

            @property MARGIN
            @type {Number}
         */
        this.MARGIN = 5;

        /**
            Physics engine

            @property physicsEngine
            @type {Engine}
         */
        this.physicsEngine = new Physics.Engine();

        /**
            Input handler

            @property inputHandler
            @type {InputHandler}
         */
        this.inputHandler = new InputHandler.InputHandler('body');
    }
};

},{"../events/inputHandler":2,"../foundation/canvasDrawer":4,"../util/boundingBox":16,"../util/factory":17,"../util/physics":22}],7:[function(require,module,exports){
var
LevelBase = require('./levelBase'),
    Shape = require('../foundation/shape'),
    Animation = require('../foundation/animation'),
    Maze = require('../sprite/maze'),
    Player = require('../sprite/player'),
    Enemy = require('../sprite/enemy'),
    Prize = require('../sprite/prize'),
    Direction = require('../enum/direction');

/**
    MainLevel contains all of the logic necessary for the main level of the
    game.

    @class MainLevel
    @extends LevelBase
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

var COLLISION_DELAY = 50;

/**
   @module level/mainLevel
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
        @class MainLevel
        @constructor
        @param {Worker} [worker=undefined] A web worker to improve efficient
        code execution
    */
    MainLevel: function(worker) {
        var _this = this;

        // Extend LevelBase constructor
        LevelBase.LevelBase.call(this);

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        // mousePoint to keep track of cursor
        var mousePoint;

        function hitTest() {
            var pos = $('canvas').first().position();
            // Update mousePoint on every mousemove
            _this.inputHandler.bind('mousemove', function(ev) {
                mousePoint = {
                    x: ev.pageX - pos.left,
                    y: ev.pageY - pos.top
                };
            });

            // Search QuadTree on mousemove with COLLISION_DELAY ms delay
            _this.inputHandler.bind('mousemove', function() {
                _this.physicsEngine.collisionQuery(mousePoint)
                    .forEach(function(shape) {
                        if (shape.collisionTest(mousePoint)) {
                            console.debug('shape');
                        }
                    });
            }, COLLISION_DELAY);
        }

        function writeBanner(text, textColor) {
            // If #banner exists, remove
            $('#banner').detach();

            var
            canvasDrawer = _this.createContext('banner'),
                x = _this.WIDTH / 2,
                y = _this.HEIGHT / 2;

            canvasDrawer.contextSettings = {
                font: '40pt Arial',
                textAlign: 'center',
                fillStyle: textColor
            };
            canvasDrawer.fillText(text, x, y);
        }

        /**
            Function to perform on player winning.

            @method win
            @private
            @param  {Player} player Player
            @return {void}
         */
        function win(player) {
            var
            rate = 1 / 1000,
                winAnim = new Animation.Animation(player, function(time,
                    timeDiff) {
                    player.transformation.sx += timeDiff * rate;
                    player.transformation.sy += timeDiff * rate;
                    return time > 5000;
                }, function() {
                    writeBanner('Winner!', '#00FF7B');
                });
            winAnim.start();
        }

        /**
            Function to perform on player's death.

            @method die
            @private
            @param  {Player} player Player
            @return {void}
         */
        function die(player) {
            var
            rate = 1 / 1000,
                shrinkTime = 5000,
                dieAnim = new Animation.Animation(player, function(time,
                    timeDiff) {
                    player.transformation.angle += time * rate;
                    player.transformation.sx = (shrinkTime - time) /
                        shrinkTime;
                    player.transformation.sy = (shrinkTime - time) /
                        shrinkTime;
                    return time > 5000;
                }, function() {
                    writeBanner('Game Over', 'red');
                });
            dieAnim.start();
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        this.start = function() {
            var
            mazeCtx = this.createContext('maze'),
                prizeCtx = this.createContext('prize'),
                enemyCtx = this.createContext('enemy'),
                playerCtx = this.createContext('player'),
                maze = new Maze.Maze(20, 10, mazeCtx),
                player = new Player.Player(1, 1, maze, this.inputHandler,
                    this.physicsEngine, playerCtx, function() {
                        player.isFrozen = true;
                        enemy.isFrozen = true;
                        prize.hide();
                        win(player);
                    }, function() {
                        player.isFrozen = true;
                        enemy.isFrozen = true;
                        die(player);
                    }),
                enemy = new Enemy.Enemy(8, 8, maze, player, this.physicsEngine,
                    enemyCtx, worker),
                prize = new Prize.Prize(9, 15, maze, prizeCtx);

            maze.draw();
            enemy.draw();
            player.draw();
            prize.draw();
            this.physicsEngine.objects = [enemy, player, prize];
            hitTest();
            enemy.start();
        };
    }
};

},{"../enum/direction":1,"../foundation/animation":3,"../foundation/shape":5,"../sprite/enemy":11,"../sprite/maze":12,"../sprite/player":13,"../sprite/prize":14,"./levelBase":6}],8:[function(require,module,exports){
/*! jQuery v2.0.3 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery-2.0.3.min.map
*/
(function(e, undefined) {
    var t, n, r = typeof undefined,
        i = e.location,
        o = e.document,
        s = o.documentElement,
        a = e.jQuery,
        u = e.$,
        l = {}, c = [],
        p = "2.0.3",
        f = c.concat,
        h = c.push,
        d = c.slice,
        g = c.indexOf,
        m = l.toString,
        y = l.hasOwnProperty,
        v = p.trim,
        x = function(e, n) {
            return new x.fn.init(e, n, t)
        }, b = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        w = /\S+/g,
        T = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        C = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        k = /^-ms-/,
        N = /-([\da-z])/gi,
        E = function(e, t) {
            return t.toUpperCase()
        }, S = function() {
            o.removeEventListener("DOMContentLoaded", S, !1), e.removeEventListener(
                "load", S, !1), x.ready()
        };
    x.fn = x.prototype = {
        jquery: p,
        constructor: x,
        init: function(e, t, n) {
            var r, i;
            if (!e) return this;
            if ("string" == typeof e) {
                if (r = "<" === e.charAt(0) && ">" === e.charAt(e.length -
                        1) && e.length >= 3 ? [null, e, null] : T.exec(e), !
                    r || !r[1] && t) return !t || t.jquery ? (t || n).find(
                    e) : this.constructor(t).find(e);
                if (r[1]) {
                    if (t = t instanceof x ? t[0] : t, x.merge(this, x.parseHTML(
                        r[1], t && t.nodeType ? t.ownerDocument ||
                        t : o, !0)), C.test(r[1]) && x.isPlainObject(t))
                        for (r in t) x.isFunction(this[r]) ? this[r](t[r]) :
                            this.attr(r, t[r]);
                    return this
                }
                return i = o.getElementById(r[2]), i && i.parentNode && (
                    this.length = 1, this[0] = i), this.context = o, this.selector =
                    e, this
            }
            return e.nodeType ? (this.context = this[0] = e, this.length =
                1, this) : x.isFunction(e) ? n.ready(e) : (e.selector !==
                undefined && (this.selector = e.selector, this.context = e.context),
                x.makeArray(e, this))
        },
        selector: "",
        length: 0,
        toArray: function() {
            return d.call(this)
        },
        get: function(e) {
            return null == e ? this.toArray() : 0 > e ? this[this.length +
                e] : this[e]
        },
        pushStack: function(e) {
            var t = x.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function(e, t) {
            return x.each(this, e, t)
        },
        ready: function(e) {
            return x.ready.promise().done(e), this
        },
        slice: function() {
            return this.pushStack(d.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        map: function(e) {
            return this.pushStack(x.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: h,
        sort: [].sort,
        splice: [].splice
    }, x.fn.init.prototype = x.fn, x.extend = x.fn.extend = function() {
        var e, t, n, r, i, o, s = arguments[0] || {}, a = 1,
            u = arguments.length,
            l = !1;
        for ("boolean" == typeof s && (l = s, s = arguments[1] || {}, a = 2),
            "object" == typeof s || x.isFunction(s) || (s = {}), u === a &&
            (s = this, --a); u > a; a++)
            if (null != (e = arguments[a]))
                for (t in e) n = s[t], r = e[t], s !== r && (l && r && (x.isPlainObject(
                        r) || (i = x.isArray(r))) ? (i ? (i = !1, o = n &&
                        x.isArray(n) ? n : []) : o = n && x.isPlainObject(
                        n) ? n : {}, s[t] = x.extend(l, o, r)) : r !==
                    undefined && (s[t] = r));
        return s
    }, x.extend({
        expando: "jQuery" + (p + Math.random()).replace(/\D/g, ""),
        noConflict: function(t) {
            return e.$ === x && (e.$ = u), t && e.jQuery === x && (e.jQuery =
                a), x
        },
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? x.readyWait++ : x.ready(!0)
        },
        ready: function(e) {
            (e === !0 ? --x.readyWait : x.isReady) || (x.isReady = !0,
                e !== !0 && --x.readyWait > 0 || (n.resolveWith(o, [x]),
                    x.fn.trigger && x(o).trigger("ready").off("ready"))
            )
        },
        isFunction: function(e) {
            return "function" === x.type(e)
        },
        isArray: Array.isArray,
        isWindow: function(e) {
            return null != e && e === e.window
        },
        isNumeric: function(e) {
            return !isNaN(parseFloat(e)) && isFinite(e)
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e ||
                "function" == typeof e ? l[m.call(e)] || "object" :
                typeof e
        },
        isPlainObject: function(e) {
            if ("object" !== x.type(e) || e.nodeType || x.isWindow(e))
                return !1;
            try {
                if (e.constructor && !y.call(e.constructor.prototype,
                    "isPrototypeOf")) return !1
            } catch (t) {
                return !1
            }
            return !0
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        error: function(e) {
            throw Error(e)
        },
        parseHTML: function(e, t, n) {
            if (!e || "string" != typeof e) return null;
            "boolean" == typeof t && (n = t, t = !1), t = t || o;
            var r = C.exec(e),
                i = !n && [];
            return r ? [t.createElement(r[1])] : (r = x.buildFragment([
                e], t, i), i && x(i).remove(), x.merge([], r.childNodes))
        },
        parseJSON: JSON.parse,
        parseXML: function(e) {
            var t, n;
            if (!e || "string" != typeof e) return null;
            try {
                n = new DOMParser, t = n.parseFromString(e, "text/xml")
            } catch (r) {
                t = undefined
            }
            return (!t || t.getElementsByTagName("parsererror").length) &&
                x.error("Invalid XML: " + e), t
        },
        noop: function() {},
        globalEval: function(e) {
            var t, n = eval;
            e = x.trim(e), e && (1 === e.indexOf("use strict") ? (t = o
                .createElement("script"), t.text = e, o.head.appendChild(
                    t).parentNode.removeChild(t)) : n(e))
        },
        camelCase: function(e) {
            return e.replace(k, "ms-").replace(N, E)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, n) {
            var r, i = 0,
                o = e.length,
                s = j(e);
            if (n) {
                if (s) {
                    for (; o > i; i++)
                        if (r = t.apply(e[i], n), r === !1) break
                } else
                    for (i in e)
                        if (r = t.apply(e[i], n), r === !1) break
            } else if (s) {
                for (; o > i; i++)
                    if (r = t.call(e[i], i, e[i]), r === !1) break
            } else
                for (i in e)
                    if (r = t.call(e[i], i, e[i]), r === !1) break; return e
        },
        trim: function(e) {
            return null == e ? "" : v.call(e)
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (j(Object(e)) ? x.merge(n, "string" ==
                typeof e ? [e] : e) : h.call(n, e)), n
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : g.call(t, e, n)
        },
        merge: function(e, t) {
            var n = t.length,
                r = e.length,
                i = 0;
            if ("number" == typeof n)
                for (; n > i; i++) e[r++] = t[i];
            else
                while (t[i] !== undefined) e[r++] = t[i++];
            return e.length = r, e
        },
        grep: function(e, t, n) {
            var r, i = [],
                o = 0,
                s = e.length;
            for (n = !! n; s > o; o++) r = !! t(e[o], o), n !== r && i.push(
                e[o]);
            return i
        },
        map: function(e, t, n) {
            var r, i = 0,
                o = e.length,
                s = j(e),
                a = [];
            if (s)
                for (; o > i; i++) r = t(e[i], i, n), null != r && (a[a
                    .length] = r);
            else
                for (i in e) r = t(e[i], i, n), null != r && (a[a.length] =
                    r);
            return f.apply([], a)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, r, i;
            return "string" == typeof t && (n = e[t], t = e, e = n), x.isFunction(
                e) ? (r = d.call(arguments, 2), i = function() {
                return e.apply(t || this, r.concat(d.call(arguments)))
            }, i.guid = e.guid = e.guid || x.guid++, i) : undefined
        },
        access: function(e, t, n, r, i, o, s) {
            var a = 0,
                u = e.length,
                l = null == n;
            if ("object" === x.type(n)) {
                i = !0;
                for (a in n) x.access(e, t, a, n[a], !0, o, s)
            } else if (r !== undefined && (i = !0, x.isFunction(r) || (
                s = !0), l && (s ? (t.call(e, r), t = null) : (
                l = t, t = function(e, t, n) {
                    return l.call(x(e), n)
                })), t))
                for (; u > a; a++) t(e[a], n, s ? r : r.call(e[a], a, t(
                    e[a], n)));
            return i ? e : l ? t.call(e) : u ? t(e[0], n) : o
        },
        now: Date.now,
        swap: function(e, t, n, r) {
            var i, o, s = {};
            for (o in t) s[o] = e.style[o], e.style[o] = t[o];
            i = n.apply(e, r || []);
            for (o in t) e.style[o] = s[o];
            return i
        }
    }), x.ready.promise = function(t) {
        return n || (n = x.Deferred(), "complete" === o.readyState ?
            setTimeout(x.ready) : (o.addEventListener("DOMContentLoaded", S, !
                1), e.addEventListener("load", S, !1))), n.promise(t)
    }, x.each(
        "Boolean Number String Function Array Date RegExp Object Error".split(
            " "), function(e, t) {
            l["[object " + t + "]"] = t.toLowerCase()
        });

    function j(e) {
        var t = e.length,
            n = x.type(e);
        return x.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" ===
            n || "function" !== n && (0 === t || "number" == typeof t && t >
                0 && t - 1 in e)
    }
    t = x(o),
    function(e, undefined) {
        var t, n, r, i, o, s, a, u, l, c, p, f, h, d, g, m, y, v = "sizzle" + -
                new Date,
            b = e.document,
            w = 0,
            T = 0,
            C = st(),
            k = st(),
            N = st(),
            E = !1,
            S = function(e, t) {
                return e === t ? (E = !0, 0) : 0
            }, j = typeof undefined,
            D = 1 << 31,
            A = {}.hasOwnProperty,
            L = [],
            q = L.pop,
            H = L.push,
            O = L.push,
            F = L.slice,
            P = L.indexOf || function(e) {
                var t = 0,
                    n = this.length;
                for (; n > t; t++)
                    if (this[t] === e) return t;
                return -1
            }, R =
                "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            M = "[\\x20\\t\\r\\n\\f]",
            W = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            $ = W.replace("w", "w#"),
            B = "\\[" + M + "*(" + W + ")" + M + "*(?:([*^$|!~]?=)" + M +
                "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + $ + ")|)|)" + M +
                "*\\]",
            I = ":(" + W +
                ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" +
                B.replace(3, 8) + ")*)|.*)\\)|)",
            z = RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$",
                "g"),
            _ = RegExp("^" + M + "*," + M + "*"),
            X = RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"),
            U = RegExp(M + "*[+~]"),
            Y = RegExp("=" + M + "*([^\\]'\"]*)" + M + "*\\]", "g"),
            V = RegExp(I),
            G = RegExp("^" + $ + "$"),
            J = {
                ID: RegExp("^#(" + W + ")"),
                CLASS: RegExp("^\\.(" + W + ")"),
                TAG: RegExp("^(" + W.replace("w", "w*") + ")"),
                ATTR: RegExp("^" + B),
                PSEUDO: RegExp("^" + I),
                CHILD: RegExp(
                    "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
                    M + "*(even|odd|(([+-]|)(\\d*)n|)" + M + "*(?:([+-]|)" +
                    M + "*(\\d+)|))" + M + "*\\)|)", "i"),
                bool: RegExp("^(?:" + R + ")$", "i"),
                needsContext: RegExp("^" + M +
                    "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + M +
                    "*((?:-\\d)?\\d*)" + M + "*\\)|)(?=[^-]|$)", "i")
            }, Q = /^[^{]+\{\s*\[native \w/,
            K = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            Z = /^(?:input|select|textarea|button)$/i,
            et = /^h\d$/i,
            tt = /'|\\/g,
            nt = RegExp("\\\\([\\da-f]{1,6}" + M + "?|(" + M + ")|.)", "ig"),
            rt = function(e, t, n) {
                var r = "0x" + t - 65536;
                return r !== r || n ? t : 0 > r ? String.fromCharCode(r +
                    65536) : String.fromCharCode(55296 | r >> 10, 56320 |
                    1023 & r)
            };
        try {
            O.apply(L = F.call(b.childNodes), b.childNodes), L[b.childNodes
                .length].nodeType
        } catch (it) {
            O = {
                apply: L.length ? function(e, t) {
                    H.apply(e, F.call(t))
                } : function(e, t) {
                    var n = e.length,
                        r = 0;
                    while (e[n++] = t[r++]);
                    e.length = n - 1
                }
            }
        }

        function ot(e, t, r, i) {
            var o, s, a, u, l, f, g, m, x, w;
            if ((t ? t.ownerDocument || t : b) !== p && c(t), t = t || p, r =
                r || [], !e || "string" != typeof e) return r;
            if (1 !== (u = t.nodeType) && 9 !== u) return [];
            if (h && !i) {
                if (o = K.exec(e))
                    if (a = o[1]) {
                        if (9 === u) {
                            if (s = t.getElementById(a), !s || !s.parentNode)
                                return r;
                            if (s.id === a) return r.push(s), r
                        } else if (t.ownerDocument && (s = t.ownerDocument.getElementById(
                            a)) && y(t, s) && s.id === a) return r.push(s),
                        r
                    } else {
                        if (o[2]) return O.apply(r, t.getElementsByTagName(
                            e)), r;
                        if ((a = o[3]) && n.getElementsByClassName && t.getElementsByClassName)
                            return O.apply(r, t.getElementsByClassName(a)),
                        r
                    }
                if (n.qsa && (!d || !d.test(e))) {
                    if (m = g = v, x = t, w = 9 === u && e, 1 === u &&
                        "object" !== t.nodeName.toLowerCase()) {
                        f = gt(e), (g = t.getAttribute("id")) ? m = g.replace(
                            tt, "\\$&") : t.setAttribute("id", m), m =
                            "[id='" + m + "'] ", l = f.length;
                        while (l--) f[l] = m + mt(f[l]);
                        x = U.test(e) && t.parentNode || t, w = f.join(",")
                    }
                    if (w) try {
                        return O.apply(r, x.querySelectorAll(w)), r
                    } catch (T) {} finally {
                        g || t.removeAttribute("id")
                    }
                }
            }
            return kt(e.replace(z, "$1"), t, r, i)
        }

        function st() {
            var e = [];

            function t(n, r) {
                return e.push(n += " ") > i.cacheLength && delete t[e.shift()],
                t[n] = r
            }
            return t
        }

        function at(e) {
            return e[v] = !0, e
        }

        function ut(e) {
            var t = p.createElement("div");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function lt(e, t) {
            var n = e.split("|"),
                r = e.length;
            while (r--) i.attrHandle[n[r]] = t
        }

        function ct(e, t) {
            var n = t && e,
                r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex ||
                    D) - (~e.sourceIndex || D);
            if (r) return r;
            if (n)
                while (n = n.nextSibling)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function pt(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e
            }
        }

        function ft(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }

        function ht(e) {
            return at(function(t) {
                return t = +t, at(function(n, r) {
                    var i, o = e([], n.length, t),
                        s = o.length;
                    while (s--) n[i = o[s]] && (n[i] = !(r[i] = n[i]))
                })
            })
        }
        s = ot.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return t ? "HTML" !== t.nodeName : !1
        }, n = ot.support = {}, c = ot.setDocument = function(e) {
            var t = e ? e.ownerDocument || e : b,
                r = t.defaultView;
            return t !== p && 9 === t.nodeType && t.documentElement ? (p =
                t, f = t.documentElement, h = !s(t), r && r.attachEvent &&
                r !== r.top && r.attachEvent("onbeforeunload", function() {
                    c()
                }), n.attributes = ut(function(e) {
                    return e.className = "i", !e.getAttribute(
                        "className")
                }), n.getElementsByTagName = ut(function(e) {
                    return e.appendChild(t.createComment("")), !e.getElementsByTagName(
                        "*").length
                }), n.getElementsByClassName = ut(function(e) {
                    return e.innerHTML =
                        "<div class='a'></div><div class='a i'></div>",
                    e.firstChild.className = "i", 2 === e.getElementsByClassName(
                        "i").length
                }), n.getById = ut(function(e) {
                    return f.appendChild(e).id = v, !t.getElementsByName || !
                        t.getElementsByName(v).length
                }), n.getById ? (i.find.ID = function(e, t) {
                    if (typeof t.getElementById !== j && h) {
                        var n = t.getElementById(e);
                        return n && n.parentNode ? [n] : []
                    }
                }, i.filter.ID = function(e) {
                    var t = e.replace(nt, rt);
                    return function(e) {
                        return e.getAttribute("id") === t
                    }
                }) : (delete i.find.ID, i.filter.ID = function(e) {
                    var t = e.replace(nt, rt);
                    return function(e) {
                        var n = typeof e.getAttributeNode !== j && e.getAttributeNode(
                            "id");
                        return n && n.value === t
                    }
                }), i.find.TAG = n.getElementsByTagName ? function(e, t) {
                    return typeof t.getElementsByTagName !== j ? t.getElementsByTagName(
                        e) : undefined
                } : function(e, t) {
                    var n, r = [],
                        i = 0,
                        o = t.getElementsByTagName(e);
                    if ("*" === e) {
                        while (n = o[i++]) 1 === n.nodeType && r.push(n);
                        return r
                    }
                    return o
                }, i.find.CLASS = n.getElementsByClassName && function(e, t) {
                    return typeof t.getElementsByClassName !== j && h ? t.getElementsByClassName(
                        e) : undefined
                }, g = [], d = [], (n.qsa = Q.test(t.querySelectorAll)) &&
                (ut(function(e) {
                    e.innerHTML =
                        "<select><option selected=''></option></select>",
                    e.querySelectorAll("[selected]").length ||
                        d.push("\\[" + M + "*(?:value|" + R + ")"),
                    e.querySelectorAll(":checked").length || d.push(
                        ":checked")
                }), ut(function(e) {
                    var n = t.createElement("input");
                    n.setAttribute("type", "hidden"), e.appendChild(
                        n).setAttribute("t", ""), e.querySelectorAll(
                        "[t^='']").length && d.push("[*^$]=" + M +
                        "*(?:''|\"\")"), e.querySelectorAll(
                        ":enabled").length || d.push(":enabled",
                        ":disabled"), e.querySelectorAll("*,:x"), d
                        .push(",.*:")
                })), (n.matchesSelector = Q.test(m = f.webkitMatchesSelector ||
                    f.mozMatchesSelector || f.oMatchesSelector || f.msMatchesSelector
                )) && ut(function(e) {
                    n.disconnectedMatch = m.call(e, "div"), m.call(e,
                        "[s!='']:x"), g.push("!=", I)
                }), d = d.length && RegExp(d.join("|")), g = g.length &&
                RegExp(g.join("|")), y = Q.test(f.contains) || f.compareDocumentPosition ?
                function(e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                        r = t && t.parentNode;
                    return e === r || !(!r || 1 !== r.nodeType || !(n.contains ?
                        n.contains(r) : e.compareDocumentPosition && 16 &
                        e.compareDocumentPosition(r)))
                } : function(e, t) {
                    if (t)
                        while (t = t.parentNode)
                            if (t === e) return !0;
                    return !1
                }, S = f.compareDocumentPosition ? function(e, r) {
                    if (e === r) return E = !0, 0;
                    var i = r.compareDocumentPosition && e.compareDocumentPosition &&
                        e.compareDocumentPosition(r);
                    return i ? 1 & i || !n.sortDetached && r.compareDocumentPosition(
                        e) === i ? e === t || y(b, e) ? -1 : r === t || y(b,
                        r) ? 1 : l ? P.call(l, e) - P.call(l, r) : 0 : 4 &
                        i ? -1 : 1 : e.compareDocumentPosition ? -1 : 1
                } : function(e, n) {
                    var r, i = 0,
                        o = e.parentNode,
                        s = n.parentNode,
                        a = [e],
                        u = [n];
                    if (e === n) return E = !0, 0;
                    if (!o || !s) return e === t ? -1 : n === t ? 1 : o ? -
                        1 : s ? 1 : l ? P.call(l, e) - P.call(l, n) : 0;
                    if (o === s) return ct(e, n);
                    r = e;
                    while (r = r.parentNode) a.unshift(r);
                    r = n;
                    while (r = r.parentNode) u.unshift(r);
                    while (a[i] === u[i]) i++;
                    return i ? ct(a[i], u[i]) : a[i] === b ? -1 : u[i] ===
                        b ? 1 : 0
                }, t) : p
        }, ot.matches = function(e, t) {
            return ot(e, null, null, t)
        }, ot.matchesSelector = function(e, t) {
            if ((e.ownerDocument || e) !== p && c(e), t = t.replace(Y,
                "='$1']"), !(!n.matchesSelector || !h || g && g.test(t) ||
                d && d.test(t))) try {
                var r = m.call(e, t);
                if (r || n.disconnectedMatch || e.document && 11 !== e.document
                    .nodeType) return r
            } catch (i) {}
            return ot(t, p, null, [e]).length > 0
        }, ot.contains = function(e, t) {
            return (e.ownerDocument || e) !== p && c(e), y(e, t)
        }, ot.attr = function(e, t) {
            (e.ownerDocument || e) !== p && c(e);
            var r = i.attrHandle[t.toLowerCase()],
                o = r && A.call(i.attrHandle, t.toLowerCase()) ? r(e, t, !h) :
                    undefined;
            return o === undefined ? n.attributes || !h ? e.getAttribute(t) :
                (o = e.getAttributeNode(t)) && o.specified ? o.value : null :
                o
        }, ot.error = function(e) {
            throw Error("Syntax error, unrecognized expression: " + e)
        }, ot.uniqueSort = function(e) {
            var t, r = [],
                i = 0,
                o = 0;
            if (E = !n.detectDuplicates, l = !n.sortStable && e.slice(0), e
                .sort(S), E) {
                while (t = e[o++]) t === e[o] && (i = r.push(o));
                while (i--) e.splice(r[i], 1)
            }
            return e
        }, o = ot.getText = function(e) {
            var t, n = "",
                r = 0,
                i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent) return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling) n += o(e)
                } else if (3 === i || 4 === i) return e.nodeValue
            } else
                for (; t = e[r]; r++) n += o(t);
            return n
        }, i = ot.selectors = {
            cacheLength: 50,
            createPseudo: at,
            match: J,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(nt, rt), e[3] = (e[4] || e[5] ||
                        "").replace(nt, rt), "~=" === e[2] && (e[3] = " " +
                        e[3] + " "), e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(
                        0, 3) ? (e[3] || ot.error(e[0]), e[4] = +(e[4] ? e[
                        5] + (e[6] || 1) : 2 * ("even" === e[3] ||
                        "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" ===
                        e[3])) : e[3] && ot.error(e[0]), e
                },
                PSEUDO: function(e) {
                    var t, n = !e[5] && e[2];
                    return J.CHILD.test(e[0]) ? null : (e[3] && e[4] !==
                        undefined ? e[2] = e[4] : n && V.test(n) && (t = gt(
                            n, !0)) && (t = n.indexOf(")", n.length - t) -
                            n.length) && (e[0] = e[0].slice(0, t), e[2] = n
                            .slice(0, t)), e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(nt, rt).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    } : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = C[e + " "];
                    return t || (t = RegExp("(^|" + M + ")" + e + "(" + M +
                        "|$)")) && C(e, function(e) {
                        return t.test("string" == typeof e.className &&
                            e.className || typeof e.getAttribute !== j &&
                            e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, t, n) {
                    return function(r) {
                        var i = ot.attr(r, e);
                        return null == i ? "!=" === t : t ? (i += "", "=" ===
                            t ? i === n : "!=" === t ? i !== n : "^=" === t ?
                            n && 0 === i.indexOf(n) : "*=" === t ? n && i.indexOf(
                                n) > -1 : "$=" === t ? n && i.slice(-n.length) ===
                            n : "~=" === t ? (" " + i + " ").indexOf(n) > -
                            1 : "|=" === t ? i === n || i.slice(0, n.length +
                                1) === n + "-" : !1) : !0
                    }
                },
                CHILD: function(e, t, n, r, i) {
                    var o = "nth" !== e.slice(0, 3),
                        s = "last" !== e.slice(-4),
                        a = "of-type" === t;
                    return 1 === r && 0 === i ? function(e) {
                        return !!e.parentNode
                    } : function(t, n, u) {
                        var l, c, p, f, h, d, g = o !== s ? "nextSibling" :
                                "previousSibling",
                            m = t.parentNode,
                            y = a && t.nodeName.toLowerCase(),
                            x = !u && !a;
                        if (m) {
                            if (o) {
                                while (g) {
                                    p = t;
                                    while (p = p[g])
                                        if (a ? p.nodeName.toLowerCase() ===
                                            y : 1 === p.nodeType) return !1;
                                    d = g = "only" === e && !d &&
                                        "nextSibling"
                                }
                                return !0
                            }
                            if (d = [s ? m.firstChild : m.lastChild], s &&
                                x) {
                                c = m[v] || (m[v] = {}), l = c[e] || [], h =
                                    l[0] === w && l[1], f = l[0] === w && l[
                                        2], p = h && m.childNodes[h];
                                while (p = ++h && p && p[g] || (f = h = 0) ||
                                    d.pop())
                                    if (1 === p.nodeType && ++f && p === t) {
                                        c[e] = [w, h, f];
                                        break
                                    }
                            } else if (x && (l = (t[v] || (t[v] = {}))[e]) &&
                                l[0] === w) f = l[1];
                            else
                                while (p = ++h && p && p[g] || (f = h = 0) ||
                                    d.pop())
                                    if ((a ? p.nodeName.toLowerCase() === y :
                                        1 === p.nodeType) && ++f && (x &&
                                        ((p[v] || (p[v] = {}))[e] = [w,
                                            f]), p === t)) break; return f -=
                                i, f === r || 0 === f % r && f / r >= 0
                        }
                    }
                },
                PSEUDO: function(e, t) {
                    var n, r = i.pseudos[e] || i.setFilters[e.toLowerCase()] ||
                            ot.error("unsupported pseudo: " + e);
                    return r[v] ? r(t) : r.length > 1 ? (n = [e, e, "", t],
                        i.setFilters.hasOwnProperty(e.toLowerCase()) ? at(
                            function(e, n) {
                                var i, o = r(e, t),
                                    s = o.length;
                                while (s--) i = P.call(e, o[s]), e[i] = !(n[
                                    i] = o[s])
                            }) : function(e) {
                            return r(e, 0, n)
                        }) : r
                }
            },
            pseudos: {
                not: at(function(e) {
                    var t = [],
                        n = [],
                        r = a(e.replace(z, "$1"));
                    return r[v] ? at(function(e, t, n, i) {
                        var o, s = r(e, null, i, []),
                            a = e.length;
                        while (a--)(o = s[a]) && (e[a] = !(t[a] = o))
                    }) : function(e, i, o) {
                        return t[0] = e, r(t, null, o, n), !n.pop()
                    }
                }),
                has: at(function(e) {
                    return function(t) {
                        return ot(e, t).length > 0
                    }
                }),
                contains: at(function(e) {
                    return function(t) {
                        return (t.textContent || t.innerText || o(t)).indexOf(
                            e) > -1
                    }
                }),
                lang: at(function(e) {
                    return G.test(e || "") || ot.error(
                        "unsupported lang: " + e), e = e.replace(nt, rt)
                        .toLowerCase(),
                    function(t) {
                        var n;
                        do
                            if (n = h ? t.lang : t.getAttribute(
                                "xml:lang") || t.getAttribute(
                                "lang")) return n = n.toLowerCase(), n ===
                                e || 0 === n.indexOf(e + "-"); while ((
                            t = t.parentNode) && 1 === t.nodeType);
                        return !1
                    }
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === f
                },
                focus: function(e) {
                    return e === p.activeElement && (!p.hasFocus || p.hasFocus()) && !!
                        (e.type || e.href || ~e.tabIndex)
                },
                enabled: function(e) {
                    return e.disabled === !1
                },
                disabled: function(e) {
                    return e.disabled === !0
                },
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !! e.checked || "option" === t && !!
                        e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex, e.selected === !
                        0
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeName > "@" || 3 === e.nodeType || 4 === e
                            .nodeType) return !1;
                    return !0
                },
                parent: function(e) {
                    return !i.pseudos.empty(e)
                },
                header: function(e) {
                    return et.test(e.nodeName)
                },
                input: function(e) {
                    return Z.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" ===
                        t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" ===
                        e.type && (null == (t = e.getAttribute("type")) ||
                            t.toLowerCase() === e.type)
                },
                first: ht(function() {
                    return [0]
                }),
                last: ht(function(e, t) {
                    return [t - 1]
                }),
                eq: ht(function(e, t, n) {
                    return [0 > n ? n + t : n]
                }),
                even: ht(function(e, t) {
                    var n = 0;
                    for (; t > n; n += 2) e.push(n);
                    return e
                }),
                odd: ht(function(e, t) {
                    var n = 1;
                    for (; t > n; n += 2) e.push(n);
                    return e
                }),
                lt: ht(function(e, t, n) {
                    var r = 0 > n ? n + t : n;
                    for (; --r >= 0;) e.push(r);
                    return e
                }),
                gt: ht(function(e, t, n) {
                    var r = 0 > n ? n + t : n;
                    for (; t > ++r;) e.push(r);
                    return e
                })
            }
        }, i.pseudos.nth = i.pseudos.eq;
        for (t in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) i.pseudos[t] = pt(t);
        for (t in {
            submit: !0,
            reset: !0
        }) i.pseudos[t] = ft(t);

        function dt() {}
        dt.prototype = i.filters = i.pseudos, i.setFilters = new dt;

        function gt(e, t) {
            var n, r, o, s, a, u, l, c = k[e + " "];
            if (c) return t ? 0 : c.slice(0);
            a = e, u = [], l = i.preFilter;
            while (a) {
                (!n || (r = _.exec(a))) && (r && (a = a.slice(r[0].length) ||
                    a), u.push(o = [])), n = !1, (r = X.exec(a)) && (n = r.shift(),
                    o.push({
                        value: n,
                        type: r[0].replace(z, " ")
                    }), a = a.slice(n.length));
                for (s in i.filter)!(r = J[s].exec(a)) || l[s] && !(r = l[s]
                    (r)) || (n = r.shift(), o.push({
                    value: n,
                    type: s,
                    matches: r
                }), a = a.slice(n.length));
                if (!n) break
            }
            return t ? a.length : a ? ot.error(e) : k(e, u).slice(0)
        }

        function mt(e) {
            var t = 0,
                n = e.length,
                r = "";
            for (; n > t; t++) r += e[t].value;
            return r
        }

        function yt(e, t, n) {
            var i = t.dir,
                o = n && "parentNode" === i,
                s = T++;
            return t.first ? function(t, n, r) {
                while (t = t[i])
                    if (1 === t.nodeType || o) return e(t, n, r)
            } : function(t, n, a) {
                var u, l, c, p = w + " " + s;
                if (a) {
                    while (t = t[i])
                        if ((1 === t.nodeType || o) && e(t, n, a)) return !
                            0
                } else
                    while (t = t[i])
                        if (1 === t.nodeType || o)
                            if (c = t[v] || (t[v] = {}), (l = c[i]) && l[0] ===
                                p) {
                                if ((u = l[1]) === !0 || u === r) return u === !
                                    0
                            } else if (l = c[i] = [p], l[1] = e(t, n, a) ||
                    r, l[1] === !0) return !0
            }
        }

        function vt(e) {
            return e.length > 1 ? function(t, n, r) {
                var i = e.length;
                while (i--)
                    if (!e[i](t, n, r)) return !1;
                return !0
            } : e[0]
        }

        function xt(e, t, n, r, i) {
            var o, s = [],
                a = 0,
                u = e.length,
                l = null != t;
            for (; u > a; a++)(o = e[a]) && (!n || n(o, r, i)) && (s.push(o),
                l && t.push(a));
            return s
        }

        function bt(e, t, n, r, i, o) {
            return r && !r[v] && (r = bt(r)), i && !i[v] && (i = bt(i, o)),
            at(function(o, s, a, u) {
                var l, c, p, f = [],
                    h = [],
                    d = s.length,
                    g = o || Ct(t || "*", a.nodeType ? [a] : a, []),
                    m = !e || !o && t ? g : xt(g, f, e, a, u),
                    y = n ? i || (o ? e : d || r) ? [] : s : m;
                if (n && n(m, y, a, u), r) {
                    l = xt(y, h), r(l, [], a, u), c = l.length;
                    while (c--)(p = l[c]) && (y[h[c]] = !(m[h[c]] =
                        p))
                }
                if (o) {
                    if (i || e) {
                        if (i) {
                            l = [], c = y.length;
                            while (c--)(p = y[c]) && l.push(m[c] =
                                p);
                            i(null, y = [], l, u)
                        }
                        c = y.length;
                        while (c--)(p = y[c]) && (l = i ? P.call(o,
                            p) : f[c]) > -1 && (o[l] = !(s[l] = p))
                    }
                } else y = xt(y === s ? y.splice(d, y.length) : y),
                i ? i(null, s, y, u) : O.apply(s, y)
            })
        }

        function wt(e) {
            var t, n, r, o = e.length,
                s = i.relative[e[0].type],
                a = s || i.relative[" "],
                l = s ? 1 : 0,
                c = yt(function(e) {
                    return e === t
                }, a, !0),
                p = yt(function(e) {
                    return P.call(t, e) > -1
                }, a, !0),
                f = [

                    function(e, n, r) {
                        return !s && (r || n !== u) || ((t = n).nodeType ?
                            c(e, n, r) : p(e, n, r))
                    }
                ];
            for (; o > l; l++)
                if (n = i.relative[e[l].type]) f = [yt(vt(f), n)];
                else {
                    if (n = i.filter[e[l].type].apply(null, e[l].matches),
                        n[v]) {
                        for (r = ++l; o > r; r++)
                            if (i.relative[e[r].type]) break;
                        return bt(l > 1 && vt(f), l > 1 && mt(e.slice(0, l -
                                1).concat({
                                value: " " === e[l - 2].type ? "*" : ""
                            })).replace(z, "$1"), n, r > l && wt(e.slice(l,
                                r)), o > r && wt(e = e.slice(r)), o > r &&
                            mt(e))
                    }
                    f.push(n)
                }
            return vt(f)
        }

        function Tt(e, t) {
            var n = 0,
                o = t.length > 0,
                s = e.length > 0,
                a = function(a, l, c, f, h) {
                    var d, g, m, y = [],
                        v = 0,
                        x = "0",
                        b = a && [],
                        T = null != h,
                        C = u,
                        k = a || s && i.find.TAG("*", h && l.parentNode ||
                            l),
                        N = w += null == C ? 1 : Math.random() || .1;
                    for (T && (u = l !== p && l, r = n); null != (d = k[x]); x++) {
                        if (s && d) {
                            g = 0;
                            while (m = e[g++])
                                if (m(d, l, c)) {
                                    f.push(d);
                                    break
                                }
                            T && (w = N, r = ++n)
                        }
                        o && ((d = !m && d) && v--, a && b.push(d))
                    }
                    if (v += x, o && x !== v) {
                        g = 0;
                        while (m = t[g++]) m(b, y, l, c);
                        if (a) {
                            if (v > 0)
                                while (x--) b[x] || y[x] || (y[x] = q.call(
                                    f));
                            y = xt(y)
                        }
                        O.apply(f, y), T && !a && y.length > 0 && v + t.length >
                            1 && ot.uniqueSort(f)
                    }
                    return T && (w = N, u = C), b
                };
            return o ? at(a) : a
        }
        a = ot.compile = function(e, t) {
            var n, r = [],
                i = [],
                o = N[e + " "];
            if (!o) {
                t || (t = gt(e)), n = t.length;
                while (n--) o = wt(t[n]), o[v] ? r.push(o) : i.push(o);
                o = N(e, Tt(i, r))
            }
            return o
        };

        function Ct(e, t, n) {
            var r = 0,
                i = t.length;
            for (; i > r; r++) ot(e, t[r], n);
            return n
        }

        function kt(e, t, r, o) {
            var s, u, l, c, p, f = gt(e);
            if (!o && 1 === f.length) {
                if (u = f[0] = f[0].slice(0), u.length > 2 && "ID" === (l =
                        u[0]).type && n.getById && 9 === t.nodeType && h &&
                    i.relative[u[1].type]) {
                    if (t = (i.find.ID(l.matches[0].replace(nt, rt), t) || [])[
                        0], !t) return r;
                    e = e.slice(u.shift().value.length)
                }
                s = J.needsContext.test(e) ? 0 : u.length;
                while (s--) {
                    if (l = u[s], i.relative[c = l.type]) break;
                    if ((p = i.find[c]) && (o = p(l.matches[0].replace(nt,
                            rt), U.test(u[0].type) && t.parentNode ||
                        t))) {
                        if (u.splice(s, 1), e = o.length && mt(u), !e)
                            return O.apply(r, o), r;
                        break
                    }
                }
            }
            return a(e, f)(o, t, !h, r, U.test(e)), r
        }
        n.sortStable = v.split("").sort(S).join("") === v, n.detectDuplicates =
            E, c(), n.sortDetached = ut(function(e) {
                return 1 & e.compareDocumentPosition(p.createElement(
                    "div"))
            }), ut(function(e) {
                return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild
                    .getAttribute("href")
            }) || lt("type|href|height|width", function(e, t, n) {
                return n ? undefined : e.getAttribute(t, "type" === t.toLowerCase() ?
                    1 : 2)
            }), n.attributes && ut(function(e) {
                return e.innerHTML = "<input/>", e.firstChild.setAttribute(
                    "value", ""), "" === e.firstChild.getAttribute(
                    "value")
            }) || lt("value", function(e, t, n) {
                return n || "input" !== e.nodeName.toLowerCase() ?
                    undefined : e.defaultValue
            }), ut(function(e) {
                return null == e.getAttribute("disabled")
            }) || lt(R, function(e, t, n) {
                var r;
                return n ? undefined : (r = e.getAttributeNode(t)) && r
                    .specified ? r.value : e[t] === !0 ? t.toLowerCase() :
                    null
            }), x.find = ot, x.expr = ot.selectors, x.expr[":"] = x.expr.pseudos,
        x.unique = ot.uniqueSort, x.text = ot.getText, x.isXMLDoc = ot.isXML,
        x.contains = ot.contains
    }(e);
    var D = {};

    function A(e) {
        var t = D[e] = {};
        return x.each(e.match(w) || [], function(e, n) {
            t[n] = !0
        }), t
    }
    x.Callbacks = function(e) {
        e = "string" == typeof e ? D[e] || A(e) : x.extend({}, e);
        var t, n, r, i, o, s, a = [],
            u = !e.once && [],
            l = function(p) {
                for (t = e.memory && p, n = !0, s = i || 0, i = 0, o = a.length,
                    r = !0; a && o > s; s++)
                    if (a[s].apply(p[0], p[1]) === !1 && e.stopOnFalse) {
                        t = !1;
                        break
                    }
                r = !1, a && (u ? u.length && l(u.shift()) : t ? a = [] : c
                    .disable())
            }, c = {
                add: function() {
                    if (a) {
                        var n = a.length;
                        (function s(t) {
                            x.each(t, function(t, n) {
                                var r = x.type(n);
                                "function" === r ? e.unique && c.has(
                                    n) || a.push(n) : n && n.length &&
                                    "string" !== r && s(n)
                            })
                        })(arguments), r ? o = a.length : t && (i = n, l(t))
                    }
                    return this
                },
                remove: function() {
                    return a && x.each(arguments, function(e, t) {
                        var n;
                        while ((n = x.inArray(t, a, n)) > -1) a.splice(
                            n, 1), r && (o >= n && o--, s >= n && s--)
                    }), this
                },
                has: function(e) {
                    return e ? x.inArray(e, a) > -1 : !(!a || !a.length)
                },
                empty: function() {
                    return a = [], o = 0, this
                },
                disable: function() {
                    return a = u = t = undefined, this
                },
                disabled: function() {
                    return !a
                },
                lock: function() {
                    return u = undefined, t || c.disable(), this
                },
                locked: function() {
                    return !u
                },
                fireWith: function(e, t) {
                    return !a || n && !u || (t = t || [], t = [e, t.slice ?
                        t.slice() : t], r ? u.push(t) : l(t)), this
                },
                fire: function() {
                    return c.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!n
                }
            };
        return c
    }, x.extend({
        Deferred: function(e) {
            var t = [
                ["resolve", "done", x.Callbacks("once memory"), "resolved"],
                ["reject", "fail", x.Callbacks("once memory"), "rejected"],
                ["notify", "progress", x.Callbacks("memory")]
            ],
                n = "pending",
                r = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return i.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var e = arguments;
                        return x.Deferred(function(n) {
                            x.each(t, function(t, o) {
                                var s = o[0],
                                    a = x.isFunction(e[t]) && e[
                                        t];
                                i[o[1]](function() {
                                    var e = a && a.apply(
                                        this, arguments);
                                    e && x.isFunction(e.promise) ?
                                        e.promise().done(n.resolve)
                                        .fail(n.reject).progress(
                                            n.notify) : n[s +
                                            "With"](this ===
                                            r ? n.promise() :
                                            this, a ? [e] :
                                            arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? x.extend(e, r) : r
                    }
                }, i = {};
            return r.pipe = r.then, x.each(t, function(e, o) {
                var s = o[2],
                    a = o[3];
                r[o[1]] = s.add, a && s.add(function() {
                    n = a
                }, t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] =
                    function() {
                        return i[o[0] + "With"](this === i ? r :
                            this, arguments), this
                }, i[o[0] + "With"] = s.fireWith
            }), r.promise(i), e && e.call(i, i), i
        },
        when: function(e) {
            var t = 0,
                n = d.call(arguments),
                r = n.length,
                i = 1 !== r || e && x.isFunction(e.promise) ? r : 0,
                o = 1 === i ? e : x.Deferred(),
                s = function(e, t, n) {
                    return function(r) {
                        t[e] = this, n[e] = arguments.length > 1 ? d.call(
                            arguments) : r, n === a ? o.notifyWith(t, n) : --
                        i || o.resolveWith(t, n)
                    }
                }, a, u, l;
            if (r > 1)
                for (a = Array(r), u = Array(r), l = Array(r); r > t; t++)
                    n[t] && x.isFunction(n[t].promise) ? n[t].promise()
                        .done(s(t, l, n)).fail(o.reject).progress(s(t,
                            u, a)) : --i;
            return i || o.resolveWith(l, n), o.promise()
        }
    }), x.support = function(t) {
        var n = o.createElement("input"),
            r = o.createDocumentFragment(),
            i = o.createElement("div"),
            s = o.createElement("select"),
            a = s.appendChild(o.createElement("option"));
        return n.type ? (n.type = "checkbox", t.checkOn = "" !== n.value, t
            .optSelected = a.selected, t.reliableMarginRight = !0, t.boxSizingReliable = !
            0, t.pixelPosition = !1, n.checked = !0, t.noCloneChecked = n.cloneNode(!
                0).checked, s.disabled = !0, t.optDisabled = !a.disabled, n =
            o.createElement("input"), n.value = "t", n.type = "radio", t.radioValue =
            "t" === n.value, n.setAttribute("checked", "t"), n.setAttribute(
                "name", "t"), r.appendChild(n), t.checkClone = r.cloneNode(!
                0).cloneNode(!0).lastChild.checked, t.focusinBubbles =
            "onfocusin" in e, i.style.backgroundClip = "content-box", i.cloneNode(!
                0).style.backgroundClip = "", t.clearCloneStyle =
            "content-box" === i.style.backgroundClip, x(function() {
                var n, r, s =
                        "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
                    a = o.getElementsByTagName("body")[0];
                a && (n = o.createElement("div"), n.style.cssText =
                    "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",
                    a.appendChild(n).appendChild(i), i.innerHTML = "",
                    i.style.cssText =
                    "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%",
                    x.swap(a, null != a.style.zoom ? {
                        zoom: 1
                    } : {}, function() {
                        t.boxSizing = 4 === i.offsetWidth
                    }), e.getComputedStyle && (t.pixelPosition = "1%" !==
                        (e.getComputedStyle(i, null) || {}).top, t.boxSizingReliable =
                        "4px" === (e.getComputedStyle(i, null) || {
                            width: "4px"
                        }).width, r = i.appendChild(o.createElement(
                            "div")), r.style.cssText = i.style.cssText =
                        s, r.style.marginRight = r.style.width = "0", i
                        .style.width = "1px", t.reliableMarginRight = !
                        parseFloat((e.getComputedStyle(r, null) || {}).marginRight)
                    ), a.removeChild(n))
            }), t) : t
    }({});
    var L, q, H = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        O = /([A-Z])/g;

    function F() {
        Object.defineProperty(this.cache = {}, 0, {
            get: function() {
                return {}
            }
        }), this.expando = x.expando + Math.random()
    }
    F.uid = 1, F.accepts = function(e) {
        return e.nodeType ? 1 === e.nodeType || 9 === e.nodeType : !0
    }, F.prototype = {
        key: function(e) {
            if (!F.accepts(e)) return 0;
            var t = {}, n = e[this.expando];
            if (!n) {
                n = F.uid++;
                try {
                    t[this.expando] = {
                        value: n
                    }, Object.defineProperties(e, t)
                } catch (r) {
                    t[this.expando] = n, x.extend(e, t)
                }
            }
            return this.cache[n] || (this.cache[n] = {}), n
        },
        set: function(e, t, n) {
            var r, i = this.key(e),
                o = this.cache[i];
            if ("string" == typeof t) o[t] = n;
            else if (x.isEmptyObject(o)) x.extend(this.cache[i], t);
            else
                for (r in t) o[r] = t[r];
            return o
        },
        get: function(e, t) {
            var n = this.cache[this.key(e)];
            return t === undefined ? n : n[t]
        },
        access: function(e, t, n) {
            var r;
            return t === undefined || t && "string" == typeof t && n ===
                undefined ? (r = this.get(e, t), r !== undefined ? r : this
                    .get(e, x.camelCase(t))) : (this.set(e, t, n), n !==
                    undefined ? n : t)
        },
        remove: function(e, t) {
            var n, r, i, o = this.key(e),
                s = this.cache[o];
            if (t === undefined) this.cache[o] = {};
            else {
                x.isArray(t) ? r = t.concat(t.map(x.camelCase)) : (i = x.camelCase(
                    t), t in s ? r = [t, i] : (r = i, r = r in s ? [r] :
                    r.match(w) || [])), n = r.length;
                while (n--) delete s[r[n]]
            }
        },
        hasData: function(e) {
            return !x.isEmptyObject(this.cache[e[this.expando]] || {})
        },
        discard: function(e) {
            e[this.expando] && delete this.cache[e[this.expando]]
        }
    }, L = new F, q = new F, x.extend({
        acceptData: F.accepts,
        hasData: function(e) {
            return L.hasData(e) || q.hasData(e)
        },
        data: function(e, t, n) {
            return L.access(e, t, n)
        },
        removeData: function(e, t) {
            L.remove(e, t)
        },
        _data: function(e, t, n) {
            return q.access(e, t, n)
        },
        _removeData: function(e, t) {
            q.remove(e, t)
        }
    }), x.fn.extend({
        data: function(e, t) {
            var n, r, i = this[0],
                o = 0,
                s = null;
            if (e === undefined) {
                if (this.length && (s = L.get(i), 1 === i.nodeType && !
                    q.get(i, "hasDataAttrs"))) {
                    for (n = i.attributes; n.length > o; o++) r = n[o].name,
                    0 === r.indexOf("data-") && (r = x.camelCase(r.slice(
                        5)), P(i, r, s[r]));
                    q.set(i, "hasDataAttrs", !0)
                }
                return s
            }
            return "object" == typeof e ? this.each(function() {
                L.set(this, e)
            }) : x.access(this, function(t) {
                var n, r = x.camelCase(e);
                if (i && t === undefined) {
                    if (n = L.get(i, e), n !== undefined) return n;
                    if (n = L.get(i, r), n !== undefined) return n;
                    if (n = P(i, r, undefined), n !== undefined)
                        return n
                } else this.each(function() {
                    var n = L.get(this, r);
                    L.set(this, r, t), -1 !== e.indexOf("-") &&
                        n !== undefined && L.set(this, e, t)
                })
            }, null, t, arguments.length > 1, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                L.remove(this, e)
            })
        }
    });

    function P(e, t, n) {
        var r;
        if (n === undefined && 1 === e.nodeType)
            if (r = "data-" + t.replace(O, "-$1").toLowerCase(), n = e.getAttribute(
                r), "string" == typeof n) {
                try {
                    n = "true" === n ? !0 : "false" === n ? !1 : "null" ===
                        n ? null : +n + "" === n ? +n : H.test(n) ? JSON.parse(
                            n) : n
                } catch (i) {}
                L.set(e, t, n)
            } else n = undefined;
        return n
    }
    x.extend({
        queue: function(e, t, n) {
            var r;
            return e ? (t = (t || "fx") + "queue", r = q.get(e, t), n &&
                (!r || x.isArray(n) ? r = q.access(e, t, x.makeArray(n)) :
                    r.push(n)), r || []) : undefined
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = x.queue(e, t),
                r = n.length,
                i = n.shift(),
                o = x._queueHooks(e, t),
                s = function() {
                    x.dequeue(e, t)
                };
            "inprogress" === i && (i = n.shift(), r--), i && ("fx" ===
                t && n.unshift("inprogress"), delete o.stop, i.call(e,
                    s, o)), !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return q.get(e, n) || q.access(e, n, {
                empty: x.Callbacks("once memory").add(function() {
                    q.remove(e, [t + "queue", n])
                })
            })
        }
    }), x.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), n >
                arguments.length ? x.queue(this[0], e) : t ===
                undefined ? this : this.each(function() {
                    var n = x.queue(this, e, t);
                    x._queueHooks(this, e), "fx" === e &&
                        "inprogress" !== n[0] && x.dequeue(this, e)
                })
        },
        dequeue: function(e) {
            return this.each(function() {
                x.dequeue(this, e)
            })
        },
        delay: function(e, t) {
            return e = x.fx ? x.fx.speeds[e] || e : e, t = t || "fx",
            this.queue(t, function(t, n) {
                var r = setTimeout(t, e);
                n.stop = function() {
                    clearTimeout(r)
                }
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, r = 1,
                i = x.Deferred(),
                o = this,
                s = this.length,
                a = function() {
                    --r || i.resolveWith(o, [o])
                };
            "string" != typeof e && (t = e, e = undefined), e = e ||
                "fx";
            while (s--) n = q.get(o[s], e + "queueHooks"), n && n.empty &&
                (r++, n.empty.add(a));
            return a(), i.promise(t)
        }
    });
    var R, M, W = /[\t\r\n\f]/g,
        $ = /\r/g,
        B = /^(?:input|select|textarea|button)$/i;
    x.fn.extend({
        attr: function(e, t) {
            return x.access(this, x.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                x.removeAttr(this, e)
            })
        },
        prop: function(e, t) {
            return x.access(this, x.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[x.propFix[e] || e]
            })
        },
        addClass: function(e) {
            var t, n, r, i, o, s = 0,
                a = this.length,
                u = "string" == typeof e && e;
            if (x.isFunction(e)) return this.each(function(t) {
                x(this).addClass(e.call(this, t, this.className))
            });
            if (u)
                for (t = (e || "").match(w) || []; a > s; s++)
                    if (n = this[s], r = 1 === n.nodeType && (n.className ?
                        (" " + n.className + " ").replace(W, " ") :
                        " ")) {
                        o = 0;
                        while (i = t[o++]) 0 > r.indexOf(" " + i + " ") &&
                            (r += i + " ");
                        n.className = x.trim(r)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, r, i, o, s = 0,
                a = this.length,
                u = 0 === arguments.length || "string" == typeof e && e;
            if (x.isFunction(e)) return this.each(function(t) {
                x(this).removeClass(e.call(this, t, this.className))
            });
            if (u)
                for (t = (e || "").match(w) || []; a > s; s++)
                    if (n = this[s], r = 1 === n.nodeType && (n.className ?
                        (" " + n.className + " ").replace(W, " ") :
                        "")) {
                        o = 0;
                        while (i = t[o++])
                            while (r.indexOf(" " + i + " ") >= 0) r = r
                                .replace(" " + i + " ", " ");
                        n.className = e ? x.trim(r) : ""
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(
                e) : this.removeClass(e) : x.isFunction(e) ? this.each(
                function(n) {
                    x(this).toggleClass(e.call(this, n, this.className,
                        t), t)
                }) : this.each(function() {
                if ("string" === n) {
                    var t, i = 0,
                        o = x(this),
                        s = e.match(w) || [];
                    while (t = s[i++]) o.hasClass(t) ? o.removeClass(
                        t) : o.addClass(t)
                } else(n === r || "boolean" === n) && (this.className &&
                    q.set(this, "__className__", this.className),
                    this.className = this.className || e === !1 ?
                    "" : q.get(this, "__className__") || "")
            })
        },
        hasClass: function(e) {
            var t = " " + e + " ",
                n = 0,
                r = this.length;
            for (; r > n; n++)
                if (1 === this[n].nodeType && (" " + this[n].className +
                    " ").replace(W, " ").indexOf(t) >= 0) return !0;
            return !1
        },
        val: function(e) {
            var t, n, r, i = this[0]; {
                if (arguments.length) return r = x.isFunction(e), this.each(
                    function(n) {
                        var i;
                        1 === this.nodeType && (i = r ? e.call(this, n,
                                x(this).val()) : e, null == i ? i = "" :
                            "number" == typeof i ? i += "" : x.isArray(
                                i) && (i = x.map(i, function(e) {
                                return null == e ? "" : e + ""
                            })), t = x.valHooks[this.type] || x.valHooks[
                                this.nodeName.toLowerCase()], t &&
                            "set" in t && t.set(this, i, "value") !==
                            undefined || (this.value = i))
                    });
                if (i) return t = x.valHooks[i.type] || x.valHooks[i.nodeName
                    .toLowerCase()], t && "get" in t && (n = t.get(i,
                    "value")) !== undefined ? n : (n = i.value,
                    "string" == typeof n ? n.replace($, "") : null == n ?
                    "" : n)
            }
        }
    }), x.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = e.attributes.value;
                    return !t || t.specified ? e.value : e.text
                }
            },
            select: {
                get: function(e) {
                    var t, n, r = e.options,
                        i = e.selectedIndex,
                        o = "select-one" === e.type || 0 > i,
                        s = o ? null : [],
                        a = o ? i + 1 : r.length,
                        u = 0 > i ? a : o ? i : 0;
                    for (; a > u; u++)
                        if (n = r[u], !(!n.selected && u !== i || (x.support
                                .optDisabled ? n.disabled : null !==
                                n.getAttribute("disabled")) || n.parentNode
                            .disabled && x.nodeName(n.parentNode,
                                "optgroup"))) {
                            if (t = x(n).val(), o) return t;
                            s.push(t)
                        }
                    return s
                },
                set: function(e, t) {
                    var n, r, i = e.options,
                        o = x.makeArray(t),
                        s = i.length;
                    while (s--) r = i[s], (r.selected = x.inArray(x(r).val(),
                        o) >= 0) && (n = !0);
                    return n || (e.selectedIndex = -1), o
                }
            }
        },
        attr: function(e, t, n) {
            var i, o, s = e.nodeType;
            if (e && 3 !== s && 8 !== s && 2 !== s) return typeof e.getAttribute ===
                r ? x.prop(e, t, n) : (1 === s && x.isXMLDoc(e) || (t =
                        t.toLowerCase(), i = x.attrHooks[t] || (x.expr.match
                            .bool.test(t) ? M : R)), n === undefined ?
                    i && "get" in i && null !== (o = i.get(e, t)) ? o :
                    (o = x.find.attr(e, t), null == o ? undefined : o) :
                    null !== n ? i && "set" in i && (o = i.set(e, n, t)) !==
                    undefined ? o : (e.setAttribute(t, n + ""), n) : (x
                        .removeAttr(e, t), undefined))
        },
        removeAttr: function(e, t) {
            var n, r, i = 0,
                o = t && t.match(w);
            if (o && 1 === e.nodeType)
                while (n = o[i++]) r = x.propFix[n] || n, x.expr.match.bool
                    .test(n) && (e[r] = !1), e.removeAttribute(n)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!x.support.radioValue && "radio" === t && x.nodeName(
                        e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value =
                            n), t
                    }
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(e, t, n) {
            var r, i, o, s = e.nodeType;
            if (e && 3 !== s && 8 !== s && 2 !== s) return o = 1 !== s || !
                x.isXMLDoc(e), o && (t = x.propFix[t] || t, i = x.propHooks[
                    t]), n !== undefined ? i && "set" in i && (r = i.set(
                    e, n, t)) !== undefined ? r : e[t] = n : i && "get" in
                i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    return e.hasAttribute("tabindex") || B.test(e.nodeName) ||
                        e.href ? e.tabIndex : -1
                }
            }
        }
    }), M = {
        set: function(e, t, n) {
            return t === !1 ? x.removeAttr(e, n) : e.setAttribute(n, n), n
        }
    }, x.each(x.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = x.expr.attrHandle[t] || x.find.attr;
        x.expr.attrHandle[t] = function(e, t, r) {
            var i = x.expr.attrHandle[t],
                o = r ? undefined : (x.expr.attrHandle[t] = undefined) !=
                    n(e, t, r) ? t.toLowerCase() : null;
            return x.expr.attrHandle[t] = i, o
        }
    }), x.support.optSelected || (x.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex,
            null
        }
    }), x.each(["tabIndex", "readOnly", "maxLength", "cellSpacing",
        "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder",
        "contentEditable"], function() {
        x.propFix[this.toLowerCase()] = this
    }), x.each(["radio", "checkbox"], function() {
        x.valHooks[this] = {
            set: function(e, t) {
                return x.isArray(t) ? e.checked = x.inArray(x(e).val(),
                    t) >= 0 : undefined
            }
        }, x.support.checkOn || (x.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    });
    var I = /^key/,
        z = /^(?:mouse|contextmenu)|click/,
        _ = /^(?:focusinfocus|focusoutblur)$/,
        X = /^([^.]*)(?:\.(.+)|)$/;

    function U() {
        return !0
    }

    function Y() {
        return !1
    }

    function V() {
        try {
            return o.activeElement
        } catch (e) {}
    }
    x.event = {
        global: {},
        add: function(e, t, n, i, o) {
            var s, a, u, l, c, p, f, h, d, g, m, y = q.get(e);
            if (y) {
                n.handler && (s = n, n = s.handler, o = s.selector), n.guid ||
                    (n.guid = x.guid++), (l = y.events) || (l = y.events = {}), (
                    a = y.handle) || (a = y.handle = function(e) {
                    return typeof x === r || e && x.event.triggered ===
                        e.type ? undefined : x.event.dispatch.apply(a.elem,
                            arguments)
                }, a.elem = e), t = (t || "").match(w) || [""], c = t.length;
                while (c--) u = X.exec(t[c]) || [], d = m = u[1], g = (u[2] ||
                    "").split(".").sort(), d && (f = x.event.special[d] || {},
                    d = (o ? f.delegateType : f.bindType) || d, f = x.event
                    .special[d] || {}, p = x.extend({
                        type: d,
                        origType: m,
                        data: i,
                        handler: n,
                        guid: n.guid,
                        selector: o,
                        needsContext: o && x.expr.match.needsContext.test(
                            o),
                        namespace: g.join(".")
                    }, s), (h = l[d]) || (h = l[d] = [], h.delegateCount =
                        0, f.setup && f.setup.call(e, i, g, a) !== !1 || e.addEventListener &&
                        e.addEventListener(d, a, !1)), f.add && (f.add.call(
                        e, p), p.handler.guid || (p.handler.guid = n.guid)),
                    o ? h.splice(h.delegateCount++, 0, p) : h.push(p), x.event
                    .global[d] = !0);
                e = null
            }
        },
        remove: function(e, t, n, r, i) {
            var o, s, a, u, l, c, p, f, h, d, g, m = q.hasData(e) && q.get(
                    e);
            if (m && (u = m.events)) {
                t = (t || "").match(w) || [""], l = t.length;
                while (l--)
                    if (a = X.exec(t[l]) || [], h = g = a[1], d = (a[2] ||
                        "").split(".").sort(), h) {
                        p = x.event.special[h] || {}, h = (r ? p.delegateType :
                            p.bindType) || h, f = u[h] || [], a = a[2] &&
                            RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") +
                                "(\\.|$)"), s = o = f.length;
                        while (o--) c = f[o], !i && g !== c.origType || n &&
                            n.guid !== c.guid || a && !a.test(c.namespace) ||
                            r && r !== c.selector && ("**" !== r || !c.selector) ||
                            (f.splice(o, 1), c.selector && f.delegateCount--,
                            p.remove && p.remove.call(e, c));
                        s && !f.length && (p.teardown && p.teardown.call(e,
                            d, m.handle) !== !1 || x.removeEvent(e, h,
                            m.handle), delete u[h])
                    } else
                        for (h in u) x.event.remove(e, h + t[l], n, r, !0);
                x.isEmptyObject(u) && (delete m.handle, q.remove(e,
                    "events"))
            }
        },
        trigger: function(t, n, r, i) {
            var s, a, u, l, c, p, f, h = [r || o],
                d = y.call(t, "type") ? t.type : t,
                g = y.call(t, "namespace") ? t.namespace.split(".") : [];
            if (a = u = r = r || o, 3 !== r.nodeType && 8 !== r.nodeType && !
                _.test(d + x.event.triggered) && (d.indexOf(".") >= 0 && (g =
                        d.split("."), d = g.shift(), g.sort()), c = 0 > d.indexOf(
                        ":") && "on" + d, t = t[x.expando] ? t : new x.Event(
                        d, "object" == typeof t && t), t.isTrigger = i ? 2 :
                    3, t.namespace = g.join("."), t.namespace_re = t.namespace ?
                    RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)") :
                    null, t.result = undefined, t.target || (t.target = r),
                    n = null == n ? [t] : x.makeArray(n, [t]), f = x.event.special[
                        d] || {}, i || !f.trigger || f.trigger.apply(r, n) !== !
                    1)) {
                if (!i && !f.noBubble && !x.isWindow(r)) {
                    for (l = f.delegateType || d, _.test(l + d) || (a = a.parentNode); a; a =
                        a.parentNode) h.push(a), u = a;
                    u === (r.ownerDocument || o) && h.push(u.defaultView ||
                        u.parentWindow || e)
                }
                s = 0;
                while ((a = h[s++]) && !t.isPropagationStopped()) t.type =
                    s > 1 ? l : f.bindType || d, p = (q.get(a, "events") || {})[
                        t.type] && q.get(a, "handle"), p && p.apply(a, n),
                p = c && a[c], p && x.acceptData(a) && p.apply && p.apply(
                    a, n) === !1 && t.preventDefault();
                return t.type = d, i || t.isDefaultPrevented() || f._default &&
                    f._default.apply(h.pop(), n) !== !1 || !x.acceptData(r) ||
                    c && x.isFunction(r[d]) && !x.isWindow(r) && (u = r[c],
                        u && (r[c] = null), x.event.triggered = d, r[d](),
                        x.event.triggered = undefined, u && (r[c] = u)), t.result
            }
        },
        dispatch: function(e) {
            e = x.event.fix(e);
            var t, n, r, i, o, s = [],
                a = d.call(arguments),
                u = (q.get(this, "events") || {})[e.type] || [],
                l = x.event.special[e.type] || {};
            if (a[0] = e, e.delegateTarget = this, !l.preDispatch || l.preDispatch
                .call(this, e) !== !1) {
                s = x.event.handlers.call(this, e, u), t = 0;
                while ((i = s[t++]) && !e.isPropagationStopped()) {
                    e.currentTarget = i.elem, n = 0;
                    while ((o = i.handlers[n++]) && !e.isImmediatePropagationStopped())
                        (!e.namespace_re || e.namespace_re.test(o.namespace)) &&
                            (e.handleObj = o, e.data = o.data, r = ((x.event
                                    .special[o.origType] || {}).handle || o
                                .handler).apply(i.elem, a), r !== undefined &&
                            (e.result = r) === !1 && (e.preventDefault(), e
                                .stopPropagation()))
                }
                return l.postDispatch && l.postDispatch.call(this, e), e.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, s = [],
                a = t.delegateCount,
                u = e.target;
            if (a && u.nodeType && (!e.button || "click" !== e.type))
                for (; u !== this; u = u.parentNode || this)
                    if (u.disabled !== !0 || "click" !== e.type) {
                        for (r = [], n = 0; a > n; n++) o = t[n], i = o.selector +
                            " ", r[i] === undefined && (r[i] = o.needsContext ?
                                x(i, this).index(u) >= 0 : x.find(i, this,
                                    null, [u]).length), r[i] && r.push(o);
                        r.length && s.push({
                            elem: u,
                            handlers: r
                        })
                    }
            return t.length > a && s.push({
                elem: this,
                handlers: t.slice(a)
            }), s
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which"
            .split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t
                    .charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement"
                .split(" "),
            filter: function(e, t) {
                var n, r, i, s = t.button;
                return null == e.pageX && null != t.clientX && (n = e.target
                    .ownerDocument || o, r = n.documentElement, i = n.body,
                    e.pageX = t.clientX + (r && r.scrollLeft || i && i.scrollLeft ||
                        0) - (r && r.clientLeft || i && i.clientLeft || 0),
                    e.pageY = t.clientY + (r && r.scrollTop || i && i.scrollTop ||
                        0) - (r && r.clientTop || i && i.clientTop || 0)),
                e.which || s === undefined || (e.which = 1 & s ? 1 : 2 &
                    s ? 3 : 4 & s ? 2 : 0), e
            }
        },
        fix: function(e) {
            if (e[x.expando]) return e;
            var t, n, r, i = e.type,
                s = e,
                a = this.fixHooks[i];
            a || (this.fixHooks[i] = a = z.test(i) ? this.mouseHooks : I.test(
                i) ? this.keyHooks : {}), r = a.props ? this.props.concat(a
                .props) : this.props, e = new x.Event(s), t = r.length;
            while (t--) n = r[t], e[n] = s[n];
            return e.target || (e.target = o), 3 === e.target.nodeType && (
                e.target = e.target.parentNode), a.filter ? a.filter(e, s) :
                e
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    return this !== V() && this.focus ? (this.focus(), !1) :
                        undefined
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === V() && this.blur ? (this.blur(), !1) :
                        undefined
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return "checkbox" === this.type && this.click && x.nodeName(
                        this, "input") ? (this.click(), !1) : undefined
                },
                _default: function(e) {
                    return x.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    e.result !== undefined && (e.originalEvent.returnValue =
                        e.result)
                }
            }
        },
        simulate: function(e, t, n, r) {
            var i = x.extend(new x.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            r ? x.event.trigger(i, null, t) : x.event.dispatch.call(t, i),
            i.isDefaultPrevented() && n.preventDefault()
        }
    }, x.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    }, x.Event = function(e, t) {
        return this instanceof x.Event ? (e && e.type ? (this.originalEvent =
                e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented ||
                e.getPreventDefault && e.getPreventDefault() ? U : Y) :
            this.type = e, t && x.extend(this, t), this.timeStamp = e && e.timeStamp ||
            x.now(), this[x.expando] = !0, undefined) : new x.Event(e, t)
    }, x.Event.prototype = {
        isDefaultPrevented: Y,
        isPropagationStopped: Y,
        isImmediatePropagationStopped: Y,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = U, e && e.preventDefault && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = U, e && e.stopPropagation && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = U, this.stopPropagation()
        }
    }, x.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(e, t) {
        x.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, r = this,
                    i = e.relatedTarget,
                    o = e.handleObj;
                return (!i || i !== r && !x.contains(r, i)) && (e.type =
                    o.origType, n = o.handler.apply(this, arguments), e
                    .type = t), n
            }
        }
    }), x.support.focusinBubbles || x.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = 0,
            r = function(e) {
                x.event.simulate(t, e.target, x.event.fix(e), !0)
            };
        x.event.special[t] = {
            setup: function() {
                0 === n++ && o.addEventListener(e, r, !0)
            },
            teardown: function() {
                0 === --n && o.removeEventListener(e, r, !0)
            }
        }
    }), x.fn.extend({
        on: function(e, t, n, r, i) {
            var o, s;
            if ("object" == typeof e) {
                "string" != typeof t && (n = n || t, t = undefined);
                for (s in e) this.on(s, t, n, e[s], i);
                return this
            }
            if (null == n && null == r ? (r = t, n = t = undefined) :
                null == r && ("string" == typeof t ? (r = n, n =
                    undefined) : (r = n, n = t, t = undefined)), r === !
                1) r = Y;
            else if (!r) return this;
            return 1 === i && (o = r, r = function(e) {
                return x().off(e), o.apply(this, arguments)
            }, r.guid = o.guid || (o.guid = x.guid++)), this.each(
                function() {
                    x.event.add(this, e, r, n, t)
                })
        },
        one: function(e, t, n, r) {
            return this.on(e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj) return r = e.handleObj,
            x(e.delegateTarget).off(r.namespace ? r.origType + "." +
                r.namespace : r.origType, r.selector, r.handler),
            this;
            if ("object" == typeof e) {
                for (i in e) this.off(i, t, e[i]);
                return this
            }
            return (t === !1 || "function" == typeof t) && (n = t, t =
                undefined), n === !1 && (n = Y), this.each(function() {
                x.event.remove(this, e, n, t)
            })
        },
        trigger: function(e, t) {
            return this.each(function() {
                x.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            return n ? x.event.trigger(e, t, n, !0) : undefined
        }
    });
    var G = /^.[^:#\[\.,]*$/,
        J = /^(?:parents|prev(?:Until|All))/,
        Q = x.expr.match.needsContext,
        K = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    x.fn.extend({
        find: function(e) {
            var t, n = [],
                r = this,
                i = r.length;
            if ("string" != typeof e) return this.pushStack(x(e).filter(
                function() {
                    for (t = 0; i > t; t++)
                        if (x.contains(r[t], this)) return !0
                }));
            for (t = 0; i > t; t++) x.find(e, r[t], n);
            return n = this.pushStack(i > 1 ? x.unique(n) : n), n.selector =
                this.selector ? this.selector + " " + e : e, n
        },
        has: function(e) {
            var t = x(e, this),
                n = t.length;
            return this.filter(function() {
                var e = 0;
                for (; n > e; e++)
                    if (x.contains(this, t[e])) return !0
            })
        },
        not: function(e) {
            return this.pushStack(et(this, e || [], !0))
        },
        filter: function(e) {
            return this.pushStack(et(this, e || [], !1))
        },
        is: function(e) {
            return !!et(this, "string" == typeof e && Q.test(e) ? x(e) :
                e || [], !1).length
        },
        closest: function(e, t) {
            var n, r = 0,
                i = this.length,
                o = [],
                s = Q.test(e) || "string" != typeof e ? x(e, t || this.context) :
                    0;
            for (; i > r; r++)
                for (n = this[r]; n && n !== t; n = n.parentNode)
                    if (11 > n.nodeType && (s ? s.index(n) > -1 : 1 ===
                        n.nodeType && x.find.matchesSelector(n, e))) {
                        n = o.push(n);
                        break
                    }
            return this.pushStack(o.length > 1 ? x.unique(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? g.call(x(e), this[0]) : g
                .call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ?
                this.first().prevAll().length : -1
        },
        add: function(e, t) {
            var n = "string" == typeof e ? x(e, t) : x.makeArray(e && e
                .nodeType ? [e] : e),
                r = x.merge(this.get(), n);
            return this.pushStack(x.unique(r))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject
                .filter(e))
        }
    });

    function Z(e, t) {
        while ((e = e[t]) && 1 !== e.nodeType);
        return e
    }
    x.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return x.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return x.dir(e, "parentNode", n)
        },
        next: function(e) {
            return Z(e, "nextSibling")
        },
        prev: function(e) {
            return Z(e, "previousSibling")
        },
        nextAll: function(e) {
            return x.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return x.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return x.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return x.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return x.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return x.sibling(e.firstChild)
        },
        contents: function(e) {
            return e.contentDocument || x.merge([], e.childNodes)
        }
    }, function(e, t) {
        x.fn[e] = function(n, r) {
            var i = x.map(this, t, n);
            return "Until" !== e.slice(-5) && (r = n), r && "string" ==
                typeof r && (i = x.filter(r, i)), this.length > 1 && (K[
                    e] || x.unique(i), J.test(e) && i.reverse()), this.pushStack(
                    i)
        }
    }), x.extend({
        filter: function(e, t, n) {
            var r = t[0];
            return n && (e = ":not(" + e + ")"), 1 === t.length && 1 ===
                r.nodeType ? x.find.matchesSelector(r, e) ? [r] : [] :
                x.find.matches(e, x.grep(t, function(e) {
                    return 1 === e.nodeType
                }))
        },
        dir: function(e, t, n) {
            var r = [],
                i = n !== undefined;
            while ((e = e[t]) && 9 !== e.nodeType)
                if (1 === e.nodeType) {
                    if (i && x(e).is(n)) break;
                    r.push(e)
                }
            return r
        },
        sibling: function(e, t) {
            var n = [];
            for (; e; e = e.nextSibling) 1 === e.nodeType && e !== t &&
                n.push(e);
            return n
        }
    });

    function et(e, t, n) {
        if (x.isFunction(t)) return x.grep(e, function(e, r) {
            return !!t.call(e, r, e) !== n
        });
        if (t.nodeType) return x.grep(e, function(e) {
            return e === t !== n
        });
        if ("string" == typeof t) {
            if (G.test(t)) return x.filter(t, e, n);
            t = x.filter(t, e)
        }
        return x.grep(e, function(e) {
            return g.call(t, e) >= 0 !== n
        })
    }
    var tt =
        /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        nt = /<([\w:]+)/,
        rt = /<|&#?\w+;/,
        it = /<(?:script|style|link)/i,
        ot = /^(?:checkbox|radio)$/i,
        st = /checked\s*(?:[^=]|=\s*.checked.)/i,
        at = /^$|\/(?:java|ecma)script/i,
        ut = /^true\/(.*)/,
        lt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        ct = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
    ct.optgroup = ct.option, ct.tbody = ct.tfoot = ct.colgroup = ct.caption =
        ct.thead, ct.th = ct.td, x.fn.extend({
            text: function(e) {
                return x.access(this, function(e) {
                    return e === undefined ? x.text(this) : this.empty()
                        .append((this[0] && this[0].ownerDocument ||
                            o).createTextNode(e))
                }, null, e, arguments.length)
            },
            append: function() {
                return this.domManip(arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType ||
                        9 === this.nodeType) {
                        var t = pt(this, e);
                        t.appendChild(e)
                    }
                })
            },
            prepend: function() {
                return this.domManip(arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType ||
                        9 === this.nodeType) {
                        var t = pt(this, e);
                        t.insertBefore(e, t.firstChild)
                    }
                })
            },
            before: function() {
                return this.domManip(arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(
                        e, this)
                })
            },
            after: function() {
                return this.domManip(arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(
                        e, this.nextSibling)
                })
            },
            remove: function(e, t) {
                var n, r = e ? x.filter(e, this) : this,
                    i = 0;
                for (; null != (n = r[i]); i++) t || 1 !== n.nodeType ||
                    x.cleanData(mt(n)), n.parentNode && (t && x.contains(
                            n.ownerDocument, n) && dt(mt(n, "script")),
                        n.parentNode.removeChild(n));
                return this
            },
            empty: function() {
                var e, t = 0;
                for (; null != (e = this[t]); t++) 1 === e.nodeType &&
                    (x.cleanData(mt(e, !1)), e.textContent = "");
                return this
            },
            clone: function(e, t) {
                return e = null == e ? !1 : e, t = null == t ? e : t,
                this.map(function() {
                    return x.clone(this, e, t)
                })
            },
            html: function(e) {
                return x.access(this, function(e) {
                    var t = this[0] || {}, n = 0,
                        r = this.length;
                    if (e === undefined && 1 === t.nodeType) return t
                        .innerHTML;
                    if ("string" == typeof e && !it.test(e) && !ct[
                        (nt.exec(e) || ["", ""])[1].toLowerCase()
                        ]) {
                        e = e.replace(tt, "<$1></$2>");
                        try {
                            for (; r > n; n++) t = this[n] || {}, 1 ===
                                t.nodeType && (x.cleanData(mt(t, !1)),
                                    t.innerHTML = e);
                            t = 0
                        } catch (i) {}
                    }
                    t && this.empty().append(e)
                }, null, e, arguments.length)
            },
            replaceWith: function() {
                var e = x.map(this, function(e) {
                    return [e.nextSibling, e.parentNode]
                }),
                    t = 0;
                return this.domManip(arguments, function(n) {
                    var r = e[t++],
                        i = e[t++];
                    i && (r && r.parentNode !== i && (r = this.nextSibling),
                        x(this).remove(), i.insertBefore(n, r))
                }, !0), t ? this : this.remove()
            },
            detach: function(e) {
                return this.remove(e, !0)
            },
            domManip: function(e, t, n) {
                e = f.apply([], e);
                var r, i, o, s, a, u, l = 0,
                    c = this.length,
                    p = this,
                    h = c - 1,
                    d = e[0],
                    g = x.isFunction(d);
                if (g || !(1 >= c || "string" != typeof d || x.support.checkClone) &&
                    st.test(d)) return this.each(function(r) {
                    var i = p.eq(r);
                    g && (e[0] = d.call(this, r, i.html())), i.domManip(
                        e, t, n)
                });
                if (c && (r = x.buildFragment(e, this[0].ownerDocument, !
                        1, !n && this), i = r.firstChild, 1 === r.childNodes
                    .length && (r = i), i)) {
                    for (o = x.map(mt(r, "script"), ft), s = o.length; c >
                        l; l++) a = r, l !== h && (a = x.clone(a, !0, !
                        0), s && x.merge(o, mt(a, "script"))), t.call(
                        this[l], a, l);
                    if (s)
                        for (u = o[o.length - 1].ownerDocument, x.map(o,
                            ht), l = 0; s > l; l++) a = o[l], at.test(a
                            .type || "") && !q.access(a, "globalEval") &&
                            x.contains(u, a) && (a.src ? x._evalUrl(a.src) :
                                x.globalEval(a.textContent.replace(lt,
                                    "")))
                }
                return this
            }
        }), x.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(e, t) {
            x.fn[e] = function(e) {
                var n, r = [],
                    i = x(e),
                    o = i.length - 1,
                    s = 0;
                for (; o >= s; s++) n = s === o ? this : this.clone(!0),
                x(i[s])[t](n), h.apply(r, n.get());
                return this.pushStack(r)
            }
        }), x.extend({
            clone: function(e, t, n) {
                var r, i, o, s, a = e.cloneNode(!0),
                    u = x.contains(e.ownerDocument, e);
                if (!(x.support.noCloneChecked || 1 !== e.nodeType &&
                    11 !== e.nodeType || x.isXMLDoc(e)))
                    for (s = mt(a), o = mt(e), r = 0, i = o.length; i >
                        r; r++) yt(o[r], s[r]);
                if (t)
                    if (n)
                        for (o = o || mt(e), s = s || mt(a), r = 0, i =
                            o.length; i > r; r++) gt(o[r], s[r]);
                    else gt(e, a);
                return s = mt(a, "script"), s.length > 0 && dt(s, !u &&
                    mt(e, "script")), a
            },
            buildFragment: function(e, t, n, r) {
                var i, o, s, a, u, l, c = 0,
                    p = e.length,
                    f = t.createDocumentFragment(),
                    h = [];
                for (; p > c; c++)
                    if (i = e[c], i || 0 === i)
                        if ("object" === x.type(i)) x.merge(h, i.nodeType ? [
                            i] : i);
                        else if (rt.test(i)) {
                    o = o || f.appendChild(t.createElement("div")), s =
                        (nt.exec(i) || ["", ""])[1].toLowerCase(), a =
                        ct[s] || ct._default, o.innerHTML = a[1] + i.replace(
                            tt, "<$1></$2>") + a[2], l = a[0];
                    while (l--) o = o.lastChild;
                    x.merge(h, o.childNodes), o = f.firstChild, o.textContent =
                        ""
                } else h.push(t.createTextNode(i));
                f.textContent = "", c = 0;
                while (i = h[c++])
                    if ((!r || -1 === x.inArray(i, r)) && (u = x.contains(
                        i.ownerDocument, i), o = mt(f.appendChild(
                        i), "script"), u && dt(o), n)) {
                        l = 0;
                        while (i = o[l++]) at.test(i.type || "") && n.push(
                            i)
                    }
                return f
            },
            cleanData: function(e) {
                var t, n, r, i, o, s, a = x.event.special,
                    u = 0;
                for (;
                    (n = e[u]) !== undefined; u++) {
                    if (F.accepts(n) && (o = n[q.expando], o && (t = q.cache[
                        o]))) {
                        if (r = Object.keys(t.events || {}), r.length)
                            for (s = 0;
                                (i = r[s]) !== undefined; s++) a[i] ? x
                                .event.remove(n, i) : x.removeEvent(n,
                                    i, t.handle);
                        q.cache[o] && delete q.cache[o]
                    }
                    delete L.cache[n[L.expando]]
                }
            },
            _evalUrl: function(e) {
                return x.ajax({
                    url: e,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    "throws": !0
                })
            }
        });

    function pt(e, t) {
        return x.nodeName(e, "table") && x.nodeName(1 === t.nodeType ? t :
            t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(
            e.ownerDocument.createElement("tbody")) : e
    }

    function ft(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
    }

    function ht(e) {
        var t = ut.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function dt(e, t) {
        var n = e.length,
            r = 0;
        for (; n > r; r++) q.set(e[r], "globalEval", !t || q.get(t[r],
            "globalEval"))
    }

    function gt(e, t) {
        var n, r, i, o, s, a, u, l;
        if (1 === t.nodeType) {
            if (q.hasData(e) && (o = q.access(e), s = q.set(t, o), l = o.events)) {
                delete s.handle, s.events = {};
                for (i in l)
                    for (n = 0, r = l[i].length; r > n; n++) x.event.add(t,
                        i, l[i][n])
            }
            L.hasData(e) && (a = L.access(e), u = x.extend({}, a), L.set(t,
                u))
        }
    }

    function mt(e, t) {
        var n = e.getElementsByTagName ? e.getElementsByTagName(t || "*") :
            e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
        return t === undefined || t && x.nodeName(e, t) ? x.merge([e], n) :
            n
    }

    function yt(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && ot.test(e.type) ? t.checked = e.checked : ("input" ===
            n || "textarea" === n) && (t.defaultValue = e.defaultValue)
    }
    x.fn.extend({
        wrapAll: function(e) {
            var t;
            return x.isFunction(e) ? this.each(function(t) {
                x(this).wrapAll(e.call(this, t))
            }) : (this[0] && (t = x(e, this[0].ownerDocument).eq(0).clone(!
                    0), this[0].parentNode && t.insertBefore(this[0]),
                t.map(function() {
                    var e = this;
                    while (e.firstElementChild) e = e.firstElementChild;
                    return e
                }).append(this)), this)
        },
        wrapInner: function(e) {
            return x.isFunction(e) ? this.each(function(t) {
                x(this).wrapInner(e.call(this, t))
            }) : this.each(function() {
                var t = x(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = x.isFunction(e);
            return this.each(function(n) {
                x(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                x.nodeName(this, "body") || x(this).replaceWith(
                    this.childNodes)
            }).end()
        }
    });
    var vt, xt, bt = /^(none|table(?!-c[ea]).+)/,
        wt = /^margin/,
        Tt = RegExp("^(" + b + ")(.*)$", "i"),
        Ct = RegExp("^(" + b + ")(?!px)[a-z%]+$", "i"),
        kt = RegExp("^([+-])=(" + b + ")", "i"),
        Nt = {
            BODY: "block"
        }, Et = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        }, St = {
            letterSpacing: 0,
            fontWeight: 400
        }, jt = ["Top", "Right", "Bottom", "Left"],
        Dt = ["Webkit", "O", "Moz", "ms"];

    function At(e, t) {
        if (t in e) return t;
        var n = t.charAt(0).toUpperCase() + t.slice(1),
            r = t,
            i = Dt.length;
        while (i--)
            if (t = Dt[i] + n, t in e) return t;
        return r
    }

    function Lt(e, t) {
        return e = t || e, "none" === x.css(e, "display") || !x.contains(e.ownerDocument,
            e)
    }

    function qt(t) {
        return e.getComputedStyle(t, null)
    }

    function Ht(e, t) {
        var n, r, i, o = [],
            s = 0,
            a = e.length;
        for (; a > s; s++) r = e[s], r.style && (o[s] = q.get(r,
                "olddisplay"), n = r.style.display, t ? (o[s] || "none" !==
                n || (r.style.display = ""), "" === r.style.display && Lt(r) &&
                (o[s] = q.access(r, "olddisplay", Rt(r.nodeName)))) : o[s] ||
            (i = Lt(r), (n && "none" !== n || !i) && q.set(r, "olddisplay",
                i ? n : x.css(r, "display"))));
        for (s = 0; a > s; s++) r = e[s], r.style && (t && "none" !== r.style
            .display && "" !== r.style.display || (r.style.display = t ? o[
                s] || "" : "none"));
        return e
    }
    x.fn.extend({
        css: function(e, t) {
            return x.access(this, function(e, t, n) {
                var r, i, o = {}, s = 0;
                if (x.isArray(t)) {
                    for (r = qt(e), i = t.length; i > s; s++) o[t[s]] =
                        x.css(e, t[s], !1, r);
                    return o
                }
                return n !== undefined ? x.style(e, t, n) : x.css(e,
                    t)
            }, e, t, arguments.length > 1)
        },
        show: function() {
            return Ht(this, !0)
        },
        hide: function() {
            return Ht(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() :
                this.each(function() {
                    Lt(this) ? x(this).show() : x(this).hide()
                })
        }
    }), x.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = vt(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": "cssFloat"
        },
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, s, a = x.camelCase(t),
                    u = e.style;
                return t = x.cssProps[a] || (x.cssProps[a] = At(u, a)),
                s = x.cssHooks[t] || x.cssHooks[a], n === undefined ?
                    s && "get" in s && (i = s.get(e, !1, r)) !==
                    undefined ? i : u[t] : (o = typeof n, "string" ===
                        o && (i = kt.exec(n)) && (n = (i[1] + 1) * i[2] +
                            parseFloat(x.css(e, t)), o = "number"),
                        null == n || "number" === o && isNaN(n) || (
                            "number" !== o || x.cssNumber[a] || (n +=
                                "px"), x.support.clearCloneStyle || "" !==
                            n || 0 !== t.indexOf("background") || (u[t] =
                                "inherit"), s && "set" in s && (n = s.set(
                                e, n, r)) === undefined || (u[t] = n)),
                        undefined)
            }
        },
        css: function(e, t, n, r) {
            var i, o, s, a = x.camelCase(t);
            return t = x.cssProps[a] || (x.cssProps[a] = At(e.style, a)),
            s = x.cssHooks[t] || x.cssHooks[a], s && "get" in s &&
                (i = s.get(e, !0, n)), i === undefined && (i = vt(e, t,
                r)), "normal" === i && t in St && (i = St[t]), "" ===
                n || n ? (o = parseFloat(i), n === !0 || x.isNumeric(o) ?
                    o || 0 : i) : i
        }
    }), vt = function(e, t, n) {
        var r, i, o, s = n || qt(e),
            a = s ? s.getPropertyValue(t) || s[t] : undefined,
            u = e.style;
        return s && ("" !== a || x.contains(e.ownerDocument, e) || (a = x.style(
            e, t)), Ct.test(a) && wt.test(t) && (r = u.width, i = u.minWidth,
            o = u.maxWidth, u.minWidth = u.maxWidth = u.width = a, a =
            s.width, u.width = r, u.minWidth = i, u.maxWidth = o)), a
    };

    function Ot(e, t, n) {
        var r = Tt.exec(t);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
    }

    function Ft(e, t, n, r, i) {
        var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 :
            0,
            s = 0;
        for (; 4 > o; o += 2) "margin" === n && (s += x.css(e, n + jt[o], !
            0, i)), r ? ("content" === n && (s -= x.css(e, "padding" + jt[o], !
            0, i)), "margin" !== n && (s -= x.css(e, "border" + jt[o] +
            "Width", !0, i))) : (s += x.css(e, "padding" + jt[o], !0, i),
            "padding" !== n && (s += x.css(e, "border" + jt[o] + "Width", !
                0, i)));
        return s
    }

    function Pt(e, t, n) {
        var r = !0,
            i = "width" === t ? e.offsetWidth : e.offsetHeight,
            o = qt(e),
            s = x.support.boxSizing && "border-box" === x.css(e,
                "boxSizing", !1, o);
        if (0 >= i || null == i) {
            if (i = vt(e, t, o), (0 > i || null == i) && (i = e.style[t]),
                Ct.test(i)) return i;
            r = s && (x.support.boxSizingReliable || i === e.style[t]), i =
                parseFloat(i) || 0
        }
        return i + Ft(e, t, n || (s ? "border" : "content"), r, o) + "px"
    }

    function Rt(e) {
        var t = o,
            n = Nt[e];
        return n || (n = Mt(e, t), "none" !== n && n || (xt = (xt || x(
                "<iframe frameborder='0' width='0' height='0'/>").css(
                "cssText", "display:block !important")).appendTo(t.documentElement),
            t = (xt[0].contentWindow || xt[0].contentDocument).document,
            t.write("<!doctype html><html><body>"), t.close(), n = Mt(e,
                t), xt.detach()), Nt[e] = n), n
    }

    function Mt(e, t) {
        var n = x(t.createElement(e)).appendTo(t.body),
            r = x.css(n[0], "display");
        return n.remove(), r
    }
    x.each(["height", "width"], function(e, t) {
        x.cssHooks[t] = {
            get: function(e, n, r) {
                return n ? 0 === e.offsetWidth && bt.test(x.css(e,
                    "display")) ? x.swap(e, Et, function() {
                    return Pt(e, t, r)
                }) : Pt(e, t, r) : undefined
            },
            set: function(e, n, r) {
                var i = r && qt(e);
                return Ot(e, n, r ? Ft(e, t, r, x.support.boxSizing &&
                    "border-box" === x.css(e, "boxSizing", !1, i),
                    i) : 0)
            }
        }
    }), x(function() {
        x.support.reliableMarginRight || (x.cssHooks.marginRight = {
            get: function(e, t) {
                return t ? x.swap(e, {
                    display: "inline-block"
                }, vt, [e, "marginRight"]) : undefined
            }
        }), !x.support.pixelPosition && x.fn.position && x.each(["top",
            "left"], function(e, t) {
            x.cssHooks[t] = {
                get: function(e, n) {
                    return n ? (n = vt(e, t), Ct.test(n) ? x(e).position()[
                        t] + "px" : n) : undefined
                }
            }
        })
    }), x.expr && x.expr.filters && (x.expr.filters.hidden = function(e) {
        return 0 >= e.offsetWidth && 0 >= e.offsetHeight
    }, x.expr.filters.visible = function(e) {
        return !x.expr.filters.hidden(e)
    }), x.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        x.cssHooks[e + t] = {
            expand: function(n) {
                var r = 0,
                    i = {}, o = "string" == typeof n ? n.split(" ") : [
                        n];
                for (; 4 > r; r++) i[e + jt[r] + t] = o[r] || o[r - 2] ||
                    o[0];
                return i
            }
        }, wt.test(e) || (x.cssHooks[e + t].set = Ot)
    });
    var Wt = /%20/g,
        $t = /\[\]$/,
        Bt = /\r?\n/g,
        It = /^(?:submit|button|image|reset|file)$/i,
        zt = /^(?:input|select|textarea|keygen)/i;
    x.fn.extend({
        serialize: function() {
            return x.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = x.prop(this, "elements");
                return e ? x.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !x(this).is(":disabled") && zt.test(
                    this.nodeName) && !It.test(e) && (this.checked || !
                    ot.test(e))
            }).map(function(e, t) {
                var n = x(this).val();
                return null == n ? null : x.isArray(n) ? x.map(n,
                    function(e) {
                        return {
                            name: t.name,
                            value: e.replace(Bt, "\r\n")
                        }
                    }) : {
                    name: t.name,
                    value: n.replace(Bt, "\r\n")
                }
            }).get()
        }
    }), x.param = function(e, t) {
        var n, r = [],
            i = function(e, t) {
                t = x.isFunction(t) ? t() : null == t ? "" : t, r[r.length] =
                    encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        if (t === undefined && (t = x.ajaxSettings && x.ajaxSettings.traditional),
            x.isArray(e) || e.jquery && !x.isPlainObject(e)) x.each(e,
            function() {
                i(this.name, this.value)
            });
        else
            for (n in e) _t(n, e[n], t, i);
        return r.join("&").replace(Wt, "+")
    };

    function _t(e, t, n, r) {
        var i;
        if (x.isArray(t)) x.each(t, function(t, i) {
            n || $t.test(e) ? r(e, i) : _t(e + "[" + ("object" ==
                typeof i ? t : "") + "]", i, n, r)
        });
        else if (n || "object" !== x.type(t)) r(e, t);
        else
            for (i in t) _t(e + "[" + i + "]", t[i], n, r)
    }
    x.each(
        "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu"
        .split(" "), function(e, t) {
            x.fn[t] = function(e, n) {
                return arguments.length > 0 ? this.on(t, null, e, n) : this
                    .trigger(t)
            }
        }), x.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        },
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(
                t, e || "**", n)
        }
    });
    var Xt, Ut, Yt = x.now(),
        Vt = /\?/,
        Gt = /#.*$/,
        Jt = /([?&])_=[^&]*/,
        Qt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        Kt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Zt = /^(?:GET|HEAD)$/,
        en = /^\/\//,
        tn = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        nn = x.fn.load,
        rn = {}, on = {}, sn = "*/".concat("*");
    try {
        Ut = i.href
    } catch (an) {
        Ut = o.createElement("a"), Ut.href = "", Ut = Ut.href
    }
    Xt = tn.exec(Ut.toLowerCase()) || [];

    function un(e) {
        return function(t, n) {
            "string" != typeof t && (n = t, t = "*");
            var r, i = 0,
                o = t.toLowerCase().match(w) || [];
            if (x.isFunction(n))
                while (r = o[i++]) "+" === r[0] ? (r = r.slice(1) || "*", (
                    e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(
                    n)
        }
    }

    function ln(e, t, n, r) {
        var i = {}, o = e === on;

        function s(a) {
            var u;
            return i[a] = !0, x.each(e[a] || [], function(e, a) {
                var l = a(t, n, r);
                return "string" != typeof l || o || i[l] ? o ? !(u = l) :
                    undefined : (t.dataTypes.unshift(l), s(l), !1)
            }), u
        }
        return s(t.dataTypes[0]) || !i["*"] && s("*")
    }

    function cn(e, t) {
        var n, r, i = x.ajaxSettings.flatOptions || {};
        for (n in t) t[n] !== undefined && ((i[n] ? e : r || (r = {}))[n] =
            t[n]);
        return r && x.extend(!0, e, r), e
    }
    x.fn.load = function(e, t, n) {
        if ("string" != typeof e && nn) return nn.apply(this, arguments);
        var r, i, o, s = this,
            a = e.indexOf(" ");
        return a >= 0 && (r = e.slice(a), e = e.slice(0, a)), x.isFunction(
            t) ? (n = t, t = undefined) : t && "object" == typeof t && (i =
            "POST"), s.length > 0 && x.ajax({
            url: e,
            type: i,
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments, s.html(r ? x("<div>").append(x.parseHTML(e))
                .find(r) : e)
        }).complete(n && function(e, t) {
            s.each(n, o || [e.responseText, t, e])
        }), this
    }, x.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError",
        "ajaxSuccess", "ajaxSend"], function(e, t) {
        x.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), x.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Ut,
            type: "GET",
            isLocal: Kt.test(Xt[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": sn,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": x.parseJSON,
                "text xml": x.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? cn(cn(e, x.ajaxSettings), t) : cn(x.ajaxSettings,
                e)
        },
        ajaxPrefilter: un(rn),
        ajaxTransport: un(on),
        ajax: function(e, t) {
            "object" == typeof e && (t = e, e = undefined), t = t || {};
            var n, r, i, o, s, a, u, l, c = x.ajaxSetup({}, t),
                p = c.context || c,
                f = c.context && (p.nodeType || p.jquery) ? x(p) : x.event,
                h = x.Deferred(),
                d = x.Callbacks("once memory"),
                g = c.statusCode || {}, m = {}, y = {}, v = 0,
                b = "canceled",
                T = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === v) {
                            if (!o) {
                                o = {};
                                while (t = Qt.exec(i)) o[t[1].toLowerCase()] =
                                    t[2]
                            }
                            t = o[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return 2 === v ? i : null
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return v || (e = y[n] = y[n] || e, m[e] = t),
                        this
                    },
                    overrideMimeType: function(e) {
                        return v || (c.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (2 > v)
                                for (t in e) g[t] = [g[t], e[t]];
                            else T.always(e[T.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || b;
                        return n && n.abort(t), k(0, t), this
                    }
                };
            if (h.promise(T).complete = d.add, T.success = T.done, T.error =
                T.fail, c.url = ((e || c.url || Ut) + "").replace(Gt,
                    "").replace(en, Xt[1] + "//"), c.type = t.method ||
                t.type || c.method || c.type, c.dataTypes = x.trim(c.dataType ||
                    "*").toLowerCase().match(w) || [""], null == c.crossDomain &&
                (a = tn.exec(c.url.toLowerCase()), c.crossDomain = !(!a ||
                    a[1] === Xt[1] && a[2] === Xt[2] && (a[3] || (
                        "http:" === a[1] ? "80" : "443")) === (Xt[3] ||
                        ("http:" === Xt[1] ? "80" : "443")))), c.data &&
                c.processData && "string" != typeof c.data && (c.data =
                    x.param(c.data, c.traditional)), ln(rn, c, t, T), 2 ===
                v) return T;
            u = c.global, u && 0 === x.active++ && x.event.trigger(
                "ajaxStart"), c.type = c.type.toUpperCase(), c.hasContent = !
                Zt.test(c.type), r = c.url, c.hasContent || (c.data &&
                    (r = c.url += (Vt.test(r) ? "&" : "?") + c.data,
                        delete c.data), c.cache === !1 && (c.url = Jt.test(
                        r) ? r.replace(Jt, "$1_=" + Yt++) : r + (Vt
                        .test(r) ? "&" : "?") + "_=" + Yt++)), c.ifModified &&
                (x.lastModified[r] && T.setRequestHeader(
                    "If-Modified-Since", x.lastModified[r]), x.etag[r] &&
                T.setRequestHeader("If-None-Match", x.etag[r])), (c.data &&
                    c.hasContent && c.contentType !== !1 || t.contentType
            ) && T.setRequestHeader("Content-Type", c.contentType), T.setRequestHeader(
                "Accept", c.dataTypes[0] && c.accepts[c.dataTypes[0]] ?
                c.accepts[c.dataTypes[0]] + ("*" !== c.dataTypes[0] ?
                    ", " + sn + "; q=0.01" : "") : c.accepts["*"]);
            for (l in c.headers) T.setRequestHeader(l, c.headers[l]);
            if (c.beforeSend && (c.beforeSend.call(p, T, c) === !1 || 2 ===
                v)) return T.abort();
            b = "abort";
            for (l in {
                success: 1,
                error: 1,
                complete: 1
            }) T[l](c[l]);
            if (n = ln(on, c, t, T)) {
                T.readyState = 1, u && f.trigger("ajaxSend", [T, c]), c
                    .async && c.timeout > 0 && (s = setTimeout(function() {
                        T.abort("timeout")
                    }, c.timeout));
                try {
                    v = 1, n.send(m, k)
                } catch (C) {
                    if (!(2 > v)) throw C;
                    k(-1, C)
                }
            } else k(-1, "No Transport");

            function k(e, t, o, a) {
                var l, m, y, b, w, C = t;
                2 !== v && (v = 2, s && clearTimeout(s), n = undefined,
                    i = a || "", T.readyState = e > 0 ? 4 : 0, l = e >=
                    200 && 300 > e || 304 === e, o && (b = pn(c, T, o)),
                    b = fn(c, b, T, l), l ? (c.ifModified && (w = T.getResponseHeader(
                                "Last-Modified"), w && (x.lastModified[
                                r] = w), w = T.getResponseHeader("etag"),
                            w && (x.etag[r] = w)), 204 === e || "HEAD" ===
                        c.type ? C = "nocontent" : 304 === e ? C =
                        "notmodified" : (C = b.state, m = b.data, y = b
                            .error, l = !y)) : (y = C, (e || !C) && (C =
                        "error", 0 > e && (e = 0))), T.status = e, T.statusText =
                    (t || C) + "", l ? h.resolveWith(p, [m, C, T]) : h.rejectWith(
                        p, [T, C, y]), T.statusCode(g), g = undefined,
                    u && f.trigger(l ? "ajaxSuccess" : "ajaxError", [T,
                        c, l ? m : y]), d.fireWith(p, [T, C]), u && (f.trigger(
                            "ajaxComplete", [T, c]), --x.active || x.event
                        .trigger("ajaxStop")))
            }
            return T
        },
        getJSON: function(e, t, n) {
            return x.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return x.get(e, undefined, t, "script")
        }
    }), x.each(["get", "post"], function(e, t) {
        x[t] = function(e, n, r, i) {
            return x.isFunction(n) && (i = i || r, r = n, n = undefined),
            x.ajax({
                url: e,
                type: t,
                dataType: i,
                data: n,
                success: r
            })
        }
    });

    function pn(e, t, n) {
        var r, i, o, s, a = e.contents,
            u = e.dataTypes;
        while ("*" === u[0]) u.shift(), r === undefined && (r = e.mimeType ||
            t.getResponseHeader("Content-Type"));
        if (r)
            for (i in a)
                if (a[i] && a[i].test(r)) {
                    u.unshift(i);
                    break
                }
        if (u[0] in n) o = u[0];
        else {
            for (i in n) {
                if (!u[0] || e.converters[i + " " + u[0]]) {
                    o = i;
                    break
                }
                s || (s = i)
            }
            o = o || s
        }
        return o ? (o !== u[0] && u.unshift(o), n[o]) : undefined
    }

    function fn(e, t, n, r) {
        var i, o, s, a, u, l = {}, c = e.dataTypes.slice();
        if (c[1])
            for (s in e.converters) l[s.toLowerCase()] = e.converters[s];
        o = c.shift();
        while (o)
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !u &&
                r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), u =
                o, o = c.shift())
                if ("*" === o) o = u;
                else if ("*" !== u && u !== o) {
            if (s = l[u + " " + o] || l["* " + o], !s)
                for (i in l)
                    if (a = i.split(" "), a[1] === o && (s = l[u + " " + a[
                        0]] || l["* " + a[0]])) {
                        s === !0 ? s = l[i] : l[i] !== !0 && (o = a[0], c.unshift(
                            a[1]));
                        break
                    }
            if (s !== !0)
                if (s && e["throws"]) t = s(t);
                else try {
                    t = s(t)
                } catch (p) {
                    return {
                        state: "parsererror",
                        error: s ? p : "No conversion from " + u + " to " +
                            o
                    }
                }
        }
        return {
            state: "success",
            data: t
        }
    }
    x.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                return x.globalEval(e), e
            }
        }
    }), x.ajaxPrefilter("script", function(e) {
        e.cache === undefined && (e.cache = !1), e.crossDomain && (e.type =
            "GET")
    }), x.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, n;
            return {
                send: function(r, i) {
                    t = x("<script>").prop({
                        async: !0,
                        charset: e.scriptCharset,
                        src: e.url
                    }).on("load error", n = function(e) {
                        t.remove(), n = null, e && i("error" === e.type ?
                            404 : 200, e.type)
                    }), o.head.appendChild(t[0])
                },
                abort: function() {
                    n && n()
                }
            }
        }
    });
    var hn = [],
        dn = /(=)\?(?=&|$)|\?\?/;
    x.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = hn.pop() || x.expando + "_" + Yt++;
            return this[e] = !0, e
        }
    }), x.ajaxPrefilter("json jsonp", function(t, n, r) {
        var i, o, s, a = t.jsonp !== !1 && (dn.test(t.url) ? "url" :
                "string" == typeof t.data && !(t.contentType || "").indexOf(
                    "application/x-www-form-urlencoded") && dn.test(t.data) &&
                "data");
        return a || "jsonp" === t.dataTypes[0] ? (i = t.jsonpCallback =
            x.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
            a ? t[a] = t[a].replace(dn, "$1" + i) : t.jsonp !== !1 && (
                t.url += (Vt.test(t.url) ? "&" : "?") + t.jsonp + "=" +
                i), t.converters["script json"] = function() {
                return s || x.error(i + " was not called"), s[0]
            }, t.dataTypes[0] = "json", o = e[i], e[i] = function() {
                s = arguments
            }, r.always(function() {
                e[i] = o, t[i] && (t.jsonpCallback = n.jsonpCallback,
                    hn.push(i)), s && x.isFunction(o) && o(s[0]), s =
                    o = undefined
            }), "script") : undefined
    }), x.ajaxSettings.xhr = function() {
        try {
            return new XMLHttpRequest
        } catch (e) {}
    };
    var gn = x.ajaxSettings.xhr(),
        mn = {
            0: 200,
            1223: 204
        }, yn = 0,
        vn = {};
    e.ActiveXObject && x(e).on("unload", function() {
        for (var e in vn) vn[e]();
        vn = undefined
    }), x.support.cors = !! gn && "withCredentials" in gn, x.support.ajax =
        gn = !! gn, x.ajaxTransport(function(e) {
            var t;
            return x.support.cors || gn && !e.crossDomain ? {
                send: function(n, r) {
                    var i, o, s = e.xhr();
                    if (s.open(e.type, e.url, e.async, e.username, e.password),
                        e.xhrFields)
                        for (i in e.xhrFields) s[i] = e.xhrFields[i];
                    e.mimeType && s.overrideMimeType && s.overrideMimeType(
                        e.mimeType), e.crossDomain || n[
                        "X-Requested-With"] || (n["X-Requested-With"] =
                        "XMLHttpRequest");
                    for (i in n) s.setRequestHeader(i, n[i]);
                    t = function(e) {
                        return function() {
                            t && (delete vn[o], t = s.onload = s.onerror =
                                null, "abort" === e ? s.abort() :
                                "error" === e ? r(s.status || 404, s.statusText) :
                                r(mn[s.status] || s.status, s.statusText,
                                    "string" == typeof s.responseText ? {
                                        text: s.responseText
                                    } : undefined, s.getAllResponseHeaders()
                                ))
                        }
                    }, s.onload = t(), s.onerror = t("error"), t = vn[o =
                        yn++] = t("abort"), s.send(e.hasContent && e.data ||
                        null)
                },
                abort: function() {
                    t && t()
                }
            } : undefined
        });
    var xn, bn, wn = /^(?:toggle|show|hide)$/,
        Tn = RegExp("^(?:([+-])=|)(" + b + ")([a-z%]*)$", "i"),
        Cn = /queueHooks$/,
        kn = [An],
        Nn = {
            "*": [

                function(e, t) {
                    var n = this.createTween(e, t),
                        r = n.cur(),
                        i = Tn.exec(t),
                        o = i && i[3] || (x.cssNumber[e] ? "" : "px"),
                        s = (x.cssNumber[e] || "px" !== o && +r) && Tn.exec(
                            x.css(n.elem, e)),
                        a = 1,
                        u = 20;
                    if (s && s[3] !== o) {
                        o = o || s[3], i = i || [], s = +r || 1;
                        do a = a || ".5", s /= a, x.style(n.elem, e, s + o); while (
                            a !== (a = n.cur() / r) && 1 !== a && --u)
                    }
                    return i && (s = n.start = +s || +r || 0, n.unit = o, n
                        .end = i[1] ? s + (i[1] + 1) * i[2] : +i[2]), n
                }
            ]
        };

    function En() {
        return setTimeout(function() {
            xn = undefined
        }), xn = x.now()
    }

    function Sn(e, t, n) {
        var r, i = (Nn[t] || []).concat(Nn["*"]),
            o = 0,
            s = i.length;
        for (; s > o; o++)
            if (r = i[o].call(n, t, e)) return r
    }

    function jn(e, t, n) {
        var r, i, o = 0,
            s = kn.length,
            a = x.Deferred().always(function() {
                delete u.elem
            }),
            u = function() {
                if (i) return !1;
                var t = xn || En(),
                    n = Math.max(0, l.startTime + l.duration - t),
                    r = n / l.duration || 0,
                    o = 1 - r,
                    s = 0,
                    u = l.tweens.length;
                for (; u > s; s++) l.tweens[s].run(o);
                return a.notifyWith(e, [l, o, n]), 1 > o && u ? n : (a.resolveWith(
                    e, [l]), !1)
            }, l = a.promise({
                elem: e,
                props: x.extend({}, t),
                opts: x.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: xn || En(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var r = x.Tween(e, l.opts, t, n, l.opts.specialEasing[
                        t] || l.opts.easing);
                    return l.tweens.push(r), r
                },
                stop: function(t) {
                    var n = 0,
                        r = t ? l.tweens.length : 0;
                    if (i) return this;
                    for (i = !0; r > n; n++) l.tweens[n].run(1);
                    return t ? a.resolveWith(e, [l, t]) : a.rejectWith(
                        e, [l, t]), this
                }
            }),
            c = l.props;
        for (Dn(c, l.opts.specialEasing); s > o; o++)
            if (r = kn[o].call(l, e, c, l.opts)) return r;
        return x.map(c, Sn, l), x.isFunction(l.opts.start) && l.opts.start.call(
            e, l), x.fx.timer(x.extend(u, {
            elem: e,
            anim: l,
            queue: l.opts.queue
        })), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete)
            .fail(l.opts.fail).always(l.opts.always)
    }

    function Dn(e, t) {
        var n, r, i, o, s;
        for (n in e)
            if (r = x.camelCase(n), i = t[r], o = e[n], x.isArray(o) && (i =
                o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[
                n]), s = x.cssHooks[r], s && "expand" in s) {
                o = s.expand(o), delete e[r];
                for (n in o) n in e || (e[n] = o[n], t[n] = i)
            } else t[r] = i
    }
    x.Animation = x.extend(jn, {
        tweener: function(e, t) {
            x.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
            var n, r = 0,
                i = e.length;
            for (; i > r; r++) n = e[r], Nn[n] = Nn[n] || [], Nn[n].unshift(
                t)
        },
        prefilter: function(e, t) {
            t ? kn.unshift(e) : kn.push(e)
        }
    });

    function An(e, t, n) {
        var r, i, o, s, a, u, l = this,
            c = {}, p = e.style,
            f = e.nodeType && Lt(e),
            h = q.get(e, "fxshow");
        n.queue || (a = x._queueHooks(e, "fx"), null == a.unqueued && (a.unqueued =
            0, u = a.empty.fire, a.empty.fire = function() {
                a.unqueued || u()
            }), a.unqueued++, l.always(function() {
            l.always(function() {
                a.unqueued--, x.queue(e, "fx").length || a.empty
                    .fire()
            })
        })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [
            p.overflow, p.overflowX, p.overflowY], "inline" === x.css(e,
            "display") && "none" === x.css(e, "float") && (p.display =
            "inline-block")), n.overflow && (p.overflow = "hidden", l.always(
            function() {
                p.overflow = n.overflow[0], p.overflowX = n.overflow[1],
                p.overflowY = n.overflow[2]
            }));
        for (r in t)
            if (i = t[r], wn.exec(i)) {
                if (delete t[r], o = o || "toggle" === i, i === (f ? "hide" :
                    "show")) {
                    if ("show" !== i || !h || h[r] === undefined) continue;
                    f = !0
                }
                c[r] = h && h[r] || x.style(e, r)
            }
        if (!x.isEmptyObject(c)) {
            h ? "hidden" in h && (f = h.hidden) : h = q.access(e, "fxshow", {}),
            o && (h.hidden = !f), f ? x(e).show() : l.done(function() {
                x(e).hide()
            }), l.done(function() {
                var t;
                q.remove(e, "fxshow");
                for (t in c) x.style(e, t, c[t])
            });
            for (r in c) s = Sn(f ? h[r] : 0, r, l), r in h || (h[r] = s.start,
                f && (s.end = s.start, s.start = "width" === r || "height" ===
                    r ? 1 : 0))
        }
    }

    function Ln(e, t, n, r, i) {
        return new Ln.prototype.init(e, t, n, r, i)
    }
    x.Tween = Ln, Ln.prototype = {
        constructor: Ln,
        init: function(e, t, n, r, i, o) {
            this.elem = e, this.prop = n, this.easing = i || "swing", this.options =
                t, this.start = this.now = this.cur(), this.end = r, this.unit =
                o || (x.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = Ln.propHooks[this.prop];
            return e && e.get ? e.get(this) : Ln.propHooks._default.get(
                this)
        },
        run: function(e) {
            var t, n = Ln.propHooks[this.prop];
            return this.pos = t = this.options.duration ? x.easing[this.easing]
            (e, this.options.duration * e, 0, 1, this.options.duration) : e,
            this.now = (this.end - this.start) * t + this.start, this.options
                .step && this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : Ln.propHooks._default.set(this),
            this
        }
    }, Ln.prototype.init.prototype = Ln.prototype, Ln.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem
                    .style[e.prop] ? (t = x.css(e.elem, e.prop, ""), t &&
                        "auto" !== t ? t : 0) : e.elem[e.prop]
            },
            set: function(e) {
                x.fx.step[e.prop] ? x.fx.step[e.prop](e) : e.elem.style &&
                    (null != e.elem.style[x.cssProps[e.prop]] || x.cssHooks[
                    e.prop]) ? x.style(e.elem, e.prop, e.now + e.unit) : e.elem[
                    e.prop] = e.now
            }
        }
    }, Ln.propHooks.scrollTop = Ln.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, x.each(["toggle", "show", "hide"], function(e, t) {
        var n = x.fn[t];
        x.fn[t] = function(e, r, i) {
            return null == e || "boolean" == typeof e ? n.apply(this,
                arguments) : this.animate(qn(t, !0), e, r, i)
        }
    }), x.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(Lt).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(e, t, n, r) {
            var i = x.isEmptyObject(e),
                o = x.speed(t, n, r),
                s = function() {
                    var t = jn(this, x.extend({}, e), o);
                    (i || q.get(this, "finish")) && t.stop(!0)
                };
            return s.finish = s, i || o.queue === !1 ? this.each(s) :
                this.queue(o.queue, s)
        },
        stop: function(e, t, n) {
            var r = function(e) {
                var t = e.stop;
                delete e.stop, t(n)
            };
            return "string" != typeof e && (n = t, t = e, e = undefined),
            t && e !== !1 && this.queue(e || "fx", []), this.each(
                function() {
                    var t = !0,
                        i = null != e && e + "queueHooks",
                        o = x.timers,
                        s = q.get(this);
                    if (i) s[i] && s[i].stop && r(s[i]);
                    else
                        for (i in s) s[i] && s[i].stop && Cn.test(i) &&
                            r(s[i]);
                    for (i = o.length; i--;) o[i].elem !== this ||
                        null != e && o[i].queue !== e || (o[i].anim
                            .stop(n), t = !1, o.splice(i, 1));
                    (t || !n) && x.dequeue(this, e)
                })
        },
        finish: function(e) {
            return e !== !1 && (e = e || "fx"), this.each(function() {
                var t, n = q.get(this),
                    r = n[e + "queue"],
                    i = n[e + "queueHooks"],
                    o = x.timers,
                    s = r ? r.length : 0;
                for (n.finish = !0, x.queue(this, e, []), i && i.stop &&
                    i.stop.call(this, !0), t = o.length; t--;) o[t]
                    .elem === this && o[t].queue === e && (o[t].anim
                        .stop(!0), o.splice(t, 1));
                for (t = 0; s > t; t++) r[t] && r[t].finish && r[t]
                    .finish.call(this);
                delete n.finish
            })
        }
    });

    function qn(e, t) {
        var n, r = {
                height: e
            }, i = 0;
        for (t = t ? 1 : 0; 4 > i; i += 2 - t) n = jt[i], r["margin" + n] =
            r["padding" + n] = e;
        return t && (r.opacity = r.width = e), r
    }
    x.each({
        slideDown: qn("show"),
        slideUp: qn("hide"),
        slideToggle: qn("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        x.fn[e] = function(e, n, r) {
            return this.animate(t, e, n, r)
        }
    }), x.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? x.extend({}, e) : {
            complete: n || !n && t || x.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !x.isFunction(t) && t
        };
        return r.duration = x.fx.off ? 0 : "number" == typeof r.duration ?
            r.duration : r.duration in x.fx.speeds ? x.fx.speeds[r.duration] :
            x.fx.speeds._default, (null == r.queue || r.queue === !0) && (r
                .queue = "fx"), r.old = r.complete, r.complete = function() {
                x.isFunction(r.old) && r.old.call(this), r.queue && x.dequeue(
                    this, r.queue)
        }, r
    }, x.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, x.timers = [], x.fx = Ln.prototype.init, x.fx.tick = function() {
        var e, t = x.timers,
            n = 0;
        for (xn = x.now(); t.length > n; n++) e = t[n], e() || t[n] !== e ||
            t.splice(n--, 1);
        t.length || x.fx.stop(), xn = undefined
    }, x.fx.timer = function(e) {
        e() && x.timers.push(e) && x.fx.start()
    }, x.fx.interval = 13, x.fx.start = function() {
        bn || (bn = setInterval(x.fx.tick, x.fx.interval))
    }, x.fx.stop = function() {
        clearInterval(bn), bn = null
    }, x.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, x.fx.step = {}, x.expr && x.expr.filters && (x.expr.filters.animated =
        function(e) {
            return x.grep(x.timers, function(t) {
                return e === t.elem
            }).length
        }), x.fn.offset = function(e) {
        if (arguments.length) return e === undefined ? this : this.each(
            function(t) {
                x.offset.setOffset(this, e, t)
            });
        var t, n, i = this[0],
            o = {
                top: 0,
                left: 0
            }, s = i && i.ownerDocument;
        if (s) return t = s.documentElement, x.contains(t, i) ? (typeof i.getBoundingClientRect !==
            r && (o = i.getBoundingClientRect()), n = Hn(s), {
                top: o.top + n.pageYOffset - t.clientTop,
                left: o.left + n.pageXOffset - t.clientLeft
            }) : o
    }, x.offset = {
        setOffset: function(e, t, n) {
            var r, i, o, s, a, u, l, c = x.css(e, "position"),
                p = x(e),
                f = {};
            "static" === c && (e.style.position = "relative"), a = p.offset(),
            o = x.css(e, "top"), u = x.css(e, "left"), l = ("absolute" ===
                c || "fixed" === c) && (o + u).indexOf("auto") > -1, l ?
                (r = p.position(), s = r.top, i = r.left) : (s = parseFloat(
                o) || 0, i = parseFloat(u) || 0), x.isFunction(t) && (t =
                t.call(e, n, a)), null != t.top && (f.top = t.top - a.top +
                s), null != t.left && (f.left = t.left - a.left + i),
                "using" in t ? t.using.call(e, f) : p.css(f)
        }
    }, x.fn.extend({
        position: function() {
            if (this[0]) {
                var e, t, n = this[0],
                    r = {
                        top: 0,
                        left: 0
                    };
                return "fixed" === x.css(n, "position") ? t = n.getBoundingClientRect() :
                    (e = this.offsetParent(), t = this.offset(), x.nodeName(
                    e[0], "html") || (r = e.offset()), r.top += x.css(
                    e[0], "borderTopWidth", !0), r.left += x.css(e[
                    0], "borderLeftWidth", !0)), {
                    top: t.top - r.top - x.css(n, "marginTop", !0),
                    left: t.left - r.left - x.css(n, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var e = this.offsetParent || s;
                while (e && !x.nodeName(e, "html") && "static" ===
                    x.css(e, "position")) e = e.offsetParent;
                return e || s
            })
        }
    }), x.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, n) {
        var r = "pageYOffset" === n;
        x.fn[t] = function(i) {
            return x.access(this, function(t, i, o) {
                var s = Hn(t);
                return o === undefined ? s ? s[n] : t[i] : (s ? s.scrollTo(
                    r ? e.pageXOffset : o, r ? o : e.pageYOffset
                ) : t[i] = o, undefined)
            }, t, i, arguments.length, null)
        }
    });

    function Hn(e) {
        return x.isWindow(e) ? e : 9 === e.nodeType && e.defaultView
    }
    x.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        x.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, r) {
            x.fn[r] = function(r, i) {
                var o = arguments.length && (n || "boolean" !=
                    typeof r),
                    s = n || (r === !0 || i === !0 ? "margin" :
                        "border");
                return x.access(this, function(t, n, r) {
                    var i;
                    return x.isWindow(t) ? t.document.documentElement[
                        "client" + e] : 9 === t.nodeType ? (i =
                        t.documentElement, Math.max(t.body[
                                "scroll" + e], i["scroll" + e],
                            t.body["offset" + e], i["offset" +
                                e], i["client" + e])) : r ===
                        undefined ? x.css(t, n, s) : x.style(t,
                            n, r, s)
                }, t, o ? r : undefined, o, null)
            }
        })
    }), x.fn.size = function() {
        return this.length
    }, x.fn.andSelf = x.fn.addBack, "object" == typeof module && module &&
        "object" == typeof module.exports ? module.exports = x : "function" ==
        typeof define && define.amd && define("jquery", [], function() {
            return x
        }), "object" == typeof e && "object" == typeof e.document && (e.jQuery =
            e.$ = x)
})(window);

},{}],9:[function(require,module,exports){
var $ = require('./lib/jquery'),
    MainLevel = require('./level/mainLevel');

$(function() {
    var
    worker = new Worker('./worker.js'),
        mainLevel = new MainLevel.MainLevel(worker);

    mainLevel.start();
});

},{"./level/mainLevel":7,"./lib/jquery":8}],10:[function(require,module,exports){
var
Sprite = require('./sprite'),
    Shape = require('../foundation/shape'),
    Animation = require('../foundation/animation'),
    Direction = require('../enum/direction');

/**
    Abstract class for {{#crossLink Player}}{{/crossLink}} and
    {{#crossLink Enemy}}{{/crossLink}} classes.

    @class AbstractPlayer
 */


//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

/**
    @module sprite/abstractPlayer
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
         @class AbstractPlayer
         @constructor
         @param {integer} row Row in maze
         @param {integer} column Column in maze
         @param {Maze} maze Maze instance
         @param {Engine} physicsEngine Engine instance
         @param {CanvasDrawer} CanvasDrawer instance
         @param {Array} shapes An array of shapes
     */

    AbstractPlayer: function(row, column, maze, physicsEngine, drawer,
        shapes) {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var
        location = maze.get(row, column),
            center = {
                x: 0,
                y: 0
            },
            isAnimating = false,
            isFrozen = false,
            previousMove;

        /**
            Initialization method

            @method init
            @private
            @return {void}
         */
        function init() {
            // Extend Sprite constructor
            Sprite.Sprite.call(_this, shapes, drawer);

            // After constructing shapes around origin, translate to
            // position
            _this.x = location.x + location.width / 2;
            _this.y = location.y + location.height / 2;
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        Object.defineProperties(this, {
            /**
                Location of AbstractPlayer instance in Maze

                @property location
                @type {MazeLocation}
             */
            location: {
                get: function() {
                    return location;
                },
                set: function(newLocation) {
                    location = newLocation;
                }
            },

            /**
                Whether or not the AbstractPlayer instance currently being
                animated

                @property isAnimating
                @type {boolean}
             */
            isAnimating: {
                get: function() {
                    return isAnimating;
                },
                set: function(value) {
                    isAnimating = value;
                }
            },

            /**
                Whether or not the AbstractPlayer instance currently frozen

                @property isFrozen
                @type {boolean}
             */
            isFrozen: {
                get: function() {
                    return isFrozen;
                },
                set: function(value) {
                    isFrozen = value;
                }
            },
        });

        /**
            Get whether or not the AbstractPlayer instance can move based
            on the isAnimating and isFrozen properties

            @method canMove
            @return {boolean} Whether or not the AbstractPlayer can move
         */
        this.canMove = function() {
            return !this.isAnimating && !this.isFrozen;
        };

        /**
            Move AbstractPlayer instance

            @method move
            @param  {Direction} direction Direction to move
            @return {void}
         */
        this.move = function(direction) {
            if (!this.canMove()) {
                return;
            }

            var newLocation, dx, dy, sx, angle;

            switch (direction) {
                case Direction.LEFT:
                    newLocation = location.left;
                    angle = 0;
                    sx = -1;
                    break;
                case Direction.UP:
                    newLocation = location.up;
                    if (previousMove === Direction.LEFT) {
                        sx = 1;
                    }
                    angle = Math.PI / 2;
                    break;
                case Direction.RIGHT:
                    newLocation = location.right;
                    angle = 0;
                    sx = 1;
                    break;
                case Direction.DOWN:
                    newLocation = location.down;
                    if (previousMove === Direction.LEFT) {
                        sx = 1;
                    }
                    angle = -Math.PI / 2;
                    break;
                default:
                    return;
            }

            if (newLocation === null || !location.walls[direction]
                .isPenetrable) {
                return;
            }

            if (angle !== undefined) {
                if (direction === Direction.UP || direction ===
                    Direction.DOWN) {
                    if (sx !== undefined) {
                        this.transformation.sx = sx;
                    }
                }
                this.transformation.angle = angle;
                if (direction === Direction.LEFT || direction ===
                    Direction.RIGHT) {
                    if (sx !== undefined) {
                        this.transformation.sx = sx;
                    }
                }
            } else if (sx !== undefined) {
                this.transformation.sx = sx;
            }

            previousMove = direction;
            dx = newLocation.x - location.x;
            dy = newLocation.y - location.y;

            var
            newCenter = {
                x: this.x + dx,
                y: this.y + dy
            },
                dirX = dx > 0 ? 1 : -1,
                dirY = dy > 0 ? 1 : -1,
                idealTime = 100,
                animation = new Animation.Animation(this, function(time,
                    timeDiff) {
                    _this.x += Math.round(dx / idealTime *
                        timeDiff);
                    _this.y += Math.round(dy / idealTime *
                        timeDiff);
                    return dirX * _this.x > dirX * newCenter.x ||
                        dirY * _this.y > dirY * newCenter.y;
                }, function() {
                    _this.isAnimating = false;
                    _this.x = newCenter.x;
                    _this.y = newCenter.y;
                    location = newLocation;

                    // Notify the physics engine that a change occurred
                    physicsEngine.updatePositions();
                });

            this.isAnimating = true;
            animation.start();
        };

        // Call init to perform setup
        init();
    }

};

},{"../enum/direction":1,"../foundation/animation":3,"../foundation/shape":5,"./sprite":15}],11:[function(require,module,exports){
var
AbstractPlayer = require('./abstractPlayer'),
    Shape = require('../foundation/shape'),
    Animation = require('../foundation/animation'),
    Hash = require('../util/hash');

/**
    This class handles the AI and drawing of an enemy.

    @class Enemy
    @extends Sprite
 */


//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

var
MOVE_DELAY = 300,
    FILL_STYLE = '#FF0000',
    RADIUS = 20;

/**
    @module sprite/enemy
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
         @class Enemy
         @constructor
         @param {integer} row Row in maze
         @param {integer} column Column in maze
         @param {Maze} maze Maze instance
         @param {Player} player Player instance
         @param {Engine} Engine instance
         @param {CanvasDrawer} CanvasDrawer instance
         @param {Worker} [worker=undefined] Worker to calculate route to player
         efficiently
     */
    Enemy: function(row, column, maze, player, physicsEngine, drawer, worker) {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var
        location = maze.get(row, column),
            center = {
                x: 0,
                y: 0
            },
            head = new Shape.Circle(center.x, center.y,
                RADIUS, drawer, {
                    fillStyle: FILL_STYLE,
                    strokeStyle: 'black'
                }),
            shapes = [head],
            movesQueue = [],
            mazeJson = maze.toJSON(),
            lastPlayerLocation = player.location,
            messageId = 0;

        /**
            Initialization method

            @method init
            @private
            @return {void}
         */
        function init() {
            // Extend AbstractPlayer constructor
            AbstractPlayer.AbstractPlayer.call(_this, row, column, maze,
                physicsEngine, drawer, shapes);
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        /**
            Perform an action if possible

            @method act
            @return {void}
         */
        this.act = function() {
            if (!this.isAnimating && movesQueue.length > 0) {
                this.move(movesQueue.pop());
                // Change messageId after move to invalidate old messages
                messageId++;
            }
            if (movesQueue.length === 0 ||
                player.location !== lastPlayerLocation) {
                lastPlayerLocation = player.location;
                this.calculateRoute();
            }
        };

        this.calculateRoute = function() {
            if (worker === undefined) {
                return; // TODO: calculate route without Worker
            }

            worker.addEventListener('message', function(ev) {
                var data = ev.data,
                    moves = data.moves,
                    responseId = data.responseId;

                // Make sure the enemy has not moved since the request
                if (responseId !== messageId) {
                    return;
                }

                _this.clearMoves();
                _this.addMoves(moves);
            });

            worker.postMessage({
                graph: mazeJson,
                source: Hash.hashcode(this.location),
                destination: Hash.hashcode(player.location),
                messageId: messageId
            });
        };

        /**
            Add moves to the moves queue

            @method addMoves
            @param  {Array} moves An array of directions to move in
         */
        this.addMoves = function(moves) {
            movesQueue = moves.reverse().concat(movesQueue);
        };

        /**
            Clear moves from the moves queue

            @method clearMoves
            @return {void}
         */
        this.clearMoves = function() {
            movesQueue = [];
        };

        this.start = function() {
            function recursiveAct() {
                if (_this.canMove()) {
                    _this.act();
                    setTimeout(function() {
                        recursiveAct();
                    }, MOVE_DELAY);
                }
            }
            recursiveAct();
        };

        // Call init to perform setup
        init();
    }
};

},{"../foundation/animation":3,"../foundation/shape":5,"../util/hash":19,"./abstractPlayer":10}],12:[function(require,module,exports){
var
Sprite = require('./sprite'),
    Shape = require('../foundation/shape'),
    Hash = require('../util/hash'),
    Graph = require('../util/graph'),
    MathExtensions = require('../util/mathExtensions'),
    Direction = require('../enum/direction');

/**
    Maze class generates a maze from a graph.

    @class Maze
    @extends Sprite
 */


//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

var
TILE_SIDE = 50,
    WALL_STYLE = '#FFFFFF',
    EMPTY_STYLE = '#000000',
    WALL_THICKNESS = 4;

/**
    @module sprite/maze
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
         @class Maze
         @constructor
     */

    Maze: function(numWidth, numHeight, drawer) {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var
        locations = [],
            shapes = [];

        /**
            MazeLocation represents locations within a maze

            @class MazeLocation
            @for Maze
            @constructor
            @param  {integer} i Row index of location
            @param  {integer} j Column index of location
         */
        function MazeLocation(i, j) {
            var _thisLocation = this;

            /**
                Row index of MazeLocation in Maze

                @property row
                @type {integer}
             */
            this.row = i;

            /**
                Column index of MazeLocation in Maze

                @property column
                @type {integer}
             */
            this.column = j;

            /***
                x coordination of tile

                @property x
                @type {number}
             */
            this.x = TILE_SIDE * this.column;

            /**
                y coordination of tile

                @property y
                @type {number}
             */
            this.y = TILE_SIDE * this.row;

            /**
                Width of tile

                @property width
                @type {number}
             */
            this.width = TILE_SIDE;

            /**
                Width of tile

                @property height
                @type {number}
             */
            this.height = TILE_SIDE;

            /**
                Tile rectangle to represent MazeLocation

                @property tile
                @type {Rectangle}
             */
            this.tile = new Shape.Rectangle(this.x, this.y, TILE_SIDE,
                TILE_SIDE, drawer, {
                    fillStyle: EMPTY_STYLE
                });

            /**
                Location to the left of this one

                @property left
                @type {MazeLocation}
             */
            this.left = null;

            /**
                Location to the right of this one

                @property right
                @type {MazeLocation}
             */
            this.right = null;

            /**
                Location above this one

                @property up
                @type {MazeLocation}
             */
            this.up = null;

            /**
                Location below this one

                @property down
                @type {MazeLocation}
             */
            this.down = null;

            /**
                A hash of walls with Direction enums as keys

                @property walls
                @type {Object}
             */
            this.walls = {};

            this.walls[Direction.UP] = new MazeWall(this.x, this.y,
                false);

            this.walls[Direction.DOWN] = new MazeWall(this.x,
                this.y + TILE_SIDE, false);

            this.walls[Direction.RIGHT] = new MazeWall(this.x +
                TILE_SIDE, this.y, true);

            this.walls[Direction.LEFT] = new MazeWall(this.x,
                this.y, true);

            /**
                Iterate through each wall of this location

                @method forEachWall
                @param  {Function} f Function to apply to each wall. It is
                given the wall and the direction of the wall as parameters.
                The function can exit iteration by returning true.
                @return {void}
             */
            this.forEachWall = function(f) {
                for (var i = 0; i < 4; i++) {
                    var dir = Direction.MIN + i;
                    f(_thisLocation.walls[dir], dir);
                }
            };

            /**
                Get the locaton in a given direction from this locaton

                @method get
                @param  {Direction} direction Direction enum
                @return {MazeLocation} Adjacent location
             */
            this.get = function(direction) {
                var neighbors = [this.left, this.up, this.right, this.down];
                return neighbors[direction - Direction.LEFT];
            };

            /**
                Get an impenetrable location adjacent to this location

                @method getImpenetrable
                @return {MazeLocation} Impenetrable location if exists,
                null otherwise
                @for Maze
             */
            this.getImpenetrable = function() {
                for (var i = 0; i < 4; i++) {
                    var dir = Direction.LEFT + i,
                        location = this.get(dir);

                    if (location !== null && !this.walls[dir]
                        .isPenetrable) {
                        return location;
                    }
                }
                return null;
            };
        }

        /**
            Class to represent walls of MazeLocation

            @class MazeWall
            @constructor
            @for Maze
            @param  {number} x x coordinate of wall
            @param  {number} y y coordinate of wall
            @param  {boolean} isVertical Whether or not wall is vertical
         */
        function MazeWall(x, y, isVertical) {
            var
            w = isVertical ? WALL_THICKNESS : TILE_SIDE +
                WALL_THICKNESS,
                h = isVertical ? TILE_SIDE + WALL_THICKNESS :
                    WALL_THICKNESS,
                isPenetrable = false;

            /**
                Rectangle to display on canvas

                @property rect
                @type {Shape}
             */
            this.rect = new Shape.Rectangle(x, y,
                w, h,
                drawer, {
                    fillStyle: WALL_STYLE,
                    strokeStyle: WALL_STYLE
                });

            Object.defineProperties(this, {
                /**
                    Whether or not the wall is penetrable

                    @property isPenetrable
                    @type {boolean}
                    @for Maze
                 */
                isPenetrable: {
                    get: function() {
                        return isPenetrable;
                    },
                    set: function(value) {
                        isPenetrable = value;
                        if (isPenetrable) {
                            this.rect.drawingSettings.fillStyle =
                                EMPTY_STYLE;
                            this.rect.drawingSettings.strokeStyle =
                                EMPTY_STYLE;
                        } else {
                            this.rect.drawingSettings.fillStyle =
                                WALL_STYLE;
                            this.rect.drawingSettings.strokeStyle =
                                WALL_STYLE;
                        }
                    }
                }
            });
        }

        /**
            Initialize maze

            @method init
            @private
            @return {void}
         */
        function init() {
            var i, j;
            for (i = 0; i < numHeight; i++) {
                var locationRow = [];
                for (j = 0; j < numWidth; j++) {
                    var location = new MazeLocation(i, j);
                    shapes.push(location.tile);
                    shapes.push(location.walls[Direction.UP].rect);
                    shapes.push(location.walls[Direction.DOWN].rect);
                    shapes.push(location.walls[Direction.LEFT].rect);
                    shapes.push(location.walls[Direction.RIGHT].rect);
                    locationRow.push(location);
                }
                locations.push(locationRow);
            }

            Sprite.Sprite.call(_this, shapes, drawer);

            connectLocations();
            generateMaze();
            eliminateBarriers();
        }

        /**
            Connect MazeLocations to their neighbors

            @method connectLocations
            @private
            @return {void}
         */
        function connectLocations() {
            _this.forEachLocation(function(location, i, j) {
                if (i > 0) {
                    location.up = _this.get(i - 1, j);
                }
                if (i < numHeight - 1) {
                    location.down = _this.get(i + 1, j);
                }
                if (j > 0) {
                    location.left = _this.get(i, j - 1);
                }
                if (j < numWidth - 1) {
                    location.right = _this.get(i, j + 1);
                }
            });
        }

        /**
            Generate the maze

            @method generateMaze
            @private
            @return {void}
         */
        function generateMaze() {
            var visited = new Hash.Hashset();

            function generateMazeHelper(location) {
                if (location === null || visited.contains(location)) {
                    return;
                }

                location.tile.drawingSettings.fillStyle = EMPTY_STYLE;

                var randomResult = randomNeighbor(location, visited),
                    randomDir = randomResult.dir,
                    randomLocation = randomResult.location;

                if (randomLocation !== null) {
                    var
                    wall = location.walls[randomDir],
                        oppWall = randomLocation.walls[Direction
                            .opposite(randomDir)];

                    wall.isPenetrable = true;
                    oppWall.isPenetrable = true;
                    randomLocation.tile.drawingSettings.fillStyle =
                        EMPTY_STYLE;
                    visited.add(location);
                    generateMazeHelper(randomLocation);
                }
            }

            _this.forEachLocationRandom(function(location) {
                generateMazeHelper(location);
            });
        }

        /**
            Random neighbor of location that is not in visited set

            @method randomNeighbor
            @private
            @param  {MazeLocation} location Starting location
            @param  {Hashset} visited Visited location set
            @return {MazeLocation} Adjacent location
         */
        function randomNeighbor(location, visited) {
            var ret, usedDirs = [false, false, false, false];
            while (!usedDirs[0] || !usedDirs[1] || !usedDirs[2] || !
                usedDirs[3]) {
                var dir = Direction.random(),
                    idx = dir - Direction.MIN;
                ret = {
                    dir: dir,
                    location: location.get(dir)
                };
                if (ret.dir !== null && !visited.contains(ret.location)) {
                    return ret;
                }
                if (!usedDirs[idx]) {
                    usedDirs[idx] = true;
                }
            }
            return {
                dir: null,
                location: null
            };
        }

        /**
            Eliminate walls from the maze that make traversing the entrie
            maze impossible

            @method eliminateBarriers
            @private
            @return {void}
         */
        function eliminateBarriers() {
            _this.forEachLocation(function(location) {
                var numReachable = numReachableLocations(location);
                if (numReachable >= numWidth * numHeight) {
                    return true;
                }
                location.forEachWall(function(wall, dir) {
                    if (wall.isPenetrable) {
                        return;
                    }

                    var adjLocation = location.get(dir),
                        oppWall;

                    if (adjLocation !== null) {
                        oppWall = adjLocation.walls[Direction
                            .opposite(dir)];
                    }

                    wall.isPenetrable = true;
                    if (oppWall !== undefined) {
                        oppWall.isPenetrable = true;
                    }

                    var newNumReachable = numReachableLocations(
                        location);

                    if (newNumReachable === numWidth *
                        numHeight) {
                        return true; // Terminate iteration
                    } else if (newNumReachable <= numReachable) {
                        wall.isPenetrable = false;
                        if (oppWall !== undefined) {
                            oppWall.isPenetrable = false;
                        }
                    } else {
                        numReachable = newNumReachable;
                    }
                });
            });
        }

        /**
            Count the number of reachable locations from an origin location

            @method numReachableLocations
            @private
            @param  {MazeLocation} origin Origin location
            @return {number} Number of reachable locations (including self)
         */
        function numReachableLocations(origin) {
            var visitedSet = new Hash.Hashset();

            function numReachableLocationsHelper(location) {
                if (visitedSet.contains(location)) {
                    return 0;
                }
                visitedSet.add(location);
                if (location.up !== null &&
                    location.walls[Direction.UP].isPenetrable) {
                    numReachableLocationsHelper(location.up);
                }
                if (location.down !== null &&
                    location.walls[Direction.DOWN].isPenetrable) {
                    numReachableLocationsHelper(location.down);
                }
                if (location.left !== null &&
                    location.walls[Direction.LEFT].isPenetrable) {
                    numReachableLocationsHelper(location.left);
                }
                if (location.right !== null &&
                    location.walls[Direction.RIGHT].isPenetrable) {
                    numReachableLocationsHelper(location.right);
                }
            }

            numReachableLocationsHelper(origin);
            return visitedSet.length;
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        /**
            Iterate through each location in the maze

            @method forEachLocation
            @param  {Function} f Function to apply to each location.
            Function can exit iteration by returning true.
            @return {void}
         */
        this.forEachLocation = function(f) {
            for (var i = 0; i < numHeight; i++) {
                for (var j = 0; j < numWidth; j++) {
                    var done = f(_this.get(i, j), i, j);
                    if (done === true) {
                        return;
                    }
                }
            }
        };

        /**
            Iterate randomly through each location in the maze

            @method forEachLocationRandom
            @param  {Function} f Function to apply to each location.
            Function can exit iteration by returning true.
            @return {void}
         */
        this.forEachLocationRandom = function(f) {
            MathExtensions.randomIterator(numHeight, function(i) {
                MathExtensions.randomIterator(numWidth, function(j) {
                    return f(_this.get(i, j), i, j);
                });
            });
        };

        /**
            Generate a graph representing the maze

            @method toGraph
            @return {Graph} The graph
         */
        this.toGraph = function() {
            var
            graph = new Graph.Graph(),
                nodes = [],
                currentRowIndex,
                currentRow;

            _this.forEachLocation(function(location, i, j) {
                if (i !== currentRowIndex) {
                    if (currentRow !== undefined) {
                        nodes.push(currentRow);
                    }
                    currentRow = [];
                    currentRowIndex = i;
                }
                var node = graph.addNode(location);
                currentRow.push(node);
            });
            nodes.push(currentRow);

            _this.forEachLocation(function(location, i, j) {
                var
                u = nodes[i][j],
                    v;

                if (location.up !== null) {
                    v = nodes[i - 1][j];
                    graph.addEdge(u, v);
                }
                if (location.down !== null) {
                    v = nodes[i + 1][j];
                    graph.addEdge(u, v);
                }
                if (location.left !== null) {
                    v = nodes[i][j - 1];
                    graph.addEdge(u, v);
                }
                if (location.right !== null) {
                    v = nodes[i][j + 1];
                    graph.addEdge(u, v);
                }
            });

            return graph;
        };

        /**
            Get a JSON object representing the maze

            @method toJSON
            @return {Object} JSON object representing maze
         */
        this.toJSON = function() {
            var jsonObj = {};

            this.forEachLocation(function(location) {
                var adjArr = [];
                location.forEachWall(function(wall, dir) {
                    if (wall.isPenetrable) {
                        var neighborCode = Hash.hashcode(location.get(
                            dir));
                        adjArr[dir - Direction.MIN] = neighborCode;
                    } else {
                        adjArr[dir - Direction.MIN] = null;
                    }
                });
                var locationCode = Hash.hashcode(location);
                if (adjArr.length !== 4) {
                    throw new Error('invalid length of adjacency array');
                }
                jsonObj[locationCode] = adjArr;
            });

            return jsonObj;
        };

        /**
            Get MazeLocation with given row and column indices

            @method get
            @param  {integer} row Row index
            @param  {integer} column Column index
            @return {MazeLocation} MazeLocation at specified indices
         */
        this.get = function(row, column) {
            return locations[row][column];
        };

        // Call init to do setup
        init();
    }
};

},{"../enum/direction":1,"../foundation/shape":5,"../util/graph":18,"../util/hash":19,"../util/mathExtensions":20,"./sprite":15}],13:[function(require,module,exports){
var AbstractPlayer = require('./abstractPlayer'),
    Shape = require('../foundation/shape'),
    Prize = require('./prize'),
    Enemy = require('./enemy'),
    Animation = require('../foundation/animation');

/**
    The Player class handles the actions and drawing of the main player.

    @class Player
    @extends Sprite
 */


//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

var
HEAD_STYLE = 'yellow',
    EYE_STYLE = 'black',
    MOUTH_STYLE = 'black',
    MOUTH_MAX = 2;

/**
    @module sprite/player
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
         @class Player
         @constructor
         @param {integer} row Row in maze
         @param {integer} column Column in maze
         @param {Maze} maze Maze instance
         @param {InputHandler} InputHandler instance
         @param {Engine} physicsEngine Engine instance
         @param {CanvasDrawer} CanvasDrawer instance
         @param {Function} onWin Function to perform on winning
         @param {Function} onDeath Function to perform on death
     */

    Player: function(row, column, maze, inputHandler, physicsEngine,
        drawer, onWin, onDeath) {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var
        center = {
            x: 0,
            y: 0
        },
            head = new Shape.Circle(center.x, center.y, 18,
                drawer, {
                    fillStyle: HEAD_STYLE
                }),
            eye = new Shape.Circle(center.x + 10, center.y - 5, 4,
                drawer, {
                    fillStyle: EYE_STYLE
                }),
            mouth = new Shape.Rectangle(center.x + 5, center.y + 5, 12,
                3, drawer, {
                    fillStyle: MOUTH_STYLE
                }),
            shapes = [head, eye, mouth];

        /**
            Initialization method

            @method init
            @private
            @return {void}
         */
        function init() {
            // Extend AbstractPlayer constructor
            AbstractPlayer.AbstractPlayer.call(_this, row, column, maze,
                physicsEngine, drawer, shapes);

            var
            cycleDuration = 600,
                mouthAnim = new Animation.Animation(_this, function(
                    time) {
                    mouth.transformation.sy = MOUTH_MAX * Math.sin(
                        time / cycleDuration * Math.PI * 2);
                });

            mouthAnim.start();

            inputHandler.bind('keydown', function(ev) {
                _this.move(ev.keyCode);
            });
        }

        ///////////////////////////
        // Public methods/fields //
        ///////////////////////////

        /**
            Check whether a given array of candidate Sprites contains a
            Sprite that collides with this one. This method is called by
            the physics engine. If a collision occurs with an enemy, the
            player dies.

            @method checkCollision
            @param  {Array} candidates An arrau of Sprites that have
            bounding boxes that intersect with this Sprite's bounding box.
            @return {void}
         */
        this.checkCollision = function(candidates) {
            var
            prizes = candidates.filter(function(candidate) {
                return candidate instanceof Prize.Prize;
            }),
                enemies = candidates.filter(function(candidate) {
                    return candidate instanceof Enemy.Enemy;
                });

            if (prizes.length > 0) {
                onWin();
            } else if (enemies.length > 0) {
                onDeath();
            }
        };

        // Call init to perform setup
        init();
    }
};

},{"../foundation/animation":3,"../foundation/shape":5,"./abstractPlayer":10,"./enemy":11,"./prize":14}],14:[function(require,module,exports){
var Sprite = require('./sprite'),
    Shape = require('../foundation/shape');

/**
    A pickup item that end the game

    @class Prize
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

var
FILL_STYLE = '#00FF76',
    PRIZE_SIDE = 15;

/**
    @module sprite/prize
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
         @class Prize
         @constructor
     */

    Prize: function(row, column, maze, drawer) {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var
        rect = new Shape.Rectangle(-PRIZE_SIDE / 2, -PRIZE_SIDE / 2,
            PRIZE_SIDE, PRIZE_SIDE, drawer, {
                fillStyle: FILL_STYLE
            }),
            location = maze.get(row, column),
            shapes = [rect];

        /**
            Initialization function

            @method init
            @private
            @return {void}
         */
        function init() {
            rect.rotate(Math.PI / 4);
            Sprite.Sprite.call(_this, shapes, drawer);
            _this.x = location.x + location.width / 2;
            _this.y = location.y + location.height / 2;
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        /**
            Hide the Prize instance

            @method hide
            @return {void}
         */
        this.hide = function() {
            this.clear();
        };

        // Call init to perform setup
        init();
    }

};

},{"../foundation/shape":5,"./sprite":15}],15:[function(require,module,exports){
var _ = require('underscore'),
    BoundingBox = require('../util/boundingBox'),
    MathExtensions = require('../util/mathExtensions');

/**
   Abstract class used to implement basic functions of sprites. Sprites inherit
   from this class and override the necessary drawing methods, etc.

   @class Sprite
 */


//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

/**
   @module sprite/sprite
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
        @class Sprite
        @constructor
        @param {Array} shapes Array of shapes for sprite
        @param {CanvasDrawer} drawer Drawer to draw shapes
        @param {Object} [drawingSettings={}] Hash of drawing settings
     */
    Sprite: function(shapes, drawer, drawingSettings) {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var
        x,
            y,
            boundingBox,
            transformation = new MathExtensions.Transformation();

        shapes = shapes || [];
        drawingSettings = drawingSettings || {};

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        Object.defineProperties(this, {
            /**
                Shapes of Sprite instance

                @property shapes
                @type {Array}
             */
            shapes: {
                get: function() {
                    return shapes;
                },
                set: function(newShapes) {
                    shapes = newShapes;
                }
            },

            /**
                x coordinate of Sprite instance

                @property x
                @type {integer}
             */
            x: {
                get: function() {
                    return x;
                },
                set: function(newX) {
                    if (x !== newX) {
                        x = Math.round(newX);
                        _this.transformation.tx = x;
                        _this.boundingBox.x = x -
                            _this.boundingBox.width / 2;
                    }
                }
            },

            /**
                y coordinate of Sprite instance

                @property y
                @type {integer}
             */
            y: {
                get: function() {
                    return y;
                },
                set: function(newY) {
                    if (y !== newY) {
                        y = Math.round(newY);
                        _this.transformation.ty = y;
                        _this.boundingBox.y = y -
                            _this.boundingBox.height / 2;
                    }
                }
            },

            /**
                BoundingBox of Sprite instance

                @property boundingBox
                @type {BoundingBox}
             */
            boundingBox: {
                get: function() {
                    if (boundingBox === undefined) {
                        this.updateBoundingBox();
                    }
                    return boundingBox;
                },
                set: function(newBbox) {
                    boundingBox = newBbox;
                }
            },

            /**
                Drawing settings of Sprite instance

                @property drawingSettings
                @type {Object}
             */
            drawingSettings: {
                get: function() {
                    return drawingSettings;
                },
                set: function(newSettings) {
                    drawingSettings = newSettings;
                    _this.transformation.angle = drawingSettings.angle;
                }
            },

            /**
                Transformation matrix

                @property transformation
                @type {Transformation}
             */
            transformation: {
                get: function() {
                    return transformation;
                },
                set: function(newTransformation) {
                    transformation = newTransformation;
                }
            }
        });

        /**
            Iterator function

            @method forEachShape
            @param {Function} f A function _this takes a Shape instance as a
            parameter
            @return {void}
         */
        this.forEachShape = function(f) {
            var numShapes = _this.shapes.length,
                i, shape;
            for (i = 0; i < numShapes; i += 1) {
                shape = _this.shapes[i];
                f(shape);
            }
        };
        /**
            Clear the Sprite instance and redraw it

            @method update
            @return {void}
         */
        this.update = function() {
            this.clear();
            this.draw();
        };

        /**
            Clear Sprite instance

            @method clear
            @return {void}
         */
        this.clear = function() {
            drawer.save().transform(this.transformation);
            this.forEachShape(function(shape) {
                shape.clear();
            });
            drawer.restore();
        };

        /**
            Draw Sprite instance

            @method draw
            @return {void}
         */
        this.draw = function() {
            drawer.save().transform(this.transformation);
            this.forEachShape(function(shape) {
                shape.draw();
            });
            drawer.restore();
        };

        /**
            Draw BoundingBox of Sprite instance

            @method drawBoundingBox
            @return {void}
         */
        this.drawBoundingBox = function() {
            var x = _this.boundingBox.x,
                y = _this.boundingBox.y,
                w = _this.boundingBox.width,
                h = _this.boundingBox.height,
                lineWidth = _this.drawingSettings.lineWidth || 0;
            drawer.contextSettings = {
                strokeStyle: 'red'
            };
            drawer.beginPath();
            drawer.strokeRect(x + lineWidth, y + lineWidth, w - 2 *
                lineWidth, h - 2 * lineWidth);
        };

        /**
            Update BoundingBox of Sprite instance

            @method updateBoundingBox
            @return {void}
         */
        this.updateBoundingBox = function() {
            var minX, minY, maxX, maxY;
            this.forEachShape(function(shape) {
                var
                sBoxX = shape.boundingBox.x,
                    sBoxY = shape.boundingBox.y;

                if (minX === undefined || minX > sBoxX) {
                    minX = sBoxX;
                }
                if (minY === undefined || minY > sBoxY) {
                    minY = sBoxY;
                }
                if (maxX === undefined || maxX < sBoxX +
                    shape.boundingBox.width) {
                    maxX = sBoxX + shape.boundingBox.width;
                }
                if (maxY === undefined || maxY < sBoxY +
                    shape.boundingBox.height) {
                    maxY = sBoxY + shape.boundingBox.height;
                }
            });
            this.boundingBox = new BoundingBox.BoundingBox(minX, minY,
                maxX - minX, maxY - minY);
        };

        /**
            Test whether or not a point is within a Sprite

            @method collisionTest
            @param {Point} point Point to test
            @return {boolean} If the point is in the Sprite
         */
        this.collisionTest = function(point) {
            var numShapes = this.shapes.length,
                i, shape;
            for (i = 0; i < numShapes; i += 1) {
                shape = this.shapes[i];
                if (shape.collisionTest(point)) {
                    return true;
                }
            }
            return false;
        };
    }
};

},{"../util/boundingBox":16,"../util/mathExtensions":20,"underscore":23}],16:[function(require,module,exports){
/**
   A class to represent the bounds of shapes in the canvas. Simplifies
   calculations certain involving complex shapes. Specifically effective for
   hit-testing.

   @class BoundingBox
 */

/**
   @module util/boundingBox
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////
    /**
        Create a BoundingBox.

        @class BoundingBox
        @constructor
        @param {(float|Point)} arg0 The x coordinate of left side, or left-top point.
        @param {(float|Point)} arg1 The y coordinate of front side, or right-bottom point.
        @param {float} arg2 Width of the box.
        @param {float} arg3 Height of the box.
     */
    BoundingBox: function(arg0, arg1, arg2, arg3) {
        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var x, y, w, h;
        switch (arguments.length) {
            case 2:
                var point1 = arg0;
                var point2 = arg1;
                x = point1.x;
                y = point1.y;
                w = point2.x - point1.x;
                h = point2.y - point1.y;
                break;
            case 4:
                x = arg0;
                y = arg1;
                w = arg2;
                h = arg3;
                break;
        }
        if (w < 0 || h < 0) {
            throw new Error('Invalid dimensions for BoundingBox.');
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        Object.defineProperties(this, {
            /**
                x coordinate of top-left of BoundingBox instance

                @property x
                @type {float}
             */
            x: {
                get: function() {
                    return x;
                },
                set: function(newX) {
                    x = newX;
                }
            },

            /**
                y coordinate of top-left of BoundingBox instance

                @property y
                @type {float}
             */
            y: {
                get: function() {
                    return y;
                },
                set: function(newY) {
                    y = newY;
                }
            },

            /**
                Width of BoundingBox instance

                @property width
                @type {float}
             */
            width: {
                get: function() {
                    return w;
                }
            },

            /**
                Height of BoundingBox instance

                @property height
                @type {float}
             */
            height: {
                get: function() {
                    return h;
                }
            },

            /**
                Center of BoundingBox instance

                @property center
                @type {Object}
             */
            center: {
                get: function() {
                    return {
                        x: this.x + this.width / 2,
                        y: this.y + this.height / 2
                    };
                }
            }
        });

        /**
            Check if this BoundingBox contains another BoundingBox

            @method containsBoundingBox
            @param {BoundingBox} bbox The other BoundingBox
            @return {boolean} True if contains the other BoundingBox, false
            otherwise.
         */
        this.containsBoundingBox = function(bbox) {
            return (bbox.x >= x && bbox.x + bbox.width <= x + w && bbox
                .y >= y && bbox.y + bbox.height <= y + h);
        };

        /**
            Check if this BoundingBox contains a point

            @method containsPoint
            @param {BoundingBox} bbox The point
            @return {boolean} True if contains the point, false otherwise
         */
        this.containsPoint = function(point) {
            return point.x >= x && point.x <= x + w && point.y >= y &&
                point.y <= y + h;
        };

        /**
            Check if this BoundingBox instance intersects another
            BoundingBox instance. Based on
            <a href="http://stackoverflow.com/a/13390495/1930331">>this</a>
            StackOverflow answer.
            @method intersects
            @param  {[type]} bbox [description]
            @return {[type]} [description]
         */
        this.intersects = function(bbox) {
            return !(this.x + this.width < bbox.x || bbox.x + bbox.width <
                this.x || this.y + this.height < bbox.y || bbox.y +
                bbox.height < this.y);
        };

        /**
            Get the intersection of this BoundingBox
            and another BoundingBox

            @method intersection
            @param {BoundingBox} bbox Another BoundingBox instance.
            @return {BoundingBox}
         */
        this.intersection = function(bbox) {
            var x1 = Math.max(this.x, bbox.x),
                y1 = Math.max(this.y, bbox.y),
                x2 = Math.min(this.x + this.width, bbox.x +
                    bbox.width),
                y2 = Math.min(this.y + this.height, bbox.y +
                    bbox.height),
                intWidth = x2 - x1,
                intHeight = y2 - y1;
            if (intWidth < 0 || intHeight < 0) {
                return null;
            }
            return new module.exports.BoundingBox(x1, y1, intWidth, intWidth);
        };
    }
};

},{}],17:[function(require,module,exports){
var $ = require('../lib/jquery');

/**
    Factory class to produce HTML elements.

    @class Factory
 */

/**
   @module util/factory
 */
module.exports = {
    /** Construct a canvas. Should be called during/after .

        @method createCanvas
        @static
        @param   {(Object)} options A dictionary of attributes for a new
        HTML canvas.
        @param   {(Object)} cssRules A dictionary of CSS rules for a new
        HTML canvas.
        @return  {JQueryObject} The canvas jQuery object.
     */
    createCanvas: function(options, cssRules) {
        options = options || {};
        cssRules = cssRules || {};
        var width = '1000px',
            height = '600px';
        if (options.width) {
            width = options.width;
            delete options.width;
        }
        if (options.height) {
            height = options.height;
            delete options.height;
        }
        var defaultCss = {
            position: 'absolute',
            top: '50px',
            left: '50px'
        };
        for (var key in defaultCss) {
            if (cssRules[key] === undefined) {
                cssRules[key] = defaultCss[key];
            }
        }
        options.css = cssRules;
        // Must use attr method for width and height and not options
        // or jQuery will default to using CSS for width and height
        return $('<canvas>', options).attr('width', width).attr(
            'height', height).appendTo('body');
    }
};

},{"../lib/jquery":8}],18:[function(require,module,exports){
var _ = require('underscore'),
    Hash = require('./hash'),
    MinHeap = require('./minHeap');

/**
    Graph abstract data structure to represent maze structure.

    @class Graph
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

/**
   @module util/graph
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
       @class Graph
       @constructor
     */
    Graph: function() {
        var _this = this;
        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var nodes = new Hash.Hashset(),
            edges = new Hash.Hashset(),
            adjacencyList = new Hash.Hashtable();


        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        Object.defineProperties(this, {
            nodes: {
                get: function() {
                    return nodes;
                }
            },

            edges: {
                get: function() {
                    return edges;
                }
            },

            adjacencyList: {
                get: function() {
                    return adjacencyList;
                }
            }
        });

        /**
            Inner GraphNode class

            @class GraphNode
            @for Graph
            @constructor
            @param  {[type]} data [description]
         */
        function GraphNode(data) {
            var thisNode = this;
            this.data = data;
            var edges = new Hash.Hashset();
            adjacencyList.put(this, edges);

            Object.defineProperties(this, {
                /**
                    Edges of node

                    @property edges
                    @type {Hashset}
                 */
                edges: {
                    get: function() {
                        return adjacencyList.get(thisNode);
                    }
                },

                /**
                    Neighbors of node

                    @property neighbors
                    @type {Hashset}
                 */
                neighbors: {
                    get: function() {
                        var neighborSet = new Hash.Hashset();
                        thisNode.edges.forEach(function(edge) {
                            neighborSet.add(edge.head);
                        });
                        return neighborSet;
                    }
                }
            });

            /**
                Find all the nodes that are reachable from this node

                @for Graph
                @method reachableNodes
                @return {Hashset} Set of reachable nodes
             */
            this.reachableNodes = function() {
                // Inner helper function
                function reachableNodesHelper(node, set, visitedSet) {
                    if (visitedSet.contains(node)) {
                        return;
                    }
                    set.add(node);
                    node.neighbors.forEach(function(otherNode) {
                        reachableNodesHelper(otherNode, set,
                            visitedSet);
                    });
                }

                // Main code
                var reachableSet = new Hash.Hashset();
                reachableNodesHelper(thisNode, reachableSet,
                    new Hash.Hashset());
                return reachableSet;
            };
        }

        /**
            @class GraphEdge
            @for Graph
            @constructor
            @param {GraphNode} tail Tail node of edge
            @param {GraphNode} head Head node of edge
            @param {number} [weight=0] Weight of edge
            @param {Object} [data=undefined] Data object for edge
         */
        function GraphEdge(tail, head, weight, data) {
            /**
                Tail node of edge

                @property tail
                @type {GraphNode}
             */
            this.tail = tail;

            /**
                Head node of edge

                @property head
                @type {GraphNode}
             */
            this.head = head;

            /**
                Weight of edge

                @property weight
                @type {number}
                @for Graph
             */
            this.weight = weight || 0;

            this.data = data;
        }

        /**
            Add a node to the graph

            @method addNode
            @param   {Object} data Data to be stored in the node
            @return  {GraphNode} A node with the data
         */
        this.addNode = function(data) {
            var node = new GraphNode(data);
            this.nodes.add(node);
            return node;
        };

        /**
            Get a node with the given data

            @method getNode
            @param  {Object} data The data in the desired node
            @return {GraphNode} The desired node
         */
        this.getNode = function(data) {
            var ret;
            this.nodes.forEach(function(node) {
                if (node.data === data) {
                    ret = node;
                    return true;
                }
            });
            return ret;
        };

        /**
            Add an edge to the graph

            @method addEdge
            @param   {GraphNode} tail The origin node of the edge
            @param   {GraphNode} head The destination node of the edge
            @return  {GraphEdge} A directed edge connecting the nodes
         */
        this.addEdge = function(tail, head) {
            var edge = new GraphEdge(tail, head);
            edges.add(edge);
            adjacencyList.get(tail).add(edge);
            return edge;
        };

        /**
            Get edge with given tail and head.

            @method getEdge
            @param  {GraphNode} tail Tail node
            @param  {GraphNode} head Head node
            @return {GraphEdge} If edge exists, the edge, otherwise,
            undefined.
         */
        this.getEdge = function(tail, head) {
            return this.adjacencyList.get(tail).toArray()
                .filter(function(edge) {
                    return edge.head === head;
                })[0];
        };

        /**
            Remove an edge from the graph

            @method removeEdge
            @param   {GraphNode} tail       The origin node of the edge
            @param   {GraphNode} head       The destination node of the edge
            @return  {void}
         */
        this.removeEdge = function(tail, head) {
            var removeEdge;
            tail.edges.forEach(function(edge) {
                if (edge.tail === tail && edge.head === head) {
                    removeEdge = edge;
                    // Terminate iter
                    return true;
                }
            });
            edges.remove(removeEdge);
            tail.edges.remove(removeEdge);
        };

        /**
            Perform a depth first search of the graph

            @method depthFirstSearch
            @param {Function} f The operation to perform on the visited
            nodes
            @return {void}
         */
        this.depthFirstSearch = function(f) {
            // Inner helper function
            function depthFirstSearchHelper(node) {
                if (visitedSet.contains(node)) {
                    return true;
                }
                visitedSet.add(node);
                var doneSearching = f(node);
                if (doneSearching !== true) {
                    var ret;
                    node.neighbors.forEach(function(neighbor) {
                        ret = depthFirstSearchHelper(neighbor) ||
                            ret;
                    });
                    return ret;
                }
                return doneSearching;
            }

            // Main code
            var visitedSet = new Hash.Hashset(),
                doneSearching = false;
            nodes.forEach(function(node) {
                if (doneSearching === true) {
                    return;
                }
                doneSearching = depthFirstSearchHelper(node);
            });
        };

        /**
           Perform a breadth first search on the graph

           @method breadthFirstSearch
           @param {function} f The operation to perform on the visited
           nodes
           @return {void}
         */
        this.breadthFirstSearch = function(f) {
            var visitedSet = new Hash.Hashset(),
                nodeQueue = [],
                nodeQueueIndex = 0;
            nodes.forEach(function(node) {
                nodeQueue.push(node);
            });
            while (nodeQueueIndex < nodeQueue.length) {
                var node = nodeQueue[nodeQueueIndex++],
                    doneSearching = breadthFirstSearchHelper(node);
                if (doneSearching) {
                    return; // Terminate the search
                }
            }
            // Inner helper function
            function breadthFirstSearchHelper(node) {
                if (visitedSet.contains(node)) {
                    return; // Skip this node
                }
                visitedSet.add(node);
                var doneSearching = f(node) || false;
                if (doneSearching !== true) {
                    node.neighbors.forEach(function(neighbor) {
                        nodeQueue.push(neighbor);
                    });
                }
                return doneSearching;
            }
        };

        /**
            Dijkstra's algorithm

            @method dijkstra
            @param  {GraphNode} source Source node
            @return {void}
         */
        this.dijkstra = function(source) {
            nodes.forEach(function(node) {
                node.weight = Infinity;
                node.visited = false;
                // Set node.previous to undefined
                delete node.previous;
            });

            // Distance of source to itself is 0
            source.weight = 0;

            var queue = new MinHeap.MinHeap(function(graphNode1,
                graphNode2) {
                if (isFinite(graphNode1.weight) && isFinite(
                    graphNode2)) {
                    return graphNode1.weight - graphNode2.weight;
                } else if (isFinite(graphNode1)) {
                    return -1;
                } else if (isFinite(graphNode2)) {
                    return 1;
                } else {
                    return 0;
                }
            });
            queue.add(source);

            // Function to use as parameter in forEach function below
            var relaxEdge = function(v) {
                // Assuming all edges have equal distance, the distance
                // between all nodes is 1
                var alt = u.weight + 1;
                if (alt < v.weight) {
                    v.weight = alt;
                    v.previous = u;
                    if (!v.visited) {
                        queue.add(v);
                    }
                }
            };

            while (queue.length !== 0) {
                var u = queue.poll();
                u.visited = true;
                u.neighbors.forEach(relaxEdge);
            }
        };

        /**
            Kruskal's algorithm

            @method kruskal
            @return {Graph} Graph of minimum spanning tree
         */
        this.kruskal = function() {
            var minSpanningTree = new module.exports.Graph(),
                clonedNodesTable = new Hash.Hashtable();

            nodes.forEach(function(node) {
                var nodeClone = minSpanningTree.addNode(node.data);
                clonedNodesTable.put(node, nodeClone);
            });

            var edgeArr = edges.toArray();
            edgeArr.sort(function(edge1, edge2) {
                return edge1.weight - edge2.weight;
            });
            edgeArr.forEach(function(edge) {
                var tailClone = clonedNodesTable.get(edge.tail),
                    tailSet = tailClone.reachableNodes(),
                    headClone = clonedNodesTable.get(edge.head),
                    headSet = headClone.reachableNodes();

                if (!tailSet.equals(headSet)) {
                    minSpanningTree.addEdge(tailClone, headClone);
                }
            });
            return minSpanningTree;
        };
    }
};

},{"./hash":19,"./minHeap":21,"underscore":23}],19:[function(require,module,exports){
var _ = require('underscore');

/**
   Hash class used to generate hashcodes for JavaScript objects. The hashcode
   is stored as a property of the object, but it is set to non-enumerable and
   cannot be changed, thereby guaranteeing the consistency of hashcodes.

   @module util/hash
   @class Hash
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////
var currentHash = 0,
    INIT_CAPACITY = 16,
    LOAD_FACTOR = 0.5;
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
        Return a hashcode for this object. Does not conform to the Java
        standard that two objects that are structurally identical should
        yield the same hashcode.

        @method hashcode
        @static
        @param   {Object} object Object to get hashcode for
        @return  {integer} Hashcode for object
     */
    hashcode: function(object) {
        if (object._hashId === undefined) {
            Object.defineProperty(object, '_hashId', {
                value: currentHash,
                enumerable: false
            });
            currentHash++;
        }
        return object._hashId;
    },

    /**
        Hashset data structure used to store unique objects without
        duplicates. The hashset will add identical items of the same type,
        as long as they are not the exact same object (or the hashcode
        property is identical). For more info, see the {{#crossLink Hash}}
        {{/crossLink}}.

       @class Hashset
    */

    /**
       @class Hashset
       @constructor
     */
    Hashset: function() {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var bucket = new Array(INIT_CAPACITY),
            size = 0,
            capacity = INIT_CAPACITY,
            indicesTaken = [];

        /**
           Resolve a collision in the hashset.

           @method resolveCollision
           @private
           @param  {Object} object
           @param  {integer} index Index where collision occurred
           @return {boolean} Whether or not the item was added to the set
         */
        function resolveCollision(object, index) {
            var location = bucket[index];
            if (_.isArray(location)) {
                if (_.contains(location, object)) {
                    return false;
                } else {
                    location.push(object);
                    return true;
                }
            } else {
                bucket[index] = [location, object];
                return true;
            }
        }
        /**
           Add the index of a location that is currently occupied in the
           array

           @method addIndex
           @private
           @param  {integer} idx Index of occupied location
         */
        function addIndex(idx) {
            // Add idx to the sorted indicesTaken array
            var spot = _.sortedIndex(indicesTaken, idx);
            if (indicesTaken[spot] !== idx) {
                indicesTaken.splice(spot, 0, idx);
            }
        }

        /**
           Helper method to rehash the array when the objects inserted
           exceeds half of the total capacity

           @method rehash
           @private
           @return {void}
         */
        function rehash() {
            // Create new bucket that is double the size
            var
            oldBucket = bucket,
                oldIndices = indicesTaken,
                hashTarget;

            capacity *= 2;
            bucket = new Array(capacity);
            indicesTaken = [];
            // Transfer all elements to new array
            var idxLen = oldIndices.length;
            for (var i = 0; i < idxLen; i++) {
                var object = oldBucket[oldIndices[i]];
                if (_.isArray(object)) {
                    var subArray = object,
                        subArrayLen = subArray.length;
                    for (var j = 0; j < subArrayLen; j++) {
                        var element = subArray[j];
                        hashTarget = element.key || element;
                        insert(element, hashTarget);
                    }
                } else {
                    hashTarget = object.key || object;
                    insert(object, hashTarget);
                }
            }
        }

        /**
           Insert an object into the internal array.

           @method insert
           @private
           @param  {Object} object An object to insert into the array
           @param  {Object} [hashTarget=`object`] An object used to generate
           a hashcode
           @return {boolean} Whether or not the object was inserted into the
           array
         */
        function insert(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            var index = module.exports.hashcode(hashTarget) % capacity,
                location = bucket[index];
            var locKey;
            if (location) {
                locKey = location.key;
            }
            if (location === undefined) {
                bucket[index] = object;
                addIndex(index);
                return true;
            } else if (location === object || originalTarget === locKey) {
                return false;
            } else {
                return resolveCollision(object, index);
            }
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        Object.defineProperties(this, {
            /**
               The size of the Hashset

               @property length
               @type {integer}
             */
            length: {
                get: function() {
                    return size;
                }
            }
        });
        /**
           Add an object

           @method add
           @param   {Object} object Object to add
           @param   {Object} [hashTarget] Object to hash
           @return  {boolean} Whether or not the insertion was successful
         */
        this.add = function(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                object)) {
                return false;
            }
            var inserted = insert(object, hashTarget);
            if (inserted) {
                size++;
                if (size / capacity > LOAD_FACTOR) {
                    rehash();
                }
                return true;
            }
            return false;
        };

        /**
            Get the union of this set with another set

            @method union
            @param  {Hashset} otherSet Other set
            @return {Hashset} Union of both set
         */
        this.union = function(otherSet) {
            var unionSet = new Hash.Hashset();
            _this.forEach(function(elem) {
                unionSet.add(elem);
            });
            otherSet.forEach(function(elem) {
                unionSet.add(elem);
            });
            return unionSet;
        };

        /**
           Clear the Hashset instance of all elements

           @method clear
           @return  {void}
         */
        this.clear = function() {
            bucket = new Array(INIT_CAPACITY);
            size = 0;
            capacity = INIT_CAPACITY;
            indicesTaken = [];
        };

        /**
           Check if an object is an element of this set

           @method contains
           @param   {Object} object An object that may be an element
           @return  {boolean} Whether or not the object is an element
         */
        this.contains = function(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                object)) {
                return false;
            }
            var index = module.exports.hashcode(hashTarget) % capacity,
                location = bucket[index];
            var locKey;
            if (location) {
                locKey = location.key;
            }
            if (location === object || originalTarget === locKey) {
                return true;
            } else if (_.isArray(location)) {
                for (var i = 0; i < location.length; i++) {
                    var elem = location[i];
                    var elemKey;
                    if (elem) {
                        elemKey = elem.key;
                    }
                    if (elem === object || originalTarget === elemKey) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
            Check if this Hashset instance is the same as another
            @method equals
            @param  {Hashset} otherSet Other set to compare with
            @return {boolean} True if equal, false otherwise
         */
        this.equals = function(otherSet) {
            if (this.length !== otherSet.length) {
                return false;
            }

            var result = true;
            this.forEach(function(elem) {
                if (!otherSet.contains(elem)) {
                    result = false;
                    // Terminate iteration
                    return true;
                }
            });
            return result;
        };

        /**
           Remove an object

           @method remove
           @param {Object} object An object
           @return {boolean} True if removed object from set, false if
           object could not be removed from set
         */
        this.remove = function(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                object)) {
                return false;
            }
            var contained = _this.contains(object, originalTarget);
            if (contained) {
                var index = module.exports.hashcode(hashTarget) % capacity,
                    location = bucket[index];
                var locKey;
                if (location) {
                    locKey = location.key;
                }
                if (location === object || locKey === originalTarget) {
                    // Set bucket at index to undefined
                    delete bucket[index];
                    indicesTaken = _.without(indicesTaken, index);
                    size--;
                    return true;
                } else {
                    for (var i = 0; i < location.length; i++) {
                        if (location[i] === object) {
                            // Set location at i to undefined
                            delete location[i];
                            size--;
                            return true;
                        }
                    }
                }
            }
            return false;
        };

        /**
            Get the object from the set
            @method get

            @param  {Object} object Object to get
            @param  {Object} hashTarget Object to hash
            @return {Object} Object from set if it exists, null otherwise.
         */
        this.get = function(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            var index = module.exports.hashcode(hashTarget) % capacity,
                location = bucket[index];
            var locKey;
            if (location) {
                locKey = location.key;
            }
            if (location === undefined) {
                return null;
            } else if (location === object || locKey === originalTarget) {
                return location;
            } else {
                var arrLen = location.length;
                for (var i = 0; i < arrLen; i++) {
                    var element = location[i],
                        elemKey = element.key;
                    if (element === object || elemKey ===
                        originalTarget) {
                        return element;
                    }
                }
                return null;
            }
        };

        /**
            Apply function to each object in Hashset instance

            @method forEach
            @param  {Function} f Function that takes an element of the
            Hashset as a parameter. Function can terminate forEach method by
            returning true.
            @return {void}
         */
        this.forEach = function(f) {
            var numIndices = indicesTaken.length,
                result;

            for (var i = 0; i < numIndices; i++) {
                var idx = indicesTaken[i],
                    current = bucket[idx];
                if (_.isArray(current)) {
                    var arrLen = current.length;
                    for (var j = 0; j < arrLen; j++) {
                        var element = current[j];
                        result = f(element);
                        if (result === true) {
                            return;
                        }
                    }
                } else {
                    result = f(current);
                    if (result === true) {
                        return;
                    }
                }
            }
        };

        /**
            Get the elements in the Hashset instance in an array

            @method toArray
            @return {Array} Array of elements
         */
        this.toArray = function() {
            var arr = [];
            this.forEach(function(elem) {
                arr.push(elem);
            });
            return arr;
        };
    },

    /**
        Hashtable implementation to map objects to other objects.

        @class Hashtable
     */

    /**
        @class Hashtable
        @constructor
     */
    Hashtable: function() {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var hashset = new module.exports.Hashset();

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        /**
            Put new entry in Hashtable

            @method put
            @param  {Object} key Entry key
            @param  {Object} value Entry value
            @return {boolean} True if successfully added new entry, false
            otherwise
         */
        this.put = function(key, value) {
            var entry = {
                key: key,
                value: value
            };
            return hashset.add(entry, key);
        };

        /**
            Get value of entry with given key.

            @method get
            @param  {Object} key Key for entry
            @return {Object} Value of entry
         */
        this.get = function(key) {
            return hashset.get(key, key).value;
        };

        /**
            Check whether or not Hashtable contains a given key

            @method containsKey
            @param  {Object} key The key to check for
            @return {boolean} Whether or not key is in Hashtable
         */
        this.containsKey = function(key) {
            return hashset.contains(key, key);
        };

        /**
            Remove an entry from Hashtable instance
            @method remove
            @param  {Object} key Key of entry to remove
            @return {boolean} Whether or not entry was successfully removed
         */
        this.remove = function(key) {
            return hashset.remove(key, key);
        };

        /**
            Clear all entries from Hashtable instance
            @method clear
            @return {void}
         */
        this.clear = function() {
            hashset.clear();
        };

        /**
            Apply function to each entry in Hashtable instance

            @method forEach
            @param  {Function} f Function that takes entry as parameter.
            Entry has key and value properties.
            @return {void}
         */
        this.forEach = function(f) {
            hashset.forEach(function(entry) {
                f(entry.key, entry.value);
            });
        };

        Object.defineProperties(this, {
            length: {
                get: function() {
                    return hashset.length;
                }
            }
        });
    }
};

},{"underscore":23}],20:[function(require,module,exports){
var _ = require('underscore'),
    BoundingBox = require('./boundingBox');

/**
   Math extensions

   @class MathExtensions
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////
/**
   @module util/mathExtensions
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
       Generate a random integer.

       @method  randomInt
       @static
       @param   {integer} [minimum=0] The minimum for the random integer
       (inclusive)
       @param   {integer} maximum The maximum for the random integer
       (not inclusive)
       @return  {integer} A random integer within the specified range.
     */
    randomInt: function(minimum, maximum) {
        return Math.floor(module.exports.randomFloat.apply(this, arguments));
    },

    /**
       Generate a random float.

       @method randomFloat
       @static
       @param   {float} [minimum=0] The minimum for the random float
       (inclusive)
       @param   {float} maximum The maximum for the random float
       (not inclusive)
       @return  {float} A random float within the specified range.
     */
    randomFloat: function(minimum, maximum) {
        var min, max, range;
        switch (arguments.length) {
            case 1:
                min = 0;
                max = minimum;
                break;
            case 2:
                min = minimum;
                max = maximum;
                break;
        }
        range = max - min;
        return Math.random() * range + min;
    },

    /**
        Iterate randomly from 0 to a given maximum. Stores the range of
        numbers internally inside an array, so do not use with large
        numbers.

        @method randomIterator
        @param  {number} max Maximum (not inclusive)
        @param  {Function} f Function to apply to index. Takes a number as a
        parameter. Function can exit iteration by returning true.
        @return {void}
     */
    randomIterator: function(max, f) {
        var range = [];
        for (var i = 0; i < max; i++) {
            range.push(i);
        }
        while (range.length > 0) {
            var randomIdx = module.exports.randomInt(range.length),
                done = f(range[randomIdx]);
            if (done === true) {
                return;
            }
            range.splice(randomIdx, 1);
        }
    },

    /**
        Get the dot product of two vectors.

        @method dotProduct
        @static
        @param  {Array} vector1 A vector of numbers
        @param  {Array} vector2 A vector of numbers (same length as vector1)
        @return {float} The dot product of the two vectors.
     */
    dotProduct: function(vector1, vector2) {
        var total = 0;
        if (vector1.length !== vector2.length) {
            return null;
        }
        for (var i = 0; i < vector1.length; i += 1) {
            total += vector1[i] * vector2[i];
        }
        return total;
    },

    /**
        Rotation matrix

        @method rotationMatrix
        @param  {number}    angle Counterclockwise angle in radian
        @return {Matrix}    Rotation matrix
     */
    rotationMatrix: function(angle) {
        return new module.exports.Matrix([
            Math.cos(angle), -Math.sin(angle), 0,
            Math.sin(angle), Math.cos(angle), 0,
            0, 0, 1
        ], 3, 3);
    },

    /**
        Build a matrix from a 2d array

        @method buildMatrix
        @static
        @param  {Array}     rows 2d array
        @return {Matrix}    Matrix from 2d array
     */
    buildMatrix: function(rows) {
        var
        numRows = rows.length,
            numColumns = rows[0].length;

        return new module.exports.Matrix(_.flatten(rows), numRows, numColumns);
    },

    /**
        A matrix to represent transformations, etc.

        @class Matrix
        @constructor
        @param {Array} entriesArray An array with all of the values in the
        matrix
        @param {number} numRows Number of rows in the matrix
        @param {number} numRows Number of column in the matrix
    */
    Matrix: function(entriesArray, numRows, numColumns) {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var rows;

        /**
            Add the elements of a matrix to this matrix

            @method addAll
            @private
            @param  {Matrix} matrix      Other matrix
            @param  {number} coefficient Coefficient to multiply elements of
            other matrix before addition
            @return {Matrix} Result of addition
         */
        function addAll(matrix, coefficient) {
            var newEntries = [];
            if (_this.numRows !== matrix.numRows || _this.numColumns !==
                matrix.numColumns) {
                return null;
            }
            _this.forEachEntry(function(entry, row, column) {
                var sum = entry + coefficient * matrix.get(row,
                    column);
                newEntries.push(sum);
            });
            return new module.exports.Matrix(newEntries, _this.numRows,
                _this.numColumns);
        }

        /**
            Generate rows of the matrix

            @method generateRows
            @private
            @return {void}
         */
        function generateRows() {
            // Store the matrix in a 2d array.
            rows = [];
            for (var i = 0; i < _this.numRows; i += 1) {
                var row = [];
                for (var j = 0; j < _this.numColumns; j += 1) {
                    row.push(entriesArray[i * _this.numColumns + j]);
                }
                rows.push(row);
            }
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        this.numRows = numRows;
        this.numColumns = numColumns;

        /**
            Apply a function to each element in the matrix (in order)

            @method forEachEntry
            @param  {Function} f Function that takes element as parameter
            @return {void}
         */
        this.forEachEntry = function(f) {
            for (var i = 0; i < numRows; i += 1) {
                for (var j = 0; j < numColumns; j += 1) {
                    f(rows[i][j], i, j);
                }
            }
        };

        /**
            Get an element from the matrix

            @method get
            @param  {integer} row Index of the row to select
            @param  {integer} column Index of the column to select
            @return {number} Number at row and column
         */
        this.get = function(row, column) {
            return rows[row][column];
        };

        /**
            Get an element from the matrix

            @method set
            @param  {integer} row Index of the row to select
            @param  {integer} column Index of the column to select
            @param  {number}  value Number at row and column
            @return {void}
         */
        this.set = function(row, column, value) {
            rows[row][column] = value;
        };

        /**
            Get a row from the matrix

            @method getRow
            @param  {integer}  rowIndex Index of row
            @return {Array} Row as array
         */
        this.getRow = function(rowIndex) {
            // Return a clone of the row.
            return rows[rowIndex].slice(0);
        };

        /**
            Get a column from the matrix

            @method getColumn
            @param  {integer} columnIndex Index of column
            @return {Array} Column as array
         */
        this.getColumn = function(columnIndex) {
            var column = [];
            for (var i = 0; i < _this.numRows; i += 1) {
                column.push(rows[i][columnIndex]);
            }
            return column;
        };

        /**
            Get a 2d array representing the matrix

            @method toArray2D
            @return {Array} 2d array of matrix
         */
        this.toArray2D = function() {
            var arr = [];
            this.forEachEntry(function(entry, i, j) {
                while (i >= arr.length) {
                    arr.push([]);
                }
                arr[i].push(entry);
            });
            return arr;
        };

        /**
            Add this matrix with another matrix

            @method add
            @param  {Matrix} matrix Another matrix
            @return {Matrix} The resulting matrix
         */
        this.add = function(matrix) {
            return addAll(matrix, 1);
        };

        /**
            Subtract another matrix from this matrix

            @method subtract
            @param  {Matrix} matrix Another matrix
            @return {Matrix} The resulting matrix
         */
        this.subtract = function(matrix) {
            return addAll(matrix, -1);
        };

        /**
            Multiply this matrix with another matrix

            @method multiply
            @param  {Matrix} matrix Another matrix
            @return {Matrix} The resulting matrix
         */
        this.multiply = function(matrix) {
            var newEntries = [],
                vector1, vector2, dotProduct;
            if (_this.numColumns !== matrix.numRows) {
                return null;
            }
            for (var i = 0; i < _this.numRows; i += 1) {
                vector1 = _this.getRow(i);
                for (var j = 0; j < matrix.numColumns; j += 1) {
                    vector2 = matrix.getColumn(j);
                    dotProduct = module.exports.dotProduct(vector1, vector2);
                    newEntries.push(dotProduct);
                }
            }
            return new module.exports.Matrix(newEntries, this.numRows,
                matrix.numColumns);
        };

        /**
            Multiply the matrix by a coefficient

            @method multiplyCoefficient
            @param  {number} k Coefficient
            @return {Matrix} New matrix multiplied by coefficient
         */
        this.multiplyCoefficient = function(k) {
            var newEntries = [];
            this.forEachEntry(function(entry, i, j) {
                newEntries.push(entry * k);
            });
            return new module.exports.Matrix(newEntries, this.numRows,
                this.numRows);
        };

        /**
            LU Decomposition (only for square matrices). Based on
            <a href="http://rosettacode.org/wiki/LU_decomposition#Python">
            this</a> article.

            @method luDecomposition
            @return {Object} Lower, upper, and pivot matrices in hash with
            keys l, u, and p respectively
         */
        this.luDecomposition = function() {
            // Inner helper functio
            function pivotize() {
                var
                n = _this.numRows,
                    id = [],
                    maxIter = function(i) {
                        return _this.get(i, j);
                    };

                for (var j = 0; j < n; j++) {
                    id.push([]);
                    for (var i = 0; i < n; i++) {
                        id[j].push((i === j ? 1 : 0));
                    }
                }
                for (j = 0; j < n; j++) {
                    var row = _.max(_.range(j, n), maxIter);
                    if (j !== row) {
                        var tmp = id[j];
                        id[j] = id[row];
                        id[row] = tmp;
                    }
                }
                return module.exports.buildMatrix(id);
            }

            // Main function
            var n = _this.numRows,
                l = [],
                u = [],
                p = pivotize(),
                i, j, k;
            var a2 = p.multiply(_this).toArray2D();
            for (i = 0; i < n; i++) {
                l.push([]);
                u.push([]);
                for (j = 0; j < n; j++) {
                    l[i].push(0);
                    u[i].push(0);
                }
            }
            for (j = 0; j < n; j++) {
                l[j][j] = 1;
                for (i = 0; i <= j; i++) {
                    var s1 = 0;
                    for (k = 0; k < i; k++) {
                        s1 += u[k][j] * l[i][k];
                    }
                    u[i][j] = a2[i][j] - s1;
                }
                for (i = j; i < n; i++) {
                    var s2 = 0;
                    for (k = 0; k < j; k++) {
                        s2 += u[k][j] * l[i][k];
                    }
                    l[i][j] = (a2[i][j] - s2) / u[j][j];
                }
            }
            return {
                l: module.exports.buildMatrix(l),
                u: module.exports.buildMatrix(u),
                p: p
            };
        };

        /**
            Get the determinant of the matrix (must be a square matrix)

            @method determinant
            @return {number}    The determinant
         */
        this.determinant = function() {
            var luDec = this.luDecomposition(),
                l = luDec.l,
                u = luDec.u,
                p = luDec.p,
                det = 1;

            for (var i = 0; i < this.numRows; i++) {
                det *= l.get(i, i) * u.get(i, i) * p.get(i, i);
            }

            return det;
        };

        /**
            Get the inverse of the matrix (must be a square matrix)

            @method inverse
            @return {Matrix}    The inverse matrix
         */
        this.inverse = function() {
            if (this.numRows === 3) {
                var
                a = this.get(0, 0),
                    b = this.get(0, 1),
                    c = this.get(0, 2),
                    d = this.get(1, 0),
                    e = this.get(1, 1),
                    f = this.get(1, 2),
                    g = this.get(2, 0),
                    h = this.get(2, 1),
                    i = this.get(2, 2),
                    det = a * (e * i - f * h) - b * (i * d - f * g) +
                        c * (d * h - e * g),
                    inv = new module.exports.Matrix([
                        (e * i - f * h), -(b * i - c * h), (b * f -
                            c * e),
                        -(d * i - f * g), (a * i - c * g), -(a * f - c * d),
                        (d * h - e * g), -(a * h - b * g), (a * e -
                            b * d)
                    ], 3, 3);
                return inv.multiplyCoefficient(1 / det);
            } else {
                // TODO: n by n matrix inverse
            }
        };

        // Call generateRows to do setup
        generateRows();
    },

    /**
        Transformation matrix class

        @class Transformation
        @constructor
     */
    Transformation: function() {
        var _this = this;

        ////////////////////////////
        // Private fields/methods //
        ////////////////////////////

        var
        matrix = new module.exports.Matrix([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ], 3, 3),
            angle = 0;

        ///////////////////////////
        // Public fields/methods //
        ///////////////////////////

        Object.defineProperties(this, {
            /**
                Translation in x

                @property tx
                @type {number}
             */
            tx: {
                get: function() {
                    return matrix.get(0, 2);
                },
                set: function(value) {
                    matrix.set(0, 2, value);
                }
            },

            /**
                Translation in y

                @property ty
                @type {number}
             */
            ty: {
                get: function() {
                    return matrix.get(1, 2);
                },
                set: function(value) {
                    matrix.set(1, 2, value);
                }
            },

            /**
                Scale in x

                @property sx
                @type {number}
             */
            sx: {
                get: function() {
                    return matrix.get(0, 0);
                },
                set: function(value) {
                    matrix.set(0, 0, value);
                }
            },

            /**
                Scale in y

                @property sy
                @type {number}
             */
            sy: {
                get: function() {
                    return matrix.get(1, 1);
                },
                set: function(value) {
                    matrix.set(1, 1, value);
                }
            },

            /**
                Shear in x

                @property x
                @type {number}
             */
            shx: {
                get: function() {
                    return matrix.get(0, 1);
                },
                set: function(value) {
                    matrix.set(0, 1, value);
                }
            },

            /**
                Shear in y

                @property y
                @type {number}
             */
            shy: {
                get: function() {
                    return matrix.get(1, 0);
                },
                set: function(value) {
                    matrix.set(1, 0, value);
                }
            },

            /**
                Angle of rotation (counterclockwise in radian)

                @property angle
                @type {number}
             */
            angle: {
                get: function() {
                    return angle;
                },
                set: function(newAngle) {
                    // Subtract current angle to reset and add new angle
                    this.rotate(-angle + newAngle);
                }
            }
        });

        /**
            Translate matrix from its current position

            @method translate
            @param  {number}  dx x offset
            @param  {number}  dy y offset
            @return {void}
         */
        this.translate = function(dx, dy) {
            matrix.set(0, 2, dx);
            matrix.set(1, 2, dy);
        };

        /**
            Rotate matrix

            @method rotate
            @param  {number} rotateAngle Counterclockwise angle in radian
            @return {void}
         */
        this.rotate = function(rotateAngle) {
            angle = (angle + rotateAngle) % (Math.PI * 2);
            var rotationMatrix = module.exports.rotationMatrix(rotateAngle);
            matrix = matrix.multiply(rotationMatrix);
        };

        /**
            Apply this transformation to a point

            @method applyToPoint
            @param  {Point}     point Point to apply transformation to
            @return {Point}     New point with transformation applied
         */
        this.applyToPoint = function(point) {
            var
            coords = new module.exports.Matrix([point.x, point.y, 1], 3, 1),
                newCoords = matrix.multiply(coords),
                x = newCoords.get(0, 0),
                y = newCoords.get(1, 0);
            return {
                x: x,
                y: y
            };
        };

        /**
            Apply the inverse of the transformation to a point to do
            collision detection

            @method adjustPoint
            @param  {Point}    point Point to apply transformation to
            @return {Point}    A new point with the transformation
         */
        this.adjustPoint = function(point) {
            var
            coords = new module.exports.Matrix([point.x, point.y, 1], 3, 1),
                newCoords = matrix.inverse().multiply(coords),
                x = newCoords.get(0, 0),
                y = newCoords.get(1, 0);
            return {
                x: x,
                y: y
            };
        };
    }
};

},{"./boundingBox":16,"underscore":23}],21:[function(require,module,exports){
//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////
var DEFAULT_SIZE = 16;
/**
   @module util/minHeap
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////
    /**
       @class MinHeap
       @constructor
       @param {Function|number} [arg1=numeric_comparator|16] Comparator function (if one argument) or size (if two arguments)
       @param {Function} [arg2=numeric_comparator] Comparator function
     */
    MinHeap: function() {
        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var size = DEFAULT_SIZE,
            comparator = function(data1, data2) {
                return data1 - data2;
            };
        if (arguments.length === 2) {
            // parameters are size then comparator
            size = arguments[0];
            comparator = arguments[1];
        } else if (arguments.length === 1) {
            comparator = arguments[0];
        } else if (arguments.length > 2) {
            throw new Error(
                'Invalid parameters for MinHeap constructor');
        }
        var _this = this,
            data = new Array(size),
            heapSize = 0;

        /**
            Get index in array of left child

            @method getLeftChildIndex
            @private
            @param  {number} nodeIndex Index of parent
            @return {number} Index of left child in array
         */
        function getLeftChildIndex(nodeIndex) {
            return 2 * nodeIndex + 1;
        }

        /**
            Get index in array of right child

            @method getRightChildIndex
            @private
            @param  {number} nodeIndex Index of parent
            @return {number} Index of right child in array
         */
        function getRightChildIndex(nodeIndex) {
            return 2 * nodeIndex + 2;
        }

        /**
            Get index of parent

            @method getParentIndex
            @private
            @param  {number} nodeIndex Index of child
            @return {number} Index of parent
         */
        function getParentIndex(nodeIndex) {
            return Math.floor((nodeIndex + 1) / 2) - 1;
        }

        /**
            Heapify

            @method bubbleUp
            @private
            @param  {number} nodeIndex Index to bubbleUp
            @return {void}
         */
        function bubbleUp(nodeIndex) {
            if (nodeIndex === 0) {
                return;
            }
            var parentIndex = getParentIndex(nodeIndex);
            if (comparator(data[parentIndex], data[nodeIndex]) > 0 &&
                parentIndex >= 0) {
                var newNodeIndex = data[parentIndex];
                data[parentIndex] = data[nodeIndex];
                data[nodeIndex] = newNodeIndex;
                nodeIndex = parentIndex;
                bubbleUp(nodeIndex);
            } else {
                return;
            }
        }

        /**
            Remove minimum element from heap

            @method removeMin
            @private
            @return {Object} Data of minimum node
         */
        function removeMin() {
            if (heapSize === 0) {
                return;
            }
            data[0] = data[heapSize - 1];
            heapSize--;
            if (heapSize > 0) {
                bubbleDown(0);
            }
        }

        /**
            Heapify

            @method bubbleDown
            @private
            @param  {number} nodeIndex Index of node to modify
            @return {void}
         */
        function bubbleDown(nodeIndex) {
            var leftChildIndex = getLeftChildIndex(nodeIndex),
                rightChildIndex = getRightChildIndex(nodeIndex),
                smallerValueIndex;
            // This long if else assigns the smaller child
            if (leftChildIndex < heapSize && rightChildIndex < heapSize) {
                if (comparator(data[leftChildIndex], data[
                    rightChildIndex]) < 0) {
                    smallerValueIndex = leftChildIndex;
                } else {
                    smallerValueIndex = rightChildIndex;
                }
            } else if (leftChildIndex < heapSize) {
                smallerValueIndex = leftChildIndex;
            } else if (rightChildIndex < heapSize) {
                smallerValueIndex = rightChildIndex;
            } else {
                return;
            }
            if (smallerValueIndex >= 0 && comparator(data[
                smallerValueIndex], data[nodeIndex]) < 0) {
                var temp = data[nodeIndex];
                data[nodeIndex] = data[smallerValueIndex];
                data[smallerValueIndex] = temp;
                nodeIndex = smallerValueIndex;
                bubbleDown(nodeIndex);
            }
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        /**
            Add object to MinHeap

            @method add
            @param  {Object} object Object to add
            @return {void}
         */
        this.add = function(object) {
            heapSize++;
            var currentIndex = heapSize - 1;
            data[currentIndex] = object;
            bubbleUp(currentIndex);
        };

        /**
            Return the minimum element and extract it

            @method poll
            @return {Object} The minimum element
         */
        this.poll = function() {
            var min = data[0];
            removeMin();
            return min;
        };

        /**
            Return the minimum element without extracting it

            @method peek
            @return {Object} The minimum element
         */
        this.peek = function() {
            return data[0];
        };

        /**
            Clear the MinHeap of all elements

            @method clear
            @return {void}
         */
        this.clear = function() {
            heapSize = 0;
            data.forEach(function(element, index) {
                delete data[index];
            });
        };

        Object.defineProperties(this, {
            /**
                Number of elements in the MinHeap

                @property length
                @type {number}
             */
            length: {
                get: function() {
                    return heapSize;
                }
            }
        });
    }
};

},{}],22:[function(require,module,exports){
//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////
/**
   @module util/physics
 */
module.exports = {
    /**
        Physics engine

        @constructor
        @class Engine
        @param  {Array} [objects=[]] An array of objects to control
     */
    Engine: function(objects) {
        var _this = this;

        ///////////////////////////
        // Public methods/fields //
        ///////////////////////////

        this.objects = objects || [];

        /**
            Check shapes for collisions with point

            @method collisionQuery
            @param  {Point} point Point to test for
            @return {Array} Array of objects with bounding boxes that contain
            the given point
         */
        this.collisionQuery = function(point) {
            return this.objects.filter(function(obj) {
                return obj.boundingBox.containsPoint(point);
            });
        };

        /**
            Notify the Engine instance that a change in positions occurred

            @method updatePositions
            @return {void}
         */
        this.updatePositions = function() {
            this.objects.forEach(function(obj) {
                if (obj.checkCollision !== undefined) {
                    var candidates = _this.objects.filter(function(
                        candidate) {
                        return candidate !== obj &&
                            candidate.boundingBox.intersects(obj.boundingBox);
                    });
                    if (candidates.length > 0) {
                        obj.checkCollision(candidates);
                    }
                }
            });
        };
    }
};

},{}],23:[function(require,module,exports){
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the 
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from an array.
  // If **n** is not specified, returns a single random element from the array.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (arguments.length < 2 || guard) {
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

},{}]},{},[9])
}(self));
