define([
        'underscore',
        'util/boundingBox'
    ], function(_, BoundingBox) {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    
    
    /**
     * @exports sprite/sprite
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        
        /**
         * Sprite
         * @constructor
         */
        Sprite: function(shapes, drawer, drawingSettingsArr) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            
            var that = this,
                boundingBox;
            
            shapes = shapes || [];
            
            
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            Object.defineProperties(that, {
                /**
                 * Shapes of Sprite instance
                 * @memberOf module:sprite/sprite.Sprite
                 * @instance
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
                 * BoundingBox of Sprite instance
                 * @memberOf module:sprite/sprite.Sprite
                 * @instance
                 */
                boundingBox: {
                    get: function() {
                        if (boundingBox === undefined) {
                            that.updateBoundingBox();
                        }
                        return boundingBox;
                    },
                    set: function(newBbox) {
                        boundingBox = newBbox;
                    }
                },
                
                /**
                 * Drawing settings of Sprite instance
                 * @memberOf module:sprite/sprite.Sprite
                 * @instance
                 */
                drawingSettings: {
                    get: function() {
                        return drawingSettingsArr;
                    },
                    set: function(newDrawingSettingsArr) {
                        if (!_.isEqual(drawingSettingsArr,
                                newDrawingSettingsArr) ||
                            (!_.isArray(newDrawingSettingsArr) &&
                            !_.isObject(newDrawingSettingsArr))) {
                            return;
                        }
                        
                        if (!_.isArray(newDrawingSettingsArr)) {
                            newDrawingSettingsArr = [newDrawingSettingsArr];
                        }
                        drawingSettingsArr = newDrawingSettingsArr;
                    }
                }
            });

            /**
             * Iterator function
             * @param {Function} f      -   A function that takes a Shape instance as a parameter.
             * @return {void}
             */
            that.forEachShape = function(f) {
                var numShapes = that.shapes.length, i, shape;
                for (i = 0; i < numShapes; i += 1) {
                    shape = that.shapes[i];
                    f(shape);
                }
            };
            
            that.update = function() {
                that.clear();
                that.draw();  
            };
            
            /**
             * Draw Sprite instance
             * @return {void}
             */
            that.draw = function() {
                that.forEachShape(function(shape) {
                    shape.draw();
                });
                // TODO: remove drawBoudingBox
                that.drawBoundingBox();
            };
            
            /**
             * Draw BoundingBox of Sprite instance
             * @return {void}
             */
            that.drawBoundingBox = function() {
                var x = that.boundingBox.x,
                y = that.boundingBox.y,
                w = that.boundingBox.w,
                h = that.boundingBox.h,
                lineWidth = that.drawingSettings.lineWidth || 0;
                
                drawer.beginPath();
                drawer.strokeRect(x + lineWidth, y + lineWidth,
                        w - 2 * lineWidth, h - 2 * lineWidth);
            };
            
            /**
             * Update BoundingBox of Sprite instance
             * @return {void}
             */
            that.updateBoundingBox = function() {
                var minX, minY, maxX, maxY;
                that.forEachShape(function(shape) {
                    var shapeBox = shape.boundingBox;
                    if (minX === undefined || minX > shapeBox.x) {
                        minX = shapeBox.x;
                    }
                    if (minY === undefined || minY > shapeBox.y) {
                        minY = shapeBox.y;
                    }
                    if (maxX === undefined || maxX < shapeBox.x + shapeBox.width) {
                        maxX = shapeBox.x + shapeBox.width;
                    }
                    if (maxY === undefined || maxY < shapeBox.y + shapeBox.height) {
                        maxY = shapeBox.y + shapeBox.height;
                    }
                });
                
                that.boundingBox = new BoundingBox.BoundingBox(minX, minY, maxX - minX, maxY - minY);
            };
            
            /**
             * Test whether or not a point is within a Sprite.
             * @param {Point} point         - Point to test
             * @return {boolean}            If the point is in the Sprite
             */
            that.collisionTest = function(point) {
                var numShapes = that.shapes.length, i, shape;
                for (i = 0; i < numShapes; i += 1) {
                    shape = that.shapes[i];
                    if (shape.collisionTest(point)) {
                        return true;
                    }
                }
                return false;
            };
        }
    };

    return module; 
});

