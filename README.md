# Papyrus
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ymonb1291/papyrus/CI?label=CI)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/ymonb1291/papyrus?include_prereleases)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ymonb1291/papyrus)
![GitHub](https://img.shields.io/github/license/ymonb1291/papyrus)

**Papyrus** is a JSON logger for **Deno** that supports child loggers and external pluggins for formatting and consuming logs.

# Import
Import the latest release.
```
// As named import
import { Papyrus } from "https://deno.land/x/papyrus/mod.ts";

// Or as default import
import Papyrus from "https://deno.land/x/papyrus/mod.ts";
```

# Basic usage
This is the easiest way to use **Papyrus**.
```
const logger = new Papyrus({
  level: "info",
  useLabels: true,
});

logger.info("Hello World!");

// Output:
// {"level":"info","time":1602366662755,"message":"Hello World!"}
```

# More coming...
This module is still in development. More documentation coming soon!

# Contributions
PRs are welcome!