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
     * @module foundation/circle
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * Circle
         *
         * @class Circle
         * @constructor
         * @extends {Shape}
         * @param   {float} x                     x coordinate of circle
         * @param   {float} y                     y coordinate of circle
         * @param   {float} radius                Radius of the circle
         * @param   {CanvasDrawer} drawer         CanvasDrawer to draw circle
         * @param   {Object} drawingSettings      Dictionary of drawing options
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
                 *
                 * @type {float)
                 * @property radius
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
             * Draw circle onto canvas
             *
             * @method
             * @param   {canvasDrawer} CanvasDrawer       A drawer to draw the circle
             * @return  {void}
             */
            this.drawShape = function(canvasDrawer) {
                canvasDrawer.beginPath();
                canvasDrawer.contextSettings = _this.drawingSettings;

                var lineWidth = this.drawingSettings.lineWidth || 1;
                canvasDrawer.arc(this.x + this.radius,
                    this.y + this.radius,
                    this.radius - lineWidth, 0, 2 * Math.PI, true);

                canvasDrawer.stroke();
                canvasDrawer.fill();
            };

            /**
             * Check if a given point is in the circle
             *
             * @param  {Point} point [description]
             * @return {[type]}       [description]
             */
            this.hitTest = function(point) {
                var dx = this.x + this.radius - point.x,
                    dy = this.y + this.radius - point.y;
                return dx * dx + dy * dy <= this.radius * this.radius;
            };
        }
    };

    return module;
});