// # project-list
//
console.log('hello');

async function cachedGithubRepos(user) {
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
}

function renderRepos(repos) {
  repos.sort((a,b) => a.created_at > b.created_at ? -1 : 1);
  let entries = [];
  for(let i = 0; i < repos.length; ++i) {
    let repo = repos[i];
    entries.push(`
    <a 
    style="
    vertical-align: top;
    overflow: hidden;
    display: inline-block;
    font-size: 12px;
    text-decoration: none;
    width: 120px;
    height: 44px;
    padding: 0px 3px 0px 0px;
    margin: 0px;
    "
    href=${repo.homepage || ''}
    >
    <img style="
    float: left;
    margin-right: 8px;
    width: 32px;
    height: 32px;
    "src=http://${repo.name}.solsort.com/icon.png>
    <strong>${repo.name}</strong>
    </div>
    `);
    console.log(repo.name);
  }
  return entries.join('');
}

exports.main = async () => {
  let repos = await cachedGithubRepos('solsort');
  let str = renderRepos(repos);
  window.app.innerHTML = str;
}
