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
    GITHUB_REPOSITORY: getenv.string("GITHUB_REPOSITORY")
  };
}

const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: config.GITHUB_ACCESS_TOKEN,
});

const [owner, repo] = config.GITHUB_REPOSITORY.split("/");

exports.handler = async (event) => {
  let title = event.title;
  let body = event.description;
  const response = await octokit.issues.create({
    owner,
    repo,
    body,
    title,
  });
  return response;
};

let uploadImage = async (b64_image, name) => {
  const result = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    message: "Adding an image to the repository",
    path: name,
    content: b64_image,
  })
};

//uploadImage(b64_address, 'test.png');