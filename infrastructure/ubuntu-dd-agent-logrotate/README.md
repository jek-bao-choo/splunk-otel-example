Setup Ubuntu then setup Tomcat server.

Get ip address 

`hostname -I`

```
DD_API_KEY=<API KEY REDACTED> \
DD_SITE="datadoghq.com" \
DD_APM_INSTRUMENTATION_ENABLED=host \
DD_APM_INSTRUMENTATION_LIBRARIES=java:1,python:2,js:5,dotnet:3 \
bash -c "$(curl -L https://install.datadoghq.com/scripts/install_script_agent7.sh)"
```

The environment variables are only temporarily set for the duration of that specific command/process.

to make these environment variables persistent, you would need to either:

Add them to `~/.bashrc`

```
DD_API_KEY=<API KEY REDACTED>
DD_SITE="datadoghq.com"
DD_APM_INSTRUMENTATION_ENABLED=host
DD_APM_INSTRUMENTATION_LIBRARIES=java:1,python:2,js:5,dotnet:3
```


To install file
```
sudo -u dd-agent install -m 0644 /etc/datadog-agent/conf.d/apache.d/conf.yaml.example /etc/datadog-agent/conf.d/apache.d/conf.yaml
```

To send logs also ensure that logs have the right read permission:
```
ls -l /var/log/apache2/access.log
sudo chmod 644 /var/log/apache2/access.log
sudo chown dd-agent:dd-agent /var/log/apache2/access.log

sudo cat /etc/datadog-agent/conf.d/apache.d/conf.yaml

```

```
logs:
  - type: file
    path: /var/log/apache2/access.log
    service: apache
    source: apache
    sourcecategory: http_web_access
```

```
sudo -u dd-agent test -r /var/log/apache2/access.log
echo $?  # Should return 0 if readable
```


```
sudo cat /etc/datadog-agent/datadog.yaml | grep -A5 "logs_enabled"
```

```
sudo datadog-agent status
sudo tail -f /var/log/datadog/agent.log
```

```
sudo datadog-agent configcheck
sudo datadog-agent diagnose
```

Add the dd-agent user to the Apache log group (typically adm or www-data):
```
sudo usermod -a -G adm dd-agent
```

Make sure the group has read permissions:
```
sudo chmod 644 /var/log/apache2/access.log
sudo chown root:adm /var/log/apache2/access.log
```


Make sure the group has read permissions:
```
sudo chmod 644 /var/log/apache2/access.log
sudo chown root:adm /var/log/apache2/access.log
```
* The /var/log/ directory is only accessible by the root user in the adm group

In case you wonders what the number means:

```
6   4   0
│   │   │
│   │   └── Others: No permissions (---) 
│   └────── Group: Read only (r--)   
└────────── Owner: Read and write (rw-)
```
In short, if you want to use the Datadog Agent to collect your logs for analysis, you will need to grant it access to log directories.

Some environments leverage access control lists (ACLs) for greater control over file and directory permissions, so you may need to modify additional settings to ensure logrotate works with other services. For example, if you want to use the Datadog Agent to collect your logs for analysis, you will need to grant it access to log directories.


```
sudo getfacl /var/log/apache2
```


The Datadog Agent runs under the dd-agent user and group. To give the Agent access to a log directory, such as `/var/log/apache`, you can run the following command in an ACL-enabled environment:

```
sudo setfacl -m u:dd-agent:rx /var/log/apache2
```
*source: https://www.datadoghq.com/blog/log-file-control-with-logrotate/

The command uses the -rx option to give the Agent user read and execute permissions for Apache logs.

It’s important to note that the above command will only apply the ACL setting once, so you need to make sure that the configuration persists for rotated logs. You can accomplish this by creating a new dd-agent_ACL file in the /etc/logrotate.d directory and specifying which logs you want the Agent to forward to Datadog.

```
{
    postrotate
        /usr/bin/setfacl -m g:dd-agent:rx /var/log/apache2/error.log
        /usr/bin/setfacl -m g:dd-agent:rx /var/log/apache2/access.log
    endscript
}
```

The configuration above uses a postrotate script to apply the ACL setting for each log after it is rotated, which ensures that logrotate is able to continue rotating logs successfully while enabling the Datadog Agent to collect them.


```
sudo systemctl restart datadog-agent
```

```
sudo -u dd-agent test -r /var/log/apache2/access.log
echo $?  # Should now return 0
```

getting a 1, we might need to check the parent directory permissions as well:
```
ls -l /var/log/apache2/
sudo chmod 755 /var/log/apache2
```

# An example of Logrotate for Apache2

```
/var/log/apache2/*.log {
        daily
        maxsize 4M
        missingok
        rotate 14
        compress
        delaycompress
        dateext
        dateformat -%Y%m%d-%H%M%S
        notifempty
        create 640 root adm
        sharedscripts
        prerotate
                if [ -d /etc/logrotate.d/httpd-prerotate ]; then
                        run-parts /etc/logrotate.d/httpd-prerotate
                fi
        endscript
        postrotate
                if pgrep -f ^/usr/sbin/apache2 > /dev/null; then
                        invoke-rc.d apache2 reload 2>&1 | logger -t apache2.logrotate
                fi
                /usr/bin/setfacl -m g:dd-agent:rx /var/log/apache2/error.log
                /usr/bin/setfacl -m g:dd-agent:rx /var/log/apache2/access.log
        endscript
}
```

# Optional 

Make changes to logrotate and after which force restart:

First verify your configuration syntax:
```
sudo logrotate -d /etc/logrotate.d/apache2
```

Force logrotate to run now and pick up the new configuration:
```
sudo logrotate -f /etc/logrotate.d/apache2
```

You can verify when logrotate will next run by checking:
```
ls -l /etc/cron.daily/logrotate
```

Debug issues with the logrotate utility
```
sudo cat /var/lib/logrotate/status
```

# Test if can run OTel Collector filelog receiver in parallel to DataDog Cluster Agent.