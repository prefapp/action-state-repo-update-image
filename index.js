const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');
const ghUtils = require('./utils/GhUtils.js');
const { yamlUtils } = require('./utils/YamlUtils.js');
const PullRequestBuilder = require('./model/PullRequestBuilder')
const PullRequestInputs = require('./model/PullRequestInputs')
const io = require('./utils/IOUtils')
const ValidateInputs = require('./schemas/ValidateInputs')


async function run() {
  try {
    const ghClient = new ghUtils(github.context, github.getOctokit(core.getInput('token')));
    const input_matrix = JSON.parse(core.getInput('input_matrix'));

    core.info(JSON.stringify(input_matrix))
    core.info(io.blueBg('· Validating input against JSON Schema...'))
    ValidateInputs.checkValidInput(input_matrix)

    await exec.exec("git config --global user.name github-actions");
    await exec.exec("git config --global user.email github-actions@github.com");

    for (const inputs of input_matrix.images) {
      const prInputs = new PullRequestInputs(
        inputs['base_folder'] ?? "",
        inputs['tenant'],
        inputs['app'],
        inputs['env'],
        inputs['service_name_list'],
        inputs['image'],
        inputs['reviewers'],
      )
      core.info("\n\n️" + io.blueBg("· Updating image for inputs: \n") + io.italic(prInputs.print()))
      const prBuilder = new PullRequestBuilder(prInputs, ghClient.getDefaultBranch())
      await prBuilder.openPRUpdatingImage(ghClient, yamlUtils, core)
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run().then(() => `All work done, bye 👋`);
