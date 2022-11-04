const inputUtils = require('../utils/IOUtils');

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
