/*jshint latedef:false */
var generator = require('yeoman-generator'),
    util = require('util'),
    path = require('path'),
    validDir = require('../helpers/validateDirectory');

module.exports = Generator;

function Generator() {
    generator.NamedBase.apply(this, arguments);
    var dirPath = '../templates/javascript';
    this.sourceRoot(path.join(__dirname, dirPath));

    this.argument('model', { type: String, required: false });
    this.argument('inherit', { type: String, required: false });

    this.option('create-all',
        { desc: 'Create a new model for this collection' });

    if (this.model && this.options['create-all']) {
        this.hookFor('marionette', { as: 'model',
            args: [this.model, this.inherit], options: this.options });
    }

    // invoke  mocha
    this.hookFor('mocha-amd', {
        as: 'unitTest',
        args: [this.name, 'collection', 'collections']
    });
}

util.inherits(Generator, generator.NamedBase);

Generator.prototype.createViewFiles = function createViewFiles() {
    var baseDir = validDir.getValidatedFolder('app/');
    this.template('collection.ejs',
        path.join(baseDir + 'scripts/collections', this.name + '.js'));
};
