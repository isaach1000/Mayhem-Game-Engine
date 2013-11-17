
define(['underscore'], function(_) {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    
    /**
     * @exports foundation/canvasDrawer
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        
        /**
         * CanvasDrawer for drawing to a canvas.
         *
         * @constructor
         * @param {Context} ctx         - Context of canvas
         * @param {float} width         - Width of canvas
         * @param {float} height        - Height of canvas
         */
        CanvasDrawer: function(ctx, width, height) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            
            var that = this,
                ctxSettings;
            
            
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            Object.defineProperties(that, {
                /**
                 * Width of the canvas
                 * @type {float}
                 * @memberof module:foundation/canvasDrawer.CanvasDrawer
                 * @instance
                 */
                width: {
                    get: function() {
                        return width;
                    }
                },

                /**
                 * Height of the canvas
                 * @type {float}
                 * @memberof module:foundation/canvasDrawer.CanvasDrawer
                 * @instance
                 */
                height: {
                    get: function() {
                        return height;
                    }
                },

                /**
                 * Properties of the context. Valid settings include:
                 * lineWidth, fillStyle, and strokeStyle.
                 * @type {Object}
                 * @memberof module:foundation/canvasDrawer.CanvasDrawer
                 * @instance
                 */
                contextSettings: {
                    get: function() {
                        return ctxSettings;
                    },
                    set: function(settings) {
                        var VALID_SETTINGS = ['lineWidth', 'fillStyle', 'strokeStyle'], success = true, property;
                        for (property in settings) {
                            if (settings.hasOwnProperty(property)) {
                                success = (success && _.contains(VALID_SETTINGS, property));
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
             * Draw a line between two points
             * @param {(float|Point)} point1        -   x coordinate of the first point, or the first point
             * @param {(float|Point)} point2        -   y coordinate of the first point, or the second point
             * @param {boolean} [moveFirst=false]   -   If true, uses moveTo metho.
             * @return {void}
             */
            that.drawLine = function(point1, point2, moveFirst) {
                if (moveFirst) {
                    ctx.moveTo(point1.x, point1.y);
                }
                ctx.lineTo(point2.x, point2.y);
            };

            /**
             * Wrapper for <code>context.stroke</code>
             * @return {void}
             */
            that.stroke = function() {
                ctx.stroke();
            };

            /**
             * Wrapper for <code>context.fill</code>
             * @return {void}
             */
            that.fill = function() {
                ctx.fill();  
            };

            /**
             * Wrapper for <code>context.beginPath</code>
             * @return {void}
             */
            that.beginPath = function() {
                ctx.beginPath();
            };

            /**
             * Wrapper for <code>context.closePath</code>
             * @return {void}
             */
            that.closePath = function() {
                ctx.closePath();
            };
          
            /**
             * Wrapper for <code>context.rect</code>
             * @param  {float}  x   x coordinate
             * @param  {float}  y   y coordinate
             * @param  {float}  w   Width of rectangle
             * @param  {float}  h   Height of rectangle
             * @return {void}
             */
            that.rect = function(x, y, w, h) {
                ctx.rect(x, y, w, h);
            };

            /**
             * Wrapper for <code>context.arc</code>
             * @param  {float}      x          x coordinate
             * @param  {float}      y          y coordinate
             * @param  {float}      radius     Radius of arc
             * @param  {float}      startAngle Start angle of arc
             * @param  {float}      endAngle   End angle of arc
             * @param  {boolean}    ccw        Move counterclockwise
             * @return {void}
             */
            that.arc = function(x, y, radius, startAngle, endAngle, ccw) {
                ctx.arc(x, y, radius, startAngle, endAngle, ccw);
            };

            /**
             * Wrapper for <code>context.clearRect</code>
             * @param  {float} x - Minimum x of area.
             * @param  {float} y - Minimum y of area.
             * @param  {float} width  - Width of area.
             * @param  {float} height - Height of area.
             * @return {void}
             */
            that.clearRect = function(x, y, width, height) {
                ctx.clearRect(x, y, width, height);
            };

            that.clearCanvas = function() {
                that.clearRect(0, 0, that.width, that.height);
            };

            /**
             * Wrapper for <code>context.save</code>
             * @return {void}
             */
            that.save = function() {
                ctx.save();
            };

            /**
             * Wrapper for <code>context.restore</code>
             * @return {void}
             */
            that.restore = function() {
                ctx.restore();
            };

            /**
             * Wrapper for <code>context.translate</code>
             * @param  {float} x    - x coordinate of destination
             * @param  {float} y    - y coordinate of destination
             * @return {void}
             */
            that.translate = function(x, y) {
                ctx.translate(x, y);
            };

            /**
             * Wrapper for <code>context.fillRect</code>
             * @param  {float} x    -   x coordinate of top-left of rectangle
             * @param  {float} y    -   y coordinate of top-left of rectangle
             * @param  {float} w    -   Width of rectangle
             * @param  {float} h    -   Height of rectangle
             * @return {void}
             */
            that.fillRect = function(x, y, w, h) {
                ctx.fillRect(x, y, w, h);
            };
            
            /**
             * Wrapper for <code>context.strokeRect</code>
             * @param  {float} x    - x coordinate of top-left of rectangle
             * @param  {float} y    - y coordinate of top-left of rectangle
             * @param  {float} w    - Width of rectangle
             * @param  {float} h    - Height of rectangle
             * @return {void}
             */
            that.strokeRect = function(x, y, w, h) {
                ctx.strokeRect(x, y, w, h);
            };

            /**
             * Wrapper for <code>context.getImageData</code>
             * @param  {float} x        - x coordinate of top-left of image
             * @param  {float} y        - y coordinate of top-left of image
             * @param  {float} width    - Width of image
             * @param  {float} height   - Height of image
             * @return {Array}          Image data
             */
            that.getImageData = function(x, y, w, h) {
                return ctx.getImageData(x, y, w, h);
            };

            /**
             * Wrapper for <code>context.putImageData</code>
             * @param  {Array} imageData    - Image data
             * @param  {float} x            - x coordinate of top-left of image
             * @param  {float} y            - y coordinate of top-left of image
             * @return {void}
             */
            that.putImageData = function(imageData, x, y) {
                ctx.putImageData(imageData, x, y);
            };
        }
    };

    return module; 
});