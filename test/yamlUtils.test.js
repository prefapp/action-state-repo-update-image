const yamlUtils = require('../utils/yamlUtils');


// Test errors
test('determineAutoMerge yaml not found', () => {
  expect(() => {
    yamlUtils.determineAutoMerge('./foo/bar.yaml', "app1", "des")
  }).toThrow('Error trying to read yaml file: ');
});

test('determineAutoMerge invalid enviroment', () => {
  expect(() => {
    yamlUtils.determineAutoMerge('./fixtures/config.yaml', "app2", "pri")
  }).toThrow("Enviroment pri not found for application app2");
});

test('determineAutoMerge correct execution', () => {
  //console.log(fs.readdirSync('./fixtures'));
  const autoMergeDes = yamlUtils.determineAutoMerge('./fixtures/config.yaml', "app1", "des");
  expect(autoMergeDes).toBe(true);

  const autoMergePre = yamlUtils.determineAutoMerge('./fixtures/config.yaml', "app2", "pre");
  expect(autoMergePre).toBe(true);

  const autoMergePro = yamlUtils.determineAutoMerge('./fixtures/config.yaml', "app1", "pro");
  expect(autoMergePro).toBe(false);

  const autoMergeDev = yamlUtils.determineAutoMerge('./fixtures/config.yaml', "app3", "dev");
  expect(autoMergeDev).toBe(false);
});

test('loadYaml correct execution', () => {
  const imagesDesApp1 = yamlUtils.loadYaml('./fixtures/app1/des/images.yaml');
  expect(imagesDesApp1["app-client"]["image"]).toBe("foo/client:des");
});

test('loadYaml failure', () => {
  expect(() => {
    yamlUtils.loadYaml('./fixtures/app3/dev/images.yaml')
  }).toThrow('Error trying to read yaml file: ./fixtures/app3/dev/images.yaml');
});

test('modifyImage correct execution', () => {
  // you need 2 changes of each to make sure it changes
  yamlUtils.modifyImage("fixtures/app1", "des", "app-client", "bar/client:des");
  const modImagesDesApp1 = yamlUtils.loadYaml('./fixtures/app1/des/images.yaml');
  expect(modImagesDesApp1["app-client"]["image"]).toBe("bar/client:des");

  const oldValue1 = yamlUtils.modifyImage("fixtures/app1", "des", "app-client", "foo/client:des");
  expect(oldValue1).toBe("bar/client:des");
  const imagesDesApp1Restore = yamlUtils.loadYaml('./fixtures/app1/des/images.yaml');
  expect(imagesDesApp1Restore["app-client"]["image"]).toBe("foo/client:des");

  yamlUtils.modifyImage("fixtures/app2", "pro", "proxy", "bar/proxy:pro");
  const modimagesProApp2 = yamlUtils.loadYaml('./fixtures/app2/pro/images.yaml');
  expect(modimagesProApp2["proxy"]["image"]).toBe("bar/proxy:pro");

  const oldValue2 = yamlUtils.modifyImage("fixtures/app2", "pro", "proxy", "foo/proxy:pro" );
  expect(oldValue2).toBe("bar/proxy:pro");
  const imagesProApp2restore = yamlUtils.loadYaml('./fixtures/app2/pro/images.yaml');
  expect(imagesProApp2restore["proxy"]["image"]).toBe("foo/proxy:pro");

});

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