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

  async createPr(targetBranch, title, body) {
    const prInputs = {
      owner: this.repoOwner,
      repo: this.repoName,
      base: this.repoDefaultBranch,
      head: targetBranch,
      title: title,
      body: body
    }
    console.log("PR INPUTS: ");
    console.log(prInputs);

    const ghResponse = await this.octokit.rest.pulls.create(prInputs);
    const prNumber = ghResponse.data.number;
    return prNumber;
  }

  async prAddReviewers(prNumber, reviewers){
    const addReviewersInputs = {
      owner: this.repoOwner,
      repo: this.repoName,
      pull_number: prNumber,
      reviewers: reviewers // string array ["rv1", "rv2"]
    }
    const ghResponse = await this.octokit.rest.pulls.requestReviewers(addReviewersInputs);
    return ghResponse;
  }

  async mergePr(prNumber){
    const mergePrInputs = {
      owner: this.repoOwner,
      repo: this.repoName,
      pull_number: prNumber
    }
    const ghResponse = await this.octokit.rest.pulls.merge(mergePrInputs);
    return ghResponse;
  }

  async setPRLabels(prNumber, labels) {
    const inputs = {
      owner: this.repoOwner,
      repo: this.repoName,
      issue_number: prNumber,
      labels 
    }
    const ghResponse = await this.octokit.rest.issues.setLabels(inputs);
    return ghResponse;
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
    const ghResponse = await this.octokit.rest.issues.createLabel(inputs);
    return ghResponse;
  }

  async getRepoLabels() {
    const inputs = {
      owner: this.repoOwner,
      repo: this.repoName,
    }
    const ghResponse = await this.octokit.rest.issues.listLabelsForRepo(inputs);
    return ghResponse.data.map(labelObj => labelObj.name);
  }

  async createAndSetLabels(prNumber, labels) {
    const repoLabels = await this.getRepoLabels()
    for (const label of labels) {
      if (!repoLabels.includes(label)) {
        this.createLabel(label)
      }
    }
    return await this.setPRLabels(prNumber, labels)
  }  

}

module.exports = ghUtils;
