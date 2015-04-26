var bone = {};
var viewK = {};
var model = function(){
	bone.Model = Backbone.Model.extend({
		defaults: function(){
			return {
				state: 0,
				serializedView:"",
				linkedList: [],
				relayAddress: "",
				prevExist: false
			}
		},
		genDatObj:function(){
			var that = this;
			return { 
				pedal: "",
				pedalAdd:function() {
					that.trigger("change:addPedal");
				}
			}
		},
		relayServer:function(){
			var pkg = {
				serial: this.get("serializedView"),
				list: "0"
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
		initialize:function(){;
			bone.BoneModel.set("relayAddress", 
				"./api/" + window.location.pathname.split("/editor/")[1]);
			this.generalGUI();
			this.viewKernel();
			this.listenTo(bone.BoneModel,"change:addPedal", viewK.addaPedal)
		},
		viewKernel:function(){
			viewK.graph = new joint.dia.Graph;
			viewK.toSet;
			viewK.elementPrimed = false;
			viewK.linkPrimed = false;
			viewK.toLink;
			viewK.paper = new joint.dia.Paper({
				el: $("#canvas"),
				model: viewK.graph,
				gridSize: 1
			});
			viewK.component = function(w, h, imageDir){
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
			};
			viewK.addaPedal = function(){
				var r = viewK.component();
				r.position(10,10);
				viewK.graph.addCells([r]);
				bone.BoneModel.serializeView(viewK.graph.toJSON());
			}
			viewK.link = function(source, inport, dest, outport){
				var link = new joint.shapes.devs.Link({
					source: {id:source.id, selector: source.getPortSelector(inport)},
					target: {id:dest.id, selector: dest.getPortSelector(outport)}
				});
				link.addTo(viewK.graph).reparent();
			};
		},
		generalGUI: function(){
			viewK.guiTool = bone.BoneModel.genDatObj();
			viewK.gui = new dat.GUI();
			viewK.f1 = viewK.gui.addFolder('Add a Pedal');
			viewK.f1.add(viewK.guiTool, 'pedal', [ 'Distorsion', 'Delay', 'Flanger' ] );
			viewK.f1.add(viewK.guiTool, 'pedalAdd' );
			viewK.f1.open();
		},
		flushGUI:function(){
			$('.dg.ac').remove();
			delete viewK.guiTool;
			delete viewK.gui;
			delete viewK.f1;
			delete viewK.f2;
		}
	});
	bone.BoneView = new bone.View;
	return true;
}
var view = function(){
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
	/*$(".menu-item").on("click",function(ev){
		ev.preventDefault();
		$("#canvas").addClass("toSelect");
		$("#canvas").removeClass("unselected");
		toast('Click on the workspace to add your element', 3500);
		elementPrimed = true;
		toSet = ev.currentTarget.id;
	});*/
	//DAT GUI
}
var promise = new Promise(function(resolve, reject) {
    model();
    var add = bone.BoneModel.get("relayAddress");
	$.ajax({
		method: "GET",
		url: add
	}).then(function(data,status,xhr){
	if(typeof data.serial === "string" && data.serial != "0" && data.serial != ""){
			bone.BoneModel.set("prevExist",true);
			bone.BoneModel.set("serializedView",data.serial);
		}
		resolve(true);
	});
});
promise.then(function(result) {
	if(bone.BoneModel.get("prevExist")){
		viewK.graph.fromJSON(bone.BoneModel.deserializeView());
	}
});
