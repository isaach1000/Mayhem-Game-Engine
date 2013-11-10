define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    
    
    /**
     * @exports sprite/sprite
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        
        /**
         * Sprite
         * @constructor
         */
        Sprite: function() {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
			
			var shapes = [];
			
            
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            Object.defineProperties(this, {
            	/**
            	 * Shapes of sprite instance
            	 * @memberof module:sprite/sprite
            	 * @instance
            	 */
            	shapes: {
            		get: function() {
            			return shapes;
            		},
            		set: function(newShapes) {
            			shapes = newShapes;
            		}
            	},
            	
            	/**
            	 * BoundingBox of sprite instance
            	 * @memberof module:sprite/sprite
            	 * @instance
            	 */
            	boundingBox: {
            		get: function() {
            			return bbox;
            		},
            		set: function(newBbox) {
            			bbox = newBbox;
            		}
            	}
            });
            
            this.updateBoundingBox = function() {
            	var numShapes = shapes.length;
            	var minX, minY, maxX, maxY;
            	for (var i = 0; i < numShapes; i++) {
            		var shapeBox = this.shapes[i].boundingBox;
            		if (minX == null || minX > shapeBox.x) {
						minX = shapeBox.x;
            		}
            		if (minY == null || minY > shapeBox.y) {
						minY = shapeBox.y;
            		}
            		if (maxX == null || maxX < shapeBox.x) {
						maxX = shapeBox.x;
            		}
            		if (maxY == null || maxY < shapeBox.y) {
						maxY = shapeBox.y;
            		}
            	}
            };
        }
    };

    return module; 
});

