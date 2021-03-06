/*jshint latedef:false */
var generator  = require('yeoman-generator');
var util       = require('util');
var path       = require('path');
var validDir = require('../helpers/validateDirectory');

module.exports = Generator;

function Generator() {
  generator.NamedBase.apply(this, arguments);
  var dirPath = '../templates/javascript';
  this.sourceRoot(path.join(__dirname, dirPath));

  this.argument('inherit', { type: String, required: false });

  this.option('create-all', { desc: 'Create a new model for this collection' });
  

  /* set the template name which is auto created */
  this.tmplOrig = this.name;
  this.tmpl = this.name;
  this.tmplLocation = 'layout';

  if ( this.tmplOrig && this.options['create-all'] ) {
    this.hookFor('marionette', { as: 'tmpl', args: [this.tmplOrig, this.tmplLocation], options: this.options });
  }

  // invoke  mocha
  this.hookFor('mocha-amd', { 
    as: 'unitTest', 
    args: [this.name, 'layout', 'views/layout']
  });
}

util.inherits(Generator, generator.NamedBase);

Generator.prototype.createLayoutFiles = function createLayoutFiles() {
  var ext = 'js';
  var baseDir = validDir.getValidatedFolder( 'app/' );

  this.template('layout.' + ext, path.join(baseDir + 'scripts/views/layout', this.name + '.' + ext));
};
