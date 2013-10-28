define([
	'backbone'
],
function(<%= _.capitalize('backbone') %>){
    'use strict';

	return Backbone.View.extend({
		initialize: function() {
			console.log("initialize a <%= _.capitalize(name) %> View");
		}
	});
});
