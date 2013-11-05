define([
        'foundation/shape',
        'util/objectUtility',
        'util/boundingBox'
    ], function(Shape,
        ObjUtil,
        BoundingBox) {
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
         * @extends {Shape}
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
            
            var lineWidth = drawingSettings.lineWidth || 0;
            radius = Math.round(radius);

            // Extend Shape constructor
            Shape.Shape.call(this, x - radius,
                                y - radius,
                                radius * 2, radius * 2,
                                drawer, drawingSettings);


            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            Object.defineProperties(this, {
                /**
                 * Radius of circle
                 * @type {float)
                 * @memberof module:foundation/circle.Circle
                 * @instance
                 */
                radius: {
                    get: function() {
                        return radius;
                    },
                    set: function(newRadius) {
                        radius = Math.floor(newRadius);
                        this.width = radius * 2;
                        this.height = radius * 2;
                    }
                }
            });

            /**
             * Draw circle onto canvas.
             *
             * @return {void}
             */
            this.drawShape = function(bbDrawer) {
                bbDrawer.beginPath();
                bbDrawer.contextSettings = this.drawingSettings;

                bbDrawer.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI, true);

                bbDrawer.stroke();
                bbDrawer.fill();
            };
        }
    };

    return module; 
});
