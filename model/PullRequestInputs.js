/**
 * All the inputs needed to update an image via PR
 */
class PullRequestInputs {
    constructor(baseFolder, tenant, application, environment, serviceNameList, newImage, checkNames, timeout, retryInterval, reviewers = [], repositoryCaller) {
        this.baseFolder = baseFolder;
        this.tenant = tenant;
        this.application = application;
        this.environment = environment;
        this.serviceNameList = serviceNameList;
        this.newImage = newImage;
        this.reviewers = reviewers;
        this.checkNames = checkNames;
        this.timeout = timeout;
        this.retryInterval = retryInterval;
        this.repositoryCaller = repositoryCaller;
    }

    print() {
        return JSON.stringify(this)
    }
}

module.exports = PullRequestInputs;
