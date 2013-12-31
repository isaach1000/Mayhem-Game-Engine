define([], function() {
    'use strict';
    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    var DEFAULT_SIZE = 16;
    /**
       @module modulePath
       @module modulePath
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        /**
           @class MinHeap
           @constructor
           @param {Function|number} [arg1=numeric_comparator|16] Comparator function (if one argument) or size (if two arguments)
           @param {Function} [arg2=numeric_comparator] Comparator function
         */
        MinHeap: function() {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var size = DEFAULT_SIZE,
                comparator = function(data1, data2) {
                    return data1 - data2;
                };
            if (arguments.length === 2) {
                // parameters are size then comparator
                size = arguments[0];
                comparator = arguments[1];
            } else if (arguments.length === 1) {
                comparator = arguments[0];
            } else if (arguments.length > 2) {
                throw new Error(
                    'Invalid parameters for MinHeap constructor');
            }
            var _this = this,
                data = new Array(size),
                heapSize = 0;

            /**
                Get index in array of left child

                @method getLeftChildIndex
                @private
                @param  {number} nodeIndex Index of parent
                @return {number} Index of left child in array
             */
            function getLeftChildIndex(nodeIndex) {
                return 2 * nodeIndex + 1;
            }

            /**
                Get index in array of right child

                @method getRightChildIndex
                @private
                @param  {number} nodeIndex Index of parent
                @return {number} Index of right child in array
             */
            function getRightChildIndex(nodeIndex) {
                return 2 * nodeIndex + 2;
            }

            /**
                Get index of parent

                @method getParentIndex
                @private
                @param  {number} nodeIndex Index of child
                @return {number} Index of parent
             */
            function getParentIndex(nodeIndex) {
                return Math.floor((nodeIndex + 1) / 2) - 1;
            }

            /**
                Heapify

                @method bubbleUp
                @private
                @param  {number} nodeIndex Index to bubbleUp
                @return {void}
             */
            function bubbleUp(nodeIndex) {
                if (nodeIndex === 0) {
                    return;
                }
                var parentIndex = getParentIndex(nodeIndex);
                if (comparator(data[parentIndex], data[nodeIndex]) > 0 &&
                    parentIndex >= 0) {
                    var newNodeIndex = data[parentIndex];
                    data[parentIndex] = data[nodeIndex];
                    data[nodeIndex] = newNodeIndex;
                    nodeIndex = parentIndex;
                    bubbleUp(nodeIndex);
                } else {
                    return;
                }
            }

            /**
                Remove minimum element from heap

                @method removeMin
                @private
                @return {Object} Data of minimum node
             */
            function removeMin() {
                if (heapSize === 0) {
                    return;
                }
                data[0] = data[heapSize - 1];
                heapSize--;
                if (heapSize > 0) {
                    bubbleDown(0);
                }
            }

            /**
                Heapify

                @method bubbleDown
                @private
                @param  {number} nodeIndex Index of node to modify
                @return {void}
             */
            function bubbleDown(nodeIndex) {
                var leftChildIndex = getLeftChildIndex(nodeIndex),
                    rightChildIndex = getRightChildIndex(nodeIndex),
                    smallerValueIndex;
                // This long if else assigns the smaller child
                if (leftChildIndex < heapSize && rightChildIndex < heapSize) {
                    if (comparator(data[leftChildIndex], data[
                        rightChildIndex]) < 0) {
                        smallerValueIndex = leftChildIndex;
                    } else {
                        smallerValueIndex = rightChildIndex;
                    }
                } else if (leftChildIndex < heapSize) {
                    smallerValueIndex = leftChildIndex;
                } else if (rightChildIndex < heapSize) {
                    smallerValueIndex = rightChildIndex;
                } else {
                    return;
                }
                if (smallerValueIndex >= 0 && comparator(data[
                    smallerValueIndex], data[nodeIndex]) < 0) {
                    var temp = data[nodeIndex];
                    data[nodeIndex] = data[smallerValueIndex];
                    data[smallerValueIndex] = temp;
                    nodeIndex = smallerValueIndex;
                    bubbleDown(nodeIndex);
                }
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            /**
                Add object to MinHeap

                @method add
                @param  {Object} object Object to add
                @return {void}
             */
            this.add = function(object) {
                heapSize++;
                var currentIndex = heapSize - 1;
                data[currentIndex] = object;
                bubbleUp(currentIndex);
            };

            /**
                Return the minimum element and extract it

                @method poll
                @return {Object} The minimum element
             */
            this.poll = function() {
                var min = data[0];
                removeMin();
                return min;
            };

            /**
                Return the minimum element without extracting it

                @method peek
                @return {Object} The minimum element
             */
            this.peek = function() {
                return data[0];
            };

            /**
                Clear the MinHeap of all elements

                @method clear
                @return {void}
             */
            this.clear = function() {
                heapSize = 0;
                data.forEach(function(element, index) {
                    delete data[index];
                });
            };

            Object.defineProperties(this, {
                /**
                    Number of elements in the MinHeap

                    @property length
                    @type {number}
                 */
                length: {
                    get: function() {
                        return heapSize;
                    }
                }
            });
        }
    };

    return module;
});
