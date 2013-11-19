// @formatter:off
define(['sprite/sprite', 'foundation/circle'], function(Sprite, Circle) {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var HEAD_RADIUS = 40, ARM_RADIUS = HEAD_RADIUS / 2;

    /**
     * @exports sprite/human
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * Human
         * @constructor
         */
        Human : function(x, y, drawer, drawingSettings) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var _this = this;

            var head = new Circle.Circle(x, y, HEAD_RADIUS,
                            drawer, drawingSettings);
                            
            var leftHand = new Circle.Circle(x + HEAD_RADIUS - ARM_RADIUS,
                y - ARM_RADIUS, ARM_RADIUS, drawer, drawingSettings);
                
            var rightHand = new Circle.Circle(x + HEAD_RADIUS - ARM_RADIUS,
                y + HEAD_RADIUS + ARM_RADIUS, ARM_RADIUS,
                            drawer, drawingSettings);
                
            var initialShapes = [leftHand, rightHand, head];

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            // Extend Sprite constructor
            Sprite.Sprite.call(this, initialShapes, drawer, drawingSettings);
            this.updateBoundingBox();
            
            this.walk = function(toX, toY) {
                // TODO
            };
        }
    };

    return module;
});
