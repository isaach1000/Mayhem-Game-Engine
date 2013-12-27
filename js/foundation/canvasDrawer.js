define(['underscore', 'util/mathExtensions'], function(_, MathExtensions) {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    
    /**
       @module foundation/canvasDrawer
     */
    var module = {
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
                   lineWidth, fillStyle, and strokeStyle.

                   @property contextSettings
                   @type {Object}
                 */
                contextSettings: {
                    get: function() {
                        return ctxSettings;
                    },
                    set: function(settings) {
                        var VALID_SETTINGS = ['lineWidth', 'fillStyle',
                            'strokeStyle'
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
    return module;
});
