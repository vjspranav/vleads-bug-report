const getenv = require("getenv");
const fs = require("fs");
const path = require("path");
const util = require("util");

const readFilePromise = util.promisify(fs.readFile);
let imageUrl = false;

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
  return await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    message: "Adding an image to the repository",
    path: name,
    content: b64_image,
  });
};

exports.handler = async (event) => {
  let title = event.title;
  let context = JSON.parse(event.context_info);
  let label = context.developer_institute;
  let issues = event.issues;
  let datetime = event.datetime;
  let experiment_link = event.experiment_link;
  let issuesString = "";
  issues.forEach((issue) => {
    issuesString += "* " + issue + "\n";
  });
  let result = "";
  if (event.img) {
    let date = Date.now();
    let imageName = context.developer_institute + date.toString() + ".png";
    result = await uploadImage(event.img, imageName);
    imageUrl =
      "https://raw.githubusercontent.com/virtual-labs/bugs-virtual-labs/main/" +
      imageName;
  }
  let body =
    "### **Bug Reported on " +
    datetime +
    " in** \nLab - " +
    context.labname +
    "\nExperiment - " +
    context.expname;
  if (issues) body += "\n**Type(s) of Issue -**\n" + issuesString;
  if (event.description) body += "\nAdditional info- " + event.description;
  if (experiment_link) body += "\nExperiment Link - " + experiment_link;
  if (imageUrl)
    body +=
      '\n**Screenshot of Issue**-<br> <img height="300" src="' +
      imageUrl +
      '" alt="Issue image">';
  const response = await octokit.issues.create({
    owner,
    repo,
    body,
    title,
    result,
    labels: [label],
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
