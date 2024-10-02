class ghUtils {
  
  constructor(context, octokit) {
    this.context = context;
    this.octokit = octokit;
    this.repoDefaultBranch = context.payload.repository.default_branch;
    this.repoName = context.payload.repository.name;
    this.repoOwner = context.payload.repository.owner.login;
  }

  getActionUrl() {
    return `https://github.com/${this.repoOwner}/${this.context.repo.repo}/actions/runs/${this.context.runId}`
  }

  getDefaultBranch() {
    return this.repoDefaultBranch
  }

  async createPr(targetBranch, title, body) {
    const prInputs = {
      owner: this.repoOwner,
      repo: this.repoName,
      base: this.repoDefaultBranch,
      head: targetBranch,
      title: title,
      body: body
    }

    const ghResponse = await this.octokit.rest.pulls.create(prInputs);
    return ghResponse.data.number;
  }

  async updatePr(prNumber, title, body) {
    const prInputs = {
      owner: this.repoOwner,
      repo: this.repoName,
      pull_number: prNumber,
      title: title,
      body: body
    }
    return await this.octokit.rest.pulls.update(prInputs);
  }

  async prAddReviewers(prNumber, reviewers){
    const addReviewersInputs = {
      owner: this.repoOwner,
      repo: this.repoName,
      pull_number: prNumber,
      reviewers: reviewers // string array ["rv1", "rv2"]
    }
    return await this.octokit.rest.pulls.requestReviewers(addReviewersInputs);
  }

  async mergePr(prNumber){
    const mergePrInputs = {
      owner: this.repoOwner,
      repo: this.repoName,
      pull_number: prNumber
    }
    return await this.octokit.rest.pulls.merge(mergePrInputs);
  }

  async setPRLabels(prNumber, labels) {
    const inputs = {
      owner: this.repoOwner,
      repo: this.repoName,
      issue_number: prNumber,
      labels 
    }
    return await this.octokit.rest.issues.setLabels(inputs);
  }

  async createLabel(newLabel) {
    let selectedColor = "7e7c7a"
    if (newLabel.includes('app/')){
      selectedColor = 'ac1d1c'
    } else if (newLabel.includes('tenant/')) {
      selectedColor = '234099'
    } else if (newLabel.includes('env/')) {
      selectedColor = '33810b'
    } else if (newLabel.includes('service/')) {
      selectedColor = 'f1c232'
    }
    const inputs = {
      owner: this.repoOwner,
      repo: this.repoName,
      name: newLabel,
      color: selectedColor,
    }
    return await this.octokit.rest.issues.createLabel(inputs);
  }

  async getRepoLabels() {
    const inputs = {
      owner: this.repoOwner,
      repo: this.repoName,
      per_page: 100,
    }
    const ghResponse = await this.octokit.paginate(
      this.octokit.rest.issues.listLabelsForRepo,
      inputs
    )
    return ghResponse.data.map(labelObj => labelObj.name);
  }

  async createAndSetLabels(prNumber, labels) {
    const repoLabels = await this.getRepoLabels()
    for (const label of labels) {
      if (!repoLabels.includes(label)) {
        await this.createLabel(label)
      }
    }
    return await this.setPRLabels(prNumber, labels)
  }

  /**
   * This function return a dict where the key is the branch name of the pr and the value is the PR number
   * It is used to determine if a branch already has an open pr
   */
  async getOpenPRs() {
    const inputs = {
      owner: this.repoOwner,
      repo: this.repoName,
      state: 'open',
      per_page: 1
    }
    try {
      const ghResponse = await this.octokit.paginate(
          this.octokit.rest.pulls.list,
          inputs,
          (response) => response.data
      )
      const openPRs = {}
      ghResponse.forEach(pr => openPRs[pr.head.ref] = pr.number)
      return openPRs
    } catch (e) {
      throw new Error(`Error trying to read open pull request with inputs=${JSON.stringify(inputs)} E: ${e}`)
    }
  }

  /**
   * Return 0 is there is no PR opened for that branch, PR number otherwise
   * @param branchName
   * @returns {Promise<number|*>}
   */
  async branchHasOpenPR(branchName) {
    const openPRs = await this.getOpenPRs()
    for (const openPRname in openPRs) {
      if (openPRname === branchName) {
        return openPRs[openPRname]
      }
    }
    return 0
  }

}

module.exports = ghUtils;
