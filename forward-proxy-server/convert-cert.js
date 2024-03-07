const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

function convertCertToPem(certContent, pemFilePath) {
  const cer = `openssl x509 -inform der -in ${certPath} -out ${pemFilePath}`;

  exec(cer, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error converting cer to pem ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`openssl stderr: ${stderr}`);
      return;
    }
    console.log(`Successful`);
  });
}

const certPath = "ForwardProxyServer.cer";
const pemPath = "./pemFiles";
const certContent = fs.readFileSync(certPath);

const pemFileName = path.basename(certPath, path.extname(certPath)) + ".pem";
const pemFilePath = path.join(pemPath, pemFileName);

convertCertToPem(certContent, pemFilePath);
