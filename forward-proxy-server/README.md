
# FORWARD PROXY SERVER

### A proxy sits between a client that needs a resource and a server that provides the result

### Forward proxies can be used to control and monitor access to the a resource e.g internet or certain websites or types of content

### Anonymity and privacy. helps users maintain anonymity and privacy by masking their IP address. By routing their traffic through a forward proxy server, users can hide their IP address from the websites they visit

### Forward proxies can be used to bypass restrictions to blocked content, this is done by routing traffic through a forward proxy server located in a diff region

### Content caching and Acceleration: Can be used to cache frequently accessed web content.

### Load Balancing: can distribute incoming requests accross multiple backend servers to balance the load and improve overall performance and scalability of web applications

### Logging and Monitoring: Forward proxiesx can log all incoming and outgoing traffic, by analysing proxy logs administrators can identify security threats, troubleshoot network isses and monitor user behaviour.

This project 

1. Creates a minimal forward proxy server
test with curl -x localhost:8989 http://httpbin.org/ip

2. Refuse to proxy a request to domain on the banned list.
test with curl -x localhost:8989 www.facebook.com

3. Refuse to proxy request to domain with banned words

4. log all the traffic going through the proxy

5. handle TLS so you can also proxy HTTPS requests. 
