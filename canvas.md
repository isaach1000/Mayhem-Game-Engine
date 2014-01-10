# Canvas

### Isaac Hier

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

```

## Performance considerations
The canvas API is fast, but JavaScript's single-threaded environment makes
handling performance imperative. Calculations and rendering can freeze the user-
interface and crash the site. Therefore, careful consideration is necessary when
designing complex games with many mathematical calculations. As Joseph Aharon
explains below, we used Web Workers to prevent performance issues.
