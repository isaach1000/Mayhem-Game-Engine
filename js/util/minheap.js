// @formatter:off
define([], function() {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    // TODO


    /**
     * @module modulePath // TODO: replace modulePath
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        // TODO


        /**
         * ClassName // TODO: replace ClassName here and below
         * @constructor
         */
        MinHeap: function(size) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var _this = this,
            
            	data = new Array(size),
            	heapSize = 0;
            	
            function insert(object) {
            	heapSize++;
            	currentIndex = heapSize - 1;
            	data[currentIndex] = object;
            	bubbleUp(currentIndex);
            };  
            
            function extractMin() {
            	var min = data[0];
            	removeMin();
            	return min;
            };
            
            function bubbleUp(nodeIndex) {
            	if (nodeIndex === 0) {
            		return;
            	}   
            	var parentIndex = getParentIndex(nodeIndex);
            	if (data[parentIndex] > data[nodeIndex] && parentIndex >= 0) {
            		var newNodeIndex = data[parentIndex];
            		data[parentIndex] = data[nodeIndex];
            		data[nodeIndex] = newNodeIndex;
            		nodeIndex = parentIndex;
            		bubbleUp(nodeIndex);
            	}
            	else {
            		return;
            	}
            };
            	
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
			
			function bubbleDown(nodeIndex) {
            	var 
            		leftChildIndex = getLeftChildIndex(nodeIndex),
            		rightChildIndex = getRightChildIndex(nodeIndex),
            		smallerValueIndex;
            	// This long if else assigns the smaller child
            	if (leftChildIndex < heapSize && rightChildIndex < heapSize) {
            		if (data[leftChildIndex] - data[rightChildIndex] < 0) {
            			smallerValueIndex = leftChildIndex;
            		}
            		else {
            			smallerValueIndex = rightChildIndex;
            		}
            	}
            	else if (leftChildIndex < heapSize) {
            		smallerValueIndex = leftChildIndex;
            	}
            	else if (rightChildIndex < heapSize) {
            		smallerValueIndex = rightChildIndex;
            	}
            	else {
            		return;
            	}
            	if (smallerValueIndex >= 0 && data[smallerValueIndex] < data[nodeIndex]) {
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

            this.getLeftChildIndex = function(nodeIndex) {
            	return (2 * nodeIndex) + 1;
            };
            
            this.getRightChildIndex = function(nodeIndex) {
            	return (2 * nodeIndex) + 1;
            };
            
            this.getParentIndex = function(nodeIndex) {
            	return (nodeIndex - 1) / 2;
            };
            

        }
    };

    return module;
});