# dataset/ — the data restricted.cp0x.com shows

This folder holds exactly the data the site shows, and nothing else: no catalog sources, no checks, no evidence. Use it
when you need the same numbers as [restricted.cp0x.com/monitor](https://restricted.cp0x.com/monitor) (a bot, an MCP
server, another site).

| Path | What it is |
|---|---|
| `current/monitor.json` | the dashboard: `meta` + one row per interface (statuses, country lists, rating, restriction count, per country the probe verdict) |
| `current/interfaces/<id>.json` | one interface's whole record: the catalog entry, the computed fields and every latest verified probe observation |
| `current/VERSION.json` | the data date (`version` = `meta.generated`), when it was published and the previous version |
| `archive/<from>_<to>/` | earlier versions with the same files: "from" is the data date, "to" is when a newer version replaced it |

Stable URLs:

- `https://raw.githubusercontent.com/cp0x-org/pi-restricted-interfaces/main/dataset/current/monitor.json`
- `https://raw.githubusercontent.com/cp0x-org/pi-restricted-interfaces/main/dataset/current/interfaces/<id>.json`
- the site serves the same files with CORS open: `https://restricted.cp0x.com/monitor.json`, `https://restricted.cp0x.com/<id>.json`

`meta.schema_version` names the shape of `monitor.json`; it is raised when the fields change.

The files are byte copies of `src/data/monitor.json` and `src/data/interfaces/`, written by
`monitor/scripts/publish.py` (`pnpm monitor:publish`), which `pnpm monitor:update` runs as its last step. Never edit
them by hand: the source of truth is `monitor/data/`, see [`monitor/docs/updating.md`](../monitor/docs/updating.md).
How every number is checked is in [`research/`](../research/README.md); the full record of each version (checks,
evidence, changes) is in `monitor/current/` and `monitor/archive/`.
