define(['util/boundingBox', 'util/objectUtility'
    ], function(BoundingBox, ObjUtil) {
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
         * Shape
         *
         * @constructor
         */
        Shape: function(x, y, width, height, drawer, drawingSettings) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            
            /** BoundingBox of shape */
            var bbox = new BoundingBox.BoundingBox(x, y, width, height);
            

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            Object.defineProperties(this, {
                /**
                 * x coordinate of top-left of Shape instance
                 * @type {float}
                 * @memberof module:foundation/shape.Shape
                 */
                x: {
                    get: function() {
                        return x;
                    },
                    set: function(newX) {
                        x = newX;
                        bbox.x = x;
                    }
                },

                /**
                 * y coordinate of top-left of Shape instance
                 * @type {float}
                 * @memberof module:foundation/shape.Shape
                 */
                y: {
                    get: function() {
                        return y;
                    },
                    set: function(newY) {
                        y = newY;
                        bbox.y = y;
                    }
                },

                /**
                 * Bounding box of shape.
                 * @memberof module:foundation/shape.Shape
                 * @instance
                 */
                boundingBox: {
                    get: function() {
                        return ObjUtil.deepClone(bbox);
                    }
                },

                /** 
                 * Drawing settings of shape.
                 * @memberof module:foundation/shape.Shape
                 * @instance
                 */
                drawingSettings: {
                    get: function() {
                        return ObjUtil.deepClone(drawingSettings);
                    },
                    set: function(newSettings) {
                        drawingSettings = ObjUtil.deepClone(newSettings);
                    }
                }
            });

            /**
             * Clear the shape.
             * 
             * @return {void}
             */
            this.clear = function() {
                var lineWidth = this.drawingSettings.lineWidth || 0;
                drawer.clearRect(bbox.x - lineWidth, bbox.y - lineWidth,
                    bbox.width + lineWidth * 2, bbox.height + lineWidth * 2);
            };
        }
    };

    return module; 
});
