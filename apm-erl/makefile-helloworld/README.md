# Setup

Install Make on macOS https://erlang.mk/guide/installation.html#_on_unix


- Also make sure git and erlang are available too. Follow the helloworld guide in the root folder of /apm-erl

```
brew install make
```

Sure! Here's a simple Erlang "Hello World" program with a `Makefile` instead of `rebar`.

1. First, create the Erlang module `hello.erl`:

**hello.erl**
```erlang
-module(hello).
-export([world/0]).

world() ->
    io:format("Hello, World!~n").
```

2. Now, create the `Makefile`:

**Makefile**
```make
ERLC=erlc
ERL=erl
EFLAGS=-W

all: compile

compile: hello.beam

hello.beam: hello.erl
	$(ERLC) $(EFLAGS) hello.erl

run: compile
	$(ERL) -noshell -s hello world -s init stop

clean:
	rm -rf *.beam
```

3. Use the commands:

To compile the module:
```bash
make
```

To run the hello world function:
```bash
make run
```

To clean compiled files:
```bash
make clean
```

This example provides a basic structure. As the project grows, you may want to adjust the `Makefile` accordingly. Note that this is a simple example; real-world projects may involve more complex structures and dependencies.

# Hello World Cowboy Web App

### Step 1: Project structure

Create a project with this folder structure:

```
hello_world/
|-- src/
|   |-- hello_world_app.erl
|   |-- hello_world_sup.erl
|   |-- toppage_h.erl
|-- Makefile
|-- erlang.mk
|-- relx.config
```

### Step 2: Code

**toppage_h.erl** (inside `src` directory)

```erlang
-module(toppage_h).

-export([init/2]).

init(Req0, Opts) ->
	Req = cowboy_req:reply(200, #{
		<<"content-type">> => <<"text/plain">>
	}, <<"Hello Jek this is Makefile hello world app v1!">>, Req0),
	{ok, Req, Opts}.
```

**hello_world_app.erl** (inside `src` directory)

```erlang
%% @private
-module(hello_world_app).
-behaviour(application).

%% API.
-export([start/2]).
-export([stop/1]).

%% API.

start(_Type, _Args) ->
	Dispatch = cowboy_router:compile([
		{'_', [
			{"/", toppage_h, []}
		]}
	]),
	{ok, _} = cowboy:start_clear(http, [{port, 8080}], #{
		env => #{dispatch => Dispatch}
	}),
	hello_world_sup:start_link().

stop(_State) ->
	ok = cowboy:stop_listener(http).
```

**hello_world_sup.erl** (inside `src` directory)

```erlang
%% @private
-module(hello_world_sup).
-behaviour(supervisor).

%% API.
-export([start_link/0]).

%% supervisor.
-export([init/1]).

%% API.

-spec start_link() -> {ok, pid()}.
start_link() ->
	supervisor:start_link({local, ?MODULE}, ?MODULE, []).

%% supervisor.

init([]) ->
	Procs = [],
	{ok, {{one_for_one, 10, 10}, Procs}}.
```

### Step 3: Makefile

```make
PROJECT = hello_world
PROJECT_DESCRIPTION = Cowboy Hello World example
PROJECT_VERSION = 1

DEPS = cowboy
dep_cowboy_commit = master

REL_DEPS = relx

include ./erlang.mk
```

The correct way to get erlang.mk is from https://erlang.mk/guide/getting_started.html
Alternatively, get erlang.mk from https://github.com/ninenines/cowboy and put it in the root folder of the project.

### Step 4: Instructions

To try this example, you need GNU make (version 4; ensure not version 3 or lower) and git in your PATH.

To build and run the example, use the following command:

```bash
make run
```

Then point your browser to http://localhost:8080

This hello_world example app is referencing https://github.com/ninenines/cowboy/tree/master/examples

# Add OTel Erlang to the project
- Specify the OTel Erlang Dependency in Your Project's Makefile: In the Makefile of the project where you want to add the dependency, specify the dependency using the DEPS variable and the corresponding git URL and version or branch:

```
DEPS = cowboy my_dependency
dep_cowboy_commit = 2.9.0
dep_my_dependency = git https://github.com/user/my_dependency master
```

- Fetching and Building: With erlang.mk, you can fetch and build your dependencies using:
```
make deps

make run
```

... But... apparently it's not that easy. I tried to add the following to the Makefile but it didn't work.
... opentelemetry-erlang library needs to support Makefile build. Otherwise run into the following noop issue in the dependency build Makefile with noop.

# Ref
- https://github.com/ninenines/cowboy/tree/master/examples