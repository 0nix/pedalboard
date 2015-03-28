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
	var temp = new joint.shapes.devs.Atomic({
		size:{ width:200, height: 200},
		inPorts:["In"],
		outPorts:["Out"],
		attrs:{
			image:{
				"xlink:href": "../test.png",
				width: 200,
				height: 200
			},
			rect: { fill: 'none' }, 
			text: { text: 'test', fill: 'black' }
		}
	});
	var component = function(w, h, imageDir){
		return new joint.shapes.devs.Atomic({
			size:{ width: w || 100, height: h || 168},
			inPorts:["In"],
			outPorts:["L","R"],
			attrs:{
				image:{
					"xlink:href": imageDir || "../gameboy.png",
					width: w || 100,
					height: h || 168
				},
				rect: { fill: 'none' }, 
				text: { text: 'test', display:"none" }
			}
		});
	}
	var link = function(source, inport, dest, outport){
		var link = new joint.shapes.devs.Link({
			source: {id:source.id, selector: source.getPortSelector(inport)},
			target: {id:dest.id, selector: dest.getPortSelector(outport)}
		});
		link.addTo(graph).reparent();
	};
	paper.on("blank:pointerdown",function(ev,x,y){
		$("#canvas").addClass("unselected");
		$("#canvas").removeClass("toSelect");
		if(elementPrimed){
			var r = component();
			r.position(x,y);
			graph.addCells([r]);
			elementPrimed = false;
		}
	});
	/*paper.on("cell:pointerclick",function(ev,x,y){
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

	});*/
	$(".menu-item").on("click",function(ev){
		$("#canvas").addClass("toSelect");
		$("#canvas").removeClass("unselected");
		elementPrimed = true;
		toSet = ev.currentTarget.id;
	});
}
run();