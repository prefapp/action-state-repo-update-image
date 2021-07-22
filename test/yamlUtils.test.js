const yamlUtils = require('../utils/yamlUtils');


test('determineAutoMerge file not found', () => {
  expect(() => {
    yamlUtils.determineAutoMerge('fixtures/tenant1', "release1", "des")
  }).toThrow('Enviroment des not found for application release1 for tenant fixtures/tenant1');
});

test('determineAutoMerge correct execution', () => {
  //console.log(fs.readdirSync('./fixtures'));
  const autoMergeDes = yamlUtils.determineAutoMerge('fixtures/tenant1', "release1", "pre");
  expect(autoMergeDes).toBe(true);

  const autoMergePre = yamlUtils.determineAutoMerge('fixtures/tenant2', "releaseA", "dev");
  expect(autoMergePre).toBe(true);

  const autoMergePro = yamlUtils.determineAutoMerge('fixtures/tenant1', "release2", "pro");
  expect(autoMergePro).toBe(false);

  const autoMergeDev = yamlUtils.determineAutoMerge('fixtures/tenant2', "releaseB", "pre");
  expect(autoMergeDev).toBe(false);
});


test('loadYaml correct execution', () => {
  const images11dev = yamlUtils.loadYaml('./fixtures/tenant1/release1/dev/images.yaml');
  expect(images11dev["proxy"]["image"]).toBe("foo/proxy:dev");
});

test('loadYaml failure', () => {
  expect(() => {
    yamlUtils.loadYaml('./fixtures/tenant2/releaseC/images.yaml')
  }).toThrow('Error trying to read yaml file: ./fixtures/tenant2/releaseC/images.yaml');
});


test('modifyImage correct execution', () => {
  // you need 2 changes of each to make sure it changes
  yamlUtils.modifyImage("fixtures/tenant1", "release1", "dev", "proxy", "foo/proxy:bar");
  const modImages11dev = yamlUtils.loadYaml('./fixtures/tenant1/release1/dev/images.yaml');
  expect(modImages11dev["proxy"]["image"]).toBe("foo/proxy:bar");

  const oldValue1 = yamlUtils.modifyImage("fixtures/tenant1", "release1", "dev", "proxy", "foo/proxy:dev");
  expect(oldValue1).toBe("foo/proxy:bar");

  const images11devRestored = yamlUtils.loadYaml('./fixtures/tenant1/release1/dev/images.yaml');
  expect(images11devRestored["proxy"]["image"]).toBe("foo/proxy:dev");
/*
  yamlUtils.modifyImage("fixtures/app2", "pro", "proxy", "bar/proxy:pro");
  const modimagesProApp2 = yamlUtils.loadYaml('./fixtures/app2/pro/images.yaml');
  expect(modimagesProApp2["proxy"]["image"]).toBe("bar/proxy:pro");

  const oldValue2 = yamlUtils.modifyImage("fixtures/app2", "pro", "proxy", "foo/proxy:pro" );
  expect(oldValue2).toBe("bar/proxy:pro");
  const imagesProApp2restore = yamlUtils.loadYaml('./fixtures/app2/pro/images.yaml');
  expect(imagesProApp2restore["proxy"]["image"]).toBe("foo/proxy:pro");
*/
});
/*

test('modifyImage failure', () => {
  expect(() => {
    yamlUtils.modifyImage("fixtures/appfoo", "des", "app-client", "foo/client:des");
  }).toThrow("Error trying to read yaml file: ");
});

test('modifyServicesImage correct execution', () => {
  // you need 2 changes of each to make sure it changes
  const services = ["app-server", "app-api"];
  const newImage = "bar/common:pre";
  const recievedImage1 = yamlUtils.modifyServicesImage("fixtures/app1", "pre", services, newImage);
  expect(recievedImage1).toBe("foo/common:pre");
  const modImagesDesApp1 = yamlUtils.loadYaml('./fixtures/app1/pre/images.yaml');

  expect(modImagesDesApp1["app-client"]["image"]).toBe("foo/client:pre");
  expect(modImagesDesApp1["app-server"]["image"]).toBe("bar/common:pre");
  expect(modImagesDesApp1["app-api"]["image"]).toBe("bar/common:pre");

  const restoreImage = "foo/common:pre";
  const recievedImage2 = yamlUtils.modifyServicesImage("fixtures/app1", "pre", services, restoreImage);
  expect(recievedImage2).toBe("bar/common:pre");
  const iemagesDesApp1Restore = yamlUtils.loadYaml('./fixtures/app1/pre/images.yaml');

  expect(iemagesDesApp1Restore["app-client"]["image"]).toBe("foo/client:pre");
  expect(iemagesDesApp1Restore["app-server"]["image"]).toBe("foo/common:pre");
  expect(iemagesDesApp1Restore["app-api"]["image"]).toBe("foo/common:pre");


});
*/