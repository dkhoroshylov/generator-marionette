var util = require('util'),
    path = require('path'),
    fs = require('fs'),
    yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    _ = require('lodash');

module.exports = Generator;

function Generator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.appDir = '';
    this.appNeedsServer = false;
    this.use
    this.scaffoldFileName = 'scaffolding.json';
    this.testFramework = 'mocha-amd';
    this.templateFramework = 'handlebars';

    this.hookFor(this.testFramework, { as: 'app' });

    this.on('end', function () {
        if (['app', 'backbone', 'marionette'].indexOf(this.generatorName) >= 0) {
            this.installDependencies({ skipInstall: this.options['skip-install'] });
        }
    });
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askFor = function askFor() {
    var callback = this.async(),
        prompts = null,

    // welcome message
        welcome =
            '\n     _-----_' +
                '\n    |       |' +
                '\n    |' + chalk.red('--(o)--') + '|   .--------------------------.' +
                '\n   `---------´  |    ' + chalk.yellow.bold('Welcome to Yeoman') + ',    |' +
                '\n    ' + chalk.yellow('(') + ' _' + chalk.yellow('´U`') + '_ ' + chalk.yellow(')') + '   |   ' + chalk.yellow.bold('ladies and gentlemen!') + '  |' +
                '\n    /___A___\\   \'__________________________\'' +
                '\n     ' + chalk.yellow('|  ~  |') +
                '\n   __' + chalk.yellow('\'.___.\'') + '__' +
                '\n ´   ' + chalk.red('`  |') + '° ' + chalk.red('´ Y') + ' `\n';


    console.log(welcome);
    console.log('Out of the box I include HTML5 Boilerplate, ' +
        'jQuery, Backbone.js, Marionette, Handlebars, ' +
        'Require and Modernizr.');

    // If scaffold.json exists ask user what to do
    if (fs.existsSync(this.scaffoldFileName)) {
        return;
    }


    prompts = [
        {
            type: 'string',
            name: 'appDir',
            message: 'Is your application going to live within a ' +
                'public directory (app/htdocs/public etc.)?  ' +
                'If yes enter the directory path now:',
            default: ''
        },
        {
            type: 'confirm',
            name: 'appNeedsServer',
            message: 'Will your appliaction need a nodejs server ' +
                '(will include expressjs if yes)?',
            default: false
        },
        {
            type: 'string',
            name: 'bowerDirectory',
            message: 'Where would you like you\'re Bower Components installed?',
            default: 'bower_components'
        }
    ];

    this.prompt(prompts, function (props) {
        _.extend(this, props);
        callback();
    }.bind(this));
}


Generator.prototype.askAboutServer = function asAboutServer() {
    var cb = this.async();
    this.prompt({
            type: 'confirm',
            name: 'useMongoose',
            message: 'Would you like to include MongoDB for storage?',
            default: false
        },
        {
            type: 'confirm',
            name: 'useSocketIO',
            message: 'Would you like to include Socket IO for real time communication?',
            default: false
        },
        {
            type: 'confirm',
            name: 'useBaucis',
            message: 'Would you like to include Baucis for REST?',
            default: false
        }, function (props) {
            cb();
        });
};


Generator.prototype.git = function git() {
    if (this.isFullApp) {
        this.template('gitignore', '.gitignore');
        this.copy('gitattributes', '.gitattributes');
    }
};

Generator.prototype.bower = function bower() {
    this.template('bowerrc', '.bowerrc');
    this.copy('_bower.json', 'bower.json');
};

Generator.prototype.jshint = function jshint() {
    if (this.isFullApp) {
        this.copy('jshintrc', '.jshintrc');
    }
};

Generator.prototype.editorConfig = function editorConfig() {
    if (this.isFullApp) {
        this.copy('editorconfig', '.editorconfig');
    }
};

Generator.prototype.gruntfile = function gruntfile() {
    this.template('Gruntfile.js');
};

Generator.prototype.packageJSON = function packageJSON() {
    this.template('_package.json', 'package.json');
};

Generator.prototype.mainStylesheet = function mainStylesheet() {
    if (this.isFullApp) {
        if (this.compassBootstrap) {
            this.write('app/styles/main.scss', '@import \'sass-bootstrap/lib/bootstrap\';\n\n.hero-unit {\n    margin: 50px auto 0 auto;\n    width: 400px;\n}');
        } else {
            this.write('app/styles/main.css', 'body {\n    background: #fafafa;\n}\n\n.hero-unit {\n    margin: 50px auto 0 auto;\n    width: 300px;\n}');
        }
    }
};

Generator.prototype.bootstrapJs = function bootstrapJs() {
    var _rootDir = this.isFullApp ? 'app/' : '';

    if (this.includeRequireJS && this.compassBootstrap) {
        this.copy('bootstrap.js', _rootDir + 'scripts/vendor/bootstrap.js');
    }
};

Generator.prototype.setupEnv = function setupEnv() {
    var _rootDir = this.isFullApp ? 'app' : '';

    // templates
    this.mkdir(_rootDir + 'templates');
    this.copy('app/welcome.hbs', _rootDir + 'templates/welcome.hbs');

    //html
    this.template('app/index.html', _rootDir + 'index.html');

    // js
    this.mkdir(_rootDir + 'scripts');
    this.copy('app/main.js', _rootDir + 'scripts/main.js');
    this.template('app/init.js', _rootDir + 'scripts/init.js');
    this.copy('app/regionManager.js', _rootDir + 'scripts/regionManager.js');
    this.copy('app/application.js', _rootDir + 'scripts/application.js');
    this.copy('app/communicator.js', _rootDir + 'scripts/communicator.js');

    // other
    if (this.isFullApp) {
        // server
        this.mkdir('server');
        this.template('server/app.js', 'server/app.js');

        this.mkdir('app/styles');
        this.mkdir('app/images');
        this.template('app/404.html');
        this.template('app/favicon.ico');
        this.template('app/robots.txt');
        this.copy('app/htaccess', 'app/.htaccess');
    }

};

