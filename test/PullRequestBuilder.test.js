const PullRequestBuilder = require('../model/PullRequestBuilder.js')

const baseInputs = {
  tenant: 'tenant',
  baseFolder: 'basefolder',
  application: 'application',
  environment: 'environment',
  serviceNameList: ['service'],
  newImage: 'newImage',
  reviewers: 'reviewers',
  repositoryCaller: 'repositoryCaller',
  timeout: 50,
  retryInterval: 0,
}

test('Test constructor', async () => {
  expect(new PullRequestBuilder(baseInputs, 'master'))
    .toEqual({
      "application": "application",
      "branchName": "automated/update-image-tenant-application-environment-repositoryCaller",
      "baseFolder": "basefolder",
      "checkNames": undefined,
      "environment": "environment",
      "newImage": "newImage",
      "reviewers": "reviewers",
      "retryInterval": 0,
      "serviceNameList": ["service"],
      "sourceBranch": "master",
      "tenant": "tenant",
      "timeout": 50,
    });
});

test('canMerge returns true when PR mergeable state is clean', async () => {
  const prBuilder = new PullRequestBuilder(baseInputs, 'master')
  const client = {
    repoOwner: 'owner',
    repoName: 'repo',
    octokit: {
      rest: {
        pulls: {
          get: jest.fn().mockResolvedValue({ data: { mergeable: true, mergeable_state: 'clean' } })
        }
      }
    }
  }

  await expect(prBuilder.canMerge(client, 42)).resolves.toBe(true)
  expect(client.octokit.rest.pulls.get).toHaveBeenCalledWith(
    expect.objectContaining({
      owner: 'owner',
      repo: 'repo',
      pull_number: 42,
    })
  )
})

test('canMerge returns false when PR mergeable state is not mergeable', async () => {
  const prBuilder = new PullRequestBuilder(baseInputs, 'master')
  const client = {
    repoOwner: 'owner',
    repoName: 'repo',
    octokit: {
      rest: {
        pulls: {
          get: jest.fn().mockResolvedValue({ data: { mergeable: false, mergeable_state: 'blocked' } })
        }
      }
    }
  }

  await expect(prBuilder.canMerge(client, 42)).resolves.toBe(false)
})

test('tryToMerge passes prNumber to canMerge and merges when allowed', async () => {
  const prBuilder = new PullRequestBuilder(baseInputs, 'master')
  const ghClient = {
    mergePr: jest.fn().mockResolvedValue(undefined)
  }
  const yamlUtils = {
    determineAutoMerge: jest.fn().mockReturnValue(true)
  }
  prBuilder.canMerge = jest.fn().mockResolvedValue(true)

  await expect(prBuilder.tryToMerge(ghClient, yamlUtils, 77)).resolves.toBe(true)
  expect(prBuilder.canMerge).toHaveBeenCalledWith(ghClient, 77)
  expect(ghClient.mergePr).toHaveBeenCalledWith(77)
})
