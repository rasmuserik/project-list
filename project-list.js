// # Project list
//
// Read and render repositories for a given github user/organisation.
//
// Motivation: I want an automatically updated list of projects on <http://solsort.com>.
//
// ## Retrieve repository list
//
// We cache the results to `localStorage` for an hour, as only 60 requests are allowed per hour, for non-logged-in users.

exports.cachedGithubRepos = async (user) => {
  let result = localStorage.getItem('githubRepos');
  let prevTime = +(localStorage.getItem('githubReposTimeStamp') || 0); 
  if(prevTime < Date.now() - 60 * 60 * 1000) {

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

exports.renderRepos = (repos, domain, parent) => {
  repos.sort((a,b) => a.created_at > b.created_at ? -1 : 1);
  let nodes = parent.children;
  let entries = [];
  for(let i = 0; i < repos.length; ++i) {
    let repo = repos[i];

    let j = 1;
    while(j < nodes.length && nodes[j] &&
      repo.created_at < nodes[j].textContent.trim()) {
      ++j;
    }
    let elem = document.createElement('a');
    elem.style.textAlign = 'left';
    elem.href = 'http://' + repo.name + '.' + domain;
    elem.id = 'entry-' + repo.name;
    elem.innerHTML = `<div>
    <img src=http://${repo.name}.${domain}/icon.png>
    <div class=date>${repo.created_at.slice(0,10)}</div>
    ${repo.name.replace(/-_/g, ' ')}</div>`;
    parent.insertBefore(elem, nodes[j]);
  }
};

// ## Styling

exports.style = `
#solsortEntries img {
    float: left;
    margin-right: 6px;
    width: 40px;
    height: 40px;
    margin-bottom: 20px;
    border-radius: 4px;
}
#solsortEntries a {
  display: inline-block;
  box-sizing: border-box;
  width: 159px;
  height: 60px;
  vertical-align: top;
  text-decoration: none;
  overflow: hidden;
  padding: 0px 10px 0px 10px;
  text-align: center;
  font-size: 13px;
}
#solsortEntries .date {
  color: #ccc;
  font-size: 11px;
}
`;

// ## Format date on entries.

function dates() {
  let nodes = document.getElementById('solsortEntries').children;
  for(let i = 0; i < nodes.length; ++i) {
    let node = nodes[i].children[0];
    if(node) {
      let html = node.innerHTML;
      html = html.replace(/^(20[0-9]+ [0-9]+ [0-9]+)?/, 
        o => `<div class=date>${o.replace(/ /g, '-')} <br></div>`);
      node.innerHTML = html;
    }
  }
}

// ## Update

async function main() {
  let elem = document.getElementById('solsortEntries');
  if(elem) {
    let style = document.getElementById('solsort-project-list-style');
    if(!style) {
      style = document.createElement('style');
      style.innerHTML = exports.style;
      style.id = 'solsort-project-list-style';
      elem.insertBefore(style, elem.children[0]);
    }
    dates();
    let repos = await exports.cachedGithubRepos('solsort');
    let nodes = document.getElementById('solsortEntries');
    exports.renderRepos(repos, 'solsort.com', nodes);
  }
}
if(document.getElementById('solsortEntries')) {
  main();
}

// ## Main

exports.main = async () => {
  let html = await fetch('html.inc');
  html = await html.text();
  window.app.innerHTML = html;
  window.app.style.height= '270px';
  window.app.style.textAlign= 'center';
  window.app.style.overflow= 'auto';
  window.app.style.boxShadow= '2px 2px 8px rgba(0,0,0,0.5)';
  main();
}
