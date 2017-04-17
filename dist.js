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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// # project-list
//
// Read and render repositories for a given github user/organisation.
//
// Motivation: I want an automatically updated list of projects on my web-page.
//
// ## Retrieve repository list
//
// We cache the results to `localStorage` for 10 minutes, as only 60 requests are allowed per hour, for non-logged-in users.

exports.cachedGithubRepos = (() => {
  var _ref = _asyncToGenerator(function* (user) {

    let result = localStorage.getItem('githubRepos');
    let prevTime = +(localStorage.getItem('githubReposTimeStamp') || 0);
    if (prevTime < Date.now() - 10 * 60 * 1000) {

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

exports.renderRepos = (repos, domain) => {
  repos.sort((a, b) => a.created_at > b.created_at ? -1 : 1);
  let entries = [];
  for (let i = 0; i < repos.length; ++i) {
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

exports.main = _asyncToGenerator(function* () {
  let repos = yield exports.cachedGithubRepos('solsort');
  let html = exports.renderRepos(repos, 'solsort.com');
  window.app.innerHTML = '<style>' + exports.style + '</style>' + html;
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});
//# sourceMappingURL=dist.js.map