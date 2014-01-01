/**
    Maze class generates a maze from a graph.

    @class Maze
    @extends Sprite
 */
define([
    'sprite/sprite',
    'foundation/shape',
    'util/hash',
    'util/graph',
    'util/mathExtensions',
    'enum/direction'
], function(Sprite, Shape, Hash, Graph, MathExtensions, Direction) {
    'use strict';

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var
    TILE_SIDE = 50,
        FILL_STYLE = '#7CF2EC',
        WALL_STYLE = '#FFFFFF',
        EMPTY_STYLE = '#000000',
        WALL_THICKNESS = 4;

    /**
        @module sprite/maze
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
             @class Maze
             @constructor
         */

        Maze: function(numWidth, numHeight, drawer) {
            var _this = this;

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var
            locations = [],
                shapes = [];

            /**
                MazeLocation represents locations within a maze

                @class MazeLocation
                @for Maze
                @constructor
                @param  {integer} i Row index of location
                @param  {integer} j Column index of location
             */
            function MazeLocation(i, j) {
                var _thisLocation = this;

                /**
                    Row index of MazeLocation in Maze

                    @property row
                    @type {integer}
                 */
                this.row = i;

                /**
                    Column index of MazeLocation in Maze

                    @property column
                    @type {integer}
                 */
                this.column = j;

                /***
                    x coordination of tile

                    @property x
                    @type {number}
                 */
                this.x = TILE_SIDE * this.column;

                /**
                    y coordination of tile

                    @property y
                    @type {number}
                 */
                this.y = TILE_SIDE * this.row;

                /**
                    Width of tile

                    @property width
                    @type {number}
                 */
                this.width = TILE_SIDE;

                /**
                    Width of tile

                    @property height
                    @type {number}
                 */
                this.height = TILE_SIDE;

                /**
                    Tile rectangle to represent MazeLocation

                    @property tile
                    @type {Rectangle}
                 */
                this.tile = new Shape.Rectangle(this.x, this.y, TILE_SIDE,
                    TILE_SIDE, drawer, {
                        fillStyle: FILL_STYLE
                    });

                /**
                    Location to the left of this one

                    @property left
                    @type {MazeLocation}
                 */
                this.left = null;

                /**
                    Location to the right of this one

                    @property right
                    @type {MazeLocation}
                 */
                this.right = null;

                /**
                    Location above this one

                    @property up
                    @type {MazeLocation}
                 */
                this.up = null;

                /**
                    Location below this one

                    @property down
                    @type {MazeLocation}
                 */
                this.down = null;

                /**
                    A hash of walls with Direction enums as keys

                    @property walls
                    @type {Object}
                 */
                this.walls = {};

                this.walls[Direction.UP] = new MazeWall(this.x, this.y,
                    false);

                this.walls[Direction.DOWN] = new MazeWall(this.x,
                    this.y + TILE_SIDE, false);

                this.walls[Direction.RIGHT] = new MazeWall(this.x +
                    TILE_SIDE, this.y, true);

                this.walls[Direction.LEFT] = new MazeWall(this.x,
                    this.y, true);

                /**
                    Iterate through each wall of this location

                    @method forEachWall
                    @param  {Function} f Function to apply to each wall. It is
                    given the wall and the direction of the wall as parameters.
                    The function can exit iteration by returning true.
                    @return {void}
                 */
                this.forEachWall = function(f) {
                    for (var i = 0; i < 4; i++) {
                        var dir = Direction.MIN + 1;
                        f(_thisLocation.walls[dir], dir);
                    }
                };

                /**
                    Get the locaton in a given direction from this locaton

                    @method get
                    @param  {Direction} direction Direction enum
                    @return {MazeLocation} Adjacent location
                 */
                this.get = function(direction) {
                    var neighbors = [this.left, this.up, this.right, this.down];
                    return neighbors[direction - Direction.LEFT];
                };

                /**
                    Get an impenetrable location adjacent to this location

                    @method getImpenetrable
                    @for Maze
                    @return {MazeLocation} Impenetrable location if exists,
                    null otherwise
                 */
                this.getImpenetrable = function() {
                    for (var i = 0; i < 4; i++) {
                        var dir = Direction.LEFT + i,
                            location = this.get(dir);

                        if (location !== null && !this.walls[dir]
                            .isPenetrable) {
                            return location;
                        }
                    }
                    return null;
                };
            }

            /**
                Class to represent walls of MazeLocation

                @class MazeWall
                @constructor
                @for Maze
                @param  {number} x x coordinate of wall
                @param  {number} y y coordinate of wall
                @param  {boolean} isVertical Whether or not wall is vertical
             */
            function MazeWall(x, y, isVertical) {
                var
                w = isVertical ? WALL_THICKNESS : TILE_SIDE +
                    WALL_THICKNESS,
                    h = isVertical ? TILE_SIDE + WALL_THICKNESS :
                        WALL_THICKNESS,
                    isPenetrable = false;

                /**
                    Rectangle to display on canvas

                    @property rect
                    @type {Shape}
                 */
                this.rect = new Shape.Rectangle(x, y,
                    w, h,
                    drawer, {
                        fillStyle: WALL_STYLE,
                        strokeStyle: WALL_STYLE
                    });

                Object.defineProperties(this, {
                    /**
                        Whether or not the wall is penetrable

                        @property isPenetrable
                        @type {boolean}
                        @for Maze
                     */
                    isPenetrable: {
                        get: function() {
                            return isPenetrable;
                        },
                        set: function(value) {
                            isPenetrable = value;
                            if (isPenetrable) {
                                this.rect.drawingSettings.fillStyle =
                                    EMPTY_STYLE;
                                this.rect.drawingSettings.strokeStyle =
                                    EMPTY_STYLE;
                            } else {
                                this.rect.drawingSettings.fillStyle =
                                    WALL_STYLE;
                                this.rect.drawingSettings.strokeStyle =
                                    WALL_STYLE;
                            }
                        }
                    }
                });
            }

            /**
                Initialize maze

                @method init
                @private
                @return {void}
             */
            function init() {
                var i, j;
                for (i = 0; i < numHeight; i++) {
                    var locationRow = [];
                    for (j = 0; j < numWidth; j++) {
                        var location = new MazeLocation(i, j);
                        shapes.push(location.tile);
                        shapes.push(location.walls[Direction.UP].rect);
                        shapes.push(location.walls[Direction.DOWN].rect);
                        shapes.push(location.walls[Direction.LEFT].rect);
                        shapes.push(location.walls[Direction.RIGHT].rect);
                        locationRow.push(location);
                    }
                    locations.push(locationRow);
                }

                Sprite.Sprite.call(_this, shapes, drawer);

                connectLocations();
                generateMaze();
                eliminateBarriers();
            }

            /**
                Connect MazeLocations to their neighbors

                @method connectLocations
                @private
                @return {void}
             */
            function connectLocations() {
                _this.forEachLocation(function(location, i, j) {
                    if (i > 0) {
                        location.up = _this.get(i - 1, j);
                    }
                    if (i < numHeight - 1) {
                        location.down = _this.get(i + 1, j);
                    }
                    if (j > 0) {
                        location.left = _this.get(i, j - 1);
                    }
                    if (j < numWidth - 1) {
                        location.right = _this.get(i, j + 1);
                    }
                });
            }

            /**
                Generate the maze

                @method generateMaze
                @private
                @return {void}
             */
            function generateMaze() {
                var visited = new Hash.Hashset();

                function generateMazeHelper(location) {
                    if (location === null || visited.contains(location)) {
                        return;
                    }

                    location.tile.drawingSettings.fillStyle = EMPTY_STYLE;

                    var randomResult = randomNeighbor(location, visited),
                        randomDir = randomResult.dir,
                        randomLocation = randomResult.location;

                    if (randomLocation !== null) {
                        var
                        wall = location.walls[randomDir],
                            oppWall = randomLocation.walls[Direction
                                .opposite(randomDir)];

                        wall.isPenetrable = true;
                        oppWall.isPenetrable = true;
                        randomLocation.tile.drawingSettings.fillStyle =
                            EMPTY_STYLE;
                        visited.add(location);
                        generateMazeHelper(randomLocation);
                    }
                }

                _this.forEachLocationRandom(function(location) {
                    generateMazeHelper(location);
                });
            }

            /**
                Random neighbor of location that is not in visited set

                @method randomNeighbor
                @private
                @param  {MazeLocation} location Starting location
                @param  {Hashset} visited Visited location set
                @return {MazeLocation} Adjacent location
             */
            function randomNeighbor(location, visited) {
                var ret, usedDirs = [false, false, false, false];
                while (!usedDirs[0] || !usedDirs[1] || !usedDirs[2] || !
                    usedDirs[3]) {
                    var dir = Direction.random(),
                        idx = dir - Direction.MIN;
                    ret = {
                        dir: dir,
                        location: location.get(dir)
                    };
                    if (ret.dir !== null && !visited.contains(ret.location)) {
                        return ret;
                    }
                    if (!usedDirs[idx]) {
                        usedDirs[idx] = true;
                    }
                }
                return {
                    dir: null,
                    location: null
                };
            }

            /**
                Eliminate walls from the maze that make traversing the entrie
                maze impossible

                @method eliminateBarriers
                @private
                @return {void}
             */
            function eliminateBarriers() {
                _this.forEachLocation(function(location) {
                    var numReachable = numReachableLocations(location);
                    if (numReachable >= numWidth * numHeight) {
                        return true;
                    }
                    location.forEachWall(function(wall, dir) {
                        if (wall.isPenetrable) {
                            return;
                        }

                        var adjLocation = location.get(dir),
                            oppWall;

                        if (adjLocation !== null) {
                            oppWall = adjLocation.walls[Direction
                                .opposite(dir)];
                        }

                        wall.isPenetrable = true;
                        if (oppWall !== undefined) {
                            oppWall.isPenetrable = true;
                        }

                        var newNumReachable = numReachableLocations(
                            location);

                        if (newNumReachable === numWidth *
                            numHeight) {
                            return true; // Terminate iteration
                        } else if (newNumReachable <= numReachable) {
                            wall.isPenetrable = false;
                            if (oppWall !== undefined) {
                                oppWall.isPenetrable = false;
                            }
                        } else {
                            numReachable = newNumReachable;
                        }
                    });
                });
            }

            /**
                Count the number of reachable locations from an origin location

                @method numReachableLocations
                @private
                @param  {MazeLocation} origin Origin location
                @return {number} Number of reachable locations (including self)
             */
            function numReachableLocations(origin) {
                var visitedSet = new Hash.Hashset();

                function numReachableLocationsHelper(location) {
                    if (visitedSet.contains(location)) {
                        return 0;
                    }
                    visitedSet.add(location);
                    if (location.up !== null &&
                        location.walls[Direction.UP].isPenetrable) {
                        numReachableLocationsHelper(location.up);
                    }
                    if (location.down !== null &&
                        location.walls[Direction.DOWN].isPenetrable) {
                        numReachableLocationsHelper(location.down);
                    }
                    if (location.left !== null &&
                        location.walls[Direction.LEFT].isPenetrable) {
                        numReachableLocationsHelper(location.left);
                    }
                    if (location.right !== null &&
                        location.walls[Direction.RIGHT].isPenetrable) {
                        numReachableLocationsHelper(location.right);
                    }
                }

                numReachableLocationsHelper(origin);
                return visitedSet.length;
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            /**
                Iterate through each location in the maze

                @method forEachLocation
                @param  {Function} f Function to apply to each location.
                Function can exit iteration by returning true.
                @return {void}
             */
            this.forEachLocation = function(f) {
                for (var i = 0; i < numHeight; i++) {
                    for (var j = 0; j < numWidth; j++) {
                        var done = f(_this.get(i, j), i, j);
                        if (done === true) {
                            return;
                        }
                    }
                }
            };

            /**
                Iterate randomly through each location in the maze

                @method forEachLocationRandom
                @param  {Function} f Function to apply to each location.
                Function can exit iteration by returning true.
                @return {void}
             */
            this.forEachLocationRandom = function(f) {
                MathExtensions.randomIterator(numHeight, function(i) {
                    MathExtensions.randomIterator(numWidth, function(j) {
                        return f(_this.get(i, j), i, j);
                    });
                });
            };

            /**
                Generate a graph representing the maze

                @method toGraph
                @return {Graph} The graph
             */
            this.toGraph = function() {
                var
                graph = new Graph.Graph(),
                    nodes = [],
                    currentRowIndex,
                    currentRow;

                _this.forEachLocation(function(location, i, j) {
                    if (i !== currentRowIndex) {
                        if (currentRow !== undefined) {
                            nodes.push(currentRow);
                        }
                        currentRow = [];
                        currentRowIndex = i;
                    }
                    var node = graph.addNode(location);
                    currentRow.push(node);
                });
                nodes.push(currentRow);

                _this.forEachLocation(function(location, i, j) {
                    var
                    u = nodes[i][j],
                        v;

                    if (location.up !== null) {
                        v = nodes[i - 1][j];
                        graph.addEdge(u, v);
                    }
                    if (location.down !== null) {
                        v = nodes[i + 1][j];
                        graph.addEdge(u, v);
                    }
                    if (location.left !== null) {
                        v = nodes[i][j - 1];
                        graph.addEdge(u, v);
                    }
                    if (location.right !== null) {
                        v = nodes[i][j + 1];
                        graph.addEdge(u, v);
                    }
                });

                return graph;
            };

            /**
                Get MazeLocation with given row and column indices

                @method get
                @param  {integer} row Row index
                @param  {integer} column Column index
                @return {MazeLocation} MazeLocation at specified indices
             */
            this.get = function(row, column) {
                return locations[row][column];
            };

            // Call init to do setup
            init();
        }
    };

    return module;
});
