const octokit = require("octokit");

exports.handler = async (event) => {
  let title = event.title;
  let description = event.description;
  const response = await octokit.request("POST /repos/vjspranav/TestIssuesRepo/issues", {
    owner: "vleads",
    repo: "TestIssuesRepo",
    title: title,
    body: description
  });
  return response;
};
