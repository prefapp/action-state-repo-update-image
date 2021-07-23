const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');
const ghUtils = require('./utils/ghUtils');
const yamlUtils = require('./utils/yamlUtils');
const inputUtils = require('./utils/inputUtils');

// most @actions toolkit packages have async methods

const inputs = {
  //mandatory
  tenant: core.getInput('tenant'),
  application: core.getInput('application'),
  environment: core.getInput('environment'),
  services: JSON.parse(core.getInput('service_names')),
  image: core.getInput('image'),
  //optional
  reviewers: JSON.parse(core.getInput('reviewers')),
  pr_title: core.getInput('pr_title'),
  pr_body: core.getInput('pr_body'),
  branch_name: core.getInput('branch_name'),
};

async function run() {
  try {

    const SECRET_TOKEN = core.getInput('token');
    const octokit = github.getOctokit(SECRET_TOKEN);
    const context = github.context;

    let ghClient = new ghUtils(context, octokit);

    console.log("ACTION INPUTS:");
    console.log(inputs);
    
    //CALCULATE BRANCH NAME
    if(inputs.branch_name == "")
    inputs.branch_name = inputUtils.createBranchName(inputs.tenant, inputs.application, inputs.environment);
    
    //CREATE BRANCH
    await exec.exec("git config --global user.name github-actions");
    await exec.exec("git config --global user.email github-actions@github.com");
    await exec.exec("git checkout -b " + inputs.branch_name);

    //MODIFY SERVICES IMAGE
    const oldImage = yamlUtils.modifyServicesImage(inputs.tenant, inputs.application, inputs.environment, inputs.services, inputs.image);

    if (oldImage == inputs.image){
      core.info(`Image ${inputs.image} is the same found in /-${inputs.tenant}/${inputs.application}/${inputs.environment}/${inputs.services[0]}.image`);
    } 
    else {
      //PUSH CHANGES TO ORIGIN
      await exec.exec("git add .");
      try{
        await exec.exec('git commit -m "Image values updated"');
      }catch(e){
        console.log("ERROR TRYING TO COMMIT CHANGES!! (nothing to commit?)");
        throw e; 
      }
      await exec.exec("git push origin " + inputs.branch_name);


      //CALCULATE PR VALUES
      if(inputs.pr_title == "")
        inputs.pr_title = `Updated image ${inputs.image} in application: ${inputs.application} - env: ${inputs.environment}`; 
      if(inputs.pr_body == "")
        inputs.pr_body = `Updated image from: ${oldImage} to: ${inputs.image} for the services: ${core.getInput('service_names')}
                          in application: ${inputs.application} at environment: ${inputs.environment}`;

      // DETERMINE AUTOMERGE
      let autoMerge;
      try {
        autoMerge = yamlUtils.determineAutoMerge(inputs.tenant, inputs.application, inputs.environment);
      } catch (e) {
        const errorMsg = 'Problem reading AUTO_MERGE file. Setting automerge to false. ' + e
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
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
