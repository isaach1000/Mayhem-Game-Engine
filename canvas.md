# Canvas

#### Isaac Hier

## The Problem
Before HTML5, there was no way to render custom drawings to the screen. Flash
gained popularity because it provided an interface for rendering drawings and
animations.

## The Solution
As the web standard has progressed, it became apparent that modern
browsers could implement this technology without the use of plugins. With the
release of HTML5 came the new canvas DOM element. The canvas element can render
two-dimensional drawings, and eventually, will be relied upon to handle
three-dimensional drawings as well. Although Flash is still widely used on the
web, many mobile browsers have dropped support for Flash, making it a dying
platform.

## The Canvas Context
In order to draw to the canvas element, one must retrieve the context from that
canvas element. If we were to have a canvas on our page with the id "myCanvas",
we could retrieve the canvas context (using jQuery) like so:

```javascript
var ctx = $('#myCanvas')[0].getContext('2d'); // Get 2d context
```

## Creating 2D Worlds With Canvas
Canvas, like other rendering API's, provides drawing methods, but leaves
the developer with the task of abstracting these low-level methods. For example,
the drawing of a line in canvas looks like this

```javascript
ctx.moveTo(3, 2); // change position to xy coordinate (3, 2)
ctx.lineTo(10, 5); // draw line from position to xy coordinate (10, 5)
ctx.stroke(); // stroke the line
```

But what if we want to draw a polygon? Canvas has no method that takes an array
of points and draws a polygon. The solution looks something like this:

```javascript
ctx.beginPath();
ctx.moveTo(points[0].x, points[0].y);

for (var i = 1; i < points.length; i++) {
	var pt = points[(i + 1) % numPoints];
	ctx.lineTo(pt.x, pt.y);
}

ctx.fill();
ctx.stroke();
```

Also, you can see that the methods do not takes objects, only primitives. This
is not such an issue for points, but becomes an issue with shapes and matrices.
The transform method has six required parameters!

In order to give the canvas context a more object-oriented interface, I started
this project with the foundation/canvasDrawer module. This module contains a
class that effectively wraps a canvas context within a more appealing interface.

### The CanvasDrawer Class
The CanvasDrawer class mostly contains simple wrapper methods. However, there
are a few very significant differences.

First, in order to set options for stroke color, fill color, line width, font,
and others, one must set the appropriate fields of the context, like so:

```javascript
ctx.fillStyle = 'orange';
ctx.strokeStyle = 'blue';
ctx.lineWidth = 4;
```

This becomes verbose and does not follow the way JavaScript usually
handles these types of modifications. Inspired by jQuery, I created a single
field called contextSettings, which can modify multiple settings in one shot.

```javascript
ctx.contextSettings = {
	fillStyle: 'orange',
	strokeStyle: 'blue',
	lineWidth: 4
};
```

Although the number of lines of code grew, the above code represents an
optimization for the following reason: we can now set the options for multiple
canvases with one settings object, as opposed to calling the respective methods
of each instance. (This is a valid solution because the CanvasDrawer makes a
deep copy of the settings object, so it would not affect all of the object if
one changed one of their settings.)

Later, jQuery inspired me again and I added method chaining to the canvas
context. This was surprisingly helpful. Code that once looked like this:

```javascript
drawer.save();
drawer.transform(this.transformation);
drawer.clearRect(x, y, w, h);
drawer.restore();
```

Now looks like this:

```javascript
drawer.save()
	.transform(this.transformation)
	.clearRect(x, y, w, h)
	.restore();
```

The CanvasDrawer class takes a procedural canvas context and puts it in a
JavaScript-styled interface. This forms the foundation of a long and arduous
journey to make useful classes to represent shapes, animations, transformations,
sprites, and finally, levels.

## Object-Oriented Game Development
The next step is to separate every other aspect of the game into classes. These
classes are stored in multiple files and folders, but are built into a single
file using Grunt before deployment. The names of the many of the directories
reflect the different categories of objects that we dealt with: enum, events,
foundation, level, sprite, util (lib, spec, and worker are intentionally not
included). In terms of the abstraction hierarchy, the foundation folder contains
the most fundamental modules for our game engine: canvasDrawer, shape, and
animation.

### Shapes
From this point on, no object will call a canvas context method directly, all
interactions are controlled through the CanvasDrawer instances. The shape module
contains all of the basic shape classes. The first class in the module is Shape.
This is an abstract class that defines behaviors common for all basic shapes,
such as drawing and clearing methods and x, y, angle, drawingSettings, etc.
fields. The abstract class is also responsible for collision detection, which
each subclass overrides.

Circle is a simple class. The drawing of a circle is as simple as calling the
arc method of the canvas context. Collision detection is also simple, just check
if the distance from the center to the point is less than the radius.
On the other hand, polygons are very difficult to deal with. The drawing of a polygon involves iterating through its points and calling canvas methods at each iteration. The collision detection algorithm for polygons is computationally expensive and confusing. The method of
choice is called ray-casting. The idea is to draw an imaginary line from a point
outside of the polygon to the point that we are testing. Then, check the number
of times this imaginary line intersects with a side of the polygon. If the
number is odd, the point is within the polygon, otherwise, it is outside of the
polygon. These calculations are so computationally inefficient, performing these
calculations for every suspected collision. would slow down the game engine
significantly Therefore, each shape also has a bounding box, represented
by the BoundingBox class in util/boundingBox. Using bounding boxes, we can skip
the difficult calculations if a point does not lie in the bounding box of the
polygon. The bounding box is always bigger than the shape it contains.

Finally, it is worth mentioning that the shapes will round floats when they are
set for x or y coordinates. This may require changing in the future to
accurately reflect the physics of the game, but there are benefits in rounding
floats to integers when drawing. The canvas element uses pixel as its measure,
so decimals mean that a number is between two pixels. Since a pixel is a
discrete entity, splitting it isn't really possible. In fact, the browser may
make the drawing worse by compensating for the floating point value using
antialiasing.

### Transformations
Although canvas has methods for rotating, translating, and scaling the context,
it is simpler to represent these changes as a transformation matrix. The
equation below illustrates the use of a transformation matrix:

<pre>
| x' |   | s<sub>x</sub> sh<sub>x</sub> t<sub>x</sub> | | x |
| y' | = | sh<sub>y</sub> s<sub>y</sub> t<sub>y</sub> | | y |
| 1  |   | 0 <sub> </sub> 0<sub> </sub> 1<sub> </sub> | | 1 |
</pre>

<em>s<sub>x</sub></em> and <em>s<sub>y</sub></em> determine the
scaling of the original shape, so it is originally set to 1, which is 100%.
<em>sh<sub>x</sub></em> and <em>sh<sub>y</sub></em> refer to the shear of the
original shape and are also used in rotations. <em>sh</em> is initially 0.
<em>t</em> determines the translation of the original shape. Originally, the
translation is 0. The values of the matrix determine the position, scaling,
rotation, and more. The util/mathExtension module contains the Transformation
class. By applying this matrix to each point, we can transform a shape from its
original space to a local space. Note that these transformations must be
considered when doing collision tests.

Rotation is done using a rotation matrix. A rotation matrix looks like this:
<pre>
| cos&theta;  -sin&theta;  0 |
| sin&theta;   cos&theta;  0 |
| 0      0     1 |
</pre>
where &theta; is the counterclockwise angle of rotation. Multiplying the
current transformation with a rotation matrix produces a rotation of the
original transformation.

### Animations
An animation can be modeled as a function that clears the frame, updates the
shape, and redraws the shape until a condition is met. By definition, an
animation must be asynchronous. If it were synchronous, we could not have
animations running concurrently, nor anything else for that matter. As is
typical with JavaScript, asynchronous methods are handled with callbacks. When
the animation completes, it calls another function. To minimize the amount of
confusing callbacks, all animations are defined as instances of the Animation
class in the foundation/animation module. An animation instance is constructed
with a shape, an update function, and a callback function. The update function
is given the following parameters: the total time the animation has been running
and the time since the last call of this function. The reason the animation
needs time as opposed to frame number is that the frame rate is not necessarily
constant. Smooth animations need to be at a constant rate. In order to terminate
the animation, the update function must return true (truthy values are not
considered as true to terminate the animation). The callback function is
optional, but crucial for multiple animations. To run the animation, the `start`
method must be called on the Animation instance. Because the callback must be
defined with the construction of the Animation instance, successive animations
must be listed in reverse order.

#### Example:
```javascript
// The shape we will animate
var circle = new Circle(100, 100, 30, drawer, {});
// Last animation is constructed first, without a callback.
var anim2 = new Animation(circle, function(time, timeDiff) {
	var totalDistance = 100; // Move down 100px
	var totalTime = 500; // 500 milliseconds
	// Translate the circle using the transformation matrix.
	// Calculate distance based on rate * time.
	circle.transformation.ty = timeDiff / totalTime * totalDistance;
	return time >= totalTime; // Returns true once 500 milliseconds has passed
});
var anim1 = new Animation(circle, function(time, timeDiff) {
	var totalDistance = 100; // Move right 100px
	var totalTime = 500; // 500 milliseconds
	// Translate the circle using the transformation matrix.
	// Calculate distance based on rate * time.
	circle.transformation.tx = timeDiff / totalTime * totalDistance;
	return time >= totalTime; // Returns true once 500 milliseconds has passed
}, anim2.start);
// Start first animation, which will trigger second animation.
anim1.start();
```

## The Next Level: Sprites and Levels
### Sprites
Now that we have a useful way to draw basic shapes, the next logical step is
to create groupings of these shapes. These groupings are referred to as
sprites. The sprite/sprite module contains an abstract class called Sprite.
Instances of this class are made up of multiple shapes. Most of the methods are
similar to the methods of Shape. For example, they both have a `draw` method and
they both have a `collisionTest` method. This structure let's us consider
sprites as big shapes. The methods are meant to be very similar, except that a
Sprite instance performs the method on all the Shape instances that it contains.
Sprites have to keep their bounding boxes consistent. Even if the orientation of
the sprite does not change (meaning the transformation matrix is not affected),
the bounding box must update every time one of its shapes move. Sprites also
have transformations. Its shapes are defined around the origin, which represents
the center of the sprite. The transformations of the shapes are used to define
the shapes around the center of the sprite. Then the sprite has an overall
transformation. This transformation is used to transform all of the shapes in
the sprite in unison.

Another major distinction should be made between shapes and sprites. While
shapes are only simple representations of canvas drawings, sprites can represent
characters, maps, or any other game object, containing methods that handle game
logic.

### Sprites in the Game
The sprites in this game are the player, the enemy, the prize and the maze are
all sprites. The player and enemy both inherit from the AbstractPlayer class.
The main differences between the player and the enemy are their shapes. The move
method of both is inherited from the superclass. While player uses keyboard
input to supply moves to the move method, the enemy relies on an asynchronous
pathfinding algorithm to supply it with moves.

### Levels
Levels are at the top of the abstraction hierarchy developed in this project.
Levels are responsible for instantiating sprites, handling events, and bringing
all the game logic together in a coherent fashion. Levels extend the
level/levelBase abstract class. This class contains methods to create canvases
and/or CanvasDrawers and initializes the physics engine and input handler. Each
sprite should be given its own canvas. The performance difference is not that
significant if there is a difference at all. When a shape updates its position,
it clears a significant area from the canvas, which may contain another shape
that was not supposed to be erased.

#### Physics Engine
The physics engine is extremely simple as of now. It has a public array of
objects that are objects it manages. These objects are to call the
`updatePositions` method whenever they move. The `updatePositions` method will
call the `checkCollision` method of each object if it has one, with a parameter
of all of the other objects that it may collide with. The other method of the
physics engine is the `collisionQuery` method. This method returns all of the
objectssthat intersect a given point. This is a useful feature to check if the
mouse intersects a shape.

#### Input Handler
The events/inputHandler module contains the inputHandler class. This class is
used to manage event handling functions. Functions are bound and unbound as
appropriate to update the functions that should be called on a given event.

### Miscellaneous Modules/Classes
There are various data structures in the util directory. The util/factory module
contains a class that is used to create DOM elements. The spec directory
contains tests for certain classes and the specRunner script, which is used to
launch the tests in the specs.html file.

## Performance considerations
The canvas API is fast, but JavaScript's single-threaded environment makes
optimizing performance imperative. Calculations and rendering can freeze the
user interface and crash the site. Therefore, careful consideration is necessary
when designing complex games with many mathematical calculations. As Joseph
Aharon explains below, we used Web Workers to prevent performance issues.

********************************************************************************
