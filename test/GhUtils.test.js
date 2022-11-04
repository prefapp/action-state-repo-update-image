const ghUtils = require('../utils/GhUtils.js');


// Mocks
const context = {
  payload: {
    repository: {
      default_branch: "rama_default",
      name: "repo_name",
      owner: {
        login: "login_dueño"
      }
    }
  }
}

let octokit = {
  rest: {
    pulls: {
      create: jest.fn().mockResolvedValue({data: {number: 42}}),
      requestReviewers: jest.fn().mockResolvedValue("reviewers added"),
      merge: jest.fn().mockResolvedValue("merged"),
    }
  }
}


test('ghUtils prCreate constructor', () => {
  let ghClient = new ghUtils(context, "octokit");
  expect(ghClient.octokit).toBe("octokit");
  expect(ghClient.context).toMatchObject(context);
  expect(ghClient.repoDefaultBranch).toBe("rama_default");
  expect(ghClient.repoName).toBe("repo_name");
  expect(ghClient.repoOwner).toBe("login_dueño");

});


test('ghUtils prCreate', async () => {
  let ghClient = new ghUtils(context, octokit);
  const prNumber = await ghClient.createPr("feature/new-image", "pr title", "pr body");
  expect(prNumber).toBe(42);
  expect(octokit.rest.pulls.create).toHaveBeenCalledWith(
    expect.objectContaining({
                              owner: "login_dueño",
                              repo: "repo_name",
                              base: "rama_default",
                              head: "feature/new-image",
                              title: "pr title",
                              body: "pr body"
                            })
  ,);
});

test('ghUtils prAddReviewers', async () => {
  let ghClient = new ghUtils(context, octokit);
  const ghResponse = await ghClient.prAddReviewers(314, ["rev1", "rev2"]);
  expect(ghResponse).toBe("reviewers added");
  expect(octokit.rest.pulls.requestReviewers).toHaveBeenCalledWith(
    expect.objectContaining({
                              owner: "login_dueño",
                              repo: "repo_name",
                              pull_number: 314,
                              reviewers: ["rev1", "rev2"]
                            })
  ,);
});

test('ghUtils mergePr', async () => {
  let ghClient = new ghUtils(context, octokit);
  const ghResponse = await ghClient.mergePr(666);
  expect(ghResponse).toBe("merged");
  expect(octokit.rest.pulls.merge).toHaveBeenCalledWith(
    expect.objectContaining({
                              owner: "login_dueño",
                              repo: "repo_name",
                              pull_number: 666,
                            })
  ,);
});
