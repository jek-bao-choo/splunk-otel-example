-module(hello_handler).
-behaviour(cowboy_handler).
-export([init/2]).

-include_lib("opentelemetry_api/include/otel_tracer.hrl").

init(Req, State) ->
    hello(),
    {ok, cowboy_req:reply(200, #{}, <<"Hello, Jek!">>, Req), State}.

hello() ->
    %% start an active span and run a local function
    ?with_span(<<"Jek My Main Span hello() Operation Value">>, #{}, fun mynice_operation/1).

mynice_operation(_SpanCtx) ->
    ?add_event(<<"My Span Event 1 Without Key so this is the value">>, [{<<"My Span Event 2 Key and 100 is the value">>, 100}]),
    ?set_attributes([{my_span_tag_key_1, <<"My Span Tag Value 1">>}]),
    ?set_attributes([{my_span_attribute_key_2, <<"My Span Attribute Value 2">>}]),

    %% start an active span and run an anonymous function
    ?with_span(<<"Jek My Sub Span mynice_operation() Operation Value...">>, #{},
                fun(_ChildSpanCtx) ->
                      timer:sleep(500),
                      ?set_attributes([{my_sub_span_tag_key_1, <<"my sub tag tag valuE 1">>}]),
                      ?add_event(<<"Jek My Sub Span Event Value!">>, []),
                      ok % to indicate that the anonymous function is done
                end).