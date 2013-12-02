// @formatter:off
define(['underscore', 'util/hash'], function(_, Hash) {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var INIT_CAPACITY = 53,
        LOAD_FACTOR = 0.5;

    /**
     * @exports util/hashset
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        // TODO

        /**
         * Hashset
         * @constructor
         */
        Hashset : function() {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var _this = this,
                bucket = new Array(INIT_CAPACITY),
                size = 0,
                capacity = INIT_CAPACITY;
                
            var resolveCollision = function(object, index) {
                var location = bucket[index];
                if (_.isArray(location)) {
                    if (_.contains(location, object)) {
                        return false;
                    }
                    else {
                        location.push(object);
                        return true;
                    }
                }
                else {
                    bucket[index] = [location, object];
                    return true;
                }
            };
                
            var rehash = function() {
                // Create new bucket that is double the size
                var oldBucket = bucket;
                capacity *= 2;
                bucket = new Array(capacity);
                
                // Transfer all elements to new array
                var bucketLen = oldBucket.length;
                for (var i = 0; i < bucketLan; i++) {
                    var object = oldBucket[i];
                    if (_.isArray(object)) {
                        var subArray = object,
                            subArrayLen = subArray.length;
                        for (var j = 0; j < subArrayLen; j++) {
                            var element = subArray[j];
                            insert[element];   
                        }
                    }
                    else {
                        insert(object);
                    }
                }
            };
                
            var insert = function(object) {
                var hash = Hash.hashcode(object),
                index = hash % capacity;
            
                if (bucket[index] === undefined) {
                    bucket[index] = object;
                    return true;
                }
                else if (bucket[index] === object){
                    return false;
                }
                else {
                    return resolveCollision(object, index);
                };
            };


            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            Object.defineProperties(this, {
                /**
                 * The size of the Hashset
                 * @type {integer}
                 * @memberOf module:util/hashset.Hashset
                 * @instance
                 */
                length: {
                    get: function() {
                        // TODO
                    }
                } 
            });

            /**
             * Add an object
             * @param   {Object} object     -   Object to add
             * @return  {boolean}           Whether or not the insertion was successful
             */
            this.add = function(object) {
                if (!_.isObject(object) || _.isArray(object) || _.isFunction(object)) {
                    return false;
                }
                
                var inserted = insert(object);
                if (inserted) {
                    size++;     
                    if ( size/capacity > LOAD_FACTOR ) {
                         rehash();
                    }
                    return true;
                }
                return false;
            };
            
            /**
             * Clear the Hashset instance of all elements
             * @return  {void}
             */
            this.clear = function() {
                bucket = new Array(INIT_CAPACITY);
                size = 0;
                capacity = INIT_CAPACITY;
            };
            
            /**
             * Check if an object is an element of this set
             * @param   {Object} object     -   An object _this may be an element
             * @return  {boolean}           Whether or not the object is an element
             */
            this.contains = function(object) {
                if (!_.isObject(object) || _.isArray(object) || _.isFunction(object)) {
                    return false;
                }
                
                var index = Hash.hashcode(object),
                location = bucket[index];
                
                if (location === object) {
                    return true;
                }
                else if (_.isArray(location) && _.contains(location, object)) {
                    for (var i = 0; i < location.length; i++) {
                        if (location[i] === object) {
                            return true;
                        }
                    }
                }
                else {
                    return false;
                }
            };
            
            /**
             * Remove an object 
             * @param {Object} object       - An object
             * @return {boolean}            True if removed object from set, false if object could not be removed from set
             */
            this.remove = function(object) {
                if (!_.isObject(object) || _.isArray(object) || _.isFunction(object)) {
                    return false;
                }
                
                var contained = contains(object);
                if (contained)  {
                    var index = hash.hashcode(object),
                    location = bucket[index];
                    
                    if (location === object) {
                        location = null;
                        size--;
                        return true;
                    }
                    else {
                        for (var i = 0; i < location.length; i++) {
                            if (location[i] === object) {
                                location[i] = null;
                                size--;
                                return true;
                            }
                        }
                    }
                }
                else {
                    return false;
                }
            };
        }
    };

    return module;
});
