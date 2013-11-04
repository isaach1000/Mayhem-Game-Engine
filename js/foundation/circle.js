define(['util/objectUtility', 'util/boundingBox'], function(ObjUtil, BoundingBox) {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    
    /**
     * @exports foundation/circle
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        
        /**
         * Circle
         *
         * @constructor
         * @param {float} x                 -   x coordinate of circle
         * @param {float} y                 -   y coordinate of circle
         * @param {float} radius            -   Radius of the circle
         * @param {CanvasDrawer} drawer     -   CanvasDrawer to draw circle
         * @param {Object} drawingSettings  -   Dictionary of drawing options
         */
        Circle: function(x, y, radius, drawer, drawingSettings) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var bbox = new BoundingBox.BoundingBox(x, y, radius * 2, radius * 2);


            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            this.x = x;
            this.y = y;
            this.radius = radius;

            Object.defineProperties(this, {
                /**
                 * Bounding box of circle.
                 * @memberOf Circle
                 * @name Circle#boundingBox
                 */
                boundingBox: {
                    get: function() {
                        // No clone necessary because BoundingBox instances are immutable.
                        return bbox;
                    }
                },

                /** 
                 * Drawing settings for the circle.
                 * @memberOf Circle
                 * @name Circle#drawingSettings
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
             * Draw the circle onto the canvas using the CanvasDrawer.
             *
             * @return {void}
             */
            this.draw = function() {
                drawer.beginPath();
                drawer.contextSettings = drawingSettings;
                drawer.arc(this.x, this.y, this.radius, this.radius, 0, Math.PI * 2, true);
                drawer.fill();
                drawer.stroke();
            };

            /**
             * Clear the shape.
             * 
             * @return {void}
             */
            this.clear = function() {
                var bigRadius = this.radius + 3;
                drawer.clearRect(this.x - bigRadius, this.y - bigRadius, 2 * bigRadius, 2 * bigRadius);
            };
        }
    };

    return module; 
});
