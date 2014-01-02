var $ = require('../lib/jquery');

/**
    Handle inputHandler from keyboard and mouse

    @class InputHandler
 */


//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

/**
    @module events/inputHandler
 */
var thisModule = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
         @class InputHandler
         @constructor
         @param {string} domSelector Selector for target element
     */
    InputHandler: function(domSelector) {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var
        eventHandlers = {},
            $domElement = $(domSelector);

        function addHandler(eventName, handler) {
            if (eventHandlers[eventName] === undefined) {
                eventHandlers[eventName] = [];
                $domElement.on(eventName, function(event) {
                    eventHandlers[eventName].forEach(function(
                        handler) {
                        var currentDate = new Date();
                        if (currentDate - handler._lastTime >=
                            handler._delay) {
                            handler._lastTime = currentDate;
                            handler(event);
                        }
                    });
                });
            }
            eventHandlers[eventName].push(handler);
        }

        function removeHandler(eventName, handler) {
            if (eventHandler[eventName] !== undefined) {
                var index = eventHandlers[eventName].indexOf(handler);
                if (index >= 0) {
                    eventHandler[eventName].splice(index, 1);
                }
            }
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        /**
            Bind a handler to an event

            @method bind
            @param  {string} eventName Name of the event
            @param  {Function} handler Handler to unbind
            @param  {number} [delay=0] Minimum delay between calls to handler
            @return {void}
        */
        this.bind = function(eventName, handler, delay) {
            handler._delay = delay || 0;
            handler._lastTime = 0;
            addHandler(eventName, handler);
        };

        /**
            Unbind a handler from an event

            @method unbind
            @param  {string} eventName Name of the event
            @param  {Function} handler Handler to unbind
            @return {void}
         */
        this.unbind = function(eventName, handler) {
            removeHandler(eventName, handler);
        };
    }
};

module.exports = thisModule;
