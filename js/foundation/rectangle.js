define([
    'foundation/polygon',
    'util/boundingBox'
], function(Polygon,
    BoundingBox) {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
     * @module foundation/rectangle
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * Rectangle
         *
         * @class Rectangle
         * @extends {Polygon}
         * @constructor
         * @param   {float} x                     The x coordinate of the rectangle on the canvas.
         * @param   {float} y                     The y coordinate of the rectangle on the canvas.
         * @param   {float} width                 The width of the rectangle.
         * @param   {float} height                The height of the rectangle.
         * @param   {CanvasDrawer} drawer         A CanvasDrawer to draw the rectangle onto the canvas.
         * @param   {Object} drawingSettings      A dictionary of drawing options.
         */
        Rectangle: function(x, y, width, height, drawer, drawingSettings) {
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            // Extend Polygon constructor
            Polygon.Polygon.call(this, [{
                x: x,
                y: y
            }, {
                x: x + width,
                y: y
            }, {
                x: x + width,
                y: y + height
            }, {
                x: x,
                y: y + height
            }], drawer, drawingSettings);
        }
    };

    return module;
});
