define([], function() {
    'use strict';
    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    /**
       @module util/physics
     */
    var module = {};

    /**
        Physics engine

        @constructor
        @class Engine
        @param  {Array} [objects=[]] An array of objects to control
     */
    module.Engine = function(objects) {
        this.objects = objects || [];
    };

    module.Engine.prototype = {
        /**
            Check shapes for collisions with point

            @method collisionQuery
            @param  {Point} point Point to test for
            @return {Array} Array of objects with bounding boxes that contain
            the given point
         */
        collisionQuery: function(point) {
            return this.objects.filter(function(obj) {
                return obj.boundingBox.containsPoint(point);
            });
        }
    };

    return module;
});
