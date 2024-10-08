const { yamlUtils } = require('../utils/YamlUtils.js');
const basePath = "";

test('determineAutoMerge file not found', () => {
  expect(() => {
    yamlUtils.determineAutoMerge('fixtures/tenant1', "release1", "des")
  }).toThrow('Enviroment des not found for application release1 for tenant fixtures/tenant1');
});

test('determineAutoMerge correct execution', () => {
  const autoMergeDes = yamlUtils.determineAutoMerge('fixtures/tenant1', "release1", "pre");
  expect(autoMergeDes).toBe(true);

  const autoMergePre = yamlUtils.determineAutoMerge('fixtures/tenant2', "releaseA", "dev");
  expect(autoMergePre).toBe(true);

  const autoMergePro = yamlUtils.determineAutoMerge('fixtures/tenant1', "release2", "pro");
  expect(autoMergePro).toBe(false);

  const autoMergeDev = yamlUtils.determineAutoMerge('fixtures/tenant2', "releaseB", "pre");
  expect(autoMergeDev).toBe(false);

  const autoMergeAppDes = yamlUtils.determineAutoMerge('tenant1', "release1", "dev", "fixtures/apps");
  expect(autoMergeAppDes).toBe(true);

  const autoMergeAppPre = yamlUtils.determineAutoMerge('tenant1', "release1", "pre", "fixtures/apps");
  expect(autoMergeAppPre).toBe(true);

  const autoMergeAppPro = yamlUtils.determineAutoMerge('tenant1', "release2", "pro", "fixtures/apps");
  expect(autoMergeAppPro).toBe(false);
});


test('loadYaml correct execution', () => {
  const images11dev = yamlUtils.loadYaml('./fixtures/tenant1/release1/dev/images.yaml');
  expect(images11dev["proxy"]["image"]).toBe("foo/proxy:dev");
});

test('loadYaml failure', () => {
  expect(() => {
    yamlUtils.loadYaml('./fixtures/tenant2/releaseC/images.yaml')
  }).toThrow('Yaml file ./fixtures/tenant2/releaseC/images.yaml does not exist');

  expect(() => {
    yamlUtils.loadYaml('./fixtures/tenant2/releaseA/dev/images.yaml')
  }).toThrow('Error trying to load yaml file: ./fixtures/tenant2/releaseA/dev/images.yaml');
});


test('modifyImage correct execution', () => {
  // you need 2 changes of each to make sure it changes
  yamlUtils.modifyImage("fixtures/tenant1", "release1", "dev", "proxy", "foo/proxy:bar", basePath);
  const modImages11dev = yamlUtils.loadYaml('./fixtures/tenant1/release1/dev/images.yaml');
  expect(modImages11dev["proxy"]["image"]).toBe("foo/proxy:bar");

  const oldValue1 = yamlUtils.modifyImage("fixtures/tenant1", "release1", "dev", "proxy", "foo/proxy:dev", basePath);
  expect(oldValue1).toBe("foo/proxy:bar");

  const images11devRestored = yamlUtils.loadYaml('./fixtures/tenant1/release1/dev/images.yaml');
  expect(images11devRestored["proxy"]["image"]).toBe("foo/proxy:dev");

  yamlUtils.modifyImage("fixtures/tenant2", "releaseB", "pro", "app-server", "foo/common:pro", basePath);
  const modimages2Bpro = yamlUtils.loadYaml('./fixtures/tenant2/releaseB/pro/images.yaml');
  expect(modimages2Bpro["app-server"]["image"]).toBe("foo/common:pro");

  const oldValue2 = yamlUtils.modifyImage("fixtures/tenant2", "releaseB", "pro", "app-server", "foo/common:bar", basePath);
  expect(oldValue2).toBe("foo/common:pro");
  const images2BproRestore = yamlUtils.loadYaml('./fixtures/tenant2/releaseB/pro/images.yaml');
  expect(images2BproRestore["app-server"]["image"]).toBe("foo/common:bar");

});


test('modifyImage failure', () => {
  expect(() => {
    yamlUtils.modifyImage("fixtures/tenant2", "releaseB", "production", "app-server", "foo/common:bar", basePath);
  }).toThrow("Yaml file fixtures/tenant2/releaseB/production/images.yaml does not exist");

  expect(() => {
    yamlUtils.modifyImage("fixtures/tenant2", "releaseB", "pro", "inexistent_service", "foo/common:bar", basePath);
  }).toThrow("Error: no service inexistent_service found in file fixtures/tenant2/releaseB/pro/images.yaml");



});
