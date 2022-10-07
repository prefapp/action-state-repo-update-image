class IOUtils {

  static commaStringToArray(commaStr){
    commaStr = commaStr.trim();
    let array = commaStr.split(",");
  
    array = array.map( str => str.trim())
                       .filter( str => str.trim().length > 0);
    return array;
  }

  /**
   * It is important ot create consistent branch names as the action's idempotency relies on the branch name as the key
   * @param tenant
   * @param app
   * @param env
   * @param svc
   * @returns {string}
   */
  static createBranchName(tenant, app, env, svc){
    return `automated/update-image-${tenant}-${app}-${env}-${svc}`;
  }

  // Utils to print colored strings in the console using ansii scape codes
  static green(str) {
    return `\u001b[32m${str}\u001b[0m`
  }
  static yellow(str) {
    return `\u001b[33m${str}\u001b[0m`
  }
  static red(str) {
    return `\u001b[31m${str}\u001b[0m`
  }
  static blue(str) {
    return `\u001b[34m${str}\u001b[0m`
  }
  static blueBg(str) {
    return `\u001b[44m${str}\u001b[0m`
  }
}

module.exports = IOUtils;
