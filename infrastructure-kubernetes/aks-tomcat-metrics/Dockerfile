FROM tomcat:9.0

ENV CATALINA_OPTS="$CATALINA_OPTS -Dcom.sun.management.jmxremote \
                   -Dcom.sun.management.jmxremote.port=9090 \
                   -Dcom.sun.management.jmxremote.rmi.port=9091 \
                   -Djava.rmi.server.hostname=localhost \
                   -Dcom.sun.management.jmxremote.ssl=false \
                   -Dcom.sun.management.jmxremote.authenticate=false"

# Expose the ports for Tomcat and JMX
EXPOSE 8080 9090 9091

# Copy your WAR file to the webapps directory
COPY target/hellojekv1.war /usr/local/tomcat/webapps/

# Start Tomcat
CMD ["catalina.sh", "run"]