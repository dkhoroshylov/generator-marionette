define([
	'backbone'<% if (!_.isEmpty(inherit)) { %>,
	'regions/<%= inherit %>'<% } %>
],
function( <%= _.capitalize('backbone') %><% if (!_.isEmpty(inherit)) { %>, <%=_.capitalize(inherit)%><% } %> ) {
    'use strict';

	/* Return a Region class definition */
	return <% if (!_.isEmpty(inherit)) { %><%=_.capitalize(inherit)%>.extend <% } else { %>Backbone.Marionette.Region.extend<% } %>({

		initialize: function() {
			console.log("initialize a <%= _.capitalize(name) %> Region");
		}
	});

});
