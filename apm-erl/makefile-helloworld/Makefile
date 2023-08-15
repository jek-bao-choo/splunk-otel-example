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
