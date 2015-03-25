var run = function(){
	var graph = new joint.dia.Graph;
	var paper = new joint.dia.Paper({
		el: $("#canvas"),
		model: graph,
		height: 400,
		gridSize: 1
	});
}
run();