/**
   Abstract class used to implement basic functions of sprites. Sprites inherit
   from this class and override the necessary drawing methods, etc.

   @class Sprite
 */
define(['underscore', 'util/boundingBox'], function(_, BoundingBox) {
    "use strict";
    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    /**
       @module sprite/sprite
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        /**
           Sprite
           @constructor
         */
        Sprite: function(shapes, drawer, drawingSettingsArr) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            var _this = this,
                boundingBox;
            shapes = shapes || [];
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            Object.defineProperties(this, {
                /**
                   Shapes of Sprite instance
                   @property shapes
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
                   BoundingBox of Sprite instance
                   @property boundingBox
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
                 */
                drawingSettings: {
                    get: function() {
                        return drawingSettingsArr;
                    },
                    set: function(newDrawingSettingsArr) {
                        if (!_.isEqual(drawingSettingsArr,
                            newDrawingSettingsArr) || (!_.isArray(
                            newDrawingSettingsArr) && !_.isObject(
                            newDrawingSettingsArr))) {
                            return;
                        }
                        if (!_.isArray(newDrawingSettingsArr)) {
                            newDrawingSettingsArr = [
                                newDrawingSettingsArr
                            ];
                        }
                        drawingSettingsArr = newDrawingSettingsArr;
                    }
                }
            });
            /**
               Iterator function
                              @param {Function} f  - A function _this takes a Shape instance as a parameter.
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
             */
            this.update = function() {
                this.clear();
                this.draw();
            };
            /**
               Clear Sprite instance
               @return {void}
             */
            this.clear = function() {
                this.forEachShape(function(shape) {
                    shape.clear();
                });
            };
            /**
               Draw Sprite instance
               @return {void}
             */
            this.draw = function() {
                this.forEachShape(function(shape) {
                    shape.draw();
                });
            };
            /**
               Draw BoundingBox of Sprite instance
               @return {void}
             */
            this.drawBoundingBox = function() {
                var x = _this.boundingBox.x,
                    y = _this.boundingBox.y,
                    w = _this.boundingBox.w,
                    h = _this.boundingBox.h,
                    lineWidth = _this.drawingSettings.lineWidth || 0;
                drawer.beginPath();
                drawer.strokeRect(x + lineWidth, y + lineWidth, w - 2 *
                    lineWidth, h - 2 * lineWidth);
            };
            /**
               Update BoundingBox of Sprite instance
               @return {void}
             */
            this.updateBoundingBox = function() {
                var minX, minY, maxX, maxY;
                this.forEachShape(function(shape) {
                    var shapeBox = shape.boundingBox;
                    if (minX === undefined || minX > shapeBox.x) {
                        minX = shapeBox.x;
                    }
                    if (minY === undefined || minY > shapeBox.y) {
                        minY = shapeBox.y;
                    }
                    if (maxX === undefined || maxX < shapeBox.x +
                        shapeBox.width) {
                        maxX = shapeBox.x + shapeBox.width;
                    }
                    if (maxY === undefined || maxY < shapeBox.y +
                        shapeBox.height) {
                        maxY = shapeBox.y + shapeBox.height;
                    }
                });
                this.boundingBox = new BoundingBox.BoundingBox(minX, minY,
                    maxX - minX, maxY - minY);
            };
            /**
               Test whether or not a point is within a Sprite
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
    return module;
});
