const yaml = require('js-yaml');
const fs   = require('fs');

class yamlUtils {

  static determineAutoMerge(configFile, application, environment) {
    // Reead config.yaml or throw exception
    let configDoc = yamlUtils.loadYaml(configFile);

    const autoMerge = configDoc[application]["auto_merge"][environment];
    if (autoMerge != null) {
      return autoMerge;
    } else {
      throw new Error("Enviroment " + environment + " not found for application " + application);  
    }
 
  }

  static loadYaml(fileName){
    // Get document, or throw exception 
    let configDoc = {}
    try {
      configDoc = yaml.load(fs.readFileSync(fileName, 'utf8'));
    } catch (e) {
      throw new Error('Error trying to read yaml file: ' + fileName + ". Error: " + e);
    }
    return configDoc;
  }

  static saveYaml(dumpObj, fileName){
    try {
      fs.writeFileSync(fileName, yaml.dump(dumpObj));
    } catch (e) {
      throw new Error('Error trying to save yaml file: ' + fileName + ". Error: " + e);
    }
  }

  static modifyImage(application, environment, service, newImage) {
    const fileName = "./" + application + "/" + environment + "/images.yaml"
    
    let imageFile = yamlUtils.loadYaml(fileName);
    
    const oldValue = imageFile[service]["image"];
    imageFile[service]["image"] = newImage;

    yamlUtils.saveYaml(imageFile, fileName);

    return oldValue;
  }

  static modifyServicesImage(application, environment, services, newImage) {
    let oldImages;
    if (services.length == 0){
      throw new Error("Error: services array is empty, imposible to modify image!");
    }

    for (let i = 0; i < services.length; i++){
      oldImages = yamlUtils.modifyImage(application, environment, services[i], newImage);
    }

    return oldImages;

  }
}

module.exports = yamlUtils;
