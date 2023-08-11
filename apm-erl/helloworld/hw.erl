-module(hw).

%% API
-export([helloworld/0, hellomyworld/1]).

helloworld() ->
  "Hello world".

hellomyworld(X) ->
  "Hello " ++ X ++ " world".