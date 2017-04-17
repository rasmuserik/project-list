// # project-list
//
// Read and render repositories for a given github user/organisation.
//
// Motivation: I want an automatically updated list of projects on my web-page.
//
// ## Retrieve repository list
//
// We cache the results to `localStorage` for 10 minutes, as only 60 requests are allowed per hour, for non-logged-in users.

exports.cachedGithubRepos = async (user) => {

 
  let result = localStorage.getItem('githubRepos');
  let prevTime = +(localStorage.getItem('githubReposTimeStamp') || 0); 
  if(prevTime < Date.now() - 10 * 60 * 1000) {

    let repos = []
    let current;
    let i = 1;
    do {
      current = await fetch(
        `https://api.github.com/users/${user}/repos?page=${i}`);
      current = await current.json();
      repos = repos.concat(current);
      ++i;
    } while(current.length > 0);

    result = JSON.stringify(repos);
    localStorage.setItem('githubRepos', result);
    localStorage.setItem('githubReposTimeStamp', Date.now());
  }
  return JSON.parse(result);
};

// ## Render list of repositories
//
// Create HTML-string, with icon, link and title for the repositories sorted by creation time.
//
// We assume that `$REPOSITORY` has an icon at `http://$REPOSITORY.$DOMAIN/icon.png`, and a website at `http://$REPOSITORY.$DOMAIN/`.

exports.renderRepos = (repos, domain) => {
  repos.sort((a,b) => a.created_at > b.created_at ? -1 : 1);
  let entries = [];
  for(let i = 0; i < repos.length; ++i) {
    let repo = repos[i];
    entries.push(`
    <a class=repoEntry
    href=${'http://' + repo.name + '.' + domain}>
    <img src=http://${repo.name}.${domain}/icon.png>
    ${repo.name.replace(/[_-]/g, ' ')}
    </div>`);
  }
  return entries.join('');
};

// ## Styling

exports.style = `
.repoEntry {
    vertical-align: top;
    overflow: hidden;
    display: inline-block;
    font-size: 12px;
    text-decoration: none;
    width: 120px;
    height: 44px;
    padding: 0px 3px 0px 0px;
    margin: 0px;
    font-family: Ubuntu, sans-serif;
}
.repoEntry img {
    float: left;
    margin-right: 6px;
    width: 32px;
    height: 32px;
}
`;

// ## Main/demo

exports.main = async () => {
  let repos = await exports.cachedGithubRepos('solsort');
  let html = exports.renderRepos(repos, 'solsort.com');
  window.app.innerHTML = '<style>' +
    exports.style +  '</style>' +
    html;
}
