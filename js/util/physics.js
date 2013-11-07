define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    
    
    /**
     * @exports util/physics
     */
    var module = {
    };
    
    Object.defineProperties(module, {
    	GRAVITY: {
    		value: 0.008,
  			enumerable: true    		
    	},
    	ENERGY_LOSS_RATIO: {
    		value: 0.8,
  			enumerable: true    		
    	}
    });

    return module; 
});
