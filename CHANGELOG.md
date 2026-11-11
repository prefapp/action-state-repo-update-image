# Changelog

## [7.0.0](https://github.com/prefapp/action-state-repo-update-image/compare/javascript-action-v6.1.0...javascript-action-v7.0.0) (2026-11-11)


### ⚠ BREAKING CHANGES

* improve auto-merge logic ([#162](https://github.com/prefapp/action-state-repo-update-image/issues/162))
* Single pull request per change to tenant/app/env
* Merge pull request #151 from prefapp/fix/single-pr-for-multiple-tenant-app-env-changes
* Updated node version to node20
* Fixed updating multiple images at once not working if one of those images was already updated
* Updated validation schema so it works with the new input type
* Single pull request per change to tenant/app/env

### feat\

* Single pull request per change to tenant/app/env ([b724fdf](https://github.com/prefapp/action-state-repo-update-image/commit/b724fdfbf5b4b1584358c416395a29fb8b3dc845))


### Features

* Add better error handling [#135](https://github.com/prefapp/action-state-repo-update-image/issues/135) ([b0301f9](https://github.com/prefapp/action-state-repo-update-image/commit/b0301f9ce6ac869a3b6809fee41db6aa94563950))
* Add support for base folder in v4 [#133](https://github.com/prefapp/action-state-repo-update-image/issues/133) ([00839f1](https://github.com/prefapp/action-state-repo-update-image/commit/00839f15cf92c13f16508e26d24678fc6f8847f6))
* Add support for base folder path [#132](https://github.com/prefapp/action-state-repo-update-image/issues/132) ([121c289](https://github.com/prefapp/action-state-repo-update-image/commit/121c2891d0f2dd92f54d0d859efb1ff69a18a7bd))
* Add workflows [#136](https://github.com/prefapp/action-state-repo-update-image/issues/136) ([399bcef](https://github.com/prefapp/action-state-repo-update-image/commit/399bcef23f3a55cee57ba83c1ac1041a4279c0ac))
* added colors to labels ([8316e1e](https://github.com/prefapp/action-state-repo-update-image/commit/8316e1ee158f3e4d0ffd36505d665f919b6542d7))
* Added GraphQL method to check if a label exists ([ba678c6](https://github.com/prefapp/action-state-repo-update-image/commit/ba678c65c2050d34073d2ea3fae4e74392515c61))
* basic structure added ([82f1189](https://github.com/prefapp/action-state-repo-update-image/commit/82f1189775d6944804f1ee1a96d5fc6b39ef9a10))
* Compiled action ([21c80b0](https://github.com/prefapp/action-state-repo-update-image/commit/21c80b08f2437ff66bf0ecd78353f01cccef8c0e))
* Compiled app ([b124d3c](https://github.com/prefapp/action-state-repo-update-image/commit/b124d3cdbee6a5fb11ab053d48dcb0ea716e6135))
* creating and adding labels ([90b9e27](https://github.com/prefapp/action-state-repo-update-image/commit/90b9e27805ae73ae24054d39a0362ed494115b7b))
* first steps towards full idempotency ([9fde104](https://github.com/prefapp/action-state-repo-update-image/commit/9fde1048b095671aeca02014bd5228c1e7acbb8a))
* improve auto-merge logic ([#162](https://github.com/prefapp/action-state-repo-update-image/issues/162)) ([285ded1](https://github.com/prefapp/action-state-repo-update-image/commit/285ded119729938ac588a4aaedddfda05c413e66))
* Merge pull request [#151](https://github.com/prefapp/action-state-repo-update-image/issues/151) from prefapp/fix/single-pr-for-multiple-tenant-app-env-changes ([c68d16c](https://github.com/prefapp/action-state-repo-update-image/commit/c68d16c6f6fee4b82f84757a84e46d471319d097))
* provision CODEOWNERS file ([05a3d39](https://github.com/prefapp/action-state-repo-update-image/commit/05a3d39de06377ac667d1748b098ebdc2a6be073))
* provision CODEOWNERS file ([7a17e1a](https://github.com/prefapp/action-state-repo-update-image/commit/7a17e1a7f243adccdc9a4ae14c01584ce6741e9e))
* provision CODEOWNERS file ([bf26b1a](https://github.com/prefapp/action-state-repo-update-image/commit/bf26b1a682ee710559c0dc250e89935fb19ea818))
* provision CODEOWNERS file ([12ca2a8](https://github.com/prefapp/action-state-repo-update-image/commit/12ca2a83566a66546fc84247463fe2289b6524a5))
* provision CODEOWNERS file ([7618133](https://github.com/prefapp/action-state-repo-update-image/commit/7618133d9996b7f42c144529473ba0987d95f1e4))
* provision CODEOWNERS file ([f43abbd](https://github.com/prefapp/action-state-repo-update-image/commit/f43abbdfe53f7629a6c4378be3eb7a962d4b82a1))
* Single pull request per change to tenant/app/env ([c68d16c](https://github.com/prefapp/action-state-repo-update-image/commit/c68d16c6f6fee4b82f84757a84e46d471319d097))
* update 4 usage node24 ([1b7c43f](https://github.com/prefapp/action-state-repo-update-image/commit/1b7c43fbb1545607f60a40c5d709a8dbb21c65d2))
* update 4 usage node24 ([befc60c](https://github.com/prefapp/action-state-repo-update-image/commit/befc60c2f55c3547f8ff9b2ce714d464b80d67ed))
* updated documentation ([67eb8f6](https://github.com/prefapp/action-state-repo-update-image/commit/67eb8f67ce9e824c25322faaf28f5417489bd7e6))
* Updated node version to node20 ([53058a5](https://github.com/prefapp/action-state-repo-update-image/commit/53058a5f4b4f14107b95f70b924442ec44a19dac))
* Updated validation schema so it works with the new input type ([719645b](https://github.com/prefapp/action-state-repo-update-image/commit/719645bb1983e916a0ab58cc23a6271bde71962d))
* Wait for check runs when auto merging ([#153](https://github.com/prefapp/action-state-repo-update-image/issues/153)) ([014618a](https://github.com/prefapp/action-state-repo-update-image/commit/014618a60af45180fd1b9913470074e8281a1f45))


### Bug Fixes

* Actually improved PR body ([1521994](https://github.com/prefapp/action-state-repo-update-image/commit/1521994ecd462699e550f4bca2843a488f7c4a20))
* Actually improved PR body ([73867af](https://github.com/prefapp/action-state-repo-update-image/commit/73867af678f094e11e6218eeb80270fb36d910f1))
* add dist ([3f0a1eb](https://github.com/prefapp/action-state-repo-update-image/commit/3f0a1ebfde2b50abd0c1149b440d2ace2e16fe8a))
* add schema to dist ([763fdb5](https://github.com/prefapp/action-state-repo-update-image/commit/763fdb53dd1bf29de8ca1eb792d38d09024349d4))
* Add support for base path with AUTO_MERGE [#148](https://github.com/prefapp/action-state-repo-update-image/issues/148) ([2124894](https://github.com/prefapp/action-state-repo-update-image/commit/21248942790692ef27b36309fcaac42edb9e269f))
* await for pr number ([7c1aeba](https://github.com/prefapp/action-state-repo-update-image/commit/7c1aeba78303e7dae2443b200bbf767877dad7c4))
* bad local variable ([beda6e0](https://github.com/prefapp/action-state-repo-update-image/commit/beda6e0d6b7d2608cbaa548a318142ff450b3842))
* better logs ([49bd4d6](https://github.com/prefapp/action-state-repo-update-image/commit/49bd4d6d9aec075b20eb28c535b04aeff349d6f4))
* change array name to images ([d592afa](https://github.com/prefapp/action-state-repo-update-image/commit/d592afab3bb07ee9363de140645ad6f65d318e07))
* change commit msg ([49879ad](https://github.com/prefapp/action-state-repo-update-image/commit/49879adf055f01dc5408a139ad9c76d172d9e843))
* change key ([98d038b](https://github.com/prefapp/action-state-repo-update-image/commit/98d038b213538d7e1bd4055210458d96e63d7954))
* check if the pr already exists ([ebd92c5](https://github.com/prefapp/action-state-repo-update-image/commit/ebd92c5e819e81ef3ce777378125eda3e3bb1ee5))
* clean logs ([1354919](https://github.com/prefapp/action-state-repo-update-image/commit/1354919fbb33582ec6a0c22822b6f396f2f1bbf7))
* Code style improvements ([61fe382](https://github.com/prefapp/action-state-repo-update-image/commit/61fe382c9fa16856e18dbd38c33b052124c70d3c))
* Compiled app ([f19ba4c](https://github.com/prefapp/action-state-repo-update-image/commit/f19ba4c6396fcc6ecb0ac7ab795be724ad91336f))
* correct push command ([5f91a47](https://github.com/prefapp/action-state-repo-update-image/commit/5f91a473fb1d32317fef264258ce373bca600e39))
* corrent invocation of createAndSetLabels ([a7e1fea](https://github.com/prefapp/action-state-repo-update-image/commit/a7e1fea99dbfb5935850b5780dadb1356f51831a))
* debug ([34f9c40](https://github.com/prefapp/action-state-repo-update-image/commit/34f9c40b405f8bb7c6d9282220b88ca91418bb11))
* fetch first ([5aad3c2](https://github.com/prefapp/action-state-repo-update-image/commit/5aad3c2be21eb0dfff69f0fe3284e95ac6661fcd))
* Fixed action trying to create PR when no files where changed ([1a091ed](https://github.com/prefapp/action-state-repo-update-image/commit/1a091ed15c2e8d6cd3da931ae9ed3f7410c8e647))
* Fixed execution error ([c22e94e](https://github.com/prefapp/action-state-repo-update-image/commit/c22e94e29909b92cba6190a7d88e7ea2f1153b4c))
* Fixed execution error and added logs ([f983ce2](https://github.com/prefapp/action-state-repo-update-image/commit/f983ce2b2f5e8e4e428c89c88447da7224f1d868))
* Fixed pagination issue when adding existing labels ([64743ff](https://github.com/prefapp/action-state-repo-update-image/commit/64743ffb61d8e422497f9c9962298fac2c54a959))
* Fixed pagination issue when adding existing labels ([5e62d29](https://github.com/prefapp/action-state-repo-update-image/commit/5e62d29b99e17876c896fb36ca965b70640265b1))
* Fixed tests and linter problems ([e56d81f](https://github.com/prefapp/action-state-repo-update-image/commit/e56d81f30e06af2626768d959ac5dce1416d6f40))
* Fixed updating multiple images at once not working if one of those images was already updated ([c8eba74](https://github.com/prefapp/action-state-repo-update-image/commit/c8eba7495c2b1a3d26fdf2be05094f380b8c0d80))
* git command ([6eb8596](https://github.com/prefapp/action-state-repo-update-image/commit/6eb8596337fe54c5c198ba6945ff16154cc7cdcf))
* improve outputs ([7a0112d](https://github.com/prefapp/action-state-repo-update-image/commit/7a0112dd7f31e489dcac314d325f37921e064df7))
* Improved PR body ([0bf2cd4](https://github.com/prefapp/action-state-repo-update-image/commit/0bf2cd4c35d1fd5decfedcde22e08756c3f56c70))
* Merge pull request [#142](https://github.com/prefapp/action-state-repo-update-image/issues/142) from prefapp/fix/labels-query-per-page-value ([64743ff](https://github.com/prefapp/action-state-repo-update-image/commit/64743ffb61d8e422497f9c9962298fac2c54a959))
* Merge pull request [#144](https://github.com/prefapp/action-state-repo-update-image/issues/144) from prefapp/fix/unused-parameter ([f4edc80](https://github.com/prefapp/action-state-repo-update-image/commit/f4edc806d5f89fcb2f7e80c743877f247e3b6207))
* obtain good keys from input ([90587c2](https://github.com/prefapp/action-state-repo-update-image/commit/90587c28cf497f42aa2e8fc8b8bb025cde2a2d3d))
* only one service per PR now ([1d88ff0](https://github.com/prefapp/action-state-repo-update-image/commit/1d88ff0049f1e22e56e2028c1e476c2b6b56c08b))
* PR message ([121f163](https://github.com/prefapp/action-state-repo-update-image/commit/121f16370be7b7693b3714b3331af7c1d94a1171))
* pull request update ([#139](https://github.com/prefapp/action-state-repo-update-image/issues/139)) ([666d61a](https://github.com/prefapp/action-state-repo-update-image/commit/666d61a8435e47e9f985600817064fe255f4f4d8))
* remove old files ([1003822](https://github.com/prefapp/action-state-repo-update-image/commit/1003822c77b838c096cd44d16a299d0b20bb520f))
* remove parent key ([4f50d1d](https://github.com/prefapp/action-state-repo-update-image/commit/4f50d1d881359e37808c9c941027955afe223bb9))
* Removed unupdated services from PR body ([651e94c](https://github.com/prefapp/action-state-repo-update-image/commit/651e94c6f59a66ee802c6d9b97a0b4f31264966c))
* Removed unupdated services from PR body ([66d785c](https://github.com/prefapp/action-state-repo-update-image/commit/66d785c5c49bb099639af66f3f7bfe1b39013a9e))
* Removed unused parameter added to PullRequestBuilder ([5cd592b](https://github.com/prefapp/action-state-repo-update-image/commit/5cd592b751ed5e341e097334d47c65afb147515c))
* rename inputs ([599377d](https://github.com/prefapp/action-state-repo-update-image/commit/599377d9b68c18fba669c11e8dde935df46c6813))
* rename vars and refactor ([e8509cb](https://github.com/prefapp/action-state-repo-update-image/commit/e8509cb028c8e1f9b03f6cff35de7c70eebc5225))
* repository caller coordinate ([#155](https://github.com/prefapp/action-state-repo-update-image/issues/155)) ([8d0c2dc](https://github.com/prefapp/action-state-repo-update-image/commit/8d0c2dc6840369b8588e69bd0edc47508d9753d6))
* require json in runtime ([88df43f](https://github.com/prefapp/action-state-repo-update-image/commit/88df43f0ab45bfb851d15d48740ba8a40cf8b6f6))
* revisit log ([06409ac](https://github.com/prefapp/action-state-repo-update-image/commit/06409acc0691766c64e6b4b10343508a6f43a85c))
* revisited log ([c8ac3f2](https://github.com/prefapp/action-state-repo-update-image/commit/c8ac3f2852abb4810f0efd33d12bfea96d9cd637))
* revisited logs ([8a85c48](https://github.com/prefapp/action-state-repo-update-image/commit/8a85c4837b180af6b7e2c9a00a17d5ee223bead9))
* schema require ([9672dde](https://github.com/prefapp/action-state-repo-update-image/commit/9672dded5e825040960906cf10d5a07be56c1afa))
* setPRLabels named ([9e373f8](https://github.com/prefapp/action-state-repo-update-image/commit/9e373f8322c8f57f74a2fba36861ea1641bc4a84))
* stash working ([afdd472](https://github.com/prefapp/action-state-repo-update-image/commit/afdd4723ae32880481d4ca178306a15b0232efe0))
* Unused parameter ([f4edc80](https://github.com/prefapp/action-state-repo-update-image/commit/f4edc806d5f89fcb2f7e80c743877f247e3b6207))
* Updated documentation ([6c38124](https://github.com/prefapp/action-state-repo-update-image/commit/6c38124bed7e893271e8c2cb03d2942339a02c25))
* Updated logs ([1dc355f](https://github.com/prefapp/action-state-repo-update-image/commit/1dc355f5d54e209247cc9e38ffc370cccf99fccd))
* Updated node version ([7bf366d](https://github.com/prefapp/action-state-repo-update-image/commit/7bf366d04299e8d18e5a75c483b6f29e7463d5fe))
* Updated node version ([89b81c7](https://github.com/prefapp/action-state-repo-update-image/commit/89b81c7f23752d5c61a923020bc63a686de20490))
* Updated PR body ([f332e81](https://github.com/prefapp/action-state-repo-update-image/commit/f332e816498faefd578ed8a740a372c6ea9d9697))
* use branch if exists ([da07710](https://github.com/prefapp/action-state-repo-update-image/commit/da077104762fecfeda782a6f1e6eefe4ebab8218))
* use branch if exists ([438a9a8](https://github.com/prefapp/action-state-repo-update-image/commit/438a9a8e53d369bebdacf3eb084d4d36455ceb45))
* use default branch ([#124](https://github.com/prefapp/action-state-repo-update-image/issues/124)) ([768d1c2](https://github.com/prefapp/action-state-repo-update-image/commit/768d1c28096a4931cd46e445d69ba72c31a86d83))
* use default registry ([422241f](https://github.com/prefapp/action-state-repo-update-image/commit/422241fc7c616498ef834d9efa0bd06a5e6a9602))
* use force push ([96beee5](https://github.com/prefapp/action-state-repo-update-image/commit/96beee5d1a86ed00a8e946432932cd228728cd3b))
* use require ([08da829](https://github.com/prefapp/action-state-repo-update-image/commit/08da8290c78814f3b17ee3f912ab9d4c1be94e5f))
* validate with json schema ([8998530](https://github.com/prefapp/action-state-repo-update-image/commit/89985305c768a464931995b2ff7fcf4a7003abb4))
* validate with json schema ([bf5500a](https://github.com/prefapp/action-state-repo-update-image/commit/bf5500a90df491e64e8e4bb5fdf802b74a2f4b9d))

## [6.1.0](https://github.com/prefapp/action-state-repo-update-image/compare/v6.0.0...v6.1.0) (2026-07-14)


### Features

* update 4 usage node24 ([1b7c43f](https://github.com/prefapp/action-state-repo-update-image/commit/1b7c43fbb1545607f60a40c5d709a8dbb21c65d2))

## [6.0.0](https://github.com/prefapp/action-state-repo-update-image/compare/v5.1.1...v6.0.0) (2026-06-26)


### ⚠ BREAKING CHANGES

* improve auto-merge logic ([#162](https://github.com/prefapp/action-state-repo-update-image/issues/162))

### Features

* improve auto-merge logic ([#162](https://github.com/prefapp/action-state-repo-update-image/issues/162)) ([285ded1](https://github.com/prefapp/action-state-repo-update-image/commit/285ded119729938ac588a4aaedddfda05c413e66))


### Bug Fixes

* Updated node version ([7bf366d](https://github.com/prefapp/action-state-repo-update-image/commit/7bf366d04299e8d18e5a75c483b6f29e7463d5fe))
* Updated node version ([89b81c7](https://github.com/prefapp/action-state-repo-update-image/commit/89b81c7f23752d5c61a923020bc63a686de20490))

## [5.1.1](https://github.com/prefapp/action-state-repo-update-image/compare/v5.1.0...v5.1.1) (2024-11-21)


### Bug Fixes

* repository caller coordinate ([#155](https://github.com/prefapp/action-state-repo-update-image/issues/155)) ([8d0c2dc](https://github.com/prefapp/action-state-repo-update-image/commit/8d0c2dc6840369b8588e69bd0edc47508d9753d6))

## [5.1.0](https://github.com/prefapp/action-state-repo-update-image/compare/v5.0.0...v5.1.0) (2024-10-31)


### Features

* Wait for check runs when auto merging ([#153](https://github.com/prefapp/action-state-repo-update-image/issues/153)) ([014618a](https://github.com/prefapp/action-state-repo-update-image/commit/014618a60af45180fd1b9913470074e8281a1f45))

## [5.0.0](https://github.com/prefapp/action-state-repo-update-image/compare/v4.4.2...v5.0.0) (2024-10-29)


### ⚠ BREAKING CHANGES

* Single pull request per change to tenant/app/env
* Merge pull request #151 from prefapp/fix/single-pr-for-multiple-tenant-app-env-changes
* Updated node version to node20
* Fixed updating multiple images at once not working if one of those images was already updated
* Updated validation schema so it works with the new input type
* Single pull request per change to tenant/app/env

### feat\

* Single pull request per change to tenant/app/env ([b724fdf](https://github.com/prefapp/action-state-repo-update-image/commit/b724fdfbf5b4b1584358c416395a29fb8b3dc845))


### Features

* Compiled action ([21c80b0](https://github.com/prefapp/action-state-repo-update-image/commit/21c80b08f2437ff66bf0ecd78353f01cccef8c0e))
* Merge pull request [#151](https://github.com/prefapp/action-state-repo-update-image/issues/151) from prefapp/fix/single-pr-for-multiple-tenant-app-env-changes ([c68d16c](https://github.com/prefapp/action-state-repo-update-image/commit/c68d16c6f6fee4b82f84757a84e46d471319d097))
* Single pull request per change to tenant/app/env ([c68d16c](https://github.com/prefapp/action-state-repo-update-image/commit/c68d16c6f6fee4b82f84757a84e46d471319d097))
* Updated node version to node20 ([53058a5](https://github.com/prefapp/action-state-repo-update-image/commit/53058a5f4b4f14107b95f70b924442ec44a19dac))
* Updated validation schema so it works with the new input type ([719645b](https://github.com/prefapp/action-state-repo-update-image/commit/719645bb1983e916a0ab58cc23a6271bde71962d))


### Bug Fixes

* Actually improved PR body ([1521994](https://github.com/prefapp/action-state-repo-update-image/commit/1521994ecd462699e550f4bca2843a488f7c4a20))
* Actually improved PR body ([73867af](https://github.com/prefapp/action-state-repo-update-image/commit/73867af678f094e11e6218eeb80270fb36d910f1))
* Code style improvements ([61fe382](https://github.com/prefapp/action-state-repo-update-image/commit/61fe382c9fa16856e18dbd38c33b052124c70d3c))
* Fixed action trying to create PR when no files where changed ([1a091ed](https://github.com/prefapp/action-state-repo-update-image/commit/1a091ed15c2e8d6cd3da931ae9ed3f7410c8e647))
* Fixed tests and linter problems ([e56d81f](https://github.com/prefapp/action-state-repo-update-image/commit/e56d81f30e06af2626768d959ac5dce1416d6f40))
* Fixed updating multiple images at once not working if one of those images was already updated ([c8eba74](https://github.com/prefapp/action-state-repo-update-image/commit/c8eba7495c2b1a3d26fdf2be05094f380b8c0d80))
* Improved PR body ([0bf2cd4](https://github.com/prefapp/action-state-repo-update-image/commit/0bf2cd4c35d1fd5decfedcde22e08756c3f56c70))
* Removed unupdated services from PR body ([651e94c](https://github.com/prefapp/action-state-repo-update-image/commit/651e94c6f59a66ee802c6d9b97a0b4f31264966c))
* Removed unupdated services from PR body ([66d785c](https://github.com/prefapp/action-state-repo-update-image/commit/66d785c5c49bb099639af66f3f7bfe1b39013a9e))
* Updated documentation ([6c38124](https://github.com/prefapp/action-state-repo-update-image/commit/6c38124bed7e893271e8c2cb03d2942339a02c25))
* Updated logs ([1dc355f](https://github.com/prefapp/action-state-repo-update-image/commit/1dc355f5d54e209247cc9e38ffc370cccf99fccd))
* Updated PR body ([f332e81](https://github.com/prefapp/action-state-repo-update-image/commit/f332e816498faefd578ed8a740a372c6ea9d9697))

## [4.4.2](https://github.com/prefapp/action-state-repo-update-image/compare/v4.4.1...v4.4.2) (2024-10-08)


### Bug Fixes

* Add support for base path with AUTO_MERGE [#148](https://github.com/prefapp/action-state-repo-update-image/issues/148) ([2124894](https://github.com/prefapp/action-state-repo-update-image/commit/21248942790692ef27b36309fcaac42edb9e269f))

## [4.4.1](https://github.com/prefapp/action-state-repo-update-image/compare/v4.4.0...v4.4.1) (2024-10-04)


### Bug Fixes

* Compiled app ([f19ba4c](https://github.com/prefapp/action-state-repo-update-image/commit/f19ba4c6396fcc6ecb0ac7ab795be724ad91336f))
* Merge pull request [#144](https://github.com/prefapp/action-state-repo-update-image/issues/144) from prefapp/fix/unused-parameter ([f4edc80](https://github.com/prefapp/action-state-repo-update-image/commit/f4edc806d5f89fcb2f7e80c743877f247e3b6207))
* Removed unused parameter added to PullRequestBuilder ([5cd592b](https://github.com/prefapp/action-state-repo-update-image/commit/5cd592b751ed5e341e097334d47c65afb147515c))
* Unused parameter ([f4edc80](https://github.com/prefapp/action-state-repo-update-image/commit/f4edc806d5f89fcb2f7e80c743877f247e3b6207))

## [4.4.0](https://github.com/prefapp/action-state-repo-update-image/compare/v4.3.1...v4.4.0) (2024-10-04)


### Features

* Added GraphQL method to check if a label exists ([ba678c6](https://github.com/prefapp/action-state-repo-update-image/commit/ba678c65c2050d34073d2ea3fae4e74392515c61))
* Compiled app ([b124d3c](https://github.com/prefapp/action-state-repo-update-image/commit/b124d3cdbee6a5fb11ab053d48dcb0ea716e6135))


### Bug Fixes

* Fixed execution error ([c22e94e](https://github.com/prefapp/action-state-repo-update-image/commit/c22e94e29909b92cba6190a7d88e7ea2f1153b4c))
* Fixed execution error and added logs ([f983ce2](https://github.com/prefapp/action-state-repo-update-image/commit/f983ce2b2f5e8e4e428c89c88447da7224f1d868))
* Fixed pagination issue when adding existing labels ([64743ff](https://github.com/prefapp/action-state-repo-update-image/commit/64743ffb61d8e422497f9c9962298fac2c54a959))
* Fixed pagination issue when adding existing labels ([5e62d29](https://github.com/prefapp/action-state-repo-update-image/commit/5e62d29b99e17876c896fb36ca965b70640265b1))
* Merge pull request [#142](https://github.com/prefapp/action-state-repo-update-image/issues/142) from prefapp/fix/labels-query-per-page-value ([64743ff](https://github.com/prefapp/action-state-repo-update-image/commit/64743ffb61d8e422497f9c9962298fac2c54a959))

## [4.3.1](https://github.com/prefapp/action-state-repo-update-image/compare/v4.3.0...v4.3.1) (2024-07-10)


### Bug Fixes

* pull request update ([#139](https://github.com/prefapp/action-state-repo-update-image/issues/139)) ([666d61a](https://github.com/prefapp/action-state-repo-update-image/commit/666d61a8435e47e9f985600817064fe255f4f4d8))

## [4.3.0](https://github.com/prefapp/action-state-repo-update-image/compare/v4.2.0...v4.3.0) (2024-06-20)


### Features

* Add workflows [#136](https://github.com/prefapp/action-state-repo-update-image/issues/136) ([399bcef](https://github.com/prefapp/action-state-repo-update-image/commit/399bcef23f3a55cee57ba83c1ac1041a4279c0ac))
