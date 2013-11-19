
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
            
            var _this = this, 
            lineWidth = drawingSettings.lineWidth || 0;
            radius = Math.round(radius);

            // Extend Shape constructor
            Shape.Shape.call(_this, x, y, radius * 2, radius * 2,
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
                        _this.width = radius * 2;
                        _this.height = radius * 2;
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
                canvasDrawer.contextSettings = _this.drawingSettings;

                var lineWidth = _this.drawingSettings.lineWidth || 0;
                canvasDrawer.arc(_this.x + _this.radius, _this.y + _this.radius,
                    _this.radius - lineWidth, 0, 2 * Math.PI, true);

                canvasDrawer.stroke();
                canvasDrawer.fill();
            };
            
            this.hitTest = function(point) {
                var dx = _this.x + _this.radius - point.x,
                    dy = _this.y + _this.radius - point.y;
                return dx * dx + dy * dy <= _this.radius * _this.radius;
            };
        }
    };

    return module; 
});
