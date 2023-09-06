According to colleague Arthur try these steps

```php

curl -LO  https://github.com/signalfx/signalfx-php-tracing/releases/latest/download/signalfx-setup.php
sudo php signalfx-setup.php --php-bin=all
sudo php signalfx-setup.php --update-config --signalfx.endpoint_url=http://localhost:9080/v1/trace
sudo php signalfx-setup.php --update-config --signalfx.service_name= <insert service name>
sudo php signalfx-setup.php --update-config --signalfx.tags=deployment.environment: <insert deployment environment name>
Restart php-fpm, nginx, apache, etc.

``````