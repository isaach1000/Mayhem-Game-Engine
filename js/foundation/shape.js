
define([
        'foundation/canvasDrawer',
        'util/boundingBox',
        'util/factory'
    ], function(CanvasDrawer,
        BoundingBox,
        Factory) {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    
    
    /**
     * @exports foundation/shape
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        
        /**
         * Shape abstract class
         * @constructor
         * @param {float} x                     x coordinate of top-left
         * @param {float} y                     y coordinate of top-left
         * @param {float} width                 Width of shape
         * @param {float} height                Height of shape
         * @param {CanvasDrawer} drawer         CanvasDrawer to draw image to canvas
         * @param {Object} drawingSettings      Settings for the CanvasDrawer
         */
        Shape: function(x, y, width, height, drawer, drawingSettings) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            
            var _this = this,
                bbox;

            // Make floats into integers
            x = Math.round(x);
            y = Math.round(y);
            width = Math.round(width);
            height = Math.round(height);

            bbox = new BoundingBox.BoundingBox(x, y, width, height);

            
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            Object.defineProperties(this, {
                /**
                 * x coordinate of top-left of Shape instance
                 * @type {integer}
                 * @memberOf module:foundation/shape.Shape
                 * @instance
                 */
                x: {
                    get: function() {
                        return x;
                    },
                    set: function(newX) {
                        x = Math.round(newX);
                        _this.boundingBox.x = x;
                    }
                },

                /**
                 * y coordinate of top-left of Shape instance
                 * @type {integer}
                 * @memberOf module:foundation/shape.Shape
                 * @instance
                 */
                y: {
                    get: function() {
                        return y;
                    },
                    set: function(newY) {
                        y = Math.round(newY);
                        _this.boundingBox.y = y;
                    }
                },

                /**
                 * Width of Shape instance
                 * @type {integer}
                 * @memberOf module:foundation/shape.Shape
                 * @instance
                 */
                width: {
                    get: function() {
                        return width;
                    },
                    set: function(newWidth) {
                        newWidth = Math.round(newWidth);
                        if (newWidth !== width) {
                            width = newWidth;
                            bbox = new BoundingBox.BoundingBox(x, y, width, height);
                        }
                    }
                },

                /**
                 * Height of Shape instance
                 * @type {integer}
                 * @memberOf module:foundation/shape.Shape
                 * @instance
                 */
                height: {
                    get: function() {
                        return height;
                    },
                    set: function(newHeight) {
                        newHeight = Math.round(newHeight);
                        if (newHeight !== height) {
                            height = newHeight;
                            bbox = new BoundingBox.BoundingBox(x, y, width, height);
                        }
                    }
                },

                /**
                 * BoundingBox of Shape instance
                 * @type {BoundingBox}
                 * @memberOf module:foundation/shape.Shape
                 * @instance
                 */
                boundingBox: {
                    get: function() {
                        return bbox;
                    }
                },

                /** 
                 * Drawing settings of Shape instance
                 * @type {Object}
                 * @memberOf module:foundation/shape.Shape
                 * @instance
                 * @return {void}
                 */
                drawingSettings: {
                    get: function() {
                        return drawingSettings;
                    },
                    set: function(newSettings) {
                        drawingSettings = newSettings;
                        // TODO: approve settings (update?)
                    }
                }
            });
            
            /**
             * Clear and draw Shape onto canvas
             * @return {void}
             */
            this.update = function() {
                _this.clear();
                _this.draw();
            };

            /**
             * Draw Shape instance onto the canvas
             * @return {void}
             */
            this.draw = function() {
                // Call subclass method if exists.
                if (_this.drawShape !== undefined) {
                    _this.drawShape(drawer);
                }
            };

            /**
             * Clear the Shape instance
             * @return {void}
             */
            this.clear = function() {
                drawer.clearRect(_this.x, _this.y, _this.width, _this.height);
            };
            
            /**
             * Draw BoundingBox of Shape instance
             * @return {void}
             */
            this.drawBoundingBox = function() {
                var x = _this.boundingBox.x,
                    y = _this.boundingBox.y,
                    w = _this.boundingBox.width,
                    h = _this.boundingBox.height,
                    lineWidth = _this.drawingSettings.lineWidth || 0;
                drawer.strokeRect(x + lineWidth, y + lineWidth,
                        w - 2 * lineWidth, h - 2 * lineWidth);
            };
            
            this.collisionTest = function(point) {
                // Return result of subclass's test.
                return _this.hitTest(point);
            };
        }
    };

    return module; 
});
