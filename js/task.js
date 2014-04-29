var WorkerTasks = require('./worker/workerTasks.js');

addEventListener('message', function(ev) {
    var data = ev.data;

    if (data.graph !== undefined &&
        data.source !== undefined &&
        data.destination !== undefined) {
        var
            graph = WorkerTasks.constructGraph(data.graph),
            sourceNode = graph.getNode(data.source),
            destinationNode = graph.getNode(data.destination),
            path = WorkerTasks.getPath(graph, sourceNode, destinationNode);

        self.postMessage({
            moves: path,
            responseId: data.messageId
        });
    }
});
