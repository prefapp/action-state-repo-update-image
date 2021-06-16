const yaml = require('js-yaml');
const fs   = require('fs');

let autoMergeFromYaml = function(configFile, aplication, enviroment) {
  //Check input
  if (!(enviroment == "des" || enviroment == "pre" || enviroment == "pro")){
    throw new Error('Enviroment ' + enviroment + " not in [des, pre, pro]");
  }

  // Get document, or throw exception on error
  let config_doc = {}
  try {
    config_doc = yaml.load(fs.readFileSync(configFile, 'utf8'));
    //console.log(config_doc);
  } catch (e) {
    throw new Error('Error trying to read configFile: ' + configFile + ". Error: " + e);
  }

  // Return automerge 
  for (const [app, values] of Object.entries(config_doc)) {
    if (app === aplication) {
      if (enviroment == "des"){
        return values.auto_merge.des;
      }else if (enviroment == "pre"){
        return values.auto_merge.pre;
      }else if (enviroment == "pro"){
        return values.auto_merge.pro;
      }
    }
  }

  // if no application was found, throw an error
  throw new Error('Application not found: ' + aplication);  
};

module.exports = autoMergeFromYaml;