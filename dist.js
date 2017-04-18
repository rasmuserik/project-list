(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {



// ## Update

let main = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    let elem = document.getElementById('solsortEntries');
    if (elem) {
      let style = document.getElementById('solsort-project-list-style');
      if (!style) {
        style = document.createElement('style');
        style.innerHTML = exports.style;
        style.id = 'solsort-project-list-style';
        elem.insertBefore(style, elem.children[0]);
      }
      dates();
      let repos = yield exports.cachedGithubRepos('solsort');
      let nodes = document.getElementById('solsortEntries');
      exports.renderRepos(repos, 'solsort.com', nodes);
    }
  });

  return function main() {
    return _ref2.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// # Project list
//
// Read and render repositories for a given github user/organisation.
//
// Motivation: I want an automatically updated list of projects on <http://solsort.com>.
//
// ## Retrieve repository list
//
// We cache the results to `localStorage` for an hour, as only 60 requests are allowed per hour, for non-logged-in users.

exports.cachedGithubRepos = (() => {
  var _ref = _asyncToGenerator(function* (user) {
    let result = localStorage.getItem('githubRepos');
    let prevTime = +(localStorage.getItem('githubReposTimeStamp') || 0);
    if (prevTime < Date.now() - 60 * 60 * 1000) {

      let repos = [];
      let current;
      let i = 1;
      do {
        current = yield fetch(`https://api.github.com/users/${user}/repos?page=${i}`);
        current = yield current.json();
        repos = repos.concat(current);
        ++i;
      } while (current.length > 0);

      result = JSON.stringify(repos);
      localStorage.setItem('githubRepos', result);
      localStorage.setItem('githubReposTimeStamp', Date.now());
    }
    return JSON.parse(result);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

// ## Render list of repositories
//
// Create HTML-string, with icon, link and title for the repositories sorted by creation time.
//
// We assume that `$REPOSITORY` has an icon at `http://$REPOSITORY.$DOMAIN/icon.png`, and a website at `http://$REPOSITORY.$DOMAIN/`.

exports.renderRepos = (repos, domain, parent) => {
  repos.sort((a, b) => a.created_at > b.created_at ? -1 : 1);
  let nodes = parent.children;
  let entries = [];
  for (let i = 0; i < repos.length; ++i) {
    let repo = repos[i];

    let j = 1;
    while (j < nodes.length && nodes[j] && repo.created_at < nodes[j].textContent.trim()) {
      ++j;
    }
    let elem = document.createElement('a');
    elem.style.textAlign = 'left';
    elem.href = 'http://' + repo.name + '.' + domain;
    elem.id = 'entry-' + repo.name;
    elem.innerHTML = `<div>
    <img src=http://${repo.name}.${domain}/icon.png>
    <div class=date>${repo.created_at.slice(0, 10)}</div>
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
  for (let i = 0; i < nodes.length; ++i) {
    let node = nodes[i].children[0];
    if (node) {
      let html = node.innerHTML;
      html = html.replace(/^(20[0-9]+ [0-9]+ [0-9]+)?/, o => `<div class=date>${o.replace(/ /g, '-')} <br></div>`);
      node.innerHTML = html;
    }
  }
}
if (document.getElementById('solsortEntries')) {
  main();
}

// ## Main

exports.main = _asyncToGenerator(function* () {
  let html = yield fetch('html.inc');
  html = yield html.text();
  window.app.innerHTML = html;
  window.app.style.height = '270px';
  window.app.style.textAlign = 'center';
  window.app.style.overflow = 'auto';
  window.app.style.boxShadow = '2px 2px 8px rgba(0,0,0,0.5)';
  main();
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});
//# sourceMappingURL=dist.js.map