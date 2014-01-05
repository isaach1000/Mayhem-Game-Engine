var
Graph = require('./util/graph'),
    Direction = require('./enum/direction');

/**
    Build a graph object from a JSON object passed from the worker

    @method constructGraph
    @param  {Object} dictionary JSON object representing graph
    @return {Graph} Graph representing JSON object
 */
function constructGraph(dictionary) {
    var
    graph = new Graph.Graph(),
        key;
    // Add the nodes to the graph
    for (key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            key = parseInt(key);
            graph.addNode(key);
        }
    }
    // Add the edges
    for (key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            key = parseInt(key);

            var
            node = graph.getNode(key),
                neighborArr = dictionary[key],
                neighborArrLen = neighborArr.length,
                edge,
                neighborKey,
                neighbor,
                direction;

            for (var index = 0; index < neighborArrLen; index++) {
                neighborKey = neighborArr[index];
                if (neighborKey !== undefined) {
                    neighbor = graph.getNode(neighborKey);
                    direction = index + Direction.MIN;
                    edge = graph.addEdge(node, neighbor);
                    edge.data = direction;
                }
            }
        }
    }
    return graph;
}

/**
    Get path from source node to destinaton node

    @method getPath
    @param  {Graph} graph Graph
    @param  {GraphNode} source Source node to start from
    @param  {GraphNode} dest Destination node to stop at
    @return {Array} Array of Direction enums representing the path
 */
function getPath(graph, source, dest) {
    var
    currentNode,
        path = [];

    graph.dijkstra(source, dest);

    currentNode = dest;
    while (currentNode.previous !== undefined) {
        var dir = graph.getEdge(currentNode.previous, currentNode).data;
        path.push(dir);
        currentNode = currentNode.previous;
    }

    return path.reverse();
}

addEventListener('message', function(ev) {
    var data = ev.data;

    if (data.graph !== undefined &&
        data.source !== undefined &&
        data.destination !== undefined) {
        var
        graph = constructGraph(data.graph),
            sourceNode = graph.getNode(data.source),
            destinationNode = graph.getNode(data.destination),
            path = getPath(graph, sourceNode, destinationNode);

        self.postMessage({
            moves: path,
            responseId: data.messageId
        });
    }
});
