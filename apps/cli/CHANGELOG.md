# Changelog

## 1.1.0

### Added

- `scaffold` command (also the default command) with non-interactive flags:
  `--git`, `--pm`, `--force`, and `--yes`.
- `--json` output for `list` and `search`.
- Support for GitHub/GitLab tree URLs that point at a subdirectory.
- Automatic recovery when the local registry is corrupt (the bad file is
  backed up and a clear warning is printed).
- Sync now preserves locally added templates under `@local`.
- Release workflow, package metadata, and LICENSE file for npm.

### Fixed

- `scaffoldor` with no arguments now prints help instead of failing with a
  missing argument error.
- `--version` now reads the version from `package.json`.
- Invalid templates can no longer corrupt the local registry.
- Author filters work with both registry usernames and GitHub handles.
- Package manager switching now removes the correct lockfile and handles
  `bun.lock` as well as `bun.lockb`.
- Failed clones clean up temporary directories and do not leave partial
  projects behind.
- Non-interactive runs no longer hang on prompts.
- Tree/subdirectory template URLs are supported instead of being passed to
  `git clone` unchanged.
- Scaffolding into an existing empty directory works; `--force` is required
  for non-empty directories.
