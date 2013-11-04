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
            // Extend Shape constructor
            Shape.Shape.call(this, x, y, radius * 2, radius * 2,
                                drawer, drawingSettings);

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            /** Radius of circle. */
            this.radius = radius;

            /**
             * Draw circle onto canvas.
             *
             * @return {void}
             */
            this.draw = function() {
                drawer.beginPath();
                drawer.contextSettings = drawingSettings;
                drawer.arc(this.x + this.radius, this.y + this.radius,
                        this.radius, this.radius, 0,
                    2 * Math.PI, true);
                drawer.fill();
                drawer.stroke();
            };
        }
    };

    // Clone Shape prototype
    module.Circle.prototype = new Shape.Shape;

    return module; 
});
