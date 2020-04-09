'use strict';

const path = require('path');
const {
  emberNew: _emberNew,
  emberInit: _emberInit,
  setUpBlueprintMocha
} = require('ember-cli-update-test-helpers');
const chai = require('chai');

chai.use(require('chai-fs'));

const { expect } = chai;

const projectroot = path.resolve(__dirname, '..', '..');
const blueprintpath = path.resolve(projectroot, 'index.js');

async function emberNew({
  args = []
}) {
  return await _emberNew({
    args: [
      '-sn',
      '-sg',
      ...args
    ]
  });
}


describe('blueprint', function() {
  this.timeout(10 * 1000);

  setUpBlueprintMocha.call(this);

  this.blueprintPath = projectroot;

  it('works with default options', async function() {
    let cwd = await emberNew({
      args: [
        '-b',
        this.blueprintPath
      ]
    });

    expect(path.join(cwd, 'addon/engine.js'))
      .to.be.a.file();
  });

  
});
