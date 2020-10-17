# Papyrus
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ymonb1291/papyrus/CI?label=ci)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/ymonb1291/papyrus?include_prereleases)
![GitHub commits since latest release (by SemVer)](https://img.shields.io/github/commits-since/ymonb1291/papyrus/latest?sort=semver)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ymonb1291/papyrus)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/papyrus/mod.ts)
![GitHub](https://img.shields.io/github/license/ymonb1291/papyrus)

Lightweight, modular JSON logger for `Deno` with support for external formatter and transports.

## Features
* 5 logging levels: `trace`, `debug`, `info`, `warn` and `error`
* `Debug` features
* All logs output as `JSON` strings
* Decorate your logs with `bindings`
* Create `child loggers` inherit their parent's bindings and settings
* Support for external `formatters` and `transports`

# How to use
Basic usage:
```
import Papyrus from "https://deno.land/x/papyrus/mod.ts";

const logger = new Papyrus({
  useLabels: true,
});

logger.trace("Hello World!");
logger.debug("Hello World!");
logger.info("Hello World!");
logger.warn("Hello World!");
logger.error("Hello World!");

// Outputs:
//   {"level":"trace","time":1589371200000,"message":"Hello World!"}
//   {"level":"debug","time":1589371200000,"message":"Hello World!"}
//   {"level":"info","time":1589371200000,"message":"Hello World!"}
//   {"level":"warn","time":1589371200000,"message":"Hello World!"}
//   {"level":"error","time":1589371200000,"message":"Hello World!"}
```
Using child loggers
```
import Papyrus from "https://deno.land/x/papyrus/mod.ts";

const parent = new Papyrus({
  bindings: {pid: Deno.pid},
  name: "parentLogger",
  useLabels: true,
});

parent.info("Hello from parent!");

const child = parent.child({
  bindings: {host: "127.0.0.1"},
  name: "childLogger"
});

child.info("Hello from child!");
// Outputs:
//   {"level":"info","name":"parentLogger","time":1589371200000,"pid":6210,"message":"Hello from parent!"}
//   {"level":"info","name":"childLogger","time":1589371200000,"pid":6210,"host":"127.0.0.1","message":"Hello from child!"}
```

# Table of contents

- [How to use](#how-to-use)
- [Table of contents](#table-of-contents)
- [Creating a logger](#creating-a-logger)
- [Logging with bindings](#logging-with-bindings)
- [Child loggers](#child-loggers)
- [Options](#options)
  - [PapyrusOptions](#p#apyrusoptions)
  - [ChildOptions](##childoptions)
  - [TransportOptions](##transportoptions)
- [Logging](#logging)
  - [Level enum](##level-enum)
  - [Log methods and debug features](##log-methods-and-debug-features)
  - [Logging with payload](##logging-with-payload)
- [Output](#output)
  - [Route of a log](##route-of-a-log)
  - [Interfaces of a log](##interfaces-of-a-log)
- [Formatter](#formatter)
  - [What's a formatter?](##what's-a-formatter?)
  - [How to create a formatter?](##how-to-create-a-formatter?)
- [Transport](#Transport)
  - [What's a transport?](##what's-a-transport?)
  - [How to create a transport?](##how-to-create-a-transport)
- [Plugins](#plugins)
- [Contributions](#contributions)

# Creating a logger
Import Papyrus from [Deno.land](https://deno.land/x):
```
import Papyrus from "https://deno.land/x/papyrus/mod.ts";
// Or
import { Papyrus } from "https://deno.land/x/papyrus/mod.ts";
```

### Nameless logger with default options
A nameless logger will be created with the default options:
```
const logger = new Papyrus();
```
### Named logger with default options
A named logger will be created with the default options:
```
const logger = new Papyrus("myLogger");
```
### Customized logger
An object of type `PapyrusOptions` can be used to specify options:
```
const logger = new Papyrus({
  // options...
});
```

### Logging with bindings
Bindings are properties that are *bound* to the logger. In other therms, any log output by the logger will contain it's bindings. Bindings are typically found before the log's message.
```
const logger = new Papyrus({
  bindings: {pid: Deno.pid}
});

logger.info("Hello World!");

// Outputs:
//   {"level":2,"time":1589371200000,"pid":3876,"message":"Hello World!"}
```
If the `mergeBindings` property is false, all bindings will be grouped in a plain object under the `bindings` property.
```
const logger = new Papyrus({
  bindings: {pid: Deno.pid},
  mergeBindings: false
});

logger.info("Hello World!");

// Outputs:
//   {"level":2,"time":1589371200000,"bindings":{"pid":4309},"message":"Hello World!"}
```

### Child loggers
Child loggers can be created from a `Papyrus` logger by calling the `child` method. The `child` method requires options of type `ChildOptions` that contains at least a name property.
A child logger inherits of all of its parent's bindings.
```
const logger = new Papyrus({
  bindings: {pid: Deno.pid}
}).child({
    bindings: {host: "127.0.0.1"},
    name: "myChildLogger"
  });

logger.info("Hello World!");

// Outputs:
//   {"level":2,"name":"childLogger","time":1589371200000,"pid":4022,"host":"127.0.0.1","message":"Hello World!"}
```

# Options

## PapyrusOptions
`Papyrus` can be configured through an object that implements the interface `PapyrusOptions`. All properties are optional.
```
interface PapyrusOptions {
  bindings?: KeyValuePair;
  destination?: DestinationOptions | DestinationOptions[];
  enabled?: boolean;
  formatter?: Formatter;
  level?: Level | keyof typeof Level;
  mergeBindings?: boolean;
  mergePayload?: boolean;
  name?: string;
  time?: boolean;
  useLabels?: boolean;
}
```

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`bindings` | KeyValuePair | { } | Object that contains the bindings
`enabled` | boolean | true | Disables the logger and its children when true
`formatter` | Formatter | undefined | Defines a `Formatter` to use
`level` | string \| number | "trace" | Sets the min. level to a key of `Level`
`mergeBindings` | boolean | true | The bindings will be merged with `Log` if true
`mergePayload` | boolean | true | The payload will be merged with `Log` if true
`name` | string | undefined | The logs will include this name, which must be unique
`time` | boolean | true | The logs will not include the time when false
`transport` | TransportOptions \| TransportOptions[ ] | [ ] | Defines a `Transport`, or an array or `Transport` to use
`useLabels` | boolean | false | The logs will be output with a numeric level when false

## ChildOptions
A `ChildOptions` configuration object must be provided when creating a child logger.
```
interface ChildOptions {
  bindings?: KeyValuePair;
  name: string;
}
```

## TransportOptions
A `TransportOptions` configuration object is used when specifying a `Transport`.
```
interface TransportOptions {
  use?: Transport;
  formatter?: Formatter;
}
```
Property | Type | Default | Description
-------- | ---- | ------- | -----------
use | Transport | undefined | Defines a `Transport` to use
formatter | Formatter | undefined | Defines a `Formatter` to use

# Logging
## Level enum
All levels are defined in a numeric enum.
```
enum Level {
  trace,     // Value: 0
  debug,     // Value: 1
  info,      // Value: 2
  warn,      // Value: 3
  error,     // Value: 4
}
```
## Log methods and debug features
Instances of `Papyrus` have five logging methods that one can use, each specific to a level. The methods are `trace`, `debug`, `info`, `warn` and `error`.
```
const logger = new Papyrus();

logger.trace("Level is trace");
logger.debug("Level is debug");
logger.info("Level is info");
logger.warn("Level is warn");
logger.error("Level is error");

// Outputs:
//   {"level":0,"time":1589371200000,"message":"Level is trace"}
//   {"level":1,"time":1589371200000,"message":"Level is debug"}
//   {"level":2,"time":1589371200000,"message":"Level is info"}
//   {"level":3,"time":1589371200000,"message":"Level is warn"}
//   {"level":4,"time":1589371200000,"message":"Level is error"}
```
It's possible to configure your logger so that it doesn't output logs below a given level. Let's repeat the example of above with the level set to `warn`.
```
const logger = new Papyrus({level: Level.warn});

logger.trace("Level is trace");
logger.debug("Level is debug");
logger.info("Level is info");
logger.warn("Level is warn");
logger.error("Level is error");

// Outputs:
//   {"level":3,"time":1589371200000,"message":"Level is warn"}
//   {"level":4,"time":1589371200000,"message":"Level is error"}
```
Only the logs with a level of `warn` or above were output.
Note that we imported the level directly from the enum in this example. The configurations `{level: "warn"}` and `{level: 3}` would have given the same result.

## Logging with payload
A payload is like bindings, except that it's log-specific. A payload is typically found after the log's message.
```
const logger = new Papyrus();

logger.info("Hello World!", {a: "A"});

// Outputs:
//   {"level":2,"time":1589371200000,"message":"Hello World!","a":"A"}
```
If the `mergePayload` property is false, all properties from the payload will be grouped in a plain object under the `payload` property.
```
const logger = new Papyrus({mergePayload: false});

logger.info("Hello World!", {a: "A"});

// Outputs:
//   {"level":2,"time":1589371200000,"message":"Hello World!","payload":{"a":"A"}}
```

# Output

## Route of a log
Internally, `Papyrus` logs are defined as plain objects implementing `Log`. The log is then sent to the formatter, which may return the log as a modified `Log` object or as a JSON string. At this point, any log which is not already a string will be stringified using the `JSON.stringify()` function. The string is finally sent to the transport(s) which will consume the log.

`Papyrus` supports several transports, and each can have their own formatter.

## Interfaces of a log
A log is transmitted to a formatter or a transport as an object implementing the `Log` interface, which is a generic interface for any type of log, or as a JSON string representing this object. In formatters and transports, it can be interesting to differentiate messages from errors. Which is why `Papyrus` is exporting the interfaces `LogWithMessage` and `LogWithError`.

All logs contain a `level` property.
```
interface Log {
  level: number | string;
  name?: string;
  time?: number | string;
  bindings?: KeyValuePair;
  message?: string | number | boolean;
  error?: {
    message: string;
    name: string;
    stack?: string;
  };
  payload?: KeyValuePair;
}

interface LogWithMessage {
  level: number | string;
  name?: string;
  time?: number | string;
  bindings?: KeyValuePair;
  message?: string | number | boolean;
  payload?: KeyValuePair;
}

interface LogWithError {
  level: number | string;
  name?: string;
  time?: number | string;
  bindings?: KeyValuePair;
  error: {
    message: string;
    name: string;
    stack?: string;
  }
  payload?: KeyValuePair;
}
```

# Formatter
## What's a formatter?
A formatter is a class that implements the `Formatter` interface. It can modify an object of type `Log`, or convert it into a string. There are two kind of formatters:
* **Editors:** These formatters will alter, add or delete properties of `Log`. In principle, they should always return a object that implements `Log`, or a JSON representation of such object.
* **Prettifiers:** These formatters will convert `Log` to a string formatted to be easier to read than a JSON string.
```
interface Formatter {
  format: (data: string | Log, _v: number) => string | Log;
}
```
The `_v` property represents the version of the `Log` interface and will always be the same value for a given version of `Papyrus`. is hidden and defines the version of the `Log` interface. Should the `Log` interface be updated in the future, the value of `_v` will be incremented. For now, it is always `1`.

## How to create a formatter?
Here is an example of a formatter that returns the log it receives as a `Log`:
```
class IdentityFormatter implements Formatter {
  public format(log: Log | string): Log {
    if(typeof log === "string") return JSON.parse(log);
    else return log;
  }
}
```

# Transport
## What's a transport?
A transport is a class that implements the `Transport` interface. It's the final destination of the log. For example, it can:
* Send the log to the console
* Write the log into a file
* Save the log in a database
```
interface Transport {
  log: (data: string, _v: number) => void;
}
```

## How to create a Transport?
Here is an example of a transport sends the log to the console as a string:
```
class ConsoleTransport implements Transport {
  public log(log: Log |string): void {
    if(typeof log === "string") console.log(log);
    else JSON.stringify(log);
  }
}
```

# Plugins
* [Papyrus-File](https://github.com/ymonb1291/papyrus-file): A transport for writing into files
* [Papyrus-Pretty](https://github.com/ymonb1291/papyrus-pretty): A formatter that prettifies your logs

# Contributions
PRs are welcome!