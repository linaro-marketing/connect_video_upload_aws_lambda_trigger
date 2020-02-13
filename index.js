const https = require("https");

const doPostRequest = event => {
  const session_id = event.Records[0].s3.object.key.match(
    /BUD20-[A-Za-z]*[0-9]+K*[0-9]*/g
  )[0];

  return new Promise((resolve, reject) => {
    const options = {
      host: "your-ci.server.com",
      path: "/webhook-url/" + session_id,
      port: 3000,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-length": 0
      }
    };
    //create the request object with the callback with the result
    const req = https.request(options, res => {
      resolve(JSON.stringify(res.statusCode));
    });
    // handle the possible errors
    req.on("error", e => {
      reject(e.message);
    });
    // Perform the request
    req.write("");
    //finish the request
    req.end();
  });
};

exports.handler = async event => {
  await doPostRequest(event)
    .then(result => console.log(`Status code: ${result}`))
    .catch(err =>
      console.error(
        `Error doing the request for the event: ${JSON.stringify(
          event
        )} => ${err}`
      )
    );
};
