/**
    Class to abstract receiving messages from a WebWorker.
    @class WorkerReceiver
 */
define([], function() {
    "use strict";
    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    var receiverId = 0;
    /**
       @module worker/workerReceiver
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        /**
           @class WorkerReceiver
           @constructor
           @param {Object} objectHandle An object to be affected by the worker
           @param {integer} id An ID number
         */
        WorkerReceiver: function(objectHandle, id) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            var _this = this;
            if (id === undefined) {
                id = receiverId++;
            }
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            /**
                Handle a received message.

                @method handleMessage
                @param  {Event} event An event from a WebWorker.
                @return {void}
             */
            this.handleMessage = function(event) {
                var data = event.data;
                // TODO
                console.debug('r-%s receiving from m-%s: %s, %o', id, data.id,
                    data.functionName, data.params);
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
