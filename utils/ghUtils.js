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
  

}

module.exports = ghUtils;
