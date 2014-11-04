(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("can"), require("bacon"), require("can.bacon"));
	else if(typeof define === 'function' && define.amd)
		define(["can", "bacon", "can.bacon"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("can"), require("bacon"), require("can.bacon")) : factory(root["can"], root["Bacon"], root["can.bacon"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __moduleName = "src/index";
	var can = __webpack_require__(1);
	var Bacon = __webpack_require__(2);
	__webpack_require__(3);
	can.makeDataViewStreamFromStream = function(stream, map) {
	  var mapping = [];
	  var removeStream = stream.filter(function(ev) {
	    return ev.how === "remove";
	  }).map(function(event) {
	    var mappedIndex = findMappedIndex(mapping, event.index),
	        mappedCount = findMappedCount(mapping, mappedIndex, event.value.length);
	    mapping.splice(event.index, event.value.length).forEach(function(c) {
	      c.unbind("change");
	    });
	    return {
	      how: "splice",
	      howMany: mappedCount,
	      index: mappedIndex,
	      value: []
	    };
	  });
	  var changeStream = stream.filter(function(ev) {
	    return ~["add", "set"].indexOf(ev.how);
	  }).withHandler(function(event) {
	    if (event.isEnd()) {
	      return;
	    }
	    event = event.value();
	    var handler = this;
	    event.value.forEach(function(val, i) {
	      var lastCount = 0;
	      var compute = can.compute(function() {
	        var newItems;
	        if (map.length > 1) {
	          newItems = [];
	          map(val, function(val) {
	            newItems.push(val);
	          });
	        } else {
	          newItems = [map(val)];
	        }
	        handler.push(new Bacon.Next({
	          howMany: lastCount,
	          computeIndex: mapping.indexOf(compute),
	          value: newItems
	        }));
	        lastCount = newItems.length;
	        return lastCount;
	      });
	      mapping.splice(event.index + i, event.how === "add" ? 0 : 1, compute).forEach(function(c) {
	        c.unbind("change");
	      });
	      compute.bind("change", function() {});
	    });
	  }).map(function(ev) {
	    return {
	      how: "splice",
	      howMany: ev.howMany,
	      value: ev.value,
	      index: findMappedIndex(mapping, ev.computeIndex)
	    };
	  });
	  return removeStream.merge(changeStream);
	};
	can.List.prototype.toDataViewStream = function(mapper) {
	  return can.makeDataViewStreamFromStream(this.bind("add").merge(this.bind("remove")).merge(this.bind("set")), mapper);
	};
	can.List.prototype.toDataViewList = function(mapper) {
	  return this.toDataViewStream(mapper).toList();
	};
	function findMappedIndex(mapping, index) {
	  var mappedIndex = 0;
	  for (var i = 0; i < index; i++) {
	    mappedIndex += (mapping[i] || function() {
	      return 0;
	    })();
	  }
	  return mappedIndex;
	}
	function findMappedCount(mapping, mappedIndex, length) {
	  var mappedCount = 0;
	  for (var i = mappedIndex; i < mappedIndex + length; i++) {
	    mappedCount += (mapping[i] || function() {
	      return 0;
	    })();
	  }
	  return mappedCount;
	}
	


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});

//# sourceMappingURL=can.dataview.js.map