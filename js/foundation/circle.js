
define([
        'foundation/shape',
        'underscore',
        'util/boundingBox'
    ], function(Shape,
        _,
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
         * Circle, extends [Shape]{@link module:foundation/shape.Shape}
         * @constructor
         * @extends {Shape}
         * @param   {float} x                   -   x coordinate of circle
         * @param   {float} y                   -   y coordinate of circle
         * @param   {float} radius              -   Radius of the circle
         * @param   {CanvasDrawer} drawer       -   CanvasDrawer to draw circle
         * @param   {Object} drawingSettings    -   Dictionary of drawing options
         */
        Circle: function(x, y, radius, drawer, drawingSettings) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            
            var that = this, 
            lineWidth = drawingSettings.lineWidth || 0;
            radius = Math.round(radius);

            // Extend Shape constructor
            Shape.Shape.call(that, x, y, radius * 2, radius * 2,
                                    drawer, drawingSettings);


            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            Object.defineProperties(this, {
                /**
                 * Radius of circle
                 * @type {float)
                 * @memberOf module:foundation/circle.Circle
                 * @instance
                 */
                radius: {
                    get: function() {
                        return radius;
                    },
                    set: function(newRadius) {
                        radius = Math.floor(newRadius);
                        that.width = radius * 2;
                        that.height = radius * 2;
                    }
                }
            });

            /**
             * Draw circle onto canvas.
             *
             * @return {void}
             */
            this.drawShape = function(canvasDrawer) {
                canvasDrawer.beginPath();
                canvasDrawer.contextSettings = that.drawingSettings;

                var lineWidth = that.drawingSettings.lineWidth || 0;
                canvasDrawer.arc(that.x + that.radius, that.y + that.radius,
                    that.radius - lineWidth, 0, 2 * Math.PI, true);

                canvasDrawer.stroke();
                canvasDrawer.fill();
            };
            
            this.hitTest = function(point) {
                var dx = that.x + that.radius - point.x,
                    dy = that.y + that.radius - point.y;
                return dx * dx + dy * dy <= that.radius * that.radius;
            };
        }
    };

    return module; 
});
