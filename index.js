var argv = require('yargs').argv,
    GithubApi = require('github'),
    github = new GithubApi({
      version: "3.0.0",
      debug: true,
      protocol: "https"
    }),
    page = 1,
    username = argv._[0] || 'ahmednuaman',
    repos;

function fetchRepos (page) {
  github.repos.getFromUser({
    user: username,
    per_page: 100,
    page: page
  }, function (err, res) {
    if (!err) {
      handleRepos(res);
    }
  });
}

function handleRepos (res) {
  repos = repos || [];

  if (res.length) {
    repos = repos.concat(res);
    fetchRepos(++page);
  } else {
    console.log(repos.length);
  }
}

fetchRepos(page);
