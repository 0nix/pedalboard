var mat = function(){
	 $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: true, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on click
      alignment: 'right', // Aligns dropdown to left or right edge (works with constrain_width)
      gutter: 0, // Spacing from edge
      belowOrigin: false // Displays dropdown below the button
    });
}
var run = function(){
	var graph = new joint.dia.Graph;
	var toSet;
	var elementPrimed = false;
	var linkPrimed = false;
	var toLink;
	var paper = new joint.dia.Paper({
		el: $("#canvas"),
		model: graph,
		gridSize: 1
	});
	var component = function(w, h, imageDir){
		return new joint.shapes.devs.Atomic({
			size:{ width: w || 100, height: h || 168},
			inPorts:["In"],
			outPorts:["L","R"],
			attrs:{
				image:{
					"xlink:href": imageDir || "../gameboy.png",
					//"xlink:href": imageDir || "http://placehold.it/100x168",
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
			var str = JSON.stringify(graph.toJSON());
			var b64 = window.btoa(str);
			console.log(b64);
			console.log(window.atob(b64));
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
		ev.preventDefault();
		$("#canvas").addClass("toSelect");
		$("#canvas").removeClass("unselected");
		toast('Click on the workspace to add your element', 3500);
		elementPrimed = true;
		toSet = ev.currentTarget.id;
	});
}
mat();
run();