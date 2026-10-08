# Contributing

Thank you for your interest in contributing to the Permissionless Interface Boilerplate!

# Development

Before running anything, you'll need to install the dependencies:

```
pnpm install
```

## Running the interface locally

```
pnpm start
```

The interface should automatically open. If it does not, navigate to [http://localhost:3000].

## Creating a production build

```
pnpm build
```

To serve the production build:

```
pnpm preview
```

Then, navigate to [http://localhost:4173] to see it.


## Guidelines

The following points should help guide your development:

- Security: the interface is safe to use
  - Avoid adding unnecessary dependencies due to [supply chain risk](https://github.com/LavaMoat/lavamoat#further-reading-on-software-supplychain-security)
- Reproducibility: anyone can build the interface
  - Avoid adding steps to the development/build processes
  - The build must be deterministic, i.e. a particular commit hash always produces the same build
- Decentralization: anyone can run the interface

## Data changes

The catalog is data, not code. To add or correct an interface:

1. Edit `monitor/data/interfaces.json`. Keep every claim backed by an entry in `evidence` (a repository-relative path, a URL, or `owner/repo: path`). Country lists use ISO 3166-1 alpha-2 codes or region tokens such as `UA-Crimea`; see `monitor/README.md` for the schema.
2. Run `pnpm monitor:build`. It fails on schema errors and regenerates `src/data/interfaces.json`, `monitor/out/report.md` and `monitor/out/interfaces.csv`. Commit the generated files together with the data change.
3. Run `pnpm build` to make sure the site still compiles.

Python ≥ 3.9 (standard library only) is required for `pnpm monitor:*` scripts. It is a maintainer tool and is not part of `pnpm build`, so the deterministic-build guarantee above is unaffected.
