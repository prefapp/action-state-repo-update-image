class inputUtils {

  static commaStringToArray(commaStr){
    commaStr = commaStr.trim();
    let array = commaStr.split(",");
  
    array = array.map( str => str.trim())
                       .filter( str => str.trim().length > 0);
    return array;
  }

  static createBranchName(app, env){
    
    const timestamp = new Date().getTime();
    //const rndSha = sha1(Date.now()).slice(0, 6);
    return `automated/update-image-${app}-${env}-${timestamp}`;
    
  }

}

module.exports = inputUtils;
