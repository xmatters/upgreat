# upgreat

**upgreat** is a CLI for a painless way to upgrade your package dependencies!

**upgreat** helps you upgrade the dependencies of your project. Have it plan and execute upgrades for you, making sure they don't cause any issues. It will run tests (or build), attempt an upgrade for a package, then run the tests/build again to verify.

upgreat is smart:

- **it will roll back failed upgrades**: upgrading everything it can without breaking tests and builds
- **it knows about devDependencies**: it will run builds instead of tests
- **it understands peerDependencies**: it will attempt the least intrusive upgrades first, and warn you of missing ones

It can plan based on:

- package type: `dependencies|devDependencies`
- include regex
- exclude regex

_only supports yarn currently, npm support on the way_

## usage

You can use this package directly via `npx`, or install it globally.

Move to the folder of your package and create an upgrade plan with

```
upgreat plan
```

or

```
npx upgreat plan
```

the plan will be created in the `.upgreat/` directory. Then, you can execute the upgrades with

```
upgreat up
```

or

```
npx upgreat up
```

Sit back and watch it do it's thing. Any upgrades that cause failures will be rolled back. `.upgreat/` directory will contain the dependency that failed with `stderr` info.

## roadmap / todo

- support for npm
- configurable test/build scripts
- html upgrade report with changelogs

## related

[Greenkeeper](https://greenkeeper.io), [Dependabot](https://dependabot.com/) and [Renovate](https://renovatebot.com/) address similar problems, but either need tight GitHub integration or are not free. Do you need to make sure all your dependencies are up to date, or merge PRs all day for `@babel/plugin-proposal-logical-assignment-operators 7.0.0 -> 7.0.2` from bots? If the former, give upgreat a try!
