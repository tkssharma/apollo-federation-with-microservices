# ATLAS FRACTIONAL

Lerna monorepo that holds common platform code

## Getting Started

Install dependencies

```
npm ci
npm run bootstrap
```

Build

```
npm run build
```

Tests

```
npm test
```
## Lerna

Full list of commands

```
lerna add <pkg> [globs..]  Add a single dependency to matched packages
lerna bootstrap            Link local packages together and install remaining package dependencies
lerna changed              List local packages that have changed since the last tagged release [aliases: updated]
lerna clean                Remove the node_modules directory from all packages
lerna create <name> [loc]  Create a new lerna-managed package
lerna diff [pkgName]       Diff all packages or a single package since the last release
lerna exec [cmd] [args..]  Execute an arbitrary command in each package
lerna import <dir>         Import a package into the monorepo with commit history
lerna init                 Create a new Lerna repo or upgrade an existing repo to the current version of Lerna.
lerna link                 Symlink together all packages that are dependencies of each other
lerna list                 List local packages [aliases: ls, la, ll]
lerna publish [bump]       Publish packages in the current project.
lerna run <script>         Run an npm script in each package that contains that script
lerna version [bump]       Bump version of packages changed since the last release.
```

## Reference

- [Lerna versioning](https://github.com/lerna/lerna/blob/main/commands/version/README.md)
- [Lerna bootstrap command](https://github.com/lerna/lerna/tree/main/commands/bootstrap#readme)
- [Issue. Lerna bootstrap does not install all dependencies](https://github.com/lerna/lerna/issues/1457)
- [Issue. bootstrap removes node_modules from root (during hoist)](https://github.com/lerna/lerna/issues/2361)
- [Blog. Multi-Package Repos with Lerna](https://www.christopherbiscardi.com/post/multi-package-repos-with-lerna)