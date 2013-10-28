define([], function() {
    "use strict";

    // Private class methods/fields
    
    // Based on http://www.html5canvastutorials.com/
    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    })();
    
    /**
     * @exports foundation/animation
     */
    var module = {
        // Public class methods/fields
        
        /**
         * Animation
         *
         * @constructor
         * @param   {Shape}     shape           - The shape to animate.
         * @param   {Function}  frameFunction   - A function that updates the animation. Must return a boolean, which is 
         *                                      supposed to signal whether or not to terminate the animation (return false to terminate).
         *                                      It may take the duration in milliseconds from the beginning of the animation as a parameter.
         * @param   {Function}  callback        - A function to perform at the completion of the animation.
         */
        Animation: function(shape, frameFunction, callback) {
            // Private instance methods/fields
            
            var frameCounter = 0;
            var startDate;
            
            var animate = function() {
                shape.clear();
                
                var shouldContinue = frameFunction(new Date() - startDate);

                shape.draw();

                if (shouldContinue) {
                    window.requestAnimFrame(function() {
                        animate();
                    });
                }
                else if (typeof callback === 'Object') {
                    callback();
                }
            };
            
            
            // Public instance methods/fields
            
            /**
             * Start the animation.
             * @return {void}
             */
            this.start = function() {
                startDate = new Date();
                animate();
            };
        },

        /**
         * Create an easing.
         * 
         * @param  {Polygon|Rectangle|Circle}   shape       - The shape to animate.
         * @param  {float}                      endX        - The x to go to.
         * @param  {float}                      endY        - The y to go to.
         * @param  {int}                        duration    - The number of milliseconds for the animation.
         * @param  {Function}                   callback    - A function to perform at the completion of the animation.
         * @return {Animation} An animation that represents the easing.
         */
        easing: function(shape, endX, endY, duration, callback) {
            var startX = shape.x,
                startY = shape.y,
                distX = endX - startX,
                distY = endY - startY,
                durationX = distX / duration,
                durationY = distY / duration;

            var frameFunction = function(durationElapsed) {
                shape.x = startX + durationX * durationElapsed;
                shape.y = startY + durationY * durationElapsed;

                return shape.x < endX && shape.y < endY && durationElapsed < duration;
            }

            return new module.Animation(shape, frameFunction, callback);
        }
    };

    return module; 
});
