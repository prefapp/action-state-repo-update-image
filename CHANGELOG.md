# Changelog

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
