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
            
            // Preserve 'this' keyword
            var _this = this;

            // Make floats into integers
            x = Math.round(x);
            y = Math.round(y);
            width = Math.round(width);
            height = Math.round(height);
            
            // Make drawingSettings immutable
    		Object.freeze(drawingSettings);

            var bbox = new BoundingBox.BoundingBox(x, y, width, height);

            
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            Object.defineProperties(this, {
                /**
                 * x coordinate of top-left of Shape instance
                 * @type {integer}
                 * @memberof module:foundation/shape.Shape
                 * @instance
                 */
                x: {
                    get: function() {
                        return x;
                    },
                    set: function(newX) {
                        x = Math.round(newX);
                        this.boundingBox.x = x;
                    }
                },

                /**
                 * y coordinate of top-left of Shape instance
                 * @type {integer}
                 * @memberof module:foundation/shape.Shape
                 * @instance
                 */
                y: {
                    get: function() {
                        return y;
                    },
                    set: function(newY) {
                        y = Math.round(newY);
                        this.boundingBox.y = y;
                    }
                },

                /**
                 * Width of Shape instance
                 * @type {integer}
                 * @memberof module:foundation/shape.Shape
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
                 * @memberof module:foundation/shape.Shape
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
                 * @memberof module:foundation/shape.Shape
                 * @instance
                 */
                boundingBox: {
                    get: function() {
                        return bbox;
                    }
                },

                /** 
                 * Drawing settings of Shape instance
                 * @memberof module:foundation/shape.Shape
                 * @instance
                 * @return {void}
                 */
                drawingSettings: {
                    get: function() {
                        return drawingSettings;
                    },
                    set: function(newSettings) {
                        drawingSettings = newSettings;
                    	Object.freeze(drawingSettings); 
                        this.clear();
                        this.draw();
                        Object.freeze(drawingSettings);
                    }
                }
            });

			/**
			 * Draw the shape onto the canvas.
             * @memberof module:foundation/shape.Shape
			 * @return {void}
			 */
            this.draw = function() {
            	// Call subclass method if exists.
                if (this.drawShape != null) {
                    this.drawShape(drawer);
                }
                // TODO: remove debug drawing bbox
                this.drawBoundingBox();
            };

            /**
             * Clear the shape.
             * @memberof module:foundation/shape.Shape
             * @return {void}
             */
            this.clear = function() {
                drawer.clearRect(this.x, this.y, this.width, this.height);
            };
            
            this.drawBoundingBox = function() {
            	var x = this.boundingBox.x,
            		y = this.boundingBox.y,
            		w = this.boundingBox.width,
            		h = this.boundingBox.height,
            		lineWidth = this.drawingSettings.lineWidth || 0;
            	drawer.strokeRect(x + lineWidth, y + lineWidth,
            			w - 2 * lineWidth, h - 2 * lineWidth);
            };
            
            this.collisionTest = function(point) {
            	// Return result of subclass's test.
           		return this.hitTest(point);
            };
        }
    };

    return module; 
});
