define(['marionette','backbone','config','i18n'],
function(Marionette, Backbone, config) {
	'use strict';

	return Marionette.LayoutView.extend({
		template: 'app/base/home/tpl/tpl-home.html',
		className: 'home-page ns-full-height animated',
		events: {
			'click #prs': 'go',
			'click #users': 'go'
		},
		onShow : function(options) {
			
		},		
		
		go: function(e){			
			e.preventDefault();
			Backbone.history.navigate('#' + $(e.currentTarget).attr('id'), { trigger: true });$
			//window.location = '#' + $(e.currentTarget).attr('id');
		}
	});
});
