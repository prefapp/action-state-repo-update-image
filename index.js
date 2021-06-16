const core = require('@actions/core');
const github = require('@actions/github');
const ghUtils = require('./ghUtils');
const autoMergeFromYaml = require('./autoMergeFromYaml');

// most @actions toolkit packages have async methods

const inputs = {
  secret_token: core.getInput('secret_token'),
  target_branch: core.getInput('target_branch'),
  pr_title: core.getInput('pr_title'),
  application: core.getInput('application'),
  environment: core.getInput('environment'),
  reviewers: reviewersStringToArray(core.getInput('reviewers'))
};

function reviewersStringToArray(revStr){
  let revArray = revStr.split(",");
  revArray = revArray.map( str => str.trim());
  return revArray;
}

async function run() {
  try {
    /*core.setOutput('time', new Date().toTimeString());*/
    
    const octokit = github.getOctokit(inputs.secret_token)
    const context = github.context;

    let ghClient = new ghUtils(context, octokit);

    // First thing should be reading the configfile to avoid crashing mid-process
    const autoMerge = autoMergeFromYaml('./config.yaml',  inputs.application, inputs.environment);

    const prNumber = await ghClient.createPr(inputs.target_branch, inputs.pr_title)
    core.info('Created PR number: ' + prNumber);
    
    if(inputs.reviewers.length > 0){
      await ghClient.prAddReviewers(prNumber, inputs.reviewers);
      core.info('Added reviewers: ' + inputs.reviewers);
    }else {
      core.info('No reviewers were added (input reviewers came empty)');
    }
    
    if(autoMerge){
      await ghClient.mergePr(prNumber);
      core.info('Successfully merged PR number: ' + prNumber);
    }else{
      core.info('Enviroment ' + inputs.environment + ' does NOT allow automerge!');
    }
    

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

//For testing purposes
exports.reviewersStringToArray = reviewersStringToArray;

