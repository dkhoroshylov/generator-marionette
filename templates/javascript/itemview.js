define([
	'backbone'<% if (!_.isEmpty(tmpl)) { %>,
	'hbs!tmpl/<% if (!_.isEmpty(tmplLocation)) { %><%= tmplLocation%>/<% } %><%= tmpl %>'<% } %><% if (!_.isEmpty(inherit)) { %>,
	'views/item/<%= inherit %>'<% } %>
],
function( <%= _.capitalize('backbone') %><% if (!_.isEmpty(tmpl)) { %>, <%= _.capitalize(tmpl) %> <% } %><% if (!_.isEmpty(inherit)) { %>, <%=_.capitalize(inherit)%><% } %> ) {
    'use strict';

	/* Return a ItemView class definition */
	return <% if (!_.isEmpty(inherit)) { %><%=_.capitalize(inherit)%>.extend <% } else { %>Backbone.Marionette.ItemView.extend<% } %>({

		initialize: function() {
			console.log("initialize a <%= _.capitalize(name) %> ItemView");
		},
		<% if (!_.isEmpty(tmpl)) { %>
    	template: <%= _.capitalize(tmpl) %>,
        <% } %>

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
