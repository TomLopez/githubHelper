define(['marionette', 'config', 'i18n'],
	function (Marionette, config) {
		'use strict';

		return Marionette.LayoutView.extend({
			template: 'app/base/users/tpl/tpl-users.html',
			className: 'home-page ns-full-height animated',
			events: {
				'click #getEmails': 'getEmails'
			},

			onShow: function (options) {
			},

			getEmails: function () {
				document.getElementById("infomationsContainer").innerHTML='';
				var city = document.querySelector('input[name="language"]:checked').value;
				var language = document.getElementById("city").value;
				var completeItem = false;
				var page = 0;
				while (!completeItem) {
					var list = this.getUserList(city, language, page);
					if (list.items.length != 0) {
						for (var i in list.items) {
							var user = this.getUser(list.items[i].url);
						}
						page++;
					} else {
						completeItem = true;
					}
				}
			},

			getUserList: function (language, location, page) {
				var result;
				var theUrl = 'https://api.github.com/search/users?q=language:' + language + '+location:' + location
					+ (page != 0 ? '&page=' + page : '');
				$.ajax({
					async: false,
					type: "GET",
					beforeSend: function (xhr) {
						xhr.setRequestHeader("Authorization", "Basic " + btoa(config.gitUser.login + ":" + config.gitUser.mdp));
					},
					url: theUrl
				}).done(function (data) {
					result = data;
					console.log('la liste', data);
				});
				return result;

			},

			getUser: function (url) {
				var _this = this;
				var result;
				$.ajax({
					type: "GET",
					beforeSend: function (xhr) {
						xhr.setRequestHeader("Authorization", "Basic " + btoa(config.gitUser.login + ":" + config.gitUser.mdp));
					},
					url: url
				}).done(function (data) {
					result = data;
					_this.drawInformations(result);
					console.log('le user', data.email);
				});
				return result;
			},

			drawInformations: function (user) {
				if (user.email != null) {
					var container = document.getElementById('infomationsContainer');
					var t = document.querySelector('#informationsTemplate');
					t.content.querySelector('#devName').innerHTML = user.login;
					t.content.querySelector('#mail').innerHTML = user.email;
					var clone = document.importNode(t.content, true);
					container.append(clone);
				}
			}
		});
	});
