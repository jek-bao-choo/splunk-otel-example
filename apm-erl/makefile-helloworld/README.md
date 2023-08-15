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

