// @formatter:off
define([], function() {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var currentHash = 0;

    /**
     * @module util/hash
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * Return a hashcode for this object. Does not conform to the Java
         * standard that two objects that are structurally identical should
         * yield the same hashcode.
         * @param   {Object} object       Object to get hashcode for
         * @return  {integer}           Hashcode for object
         */
        hashcode: function(object) {
            if (object._hashId === undefined) {
                Object.defineProperty(object, '_hashId', {
                    value: currentHash,
                    enumerable: false
                });
                currentHash++;
            }

            return object._hashId;
        }
    };

    return module;
});
