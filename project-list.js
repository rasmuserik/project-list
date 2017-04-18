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

exports.renderRepos = (repos, domain, elem) => {
  repos.sort((a,b) => a.created_at > b.created_at ? -1 : 1);
  let entries = [];
  for(let i = 0; i < repos.length; ++i) {
    let repo = repos[i];
    entries.push(`
    <a id=entry-${repo.name} style=text-align:left
    href=${'http://' + repo.name + '.' + domain}>
      <div class=solsortRepos>
      <img src=http://${repo.name}.${domain}/icon.png>
      ${repo.name.replace(/[_-]/g, ' ')}
      </div>
    </a>`);
  }
  elem.innerHTML = entries.join('') + entries.innerHTML;
};

// ## Styling

exports.style = `
#solsortEntries img {
    float: left;
    margin-right: 6px;
    width: 32px;
    height: 32px;
}
#solsortEntries a {
  display: inline-block;
  box-sizing: border-box;
  width: 110px;
  height: 50px;
  vertical-align: top;
  text-decoration: none;
  text-align: center;
  overflow: hidden;
  padding: 5px;
  font-size: 13px;
}
#solsortEntries .date {
color: #ccc;
font-size: 11px;
}
`;

// ## Main/demo

function dates() {
  let nodes = document.getElementById('solsortEntries').children;
  console.log(nodes, nodes.length, nodes[1].innerHTML);
  for(let i = 0; i < nodes.length; ++i) {
    let node = nodes[i].children[0];
    if(node) {
      let html = node.innerHTML;
      console.log(node, nodes[i].children);
      html = html.replace(/^20[0-9]+ [0-9]+ [0-9]+/, 
        o => `<div class=date>${o.replace(/ /g, '-')}</div>`);
      node.innerHTML = html;
    }
  }
  console.log(parent.children);
}

exports.main = async () => {
  let html = await fetch('html.inc');
  html = await html.text();
  window.app.innerHTML = `<style>${exports.style}</style>${html}`;
  dates();
  let repos = await exports.cachedGithubRepos('solsort');
  let nodes = document.getElementById('solsortEntries');
  exports.renderRepos(repos, 'solsort.com', nodes);
}
