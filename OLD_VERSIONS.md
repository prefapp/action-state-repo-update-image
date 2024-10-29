# Documentation regarding deprecated versions

There are now 3 versions of the action: 
  - `action-state-repo-update-image@feature/v2`
  - `action-state-repo-update-image@feature/v3`
  - `action-state-repo-update-image@v3`
 
 The purpose is the same but the state repo structure and inputs required differ a lot.
 This file covers the usage and requirements of versions **v2** and **v3**

## @feature/v2 - No tenants and use of config.yaml
Version 2 of the action requires to be run in a state repo that follows this structure:
```
state_repo_name
├── app1
│   ├── des
│   │   └── images.yaml
│   ├── pre
│   │   └── images.yaml
│   └── pro
│       └── images.yaml
├── app2
│   ├── dev
│   │   └── images.yaml
│   ├── pre
│   │   └── images.yaml
│   └── pro
│       └── images.yaml
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

## @feature/v3 - Idempotence, use of tenants, AUTO_MERGE and no config.yaml

In this version of the action, the applications must belong to a tenant and the automerge is defined
by the inclusion of an `AUTO_MERGE` file in the desired environment. The structure of the repo is all the action needs, the config.yaml is deprecated!

Also, due to the expected external usage, this action is now idempotent. If you try to update an image with the same name and tag it had before nothing will happen: no PR, no commit, just a termination message.

State repo structure required:
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

## v4 - Single service per PR

You can consume this action by referencing the branch `v4`. The only difference between this version and `v5` is the `service_name_list` input: in `v4`, the input is called `service_name` and only a single service per call is supported (so it's a string instead of a list of strings)
