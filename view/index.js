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

    // invoke  mocha
    this.hookFor('mocha-amd', {
        as: 'unitTest',
        args: [this.name, 'view', 'views']
    });
}

util.inherits(Generator, generator.NamedBase);

Generator.prototype.createViewFiles = function createViewFiles() {
    var baseDir = validDir.getValidatedFolder('app/');
    this.template('view.ejs',
        path.join(baseDir + 'scripts/views', this.name + '.js'));
};
