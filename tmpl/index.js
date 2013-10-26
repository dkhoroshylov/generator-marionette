/*jshint latedef:false */

// Preliminaries
var generator = require('yeoman-generator'),
	util = require('util'),
	path = require('path'),
	validDir = require('../helpers/validateDirectory'),
	stringHelpers = require('../helpers/stringHelpers');

// Export our Generator
module.exports = Generator;

/**
 * Generates view template files in the appropriate directory with
 * the appropriate file extension and a dashed separated naming schema.
 * @constructor
 */
function Generator() {

	// Apply generator named base
	generator.NamedBase.apply(this, arguments);

	// Set the root path for this generator
	this.sourceRoot(path.join(__dirname, '../templates/javascript'));

	// Require the `template location` variable
	this.argument('tmplLocation', { type: String, required: false });

	// File Extension variable
	this.argument('fileExtension', {
		type: String, default: '.hbs', required: false});

	// Set template location so that it is not null
	this.tmplLocation = this.tmplLocation ? this.tmplLocation : '';

	// Make sure the file extension has a value
	this.fileExtension = this.fileExtension || '.hbs';

    // Dash separate the name to use for the template file name
    // if no dashes present
    if (!/\-+/.test(this.name)) {
        this.name = stringHelpers.toDashSeparated(this.name);
    }
}

// Inheirt generator `Named Base`
util.inherits(Generator, generator.NamedBase);

/**
 * Create template files callback.
 * @return {void}
 */
Generator.prototype.createTmplFiles = function createTmplFiles() {
	var baseDir = validDir.getValidatedFolder('app/');
	this.template('tmpl.ejs', path.join(baseDir + 'templates',
		this.tmplLocation, this.name + this.fileExtension));
};
