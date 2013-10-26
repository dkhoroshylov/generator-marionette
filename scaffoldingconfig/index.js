'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator');

var ScaffoldingconfigGenerator = module.exports =
    function ScaffoldingconfigGenerator(args, options, config) {
        // By calling `NamedBase` here, we get the argument to the
        // subgenerator call as `this.name`.
        yeoman.generators.NamedBase.apply(this, arguments);

        // Set our source path
        this.sourceRoot(path.join(__dirname, '../templates/json'));

        console.log('You called the scaffoldingconfig ' +
            'subgenerator with the argument ' + this.name + '.');
    };

util.inherits(ScaffoldingconfigGenerator, yeoman.generators.NamedBase);

ScaffoldingconfigGenerator.prototype.files = function files() {
    this.copy('scaffolding.json', 'yeoman-scaffolding.json');
};

