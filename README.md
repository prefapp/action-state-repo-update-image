# Update image and generate pull request based on state repo config - Prefapp JavaScript Action

<p align="center">
  <a href="https://github.com/actions/javascript-action/actions"><img alt="javscript-action status" src="https://github.com/actions/javascript-action/workflows/units-test/badge.svg"></a>
</p>


This action updates image values stored in the state repo. It then creates a pull request and adds reviewers.
Looking for the `AUTO_MERGE` in the environment directory, it determines if the PR should be automerged or not.
> v2 uses config.yaml, v3 does not. Differences explained below.

## Usage

There are now 2 versions of the action: `action-state-repo-update-image@feature/v2` and `action-state-repo-update-image@feature/v3`. The purpose is the same but the state repo structure and inputs required differ a lot.

### @feature/v2 - No tenants and use of config.yaml

Version 2 of the action requires to be run in a state repo that follows this structure:
```
state_repo_name
├── app1
│   ├── des
│   │   └── images.yaml
│   ├── pre
│   │   └── images.yaml
│   └── pro
│       └── images.yaml
├── app2
│   ├── dev
│   │   └── images.yaml
│   ├── pre
│   │   └── images.yaml
│   └── pro
│       └── images.yaml
└── config.yaml

```

Note that environment names can be modified as long as they are expressed in the `config.yaml`. The `config.yaml` defines the repo structure and indicates wether image modifications can be automerged or not:

```
# config.yaml
app1:
  auto_merge:
    des: true
    pre: true
    pro: false
  services:
    - app-server
    - app-client
    - app-api

app2:
  auto_merge:
    dev: true
    pre: true
    pro: false
  services:
    - proxy
    - dns

```

You can consume this action by referencing the branch `feature/v2`

```yaml
steps:
  - uses: actions/checkout@v2  #NECESSARY
  - name: Update image  
      uses: prefapp/action-state-repo-update-image@feature/v2
      with:
        application: appfoo
        environment: dev
        services: app-server, app-client # comma separated values, only 1 is needed
        image: image:new
        reviewers: juana, suhermana #OPTIONAL comma separated values, only 1 is needed
        pr_title: PR title #OPTIONAL (not recomended) 
        pr_body: PR body #OPTIONAL (not recomended) 
        branch_name: automated/update-image #OPTIONAL
```

### @feature/v3 - Use of tenants, AUTO_MERGE and no config.yaml

In the new version of the action, the applications must belong to a tenant and the automerge is defined
by the inclusion of an `AUTO_MERGE` file in the desired environment. The structure of the repo is all the action needs, the config.yaml is deprecated!

State repo structure required:
```
state_repo_name
├── tenant1
│   ├── release1
│   │   ├── dev
│   │   │   ├── AUTO_MERGE
│   │   │   └── images.yaml
│   │   ├── pre
│   │   │   ├── AUTO_MERGE
│   │   │   └── images.yaml
│   │   └── pro
│   │       └── images.yaml
│   └── release2
│       ├── dev
│       │   ├── AUTO_MERGE
│       │   └── images.yaml
│       ├── pre
│       │   └── images.yaml
│       └── pro
│           └── images.yaml
└── tenant2
    ├── releaseA
    │   ├── dev
    │   │   ├── AUTO_MERGE
    │   │   └── images.yaml
    │   ├── pre
    │   │   ├── AUTO_MERGE
    │   │   └── images.yaml
    │   └── pro
    │       └── images.yaml
    └── releaseB
        ├── dev
        │   ├── AUTO_MERGE
        │   └── images.yaml
        ├── pre
        │   └── images.yaml
        └── pro
            └── images.yaml
```


You can consume this action by referencing the branch `feature/v3`. Careful, **inputs have changed**:
> Remember that inputs in a github action must always be strings.

```yaml
steps:
  - uses: actions/checkout@v2  #NECESSARY
  - name: Update image  
      uses: prefapp/action-state-repo-update-image@feature/v3
      with:
        tenant: tenant_name
        application: app1
        environment: dev
        service_names: '["api", "client"]' # string! example: ${{ toJSON(github.event.client_payload.service_names) }}
        image: image:new
        reviewers: '["juana", "suhermana"]' #OPTIONAL again JSON array
        pr_title: PR title #OPTIONAL (not recomended) 
        pr_body: PR body #OPTIONAL (not recomended) 
        branch_name: automated/update-image #OPTIONAL
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
