/**
   Hash class used to generate hashcodes for JavaScript objects. The hashcode
   is stored as a property of the object, but it is set to non-enumerable and
   cannot be changed, thereby guaranteeing the consistency of hashcodes.

   @module util/hash
   @class Hash
 */
define(['underscore'], function(_) {
    'use strict';

    console.debug(_);

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var currentHash = 0,
        INIT_CAPACITY = 16,
        LOAD_FACTOR = 2;

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
        },
        /**
           Hashset data structure used to store unique objects without duplicates.
           The hashset will add identical items of the same type, as long as they are
           not the exact same object (or the hashcode property is identical). For more
           info, see the {{#crossLink module}}{{/crossLink}} class.

           @class Hashset
        */
        /**
           @class Hashset
           @constructor
         */
        Hashset: function() {
            var _this = this;
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            var bucket = new Array(INIT_CAPACITY),
                size = 0,
                capacity = INIT_CAPACITY,
                indicesTaken = [];
            /**
               Resolve a collision in the hashset.

               @method resolveCollision
               @private
               @param  {Object} object
               @param  {integer} index Index where collision occurred
               @return {boolean} Whether or not the item was added to the set
             */
            function resolveCollision(object, index) {
                var location = bucket[index];
                if (_.isArray(location)) {
                    if (_.contains(location, object)) {
                        return false;
                    } else {
                        location.push(object);
                        return true;
                    }
                } else {
                    bucket[index] = [location, object];
                    return true;
                }
            }
            /**
               Add the index of a location that is currently occupied in the
               array.

               @method addIndex
               @private
               @param  {integer} idx Index of occupied location
             */
            function addIndex(idx) {
                // Add idx to the sorted indicesTaken array
                var spot = _.sortedIndex(indicesTaken, idx);
                if (indicesTaken[spot] !== idx) {
                    indicesTaken.splice(spot, 0, idx);
                }
            }
            /**
               Helper method to rehash the array when the objects inserted
               exceeds half of the total capacity.

               @method rehash
               @private
               @return {void}
             */
            function rehash() {
                // Create new bucket that is double the size
                var oldBucket = bucket;
                capacity *= 2;
                bucket = new Array(capacity);
                indicesTaken = [];
                // Transfer all elements to new array
                var bucketLen = oldBucket.length;
                for (var i = 0; i < bucketLan; i++) {
                    var object = oldBucket[i];
                    if (_.isArray(object)) {
                        var subArray = object,
                            subArrayLen = subArray.length;
                        for (var j = 0; j < subArrayLen; j++) {
                            var element = subArray[j];
                            insert(element);
                        }
                    } else {
                        insert(object);
                    }
                }
            }
            /**
               Insert an object into the internal array.

               @method insert
               @private
               @param  {Object} object An object to insert into the array
               @param  {Object} [hashTarget=`object`] An object used to generate a
               hashcode
               @return {boolean} Whether or not the object was inserted into the
               array
             */
            function insert(object, hashTarget) {
                var originalTarget = hashTarget || null;
                hashTarget = hashTarget || object;
                var index = module.hashcode(hashTarget) % capacity,
                    location = bucket[index];
                var locKey;
                if (location) {
                    locKey = location.key;
                }
                if (location === undefined) {
                    bucket[index] = object;
                    addIndex(index);
                    return true;
                } else if (location === object || originalTarget === locKey) {
                    return false;
                } else {
                    return resolveCollision(object, index);
                }
            }
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            Object.defineProperties(this, {
                /**
                   The size of the Hashset
                   @type {integer}
                   @property length
                 */
                length: {
                    get: function() {
                        return size;
                    }
                }
            });
            /**
               Add an object
               @function
               @param   {Object} object         -   Object to add
               @param   {Object} [hashTarget]   -   Object to module
               @return  {boolean}           Whether or not the insertion was successful
             */
            this.add = function(object, hashTarget) {
                var originalTarget = hashTarget || null;
                hashTarget = hashTarget || object;
                if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                    object)) {
                    return false;
                }
                var inserted = insert(object, hashTarget);
                if (inserted) {
                    size++;
                    if (size / capacity > LOAD_FACTOR) {
                        rehash();
                    }
                    return true;
                }
                return false;
            };
            /**
               Clear the Hashset instance of all elements
               @return  {void}
             */
            this.clear = function() {
                bucket = new Array(INIT_CAPACITY);
                size = 0;
                capacity = INIT_CAPACITY;
                indicesTaken = [];
            };
            /**
               Check if an object is an element of this set
               @function
               @param   {Object} object     -   An object _this may be an element
               @return  {boolean}           Whether or not the object is an element
             */
            this.contains = function(object, hashTarget) {
                var originalTarget = hashTarget || null;
                hashTarget = hashTarget || object;
                if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                    object)) {
                    return false;
                }
                var index = module.hashcode(hashTarget) % capacity,
                    location = bucket[index];
                var locKey;
                if (location) {
                    locKey = location.key;
                }
                if (location === object || originalTarget === locKey) {
                    return true;
                } else if (_.isArray(location)) {
                    for (var i = 0; i < location.length; i++) {
                        var elem = location[i];
                        var elemKey;
                        if (elem) {
                            elemKey = elem.key;
                        }
                        if (elem === object || originalTarget === elemKey) {
                            return true;
                        }
                    }
                }
                return false;
            };
            /**
               Remove an object
               @function
               @param {Object} object       - An object
               @return {boolean}            True if removed object from set, false if object could not be removed from set
             */
            this.remove = function(object, hashTarget) {
                var originalTarget = hashTarget || null;
                hashTarget = hashTarget || object;
                if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                    object)) {
                    return false;
                }
                var contained = _this.contains(object, originalTarget);
                if (contained) {
                    var index = module.hashcode(hashTarget) % capacity,
                        location = bucket[index];
                    var locKey;
                    if (location) {
                        locKey = location.key;
                    }
                    if (location === object || locKey === originalTarget) {
                        bucket[index] = undefined;
                        indicesTaken = _.without(indicesTaken, index);
                        size--;
                        return true;
                    } else {
                        for (var i = 0; i < location.length; i++) {
                            if (location[i] === object) {
                                location[i] = undefined;
                                size--;
                                return true;
                            }
                        }
                    }
                }
                return false;
            };
            this.get = function(object, hashTarget) {
                var originalTarget = hashTarget || null;
                hashTarget = hashTarget || object;
                var index = module.hashcode(hashTarget) % capacity,
                    location = bucket[index];
                var locKey;
                if (location) {
                    locKey = location.key;
                }
                if (location === undefined) {
                    return null;
                } else if (location === object || locKey === originalTarget) {
                    return location;
                } else {
                    var arrLen = location.length;
                    for (var i = 0; i < arrLen; i++) {
                        var element = location[i],
                            elemKey = element.key;
                        if (element === object || elemKey ===
                            originalTarget) {
                            return element;
                        }
                    }
                    return null;
                }
            };
            this.forEach = function(f) {
                var numIndices = indicesTaken.length;
                for (var i = 0; i < numIndices; i++) {
                    var idx = indicesTaken[i],
                        current = bucket[idx];
                    if (_.isArray(current)) {
                        var arrLen = current.length;
                        for (var j = 0; j < arrLen; j++) {
                            var element = current[j];
                            f(element);
                        }
                    } else {
                        f(current);
                    }
                }
            };
        },
        /**
            Hashtable implementation to map objects to other objects.

            @class Hashtable
         */
        /**
            @class Hashtable
            @constructor
         */
        Hashtable: function() {
            var _this = this;
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            var hashset = new module.Hashset();
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            this.put = function(key, value) {
                var entry = {
                    key: key,
                    value: value
                };
                return hashset.add(entry, key);
            };
            this.get = function(key) {
                return hashset.get(key, key).value;
            };
            this.containsKey = function(key) {
                return hashset.contains(key, key);
            };
            this.remove = function(key) {
                return hashset.remove(key, key);
            };
            this.clear = function() {
                hashset.clear();
            };
            this.forEach = function(f) {
                hashset.forEach(function(entry) {
                    f(entry.key, entry.value);
                });
            };
            Object.defineProperties(this, {
                length: {
                    get: function() {
                        return hashset.length;
                    }
                }
            });
        }
    };
    return module;
});
