define(['underscore'], function(_) {
    "use strict";

    // Private class methods/fields
    
    // Based on http://www.html5canvastutorials.com/
    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
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
         * @param   {drawable}  drawable        - The drawable to animate.
         * @param   {Function}  frameFunction   - A function that updates the animation. Must return a boolean, which is 
         *                                      supposed to signal whether or not to terminate the animation (return false to terminate).
         *                                      It may take the duration in milliseconds from the beginning of the animation as a parameter.
         * @param   {Function}  callback        - A function to perform at the completion of the animation.
         */
        Animation: function(drawable, frameFunction, callback) {
            // Private instance methods/fields
            
            var startTime;
            
            var animate = function() {
                drawable.clear();
                var shouldContinue = frameFunction(new Date() - startTime);
                drawable.draw();
                if (shouldContinue) {
                    window.requestAnimFrame(function() {
                        animate();
                    });
                }
                else if (_.isFunction(callback)) {
                    callback();
                }
            };
            
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            /**
             * Start the animation.
             * @return {void}
             */
            this.start = function() {
                startTime = new Date();
                animate();
            };
        },

        /**
         * Create an easing.
         * 
         * @param  {Polygon|Rectangle|Circle}   drawable       - The drawable to animate.
         * @param  {float}                      endX        - The x to go to.
         * @param  {float}                      endY        - The y to go to.
         * @param  {int}                        duration    - The number of milliseconds for the animation.
         * @param  {Function}                   callback    - A function to perform at the completion of the animation.
         * @return {Animation} An animation _this represents the easing.
         */
        easing: function(drawable, endX, endY, duration, callback) {
            var startX = drawable.x,
                startY = drawable.y,
                distX = endX - startX,
                distY = endY - startY,
                durationX = distX / duration,
                durationY = distY / duration;

            var frameFunction = function(durationElapsed) {
                drawable.x = startX + durationX * durationElapsed;
                drawable.y = startY + durationY * durationElapsed;
                return drawable.x < endX && drawable.y < endY &&
                        durationElapsed < duration;
            };

            return new module.Animation(drawable, frameFunction, callback);
        }
    };

    return module; 
});
