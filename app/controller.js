define(['marionette', 'config',
	'./base/home/lyt-home',
	'./base/prs/lyt-prs',
	'./base/users/lyt-users',
], function (Marionette, config,
	LytHome,
	LytPrs,
	LytUsers

) {
		'use strict';
		return Marionette.Object.extend({

			initialize: function () {
				this.rgMain = this.options.app.rootView.rgMain;
				this.rgHeader = this.options.app.rootView.rgHeader;
				this.rgFooter = this.options.app.rootView.rgFooter;
			},

			home: function () {
				this.rgMain.show(new LytHome());
			},
			prs: function(){
				this.rgMain.show(new LytPrs());
			},
			users: function(){
				this.rgMain.show(new LytUsers());
			}
		});
	});
