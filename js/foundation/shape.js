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
                            bbox = new BoundingBox.BoundingBox(x, y,
                                width, height);
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
                            bbox = new BoundingBox.BoundingBox(x, y,
                                width, height);
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
                    }
                }
            });

            /**
             * Clear and draw Shape onto canvas
             * @return {void}
             */
            this.update = function() {
                this.clear();
                this.draw();
            };

            /**
             * Draw Shape instance onto the canvas
             * @return {void}
             */
            this.draw = function() {
                if (this.drawingSettings.angle !== undefined) {
                    drawer.save();
                    drawer.rotate(this.drawingSettings.angle);
                }

                // Call subclass method if exists.
                if (this.drawShape !== undefined) {
                    this.drawShape(drawer);
                }

                if (this.drawingSettings.angle !== undefined) {
                    drawer.restore();
                }
            };

            /**
             * Clear the Shape instance
             * @return {void}
             */
            this.clear = function() {
                if (this.drawingSettings.angle !== undefined) {
                    drawer.save();
                    drawer.rotate(this.drawingSettings.angle);
                }

                var lineWidth = this.drawingSettings.lineWidth || 1;
                drawer.clearRect(this.x, this.y,
                    this.width + lineWidth, this.height + lineWidth);

                if (this.drawingSettings.angle !== undefined) {
                    drawer.restore();
                }
            };

            /**
             * Draw BoundingBox of Shape instance
             * @return {void}
             */
            this.drawBoundingBox = function() {
                if (this.drawingSettings.angle !== undefined) {
                    drawer.save();
                    drawer.rotate(this.drawingSettings.angle);
                }
                var x = _this.boundingBox.x,
                    y = _this.boundingBox.y,
                    w = _this.boundingBox.width,
                    h = _this.boundingBox.height,
                    lineWidth = _this.drawingSettings.lineWidth || 1;
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
