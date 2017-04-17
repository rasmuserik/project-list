// # project-list
//
console.log('hello');

exports.cachedGithubRepos = async (user) => {
  let result = localStorage.getItem('githubRepos');
  let prevTime = +(localStorage.getItem('githubReposTimeStamp') || 0); 
  if(prevTime < Date.now() - 10 * 60 * 1000) {
    let repos = []
    let current;
    let i = 1;
    do {
      current = await fetch(`https://api.github.com/users/${user}/repos?page=${i}`);
      ++i;
      current = await current.json();
      repos = repos.concat(current);
    } while(current.length > 0);
    result = JSON.stringify(repos);
    localStorage.setItem('githubRepos', result);
    localStorage.setItem('githubReposTimeStamp', Date.now());
  }
  return JSON.parse(result);
};

exports.style = `
.repoEntry {
    vertical-align: top;
    overflow: hidden;
    display: inline-block;
    font-size: 12px;
    text-decoration: none;
    width: 90px;
    height: 44px;
    padding: 0px 3px 0px 0px;
    margin: 0px;
    font-family: Ubuntu Condensed, sans-serif;
}
.repoEntry img {
    float: left;
    margin-right: 6px;
    width: 32px;
    height: 32px;
}
`;

exports.renderRepos = (repos) => {
  repos.sort((a,b) => a.created_at > b.created_at ? -1 : 1);
  let entries = [];
  for(let i = 0; i < repos.length; ++i) {
    let repo = repos[i];
    entries.push(`
    <a class=repoEntry
    href=${'http://' + repo.name + '.solsort.com'}>
    <img src=http://${repo.name}.solsort.com/icon.png>
    ${repo.name.replace(/[_-]/g, ' ')}
    </div>`);
  }
  return entries.join('');
};

exports.main = async () => {
  let repos = await exports.cachedGithubRepos('solsort');
  let html = exports.renderRepos(repos);
  window.app.innerHTML = '<style>' +
    exports.style +  '</style>' +
    html;
}
