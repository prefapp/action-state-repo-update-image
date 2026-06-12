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
  graphql: jest.fn()
    .mockResolvedValueOnce({ repository: { autoMergeAllowed: true } })
    .mockResolvedValue({ repository: { pullRequest: { id: "PR_node_id" } } }),
  rest: {
    pulls: {
      create: jest.fn().mockResolvedValue({data: {number: 42}}),
      requestReviewers: jest.fn().mockResolvedValue("reviewers added"),
      merge: jest.fn().mockResolvedValue("merged"),
      update: jest.fn().mockResolvedValue("updated")
    }
  }
}

beforeEach(() => {
  jest.clearAllMocks();
  octokit.graphql.mockReset();
  octokit.graphql.mockResolvedValue({ repository: { autoMergeAllowed: true } });
  octokit.rest.pulls.create.mockResolvedValue({ data: { number: 42 } });
  octokit.rest.pulls.requestReviewers.mockResolvedValue("reviewers added");
  octokit.rest.pulls.merge.mockResolvedValue("merged");
  octokit.rest.pulls.update.mockResolvedValue("updated");
});


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

test('ghUtils prUpdate', async () => {
  let ghClient = new ghUtils(context, octokit);
  const ghResponse = await ghClient.updatePr(666, "pr title", "pr body");
  expect(ghResponse).toBe("updated");
  expect(octokit.rest.pulls.update).toHaveBeenCalledWith(
    expect.objectContaining({
                              owner: "login_dueño",
                              repo: "repo_name",
                              pull_number: 666,
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

test('ghUtils repoHasAutoMergeEnabled', async () => {
  let ghClient = new ghUtils(context, octokit);
  const ghResponse = await ghClient.repoHasAutoMergeEnabled();
  expect(ghResponse).toBe(true);
  expect(octokit.graphql).toHaveBeenCalledWith(
    `query($owner: String!, $repoName: String!) {
      repository(owner: $owner, name: $repoName) {
        autoMergeAllowed
      }
    }`,
    expect.objectContaining({
      owner: "login_dueño",
      repoName: "repo_name"
    })
  );
});

test('ghUtils enableAutoMerge', async () => {
  octokit.graphql
    .mockResolvedValueOnce({ repository: { pullRequest: { id: "PR_node_id" } } })
    .mockResolvedValueOnce({ enablePullRequestAutoMerge: { pullRequest: { number: 666 } } });

  let ghClient = new ghUtils(context, octokit);
  const ghResponse = await ghClient.enableAutoMerge(666);
  expect(ghResponse).toMatchObject({ enablePullRequestAutoMerge: { pullRequest: { number: 666 } } });
  expect(octokit.graphql).toHaveBeenNthCalledWith(
    1,
    `query($owner: String!, $repoName: String!, $prNumber: Int!) {
      repository(owner: $owner, name: $repoName) {
        pullRequest(number: $prNumber) {
          id
        }
      }
    }`,
    expect.objectContaining({
      owner: "login_dueño",
      repoName: "repo_name",
      prNumber: 666
    })
  );
  expect(octokit.graphql).toHaveBeenNthCalledWith(
    2,
    `mutation($pullRequestId: ID!) {
      enablePullRequestAutoMerge(input: { pullRequestId: $pullRequestId }) {
        pullRequest {
          number
        }
      }
    }`,
    expect.objectContaining({
      pullRequestId: "PR_node_id"
    })
  );
});
