const inputUtils = require('../utils/inputUtils');


test('reviewers to array', async () => {
  let reviewers = inputUtils.commaStringToArray("Rev1, Rev2");
  expect(reviewers).toStrictEqual(["Rev1", "Rev2"]);
  
});

test('reviewers length', async () => {
  expect(inputUtils.commaStringToArray(" Rev1, Rev2")).toHaveLength(2);
  expect(inputUtils.commaStringToArray(" Rev1 , Rev2 ")).toHaveLength(2);
  expect(inputUtils.commaStringToArray("Rev1, ")).toHaveLength(1);
  expect(inputUtils.commaStringToArray("Rev1 ")).toHaveLength(1);
  expect(inputUtils.commaStringToArray(" Rev1 ")).toHaveLength(1);
  expect(inputUtils.commaStringToArray(" Rev1 ")).toStrictEqual(["Rev1"]);
  expect(inputUtils.commaStringToArray("  ")).toHaveLength(0);
}); 



test('createBranchName correct', () => {
  const name1 = inputUtils.createBranchName("app", "env");
  expect(name1).toStrictEqual(expect.stringContaining("automated/update-image-app-env"));
});