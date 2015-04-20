var run = function(){
	var app = {};
	app.Model = Backbone.Model.extend({
		defaults: function(){
			return{
				hasData: false,
				list:[]
			}
		},
		updateList: function(ls){
			if(ls[0] != null){
				this.set("hasData", true);
				this.set("list",ls);
			}
			else{
				this.set("hasData", false);
			}
			this.trigger("change:Model");
		}
	});
	app.AppModel = new app.Model;
	app.View = Backbone.View.extend({
		el:$("#boardlist"),
		initialize: function(){
			console.log("INIT");
			$('.modal-trigger').leanModal();
			this.listenTo(app.AppModel, "change:Model", this.render);
			this.update();

		},
		flush:function(){
			this.$el.empty();
			this.$el.off();
		},
		update:function(){
			$.ajax({
				method:"GET",
				url: "./api/user/list"
			}).then(function(data, status, xhr){
				var res = JSON.parse(data);
				app.AppModel.updateList(res);
			});
		},
		render:function(){
			this.flush();
			console.log("RENDERING");
			var m = {"data": app.AppModel.toJSON()};
			var t = _.template($("#listTpl").html());
			this.$el.append(t(m));
			var that = this;
			$(".delete-board").on("click",function(ev){
				ev.preventDefault();
				var req = "./api/user/delete"+ev.currentTarget.pathname;
				$.ajax({
					method:"PUT",
					url: req
				}).then(function(data, status, xhr){
					if(xhr.status != 200){
						toast('We have a server problem at the moment.', 2000) 
					}
					else{
						that.update();
					}
				});
			});
		}
	});
	app.clearForm = function(){
		$("#board_name").val("");
		$("#board_desc").val("");
	};
	app.MainView = new app.View;
	// LISTENERS
	$(".div-modal-activator").on("click",function(ev){
		ev.preventDefault();
		$($(this).attr("href")).slideToggle();
	});
	$(".modal-close").on("click",function(ev){
		ev.preventDefault();
		$(this).parent().slideUp();
	});
	$("#create-board").on("click",function(ev){
		ev.preventDefault();
		var pkg = {
			name: $("#board_name").val(),
			desc: $("#board_desc").val()
		}
		if( pkg.name != ""){
			$.ajax({
				method: "POST",
				url:"./api/user/new",
				data: pkg
			}).then(function(data, status ,xhr){
				if(xhr.status != 200){
					toast('We have a server problem at the moment.', 2000) 
				}
				else{
					app.MainView.update();
				}
			});
		}
		app.clearForm();
	});
	$("#clear-board").on("click",function(ev){
		ev.preventDefault();
		app.clearForm();
	});
}
run();
//class="s12 l8 offset-l2"