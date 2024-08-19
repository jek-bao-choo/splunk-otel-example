Must read https://www.digitalocean.com/community/tutorials/how-to-install-apache-tomcat-10-on-ubuntu-20-04

![](proof1.png)

Follow the steps to install Tomcat 10 on Ubuntu 20.04.

Next add a Java appplication to Tomcat.

Go to `cd MyWebApp` and run `mvn clean package`. This will create a MyWebApp.war file in the target/ directory.

    This simple application allows users to enter their name, which is then displayed on the page. It demonstrates the basic structure of a Java web application with a frontend (JSP and CSS) and backend (Servlet).
    To enhance this application with OpenTelemetry:
        Add the OpenTelemetry dependencies to your pom.xml.
        Configure a TracerProvider in your application.
        Instrument your Servlet using OpenTelemetry annotations or manual instrumentation.

Transfer the WAR file: Use SCP or SFTP to transfer your WAR file to the Ubuntu server where Tomcat is running:

`scp -i ~/.ssh/my-ec2-key.pem ~/MyWebApp.war ubuntu@ec2-xx-xx-xx-xx.compute-1.amazonaws.com:~`

Check that the WAR file is in the correct location: ~/MyWebApp.war

After which, `sudo cp ~/MyWebApp.war /opt/tomcat/webapps/`

Ensure Tomcat has the right permissions to read and execute your application:
`sudo chown tomcat:tomcat /opt/tomcat/webapps/MyWebApp.war`
`sudo chmod 644 /opt/tomcat/webapps/MyWebApp.war`

Check Tomcat logs for any errors:
`sudo journalctl -u tomcat`
`sudo tail -f /opt/tomcat/logs/catalina.out`

Restart the Tomcat service to deploy your application:
`sudo systemctl restart tomcat`
`sudo systemctl status tomcat`

Access your application through a web browser:
http://your-server-ip:8080/MyWebApp

![](proof2.png)

Modify the Tomcat startup script (usually /etc/systemd/system/tomcat.service) to include the agent:
`Environment="CATALINA_OPTS=-javaagent:/path/to/opentelemetry-javaagent.jar"`

Reload the systemd configuration and restart Tomcat:
`sudo systemctl daemon-reload`
`sudo systemctl start tomcat`
`sudo systemctl status tomcat`