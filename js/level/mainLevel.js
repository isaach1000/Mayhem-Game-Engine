/**
    MainLevel contains all of the logic necessary for the main level of the
    game.

    @class MainLevel
    @extends LevelBase
 */
define(['jquery', 'level/levelBase', 'foundation/shape', 'foundation/animation',
    'sprite/human', 'sprite/tileMap'
], function($, LevelBase, Shape, Animation, Human, TileMap) {
    "use strict";
    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    /**
           @module level/mainLevel
         */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        /**
            @class MainLevel
            @constructor
        */
        MainLevel: function() {
            var _this = this;

            // Extend LevelBase constructor
            LevelBase.LevelBase.call(this);

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            function hitTest() {
                _this.inputHandler.bind('mousemove', function(ev) {
                    var point = {
                        x: ev.pageX,
                        y: ev.pageY
                    };
                    _this.quadTree.query(point).forEach(function(shape) {
                        if (shape.collisionTest(point)) {
                            shape.clear();
                            shape.drawingSettings.fillStyle =
                                'yellow';
                            shape.draw();
                        }
                    }, 50);
                });
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            this.start = function() {
                var poly = new Shape.Polygon({
                    x: 100,
                    y: 400
                }, [{
                    x: 100,
                    y: 0
                }, {
                    x: -100,
                    y: 0
                }, {
                    x: 0,
                    y: 100
                }], _this.mainDrawer, {
                    fillStyle: 'purple',
                    angle: 0
                });
                var rect = new Shape.Rectangle(100, 100, 50, 50, _this.mainDrawer, {
                    fillStyle: 'orange',
                    angle: 0
                });
                poly.draw();
                rect.draw();
                var human1 = new Human.Human(200, 200, this.mainDrawer);
                //human1.turn(Math.PI / 4);
                human1.draw();
                /*var human2 = new Human.Human(500, 500, this.mainDrawer);
                    human2.turn(Math.PI / 4);
                    human2.draw();
                    $('body').click(function() {
                        human2.step();
                    });*/
                //human1.step();
                var tileMap = new TileMap.TileMap(10, 10, 10, 10, 10, 10,
                    this.mainDrawer, [{
                        fillStyle: 'green'
                    }]);
                tileMap.draw();
                this.quadTree.insert(poly).insert(rect).insert(human1).insert(
                    tileMap);
                hitTest();
            };
        }
    };
    return module;
});
