define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    
    var globalId = 0;
    
    
    /**
     * @exports worker/workerMessenger
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        
        /**
         * WorkerMessenger
         * @constructor
         */
        WorkerMessenger: function(target, id) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            
            var that = this;
            
            target = target || self;
            if (id === undefined) {
                id = globalId++;
            } 
            
            
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
           
            that.sendMessage = function(functionName, params) {
                target.postMessage({
                    id: id,
                    functionName: functionName,
                    params: params
                });
            };
        }
    };

    return module; 
});
