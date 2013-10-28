define([
	'backbone'<% if (!_.isEmpty(itemview)) { %>,
	'views/item/<%=itemview%>'<% } %><% if (!_.isEmpty(compTmpl)) { %>,
	'hbs!tmpl/<% if (!_.isEmpty(compTmplLocation)) { %><%= compTmplLocation%>/<% } %><%= compTmpl %>'<% } %><% if (!_.isEmpty(inherit)) { %>,
	'views/composite/<%= inherit %>'<% } %>
],
function( <%= _.capitalize('backbone')%><% if (!_.isEmpty(itemview)) { %>, <%=_.capitalize(itemview)%><% } %><% if (!_.isEmpty(compTmpl)) { %>, <%= _.capitalize(compTmpl)%> <% } %><% if (!_.isEmpty(inherit)) { %>, <%=_.capitalize(inherit)%><% } %> ) {
    'use strict';

	/* Return a CompositeView class definition */
	return <% if (!_.isEmpty(inherit)) { %><%=_.capitalize(inherit)%>.extend <% } else { %>Backbone.Marionette.CompositeView.extend<% } %>({

		initialize: function() {
			console.log("initialize a <%= _.capitalize(name) %> CompositeView");
		},
		<% if (!_.isEmpty(itemview)) { %>
    	itemView: <%= _.capitalize(itemview) %>,<% } %>
    	<% if (!_.isEmpty(compTmpl)) { %>
    	template: <%= _.capitalize(compTmpl) %>,
    	<% } %>

    	/* ui selector cache */
    	ui: {},

    	/* where are we appending the items views */
    	itemViewContainer: "",

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
