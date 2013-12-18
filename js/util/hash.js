/**
   Hash class used to generate hashcodes for JavaScript objects. The hashcode
   is stored as a property of the object, but it is set to non-enumerable and
   cannot be changed, thereby guaranteeing the consistency of hashcodes.

   @class Hash
 */
define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var currentHash = 0;

    /**
       @module util/hash
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
           Return a hashcode for this object. Does not conform to the Java
           standard that two objects that are structurally identical should
           yield the same hashcode.
           @param   {Object} object     -   Object to get hashcode for
           @return  {integer}           Hashcode for object
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
