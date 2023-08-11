-module(hello_handler).
-behaviour(cowboy_handler).
-export([init/2]).

-include_lib("opentelemetry_api/include/otel_tracer.hrl").

init(Req, State) ->
    hello(),
    {ok, cowboy_req:reply(200, #{}, <<"Hello, Jek!">>, Req), State}.

hello() ->
    %% start an active span and run a local function
    ?with_span(<<"operation">>, #{}, fun nice_operation/1).

nice_operation(_SpanCtx) ->
    ?add_event(<<"Nice operation!">>, [{<<"bogons">>, 100}]),
    ?set_attributes([{another_key, <<"yes">>}]),

    %% start an active span and run an anonymous function
    ?with_span(<<"Sub operation...">>, #{},
                fun(_ChildSpanCtx) ->
                      ?set_attributes([{lemons_key, <<"five">>}]),
                      ?add_event(<<"Sub span event!">>, [])
                end).