class IOUtils {

  static commaStringToArray(commaStr){
    commaStr = commaStr.trim();
    let array = commaStr.split(",");
  
    array = array.map( str => str.trim())
                       .filter( str => str.trim().length > 0);
    return array;
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
