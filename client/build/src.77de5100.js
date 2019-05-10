// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../node_modules/terminaltxt/dist/terminaltxt.js":[function(require,module,exports) {
var define;
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.terminaltxt=e():t.terminaltxt=e()}(window,function(){return function(t){var e={};function i(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);var n,r=function(){function t(e,i){if(void 0===e&&(e=t.getDefaultCharacterSet()),"string"==typeof e){for(var n=[],r=0;r<e.length;r++){var o=e.charCodeAt(r);-1===n.indexOf(o)&&n.push(o)}this.set=n}else this.set=e;this.unknown=i?"string"==typeof i?i.charCodeAt(0):i:"�".charCodeAt(0)}return t.getDefaultCharacterSet=function(){return[32,9608]},t.prototype.getIndex=function(t){return this.set.indexOf(t.charCodeAt(0))},t.prototype.getValue=function(t){return t>=0&&t<this.set.length?this.set[t]:this.unknown},t.prototype.size=function(){return this.set.length},t.prototype.toString=function(t){return String.fromCharCode(this.getValue(t))},t}();!function(t){t[t.KEYDOWN=0]="KEYDOWN",t[t.KEYUP=1]="KEYUP",t[t.KEYPRESS=2]="KEYPRESS"}(n||(n={}));var o,s=function(){function t(){this.actions=[],this.logKeys=!1,this.handleKey=this.handleKey.bind(this),document.addEventListener("keydown",this.handleKey),document.addEventListener("keyup",this.handleKey),document.addEventListener("keypress",this.handleKey)}return t.prototype.addAction=function(t){this.actions.push(t)},t.prototype.setLogKeys=function(t){this.logKeys=t},t.prototype.handleKey=function(t){this.logKeys&&console.log("InputTracker Key Log: '"+t.key+"', type: "+t.type);for(var e=0;e<this.actions.length;e++)-1!==this.actions[e].keys.indexOf(t.key)&&("keydown"===t.type&&this.actions[e].keyEventType===n.KEYDOWN?this.actions[e].action(t.key):"keyup"===t.type&&this.actions[e].keyEventType===n.KEYUP?this.actions[e].action(t.key):"keypress"===t.type&&this.actions[e].keyEventType===n.KEYPRESS&&this.actions[e].action(t.key))},t}(),h=function(){function t(e){void 0===e&&(e=t.defaultContainer()),this.container=e,this.pre=document.createElement("pre"),this.code=document.createElement("code"),this.display=document.createElement("span"),this.idNumber=t.getID(),this.container.appendChild(this.pre),this.pre.appendChild(this.code),this.code.appendChild(this.display),this.setIDs(),this.setClasses()}return t.defaultContainer=function(){var t=document.createElement("div");return document.body.appendChild(t),t},t.getID=function(){var e=t.idCounter;return t.idCounter++,e},t.prototype.clear=function(){this.display.innerHTML=""},t.prototype.setClasses=function(){this.container.classList.add("termtxt-container"),this.pre.classList.add("termtxt-pre"),this.code.classList.add("termtxt-code"),this.display.classList.add("termtxt-display")},t.prototype.setIDs=function(){var t;t=0===this.idNumber?"":"-"+this.idNumber.toString(),this.container.id="termtxt-container"+t,this.pre.id="termtxt-pre"+t,this.code.id="termtxt-code"+t,this.display.id="termtxt-display"+t},t.idCounter=0,t}(),a=(o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])})(t,e)},function(t,e){function i(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}),u=function(t){function e(e,i){void 0===e&&(e=-1);var n=this;return(n=i?t.call(this,i)||this:t.call(this)||this).maxLines=e,n.lines=[],n.addLine(),n.removeFirstChild(1),n}return a(e,t),e.prototype.addLine=function(t){void 0===t&&(t=""),this.display.appendChild(document.createTextNode("\n")),this.lines.push(document.createElement("span")),this.display.appendChild(this.lines[this.lines.length-1]),this.setCurrentLine(t)},e.prototype.appendCurrentLine=function(t){this.lines[this.lines.length-1].innerHTML+=t,this.checkForOverflow()},e.prototype.removeFirstLine=function(){this.removeFirstChild(2),this.lines.shift()},e.prototype.setCurrentLine=function(t){this.lines[this.lines.length-1].innerHTML=t,this.checkForOverflow()},e.prototype.checkForOverflow=function(){if(this.maxLines>=0)for(;this.lines.length>this.maxLines;)this.removeFirstLine()},e.prototype.removeFirstChild=function(t){for(var e=0;e<t;e++)this.display.removeChild(this.display.childNodes[0])},e}(h),l=function(){function t(t,e){void 0===t&&(t={}),void 0===e&&(e=""),this.linesToCheck=0,t.width?this.width=t.width:this.width=80,t.height?this.height=t.height:this.height=25,t.container?this.lineController=new u(this.height,t.container):this.lineController=new u(this.height),e.length>this.getWidth()&&(e=""),this.lineController.setCurrentLine(e)}return t.prototype.getHeight=function(){return this.height},t.prototype.getWidth=function(){return this.width<0?Number.MAX_VALUE:this.width},t.prototype.newLine=function(){this.lineController.addLine()},t.prototype.overwrite=function(t){var e;e=Math.ceil(t.length/this.getWidth())>this.linesToCheck?Math.ceil(t.length/this.getWidth()):this.linesToCheck;for(var i=0;i<=e;i++){var n=this.lineController.lines.length-(i+1);if(n>=0&&n<this.lineController.lines.length&&this.lineController.lines[n].innerHTML.substring(0,1)===t.substring(0,1)){var r=t.match(new RegExp(".{1,"+this.getWidth()+"}","g"));if(null!==r){for(var o=0;o<r.length;o++)n+o<this.lineController.lines.length?this.lineController.lines[n+o].innerHTML=r[o]:this.writeln(r[o]);for(o=r.length;o<=i;o++)n+o<this.lineController.lines.length&&(this.lineController.lines[n+o].innerHTML="");return void(this.linesToCheck=r.length+1)}}}1===this.lineController.lines.length&&""===this.lineController.lines[0].innerHTML?this.write(t):this.writeln(t)},t.prototype.resetLinesToCheck=function(){this.linesToCheck=0},t.prototype.write=function(t){var e=this.lineController.lines[this.lineController.lines.length-1].innerHTML.length;e+t.length<=this.getWidth()?this.lineController.appendCurrentLine(t):e===this.getWidth()?this.lineController.addLine(t):(this.lineController.appendCurrentLine(t.substring(0,this.getWidth()-e)),this.writeln(t.substring(this.getWidth()-e,t.length)))},t.prototype.writeln=function(t){if(t.length<=this.getWidth())this.lineController.addLine(t);else{var e=t.match(new RegExp(".{1,"+this.getWidth()+"}","g"));if(null!==e)for(var i=0;i<e.length;i++)this.lineController.addLine(e[i])}},t}(),c=function(){function t(t){void 0===t&&(t=new l),this.history=[],this.historyCounter=0,this.historyMax=100,this.current="",this.commands=[],this.input=new s,this.output=t,this.finalizeCurrent=this.finalizeCurrent.bind(this),this.addToCurrent=this.addToCurrent.bind(this),this.backspaceCurrent=this.backspaceCurrent.bind(this),this.historyForwards=this.historyForwards.bind(this),this.historyBack=this.historyBack.bind(this),this.helpCommand=this.helpCommand.bind(this),this.setupInput(),this.registerCommand({name:"help",description:"Provides information about available commands.",command:this.helpCommand,options:[{argument:"lookup",description:"Use to look up help pages for a specific registered command."}]}),this.update()}return t.indexOfCommandArgument=function(t,e){for(var i=0;i<e.length;i++)if(e[i].argument===t)return i;return-1},t.indexOfCommandArguments=function(e,i){for(var n=[],r=0;r<e.length;r++)n.push(t.indexOfCommandArgument(e[r],i));return n},t.prototype.finalizeCurrent=function(t){for(var e=-1,i=this.current.split(" "),n=0;n<this.commands.length;n++)if(this.commands[n].name.toLowerCase()===i[0].toLowerCase()){var r=this.parseArguments(i);e=this.commands[n].command(this.output,r);break}-1===e?this.output.writeln("no '"+this.current+"' found, please try again or enter 'help' for more information."):e>0&&this.output.writeln("'"+i[0]+"' exit code ["+e+"]. Use 'help --lookup "+i[0]+"' for more information."),this.addToHistory(this.current),this.output.newLine(),this.output.resetLinesToCheck(),this.current="",this.update()},t.prototype.helpCommand=function(e,i){if(0===i.length){e.writeln("COMMAND HELP"),e.writeln("------------");for(var n=0;n<this.commands.length;n++)e.writeln("Command: "+this.commands[n].name),e.writeln("Description: "+this.commands[n].description);return e.writeln("Use 'help --lookup command-name' for more info on specific commands."),0}var r=t.indexOfCommandArguments(["lookup"],i);if(-1!==r[0]){var o=i[r[0]];if(void 0===o.parameters||1!==o.parameters.length)return e.writeln("Invalid number of arguments for help --lookup. Example: 'help --lookup command-name'."),-2;var s=null;for(n=0;n<this.commands.length;n++)this.commands[n].name===o.parameters[0]&&(s=this.commands[n]);if(null===s)return e.writeln(o.parameters[0]+" is not a command. Use 'help' to list commands."),-2;if(e.writeln("HELP for "+s.name),e.writeln("Description: "+s.description),e.writeln("OPTIONAL ARGUMENTS"),void 0!==s.options){e.writeln("Single letter optional arguments should be prefaced with '-' and multi-letter arguments should be prefaced with '--'.");for(n=0;n<s.options.length;n++)e.writeln("  arg: "+s.options[n].argument),e.writeln("  description: "+s.options[n].description)}else e.writeln("No optional arguments defined.");if(e.writeln("EXIT CODES"),void 0!==s.exitCodes)for(n=0;n<s.exitCodes.length;n++)e.writeln("  exit code: "+s.exitCodes[n].code),e.writeln("  description: "+s.exitCodes[n].description);else e.writeln("No exit codes defined.");return 0}return e.writeln("Invalid help command! Use 'help --lookup help' for more info."),-2},t.prototype.registerCommand=function(t){this.commands.push(t)},t.prototype.update=function(){this.output.overwrite("$ "+this.current)},t.prototype.addToCurrent=function(t){this.current=this.current+t,this.update()},t.prototype.addToHistory=function(t){this.history.push(t),this.history.length>this.historyMax&&this.history.shift(),this.historyCounter=this.history.length},t.prototype.backspaceCurrent=function(t){this.current=this.current.substring(0,this.current.length-1),this.update()},t.prototype.historyBack=function(t){this.history.length>0&&(this.historyCounter>0&&this.historyCounter--,this.current=this.history[this.historyCounter],this.update())},t.prototype.historyForwards=function(t){this.history.length>0&&(this.historyCounter<this.history.length-1&&this.historyCounter++,this.current=this.history[this.historyCounter],this.update())},t.prototype.parseArguments=function(t){for(var e=[],i=1;i<t.length;){if("--"===t[i].substring(0,2)){var n,r=[];for(n=t[i].substring(2),i++;i<t.length&&"-"!==t[i].substring(0,1);)r.push(t[i]),i++;i--,e.push({argument:n,parameters:r})}else if("-"===t[i].substring(0,1))for(var o=1;o<t[i].length;o++)e.push({argument:t[i].substring(o,o+1)});i++}return e},t.prototype.setupInput=function(){this.input.addAction({keys:["Backspace"],action:this.backspaceCurrent,keyEventType:n.KEYUP}),this.input.addAction({keys:["Enter"],action:this.finalizeCurrent,keyEventType:n.KEYPRESS}),this.input.addAction({keys:[" ","-","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"],action:this.addToCurrent,keyEventType:n.KEYPRESS}),this.input.addAction({keys:["ArrowUp"],action:this.historyBack,keyEventType:n.KEYUP}),this.input.addAction({keys:["ArrowDown"],action:this.historyForwards,keyEventType:n.KEYUP})},t}();function p(t,e,i){return t+e*i.getWidth()}var d=function(){var t=function(e,i){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])})(e,i)};return function(e,i){function n(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(n.prototype=i.prototype,new n)}}(),f=function(t){function e(e,i,n){var r=this;return(r=n?t.call(this,n)||this:t.call(this)||this).width=e,r.height=i,r.cells=[],r.initCells(),r}return d(e,t),e.prototype.getHeight=function(){return this.height},e.prototype.getWidth=function(){return this.width},e.prototype.setCellValue=function(t,e,i){var n;n=i?p(e,i,this):e,this.cells[n].innerHTML=t},e.prototype.setColor=function(t,e){this.cells[t].style.color=e},e.prototype.initCells=function(){for(var t=0;t<this.height;t++){for(var e=0;e<this.width;e++)this.cells.push(document.createElement("span")),this.display.appendChild(this.cells[this.cells.length-1]),this.cells[this.cells.length-1].id=t+"-"+e;this.display.appendChild(document.createTextNode("\n"))}},e}(h),y=function(){function t(t,e){this.changed=[],this.data=[],this.width=t,this.height=e,this.initData(),this.initChanged()}return t.prototype.doneChange=function(t){this.changed[t]=!1},t.prototype.getCell=function(t){return this.data[t]},t.prototype.getHeight=function(){return this.height},t.prototype.getWidth=function(){return this.width},t.prototype.hasBeenChanged=function(t){return this.changed[t]},t.prototype.numberOfCells=function(){return this.width*this.height},t.prototype.setCell=function(t,e){this.data[e]=t,this.changed[e]=!0},t.prototype.initChanged=function(){this.changed=[];for(var t=0;t<this.width*this.height;t++)this.changed.push(!0)},t.prototype.initData=function(){this.data=[];for(var t=0;t<this.width*this.height;t++)this.data.push(0)},t}(),m=function(){function t(t,e){void 0===t&&(t={}),void 0===e&&(e=new r),t.width?this.width=t.width:this.width=80,t.height?this.height=t.height:this.height=25,t.container?this.cellController=new f(this.width,this.height,t.container):this.cellController=new f(this.width,this.height),this.cellData=new y(this.width,this.height),this.characterSet=e}return t.prototype.fill=function(t){var e;e="string"==typeof t?this.characterSet.getIndex(t):t>=0&&t<this.characterSet.set.length?t:-1;for(var i=0;i<this.width*this.height;i++)this.cellData.setCell(e,i)},t.prototype.fillColor=function(t){for(var e=0;e<this.width*this.height;e++)this.cellController.setColor(e,t)},t.prototype.getCharacterSet=function(){return this.characterSet},t.prototype.getHeight=function(){return this.height},t.prototype.getWidth=function(){return this.width},t.prototype.setCell=function(t,e,i){var n;n="string"==typeof t?this.characterSet.getIndex(t):t>=0&&t<this.characterSet.set.length?t:-1,this.cellData.setCell(n,p(e,i,this))},t.prototype.setCellColor=function(t,e,i){this.cellController.setColor(p(e,i,this),t)},t.prototype.update=function(){for(var t=0;t<this.cellData.numberOfCells();t++)this.cellData.hasBeenChanged(t)&&(this.cellController.setCellValue(this.characterSet.toString(this.cellData.getCell(t)),t),this.cellData.doneChange(t))},t}();function g(t,e,i){if(i<e){var n=e;e=i,i=n}return t>=e&&t<=i?t:t<e?e:i}function C(t,e,i,n,r){return(t-e)/(i-e)*(r-n)+n}function w(t,e,i,n,r){return g(C(t,e,i,n,r),n,r)}function v(t,e){return e&&t?Math.random()*(e-t)+t:t?Math.random()*t:Math.random()}var b=function(){function t(t,e){void 0===t&&(t=0),void 0===e&&(e=0),this.x=t,this.y=e}return t.copy=function(e){return new t(e.x,e.y)},t.prototype.add=function(t,e){"number"==typeof t&&e?(this.x+=t,this.y+=e):"object"==typeof t&&(this.x+=t.x,this.y+=t.y)},t.prototype.dot=function(t,e){var i=0,n=0;return"number"==typeof t&&e?(i=t,n=e):"object"==typeof t&&(i=t.x,n=t.y),this.x*i+this.y*n},t.prototype.magnitude=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},t.prototype.normalize=function(){var t=this.magnitude();0!==t&&this.scale(1/t)},t.prototype.scale=function(t){this.x*=t,this.y*=t},t.prototype.subtract=function(t,e){"number"==typeof t&&e?(this.x-=t,this.y-=e):"object"==typeof t&&(this.x-=t.x,this.y-=t.y)},t}(),x=function(){function t(t,e){this.init=t,e?(this.update=e,this.loopRunning=!0):(this.update=function(){},this.loopRunning=!1),this.lastUpdateTime=window.performance.now(),this.currentFrameRate=0,this.targetLoopTime=0,this.frameRate(30),this.runInit=this.runInit.bind(this),this.loop=this.loop.bind(this),"complete"===document.readyState?this.runInit():window.addEventListener("load",this.runInit,!1)}return t.prototype.frameRate=function(t){return t&&(this.targetLoopTime=1e3/t),this.currentFrameRate},t.prototype.running=function(t){this.loopRunning=t,this.loopRunning&&this.runLoop()},t.prototype.setUpdate=function(t){this.update=t},t.prototype.loop=function(){this.update(),this.currentFrameRate=1e3/window.performance.now()-this.lastUpdateTime,this.lastUpdateTime=window.performance.now(),this.runLoop()},t.prototype.runInit=function(){this.init(),this.runLoop()},t.prototype.runLoop=function(){if(this.loopRunning){var t=window.performance.now()-this.lastUpdateTime;t>this.targetLoopTime?setTimeout(this.loop,1):setTimeout(this.loop,this.targetLoopTime-t)}},t}();i.d(e,"CharacterSet",function(){return r}),i.d(e,"InputTracker",function(){return s}),i.d(e,"KeyEventType",function(){return n}),i.d(e,"CommandTracker",function(){return c}),i.d(e,"GraphicsTerminal",function(){return m}),i.d(e,"OutputTerminal",function(){return l}),i.d(e,"clamp",function(){return g}),i.d(e,"map",function(){return C}),i.d(e,"cmap",function(){return w}),i.d(e,"random",function(){return v}),i.d(e,"Vector2",function(){return b}),i.d(e,"Loop",function(){return x}),i.d(e,"getIndex",function(){return p})}])});
},{}],"index.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var terminaltxt_1 = require("terminaltxt");

var output = new terminaltxt_1.OutputTerminal();
output.write('hello');
},{"terminaltxt":"../../node_modules/terminaltxt/dist/terminaltxt.js"}],"../../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51640" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../node_modules/parcel/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map