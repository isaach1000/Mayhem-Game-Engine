console.debug("worker succeeded");

/*
self.addEventListener('message', runGraph(), false);

function runGraph() {
	var graph = new module.Graph();
	self.postMessage(graph);
}
*/

self.addEventListener('message', function(ev) {
    self.postMessage(ev.data);
});
