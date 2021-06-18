const sha1 = require('sha1');

class inputUtils {

  static commaStringToArray(commaStr){
    commaStr = commaStr.trim();
    let array = commaStr.split(",");
  
    array = array.map( str => str.trim())
                       .filter( str => str.trim().length > 0);
    return array;
  }

  static createBranchName(app, env){
    
    const rndSha = sha1(Date.now()).slice(0, 6);
    return `automated/update-image-${app}-${env}-${rndSha}`;
    
  }

}

module.exports = inputUtils;