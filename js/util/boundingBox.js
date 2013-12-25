/**
   A class to represent the bounds of shapes in the canvas. Simplifies
   calculations certain involving complex shapes. Specifically effective for
   hit-testing.

   @class BoundingBox
 */
define([], function() {
    "use strict";
    /**
       @module util/boundingBox
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        /**
           Create a BoundingBox.

           @constructor
           @param {(float|Point)} arg0  - The x coordinate of left side, or left-top point.
           @param {(float|Point)} arg1  - The y coordinate of front side, or right-bottom point.
           @param {float} arg2          - Width of the box.
           @param {float} arg3          - Height of the box.
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

                   @type {float}
                 */
                width: {
                    get: function() {
                        return w;
                    }
                },
                /**
                   Height of BoundingBox instance

                   @type {float}
                 */
                height: {
                    get: function() {
                        return h;
                    }
                },
                /**
                   Center of BoundingBox instance

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
               Check if this BoundingBox contains another BoundingBox.

               @method containsBoundingBox
               @param {BoundingBox} bbox - The other BoundingBox
               @return {boolean} True if contains the other BoundingBox, false otherwise.
             */
            this.containsBoundingBox = function(bbox) {
                return (bbox.x >= x && bbox.x + bbox.width <= x + w && bbox
                    .y >= y && bbox.y + bbox.height <= y + h);
            };
            /**
               Get the intersection of this BoundingBox
               and another BoundingBox.

               @method intersection
               @param {BoundingBox} otherBbox - Another BoundingBox instance.
               @return {BoundingBox}
             */
            this.intersection = function(otherBbox) {
                var x1 = Math.max(this.x, otherBbox.x),
                    y1 = Math.max(this.y, otherBbox.y),
                    x2 = Math.min(this.x + this.width, otherBbox.x +
                        otherBbox.width),
                    y2 = Math.min(this.y + this.height, otherBbox.y +
                        otherBbox.height),
                    intWidth = x2 - x1,
                    intHeight = y2 - y1;
                if (intWidth < 0 || intHeight < 0) {
                    return null;
                }
                return new module.BoundingBox(x1, y1, intWidth, intWidth);
            };
        }
    };
    return module;
});
