var bone = {};
var model = function(){
	bone.Model = Backbone.Model.extend({
		defaults: function(){
			return {
				serializedView:"",
				linkedList: [],
				relayAddress: ""
			}
		},
		pollServer:function(){

		},
		relayServer:function(){
			var pkg = {
				serial: this.get("serializedView")
			}
			var add = this.get("relayAddress");
			$.ajax({
				method: "PUT",
				data: pkg,
				url: add
			}).then(function(data,status,xhr){
				console.log("RELAY DONE");
			});

		},
		serializeView: function(view){
			var s = JSON.stringify(view);
			this.set("serializedView",window.btoa(s));
			this.relayServer();
		},
		deserializeView:function(){
			return JSON.parse(window.atob(this.get("serializedView")));
		}
	});
	bone.BoneModel = new bone.Model;
	bone.View = Backbone.View.extend({
		initialize:function(){
			this.listeners();
			bone.BoneModel.set("relayAddress", 
				"./api/" + window.location.pathname.split("/editor/")[1]);
			//this.listenTo(app.AppModel,"serializedView")
		},
		listeners:function(){
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
	});
	bone.BoneView = new bone.View;
}
var view = function(){
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
			bone.BoneModel.serializeView(graph.toJSON());
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
model();
view();