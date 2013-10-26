/*jshint latedef:false */

/**
 * Generates Marionette Composite Views (and their respective files
 * when '--create-all' is passed in as an option)
 * compositeview/index.js
 */

// Preliminaries
var generator = require('yeoman-generator'),
	util = require('util'),
	path = require('path'),
	validDir = require('../helpers/validateDirectory'),
    stringHelpers = require('../helpers/stringHelpers'),
    _ = require('lodash'),
    _s = require('underscore.string');

// Extend lodash for our purposes
_.mixin(_s.exports());

// Export our Generator
module.exports = Generator;

// Generator Constructor
function Generator() {

	// Extend Generator with `Named Base`
	generator.NamedBase.apply(this, arguments);

	// Set Generators root path
	var dirPath = '../templates/javascript';
	this.sourceRoot(path.join(__dirname, dirPath));

	// Arguments
	this.argument('itemview', { type: String, required: false });
	this.argument('inherit', { type: String, required: false });

	// `Create all` option
	this.option('create-all',
		{ desc: 'Create a new model for this collection' });

	/* set the template name which is auto created */
	this.tmplOrig = this.name;
	this.compTmpl = this.name;
	this.compTmplLocation = 'composite';

	// Create View Template file
	if (this.tmplOrig && this.options['create-all']) {
		this.hookFor('marionette', {
			as: 'tmpl',
			args: [this.tmplOrig, this.compTmplLocation],
			options: this.options });
	}

	// Create Item View
	if (this.itemview && this.options['create-all']) {
		this.hookFor('marionette', {
			as: 'itemview',
			args: [this.itemview],
			options: { options: this.options } });
	}

	// Invoke Mocha
	this.hookFor('mocha-amd', {
		as: 'unitTest',
		args: [this.name, 'compositeview', 'views/composite']
	});
}

// Extend Generator with `Named Base`
util.inherits(Generator, generator.NamedBase);

// Creates composite view files
Generator.prototype.createCompositeViewFiles = function createCompositeViewFiles() {
	var baseDir = validDir.getValidatedFolder('app/'),
        deps = ['backbone'],
        funcs = ['Backbone'],
        extendFrom = 'Backbone.Marionette.CompositeView',
        itemViewAndTemplateSection = '';

    // -------------------------------------------------------------
    // Build dependencies list as a string along with functions list
    // -------------------------------------------------------------

    // ItemView
    if (!_.isEmpty(this.itemview)) {
        deps.push ('views/item' + this.itemview);
        funcs.push(_.capitalize(this.itemview));
        itemViewAndTemplateSection += '\n        itemView: '
            + _.capitalize(this.itemview) + ',';
    }

    // Composite View's template
    if (!_.isEmpty(this.compTmplLocation)) {
        deps.push('hbs!tmpl/' + this.compTmplLocation + '/'
            + stringHelpers.toDashSeparated(this.compTmpl));
        funcs.push(stringHelpers.lcaseFirst(
            _.capitalize(this.compTmpl)) + 'Tmpl');
        itemViewAndTemplateSection += '\n        template: '
            + stringHelpers.lcaseFirst(
                _.capitalize(this.compTmpl)) + 'Tmpl,';
    }

    // Composite View inherited from
    if (!_.isEmpty(this.inherit)) {
        deps.push('views/composite/' + this.inherit);
        funcs.push(_.capitalize(this.inherit));
        extendFrom = _.capitalize(this.inherit);
    }

    // Get dependencies and functions list for template
    deps = stringHelpers.buildDepsList(deps);
    funcs = stringHelpers.buildFuncsList(funcs);

    // Compile and generate template
	this.template('compositeview.ejs',
		path.join(baseDir + 'scripts/views/composite',
			this.name + '.js'), {
            name: this.name,
            depsList: deps,
            funcsList: funcs,
            itemViewAndTemplateSection: itemViewAndTemplateSection,
            extendFrom: extendFrom
        });
};