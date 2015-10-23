'use strict';

const exec = require('child_process').exec;

const mochaArgs = process.argv[2];
const browsers = process.argv.splice(3);

// context (browser) specific log
function log(browser, data) {
  let lines = data.replace(/\033\[[0-9;]*m/g,'').split(/(\r?\n)/g);
  let filteredLines = lines.filter(line => {
    return line !== '\n' && line !== '\r' && line !== '';
  });
  filteredLines.forEach(line => {
    let m = `${browser}:${' '.repeat(15 - browser.length)}${line.trimRight()}`;
    console.log(m);
  });
}

// promisifying `child_process`
function promiseFromChildProcess(child) {
  return new Promise(function (resolve, reject) {
    child.addListener('error', (code, signal) => {
      console.log('ChildProcess error', code, signal);
      reject();
    });
    child.addListener('exit', (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

// runs the mocha tests for a given browser
function runMocha(browser) {
  let mergedEnv = Object.assign({BROWSER: browser}, process.env);
  let mocha = exec('mocha ' + mochaArgs, {env: mergedEnv});
  mocha.stdout.on('data', log.bind(null, browser));
  mocha.stderr.on('data', log.bind(null, browser));
  return promiseFromChildProcess(mocha);
}

// running jobs in parallel
Promise.all(browsers.map(browser => runMocha(browser)))
  .then(() => console.log('ALL TESTS RAN SUCCESSFULLY!'))
  .catch(() => console.log('SOME TEST(S) FAILED!'));
