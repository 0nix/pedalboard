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
			size:{ width: w || 200, height: h || 200},
			inPorts:["In"],
			outPorts:["Out"],
			attrs:{
				image:{
					"xlink:href": imageDir || "../test.png",
					width: w || 200,
					height: h || 200
				},
				rect: { fill: 'none' }, 
				text: { text: 'test', fill: 'black' }
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
var run2 = function(){
	var graph = new joint.dia.Graph;
	var paper = new joint.dia.Paper({
		el: $("#canvas"),
		model: graph,
		height: 400,
		gridSize: 1
	});
	joint.shapes.html = {};
	joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
		defaults: joint.util.deepSupplement({
			type: "html.Element",
			attrs:{
				rect:{stroke: "none", "fill-opacity": 0}
			}
		}, joint.shapes.basic.Rect.prototype.defaults)
	});
	joint.shapes.html.ElementView = joint.dia.ElementView.extend({
		template:[
			'<div class="html-element">',
	        '<button class="delete">x</button>',
	        '<label></label>',
	        '<span></span>', '<br/>',
	        '<input type="text" value="I\'m HTML input" />',
	        '</div>'
		].join(''),
		intialize: function(){
			_.bindAll(this,"updateBox");
			joint.dia.ElementView.prototype.intialize.apply(this, arguments);
			this.$box = $(_.template(this.template)());
			//prevent propagation
			this.$box.find('input,select').on('mousedown click', function(e) { e.stopPropagation(); });
			//put input in model
			this.$box.find('input').on('change', _.bind(function(evt) {
            	this.model.set('input', $(evt.target).val());
        	}, this));
        	// delete on delete button
        	this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
        	this.model.on('change', this.updateBox, this);
        	this.model.on('remove', this.removeBox, this);
        	this.updateBox();
		},
		render: function() {
        	joint.dia.ElementView.prototype.render.apply(this, arguments);
        	this.paper.$el.prepend(this.$box);
        	this.updateBox();
        	return this;
    	},
    	updateBox: function() {
        	// Set the position and dimension of the box so that it covers the JointJS element.
        	var bbox = this.model.getBBox();
        	// Example of updating the HTML with a data stored in the cell model.
        	this.$box.find('label').text(this.model.get('label'));
        	this.$box.find('span').text(this.model.get('select'));
        	this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
    	},
    	removeBox: function(evt) {
        	this.$box.remove();
    	}
	});
	var comp = new joint.shapes.html.Element({
		size:{ width:80, height: 80},
		position: {x: 80, y:80}
	});
	comp.addTo(graph);
}
run();
//run2();