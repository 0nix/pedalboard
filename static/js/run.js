var bone = {};
var viewK = {
	guiTool:{}
};
var pedalTypeId = 6;
var select = 'Distortion';
var model = function(){
	bone.Model = Backbone.Model.extend({
		defaults: function(){
			return {
				state: 0,
				serializedView:"",
				linkedList: [],
				relayAddress: "",
				prevExist: false,
				editMode: false,
				editId:""
			}
		},
		genDatObj:function(){
			var that = this;
			return { 
				pedal: "",
				pedalAdd:function() {
					if(this.pedal!= "") that.trigger("change:addPedal");
				}
			}
		},
		pedDatObj:function(pedals){
			var that = this;
			var obj = {};

			return obj;
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
			this.viewKernel();
			this.listeners();
			this.listenTo(bone.BoneModel,"change:addPedal", this.pedalAdd);
			bone.BoneModel.bind("change:guiObj",this.thing);
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
				//outPorts:["L","R"],
				outPorts:["O"],
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
			viewK.knob = function(w, h, imageDir){
				var k = new joint.shapes.devs.Atomic({
					//position: { x: 20, y: 20 },
    				size: { width: w || 40, height: h || 40 },
    				attrs:{
						image:{
							"xlink:href": "./knob1small.png",
							//"xlink:href": imageDir || "http://placehold.it/100x168",
							width: w || 40,
							height: h || 40
						},
						rect: { fill: 'none' }, 
						text: { text: 'test', display:"none" }

					}
				});
				return k;

			};
			viewK.link = function(source, inport, dest, outport){
				var link = new joint.shapes.devs.Link({
					source: {id:source.id, selector: source.getPortSelector(inport)},
					target: {id:dest.id, selector: dest.getPortSelector(outport)}
				});
				link.addTo(viewK.graph).reparent();
			};
			viewK.gui = new dat.GUI();
			this.generalGUI();
		},
		listeners: function(){
			viewK.paper.on("cell:pointerdblclick",function(ev){
				var cell = viewK.graph.getCell(ev.model.id);
				if(!viewK.elementPrimed || cell.prop("comp") == "pedal"){
					bone.BoneModel.set("editMode",true);
					bone.BoneModel.set("editId",ev.model.id);
					if(!viewK.elementPrimed) this.flushGUI(true);
					else this.flushGUI(false);
					this.pedalGUI(cell, cell.getEmbeddedCells(cell));
					viewK.elementPrimed = true;
				}
			}.bind(this));
			viewK.paper.on("blank:pointerclick",function(ev){
				if(bone.BoneModel.get("editMode")){
					bone.BoneModel.set("editMode",false);
					viewK.elementPrimed = false;
					this.flushGUI(false);
					this.generalGUI();
				}
			}.bind(this));
		},
		//change this!
		pedalAdd: function(){

		//remove this value one we can pass values                
		

	        switch ( viewK.guiTool.pedal ) {
		//DISTORTION
                      case "Distortion":
			var r = viewK.component(130, 233, "./distortion430770.png");
			var k1 = viewK.knob(), k2 = viewK.knob(), k3 = viewK.knob();
			r.prop("comp","pedal");
			r.prop("name","DISTORTION");
			r.position(10,10);
			k1.position(20,20);
			k1.rotate(-90, true);
			k2.position(85,20);
			k2.rotate(-90, true);
			k3.position(52,60);
			k3.rotate(-90, true);
			r.embed(k1);
			r.embed(k2);
			r.embed(k3);
			viewK.graph.addCells([r, k1, k2, k3]);
			bone.BoneModel.serializeView(viewK.graph.toJSON());
                       break;
		//OMEGAMETAL
                      case "OMEGAMETAL":
			var r = viewK.component(130, 233, "./om430770.png");
			var k1 = viewK.knob(), k2 = viewK.knob(), k3 = viewK.knob();
			r.prop("comp","pedal");
			r.prop("name","OMEGAMETAL");
			r.position(10,10);
			k1.position(20,20);
			k1.rotate(-90, true);
			k2.position(85,20);
			k2.rotate(-90, true);
			k3.position(52,60);
			k3.rotate(-90, true);
			r.embed(k1);
			r.embed(k2);
			r.embed(k3);
			viewK.graph.addCells([r, k1, k2, k3]);
			bone.BoneModel.serializeView(viewK.graph.toJSON());
                       break;		
		//BOOST	
                      case "Boost":
                        var r = viewK.component(260, 130, "./boost600300.png");
			var k1 = viewK.knob();
			r.prop("comp","pedal");
			r.prop("name","Hyper Boost");
			r.position(10,10);
			k1.position(50,60);
			k1.rotate(-90, true);
			r.embed(k1);
			viewK.graph.addCells([r, k1]);
			bone.BoneModel.serializeView(viewK.graph.toJSON());
                        break;	
		
		//flange
		      case "Flange":
			var r = viewK.component(130, 233, "./flange430770.png");
			var k1 = viewK.knob(), k2 = viewK.knob(), k3 = viewK.knob();
			r.prop("comp","pedal");
			r.prop("name","Black Witch Flange");
			r.position(10,10);
			k1.position(20,20);
			k1.rotate(-90, true);
			k2.position(20,65);
			k2.rotate(-90, true);
			k3.position(20,110);
			k3.rotate(-90, true);
			r.embed(k1);
			r.embed(k2);
			r.embed(k3);
			viewK.graph.addCells([r, k1, k2, k3]);
			bone.BoneModel.serializeView(viewK.graph.toJSON());
                        break;
		//HyperDelay
		      case "HyperDelay":
                        var r = viewK.component(233, 233, "./hd770770.png");
			var k1 = viewK.knob(), k2 = viewK.knob(), k3 = viewK.knob(), k4 = viewK.knob();
                        var k5 = viewK.knob(), k6 = viewK.knob(), k7 = viewK.knob(), k8 = viewK.knob();
			r.prop("comp","pedal");
			r.prop("name","Hyper Delay");
			r.position(10,10);
			k1.position(20,20);
			k1.rotate(-90, true);
			k2.position(70,20);
			k2.rotate(-90, true);
			k3.position(120,20);
			k3.rotate(-90, true);
			k4.position(170,20);
			k4.rotate(-90, true);

			k5.position(20,65);
			k5.rotate(-90, true);
			k6.position(70,65);
			k6.rotate(-90, true);
                        k7.position(120,65);
			k7.rotate(-90, true);
			k8.position(170,65);
			k8.rotate(-90, true);
			r.embed(k1);
			r.embed(k2);
			r.embed(k3);
                        r.embed(k4);
                        r.embed(k5);
			r.embed(k6);
			r.embed(k7);
			r.embed(k8);
			viewK.graph.addCells([r, k1, k2, k3, k4, k5, k6, k7, k8]);
			bone.BoneModel.serializeView(viewK.graph.toJSON());
                        break;
		//BurritoReverb
		      case "BurritoReberb":
                        var r = viewK.component(233, 233, "./br770770.png");
			var k1 = viewK.knob(), k2 = viewK.knob(), k3 = viewK.knob(), k4 = viewK.knob();
			r.prop("comp","pedal");
			r.prop("name","BurritoReberb");
			r.position(10,10);
			k1.position(20,20);
			k1.rotate(-90, true);
			k2.position(70,20);
			k2.rotate(-90, true);
			k3.position(120,20);
			k3.rotate(-90, true);
			k4.position(170,20);
			k4.rotate(-90, true);

			r.embed(k1);
			r.embed(k2);
			r.embed(k3);
                        r.embed(k4);

			viewK.graph.addCells([r, k1, k2, k3, k4]);
			bone.BoneModel.serializeView(viewK.graph.toJSON());
                        break;
		//NOISE
		      case "NOISE":
                        var r = viewK.component(233, 233, "./noise770770.png");
			var k1 = viewK.knob(), k2 = viewK.knob(), k3 = viewK.knob(), k4 = viewK.knob();
                        var k5 = viewK.knob(), k6 = viewK.knob(), k7 = viewK.knob(), k8 = viewK.knob();
			var k9 = viewK.knob(), k10= viewK.knob(), k11= viewK.knob(), k12= viewK.knob();
			r.prop("comp","pedal");
			r.prop("name","Hyper Delay");
			r.position(10,10);

			k1.position(20,20);
			k1.rotate(-90, true);
			k2.position(70,20);
			k2.rotate(-90, true);
			k3.position(120,20);
			k3.rotate(-90, true);
			k4.position(170,20);
			k4.rotate(-90, true);

			k5.position(20,65);
			k5.rotate(-90, true);
			k6.position(70,65);
			k6.rotate(-90, true);
                        k7.position(120,65);
			k7.rotate(-90, true);
			k8.position(170,65);
			k8.rotate(-90, true);

			k9.position(20,110);
			k9.rotate(-90, true);
			k10.position(70,110);
			k10.rotate(-90, true);
                        k11.position(120,110);
			k11.rotate(-90, true);
			k12.position(170,110);
			k12.rotate(-90, true);
			r.embed(k1);
			r.embed(k2);
			r.embed(k3);
                        r.embed(k4);
                        r.embed(k5);
			r.embed(k6);
			r.embed(k7);
			r.embed(k8);
 			r.embed(k9);
			r.embed(k10);
			r.embed(k11);
			r.embed(k12);
			viewK.graph.addCells([r, k1, k2, k3, k4, k5, k6, k7, k8,k9,k10,k11,k12]);
			bone.BoneModel.serializeView(viewK.graph.toJSON());
                        break;
                //STUTTER
	       	      case "Stutter":
                        var r = viewK.component(260, 130, "./stutter600300.png");
			var k1 = viewK.knob();
			r.prop("comp","pedal");
			r.prop("name","Sketchy Stutter");
			r.position(10,10);
			k1.position(20,20);
			k1.rotate(-90, true);
			r.embed(k1);
			viewK.graph.addCells([r, k1]);
			bone.BoneModel.serializeView(viewK.graph.toJSON());
                        break;	
		
                //TIMEDELONGE
		      case "timeDelonge":
			var r = viewK.component(130, 233, "./timedelonge430770.png");
			var k1 = viewK.knob(), k2 = viewK.knob(), k3 = viewK.knob(), k4 = viewK.knob();
			r.prop("comp","pedal");
			//r.prop("name",viewK.guiTool.pedal);
			r.prop("name","Time DeLonge");
			r.position(10,10);
			k1.position(20,20);
			k1.rotate(-90, true);
			k2.position(85,20);
			k2.rotate(-90, true);
			k3.position(20,65);
			k3.rotate(-90, true);
                        k4.position(85,65);
			k4.rotate(-90, true);
			r.embed(k1);
			r.embed(k2);
			r.embed(k3);
                        r.embed(k4);
			viewK.graph.addCells([r, k1, k2, k3,k4]);
			bone.BoneModel.serializeView(viewK.graph.toJSON());
		      break;
		//SludgeMaster
                      case "SludgeMaster":
                        var r = viewK.component(260, 130, "./sm600300.png");
			var k1 = viewK.knob(), k2 = viewK.knob(), k3 = viewK.knob(), k4 = viewK.knob(),k5 = viewK.knob();
			r.prop("comp","pedal");
			r.prop("name","Time DeLonge");
			r.position(10,10);
			k1.position(20,20);
			k1.rotate(-90, true);
			k2.position(65,20);
			k2.rotate(-90, true);
			k3.position(110,20);
			k3.rotate(-90, true);
                        k4.position(155,20);
			k4.rotate(-90, true);
			k5.position(200,20);
			k5.rotate(-90, true);
			r.embed(k1);
			r.embed(k2);
			r.embed(k3);
                        r.embed(k4);
			r.embed(k5);
			viewK.graph.addCells([r, k1, k2, k3,k4,k5]);
			bone.BoneModel.serializeView(viewK.graph.toJSON());
                        break;		
                }       
		},
		pedalUpdate: function(len){
			for(var i = 0; i < len; i++){
				var k = viewK.graph.getCell(viewK.guiTool["knob"+i+"-id"]);
				k.rotate(viewK.guiTool["knob"+i],true);
			}
			bone.BoneModel.serializeView(viewK.graph.toJSON());
		},
		pedalDelete: function(id){
			viewK.graph.getCell(id).remove();
			bone.BoneModel.serializeView(viewK.graph.toJSON());
			bone.BoneModel.set("editMode",false);
			viewK.elementPrimed = false;
			this.flushGUI(false);
			this.generalGUI();
		},
		pedalGUI: function(pedal, knobArr){
			viewK.guiTool.name = pedal.prop("name");
			viewK.guiTool.save = function(){
				this.pedalUpdate(knobArr.length);
			}.bind(this);
			viewK.guiTool.delete = function(){
				this.pedalDelete(pedal.id);
			}.bind(this);
			for (var a in knobArr){
				viewK.guiTool["knob"+a] = knobArr[a].attributes.angle;
				viewK.guiTool["knob"+a+"-id"] = knobArr[a].id;
			}
			viewK.f0 = viewK.gui.addFolder("Pedal Menu");
			viewK.f0.add(viewK.guiTool, "name");
			for (var a in knobArr){
				viewK.f0.add(viewK.guiTool,"knob"+a,-90,90);
			}
			viewK.f0.add(viewK.guiTool, "save");
			viewK.f0.add(viewK.guiTool, "delete");
			viewK.f0.open();

		},
		generalGUI: function(){
			viewK.guiTool = bone.BoneModel.genDatObj();
			viewK.f1 = viewK.gui.addFolder('Add a Pedal');
           	viewK.f1.add(viewK.guiTool, 'pedal', [ "Choose", 'Distortion', 'Boost', 'Flange' , 'HyperDelay' , 'Stutter' , 'SludgeMaster' , 'timeDelonge','NOISE','OMEGAMETAL','BurritoReberb' ] );
			
			select = viewK.guiTool.pedal;

	//		viewK.f1.add(viewK.guiTool, 'pedal', [ "Choose", 'Distorsion', 'Delay', 'Flanger' ] );

			viewK.f1.add(viewK.guiTool, 'pedalAdd' );
			viewK.f1.open();
		},
		flushGUI:function(toPedal){
			if(toPedal) viewK.gui.removeFolder("Add a Pedal");
			else viewK.gui.removeFolder("Pedal Menu");
		},
		thing: function(c){
			console.log("BIND SUCCESS");
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
	},function(xhr, status, err) {
            if(xhr.status == "503"){
            	window.location.replace("http://samdevelopers.cf/dash");
            }
    });
});
promise.then(function(result) {
	if(bone.BoneModel.get("prevExist")){
		viewK.graph.fromJSON(bone.BoneModel.deserializeView());
	}
});
