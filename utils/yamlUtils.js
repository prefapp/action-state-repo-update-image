const yaml = require('js-yaml');
const fs   = require('fs');

class yamlUtils {

  static determineAutoMerge(tenant, application, environment) {
    
    const path = "./" + tenant + "/" + application + "/" + environment + "/"
    
    console.log("PATH IS: " + path + "AUTO_MERGE")
    if (fs.existsSync(path)) {
      return (fs.existsSync(path + "AUTO_MERGE"))
    } else {
      throw new Error("Enviroment " + environment + " not found for application " + application + " for tenant " + tenant);  
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

  static modifyImage(tenant, application, environment, service, newImage) {
    const fileName = "./" + tenant + "/" + application + "/" + environment + "/images.yaml"
    
    //console.log("DEBUGG, filename: " + fileName);
    //console.log("DEBUGG, service " + service);

    let imageFile = yamlUtils.loadYaml(fileName);

    if (typeof imageFile[service] == 'undefined'){
      throw new Error("Error: no service " + service + " found in file " + fileName);
    }
    
    const oldValue = imageFile[service]["image"];
    imageFile[service]["image"] = newImage;

    yamlUtils.saveYaml(imageFile, fileName);

    return oldValue;
  }

  static modifyServicesImage(tenant, application, environment, services, newImage) {
    let oldImages = [];
    if (services.length == 0){
      throw new Error("Error: services array is empty, imposible to modify image!");
    }

    for (let i = 0; i < services.length; i++){
      oldImages.push(yamlUtils.modifyImage(tenant, application, environment, services[i], newImage));
    }

    return oldImages;

  }
}

module.exports = yamlUtils;
