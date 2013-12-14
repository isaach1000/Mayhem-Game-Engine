define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////


    /**
     * @module util/mathExtensions // TODO: replace util/mathExtensions
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * Generate a random integer
         *
         * @param   {int} [minimum=0]         The minimum for the random integer (inclusive)
         * @param   {int} maximum             The maximum for the random integer (not inclusive)
         * @return  {int}                   A random integer within the specified range
         */
        randomInt: function(minimum, maximum) {
            return Math.floor(module.randomFloat(minimum, maximum));
        },

        /**
         * Generate a random float.
         *
         * @param   {float} [minimum=0]       The minimum for the random float (inclusive)
         * @param   {float} maximum           The maximum for the random float (not inclusive)
         * @return  {float}                 A random float within the specified range.
         */
        randomFloat: function(minimum, maximum) {
            var min, max, range;
            switch (arguments.length) {
                case 1:
                    min = 0;
                    max = minimum;
                    break;
                case 2:
                    min = minimum;
                    max = maximum;
                    break;
            }
            range = max - min;
            return Math.random() * range + min;
        },

        /**
         * Get the dot product of two vectors.
         * @param  {Array.<number>}  vector1      A vector of numbers
         * @param  {Array.<number>}  vector2      A vector of numbers (same length as vector1)
         * @return {float} The dot product of the two vectors
         */
        dotProduct: function(vector1, vector2) {
            var total = 0,
                i;

            if (vector1.length !== vector2.length) {
                return null;
            }

            for (i = 0; i < vector1.length; i += 1) {
                total += vector1[i] * vector2[i];
            }
            return total;
        }
    };

    return module;
});