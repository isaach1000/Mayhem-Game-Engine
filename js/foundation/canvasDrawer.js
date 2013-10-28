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
            // Private instance methods/fields
            
            var ctx = context;
            
            
            // Public instance methods/fields
            
            /**
             * Get the context of the CanvasDrawer.
             *
             * @return {Context}
             */
            this.getContext = function() {
                return ctx;
            };

            /**
             * Change the context of the CanvasDrawer.
             *
             * @param {Context} newContext - The new context
             * @return {void}
             */
            this.setContext = function(newContext) {
                ctx = newContext;
            };

            /**
             * Change properties of the context. Valid settings include:
             * lineWidth, fillStyle, and strokeStyle.
             *
             * @param {Object} settings - A dictionary with settings
             * @return {void}
             */
            this.setContextSettings = function(settings) {
                var VALID_SETTINGS = ['lineWidth', 'fillStyle', 'strokeStyle'];
                
                for (var property in settings) {
                    if (VALID_SETTINGS.indexOf(property) !== -1) {
                        ctx[property] = settings[property];
                    }
                }
            };

            /**
             * Draw a line between two points.
             * 
             * @param {Point} point1        -   The x coordinate of the first point, or the first point.
             * @param {Point} point2        -   The y coordinate of the first point, or the second point.
             * @param {boolean} (moveFirst) -   Whether or not the context perform the moveTo method.
             * @return {void}
             */
            this.drawLine = function(point1, point2, moveFirst) {
                if (moveFirst) {
                    ctx.moveTo(point1.x, point1.y);
                }
                ctx.lineTo(point2.x, point2.y);
            };

            /**
             * Wrapper for `context.stroke`.
             *
             * @return {void}
             */
            this.stroke = function() {
                ctx.stroke();
            };

            /**
             * Wrapper for `context.fill`.
             *
             * @return {void}
             */
            this.fill = function() {
                ctx.fill();  
            };

            /**
             * Wrapper for `context.beginPath`.
             *
             * @return {void}
             */
            this.beginPath = function() {
                ctx.beginPath();
            };

            /**
             * Wrapper for `context.closePath`.
             * @return {void}
             */
            this.closePath = function() {
                ctx.closePath();
            };
          
            /**
             * Wrapper for `context.rect`.
             * 
             * @param  {float}  x   x coordinate
             * @param  {float}  y   y coordinate
             * @param  {float}  w   Width of rectangle
             * @param  {float}  h   Height of rectangle
             * @return {void}
             */
            this.rect = function(x, y, w, h) {
                ctx.rect(x, y, w, h);
            };


            /**
             * Wrapper for `context.arc`
             * 
             * @param  {float}      x          x coordinate
             * @param  {float}      y          y coordinate
             * @param  {float}      radius     Radius of arc
             * @param  {float}      startAngle Start angle of arc
             * @param  {float}      endAngle   End angle of arc
             * @param  {boolean}    ccw        Move counterclockwise
             * @return {void}
             */
            this.arc = function(x, y, radius, startAngle, endAngle, ccw) {
                ctx.arc(x, y, radius, startAngle, endAngle, ccw);
            };

            /**
             * Wrapper for `context.clearRect`
             * 
             * @param  {float} x - Minimum x of area.
             * @param  {float} y - Minimum y of area.
             * @param  {float} width  - Width of area.
             * @param  {float} height - Height of area.
             * @return {void}
             */
            this.clearRect = function(x, y, width, height) {
                ctx.clearRect(x, y, width, height);
            };
        }
    };

    return module; 
});

