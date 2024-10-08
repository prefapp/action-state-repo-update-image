const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');


class YamlFileNotFoundError extends Error {
  constructor(fileName) {
    super(`Yaml file ${fileName} does not exist`);
    this.name = "YamlFileNotFoundError";
  }
}

class ImageVersionAlreadyUpdatedError extends Error {
  constructor(service, newImage) {
    super(`Service ${service} already has the image version ${newImage}`);
    this.name = "ImageVersionAlreadyUpdatedError";
  }
}

class yamlUtils {

  static determineAutoMerge(tenant, application, environment, basePath = "") {

    const appPath = path.join(
      basePath,
      tenant,
      application,
      environment
    )

    console.log(appPath)

    //console.log("PATH IS: " + path + "AUTO_MERGE")
    if (fs.existsSync(appPath)) {
      return (fs.existsSync(path.join(appPath, "AUTO_MERGE")))
    } else {
      throw new Error("Enviroment " + environment + " not found for application " + application + " for tenant " + tenant);
    }

  }

  static loadYaml(fileName) {
    // Get document, or throw exception 
    let configDoc = {}
    if (!fs.existsSync(fileName)) throw new YamlFileNotFoundError(fileName);
    try {
      const yamlContent = fs.readFileSync(fileName, 'utf8');
      configDoc = yaml.load(yamlContent);
    } catch (error) {
      throw new Error('Error trying to load yaml file: ' + fileName);
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

    if (oldValue === newImage) {
      throw new ImageVersionAlreadyUpdatedError(service, newImage);
    }

    yamlUtils.saveYaml(imageFile, fileName);
    return oldValue;
  }

}

module.exports = {
  yamlUtils,
  YamlFileNotFoundError,
  ImageVersionAlreadyUpdatedError
}  
