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
