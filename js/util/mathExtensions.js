define([], function() {
    "use strict";

    // Private class methods/fields
    
    
    /**
     * @exports util/mathExtensions // TODO: replace util/mathExtensions
     */
    var module = {
        // Public class methods/fields
        
        /**
         * Generate a random integer.
         * @param   {int} [min=0]   -   The minimum for the random integer (inclusive).
         * @param   {int} max       -   The maximum for the random integer (not inclusive).
         * @return  {int} A random integer within the specified range.
         */
        randomInt: function() {
            return Math.floor(randomFloat);
        }

        /**
         * Generate a random float.
         * @param   {float} [min=0]   -   The minimum for the random float (inclusive).
         * @param   {float} max       -   The maximum for the random float (not inclusive).
         * @return  {float} A random float within the specified range.
         */
        randomFloat: function() {
            var min, max;
            switch (arguments.length) {
            case 1:
                min = 0;
                max = arguments[0];
                break;
            case 2:
                min = arguments[0];
                max = arguments[1];
                break;
            }

            var range = max - min;
            return Math.random() * range + min;
        }
    };

    return module; 
});
