const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: getenv.string("GITHUB_ACCESS_TOKEN"),
});

const [owner, repo] = getenv.string("GITHUB_REPOSITORY").split("/");
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
