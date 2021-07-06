const getenv = require("getenv");
const fs = require("fs");
const path = require("path");
const util = require("util");

const readFilePromise = util.promisify(fs.readFile);

let config = {};
try {
  config = require("./keys/test.js");
} catch (ex) {
  config = {
    GITHUB_ACCESS_TOKEN: getenv.string("GITHUB_ACCESS_TOKEN"),
    GITHUB_REPOSITORY: getenv.string("GITHUB_REPOSITORY"),
  };
}

const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: config.GITHUB_ACCESS_TOKEN,
});

const [owner, repo] = config.GITHUB_REPOSITORY.split("/");

let uploadImage = async (b64_image, name) => {
  let body =
    'Adding an image to the repository <img src="https://raw.githubusercontent.com/vjspranav/TestIssuesRepo/main/' +
    name +
    '" alt="issue_image">';

  const result = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    message: "Adding an image to the repository",
    path: name,
    content: b64_image,
  });
};

exports.handler = async (event) => {
  let title = event.title;
  if (event.img) {
    let date = Date.now();
    let result = uploadImage(
      img,
      event.college + Number.toString(date) + ".png"
    );
  }
  let body = event.description;
  const response = await octokit.issues.create({
    owner,
    repo,
    body,
    title,
    result,
  });
  let res = {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
      "X-Requested-With": "*",
    },
    response: response,
  };
  return res;
};

// const b64_address = "b64 here";
// uploadImage(b64_address, "testss.png");
