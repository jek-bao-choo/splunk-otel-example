
# Setup has two options A & B
## Option A: Setup Directly via Homebrew (easy)
- Following this https://www.udemy.com/course/completeerlang/
- At time of setup OS is MacOS
- https://formulae.brew.sh/formula/erlang `brew install erlang@22`
    - `echo 'export PATH="/usr/local/opt/erlang@22/bin:$PATH"' >> ~/.zshrc`
        - The Erlang SDK should be located in /usr/local/opt/erlang@22 as of time of installation of Erlang
    - `export LDFLAGS="-L/usr/local/opt/erlang@22/lib"`
    - `erl`
    - To quit: 1> `q().`
- https://stackoverflow.com/questions/9560815/how-to-get-erlangs-release-version-number-from-a-shell 

```erl -eval '{ok, Version} = file:read_file(filename:join([code:root_dir(), "releases", erlang:system_info(otp_release), "OTP_VERSION"])), io:fwrite(Version), halt().' -noshell```

- Erlang version is 22.3.4.26

## Option B: Setup With Version Manager called Kerl via Homebrew (more complex)
- Install Erlang Version Manager https://github.com/kerl/kerl `brew install kerl`
- `kerl list releases`
- Pick your choice. Note that named builds allow you to have different builds for the same Erlang/OTP release with different configure options: `kerl build 22.3.4.26 jekBuild22.3.4.26on10Aug2023v1`
- `kerl list builds`
- `kerl install jekBuild22.3.4.26on10Aug2023v1 ~/kerl/jekBuild22dot3dot4dot26on10Aug2023v1`
- `kerl list installations`
- `. /Users/jchoo/kerl/jekBuild22dot3dot4dot26on10Aug2023v1/activate`
    - This setup is stuck to the terminal I am currently in as the export PATH is not permanent. If missing in `echo $PATH`
    - Re run the immediate above
    - Then run `echo $PATH`
- `kerl status`

# Firing it up
- `erl`
- The shell suggests ^G, Ctrl-G, which will bring you to a mysterious (for now) user switch command. (Ctrl-C will bring you to a menu.) The simplest way to quit, allowing everything that might be running in the shell to exit normally, is `q().`:
```
1> q().
ok
```
# Hello World (Real Simple)
- Create a file named hello.erl with the following content:
```
-module(hello).
-export([world/0]).

world() ->
    io:format("Hello, World!~n").
```

Here's what the code does:

- The -module(hello). directive names the module hello.
- The -export([world/0]). directive makes the world/0 function available to other modules.
- The world() function outputs "Hello, World!" to the standard output.
You can compile and run the code by executing the following commands in the Erlang shell:

```
1> c(hello).
{ok,hello}
2> hello:world().
Hello, World!
ok
```
Note that you'll need to have the hello.erl file in the current directory where the Erlang shell is running, or you will need to tell the shell where to find it.

![](1.png)

# Hello World (a bit more depth)
- Write a hello world hw.erl in the current folder
```erl
-module(hw).

%% API
-export([helloworld/0, hellomyworld/1]).

helloworld() ->
  "Hello world".

hellomyworld(X) ->
  "Hello " ++ X ++ " world".
```
- Start up erl shell `erl`
- Compile the hw module `c(hw).`
- Run the function in the module `hw:helloworld()`
- Run the function in the module `hw:hellomyworld("Jek")`
![](2.png)

# Hello World Web Server. Build a simple web server Erlang and Rebar3 and Cowboy. Rebar3 is a build tool for Erlang. Cowboy is a web framework for Erlang.

## Setup Rebar3
- Go to your preferred folder example Download.
- Installing from Source http://rebar3.org/docs/getting-started/#installing-from-source `git clone https://github.com/erlang/rebar3.git`
- `cd rebar3`
- `./bootstrap`
- `./rebar3 local install`
- `export PATH=$PATH:~/.cache/rebar3/bin`
- Test by running `rebar3 new umbrella myproj`
- This setup is stuck to the terminal I am currently in as the export PATH is not permanent.

## Setup Web server
- Go back to the folder where I want to setup the web server
- Create a New Rebar3 Project
Open a terminal and run the following command to create a new Rebar3 app with the Cowboy dependency: `rebar3 new app mywebapp`
- `cd mywebapp`
- Edit the Configuration
Edit mywebapp.app.src and add Cowboy as a dependency. The file should look something like this:

```erlang
{application, mywebapp,
 [{description, "An OTP application"},
  {vsn, "0.1.0"},
  {registered, []},
  {mod, {mywebapp_app, []}},
  {applications,
   [kernel,
    stdlib,
    cowboy
   ]},
  {env,[]},
  {modules, []},

  {licenses, ["Apache-2.0"]},
  {links, []},
  {build_tools, ["rebar3"]}
]}.
```

- Add Cowboy to rebar.config https://ninenines.eu/docs/en/cowboy/2.9/guide/getting_started/
Edit rebar.config to include the Cowboy dependency: 

```erlang
{erl_opts, [debug_info]}.
{deps, [
    {cowboy, "2.9.0"}
]}.

{shell, [
  % {config, "config/sys.config"},
    {apps, [mywebapp]}
]}.
```

- Compile dependencies `rebar3 compile`

- Write the Hello World Handler
Create a new file under the src directory called hello_handler.erl with the following content:

```erlang
-module(hello_handler).
-behaviour(cowboy_handler).
-export([init/2]).

init(Req0, State) ->
  Req = cowboy_req:reply(200,
    #{<<"content-type">> => <<"text/plain">>},
    <<"Hello Jek!">>,
    Req0),
  {ok, Req, State}.
```

- Start Cowboy in Your Application
Edit the src/mywebapp_app.erl file to start the Cowboy server:

```erlang
-module(mywebapp_app).

-behaviour(application).

-export([start/2, stop/1]).

start(_Type, _Args) ->
    Dispatch = cowboy_router:compile([
        {'_', [{"/", hello_handler, []}]}
    ]),
    {ok, _} = cowboy:start_clear(my_http_listener,
        [{port, 8080}],
        #{env => #{dispatch => Dispatch}}
    ),
    mywebapp_sup:start_link().

stop(_State) ->
    ok.
```

- Build and Run Your Application
From the root directory of your application, run the following commands: 

```bash
rebar3 compile
```

- Runs a shell with project apps and deps in path. Intended for development use only https://rebar3.org/docs/commands/#shell

```bash
rebar3 shell
```

- Test it

```bash
curl http://localhost:8080 
```

![](3.png)
![](4.png)

# Add OTel Erlang agent to send traces to Splunk Observability Cloud
- 

# Proof
![](proof.png)

# Reference
- There are two types of Erlang Build Tools.  that can help you organize your code, manage dependencies, build releases, run tests, and more. The two are erlang.mk and rebar3 https://app.pluralsight.com/guides/10-essential-erlang-tools-for-erlang-developers