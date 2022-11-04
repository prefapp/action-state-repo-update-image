# Update image and generate pull request based on state repo config - Prefapp JavaScript Action

<p align="center">
  <a href="https://github.com/actions/javascript-action/actions"><img alt="javscript-action status" src="https://github.com/actions/javascript-action/workflows/units-test/badge.svg"></a>
</p>


The `prefapp/action-state-repo-update-image` action updates docker image values stored in the state repo. It creates a pull request for each image update, adds the corresponding reviewers as well as custom labels indidating the update coordinates. 
Each image update will result in an automated PR like:

<img src="./assets/example.png" alt="automated_pr" width="800"/><br><br>


Its execution is idempotent: you can ran the action many times and only those new images will be updated via PR. The action reuses the remote branch if it already exists by making a force push (to ensure the PR has only one commit) If the PR already exists, it updates it instead of trying to create a new one.

Looking for the `AUTO_MERGE` in the environment directory, it determines if the PR should be automerged or not.


## Usage

There are now 3 versions of the action. The purpose is the same but the state repo structure and inputs required differ a lot. 

Latest version is `v4`. Please check [OLD_VERSIONS.md](./OLD_VERSIONS.md) if you are looking for instructions on v2 or v3.

### State repo
In this version of the action, all applications MUST belong to tenants and the automerge is defined by the inclusion of an `AUTO_MERGE` markert file in the desired environment. The structure of the repo is all the action needs to figure out how to update the images.

The action requires to be run in a state repo that follows this structure:
```
state_repo_name
├── tenant1
│   ├── release1
│   │   ├── dev
│   │   │   ├── AUTO_MERGE
│   │   │   └── images.yaml
│   │   ├── pre
│   │   │   ├── AUTO_MERGE
│   │   │   └── images.yaml
│   │   └── pro
│   │       └── images.yaml
│   └── release2
│       ├── dev
│       │   ├── AUTO_MERGE
│       │   └── images.yaml
│       ├── pre
│       │   └── images.yaml
│       └── pro
│           └── images.yaml
└── tenant2
    ├── releaseA
    │   ├── dev
    │   │   ├── AUTO_MERGE
    │   │   └── images.yaml
    │   ├── pre
    │   │   ├── AUTO_MERGE
    │   │   └── images.yaml
    │   └── pro
    │       └── images.yaml
    └── releaseB
        ├── dev
        │   ├── AUTO_MERGE
        │   └── images.yaml
        ├── pre
        │   └── images.yaml
        └── pro
            └── images.yaml
```


### Action inputs

You can consume this action by referencing the branch `v4`.
The action must receive a json object with a structure that complies with the [schema](./schemas/state_repo_update_image_schema.json)

Here is an example:
```yaml
# Workflow running in the state repo

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - uses: prefapp/action-state-repo-update-image@v4
        env:
          input_json: |
            {
              "version": 4,
              "images": [
                {
                  "tenant": "tenant1",
                  "app": "release1",
                  "env": "dev",
                  "service_name": "proxy",
                  "image": "image_proxy:tag",
                  "reviewers": ["GH-User1"]
                },
                {
                  "tenant": "tenant1",
                  "app": "release1",
                  "env": "pre",
                  "service_name": "dns",
                  "image": "image_dns:tag",
                  "reviewers": ["GH-User2"]
                }
              ]
            }
        with:
          input_matrix: ${{ env.input_json }}
```



# Developer instructions

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

## action.yml

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
