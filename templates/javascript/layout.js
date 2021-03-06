define([
	'backbone'<% if (!_.isEmpty(tmpl)) { %>,
	'hbs!tmpl/<% if (!_.isEmpty(tmplLocation)) { %><%= tmplLocation%>/<% } %><%= tmpl %>'<% } %><% if (!_.isEmpty(inherit)) { %>,
	'views/layout/<%= inherit %>'<% } %>
],
function( <%= _.capitalize('backbone') %><% if (!_.isEmpty(tmpl)) { %>, <%= _.capitalize(tmpl) %> <% } %><% if (!_.isEmpty(inherit)) { %>, <%=_.capitalize(inherit)%><% } %> ) {
    'use strict';

	/* Return a Layout class definition */
	return <% if (!_.isEmpty(inherit)) { %><%=_.capitalize(inherit)%>.extend <% } else { %>Backbone.Marionette.Layout.extend<% } %>({

		initialize: function() {
			console.log("initialize a <%= _.capitalize(name) %> Layout");
		},
		<% if (!_.isEmpty(tmpl)) { %>
    	template: <%= _.capitalize(tmpl) %>,
    	<% } %>

    	/* Layout sub regions */
    	regions: {},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
