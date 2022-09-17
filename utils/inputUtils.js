class inputUtils {

  static commaStringToArray(commaStr){
    commaStr = commaStr.trim();
    let array = commaStr.split(",");
  
    array = array.map( str => str.trim())
                       .filter( str => str.trim().length > 0);
    return array;
  }

  static createBranchName(tenant, app, env, svc){
    
    //const timestamp = new Date().getTime() % 1000;
    return `automated/update-image-${tenant}-${app}-${env}-${svc}`;
    
  }

}

module.exports = inputUtils;
