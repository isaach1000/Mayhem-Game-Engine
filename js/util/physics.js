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
        var _this = this;

        ///////////////////////////
        // Public methods/fields //
        ///////////////////////////

        this.objects = objects || [];

        /**
            Check shapes for collisions with point

            @method collisionQuery
            @param  {Point} point Point to test for
            @return {Array} Array of objects with bounding boxes that contain
            the given point
         */
        this.collisionQuery = function(point) {
            return this.objects.filter(function(obj) {
                return obj.boundingBox.containsPoint(point);
            });
        };

        /**
            Notify the Engine instance that a change in positions occurred

            @method updatePositions
            @return {void}
         */
        this.updatePositions = function() {
            this.objects.forEach(function(obj) {
                if (obj.checkCollision !== undefined) {
                    var candidates = _this.objects.filter(function(
                        candidate) {
                        return candidate !== obj &&
                            candidate.boundingBox.intersects(obj.boundingBox);
                    });
                    if (candidates.length > 0) {
                        obj.checkCollision(candidates);
                    }
                }
            });
        };
    };

    return module;
});
