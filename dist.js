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

let cachedGithubRepos = (() => {
  var _ref = _asyncToGenerator(function* (user) {
    let result = localStorage.getItem('githubRepos');
    let prevTime = +(localStorage.getItem('githubReposTimeStamp') || 0);
    if (prevTime < Date.now() - 10 * 60 * 1000) {
      let repos = [];
      let current;
      let i = 1;
      do {
        current = yield fetch(`https://api.github.com/users/${user}/repos?page=${i}`);
        ++i;
        current = yield current.json();
        repos = repos.concat(current);
      } while (current.length > 0);
      result = JSON.stringify(repos);
      localStorage.setItem('githubRepos', result);
      localStorage.setItem('githubReposTimeStamp', Date.now());
    }
    return JSON.parse(result);
  });

  return function cachedGithubRepos(_x) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// # project-list
//
console.log('hello');

function renderRepos(repos) {
  repos.sort((a, b) => a.created_at > b.created_at ? -1 : 1);
  let entries = [];
  for (let i = 0; i < repos.length; ++i) {
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

exports.main = _asyncToGenerator(function* () {
  let repos = yield cachedGithubRepos('solsort');
  let str = renderRepos(repos);
  window.app.innerHTML = str;
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});
//# sourceMappingURL=dist.js.map