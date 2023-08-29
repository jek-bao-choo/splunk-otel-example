Apparently, this config works in collecting host metrics while running in gateway mode. 

To be down to the basic. The key change is essentially adding hostmetrics ![](3.png) to receiver's metric pipeline ![](2.png). The metric pipeline also exports metrics via signalfx ![](1.png)