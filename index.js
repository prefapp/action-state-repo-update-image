const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');
const ghUtils = require('./utils/GhUtils.js');
const yamlUtils = require('./utils/YamlUtils.js');
import {PullRequestBuilder} from './model/PullRequestBuilder'
import {PullRequestInputs} from './model/PullRequestInputs'


async function run() {
  try {
    const ghClient = new ghUtils(github.context, github.getOctokit(core.getInput('token')));
    const input_matrix = JSON.parse(core.getInput('input_matrix'));

    core.info(JSON.stringify(input_matrix))
    
    // TODO: validate input matrix against json schema
    //       HEY, THIS IS IMPORTANT !!!!

    await exec.exec("git config --global user.name github-actions");
    await exec.exec("git config --global user.email github-actions@github.com");

    for (const inputs of input_matrix.images) {
      const prInputs = new PullRequestInputs(
          inputs.tenant,
          inputs.application,
          inputs.environment,
          inputs.service,
          inputs.newImage,
          inputs.reviewers
      )
      core.info("\n\n\u001b[44m✍🏼 Updating image for inputs: \u001b[0m\n" + prInputs.print())
      const prBuilder = new PullRequestBuilder(prInputs, ghClient.getDefaultBranch())
      await prBuilder.openPRUpdatingImage(ghClient, yamlUtils, core)
    }
      
  } catch (error) {
    core.setFailed(error.message);
  }
}

run().then(() => `All work done, bye 👋`);
