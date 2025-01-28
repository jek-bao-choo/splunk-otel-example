`sudo apt update`

`sudo apt install nginx`

`sudo systemctl status nginx`

`sudo ufw allow 'Nginx Full'  # Allows both HTTP and HTTPS`

`curl http://localhost`

```
# Start Nginx
sudo systemctl start nginx

# Stop Nginx
sudo systemctl stop nginx

# Restart Nginx
sudo systemctl restart nginx

# Reload configuration without stopping
sudo systemctl reload nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

Important directories:

/etc/nginx - Configuration directory
/etc/nginx/nginx.conf - Main configuration file
/etc/nginx/sites-available/ - Individual site configurations
/etc/nginx/sites-enabled/ - Enabled site configurations
/var/log/nginx/ - Log files
/var/www/html/ - Default web content directory

---

