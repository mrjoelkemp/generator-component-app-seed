var path    = require('path'),
    util    = require('util'),
    yeoman  = require('yeoman-generator');

var ComponentGenerator = function(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function() {
    // if (options['skip-install']) {
    //   this.installDependencies({skipInstall: true});
    // } else {
    //   this.installDependencies({bower: false, npm: true, skipInstall: false});
    // }
  });

  this.sourceRoot(path.join(__dirname, '../../templates/'));
};

ComponentGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

  console.log(welcome);

  var prompts = [{
    name: 'componentRepo',
    message: 'repo:',
    default: 'username/project'
  },
  {
    name: 'componentDescription',
    message: 'description:',
    default: 'An awesome component'
  }];

  this.prompt(prompts, function(err, props) {
    if (err) return this.emit('error', err);

    var repo = props.componentRepo.split('/');
    if (repo.length !== 2) throw new Error('repo must be <username>/<project>');

    this.componentName = repo[1];
    this.componentRepo = props.componentFullName;
    this.componentDescription = props.componentDescription;

    cb();
  }.bind(this));
};

ComponentGenerator.prototype.dotfiles = function dotfiles() {
  this.copy('gitignore', '.gitignore');
};

ComponentGenerator.prototype.markdownFiles = function markdownFiles() {
  this.template('_README.md', 'README.md');
};

ComponentGenerator.prototype.jsonFiles = function jsonFiles() {
  this.template('_component.json', 'component.json');
  this.template('_package.json', 'package.json');
};

ComponentGenerator.prototype.app = function app() {
  // Populate the main directory
  this.template('_index.html', 'index.html');
  this.copy('Makefile', 'Makefile');

  this.mkdir('lib');

  // Populate the boot directory
  this.mkdir('lib/boot');
  this.copy('lib/boot/index.js', 'lib/boot/index.js');
  this.copy('lib/boot/boot.css', 'lib/boot/boot.css');
  this.copy('lib/boot/component.json', 'lib/boot/component.json');


};

util.inherits(ComponentGenerator, yeoman.generators.NamedBase);

ComponentGenerator.name = 'component-app-seed';
ComponentGenerator.description = 'Yeoman generator for component.io apps';
ComponentGenerator.usage = 'Read the `README.md`';

module.exports = ComponentGenerator;