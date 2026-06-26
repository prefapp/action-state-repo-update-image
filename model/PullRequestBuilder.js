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
        this.serviceNameList = prInputs.serviceNameList;
        this.newImage = prInputs.newImage;
        this.reviewers = prInputs.reviewers || [];
        //It is important ot create consistent branch names as the action's idempotency relies on the branch name as the key
        this.branchName = `automated/update-image-${prInputs.tenant}-${prInputs.application}-${prInputs.environment}-${prInputs.repositoryCaller}`
        this.checkNames = prInputs.checkNames;
        this.timeout = prInputs.timeout;
        this.retryInterval = prInputs.retryInterval;
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

        const oldImagesList = {}
        try {
            // 2. MODIFY SERVICES' IMAGE INSIDE images.yaml
            this.serviceNameList.forEach(service => {
                try {
                    const oldImageValue = this.updateImageInFile(yamlUtils, service);
                    oldImagesList[service] = oldImageValue;
                } catch (e) {
                    if (e instanceof ImageVersionAlreadyUpdatedError) {
                        core.info(io.yellow(
                            `Skipping PR for ${this.tenant}/${this.application}/${this.environment}/${service}`
                        ));
                        core.info(io.yellow(
                            `Image did not change! old=newImage=${this.newImage}`
                        ));
                    }
                    else {
                        core.info(io.red(
                            `ERROR TRYING TO UPDATE IMAGE!! Error: ${e}`
                        ));
                        throw e;
                    }
                }
            });
            if (!oldImagesList || Object.keys(oldImagesList).length === 0) return;
            core.info(io.bGreen('> File updated! Old images value:'));
            for (const [service, oldImage] of Object.entries(oldImagesList)) {
                core.info(io.bGreen(`${service}: ${oldImage}`));
            }

            // 3. PUSH CHANGES TO ORIGIN
            core.info(io.bGreen(`> Pushing changes...`));
            await this.sedUpdatedImageFileToOrigin()

            // 4. CREATE PULL REQUEST IF IT DOES NOT EXIST
            let prNumber = await ghClient.branchHasOpenPR(this.branchName)
            const { prTitle, prBody } = this.getPrTitleAndBody(ghClient, prNumber, oldImagesList)

            if (prNumber === 0) {
                prNumber = await this.openNewPullRequest(ghClient, prTitle, prBody)
                core.info(io.bGreen('> Created PR number: ') + prNumber);
            } else {
                core.info(io.yellow(`> There is already a pull-request open for branch ${this.branchName}, pr_number=${prNumber}, updating it...`));
                await this.updatePullRequest(ghClient, prNumber, prTitle, prBody)
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
            core.info(io.red(`ERROR TRYING TO UPDATE IMAGE!! Error: ${e}`));
            throw e;
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


    updateImageInFile(yamlUtils, service) {
        //MODIFY SERVICES IMAGE
        const oldImageName = yamlUtils.modifyImage(
            this.tenant,
            this.application,
            this.environment,
            service,
            this.newImage,
            this.baseFolder
        );
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

    getPrTitleAndBody(ghClient, prNumber, oldImagesList) {
        const prTitle = `📦 Service image update \`${this.newImage}\``;
        let prBody = `🤖 Automated PR created in [this](${ghClient.getActionUrl()}) workflow execution \n\n`;
        prBody += `Images updated for the following services:\n`
        for (const [service, oldImage] of Object.entries(oldImagesList)) {
            prBody += `- \`${service}\`: \`${oldImage}\`\n`;
        }
        prBody += `\nTo:\n`;
        for (const serviceName of Object.keys(oldImagesList)) {
            prBody += `- \`${serviceName}\`: \`${this.newImage}\`\n`;
        }

        return { prTitle, prBody }
    }

    /**
     * Creates a GitHub pull request from the current branch, it only sets title and body
     * @param ghClient
     * @param oldImageName
     * @returns {Promise<number|*>} Returns 0 if the branch already had a PR, and the new pr number otherwise
     */
    async openNewPullRequest(ghClient, prTitle, prBody) {
        return await ghClient.createPr(this.branchName, prTitle, prBody)
    }

    /**
     * Updates an existing PR with the new image value
     * @param ghClient
     * @param prNumber
     * @param oldImageName
     * @returns {Promise<void>}
     */
    async updatePullRequest(ghClient, prNumber, prTitle, prBody) {
        await ghClient.updatePr(prNumber, prTitle, prBody)
    }

    /**
     * Even if the PR is opened, this method should unset old labels and set only the ones necessary
     */
    async setPRLabels(ghClient, prNumber) {
        return await ghClient.createAndSetLabels(
            prNumber,
            
            [
                
                `tenant/${this.tenant}`, 
                
                `app/${this.application}`, 
                
                `env/${this.environment}`
            
            ]
            
            .concat(
            
                this.serviceNameList.map(service => `service/${service}`)
            
            )
        )
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
     * @returns {Promise<boolean>} - Returns true if the PR was merged, false otherwise
     */
    async tryToMerge(ghClient, yamlUtils, prNumber) {
        let autoMerge = false
        try {
            autoMerge = yamlUtils.determineAutoMerge(this.tenant, this.application, this.environment, this.baseFolder)

            if (!autoMerge) {
                console.log(this.tenant + "/" + this.application + "/" + this.environment + " does NOT allow auto-merge!")
                return false
            }

            if (await ghClient.repoHasAutoMergeEnabled()) {
                /**
                 * We check it anyways just in case there is no ruleset or branch protection configured,
                 * if that is the case we cant enable auto-merge and we will merge via API
                 */
                const pr = await ghClient.getPr(prNumber)

                if (pr.mergeable === true && pr.mergeable_state === 'clean') {
                    await ghClient.mergePr(prNumber)
                    console.log(`PR #${prNumber} is already clean, merged directly instead of enabling auto-merge!`)
                    return true
                }

                /**
                 * Otherwise we just automerge
                 */
                console.info(`Repository has auto-merge enabled, enabling auto-merge for PR #${prNumber}...`)
                await ghClient.enableAutoMerge(prNumber)
                console.log(`Auto-merge enabled for PR #${prNumber} as repository allows it!`)
                return true
            } else {
                console.log(`Repository does not have auto-merge enabled, falling back to waiting for PR to be mergeable via API...`)
                const isMergeable = await this.canMerge(ghClient, prNumber);
                if (isMergeable) {
                    await ghClient.mergePr(prNumber);
                    console.log(`PR #${prNumber} merged via API as repository does not allow auto-merge!`);
                    return true;
                } else {
                    console.log(`There was a problem merging PR #${prNumber} via API`);
                    return false;
                }
            }

        } catch (e) {
            console.log('Error trying to merge PR: ' + e)
            return false;
        }
    }

    /**
     * Determines if the PR is mergeable based on GitHub's computed mergeable state
     * @param client - GitHub client
     * @param prNumber - Pull request number
     * @returns {Promise<boolean>} - Returns true if the PR is mergeable, false otherwise
     */
    async canMerge(client, prNumber) {

        const start = Date.now();

        while (Date.now() - start < this.timeout) {
            console.log('Waiting for PR mergeability to be computed...');

            // Wait for retryInterval before checking again
            await new Promise(resolve => setTimeout(resolve, this.retryInterval));

            const { data: pr } = await client.octokit.rest.pulls.get({
                owner: client.repoOwner,
                repo: client.repoName,
                pull_number: prNumber,
            });

            if (pr.mergeable && pr.mergeable_state === 'clean') {
                console.log('PR is clean and fully ready to merge!');
                return true;
            }

            if (pr.mergeable === null) {
                console.log(`PR mergeability still pending. mergeable=${pr.mergeable}, state=${pr.mergeable_state}`);
                continue;
            }

            if (!pr.mergeable || pr.mergeable_state !== 'clean') {
                console.log(`PR cannot be merged. State: ${pr.mergeable_state}`);
                continue;
            }

        }
        // If we reach here, then we have timed out
        return false;

    }
}

module.exports = PullRequestBuilder;
