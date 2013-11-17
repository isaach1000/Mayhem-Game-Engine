define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    
    var globalId = 0;
    
    
    /**
     * @exports worker/workerReceiver
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        
        /**
         * WorkerReceiver
         * @constructor
         */
        WorkerReceiver: function(objectHandle, id) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var that = this;
            
            if (id === undefined) {
                id = globalId++;
            }

            
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            that.handleMessage = function(event) {
                var data = event.data;
                console.debug('r%d receiving from m%d: %s, %o', id, data.id, data.functionName, data.params);
                
                if (data.id !== id) {
                    return;
                }
                
                var func = data.functionName;
                if (objectHandle[func] !== undefined) {
                    var params = data.params;
                    objectHandle[func].apply(objectHandle, params);
                }
            };
        }
    };

    return module; 
});
