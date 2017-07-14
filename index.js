'use strict';

const globalModulesDir = require('global-modules');

const path = require('path');
const Addon = require(`${globalModulesDir}/ember-cli/blueprints/addon/index`);
const stringUtil = require('ember-cli-string-utils');
const walkSync = require('walk-sync');
const existsSync = require('exists-sync');
const uniq = require('ember-cli-lodash-subset').uniq;
const sortPackageJson = require('sort-package-json');
const fs = require('fs-extra');

const stringifyAndNormalize = require(`${globalModulesDir}/ember-cli/lib/utilities/stringify-and-normalize`);

module.exports = Object.assign({}, Addon, {
  description: 'Creates a stand-alone Engine for Ember.js.',

  locals(options) {
    let superLocals = Addon.locals(...arguments);

    let engineName = options.entity.name;
    let engineModulePrefix = stringUtil.dasherize(engineName);

    return Object.assign(superLocals, {
      engineModulePrefix,
      isLazy: !!options.lazy,
      includeRoutesInApplication: !options.excludeRoutesFromApplication,
      welcome: false
    });
  },

  availableOptions: [
    {
      name: 'type',
      type: [ 'routable', 'routeless' ],
      default: 'routable',
      aliases: [
        { 'routable': 'routable' },
        { 'routeless': 'routeless' }
      ]
    },
    {
      name: 'lazy',
      type: Boolean,
      default: false,
      description: 'Whether this Engine should load lazily or not'
    },
    {
      name: 'exclude-routes-from-application',
      type: Boolean,
      description: 'Whether this Engine should exclude its routes from the applications vendor file or not'
    }
  ],

  install(options) {
    this.options = options;
    return this._super.install.apply(this, arguments);
  },

  uninstall(options) {
    this.options = options;
    return this._super.uninstall.apply(this, arguments);
  },

  filesPath() {
    let type = this._getEngineType();
    return path.join(this.path, "files", type + '-files');
  },

  files() {
    if (this._files) { return this._files; }

    this._appBlueprint = this.lookupBlueprint('app');
    let appFiles = this._appBlueprint.files();

    this._addonBlueprint = this.lookupBlueprint('addon');
    let addonFiles = this._addonBlueprint.files();

    this.generatePackageJson();

    let filesPath = this.filesPath(this.options);
    let engineFiles = [];
    if (existsSync(filesPath)) {
      engineFiles = walkSync(filesPath);
    }

    let files = uniq(appFiles.concat(addonFiles).concat(engineFiles));

    // Remove app/.gitkeep, engines don't need app directories
    let appGitKeep = files.indexOf('app/.gitkeep');
    files.splice(appGitKeep, 1);

    return this._files = files;
  },

  srcPath(file) {
    let type = this._getEngineType();
    let engineFilePath = path.join(this.path, "files", type + '-files', file);
    let addonFilePath = path.resolve(this._addonBlueprint.path, 'files', file);
    if (existsSync(engineFilePath)) {
      return engineFilePath;
    } else if (existsSync(addonFilePath)) {
      return addonFilePath;
    } else {
      return path.resolve(this._appBlueprint.path, 'files', file);
    }
  },

  generatePackageJson(options, isInstall) {
    Addon.generatePackageJson.apply(this, arguments);

    let contents = this._readEngineContentsFromFile('package.json');

    // Add `ember-engines` to devDependencies by default
    contents.devDependencies['ember-engines'] = '^0.5.4';

    // Move `ember-cli-htmlbars` into dependencies from devDependencies
    contents.dependencies['ember-cli-htmlbars'] = contents.devDependencies['ember-cli-htmlbars'];
    delete contents.devDependencies['ember-cli-htmlbars'];

    this._writeContentsToFile(sortPackageJson(contents), 'package.json');
  },

  _readEngineContentsFromFile(fileName) {
    let type = this._getEngineType();
    let packagePath = path.join(this.path, 'files', type + '-files', fileName);
    return this._readJsonSync(packagePath);
  },

  _writeContentsToFile(contents, fileName) {
    let type = this._getEngineType();
    let packagePath = path.join(this.path, 'files', type + '-files', fileName);
    this._writeFileSync(packagePath, stringifyAndNormalize(contents));
  },

  _getEngineType() {
    if (this._engineType) { return this._engineType; }
    return this._engineType = this.options && this.options.type || 'routable';
  },

  afterInstall() {
    let type = this._getEngineType();
    let packagePath = path.join(this.path, 'files', type + '-files', 'package.json');
    let bowerPath = path.join(this.path, 'files', type + '-files', 'bower.json');

    [packagePath, bowerPath].forEach(filePath => {
      fs.removeSync(filePath);
    });
  }

});
