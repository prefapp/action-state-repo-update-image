const PullRequestBuilder = require('../model/PullRequestBuilder.js')

test('Test constructor', async () => {
  const prInputs = {
    tenant: 'tenant',
    baseFolder: 'basefolder',
    application: 'application',
    environment: 'environment',
    serviceNameList: ['service'],
    newImage: 'newImage',
    reviewers: 'reviewers'
  }
  expect(new PullRequestBuilder(prInputs, 'master'))
    .toEqual({
      "application": "application",
      "branchName": "automated/update-image-tenant-application-environment",
      "baseFolder": "basefolder",
      "environment": "environment",
      "newImage": "newImage",
      "reviewers": "reviewers",
      "serviceNameList": ["service"],
      "sourceBranch": "master",
      "tenant": "tenant",
    });
});
