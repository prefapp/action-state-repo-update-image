const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');
const ghUtils = require('./utils/ghUtils');
const yamlUtils = require('./utils/yamlUtils');
const inputUtils = require('./utils/inputUtils');
// most @actions toolkit packages have async methods



async function run() {
  try {
    const ghClient = new ghUtils(github.context, github.getOctokit(core.getInput('token')));
    const input_matrix = JSON.parse(core.getInput('input_matrix'));

    core.info(JSON.stringify(input_matrix))
    
    // TODO: validate input matrix against json schema
    //       HEY, THIS IS IMPORTANT !!!!

    await exec.exec("git config --global user.name github-actions");
    await exec.exec("git config --global user.email github-actions@github.com");

    //CALCULATE BRANCH NAME
    for (const inputs of input_matrix.matrix) {
      const branchName = inputUtils.createBranchName(inputs.tenant, inputs.application, inputs.environment);
    
      //CREATE BRANCH
      await exec.exec("git stash");
      await exec.exec("git checkout main");
      await exec.exec("git reset --hard origin/main");
      await exec.exec("git checkout -b " + branchName);
  
      //MODIFY SERVICES IMAGE
      const oldImages = yamlUtils.modifyServicesImage(inputs.tenant, inputs.application, inputs.environment, inputs.services, inputs.image);
  
      if (oldImages.length === 0){
        core.info(`Image is the same found in all services!!!`);
        core.info(`Skipping PR for ${inputs.tenant}/${inputs.application}/${inputs.environment} - services: ${JSON.stringify(inputs.services)} `)
        break
      } 
  
      //PUSH CHANGES TO ORIGIN
      await exec.exec("git add .");
      try{
        await exec.exec('git commit -m "feat: Image values updated"');
      }catch(e){
        console.log(`ERROR TRYING TO COMMIT CHANGES!! inputs: ${JSON.stringify(input_matrix)}. Error: ${e}`);
        break
      }
      await exec.exec("git push origin " + inputs.branch_name);
  
      const prTitle = `Updated image ${inputs.image} for tenant: ${inputs.tenant} in application: ${inputs.application} and env: ${inputs.environment}`; 
      const prBody = `Updated image from: ${oldImages[0]} to: ${inputs.image} in services: ${core.getInput('service_names')}
                          for tenant: ${inputs.tenant} in application: ${inputs.application} at environment: ${inputs.environment}`;
  
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
      const prNumber = await ghClient.createPr(inputs.branch_name, prTitle, prBody)
      core.info('Created PR number: ' + prNumber);
      
  
      //ADD REVIEWERS
      if(inputs.reviewers.length > 0){
        try {
          await ghClient.prAddReviewers(prNumber, inputs.reviewers);
          core.info('Added reviewers: ' + inputs.reviewers);
        } catch (e) {
          const errorMsg = 'Error adding reviewers: ' + e;
          core.info(errorMsg);
        }
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
