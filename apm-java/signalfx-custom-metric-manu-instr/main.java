package com.splunk.training;

import com.codahale.metrics.*;
import com.signalfx.codahale.*;
import com.signalfx.*;

import java.util.concurrent.TimeUnit;
import com.signalfx.codahale.reporter.*;

import java.io.IOException;


public class ResponseTimes 
{

    public static void main( String[] args ) {

        final MetricRegistry metricRegistry = new MetricRegistry();
        final Meter requests = metricRegistry.meter("requests");

        SignalFxReporter sfxReporter =  new SignalFxReporter.Builder(metricRegistry,"ORG_TOKEN").build();
        sfxReporter.start(1, TimeUnit.SECONDS);

        final MetricMetadata metricMetadata = sfxReporter.getMetricMetadata();
        final SfxMetrics metrics = new SfxMetrics(metricRegistry, metricMetadata);

        int i = 0;

        String[] sites = {"google.com", "duckduckgo.com", "bing.com", "weather.com", "amazon.com","etrade.com", "splunk.com"};
        int sitesindex = 0;

        while (i == 0) {

            if (sitesindex > 6) {
                sitesindex = 0;
            }

            String stringURL = "https://" + sites[sitesindex];

            long starttime = System.currentTimeMillis();

            String url = sites[sitesindex];
            String[] command = {"curl", "-u", "Accept:application/json", url};
            ProcessBuilder process = new ProcessBuilder(command);
            System.out.println("URL " + url);

            try {
                process.start();

            } catch (IOException e) {
                System.out.print("error");
                e.printStackTrace();
            }
            
            long endtime = System.currentTimeMillis();

            long resulttime = endtime - starttime;

            metrics.registerGauge("xxx_http_response_timeJava", new Gauge<Long>() {
                @Override
                public Long getValue() {
                     return resulttime;
                }
             },"xxx_site", sites[sitesindex]);
   
            sitesindex += 1;

            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}




