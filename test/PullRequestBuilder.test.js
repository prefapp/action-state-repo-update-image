const PullRequestBuilder = require('../model/PullRequestBuilder.js')

test('Test constructor', async () => {
  const prInputs = {
    tenant: 'tenant',
    application: 'application',
    environment: 'environment',
    service: 'service',
    newImage: 'newImage',
    reviewers: 'reviewers'
  }
  expect(new PullRequestBuilder(prInputs, 'master'))
    .toEqual({
      "application": "application",
      "branchName": "automated/update-image-tenant-application-environment-service",
      "environment": "environment",
      "newImage": "newImage",
      "reviewers": "reviewers",
      "service": "service",
      "sourceBranch": "master",
      "tenant": "tenant",
    });
});
