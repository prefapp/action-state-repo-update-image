const wait = require('./wait');
const autoMergeFromYaml = require('./autoMergeFromYaml');
const process = require('process');
const cp = require('child_process');
const path = require('path');
var fs = require('fs');
/*
test('throws invalid number', async () => {
  await expect(wait('foo')).rejects.toThrow('milliseconds not a number');
});

test('wait 500 ms', async () => {
  const start = new Date();
  await wait(500);
  const end = new Date();
  var delta = Math.abs(end - start);
  expect(delta).toBeGreaterThanOrEqual(500);
});
*/

// shows how the runner will run a javascript action with env / stdout protocol
/*
test('test runs', () => {
  process.env['INPUT_MILLISECONDS'] = 500;
  const ip = path.join(__dirname, 'index.js');
  console.log(cp.execSync(`node ${ip}`, {env: process.env}).toString());
})
*/


// Test read config yaml autoMergeFromYaml
test('autoMergeFromYaml yaml not found', () => {
  expect(() => {
    autoMergeFromYaml('./foo/bar.yaml', "app1", "des")
  }).toThrow('Error trying to read configFile: ');
});

test('autoMergeFromYaml invalid enviroment', () => {
  expect(() => {
    autoMergeFromYaml('./fixtures/config.yaml', "app2", "dev")
  }).toThrow("Enviroment dev not in [des, pre, pro]");
});

test('autoMergeFromYaml invalid enviroment', () => {
  expect(() => {
    autoMergeFromYaml('./fixtures/config.yaml', "app3", "des")
  }).toThrow("Application not found: app3");
});

test('autoMergeFromYaml correct execution', () => {
  //console.log(fs.readdirSync('./fixtures'));
  const autoMergeDes = autoMergeFromYaml('./fixtures/config.yaml', "app1", "des");
  expect(autoMergeDes).toBe(true);

  const autoMergePre = autoMergeFromYaml('./fixtures/config.yaml', "app2", "pre");
  expect(autoMergePre).toBe(true);

  const autoMergePro = autoMergeFromYaml('./fixtures/config.yaml', "app1", "pro");
  expect(autoMergePro).toBe(false);
});


