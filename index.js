var argv = require('yargs').argv,
    GithubApi = require('github'),
    github = new GithubApi({
      version: '3.0.0',
      debug: true,
      protocol: 'https'
    }),
    page = 1,
    username = argv._[0] || 'ahmednuaman',
    token = argv._[1],
    punchcards,
    repos;

function fetchRepos (page) {
  github.authenticate({
    type: 'oauth',
    token: token
  });
  github.repos.getFromUser({
    user: username,
    per_page: 100,
    page: page,
    sort: 'pushed',
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
    findPunchCards();
  }
}

function fetchPunchCards (repo) {
  github.authenticate({
    type: 'oauth',
    token: token
  });
  github.repos.getStatsPunchCard({
    user: username,
    repo: repo.name
  }, function (err, res) {
    if (!err) {
      handlePunchCards(res);
    }
  });
}

function handlePunchCards (res) {
  punchcards = punchcards || [];
  punchcards = punchcards.concat(res);

  findPunchCards();
}

function findPunchCards () {
  if (repos.length) {
    fetchPunchCards(repos.pop());
  } else {
    console.log(punchcards);
  }
}

fetchRepos(page);
