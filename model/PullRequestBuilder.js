const exec = require('@actions/exec');
const io = require('../utils/IOUtils');
const { ImageVersionAlreadyUpdatedError } = require('../utils/YamlUtils');
class PullRequestBuilder {

    constructor(prInputs, sourceBranch) {
        this.baseFolder = prInputs.baseFolder;
        this.sourceBranch = sourceBranch;
        this.tenant = prInputs.tenant;
        this.application = prInputs.application;
        this.environment = prInputs.environment;
        this.service = prInputs.service;
        this.newImage = prInputs.newImage;
        this.reviewers = prInputs.reviewers;
        //It is important ot create consistent branch names as the action's idempotency relies on the branch name as the key
        this.branchName = `automated/update-image-${prInputs.tenant}-${prInputs.application}-${prInputs.environment}-${prInputs.service}`
    }

    /**
     * Executes the full workflow needed to open a PR for a given image
     */
    async openPRUpdatingImage(ghClient, yamlUtils, core) {
        // 1. CREATE BRANCH or WIPE IT IF IT ALREADY EXISTS
        core.info(io.bGreen(`> Creating new branch ${this.branchName}...`));
        if (await this.createPRBranchFrom(this.sourceBranch)) {
            core.info(io.bGreen(`> Branch ${this.branchName} does not exist in remote, so a new one was created!`));
        } else {
            core.info(io.bGreen(`> Branch ${this.branchName} already existed. It was re-set to origin/${this.sourceBranch}!`))
        }

        let oldImage
        try {
            // 2. MODIFY SERVICES' IMAGE INSIDE images.yaml
            oldImage = this.updateImageInFile(yamlUtils)
            core.info(io.bGreen(`> File updated! Old image value: ${oldImage}`));
            // 3. PUSH CHANGES TO ORIGIN
            core.info(io.bGreen(`> Pushing changes...`));
            await this.sedUpdatedImageFileToOrigin()
            // 4. CREATE PULL REQUEST IF IT DOES NOT EXIST
            let prNumber = await ghClient.branchHasOpenPR(this.branchName)
            if (prNumber === 0) {
                prNumber = await this.openNewPullRequest(ghClient, oldImage)
                core.info(io.bGreen('> Created PR number: ') + prNumber);
            } else {                
                core.info(io.yellow(`> There is already a pull-request open for branch ${this.branchName}, pr_number=${prNumber}, updating it...`));
                this.updatePullRequest(ghClient, prNumber, oldImage)
                core.info(io.bGreen('> Updated PR number: ') + prNumber);
            }
            // 5. ADD PR LABELS and REVIEWERS
            core.info(io.bGreen('> Adding labels and PR reviewers...'))
            try {
                await this.setPRLabels(ghClient, prNumber)
                const reviewers = await this.addPRReviewers(ghClient, prNumber)
                core.info(io.bGreen(`> Added reviewers: ${JSON.stringify(reviewers)}`));
            } catch (e) {
                core.info(e);
                core.info(io.yellow('> No reviewers were added!'));
            }
            // 6. DETERMINE AUTO_MERGE AND TRY TO MERGE
            if (await this.tryToMerge(ghClient, yamlUtils, prNumber)) {
                core.info(io.bGreen('> Successfully automatically merged PR number: ' + prNumber));
            } else {
                core.info(io.yellow('> PR was not merged automatically'));
            }
        } catch (e) {
            if (e instanceof ImageVersionAlreadyUpdatedError) {
                core.info(io.yellow(`Skipping PR for ${this.tenant}/${this.application}/${this.environment}/${this.service}`));
                core.info(io.yellow(`Image did not change! old=newImage=${this.newImage} `))
                return
            }
            else {
                core.info(io.red(`ERROR TRYING TO UPDATE IMAGE!! Error: ${e}`));
                throw e;
            }
        }

    }

    /**
     * Check if these coordinates already have a branch in the remote and move inside it.
     * The branch will be created if it not already present in the remote
     */
    async createPRBranchFrom(targetBranch) {
        //CREATE BRANCH or RESET IT IF IT ALREADY EXISTS
        await exec.exec("git stash");
        await exec.exec(`git checkout ${this.sourceBranch}`);
        await exec.exec(`git reset --hard origin/${targetBranch}`);
        try {
            await exec.exec("git fetch origin " + this.branchName);
            await exec.exec("git checkout " + this.branchName);
            await exec.exec(`git reset --hard origin/${targetBranch}`);
        } catch (e) {
            await exec.exec("git checkout -b " + this.branchName);
            return true
        }
        return false
    }


    updateImageInFile(yamlUtils) {
        //MODIFY SERVICES IMAGE
        const oldImageName = yamlUtils.modifyImage(this.tenant, this.application, this.environment, this.service, this.newImage, this.baseFolder);
        return oldImageName
    }

    async sedUpdatedImageFileToOrigin() {
        //COMMIT LOCAL CHANGES
        await exec.exec("git add .");
        try {
            await exec.exec('git commit -m "feat: Image value updated to latest version"');
        } catch (e) {
            console.log(e)
            throw new Error('Unable to commit file!')
        }
        //PUSH CHANGES TO ORIGIN
        await exec.exec("git push --force origin " + this.branchName);

    }

    /**
     * Creates a GitHub pull request from the current branch, it only sets title and body
     * @param ghClient
     * @param oldImageName
     * @returns {Promise<number|*>} Returns 0 if the branch already had a PR, and the new pr number otherwise
     */
    async openNewPullRequest(ghClient, oldImageName) {
        const prTitle = `📦 Service image update \`${this.newImage}\``;
        let prBody = `🤖 Automated PR created in [this](${ghClient.getActionUrl()}) workflow execution \n\n`;
        prBody += `Updated image \`${oldImageName}\` to \`${this.newImage}\` in service \`${this.service}\``;

        return await ghClient.createPr(this.branchName, prTitle, prBody)
    }

    /**
     * Updates an existing PR with the new image value
     * @param ghClient
     * @param prNumber
     * @param oldImageName
     * @returns {Promise<void>}
     */
    async updatePullRequest(ghClient, prNumber, oldImageName) {
        const prTitle = `📦 Service image update \`${this.newImage}\``;
        let prBody = `🤖 Automated PR created in [this](${ghClient.getActionUrl()}) workflow execution \n\n`;
        prBody += `Updated image \`${oldImageName}\` to \`${this.newImage}\` in service \`${this.service}\``;

        return await ghClient.updatePr(prNumber, prTitle, prBody)
    }

    /**
     * Even if the PR is opened, this method should unset old labels and set only the ones necessary
     */
    async setPRLabels(ghClient, prNumber) {
        return await ghClient.createAndSetLabels(
            prNumber,
            [`tenant/${this.tenant}`, `app/${this.application}`, `env/${this.environment}`, `service/${this.service}`])
    }

    async addPRReviewers(ghClient, prNumber) {
        if (this.reviewers.length > 0) {
            try {
                await ghClient.prAddReviewers(prNumber, this.reviewers);
            } catch (e) {
                throw new Error('Error adding reviewers: ' + e);
            }
        }
        return this.reviewers
    }

    /**
     * Determine if the coordinates allow auto-merge (based on the AUTO_MERGE) and try to merge
     * @param ghClient
     * @param yamlUtils
     * @param prNumber
     * @returns {Promise<void>}
     */
    async tryToMerge(ghClient, yamlUtils, prNumber) {
        let autoMerge = false
        try {
            autoMerge = yamlUtils.determineAutoMerge(this.tenant, this.application, this.environment)
            if (autoMerge) {
                await ghClient.mergePr(prNumber);
            } else {
                console.log(this.tenant + "/" + this.application + "/" + this.environment + " does NOT allow auto-merge!")
            }
            return autoMerge // this returns true only if the pr has been merged
        } catch (e) {
            console.log('Problem reading AUTO_MERGE marker file. Setting auto-merge to false. ' + e)
            return false;
        }
    }
}

module.exports = PullRequestBuilder;
