
const { build } = require('vite');
const { build: electronBuild } = require('electron-builder');

async function buildElectron() {
  console.log('Building Vite app...');
  await build();
  
  console.log('Building Electron app...');
  await electronBuild({
    config: require('../electron-builder.config.js')
  });
  
  console.log('Electron build complete!');
}

buildElectron().catch(console.error);
