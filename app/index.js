'use strict';
var path    = require('path'),
    util    = require('util'),
    yeoman  = require('yeoman-generator');

var ComponentAppSeedGenerator = module.exports = function ComponentAppSeedGenerator (args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function() {
    this.installDependencies({ skipInstall: true });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(ComponentAppSeedGenerator, yeoman.generators.Base);

ComponentAppSeedGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log(this.yeoman);

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

  this.prompt(prompts, function(props) {
    var repo = props.componentRepo.split('/');
    if (repo.length !== 2) throw new Error('repo must be <username>/<project>');

    this.componentName = repo[1];
    this.componentRepo = props.componentFullName;
    this.componentDescription = props.componentDescription;

    cb();
  }.bind(this));
};

ComponentAppSeedGenerator.prototype.dotfiles = function dotfiles() {
  this.copy('gitignore', '.gitignore');
};

ComponentAppSeedGenerator.prototype.markdownFiles = function markdownFiles() {
  this.template('_README.md', 'README.md');
};

ComponentAppSeedGenerator.prototype.jsonFiles = function jsonFiles() {
  this.template('_component.json', 'component.json');
  this.template('_package.json', 'package.json');
};

ComponentAppSeedGenerator.prototype.app = function app() {
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

