/**
 * All the inputs needed to update an image via PR
 */
class PullRequestInputs {
    constructor(baseFolder, tenant, application, environment, serviceNameList, newImage, reviewers = []) {
        this.baseFolder = baseFolder;
        this.tenant = tenant;
        this.application = application;
        this.environment = environment;
        this.serviceNameList = serviceNameList;
        this.newImage = newImage;
        this.reviewers = reviewers;
    }

    print() {
        return JSON.stringify(this)
    }
}

module.exports = PullRequestInputs;
