# Web Workers

### Joseph Aharon

## The problem: JavaScript is limited to executing its code within a single thread.
Computer processors are built to run through and execute code one line at a time. This means that computers cannot begin new tasks before finishing their current jobs.

If that’s the case, how is it that a computer can still operate quickly while running through large loads of work? The answer is multithreading. Today’s computers are built with multiple core processors that allow them to run more than one process at a given time. In other words, computers can execute multiple blocks of code simultaneously. This sort of multitasking is what enables computers to run multiple applications, each of which compute complicated tasks, at once.

JavaScript, however, is not intrinsically able to take advantage of multi-threading. Web applications, which run on JavaScript, are therefore limited to running within a single thread. This makes the processing power of web applications weaker than optimal, and such applications that run long processes can freeze the user’s window. We all know how annoying that can be.

## The solution: Web Workers are JavaScripts that run in the background, independently of other scripts, without affecting the performance of a page.
By using Web Workers, a user can click or select user interface elements while the web worker runs in the background. This allows a web browser to separate the tasks of, say, drawing an image from computing the logic behind how that image should be rendered. The result is a window that won’t become unresponsive and an overall smoother user experience.

## Our demo:
The above version of the Pacman game is slow because there are two concurrent processes. One is using the canvas to constantly redraw the visuals which is the primary focus of the above project. The second process is the computation of the game logic. The game implements Dijkstra’s search algorithm to determine the shortest path from the monster to the player. This algorithm has a long runtime, and although the monster’s path came out somewhat buggy, he usually makes his way to the player.

The above demo has rendering errors because the game is trying to run these two sophisticated processeses simultaneously. If you check the worker checkbox and press "Reset", the resulting game is the same exact game, but it uses Web Workers to separate the two tasks. As you can see, the result is a smoother game that remains responsive to the user's input.

## Alternative Solutions to the problem:
Web Workers is the only way to implement multithreading in web pages.
One similar alternative might be to use event driven programming, or a paradigm in which the flow of the program is determined by events. In such cases, the application is divided into two main loops: event detection and event processing.
Web applications would be able to incorporate event driven programming by using a framework such as node.js.

## Tradeoffs encountered during implementation:
One barrier to implementing Web Workers is that the programmer must have an understanding of multithreading and be able to separate different processes. At the same time, the programmer needs to be able to bring those separate processes back together to communicate with each other in order to make one smoothly running application.

A tradeoff with workers is that it is not so simple to pass off complex data types to the worker or from the worker back to the main thread.  This means that our program could not send JSON objects back and forth between the worker. To deal with this issue, when sending off data to the worker, our application calls a method that encodes the JSON data into an array data type of primitives. After the worker receives the array, the worker then calls another method that reconstructs the JSON object from the array data. In our case, the data being passed is a graph of the two dimensional layout of the game.


Further reading:
[Web worker - Wikipedia](http://en.wikipedia.org/wiki/Web_worker)
[HTML5 Web Workers - W3Schools](http://www.w3schools.com/html/html5_webworkers.asp)
[The Basics of Web Workers - HTML5 Rocks](http://www.html5rocks.com/en/tutorials/workers/basics/)
[Using web workers - Web developer guide | MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/Performance/Using_web_workers)
