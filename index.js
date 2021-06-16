const core = require('@actions/core');
const github = require('@actions/github');
const ghUtils = require('./ghUtils')
//const autoMergeFromYaml = require('./autoMergeFromYaml');

// most @actions toolkit packages have async methods

async function run() {
  try {
    /*core.setOutput('time', new Date().toTimeString());*/

    const inputs = {
      secret_token: core.getInput('secret_token'),
      target_branch: core.getInput('target_branch')
    };
    
    const octokit = github.getOctokit(inputs.secret_token)
    const context = github.context;

    let ghClient = new ghUtils(context, octokit);

    const prNumber = ghClient.createPr(inputs.target_branch, "NEW PR FROM GH ACTIONS")
    core.info('Created PR number: ' + prNumber);
    ghClient.prAddReviewers(prNumber, ["AlbertoFemenias"]);
    core.info('Added reviewers: ' + ["AlbertoFemenias"]);
    //autoMerge = autoMergeFromYaml('./config.yaml',  aplication, enviroment);
    ghClient.mergePr(prNumber);
    core.info('Successfully merged PR number: ' + prNumber);

    //const repoName = context.payload.repository.full_name;
    //const repoDefaultBranch = context.payload.repository.default_branch;
    //const repoOwner = context.payload.repository.owner.login;


    /*
    const prInputs = {
      ...context.repo,
      head: inputs.target_branch,
      base: repoDefaultBranch,
      title: 'PR title'
    }
    console.log("PR INPUTS");
    console.log(prInputs);

    const newPr = await octokit.rest.pulls.create(prInputs);
    //console.log(newPr);

    const prNumber = newPr.data.number;*/

    
    /*const prReviewers = await octokit.rest.pulls.requestReviewers({
      ...context.repo,
      pull_number: prNumber,
      reviewers: ["AlbertoFemenias"]
    });

    //console.log(prReviewers);*/
    /*
    const autoMerge = await octokit.rest.pulls.merge({
      ...context.repo,
      pull_number: prNumber
    });

    console.log(autoMerge); */


  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
