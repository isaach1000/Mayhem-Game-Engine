define([], function() {
    "use strict";

    // Private class methods/fields
    
    /**
     * @exports foundation/canvasDrawer
     */
    var module = {
        // Public class methods/fields
        
        /**
         * CanvasDrawer for drawing to a canvas.
         *
         * @constructor
         * @param {Context} context - The context from a canvas.
         */
        CanvasDrawer: function(context) {
            // Private instance methods/fields, `var privateFoo = 4; var bar = function() {...};` etc.
            
            var ctx = context;
            
            
            // Public instance methods/fields, `this.x = x; this.y = function() {...};` etc.
            
            this.setContext = function(newContext) {
                ctx = newContext;
            };

            this.getContext = function() {
                return ctx;
            };

            /**
             * Draw a line between two points.
             *
             * @param {float|Point} arg0    -   The x coordinate of the first
             *                                  point, or the first point.
             * @param {float|Point} arg1    -   The y coordinate of the first
             *                                  point, or the second point.
             * @param {float} (arg2)        -   The x coordinate of the second
             *                                  point. 
             * @param {float} (arg3)        -   The y coordinate of the second point.
             * @return {void}
             */
            this.drawLine = function() {
                var x1, y1, x2, y2;
                if (arguments.length == 4) {
                    x1 = arguments[0];
                    y1 = arguments[1];
                    x2 = arguments[2];
                    y2 = arguments[3];
                }
                else if (arguments.length == 2) {
                    var p1 = arguments[0], p2 = arguments[1];
                    x1 = p1.x;
                    y1 = p1.y;
                    x2 = p2.x;
                    y2 = p2.y;
                }
                else {
                    throw new Error();
                }

                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            };

            /**
             * Wrapper for canvas stroke method.
             *
             * @return {void}
             */
            this.stroke = function() {
                ctx.stroke();
            };

            /**
             * Wrapper for canvas fill method.
             *
             * @return {void}
             */
            this.fill = function() {
                ctx.fill();  
            };
        }
    };

    return module; 
});

