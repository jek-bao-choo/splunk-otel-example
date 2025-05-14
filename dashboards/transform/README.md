Using OTel Transform processor. Thanks to colleague SS:


If a metric is reporting time in EPOCH and you wish to convert that in human readable format, you can use transform processor with FormatTime function. In this example I added a new attribute called mtime_human on filestats receiver metric file.mtime:


```
  transform:
    error_mode: ignore
    metric_statements:
      - context: datapoint
        statements:
          - set(resource.attributes["mtime_human"], FormatTime(Unix(datapoint.value_int), "%d %m %y %H:%M:%S")) where metric.name == "file.mtime"
```