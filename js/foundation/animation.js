/**
   Defines the behavior of animations.

   @class Animation
 */
define(['underscore'], function(_) {
    "use strict";
    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    /**
       Based on <a href="http://www.html5canvastutorials.com">
       html5canvastutorials</a>
       @method requestAnimFrame
       @private
       @param  {Function} callback A function to perform after one frame
       @return {void}
    */
    var requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 60);
        };
    })();

    /**
      @module foundation/animation
    */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        /**
            @class Animation
            @constructor
            @param   {drawable} drawable The drawable to animate.
            @param   {Function} frameFunction A function that updates the
            animation. Return true to terminate the animation. It may take the
            duration in milliseconds from the beginning of the animation as a
            parameter. For example,
            <code><pre>
            function(time, timeDiff) {
                shape.x = Math.floor(time / 100);
                return time > 1000;
            }
            </pre></code>
            @param   {Function} callback A function to perform at the completion
            of the animation.
         */
        Animation: function(drawable, frameFunction, callback) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            var startTime, lastCallTime;

            function animate() {
                drawable.clear();
                var
                callTime = new Date(),
                    shouldTerminate = frameFunction(callTime - startTime,
                        callTime - lastCallTime);
                lastCallTime = new Date();
                drawable.draw();
                if (shouldTerminate !== true) {
                    requestAnimFrame(animate);
                } else if (_.isFunction(callback)) {
                    callback();
                }
            }
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            /**
                Start the animation.

                @method start
                @return {void}
             */
            this.start = function() {
                startTime = lastCallTime = new Date();
                animate();
            };
        },
        /**
            Create an easing.

            @method easing
            @static
            @param  {Polygon|Rectangle|Circle} drawable The drawable to animate.
            @param  {float} endX The x to go to.
            @param  {float} endY The y to go to.
            @param  {int} duration The number of milliseconds for the animation.
            @param  {Function} callback A function to perform at the completion of the animation.
            @return {Animation} An animation representing the easing
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
