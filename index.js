const core = require('@actions/core');
const github = require('@actions/github');
const ghUtils = require('./ghUtils')
//const autoMergeFromYaml = require('./autoMergeFromYaml');

// most @actions toolkit packages have async methods

const inputs = {
  secret_token: core.getInput('secret_token'),
  target_branch: core.getInput('target_branch'),
  pr_title: core.getInput('pr_title')
};

async function run() {
  try {
    /*core.setOutput('time', new Date().toTimeString());*/
    
    const octokit = github.getOctokit(inputs.secret_token)
    const context = github.context;

    let ghClient = new ghUtils(context, octokit);

    // First thing should be reading the configfile to avoid crashing mid-process
    //autoMerge = autoMergeFromYaml('./config.yaml',  aplication, enviroment);

    const prNumber = await ghClient.createPr(inputs.target_branch, inputs.pr_title)
    core.info('Created PR number: ' + prNumber);
    await ghClient.prAddReviewers(prNumber, ["AlbertoFemenias"]);
    core.info('Added reviewers: ' + ["AlbertoFemenias"]);
    await ghClient.mergePr(prNumber);
    core.info('Successfully merged PR number: ' + prNumber);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
