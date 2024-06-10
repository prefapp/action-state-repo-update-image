const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

class yamlUtils {

  static determineAutoMerge(tenant, application, environment) {

    const path = "./" + tenant + "/" + application + "/" + environment + "/"

    //console.log("PATH IS: " + path + "AUTO_MERGE")
    if (fs.existsSync(path)) {
      return (fs.existsSync(path + "AUTO_MERGE"))
    } else {
      throw new Error("Enviroment " + environment + " not found for application " + application + " for tenant " + tenant);
    }

  }

  static loadYaml(fileName) {
    // Get document, or throw exception 
    let configDoc = {}
    try {
      configDoc = yaml.load(fs.readFileSync(fileName, 'utf8'));
    } catch (e) {
      throw new Error('Error trying to read yaml file: ' + fileName + ". Error: " + e);
    }
    return configDoc;
  }

  static saveYaml(dumpObj, fileName) {
    try {
      fs.writeFileSync(fileName, yaml.dump(dumpObj));
    } catch (e) {
      throw new Error('Error trying to save yaml file: ' + fileName + ". Error: " + e);
    }
  }

  static modifyImage(tenant, application, environment, service, newImage, baseFolder) {
    const fileName = path.join(
      baseFolder,
      tenant,
      application,
      environment,
      "/images.yaml"
    );

    let imageFile = yamlUtils.loadYaml(fileName);

    if (typeof imageFile[service] == 'undefined') {
      throw new Error("Error: no service " + service + " found in file " + fileName);
    }

    const oldValue = imageFile[service]["image"];
    imageFile[service]["image"] = newImage;

    yamlUtils.saveYaml(imageFile, fileName);
    return oldValue;
  }

}

module.exports = yamlUtils;
