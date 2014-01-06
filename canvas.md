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

## The Canvas API
The canvas API is simplistic. The API methods allow one to draw lines,
basic shapes, and custom paths. However, there are many needed methods that
are not included in the canvas API. For example, there is no method to draw a
dotted line in the current canvas API. One must implement this method own his/
her own in order to draw dotted lines. Also, the current implementation does not
help with hit testing at all. There is no built-in method to find whether or not
the mouse or a polygon has collided with another polygon. The canvas programmer
must use mathematics to calculate these collisions, while keeping performance
high. A popular solution for hit-testing is to use bounding boxes. The bounding
boxes are used to check for collisions before performing expensive calculations
to determine polygon collisions (using ray-casting, etc.). Finally, various
transformations can be applied to the drawing context, such as translating,
scaling, and rotating. In practice, it proves easier to use transformation
matrices to represent the various transformations. This allows the programmer
to handle various different transformations when considering collisions, etc.

## Performance considerations
The canvas API is fast, but JavaScript's single-threaded environment makes
handling performance imperative. Calculations and rendering can freeze the user-
interface and crash the site. Therefore, careful consideration is necessary when
designing complex games with many mathematical calculations. As Joseph Aharon
explains below, we used Web Workers to prevent performance issues.
