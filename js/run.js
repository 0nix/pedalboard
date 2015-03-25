var run = function(){
	var graph = new joint.dia.Graph;
	var toSet;
	var elementPrimed = false;
	var linkPrimed = false;
	var toLink;
	var paper = new joint.dia.Paper({
		el: $("#canvas"),
		model: graph,
		height: 400,
		gridSize: 1
	});
	var rectTemp = new joint.shapes.basic.Rect({
		size: {width: 100, height: 30},
		attrs: {
			rect:{fill:"blue"},
			text:{text:"hello", fill:"white"}
		}
	});
	paper.on("blank:pointerdown",function(ev,x,y){
		$("#canvas").addClass("unselected");
		$("#canvas").removeClass("toSelect");
		if(elementPrimed){
			var r = rectTemp.clone();
			r.position(x,y);
			r.attr({
				text: { text: toSet}
			});
			graph.addCells([r]);
			elementPrimed = false;
		}
	});
	paper.on("cell:pointerclick",function(ev,x,y){
		if(!linkPrimed){
			//console.log(ev.model.id);
			graph.getCell(ev.model.id).attr({
				rect:{fill:"purple"}
			})
			linkPrimed = true;
			toLink = ev.model.id;
		}
		else{
			graph.addCells([
				new joint.dia.Link({
					source:{id: toLink},
					target:{id: ev.model.id}
				})
			]);
			linkPrimed = false;
			graph.getCell(toLink).attr({
				rect:{fill:"blue"}
			})
		}

	});
	$(".menu-item").on("click",function(ev){
		$("#canvas").addClass("toSelect");
		$("#canvas").removeClass("unselected");
		elementPrimed = true;
		toSet = ev.currentTarget.id;
	});
}
run();