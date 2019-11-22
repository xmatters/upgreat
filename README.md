# upgreat

[![Maintainability](https://api.codeclimate.com/v1/badges/88d9129f5f50280233cf/maintainability)](https://codeclimate.com/github/xmatters/upgreat/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/88d9129f5f50280233cf/test_coverage)](https://codeclimate.com/github/xmatters/upgreat/test_coverage)
[![Build Status](https://travis-ci.org/xmatters/upgreat.svg?branch=master)](https://travis-ci.org/xmatters/upgreat)

**upgreat** is a CLI for a painless way to upgrade your package dependencies!

**upgreat** helps you upgrade the dependencies of your project. Have it plan and execute upgrades for you, making sure they don't cause any issues. It will run tests (or builds), attempt an upgrade for a package, then run the tests/build again to verify.

upgreat is smart:

- **it will roll back failed upgrades**: upgrading everything it can without breaking tests and builds
- **it knows about devDependencies**: it will run builds instead of tests
- **it understands peerDependencies**: it will attempt the least intrusive upgrades first, and warn you of missing ones
- **it supports yarn and npm**

It can plan based on:

- package type: `dependencies|devDependencies`
- include regex
- exclude regex

It can upgrade with:

- yarn or npm
- using test and build scripts defined in your `package.json`

## usage

You can use this package directly via `npx`, or install it globally (`npm install @xmatters/upgreat -g`).

```
> upgreat help
USAGE
  $ upgreat [COMMAND]

COMMANDS
  help  display help for upgreat
  plan  create the upgrade plan for the package
  up    execute the upgrade plan
```

First, create an upgrade plan via the `plan` command. This will create a file `.upgreat/plan.json` with the details and order of upgrade for each package.

```
> upgreat plan help
create the upgrade plan for the package

USAGE
  $ upgreat plan

OPTIONS
  -i, --include=include                           include packages by regex
  -p, --packageType=dependencies|devDependencies  choose specific package types
  -x, --exclude=exclude                           exclude packages by regex
```

Then, execute the upgrade plan via the `up` command. This will read `.upgreat/plan.json` and start upgrading packages and testing/building.

```
> upgreat up help
execute the upgrade plan

USAGE
  $ upgreat up

OPTIONS
  -b, --buildScript=buildScript  [default: build] build script to use from
                                 package.json

  -t, --testScript=testScript    [default: test] test script to use from package.json

  --npm                          use npm
```

You can pass `-b` or `--buildScript` to define which script in your `package.json` gets run after upgrading a `devDependency`. By default this is `build` so **upgreat** will use `yarn build` or `npm run build`.

Similarly, `-t` or `--testScript` defines the test script in `package.json` to run after upgrading a `dependency`. By default this is `test` so **upgreat** will use `yarn test` or `npm run test`.

You can customize both for your purposes: `npx @xmatters/upgreat up --npm -b build:prod -t test:ci` will use `npm` and use `build:prod` script for `devDependencies` and `test:ci` script for `dependencies`.

Sit back and watch it do it's thing. Any upgrades that cause failures will be rolled back. `.upgreat/` directory will contain any dependencies that failed with `stderr` info in separate files.

## usage example

Move to the folder of your package and create an upgrade plan

```
cd my-project
upgreat plan

# or

npx @xmatters/upgreat plan
```

then,

```
upgreat up

# or

npx @xmatters/upgreat up
```

if you were using npm, and your test script was called `testTheProjectPls` you would invoke it as

```
upgreat up --npm -t testTheProjectPls
```

## roadmap / todo

- html upgrade report with changelogs

## related

[Greenkeeper](https://greenkeeper.io), [Dependabot](https://dependabot.com/) and [Renovate](https://renovatebot.com/) address similar problems, but either need tight GitHub integration or are not free. Do you need to make sure all your dependencies are up to date, or merge PRs all day for `@babel/plugin-proposal-logical-assignment-operators 7.0.0 -> 7.0.2` from bots? If the former, give upgreat a try!
