define(['marionette','i18n'],
function(Marionette) {
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
				// {owner : 'gabcoh1986', repo:'futbakadmin'},
				// {owner : 'gabcoh1986', repo:'futbakdesk'},
				// {owner : 'gabcoh1986', repo:'futbakPlayers-private'},
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
					xhr.setRequestHeader ("Authorization", "Basic " + btoa("cdcvidal:01234560a"));
				},
				url: 'https://api.github.com/repos/' + projectOwner + '/' + project + '/' + paramUrl
			}).done(function(data){
				result = data;			
			});
			console.log('sender result', result)
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
				console.log('infos sur les commits', data)
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
				var tmpl = document.getElementById('informationsTemplate').content.cloneNode(true);
				$(tmpl).find('#repoName').text(list[i].repo);
				for(var j in list[i].prs){
					var tmplList = document.getElementById('listTemplate').content.cloneNode(true);
					console.log('iojuhqedfbvuiphaqer', tmplList, list[i].prs[j].title)
					$(tmplList).find('#prName').text(list[i].prs[j].title);
					$(tmpl).find('#prList').append(tmplList);
				}
				console.log('title', list[i].repo);
				container.append(tmpl);
			}
		}
	});
});
