var util = require('util'),
    path = require('path'),
    fs = require('fs'),
    yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    _ = require('lodash');

module.exports = Generator;

function Generator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    // Other vars
    this.usingScaffoldingJson = false;
    this.scaffoldingFileName = 'scaffolding.json';
    this.testFramework = 'mocha-amd';
    this.templateFramework = 'handlebars';

    // Extend this with the options from the scaffolding.json file
    _.extend(this, JSON.parse(this.readFileAsString(
        path.join(__dirname, '..', 'templates',
            'json', this.scaffoldingFileName))
    ));

    this.hookFor(this.testFramework, { as: 'app' });

//    this.on('end', function () {
//        if (['app', 'backbone', 'marionette'].indexOf(this.generatorName) >= 0) {
//            this.installDependencies({ skipInstall: this.options['skip-install'] });
//        }
//    });
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.intro = function intro() {
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
};

Generator.prototype.scaffoldingJson = function scaffoldingJson() {
    var cb = this.async();

    // If scaffold.json exists ask user what to do
    if (fs.existsSync(this.scaffoldingFileName)) {
        this.prompt([
            {
                type: 'confirm',
                name: 'usingScaffoldingJson',
                message: 'A scaffolding.json file has been found.  ' +
                    'Would you like to continue using the ' +
                    'scaffolding.json file?',
                default: true
            }
        ],
            function (props) {
                _.extend(this, props);
                cb();
            }.bind(this));
        return;
    }

    this.prompt([
        {
            type: 'list',
            name: 'mode',
            message: 'Choose mode:',
            choices: [
                {name: 'Interactive', value: 'interactive'},
                {name: 'scaffolding.json', value: 'use-json-file'}
            ]
        }
    ],
    function (props) {
        if (props.mode.value === 'use-json-file') {
            this.usingScaffoldingJson = true;
            this.copy(
                path.join(
                    __dirname, '..', 'templates', 'json', 'scaffolding.json'
                ),
                'scaffolding.json');
        }
        cb();
    }.bind(this));
};

Generator.prototype.askFor = function askFor() {
    if (this.usingScaffoldingJson) {
        return;
    }
    var cb = this.async(),
        prompts = null;

    prompts = [{
            type: 'string',
            name: 'appPath',
            message: 'Is your application going to live within a ' +
                'public directory (app/htdocs/public etc.)?  ' +
                'If yes enter the path now:',
            default: ''
        },
        {
            type: 'confirm',
            name: 'appNeedsServer',
            message: 'Will your appliaction need a nodejs server ' +
                '(expressjs wil be included if answer is yes)?',
            default: false
        },
        {
            type: 'string',
            name: 'bowerDirectory',
            message: 'Where would you like you\'re Bower Components installed (in your app directory)?',
            default: 'bower_components'
        }];

    this.prompt(prompts, function (props) {
        _.extend(this, props);
        this.app.path = props.appPath;
        this.app.needsServer = props.appNeedsServer;
        if (this.app.needsServer) {
            this.isFullApp = true;
        }
        cb();
    }.bind(this));
};

Generator.prototype.askAboutServer = function asAboutServer() {
    // Bail if not full app or using scaffolding json for options
    if (!this.isFullApp || this.usingScaffoldingJson) {
        return;
    }

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
    },
    function (props) {
        _.extend(this, props);
        cb();
    });
};

Generator.prototype.copyConfigFiles = function git() {
    if (this.isFullApp) {
        this.template('gitignore', '.gitignore');
        this.copy('gitattributes', '.gitattributes');
        this.copy('jshintrc', '.jshintrc');
        this.copy('editorconfig', '.editorconfig');
    }
    this.template('bowerrc', '.bowerrc');
    this.template('Gruntfile.js');
    this.template('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
};

Generator.prototype.bootsrapJs = function bootsrap() {
    if (this.isFullApp) {
        if (this.compassBootstrap) {
            this.write('app/styles/main.scss',
                '@import \'sass-bootstrap/lib/bootstrap\';' +
                    '\n\n.hero-unit {\n    margin: 50px auto 0 auto;' +
                    '\n    width: 400px;\n}');
        } else {
            this.write('app/styles/main.css',
                'body {\n    background: #fafafa;\n}' +
                    '\n\n.hero-unit {\n    margin: 50px auto 0 auto;' +
                    '\n    width: 300px;\n}');
        }
    }
    var _rootDir = this.isFullApp ? 'app/' : '';

    if (this.includeRequireJS && this.compassBootstrap) {
        this.copy('bootstrap.js',
            _rootDir + 'scripts/vendor/bootstrap.js');
    }
};

Generator.prototype.appBaseline = function appBaseline() {
    var appPath = this.app.path,
        scriptsPath = appPath + this.app.scriptsDirName,
        templatesPath = appPath + this.viewTemplate.dirName;
    this.mkdir(templatesPath);
    this.mkdir(scriptsPath);

    // templates
    this.copy('app/welcome.hbs', templatesPath + '/welcome.hbs');

    //html
    this.template('app/index.html', appPath + '/index.html');

    // js
    this.copy('app/main.js', scriptsPath + '/main.js');
    this.template('app/init.js', scriptsPath + '/init.js');
    this.copy('app/regionManager.js', scriptsPath + '/regionManager.js');
    this.copy('app/application.js', scriptsPath + '/application.js');
    this.copy('app/communicator.js', scriptsPath + '/communicator.js');

    // other
    if (this.isFullApp) {
        // server
        this.mkdir('server');
        this.template('server/app.js', 'server/app.js');
        this.mkdir(appPath + '/styles');
        this.mkdir(appPath + '/images');
        this.template('app/404.html', appPath + '/404.html');
        this.template('app/favicon.ico', appPath + '/favicon.ico');
        this.template('app/robots.txt', appPath + '/robots.txt');
        this.copy('app/htaccess', appPath + '/.htaccess');
    }
};

