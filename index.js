const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');
const ghUtils = require('./utils/ghUtils');
const yamlUtils = require('./utils/yamlUtils');
const inputUtils = require('./utils/inputUtils');

// most @actions toolkit packages have async methods
if (!process.env.GITHUB_TOKEN) {
  console.log("GITHUB_TOKEN environment variable not set");
  process.exit(1);
}

const inputs = {
  //mandatory
  application: core.getInput('application'),
  environment: core.getInput('environment'),
  services: inputUtils.commaStringToArray(core.getInput('services')),
  image: core.getInput('image'),
  //optional
  reviewers: inputUtils.commaStringToArray(core.getInput('reviewers')),
  pr_title: core.getInput('pr_title'),
  pr_body: core.getInput('pr_body'),
  branch_name: core.getInput('branch_name'),
};

async function run() {
  try {

    //FIRST CHECK THAT THE IMAGE FILES EXIST

    const SECRET_TOKEN = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(SECRET_TOKEN);
    const context = github.context;

    let ghClient = new ghUtils(context, octokit);

    console.log("DEBUGG");
    console.log(inputs);

    
    //CALCULATE BRANCH NAME
    if(inputs.branch_name == "")
      inputs.branch_name = `automated/update-image-${inputs.application}-${inputs.environment}`;
    
    //CREATE BRANCH
    await exec.exec("git config --global user.name github-actions");
    await exec.exec("git config --global user.email github-actions@github.com");
    await exec.exec("git checkout -b " + inputs.branch_name);
    await exec.exec("git pull origin " + inputs.branch_name + " --rebase");

    //MODIFY SERVICES IMAGE
    const oldImage = yamlUtils.modifyServicesImage(inputs.application, inputs.environment, inputs.services, inputs.image);

    //PUSH CHANGES TO ORIGIN
    await exec.exec("git add .");
    await exec.exec('git commit -m "Image values updated"');
    await exec.exec("git push origin " + inputs.branch_name);

    //CALCULATE PR VALUES
    if(inputs.pr_title == "")
      inputs.pr_title = `Updated image ${inputs.image} in application: ${inputs.application} - env: ${inputs.environment}`; 
    if(inputs.pr_body == "")
      inputs.pr_body = `Updated image from: ${oldImage} to: ${inputs.image} for the services: ${core.getInput('services')}
                        in application: ${inputs.application} at environment: ${inputs.environment}`;

    // DETERMINE AUTOMERGE
    let autoMerge;
    try {
      autoMerge = yamlUtils.determineAutoMerge('./config.yaml',  inputs.application, inputs.environment);
    } catch (e) {
      const errorMsg = 'Problem reading ./config.yaml. Setting automerge to false. ' + e
      core.info(errorMsg);
      autoMerge = false;
      inputs.pr_body += ".  " + errorMsg; //Show the problem in the pr body 
    }

    //CREATE PULL REQUEST
    const prNumber = await ghClient.createPr(inputs.branch_name, inputs.pr_title, inputs.pr_body)
    core.info('Created PR number: ' + prNumber);
    

    //ADD REVIEWERS
    if(inputs.reviewers.length > 0){
      await ghClient.prAddReviewers(prNumber, inputs.reviewers);
      core.info('Added reviewers: ' + inputs.reviewers);
    }else {
      core.info('No reviewers were added (input reviewers came empty)');
    }

    
    //TRY TO MERGE
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

