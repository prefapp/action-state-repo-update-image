const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');
const ghUtils = require('./utils/ghUtils');
const yamlUtils = require('./utils/yamlUtils');
const inputUtils = require('./utils/inputUtils');


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
      core.info("\n\n \u001b[44m Updating image for inputs: \u001b[0m")
      core.info(JSON.stringify(inputs))
      await openPRforNewImage(ghClient, inputs.tenant, inputs.app, inputs.env, inputs.service_name, inputs.image, inputs.reviewers)
    }
      
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function openPRforNewImage(ghClient, tenant, application, environment, service, newImage, reviewers = []) {
  //CALCULATE BRANCH NAME
  const branchName = inputUtils.createBranchName(tenant, application, environment, service);

  //CREATE BRANCH or WIPE IT IF IT ALREADY EXISTS
  await exec.exec("git stash");
  await exec.exec("git checkout main");
  await exec.exec("git reset --hard origin/main");
  try {
    await exec.exec("git fetch origin " + branchName);
    await exec.exec("git checkout " + branchName);
    await exec.exec("git reset --hard origin/main");
  } catch (e) {
    core.info(`Branch ${branchName} does not exist in remote, creating one!`);
    await exec.exec("git checkout -b " + branchName);
  }

  //MODIFY SERVICES IMAGE
  const oldImageName = yamlUtils.modifyImage(tenant, application, environment, service, newImage);
  
  if (oldImageName === newImage) {
    core.info(`Image did not change!`);
    core.info(`Skipping PR for ${tenant}/${application}/${environment}/${service} with old=newImage=${newImage}} `)
    return
  }

  //PUSH CHANGES TO ORIGIN
  await exec.exec("git add .");
  try{
    await exec.exec('git commit -m "feat: Image values updated"');
  }catch(e){
    console.log(`ERROR TRYING TO COMMIT CHANGES!! inputs: ${JSON.stringify({tenant, application, environment, service, newImage})}. Error: ${e}`);
    return
  }
  await exec.exec("git push origin " + branchName);

  const prTitle = `Service image update \`${newImage}\``; 
  let prBody = `Automated PR created in [this](${ghClient.getActionUrl()}) workflow execution \n\n`;
  prBody += `Updated image \`${oldImageName}\` to \`${newImage}\` in service \`${service}\``;

  //CREATE PULL REQUEST
  // TODO: if there is already a PR for the branchName, get the number and use it
  const prNumber = await ghClient.createPr(branchName, prTitle, prBody)
  core.info('\u001b[32mCreated PR number:\u001b[0m ' + prNumber);
  
  core.info('Adding labels to the PR...')
  await ghClient.createAndSetLabels(prNumber, [`tenant/${tenant}`, `app/${application}`, `env/${environment}`, `service/${service}`])


  //ADD REVIEWERS
  if(reviewers.length > 0){
    try {
      await ghClient.prAddReviewers(prNumber, reviewers);
      core.info('Added reviewers: ' + reviewers);
    } catch (e) {
      const errorMsg = 'Error adding reviewers: ' + e;
      core.info(errorMsg);
    }
  }else {
    core.info('No reviewers were added (input reviewers came empty)');
  }

  // DETERMINE AUTOMERGE AND TRY TO MERGE
  try {
    if(yamlUtils.determineAutoMerge(tenant, application, environment)){
      await ghClient.mergePr(prNumber);
      core.info('Successfully merged PR number: ' + prNumber);
    }else{
      core.info(tenant + "/" + application + "/" + environment + " does NOT allow automerge!")
    }
  } catch (e) {
    const errorMsg = 'Problem reading AUTO_MERGE marker file. Setting automerge to false. ' + e
    core.info(errorMsg);
  }      
}

run().then(() => `All work done, bye 👋`);
