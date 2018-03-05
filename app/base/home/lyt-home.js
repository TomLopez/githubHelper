define(['marionette','config','i18n'],
function(Marionette, config) {
	'use strict';

	return Marionette.LayoutView.extend({
		template: 'app/base/home/tpl/tpl-home.html',
		className: 'home-page ns-full-height animated',
		events: {
		},

		animateIn: function() {
			this.$el.removeClass('zoomOutDown');

			this.$el.addClass('zoomInDown');

			this.$el.animate(
				{ opacity: 1 },
				500,
				_.bind(this.trigger, this, 'animateIn')
			);
		},

		// Same as above, except this time we trigger 'animateOut'
		animateOut: function() {
			//this.$el.css({'position' : 'absolute'});
			this.$el.removeClass('zoomInUp');

			//this.$el.addClass('zoomOutDown');

			this.$el.animate(
				{ opacity : 0 },
				500,
				_.bind(this.trigger, this, 'animateOut')
			);
		},
		onShow : function(options) {
			var listProject = [
				{owner : 'gabcoh1986', repo:'futbakserver'},
				{owner : 'gabcoh1986', repo:'futbakadmin'},
				{owner : 'gabcoh1986', repo:'futbakdesk'},
				{owner : 'gabcoh1986', repo:'futbakPlayers-private'},
			]
			for(var i in listProject){
				listProject[i].prs = this.managePRs(this.senderWParam(listProject[i].owner,listProject[i].repo,'pulls?state=closed'));
				listProject[i].nb_commits = listProject[i].prs.map(o => o.nb_commits).reduce((a, b) => a + b, 0);				
			}	
			this.drawInformations(listProject);
		},		
		senderWParam : function(projectOwner, project, paramUrl){
			var result;
			$.ajax({
				async: false,
				type: "GET",
				beforeSend: function (xhr) {
					xhr.setRequestHeader ("Authorization", "Basic " + btoa(config.gitUser.login + ":" + config.gitUser.mdp));
				},
				url: 'https://api.github.com/repos/' + projectOwner + '/' + project + '/' + paramUrl
			}).done(function(data){
				result = data;			
			});
			return result;
		},

		senderWUrl : function(url){
			var result;
			$.ajax({
				async: false,
				type: "GET",
				beforeSend: function (xhr) {
					xhr.setRequestHeader ("Authorization", "Basic " + btoa("cdcvidal:01234560a"));
				},
				url: url
			}).done(function(data){
				result = data;			
			});			
			return result;
		},

		getCommitInformations: function(pr){
			pr.commits = this.senderWUrl(pr.commits_url);
			pr.nb_commits = pr.commits.length;
			return pr;
		},

		managePRs: function(list){
			for(var i in list){
				list[i] = this.getPRInterval(list[i]);
				list[i] = this.getCommitInformations(list[i]);
			}
			return list;
		},		

		getPRInterval: function(pr){
			var start = Date.parse(pr.created_at);
			var end = null;
			if(pr.closed_at && pr.closed_at !== undefined && pr.closed_at != "" && pr.closed_at != ""){
				end = Date.parse(pr.closed_at);
			}
			var interval = null;
			if(end != null){
				var timeDiff = Math.abs(end - start);
				interval = Math.ceil(timeDiff / (1000 * 3600 * 24));
			}			
			pr.interval = interval;
			return pr;
		},

		drawInformations: function(list){
			var container = $('#prContainer')
			for(var i in list){

				var t = document.querySelector('#informationsTemplate');

// set
				t.content.querySelector('#repoName').innerHTML = list[i].repo;
				t.content.querySelector('#repoCommit').innerHTML = list[i].nb_commits;
				t.content.querySelector('#prNb').innerHTML = list[i].prs.length;

				var clone = document.importNode(t.content, true); // where true means deep copy

				for(var j in list[i].prs){
					var t2 = document.querySelector('#listTemplate');
					t2.content.querySelector('#prName').innerHTML = list[i].prs[j].title;
					t2.content.querySelector('#prStarDate').innerHTML = list[i].prs[j].created_at;
					t2.content.querySelector('#prEndDate').innerHTML = list[i].prs[j].closed_at;
					t2.content.querySelector('#prInterval').innerHTML = list[i].prs[j].interval;
					t2.content.querySelector('#nbCommits').innerHTML = list[i].prs[j].nb_commits;
					var clone2 = document.importNode(t2.content, true);
					clone.querySelector('#prList').append(clone2);
				}
				container.append(clone);
			}
		}
	});
});
