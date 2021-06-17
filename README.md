# Update image and generate pull request based on state repo config - Prefapp JavaScript Action

<p align="center">
  <a href="https://github.com/actions/javascript-action/actions"><img alt="javscript-action status" src="https://github.com/actions/javascript-action/workflows/units-test/badge.svg"></a>
</p>

This action updates image values un the state repo. It then creates a pull request and adds reviewers.
Reading the state_repo/config.yaml, determines if the PR should be automerged or not.

This project includes tests, linting, a validation workflow, publishing, and versioning guidance.


## Code in Main

Install the dependencies

```bash
npm install
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)
...
```

## Change action.yml

The action.yml defines the inputs and output for your action.

It includes the name, description, inputs and outputs for the action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
const core = require('@actions/core');
...

async function run() {
  try {
      ...
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

## Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the dist folder.

Run prepare

```bash
npm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)


## Usage DEPRECATED

You can now consume the action by referencing the v0 branch

```yaml
steps:
  - name: Get repo context
    id: gh
    uses: prefapp/action-state-repo-generate-pr@v0
    with:
      target_branch: ${{ github.event.inputs.branch }}
      secret_token: ${{ secrets.GITHUB_TOKEN }}
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:


## Documentation

- See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

- Template used for this action: [hello-world-javascript-action] (https://github.com/actions/hello-world-javascript-action)

- If you are new, there's also a simpler introduction.  See the [Hello World JavaScript Action](https://github.com/actions/hello-world-javascript-action)

### Create a release branch

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
git checkout -b v1
git commit -a -m "v1 release"
```

```bash
git push origin v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:
