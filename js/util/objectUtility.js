define([], function() {
    "use strict";
    
    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var clone = function(originalObject, shouldRecurse) {
        // Inner helper function
        var recursionCheck = function(element) {
            if (shouldRecurse) {
                return clone(element, shouldRecurse);
            }
            else {
                return element;
            }
        };

        // Function body
        if (TypeChecker.isArray(originalObject)) {
            var newArr = [];
            for (var i = 0; i < originalObject.length; i++) {
                var addObj = recursionCheck(originalObject[i]);
                newArr.push(addObj);
            }
            return newArr;
        }
        else {
            var newObj = {};
            for (var property in originalObject) {
                var addObj = recursionCheck(originalObject[property]);
                newObj[property] = addObj;
            }
            return newObj;
        }
    };

    /**
     * @exports util/objectUtility
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * Create a shallow copy of an object.
         * @param  {Object|Array} originalObject    - An object to copy
         * @return {Object|Array}                   A shallow copy of originalObject
         */
        shallowClone: function(originalObject) {
            return clone(originalObject, false);
        },

        /**
         * Create a deep copy of an object.
         * @param  {Object|Array} originalObject    - An object to copy
         * @return {Object|Array}                   A deep clone of originalObject
         */
        deepClone: function(originalObject) {
            return clone(originalObject, true);
        },

        /**
         * Check if an object is an array.
         * @param  {Object} object  - An object to check
         * @return {Boolean} Whether or not the object is an array
         */
        isArray: function(object) {
            return object instanceof Array;
        }
    };

    return module; 
});
