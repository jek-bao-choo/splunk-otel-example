import SplunkOtelWeb from '@splunk/otel-web';
import SplunkSessionRecorder from '@splunk/otel-web-session-recorder'
import {trace} from '@opentelemetry/api';

// Init Splunk RUM
SplunkOtelWeb.init({
    realm: "us1",
    rumAccessToken: "< rum access token >",
    applicationName: "jek-payment-result-custom-event",
    deploymentEnvironment: "demo",
    // debug: true
});

// This must be called after initializing splunk rum
SplunkSessionRecorder.init({
    beaconEndpoint: 'https://rum-ingest.us1.signalfx.com/v1/rumreplay',
    rumAccessToken: "< rum access token >"
});

import './styles.css';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('payment-form');
    const result = document.getElementById('result');
    const payButton = document.getElementById('pay-button');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const timeoutValue = parseInt(document.getElementById('timeout').value, 10) * 1000; // Convert to milliseconds

        // Change cursor to loading and disable the button
        document.body.style.cursor = 'wait';
        payButton.disabled = true;
        payButton.textContent = 'Processing...';

        // Mock payment processing
        setTimeout(() => {
            form.classList.add('hidden');
            result.classList.remove('hidden');
            document.body.style.cursor = 'default'; // Reset cursor
            payButton.disabled = false;
            payButton.textContent = 'Pay Now';
        }, timeoutValue); // Use the user-defined delay
    });
});




// end of unnecessary import to test webpack
