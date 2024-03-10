const http = require("http");
const httpProxy = require("http-proxy");
const fs = require("fs");
const https = require("https");
const net = require("net");

// Create a new HTTP proxy server,
const proxy = httpProxy.createProxyServer({});

//load list of forbidden hosts
const forbiddenHosts = fs
  .readFileSync("forbidden-hosts.txt", "utf-8")
  .split("\n")
  .map((host) => host.trim())
  .filter((host) => host !== "");

const bannedWords = fs
  .readFileSync("banned-words.txt", "utf-8")
  .split("\n")
  .map((host) => host.trim())
  .filter((host) => host !== "");

// handle TLS
const tlsOptions = {
  key: fs.readFileSync("./pemfiles/ForwardProxyServer.pem"),
  cert: fs.readFileSync("./pemfiles/ForwardProxyServer.pem"),
};

// Create a basic HTTP Server, this handles incoming requests
const server = http.createServer(tlsOptions, (req, res) => {
  //Log thr incoming request
  console.log(`Recieved request for: ${req.url}`);

  //extract hostname from url
  const hostname = new URL(req.url).hostname;

  // support connect network request
  if (req.method === "CONNECT") {
    console.log("here");
    handleConnectMethod(req, res);
    return;
  }
  //  else {
  //     // Respond with a 405 Method Not Allowed for other methods
  //     res.writeHead(405, { "Content-Type": "text/plain" });
  //     res.end("Method Not Allowed");
  //   }

  // check if hostname is in the forbidden hosts list
  if (forbiddenHosts.includes(hostname)) {
    console.log(`Request for forbidden host: ${hostname}`);
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden: Website not allowed.");
    return;
  }

  

  // Extract the request header
  const headers = req.headers;

  // Aadd x-forworded-for header with client's ip address
  headers["X-Forwarded-For"] = req.socket.remoteAddress;

  //Forward the request to the target server
  const options = {
    hostname: hostname,
    port: 443,
    method: req.method,
    headers: headers,
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let responseData = "";

    //Accumulate the response data
    proxyRes.on("data", (chunk) => {
      responseData += chunk;
    });

    proxyRes.on("end", () => {
      //refuse to proxy a web page if certain content appears on the page.
      if (containsBannedWords(responseData)) {
        res.writeHead(403, { "Content-Type": "text/plain" });
        res.end("Forbidden: Content contains banned words.");
      } else {
        //log outgoing response
        console.log(req.url);
        // Set the correct response headers
        /**To read the response from the target server and set the correct
         *  response headers before sending the response to the client,
         *  you need to intercept the response from the target server using
         * the http.request method and modify the response headers accordingly.  */
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        //pipe the response from the destination server back to client
        proxyRes.pipe(res);
        // res.end(responseData);
      }
    });
  });

  // Handle proxy errors
  proxyReq.on("error", (err, req, res) => {
    console.error("Proxy error:", err);
    res.writeHead(500, {
      "Content-Type": "text/plain",
    });
    res.end("Proxy error occured");
  });
  console.log(`Forwarding request to: ${hostname}`);

  // Pipe the request body (if any) to the destination server
  req.pipe(proxyReq);
});

//port for the proxy server to listen on
const PORT = 8989;

//Start the proxy server
server.listen(PORT, () => {
  console.log(`Proxy server listening on port: ${PORT}`);
});

// Function to check if the response contains any banned words
function containsBannedWords(responseData) {
  console.log("got here first");

  for (const word of bannedWords) {
    if (responseData.includes(word)) {
      return true;
    }
  }
  return false;
}

// Function to handle CONNECT method
function handleConnectMethod(req, res) {
  // Extract hostname and port from the request URL
  const [hostname, port] = req.url.split(":");

  // Establish a TCP connection to the destination server
  const client = net.connect(port, hostname, () => {
    // Respond with a 200 OK to indicate successful tunnel establishment
    res.write("HTTP/1.1 200 Connection Established\r\n\r\n");
    // res.end("Connection established");

    // Forward data between the client and the destination server
    client.pipe(res);
    res.pipe(client);
  });

  // Handle errors with the TCP connection
  client.on("error", (err) => {
    console.error("TCP connection error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  });
}
