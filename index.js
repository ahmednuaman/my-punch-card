var argv = require('yargs').argv,
    GithubApi = require('github'),
    github = new GithubApi({
      version: "3.0.0",
      debug: true,
      protocol: "https"
    }),
    username = argv._[0] || 'ahmednuaman';

github.repos.getFromUser({
  user: username
}, function (err, res) {
  console.log(res);
});
