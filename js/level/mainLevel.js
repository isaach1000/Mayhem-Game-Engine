var
LevelBase = require('./levelBase'),
    Shape = require('../foundation/shape'),
    Animation = require('../foundation/animation'),
    Maze = require('../sprite/maze'),
    Player = require('../sprite/player'),
    Enemy = require('../sprite/enemy'),
    Prize = require('../sprite/prize'),
    Direction = require('../enum/direction');

/**
    MainLevel contains all of the logic necessary for the main level of the
    game.

    @class MainLevel
    @extends LevelBase
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////

var COLLISION_DELAY = 50;

/**
   @module level/mainLevel
 */
module.exports = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
        @class MainLevel
        @constructor
        @param {Worker} [worker=undefined] A web worker to improve efficient
        code execution
    */
    MainLevel: function(worker) {
        var _this = this;

        // Extend LevelBase constructor
        LevelBase.LevelBase.call(this);

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        // mousePoint to keep track of cursor
        var mousePoint;

        function hitTest() {
            var pos = $('canvas').first().position();
            // Update mousePoint on every mousemove
            _this.inputHandler.bind('mousemove', function(ev) {
                mousePoint = {
                    x: ev.pageX - pos.left,
                    y: ev.pageY - pos.top
                };
            });

            // Search QuadTree on mousemove with COLLISION_DELAY ms delay
            _this.inputHandler.bind('mousemove', function() {
                _this.physicsEngine.collisionQuery(mousePoint)
                    .forEach(function(shape) {
                        if (shape.collisionTest(mousePoint)) {
                            console.debug('shape');
                        }
                    });
            }, COLLISION_DELAY);
        }

        function writeBanner(text, textColor) {
            // If #banner exists, remove
            $('#banner').detach();

            var
            canvasDrawer = _this.createContext('banner'),
                x = _this.WIDTH / 2,
                y = _this.HEIGHT / 2;

            canvasDrawer.contextSettings = {
                font: '40pt Arial',
                textAlign: 'center',
                fillStyle: textColor
            };
            canvasDrawer.fillText(text, x, y);
        }

        /**
            Function to perform on player winning.

            @method win
            @private
            @param  {Player} player Player
            @return {void}
         */
        function win(player) {
            var
            rate = 1 / 500,
                posDiff = 2,
                vel = 2,
                winAnim = new Animation.Animation(player, function(time,
                    timeDiff) {
                    player.transformation.sx += timeDiff * rate;
                    player.transformation.sy += timeDiff * rate;
                    return time > 5000;
                }, function() {
                    writeBanner('Winner!', 'green');
                }),
                toCenterAnim = new Animation.Animation(player, function(time,
                    timeDiff) {
                    var
                    dx = _this.WIDTH / 2 - player.transformation.tx,
                        dy = _this.HEIGHT / 2 - player.transformation.ty,
                        dist = Math.sqrt(dx * dx + dy * dy);

                    player.transformation.tx += vel * dx / dist;
                    player.transformation.ty += vel * dy / dist;
                    return Math.abs(dx) < posDiff &&
                        Math.abs(dy) < posDiff;
                }, function() {
                    winAnim.start();
                });

            toCenterAnim.start();
        }

        /**
            Function to perform on player's death.

            @method die
            @private
            @param  {Player} player Player
            @return {void}
         */
        function die(player) {
            var
            rate = 1 / 1000,
                shrinkTime = 5000,
                dieAnim = new Animation.Animation(player, function(time,
                    timeDiff) {
                    player.transformation.angle += time * rate;
                    player.transformation.sx = (shrinkTime - time) /
                        shrinkTime;
                    player.transformation.sy = (shrinkTime - time) /
                        shrinkTime;
                    return time > 5000;
                }, function() {
                    writeBanner('Game Over', 'red');
                });
            dieAnim.start();
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        this.start = function() {
            var
            mazeCtx = this.createContext('maze'),
                prizeCtx = this.createContext('prize'),
                enemyCtx = this.createContext('enemy'),
                playerCtx = this.createContext('player'),
                maze = new Maze.Maze(20, 10, mazeCtx),
                player = new Player.Player(1, 1, maze, this.inputHandler,
                    this.physicsEngine, playerCtx, function() {
                        player.isFrozen = true;
                        enemy.isFrozen = true;
                        prize.hide();
                        win(player);
                    }, function() {
                        player.isFrozen = true;
                        enemy.isFrozen = true;
                        die(player);
                    }),
                enemy = new Enemy.Enemy(8, 8, maze, player, this.physicsEngine,
                    enemyCtx, worker),
                prize = new Prize.Prize(9, 15, maze, prizeCtx);

            maze.draw();
            enemy.draw();
            player.draw();
            prize.draw();
            this.physicsEngine.objects = [enemy, player, prize];
            hitTest();
            enemy.start();
        };
    }
};
