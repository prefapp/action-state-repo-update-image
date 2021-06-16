const core = require('@actions/core');
const github = require('@actions/github');
const yaml = require('js-yaml');
const fs   = require('fs');

// most @actions toolkit packages have async methods
async function run() {
  try {
    /*const ms = core.getInput('milliseconds');
    core.info(`Waiting ${ms} milliseconds ...`);

    core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    await wait(parseInt(ms));
    core.info((new Date()).toTimeString());

    core.setOutput('time', new Date().toTimeString());*/
    console.log("READING config.yaml");
    // Get document, or throw exception on error
    try {
      const doc = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
      console.log(doc);
    } catch (e) {
      console.log(e);
    }

    const myToken = core.getInput('secret_token');
    const targetBranch = core.getInput('target_branch');
    const octokit = github.getOctokit(myToken)
    const context = github.context;

    const repoName = context.payload.repository.full_name;
    const repoDefaultBranch = context.payload.repository.default_branch;
    const repoOwner = context.payload.repository.owner.login;

    const prInputs = {
      ...context.repo,
      head: targetBranch,
      base: repoDefaultBranch,
      title: 'PR title'
    }
    console.log("PR INPUTS");
    console.log(prInputs);

    const newPr = await octokit.rest.pulls.create(prInputs);
    //console.log(newPr);

    prNumber = newPr.data.number;

    const prReviewers = await octokit.rest.pulls.requestReviewers({
      ...context.repo,
      pull_number: prNumber,
      reviewers: ["AlbertoFemenias"]
    });

    //console.log(prReviewers);

    const autoMerge = await octokit.rest.pulls.merge({
      ...context.repo,
      pull_number: prNumber
    });

    console.log(autoMerge); 


  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
