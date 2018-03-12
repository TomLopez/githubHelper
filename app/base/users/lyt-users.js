define(['marionette','config','i18n'],
function(Marionette, config) {
	'use strict';

	return Marionette.LayoutView.extend({
		template: 'app/base/users/tpl/tpl-users.html',
		className: 'home-page ns-full-height animated',
		events: {
		},

		onShow : function(options) {
			// var list  = this.getUserList();
			// for(var i in list.items){
			// 	this.getUser(list.items[i].url);
			// }
		},

		getUserList: function(){
			var result;
			$.ajax({
				async: false,
				type: "GET",
				beforeSend: function (xhr) {
					xhr.setRequestHeader ("Authorization", "Basic " + btoa(config.gitUser.login + ":" + config.gitUser.mdp));
				},
				url: 'https://api.github.com/search/users?q=language:javascript+location:marseille'
			}).done(function(data){
				result = data;		
				console.log('la liste', data);	
			});
			return result;
			
		},

		getUser : function(url){
			var result;
			$.ajax({
				async: false,
				type: "GET",
				beforeSend: function (xhr) {
					xhr.setRequestHeader ("Authorization", "Basic " + btoa(config.gitUser.login + ":" + config.gitUser.mdp));
				},
				url: url
			}).done(function(data){
				result = data;		
				console.log('le user', data.email);	
			});
			return result;
		},

		drawInformations: function(list){
			
		}
	});
});
