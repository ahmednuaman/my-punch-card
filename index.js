var argv = require('yargs').argv,
    Github = require('github'),
    github = new Github({
      version: '3.0.0',
      protocol: 'https'
    }),
    page = 1,
    Spinner = require('its-thinking'),
    spinner = new Spinner(),
    token = argv._[1],
    username = argv._[0] || 'ahmednuaman',
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
    calculateHours();
  }
}

function calculateHours () {
  var hours = 0;

  punchcards.forEach(function (card) {
    if (card[2] > 0) {
      hours++;
    }
  });

  spinner.stop();
  spinner.reset();
  console.log("\n" + 'Total commit hours: ' + hours);
}

spinner.set(8);
spinner.start('Loading Github data ');
fetchRepos(page);
