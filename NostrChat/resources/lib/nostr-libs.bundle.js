(function () {
	'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var lib$1 = {};

	var types = {};

	var hasRequiredTypes;

	function requireTypes () {
		if (hasRequiredTypes) return types;
		hasRequiredTypes = 1;
		Object.defineProperty(types, "__esModule", { value: true });
		
		return types;
	}

	var ee = {};

	var taskCollection$1 = {};

	var taskCollection = {};

	var utils$1 = {};

	var hasRequiredUtils$1;

	function requireUtils$1 () {
		if (hasRequiredUtils$1) return utils$1;
		hasRequiredUtils$1 = 1;
		Object.defineProperty(utils$1, "__esModule", { value: true });
		utils$1._fast_remove_single = void 0;
		function _fast_remove_single(arr, index) {
		    if (index === -1)
		        return;
		    if (index === 0)
		        arr.shift();
		    else if (index === arr.length - 1)
		        arr.length = arr.length - 1;
		    else
		        arr.splice(index, 1);
		}
		utils$1._fast_remove_single = _fast_remove_single;
		
		return utils$1;
	}

	var bakeCollection = {};

	var hasRequiredBakeCollection;

	function requireBakeCollection () {
		if (hasRequiredBakeCollection) return bakeCollection;
		hasRequiredBakeCollection = 1;
		(function (exports$1) {
			Object.defineProperty(exports$1, "__esModule", { value: true });
			exports$1.bakeCollectionVariadic = exports$1.bakeCollectionAwait = exports$1.bakeCollection = exports$1.BAKED_EMPTY_FUNC = void 0;
			exports$1.BAKED_EMPTY_FUNC = (function () { });
			var FORLOOP_FALLBACK = 1500;
			function generateArgsDefCode(numArgs) {
			    var argsDefCode = '';
			    if (numArgs === 0)
			        return argsDefCode;
			    for (var i = 0; i < numArgs - 1; ++i) {
			        argsDefCode += ('arg' + String(i) + ', ');
			    }
			    argsDefCode += ('arg' + String(numArgs - 1));
			    return argsDefCode;
			}
			function generateBodyPartsCode(argsDefCode, collectionLength) {
			    var funcDefCode = '', funcCallCode = '';
			    for (var i = 0; i < collectionLength; ++i) {
			        funcDefCode += "var f".concat(i, " = collection[").concat(i, "];\n");
			        funcCallCode += "f".concat(i, "(").concat(argsDefCode, ")\n");
			    }
			    return { funcDefCode: funcDefCode, funcCallCode: funcCallCode };
			}
			function generateBodyPartsVariadicCode(collectionLength) {
			    var funcDefCode = '', funcCallCode = '';
			    for (var i = 0; i < collectionLength; ++i) {
			        funcDefCode += "var f".concat(i, " = collection[").concat(i, "];\n");
			        funcCallCode += "f".concat(i, ".apply(undefined, arguments)\n");
			    }
			    return { funcDefCode: funcDefCode, funcCallCode: funcCallCode };
			}
			function bakeCollection(collection, fixedArgsNum) {
			    if (collection.length === 0)
			        return exports$1.BAKED_EMPTY_FUNC;
			    else if (collection.length === 1)
			        return collection[0];
			    var funcFactoryCode;
			    if (collection.length < FORLOOP_FALLBACK) {
			        var argsDefCode = generateArgsDefCode(fixedArgsNum);
			        var _a = generateBodyPartsCode(argsDefCode, collection.length), funcDefCode = _a.funcDefCode, funcCallCode = _a.funcCallCode;
			        funcFactoryCode = "(function(collection) {\n            ".concat(funcDefCode, "\n            collection = undefined;\n            return (function(").concat(argsDefCode, ") {\n                ").concat(funcCallCode, "\n            });\n        })");
			    }
			    else {
			        var argsDefCode = generateArgsDefCode(fixedArgsNum);
			        // loop unroll
			        if (collection.length % 10 === 0) {
			            funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; i += 10) {\n                        collection[i](").concat(argsDefCode, ");\n                        collection[i+1](").concat(argsDefCode, ");\n                        collection[i+2](").concat(argsDefCode, ");\n                        collection[i+3](").concat(argsDefCode, ");\n                        collection[i+4](").concat(argsDefCode, ");\n                        collection[i+5](").concat(argsDefCode, ");\n                        collection[i+6](").concat(argsDefCode, ");\n                        collection[i+7](").concat(argsDefCode, ");\n                        collection[i+8](").concat(argsDefCode, ");\n                        collection[i+9](").concat(argsDefCode, ");\n                    }\n                });\n            })");
			        }
			        else if (collection.length % 4 === 0) {
			            funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; i += 4) {\n                        collection[i](").concat(argsDefCode, ");\n                        collection[i+1](").concat(argsDefCode, ");\n                        collection[i+2](").concat(argsDefCode, ");\n                        collection[i+3](").concat(argsDefCode, ");\n                    }\n                });\n            })");
			        }
			        else if (collection.length % 3 === 0) {
			            funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; i += 3) {\n                        collection[i](").concat(argsDefCode, ");\n                        collection[i+1](").concat(argsDefCode, ");\n                        collection[i+2](").concat(argsDefCode, ");\n                    }\n                });\n            })");
			        }
			        else {
			            funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; ++i) {\n                        collection[i](").concat(argsDefCode, ");\n                    }\n                });\n            })");
			        }
			    }
			    {
			        var funcFactory = eval(funcFactoryCode);
			        return funcFactory(collection);
			    }
			}
			exports$1.bakeCollection = bakeCollection;
			function bakeCollectionAwait(collection, fixedArgsNum) {
			    if (collection.length === 0)
			        return exports$1.BAKED_EMPTY_FUNC;
			    else if (collection.length === 1)
			        return collection[0];
			    var funcFactoryCode;
			    if (collection.length < FORLOOP_FALLBACK) {
			        var argsDefCode = generateArgsDefCode(fixedArgsNum);
			        var _a = generateBodyPartsCode(argsDefCode, collection.length), funcDefCode = _a.funcDefCode, funcCallCode = _a.funcCallCode;
			        funcFactoryCode = "(function(collection) {\n            ".concat(funcDefCode, "\n            collection = undefined;\n            return (function(").concat(argsDefCode, ") {\n                return Promise.all([ ").concat(funcCallCode, " ]);\n            });\n        })");
			    }
			    else {
			        var argsDefCode = generateArgsDefCode(fixedArgsNum);
			        funcFactoryCode = "(function(collection) {\n            return (function(".concat(argsDefCode, ") {\n                var promises = Array(collection.length);\n                for (var i = 0; i < collection.length; ++i) {\n                    promises[i] = collection[i](").concat(argsDefCode, ");\n                }\n                return Promise.all(promises);\n            });\n        })");
			    }
			    {
			        var funcFactory = eval(funcFactoryCode);
			        return funcFactory(collection);
			    }
			}
			exports$1.bakeCollectionAwait = bakeCollectionAwait;
			function bakeCollectionVariadic(collection) {
			    if (collection.length === 0)
			        return exports$1.BAKED_EMPTY_FUNC;
			    else if (collection.length === 1)
			        return collection[0];
			    var funcFactoryCode;
			    if (collection.length < FORLOOP_FALLBACK) {
			        var _a = generateBodyPartsVariadicCode(collection.length), funcDefCode = _a.funcDefCode, funcCallCode = _a.funcCallCode;
			        funcFactoryCode = "(function(collection) {\n            ".concat(funcDefCode, "\n            collection = undefined;\n            return (function() {\n                ").concat(funcCallCode, "\n            });\n        })");
			    }
			    else {
			        funcFactoryCode = "(function(collection) {\n            return (function() {\n                for (var i = 0; i < collection.length; ++i) {\n                    collection[i].apply(undefined, arguments);\n                }\n            });\n        })";
			    }
			    {
			        var funcFactory = eval(funcFactoryCode);
			        return funcFactory(collection);
			    }
			}
			exports$1.bakeCollectionVariadic = bakeCollectionVariadic;
			
		} (bakeCollection));
		return bakeCollection;
	}

	var hasRequiredTaskCollection$1;

	function requireTaskCollection$1 () {
		if (hasRequiredTaskCollection$1) return taskCollection;
		hasRequiredTaskCollection$1 = 1;
		var __spreadArray = (taskCollection && taskCollection.__spreadArray) || function (to, from, pack) {
		    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
		        if (ar || !(i in from)) {
		            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
		            ar[i] = from[i];
		        }
		    }
		    return to.concat(ar || Array.prototype.slice.call(from));
		};
		Object.defineProperty(taskCollection, "__esModule", { value: true });
		taskCollection.TaskCollection = void 0;
		var utils_1 = requireUtils$1();
		var bake_collection_1 = requireBakeCollection();
		function push_norebuild(a, b /*, ...func: Func[] */) {
		    var len = this.length;
		    if (len > 1) { // tasks is array
		        if (b) { // if multiple args
		            var _a;
		            (_a = this._tasks).push.apply(_a, arguments);
		            this.length += arguments.length;
		        }
		        else { // if single arg (most often case)
		            this._tasks.push(a);
		            this.length++;
		        }
		    }
		    else { // tasks is (function or null)
		        if (b) { // if multiple args
		            if (len === 1) { // if this._tasks is function
		                var newAr = Array(1 + arguments.length);
		                newAr.push(newAr);
		                newAr.push.apply(newAr, arguments);
		                this._tasks = newAr;
		            }
		            else {
		                var newAr = Array(arguments.length);
		                newAr.push.apply(newAr, arguments);
		                this._tasks = newAr;
		            }
		            this.length += arguments.length;
		        }
		        else { // if single arg (most often case)
		            if (len === 1)
		                this._tasks = [this._tasks, a];
		            else
		                this._tasks = a;
		            this.length++;
		        }
		    }
		}
		function push_rebuild(a, b /*, ...func: Func[] */) {
		    var len = this.length;
		    if (len > 1) { // tasks is array
		        if (b) { // if multiple args
		            var _a;
		            (_a = this._tasks).push.apply(_a, arguments);
		            this.length += arguments.length;
		        }
		        else { // if single arg (most often case)
		            this._tasks.push(a);
		            this.length++;
		        }
		    }
		    else { // tasks is (function or null)
		        if (b) { // if multiple args
		            if (len === 1) { // if this._tasks is function
		                var newAr = Array(1 + arguments.length);
		                newAr.push(newAr);
		                newAr.push.apply(newAr, arguments);
		                this._tasks = newAr;
		            }
		            else {
		                var newAr = Array(arguments.length);
		                newAr.push.apply(newAr, arguments);
		                this._tasks = newAr;
		            }
		            this.length += arguments.length;
		        }
		        else { // if single arg (most often case)
		            if (len === 1)
		                this._tasks = [this._tasks, a];
		            else
		                this._tasks = a;
		            this.length++;
		        }
		    }
		    if (this.firstEmitBuildStrategy)
		        this.call = rebuild_on_first_call;
		    else
		        this.rebuild();
		}
		function removeLast_norebuild(a) {
		    if (this.length === 0)
		        return;
		    if (this.length === 1) {
		        if (this._tasks === a) {
		            this.length = 0;
		        }
		    }
		    else {
		        (0, utils_1._fast_remove_single)(this._tasks, this._tasks.lastIndexOf(a));
		        if (this._tasks.length === 1) {
		            this._tasks = this._tasks[0];
		            this.length = 1;
		        }
		        else
		            this.length = this._tasks.length;
		    }
		}
		function removeLast_rebuild(a) {
		    if (this.length === 0)
		        return;
		    if (this.length === 1) {
		        if (this._tasks === a) {
		            this.length = 0;
		        }
		        if (this.firstEmitBuildStrategy) {
		            this.call = bake_collection_1.BAKED_EMPTY_FUNC;
		            return;
		        }
		        else {
		            this.rebuild();
		            return;
		        }
		    }
		    else {
		        (0, utils_1._fast_remove_single)(this._tasks, this._tasks.lastIndexOf(a));
		        if (this._tasks.length === 1) {
		            this._tasks = this._tasks[0];
		            this.length = 1;
		        }
		        else
		            this.length = this._tasks.length;
		    }
		    if (this.firstEmitBuildStrategy)
		        this.call = rebuild_on_first_call;
		    else
		        this.rebuild();
		}
		function insert_norebuild(index) {
		    var _b;
		    var func = [];
		    for (var _i = 1; _i < arguments.length; _i++) {
		        func[_i - 1] = arguments[_i];
		    }
		    if (this.length === 0) {
		        this._tasks = func;
		        this.length = 1;
		    }
		    else if (this.length === 1) {
		        func.unshift(this._tasks);
		        this._tasks = func;
		        this.length = this._tasks.length;
		    }
		    else {
		        (_b = this._tasks).splice.apply(_b, __spreadArray([index, 0], func, false));
		        this.length = this._tasks.length;
		    }
		}
		function insert_rebuild(index) {
		    var _b;
		    var func = [];
		    for (var _i = 1; _i < arguments.length; _i++) {
		        func[_i - 1] = arguments[_i];
		    }
		    if (this.length === 0) {
		        this._tasks = func;
		        this.length = 1;
		    }
		    else if (this.length === 1) {
		        func.unshift(this._tasks);
		        this._tasks = func;
		        this.length = this._tasks.length;
		    }
		    else {
		        (_b = this._tasks).splice.apply(_b, __spreadArray([index, 0], func, false));
		        this.length = this._tasks.length;
		    }
		    if (this.firstEmitBuildStrategy)
		        this.call = rebuild_on_first_call;
		    else
		        this.rebuild();
		}
		function rebuild_noawait() {
		    if (this.length === 0)
		        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
		    else if (this.length === 1)
		        this.call = this._tasks;
		    else
		        this.call = (0, bake_collection_1.bakeCollection)(this._tasks, this.argsNum);
		}
		function rebuild_await() {
		    if (this.length === 0)
		        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
		    else if (this.length === 1)
		        this.call = this._tasks;
		    else
		        this.call = (0, bake_collection_1.bakeCollectionAwait)(this._tasks, this.argsNum);
		}
		function rebuild_on_first_call() {
		    this.rebuild();
		    this.call.apply(undefined, arguments);
		}
		var TaskCollection = /** @class */ (function () {
		    function TaskCollection(argsNum, autoRebuild, initialTasks, awaitTasks) {
		        if (autoRebuild === void 0) { autoRebuild = true; }
		        if (initialTasks === void 0) { initialTasks = null; }
		        if (awaitTasks === void 0) { awaitTasks = false; }
		        this.awaitTasks = awaitTasks;
		        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
		        this.argsNum = argsNum;
		        this.firstEmitBuildStrategy = true;
		        if (awaitTasks)
		            this.rebuild = rebuild_await.bind(this);
		        else
		            this.rebuild = rebuild_noawait.bind(this);
		        this.setAutoRebuild(autoRebuild);
		        if (initialTasks) {
		            if (typeof initialTasks === 'function') {
		                this._tasks = initialTasks;
		                this.length = 1;
		            }
		            else {
		                this._tasks = initialTasks;
		                this.length = initialTasks.length;
		            }
		        }
		        else {
		            this._tasks = null;
		            this.length = 0;
		        }
		        if (autoRebuild)
		            this.rebuild();
		    }
		    return TaskCollection;
		}());
		taskCollection.TaskCollection = TaskCollection;
		function fastClear() {
		    this._tasks = null;
		    this.length = 0;
		    this.call = bake_collection_1.BAKED_EMPTY_FUNC;
		}
		function clear() {
		    this._tasks = null;
		    this.length = 0;
		    this.call = bake_collection_1.BAKED_EMPTY_FUNC;
		}
		function growArgsNum(argsNum) {
		    if (this.argsNum < argsNum) {
		        this.argsNum = argsNum;
		        if (this.firstEmitBuildStrategy)
		            this.call = rebuild_on_first_call;
		        else
		            this.rebuild();
		    }
		}
		function setAutoRebuild(newVal) {
		    if (newVal) {
		        this.push = push_rebuild.bind(this);
		        this.insert = insert_rebuild.bind(this);
		        this.removeLast = removeLast_rebuild.bind(this);
		    }
		    else {
		        this.push = push_norebuild.bind(this);
		        this.insert = insert_norebuild.bind(this);
		        this.removeLast = removeLast_norebuild.bind(this);
		    }
		}
		function tasksAsArray() {
		    if (this.length === 0)
		        return [];
		    if (this.length === 1)
		        return [this._tasks];
		    return this._tasks;
		}
		function setTasks(tasks) {
		    if (tasks.length === 0) {
		        this.length = 0;
		        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
		    }
		    else if (tasks.length === 1) {
		        this.length = 1;
		        this.call = tasks[0];
		        this._tasks = tasks[0];
		    }
		    else {
		        this.length = tasks.length;
		        this._tasks = tasks;
		        if (this.firstEmitBuildStrategy)
		            this.call = rebuild_on_first_call;
		        else
		            this.rebuild();
		    }
		}
		TaskCollection.prototype.fastClear = fastClear;
		TaskCollection.prototype.clear = clear;
		TaskCollection.prototype.growArgsNum = growArgsNum;
		TaskCollection.prototype.setAutoRebuild = setAutoRebuild;
		TaskCollection.prototype.tasksAsArray = tasksAsArray;
		TaskCollection.prototype.setTasks = setTasks;
		
		return taskCollection;
	}

	var hasRequiredTaskCollection;

	function requireTaskCollection () {
		if (hasRequiredTaskCollection) return taskCollection$1;
		hasRequiredTaskCollection = 1;
		(function (exports$1) {
			var __createBinding = (taskCollection$1 && taskCollection$1.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (taskCollection$1 && taskCollection$1.__exportStar) || function(m, exports$1) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
			};
			Object.defineProperty(exports$1, "__esModule", { value: true });
			__exportStar(requireTaskCollection$1(), exports$1);
			
		} (taskCollection$1));
		return taskCollection$1;
	}

	var utils = {};

	var hasRequiredUtils;

	function requireUtils () {
		if (hasRequiredUtils) return utils;
		hasRequiredUtils = 1;
		Object.defineProperty(utils, "__esModule", { value: true });
		utils.nullObj = void 0;
		function nullObj() {
		    var x = {};
		    x.__proto__ = null;
		    return x;
		}
		utils.nullObj = nullObj;
		
		return utils;
	}

	var hasRequiredEe;

	function requireEe () {
		if (hasRequiredEe) return ee;
		hasRequiredEe = 1;
		var __spreadArray = (ee && ee.__spreadArray) || function (to, from, pack) {
		    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
		        if (ar || !(i in from)) {
		            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
		            ar[i] = from[i];
		        }
		    }
		    return to.concat(ar || Array.prototype.slice.call(from));
		};
		Object.defineProperty(ee, "__esModule", { value: true });
		ee.EventEmitter = void 0;
		var task_collection_1 = requireTaskCollection();
		var utils_1 = requireUtils$1();
		var utils_2 = requireUtils();
		function emit(event, a, b, c, d, e) {
		    var ev = this.events[event];
		    if (ev) {
		        if (ev.length === 0)
		            return false;
		        if (ev.argsNum < 6) {
		            ev.call(a, b, c, d, e);
		        }
		        else {
		            var arr = new Array(ev.argsNum);
		            for (var i = 0, len = arr.length; i < len; ++i) {
		                arr[i] = arguments[i + 1];
		            }
		            ev.call.apply(undefined, arr);
		        }
		        return true;
		    }
		    return false;
		}
		function emitHasOnce(event, a, b, c, d, e) {
		    var ev = this.events[event];
		    var argsArr;
		    if (ev !== undefined) {
		        if (ev.length === 0)
		            return false;
		        if (ev.argsNum < 6) {
		            ev.call(a, b, c, d, e);
		        }
		        else {
		            argsArr = new Array(ev.argsNum);
		            for (var i = 0, len = argsArr.length; i < len; ++i) {
		                argsArr[i] = arguments[i + 1];
		            }
		            ev.call.apply(undefined, argsArr);
		        }
		    }
		    var oev = this.onceEvents[event];
		    if (oev) {
		        if (typeof oev === 'function') {
		            this.onceEvents[event] = undefined;
		            if (arguments.length < 6) {
		                oev(a, b, c, d, e);
		            }
		            else {
		                if (argsArr === undefined) {
		                    argsArr = new Array(arguments.length - 1);
		                    for (var i = 0, len = argsArr.length; i < len; ++i) {
		                        argsArr[i] = arguments[i + 1];
		                    }
		                }
		                oev.apply(undefined, argsArr);
		            }
		        }
		        else {
		            var fncs = oev;
		            this.onceEvents[event] = undefined;
		            if (arguments.length < 6) {
		                for (var i = 0; i < fncs.length; ++i) {
		                    fncs[i](a, b, c, d, e);
		                }
		            }
		            else {
		                if (argsArr === undefined) {
		                    argsArr = new Array(arguments.length - 1);
		                    for (var i = 0, len = argsArr.length; i < len; ++i) {
		                        argsArr[i] = arguments[i + 1];
		                    }
		                }
		                for (var i = 0; i < fncs.length; ++i) {
		                    fncs[i].apply(undefined, argsArr);
		                }
		            }
		        }
		        return true;
		    }
		    return ev !== undefined;
		}
		/** Implemented event emitter */
		var EventEmitter = /** @class */ (function () {
		    function EventEmitter() {
		        this.events = (0, utils_2.nullObj)();
		        this.onceEvents = (0, utils_2.nullObj)();
		        this._symbolKeys = new Set;
		        this.maxListeners = Infinity;
		    }
		    Object.defineProperty(EventEmitter.prototype, "_eventsCount", {
		        get: function () {
		            return this.eventNames().length;
		        },
		        enumerable: false,
		        configurable: true
		    });
		    return EventEmitter;
		}());
		ee.EventEmitter = EventEmitter;
		function once(event, listener) {
		    if (this.emit === emit) {
		        this.emit = emitHasOnce;
		    }
		    switch (typeof this.onceEvents[event]) {
		        case 'undefined':
		            this.onceEvents[event] = listener;
		            if (typeof event === 'symbol')
		                this._symbolKeys.add(event);
		            break;
		        case 'function':
		            this.onceEvents[event] = [this.onceEvents[event], listener];
		            break;
		        case 'object':
		            this.onceEvents[event].push(listener);
		    }
		    return this;
		}
		function addListener(event, listener, argsNum) {
		    if (argsNum === void 0) { argsNum = listener.length; }
		    if (typeof listener !== 'function')
		        throw new TypeError('The listener must be a function');
		    var evtmap = this.events[event];
		    if (!evtmap) {
		        this.events[event] = new task_collection_1.TaskCollection(argsNum, true, listener, false);
		        if (typeof event === 'symbol')
		            this._symbolKeys.add(event);
		    }
		    else {
		        evtmap.push(listener);
		        evtmap.growArgsNum(argsNum);
		        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length)
		            console.warn("Maximum event listeners for \"".concat(String(event), "\" event!"));
		    }
		    return this;
		}
		function removeListener(event, listener) {
		    var evt = this.events[event];
		    if (evt) {
		        evt.removeLast(listener);
		    }
		    var evto = this.onceEvents[event];
		    if (evto) {
		        if (typeof evto === 'function') {
		            this.onceEvents[event] = undefined;
		        }
		        else if (typeof evto === 'object') {
		            if (evto.length === 1 && evto[0] === listener) {
		                this.onceEvents[event] = undefined;
		            }
		            else {
		                (0, utils_1._fast_remove_single)(evto, evto.lastIndexOf(listener));
		            }
		        }
		    }
		    return this;
		}
		function addListenerBound(event, listener, bindTo, argsNum) {
		    if (bindTo === void 0) { bindTo = this; }
		    if (argsNum === void 0) { argsNum = listener.length; }
		    if (!this.boundFuncs)
		        this.boundFuncs = new Map;
		    var bound = listener.bind(bindTo);
		    this.boundFuncs.set(listener, bound);
		    return this.addListener(event, bound, argsNum);
		}
		function removeListenerBound(event, listener) {
		    var _a, _b;
		    var bound = (_a = this.boundFuncs) === null || _a === void 0 ? void 0 : _a.get(listener);
		    (_b = this.boundFuncs) === null || _b === void 0 ? void 0 : _b.delete(listener);
		    return this.removeListener(event, bound);
		}
		function hasListeners(event) {
		    return this.events[event] && !!this.events[event].length;
		}
		function prependListener(event, listener, argsNum) {
		    if (argsNum === void 0) { argsNum = listener.length; }
		    if (typeof listener !== 'function')
		        throw new TypeError('The listener must be a function');
		    var evtmap = this.events[event];
		    if (!evtmap || !(evtmap instanceof task_collection_1.TaskCollection)) {
		        evtmap = this.events[event] = new task_collection_1.TaskCollection(argsNum, true, listener, false);
		        if (typeof event === 'symbol')
		            this._symbolKeys.add(event);
		    }
		    else {
		        evtmap.insert(0, listener);
		        evtmap.growArgsNum(argsNum);
		        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length)
		            console.warn("Maximum event listeners for \"".concat(String(event), "\" event!"));
		    }
		    return this;
		}
		function prependOnceListener(event, listener) {
		    if (this.emit === emit) {
		        this.emit = emitHasOnce;
		    }
		    var evtmap = this.onceEvents[event];
		    if (!evtmap) {
		        this.onceEvents[event] = [listener];
		        if (typeof event === 'symbol')
		            this._symbolKeys.add(event);
		    }
		    else if (typeof evtmap !== 'object') {
		        this.onceEvents[event] = [listener, evtmap];
		        if (typeof event === 'symbol')
		            this._symbolKeys.add(event);
		    }
		    else {
		        evtmap.unshift(listener);
		        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length) {
		            console.warn("Maximum event listeners for \"".concat(String(event), "\" once event!"));
		        }
		    }
		    return this;
		}
		function removeAllListeners(event) {
		    if (event === undefined) {
		        this.events = (0, utils_2.nullObj)();
		        this.onceEvents = (0, utils_2.nullObj)();
		        this._symbolKeys = new Set;
		    }
		    else {
		        this.events[event] = undefined;
		        this.onceEvents[event] = undefined;
		        if (typeof event === 'symbol')
		            this._symbolKeys.delete(event);
		    }
		    return this;
		}
		function setMaxListeners(n) {
		    this.maxListeners = n;
		    return this;
		}
		function getMaxListeners() {
		    return this.maxListeners;
		}
		function listeners(event) {
		    if (this.emit === emit)
		        return this.events[event] ? this.events[event].tasksAsArray().slice() : [];
		    else {
		        if (this.events[event] && this.onceEvents[event]) {
		            return __spreadArray(__spreadArray([], this.events[event].tasksAsArray(), true), (typeof this.onceEvents[event] === 'function' ? [this.onceEvents[event]] : this.onceEvents[event]), true);
		        }
		        else if (this.events[event])
		            return this.events[event].tasksAsArray();
		        else if (this.onceEvents[event])
		            return (typeof this.onceEvents[event] === 'function' ? [this.onceEvents[event]] : this.onceEvents[event]);
		        else
		            return [];
		    }
		}
		function eventNames() {
		    var _this = this;
		    if (this.emit === emit) {
		        var keys = Object.keys(this.events);
		        return __spreadArray(__spreadArray([], keys, true), Array.from(this._symbolKeys), true).filter(function (x) { return (x in _this.events) && _this.events[x] && _this.events[x].length; });
		    }
		    else {
		        var keys = Object.keys(this.events).filter(function (x) { return _this.events[x] && _this.events[x].length; });
		        var keysO = Object.keys(this.onceEvents).filter(function (x) { return _this.onceEvents[x] && _this.onceEvents[x].length; });
		        return __spreadArray(__spreadArray(__spreadArray([], keys, true), keysO, true), Array.from(this._symbolKeys).filter(function (x) { return (((x in _this.events) && _this.events[x] && _this.events[x].length) ||
		            ((x in _this.onceEvents) && _this.onceEvents[x] && _this.onceEvents[x].length)); }), true);
		    }
		}
		function listenerCount(type) {
		    if (this.emit === emit)
		        return this.events[type] && this.events[type].length || 0;
		    else
		        return (this.events[type] && this.events[type].length || 0) + (this.onceEvents[type] && this.onceEvents[type].length || 0);
		}
		EventEmitter.prototype.emit = emit;
		EventEmitter.prototype.on = addListener;
		EventEmitter.prototype.once = once;
		EventEmitter.prototype.addListener = addListener;
		EventEmitter.prototype.removeListener = removeListener;
		EventEmitter.prototype.addListenerBound = addListenerBound;
		EventEmitter.prototype.removeListenerBound = removeListenerBound;
		EventEmitter.prototype.hasListeners = hasListeners;
		EventEmitter.prototype.prependListener = prependListener;
		EventEmitter.prototype.prependOnceListener = prependOnceListener;
		EventEmitter.prototype.off = removeListener;
		EventEmitter.prototype.removeAllListeners = removeAllListeners;
		EventEmitter.prototype.setMaxListeners = setMaxListeners;
		EventEmitter.prototype.getMaxListeners = getMaxListeners;
		EventEmitter.prototype.listeners = listeners;
		EventEmitter.prototype.eventNames = eventNames;
		EventEmitter.prototype.listenerCount = listenerCount;
		
		return ee;
	}

	var hasRequiredLib$1;

	function requireLib$1 () {
		if (hasRequiredLib$1) return lib$1;
		hasRequiredLib$1 = 1;
		(function (exports$1) {
			var __createBinding = (lib$1 && lib$1.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (lib$1 && lib$1.__exportStar) || function(m, exports$1) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
			};
			Object.defineProperty(exports$1, "__esModule", { value: true });
			__exportStar(requireTypes(), exports$1);
			__exportStar(requireEe(), exports$1);
			
		} (lib$1));
		return lib$1;
	}

	var libExports = requireLib$1();

	var browser = {exports: {}};

	/**
	 * Helpers.
	 */

	var ms;
	var hasRequiredMs;

	function requireMs () {
		if (hasRequiredMs) return ms;
		hasRequiredMs = 1;
		var s = 1000;
		var m = s * 60;
		var h = m * 60;
		var d = h * 24;
		var w = d * 7;
		var y = d * 365.25;

		/**
		 * Parse or format the given `val`.
		 *
		 * Options:
		 *
		 *  - `long` verbose formatting [false]
		 *
		 * @param {String|Number} val
		 * @param {Object} [options]
		 * @throws {Error} throw an error if val is not a non-empty string or a number
		 * @return {String|Number}
		 * @api public
		 */

		ms = function (val, options) {
		  options = options || {};
		  var type = typeof val;
		  if (type === 'string' && val.length > 0) {
		    return parse(val);
		  } else if (type === 'number' && isFinite(val)) {
		    return options.long ? fmtLong(val) : fmtShort(val);
		  }
		  throw new Error(
		    'val is not a non-empty string or a valid number. val=' +
		      JSON.stringify(val)
		  );
		};

		/**
		 * Parse the given `str` and return milliseconds.
		 *
		 * @param {String} str
		 * @return {Number}
		 * @api private
		 */

		function parse(str) {
		  str = String(str);
		  if (str.length > 100) {
		    return;
		  }
		  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
		    str
		  );
		  if (!match) {
		    return;
		  }
		  var n = parseFloat(match[1]);
		  var type = (match[2] || 'ms').toLowerCase();
		  switch (type) {
		    case 'years':
		    case 'year':
		    case 'yrs':
		    case 'yr':
		    case 'y':
		      return n * y;
		    case 'weeks':
		    case 'week':
		    case 'w':
		      return n * w;
		    case 'days':
		    case 'day':
		    case 'd':
		      return n * d;
		    case 'hours':
		    case 'hour':
		    case 'hrs':
		    case 'hr':
		    case 'h':
		      return n * h;
		    case 'minutes':
		    case 'minute':
		    case 'mins':
		    case 'min':
		    case 'm':
		      return n * m;
		    case 'seconds':
		    case 'second':
		    case 'secs':
		    case 'sec':
		    case 's':
		      return n * s;
		    case 'milliseconds':
		    case 'millisecond':
		    case 'msecs':
		    case 'msec':
		    case 'ms':
		      return n;
		    default:
		      return undefined;
		  }
		}

		/**
		 * Short format for `ms`.
		 *
		 * @param {Number} ms
		 * @return {String}
		 * @api private
		 */

		function fmtShort(ms) {
		  var msAbs = Math.abs(ms);
		  if (msAbs >= d) {
		    return Math.round(ms / d) + 'd';
		  }
		  if (msAbs >= h) {
		    return Math.round(ms / h) + 'h';
		  }
		  if (msAbs >= m) {
		    return Math.round(ms / m) + 'm';
		  }
		  if (msAbs >= s) {
		    return Math.round(ms / s) + 's';
		  }
		  return ms + 'ms';
		}

		/**
		 * Long format for `ms`.
		 *
		 * @param {Number} ms
		 * @return {String}
		 * @api private
		 */

		function fmtLong(ms) {
		  var msAbs = Math.abs(ms);
		  if (msAbs >= d) {
		    return plural(ms, msAbs, d, 'day');
		  }
		  if (msAbs >= h) {
		    return plural(ms, msAbs, h, 'hour');
		  }
		  if (msAbs >= m) {
		    return plural(ms, msAbs, m, 'minute');
		  }
		  if (msAbs >= s) {
		    return plural(ms, msAbs, s, 'second');
		  }
		  return ms + ' ms';
		}

		/**
		 * Pluralization helper.
		 */

		function plural(ms, msAbs, n, name) {
		  var isPlural = msAbs >= n * 1.5;
		  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
		}
		return ms;
	}

	var common;
	var hasRequiredCommon;

	function requireCommon () {
		if (hasRequiredCommon) return common;
		hasRequiredCommon = 1;
		/**
		 * This is the common logic for both the Node.js and web browser
		 * implementations of `debug()`.
		 */

		function setup(env) {
			createDebug.debug = createDebug;
			createDebug.default = createDebug;
			createDebug.coerce = coerce;
			createDebug.disable = disable;
			createDebug.enable = enable;
			createDebug.enabled = enabled;
			createDebug.humanize = requireMs();
			createDebug.destroy = destroy;

			Object.keys(env).forEach(key => {
				createDebug[key] = env[key];
			});

			/**
			* The currently active debug mode names, and names to skip.
			*/

			createDebug.names = [];
			createDebug.skips = [];

			/**
			* Map of special "%n" handling functions, for the debug "format" argument.
			*
			* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
			*/
			createDebug.formatters = {};

			/**
			* Selects a color for a debug namespace
			* @param {String} namespace The namespace string for the debug instance to be colored
			* @return {Number|String} An ANSI color code for the given namespace
			* @api private
			*/
			function selectColor(namespace) {
				let hash = 0;

				for (let i = 0; i < namespace.length; i++) {
					hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
					hash |= 0; // Convert to 32bit integer
				}

				return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
			}
			createDebug.selectColor = selectColor;

			/**
			* Create a debugger with the given `namespace`.
			*
			* @param {String} namespace
			* @return {Function}
			* @api public
			*/
			function createDebug(namespace) {
				let prevTime;
				let enableOverride = null;
				let namespacesCache;
				let enabledCache;

				function debug(...args) {
					// Disabled?
					if (!debug.enabled) {
						return;
					}

					const self = debug;

					// Set `diff` timestamp
					const curr = Number(new Date());
					const ms = curr - (prevTime || curr);
					self.diff = ms;
					self.prev = prevTime;
					self.curr = curr;
					prevTime = curr;

					args[0] = createDebug.coerce(args[0]);

					if (typeof args[0] !== 'string') {
						// Anything else let's inspect with %O
						args.unshift('%O');
					}

					// Apply any `formatters` transformations
					let index = 0;
					args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
						// If we encounter an escaped % then don't increase the array index
						if (match === '%%') {
							return '%';
						}
						index++;
						const formatter = createDebug.formatters[format];
						if (typeof formatter === 'function') {
							const val = args[index];
							match = formatter.call(self, val);

							// Now we need to remove `args[index]` since it's inlined in the `format`
							args.splice(index, 1);
							index--;
						}
						return match;
					});

					// Apply env-specific formatting (colors, etc.)
					createDebug.formatArgs.call(self, args);

					const logFn = self.log || createDebug.log;
					logFn.apply(self, args);
				}

				debug.namespace = namespace;
				debug.useColors = createDebug.useColors();
				debug.color = createDebug.selectColor(namespace);
				debug.extend = extend;
				debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

				Object.defineProperty(debug, 'enabled', {
					enumerable: true,
					configurable: false,
					get: () => {
						if (enableOverride !== null) {
							return enableOverride;
						}
						if (namespacesCache !== createDebug.namespaces) {
							namespacesCache = createDebug.namespaces;
							enabledCache = createDebug.enabled(namespace);
						}

						return enabledCache;
					},
					set: v => {
						enableOverride = v;
					}
				});

				// Env-specific initialization logic for debug instances
				if (typeof createDebug.init === 'function') {
					createDebug.init(debug);
				}

				return debug;
			}

			function extend(namespace, delimiter) {
				const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
				newDebug.log = this.log;
				return newDebug;
			}

			/**
			* Enables a debug mode by namespaces. This can include modes
			* separated by a colon and wildcards.
			*
			* @param {String} namespaces
			* @api public
			*/
			function enable(namespaces) {
				createDebug.save(namespaces);
				createDebug.namespaces = namespaces;

				createDebug.names = [];
				createDebug.skips = [];

				const split = (typeof namespaces === 'string' ? namespaces : '')
					.trim()
					.replace(/\s+/g, ',')
					.split(',')
					.filter(Boolean);

				for (const ns of split) {
					if (ns[0] === '-') {
						createDebug.skips.push(ns.slice(1));
					} else {
						createDebug.names.push(ns);
					}
				}
			}

			/**
			 * Checks if the given string matches a namespace template, honoring
			 * asterisks as wildcards.
			 *
			 * @param {String} search
			 * @param {String} template
			 * @return {Boolean}
			 */
			function matchesTemplate(search, template) {
				let searchIndex = 0;
				let templateIndex = 0;
				let starIndex = -1;
				let matchIndex = 0;

				while (searchIndex < search.length) {
					if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
						// Match character or proceed with wildcard
						if (template[templateIndex] === '*') {
							starIndex = templateIndex;
							matchIndex = searchIndex;
							templateIndex++; // Skip the '*'
						} else {
							searchIndex++;
							templateIndex++;
						}
					} else if (starIndex !== -1) { // eslint-disable-line no-negated-condition
						// Backtrack to the last '*' and try to match more characters
						templateIndex = starIndex + 1;
						matchIndex++;
						searchIndex = matchIndex;
					} else {
						return false; // No match
					}
				}

				// Handle trailing '*' in template
				while (templateIndex < template.length && template[templateIndex] === '*') {
					templateIndex++;
				}

				return templateIndex === template.length;
			}

			/**
			* Disable debug output.
			*
			* @return {String} namespaces
			* @api public
			*/
			function disable() {
				const namespaces = [
					...createDebug.names,
					...createDebug.skips.map(namespace => '-' + namespace)
				].join(',');
				createDebug.enable('');
				return namespaces;
			}

			/**
			* Returns true if the given mode name is enabled, false otherwise.
			*
			* @param {String} name
			* @return {Boolean}
			* @api public
			*/
			function enabled(name) {
				for (const skip of createDebug.skips) {
					if (matchesTemplate(name, skip)) {
						return false;
					}
				}

				for (const ns of createDebug.names) {
					if (matchesTemplate(name, ns)) {
						return true;
					}
				}

				return false;
			}

			/**
			* Coerce `val`.
			*
			* @param {Mixed} val
			* @return {Mixed}
			* @api private
			*/
			function coerce(val) {
				if (val instanceof Error) {
					return val.stack || val.message;
				}
				return val;
			}

			/**
			* XXX DO NOT USE. This is a temporary stub function.
			* XXX It WILL be removed in the next major release.
			*/
			function destroy() {
				console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
			}

			createDebug.enable(createDebug.load());

			return createDebug;
		}

		common = setup;
		return common;
	}

	/* eslint-env browser */

	var hasRequiredBrowser;

	function requireBrowser () {
		if (hasRequiredBrowser) return browser.exports;
		hasRequiredBrowser = 1;
		(function (module, exports$1) {
			/**
			 * This is the web browser implementation of `debug()`.
			 */

			exports$1.formatArgs = formatArgs;
			exports$1.save = save;
			exports$1.load = load;
			exports$1.useColors = useColors;
			exports$1.storage = localstorage();
			exports$1.destroy = (() => {
				let warned = false;

				return () => {
					if (!warned) {
						warned = true;
						console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
					}
				};
			})();

			/**
			 * Colors.
			 */

			exports$1.colors = [
				'#0000CC',
				'#0000FF',
				'#0033CC',
				'#0033FF',
				'#0066CC',
				'#0066FF',
				'#0099CC',
				'#0099FF',
				'#00CC00',
				'#00CC33',
				'#00CC66',
				'#00CC99',
				'#00CCCC',
				'#00CCFF',
				'#3300CC',
				'#3300FF',
				'#3333CC',
				'#3333FF',
				'#3366CC',
				'#3366FF',
				'#3399CC',
				'#3399FF',
				'#33CC00',
				'#33CC33',
				'#33CC66',
				'#33CC99',
				'#33CCCC',
				'#33CCFF',
				'#6600CC',
				'#6600FF',
				'#6633CC',
				'#6633FF',
				'#66CC00',
				'#66CC33',
				'#9900CC',
				'#9900FF',
				'#9933CC',
				'#9933FF',
				'#99CC00',
				'#99CC33',
				'#CC0000',
				'#CC0033',
				'#CC0066',
				'#CC0099',
				'#CC00CC',
				'#CC00FF',
				'#CC3300',
				'#CC3333',
				'#CC3366',
				'#CC3399',
				'#CC33CC',
				'#CC33FF',
				'#CC6600',
				'#CC6633',
				'#CC9900',
				'#CC9933',
				'#CCCC00',
				'#CCCC33',
				'#FF0000',
				'#FF0033',
				'#FF0066',
				'#FF0099',
				'#FF00CC',
				'#FF00FF',
				'#FF3300',
				'#FF3333',
				'#FF3366',
				'#FF3399',
				'#FF33CC',
				'#FF33FF',
				'#FF6600',
				'#FF6633',
				'#FF9900',
				'#FF9933',
				'#FFCC00',
				'#FFCC33'
			];

			/**
			 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
			 * and the Firebug extension (any Firefox version) are known
			 * to support "%c" CSS customizations.
			 *
			 * TODO: add a `localStorage` variable to explicitly enable/disable colors
			 */

			// eslint-disable-next-line complexity
			function useColors() {
				// NB: In an Electron preload script, document will be defined but not fully
				// initialized. Since we know we're in Chrome, we'll just detect this case
				// explicitly
				if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
					return true;
				}

				// Internet Explorer and Edge do not support colors.
				if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
					return false;
				}

				let m;

				// Is webkit? http://stackoverflow.com/a/16459606/376773
				// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
				// eslint-disable-next-line no-return-assign
				return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
					// Is firebug? http://stackoverflow.com/a/398120/376773
					(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
					// Is firefox >= v31?
					// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
					(typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31) ||
					// Double check webkit in userAgent just in case we are in a worker
					(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
			}

			/**
			 * Colorize log arguments if enabled.
			 *
			 * @api public
			 */

			function formatArgs(args) {
				args[0] = (this.useColors ? '%c' : '') +
					this.namespace +
					(this.useColors ? ' %c' : ' ') +
					args[0] +
					(this.useColors ? '%c ' : ' ') +
					'+' + module.exports.humanize(this.diff);

				if (!this.useColors) {
					return;
				}

				const c = 'color: ' + this.color;
				args.splice(1, 0, c, 'color: inherit');

				// The final "%c" is somewhat tricky, because there could be other
				// arguments passed either before or after the %c, so we need to
				// figure out the correct index to insert the CSS into
				let index = 0;
				let lastC = 0;
				args[0].replace(/%[a-zA-Z%]/g, match => {
					if (match === '%%') {
						return;
					}
					index++;
					if (match === '%c') {
						// We only are interested in the *last* %c
						// (the user may have provided their own)
						lastC = index;
					}
				});

				args.splice(lastC, 0, c);
			}

			/**
			 * Invokes `console.debug()` when available.
			 * No-op when `console.debug` is not a "function".
			 * If `console.debug` is not available, falls back
			 * to `console.log`.
			 *
			 * @api public
			 */
			exports$1.log = console.debug || console.log || (() => {});

			/**
			 * Save `namespaces`.
			 *
			 * @param {String} namespaces
			 * @api private
			 */
			function save(namespaces) {
				try {
					if (namespaces) {
						exports$1.storage.setItem('debug', namespaces);
					} else {
						exports$1.storage.removeItem('debug');
					}
				} catch (error) {
					// Swallow
					// XXX (@Qix-) should we be logging these?
				}
			}

			/**
			 * Load `namespaces`.
			 *
			 * @return {String} returns the previously persisted debug modes
			 * @api private
			 */
			function load() {
				let r;
				try {
					r = exports$1.storage.getItem('debug') || exports$1.storage.getItem('DEBUG') ;
				} catch (error) {
					// Swallow
					// XXX (@Qix-) should we be logging these?
				}

				// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
				if (!r && typeof process !== 'undefined' && 'env' in process) {
					r = process.env.DEBUG;
				}

				return r;
			}

			/**
			 * Localstorage attempts to return the localstorage.
			 *
			 * This is necessary because safari throws
			 * when a user disables cookies/localstorage
			 * and you attempt to access it.
			 *
			 * @return {LocalStorage}
			 * @api private
			 */

			function localstorage() {
				try {
					// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
					// The Browser also has localStorage in the global context.
					return localStorage;
				} catch (error) {
					// Swallow
					// XXX (@Qix-) should we be logging these?
				}
			}

			module.exports = requireCommon()(exports$1);

			const {formatters} = module.exports;

			/**
			 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
			 */

			formatters.j = function (v) {
				try {
					return JSON.stringify(v);
				} catch (error) {
					return '[UnexpectedJSONParseError]: ' + error.message;
				}
			}; 
		} (browser, browser.exports));
		return browser.exports;
	}

	var browserExports = requireBrowser();
	var createDebug5 = /*@__PURE__*/getDefaultExportFromCjs(browserExports);

	function number$2(n) {
	    if (!Number.isSafeInteger(n) || n < 0)
	        throw new Error(`Wrong positive integer: ${n}`);
	}
	function bytes$2(b, ...lengths) {
	    if (!(b instanceof Uint8Array))
	        throw new Error('Expected Uint8Array');
	    if (lengths.length > 0 && !lengths.includes(b.length))
	        throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
	}
	function hash$1(hash) {
	    if (typeof hash !== 'function' || typeof hash.create !== 'function')
	        throw new Error('Hash should be wrapped by utils.wrapConstructor');
	    number$2(hash.outputLen);
	    number$2(hash.blockLen);
	}
	function exists$2(instance, checkFinished = true) {
	    if (instance.destroyed)
	        throw new Error('Hash instance has been destroyed');
	    if (checkFinished && instance.finished)
	        throw new Error('Hash#digest() has already been called');
	}
	function output$2(out, instance) {
	    bytes$2(out);
	    const min = instance.outputLen;
	    if (out.length < min) {
	        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
	    }
	}

	const crypto$2 = typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;

	/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
	// node.js versions earlier than v19 don't declare it in global scope.
	// For node.js, package.json#exports field mapping rewrites import
	// from `crypto` to `cryptoNode`, which imports native module.
	// Makes the utils un-importable in browsers without a bundler.
	// Once node.js 18 is deprecated, we can just drop the import.
	const u8a$2 = (a) => a instanceof Uint8Array;
	// Cast array to view
	const createView$3 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
	// The rotate right (circular right shift) operation for uint32
	const rotr$2 = (word, shift) => (word << (32 - shift)) | (word >>> shift);
	// big-endian hardware is rare. Just in case someone still decides to run hashes:
	// early-throw an error because we don't support BE yet.
	const isLE$2 = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
	if (!isLE$2)
	    throw new Error('Non little-endian hardware is not supported');
	/**
	 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
	 */
	function utf8ToBytes$4(str) {
	    if (typeof str !== 'string')
	        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
	    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
	}
	/**
	 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
	 * Warning: when Uint8Array is passed, it would NOT get copied.
	 * Keep in mind for future mutable operations.
	 */
	function toBytes$3(data) {
	    if (typeof data === 'string')
	        data = utf8ToBytes$4(data);
	    if (!u8a$2(data))
	        throw new Error(`expected Uint8Array, got ${typeof data}`);
	    return data;
	}
	/**
	 * Copies several Uint8Arrays into one.
	 */
	function concatBytes$3(...arrays) {
	    const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
	    let pad = 0; // walk through each item, ensure they have proper type
	    arrays.forEach((a) => {
	        if (!u8a$2(a))
	            throw new Error('Uint8Array expected');
	        r.set(a, pad);
	        pad += a.length;
	    });
	    return r;
	}
	// For runtime check if class implements interface
	let Hash$2 = class Hash {
	    // Safe version that clones internal state
	    clone() {
	        return this._cloneInto();
	    }
	};
	function wrapConstructor$1(hashCons) {
	    const hashC = (msg) => hashCons().update(toBytes$3(msg)).digest();
	    const tmp = hashCons();
	    hashC.outputLen = tmp.outputLen;
	    hashC.blockLen = tmp.blockLen;
	    hashC.create = () => hashCons();
	    return hashC;
	}
	/**
	 * Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
	 */
	function randomBytes$2(bytesLength = 32) {
	    if (crypto$2 && typeof crypto$2.getRandomValues === 'function') {
	        return crypto$2.getRandomValues(new Uint8Array(bytesLength));
	    }
	    throw new Error('crypto.getRandomValues must be defined');
	}

	// Polyfill for Safari 14
	function setBigUint64$3(view, byteOffset, value, isLE) {
	    if (typeof view.setBigUint64 === 'function')
	        return view.setBigUint64(byteOffset, value, isLE);
	    const _32n = BigInt(32);
	    const _u32_max = BigInt(0xffffffff);
	    const wh = Number((value >> _32n) & _u32_max);
	    const wl = Number(value & _u32_max);
	    const h = isLE ? 4 : 0;
	    const l = isLE ? 0 : 4;
	    view.setUint32(byteOffset + h, wh, isLE);
	    view.setUint32(byteOffset + l, wl, isLE);
	}
	// Base SHA2 class (RFC 6234)
	let SHA2$1 = class SHA2 extends Hash$2 {
	    constructor(blockLen, outputLen, padOffset, isLE) {
	        super();
	        this.blockLen = blockLen;
	        this.outputLen = outputLen;
	        this.padOffset = padOffset;
	        this.isLE = isLE;
	        this.finished = false;
	        this.length = 0;
	        this.pos = 0;
	        this.destroyed = false;
	        this.buffer = new Uint8Array(blockLen);
	        this.view = createView$3(this.buffer);
	    }
	    update(data) {
	        exists$2(this);
	        const { view, buffer, blockLen } = this;
	        data = toBytes$3(data);
	        const len = data.length;
	        for (let pos = 0; pos < len;) {
	            const take = Math.min(blockLen - this.pos, len - pos);
	            // Fast path: we have at least one block in input, cast it to view and process
	            if (take === blockLen) {
	                const dataView = createView$3(data);
	                for (; blockLen <= len - pos; pos += blockLen)
	                    this.process(dataView, pos);
	                continue;
	            }
	            buffer.set(data.subarray(pos, pos + take), this.pos);
	            this.pos += take;
	            pos += take;
	            if (this.pos === blockLen) {
	                this.process(view, 0);
	                this.pos = 0;
	            }
	        }
	        this.length += data.length;
	        this.roundClean();
	        return this;
	    }
	    digestInto(out) {
	        exists$2(this);
	        output$2(out, this);
	        this.finished = true;
	        // Padding
	        // We can avoid allocation of buffer for padding completely if it
	        // was previously not allocated here. But it won't change performance.
	        const { buffer, view, blockLen, isLE } = this;
	        let { pos } = this;
	        // append the bit '1' to the message
	        buffer[pos++] = 128;
	        this.buffer.subarray(pos).fill(0);
	        // we have less than padOffset left in buffer, so we cannot put length in current block, need process it and pad again
	        if (this.padOffset > blockLen - pos) {
	            this.process(view, 0);
	            pos = 0;
	        }
	        // Pad until full block byte with zeros
	        for (let i = pos; i < blockLen; i++)
	            buffer[i] = 0;
	        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
	        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
	        // So we just write lowest 64 bits of that value.
	        setBigUint64$3(view, blockLen - 8, BigInt(this.length * 8), isLE);
	        this.process(view, 0);
	        const oview = createView$3(out);
	        const len = this.outputLen;
	        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
	        if (len % 4)
	            throw new Error('_sha2: outputLen should be aligned to 32bit');
	        const outLen = len / 4;
	        const state = this.get();
	        if (outLen > state.length)
	            throw new Error('_sha2: outputLen bigger than state');
	        for (let i = 0; i < outLen; i++)
	            oview.setUint32(4 * i, state[i], isLE);
	    }
	    digest() {
	        const { buffer, outputLen } = this;
	        this.digestInto(buffer);
	        const res = buffer.slice(0, outputLen);
	        this.destroy();
	        return res;
	    }
	    _cloneInto(to) {
	        to || (to = new this.constructor());
	        to.set(...this.get());
	        const { blockLen, buffer, length, finished, destroyed, pos } = this;
	        to.length = length;
	        to.pos = pos;
	        to.finished = finished;
	        to.destroyed = destroyed;
	        if (length % blockLen)
	            to.buffer.set(buffer);
	        return to;
	    }
	};

	// SHA2-256 need to try 2^128 hashes to execute birthday attack.
	// BTC network is doing 2^67 hashes/sec as per early 2023.
	// Choice: a ? b : c
	const Chi$2 = (a, b, c) => (a & b) ^ (~a & c);
	// Majority function, true if any two inpust is true
	const Maj$2 = (a, b, c) => (a & b) ^ (a & c) ^ (b & c);
	// Round constants:
	// first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311)
	// prettier-ignore
	const SHA256_K$2 = /* @__PURE__ */ new Uint32Array([
	    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	]);
	// Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
	// prettier-ignore
	const IV$1 = /* @__PURE__ */ new Uint32Array([
	    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
	]);
	// Temporary buffer, not used to store anything between runs
	// Named this way because it matches specification.
	const SHA256_W$2 = /* @__PURE__ */ new Uint32Array(64);
	let SHA256$2 = class SHA256 extends SHA2$1 {
	    constructor() {
	        super(64, 32, 8, false);
	        // We cannot use array here since array allows indexing by variable
	        // which means optimizer/compiler cannot use registers.
	        this.A = IV$1[0] | 0;
	        this.B = IV$1[1] | 0;
	        this.C = IV$1[2] | 0;
	        this.D = IV$1[3] | 0;
	        this.E = IV$1[4] | 0;
	        this.F = IV$1[5] | 0;
	        this.G = IV$1[6] | 0;
	        this.H = IV$1[7] | 0;
	    }
	    get() {
	        const { A, B, C, D, E, F, G, H } = this;
	        return [A, B, C, D, E, F, G, H];
	    }
	    // prettier-ignore
	    set(A, B, C, D, E, F, G, H) {
	        this.A = A | 0;
	        this.B = B | 0;
	        this.C = C | 0;
	        this.D = D | 0;
	        this.E = E | 0;
	        this.F = F | 0;
	        this.G = G | 0;
	        this.H = H | 0;
	    }
	    process(view, offset) {
	        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
	        for (let i = 0; i < 16; i++, offset += 4)
	            SHA256_W$2[i] = view.getUint32(offset, false);
	        for (let i = 16; i < 64; i++) {
	            const W15 = SHA256_W$2[i - 15];
	            const W2 = SHA256_W$2[i - 2];
	            const s0 = rotr$2(W15, 7) ^ rotr$2(W15, 18) ^ (W15 >>> 3);
	            const s1 = rotr$2(W2, 17) ^ rotr$2(W2, 19) ^ (W2 >>> 10);
	            SHA256_W$2[i] = (s1 + SHA256_W$2[i - 7] + s0 + SHA256_W$2[i - 16]) | 0;
	        }
	        // Compression function main loop, 64 rounds
	        let { A, B, C, D, E, F, G, H } = this;
	        for (let i = 0; i < 64; i++) {
	            const sigma1 = rotr$2(E, 6) ^ rotr$2(E, 11) ^ rotr$2(E, 25);
	            const T1 = (H + sigma1 + Chi$2(E, F, G) + SHA256_K$2[i] + SHA256_W$2[i]) | 0;
	            const sigma0 = rotr$2(A, 2) ^ rotr$2(A, 13) ^ rotr$2(A, 22);
	            const T2 = (sigma0 + Maj$2(A, B, C)) | 0;
	            H = G;
	            G = F;
	            F = E;
	            E = (D + T1) | 0;
	            D = C;
	            C = B;
	            B = A;
	            A = (T1 + T2) | 0;
	        }
	        // Add the compressed chunk to the current hash value
	        A = (A + this.A) | 0;
	        B = (B + this.B) | 0;
	        C = (C + this.C) | 0;
	        D = (D + this.D) | 0;
	        E = (E + this.E) | 0;
	        F = (F + this.F) | 0;
	        G = (G + this.G) | 0;
	        H = (H + this.H) | 0;
	        this.set(A, B, C, D, E, F, G, H);
	    }
	    roundClean() {
	        SHA256_W$2.fill(0);
	    }
	    destroy() {
	        this.set(0, 0, 0, 0, 0, 0, 0, 0);
	        this.buffer.fill(0);
	    }
	};
	/**
	 * SHA2-256 hash function
	 * @param message - data that would be hashed
	 */
	const sha256$3 = /* @__PURE__ */ wrapConstructor$1(() => new SHA256$2());

	/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	// 100 lines of code in the file are duplicated from noble-hashes (utils).
	// This is OK: `abstract` directory does not use noble-hashes.
	// User may opt-in into using different hashing library. This way, noble-hashes
	// won't be included into their bundle.
	const _0n$9 = BigInt(0);
	const _1n$9 = BigInt(1);
	const _2n$5 = BigInt(2);
	const u8a$1 = (a) => a instanceof Uint8Array;
	const hexes$3 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));
	/**
	 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
	 */
	function bytesToHex$3(bytes) {
	    if (!u8a$1(bytes))
	        throw new Error('Uint8Array expected');
	    // pre-caching improves the speed 6x
	    let hex = '';
	    for (let i = 0; i < bytes.length; i++) {
	        hex += hexes$3[bytes[i]];
	    }
	    return hex;
	}
	function numberToHexUnpadded$1(num) {
	    const hex = num.toString(16);
	    return hex.length & 1 ? `0${hex}` : hex;
	}
	function hexToNumber$1(hex) {
	    if (typeof hex !== 'string')
	        throw new Error('hex string expected, got ' + typeof hex);
	    // Big Endian
	    return BigInt(hex === '' ? '0' : `0x${hex}`);
	}
	/**
	 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
	 */
	function hexToBytes$3(hex) {
	    if (typeof hex !== 'string')
	        throw new Error('hex string expected, got ' + typeof hex);
	    const len = hex.length;
	    if (len % 2)
	        throw new Error('padded hex string expected, got unpadded hex of length ' + len);
	    const array = new Uint8Array(len / 2);
	    for (let i = 0; i < array.length; i++) {
	        const j = i * 2;
	        const hexByte = hex.slice(j, j + 2);
	        const byte = Number.parseInt(hexByte, 16);
	        if (Number.isNaN(byte) || byte < 0)
	            throw new Error('Invalid byte sequence');
	        array[i] = byte;
	    }
	    return array;
	}
	// BE: Big Endian, LE: Little Endian
	function bytesToNumberBE$1(bytes) {
	    return hexToNumber$1(bytesToHex$3(bytes));
	}
	function bytesToNumberLE$1(bytes) {
	    if (!u8a$1(bytes))
	        throw new Error('Uint8Array expected');
	    return hexToNumber$1(bytesToHex$3(Uint8Array.from(bytes).reverse()));
	}
	function numberToBytesBE$1(n, len) {
	    return hexToBytes$3(n.toString(16).padStart(len * 2, '0'));
	}
	function numberToBytesLE$1(n, len) {
	    return numberToBytesBE$1(n, len).reverse();
	}
	// Unpadded, rarely used
	function numberToVarBytesBE(n) {
	    return hexToBytes$3(numberToHexUnpadded$1(n));
	}
	/**
	 * Takes hex string or Uint8Array, converts to Uint8Array.
	 * Validates output length.
	 * Will throw error for other types.
	 * @param title descriptive title for an error e.g. 'private key'
	 * @param hex hex string or Uint8Array
	 * @param expectedLength optional, will compare to result array's length
	 * @returns
	 */
	function ensureBytes$1(title, hex, expectedLength) {
	    let res;
	    if (typeof hex === 'string') {
	        try {
	            res = hexToBytes$3(hex);
	        }
	        catch (e) {
	            throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
	        }
	    }
	    else if (u8a$1(hex)) {
	        // Uint8Array.from() instead of hash.slice() because node.js Buffer
	        // is instance of Uint8Array, and its slice() creates **mutable** copy
	        res = Uint8Array.from(hex);
	    }
	    else {
	        throw new Error(`${title} must be hex string or Uint8Array`);
	    }
	    const len = res.length;
	    if (typeof expectedLength === 'number' && len !== expectedLength)
	        throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
	    return res;
	}
	/**
	 * Copies several Uint8Arrays into one.
	 */
	function concatBytes$2(...arrays) {
	    const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
	    let pad = 0; // walk through each item, ensure they have proper type
	    arrays.forEach((a) => {
	        if (!u8a$1(a))
	            throw new Error('Uint8Array expected');
	        r.set(a, pad);
	        pad += a.length;
	    });
	    return r;
	}
	function equalBytes$1(b1, b2) {
	    // We don't care about timing attacks here
	    if (b1.length !== b2.length)
	        return false;
	    for (let i = 0; i < b1.length; i++)
	        if (b1[i] !== b2[i])
	            return false;
	    return true;
	}
	/**
	 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
	 */
	function utf8ToBytes$3(str) {
	    if (typeof str !== 'string')
	        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
	    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
	}
	// Bit operations
	/**
	 * Calculates amount of bits in a bigint.
	 * Same as `n.toString(2).length`
	 */
	function bitLen$1(n) {
	    let len;
	    for (len = 0; n > _0n$9; n >>= _1n$9, len += 1)
	        ;
	    return len;
	}
	/**
	 * Gets single bit at position.
	 * NOTE: first bit position is 0 (same as arrays)
	 * Same as `!!+Array.from(n.toString(2)).reverse()[pos]`
	 */
	function bitGet(n, pos) {
	    return (n >> BigInt(pos)) & _1n$9;
	}
	/**
	 * Sets single bit at position.
	 */
	const bitSet = (n, pos, value) => {
	    return n | ((value ? _1n$9 : _0n$9) << BigInt(pos));
	};
	/**
	 * Calculate mask for N bits. Not using ** operator with bigints because of old engines.
	 * Same as BigInt(`0b${Array(i).fill('1').join('')}`)
	 */
	const bitMask$1 = (n) => (_2n$5 << BigInt(n - 1)) - _1n$9;
	// DRBG
	const u8n = (data) => new Uint8Array(data); // creates Uint8Array
	const u8fr = (arr) => Uint8Array.from(arr); // another shortcut
	/**
	 * Minimal HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
	 * @returns function that will call DRBG until 2nd arg returns something meaningful
	 * @example
	 *   const drbg = createHmacDRBG<Key>(32, 32, hmac);
	 *   drbg(seed, bytesToKey); // bytesToKey must return Key or undefined
	 */
	function createHmacDrbg$1(hashLen, qByteLen, hmacFn) {
	    if (typeof hashLen !== 'number' || hashLen < 2)
	        throw new Error('hashLen must be a number');
	    if (typeof qByteLen !== 'number' || qByteLen < 2)
	        throw new Error('qByteLen must be a number');
	    if (typeof hmacFn !== 'function')
	        throw new Error('hmacFn must be a function');
	    // Step B, Step C: set hashLen to 8*ceil(hlen/8)
	    let v = u8n(hashLen); // Minimal non-full-spec HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
	    let k = u8n(hashLen); // Steps B and C of RFC6979 3.2: set hashLen, in our case always same
	    let i = 0; // Iterations counter, will throw when over 1000
	    const reset = () => {
	        v.fill(1);
	        k.fill(0);
	        i = 0;
	    };
	    const h = (...b) => hmacFn(k, v, ...b); // hmac(k)(v, ...values)
	    const reseed = (seed = u8n()) => {
	        // HMAC-DRBG reseed() function. Steps D-G
	        k = h(u8fr([0x00]), seed); // k = hmac(k || v || 0x00 || seed)
	        v = h(); // v = hmac(k || v)
	        if (seed.length === 0)
	            return;
	        k = h(u8fr([0x01]), seed); // k = hmac(k || v || 0x01 || seed)
	        v = h(); // v = hmac(k || v)
	    };
	    const gen = () => {
	        // HMAC-DRBG generate() function
	        if (i++ >= 1000)
	            throw new Error('drbg: tried 1000 values');
	        let len = 0;
	        const out = [];
	        while (len < qByteLen) {
	            v = h();
	            const sl = v.slice();
	            out.push(sl);
	            len += v.length;
	        }
	        return concatBytes$2(...out);
	    };
	    const genUntil = (seed, pred) => {
	        reset();
	        reseed(seed); // Steps D-G
	        let res = undefined; // Step H: grind until k is in [1..n-1]
	        while (!(res = pred(gen())))
	            reseed();
	        reset();
	        return res;
	    };
	    return genUntil;
	}
	// Validating curves and fields
	const validatorFns = {
	    bigint: (val) => typeof val === 'bigint',
	    function: (val) => typeof val === 'function',
	    boolean: (val) => typeof val === 'boolean',
	    string: (val) => typeof val === 'string',
	    stringOrUint8Array: (val) => typeof val === 'string' || val instanceof Uint8Array,
	    isSafeInteger: (val) => Number.isSafeInteger(val),
	    array: (val) => Array.isArray(val),
	    field: (val, object) => object.Fp.isValid(val),
	    hash: (val) => typeof val === 'function' && Number.isSafeInteger(val.outputLen),
	};
	// type Record<K extends string | number | symbol, T> = { [P in K]: T; }
	function validateObject(object, validators, optValidators = {}) {
	    const checkField = (fieldName, type, isOptional) => {
	        const checkVal = validatorFns[type];
	        if (typeof checkVal !== 'function')
	            throw new Error(`Invalid validator "${type}", expected function`);
	        const val = object[fieldName];
	        if (isOptional && val === undefined)
	            return;
	        if (!checkVal(val, object)) {
	            throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
	        }
	    };
	    for (const [fieldName, type] of Object.entries(validators))
	        checkField(fieldName, type, false);
	    for (const [fieldName, type] of Object.entries(optValidators))
	        checkField(fieldName, type, true);
	    return object;
	}
	// validate type tests
	// const o: { a: number; b: number; c: number } = { a: 1, b: 5, c: 6 };
	// const z0 = validateObject(o, { a: 'isSafeInteger' }, { c: 'bigint' }); // Ok!
	// // Should fail type-check
	// const z1 = validateObject(o, { a: 'tmp' }, { c: 'zz' });
	// const z2 = validateObject(o, { a: 'isSafeInteger' }, { c: 'zz' });
	// const z3 = validateObject(o, { test: 'boolean', z: 'bug' });
	// const z4 = validateObject(o, { a: 'boolean', z: 'bug' });

	var ut = /*#__PURE__*/Object.freeze({
		__proto__: null,
		bitGet: bitGet,
		bitLen: bitLen$1,
		bitMask: bitMask$1,
		bitSet: bitSet,
		bytesToHex: bytesToHex$3,
		bytesToNumberBE: bytesToNumberBE$1,
		bytesToNumberLE: bytesToNumberLE$1,
		concatBytes: concatBytes$2,
		createHmacDrbg: createHmacDrbg$1,
		ensureBytes: ensureBytes$1,
		equalBytes: equalBytes$1,
		hexToBytes: hexToBytes$3,
		hexToNumber: hexToNumber$1,
		numberToBytesBE: numberToBytesBE$1,
		numberToBytesLE: numberToBytesLE$1,
		numberToHexUnpadded: numberToHexUnpadded$1,
		numberToVarBytesBE: numberToVarBytesBE,
		utf8ToBytes: utf8ToBytes$3,
		validateObject: validateObject
	});

	/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	// Utilities for modular arithmetics and finite fields
	// prettier-ignore
	const _0n$8 = BigInt(0), _1n$8 = BigInt(1), _2n$4 = BigInt(2), _3n$3 = BigInt(3);
	// prettier-ignore
	const _4n$2 = BigInt(4), _5n$1 = BigInt(5), _8n$1 = BigInt(8);
	// prettier-ignore
	BigInt(9); BigInt(16);
	// Calculates a modulo b
	function mod$1(a, b) {
	    const result = a % b;
	    return result >= _0n$8 ? result : b + result;
	}
	/**
	 * Efficiently raise num to power and do modular division.
	 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
	 * @example
	 * pow(2n, 6n, 11n) // 64n % 11n == 9n
	 */
	// TODO: use field version && remove
	function pow(num, power, modulo) {
	    if (modulo <= _0n$8 || power < _0n$8)
	        throw new Error('Expected power/modulo > 0');
	    if (modulo === _1n$8)
	        return _0n$8;
	    let res = _1n$8;
	    while (power > _0n$8) {
	        if (power & _1n$8)
	            res = (res * num) % modulo;
	        num = (num * num) % modulo;
	        power >>= _1n$8;
	    }
	    return res;
	}
	// Does x ^ (2 ^ power) mod p. pow2(30, 4) == 30 ^ (2 ^ 4)
	function pow2$1(x, power, modulo) {
	    let res = x;
	    while (power-- > _0n$8) {
	        res *= res;
	        res %= modulo;
	    }
	    return res;
	}
	// Inverses number over modulo
	function invert$1(number, modulo) {
	    if (number === _0n$8 || modulo <= _0n$8) {
	        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
	    }
	    // Euclidean GCD https://brilliant.org/wiki/extended-euclidean-algorithm/
	    // Fermat's little theorem "CT-like" version inv(n) = n^(m-2) mod m is 30x slower.
	    let a = mod$1(number, modulo);
	    let b = modulo;
	    // prettier-ignore
	    let x = _0n$8, u = _1n$8;
	    while (a !== _0n$8) {
	        // JIT applies optimization if those two lines follow each other
	        const q = b / a;
	        const r = b % a;
	        const m = x - u * q;
	        // prettier-ignore
	        b = a, a = r, x = u, u = m;
	    }
	    const gcd = b;
	    if (gcd !== _1n$8)
	        throw new Error('invert: does not exist');
	    return mod$1(x, modulo);
	}
	/**
	 * Tonelli-Shanks square root search algorithm.
	 * 1. https://eprint.iacr.org/2012/685.pdf (page 12)
	 * 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
	 * Will start an infinite loop if field order P is not prime.
	 * @param P field order
	 * @returns function that takes field Fp (created from P) and number n
	 */
	function tonelliShanks$1(P) {
	    // Legendre constant: used to calculate Legendre symbol (a | p),
	    // which denotes the value of a^((p-1)/2) (mod p).
	    // (a | p) ≡ 1    if a is a square (mod p)
	    // (a | p) ≡ -1   if a is not a square (mod p)
	    // (a | p) ≡ 0    if a ≡ 0 (mod p)
	    const legendreC = (P - _1n$8) / _2n$4;
	    let Q, S, Z;
	    // Step 1: By factoring out powers of 2 from p - 1,
	    // find q and s such that p - 1 = q*(2^s) with q odd
	    for (Q = P - _1n$8, S = 0; Q % _2n$4 === _0n$8; Q /= _2n$4, S++)
	        ;
	    // Step 2: Select a non-square z such that (z | p) ≡ -1 and set c ≡ zq
	    for (Z = _2n$4; Z < P && pow(Z, legendreC, P) !== P - _1n$8; Z++)
	        ;
	    // Fast-path
	    if (S === 1) {
	        const p1div4 = (P + _1n$8) / _4n$2;
	        return function tonelliFast(Fp, n) {
	            const root = Fp.pow(n, p1div4);
	            if (!Fp.eql(Fp.sqr(root), n))
	                throw new Error('Cannot find square root');
	            return root;
	        };
	    }
	    // Slow-path
	    const Q1div2 = (Q + _1n$8) / _2n$4;
	    return function tonelliSlow(Fp, n) {
	        // Step 0: Check that n is indeed a square: (n | p) should not be ≡ -1
	        if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
	            throw new Error('Cannot find square root');
	        let r = S;
	        // TODO: will fail at Fp2/etc
	        let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q); // will update both x and b
	        let x = Fp.pow(n, Q1div2); // first guess at the square root
	        let b = Fp.pow(n, Q); // first guess at the fudge factor
	        while (!Fp.eql(b, Fp.ONE)) {
	            if (Fp.eql(b, Fp.ZERO))
	                return Fp.ZERO; // https://en.wikipedia.org/wiki/Tonelli%E2%80%93Shanks_algorithm (4. If t = 0, return r = 0)
	            // Find m such b^(2^m)==1
	            let m = 1;
	            for (let t2 = Fp.sqr(b); m < r; m++) {
	                if (Fp.eql(t2, Fp.ONE))
	                    break;
	                t2 = Fp.sqr(t2); // t2 *= t2
	            }
	            // NOTE: r-m-1 can be bigger than 32, need to convert to bigint before shift, otherwise there will be overflow
	            const ge = Fp.pow(g, _1n$8 << BigInt(r - m - 1)); // ge = 2^(r-m-1)
	            g = Fp.sqr(ge); // g = ge * ge
	            x = Fp.mul(x, ge); // x *= ge
	            b = Fp.mul(b, g); // b *= g
	            r = m;
	        }
	        return x;
	    };
	}
	function FpSqrt$1(P) {
	    // NOTE: different algorithms can give different roots, it is up to user to decide which one they want.
	    // For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
	    // P ≡ 3 (mod 4)
	    // √n = n^((P+1)/4)
	    if (P % _4n$2 === _3n$3) {
	        // Not all roots possible!
	        // const ORDER =
	        //   0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn;
	        // const NUM = 72057594037927816n;
	        const p1div4 = (P + _1n$8) / _4n$2;
	        return function sqrt3mod4(Fp, n) {
	            const root = Fp.pow(n, p1div4);
	            // Throw if root**2 != n
	            if (!Fp.eql(Fp.sqr(root), n))
	                throw new Error('Cannot find square root');
	            return root;
	        };
	    }
	    // Atkin algorithm for q ≡ 5 (mod 8), https://eprint.iacr.org/2012/685.pdf (page 10)
	    if (P % _8n$1 === _5n$1) {
	        const c1 = (P - _5n$1) / _8n$1;
	        return function sqrt5mod8(Fp, n) {
	            const n2 = Fp.mul(n, _2n$4);
	            const v = Fp.pow(n2, c1);
	            const nv = Fp.mul(n, v);
	            const i = Fp.mul(Fp.mul(nv, _2n$4), v);
	            const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
	            if (!Fp.eql(Fp.sqr(root), n))
	                throw new Error('Cannot find square root');
	            return root;
	        };
	    }
	    // Other cases: Tonelli-Shanks algorithm
	    return tonelliShanks$1(P);
	}
	// prettier-ignore
	const FIELD_FIELDS$1 = [
	    'create', 'isValid', 'is0', 'neg', 'inv', 'sqrt', 'sqr',
	    'eql', 'add', 'sub', 'mul', 'pow', 'div',
	    'addN', 'subN', 'mulN', 'sqrN'
	];
	function validateField$1(field) {
	    const initial = {
	        ORDER: 'bigint',
	        MASK: 'bigint',
	        BYTES: 'isSafeInteger',
	        BITS: 'isSafeInteger',
	    };
	    const opts = FIELD_FIELDS$1.reduce((map, val) => {
	        map[val] = 'function';
	        return map;
	    }, initial);
	    return validateObject(field, opts);
	}
	// Generic field functions
	/**
	 * Same as `pow` but for Fp: non-constant-time.
	 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
	 */
	function FpPow$1(f, num, power) {
	    // Should have same speed as pow for bigints
	    // TODO: benchmark!
	    if (power < _0n$8)
	        throw new Error('Expected power > 0');
	    if (power === _0n$8)
	        return f.ONE;
	    if (power === _1n$8)
	        return num;
	    let p = f.ONE;
	    let d = num;
	    while (power > _0n$8) {
	        if (power & _1n$8)
	            p = f.mul(p, d);
	        d = f.sqr(d);
	        power >>= _1n$8;
	    }
	    return p;
	}
	/**
	 * Efficiently invert an array of Field elements.
	 * `inv(0)` will return `undefined` here: make sure to throw an error.
	 */
	function FpInvertBatch$1(f, nums) {
	    const tmp = new Array(nums.length);
	    // Walk from first to last, multiply them by each other MOD p
	    const lastMultiplied = nums.reduce((acc, num, i) => {
	        if (f.is0(num))
	            return acc;
	        tmp[i] = acc;
	        return f.mul(acc, num);
	    }, f.ONE);
	    // Invert last element
	    const inverted = f.inv(lastMultiplied);
	    // Walk from last to first, multiply them by inverted each other MOD p
	    nums.reduceRight((acc, num, i) => {
	        if (f.is0(num))
	            return acc;
	        tmp[i] = f.mul(acc, tmp[i]);
	        return f.mul(acc, num);
	    }, inverted);
	    return tmp;
	}
	// CURVE.n lengths
	function nLength$1(n, nBitLength) {
	    // Bit size, byte size of CURVE.n
	    const _nBitLength = nBitLength !== undefined ? nBitLength : n.toString(2).length;
	    const nByteLength = Math.ceil(_nBitLength / 8);
	    return { nBitLength: _nBitLength, nByteLength };
	}
	/**
	 * Initializes a finite field over prime. **Non-primes are not supported.**
	 * Do not init in loop: slow. Very fragile: always run a benchmark on a change.
	 * Major performance optimizations:
	 * * a) denormalized operations like mulN instead of mul
	 * * b) same object shape: never add or remove keys
	 * * c) Object.freeze
	 * @param ORDER prime positive bigint
	 * @param bitLen how many bits the field consumes
	 * @param isLE (def: false) if encoding / decoding should be in little-endian
	 * @param redef optional faster redefinitions of sqrt and other methods
	 */
	function Field$1(ORDER, bitLen, isLE = false, redef = {}) {
	    if (ORDER <= _0n$8)
	        throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
	    const { nBitLength: BITS, nByteLength: BYTES } = nLength$1(ORDER, bitLen);
	    if (BYTES > 2048)
	        throw new Error('Field lengths over 2048 bytes are not supported');
	    const sqrtP = FpSqrt$1(ORDER);
	    const f = Object.freeze({
	        ORDER,
	        BITS,
	        BYTES,
	        MASK: bitMask$1(BITS),
	        ZERO: _0n$8,
	        ONE: _1n$8,
	        create: (num) => mod$1(num, ORDER),
	        isValid: (num) => {
	            if (typeof num !== 'bigint')
	                throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
	            return _0n$8 <= num && num < ORDER; // 0 is valid element, but it's not invertible
	        },
	        is0: (num) => num === _0n$8,
	        isOdd: (num) => (num & _1n$8) === _1n$8,
	        neg: (num) => mod$1(-num, ORDER),
	        eql: (lhs, rhs) => lhs === rhs,
	        sqr: (num) => mod$1(num * num, ORDER),
	        add: (lhs, rhs) => mod$1(lhs + rhs, ORDER),
	        sub: (lhs, rhs) => mod$1(lhs - rhs, ORDER),
	        mul: (lhs, rhs) => mod$1(lhs * rhs, ORDER),
	        pow: (num, power) => FpPow$1(f, num, power),
	        div: (lhs, rhs) => mod$1(lhs * invert$1(rhs, ORDER), ORDER),
	        // Same as above, but doesn't normalize
	        sqrN: (num) => num * num,
	        addN: (lhs, rhs) => lhs + rhs,
	        subN: (lhs, rhs) => lhs - rhs,
	        mulN: (lhs, rhs) => lhs * rhs,
	        inv: (num) => invert$1(num, ORDER),
	        sqrt: redef.sqrt || ((n) => sqrtP(f, n)),
	        invertBatch: (lst) => FpInvertBatch$1(f, lst),
	        // TODO: do we really need constant cmov?
	        // We don't have const-time bigints anyway, so probably will be not very useful
	        cmov: (a, b, c) => (c ? b : a),
	        toBytes: (num) => (isLE ? numberToBytesLE$1(num, BYTES) : numberToBytesBE$1(num, BYTES)),
	        fromBytes: (bytes) => {
	            if (bytes.length !== BYTES)
	                throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes.length}`);
	            return isLE ? bytesToNumberLE$1(bytes) : bytesToNumberBE$1(bytes);
	        },
	    });
	    return Object.freeze(f);
	}
	/**
	 * Returns total number of bytes consumed by the field element.
	 * For example, 32 bytes for usual 256-bit weierstrass curve.
	 * @param fieldOrder number of field elements, usually CURVE.n
	 * @returns byte length of field
	 */
	function getFieldBytesLength$1(fieldOrder) {
	    if (typeof fieldOrder !== 'bigint')
	        throw new Error('field order must be bigint');
	    const bitLength = fieldOrder.toString(2).length;
	    return Math.ceil(bitLength / 8);
	}
	/**
	 * Returns minimal amount of bytes that can be safely reduced
	 * by field order.
	 * Should be 2^-128 for 128-bit curve such as P256.
	 * @param fieldOrder number of field elements, usually CURVE.n
	 * @returns byte length of target hash
	 */
	function getMinHashLength$1(fieldOrder) {
	    const length = getFieldBytesLength$1(fieldOrder);
	    return length + Math.ceil(length / 2);
	}
	/**
	 * "Constant-time" private key generation utility.
	 * Can take (n + n/2) or more bytes of uniform input e.g. from CSPRNG or KDF
	 * and convert them into private scalar, with the modulo bias being negligible.
	 * Needs at least 48 bytes of input for 32-byte private key.
	 * https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
	 * FIPS 186-5, A.2 https://csrc.nist.gov/publications/detail/fips/186/5/final
	 * RFC 9380, https://www.rfc-editor.org/rfc/rfc9380#section-5
	 * @param hash hash output from SHA3 or a similar function
	 * @param groupOrder size of subgroup - (e.g. secp256k1.CURVE.n)
	 * @param isLE interpret hash bytes as LE num
	 * @returns valid private scalar
	 */
	function mapHashToField$1(key, fieldOrder, isLE = false) {
	    const len = key.length;
	    const fieldLen = getFieldBytesLength$1(fieldOrder);
	    const minLen = getMinHashLength$1(fieldOrder);
	    // No small numbers: need to understand bias story. No huge numbers: easier to detect JS timings.
	    if (len < 16 || len < minLen || len > 1024)
	        throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
	    const num = isLE ? bytesToNumberBE$1(key) : bytesToNumberLE$1(key);
	    // `mod(x, 11)` can sometimes produce 0. `mod(x, 10) + 1` is the same, but no 0
	    const reduced = mod$1(num, fieldOrder - _1n$8) + _1n$8;
	    return isLE ? numberToBytesLE$1(reduced, fieldLen) : numberToBytesBE$1(reduced, fieldLen);
	}

	/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	// Abelian group utilities
	const _0n$7 = BigInt(0);
	const _1n$7 = BigInt(1);
	// Elliptic curve multiplication of Point by scalar. Fragile.
	// Scalars should always be less than curve order: this should be checked inside of a curve itself.
	// Creates precomputation tables for fast multiplication:
	// - private scalar is split by fixed size windows of W bits
	// - every window point is collected from window's table & added to accumulator
	// - since windows are different, same point inside tables won't be accessed more than once per calc
	// - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
	// - +1 window is neccessary for wNAF
	// - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
	// TODO: Research returning 2d JS array of windows, instead of a single window. This would allow
	// windows to be in different memory locations
	function wNAF$1(c, bits) {
	    const constTimeNegate = (condition, item) => {
	        const neg = item.negate();
	        return condition ? neg : item;
	    };
	    const opts = (W) => {
	        const windows = Math.ceil(bits / W) + 1; // +1, because
	        const windowSize = 2 ** (W - 1); // -1 because we skip zero
	        return { windows, windowSize };
	    };
	    return {
	        constTimeNegate,
	        // non-const time multiplication ladder
	        unsafeLadder(elm, n) {
	            let p = c.ZERO;
	            let d = elm;
	            while (n > _0n$7) {
	                if (n & _1n$7)
	                    p = p.add(d);
	                d = d.double();
	                n >>= _1n$7;
	            }
	            return p;
	        },
	        /**
	         * Creates a wNAF precomputation window. Used for caching.
	         * Default window size is set by `utils.precompute()` and is equal to 8.
	         * Number of precomputed points depends on the curve size:
	         * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
	         * - 𝑊 is the window size
	         * - 𝑛 is the bitlength of the curve order.
	         * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
	         * @returns precomputed point tables flattened to a single array
	         */
	        precomputeWindow(elm, W) {
	            const { windows, windowSize } = opts(W);
	            const points = [];
	            let p = elm;
	            let base = p;
	            for (let window = 0; window < windows; window++) {
	                base = p;
	                points.push(base);
	                // =1, because we skip zero
	                for (let i = 1; i < windowSize; i++) {
	                    base = base.add(p);
	                    points.push(base);
	                }
	                p = base.double();
	            }
	            return points;
	        },
	        /**
	         * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
	         * @param W window size
	         * @param precomputes precomputed tables
	         * @param n scalar (we don't check here, but should be less than curve order)
	         * @returns real and fake (for const-time) points
	         */
	        wNAF(W, precomputes, n) {
	            // TODO: maybe check that scalar is less than group order? wNAF behavious is undefined otherwise
	            // But need to carefully remove other checks before wNAF. ORDER == bits here
	            const { windows, windowSize } = opts(W);
	            let p = c.ZERO;
	            let f = c.BASE;
	            const mask = BigInt(2 ** W - 1); // Create mask with W ones: 15 for W=4 etc.
	            const maxNumber = 2 ** W;
	            const shiftBy = BigInt(W);
	            for (let window = 0; window < windows; window++) {
	                const offset = window * windowSize;
	                // Extract W bits.
	                let wbits = Number(n & mask);
	                // Shift number by W bits.
	                n >>= shiftBy;
	                // If the bits are bigger than max size, we'll split those.
	                // +224 => 256 - 32
	                if (wbits > windowSize) {
	                    wbits -= maxNumber;
	                    n += _1n$7;
	                }
	                // This code was first written with assumption that 'f' and 'p' will never be infinity point:
	                // since each addition is multiplied by 2 ** W, it cannot cancel each other. However,
	                // there is negate now: it is possible that negated element from low value
	                // would be the same as high element, which will create carry into next window.
	                // It's not obvious how this can fail, but still worth investigating later.
	                // Check if we're onto Zero point.
	                // Add random point inside current window to f.
	                const offset1 = offset;
	                const offset2 = offset + Math.abs(wbits) - 1; // -1 because we skip zero
	                const cond1 = window % 2 !== 0;
	                const cond2 = wbits < 0;
	                if (wbits === 0) {
	                    // The most important part for const-time getPublicKey
	                    f = f.add(constTimeNegate(cond1, precomputes[offset1]));
	                }
	                else {
	                    p = p.add(constTimeNegate(cond2, precomputes[offset2]));
	                }
	            }
	            // JIT-compiler should not eliminate f here, since it will later be used in normalizeZ()
	            // Even if the variable is still unused, there are some checks which will
	            // throw an exception, so compiler needs to prove they won't happen, which is hard.
	            // At this point there is a way to F be infinity-point even if p is not,
	            // which makes it less const-time: around 1 bigint multiply.
	            return { p, f };
	        },
	        wNAFCached(P, precomputesMap, n, transform) {
	            // @ts-ignore
	            const W = P._WINDOW_SIZE || 1;
	            // Calculate precomputes on a first run, reuse them after
	            let comp = precomputesMap.get(P);
	            if (!comp) {
	                comp = this.precomputeWindow(P, W);
	                if (W !== 1) {
	                    precomputesMap.set(P, transform(comp));
	                }
	            }
	            return this.wNAF(W, comp, n);
	        },
	    };
	}
	function validateBasic(curve) {
	    validateField$1(curve.Fp);
	    validateObject(curve, {
	        n: 'bigint',
	        h: 'bigint',
	        Gx: 'field',
	        Gy: 'field',
	    }, {
	        nBitLength: 'isSafeInteger',
	        nByteLength: 'isSafeInteger',
	    });
	    // Set defaults
	    return Object.freeze({
	        ...nLength$1(curve.n, curve.nBitLength),
	        ...curve,
	        ...{ p: curve.Fp.ORDER },
	    });
	}

	/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	// Short Weierstrass curve. The formula is: y² = x³ + ax + b
	function validatePointOpts(curve) {
	    const opts = validateBasic(curve);
	    validateObject(opts, {
	        a: 'field',
	        b: 'field',
	    }, {
	        allowedPrivateKeyLengths: 'array',
	        wrapPrivateKey: 'boolean',
	        isTorsionFree: 'function',
	        clearCofactor: 'function',
	        allowInfinityPoint: 'boolean',
	        fromBytes: 'function',
	        toBytes: 'function',
	    });
	    const { endo, Fp, a } = opts;
	    if (endo) {
	        if (!Fp.eql(a, Fp.ZERO)) {
	            throw new Error('Endomorphism can only be defined for Koblitz curves that have a=0');
	        }
	        if (typeof endo !== 'object' ||
	            typeof endo.beta !== 'bigint' ||
	            typeof endo.splitScalar !== 'function') {
	            throw new Error('Expected endomorphism with beta: bigint and splitScalar: function');
	        }
	    }
	    return Object.freeze({ ...opts });
	}
	// ASN.1 DER encoding utilities
	const { bytesToNumberBE: b2n, hexToBytes: h2b } = ut;
	const DER$1 = {
	    // asn.1 DER encoding utils
	    Err: class DERErr extends Error {
	        constructor(m = '') {
	            super(m);
	        }
	    },
	    _parseInt(data) {
	        const { Err: E } = DER$1;
	        if (data.length < 2 || data[0] !== 0x02)
	            throw new E('Invalid signature integer tag');
	        const len = data[1];
	        const res = data.subarray(2, len + 2);
	        if (!len || res.length !== len)
	            throw new E('Invalid signature integer: wrong length');
	        // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
	        // since we always use positive integers here. It must always be empty:
	        // - add zero byte if exists
	        // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
	        if (res[0] & 128)
	            throw new E('Invalid signature integer: negative');
	        if (res[0] === 0x00 && !(res[1] & 128))
	            throw new E('Invalid signature integer: unnecessary leading zero');
	        return { d: b2n(res), l: data.subarray(len + 2) }; // d is data, l is left
	    },
	    toSig(hex) {
	        // parse DER signature
	        const { Err: E } = DER$1;
	        const data = typeof hex === 'string' ? h2b(hex) : hex;
	        if (!(data instanceof Uint8Array))
	            throw new Error('ui8a expected');
	        let l = data.length;
	        if (l < 2 || data[0] != 0x30)
	            throw new E('Invalid signature tag');
	        if (data[1] !== l - 2)
	            throw new E('Invalid signature: incorrect length');
	        const { d: r, l: sBytes } = DER$1._parseInt(data.subarray(2));
	        const { d: s, l: rBytesLeft } = DER$1._parseInt(sBytes);
	        if (rBytesLeft.length)
	            throw new E('Invalid signature: left bytes after parsing');
	        return { r, s };
	    },
	    hexFromSig(sig) {
	        // Add leading zero if first byte has negative bit enabled. More details in '_parseInt'
	        const slice = (s) => (Number.parseInt(s[0], 16) & 8 ? '00' + s : s);
	        const h = (num) => {
	            const hex = num.toString(16);
	            return hex.length & 1 ? `0${hex}` : hex;
	        };
	        const s = slice(h(sig.s));
	        const r = slice(h(sig.r));
	        const shl = s.length / 2;
	        const rhl = r.length / 2;
	        const sl = h(shl);
	        const rl = h(rhl);
	        return `30${h(rhl + shl + 4)}02${rl}${r}02${sl}${s}`;
	    },
	};
	// Be friendly to bad ECMAScript parsers by not using bigint literals
	// prettier-ignore
	const _0n$6 = BigInt(0), _1n$6 = BigInt(1); BigInt(2); const _3n$2 = BigInt(3); BigInt(4);
	function weierstrassPoints(opts) {
	    const CURVE = validatePointOpts(opts);
	    const { Fp } = CURVE; // All curves has same field / group length as for now, but they can differ
	    const toBytes = CURVE.toBytes ||
	        ((_c, point, _isCompressed) => {
	            const a = point.toAffine();
	            return concatBytes$2(Uint8Array.from([0x04]), Fp.toBytes(a.x), Fp.toBytes(a.y));
	        });
	    const fromBytes = CURVE.fromBytes ||
	        ((bytes) => {
	            // const head = bytes[0];
	            const tail = bytes.subarray(1);
	            // if (head !== 0x04) throw new Error('Only non-compressed encoding is supported');
	            const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
	            const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
	            return { x, y };
	        });
	    /**
	     * y² = x³ + ax + b: Short weierstrass curve formula
	     * @returns y²
	     */
	    function weierstrassEquation(x) {
	        const { a, b } = CURVE;
	        const x2 = Fp.sqr(x); // x * x
	        const x3 = Fp.mul(x2, x); // x2 * x
	        return Fp.add(Fp.add(x3, Fp.mul(x, a)), b); // x3 + a * x + b
	    }
	    // Validate whether the passed curve params are valid.
	    // We check if curve equation works for generator point.
	    // `assertValidity()` won't work: `isTorsionFree()` is not available at this point in bls12-381.
	    // ProjectivePoint class has not been initialized yet.
	    if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
	        throw new Error('bad generator point: equation left != right');
	    // Valid group elements reside in range 1..n-1
	    function isWithinCurveOrder(num) {
	        return typeof num === 'bigint' && _0n$6 < num && num < CURVE.n;
	    }
	    function assertGE(num) {
	        if (!isWithinCurveOrder(num))
	            throw new Error('Expected valid bigint: 0 < bigint < curve.n');
	    }
	    // Validates if priv key is valid and converts it to bigint.
	    // Supports options allowedPrivateKeyLengths and wrapPrivateKey.
	    function normPrivateKeyToScalar(key) {
	        const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n } = CURVE;
	        if (lengths && typeof key !== 'bigint') {
	            if (key instanceof Uint8Array)
	                key = bytesToHex$3(key);
	            // Normalize to hex string, pad. E.g. P521 would norm 130-132 char hex to 132-char bytes
	            if (typeof key !== 'string' || !lengths.includes(key.length))
	                throw new Error('Invalid key');
	            key = key.padStart(nByteLength * 2, '0');
	        }
	        let num;
	        try {
	            num =
	                typeof key === 'bigint'
	                    ? key
	                    : bytesToNumberBE$1(ensureBytes$1('private key', key, nByteLength));
	        }
	        catch (error) {
	            throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
	        }
	        if (wrapPrivateKey)
	            num = mod$1(num, n); // disabled by default, enabled for BLS
	        assertGE(num); // num in range [1..N-1]
	        return num;
	    }
	    const pointPrecomputes = new Map();
	    function assertPrjPoint(other) {
	        if (!(other instanceof Point))
	            throw new Error('ProjectivePoint expected');
	    }
	    /**
	     * Projective Point works in 3d / projective (homogeneous) coordinates: (x, y, z) ∋ (x=x/z, y=y/z)
	     * Default Point works in 2d / affine coordinates: (x, y)
	     * We're doing calculations in projective, because its operations don't require costly inversion.
	     */
	    class Point {
	        constructor(px, py, pz) {
	            this.px = px;
	            this.py = py;
	            this.pz = pz;
	            if (px == null || !Fp.isValid(px))
	                throw new Error('x required');
	            if (py == null || !Fp.isValid(py))
	                throw new Error('y required');
	            if (pz == null || !Fp.isValid(pz))
	                throw new Error('z required');
	        }
	        // Does not validate if the point is on-curve.
	        // Use fromHex instead, or call assertValidity() later.
	        static fromAffine(p) {
	            const { x, y } = p || {};
	            if (!p || !Fp.isValid(x) || !Fp.isValid(y))
	                throw new Error('invalid affine point');
	            if (p instanceof Point)
	                throw new Error('projective point not allowed');
	            const is0 = (i) => Fp.eql(i, Fp.ZERO);
	            // fromAffine(x:0, y:0) would produce (x:0, y:0, z:1), but we need (x:0, y:1, z:0)
	            if (is0(x) && is0(y))
	                return Point.ZERO;
	            return new Point(x, y, Fp.ONE);
	        }
	        get x() {
	            return this.toAffine().x;
	        }
	        get y() {
	            return this.toAffine().y;
	        }
	        /**
	         * Takes a bunch of Projective Points but executes only one
	         * inversion on all of them. Inversion is very slow operation,
	         * so this improves performance massively.
	         * Optimization: converts a list of projective points to a list of identical points with Z=1.
	         */
	        static normalizeZ(points) {
	            const toInv = Fp.invertBatch(points.map((p) => p.pz));
	            return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
	        }
	        /**
	         * Converts hash string or Uint8Array to Point.
	         * @param hex short/long ECDSA hex
	         */
	        static fromHex(hex) {
	            const P = Point.fromAffine(fromBytes(ensureBytes$1('pointHex', hex)));
	            P.assertValidity();
	            return P;
	        }
	        // Multiplies generator point by privateKey.
	        static fromPrivateKey(privateKey) {
	            return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
	        }
	        // "Private method", don't use it directly
	        _setWindowSize(windowSize) {
	            this._WINDOW_SIZE = windowSize;
	            pointPrecomputes.delete(this);
	        }
	        // A point on curve is valid if it conforms to equation.
	        assertValidity() {
	            if (this.is0()) {
	                // (0, 1, 0) aka ZERO is invalid in most contexts.
	                // In BLS, ZERO can be serialized, so we allow it.
	                // (0, 0, 0) is wrong representation of ZERO and is always invalid.
	                if (CURVE.allowInfinityPoint && !Fp.is0(this.py))
	                    return;
	                throw new Error('bad point: ZERO');
	            }
	            // Some 3rd-party test vectors require different wording between here & `fromCompressedHex`
	            const { x, y } = this.toAffine();
	            // Check if x, y are valid field elements
	            if (!Fp.isValid(x) || !Fp.isValid(y))
	                throw new Error('bad point: x or y not FE');
	            const left = Fp.sqr(y); // y²
	            const right = weierstrassEquation(x); // x³ + ax + b
	            if (!Fp.eql(left, right))
	                throw new Error('bad point: equation left != right');
	            if (!this.isTorsionFree())
	                throw new Error('bad point: not in prime-order subgroup');
	        }
	        hasEvenY() {
	            const { y } = this.toAffine();
	            if (Fp.isOdd)
	                return !Fp.isOdd(y);
	            throw new Error("Field doesn't support isOdd");
	        }
	        /**
	         * Compare one point to another.
	         */
	        equals(other) {
	            assertPrjPoint(other);
	            const { px: X1, py: Y1, pz: Z1 } = this;
	            const { px: X2, py: Y2, pz: Z2 } = other;
	            const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
	            const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
	            return U1 && U2;
	        }
	        /**
	         * Flips point to one corresponding to (x, -y) in Affine coordinates.
	         */
	        negate() {
	            return new Point(this.px, Fp.neg(this.py), this.pz);
	        }
	        // Renes-Costello-Batina exception-free doubling formula.
	        // There is 30% faster Jacobian formula, but it is not complete.
	        // https://eprint.iacr.org/2015/1060, algorithm 3
	        // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
	        double() {
	            const { a, b } = CURVE;
	            const b3 = Fp.mul(b, _3n$2);
	            const { px: X1, py: Y1, pz: Z1 } = this;
	            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
	            let t0 = Fp.mul(X1, X1); // step 1
	            let t1 = Fp.mul(Y1, Y1);
	            let t2 = Fp.mul(Z1, Z1);
	            let t3 = Fp.mul(X1, Y1);
	            t3 = Fp.add(t3, t3); // step 5
	            Z3 = Fp.mul(X1, Z1);
	            Z3 = Fp.add(Z3, Z3);
	            X3 = Fp.mul(a, Z3);
	            Y3 = Fp.mul(b3, t2);
	            Y3 = Fp.add(X3, Y3); // step 10
	            X3 = Fp.sub(t1, Y3);
	            Y3 = Fp.add(t1, Y3);
	            Y3 = Fp.mul(X3, Y3);
	            X3 = Fp.mul(t3, X3);
	            Z3 = Fp.mul(b3, Z3); // step 15
	            t2 = Fp.mul(a, t2);
	            t3 = Fp.sub(t0, t2);
	            t3 = Fp.mul(a, t3);
	            t3 = Fp.add(t3, Z3);
	            Z3 = Fp.add(t0, t0); // step 20
	            t0 = Fp.add(Z3, t0);
	            t0 = Fp.add(t0, t2);
	            t0 = Fp.mul(t0, t3);
	            Y3 = Fp.add(Y3, t0);
	            t2 = Fp.mul(Y1, Z1); // step 25
	            t2 = Fp.add(t2, t2);
	            t0 = Fp.mul(t2, t3);
	            X3 = Fp.sub(X3, t0);
	            Z3 = Fp.mul(t2, t1);
	            Z3 = Fp.add(Z3, Z3); // step 30
	            Z3 = Fp.add(Z3, Z3);
	            return new Point(X3, Y3, Z3);
	        }
	        // Renes-Costello-Batina exception-free addition formula.
	        // There is 30% faster Jacobian formula, but it is not complete.
	        // https://eprint.iacr.org/2015/1060, algorithm 1
	        // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
	        add(other) {
	            assertPrjPoint(other);
	            const { px: X1, py: Y1, pz: Z1 } = this;
	            const { px: X2, py: Y2, pz: Z2 } = other;
	            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
	            const a = CURVE.a;
	            const b3 = Fp.mul(CURVE.b, _3n$2);
	            let t0 = Fp.mul(X1, X2); // step 1
	            let t1 = Fp.mul(Y1, Y2);
	            let t2 = Fp.mul(Z1, Z2);
	            let t3 = Fp.add(X1, Y1);
	            let t4 = Fp.add(X2, Y2); // step 5
	            t3 = Fp.mul(t3, t4);
	            t4 = Fp.add(t0, t1);
	            t3 = Fp.sub(t3, t4);
	            t4 = Fp.add(X1, Z1);
	            let t5 = Fp.add(X2, Z2); // step 10
	            t4 = Fp.mul(t4, t5);
	            t5 = Fp.add(t0, t2);
	            t4 = Fp.sub(t4, t5);
	            t5 = Fp.add(Y1, Z1);
	            X3 = Fp.add(Y2, Z2); // step 15
	            t5 = Fp.mul(t5, X3);
	            X3 = Fp.add(t1, t2);
	            t5 = Fp.sub(t5, X3);
	            Z3 = Fp.mul(a, t4);
	            X3 = Fp.mul(b3, t2); // step 20
	            Z3 = Fp.add(X3, Z3);
	            X3 = Fp.sub(t1, Z3);
	            Z3 = Fp.add(t1, Z3);
	            Y3 = Fp.mul(X3, Z3);
	            t1 = Fp.add(t0, t0); // step 25
	            t1 = Fp.add(t1, t0);
	            t2 = Fp.mul(a, t2);
	            t4 = Fp.mul(b3, t4);
	            t1 = Fp.add(t1, t2);
	            t2 = Fp.sub(t0, t2); // step 30
	            t2 = Fp.mul(a, t2);
	            t4 = Fp.add(t4, t2);
	            t0 = Fp.mul(t1, t4);
	            Y3 = Fp.add(Y3, t0);
	            t0 = Fp.mul(t5, t4); // step 35
	            X3 = Fp.mul(t3, X3);
	            X3 = Fp.sub(X3, t0);
	            t0 = Fp.mul(t3, t1);
	            Z3 = Fp.mul(t5, Z3);
	            Z3 = Fp.add(Z3, t0); // step 40
	            return new Point(X3, Y3, Z3);
	        }
	        subtract(other) {
	            return this.add(other.negate());
	        }
	        is0() {
	            return this.equals(Point.ZERO);
	        }
	        wNAF(n) {
	            return wnaf.wNAFCached(this, pointPrecomputes, n, (comp) => {
	                const toInv = Fp.invertBatch(comp.map((p) => p.pz));
	                return comp.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
	            });
	        }
	        /**
	         * Non-constant-time multiplication. Uses double-and-add algorithm.
	         * It's faster, but should only be used when you don't care about
	         * an exposed private key e.g. sig verification, which works over *public* keys.
	         */
	        multiplyUnsafe(n) {
	            const I = Point.ZERO;
	            if (n === _0n$6)
	                return I;
	            assertGE(n); // Will throw on 0
	            if (n === _1n$6)
	                return this;
	            const { endo } = CURVE;
	            if (!endo)
	                return wnaf.unsafeLadder(this, n);
	            // Apply endomorphism
	            let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
	            let k1p = I;
	            let k2p = I;
	            let d = this;
	            while (k1 > _0n$6 || k2 > _0n$6) {
	                if (k1 & _1n$6)
	                    k1p = k1p.add(d);
	                if (k2 & _1n$6)
	                    k2p = k2p.add(d);
	                d = d.double();
	                k1 >>= _1n$6;
	                k2 >>= _1n$6;
	            }
	            if (k1neg)
	                k1p = k1p.negate();
	            if (k2neg)
	                k2p = k2p.negate();
	            k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
	            return k1p.add(k2p);
	        }
	        /**
	         * Constant time multiplication.
	         * Uses wNAF method. Windowed method may be 10% faster,
	         * but takes 2x longer to generate and consumes 2x memory.
	         * Uses precomputes when available.
	         * Uses endomorphism for Koblitz curves.
	         * @param scalar by which the point would be multiplied
	         * @returns New point
	         */
	        multiply(scalar) {
	            assertGE(scalar);
	            let n = scalar;
	            let point, fake; // Fake point is used to const-time mult
	            const { endo } = CURVE;
	            if (endo) {
	                const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
	                let { p: k1p, f: f1p } = this.wNAF(k1);
	                let { p: k2p, f: f2p } = this.wNAF(k2);
	                k1p = wnaf.constTimeNegate(k1neg, k1p);
	                k2p = wnaf.constTimeNegate(k2neg, k2p);
	                k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
	                point = k1p.add(k2p);
	                fake = f1p.add(f2p);
	            }
	            else {
	                const { p, f } = this.wNAF(n);
	                point = p;
	                fake = f;
	            }
	            // Normalize `z` for both points, but return only real one
	            return Point.normalizeZ([point, fake])[0];
	        }
	        /**
	         * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
	         * Not using Strauss-Shamir trick: precomputation tables are faster.
	         * The trick could be useful if both P and Q are not G (not in our case).
	         * @returns non-zero affine point
	         */
	        multiplyAndAddUnsafe(Q, a, b) {
	            const G = Point.BASE; // No Strauss-Shamir trick: we have 10% faster G precomputes
	            const mul = (P, a // Select faster multiply() method
	            ) => (a === _0n$6 || a === _1n$6 || !P.equals(G) ? P.multiplyUnsafe(a) : P.multiply(a));
	            const sum = mul(this, a).add(mul(Q, b));
	            return sum.is0() ? undefined : sum;
	        }
	        // Converts Projective point to affine (x, y) coordinates.
	        // Can accept precomputed Z^-1 - for example, from invertBatch.
	        // (x, y, z) ∋ (x=x/z, y=y/z)
	        toAffine(iz) {
	            const { px: x, py: y, pz: z } = this;
	            const is0 = this.is0();
	            // If invZ was 0, we return zero point. However we still want to execute
	            // all operations, so we replace invZ with a random number, 1.
	            if (iz == null)
	                iz = is0 ? Fp.ONE : Fp.inv(z);
	            const ax = Fp.mul(x, iz);
	            const ay = Fp.mul(y, iz);
	            const zz = Fp.mul(z, iz);
	            if (is0)
	                return { x: Fp.ZERO, y: Fp.ZERO };
	            if (!Fp.eql(zz, Fp.ONE))
	                throw new Error('invZ was invalid');
	            return { x: ax, y: ay };
	        }
	        isTorsionFree() {
	            const { h: cofactor, isTorsionFree } = CURVE;
	            if (cofactor === _1n$6)
	                return true; // No subgroups, always torsion-free
	            if (isTorsionFree)
	                return isTorsionFree(Point, this);
	            throw new Error('isTorsionFree() has not been declared for the elliptic curve');
	        }
	        clearCofactor() {
	            const { h: cofactor, clearCofactor } = CURVE;
	            if (cofactor === _1n$6)
	                return this; // Fast-path
	            if (clearCofactor)
	                return clearCofactor(Point, this);
	            return this.multiplyUnsafe(CURVE.h);
	        }
	        toRawBytes(isCompressed = true) {
	            this.assertValidity();
	            return toBytes(Point, this, isCompressed);
	        }
	        toHex(isCompressed = true) {
	            return bytesToHex$3(this.toRawBytes(isCompressed));
	        }
	    }
	    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
	    Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
	    const _bits = CURVE.nBitLength;
	    const wnaf = wNAF$1(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
	    // Validate if generator point is on curve
	    return {
	        CURVE,
	        ProjectivePoint: Point,
	        normPrivateKeyToScalar,
	        weierstrassEquation,
	        isWithinCurveOrder,
	    };
	}
	function validateOpts(curve) {
	    const opts = validateBasic(curve);
	    validateObject(opts, {
	        hash: 'hash',
	        hmac: 'function',
	        randomBytes: 'function',
	    }, {
	        bits2int: 'function',
	        bits2int_modN: 'function',
	        lowS: 'boolean',
	    });
	    return Object.freeze({ lowS: true, ...opts });
	}
	function weierstrass$1(curveDef) {
	    const CURVE = validateOpts(curveDef);
	    const { Fp, n: CURVE_ORDER } = CURVE;
	    const compressedLen = Fp.BYTES + 1; // e.g. 33 for 32
	    const uncompressedLen = 2 * Fp.BYTES + 1; // e.g. 65 for 32
	    function isValidFieldElement(num) {
	        return _0n$6 < num && num < Fp.ORDER; // 0 is banned since it's not invertible FE
	    }
	    function modN(a) {
	        return mod$1(a, CURVE_ORDER);
	    }
	    function invN(a) {
	        return invert$1(a, CURVE_ORDER);
	    }
	    const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder, } = weierstrassPoints({
	        ...CURVE,
	        toBytes(_c, point, isCompressed) {
	            const a = point.toAffine();
	            const x = Fp.toBytes(a.x);
	            const cat = concatBytes$2;
	            if (isCompressed) {
	                return cat(Uint8Array.from([point.hasEvenY() ? 0x02 : 0x03]), x);
	            }
	            else {
	                return cat(Uint8Array.from([0x04]), x, Fp.toBytes(a.y));
	            }
	        },
	        fromBytes(bytes) {
	            const len = bytes.length;
	            const head = bytes[0];
	            const tail = bytes.subarray(1);
	            // this.assertValidity() is done inside of fromHex
	            if (len === compressedLen && (head === 0x02 || head === 0x03)) {
	                const x = bytesToNumberBE$1(tail);
	                if (!isValidFieldElement(x))
	                    throw new Error('Point is not on curve');
	                const y2 = weierstrassEquation(x); // y² = x³ + ax + b
	                let y = Fp.sqrt(y2); // y = y² ^ (p+1)/4
	                const isYOdd = (y & _1n$6) === _1n$6;
	                // ECDSA
	                const isHeadOdd = (head & 1) === 1;
	                if (isHeadOdd !== isYOdd)
	                    y = Fp.neg(y);
	                return { x, y };
	            }
	            else if (len === uncompressedLen && head === 0x04) {
	                const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
	                const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
	                return { x, y };
	            }
	            else {
	                throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
	            }
	        },
	    });
	    const numToNByteStr = (num) => bytesToHex$3(numberToBytesBE$1(num, CURVE.nByteLength));
	    function isBiggerThanHalfOrder(number) {
	        const HALF = CURVE_ORDER >> _1n$6;
	        return number > HALF;
	    }
	    function normalizeS(s) {
	        return isBiggerThanHalfOrder(s) ? modN(-s) : s;
	    }
	    // slice bytes num
	    const slcNum = (b, from, to) => bytesToNumberBE$1(b.slice(from, to));
	    /**
	     * ECDSA signature with its (r, s) properties. Supports DER & compact representations.
	     */
	    class Signature {
	        constructor(r, s, recovery) {
	            this.r = r;
	            this.s = s;
	            this.recovery = recovery;
	            this.assertValidity();
	        }
	        // pair (bytes of r, bytes of s)
	        static fromCompact(hex) {
	            const l = CURVE.nByteLength;
	            hex = ensureBytes$1('compactSignature', hex, l * 2);
	            return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
	        }
	        // DER encoded ECDSA signature
	        // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
	        static fromDER(hex) {
	            const { r, s } = DER$1.toSig(ensureBytes$1('DER', hex));
	            return new Signature(r, s);
	        }
	        assertValidity() {
	            // can use assertGE here
	            if (!isWithinCurveOrder(this.r))
	                throw new Error('r must be 0 < r < CURVE.n');
	            if (!isWithinCurveOrder(this.s))
	                throw new Error('s must be 0 < s < CURVE.n');
	        }
	        addRecoveryBit(recovery) {
	            return new Signature(this.r, this.s, recovery);
	        }
	        recoverPublicKey(msgHash) {
	            const { r, s, recovery: rec } = this;
	            const h = bits2int_modN(ensureBytes$1('msgHash', msgHash)); // Truncate hash
	            if (rec == null || ![0, 1, 2, 3].includes(rec))
	                throw new Error('recovery id invalid');
	            const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
	            if (radj >= Fp.ORDER)
	                throw new Error('recovery id 2 or 3 invalid');
	            const prefix = (rec & 1) === 0 ? '02' : '03';
	            const R = Point.fromHex(prefix + numToNByteStr(radj));
	            const ir = invN(radj); // r^-1
	            const u1 = modN(-h * ir); // -hr^-1
	            const u2 = modN(s * ir); // sr^-1
	            const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2); // (sr^-1)R-(hr^-1)G = -(hr^-1)G + (sr^-1)
	            if (!Q)
	                throw new Error('point at infinify'); // unsafe is fine: no priv data leaked
	            Q.assertValidity();
	            return Q;
	        }
	        // Signatures should be low-s, to prevent malleability.
	        hasHighS() {
	            return isBiggerThanHalfOrder(this.s);
	        }
	        normalizeS() {
	            return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
	        }
	        // DER-encoded
	        toDERRawBytes() {
	            return hexToBytes$3(this.toDERHex());
	        }
	        toDERHex() {
	            return DER$1.hexFromSig({ r: this.r, s: this.s });
	        }
	        // padded bytes of r, then padded bytes of s
	        toCompactRawBytes() {
	            return hexToBytes$3(this.toCompactHex());
	        }
	        toCompactHex() {
	            return numToNByteStr(this.r) + numToNByteStr(this.s);
	        }
	    }
	    const utils = {
	        isValidPrivateKey(privateKey) {
	            try {
	                normPrivateKeyToScalar(privateKey);
	                return true;
	            }
	            catch (error) {
	                return false;
	            }
	        },
	        normPrivateKeyToScalar: normPrivateKeyToScalar,
	        /**
	         * Produces cryptographically secure private key from random of size
	         * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
	         */
	        randomPrivateKey: () => {
	            const length = getMinHashLength$1(CURVE.n);
	            return mapHashToField$1(CURVE.randomBytes(length), CURVE.n);
	        },
	        /**
	         * Creates precompute table for an arbitrary EC point. Makes point "cached".
	         * Allows to massively speed-up `point.multiply(scalar)`.
	         * @returns cached point
	         * @example
	         * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
	         * fast.multiply(privKey); // much faster ECDH now
	         */
	        precompute(windowSize = 8, point = Point.BASE) {
	            point._setWindowSize(windowSize);
	            point.multiply(BigInt(3)); // 3 is arbitrary, just need any number here
	            return point;
	        },
	    };
	    /**
	     * Computes public key for a private key. Checks for validity of the private key.
	     * @param privateKey private key
	     * @param isCompressed whether to return compact (default), or full key
	     * @returns Public key, full when isCompressed=false; short when isCompressed=true
	     */
	    function getPublicKey(privateKey, isCompressed = true) {
	        return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
	    }
	    /**
	     * Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
	     */
	    function isProbPub(item) {
	        const arr = item instanceof Uint8Array;
	        const str = typeof item === 'string';
	        const len = (arr || str) && item.length;
	        if (arr)
	            return len === compressedLen || len === uncompressedLen;
	        if (str)
	            return len === 2 * compressedLen || len === 2 * uncompressedLen;
	        if (item instanceof Point)
	            return true;
	        return false;
	    }
	    /**
	     * ECDH (Elliptic Curve Diffie Hellman).
	     * Computes shared public key from private key and public key.
	     * Checks: 1) private key validity 2) shared key is on-curve.
	     * Does NOT hash the result.
	     * @param privateA private key
	     * @param publicB different public key
	     * @param isCompressed whether to return compact (default), or full key
	     * @returns shared public key
	     */
	    function getSharedSecret(privateA, publicB, isCompressed = true) {
	        if (isProbPub(privateA))
	            throw new Error('first arg must be private key');
	        if (!isProbPub(publicB))
	            throw new Error('second arg must be public key');
	        const b = Point.fromHex(publicB); // check for being on-curve
	        return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
	    }
	    // RFC6979: ensure ECDSA msg is X bytes and < N. RFC suggests optional truncating via bits2octets.
	    // FIPS 186-4 4.6 suggests the leftmost min(nBitLen, outLen) bits, which matches bits2int.
	    // bits2int can produce res>N, we can do mod(res, N) since the bitLen is the same.
	    // int2octets can't be used; pads small msgs with 0: unacceptatble for trunc as per RFC vectors
	    const bits2int = CURVE.bits2int ||
	        function (bytes) {
	            // For curves with nBitLength % 8 !== 0: bits2octets(bits2octets(m)) !== bits2octets(m)
	            // for some cases, since bytes.length * 8 is not actual bitLength.
	            const num = bytesToNumberBE$1(bytes); // check for == u8 done here
	            const delta = bytes.length * 8 - CURVE.nBitLength; // truncate to nBitLength leftmost bits
	            return delta > 0 ? num >> BigInt(delta) : num;
	        };
	    const bits2int_modN = CURVE.bits2int_modN ||
	        function (bytes) {
	            return modN(bits2int(bytes)); // can't use bytesToNumberBE here
	        };
	    // NOTE: pads output with zero as per spec
	    const ORDER_MASK = bitMask$1(CURVE.nBitLength);
	    /**
	     * Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`.
	     */
	    function int2octets(num) {
	        if (typeof num !== 'bigint')
	            throw new Error('bigint expected');
	        if (!(_0n$6 <= num && num < ORDER_MASK))
	            throw new Error(`bigint expected < 2^${CURVE.nBitLength}`);
	        // works with order, can have different size than numToField!
	        return numberToBytesBE$1(num, CURVE.nByteLength);
	    }
	    // Steps A, D of RFC6979 3.2
	    // Creates RFC6979 seed; converts msg/privKey to numbers.
	    // Used only in sign, not in verify.
	    // NOTE: we cannot assume here that msgHash has same amount of bytes as curve order, this will be wrong at least for P521.
	    // Also it can be bigger for P224 + SHA256
	    function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
	        if (['recovered', 'canonical'].some((k) => k in opts))
	            throw new Error('sign() legacy options not supported');
	        const { hash, randomBytes } = CURVE;
	        let { lowS, prehash, extraEntropy: ent } = opts; // generates low-s sigs by default
	        if (lowS == null)
	            lowS = true; // RFC6979 3.2: we skip step A, because we already provide hash
	        msgHash = ensureBytes$1('msgHash', msgHash);
	        if (prehash)
	            msgHash = ensureBytes$1('prehashed msgHash', hash(msgHash));
	        // We can't later call bits2octets, since nested bits2int is broken for curves
	        // with nBitLength % 8 !== 0. Because of that, we unwrap it here as int2octets call.
	        // const bits2octets = (bits) => int2octets(bits2int_modN(bits))
	        const h1int = bits2int_modN(msgHash);
	        const d = normPrivateKeyToScalar(privateKey); // validate private key, convert to bigint
	        const seedArgs = [int2octets(d), int2octets(h1int)];
	        // extraEntropy. RFC6979 3.6: additional k' (optional).
	        if (ent != null) {
	            // K = HMAC_K(V || 0x00 || int2octets(x) || bits2octets(h1) || k')
	            const e = ent === true ? randomBytes(Fp.BYTES) : ent; // generate random bytes OR pass as-is
	            seedArgs.push(ensureBytes$1('extraEntropy', e)); // check for being bytes
	        }
	        const seed = concatBytes$2(...seedArgs); // Step D of RFC6979 3.2
	        const m = h1int; // NOTE: no need to call bits2int second time here, it is inside truncateHash!
	        // Converts signature params into point w r/s, checks result for validity.
	        function k2sig(kBytes) {
	            // RFC 6979 Section 3.2, step 3: k = bits2int(T)
	            const k = bits2int(kBytes); // Cannot use fields methods, since it is group element
	            if (!isWithinCurveOrder(k))
	                return; // Important: all mod() calls here must be done over N
	            const ik = invN(k); // k^-1 mod n
	            const q = Point.BASE.multiply(k).toAffine(); // q = Gk
	            const r = modN(q.x); // r = q.x mod n
	            if (r === _0n$6)
	                return;
	            // Can use scalar blinding b^-1(bm + bdr) where b ∈ [1,q−1] according to
	            // https://tches.iacr.org/index.php/TCHES/article/view/7337/6509. We've decided against it:
	            // a) dependency on CSPRNG b) 15% slowdown c) doesn't really help since bigints are not CT
	            const s = modN(ik * modN(m + r * d)); // Not using blinding here
	            if (s === _0n$6)
	                return;
	            let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n$6); // recovery bit (2 or 3, when q.x > n)
	            let normS = s;
	            if (lowS && isBiggerThanHalfOrder(s)) {
	                normS = normalizeS(s); // if lowS was passed, ensure s is always
	                recovery ^= 1; // // in the bottom half of N
	            }
	            return new Signature(r, normS, recovery); // use normS, not s
	        }
	        return { seed, k2sig };
	    }
	    const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
	    const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
	    /**
	     * Signs message hash with a private key.
	     * ```
	     * sign(m, d, k) where
	     *   (x, y) = G × k
	     *   r = x mod n
	     *   s = (m + dr)/k mod n
	     * ```
	     * @param msgHash NOT message. msg needs to be hashed to `msgHash`, or use `prehash`.
	     * @param privKey private key
	     * @param opts lowS for non-malleable sigs. extraEntropy for mixing randomness into k. prehash will hash first arg.
	     * @returns signature with recovery param
	     */
	    function sign(msgHash, privKey, opts = defaultSigOpts) {
	        const { seed, k2sig } = prepSig(msgHash, privKey, opts); // Steps A, D of RFC6979 3.2.
	        const C = CURVE;
	        const drbg = createHmacDrbg$1(C.hash.outputLen, C.nByteLength, C.hmac);
	        return drbg(seed, k2sig); // Steps B, C, D, E, F, G
	    }
	    // Enable precomputes. Slows down first publicKey computation by 20ms.
	    Point.BASE._setWindowSize(8);
	    // utils.precompute(8, ProjectivePoint.BASE)
	    /**
	     * Verifies a signature against message hash and public key.
	     * Rejects lowS signatures by default: to override,
	     * specify option `{lowS: false}`. Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
	     *
	     * ```
	     * verify(r, s, h, P) where
	     *   U1 = hs^-1 mod n
	     *   U2 = rs^-1 mod n
	     *   R = U1⋅G - U2⋅P
	     *   mod(R.x, n) == r
	     * ```
	     */
	    function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
	        const sg = signature;
	        msgHash = ensureBytes$1('msgHash', msgHash);
	        publicKey = ensureBytes$1('publicKey', publicKey);
	        if ('strict' in opts)
	            throw new Error('options.strict was renamed to lowS');
	        const { lowS, prehash } = opts;
	        let _sig = undefined;
	        let P;
	        try {
	            if (typeof sg === 'string' || sg instanceof Uint8Array) {
	                // Signature can be represented in 2 ways: compact (2*nByteLength) & DER (variable-length).
	                // Since DER can also be 2*nByteLength bytes, we check for it first.
	                try {
	                    _sig = Signature.fromDER(sg);
	                }
	                catch (derError) {
	                    if (!(derError instanceof DER$1.Err))
	                        throw derError;
	                    _sig = Signature.fromCompact(sg);
	                }
	            }
	            else if (typeof sg === 'object' && typeof sg.r === 'bigint' && typeof sg.s === 'bigint') {
	                const { r, s } = sg;
	                _sig = new Signature(r, s);
	            }
	            else {
	                throw new Error('PARSE');
	            }
	            P = Point.fromHex(publicKey);
	        }
	        catch (error) {
	            if (error.message === 'PARSE')
	                throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
	            return false;
	        }
	        if (lowS && _sig.hasHighS())
	            return false;
	        if (prehash)
	            msgHash = CURVE.hash(msgHash);
	        const { r, s } = _sig;
	        const h = bits2int_modN(msgHash); // Cannot use fields methods, since it is group element
	        const is = invN(s); // s^-1
	        const u1 = modN(h * is); // u1 = hs^-1 mod n
	        const u2 = modN(r * is); // u2 = rs^-1 mod n
	        const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine(); // R = u1⋅G + u2⋅P
	        if (!R)
	            return false;
	        const v = modN(R.x);
	        return v === r;
	    }
	    return {
	        CURVE,
	        getPublicKey,
	        getSharedSecret,
	        sign,
	        verify,
	        ProjectivePoint: Point,
	        Signature,
	        utils,
	    };
	}

	// HMAC (RFC 2104)
	let HMAC$2 = class HMAC extends Hash$2 {
	    constructor(hash, _key) {
	        super();
	        this.finished = false;
	        this.destroyed = false;
	        hash$1(hash);
	        const key = toBytes$3(_key);
	        this.iHash = hash.create();
	        if (typeof this.iHash.update !== 'function')
	            throw new Error('Expected instance of class which extends utils.Hash');
	        this.blockLen = this.iHash.blockLen;
	        this.outputLen = this.iHash.outputLen;
	        const blockLen = this.blockLen;
	        const pad = new Uint8Array(blockLen);
	        // blockLen can be bigger than outputLen
	        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
	        for (let i = 0; i < pad.length; i++)
	            pad[i] ^= 0x36;
	        this.iHash.update(pad);
	        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
	        this.oHash = hash.create();
	        // Undo internal XOR && apply outer XOR
	        for (let i = 0; i < pad.length; i++)
	            pad[i] ^= 0x36 ^ 0x5c;
	        this.oHash.update(pad);
	        pad.fill(0);
	    }
	    update(buf) {
	        exists$2(this);
	        this.iHash.update(buf);
	        return this;
	    }
	    digestInto(out) {
	        exists$2(this);
	        bytes$2(out, this.outputLen);
	        this.finished = true;
	        this.iHash.digestInto(out);
	        this.oHash.update(out);
	        this.oHash.digestInto(out);
	        this.destroy();
	    }
	    digest() {
	        const out = new Uint8Array(this.oHash.outputLen);
	        this.digestInto(out);
	        return out;
	    }
	    _cloneInto(to) {
	        // Create new instance without calling constructor since key already in state and we don't know it.
	        to || (to = Object.create(Object.getPrototypeOf(this), {}));
	        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
	        to = to;
	        to.finished = finished;
	        to.destroyed = destroyed;
	        to.blockLen = blockLen;
	        to.outputLen = outputLen;
	        to.oHash = oHash._cloneInto(to.oHash);
	        to.iHash = iHash._cloneInto(to.iHash);
	        return to;
	    }
	    destroy() {
	        this.destroyed = true;
	        this.oHash.destroy();
	        this.iHash.destroy();
	    }
	};
	/**
	 * HMAC: RFC2104 message authentication code.
	 * @param hash - function that would be used e.g. sha256
	 * @param key - message key
	 * @param message - message data
	 */
	const hmac$2 = (hash, key, message) => new HMAC$2(hash, key).update(message).digest();
	hmac$2.create = (hash, key) => new HMAC$2(hash, key);

	/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	// connects noble-curves to noble-hashes
	function getHash(hash) {
	    return {
	        hash,
	        hmac: (key, ...msgs) => hmac$2(hash, key, concatBytes$3(...msgs)),
	        randomBytes: randomBytes$2,
	    };
	}
	function createCurve$1(curveDef, defHash) {
	    const create = (hash) => weierstrass$1({ ...curveDef, ...getHash(hash) });
	    return Object.freeze({ ...create(defHash), create });
	}

	/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	const secp256k1P = BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f');
	const secp256k1N = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');
	const _1n$5 = BigInt(1);
	const _2n$3 = BigInt(2);
	const divNearest$1 = (a, b) => (a + b / _2n$3) / b;
	/**
	 * √n = n^((p+1)/4) for fields p = 3 mod 4. We unwrap the loop and multiply bit-by-bit.
	 * (P+1n/4n).toString(2) would produce bits [223x 1, 0, 22x 1, 4x 0, 11, 00]
	 */
	function sqrtMod$1(y) {
	    const P = secp256k1P;
	    // prettier-ignore
	    const _3n = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
	    // prettier-ignore
	    const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
	    const b2 = (y * y * y) % P; // x^3, 11
	    const b3 = (b2 * b2 * y) % P; // x^7
	    const b6 = (pow2$1(b3, _3n, P) * b3) % P;
	    const b9 = (pow2$1(b6, _3n, P) * b3) % P;
	    const b11 = (pow2$1(b9, _2n$3, P) * b2) % P;
	    const b22 = (pow2$1(b11, _11n, P) * b11) % P;
	    const b44 = (pow2$1(b22, _22n, P) * b22) % P;
	    const b88 = (pow2$1(b44, _44n, P) * b44) % P;
	    const b176 = (pow2$1(b88, _88n, P) * b88) % P;
	    const b220 = (pow2$1(b176, _44n, P) * b44) % P;
	    const b223 = (pow2$1(b220, _3n, P) * b3) % P;
	    const t1 = (pow2$1(b223, _23n, P) * b22) % P;
	    const t2 = (pow2$1(t1, _6n, P) * b2) % P;
	    const root = pow2$1(t2, _2n$3, P);
	    if (!Fp.eql(Fp.sqr(root), y))
	        throw new Error('Cannot find square root');
	    return root;
	}
	const Fp = Field$1(secp256k1P, undefined, undefined, { sqrt: sqrtMod$1 });
	const secp256k1$1 = createCurve$1({
	    a: BigInt(0),
	    b: BigInt(7),
	    Fp,
	    n: secp256k1N,
	    // Base point (x, y) aka generator point
	    Gx: BigInt('55066263022277343669578718895168534326250603453777594175500187360389116729240'),
	    Gy: BigInt('32670510020758816978083085130507043184471273380659243275938904335757337482424'),
	    h: BigInt(1),
	    lowS: true,
	    /**
	     * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
	     * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
	     * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
	     * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
	     */
	    endo: {
	        beta: BigInt('0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee'),
	        splitScalar: (k) => {
	            const n = secp256k1N;
	            const a1 = BigInt('0x3086d221a7d46bcde86c90e49284eb15');
	            const b1 = -_1n$5 * BigInt('0xe4437ed6010e88286f547fa90abfe4c3');
	            const a2 = BigInt('0x114ca50f7a8e2f3f657c1108d9d44cfd8');
	            const b2 = a1;
	            const POW_2_128 = BigInt('0x100000000000000000000000000000000'); // (2n**128n).toString(16)
	            const c1 = divNearest$1(b2 * k, n);
	            const c2 = divNearest$1(-b1 * k, n);
	            let k1 = mod$1(k - c1 * a1 - c2 * a2, n);
	            let k2 = mod$1(-c1 * b1 - c2 * b2, n);
	            const k1neg = k1 > POW_2_128;
	            const k2neg = k2 > POW_2_128;
	            if (k1neg)
	                k1 = n - k1;
	            if (k2neg)
	                k2 = n - k2;
	            if (k1 > POW_2_128 || k2 > POW_2_128) {
	                throw new Error('splitScalar: Endomorphism failed, k=' + k);
	            }
	            return { k1neg, k1, k2neg, k2 };
	        },
	    },
	}, sha256$3);
	// Schnorr signatures are superior to ECDSA from above. Below is Schnorr-specific BIP0340 code.
	// https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki
	const _0n$5 = BigInt(0);
	const fe = (x) => typeof x === 'bigint' && _0n$5 < x && x < secp256k1P;
	const ge = (x) => typeof x === 'bigint' && _0n$5 < x && x < secp256k1N;
	/** An object mapping tags to their tagged hash prefix of [SHA256(tag) | SHA256(tag)] */
	const TAGGED_HASH_PREFIXES$1 = {};
	function taggedHash$1(tag, ...messages) {
	    let tagP = TAGGED_HASH_PREFIXES$1[tag];
	    if (tagP === undefined) {
	        const tagH = sha256$3(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
	        tagP = concatBytes$2(tagH, tagH);
	        TAGGED_HASH_PREFIXES$1[tag] = tagP;
	    }
	    return sha256$3(concatBytes$2(tagP, ...messages));
	}
	// ECDSA compact points are 33-byte. Schnorr is 32: we strip first byte 0x02 or 0x03
	const pointToBytes$1 = (point) => point.toRawBytes(true).slice(1);
	const numTo32b = (n) => numberToBytesBE$1(n, 32);
	const modP = (x) => mod$1(x, secp256k1P);
	const modN = (x) => mod$1(x, secp256k1N);
	const Point = secp256k1$1.ProjectivePoint;
	const GmulAdd = (Q, a, b) => Point.BASE.multiplyAndAddUnsafe(Q, a, b);
	// Calculate point, scalar and bytes
	function schnorrGetExtPubKey$1(priv) {
	    let d_ = secp256k1$1.utils.normPrivateKeyToScalar(priv); // same method executed in fromPrivateKey
	    let p = Point.fromPrivateKey(d_); // P = d'⋅G; 0 < d' < n check is done inside
	    const scalar = p.hasEvenY() ? d_ : modN(-d_);
	    return { scalar: scalar, bytes: pointToBytes$1(p) };
	}
	/**
	 * lift_x from BIP340. Convert 32-byte x coordinate to elliptic curve point.
	 * @returns valid point checked for being on-curve
	 */
	function lift_x$1(x) {
	    if (!fe(x))
	        throw new Error('bad x: need 0 < x < p'); // Fail if x ≥ p.
	    const xx = modP(x * x);
	    const c = modP(xx * x + BigInt(7)); // Let c = x³ + 7 mod p.
	    let y = sqrtMod$1(c); // Let y = c^(p+1)/4 mod p.
	    if (y % _2n$3 !== _0n$5)
	        y = modP(-y); // Return the unique point P such that x(P) = x and
	    const p = new Point(x, y, _1n$5); // y(P) = y if y mod 2 = 0 or y(P) = p-y otherwise.
	    p.assertValidity();
	    return p;
	}
	/**
	 * Create tagged hash, convert it to bigint, reduce modulo-n.
	 */
	function challenge$1(...args) {
	    return modN(bytesToNumberBE$1(taggedHash$1('BIP0340/challenge', ...args)));
	}
	/**
	 * Schnorr public key is just `x` coordinate of Point as per BIP340.
	 */
	function schnorrGetPublicKey$1(privateKey) {
	    return schnorrGetExtPubKey$1(privateKey).bytes; // d'=int(sk). Fail if d'=0 or d'≥n. Ret bytes(d'⋅G)
	}
	/**
	 * Creates Schnorr signature as per BIP340. Verifies itself before returning anything.
	 * auxRand is optional and is not the sole source of k generation: bad CSPRNG won't be dangerous.
	 */
	function schnorrSign$1(message, privateKey, auxRand = randomBytes$2(32)) {
	    const m = ensureBytes$1('message', message);
	    const { bytes: px, scalar: d } = schnorrGetExtPubKey$1(privateKey); // checks for isWithinCurveOrder
	    const a = ensureBytes$1('auxRand', auxRand, 32); // Auxiliary random data a: a 32-byte array
	    const t = numTo32b(d ^ bytesToNumberBE$1(taggedHash$1('BIP0340/aux', a))); // Let t be the byte-wise xor of bytes(d) and hash/aux(a)
	    const rand = taggedHash$1('BIP0340/nonce', t, px, m); // Let rand = hash/nonce(t || bytes(P) || m)
	    const k_ = modN(bytesToNumberBE$1(rand)); // Let k' = int(rand) mod n
	    if (k_ === _0n$5)
	        throw new Error('sign failed: k is zero'); // Fail if k' = 0.
	    const { bytes: rx, scalar: k } = schnorrGetExtPubKey$1(k_); // Let R = k'⋅G.
	    const e = challenge$1(rx, px, m); // Let e = int(hash/challenge(bytes(R) || bytes(P) || m)) mod n.
	    const sig = new Uint8Array(64); // Let sig = bytes(R) || bytes((k + ed) mod n).
	    sig.set(rx, 0);
	    sig.set(numTo32b(modN(k + e * d)), 32);
	    // If Verify(bytes(P), m, sig) (see below) returns failure, abort
	    if (!schnorrVerify$1(sig, m, px))
	        throw new Error('sign: Invalid signature produced');
	    return sig;
	}
	/**
	 * Verifies Schnorr signature.
	 * Will swallow errors & return false except for initial type validation of arguments.
	 */
	function schnorrVerify$1(signature, message, publicKey) {
	    const sig = ensureBytes$1('signature', signature, 64);
	    const m = ensureBytes$1('message', message);
	    const pub = ensureBytes$1('publicKey', publicKey, 32);
	    try {
	        const P = lift_x$1(bytesToNumberBE$1(pub)); // P = lift_x(int(pk)); fail if that fails
	        const r = bytesToNumberBE$1(sig.subarray(0, 32)); // Let r = int(sig[0:32]); fail if r ≥ p.
	        if (!fe(r))
	            return false;
	        const s = bytesToNumberBE$1(sig.subarray(32, 64)); // Let s = int(sig[32:64]); fail if s ≥ n.
	        if (!ge(s))
	            return false;
	        const e = challenge$1(numTo32b(r), pointToBytes$1(P), m); // int(challenge(bytes(r)||bytes(P)||m))%n
	        const R = GmulAdd(P, s, modN(-e)); // R = s⋅G - e⋅P
	        if (!R || !R.hasEvenY() || R.toAffine().x !== r)
	            return false; // -eP == (n-e)P
	        return true; // Fail if is_infinite(R) / not has_even_y(R) / x(R) ≠ r.
	    }
	    catch (error) {
	        return false;
	    }
	}
	const schnorr$1 = /* @__PURE__ */ (() => ({
	    getPublicKey: schnorrGetPublicKey$1,
	    sign: schnorrSign$1,
	    verify: schnorrVerify$1,
	    utils: {
	        randomPrivateKey: secp256k1$1.utils.randomPrivateKey,
	        lift_x: lift_x$1,
	        pointToBytes: pointToBytes$1,
	        numberToBytesBE: numberToBytesBE$1,
	        bytesToNumberBE: bytesToNumberBE$1,
	        taggedHash: taggedHash$1,
	        mod: mod$1,
	    },
	}))();

	const crypto$1 = typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;

	/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
	// node.js versions earlier than v19 don't declare it in global scope.
	// For node.js, package.json#exports field mapping rewrites import
	// from `crypto` to `cryptoNode`, which imports native module.
	// Makes the utils un-importable in browsers without a bundler.
	// Once node.js 18 is deprecated, we can just drop the import.
	const u8a = (a) => a instanceof Uint8Array;
	const u32$1 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
	// Cast array to view
	const createView$2 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
	// The rotate right (circular right shift) operation for uint32
	const rotr$1 = (word, shift) => (word << (32 - shift)) | (word >>> shift);
	// big-endian hardware is rare. Just in case someone still decides to run hashes:
	// early-throw an error because we don't support BE yet.
	const isLE$1 = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
	if (!isLE$1)
	    throw new Error('Non little-endian hardware is not supported');
	const hexes$2 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
	/**
	 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
	 */
	function bytesToHex$2(bytes) {
	    if (!u8a(bytes))
	        throw new Error('Uint8Array expected');
	    // pre-caching improves the speed 6x
	    let hex = '';
	    for (let i = 0; i < bytes.length; i++) {
	        hex += hexes$2[bytes[i]];
	    }
	    return hex;
	}
	/**
	 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
	 */
	function hexToBytes$2(hex) {
	    if (typeof hex !== 'string')
	        throw new Error('hex string expected, got ' + typeof hex);
	    const len = hex.length;
	    if (len % 2)
	        throw new Error('padded hex string expected, got unpadded hex of length ' + len);
	    const array = new Uint8Array(len / 2);
	    for (let i = 0; i < array.length; i++) {
	        const j = i * 2;
	        const hexByte = hex.slice(j, j + 2);
	        const byte = Number.parseInt(hexByte, 16);
	        if (Number.isNaN(byte) || byte < 0)
	            throw new Error('Invalid byte sequence');
	        array[i] = byte;
	    }
	    return array;
	}
	/**
	 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
	 */
	function utf8ToBytes$2(str) {
	    if (typeof str !== 'string')
	        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
	    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
	}
	/**
	 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
	 * Warning: when Uint8Array is passed, it would NOT get copied.
	 * Keep in mind for future mutable operations.
	 */
	function toBytes$2(data) {
	    if (typeof data === 'string')
	        data = utf8ToBytes$2(data);
	    if (!u8a(data))
	        throw new Error(`expected Uint8Array, got ${typeof data}`);
	    return data;
	}
	/**
	 * Copies several Uint8Arrays into one.
	 */
	function concatBytes$1(...arrays) {
	    const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
	    let pad = 0; // walk through each item, ensure they have proper type
	    arrays.forEach((a) => {
	        if (!u8a(a))
	            throw new Error('Uint8Array expected');
	        r.set(a, pad);
	        pad += a.length;
	    });
	    return r;
	}
	// For runtime check if class implements interface
	let Hash$1 = class Hash {
	    // Safe version that clones internal state
	    clone() {
	        return this._cloneInto();
	    }
	};
	// Check if object doens't have custom constructor (like Uint8Array/Array)
	const isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]' && obj.constructor === Object;
	function checkOpts$1(defaults, opts) {
	    if (opts !== undefined && (typeof opts !== 'object' || !isPlainObject(opts)))
	        throw new Error('Options should be object or undefined');
	    const merged = Object.assign(defaults, opts);
	    return merged;
	}
	function wrapConstructor(hashCons) {
	    const hashC = (msg) => hashCons().update(toBytes$2(msg)).digest();
	    const tmp = hashCons();
	    hashC.outputLen = tmp.outputLen;
	    hashC.blockLen = tmp.blockLen;
	    hashC.create = () => hashCons();
	    return hashC;
	}
	/**
	 * Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
	 */
	function randomBytes$1(bytesLength = 32) {
	    if (crypto$1 && typeof crypto$1.getRandomValues === 'function') {
	        return crypto$1.getRandomValues(new Uint8Array(bytesLength));
	    }
	    throw new Error('crypto.getRandomValues must be defined');
	}

	function number$1(n) {
	    if (!Number.isSafeInteger(n) || n < 0)
	        throw new Error(`Wrong positive integer: ${n}`);
	}
	function bool$1(b) {
	    if (typeof b !== 'boolean')
	        throw new Error(`Expected boolean, not ${b}`);
	}
	function bytes$1(b, ...lengths) {
	    if (!(b instanceof Uint8Array))
	        throw new Error('Expected Uint8Array');
	    if (lengths.length > 0 && !lengths.includes(b.length))
	        throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
	}
	function hash(hash) {
	    if (typeof hash !== 'function' || typeof hash.create !== 'function')
	        throw new Error('Hash should be wrapped by utils.wrapConstructor');
	    number$1(hash.outputLen);
	    number$1(hash.blockLen);
	}
	function exists$1(instance, checkFinished = true) {
	    if (instance.destroyed)
	        throw new Error('Hash instance has been destroyed');
	    if (checkFinished && instance.finished)
	        throw new Error('Hash#digest() has already been called');
	}
	function output$1(out, instance) {
	    bytes$1(out);
	    const min = instance.outputLen;
	    if (out.length < min) {
	        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
	    }
	}
	const assert = {
	    number: number$1,
	    bool: bool$1,
	    bytes: bytes$1,
	    hash,
	    exists: exists$1,
	    output: output$1,
	};

	// Polyfill for Safari 14
	function setBigUint64$2(view, byteOffset, value, isLE) {
	    if (typeof view.setBigUint64 === 'function')
	        return view.setBigUint64(byteOffset, value, isLE);
	    const _32n = BigInt(32);
	    const _u32_max = BigInt(0xffffffff);
	    const wh = Number((value >> _32n) & _u32_max);
	    const wl = Number(value & _u32_max);
	    const h = isLE ? 4 : 0;
	    const l = isLE ? 0 : 4;
	    view.setUint32(byteOffset + h, wh, isLE);
	    view.setUint32(byteOffset + l, wl, isLE);
	}
	// Base SHA2 class (RFC 6234)
	class SHA2 extends Hash$1 {
	    constructor(blockLen, outputLen, padOffset, isLE) {
	        super();
	        this.blockLen = blockLen;
	        this.outputLen = outputLen;
	        this.padOffset = padOffset;
	        this.isLE = isLE;
	        this.finished = false;
	        this.length = 0;
	        this.pos = 0;
	        this.destroyed = false;
	        this.buffer = new Uint8Array(blockLen);
	        this.view = createView$2(this.buffer);
	    }
	    update(data) {
	        assert.exists(this);
	        const { view, buffer, blockLen } = this;
	        data = toBytes$2(data);
	        const len = data.length;
	        for (let pos = 0; pos < len;) {
	            const take = Math.min(blockLen - this.pos, len - pos);
	            // Fast path: we have at least one block in input, cast it to view and process
	            if (take === blockLen) {
	                const dataView = createView$2(data);
	                for (; blockLen <= len - pos; pos += blockLen)
	                    this.process(dataView, pos);
	                continue;
	            }
	            buffer.set(data.subarray(pos, pos + take), this.pos);
	            this.pos += take;
	            pos += take;
	            if (this.pos === blockLen) {
	                this.process(view, 0);
	                this.pos = 0;
	            }
	        }
	        this.length += data.length;
	        this.roundClean();
	        return this;
	    }
	    digestInto(out) {
	        assert.exists(this);
	        assert.output(out, this);
	        this.finished = true;
	        // Padding
	        // We can avoid allocation of buffer for padding completely if it
	        // was previously not allocated here. But it won't change performance.
	        const { buffer, view, blockLen, isLE } = this;
	        let { pos } = this;
	        // append the bit '1' to the message
	        buffer[pos++] = 128;
	        this.buffer.subarray(pos).fill(0);
	        // we have less than padOffset left in buffer, so we cannot put length in current block, need process it and pad again
	        if (this.padOffset > blockLen - pos) {
	            this.process(view, 0);
	            pos = 0;
	        }
	        // Pad until full block byte with zeros
	        for (let i = pos; i < blockLen; i++)
	            buffer[i] = 0;
	        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
	        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
	        // So we just write lowest 64 bits of that value.
	        setBigUint64$2(view, blockLen - 8, BigInt(this.length * 8), isLE);
	        this.process(view, 0);
	        const oview = createView$2(out);
	        const len = this.outputLen;
	        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
	        if (len % 4)
	            throw new Error('_sha2: outputLen should be aligned to 32bit');
	        const outLen = len / 4;
	        const state = this.get();
	        if (outLen > state.length)
	            throw new Error('_sha2: outputLen bigger than state');
	        for (let i = 0; i < outLen; i++)
	            oview.setUint32(4 * i, state[i], isLE);
	    }
	    digest() {
	        const { buffer, outputLen } = this;
	        this.digestInto(buffer);
	        const res = buffer.slice(0, outputLen);
	        this.destroy();
	        return res;
	    }
	    _cloneInto(to) {
	        to || (to = new this.constructor());
	        to.set(...this.get());
	        const { blockLen, buffer, length, finished, destroyed, pos } = this;
	        to.length = length;
	        to.pos = pos;
	        to.finished = finished;
	        to.destroyed = destroyed;
	        if (length % blockLen)
	            to.buffer.set(buffer);
	        return to;
	    }
	}

	// Choice: a ? b : c
	const Chi$1 = (a, b, c) => (a & b) ^ (~a & c);
	// Majority function, true if any two inpust is true
	const Maj$1 = (a, b, c) => (a & b) ^ (a & c) ^ (b & c);
	// Round constants:
	// first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311)
	// prettier-ignore
	const SHA256_K$1 = new Uint32Array([
	    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	]);
	// Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
	// prettier-ignore
	const IV = new Uint32Array([
	    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
	]);
	// Temporary buffer, not used to store anything between runs
	// Named this way because it matches specification.
	const SHA256_W$1 = new Uint32Array(64);
	let SHA256$1 = class SHA256 extends SHA2 {
	    constructor() {
	        super(64, 32, 8, false);
	        // We cannot use array here since array allows indexing by variable
	        // which means optimizer/compiler cannot use registers.
	        this.A = IV[0] | 0;
	        this.B = IV[1] | 0;
	        this.C = IV[2] | 0;
	        this.D = IV[3] | 0;
	        this.E = IV[4] | 0;
	        this.F = IV[5] | 0;
	        this.G = IV[6] | 0;
	        this.H = IV[7] | 0;
	    }
	    get() {
	        const { A, B, C, D, E, F, G, H } = this;
	        return [A, B, C, D, E, F, G, H];
	    }
	    // prettier-ignore
	    set(A, B, C, D, E, F, G, H) {
	        this.A = A | 0;
	        this.B = B | 0;
	        this.C = C | 0;
	        this.D = D | 0;
	        this.E = E | 0;
	        this.F = F | 0;
	        this.G = G | 0;
	        this.H = H | 0;
	    }
	    process(view, offset) {
	        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
	        for (let i = 0; i < 16; i++, offset += 4)
	            SHA256_W$1[i] = view.getUint32(offset, false);
	        for (let i = 16; i < 64; i++) {
	            const W15 = SHA256_W$1[i - 15];
	            const W2 = SHA256_W$1[i - 2];
	            const s0 = rotr$1(W15, 7) ^ rotr$1(W15, 18) ^ (W15 >>> 3);
	            const s1 = rotr$1(W2, 17) ^ rotr$1(W2, 19) ^ (W2 >>> 10);
	            SHA256_W$1[i] = (s1 + SHA256_W$1[i - 7] + s0 + SHA256_W$1[i - 16]) | 0;
	        }
	        // Compression function main loop, 64 rounds
	        let { A, B, C, D, E, F, G, H } = this;
	        for (let i = 0; i < 64; i++) {
	            const sigma1 = rotr$1(E, 6) ^ rotr$1(E, 11) ^ rotr$1(E, 25);
	            const T1 = (H + sigma1 + Chi$1(E, F, G) + SHA256_K$1[i] + SHA256_W$1[i]) | 0;
	            const sigma0 = rotr$1(A, 2) ^ rotr$1(A, 13) ^ rotr$1(A, 22);
	            const T2 = (sigma0 + Maj$1(A, B, C)) | 0;
	            H = G;
	            G = F;
	            F = E;
	            E = (D + T1) | 0;
	            D = C;
	            C = B;
	            B = A;
	            A = (T1 + T2) | 0;
	        }
	        // Add the compressed chunk to the current hash value
	        A = (A + this.A) | 0;
	        B = (B + this.B) | 0;
	        C = (C + this.C) | 0;
	        D = (D + this.D) | 0;
	        E = (E + this.E) | 0;
	        F = (F + this.F) | 0;
	        G = (G + this.G) | 0;
	        H = (H + this.H) | 0;
	        this.set(A, B, C, D, E, F, G, H);
	    }
	    roundClean() {
	        SHA256_W$1.fill(0);
	    }
	    destroy() {
	        this.set(0, 0, 0, 0, 0, 0, 0, 0);
	        this.buffer.fill(0);
	    }
	};
	// Constants from https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf
	class SHA224 extends SHA256$1 {
	    constructor() {
	        super();
	        this.A = 0xc1059ed8 | 0;
	        this.B = 0x367cd507 | 0;
	        this.C = 0x3070dd17 | 0;
	        this.D = 0xf70e5939 | 0;
	        this.E = 0xffc00b31 | 0;
	        this.F = 0x68581511 | 0;
	        this.G = 0x64f98fa7 | 0;
	        this.H = 0xbefa4fa4 | 0;
	        this.outputLen = 28;
	    }
	}
	/**
	 * SHA2-256 hash function
	 * @param message - data that would be hashed
	 */
	const sha256$2 = wrapConstructor(() => new SHA256$1());
	wrapConstructor(() => new SHA224());

	/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	function assertNumber(n) {
	    if (!Number.isSafeInteger(n))
	        throw new Error(`Wrong integer: ${n}`);
	}
	function chain(...args) {
	    const wrap = (a, b) => (c) => a(b(c));
	    const encode = Array.from(args)
	        .reverse()
	        .reduce((acc, i) => (acc ? wrap(acc, i.encode) : i.encode), undefined);
	    const decode = args.reduce((acc, i) => (acc ? wrap(acc, i.decode) : i.decode), undefined);
	    return { encode, decode };
	}
	function alphabet(alphabet) {
	    return {
	        encode: (digits) => {
	            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
	                throw new Error('alphabet.encode input should be an array of numbers');
	            return digits.map((i) => {
	                assertNumber(i);
	                if (i < 0 || i >= alphabet.length)
	                    throw new Error(`Digit index outside alphabet: ${i} (alphabet: ${alphabet.length})`);
	                return alphabet[i];
	            });
	        },
	        decode: (input) => {
	            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
	                throw new Error('alphabet.decode input should be array of strings');
	            return input.map((letter) => {
	                if (typeof letter !== 'string')
	                    throw new Error(`alphabet.decode: not string element=${letter}`);
	                const index = alphabet.indexOf(letter);
	                if (index === -1)
	                    throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet}`);
	                return index;
	            });
	        },
	    };
	}
	function join(separator = '') {
	    if (typeof separator !== 'string')
	        throw new Error('join separator should be string');
	    return {
	        encode: (from) => {
	            if (!Array.isArray(from) || (from.length && typeof from[0] !== 'string'))
	                throw new Error('join.encode input should be array of strings');
	            for (let i of from)
	                if (typeof i !== 'string')
	                    throw new Error(`join.encode: non-string input=${i}`);
	            return from.join(separator);
	        },
	        decode: (to) => {
	            if (typeof to !== 'string')
	                throw new Error('join.decode input should be string');
	            return to.split(separator);
	        },
	    };
	}
	function padding(bits, chr = '=') {
	    assertNumber(bits);
	    if (typeof chr !== 'string')
	        throw new Error('padding chr should be string');
	    return {
	        encode(data) {
	            if (!Array.isArray(data) || (data.length && typeof data[0] !== 'string'))
	                throw new Error('padding.encode input should be array of strings');
	            for (let i of data)
	                if (typeof i !== 'string')
	                    throw new Error(`padding.encode: non-string input=${i}`);
	            while ((data.length * bits) % 8)
	                data.push(chr);
	            return data;
	        },
	        decode(input) {
	            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
	                throw new Error('padding.encode input should be array of strings');
	            for (let i of input)
	                if (typeof i !== 'string')
	                    throw new Error(`padding.decode: non-string input=${i}`);
	            let end = input.length;
	            if ((end * bits) % 8)
	                throw new Error('Invalid padding: string should have whole number of bytes');
	            for (; end > 0 && input[end - 1] === chr; end--) {
	                if (!(((end - 1) * bits) % 8))
	                    throw new Error('Invalid padding: string has too much padding');
	            }
	            return input.slice(0, end);
	        },
	    };
	}
	function normalize$1(fn) {
	    if (typeof fn !== 'function')
	        throw new Error('normalize fn should be function');
	    return { encode: (from) => from, decode: (to) => fn(to) };
	}
	function convertRadix(data, from, to) {
	    if (from < 2)
	        throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
	    if (to < 2)
	        throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
	    if (!Array.isArray(data))
	        throw new Error('convertRadix: data should be array');
	    if (!data.length)
	        return [];
	    let pos = 0;
	    const res = [];
	    const digits = Array.from(data);
	    digits.forEach((d) => {
	        assertNumber(d);
	        if (d < 0 || d >= from)
	            throw new Error(`Wrong integer: ${d}`);
	    });
	    while (true) {
	        let carry = 0;
	        let done = true;
	        for (let i = pos; i < digits.length; i++) {
	            const digit = digits[i];
	            const digitBase = from * carry + digit;
	            if (!Number.isSafeInteger(digitBase) ||
	                (from * carry) / from !== carry ||
	                digitBase - digit !== from * carry) {
	                throw new Error('convertRadix: carry overflow');
	            }
	            carry = digitBase % to;
	            digits[i] = Math.floor(digitBase / to);
	            if (!Number.isSafeInteger(digits[i]) || digits[i] * to + carry !== digitBase)
	                throw new Error('convertRadix: carry overflow');
	            if (!done)
	                continue;
	            else if (!digits[i])
	                pos = i;
	            else
	                done = false;
	        }
	        res.push(carry);
	        if (done)
	            break;
	    }
	    for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
	        res.push(0);
	    return res.reverse();
	}
	const gcd = (a, b) => (!b ? a : gcd(b, a % b));
	const radix2carry = (from, to) => from + (to - gcd(from, to));
	function convertRadix2(data, from, to, padding) {
	    if (!Array.isArray(data))
	        throw new Error('convertRadix2: data should be array');
	    if (from <= 0 || from > 32)
	        throw new Error(`convertRadix2: wrong from=${from}`);
	    if (to <= 0 || to > 32)
	        throw new Error(`convertRadix2: wrong to=${to}`);
	    if (radix2carry(from, to) > 32) {
	        throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry(from, to)}`);
	    }
	    let carry = 0;
	    let pos = 0;
	    const mask = 2 ** to - 1;
	    const res = [];
	    for (const n of data) {
	        assertNumber(n);
	        if (n >= 2 ** from)
	            throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
	        carry = (carry << from) | n;
	        if (pos + from > 32)
	            throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
	        pos += from;
	        for (; pos >= to; pos -= to)
	            res.push(((carry >> (pos - to)) & mask) >>> 0);
	        carry &= 2 ** pos - 1;
	    }
	    carry = (carry << (to - pos)) & mask;
	    if (!padding && pos >= from)
	        throw new Error('Excess padding');
	    if (!padding && carry)
	        throw new Error(`Non-zero padding: ${carry}`);
	    if (padding && pos > 0)
	        res.push(carry >>> 0);
	    return res;
	}
	function radix(num) {
	    assertNumber(num);
	    return {
	        encode: (bytes) => {
	            if (!(bytes instanceof Uint8Array))
	                throw new Error('radix.encode input should be Uint8Array');
	            return convertRadix(Array.from(bytes), 2 ** 8, num);
	        },
	        decode: (digits) => {
	            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
	                throw new Error('radix.decode input should be array of strings');
	            return Uint8Array.from(convertRadix(digits, num, 2 ** 8));
	        },
	    };
	}
	function radix2(bits, revPadding = false) {
	    assertNumber(bits);
	    if (bits <= 0 || bits > 32)
	        throw new Error('radix2: bits should be in (0..32]');
	    if (radix2carry(8, bits) > 32 || radix2carry(bits, 8) > 32)
	        throw new Error('radix2: carry overflow');
	    return {
	        encode: (bytes) => {
	            if (!(bytes instanceof Uint8Array))
	                throw new Error('radix2.encode input should be Uint8Array');
	            return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
	        },
	        decode: (digits) => {
	            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
	                throw new Error('radix2.decode input should be array of strings');
	            return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
	        },
	    };
	}
	function unsafeWrapper(fn) {
	    if (typeof fn !== 'function')
	        throw new Error('unsafeWrapper fn should be function');
	    return function (...args) {
	        try {
	            return fn.apply(null, args);
	        }
	        catch (e) { }
	    };
	}
	const base16 = chain(radix2(4), alphabet('0123456789ABCDEF'), join(''));
	const base32 = chain(radix2(5), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), padding(5), join(''));
	chain(radix2(5), alphabet('0123456789ABCDEFGHIJKLMNOPQRSTUV'), padding(5), join(''));
	chain(radix2(5), alphabet('0123456789ABCDEFGHJKMNPQRSTVWXYZ'), join(''), normalize$1((s) => s.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')));
	const base64 = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'), padding(6), join(''));
	const base64url = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), padding(6), join(''));
	const genBase58 = (abc) => chain(radix(58), alphabet(abc), join(''));
	const base58 = genBase58('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
	genBase58('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ');
	genBase58('rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz');
	const XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
	const base58xmr = {
	    encode(data) {
	        let res = '';
	        for (let i = 0; i < data.length; i += 8) {
	            const block = data.subarray(i, i + 8);
	            res += base58.encode(block).padStart(XMR_BLOCK_LEN[block.length], '1');
	        }
	        return res;
	    },
	    decode(str) {
	        let res = [];
	        for (let i = 0; i < str.length; i += 11) {
	            const slice = str.slice(i, i + 11);
	            const blockLen = XMR_BLOCK_LEN.indexOf(slice.length);
	            const block = base58.decode(slice);
	            for (let j = 0; j < block.length - blockLen; j++) {
	                if (block[j] !== 0)
	                    throw new Error('base58xmr: wrong padding');
	            }
	            res = res.concat(Array.from(block.slice(block.length - blockLen)));
	        }
	        return Uint8Array.from(res);
	    },
	};
	const BECH_ALPHABET = chain(alphabet('qpzry9x8gf2tvdw0s3jn54khce6mua7l'), join(''));
	const POLYMOD_GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
	function bech32Polymod(pre) {
	    const b = pre >> 25;
	    let chk = (pre & 0x1ffffff) << 5;
	    for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
	        if (((b >> i) & 1) === 1)
	            chk ^= POLYMOD_GENERATORS[i];
	    }
	    return chk;
	}
	function bechChecksum(prefix, words, encodingConst = 1) {
	    const len = prefix.length;
	    let chk = 1;
	    for (let i = 0; i < len; i++) {
	        const c = prefix.charCodeAt(i);
	        if (c < 33 || c > 126)
	            throw new Error(`Invalid prefix (${prefix})`);
	        chk = bech32Polymod(chk) ^ (c >> 5);
	    }
	    chk = bech32Polymod(chk);
	    for (let i = 0; i < len; i++)
	        chk = bech32Polymod(chk) ^ (prefix.charCodeAt(i) & 0x1f);
	    for (let v of words)
	        chk = bech32Polymod(chk) ^ v;
	    for (let i = 0; i < 6; i++)
	        chk = bech32Polymod(chk);
	    chk ^= encodingConst;
	    return BECH_ALPHABET.encode(convertRadix2([chk % 2 ** 30], 30, 5, false));
	}
	function genBech32(encoding) {
	    const ENCODING_CONST = encoding === 'bech32' ? 1 : 0x2bc830a3;
	    const _words = radix2(5);
	    const fromWords = _words.decode;
	    const toWords = _words.encode;
	    const fromWordsUnsafe = unsafeWrapper(fromWords);
	    function encode(prefix, words, limit = 90) {
	        if (typeof prefix !== 'string')
	            throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
	        if (!Array.isArray(words) || (words.length && typeof words[0] !== 'number'))
	            throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
	        const actualLength = prefix.length + 7 + words.length;
	        if (limit !== false && actualLength > limit)
	            throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
	        prefix = prefix.toLowerCase();
	        return `${prefix}1${BECH_ALPHABET.encode(words)}${bechChecksum(prefix, words, ENCODING_CONST)}`;
	    }
	    function decode(str, limit = 90) {
	        if (typeof str !== 'string')
	            throw new Error(`bech32.decode input should be string, not ${typeof str}`);
	        if (str.length < 8 || (limit !== false && str.length > limit))
	            throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
	        const lowered = str.toLowerCase();
	        if (str !== lowered && str !== str.toUpperCase())
	            throw new Error(`String must be lowercase or uppercase`);
	        str = lowered;
	        const sepIndex = str.lastIndexOf('1');
	        if (sepIndex === 0 || sepIndex === -1)
	            throw new Error(`Letter "1" must be present between prefix and data only`);
	        const prefix = str.slice(0, sepIndex);
	        const _words = str.slice(sepIndex + 1);
	        if (_words.length < 6)
	            throw new Error('Data must be at least 6 characters long');
	        const words = BECH_ALPHABET.decode(_words).slice(0, -6);
	        const sum = bechChecksum(prefix, words, ENCODING_CONST);
	        if (!_words.endsWith(sum))
	            throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
	        return { prefix, words };
	    }
	    const decodeUnsafe = unsafeWrapper(decode);
	    function decodeToBytes(str) {
	        const { prefix, words } = decode(str, false);
	        return { prefix, words, bytes: fromWords(words) };
	    }
	    return { encode, decode, decodeToBytes, decodeUnsafe, fromWords, fromWordsUnsafe, toWords };
	}
	const bech32 = genBech32('bech32');
	genBech32('bech32m');
	const utf8 = {
	    encode: (data) => new TextDecoder().decode(data),
	    decode: (str) => new TextEncoder().encode(str),
	};
	const hex = chain(radix2(4), alphabet('0123456789abcdef'), join(''), normalize$1((s) => {
	    if (typeof s !== 'string' || s.length % 2)
	        throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
	    return s.toLowerCase();
	}));
	const CODERS = {
	    utf8, hex, base16, base32, base64, base64url, base58, base58xmr
	};
`Invalid encoding type. Available types: ${Object.keys(CODERS).join(', ')}`;

	function number(n) {
	    if (!Number.isSafeInteger(n) || n < 0)
	        throw new Error(`positive integer expected, not ${n}`);
	}
	function bool(b) {
	    if (typeof b !== 'boolean')
	        throw new Error(`boolean expected, not ${b}`);
	}
	function isBytes$1(a) {
	    return (a instanceof Uint8Array ||
	        (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
	}
	function bytes(b, ...lengths) {
	    if (!isBytes$1(b))
	        throw new Error('Uint8Array expected');
	    if (lengths.length > 0 && !lengths.includes(b.length))
	        throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
	}
	function exists(instance, checkFinished = true) {
	    if (instance.destroyed)
	        throw new Error('Hash instance has been destroyed');
	    if (checkFinished && instance.finished)
	        throw new Error('Hash#digest() has already been called');
	}
	function output(out, instance) {
	    bytes(out);
	    const min = instance.outputLen;
	    if (out.length < min) {
	        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
	    }
	}

	/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
	const u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
	// Cast array to view
	const createView$1 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
	// big-endian hardware is rare. Just in case someone still decides to run ciphers:
	// early-throw an error because we don't support BE yet.
	const isLE = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
	if (!isLE)
	    throw new Error('Non little-endian hardware is not supported');
	// Array where index 0xf0 (240) is mapped to string 'f0'
	const hexes$1 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));
	/**
	 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
	 */
	function bytesToHex$1(bytes$1) {
	    bytes(bytes$1);
	    // pre-caching improves the speed 6x
	    let hex = '';
	    for (let i = 0; i < bytes$1.length; i++) {
	        hex += hexes$1[bytes$1[i]];
	    }
	    return hex;
	}
	// We use optimized technique to convert hex string to byte array
	const asciis$1 = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 };
	function asciiToBase16$1(char) {
	    if (char >= asciis$1._0 && char <= asciis$1._9)
	        return char - asciis$1._0;
	    if (char >= asciis$1._A && char <= asciis$1._F)
	        return char - (asciis$1._A - 10);
	    if (char >= asciis$1._a && char <= asciis$1._f)
	        return char - (asciis$1._a - 10);
	    return;
	}
	/**
	 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
	 */
	function hexToBytes$1(hex) {
	    if (typeof hex !== 'string')
	        throw new Error('hex string expected, got ' + typeof hex);
	    const hl = hex.length;
	    const al = hl / 2;
	    if (hl % 2)
	        throw new Error('padded hex string expected, got unpadded hex of length ' + hl);
	    const array = new Uint8Array(al);
	    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
	        const n1 = asciiToBase16$1(hex.charCodeAt(hi));
	        const n2 = asciiToBase16$1(hex.charCodeAt(hi + 1));
	        if (n1 === undefined || n2 === undefined) {
	            const char = hex[hi] + hex[hi + 1];
	            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
	        }
	        array[ai] = n1 * 16 + n2;
	    }
	    return array;
	}
	/**
	 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
	 */
	function utf8ToBytes$1(str) {
	    if (typeof str !== 'string')
	        throw new Error(`string expected, got ${typeof str}`);
	    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
	}
	/**
	 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
	 * Warning: when Uint8Array is passed, it would NOT get copied.
	 * Keep in mind for future mutable operations.
	 */
	function toBytes$1(data) {
	    if (typeof data === 'string')
	        data = utf8ToBytes$1(data);
	    else if (isBytes$1(data))
	        data = data.slice();
	    else
	        throw new Error(`Uint8Array expected, got ${typeof data}`);
	    return data;
	}
	function checkOpts(defaults, opts) {
	    if (opts == null || typeof opts !== 'object')
	        throw new Error('options must be defined');
	    const merged = Object.assign(defaults, opts);
	    return merged;
	}
	// Compares 2 u8a-s in kinda constant time
	function equalBytes(a, b) {
	    if (a.length !== b.length)
	        return false;
	    let diff = 0;
	    for (let i = 0; i < a.length; i++)
	        diff |= a[i] ^ b[i];
	    return diff === 0;
	}
	/**
	 * @__NO_SIDE_EFFECTS__
	 */
	const wrapCipher = (params, c) => {
	    Object.assign(c, params);
	    return c;
	};
	// Polyfill for Safari 14
	function setBigUint64$1(view, byteOffset, value, isLE) {
	    if (typeof view.setBigUint64 === 'function')
	        return view.setBigUint64(byteOffset, value, isLE);
	    const _32n = BigInt(32);
	    const _u32_max = BigInt(0xffffffff);
	    const wh = Number((value >> _32n) & _u32_max);
	    const wl = Number(value & _u32_max);
	    const h = 4 ;
	    const l = 0 ;
	    view.setUint32(byteOffset + h, wh, isLE);
	    view.setUint32(byteOffset + l, wl, isLE);
	}

	// prettier-ignore
	/*
	AES (Advanced Encryption Standard) aka Rijndael block cipher.

	Data is split into 128-bit blocks. Encrypted in 10/12/14 rounds (128/192/256 bits). In every round:
	1. **S-box**, table substitution
	2. **Shift rows**, cyclic shift left of all rows of data array
	3. **Mix columns**, multiplying every column by fixed polynomial
	4. **Add round key**, round_key xor i-th column of array

	Resources:
	- FIPS-197 https://csrc.nist.gov/files/pubs/fips/197/final/docs/fips-197.pdf
	- Original proposal: https://csrc.nist.gov/csrc/media/projects/cryptographic-standards-and-guidelines/documents/aes-development/rijndael-ammended.pdf
	*/
	const BLOCK_SIZE = 16;
	const POLY = 0x11b; // 1 + x + x**3 + x**4 + x**8
	// TODO: remove multiplication, binary ops only
	function mul2(n) {
	    return (n << 1) ^ (POLY & -(n >> 7));
	}
	function mul(a, b) {
	    let res = 0;
	    for (; b > 0; b >>= 1) {
	        // Montgomery ladder
	        res ^= a & -(b & 1); // if (b&1) res ^=a (but const-time).
	        a = mul2(a); // a = 2*a
	    }
	    return res;
	}
	// AES S-box is generated using finite field inversion,
	// an affine transform, and xor of a constant 0x63.
	const sbox = /* @__PURE__ */ (() => {
	    let t = new Uint8Array(256);
	    for (let i = 0, x = 1; i < 256; i++, x ^= mul2(x))
	        t[i] = x;
	    const box = new Uint8Array(256);
	    box[0] = 0x63; // first elm
	    for (let i = 0; i < 255; i++) {
	        let x = t[255 - i];
	        x |= x << 8;
	        box[t[i]] = (x ^ (x >> 4) ^ (x >> 5) ^ (x >> 6) ^ (x >> 7) ^ 0x63) & 0xff;
	    }
	    return box;
	})();
	// Inverted S-box
	const invSbox = /* @__PURE__ */ sbox.map((_, j) => sbox.indexOf(j));
	// Rotate u32 by 8
	const rotr32_8 = (n) => (n << 24) | (n >>> 8);
	const rotl32_8 = (n) => (n << 8) | (n >>> 24);
	// T-table is optimization suggested in 5.2 of original proposal (missed from FIPS-197). Changes:
	// - LE instead of BE
	// - bigger tables: T0 and T1 are merged into T01 table and T2 & T3 into T23;
	//   so index is u16, instead of u8. This speeds up things, unexpectedly
	function genTtable(sbox, fn) {
	    if (sbox.length !== 256)
	        throw new Error('Wrong sbox length');
	    const T0 = new Uint32Array(256).map((_, j) => fn(sbox[j]));
	    const T1 = T0.map(rotl32_8);
	    const T2 = T1.map(rotl32_8);
	    const T3 = T2.map(rotl32_8);
	    const T01 = new Uint32Array(256 * 256);
	    const T23 = new Uint32Array(256 * 256);
	    const sbox2 = new Uint16Array(256 * 256);
	    for (let i = 0; i < 256; i++) {
	        for (let j = 0; j < 256; j++) {
	            const idx = i * 256 + j;
	            T01[idx] = T0[i] ^ T1[j];
	            T23[idx] = T2[i] ^ T3[j];
	            sbox2[idx] = (sbox[i] << 8) | sbox[j];
	        }
	    }
	    return { sbox, sbox2, T0, T1, T2, T3, T01, T23 };
	}
	const tableEncoding = /* @__PURE__ */ genTtable(sbox, (s) => (mul(s, 3) << 24) | (s << 16) | (s << 8) | mul(s, 2));
	const tableDecoding = /* @__PURE__ */ genTtable(invSbox, (s) => (mul(s, 11) << 24) | (mul(s, 13) << 16) | (mul(s, 9) << 8) | mul(s, 14));
	const xPowers = /* @__PURE__ */ (() => {
	    const p = new Uint8Array(16);
	    for (let i = 0, x = 1; i < 16; i++, x = mul2(x))
	        p[i] = x;
	    return p;
	})();
	function expandKeyLE(key) {
	    bytes(key);
	    const len = key.length;
	    if (![16, 24, 32].includes(len))
	        throw new Error(`aes: wrong key size: should be 16, 24 or 32, got: ${len}`);
	    const { sbox2 } = tableEncoding;
	    const k32 = u32(key);
	    const Nk = k32.length;
	    const subByte = (n) => applySbox(sbox2, n, n, n, n);
	    const xk = new Uint32Array(len + 28); // expanded key
	    xk.set(k32);
	    // 4.3.1 Key expansion
	    for (let i = Nk; i < xk.length; i++) {
	        let t = xk[i - 1];
	        if (i % Nk === 0)
	            t = subByte(rotr32_8(t)) ^ xPowers[i / Nk - 1];
	        else if (Nk > 6 && i % Nk === 4)
	            t = subByte(t);
	        xk[i] = xk[i - Nk] ^ t;
	    }
	    return xk;
	}
	function expandKeyDecLE(key) {
	    const encKey = expandKeyLE(key);
	    const xk = encKey.slice();
	    const Nk = encKey.length;
	    const { sbox2 } = tableEncoding;
	    const { T0, T1, T2, T3 } = tableDecoding;
	    // Inverse key by chunks of 4 (rounds)
	    for (let i = 0; i < Nk; i += 4) {
	        for (let j = 0; j < 4; j++)
	            xk[i + j] = encKey[Nk - i - 4 + j];
	    }
	    encKey.fill(0);
	    // apply InvMixColumn except first & last round
	    for (let i = 4; i < Nk - 4; i++) {
	        const x = xk[i];
	        const w = applySbox(sbox2, x, x, x, x);
	        xk[i] = T0[w & 0xff] ^ T1[(w >>> 8) & 0xff] ^ T2[(w >>> 16) & 0xff] ^ T3[w >>> 24];
	    }
	    return xk;
	}
	// Apply tables
	function apply0123(T01, T23, s0, s1, s2, s3) {
	    return (T01[((s0 << 8) & 0xff00) | ((s1 >>> 8) & 0xff)] ^
	        T23[((s2 >>> 8) & 0xff00) | ((s3 >>> 24) & 0xff)]);
	}
	function applySbox(sbox2, s0, s1, s2, s3) {
	    return (sbox2[(s0 & 0xff) | (s1 & 0xff00)] |
	        (sbox2[((s2 >>> 16) & 0xff) | ((s3 >>> 16) & 0xff00)] << 16));
	}
	function encrypt$3(xk, s0, s1, s2, s3) {
	    const { sbox2, T01, T23 } = tableEncoding;
	    let k = 0;
	    (s0 ^= xk[k++]), (s1 ^= xk[k++]), (s2 ^= xk[k++]), (s3 ^= xk[k++]);
	    const rounds = xk.length / 4 - 2;
	    for (let i = 0; i < rounds; i++) {
	        const t0 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3);
	        const t1 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0);
	        const t2 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1);
	        const t3 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
	        (s0 = t0), (s1 = t1), (s2 = t2), (s3 = t3);
	    }
	    // last round (without mixcolumns, so using SBOX2 table)
	    const t0 = xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3);
	    const t1 = xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0);
	    const t2 = xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1);
	    const t3 = xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2);
	    return { s0: t0, s1: t1, s2: t2, s3: t3 };
	}
	function decrypt$3(xk, s0, s1, s2, s3) {
	    const { sbox2, T01, T23 } = tableDecoding;
	    let k = 0;
	    (s0 ^= xk[k++]), (s1 ^= xk[k++]), (s2 ^= xk[k++]), (s3 ^= xk[k++]);
	    const rounds = xk.length / 4 - 2;
	    for (let i = 0; i < rounds; i++) {
	        const t0 = xk[k++] ^ apply0123(T01, T23, s0, s3, s2, s1);
	        const t1 = xk[k++] ^ apply0123(T01, T23, s1, s0, s3, s2);
	        const t2 = xk[k++] ^ apply0123(T01, T23, s2, s1, s0, s3);
	        const t3 = xk[k++] ^ apply0123(T01, T23, s3, s2, s1, s0);
	        (s0 = t0), (s1 = t1), (s2 = t2), (s3 = t3);
	    }
	    // Last round
	    const t0 = xk[k++] ^ applySbox(sbox2, s0, s3, s2, s1);
	    const t1 = xk[k++] ^ applySbox(sbox2, s1, s0, s3, s2);
	    const t2 = xk[k++] ^ applySbox(sbox2, s2, s1, s0, s3);
	    const t3 = xk[k++] ^ applySbox(sbox2, s3, s2, s1, s0);
	    return { s0: t0, s1: t1, s2: t2, s3: t3 };
	}
	function getDst(len, dst) {
	    if (!dst)
	        return new Uint8Array(len);
	    bytes(dst);
	    if (dst.length < len)
	        throw new Error(`aes: wrong destination length, expected at least ${len}, got: ${dst.length}`);
	    return dst;
	}
	function validateBlockDecrypt(data) {
	    bytes(data);
	    if (data.length % BLOCK_SIZE !== 0) {
	        throw new Error(`aes/(cbc-ecb).decrypt ciphertext should consist of blocks with size ${BLOCK_SIZE}`);
	    }
	}
	function validateBlockEncrypt(plaintext, pcks5, dst) {
	    let outLen = plaintext.length;
	    const remaining = outLen % BLOCK_SIZE;
	    if (!pcks5 && remaining !== 0)
	        throw new Error('aec/(cbc-ecb): unpadded plaintext with disabled padding');
	    const b = u32(plaintext);
	    if (pcks5) {
	        let left = BLOCK_SIZE - remaining;
	        if (!left)
	            left = BLOCK_SIZE; // if no bytes left, create empty padding block
	        outLen = outLen + left;
	    }
	    const out = getDst(outLen, dst);
	    const o = u32(out);
	    return { b, o, out };
	}
	function validatePCKS(data, pcks5) {
	    if (!pcks5)
	        return data;
	    const len = data.length;
	    if (!len)
	        throw new Error(`aes/pcks5: empty ciphertext not allowed`);
	    const lastByte = data[len - 1];
	    if (lastByte <= 0 || lastByte > 16)
	        throw new Error(`aes/pcks5: wrong padding byte: ${lastByte}`);
	    const out = data.subarray(0, -lastByte);
	    for (let i = 0; i < lastByte; i++)
	        if (data[len - i - 1] !== lastByte)
	            throw new Error(`aes/pcks5: wrong padding`);
	    return out;
	}
	function padPCKS(left) {
	    const tmp = new Uint8Array(16);
	    const tmp32 = u32(tmp);
	    tmp.set(left);
	    const paddingByte = BLOCK_SIZE - left.length;
	    for (let i = BLOCK_SIZE - paddingByte; i < BLOCK_SIZE; i++)
	        tmp[i] = paddingByte;
	    return tmp32;
	}
	/**
	 * CBC: Cipher-Block-Chaining. Key is previous round’s block.
	 * Fragile: needs proper padding. Unauthenticated: needs MAC.
	 */
	const cbc = wrapCipher({ blockSize: 16, nonceLength: 16 }, function cbc(key, iv, opts = {}) {
	    bytes(key);
	    bytes(iv, 16);
	    const pcks5 = !opts.disablePadding;
	    return {
	        encrypt: (plaintext, dst) => {
	            const xk = expandKeyLE(key);
	            const { b, o, out: _out } = validateBlockEncrypt(plaintext, pcks5, dst);
	            const n32 = u32(iv);
	            // prettier-ignore
	            let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
	            let i = 0;
	            for (; i + 4 <= b.length;) {
	                (s0 ^= b[i + 0]), (s1 ^= b[i + 1]), (s2 ^= b[i + 2]), (s3 ^= b[i + 3]);
	                ({ s0, s1, s2, s3 } = encrypt$3(xk, s0, s1, s2, s3));
	                (o[i++] = s0), (o[i++] = s1), (o[i++] = s2), (o[i++] = s3);
	            }
	            if (pcks5) {
	                const tmp32 = padPCKS(plaintext.subarray(i * 4));
	                (s0 ^= tmp32[0]), (s1 ^= tmp32[1]), (s2 ^= tmp32[2]), (s3 ^= tmp32[3]);
	                ({ s0, s1, s2, s3 } = encrypt$3(xk, s0, s1, s2, s3));
	                (o[i++] = s0), (o[i++] = s1), (o[i++] = s2), (o[i++] = s3);
	            }
	            xk.fill(0);
	            return _out;
	        },
	        decrypt: (ciphertext, dst) => {
	            validateBlockDecrypt(ciphertext);
	            const xk = expandKeyDecLE(key);
	            const n32 = u32(iv);
	            const out = getDst(ciphertext.length, dst);
	            const b = u32(ciphertext);
	            const o = u32(out);
	            // prettier-ignore
	            let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
	            for (let i = 0; i + 4 <= b.length;) {
	                // prettier-ignore
	                const ps0 = s0, ps1 = s1, ps2 = s2, ps3 = s3;
	                (s0 = b[i + 0]), (s1 = b[i + 1]), (s2 = b[i + 2]), (s3 = b[i + 3]);
	                const { s0: o0, s1: o1, s2: o2, s3: o3 } = decrypt$3(xk, s0, s1, s2, s3);
	                (o[i++] = o0 ^ ps0), (o[i++] = o1 ^ ps1), (o[i++] = o2 ^ ps2), (o[i++] = o3 ^ ps3);
	            }
	            xk.fill(0);
	            return validatePCKS(out, pcks5);
	        },
	    };
	});

	// Poly1305 is a fast and parallel secret-key message-authentication code.
	// https://cr.yp.to/mac.html, https://cr.yp.to/mac/poly1305-20050329.pdf
	// https://datatracker.ietf.org/doc/html/rfc8439
	// Based on Public Domain poly1305-donna https://github.com/floodyberry/poly1305-donna
	const u8to16 = (a, i) => (a[i++] & 0xff) | ((a[i++] & 0xff) << 8);
	class Poly1305 {
	    constructor(key) {
	        this.blockLen = 16;
	        this.outputLen = 16;
	        this.buffer = new Uint8Array(16);
	        this.r = new Uint16Array(10);
	        this.h = new Uint16Array(10);
	        this.pad = new Uint16Array(8);
	        this.pos = 0;
	        this.finished = false;
	        key = toBytes$1(key);
	        bytes(key, 32);
	        const t0 = u8to16(key, 0);
	        const t1 = u8to16(key, 2);
	        const t2 = u8to16(key, 4);
	        const t3 = u8to16(key, 6);
	        const t4 = u8to16(key, 8);
	        const t5 = u8to16(key, 10);
	        const t6 = u8to16(key, 12);
	        const t7 = u8to16(key, 14);
	        // https://github.com/floodyberry/poly1305-donna/blob/e6ad6e091d30d7f4ec2d4f978be1fcfcbce72781/poly1305-donna-16.h#L47
	        this.r[0] = t0 & 0x1fff;
	        this.r[1] = ((t0 >>> 13) | (t1 << 3)) & 0x1fff;
	        this.r[2] = ((t1 >>> 10) | (t2 << 6)) & 0x1f03;
	        this.r[3] = ((t2 >>> 7) | (t3 << 9)) & 0x1fff;
	        this.r[4] = ((t3 >>> 4) | (t4 << 12)) & 0x00ff;
	        this.r[5] = (t4 >>> 1) & 0x1ffe;
	        this.r[6] = ((t4 >>> 14) | (t5 << 2)) & 0x1fff;
	        this.r[7] = ((t5 >>> 11) | (t6 << 5)) & 0x1f81;
	        this.r[8] = ((t6 >>> 8) | (t7 << 8)) & 0x1fff;
	        this.r[9] = (t7 >>> 5) & 0x007f;
	        for (let i = 0; i < 8; i++)
	            this.pad[i] = u8to16(key, 16 + 2 * i);
	    }
	    process(data, offset, isLast = false) {
	        const hibit = isLast ? 0 : 1 << 11;
	        const { h, r } = this;
	        const r0 = r[0];
	        const r1 = r[1];
	        const r2 = r[2];
	        const r3 = r[3];
	        const r4 = r[4];
	        const r5 = r[5];
	        const r6 = r[6];
	        const r7 = r[7];
	        const r8 = r[8];
	        const r9 = r[9];
	        const t0 = u8to16(data, offset + 0);
	        const t1 = u8to16(data, offset + 2);
	        const t2 = u8to16(data, offset + 4);
	        const t3 = u8to16(data, offset + 6);
	        const t4 = u8to16(data, offset + 8);
	        const t5 = u8to16(data, offset + 10);
	        const t6 = u8to16(data, offset + 12);
	        const t7 = u8to16(data, offset + 14);
	        let h0 = h[0] + (t0 & 0x1fff);
	        let h1 = h[1] + (((t0 >>> 13) | (t1 << 3)) & 0x1fff);
	        let h2 = h[2] + (((t1 >>> 10) | (t2 << 6)) & 0x1fff);
	        let h3 = h[3] + (((t2 >>> 7) | (t3 << 9)) & 0x1fff);
	        let h4 = h[4] + (((t3 >>> 4) | (t4 << 12)) & 0x1fff);
	        let h5 = h[5] + ((t4 >>> 1) & 0x1fff);
	        let h6 = h[6] + (((t4 >>> 14) | (t5 << 2)) & 0x1fff);
	        let h7 = h[7] + (((t5 >>> 11) | (t6 << 5)) & 0x1fff);
	        let h8 = h[8] + (((t6 >>> 8) | (t7 << 8)) & 0x1fff);
	        let h9 = h[9] + ((t7 >>> 5) | hibit);
	        let c = 0;
	        let d0 = c + h0 * r0 + h1 * (5 * r9) + h2 * (5 * r8) + h3 * (5 * r7) + h4 * (5 * r6);
	        c = d0 >>> 13;
	        d0 &= 0x1fff;
	        d0 += h5 * (5 * r5) + h6 * (5 * r4) + h7 * (5 * r3) + h8 * (5 * r2) + h9 * (5 * r1);
	        c += d0 >>> 13;
	        d0 &= 0x1fff;
	        let d1 = c + h0 * r1 + h1 * r0 + h2 * (5 * r9) + h3 * (5 * r8) + h4 * (5 * r7);
	        c = d1 >>> 13;
	        d1 &= 0x1fff;
	        d1 += h5 * (5 * r6) + h6 * (5 * r5) + h7 * (5 * r4) + h8 * (5 * r3) + h9 * (5 * r2);
	        c += d1 >>> 13;
	        d1 &= 0x1fff;
	        let d2 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
	        c = d2 >>> 13;
	        d2 &= 0x1fff;
	        d2 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3);
	        c += d2 >>> 13;
	        d2 &= 0x1fff;
	        let d3 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
	        c = d3 >>> 13;
	        d3 &= 0x1fff;
	        d3 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4);
	        c += d3 >>> 13;
	        d3 &= 0x1fff;
	        let d4 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
	        c = d4 >>> 13;
	        d4 &= 0x1fff;
	        d4 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5);
	        c += d4 >>> 13;
	        d4 &= 0x1fff;
	        let d5 = c + h0 * r5 + h1 * r4 + h2 * r3 + h3 * r2 + h4 * r1;
	        c = d5 >>> 13;
	        d5 &= 0x1fff;
	        d5 += h5 * r0 + h6 * (5 * r9) + h7 * (5 * r8) + h8 * (5 * r7) + h9 * (5 * r6);
	        c += d5 >>> 13;
	        d5 &= 0x1fff;
	        let d6 = c + h0 * r6 + h1 * r5 + h2 * r4 + h3 * r3 + h4 * r2;
	        c = d6 >>> 13;
	        d6 &= 0x1fff;
	        d6 += h5 * r1 + h6 * r0 + h7 * (5 * r9) + h8 * (5 * r8) + h9 * (5 * r7);
	        c += d6 >>> 13;
	        d6 &= 0x1fff;
	        let d7 = c + h0 * r7 + h1 * r6 + h2 * r5 + h3 * r4 + h4 * r3;
	        c = d7 >>> 13;
	        d7 &= 0x1fff;
	        d7 += h5 * r2 + h6 * r1 + h7 * r0 + h8 * (5 * r9) + h9 * (5 * r8);
	        c += d7 >>> 13;
	        d7 &= 0x1fff;
	        let d8 = c + h0 * r8 + h1 * r7 + h2 * r6 + h3 * r5 + h4 * r4;
	        c = d8 >>> 13;
	        d8 &= 0x1fff;
	        d8 += h5 * r3 + h6 * r2 + h7 * r1 + h8 * r0 + h9 * (5 * r9);
	        c += d8 >>> 13;
	        d8 &= 0x1fff;
	        let d9 = c + h0 * r9 + h1 * r8 + h2 * r7 + h3 * r6 + h4 * r5;
	        c = d9 >>> 13;
	        d9 &= 0x1fff;
	        d9 += h5 * r4 + h6 * r3 + h7 * r2 + h8 * r1 + h9 * r0;
	        c += d9 >>> 13;
	        d9 &= 0x1fff;
	        c = ((c << 2) + c) | 0;
	        c = (c + d0) | 0;
	        d0 = c & 0x1fff;
	        c = c >>> 13;
	        d1 += c;
	        h[0] = d0;
	        h[1] = d1;
	        h[2] = d2;
	        h[3] = d3;
	        h[4] = d4;
	        h[5] = d5;
	        h[6] = d6;
	        h[7] = d7;
	        h[8] = d8;
	        h[9] = d9;
	    }
	    finalize() {
	        const { h, pad } = this;
	        const g = new Uint16Array(10);
	        let c = h[1] >>> 13;
	        h[1] &= 0x1fff;
	        for (let i = 2; i < 10; i++) {
	            h[i] += c;
	            c = h[i] >>> 13;
	            h[i] &= 0x1fff;
	        }
	        h[0] += c * 5;
	        c = h[0] >>> 13;
	        h[0] &= 0x1fff;
	        h[1] += c;
	        c = h[1] >>> 13;
	        h[1] &= 0x1fff;
	        h[2] += c;
	        g[0] = h[0] + 5;
	        c = g[0] >>> 13;
	        g[0] &= 0x1fff;
	        for (let i = 1; i < 10; i++) {
	            g[i] = h[i] + c;
	            c = g[i] >>> 13;
	            g[i] &= 0x1fff;
	        }
	        g[9] -= 1 << 13;
	        let mask = (c ^ 1) - 1;
	        for (let i = 0; i < 10; i++)
	            g[i] &= mask;
	        mask = ~mask;
	        for (let i = 0; i < 10; i++)
	            h[i] = (h[i] & mask) | g[i];
	        h[0] = (h[0] | (h[1] << 13)) & 0xffff;
	        h[1] = ((h[1] >>> 3) | (h[2] << 10)) & 0xffff;
	        h[2] = ((h[2] >>> 6) | (h[3] << 7)) & 0xffff;
	        h[3] = ((h[3] >>> 9) | (h[4] << 4)) & 0xffff;
	        h[4] = ((h[4] >>> 12) | (h[5] << 1) | (h[6] << 14)) & 0xffff;
	        h[5] = ((h[6] >>> 2) | (h[7] << 11)) & 0xffff;
	        h[6] = ((h[7] >>> 5) | (h[8] << 8)) & 0xffff;
	        h[7] = ((h[8] >>> 8) | (h[9] << 5)) & 0xffff;
	        let f = h[0] + pad[0];
	        h[0] = f & 0xffff;
	        for (let i = 1; i < 8; i++) {
	            f = (((h[i] + pad[i]) | 0) + (f >>> 16)) | 0;
	            h[i] = f & 0xffff;
	        }
	    }
	    update(data) {
	        exists(this);
	        const { buffer, blockLen } = this;
	        data = toBytes$1(data);
	        const len = data.length;
	        for (let pos = 0; pos < len;) {
	            const take = Math.min(blockLen - this.pos, len - pos);
	            // Fast path: we have at least one block in input
	            if (take === blockLen) {
	                for (; blockLen <= len - pos; pos += blockLen)
	                    this.process(data, pos);
	                continue;
	            }
	            buffer.set(data.subarray(pos, pos + take), this.pos);
	            this.pos += take;
	            pos += take;
	            if (this.pos === blockLen) {
	                this.process(buffer, 0, false);
	                this.pos = 0;
	            }
	        }
	        return this;
	    }
	    destroy() {
	        this.h.fill(0);
	        this.r.fill(0);
	        this.buffer.fill(0);
	        this.pad.fill(0);
	    }
	    digestInto(out) {
	        exists(this);
	        output(out, this);
	        this.finished = true;
	        const { buffer, h } = this;
	        let { pos } = this;
	        if (pos) {
	            buffer[pos++] = 1;
	            // buffer.subarray(pos).fill(0);
	            for (; pos < 16; pos++)
	                buffer[pos] = 0;
	            this.process(buffer, 0, true);
	        }
	        this.finalize();
	        let opos = 0;
	        for (let i = 0; i < 8; i++) {
	            out[opos++] = h[i] >>> 0;
	            out[opos++] = h[i] >>> 8;
	        }
	        return out;
	    }
	    digest() {
	        const { buffer, outputLen } = this;
	        this.digestInto(buffer);
	        const res = buffer.slice(0, outputLen);
	        this.destroy();
	        return res;
	    }
	}
	function wrapConstructorWithKey(hashCons) {
	    const hashC = (msg, key) => hashCons(key).update(toBytes$1(msg)).digest();
	    const tmp = hashCons(new Uint8Array(32));
	    hashC.outputLen = tmp.outputLen;
	    hashC.blockLen = tmp.blockLen;
	    hashC.create = (key) => hashCons(key);
	    return hashC;
	}
	const poly1305 = wrapConstructorWithKey((key) => new Poly1305(key));

	// Basic utils for ARX (add-rotate-xor) salsa and chacha ciphers.
	/*
	RFC8439 requires multi-step cipher stream, where
	authKey starts with counter: 0, actual msg with counter: 1.

	For this, we need a way to re-use nonce / counter:

	    const counter = new Uint8Array(4);
	    chacha(..., counter, ...); // counter is now 1
	    chacha(..., counter, ...); // counter is now 2

	This is complicated:

	- 32-bit counters are enough, no need for 64-bit: max ArrayBuffer size in JS is 4GB
	- Original papers don't allow mutating counters
	- Counter overflow is undefined [^1]
	- Idea A: allow providing (nonce | counter) instead of just nonce, re-use it
	- Caveat: Cannot be re-used through all cases:
	- * chacha has (counter | nonce)
	- * xchacha has (nonce16 | counter | nonce16)
	- Idea B: separate nonce / counter and provide separate API for counter re-use
	- Caveat: there are different counter sizes depending on an algorithm.
	- salsa & chacha also differ in structures of key & sigma:
	  salsa20:      s[0] | k(4) | s[1] | nonce(2) | ctr(2) | s[2] | k(4) | s[3]
	  chacha:       s(4) | k(8) | ctr(1) | nonce(3)
	  chacha20orig: s(4) | k(8) | ctr(2) | nonce(2)
	- Idea C: helper method such as `setSalsaState(key, nonce, sigma, data)`
	- Caveat: we can't re-use counter array

	xchacha [^2] uses the subkey and remaining 8 byte nonce with ChaCha20 as normal
	(prefixed by 4 NUL bytes, since [RFC8439] specifies a 12-byte nonce).

	[^1]: https://mailarchive.ietf.org/arch/msg/cfrg/gsOnTJzcbgG6OqD8Sc0GO5aR_tU/
	[^2]: https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha#appendix-A.2
	*/
	// We can't make top-level var depend on utils.utf8ToBytes
	// because it's not present in all envs. Creating a similar fn here
	const _utf8ToBytes = (str) => Uint8Array.from(str.split('').map((c) => c.charCodeAt(0)));
	const sigma16 = _utf8ToBytes('expand 16-byte k');
	const sigma32 = _utf8ToBytes('expand 32-byte k');
	const sigma16_32 = u32(sigma16);
	const sigma32_32 = u32(sigma32);
	sigma32_32.slice();
	function rotl$1(a, b) {
	    return (a << b) | (a >>> (32 - b));
	}
	// Is byte array aligned to 4 byte offset (u32)?
	function isAligned32(b) {
	    return b.byteOffset % 4 === 0;
	}
	// Salsa and Chacha block length is always 512-bit
	const BLOCK_LEN = 64;
	const BLOCK_LEN32 = 16;
	// new Uint32Array([2**32])   // => Uint32Array(1) [ 0 ]
	// new Uint32Array([2**32-1]) // => Uint32Array(1) [ 4294967295 ]
	const MAX_COUNTER = 2 ** 32 - 1;
	const U32_EMPTY = new Uint32Array();
	function runCipher(core, sigma, key, nonce, data, output, counter, rounds) {
	    const len = data.length;
	    const block = new Uint8Array(BLOCK_LEN);
	    const b32 = u32(block);
	    // Make sure that buffers aligned to 4 bytes
	    const isAligned = isAligned32(data) && isAligned32(output);
	    const d32 = isAligned ? u32(data) : U32_EMPTY;
	    const o32 = isAligned ? u32(output) : U32_EMPTY;
	    for (let pos = 0; pos < len; counter++) {
	        core(sigma, key, nonce, b32, counter, rounds);
	        if (counter >= MAX_COUNTER)
	            throw new Error('arx: counter overflow');
	        const take = Math.min(BLOCK_LEN, len - pos);
	        // aligned to 4 bytes
	        if (isAligned && take === BLOCK_LEN) {
	            const pos32 = pos / 4;
	            if (pos % 4 !== 0)
	                throw new Error('arx: invalid block position');
	            for (let j = 0, posj; j < BLOCK_LEN32; j++) {
	                posj = pos32 + j;
	                o32[posj] = d32[posj] ^ b32[j];
	            }
	            pos += BLOCK_LEN;
	            continue;
	        }
	        for (let j = 0, posj; j < take; j++) {
	            posj = pos + j;
	            output[posj] = data[posj] ^ block[j];
	        }
	        pos += take;
	    }
	}
	function createCipher(core, opts) {
	    const { allowShortKeys, extendNonceFn, counterLength, counterRight, rounds } = checkOpts({ allowShortKeys: false, counterLength: 8, counterRight: false, rounds: 20 }, opts);
	    if (typeof core !== 'function')
	        throw new Error('core must be a function');
	    number(counterLength);
	    number(rounds);
	    bool(counterRight);
	    bool(allowShortKeys);
	    return (key, nonce, data, output, counter = 0) => {
	        bytes(key);
	        bytes(nonce);
	        bytes(data);
	        const len = data.length;
	        if (!output)
	            output = new Uint8Array(len);
	        bytes(output);
	        number(counter);
	        if (counter < 0 || counter >= MAX_COUNTER)
	            throw new Error('arx: counter overflow');
	        if (output.length < len)
	            throw new Error(`arx: output (${output.length}) is shorter than data (${len})`);
	        const toClean = [];
	        // Key & sigma
	        // key=16 -> sigma16, k=key|key
	        // key=32 -> sigma32, k=key
	        let l = key.length, k, sigma;
	        if (l === 32) {
	            k = key.slice();
	            toClean.push(k);
	            sigma = sigma32_32;
	        }
	        else if (l === 16 && allowShortKeys) {
	            k = new Uint8Array(32);
	            k.set(key);
	            k.set(key, 16);
	            sigma = sigma16_32;
	            toClean.push(k);
	        }
	        else {
	            throw new Error(`arx: invalid 32-byte key, got length=${l}`);
	        }
	        // Nonce
	        // salsa20:      8   (8-byte counter)
	        // chacha20orig: 8   (8-byte counter)
	        // chacha20:     12  (4-byte counter)
	        // xsalsa20:     24  (16 -> hsalsa,  8 -> old nonce)
	        // xchacha20:    24  (16 -> hchacha, 8 -> old nonce)
	        // Align nonce to 4 bytes
	        if (!isAligned32(nonce)) {
	            nonce = nonce.slice();
	            toClean.push(nonce);
	        }
	        const k32 = u32(k);
	        // hsalsa & hchacha: handle extended nonce
	        if (extendNonceFn) {
	            if (nonce.length !== 24)
	                throw new Error(`arx: extended nonce must be 24 bytes`);
	            extendNonceFn(sigma, k32, u32(nonce.subarray(0, 16)), k32);
	            nonce = nonce.subarray(16);
	        }
	        // Handle nonce counter
	        const nonceNcLen = 16 - counterLength;
	        if (nonceNcLen !== nonce.length)
	            throw new Error(`arx: nonce must be ${nonceNcLen} or 16 bytes`);
	        // Pad counter when nonce is 64 bit
	        if (nonceNcLen !== 12) {
	            const nc = new Uint8Array(12);
	            nc.set(nonce, counterRight ? 0 : 12 - nonce.length);
	            nonce = nc;
	            toClean.push(nonce);
	        }
	        const n32 = u32(nonce);
	        runCipher(core, sigma, k32, n32, data, output, counter, rounds);
	        while (toClean.length > 0)
	            toClean.pop().fill(0);
	        return output;
	    };
	}

	// prettier-ignore
	// ChaCha20 stream cipher was released in 2008. ChaCha aims to increase
	// the diffusion per round, but had slightly less cryptanalysis.
	// https://cr.yp.to/chacha.html, http://cr.yp.to/chacha/chacha-20080128.pdf
	/**
	 * ChaCha core function.
	 */
	// prettier-ignore
	function chachaCore(s, k, n, out, cnt, rounds = 20) {
	    let y00 = s[0], y01 = s[1], y02 = s[2], y03 = s[3], // "expa"   "nd 3"  "2-by"  "te k"
	    y04 = k[0], y05 = k[1], y06 = k[2], y07 = k[3], // Key      Key     Key     Key
	    y08 = k[4], y09 = k[5], y10 = k[6], y11 = k[7], // Key      Key     Key     Key
	    y12 = cnt, y13 = n[0], y14 = n[1], y15 = n[2]; // Counter  Counter	Nonce   Nonce
	    // Save state to temporary variables
	    let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
	    for (let r = 0; r < rounds; r += 2) {
	        x00 = (x00 + x04) | 0;
	        x12 = rotl$1(x12 ^ x00, 16);
	        x08 = (x08 + x12) | 0;
	        x04 = rotl$1(x04 ^ x08, 12);
	        x00 = (x00 + x04) | 0;
	        x12 = rotl$1(x12 ^ x00, 8);
	        x08 = (x08 + x12) | 0;
	        x04 = rotl$1(x04 ^ x08, 7);
	        x01 = (x01 + x05) | 0;
	        x13 = rotl$1(x13 ^ x01, 16);
	        x09 = (x09 + x13) | 0;
	        x05 = rotl$1(x05 ^ x09, 12);
	        x01 = (x01 + x05) | 0;
	        x13 = rotl$1(x13 ^ x01, 8);
	        x09 = (x09 + x13) | 0;
	        x05 = rotl$1(x05 ^ x09, 7);
	        x02 = (x02 + x06) | 0;
	        x14 = rotl$1(x14 ^ x02, 16);
	        x10 = (x10 + x14) | 0;
	        x06 = rotl$1(x06 ^ x10, 12);
	        x02 = (x02 + x06) | 0;
	        x14 = rotl$1(x14 ^ x02, 8);
	        x10 = (x10 + x14) | 0;
	        x06 = rotl$1(x06 ^ x10, 7);
	        x03 = (x03 + x07) | 0;
	        x15 = rotl$1(x15 ^ x03, 16);
	        x11 = (x11 + x15) | 0;
	        x07 = rotl$1(x07 ^ x11, 12);
	        x03 = (x03 + x07) | 0;
	        x15 = rotl$1(x15 ^ x03, 8);
	        x11 = (x11 + x15) | 0;
	        x07 = rotl$1(x07 ^ x11, 7);
	        x00 = (x00 + x05) | 0;
	        x15 = rotl$1(x15 ^ x00, 16);
	        x10 = (x10 + x15) | 0;
	        x05 = rotl$1(x05 ^ x10, 12);
	        x00 = (x00 + x05) | 0;
	        x15 = rotl$1(x15 ^ x00, 8);
	        x10 = (x10 + x15) | 0;
	        x05 = rotl$1(x05 ^ x10, 7);
	        x01 = (x01 + x06) | 0;
	        x12 = rotl$1(x12 ^ x01, 16);
	        x11 = (x11 + x12) | 0;
	        x06 = rotl$1(x06 ^ x11, 12);
	        x01 = (x01 + x06) | 0;
	        x12 = rotl$1(x12 ^ x01, 8);
	        x11 = (x11 + x12) | 0;
	        x06 = rotl$1(x06 ^ x11, 7);
	        x02 = (x02 + x07) | 0;
	        x13 = rotl$1(x13 ^ x02, 16);
	        x08 = (x08 + x13) | 0;
	        x07 = rotl$1(x07 ^ x08, 12);
	        x02 = (x02 + x07) | 0;
	        x13 = rotl$1(x13 ^ x02, 8);
	        x08 = (x08 + x13) | 0;
	        x07 = rotl$1(x07 ^ x08, 7);
	        x03 = (x03 + x04) | 0;
	        x14 = rotl$1(x14 ^ x03, 16);
	        x09 = (x09 + x14) | 0;
	        x04 = rotl$1(x04 ^ x09, 12);
	        x03 = (x03 + x04) | 0;
	        x14 = rotl$1(x14 ^ x03, 8);
	        x09 = (x09 + x14) | 0;
	        x04 = rotl$1(x04 ^ x09, 7);
	    }
	    // Write output
	    let oi = 0;
	    out[oi++] = (y00 + x00) | 0;
	    out[oi++] = (y01 + x01) | 0;
	    out[oi++] = (y02 + x02) | 0;
	    out[oi++] = (y03 + x03) | 0;
	    out[oi++] = (y04 + x04) | 0;
	    out[oi++] = (y05 + x05) | 0;
	    out[oi++] = (y06 + x06) | 0;
	    out[oi++] = (y07 + x07) | 0;
	    out[oi++] = (y08 + x08) | 0;
	    out[oi++] = (y09 + x09) | 0;
	    out[oi++] = (y10 + x10) | 0;
	    out[oi++] = (y11 + x11) | 0;
	    out[oi++] = (y12 + x12) | 0;
	    out[oi++] = (y13 + x13) | 0;
	    out[oi++] = (y14 + x14) | 0;
	    out[oi++] = (y15 + x15) | 0;
	}
	/**
	 * hchacha helper method, used primarily in xchacha, to hash
	 * key and nonce into key' and nonce'.
	 * Same as chachaCore, but there doesn't seem to be a way to move the block
	 * out without 25% performance hit.
	 */
	// prettier-ignore
	function hchacha(s, k, i, o32) {
	    let x00 = s[0], x01 = s[1], x02 = s[2], x03 = s[3], x04 = k[0], x05 = k[1], x06 = k[2], x07 = k[3], x08 = k[4], x09 = k[5], x10 = k[6], x11 = k[7], x12 = i[0], x13 = i[1], x14 = i[2], x15 = i[3];
	    for (let r = 0; r < 20; r += 2) {
	        x00 = (x00 + x04) | 0;
	        x12 = rotl$1(x12 ^ x00, 16);
	        x08 = (x08 + x12) | 0;
	        x04 = rotl$1(x04 ^ x08, 12);
	        x00 = (x00 + x04) | 0;
	        x12 = rotl$1(x12 ^ x00, 8);
	        x08 = (x08 + x12) | 0;
	        x04 = rotl$1(x04 ^ x08, 7);
	        x01 = (x01 + x05) | 0;
	        x13 = rotl$1(x13 ^ x01, 16);
	        x09 = (x09 + x13) | 0;
	        x05 = rotl$1(x05 ^ x09, 12);
	        x01 = (x01 + x05) | 0;
	        x13 = rotl$1(x13 ^ x01, 8);
	        x09 = (x09 + x13) | 0;
	        x05 = rotl$1(x05 ^ x09, 7);
	        x02 = (x02 + x06) | 0;
	        x14 = rotl$1(x14 ^ x02, 16);
	        x10 = (x10 + x14) | 0;
	        x06 = rotl$1(x06 ^ x10, 12);
	        x02 = (x02 + x06) | 0;
	        x14 = rotl$1(x14 ^ x02, 8);
	        x10 = (x10 + x14) | 0;
	        x06 = rotl$1(x06 ^ x10, 7);
	        x03 = (x03 + x07) | 0;
	        x15 = rotl$1(x15 ^ x03, 16);
	        x11 = (x11 + x15) | 0;
	        x07 = rotl$1(x07 ^ x11, 12);
	        x03 = (x03 + x07) | 0;
	        x15 = rotl$1(x15 ^ x03, 8);
	        x11 = (x11 + x15) | 0;
	        x07 = rotl$1(x07 ^ x11, 7);
	        x00 = (x00 + x05) | 0;
	        x15 = rotl$1(x15 ^ x00, 16);
	        x10 = (x10 + x15) | 0;
	        x05 = rotl$1(x05 ^ x10, 12);
	        x00 = (x00 + x05) | 0;
	        x15 = rotl$1(x15 ^ x00, 8);
	        x10 = (x10 + x15) | 0;
	        x05 = rotl$1(x05 ^ x10, 7);
	        x01 = (x01 + x06) | 0;
	        x12 = rotl$1(x12 ^ x01, 16);
	        x11 = (x11 + x12) | 0;
	        x06 = rotl$1(x06 ^ x11, 12);
	        x01 = (x01 + x06) | 0;
	        x12 = rotl$1(x12 ^ x01, 8);
	        x11 = (x11 + x12) | 0;
	        x06 = rotl$1(x06 ^ x11, 7);
	        x02 = (x02 + x07) | 0;
	        x13 = rotl$1(x13 ^ x02, 16);
	        x08 = (x08 + x13) | 0;
	        x07 = rotl$1(x07 ^ x08, 12);
	        x02 = (x02 + x07) | 0;
	        x13 = rotl$1(x13 ^ x02, 8);
	        x08 = (x08 + x13) | 0;
	        x07 = rotl$1(x07 ^ x08, 7);
	        x03 = (x03 + x04) | 0;
	        x14 = rotl$1(x14 ^ x03, 16);
	        x09 = (x09 + x14) | 0;
	        x04 = rotl$1(x04 ^ x09, 12);
	        x03 = (x03 + x04) | 0;
	        x14 = rotl$1(x14 ^ x03, 8);
	        x09 = (x09 + x14) | 0;
	        x04 = rotl$1(x04 ^ x09, 7);
	    }
	    let oi = 0;
	    o32[oi++] = x00;
	    o32[oi++] = x01;
	    o32[oi++] = x02;
	    o32[oi++] = x03;
	    o32[oi++] = x12;
	    o32[oi++] = x13;
	    o32[oi++] = x14;
	    o32[oi++] = x15;
	}
	/**
	 * ChaCha stream cipher. Conforms to RFC 8439 (IETF, TLS). 12-byte nonce, 4-byte counter.
	 * With 12-byte nonce, it's not safe to use fill it with random (CSPRNG), due to collision chance.
	 */
	const chacha20 = /* @__PURE__ */ createCipher(chachaCore, {
	    counterRight: false,
	    counterLength: 4,
	    allowShortKeys: false,
	});
	/**
	 * XChaCha eXtended-nonce ChaCha. 24-byte nonce.
	 * With 24-byte nonce, it's safe to use fill it with random (CSPRNG).
	 * https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha
	 */
	const xchacha20 = /* @__PURE__ */ createCipher(chachaCore, {
	    counterRight: false,
	    counterLength: 8,
	    extendNonceFn: hchacha,
	    allowShortKeys: false,
	});
	const ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
	// Pad to digest size with zeros
	const updatePadded = (h, msg) => {
	    h.update(msg);
	    const left = msg.length % 16;
	    if (left)
	        h.update(ZEROS16.subarray(left));
	};
	const ZEROS32 = /* @__PURE__ */ new Uint8Array(32);
	function computeTag(fn, key, nonce, data, AAD) {
	    const authKey = fn(key, nonce, ZEROS32);
	    const h = poly1305.create(authKey);
	    if (AAD)
	        updatePadded(h, AAD);
	    updatePadded(h, data);
	    const num = new Uint8Array(16);
	    const view = createView$1(num);
	    setBigUint64$1(view, 0, BigInt(AAD ? AAD.length : 0), true);
	    setBigUint64$1(view, 8, BigInt(data.length), true);
	    h.update(num);
	    const res = h.digest();
	    authKey.fill(0);
	    return res;
	}
	/**
	 * AEAD algorithm from RFC 8439.
	 * Salsa20 and chacha (RFC 8439) use poly1305 differently.
	 * We could have composed them similar to:
	 * https://github.com/paulmillr/scure-base/blob/b266c73dde977b1dd7ef40ef7a23cc15aab526b3/index.ts#L250
	 * But it's hard because of authKey:
	 * In salsa20, authKey changes position in salsa stream.
	 * In chacha, authKey can't be computed inside computeTag, it modifies the counter.
	 */
	const _poly1305_aead = (xorStream) => (key, nonce, AAD) => {
	    const tagLength = 16;
	    bytes(key, 32);
	    bytes(nonce);
	    return {
	        encrypt: (plaintext, output) => {
	            const plength = plaintext.length;
	            const clength = plength + tagLength;
	            if (output) {
	                bytes(output, clength);
	            }
	            else {
	                output = new Uint8Array(clength);
	            }
	            xorStream(key, nonce, plaintext, output, 1);
	            const tag = computeTag(xorStream, key, nonce, output.subarray(0, -tagLength), AAD);
	            output.set(tag, plength); // append tag
	            return output;
	        },
	        decrypt: (ciphertext, output) => {
	            const clength = ciphertext.length;
	            const plength = clength - tagLength;
	            if (clength < tagLength)
	                throw new Error(`encrypted data must be at least ${tagLength} bytes`);
	            if (output) {
	                bytes(output, plength);
	            }
	            else {
	                output = new Uint8Array(plength);
	            }
	            const data = ciphertext.subarray(0, -tagLength);
	            const passedTag = ciphertext.subarray(-tagLength);
	            const tag = computeTag(xorStream, key, nonce, data, AAD);
	            if (!equalBytes(passedTag, tag))
	                throw new Error('invalid tag');
	            xorStream(key, nonce, data, output, 1);
	            return output;
	        },
	    };
	};
	/**
	 * XChaCha20-Poly1305 extended-nonce chacha.
	 * https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha
	 * With 24-byte nonce, it's safe to use fill it with random (CSPRNG).
	 */
	const xchacha20poly1305 = /* @__PURE__ */ wrapCipher({ blockSize: 64, nonceLength: 24, tagLength: 16 }, _poly1305_aead(xchacha20));

	// HMAC (RFC 2104)
	let HMAC$1 = class HMAC extends Hash$1 {
	    constructor(hash, _key) {
	        super();
	        this.finished = false;
	        this.destroyed = false;
	        assert.hash(hash);
	        const key = toBytes$2(_key);
	        this.iHash = hash.create();
	        if (typeof this.iHash.update !== 'function')
	            throw new Error('Expected instance of class which extends utils.Hash');
	        this.blockLen = this.iHash.blockLen;
	        this.outputLen = this.iHash.outputLen;
	        const blockLen = this.blockLen;
	        const pad = new Uint8Array(blockLen);
	        // blockLen can be bigger than outputLen
	        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
	        for (let i = 0; i < pad.length; i++)
	            pad[i] ^= 0x36;
	        this.iHash.update(pad);
	        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
	        this.oHash = hash.create();
	        // Undo internal XOR && apply outer XOR
	        for (let i = 0; i < pad.length; i++)
	            pad[i] ^= 0x36 ^ 0x5c;
	        this.oHash.update(pad);
	        pad.fill(0);
	    }
	    update(buf) {
	        assert.exists(this);
	        this.iHash.update(buf);
	        return this;
	    }
	    digestInto(out) {
	        assert.exists(this);
	        assert.bytes(out, this.outputLen);
	        this.finished = true;
	        this.iHash.digestInto(out);
	        this.oHash.update(out);
	        this.oHash.digestInto(out);
	        this.destroy();
	    }
	    digest() {
	        const out = new Uint8Array(this.oHash.outputLen);
	        this.digestInto(out);
	        return out;
	    }
	    _cloneInto(to) {
	        // Create new instance without calling constructor since key already in state and we don't know it.
	        to || (to = Object.create(Object.getPrototypeOf(this), {}));
	        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
	        to = to;
	        to.finished = finished;
	        to.destroyed = destroyed;
	        to.blockLen = blockLen;
	        to.outputLen = outputLen;
	        to.oHash = oHash._cloneInto(to.oHash);
	        to.iHash = iHash._cloneInto(to.iHash);
	        return to;
	    }
	    destroy() {
	        this.destroyed = true;
	        this.oHash.destroy();
	        this.iHash.destroy();
	    }
	};
	/**
	 * HMAC: RFC2104 message authentication code.
	 * @param hash - function that would be used e.g. sha256
	 * @param key - message key
	 * @param message - message data
	 */
	const hmac$1 = (hash, key, message) => new HMAC$1(hash, key).update(message).digest();
	hmac$1.create = (hash, key) => new HMAC$1(hash, key);

	// HKDF (RFC 5869)
	// https://soatok.blog/2021/11/17/understanding-hkdf/
	/**
	 * HKDF-Extract(IKM, salt) -> PRK
	 * Arguments position differs from spec (IKM is first one, since it is not optional)
	 * @param hash
	 * @param ikm
	 * @param salt
	 * @returns
	 */
	function extract(hash, ikm, salt) {
	    assert.hash(hash);
	    return hmac$1(hash, toBytes$2(salt), toBytes$2(ikm));
	}
	// HKDF-Expand(PRK, info, L) -> OKM
	const HKDF_COUNTER = new Uint8Array([0]);
	const EMPTY_BUFFER = new Uint8Array();
	/**
	 * HKDF-expand from the spec.
	 * @param prk - a pseudorandom key of at least HashLen octets (usually, the output from the extract step)
	 * @param info - optional context and application specific information (can be a zero-length string)
	 * @param length - length of output keying material in octets
	 */
	function expand(hash, prk, info, length = 32) {
	    assert.hash(hash);
	    assert.number(length);
	    if (length > 255 * hash.outputLen)
	        throw new Error('Length should be <= 255*HashLen');
	    const blocks = Math.ceil(length / hash.outputLen);
	    if (info === undefined)
	        info = EMPTY_BUFFER;
	    // first L(ength) octets of T
	    const okm = new Uint8Array(blocks * hash.outputLen);
	    // Re-use HMAC instance between blocks
	    const HMAC = hmac$1.create(hash, prk);
	    const HMACTmp = HMAC._cloneInto();
	    const T = new Uint8Array(HMAC.outputLen);
	    for (let counter = 0; counter < blocks; counter++) {
	        HKDF_COUNTER[0] = counter + 1;
	        // T(0) = empty string (zero length)
	        // T(N) = HMAC-Hash(PRK, T(N-1) | info | N)
	        HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T)
	            .update(info)
	            .update(HKDF_COUNTER)
	            .digestInto(T);
	        okm.set(T, hash.outputLen * counter);
	        HMAC._cloneInto(HMACTmp);
	    }
	    HMAC.destroy();
	    HMACTmp.destroy();
	    T.fill(0);
	    HKDF_COUNTER.fill(0);
	    return okm.slice(0, length);
	}

	var __defProp$1 = Object.defineProperty;
	var __export = (target, all) => {
	  for (var name in all)
	    __defProp$1(target, name, { get: all[name], enumerable: true });
	};

	// core.ts
	var verifiedSymbol = Symbol("verified");
	var isRecord = (obj) => obj instanceof Object;
	function validateEvent(event) {
	  if (!isRecord(event))
	    return false;
	  if (typeof event.kind !== "number")
	    return false;
	  if (typeof event.content !== "string")
	    return false;
	  if (typeof event.created_at !== "number")
	    return false;
	  if (typeof event.pubkey !== "string")
	    return false;
	  if (!event.pubkey.match(/^[a-f0-9]{64}$/))
	    return false;
	  if (!Array.isArray(event.tags))
	    return false;
	  for (let i2 = 0; i2 < event.tags.length; i2++) {
	    let tag = event.tags[i2];
	    if (!Array.isArray(tag))
	      return false;
	    for (let j = 0; j < tag.length; j++) {
	      if (typeof tag[j] !== "string")
	        return false;
	    }
	  }
	  return true;
	}

	// utils.ts
	var utils_exports = {};
	__export(utils_exports, {
	  Queue: () => Queue$1,
	  QueueNode: () => QueueNode,
	  binarySearch: () => binarySearch,
	  bytesToHex: () => bytesToHex$2,
	  hexToBytes: () => hexToBytes$2,
	  insertEventIntoAscendingList: () => insertEventIntoAscendingList,
	  insertEventIntoDescendingList: () => insertEventIntoDescendingList,
	  normalizeURL: () => normalizeURL,
	  utf8Decoder: () => utf8Decoder$1,
	  utf8Encoder: () => utf8Encoder$1
	});
	var utf8Decoder$1 = new TextDecoder("utf-8");
	var utf8Encoder$1 = new TextEncoder();
	function normalizeURL(url) {
	  try {
	    if (url.indexOf("://") === -1)
	      url = "wss://" + url;
	    let p = new URL(url);
	    if (p.protocol === "http:")
	      p.protocol = "ws:";
	    else if (p.protocol === "https:")
	      p.protocol = "wss:";
	    p.pathname = p.pathname.replace(/\/+/g, "/");
	    if (p.pathname.endsWith("/"))
	      p.pathname = p.pathname.slice(0, -1);
	    if (p.port === "80" && p.protocol === "ws:" || p.port === "443" && p.protocol === "wss:")
	      p.port = "";
	    p.searchParams.sort();
	    p.hash = "";
	    return p.toString();
	  } catch (e) {
	    throw new Error(`Invalid URL: ${url}`);
	  }
	}
	function insertEventIntoDescendingList(sortedArray, event) {
	  const [idx, found] = binarySearch(sortedArray, (b) => {
	    if (event.id === b.id)
	      return 0;
	    if (event.created_at === b.created_at)
	      return -1;
	    return b.created_at - event.created_at;
	  });
	  if (!found) {
	    sortedArray.splice(idx, 0, event);
	  }
	  return sortedArray;
	}
	function insertEventIntoAscendingList(sortedArray, event) {
	  const [idx, found] = binarySearch(sortedArray, (b) => {
	    if (event.id === b.id)
	      return 0;
	    if (event.created_at === b.created_at)
	      return -1;
	    return event.created_at - b.created_at;
	  });
	  if (!found) {
	    sortedArray.splice(idx, 0, event);
	  }
	  return sortedArray;
	}
	function binarySearch(arr, compare) {
	  let start = 0;
	  let end = arr.length - 1;
	  while (start <= end) {
	    const mid = Math.floor((start + end) / 2);
	    const cmp = compare(arr[mid]);
	    if (cmp === 0) {
	      return [mid, true];
	    }
	    if (cmp < 0) {
	      end = mid - 1;
	    } else {
	      start = mid + 1;
	    }
	  }
	  return [start, false];
	}
	var QueueNode = class {
	  value;
	  next = null;
	  prev = null;
	  constructor(message) {
	    this.value = message;
	  }
	};
	var Queue$1 = class Queue {
	  first;
	  last;
	  constructor() {
	    this.first = null;
	    this.last = null;
	  }
	  enqueue(value) {
	    const newNode = new QueueNode(value);
	    if (!this.last) {
	      this.first = newNode;
	      this.last = newNode;
	    } else if (this.last === this.first) {
	      this.last = newNode;
	      this.last.prev = this.first;
	      this.first.next = newNode;
	    } else {
	      newNode.prev = this.last;
	      this.last.next = newNode;
	      this.last = newNode;
	    }
	    return true;
	  }
	  dequeue() {
	    if (!this.first)
	      return null;
	    if (this.first === this.last) {
	      const target2 = this.first;
	      this.first = null;
	      this.last = null;
	      return target2.value;
	    }
	    const target = this.first;
	    this.first = target.next;
	    if (this.first) {
	      this.first.prev = null;
	    }
	    return target.value;
	  }
	};

	// pure.ts
	var JS = class {
	  generateSecretKey() {
	    return schnorr$1.utils.randomPrivateKey();
	  }
	  getPublicKey(secretKey) {
	    return bytesToHex$2(schnorr$1.getPublicKey(secretKey));
	  }
	  finalizeEvent(t, secretKey) {
	    const event = t;
	    event.pubkey = bytesToHex$2(schnorr$1.getPublicKey(secretKey));
	    event.id = getEventHash$1(event);
	    event.sig = bytesToHex$2(schnorr$1.sign(getEventHash$1(event), secretKey));
	    event[verifiedSymbol] = true;
	    return event;
	  }
	  verifyEvent(event) {
	    if (typeof event[verifiedSymbol] === "boolean")
	      return event[verifiedSymbol];
	    const hash = getEventHash$1(event);
	    if (hash !== event.id) {
	      event[verifiedSymbol] = false;
	      return false;
	    }
	    try {
	      const valid = schnorr$1.verify(event.sig, hash, event.pubkey);
	      event[verifiedSymbol] = valid;
	      return valid;
	    } catch (err) {
	      event[verifiedSymbol] = false;
	      return false;
	    }
	  }
	};
	function serializeEvent(evt) {
	  if (!validateEvent(evt))
	    throw new Error("can't serialize event with wrong or missing properties");
	  return JSON.stringify([0, evt.pubkey, evt.created_at, evt.kind, evt.tags, evt.content]);
	}
	function getEventHash$1(event) {
	  let eventHash = sha256$2(utf8Encoder$1.encode(serializeEvent(event)));
	  return bytesToHex$2(eventHash);
	}
	var i = new JS();
	var generateSecretKey = i.generateSecretKey;
	var getPublicKey = i.getPublicKey;
	var finalizeEvent = i.finalizeEvent;
	var verifyEvent = i.verifyEvent;

	// kinds.ts
	var kinds_exports = {};
	__export(kinds_exports, {
	  Application: () => Application,
	  BadgeAward: () => BadgeAward,
	  BadgeDefinition: () => BadgeDefinition,
	  BlockedRelaysList: () => BlockedRelaysList,
	  BlossomServerList: () => BlossomServerList,
	  BookmarkList: () => BookmarkList,
	  Bookmarksets: () => Bookmarksets,
	  Calendar: () => Calendar,
	  CalendarEventRSVP: () => CalendarEventRSVP,
	  ChannelCreation: () => ChannelCreation,
	  ChannelHideMessage: () => ChannelHideMessage,
	  ChannelMessage: () => ChannelMessage,
	  ChannelMetadata: () => ChannelMetadata,
	  ChannelMuteUser: () => ChannelMuteUser,
	  ChatMessage: () => ChatMessage,
	  ClassifiedListing: () => ClassifiedListing,
	  ClientAuth: () => ClientAuth,
	  Comment: () => Comment,
	  CommunitiesList: () => CommunitiesList,
	  CommunityDefinition: () => CommunityDefinition,
	  CommunityPostApproval: () => CommunityPostApproval,
	  Contacts: () => Contacts,
	  CreateOrUpdateProduct: () => CreateOrUpdateProduct,
	  CreateOrUpdateStall: () => CreateOrUpdateStall,
	  Curationsets: () => Curationsets,
	  Date: () => Date2,
	  DirectMessageRelaysList: () => DirectMessageRelaysList,
	  DraftClassifiedListing: () => DraftClassifiedListing,
	  DraftLong: () => DraftLong,
	  Emojisets: () => Emojisets,
	  EncryptedDirectMessage: () => EncryptedDirectMessage,
	  EventDeletion: () => EventDeletion,
	  FavoriteRelays: () => FavoriteRelays,
	  FileMessage: () => FileMessage,
	  FileMetadata: () => FileMetadata,
	  FileServerPreference: () => FileServerPreference,
	  Followsets: () => Followsets,
	  ForumThread: () => ForumThread,
	  GenericRepost: () => GenericRepost,
	  Genericlists: () => Genericlists,
	  GiftWrap: () => GiftWrap,
	  GroupMetadata: () => GroupMetadata,
	  HTTPAuth: () => HTTPAuth,
	  Handlerinformation: () => Handlerinformation,
	  Handlerrecommendation: () => Handlerrecommendation,
	  Highlights: () => Highlights,
	  InterestsList: () => InterestsList,
	  Interestsets: () => Interestsets,
	  JobFeedback: () => JobFeedback,
	  JobRequest: () => JobRequest,
	  JobResult: () => JobResult,
	  Label: () => Label,
	  LightningPubRPC: () => LightningPubRPC,
	  LiveChatMessage: () => LiveChatMessage,
	  LiveEvent: () => LiveEvent,
	  LongFormArticle: () => LongFormArticle,
	  Metadata: () => Metadata,
	  Mutelist: () => Mutelist,
	  NWCWalletInfo: () => NWCWalletInfo,
	  NWCWalletRequest: () => NWCWalletRequest,
	  NWCWalletResponse: () => NWCWalletResponse,
	  NormalVideo: () => NormalVideo,
	  NostrConnect: () => NostrConnect,
	  OpenTimestamps: () => OpenTimestamps,
	  Photo: () => Photo,
	  Pinlist: () => Pinlist,
	  Poll: () => Poll,
	  PollResponse: () => PollResponse,
	  PrivateDirectMessage: () => PrivateDirectMessage,
	  ProblemTracker: () => ProblemTracker,
	  ProfileBadges: () => ProfileBadges,
	  PublicChatsList: () => PublicChatsList,
	  Reaction: () => Reaction,
	  RecommendRelay: () => RecommendRelay,
	  RelayList: () => RelayList,
	  RelayReview: () => RelayReview,
	  Relaysets: () => Relaysets,
	  Report: () => Report,
	  Reporting: () => Reporting,
	  Repost: () => Repost,
	  Seal: () => Seal,
	  SearchRelaysList: () => SearchRelaysList,
	  ShortTextNote: () => ShortTextNote,
	  ShortVideo: () => ShortVideo,
	  Time: () => Time,
	  UserEmojiList: () => UserEmojiList,
	  UserStatuses: () => UserStatuses,
	  Voice: () => Voice,
	  VoiceComment: () => VoiceComment,
	  Zap: () => Zap,
	  ZapGoal: () => ZapGoal,
	  ZapRequest: () => ZapRequest,
	  classifyKind: () => classifyKind,
	  isAddressableKind: () => isAddressableKind,
	  isEphemeralKind: () => isEphemeralKind,
	  isKind: () => isKind,
	  isRegularKind: () => isRegularKind,
	  isReplaceableKind: () => isReplaceableKind
	});
	function isRegularKind(kind) {
	  return kind < 1e4 && kind !== 0 && kind !== 3;
	}
	function isReplaceableKind(kind) {
	  return kind === 0 || kind === 3 || 1e4 <= kind && kind < 2e4;
	}
	function isEphemeralKind(kind) {
	  return 2e4 <= kind && kind < 3e4;
	}
	function isAddressableKind(kind) {
	  return 3e4 <= kind && kind < 4e4;
	}
	function classifyKind(kind) {
	  if (isRegularKind(kind))
	    return "regular";
	  if (isReplaceableKind(kind))
	    return "replaceable";
	  if (isEphemeralKind(kind))
	    return "ephemeral";
	  if (isAddressableKind(kind))
	    return "parameterized";
	  return "unknown";
	}
	function isKind(event, kind) {
	  const kindAsArray = kind instanceof Array ? kind : [kind];
	  return validateEvent(event) && kindAsArray.includes(event.kind) || false;
	}
	var Metadata = 0;
	var ShortTextNote = 1;
	var RecommendRelay = 2;
	var Contacts = 3;
	var EncryptedDirectMessage = 4;
	var EventDeletion = 5;
	var Repost = 6;
	var Reaction = 7;
	var BadgeAward = 8;
	var ChatMessage = 9;
	var ForumThread = 11;
	var Seal = 13;
	var PrivateDirectMessage = 14;
	var FileMessage = 15;
	var GenericRepost = 16;
	var Photo = 20;
	var NormalVideo = 21;
	var ShortVideo = 22;
	var ChannelCreation = 40;
	var ChannelMetadata = 41;
	var ChannelMessage = 42;
	var ChannelHideMessage = 43;
	var ChannelMuteUser = 44;
	var OpenTimestamps = 1040;
	var GiftWrap = 1059;
	var Poll = 1068;
	var FileMetadata = 1063;
	var Comment = 1111;
	var LiveChatMessage = 1311;
	var Voice = 1222;
	var VoiceComment = 1244;
	var ProblemTracker = 1971;
	var Report = 1984;
	var Reporting = 1984;
	var Label = 1985;
	var CommunityPostApproval = 4550;
	var JobRequest = 5999;
	var JobResult = 6999;
	var JobFeedback = 7e3;
	var ZapGoal = 9041;
	var ZapRequest = 9734;
	var Zap = 9735;
	var Highlights = 9802;
	var PollResponse = 1018;
	var Mutelist = 1e4;
	var Pinlist = 10001;
	var RelayList = 10002;
	var BookmarkList = 10003;
	var CommunitiesList = 10004;
	var PublicChatsList = 10005;
	var BlockedRelaysList = 10006;
	var SearchRelaysList = 10007;
	var FavoriteRelays = 10012;
	var InterestsList = 10015;
	var UserEmojiList = 10030;
	var DirectMessageRelaysList = 10050;
	var FileServerPreference = 10096;
	var BlossomServerList = 10063;
	var NWCWalletInfo = 13194;
	var LightningPubRPC = 21e3;
	var ClientAuth = 22242;
	var NWCWalletRequest = 23194;
	var NWCWalletResponse = 23195;
	var NostrConnect = 24133;
	var HTTPAuth = 27235;
	var Followsets = 3e4;
	var Genericlists = 30001;
	var Relaysets = 30002;
	var Bookmarksets = 30003;
	var Curationsets = 30004;
	var ProfileBadges = 30008;
	var BadgeDefinition = 30009;
	var Interestsets = 30015;
	var CreateOrUpdateStall = 30017;
	var CreateOrUpdateProduct = 30018;
	var LongFormArticle = 30023;
	var DraftLong = 30024;
	var Emojisets = 30030;
	var Application = 30078;
	var LiveEvent = 30311;
	var UserStatuses = 30315;
	var ClassifiedListing = 30402;
	var DraftClassifiedListing = 30403;
	var Date2 = 31922;
	var Time = 31923;
	var Calendar = 31924;
	var CalendarEventRSVP = 31925;
	var RelayReview = 31987;
	var Handlerrecommendation = 31989;
	var Handlerinformation = 31990;
	var CommunityDefinition = 34550;
	var GroupMetadata = 39e3;

	// filter.ts
	function matchFilter(filter, event) {
	  if (filter.ids && filter.ids.indexOf(event.id) === -1) {
	    return false;
	  }
	  if (filter.kinds && filter.kinds.indexOf(event.kind) === -1) {
	    return false;
	  }
	  if (filter.authors && filter.authors.indexOf(event.pubkey) === -1) {
	    return false;
	  }
	  for (let f in filter) {
	    if (f[0] === "#") {
	      let tagName = f.slice(1);
	      let values = filter[`#${tagName}`];
	      if (values && !event.tags.find(([t, v]) => t === f.slice(1) && values.indexOf(v) !== -1))
	        return false;
	    }
	  }
	  if (filter.since && event.created_at < filter.since)
	    return false;
	  if (filter.until && event.created_at > filter.until)
	    return false;
	  return true;
	}
	function matchFilters(filters, event) {
	  for (let i2 = 0; i2 < filters.length; i2++) {
	    if (matchFilter(filters[i2], event)) {
	      return true;
	    }
	  }
	  return false;
	}

	// fakejson.ts
	var fakejson_exports = {};
	__export(fakejson_exports, {
	  getHex64: () => getHex64,
	  getInt: () => getInt,
	  getSubscriptionId: () => getSubscriptionId,
	  matchEventId: () => matchEventId,
	  matchEventKind: () => matchEventKind,
	  matchEventPubkey: () => matchEventPubkey
	});
	function getHex64(json, field) {
	  let len = field.length + 3;
	  let idx = json.indexOf(`"${field}":`) + len;
	  let s = json.slice(idx).indexOf(`"`) + idx + 1;
	  return json.slice(s, s + 64);
	}
	function getInt(json, field) {
	  let len = field.length;
	  let idx = json.indexOf(`"${field}":`) + len + 3;
	  let sliced = json.slice(idx);
	  let end = Math.min(sliced.indexOf(","), sliced.indexOf("}"));
	  return parseInt(sliced.slice(0, end), 10);
	}
	function getSubscriptionId(json) {
	  let idx = json.slice(0, 22).indexOf(`"EVENT"`);
	  if (idx === -1)
	    return null;
	  let pstart = json.slice(idx + 7 + 1).indexOf(`"`);
	  if (pstart === -1)
	    return null;
	  let start = idx + 7 + 1 + pstart;
	  let pend = json.slice(start + 1, 80).indexOf(`"`);
	  if (pend === -1)
	    return null;
	  let end = start + 1 + pend;
	  return json.slice(start + 1, end);
	}
	function matchEventId(json, id) {
	  return id === getHex64(json, "id");
	}
	function matchEventPubkey(json, pubkey) {
	  return pubkey === getHex64(json, "pubkey");
	}
	function matchEventKind(json, kind) {
	  return kind === getInt(json, "kind");
	}

	// nip42.ts
	var nip42_exports = {};
	__export(nip42_exports, {
	  makeAuthEvent: () => makeAuthEvent
	});
	function makeAuthEvent(relayURL, challenge) {
	  return {
	    kind: ClientAuth,
	    created_at: Math.floor(Date.now() / 1e3),
	    tags: [
	      ["relay", relayURL],
	      ["challenge", challenge]
	    ],
	    content: ""
	  };
	}

	// relay.ts
	var _WebSocket;
	try {
	  _WebSocket = WebSocket;
	} catch {
	}

	// pool.ts
	var _WebSocket2;
	try {
	  _WebSocket2 = WebSocket;
	} catch {
	}

	// nip19.ts
	var nip19_exports$1 = {};
	__export(nip19_exports$1, {
	  BECH32_REGEX: () => BECH32_REGEX$2,
	  Bech32MaxSize: () => Bech32MaxSize$2,
	  NostrTypeGuard: () => NostrTypeGuard$1,
	  decode: () => decode$1,
	  decodeNostrURI: () => decodeNostrURI$1,
	  encodeBytes: () => encodeBytes$2,
	  naddrEncode: () => naddrEncode$1,
	  neventEncode: () => neventEncode$1,
	  noteEncode: () => noteEncode$1,
	  nprofileEncode: () => nprofileEncode$1,
	  npubEncode: () => npubEncode$1,
	  nsecEncode: () => nsecEncode$1
	});
	var NostrTypeGuard$1 = {
	  isNProfile: (value) => /^nprofile1[a-z\d]+$/.test(value || ""),
	  isNEvent: (value) => /^nevent1[a-z\d]+$/.test(value || ""),
	  isNAddr: (value) => /^naddr1[a-z\d]+$/.test(value || ""),
	  isNSec: (value) => /^nsec1[a-z\d]{58}$/.test(value || ""),
	  isNPub: (value) => /^npub1[a-z\d]{58}$/.test(value || ""),
	  isNote: (value) => /^note1[a-z\d]+$/.test(value || ""),
	  isNcryptsec: (value) => /^ncryptsec1[a-z\d]+$/.test(value || "")
	};
	var Bech32MaxSize$2 = 5e3;
	var BECH32_REGEX$2 = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
	function integerToUint8Array$1(number) {
	  const uint8Array = new Uint8Array(4);
	  uint8Array[0] = number >> 24 & 255;
	  uint8Array[1] = number >> 16 & 255;
	  uint8Array[2] = number >> 8 & 255;
	  uint8Array[3] = number & 255;
	  return uint8Array;
	}
	function decodeNostrURI$1(nip19code) {
	  try {
	    if (nip19code.startsWith("nostr:"))
	      nip19code = nip19code.substring(6);
	    return decode$1(nip19code);
	  } catch (_err) {
	    return { type: "invalid", data: null };
	  }
	}
	function decode$1(code) {
	  let { prefix, words } = bech32.decode(code, Bech32MaxSize$2);
	  let data = new Uint8Array(bech32.fromWords(words));
	  switch (prefix) {
	    case "nprofile": {
	      let tlv = parseTLV$1(data);
	      if (!tlv[0]?.[0])
	        throw new Error("missing TLV 0 for nprofile");
	      if (tlv[0][0].length !== 32)
	        throw new Error("TLV 0 should be 32 bytes");
	      return {
	        type: "nprofile",
	        data: {
	          pubkey: bytesToHex$2(tlv[0][0]),
	          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder$1.decode(d)) : []
	        }
	      };
	    }
	    case "nevent": {
	      let tlv = parseTLV$1(data);
	      if (!tlv[0]?.[0])
	        throw new Error("missing TLV 0 for nevent");
	      if (tlv[0][0].length !== 32)
	        throw new Error("TLV 0 should be 32 bytes");
	      if (tlv[2] && tlv[2][0].length !== 32)
	        throw new Error("TLV 2 should be 32 bytes");
	      if (tlv[3] && tlv[3][0].length !== 4)
	        throw new Error("TLV 3 should be 4 bytes");
	      return {
	        type: "nevent",
	        data: {
	          id: bytesToHex$2(tlv[0][0]),
	          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder$1.decode(d)) : [],
	          author: tlv[2]?.[0] ? bytesToHex$2(tlv[2][0]) : void 0,
	          kind: tlv[3]?.[0] ? parseInt(bytesToHex$2(tlv[3][0]), 16) : void 0
	        }
	      };
	    }
	    case "naddr": {
	      let tlv = parseTLV$1(data);
	      if (!tlv[0]?.[0])
	        throw new Error("missing TLV 0 for naddr");
	      if (!tlv[2]?.[0])
	        throw new Error("missing TLV 2 for naddr");
	      if (tlv[2][0].length !== 32)
	        throw new Error("TLV 2 should be 32 bytes");
	      if (!tlv[3]?.[0])
	        throw new Error("missing TLV 3 for naddr");
	      if (tlv[3][0].length !== 4)
	        throw new Error("TLV 3 should be 4 bytes");
	      return {
	        type: "naddr",
	        data: {
	          identifier: utf8Decoder$1.decode(tlv[0][0]),
	          pubkey: bytesToHex$2(tlv[2][0]),
	          kind: parseInt(bytesToHex$2(tlv[3][0]), 16),
	          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder$1.decode(d)) : []
	        }
	      };
	    }
	    case "nsec":
	      return { type: prefix, data };
	    case "npub":
	    case "note":
	      return { type: prefix, data: bytesToHex$2(data) };
	    default:
	      throw new Error(`unknown prefix ${prefix}`);
	  }
	}
	function parseTLV$1(data) {
	  let result = {};
	  let rest = data;
	  while (rest.length > 0) {
	    let t = rest[0];
	    let l = rest[1];
	    let v = rest.slice(2, 2 + l);
	    rest = rest.slice(2 + l);
	    if (v.length < l)
	      throw new Error(`not enough data to read on TLV ${t}`);
	    result[t] = result[t] || [];
	    result[t].push(v);
	  }
	  return result;
	}
	function nsecEncode$1(key) {
	  return encodeBytes$2("nsec", key);
	}
	function npubEncode$1(hex) {
	  return encodeBytes$2("npub", hexToBytes$2(hex));
	}
	function noteEncode$1(hex) {
	  return encodeBytes$2("note", hexToBytes$2(hex));
	}
	function encodeBech32$2(prefix, data) {
	  let words = bech32.toWords(data);
	  return bech32.encode(prefix, words, Bech32MaxSize$2);
	}
	function encodeBytes$2(prefix, bytes) {
	  return encodeBech32$2(prefix, bytes);
	}
	function nprofileEncode$1(profile) {
	  let data = encodeTLV$1({
	    0: [hexToBytes$2(profile.pubkey)],
	    1: (profile.relays || []).map((url) => utf8Encoder$1.encode(url))
	  });
	  return encodeBech32$2("nprofile", data);
	}
	function neventEncode$1(event) {
	  let kindArray;
	  if (event.kind !== void 0) {
	    kindArray = integerToUint8Array$1(event.kind);
	  }
	  let data = encodeTLV$1({
	    0: [hexToBytes$2(event.id)],
	    1: (event.relays || []).map((url) => utf8Encoder$1.encode(url)),
	    2: event.author ? [hexToBytes$2(event.author)] : [],
	    3: kindArray ? [new Uint8Array(kindArray)] : []
	  });
	  return encodeBech32$2("nevent", data);
	}
	function naddrEncode$1(addr) {
	  let kind = new ArrayBuffer(4);
	  new DataView(kind).setUint32(0, addr.kind, false);
	  let data = encodeTLV$1({
	    0: [utf8Encoder$1.encode(addr.identifier)],
	    1: (addr.relays || []).map((url) => utf8Encoder$1.encode(url)),
	    2: [hexToBytes$2(addr.pubkey)],
	    3: [new Uint8Array(kind)]
	  });
	  return encodeBech32$2("naddr", data);
	}
	function encodeTLV$1(tlv) {
	  let entries = [];
	  Object.entries(tlv).reverse().forEach(([t, vs]) => {
	    vs.forEach((v) => {
	      let entry = new Uint8Array(v.length + 2);
	      entry.set([parseInt(t)], 0);
	      entry.set([v.length], 1);
	      entry.set(v, 2);
	      entries.push(entry);
	    });
	  });
	  return concatBytes$1(...entries);
	}

	// nip04.ts
	var nip04_exports = {};
	__export(nip04_exports, {
	  decrypt: () => decrypt$2,
	  encrypt: () => encrypt$2
	});
	function encrypt$2(secretKey, pubkey, text) {
	  const privkey = secretKey instanceof Uint8Array ? bytesToHex$2(secretKey) : secretKey;
	  const key = secp256k1$1.getSharedSecret(privkey, "02" + pubkey);
	  const normalizedKey = getNormalizedX(key);
	  let iv = Uint8Array.from(randomBytes$1(16));
	  let plaintext = utf8Encoder$1.encode(text);
	  let ciphertext = cbc(normalizedKey, iv).encrypt(plaintext);
	  let ctb64 = base64.encode(new Uint8Array(ciphertext));
	  let ivb64 = base64.encode(new Uint8Array(iv.buffer));
	  return `${ctb64}?iv=${ivb64}`;
	}
	function decrypt$2(secretKey, pubkey, data) {
	  const privkey = secretKey instanceof Uint8Array ? bytesToHex$2(secretKey) : secretKey;
	  let [ctb64, ivb64] = data.split("?iv=");
	  let key = secp256k1$1.getSharedSecret(privkey, "02" + pubkey);
	  let normalizedKey = getNormalizedX(key);
	  let iv = base64.decode(ivb64);
	  let ciphertext = base64.decode(ctb64);
	  let plaintext = cbc(normalizedKey, iv).decrypt(ciphertext);
	  return utf8Decoder$1.decode(plaintext);
	}
	function getNormalizedX(key) {
	  return key.slice(1, 33);
	}

	// nip05.ts
	var nip05_exports = {};
	__export(nip05_exports, {
	  NIP05_REGEX: () => NIP05_REGEX$1,
	  isNip05: () => isNip05,
	  isValid: () => isValid,
	  queryProfile: () => queryProfile,
	  searchDomain: () => searchDomain,
	  useFetchImplementation: () => useFetchImplementation
	});
	var NIP05_REGEX$1 = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/;
	var isNip05 = (value) => NIP05_REGEX$1.test(value || "");
	var _fetch;
	try {
	  _fetch = fetch;
	} catch (_) {
	}
	function useFetchImplementation(fetchImplementation) {
	  _fetch = fetchImplementation;
	}
	async function searchDomain(domain, query = "") {
	  try {
	    const url = `https://${domain}/.well-known/nostr.json?name=${query}`;
	    const res = await _fetch(url, { redirect: "manual" });
	    if (res.status !== 200) {
	      throw Error("Wrong response code");
	    }
	    const json = await res.json();
	    return json.names;
	  } catch (_) {
	    return {};
	  }
	}
	async function queryProfile(fullname) {
	  const match = fullname.match(NIP05_REGEX$1);
	  if (!match)
	    return null;
	  const [, name = "_", domain] = match;
	  try {
	    const url = `https://${domain}/.well-known/nostr.json?name=${name}`;
	    const res = await _fetch(url, { redirect: "manual" });
	    if (res.status !== 200) {
	      throw Error("Wrong response code");
	    }
	    const json = await res.json();
	    const pubkey = json.names[name];
	    return pubkey ? { pubkey, relays: json.relays?.[pubkey] } : null;
	  } catch (_e) {
	    return null;
	  }
	}
	async function isValid(pubkey, nip05) {
	  const res = await queryProfile(nip05);
	  return res ? res.pubkey === pubkey : false;
	}

	// nip10.ts
	var nip10_exports = {};
	__export(nip10_exports, {
	  parse: () => parse
	});
	function parse(event) {
	  const result = {
	    reply: void 0,
	    root: void 0,
	    mentions: [],
	    profiles: [],
	    quotes: []
	  };
	  let maybeParent;
	  let maybeRoot;
	  for (let i2 = event.tags.length - 1; i2 >= 0; i2--) {
	    const tag = event.tags[i2];
	    if (tag[0] === "e" && tag[1]) {
	      const [_, eTagEventId, eTagRelayUrl, eTagMarker, eTagAuthor] = tag;
	      const eventPointer = {
	        id: eTagEventId,
	        relays: eTagRelayUrl ? [eTagRelayUrl] : [],
	        author: eTagAuthor
	      };
	      if (eTagMarker === "root") {
	        result.root = eventPointer;
	        continue;
	      }
	      if (eTagMarker === "reply") {
	        result.reply = eventPointer;
	        continue;
	      }
	      if (eTagMarker === "mention") {
	        result.mentions.push(eventPointer);
	        continue;
	      }
	      if (!maybeParent) {
	        maybeParent = eventPointer;
	      } else {
	        maybeRoot = eventPointer;
	      }
	      result.mentions.push(eventPointer);
	      continue;
	    }
	    if (tag[0] === "q" && tag[1]) {
	      const [_, eTagEventId, eTagRelayUrl] = tag;
	      result.quotes.push({
	        id: eTagEventId,
	        relays: eTagRelayUrl ? [eTagRelayUrl] : []
	      });
	    }
	    if (tag[0] === "p" && tag[1]) {
	      result.profiles.push({
	        pubkey: tag[1],
	        relays: tag[2] ? [tag[2]] : []
	      });
	      continue;
	    }
	  }
	  if (!result.root) {
	    result.root = maybeRoot || maybeParent || result.reply;
	  }
	  if (!result.reply) {
	    result.reply = maybeParent || result.root;
	  }
	  [result.reply, result.root].forEach((ref) => {
	    if (!ref)
	      return;
	    let idx = result.mentions.indexOf(ref);
	    if (idx !== -1) {
	      result.mentions.splice(idx, 1);
	    }
	    if (ref.author) {
	      let author = result.profiles.find((p) => p.pubkey === ref.author);
	      if (author && author.relays) {
	        if (!ref.relays) {
	          ref.relays = [];
	        }
	        author.relays.forEach((url) => {
	          if (ref.relays?.indexOf(url) === -1)
	            ref.relays.push(url);
	        });
	        author.relays = ref.relays;
	      }
	    }
	  });
	  result.mentions.forEach((ref) => {
	    if (ref.author) {
	      let author = result.profiles.find((p) => p.pubkey === ref.author);
	      if (author && author.relays) {
	        if (!ref.relays) {
	          ref.relays = [];
	        }
	        author.relays.forEach((url) => {
	          if (ref.relays.indexOf(url) === -1)
	            ref.relays.push(url);
	        });
	        author.relays = ref.relays;
	      }
	    }
	  });
	  return result;
	}

	// nip11.ts
	var nip11_exports = {};
	__export(nip11_exports, {
	  fetchRelayInformation: () => fetchRelayInformation$1,
	  useFetchImplementation: () => useFetchImplementation2
	});
	var _fetch2;
	try {
	  _fetch2 = fetch;
	} catch {
	}
	function useFetchImplementation2(fetchImplementation) {
	  _fetch2 = fetchImplementation;
	}
	async function fetchRelayInformation$1(url) {
	  return await (await fetch(url.replace("ws://", "http://").replace("wss://", "https://"), {
	    headers: { Accept: "application/nostr+json" }
	  })).json();
	}

	// nip13.ts
	var nip13_exports = {};
	__export(nip13_exports, {
	  fastEventHash: () => fastEventHash,
	  getPow: () => getPow,
	  minePow: () => minePow
	});
	function getPow(hex) {
	  let count = 0;
	  for (let i2 = 0; i2 < 64; i2 += 8) {
	    const nibble = parseInt(hex.substring(i2, i2 + 8), 16);
	    if (nibble === 0) {
	      count += 32;
	    } else {
	      count += Math.clz32(nibble);
	      break;
	    }
	  }
	  return count;
	}
	function minePow(unsigned, difficulty) {
	  let count = 0;
	  const event = unsigned;
	  const tag = ["nonce", count.toString(), difficulty.toString()];
	  event.tags.push(tag);
	  while (true) {
	    const now2 = Math.floor(new Date().getTime() / 1e3);
	    if (now2 !== event.created_at) {
	      count = 0;
	      event.created_at = now2;
	    }
	    tag[1] = (++count).toString();
	    event.id = fastEventHash(event);
	    if (getPow(event.id) >= difficulty) {
	      break;
	    }
	  }
	  return event;
	}
	function fastEventHash(evt) {
	  return bytesToHex$2(
	    sha256$2(utf8Encoder$1.encode(JSON.stringify([0, evt.pubkey, evt.created_at, evt.kind, evt.tags, evt.content])))
	  );
	}

	// nip17.ts
	var nip17_exports = {};
	__export(nip17_exports, {
	  unwrapEvent: () => unwrapEvent2,
	  unwrapManyEvents: () => unwrapManyEvents2,
	  wrapEvent: () => wrapEvent2,
	  wrapManyEvents: () => wrapManyEvents2
	});

	// nip59.ts
	var nip59_exports = {};
	__export(nip59_exports, {
	  createRumor: () => createRumor,
	  createSeal: () => createSeal,
	  createWrap: () => createWrap,
	  unwrapEvent: () => unwrapEvent,
	  unwrapManyEvents: () => unwrapManyEvents,
	  wrapEvent: () => wrapEvent$1,
	  wrapManyEvents: () => wrapManyEvents
	});

	// nip44.ts
	var nip44_exports = {};
	__export(nip44_exports, {
	  decrypt: () => decrypt2,
	  encrypt: () => encrypt2,
	  getConversationKey: () => getConversationKey,
	  v2: () => v2
	});
	var minPlaintextSize = 1;
	var maxPlaintextSize = 65535;
	function getConversationKey(privkeyA, pubkeyB) {
	  const sharedX = secp256k1$1.getSharedSecret(privkeyA, "02" + pubkeyB).subarray(1, 33);
	  return extract(sha256$2, sharedX, "nip44-v2");
	}
	function getMessageKeys(conversationKey, nonce) {
	  const keys = expand(sha256$2, conversationKey, nonce, 76);
	  return {
	    chacha_key: keys.subarray(0, 32),
	    chacha_nonce: keys.subarray(32, 44),
	    hmac_key: keys.subarray(44, 76)
	  };
	}
	function calcPaddedLen(len) {
	  if (!Number.isSafeInteger(len) || len < 1)
	    throw new Error("expected positive integer");
	  if (len <= 32)
	    return 32;
	  const nextPower = 1 << Math.floor(Math.log2(len - 1)) + 1;
	  const chunk = nextPower <= 256 ? 32 : nextPower / 8;
	  return chunk * (Math.floor((len - 1) / chunk) + 1);
	}
	function writeU16BE(num) {
	  if (!Number.isSafeInteger(num) || num < minPlaintextSize || num > maxPlaintextSize)
	    throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
	  const arr = new Uint8Array(2);
	  new DataView(arr.buffer).setUint16(0, num, false);
	  return arr;
	}
	function pad(plaintext) {
	  const unpadded = utf8Encoder$1.encode(plaintext);
	  const unpaddedLen = unpadded.length;
	  const prefix = writeU16BE(unpaddedLen);
	  const suffix = new Uint8Array(calcPaddedLen(unpaddedLen) - unpaddedLen);
	  return concatBytes$1(prefix, unpadded, suffix);
	}
	function unpad(padded) {
	  const unpaddedLen = new DataView(padded.buffer).getUint16(0);
	  const unpadded = padded.subarray(2, 2 + unpaddedLen);
	  if (unpaddedLen < minPlaintextSize || unpaddedLen > maxPlaintextSize || unpadded.length !== unpaddedLen || padded.length !== 2 + calcPaddedLen(unpaddedLen))
	    throw new Error("invalid padding");
	  return utf8Decoder$1.decode(unpadded);
	}
	function hmacAad(key, message, aad) {
	  if (aad.length !== 32)
	    throw new Error("AAD associated data must be 32 bytes");
	  const combined = concatBytes$1(aad, message);
	  return hmac$1(sha256$2, key, combined);
	}
	function decodePayload(payload) {
	  if (typeof payload !== "string")
	    throw new Error("payload must be a valid string");
	  const plen = payload.length;
	  if (plen < 132 || plen > 87472)
	    throw new Error("invalid payload length: " + plen);
	  if (payload[0] === "#")
	    throw new Error("unknown encryption version");
	  let data;
	  try {
	    data = base64.decode(payload);
	  } catch (error) {
	    throw new Error("invalid base64: " + error.message);
	  }
	  const dlen = data.length;
	  if (dlen < 99 || dlen > 65603)
	    throw new Error("invalid data length: " + dlen);
	  const vers = data[0];
	  if (vers !== 2)
	    throw new Error("unknown encryption version " + vers);
	  return {
	    nonce: data.subarray(1, 33),
	    ciphertext: data.subarray(33, -32),
	    mac: data.subarray(-32)
	  };
	}
	function encrypt2(plaintext, conversationKey, nonce = randomBytes$1(32)) {
	  const { chacha_key, chacha_nonce, hmac_key } = getMessageKeys(conversationKey, nonce);
	  const padded = pad(plaintext);
	  const ciphertext = chacha20(chacha_key, chacha_nonce, padded);
	  const mac = hmacAad(hmac_key, ciphertext, nonce);
	  return base64.encode(concatBytes$1(new Uint8Array([2]), nonce, ciphertext, mac));
	}
	function decrypt2(payload, conversationKey) {
	  const { nonce, ciphertext, mac } = decodePayload(payload);
	  const { chacha_key, chacha_nonce, hmac_key } = getMessageKeys(conversationKey, nonce);
	  const calculatedMac = hmacAad(hmac_key, ciphertext, nonce);
	  if (!equalBytes(calculatedMac, mac))
	    throw new Error("invalid MAC");
	  const padded = chacha20(chacha_key, chacha_nonce, ciphertext);
	  return unpad(padded);
	}
	var v2 = {
	  utils: {
	    getConversationKey,
	    calcPaddedLen
	  },
	  encrypt: encrypt2,
	  decrypt: decrypt2
	};

	// nip59.ts
	var TWO_DAYS = 2 * 24 * 60 * 60;
	var now = () => Math.round(Date.now() / 1e3);
	var randomNow = () => Math.round(now() - Math.random() * TWO_DAYS);
	var nip44ConversationKey = (privateKey, publicKey) => getConversationKey(privateKey, publicKey);
	var nip44Encrypt = (data, privateKey, publicKey) => encrypt2(JSON.stringify(data), nip44ConversationKey(privateKey, publicKey));
	var nip44Decrypt = (data, privateKey) => JSON.parse(decrypt2(data.content, nip44ConversationKey(privateKey, data.pubkey)));
	function createRumor(event, privateKey) {
	  const rumor = {
	    created_at: now(),
	    content: "",
	    tags: [],
	    ...event,
	    pubkey: getPublicKey(privateKey)
	  };
	  rumor.id = getEventHash$1(rumor);
	  return rumor;
	}
	function createSeal(rumor, privateKey, recipientPublicKey) {
	  return finalizeEvent(
	    {
	      kind: Seal,
	      content: nip44Encrypt(rumor, privateKey, recipientPublicKey),
	      created_at: randomNow(),
	      tags: []
	    },
	    privateKey
	  );
	}
	function createWrap(seal, recipientPublicKey) {
	  const randomKey = generateSecretKey();
	  return finalizeEvent(
	    {
	      kind: GiftWrap,
	      content: nip44Encrypt(seal, randomKey, recipientPublicKey),
	      created_at: randomNow(),
	      tags: [["p", recipientPublicKey]]
	    },
	    randomKey
	  );
	}
	function wrapEvent$1(event, senderPrivateKey, recipientPublicKey) {
	  const rumor = createRumor(event, senderPrivateKey);
	  const seal = createSeal(rumor, senderPrivateKey, recipientPublicKey);
	  return createWrap(seal, recipientPublicKey);
	}
	function wrapManyEvents(event, senderPrivateKey, recipientsPublicKeys) {
	  if (!recipientsPublicKeys || recipientsPublicKeys.length === 0) {
	    throw new Error("At least one recipient is required.");
	  }
	  const senderPublicKey = getPublicKey(senderPrivateKey);
	  const wrappeds = [wrapEvent$1(event, senderPrivateKey, senderPublicKey)];
	  recipientsPublicKeys.forEach((recipientPublicKey) => {
	    wrappeds.push(wrapEvent$1(event, senderPrivateKey, recipientPublicKey));
	  });
	  return wrappeds;
	}
	function unwrapEvent(wrap, recipientPrivateKey) {
	  const unwrappedSeal = nip44Decrypt(wrap, recipientPrivateKey);
	  return nip44Decrypt(unwrappedSeal, recipientPrivateKey);
	}
	function unwrapManyEvents(wrappedEvents, recipientPrivateKey) {
	  let unwrappedEvents = [];
	  wrappedEvents.forEach((e) => {
	    unwrappedEvents.push(unwrapEvent(e, recipientPrivateKey));
	  });
	  unwrappedEvents.sort((a, b) => a.created_at - b.created_at);
	  return unwrappedEvents;
	}

	// nip17.ts
	function createEvent(recipients, message, conversationTitle, replyTo) {
	  const baseEvent = {
	    created_at: Math.ceil(Date.now() / 1e3),
	    kind: PrivateDirectMessage,
	    tags: [],
	    content: message
	  };
	  const recipientsArray = Array.isArray(recipients) ? recipients : [recipients];
	  recipientsArray.forEach(({ publicKey, relayUrl }) => {
	    baseEvent.tags.push(relayUrl ? ["p", publicKey, relayUrl] : ["p", publicKey]);
	  });
	  if (replyTo) {
	    baseEvent.tags.push(["e", replyTo.eventId, replyTo.relayUrl || "", "reply"]);
	  }
	  if (conversationTitle) {
	    baseEvent.tags.push(["subject", conversationTitle]);
	  }
	  return baseEvent;
	}
	function wrapEvent2(senderPrivateKey, recipient, message, conversationTitle, replyTo) {
	  const event = createEvent(recipient, message, conversationTitle, replyTo);
	  return wrapEvent$1(event, senderPrivateKey, recipient.publicKey);
	}
	function wrapManyEvents2(senderPrivateKey, recipients, message, conversationTitle, replyTo) {
	  if (!recipients || recipients.length === 0) {
	    throw new Error("At least one recipient is required.");
	  }
	  const senderPublicKey = getPublicKey(senderPrivateKey);
	  return [{ publicKey: senderPublicKey }, ...recipients].map(
	    (recipient) => wrapEvent2(senderPrivateKey, recipient, message, conversationTitle, replyTo)
	  );
	}
	var unwrapEvent2 = unwrapEvent;
	var unwrapManyEvents2 = unwrapManyEvents;

	// nip18.ts
	var nip18_exports = {};
	__export(nip18_exports, {
	  finishRepostEvent: () => finishRepostEvent,
	  getRepostedEvent: () => getRepostedEvent,
	  getRepostedEventPointer: () => getRepostedEventPointer
	});
	function finishRepostEvent(t, reposted, relayUrl, privateKey) {
	  let kind;
	  const tags = [...t.tags ?? [], ["e", reposted.id, relayUrl], ["p", reposted.pubkey]];
	  if (reposted.kind === ShortTextNote) {
	    kind = Repost;
	  } else {
	    kind = GenericRepost;
	    tags.push(["k", String(reposted.kind)]);
	  }
	  return finalizeEvent(
	    {
	      kind,
	      tags,
	      content: t.content === "" || reposted.tags?.find((tag) => tag[0] === "-") ? "" : JSON.stringify(reposted),
	      created_at: t.created_at
	    },
	    privateKey
	  );
	}
	function getRepostedEventPointer(event) {
	  if (![Repost, GenericRepost].includes(event.kind)) {
	    return void 0;
	  }
	  let lastETag;
	  let lastPTag;
	  for (let i2 = event.tags.length - 1; i2 >= 0 && (lastETag === void 0 || lastPTag === void 0); i2--) {
	    const tag = event.tags[i2];
	    if (tag.length >= 2) {
	      if (tag[0] === "e" && lastETag === void 0) {
	        lastETag = tag;
	      } else if (tag[0] === "p" && lastPTag === void 0) {
	        lastPTag = tag;
	      }
	    }
	  }
	  if (lastETag === void 0) {
	    return void 0;
	  }
	  return {
	    id: lastETag[1],
	    relays: [lastETag[2], lastPTag?.[2]].filter((x) => typeof x === "string"),
	    author: lastPTag?.[1]
	  };
	}
	function getRepostedEvent(event, { skipVerification } = {}) {
	  const pointer = getRepostedEventPointer(event);
	  if (pointer === void 0 || event.content === "") {
	    return void 0;
	  }
	  let repostedEvent;
	  try {
	    repostedEvent = JSON.parse(event.content);
	  } catch (error) {
	    return void 0;
	  }
	  if (repostedEvent.id !== pointer.id) {
	    return void 0;
	  }
	  if (!skipVerification && !verifyEvent(repostedEvent)) {
	    return void 0;
	  }
	  return repostedEvent;
	}

	// nip21.ts
	var nip21_exports = {};
	__export(nip21_exports, {
	  NOSTR_URI_REGEX: () => NOSTR_URI_REGEX,
	  parse: () => parse2,
	  test: () => test
	});
	var NOSTR_URI_REGEX = new RegExp(`nostr:(${BECH32_REGEX$2.source})`);
	function test(value) {
	  return typeof value === "string" && new RegExp(`^${NOSTR_URI_REGEX.source}$`).test(value);
	}
	function parse2(uri) {
	  const match = uri.match(new RegExp(`^${NOSTR_URI_REGEX.source}$`));
	  if (!match)
	    throw new Error(`Invalid Nostr URI: ${uri}`);
	  return {
	    uri: match[0],
	    value: match[1],
	    decoded: decode$1(match[1])
	  };
	}

	// nip25.ts
	var nip25_exports = {};
	__export(nip25_exports, {
	  finishReactionEvent: () => finishReactionEvent,
	  getReactedEventPointer: () => getReactedEventPointer
	});
	function finishReactionEvent(t, reacted, privateKey) {
	  const inheritedTags = reacted.tags.filter((tag) => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p"));
	  return finalizeEvent(
	    {
	      ...t,
	      kind: Reaction,
	      tags: [...t.tags ?? [], ...inheritedTags, ["e", reacted.id], ["p", reacted.pubkey]],
	      content: t.content ?? "+"
	    },
	    privateKey
	  );
	}
	function getReactedEventPointer(event) {
	  if (event.kind !== Reaction) {
	    return void 0;
	  }
	  let lastETag;
	  let lastPTag;
	  for (let i2 = event.tags.length - 1; i2 >= 0 && (lastETag === void 0 || lastPTag === void 0); i2--) {
	    const tag = event.tags[i2];
	    if (tag.length >= 2) {
	      if (tag[0] === "e" && lastETag === void 0) {
	        lastETag = tag;
	      } else if (tag[0] === "p" && lastPTag === void 0) {
	        lastPTag = tag;
	      }
	    }
	  }
	  if (lastETag === void 0 || lastPTag === void 0) {
	    return void 0;
	  }
	  return {
	    id: lastETag[1],
	    relays: [lastETag[2], lastPTag[2]].filter((x) => x !== void 0),
	    author: lastPTag[1]
	  };
	}

	// nip27.ts
	var nip27_exports = {};
	__export(nip27_exports, {
	  parse: () => parse3
	});
	var noCharacter = /\W/m;
	var noURLCharacter = /\W |\W$|$|,| /m;
	var MAX_HASHTAG_LENGTH = 42;
	function* parse3(content) {
	  let emojis = [];
	  if (typeof content !== "string") {
	    for (let i2 = 0; i2 < content.tags.length; i2++) {
	      const tag = content.tags[i2];
	      if (tag[0] === "emoji" && tag.length >= 3) {
	        emojis.push({ type: "emoji", shortcode: tag[1], url: tag[2] });
	      }
	    }
	    content = content.content;
	  }
	  const max = content.length;
	  let prevIndex = 0;
	  let index = 0;
	  mainloop:
	    while (index < max) {
	      const u = content.indexOf(":", index);
	      const h = content.indexOf("#", index);
	      if (u === -1 && h === -1) {
	        break mainloop;
	      }
	      if (u === -1 || h >= 0 && h < u) {
	        if (h === 0 || content[h - 1] === " ") {
	          const m = content.slice(h + 1, h + MAX_HASHTAG_LENGTH).match(noCharacter);
	          const end = m ? h + 1 + m.index : max;
	          yield { type: "text", text: content.slice(prevIndex, h) };
	          yield { type: "hashtag", value: content.slice(h + 1, end) };
	          index = end;
	          prevIndex = index;
	          continue mainloop;
	        }
	        index = h + 1;
	        continue mainloop;
	      }
	      if (content.slice(u - 5, u) === "nostr") {
	        const m = content.slice(u + 60).match(noCharacter);
	        const end = m ? u + 60 + m.index : max;
	        try {
	          let pointer;
	          let { data, type } = decode$1(content.slice(u + 1, end));
	          switch (type) {
	            case "npub":
	              pointer = { pubkey: data };
	              break;
	            case "nsec":
	            case "note":
	              index = end + 1;
	              continue;
	            default:
	              pointer = data;
	          }
	          if (prevIndex !== u - 5) {
	            yield { type: "text", text: content.slice(prevIndex, u - 5) };
	          }
	          yield { type: "reference", pointer };
	          index = end;
	          prevIndex = index;
	          continue mainloop;
	        } catch (_err) {
	          index = u + 1;
	          continue mainloop;
	        }
	      } else if (content.slice(u - 5, u) === "https" || content.slice(u - 4, u) === "http") {
	        const m = content.slice(u + 4).match(noURLCharacter);
	        const end = m ? u + 4 + m.index : max;
	        const prefixLen = content[u - 1] === "s" ? 5 : 4;
	        try {
	          let url = new URL(content.slice(u - prefixLen, end));
	          if (url.hostname.indexOf(".") === -1) {
	            throw new Error("invalid url");
	          }
	          if (prevIndex !== u - prefixLen) {
	            yield { type: "text", text: content.slice(prevIndex, u - prefixLen) };
	          }
	          if (/\.(png|jpe?g|gif|webp|heic|svg)$/i.test(url.pathname)) {
	            yield { type: "image", url: url.toString() };
	            index = end;
	            prevIndex = index;
	            continue mainloop;
	          }
	          if (/\.(mp4|avi|webm|mkv|mov)$/i.test(url.pathname)) {
	            yield { type: "video", url: url.toString() };
	            index = end;
	            prevIndex = index;
	            continue mainloop;
	          }
	          if (/\.(mp3|aac|ogg|opus|wav|flac)$/i.test(url.pathname)) {
	            yield { type: "audio", url: url.toString() };
	            index = end;
	            prevIndex = index;
	            continue mainloop;
	          }
	          yield { type: "url", url: url.toString() };
	          index = end;
	          prevIndex = index;
	          continue mainloop;
	        } catch (_err) {
	          index = end + 1;
	          continue mainloop;
	        }
	      } else if (content.slice(u - 3, u) === "wss" || content.slice(u - 2, u) === "ws") {
	        const m = content.slice(u + 4).match(noURLCharacter);
	        const end = m ? u + 4 + m.index : max;
	        const prefixLen = content[u - 1] === "s" ? 3 : 2;
	        try {
	          let url = new URL(content.slice(u - prefixLen, end));
	          if (url.hostname.indexOf(".") === -1) {
	            throw new Error("invalid ws url");
	          }
	          if (prevIndex !== u - prefixLen) {
	            yield { type: "text", text: content.slice(prevIndex, u - prefixLen) };
	          }
	          yield { type: "relay", url: url.toString() };
	          index = end;
	          prevIndex = index;
	          continue mainloop;
	        } catch (_err) {
	          index = end + 1;
	          continue mainloop;
	        }
	      } else {
	        for (let e = 0; e < emojis.length; e++) {
	          const emoji = emojis[e];
	          if (content[u + emoji.shortcode.length + 1] === ":" && content.slice(u + 1, u + emoji.shortcode.length + 1) === emoji.shortcode) {
	            if (prevIndex !== u) {
	              yield { type: "text", text: content.slice(prevIndex, u) };
	            }
	            yield emoji;
	            index = u + emoji.shortcode.length + 2;
	            prevIndex = index;
	            continue mainloop;
	          }
	        }
	        index = u + 1;
	        continue mainloop;
	      }
	    }
	  if (prevIndex !== max) {
	    yield { type: "text", text: content.slice(prevIndex) };
	  }
	}

	// nip28.ts
	var nip28_exports = {};
	__export(nip28_exports, {
	  channelCreateEvent: () => channelCreateEvent,
	  channelHideMessageEvent: () => channelHideMessageEvent,
	  channelMessageEvent: () => channelMessageEvent,
	  channelMetadataEvent: () => channelMetadataEvent,
	  channelMuteUserEvent: () => channelMuteUserEvent
	});
	var channelCreateEvent = (t, privateKey) => {
	  let content;
	  if (typeof t.content === "object") {
	    content = JSON.stringify(t.content);
	  } else if (typeof t.content === "string") {
	    content = t.content;
	  } else {
	    return void 0;
	  }
	  return finalizeEvent(
	    {
	      kind: ChannelCreation,
	      tags: [...t.tags ?? []],
	      content,
	      created_at: t.created_at
	    },
	    privateKey
	  );
	};
	var channelMetadataEvent = (t, privateKey) => {
	  let content;
	  if (typeof t.content === "object") {
	    content = JSON.stringify(t.content);
	  } else if (typeof t.content === "string") {
	    content = t.content;
	  } else {
	    return void 0;
	  }
	  return finalizeEvent(
	    {
	      kind: ChannelMetadata,
	      tags: [["e", t.channel_create_event_id], ...t.tags ?? []],
	      content,
	      created_at: t.created_at
	    },
	    privateKey
	  );
	};
	var channelMessageEvent = (t, privateKey) => {
	  const tags = [["e", t.channel_create_event_id, t.relay_url, "root"]];
	  if (t.reply_to_channel_message_event_id) {
	    tags.push(["e", t.reply_to_channel_message_event_id, t.relay_url, "reply"]);
	  }
	  return finalizeEvent(
	    {
	      kind: ChannelMessage,
	      tags: [...tags, ...t.tags ?? []],
	      content: t.content,
	      created_at: t.created_at
	    },
	    privateKey
	  );
	};
	var channelHideMessageEvent = (t, privateKey) => {
	  let content;
	  if (typeof t.content === "object") {
	    content = JSON.stringify(t.content);
	  } else if (typeof t.content === "string") {
	    content = t.content;
	  } else {
	    return void 0;
	  }
	  return finalizeEvent(
	    {
	      kind: ChannelHideMessage,
	      tags: [["e", t.channel_message_event_id], ...t.tags ?? []],
	      content,
	      created_at: t.created_at
	    },
	    privateKey
	  );
	};
	var channelMuteUserEvent = (t, privateKey) => {
	  let content;
	  if (typeof t.content === "object") {
	    content = JSON.stringify(t.content);
	  } else if (typeof t.content === "string") {
	    content = t.content;
	  } else {
	    return void 0;
	  }
	  return finalizeEvent(
	    {
	      kind: ChannelMuteUser,
	      tags: [["p", t.pubkey_to_mute], ...t.tags ?? []],
	      content,
	      created_at: t.created_at
	    },
	    privateKey
	  );
	};

	// nip30.ts
	var nip30_exports = {};
	__export(nip30_exports, {
	  EMOJI_SHORTCODE_REGEX: () => EMOJI_SHORTCODE_REGEX,
	  matchAll: () => matchAll,
	  regex: () => regex,
	  replaceAll: () => replaceAll
	});
	var EMOJI_SHORTCODE_REGEX = /:(\w+):/;
	var regex = () => new RegExp(`\\B${EMOJI_SHORTCODE_REGEX.source}\\B`, "g");
	function* matchAll(content) {
	  const matches = content.matchAll(regex());
	  for (const match of matches) {
	    try {
	      const [shortcode, name] = match;
	      yield {
	        shortcode,
	        name,
	        start: match.index,
	        end: match.index + shortcode.length
	      };
	    } catch (_e) {
	    }
	  }
	}
	function replaceAll(content, replacer) {
	  return content.replaceAll(regex(), (shortcode, name) => {
	    return replacer({
	      shortcode,
	      name
	    });
	  });
	}

	// nip39.ts
	var nip39_exports = {};
	__export(nip39_exports, {
	  useFetchImplementation: () => useFetchImplementation3,
	  validateGithub: () => validateGithub
	});
	var _fetch3;
	try {
	  _fetch3 = fetch;
	} catch {
	}
	function useFetchImplementation3(fetchImplementation) {
	  _fetch3 = fetchImplementation;
	}
	async function validateGithub(pubkey, username, proof) {
	  try {
	    let res = await (await _fetch3(`https://gist.github.com/${username}/${proof}/raw`)).text();
	    return res === `Verifying that I control the following Nostr public key: ${pubkey}`;
	  } catch (_) {
	    return false;
	  }
	}

	// nip47.ts
	var nip47_exports = {};
	__export(nip47_exports, {
	  makeNwcRequestEvent: () => makeNwcRequestEvent,
	  parseConnectionString: () => parseConnectionString
	});
	function parseConnectionString(connectionString) {
	  const { host, pathname, searchParams } = new URL(connectionString);
	  const pubkey = pathname || host;
	  const relay = searchParams.get("relay");
	  const secret = searchParams.get("secret");
	  if (!pubkey || !relay || !secret) {
	    throw new Error("invalid connection string");
	  }
	  return { pubkey, relay, secret };
	}
	async function makeNwcRequestEvent(pubkey, secretKey, invoice) {
	  const content = {
	    method: "pay_invoice",
	    params: {
	      invoice
	    }
	  };
	  const encryptedContent = encrypt$2(secretKey, pubkey, JSON.stringify(content));
	  const eventTemplate = {
	    kind: NWCWalletRequest,
	    created_at: Math.round(Date.now() / 1e3),
	    content: encryptedContent,
	    tags: [["p", pubkey]]
	  };
	  return finalizeEvent(eventTemplate, secretKey);
	}

	// nip54.ts
	var nip54_exports = {};
	__export(nip54_exports, {
	  normalizeIdentifier: () => normalizeIdentifier
	});
	function normalizeIdentifier(name) {
	  name = name.trim().toLowerCase();
	  name = name.normalize("NFKC");
	  return Array.from(name).map((char) => {
	    if (/\p{Letter}/u.test(char) || /\p{Number}/u.test(char)) {
	      return char;
	    }
	    return "-";
	  }).join("");
	}

	// nip57.ts
	var nip57_exports = {};
	__export(nip57_exports, {
	  getSatoshisAmountFromBolt11: () => getSatoshisAmountFromBolt11,
	  getZapEndpoint: () => getZapEndpoint,
	  makeZapReceipt: () => makeZapReceipt,
	  makeZapRequest: () => makeZapRequest,
	  useFetchImplementation: () => useFetchImplementation4,
	  validateZapRequest: () => validateZapRequest
	});
	var _fetch4;
	try {
	  _fetch4 = fetch;
	} catch {
	}
	function useFetchImplementation4(fetchImplementation) {
	  _fetch4 = fetchImplementation;
	}
	async function getZapEndpoint(metadata) {
	  try {
	    let lnurl = "";
	    let { lud06, lud16 } = JSON.parse(metadata.content);
	    if (lud16) {
	      let [name, domain] = lud16.split("@");
	      lnurl = new URL(`/.well-known/lnurlp/${name}`, `https://${domain}`).toString();
	    } else if (lud06) {
	      let { words } = bech32.decode(lud06, 1e3);
	      let data = bech32.fromWords(words);
	      lnurl = utf8Decoder$1.decode(data);
	    } else {
	      return null;
	    }
	    let res = await _fetch4(lnurl);
	    let body = await res.json();
	    if (body.allowsNostr && body.nostrPubkey) {
	      return body.callback;
	    }
	  } catch (err) {
	  }
	  return null;
	}
	function makeZapRequest(params) {
	  let zr = {
	    kind: 9734,
	    created_at: Math.round(Date.now() / 1e3),
	    content: params.comment || "",
	    tags: [
	      ["p", "pubkey" in params ? params.pubkey : params.event.pubkey],
	      ["amount", params.amount.toString()],
	      ["relays", ...params.relays]
	    ]
	  };
	  if ("event" in params) {
	    zr.tags.push(["e", params.event.id]);
	    if (isReplaceableKind(params.event.kind)) {
	      const a = ["a", `${params.event.kind}:${params.event.pubkey}:`];
	      zr.tags.push(a);
	    } else if (isAddressableKind(params.event.kind)) {
	      let d = params.event.tags.find(([t, v]) => t === "d" && v);
	      if (!d)
	        throw new Error("d tag not found or is empty");
	      const a = ["a", `${params.event.kind}:${params.event.pubkey}:${d[1]}`];
	      zr.tags.push(a);
	    }
	    zr.tags.push(["k", params.event.kind.toString()]);
	  }
	  return zr;
	}
	function validateZapRequest(zapRequestString) {
	  let zapRequest;
	  try {
	    zapRequest = JSON.parse(zapRequestString);
	  } catch (err) {
	    return "Invalid zap request JSON.";
	  }
	  if (!validateEvent(zapRequest))
	    return "Zap request is not a valid Nostr event.";
	  if (!verifyEvent(zapRequest))
	    return "Invalid signature on zap request.";
	  let p = zapRequest.tags.find(([t, v]) => t === "p" && v);
	  if (!p)
	    return "Zap request doesn't have a 'p' tag.";
	  if (!p[1].match(/^[a-f0-9]{64}$/))
	    return "Zap request 'p' tag is not valid hex.";
	  let e = zapRequest.tags.find(([t, v]) => t === "e" && v);
	  if (e && !e[1].match(/^[a-f0-9]{64}$/))
	    return "Zap request 'e' tag is not valid hex.";
	  let relays = zapRequest.tags.find(([t, v]) => t === "relays" && v);
	  if (!relays)
	    return "Zap request doesn't have a 'relays' tag.";
	  return null;
	}
	function makeZapReceipt({
	  zapRequest,
	  preimage,
	  bolt11,
	  paidAt
	}) {
	  let zr = JSON.parse(zapRequest);
	  let tagsFromZapRequest = zr.tags.filter(([t]) => t === "e" || t === "p" || t === "a");
	  let zap = {
	    kind: 9735,
	    created_at: Math.round(paidAt.getTime() / 1e3),
	    content: "",
	    tags: [...tagsFromZapRequest, ["P", zr.pubkey], ["bolt11", bolt11], ["description", zapRequest]]
	  };
	  if (preimage) {
	    zap.tags.push(["preimage", preimage]);
	  }
	  return zap;
	}
	function getSatoshisAmountFromBolt11(bolt11) {
	  if (bolt11.length < 50) {
	    return 0;
	  }
	  bolt11 = bolt11.substring(0, 50);
	  const idx = bolt11.lastIndexOf("1");
	  if (idx === -1) {
	    return 0;
	  }
	  const hrp = bolt11.substring(0, idx);
	  if (!hrp.startsWith("lnbc")) {
	    return 0;
	  }
	  const amount = hrp.substring(4);
	  if (amount.length < 1) {
	    return 0;
	  }
	  const char = amount[amount.length - 1];
	  const digit = char.charCodeAt(0) - "0".charCodeAt(0);
	  const isDigit = digit >= 0 && digit <= 9;
	  let cutPoint = amount.length - 1;
	  if (isDigit) {
	    cutPoint++;
	  }
	  if (cutPoint < 1) {
	    return 0;
	  }
	  const num = parseInt(amount.substring(0, cutPoint));
	  switch (char) {
	    case "m":
	      return num * 1e5;
	    case "u":
	      return num * 100;
	    case "n":
	      return num / 10;
	    case "p":
	      return num / 1e4;
	    default:
	      return num * 1e8;
	  }
	}

	// nip77.ts
	var nip77_exports = {};
	__export(nip77_exports, {
	  Negentropy: () => Negentropy,
	  NegentropyStorageVector: () => NegentropyStorageVector,
	  NegentropySync: () => NegentropySync
	});
	var PROTOCOL_VERSION = 97;
	var ID_SIZE = 32;
	var FINGERPRINT_SIZE = 16;
	var Mode = {
	  Skip: 0,
	  Fingerprint: 1,
	  IdList: 2
	};
	var WrappedBuffer = class {
	  _raw;
	  length;
	  constructor(buffer) {
	    if (typeof buffer === "number") {
	      this._raw = new Uint8Array(buffer);
	      this.length = 0;
	    } else if (buffer instanceof Uint8Array) {
	      this._raw = new Uint8Array(buffer);
	      this.length = buffer.length;
	    } else {
	      this._raw = new Uint8Array(512);
	      this.length = 0;
	    }
	  }
	  unwrap() {
	    return this._raw.subarray(0, this.length);
	  }
	  get capacity() {
	    return this._raw.byteLength;
	  }
	  extend(buf) {
	    if (buf instanceof WrappedBuffer)
	      buf = buf.unwrap();
	    if (typeof buf.length !== "number")
	      throw Error("bad length");
	    const targetSize = buf.length + this.length;
	    if (this.capacity < targetSize) {
	      const oldRaw = this._raw;
	      const newCapacity = Math.max(this.capacity * 2, targetSize);
	      this._raw = new Uint8Array(newCapacity);
	      this._raw.set(oldRaw);
	    }
	    this._raw.set(buf, this.length);
	    this.length += buf.length;
	  }
	  shift() {
	    const first = this._raw[0];
	    this._raw = this._raw.subarray(1);
	    this.length--;
	    return first;
	  }
	  shiftN(n = 1) {
	    const firstSubarray = this._raw.subarray(0, n);
	    this._raw = this._raw.subarray(n);
	    this.length -= n;
	    return firstSubarray;
	  }
	};
	function decodeVarInt(buf) {
	  let res = 0;
	  while (1) {
	    if (buf.length === 0)
	      throw Error("parse ends prematurely");
	    let byte = buf.shift();
	    res = res << 7 | byte & 127;
	    if ((byte & 128) === 0)
	      break;
	  }
	  return res;
	}
	function encodeVarInt(n) {
	  if (n === 0)
	    return new WrappedBuffer(new Uint8Array([0]));
	  let o = [];
	  while (n !== 0) {
	    o.push(n & 127);
	    n >>>= 7;
	  }
	  o.reverse();
	  for (let i2 = 0; i2 < o.length - 1; i2++)
	    o[i2] |= 128;
	  return new WrappedBuffer(new Uint8Array(o));
	}
	function getByte(buf) {
	  return getBytes(buf, 1)[0];
	}
	function getBytes(buf, n) {
	  if (buf.length < n)
	    throw Error("parse ends prematurely");
	  return buf.shiftN(n);
	}
	var Accumulator = class {
	  buf;
	  constructor() {
	    this.setToZero();
	  }
	  setToZero() {
	    this.buf = new Uint8Array(ID_SIZE);
	  }
	  add(otherBuf) {
	    let currCarry = 0, nextCarry = 0;
	    let p = new DataView(this.buf.buffer);
	    let po = new DataView(otherBuf.buffer);
	    for (let i2 = 0; i2 < 8; i2++) {
	      let offset = i2 * 4;
	      let orig = p.getUint32(offset, true);
	      let otherV = po.getUint32(offset, true);
	      let next = orig;
	      next += currCarry;
	      next += otherV;
	      if (next > 4294967295)
	        nextCarry = 1;
	      p.setUint32(offset, next & 4294967295, true);
	      currCarry = nextCarry;
	      nextCarry = 0;
	    }
	  }
	  negate() {
	    let p = new DataView(this.buf.buffer);
	    for (let i2 = 0; i2 < 8; i2++) {
	      let offset = i2 * 4;
	      p.setUint32(offset, ~p.getUint32(offset, true));
	    }
	    let one = new Uint8Array(ID_SIZE);
	    one[0] = 1;
	    this.add(one);
	  }
	  getFingerprint(n) {
	    let input = new WrappedBuffer();
	    input.extend(this.buf);
	    input.extend(encodeVarInt(n));
	    let hash = sha256$2(input.unwrap());
	    return hash.subarray(0, FINGERPRINT_SIZE);
	  }
	};
	var NegentropyStorageVector = class {
	  items;
	  sealed;
	  constructor() {
	    this.items = [];
	    this.sealed = false;
	  }
	  insert(timestamp, id) {
	    if (this.sealed)
	      throw Error("already sealed");
	    const idb = hexToBytes$1(id);
	    if (idb.byteLength !== ID_SIZE)
	      throw Error("bad id size for added item");
	    this.items.push({ timestamp, id: idb });
	  }
	  seal() {
	    if (this.sealed)
	      throw Error("already sealed");
	    this.sealed = true;
	    this.items.sort(itemCompare);
	    for (let i2 = 1; i2 < this.items.length; i2++) {
	      if (itemCompare(this.items[i2 - 1], this.items[i2]) === 0)
	        throw Error("duplicate item inserted");
	    }
	  }
	  unseal() {
	    this.sealed = false;
	  }
	  size() {
	    this._checkSealed();
	    return this.items.length;
	  }
	  getItem(i2) {
	    this._checkSealed();
	    if (i2 >= this.items.length)
	      throw Error("out of range");
	    return this.items[i2];
	  }
	  iterate(begin, end, cb) {
	    this._checkSealed();
	    this._checkBounds(begin, end);
	    for (let i2 = begin; i2 < end; ++i2) {
	      if (!cb(this.items[i2], i2))
	        break;
	    }
	  }
	  findLowerBound(begin, end, bound) {
	    this._checkSealed();
	    this._checkBounds(begin, end);
	    return this._binarySearch(this.items, begin, end, (a) => itemCompare(a, bound) < 0);
	  }
	  fingerprint(begin, end) {
	    let out = new Accumulator();
	    out.setToZero();
	    this.iterate(begin, end, (item) => {
	      out.add(item.id);
	      return true;
	    });
	    return out.getFingerprint(end - begin);
	  }
	  _checkSealed() {
	    if (!this.sealed)
	      throw Error("not sealed");
	  }
	  _checkBounds(begin, end) {
	    if (begin > end || end > this.items.length)
	      throw Error("bad range");
	  }
	  _binarySearch(arr, first, last, cmp) {
	    let count = last - first;
	    while (count > 0) {
	      let it = first;
	      let step = Math.floor(count / 2);
	      it += step;
	      if (cmp(arr[it])) {
	        first = ++it;
	        count -= step + 1;
	      } else {
	        count = step;
	      }
	    }
	    return first;
	  }
	};
	var Negentropy = class {
	  storage;
	  frameSizeLimit;
	  lastTimestampIn;
	  lastTimestampOut;
	  constructor(storage, frameSizeLimit = 6e4) {
	    if (frameSizeLimit < 4096)
	      throw Error("frameSizeLimit too small");
	    this.storage = storage;
	    this.frameSizeLimit = frameSizeLimit;
	    this.lastTimestampIn = 0;
	    this.lastTimestampOut = 0;
	  }
	  _bound(timestamp, id) {
	    return { timestamp, id: id || new Uint8Array(0) };
	  }
	  initiate() {
	    let output = new WrappedBuffer();
	    output.extend(new Uint8Array([PROTOCOL_VERSION]));
	    this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), output);
	    return bytesToHex$1(output.unwrap());
	  }
	  reconcile(queryMsg, onhave, onneed) {
	    const query = new WrappedBuffer(hexToBytes$1(queryMsg));
	    this.lastTimestampIn = this.lastTimestampOut = 0;
	    let fullOutput = new WrappedBuffer();
	    fullOutput.extend(new Uint8Array([PROTOCOL_VERSION]));
	    let protocolVersion = getByte(query);
	    if (protocolVersion < 96 || protocolVersion > 111)
	      throw Error("invalid negentropy protocol version byte");
	    if (protocolVersion !== PROTOCOL_VERSION) {
	      throw Error("unsupported negentropy protocol version requested: " + (protocolVersion - 96));
	    }
	    let storageSize = this.storage.size();
	    let prevBound = this._bound(0);
	    let prevIndex = 0;
	    let skip = false;
	    while (query.length !== 0) {
	      let o = new WrappedBuffer();
	      let doSkip = () => {
	        if (skip) {
	          skip = false;
	          o.extend(this.encodeBound(prevBound));
	          o.extend(encodeVarInt(Mode.Skip));
	        }
	      };
	      let currBound = this.decodeBound(query);
	      let mode = decodeVarInt(query);
	      let lower = prevIndex;
	      let upper = this.storage.findLowerBound(prevIndex, storageSize, currBound);
	      if (mode === Mode.Skip) {
	        skip = true;
	      } else if (mode === Mode.Fingerprint) {
	        let theirFingerprint = getBytes(query, FINGERPRINT_SIZE);
	        let ourFingerprint = this.storage.fingerprint(lower, upper);
	        if (compareUint8Array(theirFingerprint, ourFingerprint) !== 0) {
	          doSkip();
	          this.splitRange(lower, upper, currBound, o);
	        } else {
	          skip = true;
	        }
	      } else if (mode === Mode.IdList) {
	        let numIds = decodeVarInt(query);
	        let theirElems = {};
	        for (let i2 = 0; i2 < numIds; i2++) {
	          let e = getBytes(query, ID_SIZE);
	          theirElems[bytesToHex$1(e)] = e;
	        }
	        skip = true;
	        this.storage.iterate(lower, upper, (item) => {
	          let k = item.id;
	          const id = bytesToHex$1(k);
	          if (!theirElems[id]) {
	            onhave?.(id);
	          } else {
	            delete theirElems[bytesToHex$1(k)];
	          }
	          return true;
	        });
	        if (onneed) {
	          for (let v of Object.values(theirElems)) {
	            onneed(bytesToHex$1(v));
	          }
	        }
	      } else {
	        throw Error("unexpected mode");
	      }
	      if (this.exceededFrameSizeLimit(fullOutput.length + o.length)) {
	        let remainingFingerprint = this.storage.fingerprint(upper, storageSize);
	        fullOutput.extend(this.encodeBound(this._bound(Number.MAX_VALUE)));
	        fullOutput.extend(encodeVarInt(Mode.Fingerprint));
	        fullOutput.extend(remainingFingerprint);
	        break;
	      } else {
	        fullOutput.extend(o);
	      }
	      prevIndex = upper;
	      prevBound = currBound;
	    }
	    return fullOutput.length === 1 ? null : bytesToHex$1(fullOutput.unwrap());
	  }
	  splitRange(lower, upper, upperBound, o) {
	    let numElems = upper - lower;
	    let buckets = 16;
	    if (numElems < buckets * 2) {
	      o.extend(this.encodeBound(upperBound));
	      o.extend(encodeVarInt(Mode.IdList));
	      o.extend(encodeVarInt(numElems));
	      this.storage.iterate(lower, upper, (item) => {
	        o.extend(item.id);
	        return true;
	      });
	    } else {
	      let itemsPerBucket = Math.floor(numElems / buckets);
	      let bucketsWithExtra = numElems % buckets;
	      let curr = lower;
	      for (let i2 = 0; i2 < buckets; i2++) {
	        let bucketSize = itemsPerBucket + (i2 < bucketsWithExtra ? 1 : 0);
	        let ourFingerprint = this.storage.fingerprint(curr, curr + bucketSize);
	        curr += bucketSize;
	        let nextBound;
	        if (curr === upper) {
	          nextBound = upperBound;
	        } else {
	          let prevItem;
	          let currItem;
	          this.storage.iterate(curr - 1, curr + 1, (item, index) => {
	            if (index === curr - 1)
	              prevItem = item;
	            else
	              currItem = item;
	            return true;
	          });
	          nextBound = this.getMinimalBound(prevItem, currItem);
	        }
	        o.extend(this.encodeBound(nextBound));
	        o.extend(encodeVarInt(Mode.Fingerprint));
	        o.extend(ourFingerprint);
	      }
	    }
	  }
	  exceededFrameSizeLimit(n) {
	    return n > this.frameSizeLimit - 200;
	  }
	  decodeTimestampIn(encoded) {
	    let timestamp = decodeVarInt(encoded);
	    timestamp = timestamp === 0 ? Number.MAX_VALUE : timestamp - 1;
	    if (this.lastTimestampIn === Number.MAX_VALUE || timestamp === Number.MAX_VALUE) {
	      this.lastTimestampIn = Number.MAX_VALUE;
	      return Number.MAX_VALUE;
	    }
	    timestamp += this.lastTimestampIn;
	    this.lastTimestampIn = timestamp;
	    return timestamp;
	  }
	  decodeBound(encoded) {
	    let timestamp = this.decodeTimestampIn(encoded);
	    let len = decodeVarInt(encoded);
	    if (len > ID_SIZE)
	      throw Error("bound key too long");
	    let id = getBytes(encoded, len);
	    return { timestamp, id };
	  }
	  encodeTimestampOut(timestamp) {
	    if (timestamp === Number.MAX_VALUE) {
	      this.lastTimestampOut = Number.MAX_VALUE;
	      return encodeVarInt(0);
	    }
	    let temp = timestamp;
	    timestamp -= this.lastTimestampOut;
	    this.lastTimestampOut = temp;
	    return encodeVarInt(timestamp + 1);
	  }
	  encodeBound(key) {
	    let output = new WrappedBuffer();
	    output.extend(this.encodeTimestampOut(key.timestamp));
	    output.extend(encodeVarInt(key.id.length));
	    output.extend(key.id);
	    return output;
	  }
	  getMinimalBound(prev, curr) {
	    if (curr.timestamp !== prev.timestamp) {
	      return this._bound(curr.timestamp);
	    } else {
	      let sharedPrefixBytes = 0;
	      let currKey = curr.id;
	      let prevKey = prev.id;
	      for (let i2 = 0; i2 < ID_SIZE; i2++) {
	        if (currKey[i2] !== prevKey[i2])
	          break;
	        sharedPrefixBytes++;
	      }
	      return this._bound(curr.timestamp, curr.id.subarray(0, sharedPrefixBytes + 1));
	    }
	  }
	};
	function compareUint8Array(a, b) {
	  for (let i2 = 0; i2 < a.byteLength; i2++) {
	    if (a[i2] < b[i2])
	      return -1;
	    if (a[i2] > b[i2])
	      return 1;
	  }
	  if (a.byteLength > b.byteLength)
	    return 1;
	  if (a.byteLength < b.byteLength)
	    return -1;
	  return 0;
	}
	function itemCompare(a, b) {
	  if (a.timestamp === b.timestamp) {
	    return compareUint8Array(a.id, b.id);
	  }
	  return a.timestamp - b.timestamp;
	}
	var NegentropySync = class {
	  relay;
	  storage;
	  neg;
	  filter;
	  subscription;
	  onhave;
	  onneed;
	  constructor(relay, storage, filter, params = {}) {
	    this.relay = relay;
	    this.storage = storage;
	    this.neg = new Negentropy(storage);
	    this.onhave = params.onhave;
	    this.onneed = params.onneed;
	    this.filter = filter;
	    this.subscription = this.relay.prepareSubscription([{}], { label: params.label || "negentropy" });
	    this.subscription.oncustom = (data) => {
	      switch (data[0]) {
	        case "NEG-MSG": {
	          if (data.length < 3) {
	            console.warn(`got invalid NEG-MSG from ${this.relay.url}: ${data}`);
	          }
	          try {
	            const response = this.neg.reconcile(data[2], this.onhave, this.onneed);
	            if (response) {
	              this.relay.send(`["NEG-MSG", "${this.subscription.id}", "${response}"]`);
	            } else {
	              this.close();
	              params.onclose?.();
	            }
	          } catch (error) {
	            console.error("negentropy reconcile error:", error);
	            params?.onclose?.(`reconcile error: ${error}`);
	          }
	          break;
	        }
	        case "NEG-CLOSE": {
	          const reason = data[2];
	          console.warn("negentropy error:", reason);
	          params.onclose?.(reason);
	          break;
	        }
	        case "NEG-ERR": {
	          params.onclose?.();
	        }
	      }
	    };
	  }
	  async start() {
	    const initMsg = this.neg.initiate();
	    this.relay.send(`["NEG-OPEN","${this.subscription.id}",${JSON.stringify(this.filter)},"${initMsg}"]`);
	  }
	  close() {
	    this.relay.send(`["NEG-CLOSE","${this.subscription.id}"]`);
	    this.subscription.close();
	  }
	};

	// nip98.ts
	var nip98_exports = {};
	__export(nip98_exports, {
	  getToken: () => getToken,
	  hashPayload: () => hashPayload,
	  unpackEventFromToken: () => unpackEventFromToken,
	  validateEvent: () => validateEvent2,
	  validateEventKind: () => validateEventKind,
	  validateEventMethodTag: () => validateEventMethodTag,
	  validateEventPayloadTag: () => validateEventPayloadTag,
	  validateEventTimestamp: () => validateEventTimestamp,
	  validateEventUrlTag: () => validateEventUrlTag,
	  validateToken: () => validateToken
	});
	var _authorizationScheme = "Nostr ";
	async function getToken(loginUrl, httpMethod, sign, includeAuthorizationScheme = false, payload) {
	  const event = {
	    kind: HTTPAuth,
	    tags: [
	      ["u", loginUrl],
	      ["method", httpMethod]
	    ],
	    created_at: Math.round(new Date().getTime() / 1e3),
	    content: ""
	  };
	  if (payload) {
	    event.tags.push(["payload", hashPayload(payload)]);
	  }
	  const signedEvent = await sign(event);
	  const authorizationScheme = includeAuthorizationScheme ? _authorizationScheme : "";
	  return authorizationScheme + base64.encode(utf8Encoder$1.encode(JSON.stringify(signedEvent)));
	}
	async function validateToken(token, url, method) {
	  const event = await unpackEventFromToken(token).catch((error) => {
	    throw error;
	  });
	  const valid = await validateEvent2(event, url, method).catch((error) => {
	    throw error;
	  });
	  return valid;
	}
	async function unpackEventFromToken(token) {
	  if (!token) {
	    throw new Error("Missing token");
	  }
	  token = token.replace(_authorizationScheme, "");
	  const eventB64 = utf8Decoder$1.decode(base64.decode(token));
	  if (!eventB64 || eventB64.length === 0 || !eventB64.startsWith("{")) {
	    throw new Error("Invalid token");
	  }
	  const event = JSON.parse(eventB64);
	  return event;
	}
	function validateEventTimestamp(event) {
	  if (!event.created_at) {
	    return false;
	  }
	  return Math.round(new Date().getTime() / 1e3) - event.created_at < 60;
	}
	function validateEventKind(event) {
	  return event.kind === HTTPAuth;
	}
	function validateEventUrlTag(event, url) {
	  const urlTag = event.tags.find((t) => t[0] === "u");
	  if (!urlTag) {
	    return false;
	  }
	  return urlTag.length > 0 && urlTag[1] === url;
	}
	function validateEventMethodTag(event, method) {
	  const methodTag = event.tags.find((t) => t[0] === "method");
	  if (!methodTag) {
	    return false;
	  }
	  return methodTag.length > 0 && methodTag[1].toLowerCase() === method.toLowerCase();
	}
	function hashPayload(payload) {
	  const hash = sha256$2(utf8Encoder$1.encode(JSON.stringify(payload)));
	  return bytesToHex$2(hash);
	}
	function validateEventPayloadTag(event, payload) {
	  const payloadTag = event.tags.find((t) => t[0] === "payload");
	  if (!payloadTag) {
	    return false;
	  }
	  const payloadHash = hashPayload(payload);
	  return payloadTag.length > 0 && payloadTag[1] === payloadHash;
	}
	async function validateEvent2(event, url, method, body) {
	  if (!verifyEvent(event)) {
	    throw new Error("Invalid nostr event, signature invalid");
	  }
	  if (!validateEventKind(event)) {
	    throw new Error("Invalid nostr event, kind invalid");
	  }
	  if (!validateEventTimestamp(event)) {
	    throw new Error("Invalid nostr event, created_at timestamp invalid");
	  }
	  if (!validateEventUrlTag(event, url)) {
	    throw new Error("Invalid nostr event, url tag invalid");
	  }
	  if (!validateEventMethodTag(event, method)) {
	    throw new Error("Invalid nostr event, method tag invalid");
	  }
	  if (Boolean(body) && typeof body === "object" && Object.keys(body).length > 0) {
	    if (!validateEventPayloadTag(event, body)) {
	      throw new Error("Invalid nostr event, payload tag does not match request body hash");
	    }
	  }
	  return true;
	}

	const crypto = typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;

	/**
	 * Utilities for hex, bytes, CSPRNG.
	 * @module
	 */
	/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
	// node.js versions earlier than v19 don't declare it in global scope.
	// For node.js, package.json#exports field mapping rewrites import
	// from `crypto` to `cryptoNode`, which imports native module.
	// Makes the utils un-importable in browsers without a bundler.
	// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
	/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
	function isBytes(a) {
	    return a instanceof Uint8Array || (ArrayBuffer.isView(a) && a.constructor.name === 'Uint8Array');
	}
	/** Asserts something is positive integer. */
	function anumber(n) {
	    if (!Number.isSafeInteger(n) || n < 0)
	        throw new Error('positive integer expected, got ' + n);
	}
	/** Asserts something is Uint8Array. */
	function abytes(b, ...lengths) {
	    if (!isBytes(b))
	        throw new Error('Uint8Array expected');
	    if (lengths.length > 0 && !lengths.includes(b.length))
	        throw new Error('Uint8Array expected of length ' + lengths + ', got length=' + b.length);
	}
	/** Asserts something is hash */
	function ahash(h) {
	    if (typeof h !== 'function' || typeof h.create !== 'function')
	        throw new Error('Hash should be wrapped by utils.createHasher');
	    anumber(h.outputLen);
	    anumber(h.blockLen);
	}
	/** Asserts a hash instance has not been destroyed / finished */
	function aexists(instance, checkFinished = true) {
	    if (instance.destroyed)
	        throw new Error('Hash instance has been destroyed');
	    if (checkFinished && instance.finished)
	        throw new Error('Hash#digest() has already been called');
	}
	/** Asserts output is properly-sized byte array */
	function aoutput(out, instance) {
	    abytes(out);
	    const min = instance.outputLen;
	    if (out.length < min) {
	        throw new Error('digestInto() expects output buffer of length at least ' + min);
	    }
	}
	/** Zeroize a byte array. Warning: JS provides no guarantees. */
	function clean(...arrays) {
	    for (let i = 0; i < arrays.length; i++) {
	        arrays[i].fill(0);
	    }
	}
	/** Create DataView of an array for easy byte-level manipulation. */
	function createView(arr) {
	    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
	}
	/** The rotate right (circular right shift) operation for uint32 */
	function rotr(word, shift) {
	    return (word << (32 - shift)) | (word >>> shift);
	}
	// Built-in hex conversion https://caniuse.com/mdn-javascript_builtins_uint8array_fromhex
	const hasHexBuiltin = /* @__PURE__ */ (() => 
	// @ts-ignore
	typeof Uint8Array.from([]).toHex === 'function' && typeof Uint8Array.fromHex === 'function')();
	// Array where index 0xf0 (240) is mapped to string 'f0'
	const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));
	/**
	 * Convert byte array to hex string. Uses built-in function, when available.
	 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
	 */
	function bytesToHex(bytes) {
	    abytes(bytes);
	    // @ts-ignore
	    if (hasHexBuiltin)
	        return bytes.toHex();
	    // pre-caching improves the speed 6x
	    let hex = '';
	    for (let i = 0; i < bytes.length; i++) {
	        hex += hexes[bytes[i]];
	    }
	    return hex;
	}
	// We use optimized technique to convert hex string to byte array
	const asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
	function asciiToBase16(ch) {
	    if (ch >= asciis._0 && ch <= asciis._9)
	        return ch - asciis._0; // '2' => 50-48
	    if (ch >= asciis.A && ch <= asciis.F)
	        return ch - (asciis.A - 10); // 'B' => 66-(65-10)
	    if (ch >= asciis.a && ch <= asciis.f)
	        return ch - (asciis.a - 10); // 'b' => 98-(97-10)
	    return;
	}
	/**
	 * Convert hex string to byte array. Uses built-in function, when available.
	 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
	 */
	function hexToBytes(hex) {
	    if (typeof hex !== 'string')
	        throw new Error('hex string expected, got ' + typeof hex);
	    // @ts-ignore
	    if (hasHexBuiltin)
	        return Uint8Array.fromHex(hex);
	    const hl = hex.length;
	    const al = hl / 2;
	    if (hl % 2)
	        throw new Error('hex string expected, got unpadded hex of length ' + hl);
	    const array = new Uint8Array(al);
	    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
	        const n1 = asciiToBase16(hex.charCodeAt(hi));
	        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
	        if (n1 === undefined || n2 === undefined) {
	            const char = hex[hi] + hex[hi + 1];
	            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
	        }
	        array[ai] = n1 * 16 + n2; // multiply first octet, e.g. 'a3' => 10*16+3 => 160 + 3 => 163
	    }
	    return array;
	}
	/**
	 * Converts string to bytes using UTF8 encoding.
	 * @example utf8ToBytes('abc') // Uint8Array.from([97, 98, 99])
	 */
	function utf8ToBytes(str) {
	    if (typeof str !== 'string')
	        throw new Error('string expected');
	    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
	}
	/**
	 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
	 * Warning: when Uint8Array is passed, it would NOT get copied.
	 * Keep in mind for future mutable operations.
	 */
	function toBytes(data) {
	    if (typeof data === 'string')
	        data = utf8ToBytes(data);
	    abytes(data);
	    return data;
	}
	/** Copies several Uint8Arrays into one. */
	function concatBytes(...arrays) {
	    let sum = 0;
	    for (let i = 0; i < arrays.length; i++) {
	        const a = arrays[i];
	        abytes(a);
	        sum += a.length;
	    }
	    const res = new Uint8Array(sum);
	    for (let i = 0, pad = 0; i < arrays.length; i++) {
	        const a = arrays[i];
	        res.set(a, pad);
	        pad += a.length;
	    }
	    return res;
	}
	/** For runtime check if class implements interface */
	class Hash {
	}
	/** Wraps hash function, creating an interface on top of it */
	function createHasher(hashCons) {
	    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
	    const tmp = hashCons();
	    hashC.outputLen = tmp.outputLen;
	    hashC.blockLen = tmp.blockLen;
	    hashC.create = () => hashCons();
	    return hashC;
	}
	/** Cryptographically secure PRNG. Uses internal OS-level `crypto.getRandomValues`. */
	function randomBytes(bytesLength = 32) {
	    if (crypto && typeof crypto.getRandomValues === 'function') {
	        return crypto.getRandomValues(new Uint8Array(bytesLength));
	    }
	    // Legacy Node.js compatibility
	    if (crypto && typeof crypto.randomBytes === 'function') {
	        return Uint8Array.from(crypto.randomBytes(bytesLength));
	    }
	    throw new Error('crypto.getRandomValues must be defined');
	}

	/**
	 * Internal Merkle-Damgard hash utils.
	 * @module
	 */
	/** Polyfill for Safari 14. https://caniuse.com/mdn-javascript_builtins_dataview_setbiguint64 */
	function setBigUint64(view, byteOffset, value, isLE) {
	    if (typeof view.setBigUint64 === 'function')
	        return view.setBigUint64(byteOffset, value, isLE);
	    const _32n = BigInt(32);
	    const _u32_max = BigInt(0xffffffff);
	    const wh = Number((value >> _32n) & _u32_max);
	    const wl = Number(value & _u32_max);
	    const h = isLE ? 4 : 0;
	    const l = isLE ? 0 : 4;
	    view.setUint32(byteOffset + h, wh, isLE);
	    view.setUint32(byteOffset + l, wl, isLE);
	}
	/** Choice: a ? b : c */
	function Chi(a, b, c) {
	    return (a & b) ^ (~a & c);
	}
	/** Majority function, true if any two inputs is true. */
	function Maj(a, b, c) {
	    return (a & b) ^ (a & c) ^ (b & c);
	}
	/**
	 * Merkle-Damgard hash construction base class.
	 * Could be used to create MD5, RIPEMD, SHA1, SHA2.
	 */
	class HashMD extends Hash {
	    constructor(blockLen, outputLen, padOffset, isLE) {
	        super();
	        this.finished = false;
	        this.length = 0;
	        this.pos = 0;
	        this.destroyed = false;
	        this.blockLen = blockLen;
	        this.outputLen = outputLen;
	        this.padOffset = padOffset;
	        this.isLE = isLE;
	        this.buffer = new Uint8Array(blockLen);
	        this.view = createView(this.buffer);
	    }
	    update(data) {
	        aexists(this);
	        data = toBytes(data);
	        abytes(data);
	        const { view, buffer, blockLen } = this;
	        const len = data.length;
	        for (let pos = 0; pos < len;) {
	            const take = Math.min(blockLen - this.pos, len - pos);
	            // Fast path: we have at least one block in input, cast it to view and process
	            if (take === blockLen) {
	                const dataView = createView(data);
	                for (; blockLen <= len - pos; pos += blockLen)
	                    this.process(dataView, pos);
	                continue;
	            }
	            buffer.set(data.subarray(pos, pos + take), this.pos);
	            this.pos += take;
	            pos += take;
	            if (this.pos === blockLen) {
	                this.process(view, 0);
	                this.pos = 0;
	            }
	        }
	        this.length += data.length;
	        this.roundClean();
	        return this;
	    }
	    digestInto(out) {
	        aexists(this);
	        aoutput(out, this);
	        this.finished = true;
	        // Padding
	        // We can avoid allocation of buffer for padding completely if it
	        // was previously not allocated here. But it won't change performance.
	        const { buffer, view, blockLen, isLE } = this;
	        let { pos } = this;
	        // append the bit '1' to the message
	        buffer[pos++] = 128;
	        clean(this.buffer.subarray(pos));
	        // we have less than padOffset left in buffer, so we cannot put length in
	        // current block, need process it and pad again
	        if (this.padOffset > blockLen - pos) {
	            this.process(view, 0);
	            pos = 0;
	        }
	        // Pad until full block byte with zeros
	        for (let i = pos; i < blockLen; i++)
	            buffer[i] = 0;
	        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
	        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
	        // So we just write lowest 64 bits of that value.
	        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
	        this.process(view, 0);
	        const oview = createView(out);
	        const len = this.outputLen;
	        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
	        if (len % 4)
	            throw new Error('_sha2: outputLen should be aligned to 32bit');
	        const outLen = len / 4;
	        const state = this.get();
	        if (outLen > state.length)
	            throw new Error('_sha2: outputLen bigger than state');
	        for (let i = 0; i < outLen; i++)
	            oview.setUint32(4 * i, state[i], isLE);
	    }
	    digest() {
	        const { buffer, outputLen } = this;
	        this.digestInto(buffer);
	        const res = buffer.slice(0, outputLen);
	        this.destroy();
	        return res;
	    }
	    _cloneInto(to) {
	        to || (to = new this.constructor());
	        to.set(...this.get());
	        const { blockLen, buffer, length, finished, destroyed, pos } = this;
	        to.destroyed = destroyed;
	        to.finished = finished;
	        to.length = length;
	        to.pos = pos;
	        if (length % blockLen)
	            to.buffer.set(buffer);
	        return to;
	    }
	    clone() {
	        return this._cloneInto();
	    }
	}
	/**
	 * Initial SHA-2 state: fractional parts of square roots of first 16 primes 2..53.
	 * Check out `test/misc/sha2-gen-iv.js` for recomputation guide.
	 */
	/** Initial SHA256 state. Bits 0..32 of frac part of sqrt of primes 2..19 */
	const SHA256_IV = /* @__PURE__ */ Uint32Array.from([
	    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
	]);

	/**
	 * SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
	 * SHA256 is the fastest hash implementable in JS, even faster than Blake3.
	 * Check out [RFC 4634](https://datatracker.ietf.org/doc/html/rfc4634) and
	 * [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
	 * @module
	 */
	/**
	 * Round constants:
	 * First 32 bits of fractional parts of the cube roots of the first 64 primes 2..311)
	 */
	// prettier-ignore
	const SHA256_K = /* @__PURE__ */ Uint32Array.from([
	    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	]);
	/** Reusable temporary buffer. "W" comes straight from spec. */
	const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
	class SHA256 extends HashMD {
	    constructor(outputLen = 32) {
	        super(64, outputLen, 8, false);
	        // We cannot use array here since array allows indexing by variable
	        // which means optimizer/compiler cannot use registers.
	        this.A = SHA256_IV[0] | 0;
	        this.B = SHA256_IV[1] | 0;
	        this.C = SHA256_IV[2] | 0;
	        this.D = SHA256_IV[3] | 0;
	        this.E = SHA256_IV[4] | 0;
	        this.F = SHA256_IV[5] | 0;
	        this.G = SHA256_IV[6] | 0;
	        this.H = SHA256_IV[7] | 0;
	    }
	    get() {
	        const { A, B, C, D, E, F, G, H } = this;
	        return [A, B, C, D, E, F, G, H];
	    }
	    // prettier-ignore
	    set(A, B, C, D, E, F, G, H) {
	        this.A = A | 0;
	        this.B = B | 0;
	        this.C = C | 0;
	        this.D = D | 0;
	        this.E = E | 0;
	        this.F = F | 0;
	        this.G = G | 0;
	        this.H = H | 0;
	    }
	    process(view, offset) {
	        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
	        for (let i = 0; i < 16; i++, offset += 4)
	            SHA256_W[i] = view.getUint32(offset, false);
	        for (let i = 16; i < 64; i++) {
	            const W15 = SHA256_W[i - 15];
	            const W2 = SHA256_W[i - 2];
	            const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ (W15 >>> 3);
	            const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ (W2 >>> 10);
	            SHA256_W[i] = (s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16]) | 0;
	        }
	        // Compression function main loop, 64 rounds
	        let { A, B, C, D, E, F, G, H } = this;
	        for (let i = 0; i < 64; i++) {
	            const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
	            const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
	            const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
	            const T2 = (sigma0 + Maj(A, B, C)) | 0;
	            H = G;
	            G = F;
	            F = E;
	            E = (D + T1) | 0;
	            D = C;
	            C = B;
	            B = A;
	            A = (T1 + T2) | 0;
	        }
	        // Add the compressed chunk to the current hash value
	        A = (A + this.A) | 0;
	        B = (B + this.B) | 0;
	        C = (C + this.C) | 0;
	        D = (D + this.D) | 0;
	        E = (E + this.E) | 0;
	        F = (F + this.F) | 0;
	        G = (G + this.G) | 0;
	        H = (H + this.H) | 0;
	        this.set(A, B, C, D, E, F, G, H);
	    }
	    roundClean() {
	        clean(SHA256_W);
	    }
	    destroy() {
	        this.set(0, 0, 0, 0, 0, 0, 0, 0);
	        clean(this.buffer);
	    }
	}
	/**
	 * SHA2-256 hash function from RFC 4634.
	 *
	 * It is the fastest JS hash, even faster than Blake3.
	 * To break sha256 using birthday attack, attackers need to try 2^128 hashes.
	 * BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
	 */
	const sha256$1 = /* @__PURE__ */ createHasher(() => new SHA256());

	/**
	 * HMAC: RFC2104 message authentication code.
	 * @module
	 */
	class HMAC extends Hash {
	    constructor(hash, _key) {
	        super();
	        this.finished = false;
	        this.destroyed = false;
	        ahash(hash);
	        const key = toBytes(_key);
	        this.iHash = hash.create();
	        if (typeof this.iHash.update !== 'function')
	            throw new Error('Expected instance of class which extends utils.Hash');
	        this.blockLen = this.iHash.blockLen;
	        this.outputLen = this.iHash.outputLen;
	        const blockLen = this.blockLen;
	        const pad = new Uint8Array(blockLen);
	        // blockLen can be bigger than outputLen
	        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
	        for (let i = 0; i < pad.length; i++)
	            pad[i] ^= 0x36;
	        this.iHash.update(pad);
	        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
	        this.oHash = hash.create();
	        // Undo internal XOR && apply outer XOR
	        for (let i = 0; i < pad.length; i++)
	            pad[i] ^= 0x36 ^ 0x5c;
	        this.oHash.update(pad);
	        clean(pad);
	    }
	    update(buf) {
	        aexists(this);
	        this.iHash.update(buf);
	        return this;
	    }
	    digestInto(out) {
	        aexists(this);
	        abytes(out, this.outputLen);
	        this.finished = true;
	        this.iHash.digestInto(out);
	        this.oHash.update(out);
	        this.oHash.digestInto(out);
	        this.destroy();
	    }
	    digest() {
	        const out = new Uint8Array(this.oHash.outputLen);
	        this.digestInto(out);
	        return out;
	    }
	    _cloneInto(to) {
	        // Create new instance without calling constructor since key already in state and we don't know it.
	        to || (to = Object.create(Object.getPrototypeOf(this), {}));
	        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
	        to = to;
	        to.finished = finished;
	        to.destroyed = destroyed;
	        to.blockLen = blockLen;
	        to.outputLen = outputLen;
	        to.oHash = oHash._cloneInto(to.oHash);
	        to.iHash = iHash._cloneInto(to.iHash);
	        return to;
	    }
	    clone() {
	        return this._cloneInto();
	    }
	    destroy() {
	        this.destroyed = true;
	        this.oHash.destroy();
	        this.iHash.destroy();
	    }
	}
	/**
	 * HMAC: RFC2104 message authentication code.
	 * @param hash - function that would be used e.g. sha256
	 * @param key - message key
	 * @param message - message data
	 * @example
	 * import { hmac } from '@noble/hashes/hmac';
	 * import { sha256 } from '@noble/hashes/sha2';
	 * const mac1 = hmac(sha256, 'key', 'message');
	 */
	const hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
	hmac.create = (hash, key) => new HMAC(hash, key);

	/**
	 * Hex, bytes and number utilities.
	 * @module
	 */
	/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	const _0n$4 = /* @__PURE__ */ BigInt(0);
	const _1n$4 = /* @__PURE__ */ BigInt(1);
	// tmp name until v2
	function _abool2(value, title = '') {
	    if (typeof value !== 'boolean') {
	        const prefix = title && `"${title}"`;
	        throw new Error(prefix + 'expected boolean, got type=' + typeof value);
	    }
	    return value;
	}
	// tmp name until v2
	/** Asserts something is Uint8Array. */
	function _abytes2(value, length, title = '') {
	    const bytes = isBytes(value);
	    const len = value?.length;
	    const needsLen = length !== undefined;
	    if (!bytes || (needsLen && len !== length)) {
	        const prefix = title && `"${title}" `;
	        const ofLen = needsLen ? ` of length ${length}` : '';
	        const got = bytes ? `length=${len}` : `type=${typeof value}`;
	        throw new Error(prefix + 'expected Uint8Array' + ofLen + ', got ' + got);
	    }
	    return value;
	}
	// Used in weierstrass, der
	function numberToHexUnpadded(num) {
	    const hex = num.toString(16);
	    return hex.length & 1 ? '0' + hex : hex;
	}
	function hexToNumber(hex) {
	    if (typeof hex !== 'string')
	        throw new Error('hex string expected, got ' + typeof hex);
	    return hex === '' ? _0n$4 : BigInt('0x' + hex); // Big Endian
	}
	// BE: Big Endian, LE: Little Endian
	function bytesToNumberBE(bytes) {
	    return hexToNumber(bytesToHex(bytes));
	}
	function bytesToNumberLE(bytes) {
	    abytes(bytes);
	    return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
	}
	function numberToBytesBE(n, len) {
	    return hexToBytes(n.toString(16).padStart(len * 2, '0'));
	}
	function numberToBytesLE(n, len) {
	    return numberToBytesBE(n, len).reverse();
	}
	/**
	 * Takes hex string or Uint8Array, converts to Uint8Array.
	 * Validates output length.
	 * Will throw error for other types.
	 * @param title descriptive title for an error e.g. 'secret key'
	 * @param hex hex string or Uint8Array
	 * @param expectedLength optional, will compare to result array's length
	 * @returns
	 */
	function ensureBytes(title, hex, expectedLength) {
	    let res;
	    if (typeof hex === 'string') {
	        try {
	            res = hexToBytes(hex);
	        }
	        catch (e) {
	            throw new Error(title + ' must be hex string or Uint8Array, cause: ' + e);
	        }
	    }
	    else if (isBytes(hex)) {
	        // Uint8Array.from() instead of hash.slice() because node.js Buffer
	        // is instance of Uint8Array, and its slice() creates **mutable** copy
	        res = Uint8Array.from(hex);
	    }
	    else {
	        throw new Error(title + ' must be hex string or Uint8Array');
	    }
	    const len = res.length;
	    if (typeof expectedLength === 'number' && len !== expectedLength)
	        throw new Error(title + ' of length ' + expectedLength + ' expected, got ' + len);
	    return res;
	}
	/**
	 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
	 */
	// export const utf8ToBytes: typeof utf8ToBytes_ = utf8ToBytes_;
	/**
	 * Converts bytes to string using UTF8 encoding.
	 * @example bytesToUtf8(Uint8Array.from([97, 98, 99])) // 'abc'
	 */
	// export const bytesToUtf8: typeof bytesToUtf8_ = bytesToUtf8_;
	// Is positive bigint
	const isPosBig = (n) => typeof n === 'bigint' && _0n$4 <= n;
	function inRange(n, min, max) {
	    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
	}
	/**
	 * Asserts min <= n < max. NOTE: It's < max and not <= max.
	 * @example
	 * aInRange('x', x, 1n, 256n); // would assume x is in (1n..255n)
	 */
	function aInRange(title, n, min, max) {
	    // Why min <= n < max and not a (min < n < max) OR b (min <= n <= max)?
	    // consider P=256n, min=0n, max=P
	    // - a for min=0 would require -1:          `inRange('x', x, -1n, P)`
	    // - b would commonly require subtraction:  `inRange('x', x, 0n, P - 1n)`
	    // - our way is the cleanest:               `inRange('x', x, 0n, P)
	    if (!inRange(n, min, max))
	        throw new Error('expected valid ' + title + ': ' + min + ' <= n < ' + max + ', got ' + n);
	}
	// Bit operations
	/**
	 * Calculates amount of bits in a bigint.
	 * Same as `n.toString(2).length`
	 * TODO: merge with nLength in modular
	 */
	function bitLen(n) {
	    let len;
	    for (len = 0; n > _0n$4; n >>= _1n$4, len += 1)
	        ;
	    return len;
	}
	/**
	 * Calculate mask for N bits. Not using ** operator with bigints because of old engines.
	 * Same as BigInt(`0b${Array(i).fill('1').join('')}`)
	 */
	const bitMask = (n) => (_1n$4 << BigInt(n)) - _1n$4;
	/**
	 * Minimal HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
	 * @returns function that will call DRBG until 2nd arg returns something meaningful
	 * @example
	 *   const drbg = createHmacDRBG<Key>(32, 32, hmac);
	 *   drbg(seed, bytesToKey); // bytesToKey must return Key or undefined
	 */
	function createHmacDrbg(hashLen, qByteLen, hmacFn) {
	    if (typeof hashLen !== 'number' || hashLen < 2)
	        throw new Error('hashLen must be a number');
	    if (typeof qByteLen !== 'number' || qByteLen < 2)
	        throw new Error('qByteLen must be a number');
	    if (typeof hmacFn !== 'function')
	        throw new Error('hmacFn must be a function');
	    // Step B, Step C: set hashLen to 8*ceil(hlen/8)
	    const u8n = (len) => new Uint8Array(len); // creates Uint8Array
	    const u8of = (byte) => Uint8Array.of(byte); // another shortcut
	    let v = u8n(hashLen); // Minimal non-full-spec HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
	    let k = u8n(hashLen); // Steps B and C of RFC6979 3.2: set hashLen, in our case always same
	    let i = 0; // Iterations counter, will throw when over 1000
	    const reset = () => {
	        v.fill(1);
	        k.fill(0);
	        i = 0;
	    };
	    const h = (...b) => hmacFn(k, v, ...b); // hmac(k)(v, ...values)
	    const reseed = (seed = u8n(0)) => {
	        // HMAC-DRBG reseed() function. Steps D-G
	        k = h(u8of(0x00), seed); // k = hmac(k || v || 0x00 || seed)
	        v = h(); // v = hmac(k || v)
	        if (seed.length === 0)
	            return;
	        k = h(u8of(0x01), seed); // k = hmac(k || v || 0x01 || seed)
	        v = h(); // v = hmac(k || v)
	    };
	    const gen = () => {
	        // HMAC-DRBG generate() function
	        if (i++ >= 1000)
	            throw new Error('drbg: tried 1000 values');
	        let len = 0;
	        const out = [];
	        while (len < qByteLen) {
	            v = h();
	            const sl = v.slice();
	            out.push(sl);
	            len += v.length;
	        }
	        return concatBytes(...out);
	    };
	    const genUntil = (seed, pred) => {
	        reset();
	        reseed(seed); // Steps D-G
	        let res = undefined; // Step H: grind until k is in [1..n-1]
	        while (!(res = pred(gen())))
	            reseed();
	        reset();
	        return res;
	    };
	    return genUntil;
	}
	function _validateObject(object, fields, optFields = {}) {
	    if (!object || typeof object !== 'object')
	        throw new Error('expected valid options object');
	    function checkField(fieldName, expectedType, isOpt) {
	        const val = object[fieldName];
	        if (isOpt && val === undefined)
	            return;
	        const current = typeof val;
	        if (current !== expectedType || val === null)
	            throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
	    }
	    Object.entries(fields).forEach(([k, v]) => checkField(k, v, false));
	    Object.entries(optFields).forEach(([k, v]) => checkField(k, v, true));
	}
	/**
	 * Memoizes (caches) computation result.
	 * Uses WeakMap: the value is going auto-cleaned by GC after last reference is removed.
	 */
	function memoized(fn) {
	    const map = new WeakMap();
	    return (arg, ...args) => {
	        const val = map.get(arg);
	        if (val !== undefined)
	            return val;
	        const computed = fn(arg, ...args);
	        map.set(arg, computed);
	        return computed;
	    };
	}

	/**
	 * Utils for modular division and fields.
	 * Field over 11 is a finite (Galois) field is integer number operations `mod 11`.
	 * There is no division: it is replaced by modular multiplicative inverse.
	 * @module
	 */
	/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	// prettier-ignore
	const _0n$3 = BigInt(0), _1n$3 = BigInt(1), _2n$2 = /* @__PURE__ */ BigInt(2), _3n$1 = /* @__PURE__ */ BigInt(3);
	// prettier-ignore
	const _4n$1 = /* @__PURE__ */ BigInt(4), _5n = /* @__PURE__ */ BigInt(5), _7n = /* @__PURE__ */ BigInt(7);
	// prettier-ignore
	const _8n = /* @__PURE__ */ BigInt(8), _9n = /* @__PURE__ */ BigInt(9), _16n = /* @__PURE__ */ BigInt(16);
	// Calculates a modulo b
	function mod(a, b) {
	    const result = a % b;
	    return result >= _0n$3 ? result : b + result;
	}
	/** Does `x^(2^power)` mod p. `pow2(30, 4)` == `30^(2^4)` */
	function pow2(x, power, modulo) {
	    let res = x;
	    while (power-- > _0n$3) {
	        res *= res;
	        res %= modulo;
	    }
	    return res;
	}
	/**
	 * Inverses number over modulo.
	 * Implemented using [Euclidean GCD](https://brilliant.org/wiki/extended-euclidean-algorithm/).
	 */
	function invert(number, modulo) {
	    if (number === _0n$3)
	        throw new Error('invert: expected non-zero number');
	    if (modulo <= _0n$3)
	        throw new Error('invert: expected positive modulus, got ' + modulo);
	    // Fermat's little theorem "CT-like" version inv(n) = n^(m-2) mod m is 30x slower.
	    let a = mod(number, modulo);
	    let b = modulo;
	    // prettier-ignore
	    let x = _0n$3, u = _1n$3;
	    while (a !== _0n$3) {
	        // JIT applies optimization if those two lines follow each other
	        const q = b / a;
	        const r = b % a;
	        const m = x - u * q;
	        // prettier-ignore
	        b = a, a = r, x = u, u = m;
	    }
	    const gcd = b;
	    if (gcd !== _1n$3)
	        throw new Error('invert: does not exist');
	    return mod(x, modulo);
	}
	function assertIsSquare(Fp, root, n) {
	    if (!Fp.eql(Fp.sqr(root), n))
	        throw new Error('Cannot find square root');
	}
	// Not all roots are possible! Example which will throw:
	// const NUM =
	// n = 72057594037927816n;
	// Fp = Field(BigInt('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab'));
	function sqrt3mod4(Fp, n) {
	    const p1div4 = (Fp.ORDER + _1n$3) / _4n$1;
	    const root = Fp.pow(n, p1div4);
	    assertIsSquare(Fp, root, n);
	    return root;
	}
	function sqrt5mod8(Fp, n) {
	    const p5div8 = (Fp.ORDER - _5n) / _8n;
	    const n2 = Fp.mul(n, _2n$2);
	    const v = Fp.pow(n2, p5div8);
	    const nv = Fp.mul(n, v);
	    const i = Fp.mul(Fp.mul(nv, _2n$2), v);
	    const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
	    assertIsSquare(Fp, root, n);
	    return root;
	}
	// Based on RFC9380, Kong algorithm
	// prettier-ignore
	function sqrt9mod16(P) {
	    const Fp_ = Field(P);
	    const tn = tonelliShanks(P);
	    const c1 = tn(Fp_, Fp_.neg(Fp_.ONE)); //  1. c1 = sqrt(-1) in F, i.e., (c1^2) == -1 in F
	    const c2 = tn(Fp_, c1); //  2. c2 = sqrt(c1) in F, i.e., (c2^2) == c1 in F
	    const c3 = tn(Fp_, Fp_.neg(c1)); //  3. c3 = sqrt(-c1) in F, i.e., (c3^2) == -c1 in F
	    const c4 = (P + _7n) / _16n; //  4. c4 = (q + 7) / 16        # Integer arithmetic
	    return (Fp, n) => {
	        let tv1 = Fp.pow(n, c4); //  1. tv1 = x^c4
	        let tv2 = Fp.mul(tv1, c1); //  2. tv2 = c1 * tv1
	        const tv3 = Fp.mul(tv1, c2); //  3. tv3 = c2 * tv1
	        const tv4 = Fp.mul(tv1, c3); //  4. tv4 = c3 * tv1
	        const e1 = Fp.eql(Fp.sqr(tv2), n); //  5.  e1 = (tv2^2) == x
	        const e2 = Fp.eql(Fp.sqr(tv3), n); //  6.  e2 = (tv3^2) == x
	        tv1 = Fp.cmov(tv1, tv2, e1); //  7. tv1 = CMOV(tv1, tv2, e1)  # Select tv2 if (tv2^2) == x
	        tv2 = Fp.cmov(tv4, tv3, e2); //  8. tv2 = CMOV(tv4, tv3, e2)  # Select tv3 if (tv3^2) == x
	        const e3 = Fp.eql(Fp.sqr(tv2), n); //  9.  e3 = (tv2^2) == x
	        const root = Fp.cmov(tv1, tv2, e3); // 10.  z = CMOV(tv1, tv2, e3)   # Select sqrt from tv1 & tv2
	        assertIsSquare(Fp, root, n);
	        return root;
	    };
	}
	/**
	 * Tonelli-Shanks square root search algorithm.
	 * 1. https://eprint.iacr.org/2012/685.pdf (page 12)
	 * 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
	 * @param P field order
	 * @returns function that takes field Fp (created from P) and number n
	 */
	function tonelliShanks(P) {
	    // Initialization (precomputation).
	    // Caching initialization could boost perf by 7%.
	    if (P < _3n$1)
	        throw new Error('sqrt is not defined for small field');
	    // Factor P - 1 = Q * 2^S, where Q is odd
	    let Q = P - _1n$3;
	    let S = 0;
	    while (Q % _2n$2 === _0n$3) {
	        Q /= _2n$2;
	        S++;
	    }
	    // Find the first quadratic non-residue Z >= 2
	    let Z = _2n$2;
	    const _Fp = Field(P);
	    while (FpLegendre(_Fp, Z) === 1) {
	        // Basic primality test for P. After x iterations, chance of
	        // not finding quadratic non-residue is 2^x, so 2^1000.
	        if (Z++ > 1000)
	            throw new Error('Cannot find square root: probably non-prime P');
	    }
	    // Fast-path; usually done before Z, but we do "primality test".
	    if (S === 1)
	        return sqrt3mod4;
	    // Slow-path
	    // TODO: test on Fp2 and others
	    let cc = _Fp.pow(Z, Q); // c = z^Q
	    const Q1div2 = (Q + _1n$3) / _2n$2;
	    return function tonelliSlow(Fp, n) {
	        if (Fp.is0(n))
	            return n;
	        // Check if n is a quadratic residue using Legendre symbol
	        if (FpLegendre(Fp, n) !== 1)
	            throw new Error('Cannot find square root');
	        // Initialize variables for the main loop
	        let M = S;
	        let c = Fp.mul(Fp.ONE, cc); // c = z^Q, move cc from field _Fp into field Fp
	        let t = Fp.pow(n, Q); // t = n^Q, first guess at the fudge factor
	        let R = Fp.pow(n, Q1div2); // R = n^((Q+1)/2), first guess at the square root
	        // Main loop
	        // while t != 1
	        while (!Fp.eql(t, Fp.ONE)) {
	            if (Fp.is0(t))
	                return Fp.ZERO; // if t=0 return R=0
	            let i = 1;
	            // Find the smallest i >= 1 such that t^(2^i) ≡ 1 (mod P)
	            let t_tmp = Fp.sqr(t); // t^(2^1)
	            while (!Fp.eql(t_tmp, Fp.ONE)) {
	                i++;
	                t_tmp = Fp.sqr(t_tmp); // t^(2^2)...
	                if (i === M)
	                    throw new Error('Cannot find square root');
	            }
	            // Calculate the exponent for b: 2^(M - i - 1)
	            const exponent = _1n$3 << BigInt(M - i - 1); // bigint is important
	            const b = Fp.pow(c, exponent); // b = 2^(M - i - 1)
	            // Update variables
	            M = i;
	            c = Fp.sqr(b); // c = b^2
	            t = Fp.mul(t, c); // t = (t * b^2)
	            R = Fp.mul(R, b); // R = R*b
	        }
	        return R;
	    };
	}
	/**
	 * Square root for a finite field. Will try optimized versions first:
	 *
	 * 1. P ≡ 3 (mod 4)
	 * 2. P ≡ 5 (mod 8)
	 * 3. P ≡ 9 (mod 16)
	 * 4. Tonelli-Shanks algorithm
	 *
	 * Different algorithms can give different roots, it is up to user to decide which one they want.
	 * For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
	 */
	function FpSqrt(P) {
	    // P ≡ 3 (mod 4) => √n = n^((P+1)/4)
	    if (P % _4n$1 === _3n$1)
	        return sqrt3mod4;
	    // P ≡ 5 (mod 8) => Atkin algorithm, page 10 of https://eprint.iacr.org/2012/685.pdf
	    if (P % _8n === _5n)
	        return sqrt5mod8;
	    // P ≡ 9 (mod 16) => Kong algorithm, page 11 of https://eprint.iacr.org/2012/685.pdf (algorithm 4)
	    if (P % _16n === _9n)
	        return sqrt9mod16(P);
	    // Tonelli-Shanks algorithm
	    return tonelliShanks(P);
	}
	// prettier-ignore
	const FIELD_FIELDS = [
	    'create', 'isValid', 'is0', 'neg', 'inv', 'sqrt', 'sqr',
	    'eql', 'add', 'sub', 'mul', 'pow', 'div',
	    'addN', 'subN', 'mulN', 'sqrN'
	];
	function validateField(field) {
	    const initial = {
	        ORDER: 'bigint',
	        MASK: 'bigint',
	        BYTES: 'number',
	        BITS: 'number',
	    };
	    const opts = FIELD_FIELDS.reduce((map, val) => {
	        map[val] = 'function';
	        return map;
	    }, initial);
	    _validateObject(field, opts);
	    // const max = 16384;
	    // if (field.BYTES < 1 || field.BYTES > max) throw new Error('invalid field');
	    // if (field.BITS < 1 || field.BITS > 8 * max) throw new Error('invalid field');
	    return field;
	}
	// Generic field functions
	/**
	 * Same as `pow` but for Fp: non-constant-time.
	 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
	 */
	function FpPow(Fp, num, power) {
	    if (power < _0n$3)
	        throw new Error('invalid exponent, negatives unsupported');
	    if (power === _0n$3)
	        return Fp.ONE;
	    if (power === _1n$3)
	        return num;
	    let p = Fp.ONE;
	    let d = num;
	    while (power > _0n$3) {
	        if (power & _1n$3)
	            p = Fp.mul(p, d);
	        d = Fp.sqr(d);
	        power >>= _1n$3;
	    }
	    return p;
	}
	/**
	 * Efficiently invert an array of Field elements.
	 * Exception-free. Will return `undefined` for 0 elements.
	 * @param passZero map 0 to 0 (instead of undefined)
	 */
	function FpInvertBatch(Fp, nums, passZero = false) {
	    const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : undefined);
	    // Walk from first to last, multiply them by each other MOD p
	    const multipliedAcc = nums.reduce((acc, num, i) => {
	        if (Fp.is0(num))
	            return acc;
	        inverted[i] = acc;
	        return Fp.mul(acc, num);
	    }, Fp.ONE);
	    // Invert last element
	    const invertedAcc = Fp.inv(multipliedAcc);
	    // Walk from last to first, multiply them by inverted each other MOD p
	    nums.reduceRight((acc, num, i) => {
	        if (Fp.is0(num))
	            return acc;
	        inverted[i] = Fp.mul(acc, inverted[i]);
	        return Fp.mul(acc, num);
	    }, invertedAcc);
	    return inverted;
	}
	/**
	 * Legendre symbol.
	 * Legendre constant is used to calculate Legendre symbol (a | p)
	 * which denotes the value of a^((p-1)/2) (mod p).
	 *
	 * * (a | p) ≡ 1    if a is a square (mod p), quadratic residue
	 * * (a | p) ≡ -1   if a is not a square (mod p), quadratic non residue
	 * * (a | p) ≡ 0    if a ≡ 0 (mod p)
	 */
	function FpLegendre(Fp, n) {
	    // We can use 3rd argument as optional cache of this value
	    // but seems unneeded for now. The operation is very fast.
	    const p1mod2 = (Fp.ORDER - _1n$3) / _2n$2;
	    const powered = Fp.pow(n, p1mod2);
	    const yes = Fp.eql(powered, Fp.ONE);
	    const zero = Fp.eql(powered, Fp.ZERO);
	    const no = Fp.eql(powered, Fp.neg(Fp.ONE));
	    if (!yes && !zero && !no)
	        throw new Error('invalid Legendre symbol result');
	    return yes ? 1 : zero ? 0 : -1;
	}
	// CURVE.n lengths
	function nLength(n, nBitLength) {
	    // Bit size, byte size of CURVE.n
	    if (nBitLength !== undefined)
	        anumber(nBitLength);
	    const _nBitLength = nBitLength !== undefined ? nBitLength : n.toString(2).length;
	    const nByteLength = Math.ceil(_nBitLength / 8);
	    return { nBitLength: _nBitLength, nByteLength };
	}
	/**
	 * Creates a finite field. Major performance optimizations:
	 * * 1. Denormalized operations like mulN instead of mul.
	 * * 2. Identical object shape: never add or remove keys.
	 * * 3. `Object.freeze`.
	 * Fragile: always run a benchmark on a change.
	 * Security note: operations don't check 'isValid' for all elements for performance reasons,
	 * it is caller responsibility to check this.
	 * This is low-level code, please make sure you know what you're doing.
	 *
	 * Note about field properties:
	 * * CHARACTERISTIC p = prime number, number of elements in main subgroup.
	 * * ORDER q = similar to cofactor in curves, may be composite `q = p^m`.
	 *
	 * @param ORDER field order, probably prime, or could be composite
	 * @param bitLen how many bits the field consumes
	 * @param isLE (default: false) if encoding / decoding should be in little-endian
	 * @param redef optional faster redefinitions of sqrt and other methods
	 */
	function Field(ORDER, bitLenOrOpts, // TODO: use opts only in v2?
	isLE = false, opts = {}) {
	    if (ORDER <= _0n$3)
	        throw new Error('invalid field: expected ORDER > 0, got ' + ORDER);
	    let _nbitLength = undefined;
	    let _sqrt = undefined;
	    let modFromBytes = false;
	    let allowedLengths = undefined;
	    if (typeof bitLenOrOpts === 'object' && bitLenOrOpts != null) {
	        if (opts.sqrt || isLE)
	            throw new Error('cannot specify opts in two arguments');
	        const _opts = bitLenOrOpts;
	        if (_opts.BITS)
	            _nbitLength = _opts.BITS;
	        if (_opts.sqrt)
	            _sqrt = _opts.sqrt;
	        if (typeof _opts.isLE === 'boolean')
	            isLE = _opts.isLE;
	        if (typeof _opts.modFromBytes === 'boolean')
	            modFromBytes = _opts.modFromBytes;
	        allowedLengths = _opts.allowedLengths;
	    }
	    else {
	        if (typeof bitLenOrOpts === 'number')
	            _nbitLength = bitLenOrOpts;
	        if (opts.sqrt)
	            _sqrt = opts.sqrt;
	    }
	    const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, _nbitLength);
	    if (BYTES > 2048)
	        throw new Error('invalid field: expected ORDER of <= 2048 bytes');
	    let sqrtP; // cached sqrtP
	    const f = Object.freeze({
	        ORDER,
	        isLE,
	        BITS,
	        BYTES,
	        MASK: bitMask(BITS),
	        ZERO: _0n$3,
	        ONE: _1n$3,
	        allowedLengths: allowedLengths,
	        create: (num) => mod(num, ORDER),
	        isValid: (num) => {
	            if (typeof num !== 'bigint')
	                throw new Error('invalid field element: expected bigint, got ' + typeof num);
	            return _0n$3 <= num && num < ORDER; // 0 is valid element, but it's not invertible
	        },
	        is0: (num) => num === _0n$3,
	        // is valid and invertible
	        isValidNot0: (num) => !f.is0(num) && f.isValid(num),
	        isOdd: (num) => (num & _1n$3) === _1n$3,
	        neg: (num) => mod(-num, ORDER),
	        eql: (lhs, rhs) => lhs === rhs,
	        sqr: (num) => mod(num * num, ORDER),
	        add: (lhs, rhs) => mod(lhs + rhs, ORDER),
	        sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
	        mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
	        pow: (num, power) => FpPow(f, num, power),
	        div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
	        // Same as above, but doesn't normalize
	        sqrN: (num) => num * num,
	        addN: (lhs, rhs) => lhs + rhs,
	        subN: (lhs, rhs) => lhs - rhs,
	        mulN: (lhs, rhs) => lhs * rhs,
	        inv: (num) => invert(num, ORDER),
	        sqrt: _sqrt ||
	            ((n) => {
	                if (!sqrtP)
	                    sqrtP = FpSqrt(ORDER);
	                return sqrtP(f, n);
	            }),
	        toBytes: (num) => (isLE ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES)),
	        fromBytes: (bytes, skipValidation = true) => {
	            if (allowedLengths) {
	                if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
	                    throw new Error('Field.fromBytes: expected ' + allowedLengths + ' bytes, got ' + bytes.length);
	                }
	                const padded = new Uint8Array(BYTES);
	                // isLE add 0 to right, !isLE to the left.
	                padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
	                bytes = padded;
	            }
	            if (bytes.length !== BYTES)
	                throw new Error('Field.fromBytes: expected ' + BYTES + ' bytes, got ' + bytes.length);
	            let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
	            if (modFromBytes)
	                scalar = mod(scalar, ORDER);
	            if (!skipValidation)
	                if (!f.isValid(scalar))
	                    throw new Error('invalid field element: outside of range 0..ORDER');
	            // NOTE: we don't validate scalar here, please use isValid. This done such way because some
	            // protocol may allow non-reduced scalar that reduced later or changed some other way.
	            return scalar;
	        },
	        // TODO: we don't need it here, move out to separate fn
	        invertBatch: (lst) => FpInvertBatch(f, lst),
	        // We can't move this out because Fp6, Fp12 implement it
	        // and it's unclear what to return in there.
	        cmov: (a, b, c) => (c ? b : a),
	    });
	    return Object.freeze(f);
	}
	/**
	 * Returns total number of bytes consumed by the field element.
	 * For example, 32 bytes for usual 256-bit weierstrass curve.
	 * @param fieldOrder number of field elements, usually CURVE.n
	 * @returns byte length of field
	 */
	function getFieldBytesLength(fieldOrder) {
	    if (typeof fieldOrder !== 'bigint')
	        throw new Error('field order must be bigint');
	    const bitLength = fieldOrder.toString(2).length;
	    return Math.ceil(bitLength / 8);
	}
	/**
	 * Returns minimal amount of bytes that can be safely reduced
	 * by field order.
	 * Should be 2^-128 for 128-bit curve such as P256.
	 * @param fieldOrder number of field elements, usually CURVE.n
	 * @returns byte length of target hash
	 */
	function getMinHashLength(fieldOrder) {
	    const length = getFieldBytesLength(fieldOrder);
	    return length + Math.ceil(length / 2);
	}
	/**
	 * "Constant-time" private key generation utility.
	 * Can take (n + n/2) or more bytes of uniform input e.g. from CSPRNG or KDF
	 * and convert them into private scalar, with the modulo bias being negligible.
	 * Needs at least 48 bytes of input for 32-byte private key.
	 * https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
	 * FIPS 186-5, A.2 https://csrc.nist.gov/publications/detail/fips/186/5/final
	 * RFC 9380, https://www.rfc-editor.org/rfc/rfc9380#section-5
	 * @param hash hash output from SHA3 or a similar function
	 * @param groupOrder size of subgroup - (e.g. secp256k1.CURVE.n)
	 * @param isLE interpret hash bytes as LE num
	 * @returns valid private scalar
	 */
	function mapHashToField(key, fieldOrder, isLE = false) {
	    const len = key.length;
	    const fieldLen = getFieldBytesLength(fieldOrder);
	    const minLen = getMinHashLength(fieldOrder);
	    // No small numbers: need to understand bias story. No huge numbers: easier to detect JS timings.
	    if (len < 16 || len < minLen || len > 1024)
	        throw new Error('expected ' + minLen + '-1024 bytes of input, got ' + len);
	    const num = isLE ? bytesToNumberLE(key) : bytesToNumberBE(key);
	    // `mod(x, 11)` can sometimes produce 0. `mod(x, 10) + 1` is the same, but no 0
	    const reduced = mod(num, fieldOrder - _1n$3) + _1n$3;
	    return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
	}

	/**
	 * Methods for elliptic curve multiplication by scalars.
	 * Contains wNAF, pippenger.
	 * @module
	 */
	/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	const _0n$2 = BigInt(0);
	const _1n$2 = BigInt(1);
	function negateCt(condition, item) {
	    const neg = item.negate();
	    return condition ? neg : item;
	}
	/**
	 * Takes a bunch of Projective Points but executes only one
	 * inversion on all of them. Inversion is very slow operation,
	 * so this improves performance massively.
	 * Optimization: converts a list of projective points to a list of identical points with Z=1.
	 */
	function normalizeZ(c, points) {
	    const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
	    return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
	}
	function validateW(W, bits) {
	    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
	        throw new Error('invalid window size, expected [1..' + bits + '], got W=' + W);
	}
	function calcWOpts(W, scalarBits) {
	    validateW(W, scalarBits);
	    const windows = Math.ceil(scalarBits / W) + 1; // W=8 33. Not 32, because we skip zero
	    const windowSize = 2 ** (W - 1); // W=8 128. Not 256, because we skip zero
	    const maxNumber = 2 ** W; // W=8 256
	    const mask = bitMask(W); // W=8 255 == mask 255
	    const shiftBy = BigInt(W); // W=8 8
	    return { windows, windowSize, mask, maxNumber, shiftBy };
	}
	function calcOffsets(n, window, wOpts) {
	    const { windowSize, mask, maxNumber, shiftBy } = wOpts;
	    let wbits = Number(n & mask); // extract W bits.
	    let nextN = n >> shiftBy; // shift number by W bits.
	    // What actually happens here:
	    // const highestBit = Number(mask ^ (mask >> 1n));
	    // let wbits2 = wbits - 1; // skip zero
	    // if (wbits2 & highestBit) { wbits2 ^= Number(mask); // (~);
	    // split if bits > max: +224 => 256-32
	    if (wbits > windowSize) {
	        // we skip zero, which means instead of `>= size-1`, we do `> size`
	        wbits -= maxNumber; // -32, can be maxNumber - wbits, but then we need to set isNeg here.
	        nextN += _1n$2; // +256 (carry)
	    }
	    const offsetStart = window * windowSize;
	    const offset = offsetStart + Math.abs(wbits) - 1; // -1 because we skip zero
	    const isZero = wbits === 0; // is current window slice a 0?
	    const isNeg = wbits < 0; // is current window slice negative?
	    const isNegF = window % 2 !== 0; // fake random statement for noise
	    const offsetF = offsetStart; // fake offset for noise
	    return { nextN, offset, isZero, isNeg, isNegF, offsetF };
	}
	function validateMSMPoints(points, c) {
	    if (!Array.isArray(points))
	        throw new Error('array expected');
	    points.forEach((p, i) => {
	        if (!(p instanceof c))
	            throw new Error('invalid point at index ' + i);
	    });
	}
	function validateMSMScalars(scalars, field) {
	    if (!Array.isArray(scalars))
	        throw new Error('array of scalars expected');
	    scalars.forEach((s, i) => {
	        if (!field.isValid(s))
	            throw new Error('invalid scalar at index ' + i);
	    });
	}
	// Since points in different groups cannot be equal (different object constructor),
	// we can have single place to store precomputes.
	// Allows to make points frozen / immutable.
	const pointPrecomputes = new WeakMap();
	const pointWindowSizes = new WeakMap();
	function getW(P) {
	    // To disable precomputes:
	    // return 1;
	    return pointWindowSizes.get(P) || 1;
	}
	function assert0(n) {
	    if (n !== _0n$2)
	        throw new Error('invalid wNAF');
	}
	/**
	 * Elliptic curve multiplication of Point by scalar. Fragile.
	 * Table generation takes **30MB of ram and 10ms on high-end CPU**,
	 * but may take much longer on slow devices. Actual generation will happen on
	 * first call of `multiply()`. By default, `BASE` point is precomputed.
	 *
	 * Scalars should always be less than curve order: this should be checked inside of a curve itself.
	 * Creates precomputation tables for fast multiplication:
	 * - private scalar is split by fixed size windows of W bits
	 * - every window point is collected from window's table & added to accumulator
	 * - since windows are different, same point inside tables won't be accessed more than once per calc
	 * - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
	 * - +1 window is neccessary for wNAF
	 * - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
	 *
	 * @todo Research returning 2d JS array of windows, instead of a single window.
	 * This would allow windows to be in different memory locations
	 */
	class wNAF {
	    // Parametrized with a given Point class (not individual point)
	    constructor(Point, bits) {
	        this.BASE = Point.BASE;
	        this.ZERO = Point.ZERO;
	        this.Fn = Point.Fn;
	        this.bits = bits;
	    }
	    // non-const time multiplication ladder
	    _unsafeLadder(elm, n, p = this.ZERO) {
	        let d = elm;
	        while (n > _0n$2) {
	            if (n & _1n$2)
	                p = p.add(d);
	            d = d.double();
	            n >>= _1n$2;
	        }
	        return p;
	    }
	    /**
	     * Creates a wNAF precomputation window. Used for caching.
	     * Default window size is set by `utils.precompute()` and is equal to 8.
	     * Number of precomputed points depends on the curve size:
	     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
	     * - 𝑊 is the window size
	     * - 𝑛 is the bitlength of the curve order.
	     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
	     * @param point Point instance
	     * @param W window size
	     * @returns precomputed point tables flattened to a single array
	     */
	    precomputeWindow(point, W) {
	        const { windows, windowSize } = calcWOpts(W, this.bits);
	        const points = [];
	        let p = point;
	        let base = p;
	        for (let window = 0; window < windows; window++) {
	            base = p;
	            points.push(base);
	            // i=1, bc we skip 0
	            for (let i = 1; i < windowSize; i++) {
	                base = base.add(p);
	                points.push(base);
	            }
	            p = base.double();
	        }
	        return points;
	    }
	    /**
	     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
	     * More compact implementation:
	     * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
	     * @returns real and fake (for const-time) points
	     */
	    wNAF(W, precomputes, n) {
	        // Scalar should be smaller than field order
	        if (!this.Fn.isValid(n))
	            throw new Error('invalid scalar');
	        // Accumulators
	        let p = this.ZERO;
	        let f = this.BASE;
	        // This code was first written with assumption that 'f' and 'p' will never be infinity point:
	        // since each addition is multiplied by 2 ** W, it cannot cancel each other. However,
	        // there is negate now: it is possible that negated element from low value
	        // would be the same as high element, which will create carry into next window.
	        // It's not obvious how this can fail, but still worth investigating later.
	        const wo = calcWOpts(W, this.bits);
	        for (let window = 0; window < wo.windows; window++) {
	            // (n === _0n) is handled and not early-exited. isEven and offsetF are used for noise
	            const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
	            n = nextN;
	            if (isZero) {
	                // bits are 0: add garbage to fake point
	                // Important part for const-time getPublicKey: add random "noise" point to f.
	                f = f.add(negateCt(isNegF, precomputes[offsetF]));
	            }
	            else {
	                // bits are 1: add to result point
	                p = p.add(negateCt(isNeg, precomputes[offset]));
	            }
	        }
	        assert0(n);
	        // Return both real and fake points: JIT won't eliminate f.
	        // At this point there is a way to F be infinity-point even if p is not,
	        // which makes it less const-time: around 1 bigint multiply.
	        return { p, f };
	    }
	    /**
	     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
	     * @param acc accumulator point to add result of multiplication
	     * @returns point
	     */
	    wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
	        const wo = calcWOpts(W, this.bits);
	        for (let window = 0; window < wo.windows; window++) {
	            if (n === _0n$2)
	                break; // Early-exit, skip 0 value
	            const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
	            n = nextN;
	            if (isZero) {
	                // Window bits are 0: skip processing.
	                // Move to next window.
	                continue;
	            }
	            else {
	                const item = precomputes[offset];
	                acc = acc.add(isNeg ? item.negate() : item); // Re-using acc allows to save adds in MSM
	            }
	        }
	        assert0(n);
	        return acc;
	    }
	    getPrecomputes(W, point, transform) {
	        // Calculate precomputes on a first run, reuse them after
	        let comp = pointPrecomputes.get(point);
	        if (!comp) {
	            comp = this.precomputeWindow(point, W);
	            if (W !== 1) {
	                // Doing transform outside of if brings 15% perf hit
	                if (typeof transform === 'function')
	                    comp = transform(comp);
	                pointPrecomputes.set(point, comp);
	            }
	        }
	        return comp;
	    }
	    cached(point, scalar, transform) {
	        const W = getW(point);
	        return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
	    }
	    unsafe(point, scalar, transform, prev) {
	        const W = getW(point);
	        if (W === 1)
	            return this._unsafeLadder(point, scalar, prev); // For W=1 ladder is ~x2 faster
	        return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
	    }
	    // We calculate precomputes for elliptic curve point multiplication
	    // using windowed method. This specifies window size and
	    // stores precomputed values. Usually only base point would be precomputed.
	    createCache(P, W) {
	        validateW(W, this.bits);
	        pointWindowSizes.set(P, W);
	        pointPrecomputes.delete(P);
	    }
	    hasCache(elm) {
	        return getW(elm) !== 1;
	    }
	}
	/**
	 * Endomorphism-specific multiplication for Koblitz curves.
	 * Cost: 128 dbl, 0-256 adds.
	 */
	function mulEndoUnsafe(Point, point, k1, k2) {
	    let acc = point;
	    let p1 = Point.ZERO;
	    let p2 = Point.ZERO;
	    while (k1 > _0n$2 || k2 > _0n$2) {
	        if (k1 & _1n$2)
	            p1 = p1.add(acc);
	        if (k2 & _1n$2)
	            p2 = p2.add(acc);
	        acc = acc.double();
	        k1 >>= _1n$2;
	        k2 >>= _1n$2;
	    }
	    return { p1, p2 };
	}
	/**
	 * Pippenger algorithm for multi-scalar multiplication (MSM, Pa + Qb + Rc + ...).
	 * 30x faster vs naive addition on L=4096, 10x faster than precomputes.
	 * For N=254bit, L=1, it does: 1024 ADD + 254 DBL. For L=5: 1536 ADD + 254 DBL.
	 * Algorithmically constant-time (for same L), even when 1 point + scalar, or when scalar = 0.
	 * @param c Curve Point constructor
	 * @param fieldN field over CURVE.N - important that it's not over CURVE.P
	 * @param points array of L curve points
	 * @param scalars array of L scalars (aka secret keys / bigints)
	 */
	function pippenger(c, fieldN, points, scalars) {
	    // If we split scalars by some window (let's say 8 bits), every chunk will only
	    // take 256 buckets even if there are 4096 scalars, also re-uses double.
	    // TODO:
	    // - https://eprint.iacr.org/2024/750.pdf
	    // - https://tches.iacr.org/index.php/TCHES/article/view/10287
	    // 0 is accepted in scalars
	    validateMSMPoints(points, c);
	    validateMSMScalars(scalars, fieldN);
	    const plength = points.length;
	    const slength = scalars.length;
	    if (plength !== slength)
	        throw new Error('arrays of points and scalars must have equal length');
	    // if (plength === 0) throw new Error('array must be of length >= 2');
	    const zero = c.ZERO;
	    const wbits = bitLen(BigInt(plength));
	    let windowSize = 1; // bits
	    if (wbits > 12)
	        windowSize = wbits - 3;
	    else if (wbits > 4)
	        windowSize = wbits - 2;
	    else if (wbits > 0)
	        windowSize = 2;
	    const MASK = bitMask(windowSize);
	    const buckets = new Array(Number(MASK) + 1).fill(zero); // +1 for zero array
	    const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
	    let sum = zero;
	    for (let i = lastBits; i >= 0; i -= windowSize) {
	        buckets.fill(zero);
	        for (let j = 0; j < slength; j++) {
	            const scalar = scalars[j];
	            const wbits = Number((scalar >> BigInt(i)) & MASK);
	            buckets[wbits] = buckets[wbits].add(points[j]);
	        }
	        let resI = zero; // not using this will do small speed-up, but will lose ct
	        // Skip first bucket, because it is zero
	        for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
	            sumI = sumI.add(buckets[j]);
	            resI = resI.add(sumI);
	        }
	        sum = sum.add(resI);
	        if (i !== 0)
	            for (let j = 0; j < windowSize; j++)
	                sum = sum.double();
	    }
	    return sum;
	}
	function createField(order, field, isLE) {
	    if (field) {
	        if (field.ORDER !== order)
	            throw new Error('Field.ORDER must match order: Fp == p, Fn == n');
	        validateField(field);
	        return field;
	    }
	    else {
	        return Field(order, { isLE });
	    }
	}
	/** Validates CURVE opts and creates fields */
	function _createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
	    if (FpFnLE === undefined)
	        FpFnLE = type === 'edwards';
	    if (!CURVE || typeof CURVE !== 'object')
	        throw new Error(`expected valid ${type} CURVE object`);
	    for (const p of ['p', 'n', 'h']) {
	        const val = CURVE[p];
	        if (!(typeof val === 'bigint' && val > _0n$2))
	            throw new Error(`CURVE.${p} must be positive bigint`);
	    }
	    const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
	    const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
	    const _b = 'b' ;
	    const params = ['Gx', 'Gy', 'a', _b];
	    for (const p of params) {
	        // @ts-ignore
	        if (!Fp.isValid(CURVE[p]))
	            throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
	    }
	    CURVE = Object.freeze(Object.assign({}, CURVE));
	    return { CURVE, Fp, Fn };
	}

	/**
	 * Short Weierstrass curve methods. The formula is: y² = x³ + ax + b.
	 *
	 * ### Design rationale for types
	 *
	 * * Interaction between classes from different curves should fail:
	 *   `k256.Point.BASE.add(p256.Point.BASE)`
	 * * For this purpose we want to use `instanceof` operator, which is fast and works during runtime
	 * * Different calls of `curve()` would return different classes -
	 *   `curve(params) !== curve(params)`: if somebody decided to monkey-patch their curve,
	 *   it won't affect others
	 *
	 * TypeScript can't infer types for classes created inside a function. Classes is one instance
	 * of nominative types in TypeScript and interfaces only check for shape, so it's hard to create
	 * unique type for every function call.
	 *
	 * We can use generic types via some param, like curve opts, but that would:
	 *     1. Enable interaction between `curve(params)` and `curve(params)` (curves of same params)
	 *     which is hard to debug.
	 *     2. Params can be generic and we can't enforce them to be constant value:
	 *     if somebody creates curve from non-constant params,
	 *     it would be allowed to interact with other curves with non-constant params
	 *
	 * @todo https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#unique-symbol
	 * @module
	 */
	/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	// We construct basis in such way that den is always positive and equals n, but num sign depends on basis (not on secret value)
	const divNearest = (num, den) => (num + (num >= 0 ? den : -den) / _2n$1) / den;
	/**
	 * Splits scalar for GLV endomorphism.
	 */
	function _splitEndoScalar(k, basis, n) {
	    // Split scalar into two such that part is ~half bits: `abs(part) < sqrt(N)`
	    // Since part can be negative, we need to do this on point.
	    // TODO: verifyScalar function which consumes lambda
	    const [[a1, b1], [a2, b2]] = basis;
	    const c1 = divNearest(b2 * k, n);
	    const c2 = divNearest(-b1 * k, n);
	    // |k1|/|k2| is < sqrt(N), but can be negative.
	    // If we do `k1 mod N`, we'll get big scalar (`> sqrt(N)`): so, we do cheaper negation instead.
	    let k1 = k - c1 * a1 - c2 * a2;
	    let k2 = -c1 * b1 - c2 * b2;
	    const k1neg = k1 < _0n$1;
	    const k2neg = k2 < _0n$1;
	    if (k1neg)
	        k1 = -k1;
	    if (k2neg)
	        k2 = -k2;
	    // Double check that resulting scalar less than half bits of N: otherwise wNAF will fail.
	    // This should only happen on wrong basises. Also, math inside is too complex and I don't trust it.
	    const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n$1; // Half bits of N
	    if (k1 < _0n$1 || k1 >= MAX_NUM || k2 < _0n$1 || k2 >= MAX_NUM) {
	        throw new Error('splitScalar (endomorphism): failed, k=' + k);
	    }
	    return { k1neg, k1, k2neg, k2 };
	}
	function validateSigFormat(format) {
	    if (!['compact', 'recovered', 'der'].includes(format))
	        throw new Error('Signature format must be "compact", "recovered", or "der"');
	    return format;
	}
	function validateSigOpts(opts, def) {
	    const optsn = {};
	    for (let optName of Object.keys(def)) {
	        // @ts-ignore
	        optsn[optName] = opts[optName] === undefined ? def[optName] : opts[optName];
	    }
	    _abool2(optsn.lowS, 'lowS');
	    _abool2(optsn.prehash, 'prehash');
	    if (optsn.format !== undefined)
	        validateSigFormat(optsn.format);
	    return optsn;
	}
	class DERErr extends Error {
	    constructor(m = '') {
	        super(m);
	    }
	}
	/**
	 * ASN.1 DER encoding utilities. ASN is very complex & fragile. Format:
	 *
	 *     [0x30 (SEQUENCE), bytelength, 0x02 (INTEGER), intLength, R, 0x02 (INTEGER), intLength, S]
	 *
	 * Docs: https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/, https://luca.ntop.org/Teaching/Appunti/asn1.html
	 */
	const DER = {
	    // asn.1 DER encoding utils
	    Err: DERErr,
	    // Basic building block is TLV (Tag-Length-Value)
	    _tlv: {
	        encode: (tag, data) => {
	            const { Err: E } = DER;
	            if (tag < 0 || tag > 256)
	                throw new E('tlv.encode: wrong tag');
	            if (data.length & 1)
	                throw new E('tlv.encode: unpadded data');
	            const dataLen = data.length / 2;
	            const len = numberToHexUnpadded(dataLen);
	            if ((len.length / 2) & 128)
	                throw new E('tlv.encode: long form length too big');
	            // length of length with long form flag
	            const lenLen = dataLen > 127 ? numberToHexUnpadded((len.length / 2) | 128) : '';
	            const t = numberToHexUnpadded(tag);
	            return t + lenLen + len + data;
	        },
	        // v - value, l - left bytes (unparsed)
	        decode(tag, data) {
	            const { Err: E } = DER;
	            let pos = 0;
	            if (tag < 0 || tag > 256)
	                throw new E('tlv.encode: wrong tag');
	            if (data.length < 2 || data[pos++] !== tag)
	                throw new E('tlv.decode: wrong tlv');
	            const first = data[pos++];
	            const isLong = !!(first & 128); // First bit of first length byte is flag for short/long form
	            let length = 0;
	            if (!isLong)
	                length = first;
	            else {
	                // Long form: [longFlag(1bit), lengthLength(7bit), length (BE)]
	                const lenLen = first & 127;
	                if (!lenLen)
	                    throw new E('tlv.decode(long): indefinite length not supported');
	                if (lenLen > 4)
	                    throw new E('tlv.decode(long): byte length is too big'); // this will overflow u32 in js
	                const lengthBytes = data.subarray(pos, pos + lenLen);
	                if (lengthBytes.length !== lenLen)
	                    throw new E('tlv.decode: length bytes not complete');
	                if (lengthBytes[0] === 0)
	                    throw new E('tlv.decode(long): zero leftmost byte');
	                for (const b of lengthBytes)
	                    length = (length << 8) | b;
	                pos += lenLen;
	                if (length < 128)
	                    throw new E('tlv.decode(long): not minimal encoding');
	            }
	            const v = data.subarray(pos, pos + length);
	            if (v.length !== length)
	                throw new E('tlv.decode: wrong value length');
	            return { v, l: data.subarray(pos + length) };
	        },
	    },
	    // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
	    // since we always use positive integers here. It must always be empty:
	    // - add zero byte if exists
	    // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
	    _int: {
	        encode(num) {
	            const { Err: E } = DER;
	            if (num < _0n$1)
	                throw new E('integer: negative integers are not allowed');
	            let hex = numberToHexUnpadded(num);
	            // Pad with zero byte if negative flag is present
	            if (Number.parseInt(hex[0], 16) & 8)
	                hex = '00' + hex;
	            if (hex.length & 1)
	                throw new E('unexpected DER parsing assertion: unpadded hex');
	            return hex;
	        },
	        decode(data) {
	            const { Err: E } = DER;
	            if (data[0] & 128)
	                throw new E('invalid signature integer: negative');
	            if (data[0] === 0x00 && !(data[1] & 128))
	                throw new E('invalid signature integer: unnecessary leading zero');
	            return bytesToNumberBE(data);
	        },
	    },
	    toSig(hex) {
	        // parse DER signature
	        const { Err: E, _int: int, _tlv: tlv } = DER;
	        const data = ensureBytes('signature', hex);
	        const { v: seqBytes, l: seqLeftBytes } = tlv.decode(0x30, data);
	        if (seqLeftBytes.length)
	            throw new E('invalid signature: left bytes after parsing');
	        const { v: rBytes, l: rLeftBytes } = tlv.decode(0x02, seqBytes);
	        const { v: sBytes, l: sLeftBytes } = tlv.decode(0x02, rLeftBytes);
	        if (sLeftBytes.length)
	            throw new E('invalid signature: left bytes after parsing');
	        return { r: int.decode(rBytes), s: int.decode(sBytes) };
	    },
	    hexFromSig(sig) {
	        const { _tlv: tlv, _int: int } = DER;
	        const rs = tlv.encode(0x02, int.encode(sig.r));
	        const ss = tlv.encode(0x02, int.encode(sig.s));
	        const seq = rs + ss;
	        return tlv.encode(0x30, seq);
	    },
	};
	// Be friendly to bad ECMAScript parsers by not using bigint literals
	// prettier-ignore
	const _0n$1 = BigInt(0), _1n$1 = BigInt(1), _2n$1 = BigInt(2), _3n = BigInt(3), _4n = BigInt(4);
	function _normFnElement(Fn, key) {
	    const { BYTES: expected } = Fn;
	    let num;
	    if (typeof key === 'bigint') {
	        num = key;
	    }
	    else {
	        let bytes = ensureBytes('private key', key);
	        try {
	            num = Fn.fromBytes(bytes);
	        }
	        catch (error) {
	            throw new Error(`invalid private key: expected ui8a of size ${expected}, got ${typeof key}`);
	        }
	    }
	    if (!Fn.isValidNot0(num))
	        throw new Error('invalid private key: out of range [1..N-1]');
	    return num;
	}
	/**
	 * Creates weierstrass Point constructor, based on specified curve options.
	 *
	 * @example
	```js
	const opts = {
	  p: BigInt('0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff'),
	  n: BigInt('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551'),
	  h: BigInt(1),
	  a: BigInt('0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc'),
	  b: BigInt('0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b'),
	  Gx: BigInt('0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296'),
	  Gy: BigInt('0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5'),
	};
	const p256_Point = weierstrass(opts);
	```
	 */
	function weierstrassN(params, extraOpts = {}) {
	    const validated = _createCurveFields('weierstrass', params, extraOpts);
	    const { Fp, Fn } = validated;
	    let CURVE = validated.CURVE;
	    const { h: cofactor, n: CURVE_ORDER } = CURVE;
	    _validateObject(extraOpts, {}, {
	        allowInfinityPoint: 'boolean',
	        clearCofactor: 'function',
	        isTorsionFree: 'function',
	        fromBytes: 'function',
	        toBytes: 'function',
	        endo: 'object',
	        wrapPrivateKey: 'boolean',
	    });
	    const { endo } = extraOpts;
	    if (endo) {
	        // validateObject(endo, { beta: 'bigint', splitScalar: 'function' });
	        if (!Fp.is0(CURVE.a) || typeof endo.beta !== 'bigint' || !Array.isArray(endo.basises)) {
	            throw new Error('invalid endo: expected "beta": bigint and "basises": array');
	        }
	    }
	    const lengths = getWLengths(Fp, Fn);
	    function assertCompressionIsSupported() {
	        if (!Fp.isOdd)
	            throw new Error('compression is not supported: Field does not have .isOdd()');
	    }
	    // Implements IEEE P1363 point encoding
	    function pointToBytes(_c, point, isCompressed) {
	        const { x, y } = point.toAffine();
	        const bx = Fp.toBytes(x);
	        _abool2(isCompressed, 'isCompressed');
	        if (isCompressed) {
	            assertCompressionIsSupported();
	            const hasEvenY = !Fp.isOdd(y);
	            return concatBytes(pprefix(hasEvenY), bx);
	        }
	        else {
	            return concatBytes(Uint8Array.of(0x04), bx, Fp.toBytes(y));
	        }
	    }
	    function pointFromBytes(bytes) {
	        _abytes2(bytes, undefined, 'Point');
	        const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths; // e.g. for 32-byte: 33, 65
	        const length = bytes.length;
	        const head = bytes[0];
	        const tail = bytes.subarray(1);
	        // No actual validation is done here: use .assertValidity()
	        if (length === comp && (head === 0x02 || head === 0x03)) {
	            const x = Fp.fromBytes(tail);
	            if (!Fp.isValid(x))
	                throw new Error('bad point: is not on curve, wrong x');
	            const y2 = weierstrassEquation(x); // y² = x³ + ax + b
	            let y;
	            try {
	                y = Fp.sqrt(y2); // y = y² ^ (p+1)/4
	            }
	            catch (sqrtError) {
	                const err = sqrtError instanceof Error ? ': ' + sqrtError.message : '';
	                throw new Error('bad point: is not on curve, sqrt error' + err);
	            }
	            assertCompressionIsSupported();
	            const isYOdd = Fp.isOdd(y); // (y & _1n) === _1n;
	            const isHeadOdd = (head & 1) === 1; // ECDSA-specific
	            if (isHeadOdd !== isYOdd)
	                y = Fp.neg(y);
	            return { x, y };
	        }
	        else if (length === uncomp && head === 0x04) {
	            // TODO: more checks
	            const L = Fp.BYTES;
	            const x = Fp.fromBytes(tail.subarray(0, L));
	            const y = Fp.fromBytes(tail.subarray(L, L * 2));
	            if (!isValidXY(x, y))
	                throw new Error('bad point: is not on curve');
	            return { x, y };
	        }
	        else {
	            throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
	        }
	    }
	    const encodePoint = extraOpts.toBytes || pointToBytes;
	    const decodePoint = extraOpts.fromBytes || pointFromBytes;
	    function weierstrassEquation(x) {
	        const x2 = Fp.sqr(x); // x * x
	        const x3 = Fp.mul(x2, x); // x² * x
	        return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b); // x³ + a * x + b
	    }
	    // TODO: move top-level
	    /** Checks whether equation holds for given x, y: y² == x³ + ax + b */
	    function isValidXY(x, y) {
	        const left = Fp.sqr(y); // y²
	        const right = weierstrassEquation(x); // x³ + ax + b
	        return Fp.eql(left, right);
	    }
	    // Validate whether the passed curve params are valid.
	    // Test 1: equation y² = x³ + ax + b should work for generator point.
	    if (!isValidXY(CURVE.Gx, CURVE.Gy))
	        throw new Error('bad curve params: generator point');
	    // Test 2: discriminant Δ part should be non-zero: 4a³ + 27b² != 0.
	    // Guarantees curve is genus-1, smooth (non-singular).
	    const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n), _4n);
	    const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
	    if (Fp.is0(Fp.add(_4a3, _27b2)))
	        throw new Error('bad curve params: a or b');
	    /** Asserts coordinate is valid: 0 <= n < Fp.ORDER. */
	    function acoord(title, n, banZero = false) {
	        if (!Fp.isValid(n) || (banZero && Fp.is0(n)))
	            throw new Error(`bad point coordinate ${title}`);
	        return n;
	    }
	    function aprjpoint(other) {
	        if (!(other instanceof Point))
	            throw new Error('ProjectivePoint expected');
	    }
	    function splitEndoScalarN(k) {
	        if (!endo || !endo.basises)
	            throw new Error('no endo');
	        return _splitEndoScalar(k, endo.basises, Fn.ORDER);
	    }
	    // Memoized toAffine / validity check. They are heavy. Points are immutable.
	    // Converts Projective point to affine (x, y) coordinates.
	    // Can accept precomputed Z^-1 - for example, from invertBatch.
	    // (X, Y, Z) ∋ (x=X/Z, y=Y/Z)
	    const toAffineMemo = memoized((p, iz) => {
	        const { X, Y, Z } = p;
	        // Fast-path for normalized points
	        if (Fp.eql(Z, Fp.ONE))
	            return { x: X, y: Y };
	        const is0 = p.is0();
	        // If invZ was 0, we return zero point. However we still want to execute
	        // all operations, so we replace invZ with a random number, 1.
	        if (iz == null)
	            iz = is0 ? Fp.ONE : Fp.inv(Z);
	        const x = Fp.mul(X, iz);
	        const y = Fp.mul(Y, iz);
	        const zz = Fp.mul(Z, iz);
	        if (is0)
	            return { x: Fp.ZERO, y: Fp.ZERO };
	        if (!Fp.eql(zz, Fp.ONE))
	            throw new Error('invZ was invalid');
	        return { x, y };
	    });
	    // NOTE: on exception this will crash 'cached' and no value will be set.
	    // Otherwise true will be return
	    const assertValidMemo = memoized((p) => {
	        if (p.is0()) {
	            // (0, 1, 0) aka ZERO is invalid in most contexts.
	            // In BLS, ZERO can be serialized, so we allow it.
	            // (0, 0, 0) is invalid representation of ZERO.
	            if (extraOpts.allowInfinityPoint && !Fp.is0(p.Y))
	                return;
	            throw new Error('bad point: ZERO');
	        }
	        // Some 3rd-party test vectors require different wording between here & `fromCompressedHex`
	        const { x, y } = p.toAffine();
	        if (!Fp.isValid(x) || !Fp.isValid(y))
	            throw new Error('bad point: x or y not field elements');
	        if (!isValidXY(x, y))
	            throw new Error('bad point: equation left != right');
	        if (!p.isTorsionFree())
	            throw new Error('bad point: not in prime-order subgroup');
	        return true;
	    });
	    function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
	        k2p = new Point(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
	        k1p = negateCt(k1neg, k1p);
	        k2p = negateCt(k2neg, k2p);
	        return k1p.add(k2p);
	    }
	    /**
	     * Projective Point works in 3d / projective (homogeneous) coordinates:(X, Y, Z) ∋ (x=X/Z, y=Y/Z).
	     * Default Point works in 2d / affine coordinates: (x, y).
	     * We're doing calculations in projective, because its operations don't require costly inversion.
	     */
	    class Point {
	        /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
	        constructor(X, Y, Z) {
	            this.X = acoord('x', X);
	            this.Y = acoord('y', Y, true);
	            this.Z = acoord('z', Z);
	            Object.freeze(this);
	        }
	        static CURVE() {
	            return CURVE;
	        }
	        /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
	        static fromAffine(p) {
	            const { x, y } = p || {};
	            if (!p || !Fp.isValid(x) || !Fp.isValid(y))
	                throw new Error('invalid affine point');
	            if (p instanceof Point)
	                throw new Error('projective point not allowed');
	            // (0, 0) would've produced (0, 0, 1) - instead, we need (0, 1, 0)
	            if (Fp.is0(x) && Fp.is0(y))
	                return Point.ZERO;
	            return new Point(x, y, Fp.ONE);
	        }
	        static fromBytes(bytes) {
	            const P = Point.fromAffine(decodePoint(_abytes2(bytes, undefined, 'point')));
	            P.assertValidity();
	            return P;
	        }
	        static fromHex(hex) {
	            return Point.fromBytes(ensureBytes('pointHex', hex));
	        }
	        get x() {
	            return this.toAffine().x;
	        }
	        get y() {
	            return this.toAffine().y;
	        }
	        /**
	         *
	         * @param windowSize
	         * @param isLazy true will defer table computation until the first multiplication
	         * @returns
	         */
	        precompute(windowSize = 8, isLazy = true) {
	            wnaf.createCache(this, windowSize);
	            if (!isLazy)
	                this.multiply(_3n); // random number
	            return this;
	        }
	        // TODO: return `this`
	        /** A point on curve is valid if it conforms to equation. */
	        assertValidity() {
	            assertValidMemo(this);
	        }
	        hasEvenY() {
	            const { y } = this.toAffine();
	            if (!Fp.isOdd)
	                throw new Error("Field doesn't support isOdd");
	            return !Fp.isOdd(y);
	        }
	        /** Compare one point to another. */
	        equals(other) {
	            aprjpoint(other);
	            const { X: X1, Y: Y1, Z: Z1 } = this;
	            const { X: X2, Y: Y2, Z: Z2 } = other;
	            const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
	            const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
	            return U1 && U2;
	        }
	        /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
	        negate() {
	            return new Point(this.X, Fp.neg(this.Y), this.Z);
	        }
	        // Renes-Costello-Batina exception-free doubling formula.
	        // There is 30% faster Jacobian formula, but it is not complete.
	        // https://eprint.iacr.org/2015/1060, algorithm 3
	        // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
	        double() {
	            const { a, b } = CURVE;
	            const b3 = Fp.mul(b, _3n);
	            const { X: X1, Y: Y1, Z: Z1 } = this;
	            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
	            let t0 = Fp.mul(X1, X1); // step 1
	            let t1 = Fp.mul(Y1, Y1);
	            let t2 = Fp.mul(Z1, Z1);
	            let t3 = Fp.mul(X1, Y1);
	            t3 = Fp.add(t3, t3); // step 5
	            Z3 = Fp.mul(X1, Z1);
	            Z3 = Fp.add(Z3, Z3);
	            X3 = Fp.mul(a, Z3);
	            Y3 = Fp.mul(b3, t2);
	            Y3 = Fp.add(X3, Y3); // step 10
	            X3 = Fp.sub(t1, Y3);
	            Y3 = Fp.add(t1, Y3);
	            Y3 = Fp.mul(X3, Y3);
	            X3 = Fp.mul(t3, X3);
	            Z3 = Fp.mul(b3, Z3); // step 15
	            t2 = Fp.mul(a, t2);
	            t3 = Fp.sub(t0, t2);
	            t3 = Fp.mul(a, t3);
	            t3 = Fp.add(t3, Z3);
	            Z3 = Fp.add(t0, t0); // step 20
	            t0 = Fp.add(Z3, t0);
	            t0 = Fp.add(t0, t2);
	            t0 = Fp.mul(t0, t3);
	            Y3 = Fp.add(Y3, t0);
	            t2 = Fp.mul(Y1, Z1); // step 25
	            t2 = Fp.add(t2, t2);
	            t0 = Fp.mul(t2, t3);
	            X3 = Fp.sub(X3, t0);
	            Z3 = Fp.mul(t2, t1);
	            Z3 = Fp.add(Z3, Z3); // step 30
	            Z3 = Fp.add(Z3, Z3);
	            return new Point(X3, Y3, Z3);
	        }
	        // Renes-Costello-Batina exception-free addition formula.
	        // There is 30% faster Jacobian formula, but it is not complete.
	        // https://eprint.iacr.org/2015/1060, algorithm 1
	        // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
	        add(other) {
	            aprjpoint(other);
	            const { X: X1, Y: Y1, Z: Z1 } = this;
	            const { X: X2, Y: Y2, Z: Z2 } = other;
	            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
	            const a = CURVE.a;
	            const b3 = Fp.mul(CURVE.b, _3n);
	            let t0 = Fp.mul(X1, X2); // step 1
	            let t1 = Fp.mul(Y1, Y2);
	            let t2 = Fp.mul(Z1, Z2);
	            let t3 = Fp.add(X1, Y1);
	            let t4 = Fp.add(X2, Y2); // step 5
	            t3 = Fp.mul(t3, t4);
	            t4 = Fp.add(t0, t1);
	            t3 = Fp.sub(t3, t4);
	            t4 = Fp.add(X1, Z1);
	            let t5 = Fp.add(X2, Z2); // step 10
	            t4 = Fp.mul(t4, t5);
	            t5 = Fp.add(t0, t2);
	            t4 = Fp.sub(t4, t5);
	            t5 = Fp.add(Y1, Z1);
	            X3 = Fp.add(Y2, Z2); // step 15
	            t5 = Fp.mul(t5, X3);
	            X3 = Fp.add(t1, t2);
	            t5 = Fp.sub(t5, X3);
	            Z3 = Fp.mul(a, t4);
	            X3 = Fp.mul(b3, t2); // step 20
	            Z3 = Fp.add(X3, Z3);
	            X3 = Fp.sub(t1, Z3);
	            Z3 = Fp.add(t1, Z3);
	            Y3 = Fp.mul(X3, Z3);
	            t1 = Fp.add(t0, t0); // step 25
	            t1 = Fp.add(t1, t0);
	            t2 = Fp.mul(a, t2);
	            t4 = Fp.mul(b3, t4);
	            t1 = Fp.add(t1, t2);
	            t2 = Fp.sub(t0, t2); // step 30
	            t2 = Fp.mul(a, t2);
	            t4 = Fp.add(t4, t2);
	            t0 = Fp.mul(t1, t4);
	            Y3 = Fp.add(Y3, t0);
	            t0 = Fp.mul(t5, t4); // step 35
	            X3 = Fp.mul(t3, X3);
	            X3 = Fp.sub(X3, t0);
	            t0 = Fp.mul(t3, t1);
	            Z3 = Fp.mul(t5, Z3);
	            Z3 = Fp.add(Z3, t0); // step 40
	            return new Point(X3, Y3, Z3);
	        }
	        subtract(other) {
	            return this.add(other.negate());
	        }
	        is0() {
	            return this.equals(Point.ZERO);
	        }
	        /**
	         * Constant time multiplication.
	         * Uses wNAF method. Windowed method may be 10% faster,
	         * but takes 2x longer to generate and consumes 2x memory.
	         * Uses precomputes when available.
	         * Uses endomorphism for Koblitz curves.
	         * @param scalar by which the point would be multiplied
	         * @returns New point
	         */
	        multiply(scalar) {
	            const { endo } = extraOpts;
	            if (!Fn.isValidNot0(scalar))
	                throw new Error('invalid scalar: out of range'); // 0 is invalid
	            let point, fake; // Fake point is used to const-time mult
	            const mul = (n) => wnaf.cached(this, n, (p) => normalizeZ(Point, p));
	            /** See docs for {@link EndomorphismOpts} */
	            if (endo) {
	                const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
	                const { p: k1p, f: k1f } = mul(k1);
	                const { p: k2p, f: k2f } = mul(k2);
	                fake = k1f.add(k2f);
	                point = finishEndo(endo.beta, k1p, k2p, k1neg, k2neg);
	            }
	            else {
	                const { p, f } = mul(scalar);
	                point = p;
	                fake = f;
	            }
	            // Normalize `z` for both points, but return only real one
	            return normalizeZ(Point, [point, fake])[0];
	        }
	        /**
	         * Non-constant-time multiplication. Uses double-and-add algorithm.
	         * It's faster, but should only be used when you don't care about
	         * an exposed secret key e.g. sig verification, which works over *public* keys.
	         */
	        multiplyUnsafe(sc) {
	            const { endo } = extraOpts;
	            const p = this;
	            if (!Fn.isValid(sc))
	                throw new Error('invalid scalar: out of range'); // 0 is valid
	            if (sc === _0n$1 || p.is0())
	                return Point.ZERO;
	            if (sc === _1n$1)
	                return p; // fast-path
	            if (wnaf.hasCache(this))
	                return this.multiply(sc);
	            if (endo) {
	                const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
	                const { p1, p2 } = mulEndoUnsafe(Point, p, k1, k2); // 30% faster vs wnaf.unsafe
	                return finishEndo(endo.beta, p1, p2, k1neg, k2neg);
	            }
	            else {
	                return wnaf.unsafe(p, sc);
	            }
	        }
	        multiplyAndAddUnsafe(Q, a, b) {
	            const sum = this.multiplyUnsafe(a).add(Q.multiplyUnsafe(b));
	            return sum.is0() ? undefined : sum;
	        }
	        /**
	         * Converts Projective point to affine (x, y) coordinates.
	         * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
	         */
	        toAffine(invertedZ) {
	            return toAffineMemo(this, invertedZ);
	        }
	        /**
	         * Checks whether Point is free of torsion elements (is in prime subgroup).
	         * Always torsion-free for cofactor=1 curves.
	         */
	        isTorsionFree() {
	            const { isTorsionFree } = extraOpts;
	            if (cofactor === _1n$1)
	                return true;
	            if (isTorsionFree)
	                return isTorsionFree(Point, this);
	            return wnaf.unsafe(this, CURVE_ORDER).is0();
	        }
	        clearCofactor() {
	            const { clearCofactor } = extraOpts;
	            if (cofactor === _1n$1)
	                return this; // Fast-path
	            if (clearCofactor)
	                return clearCofactor(Point, this);
	            return this.multiplyUnsafe(cofactor);
	        }
	        isSmallOrder() {
	            // can we use this.clearCofactor()?
	            return this.multiplyUnsafe(cofactor).is0();
	        }
	        toBytes(isCompressed = true) {
	            _abool2(isCompressed, 'isCompressed');
	            this.assertValidity();
	            return encodePoint(Point, this, isCompressed);
	        }
	        toHex(isCompressed = true) {
	            return bytesToHex(this.toBytes(isCompressed));
	        }
	        toString() {
	            return `<Point ${this.is0() ? 'ZERO' : this.toHex()}>`;
	        }
	        // TODO: remove
	        get px() {
	            return this.X;
	        }
	        get py() {
	            return this.X;
	        }
	        get pz() {
	            return this.Z;
	        }
	        toRawBytes(isCompressed = true) {
	            return this.toBytes(isCompressed);
	        }
	        _setWindowSize(windowSize) {
	            this.precompute(windowSize);
	        }
	        static normalizeZ(points) {
	            return normalizeZ(Point, points);
	        }
	        static msm(points, scalars) {
	            return pippenger(Point, Fn, points, scalars);
	        }
	        static fromPrivateKey(privateKey) {
	            return Point.BASE.multiply(_normFnElement(Fn, privateKey));
	        }
	    }
	    // base / generator point
	    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
	    // zero / infinity / identity point
	    Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO); // 0, 1, 0
	    // math field
	    Point.Fp = Fp;
	    // scalar field
	    Point.Fn = Fn;
	    const bits = Fn.BITS;
	    const wnaf = new wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
	    Point.BASE.precompute(8); // Enable precomputes. Slows down first publicKey computation by 20ms.
	    return Point;
	}
	// Points start with byte 0x02 when y is even; otherwise 0x03
	function pprefix(hasEvenY) {
	    return Uint8Array.of(hasEvenY ? 0x02 : 0x03);
	}
	function getWLengths(Fp, Fn) {
	    return {
	        secretKey: Fn.BYTES,
	        publicKey: 1 + Fp.BYTES,
	        publicKeyUncompressed: 1 + 2 * Fp.BYTES,
	        publicKeyHasPrefix: true,
	        signature: 2 * Fn.BYTES,
	    };
	}
	/**
	 * Sometimes users only need getPublicKey, getSharedSecret, and secret key handling.
	 * This helper ensures no signature functionality is present. Less code, smaller bundle size.
	 */
	function ecdh(Point, ecdhOpts = {}) {
	    const { Fn } = Point;
	    const randomBytes_ = ecdhOpts.randomBytes || randomBytes;
	    const lengths = Object.assign(getWLengths(Point.Fp, Fn), { seed: getMinHashLength(Fn.ORDER) });
	    function isValidSecretKey(secretKey) {
	        try {
	            return !!_normFnElement(Fn, secretKey);
	        }
	        catch (error) {
	            return false;
	        }
	    }
	    function isValidPublicKey(publicKey, isCompressed) {
	        const { publicKey: comp, publicKeyUncompressed } = lengths;
	        try {
	            const l = publicKey.length;
	            if (isCompressed === true && l !== comp)
	                return false;
	            if (isCompressed === false && l !== publicKeyUncompressed)
	                return false;
	            return !!Point.fromBytes(publicKey);
	        }
	        catch (error) {
	            return false;
	        }
	    }
	    /**
	     * Produces cryptographically secure secret key from random of size
	     * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
	     */
	    function randomSecretKey(seed = randomBytes_(lengths.seed)) {
	        return mapHashToField(_abytes2(seed, lengths.seed, 'seed'), Fn.ORDER);
	    }
	    /**
	     * Computes public key for a secret key. Checks for validity of the secret key.
	     * @param isCompressed whether to return compact (default), or full key
	     * @returns Public key, full when isCompressed=false; short when isCompressed=true
	     */
	    function getPublicKey(secretKey, isCompressed = true) {
	        return Point.BASE.multiply(_normFnElement(Fn, secretKey)).toBytes(isCompressed);
	    }
	    function keygen(seed) {
	        const secretKey = randomSecretKey(seed);
	        return { secretKey, publicKey: getPublicKey(secretKey) };
	    }
	    /**
	     * Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
	     */
	    function isProbPub(item) {
	        if (typeof item === 'bigint')
	            return false;
	        if (item instanceof Point)
	            return true;
	        const { secretKey, publicKey, publicKeyUncompressed } = lengths;
	        if (Fn.allowedLengths || secretKey === publicKey)
	            return undefined;
	        const l = ensureBytes('key', item).length;
	        return l === publicKey || l === publicKeyUncompressed;
	    }
	    /**
	     * ECDH (Elliptic Curve Diffie Hellman).
	     * Computes shared public key from secret key A and public key B.
	     * Checks: 1) secret key validity 2) shared key is on-curve.
	     * Does NOT hash the result.
	     * @param isCompressed whether to return compact (default), or full key
	     * @returns shared public key
	     */
	    function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
	        if (isProbPub(secretKeyA) === true)
	            throw new Error('first arg must be private key');
	        if (isProbPub(publicKeyB) === false)
	            throw new Error('second arg must be public key');
	        const s = _normFnElement(Fn, secretKeyA);
	        const b = Point.fromHex(publicKeyB); // checks for being on-curve
	        return b.multiply(s).toBytes(isCompressed);
	    }
	    const utils = {
	        isValidSecretKey,
	        isValidPublicKey,
	        randomSecretKey,
	        // TODO: remove
	        isValidPrivateKey: isValidSecretKey,
	        randomPrivateKey: randomSecretKey,
	        normPrivateKeyToScalar: (key) => _normFnElement(Fn, key),
	        precompute(windowSize = 8, point = Point.BASE) {
	            return point.precompute(windowSize, false);
	        },
	    };
	    return Object.freeze({ getPublicKey, getSharedSecret, keygen, Point, utils, lengths });
	}
	/**
	 * Creates ECDSA signing interface for given elliptic curve `Point` and `hash` function.
	 * We need `hash` for 2 features:
	 * 1. Message prehash-ing. NOT used if `sign` / `verify` are called with `prehash: false`
	 * 2. k generation in `sign`, using HMAC-drbg(hash)
	 *
	 * ECDSAOpts are only rarely needed.
	 *
	 * @example
	 * ```js
	 * const p256_Point = weierstrass(...);
	 * const p256_sha256 = ecdsa(p256_Point, sha256);
	 * const p256_sha224 = ecdsa(p256_Point, sha224);
	 * const p256_sha224_r = ecdsa(p256_Point, sha224, { randomBytes: (length) => { ... } });
	 * ```
	 */
	function ecdsa(Point, hash, ecdsaOpts = {}) {
	    ahash(hash);
	    _validateObject(ecdsaOpts, {}, {
	        hmac: 'function',
	        lowS: 'boolean',
	        randomBytes: 'function',
	        bits2int: 'function',
	        bits2int_modN: 'function',
	    });
	    const randomBytes$1 = ecdsaOpts.randomBytes || randomBytes;
	    const hmac$1 = ecdsaOpts.hmac ||
	        ((key, ...msgs) => hmac(hash, key, concatBytes(...msgs)));
	    const { Fp, Fn } = Point;
	    const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn;
	    const { keygen, getPublicKey, getSharedSecret, utils, lengths } = ecdh(Point, ecdsaOpts);
	    const defaultSigOpts = {
	        prehash: false,
	        lowS: typeof ecdsaOpts.lowS === 'boolean' ? ecdsaOpts.lowS : false,
	        format: undefined, //'compact' as ECDSASigFormat,
	        extraEntropy: false,
	    };
	    const defaultSigOpts_format = 'compact';
	    function isBiggerThanHalfOrder(number) {
	        const HALF = CURVE_ORDER >> _1n$1;
	        return number > HALF;
	    }
	    function validateRS(title, num) {
	        if (!Fn.isValidNot0(num))
	            throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
	        return num;
	    }
	    function validateSigLength(bytes, format) {
	        validateSigFormat(format);
	        const size = lengths.signature;
	        const sizer = format === 'compact' ? size : format === 'recovered' ? size + 1 : undefined;
	        return _abytes2(bytes, sizer, `${format} signature`);
	    }
	    /**
	     * ECDSA signature with its (r, s) properties. Supports compact, recovered & DER representations.
	     */
	    class Signature {
	        constructor(r, s, recovery) {
	            this.r = validateRS('r', r); // r in [1..N-1];
	            this.s = validateRS('s', s); // s in [1..N-1];
	            if (recovery != null)
	                this.recovery = recovery;
	            Object.freeze(this);
	        }
	        static fromBytes(bytes, format = defaultSigOpts_format) {
	            validateSigLength(bytes, format);
	            let recid;
	            if (format === 'der') {
	                const { r, s } = DER.toSig(_abytes2(bytes));
	                return new Signature(r, s);
	            }
	            if (format === 'recovered') {
	                recid = bytes[0];
	                format = 'compact';
	                bytes = bytes.subarray(1);
	            }
	            const L = Fn.BYTES;
	            const r = bytes.subarray(0, L);
	            const s = bytes.subarray(L, L * 2);
	            return new Signature(Fn.fromBytes(r), Fn.fromBytes(s), recid);
	        }
	        static fromHex(hex, format) {
	            return this.fromBytes(hexToBytes(hex), format);
	        }
	        addRecoveryBit(recovery) {
	            return new Signature(this.r, this.s, recovery);
	        }
	        recoverPublicKey(messageHash) {
	            const FIELD_ORDER = Fp.ORDER;
	            const { r, s, recovery: rec } = this;
	            if (rec == null || ![0, 1, 2, 3].includes(rec))
	                throw new Error('recovery id invalid');
	            // ECDSA recovery is hard for cofactor > 1 curves.
	            // In sign, `r = q.x mod n`, and here we recover q.x from r.
	            // While recovering q.x >= n, we need to add r+n for cofactor=1 curves.
	            // However, for cofactor>1, r+n may not get q.x:
	            // r+n*i would need to be done instead where i is unknown.
	            // To easily get i, we either need to:
	            // a. increase amount of valid recid values (4, 5...); OR
	            // b. prohibit non-prime-order signatures (recid > 1).
	            const hasCofactor = CURVE_ORDER * _2n$1 < FIELD_ORDER;
	            if (hasCofactor && rec > 1)
	                throw new Error('recovery id is ambiguous for h>1 curve');
	            const radj = rec === 2 || rec === 3 ? r + CURVE_ORDER : r;
	            if (!Fp.isValid(radj))
	                throw new Error('recovery id 2 or 3 invalid');
	            const x = Fp.toBytes(radj);
	            const R = Point.fromBytes(concatBytes(pprefix((rec & 1) === 0), x));
	            const ir = Fn.inv(radj); // r^-1
	            const h = bits2int_modN(ensureBytes('msgHash', messageHash)); // Truncate hash
	            const u1 = Fn.create(-h * ir); // -hr^-1
	            const u2 = Fn.create(s * ir); // sr^-1
	            // (sr^-1)R-(hr^-1)G = -(hr^-1)G + (sr^-1). unsafe is fine: there is no private data.
	            const Q = Point.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
	            if (Q.is0())
	                throw new Error('point at infinify');
	            Q.assertValidity();
	            return Q;
	        }
	        // Signatures should be low-s, to prevent malleability.
	        hasHighS() {
	            return isBiggerThanHalfOrder(this.s);
	        }
	        toBytes(format = defaultSigOpts_format) {
	            validateSigFormat(format);
	            if (format === 'der')
	                return hexToBytes(DER.hexFromSig(this));
	            const r = Fn.toBytes(this.r);
	            const s = Fn.toBytes(this.s);
	            if (format === 'recovered') {
	                if (this.recovery == null)
	                    throw new Error('recovery bit must be present');
	                return concatBytes(Uint8Array.of(this.recovery), r, s);
	            }
	            return concatBytes(r, s);
	        }
	        toHex(format) {
	            return bytesToHex(this.toBytes(format));
	        }
	        // TODO: remove
	        assertValidity() { }
	        static fromCompact(hex) {
	            return Signature.fromBytes(ensureBytes('sig', hex), 'compact');
	        }
	        static fromDER(hex) {
	            return Signature.fromBytes(ensureBytes('sig', hex), 'der');
	        }
	        normalizeS() {
	            return this.hasHighS() ? new Signature(this.r, Fn.neg(this.s), this.recovery) : this;
	        }
	        toDERRawBytes() {
	            return this.toBytes('der');
	        }
	        toDERHex() {
	            return bytesToHex(this.toBytes('der'));
	        }
	        toCompactRawBytes() {
	            return this.toBytes('compact');
	        }
	        toCompactHex() {
	            return bytesToHex(this.toBytes('compact'));
	        }
	    }
	    // RFC6979: ensure ECDSA msg is X bytes and < N. RFC suggests optional truncating via bits2octets.
	    // FIPS 186-4 4.6 suggests the leftmost min(nBitLen, outLen) bits, which matches bits2int.
	    // bits2int can produce res>N, we can do mod(res, N) since the bitLen is the same.
	    // int2octets can't be used; pads small msgs with 0: unacceptatble for trunc as per RFC vectors
	    const bits2int = ecdsaOpts.bits2int ||
	        function bits2int_def(bytes) {
	            // Our custom check "just in case", for protection against DoS
	            if (bytes.length > 8192)
	                throw new Error('input is too large');
	            // For curves with nBitLength % 8 !== 0: bits2octets(bits2octets(m)) !== bits2octets(m)
	            // for some cases, since bytes.length * 8 is not actual bitLength.
	            const num = bytesToNumberBE(bytes); // check for == u8 done here
	            const delta = bytes.length * 8 - fnBits; // truncate to nBitLength leftmost bits
	            return delta > 0 ? num >> BigInt(delta) : num;
	        };
	    const bits2int_modN = ecdsaOpts.bits2int_modN ||
	        function bits2int_modN_def(bytes) {
	            return Fn.create(bits2int(bytes)); // can't use bytesToNumberBE here
	        };
	    // Pads output with zero as per spec
	    const ORDER_MASK = bitMask(fnBits);
	    /** Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`. */
	    function int2octets(num) {
	        // IMPORTANT: the check ensures working for case `Fn.BYTES != Fn.BITS * 8`
	        aInRange('num < 2^' + fnBits, num, _0n$1, ORDER_MASK);
	        return Fn.toBytes(num);
	    }
	    function validateMsgAndHash(message, prehash) {
	        _abytes2(message, undefined, 'message');
	        return prehash ? _abytes2(hash(message), undefined, 'prehashed message') : message;
	    }
	    /**
	     * Steps A, D of RFC6979 3.2.
	     * Creates RFC6979 seed; converts msg/privKey to numbers.
	     * Used only in sign, not in verify.
	     *
	     * Warning: we cannot assume here that message has same amount of bytes as curve order,
	     * this will be invalid at least for P521. Also it can be bigger for P224 + SHA256.
	     */
	    function prepSig(message, privateKey, opts) {
	        if (['recovered', 'canonical'].some((k) => k in opts))
	            throw new Error('sign() legacy options not supported');
	        const { lowS, prehash, extraEntropy } = validateSigOpts(opts, defaultSigOpts);
	        message = validateMsgAndHash(message, prehash); // RFC6979 3.2 A: h1 = H(m)
	        // We can't later call bits2octets, since nested bits2int is broken for curves
	        // with fnBits % 8 !== 0. Because of that, we unwrap it here as int2octets call.
	        // const bits2octets = (bits) => int2octets(bits2int_modN(bits))
	        const h1int = bits2int_modN(message);
	        const d = _normFnElement(Fn, privateKey); // validate secret key, convert to bigint
	        const seedArgs = [int2octets(d), int2octets(h1int)];
	        // extraEntropy. RFC6979 3.6: additional k' (optional).
	        if (extraEntropy != null && extraEntropy !== false) {
	            // K = HMAC_K(V || 0x00 || int2octets(x) || bits2octets(h1) || k')
	            // gen random bytes OR pass as-is
	            const e = extraEntropy === true ? randomBytes$1(lengths.secretKey) : extraEntropy;
	            seedArgs.push(ensureBytes('extraEntropy', e)); // check for being bytes
	        }
	        const seed = concatBytes(...seedArgs); // Step D of RFC6979 3.2
	        const m = h1int; // NOTE: no need to call bits2int second time here, it is inside truncateHash!
	        // Converts signature params into point w r/s, checks result for validity.
	        // To transform k => Signature:
	        // q = k⋅G
	        // r = q.x mod n
	        // s = k^-1(m + rd) mod n
	        // Can use scalar blinding b^-1(bm + bdr) where b ∈ [1,q−1] according to
	        // https://tches.iacr.org/index.php/TCHES/article/view/7337/6509. We've decided against it:
	        // a) dependency on CSPRNG b) 15% slowdown c) doesn't really help since bigints are not CT
	        function k2sig(kBytes) {
	            // RFC 6979 Section 3.2, step 3: k = bits2int(T)
	            // Important: all mod() calls here must be done over N
	            const k = bits2int(kBytes); // mod n, not mod p
	            if (!Fn.isValidNot0(k))
	                return; // Valid scalars (including k) must be in 1..N-1
	            const ik = Fn.inv(k); // k^-1 mod n
	            const q = Point.BASE.multiply(k).toAffine(); // q = k⋅G
	            const r = Fn.create(q.x); // r = q.x mod n
	            if (r === _0n$1)
	                return;
	            const s = Fn.create(ik * Fn.create(m + r * d)); // Not using blinding here, see comment above
	            if (s === _0n$1)
	                return;
	            let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n$1); // recovery bit (2 or 3, when q.x > n)
	            let normS = s;
	            if (lowS && isBiggerThanHalfOrder(s)) {
	                normS = Fn.neg(s); // if lowS was passed, ensure s is always
	                recovery ^= 1; // // in the bottom half of N
	            }
	            return new Signature(r, normS, recovery); // use normS, not s
	        }
	        return { seed, k2sig };
	    }
	    /**
	     * Signs message hash with a secret key.
	     *
	     * ```
	     * sign(m, d) where
	     *   k = rfc6979_hmac_drbg(m, d)
	     *   (x, y) = G × k
	     *   r = x mod n
	     *   s = (m + dr) / k mod n
	     * ```
	     */
	    function sign(message, secretKey, opts = {}) {
	        message = ensureBytes('message', message);
	        const { seed, k2sig } = prepSig(message, secretKey, opts); // Steps A, D of RFC6979 3.2.
	        const drbg = createHmacDrbg(hash.outputLen, Fn.BYTES, hmac$1);
	        const sig = drbg(seed, k2sig); // Steps B, C, D, E, F, G
	        return sig;
	    }
	    function tryParsingSig(sg) {
	        // Try to deduce format
	        let sig = undefined;
	        const isHex = typeof sg === 'string' || isBytes(sg);
	        const isObj = !isHex &&
	            sg !== null &&
	            typeof sg === 'object' &&
	            typeof sg.r === 'bigint' &&
	            typeof sg.s === 'bigint';
	        if (!isHex && !isObj)
	            throw new Error('invalid signature, expected Uint8Array, hex string or Signature instance');
	        if (isObj) {
	            sig = new Signature(sg.r, sg.s);
	        }
	        else if (isHex) {
	            try {
	                sig = Signature.fromBytes(ensureBytes('sig', sg), 'der');
	            }
	            catch (derError) {
	                if (!(derError instanceof DER.Err))
	                    throw derError;
	            }
	            if (!sig) {
	                try {
	                    sig = Signature.fromBytes(ensureBytes('sig', sg), 'compact');
	                }
	                catch (error) {
	                    return false;
	                }
	            }
	        }
	        if (!sig)
	            return false;
	        return sig;
	    }
	    /**
	     * Verifies a signature against message and public key.
	     * Rejects lowS signatures by default: see {@link ECDSAVerifyOpts}.
	     * Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
	     *
	     * ```
	     * verify(r, s, h, P) where
	     *   u1 = hs^-1 mod n
	     *   u2 = rs^-1 mod n
	     *   R = u1⋅G + u2⋅P
	     *   mod(R.x, n) == r
	     * ```
	     */
	    function verify(signature, message, publicKey, opts = {}) {
	        const { lowS, prehash, format } = validateSigOpts(opts, defaultSigOpts);
	        publicKey = ensureBytes('publicKey', publicKey);
	        message = validateMsgAndHash(ensureBytes('message', message), prehash);
	        if ('strict' in opts)
	            throw new Error('options.strict was renamed to lowS');
	        const sig = format === undefined
	            ? tryParsingSig(signature)
	            : Signature.fromBytes(ensureBytes('sig', signature), format);
	        if (sig === false)
	            return false;
	        try {
	            const P = Point.fromBytes(publicKey);
	            if (lowS && sig.hasHighS())
	                return false;
	            const { r, s } = sig;
	            const h = bits2int_modN(message); // mod n, not mod p
	            const is = Fn.inv(s); // s^-1 mod n
	            const u1 = Fn.create(h * is); // u1 = hs^-1 mod n
	            const u2 = Fn.create(r * is); // u2 = rs^-1 mod n
	            const R = Point.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2)); // u1⋅G + u2⋅P
	            if (R.is0())
	                return false;
	            const v = Fn.create(R.x); // v = r.x mod n
	            return v === r;
	        }
	        catch (e) {
	            return false;
	        }
	    }
	    function recoverPublicKey(signature, message, opts = {}) {
	        const { prehash } = validateSigOpts(opts, defaultSigOpts);
	        message = validateMsgAndHash(message, prehash);
	        return Signature.fromBytes(signature, 'recovered').recoverPublicKey(message).toBytes();
	    }
	    return Object.freeze({
	        keygen,
	        getPublicKey,
	        getSharedSecret,
	        utils,
	        lengths,
	        Point,
	        sign,
	        verify,
	        recoverPublicKey,
	        Signature,
	        hash,
	    });
	}
	function _weierstrass_legacy_opts_to_new(c) {
	    const CURVE = {
	        a: c.a,
	        b: c.b,
	        p: c.Fp.ORDER,
	        n: c.n,
	        h: c.h,
	        Gx: c.Gx,
	        Gy: c.Gy,
	    };
	    const Fp = c.Fp;
	    let allowedLengths = c.allowedPrivateKeyLengths
	        ? Array.from(new Set(c.allowedPrivateKeyLengths.map((l) => Math.ceil(l / 2))))
	        : undefined;
	    const Fn = Field(CURVE.n, {
	        BITS: c.nBitLength,
	        allowedLengths: allowedLengths,
	        modFromBytes: c.wrapPrivateKey,
	    });
	    const curveOpts = {
	        Fp,
	        Fn,
	        allowInfinityPoint: c.allowInfinityPoint,
	        endo: c.endo,
	        isTorsionFree: c.isTorsionFree,
	        clearCofactor: c.clearCofactor,
	        fromBytes: c.fromBytes,
	        toBytes: c.toBytes,
	    };
	    return { CURVE, curveOpts };
	}
	function _ecdsa_legacy_opts_to_new(c) {
	    const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c);
	    const ecdsaOpts = {
	        hmac: c.hmac,
	        randomBytes: c.randomBytes,
	        lowS: c.lowS,
	        bits2int: c.bits2int,
	        bits2int_modN: c.bits2int_modN,
	    };
	    return { CURVE, curveOpts, hash: c.hash, ecdsaOpts };
	}
	function _ecdsa_new_output_to_legacy(c, _ecdsa) {
	    const Point = _ecdsa.Point;
	    return Object.assign({}, _ecdsa, {
	        ProjectivePoint: Point,
	        CURVE: Object.assign({}, c, nLength(Point.Fn.ORDER, Point.Fn.BITS)),
	    });
	}
	// _ecdsa_legacy
	function weierstrass(c) {
	    const { CURVE, curveOpts, hash, ecdsaOpts } = _ecdsa_legacy_opts_to_new(c);
	    const Point = weierstrassN(CURVE, curveOpts);
	    const signs = ecdsa(Point, hash, ecdsaOpts);
	    return _ecdsa_new_output_to_legacy(c, signs);
	}

	/**
	 * Utilities for short weierstrass curves, combined with noble-hashes.
	 * @module
	 */
	/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	/** @deprecated use new `weierstrass()` and `ecdsa()` methods */
	function createCurve(curveDef, defHash) {
	    const create = (hash) => weierstrass({ ...curveDef, hash: hash });
	    return { ...create(defHash), create };
	}

	/**
	 * SECG secp256k1. See [pdf](https://www.secg.org/sec2-v2.pdf).
	 *
	 * Belongs to Koblitz curves: it has efficiently-computable GLV endomorphism ψ,
	 * check out {@link EndomorphismOpts}. Seems to be rigid (not backdoored).
	 * @module
	 */
	/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	// Seems like generator was produced from some seed:
	// `Point.BASE.multiply(Point.Fn.inv(2n, N)).toAffine().x`
	// // gives short x 0x3b78ce563f89a0ed9414f5aa28ad0d96d6795f9c63n
	const secp256k1_CURVE = {
	    p: BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f'),
	    n: BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141'),
	    h: BigInt(1),
	    a: BigInt(0),
	    b: BigInt(7),
	    Gx: BigInt('0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'),
	    Gy: BigInt('0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8'),
	};
	const secp256k1_ENDO = {
	    beta: BigInt('0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee'),
	    basises: [
	        [BigInt('0x3086d221a7d46bcde86c90e49284eb15'), -BigInt('0xe4437ed6010e88286f547fa90abfe4c3')],
	        [BigInt('0x114ca50f7a8e2f3f657c1108d9d44cfd8'), BigInt('0x3086d221a7d46bcde86c90e49284eb15')],
	    ],
	};
	const _0n = /* @__PURE__ */ BigInt(0);
	const _1n = /* @__PURE__ */ BigInt(1);
	const _2n = /* @__PURE__ */ BigInt(2);
	/**
	 * √n = n^((p+1)/4) for fields p = 3 mod 4. We unwrap the loop and multiply bit-by-bit.
	 * (P+1n/4n).toString(2) would produce bits [223x 1, 0, 22x 1, 4x 0, 11, 00]
	 */
	function sqrtMod(y) {
	    const P = secp256k1_CURVE.p;
	    // prettier-ignore
	    const _3n = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
	    // prettier-ignore
	    const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
	    const b2 = (y * y * y) % P; // x^3, 11
	    const b3 = (b2 * b2 * y) % P; // x^7
	    const b6 = (pow2(b3, _3n, P) * b3) % P;
	    const b9 = (pow2(b6, _3n, P) * b3) % P;
	    const b11 = (pow2(b9, _2n, P) * b2) % P;
	    const b22 = (pow2(b11, _11n, P) * b11) % P;
	    const b44 = (pow2(b22, _22n, P) * b22) % P;
	    const b88 = (pow2(b44, _44n, P) * b44) % P;
	    const b176 = (pow2(b88, _88n, P) * b88) % P;
	    const b220 = (pow2(b176, _44n, P) * b44) % P;
	    const b223 = (pow2(b220, _3n, P) * b3) % P;
	    const t1 = (pow2(b223, _23n, P) * b22) % P;
	    const t2 = (pow2(t1, _6n, P) * b2) % P;
	    const root = pow2(t2, _2n, P);
	    if (!Fpk1.eql(Fpk1.sqr(root), y))
	        throw new Error('Cannot find square root');
	    return root;
	}
	const Fpk1 = Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
	/**
	 * secp256k1 curve, ECDSA and ECDH methods.
	 *
	 * Field: `2n**256n - 2n**32n - 2n**9n - 2n**8n - 2n**7n - 2n**6n - 2n**4n - 1n`
	 *
	 * @example
	 * ```js
	 * import { secp256k1 } from '@noble/curves/secp256k1';
	 * const { secretKey, publicKey } = secp256k1.keygen();
	 * const msg = new TextEncoder().encode('hello');
	 * const sig = secp256k1.sign(msg, secretKey);
	 * const isValid = secp256k1.verify(sig, msg, publicKey) === true;
	 * ```
	 */
	const secp256k1 = createCurve({ ...secp256k1_CURVE, Fp: Fpk1, lowS: true, endo: secp256k1_ENDO }, sha256$1);
	// Schnorr signatures are superior to ECDSA from above. Below is Schnorr-specific BIP0340 code.
	// https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki
	/** An object mapping tags to their tagged hash prefix of [SHA256(tag) | SHA256(tag)] */
	const TAGGED_HASH_PREFIXES = {};
	function taggedHash(tag, ...messages) {
	    let tagP = TAGGED_HASH_PREFIXES[tag];
	    if (tagP === undefined) {
	        const tagH = sha256$1(utf8ToBytes(tag));
	        tagP = concatBytes(tagH, tagH);
	        TAGGED_HASH_PREFIXES[tag] = tagP;
	    }
	    return sha256$1(concatBytes(tagP, ...messages));
	}
	// ECDSA compact points are 33-byte. Schnorr is 32: we strip first byte 0x02 or 0x03
	const pointToBytes = (point) => point.toBytes(true).slice(1);
	const Pointk1 = /* @__PURE__ */ (() => secp256k1.Point)();
	const hasEven = (y) => y % _2n === _0n;
	// Calculate point, scalar and bytes
	function schnorrGetExtPubKey(priv) {
	    const { Fn, BASE } = Pointk1;
	    const d_ = _normFnElement(Fn, priv);
	    const p = BASE.multiply(d_); // P = d'⋅G; 0 < d' < n check is done inside
	    const scalar = hasEven(p.y) ? d_ : Fn.neg(d_);
	    return { scalar, bytes: pointToBytes(p) };
	}
	/**
	 * lift_x from BIP340. Convert 32-byte x coordinate to elliptic curve point.
	 * @returns valid point checked for being on-curve
	 */
	function lift_x(x) {
	    const Fp = Fpk1;
	    if (!Fp.isValidNot0(x))
	        throw new Error('invalid x: Fail if x ≥ p');
	    const xx = Fp.create(x * x);
	    const c = Fp.create(xx * x + BigInt(7)); // Let c = x³ + 7 mod p.
	    let y = Fp.sqrt(c); // Let y = c^(p+1)/4 mod p. Same as sqrt().
	    // Return the unique point P such that x(P) = x and
	    // y(P) = y if y mod 2 = 0 or y(P) = p-y otherwise.
	    if (!hasEven(y))
	        y = Fp.neg(y);
	    const p = Pointk1.fromAffine({ x, y });
	    p.assertValidity();
	    return p;
	}
	const num = bytesToNumberBE;
	/**
	 * Create tagged hash, convert it to bigint, reduce modulo-n.
	 */
	function challenge(...args) {
	    return Pointk1.Fn.create(num(taggedHash('BIP0340/challenge', ...args)));
	}
	/**
	 * Schnorr public key is just `x` coordinate of Point as per BIP340.
	 */
	function schnorrGetPublicKey(secretKey) {
	    return schnorrGetExtPubKey(secretKey).bytes; // d'=int(sk). Fail if d'=0 or d'≥n. Ret bytes(d'⋅G)
	}
	/**
	 * Creates Schnorr signature as per BIP340. Verifies itself before returning anything.
	 * auxRand is optional and is not the sole source of k generation: bad CSPRNG won't be dangerous.
	 */
	function schnorrSign(message, secretKey, auxRand = randomBytes(32)) {
	    const { Fn } = Pointk1;
	    const m = ensureBytes('message', message);
	    const { bytes: px, scalar: d } = schnorrGetExtPubKey(secretKey); // checks for isWithinCurveOrder
	    const a = ensureBytes('auxRand', auxRand, 32); // Auxiliary random data a: a 32-byte array
	    const t = Fn.toBytes(d ^ num(taggedHash('BIP0340/aux', a))); // Let t be the byte-wise xor of bytes(d) and hash/aux(a)
	    const rand = taggedHash('BIP0340/nonce', t, px, m); // Let rand = hash/nonce(t || bytes(P) || m)
	    // Let k' = int(rand) mod n. Fail if k' = 0. Let R = k'⋅G
	    const { bytes: rx, scalar: k } = schnorrGetExtPubKey(rand);
	    const e = challenge(rx, px, m); // Let e = int(hash/challenge(bytes(R) || bytes(P) || m)) mod n.
	    const sig = new Uint8Array(64); // Let sig = bytes(R) || bytes((k + ed) mod n).
	    sig.set(rx, 0);
	    sig.set(Fn.toBytes(Fn.create(k + e * d)), 32);
	    // If Verify(bytes(P), m, sig) (see below) returns failure, abort
	    if (!schnorrVerify(sig, m, px))
	        throw new Error('sign: Invalid signature produced');
	    return sig;
	}
	/**
	 * Verifies Schnorr signature.
	 * Will swallow errors & return false except for initial type validation of arguments.
	 */
	function schnorrVerify(signature, message, publicKey) {
	    const { Fn, BASE } = Pointk1;
	    const sig = ensureBytes('signature', signature, 64);
	    const m = ensureBytes('message', message);
	    const pub = ensureBytes('publicKey', publicKey, 32);
	    try {
	        const P = lift_x(num(pub)); // P = lift_x(int(pk)); fail if that fails
	        const r = num(sig.subarray(0, 32)); // Let r = int(sig[0:32]); fail if r ≥ p.
	        if (!inRange(r, _1n, secp256k1_CURVE.p))
	            return false;
	        const s = num(sig.subarray(32, 64)); // Let s = int(sig[32:64]); fail if s ≥ n.
	        if (!inRange(s, _1n, secp256k1_CURVE.n))
	            return false;
	        // int(challenge(bytes(r)||bytes(P)||m))%n
	        const e = challenge(Fn.toBytes(r), pointToBytes(P), m);
	        // R = s⋅G - e⋅P, where -eP == (n-e)P
	        const R = BASE.multiplyUnsafe(s).add(P.multiplyUnsafe(Fn.neg(e)));
	        const { x, y } = R.toAffine();
	        // Fail if is_infinite(R) / not has_even_y(R) / x(R) ≠ r.
	        if (R.is0() || !hasEven(y) || x !== r)
	            return false;
	        return true;
	    }
	    catch (error) {
	        return false;
	    }
	}
	/**
	 * Schnorr signatures over secp256k1.
	 * https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki
	 * @example
	 * ```js
	 * import { schnorr } from '@noble/curves/secp256k1';
	 * const { secretKey, publicKey } = schnorr.keygen();
	 * // const publicKey = schnorr.getPublicKey(secretKey);
	 * const msg = new TextEncoder().encode('hello');
	 * const sig = schnorr.sign(msg, secretKey);
	 * const isValid = schnorr.verify(sig, msg, publicKey);
	 * ```
	 */
	const schnorr = /* @__PURE__ */ (() => {
	    const size = 32;
	    const seedLength = 48;
	    const randomSecretKey = (seed = randomBytes(seedLength)) => {
	        return mapHashToField(seed, secp256k1_CURVE.n);
	    };
	    // TODO: remove
	    secp256k1.utils.randomSecretKey;
	    function keygen(seed) {
	        const secretKey = randomSecretKey(seed);
	        return { secretKey, publicKey: schnorrGetPublicKey(secretKey) };
	    }
	    return {
	        keygen,
	        getPublicKey: schnorrGetPublicKey,
	        sign: schnorrSign,
	        verify: schnorrVerify,
	        Point: Pointk1,
	        utils: {
	            randomSecretKey: randomSecretKey,
	            randomPrivateKey: randomSecretKey,
	            taggedHash,
	            // TODO: remove
	            lift_x,
	            pointToBytes,
	            numberToBytesBE,
	            bytesToNumberBE,
	            mod,
	        },
	        lengths: {
	            secretKey: size,
	            publicKey: size,
	            publicKeyHasPrefix: false,
	            signature: size * 2,
	            seed: seedLength,
	        },
	    };
	})();

	/**
	 * SHA2-256 a.k.a. sha256. In JS, it is the fastest hash, even faster than Blake3.
	 *
	 * To break sha256 using birthday attack, attackers need to try 2^128 hashes.
	 * BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
	 *
	 * Check out [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
	 * @module
	 * @deprecated
	 */
	/** @deprecated Use import from `noble/hashes/sha2` module */
	const sha256 = sha256$1;

	var dist = {};

	var LRUCache = {};

	var LRUCacheNode = {};

	var hasRequiredLRUCacheNode;

	function requireLRUCacheNode () {
		if (hasRequiredLRUCacheNode) return LRUCacheNode;
		hasRequiredLRUCacheNode = 1;
		Object.defineProperty(LRUCacheNode, "__esModule", { value: true });
		LRUCacheNode.LRUCacheNode = void 0;
		let LRUCacheNode$1 = class LRUCacheNode {
		    constructor(key, value, options) {
		        const { entryExpirationTimeInMS = null, next = null, prev = null, onEntryEvicted, onEntryMarkedAsMostRecentlyUsed, clone, cloneFn } = options !== null && options !== void 0 ? options : {};
		        if (typeof entryExpirationTimeInMS === 'number' &&
		            (entryExpirationTimeInMS <= 0 || Number.isNaN(entryExpirationTimeInMS))) {
		            throw new Error('entryExpirationTimeInMS must either be null (no expiry) or greater than 0');
		        }
		        this.clone = clone !== null && clone !== void 0 ? clone : false;
		        this.cloneFn = cloneFn !== null && cloneFn !== void 0 ? cloneFn : this.defaultClone;
		        this.key = key;
		        this.internalValue = this.clone ? this.cloneFn(value) : value;
		        this.created = Date.now();
		        this.entryExpirationTimeInMS = entryExpirationTimeInMS;
		        this.next = next;
		        this.prev = prev;
		        this.onEntryEvicted = onEntryEvicted;
		        this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
		    }
		    get value() {
		        return this.clone ? this.cloneFn(this.internalValue) : this.internalValue;
		    }
		    get isExpired() {
		        return typeof this.entryExpirationTimeInMS === 'number' && Date.now() - this.created > this.entryExpirationTimeInMS;
		    }
		    invokeOnEvicted() {
		        if (this.onEntryEvicted) {
		            const { key, value, isExpired } = this;
		            this.onEntryEvicted({ key, value, isExpired });
		        }
		    }
		    invokeOnEntryMarkedAsMostRecentlyUsed() {
		        if (this.onEntryMarkedAsMostRecentlyUsed) {
		            const { key, value } = this;
		            this.onEntryMarkedAsMostRecentlyUsed({ key, value });
		        }
		    }
		    defaultClone(value) {
		        if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
		            return value;
		        }
		        return JSON.parse(JSON.stringify(value));
		    }
		};
		LRUCacheNode.LRUCacheNode = LRUCacheNode$1;
		
		return LRUCacheNode;
	}

	var hasRequiredLRUCache;

	function requireLRUCache () {
		if (hasRequiredLRUCache) return LRUCache;
		hasRequiredLRUCache = 1;
		Object.defineProperty(LRUCache, "__esModule", { value: true });
		LRUCache.LRUCache = void 0;
		const LRUCacheNode_1 = requireLRUCacheNode();
		/**
		 * A key value cache that implements the LRU policy.
		 *
		 * @typeparam TKey The type of the keys in the cache. Defaults to `string`.
		 * @typeparam TValue The type of the values in the cache. Defaults to `any`.
		 *
		 * @see {@link https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)}
		 */
		let LRUCache$1 = class LRUCache {
		    /**
		     * Creates a new instance of the LRUCache.
		     *
		     * @param options Additional configuration options for the LRUCache.
		     *
		     * @example
		     * ```typescript
		     * // No options.
		     * const cache = new LRUCache();
		     *
		     * // With options.
		     * const cache = new LRUCache({
		     *  entryExpirationTimeInMS: 10000
		     * });
		     * ```
		     */
		    constructor(options) {
		        this.lookupTable = new Map();
		        this.head = null;
		        this.tail = null;
		        const { maxSize = 25, entryExpirationTimeInMS = null, onEntryEvicted, onEntryMarkedAsMostRecentlyUsed, cloneFn, clone } = options !== null && options !== void 0 ? options : {};
		        if (Number.isNaN(maxSize) || maxSize <= 0) {
		            throw new Error('maxSize must be greater than 0.');
		        }
		        if (typeof entryExpirationTimeInMS === 'number' &&
		            (entryExpirationTimeInMS <= 0 || Number.isNaN(entryExpirationTimeInMS))) {
		            throw new Error('entryExpirationTimeInMS must either be null (no expiry) or greater than 0');
		        }
		        this.maxSizeInternal = maxSize;
		        this.entryExpirationTimeInMS = entryExpirationTimeInMS;
		        this.onEntryEvicted = onEntryEvicted;
		        this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
		        this.clone = clone;
		        this.cloneFn = cloneFn;
		    }
		    /**
		     * Returns the number of entries in the LRUCache object.
		     * If the cache has entryExpirationTimeInMS set, expired entries will be removed before the size is returned.
		     *
		     * @returns The number of entries in the cache.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * cache.set('testKey', 'testValue');
		     *
		     * const size = cache.size;
		     *
		     * // Will log 1
		     * console.log(size);
		     * ```
		     */
		    get size() {
		        this.cleanCache();
		        return this.lookupTable.size;
		    }
		    /**
		     * Returns the number of entries that can still be added to the LRUCache without evicting existing entries.
		     *
		     * @returns The number of entries that can still be added without evicting existing entries.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache({ maxSize: 10 });
		     *
		     * cache.set('testKey', 'testValue');
		     *
		     * const remainingSize = cache.remainingSize;
		     *
		     * // Will log 9 due to 9 spots remaining before reaching maxSize of 10.
		     * console.log(remainingSize);
		     * ```
		     */
		    get remainingSize() {
		        return this.maxSizeInternal - this.size;
		    }
		    /**
		     * Returns the most recently used (newest) entry in the cache.
		     * This will not mark the entry as recently used.
		     * If the newest node is expired, it will be removed.
		     *
		     * @returns The most recently used (newest) entry in the cache.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache({ maxSize: 10 });
		     *
		     * cache.set('testKey', 'testValue');
		     *
		     * const newest = cache.newest;
		     *
		     * // Will log testValue
		     * console.log(newest.value);
		     *
		     * // Will log testKey
		     * console.log(newest.key);
		     * ```
		     */
		    get newest() {
		        if (!this.head) {
		            return null;
		        }
		        if (this.head.isExpired) {
		            this.removeNodeFromListAndLookupTable(this.head);
		            return this.newest;
		        }
		        return this.mapNodeToEntry(this.head);
		    }
		    /**
		     * Returns the least recently used (oldest) entry in the cache.
		     * This will not mark the entry as recently used.
		     * If the oldest node is expired, it will be removed.
		     *
		     * @returns The least recently used (oldest) entry in the cache.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache({ maxSize: 10 });
		     *
		     * cache.set('testKey', 'testValue');
		     *
		     * const oldest = cache.oldest;
		     *
		     * // Will log testValue
		     * console.log(oldest.value);
		     *
		     * // Will log testKey
		     * console.log(oldest.key);
		     * ```
		     */
		    get oldest() {
		        if (!this.tail) {
		            return null;
		        }
		        if (this.tail.isExpired) {
		            this.removeNodeFromListAndLookupTable(this.tail);
		            return this.oldest;
		        }
		        return this.mapNodeToEntry(this.tail);
		    }
		    /**
		     * Gets or sets the maxSize of the cache.
		     * This will evict the least recently used entries if needed to reach new maxSize.
		     *
		     * @param value The new value for maxSize. Must be greater than 0.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache({ maxSize: 10 });
		     *
		     * cache.set('testKey', 'testValue');
		     *
		     * // Will be 10
		     * const maxSize = cache.maxSize;
		     *
		     * // Set new maxSize to 5. If there are more than 5 items in the cache, the least recently used entries will be removed until cache size is 5.
		     * cache.maxSize = 5;
		     * ```
		     */
		    get maxSize() {
		        return this.maxSizeInternal;
		    }
		    set maxSize(value) {
		        if (Number.isNaN(value) || value <= 0) {
		            throw new Error('maxSize must be greater than 0.');
		        }
		        this.maxSizeInternal = value;
		        this.enforceSizeLimit();
		    }
		    /**
		     * Sets the value for the key in the LRUCache object. Returns the LRUCache object.
		     * This marks the newly added entry as the most recently used entry.
		     * If adding the new entry makes the cache size go above maxSize,
		     * this will evict the least recently used entries until size is equal to maxSize.
		     *
		     * @param key The key of the entry.
		     * @param value The value to set for the key.
		     * @param entryOptions Additional configuration options for the cache entry.
		     *
		     * @returns The LRUCache instance.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * // Set the key testKey to value testValue
		     * cache.set('testKey', 'testValue');
		     *
		     * // Set the key key2 to value value2. Pass in optional options.
		     * cache.set('key2', 'value2', { entryExpirationTimeInMS: 10 });
		     * ```
		     */
		    set(key, value, entryOptions) {
		        const currentNodeForKey = this.lookupTable.get(key);
		        if (currentNodeForKey) {
		            this.removeNodeFromListAndLookupTable(currentNodeForKey);
		        }
		        const node = new LRUCacheNode_1.LRUCacheNode(key, value, {
		            entryExpirationTimeInMS: this.entryExpirationTimeInMS,
		            onEntryEvicted: this.onEntryEvicted,
		            onEntryMarkedAsMostRecentlyUsed: this.onEntryMarkedAsMostRecentlyUsed,
		            clone: this.clone,
		            cloneFn: this.cloneFn,
		            ...entryOptions
		        });
		        this.setNodeAsHead(node);
		        this.lookupTable.set(key, node);
		        this.enforceSizeLimit();
		        return this;
		    }
		    /**
		     * Returns the value associated to the key, or null if there is none or if the entry is expired.
		     * If an entry is returned, this marks the returned entry as the most recently used entry.
		     *
		     * @param key The key of the entry to get.
		     *
		     * @returns The cached value or null.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * // Set the key testKey to value testValue
		     * cache.set('testKey', 'testValue');
		     *
		     * // Will be 'testValue'. Entry will now be most recently used.
		     * const item1 = cache.get('testKey');
		     *
		     * // Will be null
		     * const item2 = cache.get('keyNotInCache');
		     * ```
		     */
		    get(key) {
		        const node = this.lookupTable.get(key);
		        if (!node) {
		            return null;
		        }
		        if (node.isExpired) {
		            this.removeNodeFromListAndLookupTable(node);
		            return null;
		        }
		        this.setNodeAsHead(node);
		        return node.value;
		    }
		    /**
		     * Returns the value associated to the key, or null if there is none or if the entry is expired.
		     * If an entry is returned, this will not mark the entry as most recently accessed.
		     * Useful if a value is needed but the order of the cache should not be changed.
		     *
		     * @param key The key of the entry to get.
		     *
		     * @returns The cached value or null.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * // Set the key testKey to value testValue
		     * cache.set('testKey', 'testValue');
		     *
		     * // Will be 'testValue'
		     * const item1 = cache.peek('testKey');
		     *
		     * // Will be null
		     * const item2 = cache.peek('keyNotInCache');
		     * ```
		     */
		    peek(key) {
		        const node = this.lookupTable.get(key);
		        if (!node) {
		            return null;
		        }
		        if (node.isExpired) {
		            this.removeNodeFromListAndLookupTable(node);
		            return null;
		        }
		        return node.value;
		    }
		    /**
		     * Deletes the entry for the passed in key.
		     *
		     * @param key The key of the entry to delete
		     *
		     * @returns True if an element in the LRUCache object existed and has been removed,
		     * or false if the element does not exist.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * // Set the key testKey to value testValue
		     * cache.set('testKey', 'testValue');
		     *
		     * // Will be true
		     * const wasDeleted = cache.delete('testKey');
		     *
		     * // Will be false
		     * const wasDeleted2 = cache.delete('keyNotInCache');
		     * ```
		     */
		    delete(key) {
		        const node = this.lookupTable.get(key);
		        if (!node) {
		            return false;
		        }
		        return this.removeNodeFromListAndLookupTable(node);
		    }
		    /**
		     * Returns a boolean asserting whether a value has been associated to the key in the LRUCache object or not.
		     * This does not mark the entry as recently used.
		     * If the cache has a key but the entry is expired, it will be removed and false will be returned.
		     *
		     * @param key The key of the entry to check if exists
		     *
		     * @returns true if the cache contains the supplied key. False if not.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * // Set the key testKey to value testValue
		     * cache.set('testKey', 'testValue');
		     *
		     * // Will be true
		     * const wasDeleted = cache.has('testKey');
		     *
		     * // Will be false
		     * const wasDeleted2 = cache.has('keyNotInCache');
		     * ```
		     */
		    has(key) {
		        const node = this.lookupTable.get(key);
		        if (!node) {
		            return false;
		        }
		        if (node.isExpired) {
		            this.removeNodeFromListAndLookupTable(node);
		            return false;
		        }
		        return true;
		    }
		    /**
		     * Removes all entries in the cache.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * // Set the key testKey to value testValue
		     * cache.set('testKey', 'testValue');
		     *
		     * // Clear cache.
		     * cache.clear();
		     * ```
		     */
		    clear() {
		        this.head = null;
		        this.tail = null;
		        this.lookupTable.clear();
		    }
		    /**
		     * Searches the cache for an entry matching the passed in condition.
		     * Expired entries will be skipped (and removed).
		     * If multiply entries in the cache match the condition, the most recently used entry will be returned.
		     * If an entry is returned, this marks the returned entry as the most recently used entry.
		     *
		     * @param condition The condition to apply to each entry in the
		     *
		     * @returns The first cache entry to match the condition. Null if none match.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * // Set the key testKey to value testValue
		     * cache.set('testKey', 'testValue');
		     *
		     * // item will be { key: 'testKey', value: 'testValue }
		     * const item = cache.find(entry => {
		     *   const { key, value } = entry;
		     *
		     *   if (key === 'testKey' || value === 'something') {
		     *     return true;
		     *   }
		     *
		     *   return false;
		     * });
		     *
		     * // item2 will be null
		     * const item2 = cache.find(entry => entry.key === 'notInCache');
		     * ```
		     */
		    find(condition) {
		        let node = this.head;
		        while (node) {
		            if (node.isExpired) {
		                const next = node.next;
		                this.removeNodeFromListAndLookupTable(node);
		                node = next;
		                continue;
		            }
		            const entry = this.mapNodeToEntry(node);
		            if (condition(entry)) {
		                this.setNodeAsHead(node);
		                return entry;
		            }
		            node = node.next;
		        }
		        return null;
		    }
		    /**
		     * Iterates over and applies the callback function to each entry in the cache.
		     * Iterates in order from most recently accessed entry to least recently.
		     * Expired entries will be skipped (and removed).
		     * No entry will be marked as recently used.
		     *
		     * @param callback the callback function to apply to the entry
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * // Set the key testKey to value testValue
		     * cache.set('testKey', 'testValue');
		     *
		     * cache.forEach((key, value, index) => {
		     *   // do something with key, value, and/or index
		     * });
		     * ```
		     */
		    forEach(callback) {
		        let node = this.head;
		        let index = 0;
		        while (node) {
		            if (node.isExpired) {
		                const next = node.next;
		                this.removeNodeFromListAndLookupTable(node);
		                node = next;
		                continue;
		            }
		            callback(node.value, node.key, index);
		            node = node.next;
		            index++;
		        }
		    }
		    /**
		     * Creates a Generator which can be used with for ... of ... to iterate over the cache values.
		     * Iterates in order from most recently accessed entry to least recently.
		     * Expired entries will be skipped (and removed).
		     * No entry will be marked as accessed.
		     *
		     * @returns A Generator for the cache values.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * // Set the key testKey to value testValue
		     * cache.set('testKey', 'testValue');
		     *
		     * for (const value of cache.values()) {
		     *   // do something with the value
		     * }
		     * ```
		     */
		    *values() {
		        let node = this.head;
		        while (node) {
		            if (node.isExpired) {
		                const next = node.next;
		                this.removeNodeFromListAndLookupTable(node);
		                node = next;
		                continue;
		            }
		            yield node.value;
		            node = node.next;
		        }
		    }
		    /**
		     * Creates a Generator which can be used with for ... of ... to iterate over the cache keys.
		     * Iterates in order from most recently accessed entry to least recently.
		     * Expired entries will be skipped (and removed).
		     * No entry will be marked as accessed.
		     *
		     * @returns A Generator for the cache keys.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * // Set the key testKey to value testValue
		     * cache.set('testKey', 'testValue');
		     *
		     * for (const key of cache.keys()) {
		     *   // do something with the key
		     * }
		     * ```
		     */
		    *keys() {
		        let node = this.head;
		        while (node) {
		            if (node.isExpired) {
		                const next = node.next;
		                this.removeNodeFromListAndLookupTable(node);
		                node = next;
		                continue;
		            }
		            yield node.key;
		            node = node.next;
		        }
		    }
		    /**
		     * Creates a Generator which can be used with for ... of ... to iterate over the cache entries.
		     * Iterates in order from most recently accessed entry to least recently.
		     * Expired entries will be skipped (and removed).
		     * No entry will be marked as accessed.
		     *
		     * @returns A Generator for the cache entries.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * // Set the key testKey to value testValue
		     * cache.set('testKey', 'testValue');
		     *
		     * for (const entry of cache.entries()) {
		     *   const { key, value } = entry;
		     *   // do something with the entry
		     * }
		     * ```
		     */
		    *entries() {
		        let node = this.head;
		        while (node) {
		            if (node.isExpired) {
		                const next = node.next;
		                this.removeNodeFromListAndLookupTable(node);
		                node = next;
		                continue;
		            }
		            yield this.mapNodeToEntry(node);
		            node = node.next;
		        }
		    }
		    /**
		     * Creates a Generator which can be used with for ... of ... to iterate over the cache entries.
		     * Iterates in order from most recently accessed entry to least recently.
		     * Expired entries will be skipped (and removed).
		     * No entry will be marked as accessed.
		     *
		     * @returns A Generator for the cache entries.
		     *
		     * @example
		     * ```typescript
		     * const cache = new LRUCache();
		     *
		     * // Set the key testKey to value testValue
		     * cache.set('testKey', 'testValue');
		     *
		     * for (const entry of cache) {
		     *   const { key, value } = entry;
		     *   // do something with the entry
		     * }
		     * ```
		     */
		    *[Symbol.iterator]() {
		        let node = this.head;
		        while (node) {
		            if (node.isExpired) {
		                const next = node.next;
		                this.removeNodeFromListAndLookupTable(node);
		                node = next;
		                continue;
		            }
		            yield this.mapNodeToEntry(node);
		            node = node.next;
		        }
		    }
		    enforceSizeLimit() {
		        let node = this.tail;
		        while (node !== null && this.size > this.maxSizeInternal) {
		            const prev = node.prev;
		            this.removeNodeFromListAndLookupTable(node);
		            node = prev;
		        }
		    }
		    mapNodeToEntry({ key, value }) {
		        return {
		            key,
		            value
		        };
		    }
		    setNodeAsHead(node) {
		        this.removeNodeFromList(node);
		        if (!this.head) {
		            this.head = node;
		            this.tail = node;
		        }
		        else {
		            node.next = this.head;
		            this.head.prev = node;
		            this.head = node;
		        }
		        node.invokeOnEntryMarkedAsMostRecentlyUsed();
		    }
		    removeNodeFromList(node) {
		        if (node.prev !== null) {
		            node.prev.next = node.next;
		        }
		        if (node.next !== null) {
		            node.next.prev = node.prev;
		        }
		        if (this.head === node) {
		            this.head = node.next;
		        }
		        if (this.tail === node) {
		            this.tail = node.prev;
		        }
		        node.next = null;
		        node.prev = null;
		    }
		    removeNodeFromListAndLookupTable(node) {
		        node.invokeOnEvicted();
		        this.removeNodeFromList(node);
		        return this.lookupTable.delete(node.key);
		    }
		    cleanCache() {
		        // Don't spend time cleaning if entries don't expire.
		        if (!this.entryExpirationTimeInMS) {
		            return;
		        }
		        const expiredNodes = [];
		        for (const node of this.lookupTable.values()) {
		            if (node.isExpired) {
		                expiredNodes.push(node);
		            }
		        }
		        expiredNodes.forEach(node => this.removeNodeFromListAndLookupTable(node));
		    }
		};
		LRUCache.LRUCache = LRUCache$1;
		
		return LRUCache;
	}

	var hasRequiredDist;

	function requireDist () {
		if (hasRequiredDist) return dist;
		hasRequiredDist = 1;
		(function (exports$1) {
			var __createBinding = (dist && dist.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (dist && dist.__exportStar) || function(m, exports$1) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
			};
			Object.defineProperty(exports$1, "__esModule", { value: true });
			__exportStar(requireLRUCache(), exports$1);
			
		} (dist));
		return dist;
	}

	var distExports = requireDist();

	// Common prologue and epilogue for sync/async functions
	function pbkdf2Init(hash, _password, _salt, _opts) {
	    assert.hash(hash);
	    const opts = checkOpts$1({ dkLen: 32, asyncTick: 10 }, _opts);
	    const { c, dkLen, asyncTick } = opts;
	    assert.number(c);
	    assert.number(dkLen);
	    assert.number(asyncTick);
	    if (c < 1)
	        throw new Error('PBKDF2: iterations (c) should be >= 1');
	    const password = toBytes$2(_password);
	    const salt = toBytes$2(_salt);
	    // DK = PBKDF2(PRF, Password, Salt, c, dkLen);
	    const DK = new Uint8Array(dkLen);
	    // U1 = PRF(Password, Salt + INT_32_BE(i))
	    const PRF = hmac$1.create(hash, password);
	    const PRFSalt = PRF._cloneInto().update(salt);
	    return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
	}
	function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
	    PRF.destroy();
	    PRFSalt.destroy();
	    if (prfW)
	        prfW.destroy();
	    u.fill(0);
	    return DK;
	}
	/**
	 * PBKDF2-HMAC: RFC 2898 key derivation function
	 * @param hash - hash function that would be used e.g. sha256
	 * @param password - password from which a derived key is generated
	 * @param salt - cryptographic salt
	 * @param opts - {c, dkLen} where c is work factor and dkLen is output message size
	 */
	function pbkdf2(hash, password, salt, opts) {
	    const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
	    let prfW; // Working copy
	    const arr = new Uint8Array(4);
	    const view = createView$2(arr);
	    const u = new Uint8Array(PRF.outputLen);
	    // DK = T1 + T2 + ⋯ + Tdklen/hlen
	    for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
	        // Ti = F(Password, Salt, c, i)
	        const Ti = DK.subarray(pos, pos + PRF.outputLen);
	        view.setInt32(0, ti, false);
	        // F(Password, Salt, c, i) = U1 ^ U2 ^ ⋯ ^ Uc
	        // U1 = PRF(Password, Salt + INT_32_BE(i))
	        (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
	        Ti.set(u.subarray(0, Ti.length));
	        for (let ui = 1; ui < c; ui++) {
	            // Uc = PRF(Password, Uc−1)
	            PRF._cloneInto(prfW).update(u).digestInto(u);
	            for (let i = 0; i < Ti.length; i++)
	                Ti[i] ^= u[i];
	        }
	    }
	    return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
	}

	// RFC 7914 Scrypt KDF
	// Left rotate for uint32
	const rotl = (a, b) => (a << b) | (a >>> (32 - b));
	// The main Scrypt loop: uses Salsa extensively.
	// Six versions of the function were tried, this is the fastest one.
	// prettier-ignore
	function XorAndSalsa(prev, pi, input, ii, out, oi) {
	    // Based on https://cr.yp.to/salsa20.html
	    // Xor blocks
	    let y00 = prev[pi++] ^ input[ii++], y01 = prev[pi++] ^ input[ii++];
	    let y02 = prev[pi++] ^ input[ii++], y03 = prev[pi++] ^ input[ii++];
	    let y04 = prev[pi++] ^ input[ii++], y05 = prev[pi++] ^ input[ii++];
	    let y06 = prev[pi++] ^ input[ii++], y07 = prev[pi++] ^ input[ii++];
	    let y08 = prev[pi++] ^ input[ii++], y09 = prev[pi++] ^ input[ii++];
	    let y10 = prev[pi++] ^ input[ii++], y11 = prev[pi++] ^ input[ii++];
	    let y12 = prev[pi++] ^ input[ii++], y13 = prev[pi++] ^ input[ii++];
	    let y14 = prev[pi++] ^ input[ii++], y15 = prev[pi++] ^ input[ii++];
	    // Save state to temporary variables (salsa)
	    let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
	    // Main loop (salsa)
	    for (let i = 0; i < 8; i += 2) {
	        x04 ^= rotl(x00 + x12 | 0, 7);
	        x08 ^= rotl(x04 + x00 | 0, 9);
	        x12 ^= rotl(x08 + x04 | 0, 13);
	        x00 ^= rotl(x12 + x08 | 0, 18);
	        x09 ^= rotl(x05 + x01 | 0, 7);
	        x13 ^= rotl(x09 + x05 | 0, 9);
	        x01 ^= rotl(x13 + x09 | 0, 13);
	        x05 ^= rotl(x01 + x13 | 0, 18);
	        x14 ^= rotl(x10 + x06 | 0, 7);
	        x02 ^= rotl(x14 + x10 | 0, 9);
	        x06 ^= rotl(x02 + x14 | 0, 13);
	        x10 ^= rotl(x06 + x02 | 0, 18);
	        x03 ^= rotl(x15 + x11 | 0, 7);
	        x07 ^= rotl(x03 + x15 | 0, 9);
	        x11 ^= rotl(x07 + x03 | 0, 13);
	        x15 ^= rotl(x11 + x07 | 0, 18);
	        x01 ^= rotl(x00 + x03 | 0, 7);
	        x02 ^= rotl(x01 + x00 | 0, 9);
	        x03 ^= rotl(x02 + x01 | 0, 13);
	        x00 ^= rotl(x03 + x02 | 0, 18);
	        x06 ^= rotl(x05 + x04 | 0, 7);
	        x07 ^= rotl(x06 + x05 | 0, 9);
	        x04 ^= rotl(x07 + x06 | 0, 13);
	        x05 ^= rotl(x04 + x07 | 0, 18);
	        x11 ^= rotl(x10 + x09 | 0, 7);
	        x08 ^= rotl(x11 + x10 | 0, 9);
	        x09 ^= rotl(x08 + x11 | 0, 13);
	        x10 ^= rotl(x09 + x08 | 0, 18);
	        x12 ^= rotl(x15 + x14 | 0, 7);
	        x13 ^= rotl(x12 + x15 | 0, 9);
	        x14 ^= rotl(x13 + x12 | 0, 13);
	        x15 ^= rotl(x14 + x13 | 0, 18);
	    }
	    // Write output (salsa)
	    out[oi++] = (y00 + x00) | 0;
	    out[oi++] = (y01 + x01) | 0;
	    out[oi++] = (y02 + x02) | 0;
	    out[oi++] = (y03 + x03) | 0;
	    out[oi++] = (y04 + x04) | 0;
	    out[oi++] = (y05 + x05) | 0;
	    out[oi++] = (y06 + x06) | 0;
	    out[oi++] = (y07 + x07) | 0;
	    out[oi++] = (y08 + x08) | 0;
	    out[oi++] = (y09 + x09) | 0;
	    out[oi++] = (y10 + x10) | 0;
	    out[oi++] = (y11 + x11) | 0;
	    out[oi++] = (y12 + x12) | 0;
	    out[oi++] = (y13 + x13) | 0;
	    out[oi++] = (y14 + x14) | 0;
	    out[oi++] = (y15 + x15) | 0;
	}
	function BlockMix(input, ii, out, oi, r) {
	    // The block B is r 128-byte chunks (which is equivalent of 2r 64-byte chunks)
	    let head = oi + 0;
	    let tail = oi + 16 * r;
	    for (let i = 0; i < 16; i++)
	        out[tail + i] = input[ii + (2 * r - 1) * 16 + i]; // X ← B[2r−1]
	    for (let i = 0; i < r; i++, head += 16, ii += 16) {
	        // We write odd & even Yi at same time. Even: 0bXXXXX0 Odd:  0bXXXXX1
	        XorAndSalsa(out, tail, input, ii, out, head); // head[i] = Salsa(blockIn[2*i] ^ tail[i-1])
	        if (i > 0)
	            tail += 16; // First iteration overwrites tmp value in tail
	        XorAndSalsa(out, head, input, (ii += 16), out, tail); // tail[i] = Salsa(blockIn[2*i+1] ^ head[i])
	    }
	}
	// Common prologue and epilogue for sync/async functions
	function scryptInit(password, salt, _opts) {
	    // Maxmem - 1GB+1KB by default
	    const opts = checkOpts$1({
	        dkLen: 32,
	        asyncTick: 10,
	        maxmem: 1024 ** 3 + 1024,
	    }, _opts);
	    const { N, r, p, dkLen, asyncTick, maxmem, onProgress } = opts;
	    assert.number(N);
	    assert.number(r);
	    assert.number(p);
	    assert.number(dkLen);
	    assert.number(asyncTick);
	    assert.number(maxmem);
	    if (onProgress !== undefined && typeof onProgress !== 'function')
	        throw new Error('progressCb should be function');
	    const blockSize = 128 * r;
	    const blockSize32 = blockSize / 4;
	    if (N <= 1 || (N & (N - 1)) !== 0 || N >= 2 ** (blockSize / 8) || N > 2 ** 32) {
	        // NOTE: we limit N to be less than 2**32 because of 32 bit variant of Integrify function
	        // There is no JS engines that allows alocate more than 4GB per single Uint8Array for now, but can change in future.
	        throw new Error('Scrypt: N must be larger than 1, a power of 2, less than 2^(128 * r / 8) and less than 2^32');
	    }
	    if (p < 0 || p > ((2 ** 32 - 1) * 32) / blockSize) {
	        throw new Error('Scrypt: p must be a positive integer less than or equal to ((2^32 - 1) * 32) / (128 * r)');
	    }
	    if (dkLen < 0 || dkLen > (2 ** 32 - 1) * 32) {
	        throw new Error('Scrypt: dkLen should be positive integer less than or equal to (2^32 - 1) * 32');
	    }
	    const memUsed = blockSize * (N + p);
	    if (memUsed > maxmem) {
	        throw new Error(`Scrypt: parameters too large, ${memUsed} (128 * r * (N + p)) > ${maxmem} (maxmem)`);
	    }
	    // [B0...Bp−1] ← PBKDF2HMAC-SHA256(Passphrase, Salt, 1, blockSize*ParallelizationFactor)
	    // Since it has only one iteration there is no reason to use async variant
	    const B = pbkdf2(sha256$2, password, salt, { c: 1, dkLen: blockSize * p });
	    const B32 = u32$1(B);
	    // Re-used between parallel iterations. Array(iterations) of B
	    const V = u32$1(new Uint8Array(blockSize * N));
	    const tmp = u32$1(new Uint8Array(blockSize));
	    let blockMixCb = () => { };
	    if (onProgress) {
	        const totalBlockMix = 2 * N * p;
	        // Invoke callback if progress changes from 10.01 to 10.02
	        // Allows to draw smooth progress bar on up to 8K screen
	        const callbackPer = Math.max(Math.floor(totalBlockMix / 10000), 1);
	        let blockMixCnt = 0;
	        blockMixCb = () => {
	            blockMixCnt++;
	            if (onProgress && (!(blockMixCnt % callbackPer) || blockMixCnt === totalBlockMix))
	                onProgress(blockMixCnt / totalBlockMix);
	        };
	    }
	    return { N, r, p, dkLen, blockSize32, V, B32, B, tmp, blockMixCb, asyncTick };
	}
	function scryptOutput(password, dkLen, B, V, tmp) {
	    const res = pbkdf2(sha256$2, password, B, { c: 1, dkLen });
	    B.fill(0);
	    V.fill(0);
	    tmp.fill(0);
	    return res;
	}
	/**
	 * Scrypt KDF from RFC 7914.
	 * @param password - pass
	 * @param salt - salt
	 * @param opts - parameters
	 * - `N` is cpu/mem work factor (power of 2 e.g. 2**18)
	 * - `r` is block size (8 is common), fine-tunes sequential memory read size and performance
	 * - `p` is parallelization factor (1 is common)
	 * - `dkLen` is output key length in bytes e.g. 32.
	 * - `asyncTick` - (default: 10) max time in ms for which async function can block execution
	 * - `maxmem` - (default: `1024 ** 3 + 1024` aka 1GB+1KB). A limit that the app could use for scrypt
	 * - `onProgress` - callback function that would be executed for progress report
	 * @returns Derived key
	 */
	function scrypt(password, salt, opts) {
	    const { N, r, p, dkLen, blockSize32, V, B32, B, tmp, blockMixCb } = scryptInit(password, salt, opts);
	    for (let pi = 0; pi < p; pi++) {
	        const Pi = blockSize32 * pi;
	        for (let i = 0; i < blockSize32; i++)
	            V[i] = B32[Pi + i]; // V[0] = B[i]
	        for (let i = 0, pos = 0; i < N - 1; i++) {
	            BlockMix(V, pos, V, (pos += blockSize32), r); // V[i] = BlockMix(V[i-1]);
	            blockMixCb();
	        }
	        BlockMix(V, (N - 1) * blockSize32, B32, Pi, r); // Process last element
	        blockMixCb();
	        for (let i = 0; i < N; i++) {
	            // First u32 of the last 64-byte block (u32 is LE)
	            const j = B32[Pi + blockSize32 - 16] % N; // j = Integrify(X) % iterations
	            for (let k = 0; k < blockSize32; k++)
	                tmp[k] = B32[Pi + k] ^ V[j * blockSize32 + k]; // tmp = B ^ V[j]
	            BlockMix(tmp, 0, B32, Pi, r); // B = BlockMix(B ^ V[j])
	            blockMixCb();
	        }
	    }
	    return scryptOutput(password, dkLen, B, V, tmp);
	}

	// nip49.ts
	var Bech32MaxSize$1 = 5e3;
	function encodeBech32$1(prefix, data) {
	  let words = bech32.toWords(data);
	  return bech32.encode(prefix, words, Bech32MaxSize$1);
	}
	function encodeBytes$1(prefix, bytes) {
	  return encodeBech32$1(prefix, bytes);
	}
	function encrypt$1(sec, password, logn = 16, ksb = 2) {
	  let salt = randomBytes$1(16);
	  let n = 2 ** logn;
	  let key = scrypt(password.normalize("NFKC"), salt, { N: n, r: 8, p: 1, dkLen: 32 });
	  let nonce = randomBytes$1(24);
	  let aad = Uint8Array.from([ksb]);
	  let xc2p1 = xchacha20poly1305(key, nonce, aad);
	  let ciphertext = xc2p1.encrypt(sec);
	  let b = concatBytes$1(Uint8Array.from([2]), Uint8Array.from([logn]), salt, nonce, aad, ciphertext);
	  return encodeBytes$1("ncryptsec", b);
	}
	function decrypt$1(ncryptsec, password) {
	  let { prefix, words } = bech32.decode(ncryptsec, Bech32MaxSize$1);
	  if (prefix !== "ncryptsec") {
	    throw new Error(`invalid prefix ${prefix}, expected 'ncryptsec'`);
	  }
	  let b = new Uint8Array(bech32.fromWords(words));
	  let version = b[0];
	  if (version !== 2) {
	    throw new Error(`invalid version ${version}, expected 0x02`);
	  }
	  let logn = b[1];
	  let n = 2 ** logn;
	  let salt = b.slice(2, 2 + 16);
	  let nonce = b.slice(2 + 16, 2 + 16 + 24);
	  let ksb = b[2 + 16 + 24];
	  let aad = Uint8Array.from([ksb]);
	  let ciphertext = b.slice(2 + 16 + 24 + 1);
	  let key = scrypt(password.normalize("NFKC"), salt, { N: n, r: 8, p: 1, dkLen: 32 });
	  let xc2p1 = xchacha20poly1305(key, nonce, aad);
	  let sec = xc2p1.decrypt(ciphertext);
	  return sec;
	}

	var nip49_star = /*#__PURE__*/Object.freeze({
		__proto__: null,
		decrypt: decrypt$1,
		encrypt: encrypt$1
	});

	// nip19.ts
	var utf8Decoder = new TextDecoder("utf-8");
	var utf8Encoder = new TextEncoder();

	// nip19.ts
	var NostrTypeGuard = {
	  isNProfile: (value) => /^nprofile1[a-z\d]+$/.test(value || ""),
	  isNEvent: (value) => /^nevent1[a-z\d]+$/.test(value || ""),
	  isNAddr: (value) => /^naddr1[a-z\d]+$/.test(value || ""),
	  isNSec: (value) => /^nsec1[a-z\d]{58}$/.test(value || ""),
	  isNPub: (value) => /^npub1[a-z\d]{58}$/.test(value || ""),
	  isNote: (value) => /^note1[a-z\d]+$/.test(value || ""),
	  isNcryptsec: (value) => /^ncryptsec1[a-z\d]+$/.test(value || "")
	};
	var Bech32MaxSize = 5e3;
	var BECH32_REGEX$1 = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
	function integerToUint8Array(number) {
	  const uint8Array = new Uint8Array(4);
	  uint8Array[0] = number >> 24 & 255;
	  uint8Array[1] = number >> 16 & 255;
	  uint8Array[2] = number >> 8 & 255;
	  uint8Array[3] = number & 255;
	  return uint8Array;
	}
	function decodeNostrURI(nip19code) {
	  try {
	    if (nip19code.startsWith("nostr:"))
	      nip19code = nip19code.substring(6);
	    return decode(nip19code);
	  } catch (_err) {
	    return { type: "invalid", data: null };
	  }
	}
	function decode(code) {
	  let { prefix, words } = bech32.decode(code, Bech32MaxSize);
	  let data = new Uint8Array(bech32.fromWords(words));
	  switch (prefix) {
	    case "nprofile": {
	      let tlv = parseTLV(data);
	      if (!tlv[0]?.[0])
	        throw new Error("missing TLV 0 for nprofile");
	      if (tlv[0][0].length !== 32)
	        throw new Error("TLV 0 should be 32 bytes");
	      return {
	        type: "nprofile",
	        data: {
	          pubkey: bytesToHex$2(tlv[0][0]),
	          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : []
	        }
	      };
	    }
	    case "nevent": {
	      let tlv = parseTLV(data);
	      if (!tlv[0]?.[0])
	        throw new Error("missing TLV 0 for nevent");
	      if (tlv[0][0].length !== 32)
	        throw new Error("TLV 0 should be 32 bytes");
	      if (tlv[2] && tlv[2][0].length !== 32)
	        throw new Error("TLV 2 should be 32 bytes");
	      if (tlv[3] && tlv[3][0].length !== 4)
	        throw new Error("TLV 3 should be 4 bytes");
	      return {
	        type: "nevent",
	        data: {
	          id: bytesToHex$2(tlv[0][0]),
	          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : [],
	          author: tlv[2]?.[0] ? bytesToHex$2(tlv[2][0]) : void 0,
	          kind: tlv[3]?.[0] ? parseInt(bytesToHex$2(tlv[3][0]), 16) : void 0
	        }
	      };
	    }
	    case "naddr": {
	      let tlv = parseTLV(data);
	      if (!tlv[0]?.[0])
	        throw new Error("missing TLV 0 for naddr");
	      if (!tlv[2]?.[0])
	        throw new Error("missing TLV 2 for naddr");
	      if (tlv[2][0].length !== 32)
	        throw new Error("TLV 2 should be 32 bytes");
	      if (!tlv[3]?.[0])
	        throw new Error("missing TLV 3 for naddr");
	      if (tlv[3][0].length !== 4)
	        throw new Error("TLV 3 should be 4 bytes");
	      return {
	        type: "naddr",
	        data: {
	          identifier: utf8Decoder.decode(tlv[0][0]),
	          pubkey: bytesToHex$2(tlv[2][0]),
	          kind: parseInt(bytesToHex$2(tlv[3][0]), 16),
	          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : []
	        }
	      };
	    }
	    case "nsec":
	      return { type: prefix, data };
	    case "npub":
	    case "note":
	      return { type: prefix, data: bytesToHex$2(data) };
	    default:
	      throw new Error(`unknown prefix ${prefix}`);
	  }
	}
	function parseTLV(data) {
	  let result = {};
	  let rest = data;
	  while (rest.length > 0) {
	    let t = rest[0];
	    let l = rest[1];
	    let v = rest.slice(2, 2 + l);
	    rest = rest.slice(2 + l);
	    if (v.length < l)
	      throw new Error(`not enough data to read on TLV ${t}`);
	    result[t] = result[t] || [];
	    result[t].push(v);
	  }
	  return result;
	}
	function nsecEncode(key) {
	  return encodeBytes("nsec", key);
	}
	function npubEncode(hex) {
	  return encodeBytes("npub", hexToBytes$2(hex));
	}
	function noteEncode(hex) {
	  return encodeBytes("note", hexToBytes$2(hex));
	}
	function encodeBech32(prefix, data) {
	  let words = bech32.toWords(data);
	  return bech32.encode(prefix, words, Bech32MaxSize);
	}
	function encodeBytes(prefix, bytes) {
	  return encodeBech32(prefix, bytes);
	}
	function nprofileEncode(profile) {
	  let data = encodeTLV({
	    0: [hexToBytes$2(profile.pubkey)],
	    1: (profile.relays || []).map((url) => utf8Encoder.encode(url))
	  });
	  return encodeBech32("nprofile", data);
	}
	function neventEncode(event) {
	  let kindArray;
	  if (event.kind !== void 0) {
	    kindArray = integerToUint8Array(event.kind);
	  }
	  let data = encodeTLV({
	    0: [hexToBytes$2(event.id)],
	    1: (event.relays || []).map((url) => utf8Encoder.encode(url)),
	    2: event.author ? [hexToBytes$2(event.author)] : [],
	    3: kindArray ? [new Uint8Array(kindArray)] : []
	  });
	  return encodeBech32("nevent", data);
	}
	function naddrEncode(addr) {
	  let kind = new ArrayBuffer(4);
	  new DataView(kind).setUint32(0, addr.kind, false);
	  let data = encodeTLV({
	    0: [utf8Encoder.encode(addr.identifier)],
	    1: (addr.relays || []).map((url) => utf8Encoder.encode(url)),
	    2: [hexToBytes$2(addr.pubkey)],
	    3: [new Uint8Array(kind)]
	  });
	  return encodeBech32("naddr", data);
	}
	function encodeTLV(tlv) {
	  let entries = [];
	  Object.entries(tlv).reverse().forEach(([t, vs]) => {
	    vs.forEach((v) => {
	      let entry = new Uint8Array(v.length + 2);
	      entry.set([parseInt(t)], 0);
	      entry.set([v.length], 1);
	      entry.set(v, 2);
	      entries.push(entry);
	    });
	  });
	  return concatBytes$1(...entries);
	}

	var nip19_star = /*#__PURE__*/Object.freeze({
		__proto__: null,
		BECH32_REGEX: BECH32_REGEX$1,
		Bech32MaxSize: Bech32MaxSize,
		NostrTypeGuard: NostrTypeGuard,
		decode: decode,
		decodeNostrURI: decodeNostrURI,
		encodeBytes: encodeBytes,
		naddrEncode: naddrEncode,
		neventEncode: neventEncode,
		noteEncode: noteEncode,
		nprofileEncode: nprofileEncode,
		npubEncode: npubEncode,
		nsecEncode: nsecEncode
	});

	var lib = {};

	var hasRequiredLib;

	function requireLib () {
		if (hasRequiredLib) return lib;
		hasRequiredLib = 1;
		(function (exports$1) {
			/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
			Object.defineProperty(exports$1, "__esModule", { value: true });
			exports$1.bytes = exports$1.stringToBytes = exports$1.str = exports$1.bytesToString = exports$1.hex = exports$1.utf8 = exports$1.bech32m = exports$1.bech32 = exports$1.base58check = exports$1.base58xmr = exports$1.base58xrp = exports$1.base58flickr = exports$1.base58 = exports$1.base64url = exports$1.base64 = exports$1.base32crockford = exports$1.base32hex = exports$1.base32 = exports$1.base16 = exports$1.utils = exports$1.assertNumber = void 0;
			function assertNumber(n) {
			    if (!Number.isSafeInteger(n))
			        throw new Error(`Wrong integer: ${n}`);
			}
			exports$1.assertNumber = assertNumber;
			function chain(...args) {
			    const wrap = (a, b) => (c) => a(b(c));
			    const encode = Array.from(args)
			        .reverse()
			        .reduce((acc, i) => (acc ? wrap(acc, i.encode) : i.encode), undefined);
			    const decode = args.reduce((acc, i) => (acc ? wrap(acc, i.decode) : i.decode), undefined);
			    return { encode, decode };
			}
			function alphabet(alphabet) {
			    return {
			        encode: (digits) => {
			            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
			                throw new Error('alphabet.encode input should be an array of numbers');
			            return digits.map((i) => {
			                assertNumber(i);
			                if (i < 0 || i >= alphabet.length)
			                    throw new Error(`Digit index outside alphabet: ${i} (alphabet: ${alphabet.length})`);
			                return alphabet[i];
			            });
			        },
			        decode: (input) => {
			            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
			                throw new Error('alphabet.decode input should be array of strings');
			            return input.map((letter) => {
			                if (typeof letter !== 'string')
			                    throw new Error(`alphabet.decode: not string element=${letter}`);
			                const index = alphabet.indexOf(letter);
			                if (index === -1)
			                    throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet}`);
			                return index;
			            });
			        },
			    };
			}
			function join(separator = '') {
			    if (typeof separator !== 'string')
			        throw new Error('join separator should be string');
			    return {
			        encode: (from) => {
			            if (!Array.isArray(from) || (from.length && typeof from[0] !== 'string'))
			                throw new Error('join.encode input should be array of strings');
			            for (let i of from)
			                if (typeof i !== 'string')
			                    throw new Error(`join.encode: non-string input=${i}`);
			            return from.join(separator);
			        },
			        decode: (to) => {
			            if (typeof to !== 'string')
			                throw new Error('join.decode input should be string');
			            return to.split(separator);
			        },
			    };
			}
			function padding(bits, chr = '=') {
			    assertNumber(bits);
			    if (typeof chr !== 'string')
			        throw new Error('padding chr should be string');
			    return {
			        encode(data) {
			            if (!Array.isArray(data) || (data.length && typeof data[0] !== 'string'))
			                throw new Error('padding.encode input should be array of strings');
			            for (let i of data)
			                if (typeof i !== 'string')
			                    throw new Error(`padding.encode: non-string input=${i}`);
			            while ((data.length * bits) % 8)
			                data.push(chr);
			            return data;
			        },
			        decode(input) {
			            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
			                throw new Error('padding.encode input should be array of strings');
			            for (let i of input)
			                if (typeof i !== 'string')
			                    throw new Error(`padding.decode: non-string input=${i}`);
			            let end = input.length;
			            if ((end * bits) % 8)
			                throw new Error('Invalid padding: string should have whole number of bytes');
			            for (; end > 0 && input[end - 1] === chr; end--) {
			                if (!(((end - 1) * bits) % 8))
			                    throw new Error('Invalid padding: string has too much padding');
			            }
			            return input.slice(0, end);
			        },
			    };
			}
			function normalize(fn) {
			    if (typeof fn !== 'function')
			        throw new Error('normalize fn should be function');
			    return { encode: (from) => from, decode: (to) => fn(to) };
			}
			function convertRadix(data, from, to) {
			    if (from < 2)
			        throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
			    if (to < 2)
			        throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
			    if (!Array.isArray(data))
			        throw new Error('convertRadix: data should be array');
			    if (!data.length)
			        return [];
			    let pos = 0;
			    const res = [];
			    const digits = Array.from(data);
			    digits.forEach((d) => {
			        assertNumber(d);
			        if (d < 0 || d >= from)
			            throw new Error(`Wrong integer: ${d}`);
			    });
			    while (true) {
			        let carry = 0;
			        let done = true;
			        for (let i = pos; i < digits.length; i++) {
			            const digit = digits[i];
			            const digitBase = from * carry + digit;
			            if (!Number.isSafeInteger(digitBase) ||
			                (from * carry) / from !== carry ||
			                digitBase - digit !== from * carry) {
			                throw new Error('convertRadix: carry overflow');
			            }
			            carry = digitBase % to;
			            digits[i] = Math.floor(digitBase / to);
			            if (!Number.isSafeInteger(digits[i]) || digits[i] * to + carry !== digitBase)
			                throw new Error('convertRadix: carry overflow');
			            if (!done)
			                continue;
			            else if (!digits[i])
			                pos = i;
			            else
			                done = false;
			        }
			        res.push(carry);
			        if (done)
			            break;
			    }
			    for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
			        res.push(0);
			    return res.reverse();
			}
			const gcd = (a, b) => (!b ? a : gcd(b, a % b));
			const radix2carry = (from, to) => from + (to - gcd(from, to));
			function convertRadix2(data, from, to, padding) {
			    if (!Array.isArray(data))
			        throw new Error('convertRadix2: data should be array');
			    if (from <= 0 || from > 32)
			        throw new Error(`convertRadix2: wrong from=${from}`);
			    if (to <= 0 || to > 32)
			        throw new Error(`convertRadix2: wrong to=${to}`);
			    if (radix2carry(from, to) > 32) {
			        throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry(from, to)}`);
			    }
			    let carry = 0;
			    let pos = 0;
			    const mask = 2 ** to - 1;
			    const res = [];
			    for (const n of data) {
			        assertNumber(n);
			        if (n >= 2 ** from)
			            throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
			        carry = (carry << from) | n;
			        if (pos + from > 32)
			            throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
			        pos += from;
			        for (; pos >= to; pos -= to)
			            res.push(((carry >> (pos - to)) & mask) >>> 0);
			        carry &= 2 ** pos - 1;
			    }
			    carry = (carry << (to - pos)) & mask;
			    if (!padding && pos >= from)
			        throw new Error('Excess padding');
			    if (!padding && carry)
			        throw new Error(`Non-zero padding: ${carry}`);
			    if (padding && pos > 0)
			        res.push(carry >>> 0);
			    return res;
			}
			function radix(num) {
			    assertNumber(num);
			    return {
			        encode: (bytes) => {
			            if (!(bytes instanceof Uint8Array))
			                throw new Error('radix.encode input should be Uint8Array');
			            return convertRadix(Array.from(bytes), 2 ** 8, num);
			        },
			        decode: (digits) => {
			            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
			                throw new Error('radix.decode input should be array of strings');
			            return Uint8Array.from(convertRadix(digits, num, 2 ** 8));
			        },
			    };
			}
			function radix2(bits, revPadding = false) {
			    assertNumber(bits);
			    if (bits <= 0 || bits > 32)
			        throw new Error('radix2: bits should be in (0..32]');
			    if (radix2carry(8, bits) > 32 || radix2carry(bits, 8) > 32)
			        throw new Error('radix2: carry overflow');
			    return {
			        encode: (bytes) => {
			            if (!(bytes instanceof Uint8Array))
			                throw new Error('radix2.encode input should be Uint8Array');
			            return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
			        },
			        decode: (digits) => {
			            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
			                throw new Error('radix2.decode input should be array of strings');
			            return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
			        },
			    };
			}
			function unsafeWrapper(fn) {
			    if (typeof fn !== 'function')
			        throw new Error('unsafeWrapper fn should be function');
			    return function (...args) {
			        try {
			            return fn.apply(null, args);
			        }
			        catch (e) { }
			    };
			}
			function checksum(len, fn) {
			    assertNumber(len);
			    if (typeof fn !== 'function')
			        throw new Error('checksum fn should be function');
			    return {
			        encode(data) {
			            if (!(data instanceof Uint8Array))
			                throw new Error('checksum.encode: input should be Uint8Array');
			            const checksum = fn(data).slice(0, len);
			            const res = new Uint8Array(data.length + len);
			            res.set(data);
			            res.set(checksum, data.length);
			            return res;
			        },
			        decode(data) {
			            if (!(data instanceof Uint8Array))
			                throw new Error('checksum.decode: input should be Uint8Array');
			            const payload = data.slice(0, -len);
			            const newChecksum = fn(payload).slice(0, len);
			            const oldChecksum = data.slice(-len);
			            for (let i = 0; i < len; i++)
			                if (newChecksum[i] !== oldChecksum[i])
			                    throw new Error('Invalid checksum');
			            return payload;
			        },
			    };
			}
			exports$1.utils = { alphabet, chain, checksum, radix, radix2, join, padding };
			exports$1.base16 = chain(radix2(4), alphabet('0123456789ABCDEF'), join(''));
			exports$1.base32 = chain(radix2(5), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), padding(5), join(''));
			exports$1.base32hex = chain(radix2(5), alphabet('0123456789ABCDEFGHIJKLMNOPQRSTUV'), padding(5), join(''));
			exports$1.base32crockford = chain(radix2(5), alphabet('0123456789ABCDEFGHJKMNPQRSTVWXYZ'), join(''), normalize((s) => s.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')));
			exports$1.base64 = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'), padding(6), join(''));
			exports$1.base64url = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), padding(6), join(''));
			const genBase58 = (abc) => chain(radix(58), alphabet(abc), join(''));
			exports$1.base58 = genBase58('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
			exports$1.base58flickr = genBase58('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ');
			exports$1.base58xrp = genBase58('rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz');
			const XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
			exports$1.base58xmr = {
			    encode(data) {
			        let res = '';
			        for (let i = 0; i < data.length; i += 8) {
			            const block = data.subarray(i, i + 8);
			            res += exports$1.base58.encode(block).padStart(XMR_BLOCK_LEN[block.length], '1');
			        }
			        return res;
			    },
			    decode(str) {
			        let res = [];
			        for (let i = 0; i < str.length; i += 11) {
			            const slice = str.slice(i, i + 11);
			            const blockLen = XMR_BLOCK_LEN.indexOf(slice.length);
			            const block = exports$1.base58.decode(slice);
			            for (let j = 0; j < block.length - blockLen; j++) {
			                if (block[j] !== 0)
			                    throw new Error('base58xmr: wrong padding');
			            }
			            res = res.concat(Array.from(block.slice(block.length - blockLen)));
			        }
			        return Uint8Array.from(res);
			    },
			};
			const base58check = (sha256) => chain(checksum(4, (data) => sha256(sha256(data))), exports$1.base58);
			exports$1.base58check = base58check;
			const BECH_ALPHABET = chain(alphabet('qpzry9x8gf2tvdw0s3jn54khce6mua7l'), join(''));
			const POLYMOD_GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
			function bech32Polymod(pre) {
			    const b = pre >> 25;
			    let chk = (pre & 0x1ffffff) << 5;
			    for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
			        if (((b >> i) & 1) === 1)
			            chk ^= POLYMOD_GENERATORS[i];
			    }
			    return chk;
			}
			function bechChecksum(prefix, words, encodingConst = 1) {
			    const len = prefix.length;
			    let chk = 1;
			    for (let i = 0; i < len; i++) {
			        const c = prefix.charCodeAt(i);
			        if (c < 33 || c > 126)
			            throw new Error(`Invalid prefix (${prefix})`);
			        chk = bech32Polymod(chk) ^ (c >> 5);
			    }
			    chk = bech32Polymod(chk);
			    for (let i = 0; i < len; i++)
			        chk = bech32Polymod(chk) ^ (prefix.charCodeAt(i) & 0x1f);
			    for (let v of words)
			        chk = bech32Polymod(chk) ^ v;
			    for (let i = 0; i < 6; i++)
			        chk = bech32Polymod(chk);
			    chk ^= encodingConst;
			    return BECH_ALPHABET.encode(convertRadix2([chk % 2 ** 30], 30, 5, false));
			}
			function genBech32(encoding) {
			    const ENCODING_CONST = encoding === 'bech32' ? 1 : 0x2bc830a3;
			    const _words = radix2(5);
			    const fromWords = _words.decode;
			    const toWords = _words.encode;
			    const fromWordsUnsafe = unsafeWrapper(fromWords);
			    function encode(prefix, words, limit = 90) {
			        if (typeof prefix !== 'string')
			            throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
			        if (!Array.isArray(words) || (words.length && typeof words[0] !== 'number'))
			            throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
			        const actualLength = prefix.length + 7 + words.length;
			        if (limit !== false && actualLength > limit)
			            throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
			        prefix = prefix.toLowerCase();
			        return `${prefix}1${BECH_ALPHABET.encode(words)}${bechChecksum(prefix, words, ENCODING_CONST)}`;
			    }
			    function decode(str, limit = 90) {
			        if (typeof str !== 'string')
			            throw new Error(`bech32.decode input should be string, not ${typeof str}`);
			        if (str.length < 8 || (limit !== false && str.length > limit))
			            throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
			        const lowered = str.toLowerCase();
			        if (str !== lowered && str !== str.toUpperCase())
			            throw new Error(`String must be lowercase or uppercase`);
			        str = lowered;
			        const sepIndex = str.lastIndexOf('1');
			        if (sepIndex === 0 || sepIndex === -1)
			            throw new Error(`Letter "1" must be present between prefix and data only`);
			        const prefix = str.slice(0, sepIndex);
			        const _words = str.slice(sepIndex + 1);
			        if (_words.length < 6)
			            throw new Error('Data must be at least 6 characters long');
			        const words = BECH_ALPHABET.decode(_words).slice(0, -6);
			        const sum = bechChecksum(prefix, words, ENCODING_CONST);
			        if (!_words.endsWith(sum))
			            throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
			        return { prefix, words };
			    }
			    const decodeUnsafe = unsafeWrapper(decode);
			    function decodeToBytes(str) {
			        const { prefix, words } = decode(str, false);
			        return { prefix, words, bytes: fromWords(words) };
			    }
			    return { encode, decode, decodeToBytes, decodeUnsafe, fromWords, fromWordsUnsafe, toWords };
			}
			exports$1.bech32 = genBech32('bech32');
			exports$1.bech32m = genBech32('bech32m');
			exports$1.utf8 = {
			    encode: (data) => new TextDecoder().decode(data),
			    decode: (str) => new TextEncoder().encode(str),
			};
			exports$1.hex = chain(radix2(4), alphabet('0123456789abcdef'), join(''), normalize((s) => {
			    if (typeof s !== 'string' || s.length % 2)
			        throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
			    return s.toLowerCase();
			}));
			const CODERS = {
			    utf8: exports$1.utf8, hex: exports$1.hex, base16: exports$1.base16, base32: exports$1.base32, base64: exports$1.base64, base64url: exports$1.base64url, base58: exports$1.base58, base58xmr: exports$1.base58xmr
			};
			const coderTypeError = `Invalid encoding type. Available types: ${Object.keys(CODERS).join(', ')}`;
			const bytesToString = (type, bytes) => {
			    if (typeof type !== 'string' || !CODERS.hasOwnProperty(type))
			        throw new TypeError(coderTypeError);
			    if (!(bytes instanceof Uint8Array))
			        throw new TypeError('bytesToString() expects Uint8Array');
			    return CODERS[type].encode(bytes);
			};
			exports$1.bytesToString = bytesToString;
			exports$1.str = exports$1.bytesToString;
			const stringToBytes = (type, str) => {
			    if (!CODERS.hasOwnProperty(type))
			        throw new TypeError(coderTypeError);
			    if (typeof str !== 'string')
			        throw new TypeError('stringToBytes() expects string');
			    return CODERS[type].decode(str);
			};
			exports$1.stringToBytes = stringToBytes;
			exports$1.bytes = exports$1.stringToBytes; 
		} (lib));
		return lib;
	}

	var bolt11;
	var hasRequiredBolt11;

	function requireBolt11 () {
		if (hasRequiredBolt11) return bolt11;
		hasRequiredBolt11 = 1;
		const {bech32, hex, utf8} = requireLib();

		// defaults for encode; default timestamp is current time at call
		const DEFAULTNETWORK = {
		  // default network is bitcoin
		  bech32: 'bc',
		  pubKeyHash: 0x00,
		  scriptHash: 0x05,
		  validWitnessVersions: [0]
		};
		const TESTNETWORK = {
		  bech32: 'tb',
		  pubKeyHash: 0x6f,
		  scriptHash: 0xc4,
		  validWitnessVersions: [0]
		};
		const SIGNETNETWORK = {
		  bech32: 'tbs',
		  pubKeyHash: 0x6f,
		  scriptHash: 0xc4,
		  validWitnessVersions: [0]
		};
		const REGTESTNETWORK = {
		  bech32: 'bcrt',
		  pubKeyHash: 0x6f,
		  scriptHash: 0xc4,
		  validWitnessVersions: [0]
		};
		const SIMNETWORK = {
		  bech32: 'sb',
		  pubKeyHash: 0x3f,
		  scriptHash: 0x7b,
		  validWitnessVersions: [0]
		};

		const FEATUREBIT_ORDER = [
		  'option_data_loss_protect',
		  'initial_routing_sync',
		  'option_upfront_shutdown_script',
		  'gossip_queries',
		  'var_onion_optin',
		  'gossip_queries_ex',
		  'option_static_remotekey',
		  'payment_secret',
		  'basic_mpp',
		  'option_support_large_channel'
		];

		const DIVISORS = {
		  m: BigInt(1e3),
		  u: BigInt(1e6),
		  n: BigInt(1e9),
		  p: BigInt(1e12)
		};

		const MAX_MILLISATS = BigInt('2100000000000000000');

		const MILLISATS_PER_BTC = BigInt(1e11);

		const TAGCODES = {
		  payment_hash: 1,
		  payment_secret: 16,
		  description: 13,
		  payee: 19,
		  description_hash: 23, // commit to longer descriptions (used by lnurl-pay)
		  expiry: 6, // default: 3600 (1 hour)
		  min_final_cltv_expiry: 24, // default: 9
		  fallback_address: 9,
		  route_hint: 3, // for extra routing info (private etc.)
		  feature_bits: 5,
		  metadata: 27
		};

		// reverse the keys and values of TAGCODES and insert into TAGNAMES
		const TAGNAMES = {};
		for (let i = 0, keys = Object.keys(TAGCODES); i < keys.length; i++) {
		  const currentName = keys[i];
		  const currentCode = TAGCODES[keys[i]].toString();
		  TAGNAMES[currentCode] = currentName;
		}

		const TAGPARSERS = {
		  1: words => hex.encode(bech32.fromWordsUnsafe(words)), // 256 bits
		  16: words => hex.encode(bech32.fromWordsUnsafe(words)), // 256 bits
		  13: words => utf8.encode(bech32.fromWordsUnsafe(words)), // string variable length
		  19: words => hex.encode(bech32.fromWordsUnsafe(words)), // 264 bits
		  23: words => hex.encode(bech32.fromWordsUnsafe(words)), // 256 bits
		  27: words => hex.encode(bech32.fromWordsUnsafe(words)), // variable
		  6: wordsToIntBE, // default: 3600 (1 hour)
		  24: wordsToIntBE, // default: 9
		  3: routingInfoParser, // for extra routing info (private etc.)
		  5: featureBitsParser // keep feature bits as array of 5 bit words
		};

		function getUnknownParser(tagCode) {
		  return words => ({
		    tagCode: parseInt(tagCode),
		    words: bech32.encode('unknown', words, Number.MAX_SAFE_INTEGER)
		  })
		}

		function wordsToIntBE(words) {
		  return words.reverse().reduce((total, item, index) => {
		    return total + item * Math.pow(32, index)
		  }, 0)
		}

		// first convert from words to buffer, trimming padding where necessary
		// parse in 51 byte chunks. See encoder for details.
		function routingInfoParser(words) {
		  const routes = [];
		  let pubkey,
		    shortChannelId,
		    feeBaseMSats,
		    feeProportionalMillionths,
		    cltvExpiryDelta;
		  let routesBuffer = bech32.fromWordsUnsafe(words);
		  while (routesBuffer.length > 0) {
		    pubkey = hex.encode(routesBuffer.slice(0, 33)); // 33 bytes
		    shortChannelId = hex.encode(routesBuffer.slice(33, 41)); // 8 bytes
		    feeBaseMSats = parseInt(hex.encode(routesBuffer.slice(41, 45)), 16); // 4 bytes
		    feeProportionalMillionths = parseInt(
		      hex.encode(routesBuffer.slice(45, 49)),
		      16
		    ); // 4 bytes
		    cltvExpiryDelta = parseInt(hex.encode(routesBuffer.slice(49, 51)), 16); // 2 bytes

		    routesBuffer = routesBuffer.slice(51);

		    routes.push({
		      pubkey,
		      short_channel_id: shortChannelId,
		      fee_base_msat: feeBaseMSats,
		      fee_proportional_millionths: feeProportionalMillionths,
		      cltv_expiry_delta: cltvExpiryDelta
		    });
		  }
		  return routes
		}

		function featureBitsParser(words) {
		  const bools = words
		    .slice()
		    .reverse()
		    .map(word => [
		      !!(word & 1),
		      !!(word & 2),
		      !!(word & 4),
		      !!(word & 8),
		      !!(word & 16)
		    ])
		    .reduce((finalArr, itemArr) => finalArr.concat(itemArr), []);
		  while (bools.length < FEATUREBIT_ORDER.length * 2) {
		    bools.push(false);
		  }

		  const featureBits = {};

		  FEATUREBIT_ORDER.forEach((featureName, index) => {
		    let status;
		    if (bools[index * 2]) {
		      status = 'required';
		    } else if (bools[index * 2 + 1]) {
		      status = 'supported';
		    } else {
		      status = 'unsupported';
		    }
		    featureBits[featureName] = status;
		  });

		  const extraBits = bools.slice(FEATUREBIT_ORDER.length * 2);
		  featureBits.extra_bits = {
		    start_bit: FEATUREBIT_ORDER.length * 2,
		    bits: extraBits,
		    has_required: extraBits.reduce(
		      (result, bit, index) =>
		        index % 2 !== 0 ? result || false : result || bit,
		      false
		    )
		  };

		  return featureBits
		}

		function hrpToMillisat(hrpString, outputString) {
		  let divisor, value;
		  if (hrpString.slice(-1).match(/^[munp]$/)) {
		    divisor = hrpString.slice(-1);
		    value = hrpString.slice(0, -1);
		  } else if (hrpString.slice(-1).match(/^[^munp0-9]$/)) {
		    throw new Error('Not a valid multiplier for the amount')
		  } else {
		    value = hrpString;
		  }

		  if (!value.match(/^\d+$/))
		    throw new Error('Not a valid human readable amount')

		  const valueBN = BigInt(value);

		  const millisatoshisBN = divisor
		    ? (valueBN * MILLISATS_PER_BTC) / DIVISORS[divisor]
		    : valueBN * MILLISATS_PER_BTC;

		  if (
		    (divisor === 'p' && !(valueBN % BigInt(10) === BigInt(0))) ||
		    millisatoshisBN > MAX_MILLISATS
		  ) {
		    throw new Error('Amount is outside of valid range')
		  }

		  return outputString ? millisatoshisBN.toString() : millisatoshisBN
		}

		// decode will only have extra comments that aren't covered in encode comments.
		// also if anything is hard to read I'll comment.
		function decode(paymentRequest, network) {
		  if (typeof paymentRequest !== 'string')
		    throw new Error('Lightning Payment Request must be string')
		  if (paymentRequest.slice(0, 2).toLowerCase() !== 'ln')
		    throw new Error('Not a proper lightning payment request')

		  const sections = [];
		  const decoded = bech32.decode(paymentRequest, Number.MAX_SAFE_INTEGER);
		  paymentRequest = paymentRequest.toLowerCase();
		  const prefix = decoded.prefix;
		  let words = decoded.words;
		  let letters = paymentRequest.slice(prefix.length + 1);
		  let sigWords = words.slice(-104);
		  words = words.slice(0, -104);

		  // Without reverse lookups, can't say that the multipier at the end must
		  // have a number before it, so instead we parse, and if the second group
		  // doesn't have anything, there's a good chance the last letter of the
		  // coin type got captured by the third group, so just re-regex without
		  // the number.
		  let prefixMatches = prefix.match(/^ln(\S+?)(\d*)([a-zA-Z]?)$/);
		  if (prefixMatches && !prefixMatches[2])
		    prefixMatches = prefix.match(/^ln(\S+)$/);
		  if (!prefixMatches) {
		    throw new Error('Not a proper lightning payment request')
		  }

		  // "ln" section
		  sections.push({
		    name: 'lightning_network',
		    letters: 'ln'
		  });

		  // "bc" section
		  const bech32Prefix = prefixMatches[1];
		  let coinNetwork;
		  if (!network) {
		    switch (bech32Prefix) {
		      case DEFAULTNETWORK.bech32:
		        coinNetwork = DEFAULTNETWORK;
		        break
		      case TESTNETWORK.bech32:
		        coinNetwork = TESTNETWORK;
		        break
		      case SIGNETNETWORK.bech32:
		        coinNetwork = SIGNETNETWORK;
		        break
		      case REGTESTNETWORK.bech32:
		        coinNetwork = REGTESTNETWORK;
		        break
		      case SIMNETWORK.bech32:
		        coinNetwork = SIMNETWORK;
		        break
		    }
		  } else {
		    if (
		      network.bech32 === undefined ||
		      network.pubKeyHash === undefined ||
		      network.scriptHash === undefined ||
		      !Array.isArray(network.validWitnessVersions)
		    )
		      throw new Error('Invalid network')
		    coinNetwork = network;
		  }
		  if (!coinNetwork || coinNetwork.bech32 !== bech32Prefix) {
		    throw new Error('Unknown coin bech32 prefix')
		  }
		  sections.push({
		    name: 'coin_network',
		    letters: bech32Prefix,
		    value: coinNetwork
		  });

		  // amount section
		  const value = prefixMatches[2];
		  let millisatoshis;
		  if (value) {
		    const divisor = prefixMatches[3];
		    millisatoshis = hrpToMillisat(value + divisor, true);
		    sections.push({
		      name: 'amount',
		      letters: prefixMatches[2] + prefixMatches[3],
		      value: millisatoshis
		    });
		  } else {
		    millisatoshis = null;
		  }

		  // "1" separator
		  sections.push({
		    name: 'separator',
		    letters: '1'
		  });

		  // timestamp
		  const timestamp = wordsToIntBE(words.slice(0, 7));
		  words = words.slice(7); // trim off the left 7 words
		  sections.push({
		    name: 'timestamp',
		    letters: letters.slice(0, 7),
		    value: timestamp
		  });
		  letters = letters.slice(7);

		  let tagName, parser, tagLength, tagWords;
		  // we have no tag count to go on, so just keep hacking off words
		  // until we have none.
		  while (words.length > 0) {
		    const tagCode = words[0].toString();
		    tagName = TAGNAMES[tagCode] || 'unknown_tag';
		    parser = TAGPARSERS[tagCode] || getUnknownParser(tagCode);
		    words = words.slice(1);

		    tagLength = wordsToIntBE(words.slice(0, 2));
		    words = words.slice(2);

		    tagWords = words.slice(0, tagLength);
		    words = words.slice(tagLength);

		    sections.push({
		      name: tagName,
		      tag: letters[0],
		      letters: letters.slice(0, 1 + 2 + tagLength),
		      value: parser(tagWords) // see: parsers for more comments
		    });
		    letters = letters.slice(1 + 2 + tagLength);
		  }

		  // signature
		  sections.push({
		    name: 'signature',
		    letters: letters.slice(0, 104),
		    value: hex.encode(bech32.fromWordsUnsafe(sigWords))
		  });
		  letters = letters.slice(104);

		  // checksum
		  sections.push({
		    name: 'checksum',
		    letters: letters
		  });

		  let result = {
		    paymentRequest,
		    sections,

		    get expiry() {
		      let exp = sections.find(s => s.name === 'expiry');
		      if (exp) return getValue('timestamp') + exp.value
		    },

		    get route_hints() {
		      return sections.filter(s => s.name === 'route_hint').map(s => s.value)
		    }
		  };

		  for (let name in TAGCODES) {
		    if (name === 'route_hint') {
		      // route hints can be multiple, so this won't work for them
		      continue
		    }

		    Object.defineProperty(result, name, {
		      get() {
		        return getValue(name)
		      }
		    });
		  }

		  return result

		  function getValue(name) {
		    let section = sections.find(s => s.name === name);
		    return section ? section.value : undefined
		  }
		}

		bolt11 = {
		  decode,
		  hrpToMillisat
		};
		return bolt11;
	}

	requireBolt11();

	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __copyProps = (to, from, except, desc) => {
	  if (from && typeof from === "object" || typeof from === "function") {
	    for (let key of __getOwnPropNames(from))
	      if (!__hasOwnProp.call(to, key) && key !== except)
	        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
	  }
	  return to;
	};
	var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget);

	// src/outbox/write.ts
	function getRelaysForSync(ndk, author, type = "write") {
	  if (!ndk.outboxTracker) return void 0;
	  const item = ndk.outboxTracker.data.get(author);
	  if (!item) return void 0;
	  if (type === "write") {
	    return item.writeRelays;
	  }
	  return item.readRelays;
	}
	async function getWriteRelaysFor(ndk, author, type = "write") {
	  if (!ndk.outboxTracker) return void 0;
	  if (!ndk.outboxTracker.data.has(author)) {
	    await ndk.outboxTracker.trackUsers([author]);
	  }
	  return getRelaysForSync(ndk, author, type);
	}

	// src/outbox/relay-ranking.ts
	function getTopRelaysForAuthors(ndk, authors) {
	  const relaysWithCount = /* @__PURE__ */ new Map();
	  authors.forEach((author) => {
	    const writeRelays = getRelaysForSync(ndk, author);
	    if (writeRelays) {
	      writeRelays.forEach((relay) => {
	        const count = relaysWithCount.get(relay) || 0;
	        relaysWithCount.set(relay, count + 1);
	      });
	    }
	  });
	  const sortedRelays = Array.from(relaysWithCount.entries()).sort((a, b) => b[1] - a[1]);
	  return sortedRelays.map((entry) => entry[0]);
	}

	// src/outbox/index.ts
	function getAllRelaysForAllPubkeys(ndk, pubkeys, type = "read") {
	  const pubkeysToRelays = /* @__PURE__ */ new Map();
	  const authorsMissingRelays = /* @__PURE__ */ new Set();
	  pubkeys.forEach((pubkey) => {
	    const relays = getRelaysForSync(ndk, pubkey, type);
	    if (relays && relays.size > 0) {
	      relays.forEach((relay) => {
	        const pubkeysInRelay = pubkeysToRelays.get(relay) || /* @__PURE__ */ new Set();
	        pubkeysInRelay.add(pubkey);
	      });
	      pubkeysToRelays.set(pubkey, relays);
	    } else {
	      authorsMissingRelays.add(pubkey);
	    }
	  });
	  return { pubkeysToRelays, authorsMissingRelays };
	}
	function chooseRelayCombinationForPubkeys(ndk, pubkeys, type, { count, preferredRelays } = {}) {
	  count ??= 2;
	  preferredRelays ??= /* @__PURE__ */ new Set();
	  const pool = ndk.pool;
	  const connectedRelays = pool.connectedRelays();
	  connectedRelays.forEach((relay) => {
	    preferredRelays?.add(relay.url);
	  });
	  const relayToAuthorsMap = /* @__PURE__ */ new Map();
	  const { pubkeysToRelays, authorsMissingRelays } = getAllRelaysForAllPubkeys(ndk, pubkeys, type);
	  const sortedRelays = getTopRelaysForAuthors(ndk, pubkeys);
	  const addAuthorToRelay = (author, relay) => {
	    const authorsInRelay = relayToAuthorsMap.get(relay) || [];
	    authorsInRelay.push(author);
	    relayToAuthorsMap.set(relay, authorsInRelay);
	  };
	  for (const [author, authorRelays] of pubkeysToRelays.entries()) {
	    let missingRelayCount = count;
	    const addedRelaysForAuthor = /* @__PURE__ */ new Set();
	    for (const relay of connectedRelays) {
	      if (authorRelays.has(relay.url)) {
	        addAuthorToRelay(author, relay.url);
	        addedRelaysForAuthor.add(relay.url);
	        missingRelayCount--;
	      }
	    }
	    for (const authorRelay of authorRelays) {
	      if (addedRelaysForAuthor.has(authorRelay)) continue;
	      if (relayToAuthorsMap.has(authorRelay)) {
	        addAuthorToRelay(author, authorRelay);
	        addedRelaysForAuthor.add(authorRelay);
	        missingRelayCount--;
	      }
	    }
	    if (missingRelayCount <= 0) continue;
	    for (const relay of sortedRelays) {
	      if (missingRelayCount <= 0) break;
	      if (addedRelaysForAuthor.has(relay)) continue;
	      if (authorRelays.has(relay)) {
	        addAuthorToRelay(author, relay);
	        addedRelaysForAuthor.add(relay);
	        missingRelayCount--;
	      }
	    }
	  }
	  for (const author of authorsMissingRelays) {
	    pool.permanentAndConnectedRelays().forEach((relay) => {
	      const authorsInRelay = relayToAuthorsMap.get(relay.url) || [];
	      authorsInRelay.push(author);
	      relayToAuthorsMap.set(relay.url, authorsInRelay);
	    });
	  }
	  return relayToAuthorsMap;
	}

	// src/outbox/read/with-authors.ts
	function getRelaysForFilterWithAuthors(ndk, authors, relayGoalPerAuthor = 2) {
	  return chooseRelayCombinationForPubkeys(ndk, authors, "write", { count: relayGoalPerAuthor });
	}

	// src/utils/normalize-url.ts
	function tryNormalizeRelayUrl(url) {
	  try {
	    return normalizeRelayUrl(url);
	  } catch {
	    return void 0;
	  }
	}
	function normalizeRelayUrl(url) {
	  let r = normalizeUrl(url, {
	    stripAuthentication: false,
	    stripWWW: false,
	    stripHash: true
	  });
	  if (!r.endsWith("/")) {
	    r += "/";
	  }
	  return r;
	}
	function normalize(urls) {
	  const normalized = /* @__PURE__ */ new Set();
	  for (const url of urls) {
	    try {
	      normalized.add(normalizeRelayUrl(url));
	    } catch {
	    }
	  }
	  return Array.from(normalized);
	}
	var DATA_URL_DEFAULT_MIME_TYPE = "text/plain";
	var DATA_URL_DEFAULT_CHARSET = "us-ascii";
	var testParameter = (name, filters) => filters.some((filter) => filter instanceof RegExp ? filter.test(name) : filter === name);
	var supportedProtocols = /* @__PURE__ */ new Set(["https:", "http:", "file:"]);
	var hasCustomProtocol = (urlString) => {
	  try {
	    const { protocol } = new URL(urlString);
	    return protocol.endsWith(":") && !protocol.includes(".") && !supportedProtocols.has(protocol);
	  } catch {
	    return false;
	  }
	};
	var normalizeDataURL = (urlString, { stripHash }) => {
	  const match = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(urlString);
	  if (!match) {
	    throw new Error(`Invalid URL: ${urlString}`);
	  }
	  const type = match.groups?.type ?? "";
	  const data = match.groups?.data ?? "";
	  let hash = match.groups?.hash ?? "";
	  const mediaType = type.split(";");
	  hash = stripHash ? "" : hash;
	  let isBase64 = false;
	  if (mediaType[mediaType.length - 1] === "base64") {
	    mediaType.pop();
	    isBase64 = true;
	  }
	  const mimeType = mediaType.shift()?.toLowerCase() ?? "";
	  const attributes = mediaType.map((attribute) => {
	    let [key, value = ""] = attribute.split("=").map((string) => string.trim());
	    if (key === "charset") {
	      value = value.toLowerCase();
	      if (value === DATA_URL_DEFAULT_CHARSET) {
	        return "";
	      }
	    }
	    return `${key}${value ? `=${value}` : ""}`;
	  }).filter(Boolean);
	  const normalizedMediaType = [...attributes];
	  if (isBase64) {
	    normalizedMediaType.push("base64");
	  }
	  if (normalizedMediaType.length > 0 || mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE) {
	    normalizedMediaType.unshift(mimeType);
	  }
	  return `data:${normalizedMediaType.join(";")},${isBase64 ? data.trim() : data}${hash ? `#${hash}` : ""}`;
	};
	function normalizeUrl(urlString, options = {}) {
	  options = {
	    defaultProtocol: "http",
	    normalizeProtocol: true,
	    forceHttp: false,
	    forceHttps: false,
	    stripAuthentication: true,
	    stripHash: false,
	    stripTextFragment: true,
	    stripWWW: true,
	    removeQueryParameters: [/^utm_\w+/i],
	    removeTrailingSlash: true,
	    removeSingleSlash: true,
	    removeDirectoryIndex: false,
	    removeExplicitPort: false,
	    sortQueryParameters: true,
	    ...options
	  };
	  if (typeof options.defaultProtocol === "string" && !options.defaultProtocol.endsWith(":")) {
	    options.defaultProtocol = `${options.defaultProtocol}:`;
	  }
	  urlString = urlString.trim();
	  if (/^data:/i.test(urlString)) {
	    return normalizeDataURL(urlString, options);
	  }
	  if (hasCustomProtocol(urlString)) {
	    return urlString;
	  }
	  const hasRelativeProtocol = urlString.startsWith("//");
	  const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);
	  if (!isRelativeUrl) {
	    urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
	  }
	  const urlObject = new URL(urlString);
	  urlObject.hostname = urlObject.hostname.toLowerCase();
	  if (options.forceHttp && options.forceHttps) {
	    throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
	  }
	  if (options.forceHttp && urlObject.protocol === "https:") {
	    urlObject.protocol = "http:";
	  }
	  if (options.forceHttps && urlObject.protocol === "http:") {
	    urlObject.protocol = "https:";
	  }
	  if (options.stripAuthentication) {
	    urlObject.username = "";
	    urlObject.password = "";
	  }
	  if (options.stripHash) {
	    urlObject.hash = "";
	  } else if (options.stripTextFragment) {
	    urlObject.hash = urlObject.hash.replace(/#?:~:text.*?$/i, "");
	  }
	  if (urlObject.pathname) {
	    const protocolRegex = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
	    let lastIndex = 0;
	    let result = "";
	    for (; ; ) {
	      const match = protocolRegex.exec(urlObject.pathname);
	      if (!match) {
	        break;
	      }
	      const protocol = match[0];
	      const protocolAtIndex = match.index;
	      const intermediate = urlObject.pathname.slice(lastIndex, protocolAtIndex);
	      result += intermediate.replace(/\/{2,}/g, "/");
	      result += protocol;
	      lastIndex = protocolAtIndex + protocol.length;
	    }
	    const remnant = urlObject.pathname.slice(lastIndex, urlObject.pathname.length);
	    result += remnant.replace(/\/{2,}/g, "/");
	    urlObject.pathname = result;
	  }
	  if (urlObject.pathname) {
	    try {
	      urlObject.pathname = decodeURI(urlObject.pathname);
	    } catch {
	    }
	  }
	  if (options.removeDirectoryIndex === true) {
	    options.removeDirectoryIndex = [/^index\.[a-z]+$/];
	  }
	  if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
	    let pathComponents = urlObject.pathname.split("/");
	    const lastComponent = pathComponents[pathComponents.length - 1];
	    if (testParameter(lastComponent, options.removeDirectoryIndex)) {
	      pathComponents = pathComponents.slice(0, -1);
	      urlObject.pathname = `${pathComponents.slice(1).join("/")}/`;
	    }
	  }
	  if (urlObject.hostname) {
	    urlObject.hostname = urlObject.hostname.replace(/\.$/, "");
	    if (options.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(urlObject.hostname)) {
	      urlObject.hostname = urlObject.hostname.replace(/^www\./, "");
	    }
	  }
	  if (Array.isArray(options.removeQueryParameters)) {
	    for (const key of [...urlObject.searchParams.keys()]) {
	      if (testParameter(key, options.removeQueryParameters)) {
	        urlObject.searchParams.delete(key);
	      }
	    }
	  }
	  if (!Array.isArray(options.keepQueryParameters) && options.removeQueryParameters === true) {
	    urlObject.search = "";
	  }
	  if (Array.isArray(options.keepQueryParameters) && options.keepQueryParameters.length > 0) {
	    for (const key of [...urlObject.searchParams.keys()]) {
	      if (!testParameter(key, options.keepQueryParameters)) {
	        urlObject.searchParams.delete(key);
	      }
	    }
	  }
	  if (options.sortQueryParameters) {
	    urlObject.searchParams.sort();
	    try {
	      urlObject.search = decodeURIComponent(urlObject.search);
	    } catch {
	    }
	  }
	  if (options.removeTrailingSlash) {
	    urlObject.pathname = urlObject.pathname.replace(/\/$/, "");
	  }
	  if (options.removeExplicitPort && urlObject.port) {
	    urlObject.port = "";
	  }
	  const oldUrlString = urlString;
	  urlString = urlObject.toString();
	  if (!options.removeSingleSlash && urlObject.pathname === "/" && !oldUrlString.endsWith("/") && urlObject.hash === "") {
	    urlString = urlString.replace(/\/$/, "");
	  }
	  if ((options.removeTrailingSlash || urlObject.pathname === "/") && urlObject.hash === "" && options.removeSingleSlash) {
	    urlString = urlString.replace(/\/$/, "");
	  }
	  if (hasRelativeProtocol && !options.normalizeProtocol) {
	    urlString = urlString.replace(/^http:\/\//, "//");
	  }
	  if (options.stripProtocol) {
	    urlString = urlString.replace(/^(?:https?:)?\/\//, "");
	  }
	  return urlString;
	}

	// src/relay/keepalive.ts
	var NDKRelayKeepalive = class {
	  /**
	   * @param timeout - Time in milliseconds to wait before considering connection stale (default 30s)
	   * @param onSilenceDetected - Callback when silence is detected
	   */
	  constructor(timeout = 3e4, onSilenceDetected) {
	    this.onSilenceDetected = onSilenceDetected;
	    this.timeout = timeout;
	  }
	  lastActivity = Date.now();
	  timer;
	  timeout;
	  isRunning = false;
	  /**
	   * Records activity from the relay, resetting the silence timer
	   */
	  recordActivity() {
	    this.lastActivity = Date.now();
	    if (this.isRunning) {
	      this.resetTimer();
	    }
	  }
	  /**
	   * Starts monitoring for relay silence
	   */
	  start() {
	    if (this.isRunning) return;
	    this.isRunning = true;
	    this.lastActivity = Date.now();
	    this.resetTimer();
	  }
	  /**
	   * Stops monitoring for relay silence
	   */
	  stop() {
	    this.isRunning = false;
	    if (this.timer) {
	      clearTimeout(this.timer);
	      this.timer = void 0;
	    }
	  }
	  resetTimer() {
	    if (this.timer) {
	      clearTimeout(this.timer);
	    }
	    this.timer = setTimeout(() => {
	      const silenceTime = Date.now() - this.lastActivity;
	      if (silenceTime >= this.timeout) {
	        this.onSilenceDetected();
	      } else {
	        const remainingTime = this.timeout - silenceTime;
	        this.timer = setTimeout(() => {
	          this.onSilenceDetected();
	        }, remainingTime);
	      }
	    }, this.timeout);
	  }
	};
	async function probeRelayConnection(relay) {
	  const probeId = `probe-${Math.random().toString(36).substring(7)}`;
	  return new Promise((resolve) => {
	    let responded = false;
	    const timeout = setTimeout(() => {
	      if (!responded) {
	        responded = true;
	        relay.send(["CLOSE", probeId]);
	        resolve(false);
	      }
	    }, 5e3);
	    const handler = () => {
	      if (!responded) {
	        responded = true;
	        clearTimeout(timeout);
	        relay.send(["CLOSE", probeId]);
	        resolve(true);
	      }
	    };
	    relay.once("message", handler);
	    relay.send([
	      "REQ",
	      probeId,
	      {
	        kinds: [99999],
	        limit: 0
	      }
	    ]);
	  });
	}

	// src/relay/connectivity.ts
	var MAX_RECONNECT_ATTEMPTS = 5;
	var FLAPPING_THRESHOLD_MS = 1e3;
	var NDKRelayConnectivity = class {
	  ndkRelay;
	  ws;
	  _status;
	  timeoutMs;
	  connectedAt;
	  _connectionStats = {
	    attempts: 0,
	    success: 0,
	    durations: []
	  };
	  debug;
	  netDebug;
	  connectTimeout;
	  reconnectTimeout;
	  ndk;
	  openSubs = /* @__PURE__ */ new Map();
	  openCountRequests = /* @__PURE__ */ new Map();
	  openEventPublishes = /* @__PURE__ */ new Map();
	  pendingAuthPublishes = /* @__PURE__ */ new Map();
	  serial = 0;
	  baseEoseTimeout = 4400;
	  // Keepalive and monitoring
	  keepalive;
	  wsStateMonitor;
	  sleepDetector;
	  lastSleepCheck = Date.now();
	  lastMessageSent = Date.now();
	  wasIdle = false;
	  constructor(ndkRelay, ndk) {
	    this.ndkRelay = ndkRelay;
	    this._status = 1 /* DISCONNECTED */;
	    const rand = Math.floor(Math.random() * 1e3);
	    this.debug = this.ndkRelay.debug.extend(`connectivity${rand}`);
	    this.ndk = ndk;
	    this.setupMonitoring();
	  }
	  /**
	   * Sets up keepalive, WebSocket state monitoring, and sleep detection
	   */
	  setupMonitoring() {
	    this.keepalive = new NDKRelayKeepalive(12e4, async () => {
	      this.debug("Relay silence detected, probing connection");
	      const isAlive = await probeRelayConnection({
	        send: (msg) => this.send(JSON.stringify(msg)),
	        once: (event, handler) => {
	          const messageHandler = (e) => {
	            try {
	              const data = JSON.parse(e.data);
	              if (data[0] === "EOSE" || data[0] === "EVENT" || data[0] === "NOTICE") {
	                handler();
	                this.ws?.removeEventListener("message", messageHandler);
	              }
	            } catch {
	            }
	          };
	          this.ws?.addEventListener("message", messageHandler);
	        }
	      });
	      if (!isAlive) {
	        this.debug("Probe failed, connection is stale");
	        this.handleStaleConnection();
	      }
	    });
	    this.wsStateMonitor = setInterval(() => {
	      if (this._status === 5 /* CONNECTED */) {
	        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
	          this.debug("WebSocket died silently, reconnecting");
	          this.handleStaleConnection();
	        }
	      }
	    }, 5e3);
	    this.sleepDetector = setInterval(() => {
	      const now = Date.now();
	      const elapsed = now - this.lastSleepCheck;
	      if (elapsed > 15e3) {
	        this.debug(`Detected possible sleep/wake (${elapsed}ms gap)`);
	        this.handlePossibleWake();
	      }
	      this.lastSleepCheck = now;
	    }, 1e4);
	  }
	  /**
	   * Handles detection of a stale connection
	   */
	  handleStaleConnection() {
	    this._status = 1 /* DISCONNECTED */;
	    this.wasIdle = true;
	    this.onDisconnect();
	  }
	  /**
	   * Handles possible system wake event
	   */
	  handlePossibleWake() {
	    this.debug("System wake detected, checking all connections");
	    this.wasIdle = true;
	    if (this._status >= 5 /* CONNECTED */) {
	      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
	        this.handleStaleConnection();
	      } else {
	        probeRelayConnection({
	          send: (msg) => this.send(JSON.stringify(msg)),
	          once: (event, handler) => {
	            const messageHandler = (e) => {
	              try {
	                const data = JSON.parse(e.data);
	                if (data[0] === "EOSE" || data[0] === "EVENT" || data[0] === "NOTICE") {
	                  handler();
	                  this.ws?.removeEventListener("message", messageHandler);
	                }
	              } catch {
	              }
	            };
	            this.ws?.addEventListener("message", messageHandler);
	          }
	        }).then((isAlive) => {
	          if (!isAlive) {
	            this.handleStaleConnection();
	          }
	        });
	      }
	    }
	  }
	  /**
	   * Resets the reconnection state for system-wide events
	   * Used by NDKPool when detecting system sleep/wake
	   */
	  resetReconnectionState() {
	    this.wasIdle = true;
	    if (this.reconnectTimeout) {
	      clearTimeout(this.reconnectTimeout);
	      this.reconnectTimeout = void 0;
	    }
	  }
	  /**
	   * Connects to the NDK relay and handles the connection lifecycle.
	   *
	   * This method attempts to establish a WebSocket connection to the NDK relay specified in the `ndkRelay` object.
	   * If the connection is successful, it updates the connection statistics, sets the connection status to `CONNECTED`,
	   * and emits `connect` and `ready` events on the `ndkRelay` object.
	   *
	   * If the connection attempt fails, it handles the error by either initiating a reconnection attempt or emitting a
	   * `delayed-connect` event on the `ndkRelay` object, depending on the `reconnect` parameter.
	   *
	   * @param timeoutMs - The timeout in milliseconds for the connection attempt. If not provided, the default timeout from the `ndkRelay` object is used.
	   * @param reconnect - Indicates whether a reconnection should be attempted if the connection fails. Defaults to `true`.
	   * @returns A Promise that resolves when the connection is established, or rejects if the connection fails.
	   */
	  async connect(timeoutMs, reconnect = true) {
	    if (this.ws && this.ws.readyState !== WebSocket.OPEN && this.ws.readyState !== WebSocket.CONNECTING) {
	      this.debug("Cleaning up stale WebSocket connection");
	      try {
	        this.ws.close();
	      } catch (e) {
	      }
	      this.ws = void 0;
	      this._status = 1 /* DISCONNECTED */;
	    }
	    if (this._status !== 2 /* RECONNECTING */ && this._status !== 1 /* DISCONNECTED */ || this.reconnectTimeout) {
	      this.debug(
	        "Relay requested to be connected but was in state %s or it had a reconnect timeout",
	        this._status
	      );
	      return;
	    }
	    if (this.reconnectTimeout) {
	      clearTimeout(this.reconnectTimeout);
	      this.reconnectTimeout = void 0;
	    }
	    if (this.connectTimeout) {
	      clearTimeout(this.connectTimeout);
	      this.connectTimeout = void 0;
	    }
	    timeoutMs ??= this.timeoutMs;
	    if (!this.timeoutMs && timeoutMs) this.timeoutMs = timeoutMs;
	    if (this.timeoutMs) this.connectTimeout = setTimeout(() => this.onConnectionError(reconnect), this.timeoutMs);
	    try {
	      this.updateConnectionStats.attempt();
	      if (this._status === 1 /* DISCONNECTED */) this._status = 4 /* CONNECTING */;
	      else this._status = 2 /* RECONNECTING */;
	      this.ws = new WebSocket(this.ndkRelay.url);
	      this.ws.onopen = this.onConnect.bind(this);
	      this.ws.onclose = this.onDisconnect.bind(this);
	      this.ws.onmessage = this.onMessage.bind(this);
	      this.ws.onerror = this.onError.bind(this);
	    } catch (e) {
	      this.debug(`Failed to connect to ${this.ndkRelay.url}`, e);
	      this._status = 1 /* DISCONNECTED */;
	      if (reconnect) this.handleReconnection();
	      else this.ndkRelay.emit("delayed-connect", 2 * 24 * 60 * 60 * 1e3);
	      throw e;
	    }
	  }
	  /**
	   * Disconnects the WebSocket connection to the NDK relay.
	   * This method sets the connection status to `NDKRelayStatus.DISCONNECTING`,
	   * attempts to close the WebSocket connection, and sets the status to
	   * `NDKRelayStatus.DISCONNECTED` if the disconnect operation fails.
	   */
	  disconnect() {
	    this._status = 0 /* DISCONNECTING */;
	    this.keepalive?.stop();
	    if (this.wsStateMonitor) {
	      clearInterval(this.wsStateMonitor);
	      this.wsStateMonitor = void 0;
	    }
	    if (this.sleepDetector) {
	      clearInterval(this.sleepDetector);
	      this.sleepDetector = void 0;
	    }
	    try {
	      this.ws?.close();
	    } catch (e) {
	      this.debug("Failed to disconnect", e);
	      this._status = 1 /* DISCONNECTED */;
	    }
	  }
	  /**
	   * Handles the error that occurred when attempting to connect to the NDK relay.
	   * If `reconnect` is `true`, this method will initiate a reconnection attempt.
	   * Otherwise, it will emit a `delayed-connect` event on the `ndkRelay` object,
	   * indicating that a reconnection should be attempted after a delay.
	   *
	   * @param reconnect - Indicates whether a reconnection should be attempted.
	   */
	  onConnectionError(reconnect) {
	    this.debug(`Error connecting to ${this.ndkRelay.url}`, this.timeoutMs);
	    if (reconnect && !this.reconnectTimeout) {
	      this.handleReconnection();
	    }
	  }
	  /**
	   * Handles the connection event when the WebSocket connection is established.
	   * This method is called when the WebSocket connection is successfully opened.
	   * It clears any existing connection and reconnection timeouts, updates the connection statistics,
	   * sets the connection status to `CONNECTED`, and emits `connect` and `ready` events on the `ndkRelay` object.
	   */
	  onConnect() {
	    this.netDebug?.("connected", this.ndkRelay);
	    if (this.reconnectTimeout) {
	      clearTimeout(this.reconnectTimeout);
	      this.reconnectTimeout = void 0;
	    }
	    if (this.connectTimeout) {
	      clearTimeout(this.connectTimeout);
	      this.connectTimeout = void 0;
	    }
	    this.updateConnectionStats.connected();
	    this._status = 5 /* CONNECTED */;
	    this.keepalive?.start();
	    this.wasIdle = false;
	    this.ndkRelay.emit("connect");
	    this.ndkRelay.emit("ready");
	  }
	  /**
	   * Handles the disconnection event when the WebSocket connection is closed.
	   * This method is called when the WebSocket connection is successfully closed.
	   * It updates the connection statistics, sets the connection status to `DISCONNECTED`,
	   * initiates a reconnection attempt if we didn't disconnect ourselves,
	   * and emits a `disconnect` event on the `ndkRelay` object.
	   */
	  onDisconnect() {
	    this.netDebug?.("disconnected", this.ndkRelay);
	    this.updateConnectionStats.disconnected();
	    this.keepalive?.stop();
	    this.clearPendingPublishes(new Error(`Relay ${this.ndkRelay.url} disconnected`));
	    if (this._status === 5 /* CONNECTED */) {
	      this.handleReconnection();
	    }
	    this._status = 1 /* DISCONNECTED */;
	    this.ndkRelay.emit("disconnect");
	  }
	  /**
	   * Handles incoming messages from the NDK relay WebSocket connection.
	   * This method is called whenever a message is received from the relay.
	   * It parses the message data and dispatches the appropriate handling logic based on the message type.
	   *
	   * @param event - The MessageEvent containing the received message data.
	   */
	  onMessage(event) {
	    this.netDebug?.(event.data, this.ndkRelay, "recv");
	    this.keepalive?.recordActivity();
	    try {
	      const data = JSON.parse(event.data);
	      const [cmd, id, ..._rest] = data;
	      const handler = this.ndkRelay.getProtocolHandler(cmd);
	      if (handler) {
	        handler(this.ndkRelay, data);
	        return;
	      }
	      switch (cmd) {
	        case "EVENT": {
	          const so = this.openSubs.get(id);
	          const event2 = data[2];
	          if (!so) {
	            this.debug(`Received event for unknown subscription ${id}`);
	            return;
	          }
	          so.onevent(event2);
	          return;
	        }
	        case "COUNT": {
	          const payload = data[2];
	          const cr = this.openCountRequests.get(id);
	          if (cr) {
	            cr.resolve(payload.count);
	            this.openCountRequests.delete(id);
	          }
	          return;
	        }
	        case "EOSE": {
	          const so = this.openSubs.get(id);
	          if (!so) return;
	          so.oneose(id);
	          return;
	        }
	        case "OK": {
	          const ok = data[2];
	          const reason = data[3];
	          const ep = this.openEventPublishes.get(id);
	          const firstEp = ep?.pop();
	          if (!ep || !firstEp) {
	            this.debug("Received OK for unknown event publish", id);
	            return;
	          }
	          if (ok) {
	            firstEp.resolve(reason);
	            this.pendingAuthPublishes.delete(id);
	          } else {
	            const isAuthRequired = reason && (reason.toLowerCase().includes("auth-required") || reason.toLowerCase().includes("not authorized") || reason.toLowerCase().includes("blocked: not authorized"));
	            if (isAuthRequired) {
	              const event2 = this.pendingAuthPublishes.get(id);
	              if (event2) {
	                this.debug("Publish failed due to auth-required, will retry after auth", id);
	                ep.push(firstEp);
	                this.openEventPublishes.set(id, ep);
	              } else {
	                firstEp.reject(new Error(reason));
	              }
	            } else {
	              firstEp.reject(new Error(reason));
	              this.pendingAuthPublishes.delete(id);
	            }
	          }
	          if (ep.length === 0) {
	            this.openEventPublishes.delete(id);
	          } else if (!ok && !(reason?.toLowerCase().includes("auth-required") || reason?.toLowerCase().includes("not authorized") || reason?.toLowerCase().includes("blocked: not authorized"))) {
	            this.openEventPublishes.set(id, ep);
	          }
	          return;
	        }
	        case "CLOSED": {
	          const so = this.openSubs.get(id);
	          if (!so) return;
	          so.onclosed(data[2]);
	          return;
	        }
	        case "NOTICE":
	          this.onNotice(data[1]);
	          return;
	        case "AUTH": {
	          this.onAuthRequested(data[1]);
	          return;
	        }
	      }
	    } catch (error) {
	      this.debug(`Error parsing message from ${this.ndkRelay.url}: ${error.message}`, error?.stack);
	      return;
	    }
	  }
	  /**
	   * Handles an authentication request from the NDK relay.
	   *
	   * If an authentication policy is configured, it will be used to authenticate the connection.
	   * Otherwise, the `auth` event will be emitted to allow the application to handle the authentication.
	   *
	   * @param challenge - The authentication challenge provided by the NDK relay.
	   */
	  async onAuthRequested(challenge) {
	    const authPolicy = this.ndkRelay.authPolicy ?? this.ndk?.relayAuthDefaultPolicy;
	    this.debug("Relay requested authentication", {
	      havePolicy: !!authPolicy
	    });
	    if (this._status === 7 /* AUTHENTICATING */) {
	      this.debug("Already authenticating, ignoring");
	      return;
	    }
	    this._status = 6 /* AUTH_REQUESTED */;
	    if (authPolicy) {
	      if (this._status >= 5 /* CONNECTED */) {
	        this._status = 7 /* AUTHENTICATING */;
	        let res;
	        try {
	          res = await authPolicy(this.ndkRelay, challenge);
	        } catch (e) {
	          this.debug("Authentication policy threw an error", e);
	          res = false;
	        }
	        this.debug("Authentication policy returned", !!res);
	        if (res instanceof NDKEvent || res === true) {
	          if (res instanceof NDKEvent) {
	            await this.auth(res);
	          }
	          const authenticate = async () => {
	            if (this._status >= 5 /* CONNECTED */ && this._status < 8 /* AUTHENTICATED */) {
	              const event = new NDKEvent(this.ndk);
	              event.kind = 22242 /* ClientAuth */;
	              event.tags = [
	                ["relay", this.ndkRelay.url],
	                ["challenge", challenge]
	              ];
	              await event.sign();
	              this.auth(event).then(() => {
	                this._status = 8 /* AUTHENTICATED */;
	                this.ndkRelay.emit("authed");
	                this.debug("Authentication successful");
	                this.retryPendingAuthPublishes();
	              }).catch((e) => {
	                this._status = 6 /* AUTH_REQUESTED */;
	                this.ndkRelay.emit("auth:failed", e);
	                this.debug("Authentication failed", e);
	                this.rejectPendingAuthPublishes(e);
	              });
	            } else {
	              this.debug("Authentication failed, it changed status, status is %d", this._status);
	            }
	          };
	          if (res === true) {
	            if (!this.ndk?.signer) {
	              this.debug("No signer available for authentication localhost");
	              this.ndk?.once("signer:ready", authenticate);
	            } else {
	              authenticate().catch((e) => {
	                console.error("Error authenticating", e);
	              });
	            }
	          }
	          this._status = 5 /* CONNECTED */;
	          this.ndkRelay.emit("authed");
	        }
	      }
	    } else {
	      this.ndkRelay.emit("auth", challenge);
	    }
	  }
	  /**
	   * Handles errors that occur on the WebSocket connection to the relay.
	   * @param error - The error or event that occurred.
	   */
	  onError(error) {
	    this.debug(`WebSocket error on ${this.ndkRelay.url}:`, error);
	  }
	  /**
	   * Gets the current status of the NDK relay connection.
	   * @returns {NDKRelayStatus} The current status of the NDK relay connection.
	   */
	  get status() {
	    return this._status;
	  }
	  /**
	   * Checks if the NDK relay connection is currently available.
	   * @returns {boolean} `true` if the relay connection is in the `CONNECTED` status, `false` otherwise.
	   */
	  isAvailable() {
	    return this._status === 5 /* CONNECTED */;
	  }
	  /**
	   * Checks if the NDK relay connection is flapping, which means the connection is rapidly
	   * disconnecting and reconnecting. This is determined by analyzing the durations of the
	   * last three connection attempts. If the standard deviation of the durations is less
	   * than 1000 milliseconds, the connection is considered to be flapping.
	   *
	   * @returns {boolean} `true` if the connection is flapping, `false` otherwise.
	   */
	  isFlapping() {
	    const durations = this._connectionStats.durations;
	    if (durations.length % 3 !== 0) return false;
	    const sum = durations.reduce((a, b) => a + b, 0);
	    const avg = sum / durations.length;
	    const variance = durations.map((x) => (x - avg) ** 2).reduce((a, b) => a + b, 0) / durations.length;
	    const stdDev = Math.sqrt(variance);
	    const isFlapping = stdDev < FLAPPING_THRESHOLD_MS;
	    return isFlapping;
	  }
	  /**
	   * Handles a notice received from the NDK relay.
	   * If the notice indicates the relay is complaining (e.g. "too many" or "maximum"),
	   * the method disconnects from the relay and attempts to reconnect after a 2-second delay.
	   * A debug message is logged with the relay URL and the notice text.
	   * The "notice" event is emitted on the ndkRelay instance with the notice text.
	   *
	   * @param notice - The notice text received from the NDK relay.
	   */
	  async onNotice(notice) {
	    this.ndkRelay.emit("notice", notice);
	  }
	  /**
	   * Attempts to reconnect to the NDK relay after a connection is lost.
	   * This function is called recursively to handle multiple reconnection attempts.
	   * It checks if the relay is flapping and emits a "flapping" event if so.
	   * It then calculates a delay before the next reconnection attempt based on the number of previous attempts.
	   * The function sets a timeout to execute the next reconnection attempt after the calculated delay.
	   * If the maximum number of reconnection attempts is reached, a debug message is logged.
	   *
	   * @param attempt - The current attempt number (default is 0).
	   */
	  handleReconnection(attempt = 0) {
	    if (this.reconnectTimeout) return;
	    if (this.isFlapping()) {
	      this.ndkRelay.emit("flapping", this._connectionStats);
	      this._status = 3 /* FLAPPING */;
	      return;
	    }
	    let reconnectDelay;
	    if (this.wasIdle) {
	      const aggressiveDelays = [0, 1e3, 2e3, 5e3, 1e4, 3e4];
	      reconnectDelay = aggressiveDelays[Math.min(attempt, aggressiveDelays.length - 1)];
	      this.debug(`Using aggressive reconnect after idle, attempt ${attempt}, delay ${reconnectDelay}ms`);
	    } else if (this.connectedAt) {
	      reconnectDelay = Math.max(0, 6e4 - (Date.now() - this.connectedAt));
	    } else {
	      reconnectDelay = Math.min(1e3 * 2 ** attempt, 3e4);
	      this.debug(`Using standard backoff, attempt ${attempt}, delay ${reconnectDelay}ms`);
	    }
	    this.reconnectTimeout = setTimeout(() => {
	      this.reconnectTimeout = void 0;
	      this._status = 2 /* RECONNECTING */;
	      this.connect().catch((_err) => {
	        if (attempt < MAX_RECONNECT_ATTEMPTS) {
	          this.handleReconnection(attempt + 1);
	        } else {
	          this.debug("Max reconnect attempts reached");
	          this.wasIdle = false;
	        }
	      });
	    }, reconnectDelay);
	    this.ndkRelay.emit("delayed-connect", reconnectDelay);
	    this.debug("Reconnecting in", reconnectDelay);
	    this._connectionStats.nextReconnectAt = Date.now() + reconnectDelay;
	  }
	  /**
	   * Sends a message to the NDK relay if the connection is in the CONNECTED state and the WebSocket is open.
	   * If the connection is not in the CONNECTED state or the WebSocket is not open, logs a debug message and throws an error.
	   *
	   * @param message - The message to send to the NDK relay.
	   * @throws {Error} If attempting to send on a closed relay connection.
	   */
	  async send(message) {
	    const idleTime = Date.now() - this.lastMessageSent;
	    if (idleTime > 12e4) {
	      this.wasIdle = true;
	    }
	    if (this._status >= 5 /* CONNECTED */ && this.ws?.readyState === WebSocket.OPEN) {
	      this.ws?.send(message);
	      this.netDebug?.(message, this.ndkRelay, "send");
	      this.lastMessageSent = Date.now();
	    } else {
	      this.debug(`Not connected to ${this.ndkRelay.url} (%d), not sending message ${message}`, this._status);
	      if (this._status >= 5 /* CONNECTED */ && this.ws?.readyState !== WebSocket.OPEN) {
	        this.debug(`Stale connection detected, WebSocket state: ${this.ws?.readyState}`);
	        this.handleStaleConnection();
	      }
	    }
	  }
	  /**
	   * Authenticates the NDK event by sending it to the NDK relay and returning a promise that resolves with the result.
	   *
	   * @param event - The NDK event to authenticate.
	   * @returns A promise that resolves with the authentication result.
	   */
	  async auth(event) {
	    const ret = new Promise((resolve, reject) => {
	      const val = this.openEventPublishes.get(event.id) ?? [];
	      val.push({ resolve, reject });
	      this.openEventPublishes.set(event.id, val);
	    });
	    this.send(`["AUTH",${JSON.stringify(event.rawEvent())}]`);
	    return ret;
	  }
	  /**
	   * Clears all pending publish promises by rejecting them with the provided error.
	   * This is called on disconnection to prevent memory leaks and ensure promises
	   * don't hang indefinitely.
	   * @param error The error to reject the promises with
	   */
	  clearPendingPublishes(error) {
	    this.rejectPendingAuthPublishes(error);
	    for (const [eventId, resolvers] of this.openEventPublishes.entries()) {
	      while (resolvers.length > 0) {
	        const resolver = resolvers.shift();
	        if (resolver) {
	          resolver.reject(error);
	        }
	      }
	      this.openEventPublishes.delete(eventId);
	    }
	  }
	  /**
	   * Retries all pending publishes that failed due to auth-required.
	   * Called after successful authentication.
	   */
	  retryPendingAuthPublishes() {
	    if (this.pendingAuthPublishes.size === 0) return;
	    this.debug(`Retrying ${this.pendingAuthPublishes.size} pending publishes after auth`);
	    for (const [eventId, event] of this.pendingAuthPublishes.entries()) {
	      this.debug(`Retrying publish for event ${eventId}`);
	      this.send(`["EVENT",${JSON.stringify(event)}]`);
	    }
	    this.pendingAuthPublishes.clear();
	  }
	  /**
	   * Rejects all pending publishes that failed due to auth-required.
	   * Called when authentication fails.
	   */
	  rejectPendingAuthPublishes(error) {
	    if (this.pendingAuthPublishes.size === 0) return;
	    this.debug(`Rejecting ${this.pendingAuthPublishes.size} pending publishes due to auth failure`);
	    for (const [eventId] of this.pendingAuthPublishes.entries()) {
	      const ep = this.openEventPublishes.get(eventId);
	      if (ep && ep.length > 0) {
	        const resolver = ep.pop();
	        if (resolver) {
	          resolver.reject(new Error(`Authentication failed: ${error.message}`));
	        }
	        if (ep.length === 0) {
	          this.openEventPublishes.delete(eventId);
	        }
	      }
	    }
	    this.pendingAuthPublishes.clear();
	  }
	  /**
	   * Publishes an NDK event to the relay and returns a promise that resolves with the result.
	   *
	   * @param event - The NDK event to publish.
	   * @returns A promise that resolves with the result of the event publication.
	   * @throws {Error} If attempting to publish on a closed relay connection.
	   */
	  async publish(event) {
	    const ret = new Promise((resolve, reject) => {
	      const val = this.openEventPublishes.get(event.id) ?? [];
	      if (val.length > 0) {
	        console.warn(`Duplicate event publishing detected, you are publishing event ${event.id} twice`);
	      }
	      val.push({ resolve, reject });
	      this.openEventPublishes.set(event.id, val);
	    });
	    this.pendingAuthPublishes.set(event.id, event);
	    this.send(`["EVENT",${JSON.stringify(event)}]`);
	    return ret;
	  }
	  /**
	   * Counts the number of events that match the provided filters.
	   *
	   * @param filters - The filters to apply to the count request.
	   * @param params - An optional object containing a custom id for the count request.
	   * @returns A promise that resolves with the number of matching events.
	   * @throws {Error} If attempting to send the count request on a closed relay connection.
	   */
	  async count(filters, params) {
	    this.serial++;
	    const id = params?.id || `count:${this.serial}`;
	    const ret = new Promise((resolve, reject) => {
	      this.openCountRequests.set(id, { resolve, reject });
	    });
	    this.send(`["COUNT","${id}",${JSON.stringify(filters).substring(1)}`);
	    return ret;
	  }
	  close(subId, reason) {
	    this.send(`["CLOSE","${subId}"]`);
	    const sub = this.openSubs.get(subId);
	    this.openSubs.delete(subId);
	    if (sub) sub.onclose(reason);
	  }
	  /**
	   * Subscribes to the NDK relay with the provided filters and parameters.
	   *
	   * @param filters - The filters to apply to the subscription.
	   * @param params - The subscription parameters, including an optional custom id.
	   * @returns A new NDKRelaySubscription instance.
	   */
	  req(relaySub) {
	    `${this.send(`["REQ","${relaySub.subId}",${JSON.stringify(relaySub.executeFilters).substring(1)}`)}]`;
	    this.openSubs.set(relaySub.subId, relaySub);
	  }
	  /**
	   * Utility functions to update the connection stats.
	   */
	  updateConnectionStats = {
	    connected: () => {
	      this._connectionStats.success++;
	      this._connectionStats.connectedAt = Date.now();
	    },
	    disconnected: () => {
	      if (this._connectionStats.connectedAt) {
	        this._connectionStats.durations.push(Date.now() - this._connectionStats.connectedAt);
	        if (this._connectionStats.durations.length > 100) {
	          this._connectionStats.durations.shift();
	        }
	      }
	      this._connectionStats.connectedAt = void 0;
	    },
	    attempt: () => {
	      this._connectionStats.attempts++;
	      this._connectionStats.connectedAt = Date.now();
	    }
	  };
	  /** Returns the connection stats. */
	  get connectionStats() {
	    return this._connectionStats;
	  }
	  /** Returns the relay URL */
	  get url() {
	    return this.ndkRelay.url;
	  }
	  get connected() {
	    return this._status >= 5 /* CONNECTED */ && this.ws?.readyState === WebSocket.OPEN;
	  }
	};

	// src/relay/nip11.ts
	async function fetchRelayInformation(relayUrl) {
	  const httpUrl = relayUrl.replace(/^wss:\/\//, "https://").replace(/^ws:\/\//, "http://");
	  const response = await fetch(httpUrl, {
	    headers: {
	      Accept: "application/nostr+json"
	    }
	  });
	  if (!response.ok) {
	    throw new Error(`Failed to fetch relay information: ${response.status} ${response.statusText}`);
	  }
	  const data = await response.json();
	  return data;
	}

	// src/relay/publisher.ts
	var NDKRelayPublisher = class {
	  ndkRelay;
	  debug;
	  constructor(ndkRelay) {
	    this.ndkRelay = ndkRelay;
	    this.debug = ndkRelay.debug.extend("publisher");
	  }
	  /**
	   * Published an event to the relay; if the relay is not connected, it will
	   * wait for the relay to connect before publishing the event.
	   *
	   * If the relay does not connect within the timeout, the publish operation
	   * will fail.
	   * @param event  The event to publish
	   * @param timeoutMs  The timeout for the publish operation in milliseconds
	   * @returns A promise that resolves when the event has been published or rejects if the operation times out
	   */
	  async publish(event, timeoutMs = 2500) {
	    let timeout;
	    const publishConnected = () => {
	      return new Promise((resolve, reject) => {
	        try {
	          this.publishEvent(event).then((_result) => {
	            this.ndkRelay.emit("published", event);
	            event.emit("relay:published", this.ndkRelay);
	            resolve(true);
	          }).catch(reject);
	        } catch (err) {
	          reject(err);
	        }
	      });
	    };
	    const timeoutPromise = new Promise((_, reject) => {
	      timeout = setTimeout(() => {
	        timeout = void 0;
	        reject(new Error(`Timeout: ${timeoutMs}ms`));
	      }, timeoutMs);
	    });
	    const onConnectHandler = () => {
	      publishConnected().then((result) => connectResolve(result)).catch((err) => connectReject(err));
	    };
	    let connectResolve;
	    let connectReject;
	    const onError = (err) => {
	      this.ndkRelay.debug("Publish failed", err, event.id);
	      this.ndkRelay.emit("publish:failed", event, err);
	      event.emit("relay:publish:failed", this.ndkRelay, err);
	      throw err;
	    };
	    const onFinally = () => {
	      if (timeout) clearTimeout(timeout);
	      this.ndkRelay.removeListener("connect", onConnectHandler);
	    };
	    if (this.ndkRelay.status >= 5 /* CONNECTED */) {
	      return Promise.race([publishConnected(), timeoutPromise]).catch(onError).finally(onFinally);
	    }
	    if (this.ndkRelay.status <= 1 /* DISCONNECTED */) {
	      console.warn("Relay is disconnected, trying to connect to publish an event", this.ndkRelay.url);
	      this.ndkRelay.connect();
	    } else {
	      console.warn("Relay not connected, waiting for connection to publish an event", this.ndkRelay.url);
	    }
	    return Promise.race([
	      new Promise((resolve, reject) => {
	        connectResolve = resolve;
	        connectReject = reject;
	        this.ndkRelay.on("connect", onConnectHandler);
	      }),
	      timeoutPromise
	    ]).catch(onError).finally(onFinally);
	  }
	  async publishEvent(event) {
	    return this.ndkRelay.connectivity.publish(event.rawEvent());
	  }
	};

	// src/subscription/grouping.ts
	function filterFingerprint(filters, closeOnEose) {
	  const elements = [];
	  for (const filter of filters) {
	    const keys = Object.entries(filter || {}).map(([key, values]) => {
	      if (["since", "until"].includes(key)) {
	        return `${key}:${values}`;
	      }
	      return key;
	    }).sort().join("-");
	    elements.push(keys);
	  }
	  let id = closeOnEose ? "+" : "";
	  id += elements.join("|");
	  return id;
	}
	function mergeFilters(filters) {
	  const result = [];
	  const lastResult = {};
	  filters.filter((f) => !!f.limit).forEach((filterWithLimit) => result.push(filterWithLimit));
	  filters = filters.filter((f) => !f.limit);
	  if (filters.length === 0) return result;
	  filters.forEach((filter) => {
	    Object.entries(filter).forEach(([key, value]) => {
	      if (Array.isArray(value)) {
	        if (lastResult[key] === void 0) {
	          lastResult[key] = [...value];
	        } else {
	          lastResult[key] = Array.from(/* @__PURE__ */ new Set([...lastResult[key], ...value]));
	        }
	      } else {
	        lastResult[key] = value;
	      }
	    });
	  });
	  return [...result, lastResult];
	}

	// src/subscription/utils/format-filters.ts
	var MAX_ITEMS = 3;
	function formatArray(items, formatter) {
	  const formatted = formatter ? items.slice(0, MAX_ITEMS).map(formatter) : items.slice(0, MAX_ITEMS);
	  const display = formatted.join(",");
	  return items.length > MAX_ITEMS ? `${display}+${items.length - MAX_ITEMS}` : display;
	}
	function formatFilters(filters) {
	  return filters.map((f) => {
	    const parts = [];
	    if (f.ids?.length) {
	      parts.push(`ids:[${formatArray(f.ids, (id) => String(id).slice(0, 8))}]`);
	    }
	    if (f.kinds?.length) {
	      parts.push(`kinds:[${formatArray(f.kinds)}]`);
	    }
	    if (f.authors?.length) {
	      parts.push(`authors:[${formatArray(f.authors, (a) => String(a).slice(0, 8))}]`);
	    }
	    if (f.since) {
	      parts.push(`since:${f.since}`);
	    }
	    if (f.until) {
	      parts.push(`until:${f.until}`);
	    }
	    if (f.limit) {
	      parts.push(`limit:${f.limit}`);
	    }
	    if (f.search) {
	      parts.push(`search:"${String(f.search).slice(0, 20)}"`);
	    }
	    for (const [key, value] of Object.entries(f)) {
	      if (key.startsWith("#") && Array.isArray(value) && value.length > 0) {
	        parts.push(`${key}:[${formatArray(value, (v) => String(v).slice(0, 8))}]`);
	      }
	    }
	    return `{${parts.join(" ")}}`;
	  }).join(", ");
	}

	// src/relay/subscription.ts
	var NDKRelaySubscription = class {
	  fingerprint;
	  items = /* @__PURE__ */ new Map();
	  topSubManager;
	  debug;
	  /**
	   * Tracks the status of this REQ.
	   */
	  status = 0 /* INITIAL */;
	  onClose;
	  relay;
	  /**
	   * Whether this subscription has reached EOSE.
	   */
	  eosed = false;
	  /**
	   * Timeout at which this subscription will
	   * start executing.
	   */
	  executionTimer;
	  /**
	   * Track the time at which this subscription will fire.
	   */
	  fireTime;
	  /**
	   * The delay type that the current fireTime was calculated with.
	   */
	  delayType;
	  /**
	   * The filters that have been executed.
	   */
	  executeFilters;
	  id = Math.random().toString(36).substring(7);
	  /**
	   *
	   * @param fingerprint The fingerprint of this subscription.
	   */
	  constructor(relay, fingerprint, topSubManager) {
	    this.relay = relay;
	    this.topSubManager = topSubManager;
	    this.debug = relay.debug.extend(`sub[${this.id}]`);
	    this.fingerprint = fingerprint || Math.random().toString(36).substring(7);
	  }
	  _subId;
	  get subId() {
	    if (this._subId) return this._subId;
	    this._subId = this.fingerprint.slice(0, 15);
	    return this._subId;
	  }
	  subIdParts = /* @__PURE__ */ new Set();
	  addSubIdPart(part) {
	    this.subIdParts.add(part);
	  }
	  addItem(subscription, filters) {
	    this.debug("Adding item", {
	      filters: formatFilters(filters),
	      internalId: subscription.internalId,
	      status: this.status,
	      fingerprint: this.fingerprint,
	      id: this.subId,
	      itemsSize: this.items.size
	    });
	    if (this.items.has(subscription.internalId)) {
	      return;
	    }
	    subscription.on("close", this.removeItem.bind(this, subscription));
	    this.items.set(subscription.internalId, { subscription, filters });
	    if (this.status !== 3 /* RUNNING */) {
	      if (subscription.subId && (!this._subId || this._subId.length < 25)) {
	        if (this.status === 0 /* INITIAL */ || this.status === 1 /* PENDING */) {
	          this.addSubIdPart(subscription.subId);
	        }
	      }
	    }
	    switch (this.status) {
	      case 0 /* INITIAL */:
	        this.evaluateExecutionPlan(subscription);
	        break;
	      case 3 /* RUNNING */:
	        break;
	      case 1 /* PENDING */:
	        this.evaluateExecutionPlan(subscription);
	        break;
	      case 4 /* CLOSED */:
	        this.debug("Subscription is closed, cannot add new items", {
	          filters: formatFilters(filters),
	          subId: subscription.subId,
	          internalId: subscription.internalId
	        });
	        throw new Error("Cannot add new items to a closed subscription");
	    }
	  }
	  /**
	   * A subscription has been closed, remove it from the list of items.
	   * @param subscription
	   */
	  removeItem(subscription) {
	    this.items.delete(subscription.internalId);
	    if (this.items.size === 0) {
	      if (!this.eosed) return;
	      this.close();
	      this.cleanup();
	    }
	  }
	  close() {
	    if (this.status === 4 /* CLOSED */) return;
	    const prevStatus = this.status;
	    this.status = 4 /* CLOSED */;
	    if (prevStatus === 3 /* RUNNING */) {
	      try {
	        this.relay.close(this.subId);
	      } catch (e) {
	        this.debug("Error closing subscription", e, this);
	      }
	    } else {
	      this.debug("Subscription wanted to close but it wasn't running, this is probably ok", {
	        subId: this.subId,
	        prevStatus,
	        sub: this
	      });
	    }
	    this.cleanup();
	  }
	  cleanup() {
	    if (this.executionTimer) clearTimeout(this.executionTimer);
	    this.relay.off("ready", this.executeOnRelayReady);
	    this.relay.off("authed", this.reExecuteAfterAuth);
	    if (this.onClose) this.onClose(this);
	  }
	  evaluateExecutionPlan(subscription) {
	    if (!subscription.isGroupable()) {
	      this.status = 1 /* PENDING */;
	      this.execute();
	      return;
	    }
	    if (subscription.filters.find((filter) => !!filter.limit)) {
	      this.executeFilters = this.compileFilters();
	      if (this.executeFilters.length >= 10) {
	        this.status = 1 /* PENDING */;
	        this.execute();
	        return;
	      }
	    }
	    const delay = subscription.groupableDelay;
	    const delayType = subscription.groupableDelayType;
	    if (!delay) throw new Error("Cannot group a subscription without a delay");
	    if (this.status === 0 /* INITIAL */) {
	      this.schedule(delay, delayType);
	    } else {
	      const existingDelayType = this.delayType;
	      const timeUntilFire = this.fireTime - Date.now();
	      if (existingDelayType === "at-least" && delayType === "at-least") {
	        if (timeUntilFire < delay) {
	          if (this.executionTimer) clearTimeout(this.executionTimer);
	          this.schedule(delay, delayType);
	        }
	      } else if (existingDelayType === "at-least" && delayType === "at-most") {
	        if (timeUntilFire > delay) {
	          if (this.executionTimer) clearTimeout(this.executionTimer);
	          this.schedule(delay, delayType);
	        }
	      } else if (existingDelayType === "at-most" && delayType === "at-most") {
	        if (timeUntilFire > delay) {
	          if (this.executionTimer) clearTimeout(this.executionTimer);
	          this.schedule(delay, delayType);
	        }
	      } else if (existingDelayType === "at-most" && delayType === "at-least") {
	        if (timeUntilFire > delay) {
	          if (this.executionTimer) clearTimeout(this.executionTimer);
	          this.schedule(delay, delayType);
	        }
	      } else {
	        throw new Error(`Unknown delay type combination ${existingDelayType} ${delayType}`);
	      }
	    }
	  }
	  schedule(delay, delayType) {
	    this.status = 1 /* PENDING */;
	    const currentTime = Date.now();
	    this.fireTime = currentTime + delay;
	    this.delayType = delayType;
	    const timer = setTimeout(this.execute.bind(this), delay);
	    if (delayType === "at-least") {
	      this.executionTimer = timer;
	    }
	  }
	  executeOnRelayReady = () => {
	    if (this.status !== 2 /* WAITING */) return;
	    if (this.items.size === 0) {
	      this.debug("No items to execute; this relay was probably too slow to respond and the caller gave up", {
	        status: this.status,
	        fingerprint: this.fingerprint,
	        id: this.id,
	        subId: this.subId
	      });
	      this.cleanup();
	      return;
	    }
	    this.debug("Executing on relay ready", {
	      status: this.status,
	      fingerprint: this.fingerprint,
	      itemsSize: this.items.size,
	      filters: formatFilters(this.compileFilters())
	    });
	    this.status = 1 /* PENDING */;
	    this.execute();
	  };
	  finalizeSubId() {
	    if (this.subIdParts.size > 0) {
	      const parts = Array.from(this.subIdParts).map((part) => part.substring(0, 10));
	      let joined = parts.join("-");
	      if (joined.length > 20) {
	        joined = joined.substring(0, 20);
	      }
	      this._subId = joined;
	    } else {
	      this._subId = this.fingerprint.slice(0, 15);
	    }
	    this._subId += `-${Math.random().toString(36).substring(2, 7)}`;
	  }
	  // we do it this way so that we can remove the listener
	  reExecuteAfterAuth = (() => {
	    const oldSubId = this.subId;
	    this.debug("Re-executing after auth", this.items.size);
	    if (this.eosed) {
	      this.relay.close(this.subId);
	    } else {
	      this.debug("We are abandoning an opened subscription, once it EOSE's, the handler will close it", {
	        oldSubId
	      });
	    }
	    this._subId = void 0;
	    this.status = 1 /* PENDING */;
	    this.execute();
	    this.debug("Re-executed after auth %s \u{1F449} %s", oldSubId, this.subId);
	  }).bind(this);
	  execute() {
	    if (this.status !== 1 /* PENDING */) {
	      return;
	    }
	    if (!this.relay.connected) {
	      this.status = 2 /* WAITING */;
	      this.debug("Waiting for relay to be ready", {
	        status: this.status,
	        id: this.subId,
	        fingerprint: this.fingerprint,
	        itemsSize: this.items.size
	      });
	      this.relay.once("ready", this.executeOnRelayReady);
	      return;
	    }
	    if (this.relay.status < 8 /* AUTHENTICATED */) {
	      this.relay.once("authed", this.reExecuteAfterAuth);
	    }
	    this.status = 3 /* RUNNING */;
	    this.finalizeSubId();
	    this.executeFilters = this.compileFilters();
	    this.relay.req(this);
	  }
	  onstart() {
	  }
	  onevent(event) {
	    this.topSubManager.dispatchEvent(event, this.relay);
	  }
	  oneose(subId) {
	    this.eosed = true;
	    if (subId !== this.subId) {
	      this.debug("Received EOSE for an abandoned subscription", subId, this.subId);
	      this.relay.close(subId);
	      return;
	    }
	    if (this.items.size === 0) {
	      this.close();
	    }
	    for (const { subscription } of this.items.values()) {
	      subscription.eoseReceived(this.relay);
	      if (subscription.closeOnEose) {
	        this.debug("Removing item because of EOSE", {
	          filters: formatFilters(subscription.filters),
	          internalId: subscription.internalId,
	          status: this.status,
	          fingerprint: this.fingerprint,
	          itemsSize: this.items.size
	        });
	        this.removeItem(subscription);
	      }
	    }
	  }
	  onclose(_reason) {
	    this.status = 4 /* CLOSED */;
	  }
	  onclosed(reason) {
	    if (!reason) return;
	    for (const { subscription } of this.items.values()) {
	      subscription.closedReceived(this.relay, reason);
	    }
	  }
	  /**
	   * Grabs the filters from all the subscriptions
	   * and merges them into a single filter.
	   */
	  compileFilters() {
	    const mergedFilters = [];
	    const filters = Array.from(this.items.values()).map((item) => item.filters);
	    if (!filters[0]) {
	      this.debug("\u{1F440} No filters to merge", { itemsSize: this.items.size });
	      return [];
	    }
	    const filterCount = filters[0].length;
	    for (let i = 0; i < filterCount; i++) {
	      const allFiltersAtIndex = filters.map((filter) => filter[i]);
	      const merged = mergeFilters(allFiltersAtIndex);
	      mergedFilters.push(...merged);
	    }
	    return mergedFilters;
	  }
	};

	// src/relay/sub-manager.ts
	var NDKRelaySubscriptionManager = class {
	  relay;
	  subscriptions;
	  generalSubManager;
	  /**
	   * @param relay - The relay instance.
	   * @param generalSubManager - The subscription manager instance.
	   */
	  constructor(relay, generalSubManager) {
	    this.relay = relay;
	    this.subscriptions = /* @__PURE__ */ new Map();
	    this.generalSubManager = generalSubManager;
	  }
	  /**
	   * Adds a subscription to the manager.
	   */
	  addSubscription(sub, filters) {
	    let relaySub;
	    if (!sub.isGroupable()) {
	      relaySub = this.createSubscription(sub, filters);
	    } else {
	      const filterFp = filterFingerprint(filters, sub.closeOnEose);
	      if (filterFp) {
	        const existingSubs = this.subscriptions.get(filterFp);
	        relaySub = (existingSubs || []).find((sub2) => sub2.status < 3 /* RUNNING */);
	      }
	      relaySub ??= this.createSubscription(sub, filters, filterFp);
	    }
	    relaySub.addItem(sub, filters);
	  }
	  createSubscription(_sub, _filters, fingerprint) {
	    const relaySub = new NDKRelaySubscription(this.relay, fingerprint || null, this.generalSubManager);
	    relaySub.onClose = this.onRelaySubscriptionClose.bind(this);
	    const currentVal = this.subscriptions.get(relaySub.fingerprint) ?? [];
	    this.subscriptions.set(relaySub.fingerprint, [...currentVal, relaySub]);
	    return relaySub;
	  }
	  onRelaySubscriptionClose(sub) {
	    let currentVal = this.subscriptions.get(sub.fingerprint) ?? [];
	    if (!currentVal) {
	      console.warn("Unexpectedly did not find a subscription with fingerprint", sub.fingerprint);
	    } else if (currentVal.length === 1) {
	      this.subscriptions.delete(sub.fingerprint);
	    } else {
	      currentVal = currentVal.filter((s) => s.id !== sub.id);
	      this.subscriptions.set(sub.fingerprint, currentVal);
	    }
	  }
	};
	var NDKRelay = class _NDKRelay extends libExports.EventEmitter {
	  url;
	  scores;
	  connectivity;
	  subs;
	  publisher;
	  authPolicy;
	  /**
	   * Protocol handlers for custom relay message types (e.g., NEG-OPEN, NEG-MSG).
	   * Allows external packages to handle non-standard relay messages.
	   */
	  protocolHandlers = /* @__PURE__ */ new Map();
	  /**
	   * Cached relay information from NIP-11.
	   */
	  _relayInfo;
	  /**
	   * The lowest validation ratio this relay can reach.
	   */
	  lowestValidationRatio;
	  /**
	   * Current validation ratio this relay is targeting.
	   */
	  targetValidationRatio;
	  validationRatioFn;
	  /**
	   * This tracks events that have been seen by this relay
	   * with a valid signature.
	   */
	  validatedEventCount = 0;
	  /**
	   * This tracks events that have been seen by this relay
	   * but have not been validated.
	   */
	  nonValidatedEventCount = 0;
	  /**
	   * Whether this relay is trusted.
	   *
	   * Trusted relay's events do not get their signature verified.
	   */
	  trusted = false;
	  complaining = false;
	  debug;
	  static defaultValidationRatioUpdateFn = (relay, validatedCount, _nonValidatedCount) => {
	    if (relay.lowestValidationRatio === void 0 || relay.targetValidationRatio === void 0) return 1;
	    let newRatio = relay.validationRatio;
	    if (relay.validationRatio > relay.targetValidationRatio) {
	      const factor = validatedCount / 100;
	      newRatio = Math.max(relay.lowestValidationRatio, relay.validationRatio - factor);
	    }
	    if (newRatio < relay.validationRatio) {
	      return newRatio;
	    }
	    return relay.validationRatio;
	  };
	  constructor(url, authPolicy, ndk) {
	    super();
	    this.url = normalizeRelayUrl(url);
	    this.scores = /* @__PURE__ */ new Map();
	    this.debug = createDebug5(`ndk:relay:${url}`);
	    this.connectivity = new NDKRelayConnectivity(this, ndk);
	    this.connectivity.netDebug = ndk?.netDebug;
	    this.req = this.connectivity.req.bind(this.connectivity);
	    this.close = this.connectivity.close.bind(this.connectivity);
	    this.subs = new NDKRelaySubscriptionManager(this, ndk.subManager);
	    this.publisher = new NDKRelayPublisher(this);
	    this.authPolicy = authPolicy;
	    this.targetValidationRatio = ndk?.initialValidationRatio;
	    this.lowestValidationRatio = ndk?.lowestValidationRatio;
	    this.validationRatioFn = (ndk?.validationRatioFn ?? _NDKRelay.defaultValidationRatioUpdateFn).bind(this);
	    this.updateValidationRatio();
	    if (!ndk) {
	      console.trace("relay created without ndk");
	    }
	  }
	  updateValidationRatio() {
	    if (this.validationRatioFn && this.validatedEventCount > 0) {
	      const newRatio = this.validationRatioFn(this, this.validatedEventCount, this.nonValidatedEventCount);
	      this.targetValidationRatio = newRatio;
	    }
	    setTimeout(() => {
	      this.updateValidationRatio();
	    }, 3e4);
	  }
	  get status() {
	    return this.connectivity.status;
	  }
	  get connectionStats() {
	    return this.connectivity.connectionStats;
	  }
	  /**
	   * Connects to the relay.
	   */
	  async connect(timeoutMs, reconnect = true) {
	    return this.connectivity.connect(timeoutMs, reconnect);
	  }
	  /**
	   * Disconnects from the relay.
	   */
	  disconnect() {
	    if (this.status === 1 /* DISCONNECTED */) {
	      return;
	    }
	    this.connectivity.disconnect();
	  }
	  /**
	   * Queues or executes the subscription of a specific set of filters
	   * within this relay.
	   *
	   * @param subscription NDKSubscription this filters belong to.
	   * @param filters Filters to execute
	   */
	  subscribe(subscription, filters) {
	    this.subs.addSubscription(subscription, filters);
	  }
	  /**
	   * Publishes an event to the relay with an optional timeout.
	   *
	   * If the relay is not connected, the event will be published when the relay connects,
	   * unless the timeout is reached before the relay connects.
	   *
	   * @param event The event to publish
	   * @param timeoutMs The timeout for the publish operation in milliseconds
	   * @returns A promise that resolves when the event has been published or rejects if the operation times out
	   */
	  async publish(event, timeoutMs = 2500) {
	    return this.publisher.publish(event, timeoutMs);
	  }
	  referenceTags() {
	    return [["r", this.url]];
	  }
	  addValidatedEvent() {
	    this.validatedEventCount++;
	  }
	  addNonValidatedEvent() {
	    this.nonValidatedEventCount++;
	  }
	  /**
	   * The current validation ratio this relay has achieved.
	   */
	  get validationRatio() {
	    if (this.nonValidatedEventCount === 0) {
	      return 1;
	    }
	    return this.validatedEventCount / (this.validatedEventCount + this.nonValidatedEventCount);
	  }
	  shouldValidateEvent() {
	    if (this.trusted) {
	      return false;
	    }
	    if (this.targetValidationRatio === void 0) {
	      return true;
	    }
	    if (this.targetValidationRatio >= 1) return true;
	    return Math.random() < this.targetValidationRatio;
	  }
	  get connected() {
	    return this.connectivity.connected;
	  }
	  req;
	  close;
	  /**
	   * Registers a protocol handler for a specific message type.
	   * This allows external packages to handle custom relay messages (e.g., NIP-77 NEG-* messages).
	   *
	   * @param messageType The message type to handle (e.g., "NEG-OPEN", "NEG-MSG")
	   * @param handler The function to call when a message of this type is received
	   *
	   * @example
	   * ```typescript
	   * relay.registerProtocolHandler('NEG-MSG', (relay, message) => {
	   *   console.log('Received NEG-MSG:', message);
	   * });
	   * ```
	   */
	  registerProtocolHandler(messageType, handler) {
	    this.protocolHandlers.set(messageType, handler);
	  }
	  /**
	   * Unregisters a protocol handler for a specific message type.
	   *
	   * @param messageType The message type to stop handling
	   */
	  unregisterProtocolHandler(messageType) {
	    this.protocolHandlers.delete(messageType);
	  }
	  /**
	   * Checks if a protocol handler is registered for a message type.
	   * This is used internally by the connectivity layer to route messages.
	   *
	   * @internal
	   * @param messageType The message type to check
	   * @returns The handler function if registered, undefined otherwise
	   */
	  getProtocolHandler(messageType) {
	    return this.protocolHandlers.get(messageType);
	  }
	  /**
	   * Fetches relay information (NIP-11) from the relay.
	   * Results are cached in persistent storage when cache adapter is available (24-hour TTL).
	   * Falls back to in-memory cache. Pass force=true to bypass all caches.
	   *
	   * @param force Force a fresh fetch, bypassing all caches
	   * @returns The relay information document
	   * @throws Error if the fetch fails
	   *
	   * @example
	   * ```typescript
	   * const info = await relay.fetchInfo();
	   * console.log(`Relay: ${info.name}`);
	   * console.log(`Supported NIPs: ${info.supported_nips?.join(', ')}`);
	   * ```
	   */
	  async fetchInfo(force = false) {
	    const MAX_AGE = 864e5;
	    const ndk = this.connectivity.ndk;
	    if (!force && ndk?.cacheAdapter?.getRelayStatus) {
	      const cached = await ndk.cacheAdapter.getRelayStatus(this.url);
	      if (cached?.nip11 && Date.now() - cached.nip11.fetchedAt < MAX_AGE) {
	        this._relayInfo = cached.nip11.data;
	        return cached.nip11.data;
	      }
	    }
	    if (!force && this._relayInfo) {
	      return this._relayInfo;
	    }
	    this._relayInfo = await fetchRelayInformation(this.url);
	    if (ndk?.cacheAdapter?.updateRelayStatus) {
	      await ndk.cacheAdapter.updateRelayStatus(this.url, {
	        nip11: {
	          data: this._relayInfo,
	          fetchedAt: Date.now()
	        }
	      });
	    }
	    return this._relayInfo;
	  }
	  /**
	   * Returns cached relay information if available, undefined otherwise.
	   * Use fetchInfo() to retrieve fresh information.
	   */
	  get info() {
	    return this._relayInfo;
	  }
	};

	// src/relay/sets/index.ts
	var NDKPublishError = class extends Error {
	  errors;
	  publishedToRelays;
	  /**
	   * Intended relay set where the publishing was intended to happen.
	   */
	  intendedRelaySet;
	  constructor(message, errors, publishedToRelays, intendedRelaySet) {
	    super(message);
	    this.errors = errors;
	    this.publishedToRelays = publishedToRelays;
	    this.intendedRelaySet = intendedRelaySet;
	  }
	  get relayErrors() {
	    const errors = [];
	    for (const [relay, err] of this.errors) {
	      errors.push(`${relay.url}: ${err}`);
	    }
	    return errors.join("\n");
	  }
	};
	var NDKRelaySet = class _NDKRelaySet {
	  relays;
	  debug;
	  ndk;
	  pool;
	  constructor(relays, ndk, pool) {
	    this.relays = relays;
	    this.ndk = ndk;
	    this.pool = pool ?? ndk.pool;
	    this.debug = ndk.debug.extend("relayset");
	  }
	  /**
	   * Adds a relay to this set.
	   */
	  addRelay(relay) {
	    this.relays.add(relay);
	  }
	  get relayUrls() {
	    return Array.from(this.relays).map((r) => r.url);
	  }
	  /**
	   * Creates a relay set from a list of relay URLs.
	   *
	   * If no connection to the relay is found in the pool it will temporarily
	   * connect to it.
	   *
	   * @param relayUrls - list of relay URLs to include in this set
	   * @param ndk
	   * @param connect - whether to connect to the relay immediately if it was already in the pool but not connected
	   * @returns NDKRelaySet
	   */
	  static fromRelayUrls(relayUrls, ndk, connect = true, pool) {
	    pool = pool ?? ndk.pool;
	    if (!pool) throw new Error("No pool provided");
	    const relays = /* @__PURE__ */ new Set();
	    for (const url of relayUrls) {
	      const relay = pool.relays.get(normalizeRelayUrl(url));
	      if (relay) {
	        if (relay.status < 5 /* CONNECTED */ && connect) {
	          relay.connect();
	        }
	        relays.add(relay);
	      } else {
	        const temporaryRelay = new NDKRelay(normalizeRelayUrl(url), ndk?.relayAuthDefaultPolicy, ndk);
	        pool.useTemporaryRelay(temporaryRelay, void 0, `requested from fromRelayUrls ${relayUrls}`);
	        relays.add(temporaryRelay);
	      }
	    }
	    return new _NDKRelaySet(new Set(relays), ndk, pool);
	  }
	  /**
	   * Publish an event to all relays in this relay set.
	   *
	   * This method implements a robust mechanism for publishing events to multiple relays with
	   * built-in handling for race conditions, timeouts, and partial failures. The implementation
	   * uses a dual-tracking mechanism to ensure accurate reporting of which relays successfully
	   * received an event.
	   *
	   * Key aspects of this implementation:
	   *
	   * 1. DUAL-TRACKING MECHANISM:
	   *    - Promise-based tracking: Records successes/failures from the promises returned by relay.publish()
	   *    - Event-based tracking: Listens for 'relay:published' events that indicate successful publishing
	   *    This approach ensures we don't miss successful publishes even if there are subsequent errors in
	   *    the promise chain.
	   *
	   * 2. RACE CONDITION HANDLING:
	   *    - If a relay emits a success event but later fails in the promise chain, we still count it as a success
	   *    - If a relay times out after successfully publishing, we still count it as a success
	   *    - All relay operations happen in parallel, with proper tracking regardless of completion order
	   *
	   * 3. TIMEOUT MANAGEMENT:
	   *    - Individual timeouts for each relay operation
	   *    - Proper cleanup of timeouts to prevent memory leaks
	   *    - Clear timeout error reporting
	   *
	   * 4. ERROR HANDLING:
	   *    - Detailed tracking of specific errors for each failed relay
	   *    - Special handling for ephemeral events (which don't expect acknowledgement)
	   *    - RequiredRelayCount parameter to control the minimum success threshold
	   *
	   * @param event Event to publish
	   * @param timeoutMs Timeout in milliseconds for each relay publish operation
	   * @param requiredRelayCount The minimum number of relays we expect the event to be published to
	   * @returns A set of relays the event was published to
	   * @throws {NDKPublishError} If the event could not be published to at least `requiredRelayCount` relays
	   * @example
	   * ```typescript
	   * const relaySet = new NDKRelaySet(new Set([relay1, relay2]), ndk);
	   * const publishedToRelays = await relaySet.publish(event);
	   * // publishedToRelays can contain relay1, relay2, both, or none
	   * // depending on which relays the event was successfully published to
	   * if (publishedToRelays.size > 0) {
	   *   console.log("Event published to at least one relay");
	   * }
	   * ```
	   */
	  async publish(event, timeoutMs, requiredRelayCount = 1) {
	    const publishedToRelays = /* @__PURE__ */ new Set();
	    const errors = /* @__PURE__ */ new Map();
	    const isEphemeral2 = event.isEphemeral();
	    event.publishStatus = "pending";
	    const relayPublishedHandler = (relay) => {
	      publishedToRelays.add(relay);
	    };
	    event.on("relay:published", relayPublishedHandler);
	    try {
	      const promises = Array.from(this.relays).map((relay) => {
	        return new Promise((resolve) => {
	          const timeoutId = timeoutMs ? setTimeout(() => {
	            if (!publishedToRelays.has(relay)) {
	              errors.set(relay, new Error(`Publish timeout after ${timeoutMs}ms`));
	              resolve(false);
	            }
	          }, timeoutMs) : null;
	          relay.publish(event, timeoutMs).then((success) => {
	            if (timeoutId) clearTimeout(timeoutId);
	            if (success) {
	              publishedToRelays.add(relay);
	              resolve(true);
	            } else {
	              resolve(false);
	            }
	          }).catch((err) => {
	            if (timeoutId) clearTimeout(timeoutId);
	            if (!isEphemeral2) {
	              errors.set(relay, err);
	            }
	            resolve(false);
	          });
	        });
	      });
	      await Promise.all(promises);
	      if (publishedToRelays.size < requiredRelayCount) {
	        if (!isEphemeral2) {
	          const error = new NDKPublishError(
	            "Not enough relays received the event (" + publishedToRelays.size + " published, " + requiredRelayCount + " required)",
	            errors,
	            publishedToRelays,
	            this
	          );
	          event.publishStatus = "error";
	          event.publishError = error;
	          this.ndk?.emit("event:publish-failed", event, error, this.relayUrls);
	          throw error;
	        }
	      } else {
	        event.publishStatus = "success";
	        event.emit("published", { relaySet: this, publishedToRelays });
	      }
	      return publishedToRelays;
	    } finally {
	      event.off("relay:published", relayPublishedHandler);
	    }
	  }
	  get size() {
	    return this.relays.size;
	  }
	};

	// src/relay/sets/calculate.ts
	var d = createDebug5("ndk:outbox:calculate");
	async function calculateRelaySetFromEvent(ndk, event, requiredRelayCount) {
	  const relays = /* @__PURE__ */ new Set();
	  const authorWriteRelays = await getWriteRelaysFor(ndk, event.pubkey);
	  if (authorWriteRelays) {
	    authorWriteRelays.forEach((relayUrl) => {
	      const relay = ndk.pool?.getRelay(relayUrl);
	      if (relay) relays.add(relay);
	    });
	  }
	  let relayHints = event.tags.filter((tag) => ["a", "e"].includes(tag[0])).map((tag) => tag[2]).filter((url) => url?.startsWith("wss://")).filter((url) => {
	    try {
	      new URL(url);
	      return true;
	    } catch {
	      return false;
	    }
	  }).map((url) => normalizeRelayUrl(url));
	  relayHints = Array.from(new Set(relayHints)).slice(0, 5);
	  relayHints.forEach((relayUrl) => {
	    const relay = ndk.pool?.getRelay(relayUrl, true, true);
	    if (relay) {
	      d("Adding relay hint %s", relayUrl);
	      relays.add(relay);
	    }
	  });
	  const pTags = event.getMatchingTags("p").map((tag) => tag[1]);
	  if (pTags.length < 5) {
	    const pTaggedRelays = Array.from(
	      chooseRelayCombinationForPubkeys(ndk, pTags, "read", {
	        preferredRelays: new Set(authorWriteRelays)
	      }).keys()
	    );
	    pTaggedRelays.forEach((relayUrl) => {
	      const relay = ndk.pool?.getRelay(relayUrl, false, true);
	      if (relay) {
	        d("Adding p-tagged relay %s", relayUrl);
	        relays.add(relay);
	      }
	    });
	  } else {
	    d("Too many p-tags to consider %d", pTags.length);
	  }
	  ndk.pool?.permanentAndConnectedRelays().forEach((relay) => relays.add(relay));
	  if (requiredRelayCount && relays.size < requiredRelayCount) {
	    const explicitRelays = ndk.explicitRelayUrls?.filter((url) => !Array.from(relays).some((r) => r.url === url)).slice(0, requiredRelayCount - relays.size);
	    explicitRelays?.forEach((url) => {
	      const relay = ndk.pool?.getRelay(url, false, true);
	      if (relay) {
	        d("Adding explicit relay %s", url);
	        relays.add(relay);
	      }
	    });
	  }
	  return new NDKRelaySet(relays, ndk);
	}
	function calculateRelaySetsFromFilter(ndk, filters, pool, relayGoalPerAuthor) {
	  const result = /* @__PURE__ */ new Map();
	  const authors = /* @__PURE__ */ new Set();
	  filters.forEach((filter) => {
	    if (filter.authors) {
	      filter.authors.forEach((author) => authors.add(author));
	    }
	  });
	  if (authors.size > 0) {
	    const authorToRelaysMap = getRelaysForFilterWithAuthors(ndk, Array.from(authors), relayGoalPerAuthor);
	    for (const relayUrl of authorToRelaysMap.keys()) {
	      result.set(relayUrl, []);
	    }
	    for (const filter of filters) {
	      if (filter.authors) {
	        for (const [relayUrl, authors2] of authorToRelaysMap.entries()) {
	          const authorFilterAndRelayPubkeyIntersection = filter.authors.filter(
	            (author) => authors2.includes(author)
	          );
	          result.set(relayUrl, [
	            ...result.get(relayUrl),
	            {
	              ...filter,
	              // Overwrite authors sent to this relay with the authors that were
	              // present in the filter and are also present in the relay
	              authors: authorFilterAndRelayPubkeyIntersection
	            }
	          ]);
	        }
	      } else {
	        for (const relayUrl of authorToRelaysMap.keys()) {
	          result.set(relayUrl, [...result.get(relayUrl), filter]);
	        }
	      }
	    }
	  } else {
	    if (ndk.explicitRelayUrls) {
	      ndk.explicitRelayUrls.forEach((relayUrl) => {
	        result.set(relayUrl, filters);
	      });
	    }
	  }
	  if (result.size === 0) {
	    pool.permanentAndConnectedRelays().slice(0, 5).forEach((relay) => {
	      result.set(relay.url, filters);
	    });
	  }
	  return result;
	}
	function calculateRelaySetsFromFilters(ndk, filters, pool, relayGoalPerAuthor) {
	  const a = calculateRelaySetsFromFilter(ndk, filters, pool, relayGoalPerAuthor);
	  return a;
	}

	// src/utils/validation.ts
	function isValidHex64(value) {
	  if (typeof value !== "string" || value.length !== 64) {
	    return false;
	  }
	  for (let i = 0; i < 64; i++) {
	    const c = value.charCodeAt(i);
	    if (!(c >= 48 && c <= 57 || c >= 97 && c <= 102 || c >= 65 && c <= 70)) {
	      return false;
	    }
	  }
	  return true;
	}
	function isValidPubkey(pubkey) {
	  return isValidHex64(pubkey);
	}
	function isValidNip05(input) {
	  if (typeof input !== "string") {
	    return false;
	  }
	  for (let i = 0; i < input.length; i++) {
	    if (input.charCodeAt(i) === 46) {
	      return true;
	    }
	  }
	  return false;
	}
	function mergeTags(tags1, tags2) {
	  const tagMap = /* @__PURE__ */ new Map();
	  const generateKey = (tag) => tag.join(",");
	  const isContained = (smaller, larger) => {
	    return smaller.every((value, index) => value === larger[index]);
	  };
	  const processTag = (tag) => {
	    for (const [key, existingTag] of tagMap) {
	      if (isContained(existingTag, tag) || isContained(tag, existingTag)) {
	        if (tag.length >= existingTag.length) {
	          tagMap.set(key, tag);
	        }
	        return;
	      }
	    }
	    tagMap.set(generateKey(tag), tag);
	  };
	  tags1.concat(tags2).forEach(processTag);
	  return Array.from(tagMap.values());
	}
	var hashtagRegex = /(?<=\s|^)(#[^\s!@#$%^&*()=+./,[{\]};:'"?><]+)/g;
	function generateHashtags(content) {
	  const hashtags = content.match(hashtagRegex);
	  const tagIds = /* @__PURE__ */ new Set();
	  const tag = /* @__PURE__ */ new Set();
	  if (hashtags) {
	    for (const hashtag of hashtags) {
	      if (tagIds.has(hashtag.slice(1))) continue;
	      tag.add(hashtag.slice(1));
	      tagIds.add(hashtag.slice(1));
	    }
	  }
	  return Array.from(tag);
	}
	async function generateContentTags(content, tags = [], opts, ctx) {
	  if (opts?.skipContentTagging) {
	    return { content, tags };
	  }
	  const tagRegex = /(@|nostr:)(npub|nprofile|note|nevent|naddr)[a-zA-Z0-9]+/g;
	  const promises = [];
	  const addTagIfNew = (t) => {
	    if (!tags.find((t2) => ["q", t[0]].includes(t2[0]) && t2[1] === t[1])) {
	      tags.push(t);
	    }
	  };
	  content = content.replace(tagRegex, (tag) => {
	    try {
	      const entity = tag.split(/(@|nostr:)/)[2];
	      const { type, data } = nip19_exports$1.decode(entity);
	      let t;
	      if (opts?.filters) {
	        const shouldInclude = !opts.filters.includeTypes || opts.filters.includeTypes.includes(type);
	        const shouldExclude = opts.filters.excludeTypes?.includes(type);
	        if (!shouldInclude || shouldExclude) {
	          return tag;
	        }
	      }
	      switch (type) {
	        case "npub":
	          if (opts?.pTags !== false) {
	            t = ["p", data];
	          }
	          break;
	        case "nprofile":
	          if (opts?.pTags !== false) {
	            t = ["p", data.pubkey];
	          }
	          break;
	        case "note":
	          promises.push(
	            new Promise(async (resolve) => {
	              const relay = await maybeGetEventRelayUrl(entity);
	              addTagIfNew(["q", data, relay]);
	              resolve();
	            })
	          );
	          break;
	        case "nevent":
	          promises.push(
	            new Promise(async (resolve) => {
	              const { id, author } = data;
	              let { relays } = data;
	              if (!relays || relays.length === 0) {
	                relays = [await maybeGetEventRelayUrl(entity)];
	              }
	              addTagIfNew(["q", id, relays[0]]);
	              if (author && opts?.pTags !== false && opts?.pTagOnQTags !== false)
	                addTagIfNew(["p", author]);
	              resolve();
	            })
	          );
	          break;
	        case "naddr":
	          promises.push(
	            new Promise(async (resolve) => {
	              const id = [data.kind, data.pubkey, data.identifier].join(":");
	              let relays = data.relays ?? [];
	              if (relays.length === 0) {
	                relays = [await maybeGetEventRelayUrl(entity)];
	              }
	              addTagIfNew(["q", id, relays[0]]);
	              if (opts?.pTags !== false && opts?.pTagOnQTags !== false && opts?.pTagOnATags !== false)
	                addTagIfNew(["p", data.pubkey]);
	              resolve();
	            })
	          );
	          break;
	        default:
	          return tag;
	      }
	      if (t) addTagIfNew(t);
	      return `nostr:${entity}`;
	    } catch (_error) {
	      return tag;
	    }
	  });
	  await Promise.all(promises);
	  if (!opts?.filters?.excludeTypes?.includes("hashtag")) {
	    const newTags = generateHashtags(content).map((hashtag) => ["t", hashtag]);
	    tags = mergeTags(tags, newTags);
	  }
	  if (opts?.pTags !== false && opts?.copyPTagsFromTarget && ctx) {
	    const pTags = ctx.getMatchingTags("p");
	    for (const pTag of pTags) {
	      if (!pTag[1] || !isValidPubkey(pTag[1])) continue;
	      if (!tags.find((t) => t[0] === "p" && t[1] === pTag[1])) {
	        tags.push(pTag);
	      }
	    }
	  }
	  return { content, tags };
	}
	async function maybeGetEventRelayUrl(_nip19Id) {
	  return "";
	}

	// src/events/encryption.ts
	async function encrypt(recipient, signer, scheme = "nip44") {
	  let encrypted;
	  if (!this.ndk) throw new Error("No NDK instance found!");
	  let currentSigner = signer;
	  if (!currentSigner) {
	    this.ndk.assertSigner();
	    currentSigner = this.ndk.signer;
	  }
	  if (!currentSigner) throw new Error("no NDK signer");
	  const currentRecipient = recipient || (() => {
	    const pTags = this.getMatchingTags("p");
	    if (pTags.length !== 1) {
	      throw new Error("No recipient could be determined and no explicit recipient was provided");
	    }
	    return this.ndk.getUser({ pubkey: pTags[0][1] });
	  })();
	  if (scheme === "nip44" && await isEncryptionEnabled(currentSigner, "nip44")) {
	    encrypted = await currentSigner.encrypt(currentRecipient, this.content, "nip44");
	  }
	  if ((!encrypted || scheme === "nip04") && await isEncryptionEnabled(currentSigner, "nip04")) {
	    encrypted = await currentSigner.encrypt(currentRecipient, this.content, "nip04");
	  }
	  if (!encrypted) throw new Error("Failed to encrypt event.");
	  this.content = encrypted;
	}
	async function decrypt(sender, signer, scheme) {
	  if (this.ndk?.cacheAdapter?.getDecryptedEvent) {
	    const cachedEvent = await this.ndk.cacheAdapter.getDecryptedEvent(this.id);
	    if (cachedEvent) {
	      this.content = cachedEvent.content;
	      return;
	    }
	  }
	  let decrypted;
	  if (!this.ndk) throw new Error("No NDK instance found!");
	  let currentSigner = signer;
	  if (!currentSigner) {
	    this.ndk.assertSigner();
	    currentSigner = this.ndk.signer;
	  }
	  if (!currentSigner) throw new Error("no NDK signer");
	  const currentSender = sender || this.author;
	  if (!currentSender) throw new Error("No sender provided and no author available");
	  const currentScheme = scheme || (this.content.match(/\\?iv=/) ? "nip04" : "nip44");
	  if ((currentScheme === "nip04" || this.kind === 4) && await isEncryptionEnabled(currentSigner, "nip04") && this.content.search("\\?iv=")) {
	    decrypted = await currentSigner.decrypt(currentSender, this.content, "nip04");
	  }
	  if (!decrypted && currentScheme === "nip44" && await isEncryptionEnabled(currentSigner, "nip44")) {
	    decrypted = await currentSigner.decrypt(currentSender, this.content, "nip44");
	  }
	  if (!decrypted) throw new Error("Failed to decrypt event.");
	  this.content = decrypted;
	  if (this.ndk?.cacheAdapter?.addDecryptedEvent) {
	    this.ndk.cacheAdapter.addDecryptedEvent(this.id, this);
	  }
	}
	async function isEncryptionEnabled(signer, scheme) {
	  if (!signer.encryptionEnabled) return false;
	  if (!scheme) return true;
	  return Boolean(await signer.encryptionEnabled(scheme));
	}
	function eventHasETagMarkers(event) {
	  for (const tag of event.tags) {
	    if (tag[0] === "e" && (tag[3] ?? "").length > 0) return true;
	  }
	  return false;
	}
	function getRootTag(event, searchTag) {
	  searchTag ??= event.tagType();
	  const rootEventTag = event.tags.find(isTagRootTag);
	  if (!rootEventTag) {
	    if (eventHasETagMarkers(event)) return;
	    const matchingTags = event.getMatchingTags(searchTag);
	    if (matchingTags.length < 3) return matchingTags[0];
	  }
	  return rootEventTag;
	}
	var nip22RootTags = /* @__PURE__ */ new Set(["A", "E", "I"]);
	var nip22ReplyTags = /* @__PURE__ */ new Set(["a", "e", "i"]);
	function getReplyTag(event, searchTag) {
	  if (event.kind === 1111 /* GenericReply */) {
	    let replyTag2;
	    for (const tag of event.tags) {
	      if (nip22RootTags.has(tag[0])) replyTag2 = tag;
	      else if (nip22ReplyTags.has(tag[0])) {
	        replyTag2 = tag;
	        break;
	      }
	    }
	    return replyTag2;
	  }
	  searchTag ??= event.tagType();
	  let hasMarkers2 = false;
	  let replyTag;
	  for (const tag of event.tags) {
	    if (tag[0] !== searchTag) continue;
	    if ((tag[3] ?? "").length > 0) hasMarkers2 = true;
	    if (hasMarkers2 && tag[3] === "reply") return tag;
	    if (hasMarkers2 && tag[3] === "root") replyTag = tag;
	    if (!hasMarkers2) replyTag = tag;
	  }
	  return replyTag;
	}
	function isTagRootTag(tag) {
	  return tag[0] === "E" || tag[3] === "root";
	}

	// src/events/fetch-tagged-event.ts
	async function fetchTaggedEvent(tag, marker) {
	  if (!this.ndk) throw new Error("NDK instance not found");
	  const t = this.getMatchingTags(tag, marker);
	  if (t.length === 0) return void 0;
	  const [_, id, hint] = t[0];
	  const relay = hint !== "" ? this.ndk.pool.getRelay(hint) : void 0;
	  const event = await this.ndk.fetchEvent(id, {}, relay);
	  return event;
	}
	async function fetchRootEvent(subOpts) {
	  if (!this.ndk) throw new Error("NDK instance not found");
	  const rootTag = getRootTag(this);
	  if (!rootTag) return void 0;
	  return this.ndk.fetchEventFromTag(rootTag, this, subOpts);
	}
	async function fetchReplyEvent(subOpts) {
	  if (!this.ndk) throw new Error("NDK instance not found");
	  const replyTag = getReplyTag(this);
	  if (!replyTag) return void 0;
	  return this.ndk.fetchEventFromTag(replyTag, this, subOpts);
	}

	// src/events/kind.ts
	function isReplaceable() {
	  if (this.kind === void 0) throw new Error("Kind not set");
	  return [0, 3].includes(this.kind) || this.kind >= 1e4 && this.kind < 2e4 || this.kind >= 3e4 && this.kind < 4e4;
	}
	function isEphemeral() {
	  if (this.kind === void 0) throw new Error("Kind not set");
	  return this.kind >= 2e4 && this.kind < 3e4;
	}
	function isParamReplaceable() {
	  if (this.kind === void 0) throw new Error("Kind not set");
	  return this.kind >= 3e4 && this.kind < 4e4;
	}
	var DEFAULT_RELAY_COUNT = 2;
	function encode(maxRelayCount = DEFAULT_RELAY_COUNT) {
	  let relays = [];
	  if (this.onRelays.length > 0) {
	    relays = this.onRelays.map((relay) => relay.url);
	  } else if (this.relay) {
	    relays = [this.relay.url];
	  }
	  if (relays.length > maxRelayCount) {
	    relays = relays.slice(0, maxRelayCount);
	  }
	  if (this.isParamReplaceable()) {
	    return nip19_exports$1.naddrEncode({
	      kind: this.kind,
	      pubkey: this.pubkey,
	      identifier: this.replaceableDTag(),
	      relays
	    });
	  }
	  if (relays.length > 0) {
	    return nip19_exports$1.neventEncode({
	      id: this.tagId(),
	      relays,
	      author: this.pubkey
	    });
	  }
	  return nip19_exports$1.noteEncode(this.tagId());
	}

	// src/events/repost.ts
	async function repost(publish = true, signer) {
	  if (!signer && publish) {
	    if (!this.ndk) throw new Error("No NDK instance found");
	    this.ndk.assertSigner();
	    signer = this.ndk.signer;
	  }
	  const e = new NDKEvent(this.ndk, {
	    kind: getKind(this)
	  });
	  if (!this.isProtected) e.content = JSON.stringify(this.rawEvent());
	  e.tag(this);
	  if (this.kind !== 1 /* Text */) {
	    e.tags.push(["k", `${this.kind}`]);
	  }
	  if (signer) await e.sign(signer);
	  if (publish) await e.publish();
	  return e;
	}
	function getKind(event) {
	  if (event.kind === 1) {
	    return 6 /* Repost */;
	  }
	  return 16 /* GenericRepost */;
	}

	// src/events/serializer.ts
	function getEventDetails(event) {
	  if ("inspect" in event && typeof event.inspect === "string") {
	    return event.inspect;
	  }
	  return JSON.stringify(event);
	}
	function validateForSerialization(event) {
	  if (typeof event.kind !== "number") {
	    throw new Error(
	      `Can't serialize event with invalid properties: kind (must be number, got ${typeof event.kind}). Event: ${getEventDetails(event)}`
	    );
	  }
	  if (typeof event.content !== "string") {
	    throw new Error(
	      `Can't serialize event with invalid properties: content (must be string, got ${typeof event.content}). Event: ${getEventDetails(event)}`
	    );
	  }
	  if (typeof event.created_at !== "number") {
	    throw new Error(
	      `Can't serialize event with invalid properties: created_at (must be number, got ${typeof event.created_at}). Event: ${getEventDetails(event)}`
	    );
	  }
	  if (typeof event.pubkey !== "string") {
	    throw new Error(
	      `Can't serialize event with invalid properties: pubkey (must be string, got ${typeof event.pubkey}). Event: ${getEventDetails(event)}`
	    );
	  }
	  if (!Array.isArray(event.tags)) {
	    throw new Error(
	      `Can't serialize event with invalid properties: tags (must be array, got ${typeof event.tags}). Event: ${getEventDetails(event)}`
	    );
	  }
	  for (let i = 0; i < event.tags.length; i++) {
	    const tag = event.tags[i];
	    if (!Array.isArray(tag)) {
	      throw new Error(
	        `Can't serialize event with invalid properties: tags[${i}] (must be array, got ${typeof tag}). Event: ${getEventDetails(event)}`
	      );
	    }
	    for (let j = 0; j < tag.length; j++) {
	      if (typeof tag[j] !== "string") {
	        throw new Error(
	          `Can't serialize event with invalid properties: tags[${i}][${j}] (must be string, got ${typeof tag[j]}). Event: ${getEventDetails(event)}`
	        );
	      }
	    }
	  }
	}
	function serialize(includeSig = false, includeId = false) {
	  validateForSerialization(this);
	  const payload = [0, this.pubkey, this.created_at, this.kind, this.tags, this.content];
	  if (includeSig) payload.push(this.sig);
	  if (includeId) payload.push(this.id);
	  return JSON.stringify(payload);
	}
	function deserialize(serializedEvent) {
	  const eventArray = JSON.parse(serializedEvent);
	  const ret = {
	    pubkey: eventArray[1],
	    created_at: eventArray[2],
	    kind: eventArray[3],
	    tags: eventArray[4],
	    content: eventArray[5]
	  };
	  if (eventArray.length >= 7) {
	    const first = eventArray[6];
	    const second = eventArray[7];
	    if (first && first.length === 128) {
	      ret.sig = first;
	      if (second && second.length === 64) {
	        ret.id = second;
	      }
	    } else if (first && first.length === 64) {
	      ret.id = first;
	      if (second && second.length === 128) {
	        ret.sig = second;
	      }
	    }
	  }
	  return ret;
	}

	// src/events/signature.ts
	var worker;
	var processingQueue = {};
	function signatureVerificationInit(w) {
	  worker = w;
	  worker.onmessage = (msg) => {
	    if (!Array.isArray(msg.data) || msg.data.length !== 2) {
	      console.error(
	        "[NDK] \u274C Signature verification worker received incompatible message format.",
	        "\n\n\u{1F4CB} Expected format: [eventId, boolean]",
	        "\n\u{1F4E6} Received:",
	        msg.data,
	        "\n\n\u{1F50D} This likely means:",
	        "\n  1. You have a STALE worker.js file that needs updating",
	        "\n  2. Version mismatch between @nostr-dev-kit/ndk and deployed worker",
	        "\n  3. Wrong worker is being used for signature verification",
	        "\n\n\u2705 Solution: Update your worker files:",
	        "\n  cp node_modules/@nostr-dev-kit/ndk/dist/workers/sig-verification.js public/",
	        "\n  cp node_modules/@nostr-dev-kit/cache-sqlite-wasm/dist/worker.js public/",
	        "\n\n\u{1F4A1} Or use Vite/bundler imports instead of static files:",
	        '\n  import SigWorker from "@nostr-dev-kit/ndk/workers/sig-verification?worker"'
	      );
	      return;
	    }
	    const [eventId, result] = msg.data;
	    const record = processingQueue[eventId];
	    if (!record) {
	      console.error("No record found for event", eventId);
	      return;
	    }
	    delete processingQueue[eventId];
	    for (const resolve of record.resolves) {
	      resolve(result);
	    }
	  };
	}
	async function verifySignatureAsync(event, _persist, relay) {
	  const ndkInstance = event.ndk;
	  const start = Date.now();
	  let result;
	  if (ndkInstance.signatureVerificationFunction) {
	    result = await ndkInstance.signatureVerificationFunction(event);
	  } else {
	    result = await new Promise((resolve) => {
	      const serialized = event.serialize();
	      let enqueue = false;
	      if (!processingQueue[event.id]) {
	        processingQueue[event.id] = { event, resolves: [], relay };
	        enqueue = true;
	      }
	      processingQueue[event.id].resolves.push(resolve);
	      if (!enqueue) return;
	      worker?.postMessage({
	        serialized,
	        id: event.id,
	        sig: event.sig,
	        pubkey: event.pubkey
	      });
	    });
	  }
	  ndkInstance.signatureVerificationTimeMs += Date.now() - start;
	  return result;
	}

	// src/events/validation.ts
	var PUBKEY_REGEX = /^[a-f0-9]{64}$/;
	function validate() {
	  if (typeof this.kind !== "number") return false;
	  if (typeof this.content !== "string") return false;
	  if (typeof this.created_at !== "number") return false;
	  if (typeof this.pubkey !== "string") return false;
	  if (!this.pubkey.match(PUBKEY_REGEX)) return false;
	  if (!Array.isArray(this.tags)) return false;
	  for (let i = 0; i < this.tags.length; i++) {
	    const tag = this.tags[i];
	    if (!Array.isArray(tag)) return false;
	    for (let j = 0; j < tag.length; j++) {
	      if (typeof tag[j] === "object") return false;
	    }
	  }
	  return true;
	}
	var verifiedSignatures = new distExports.LRUCache({
	  maxSize: 1e3,
	  entryExpirationTimeInMS: 6e4
	});
	function verifySignature(persist) {
	  if (typeof this.signatureVerified === "boolean") return this.signatureVerified;
	  const prevVerification = verifiedSignatures.get(this.id);
	  if (prevVerification !== null) {
	    this.signatureVerified = !!prevVerification;
	    return this.signatureVerified;
	  }
	  try {
	    if (this.ndk?.asyncSigVerification) {
	      const relayForVerification = this.relay;
	      verifySignatureAsync(this, persist, relayForVerification).then((result) => {
	        if (persist) {
	          this.signatureVerified = result;
	          if (result) verifiedSignatures.set(this.id, this.sig);
	        }
	        if (!result) {
	          if (relayForVerification) {
	            this.ndk?.reportInvalidSignature(this, relayForVerification);
	          } else {
	            this.ndk?.reportInvalidSignature(this);
	          }
	          verifiedSignatures.set(this.id, false);
	        } else {
	          if (relayForVerification) {
	            relayForVerification.addValidatedEvent();
	          }
	        }
	      }).catch((err) => {
	        console.error("signature verification error", this.id, err);
	      });
	    } else {
	      const hash = sha256(new TextEncoder().encode(this.serialize()));
	      const res = schnorr.verify(this.sig, hash, this.pubkey);
	      if (res) verifiedSignatures.set(this.id, this.sig);
	      else verifiedSignatures.set(this.id, false);
	      this.signatureVerified = res;
	      return res;
	    }
	  } catch (_err) {
	    this.signatureVerified = false;
	    return false;
	  }
	}
	function getEventHash() {
	  return getEventHashFromSerializedEvent(this.serialize());
	}
	function getEventHashFromSerializedEvent(serializedEvent) {
	  const eventHash = sha256(new TextEncoder().encode(serializedEvent));
	  return bytesToHex(eventHash);
	}

	// src/events/index.ts
	var skipClientTagOnKinds = /* @__PURE__ */ new Set([
	  0 /* Metadata */,
	  4 /* EncryptedDirectMessage */,
	  1059 /* GiftWrap */,
	  13 /* GiftWrapSeal */,
	  3 /* Contacts */,
	  9734 /* ZapRequest */,
	  5 /* EventDeletion */
	]);
	var NDKEvent = class _NDKEvent extends libExports.EventEmitter {
	  ndk;
	  created_at;
	  content = "";
	  tags = [];
	  kind;
	  id = "";
	  sig;
	  pubkey = "";
	  signatureVerified;
	  _author = void 0;
	  /**
	   * The relay that this event was first received from.
	   */
	  relay;
	  /**
	   * The relays that this event was received from and/or successfully published to.
	   */
	  get onRelays() {
	    let res = [];
	    if (!this.ndk) {
	      if (this.relay) res.push(this.relay);
	    } else {
	      res = this.ndk.subManager.seenEvents.get(this.id) || [];
	    }
	    return res;
	  }
	  /**
	   * The status of the publish operation.
	   */
	  publishStatus = "success";
	  publishError;
	  constructor(ndk, event) {
	    super();
	    this.ndk = ndk;
	    this.created_at = event?.created_at;
	    this.content = event?.content || "";
	    this.tags = event?.tags || [];
	    this.id = event?.id || "";
	    this.sig = event?.sig;
	    this.pubkey = event?.pubkey || "";
	    this.kind = event?.kind;
	    if (event instanceof _NDKEvent) {
	      if (this.relay) {
	        this.relay = event.relay;
	        this.ndk?.subManager.seenEvent(event.id, this.relay);
	      }
	      this.publishStatus = event.publishStatus;
	      this.publishError = event.publishError;
	    }
	  }
	  /**
	   * Deserialize an NDKEvent from a serialized payload.
	   * @param ndk
	   * @param event
	   * @returns
	   */
	  static deserialize(ndk, event) {
	    return new _NDKEvent(ndk, deserialize(event));
	  }
	  /**
	   * Returns the event as is.
	   */
	  rawEvent() {
	    return {
	      created_at: this.created_at,
	      content: this.content,
	      tags: this.tags,
	      kind: this.kind,
	      pubkey: this.pubkey,
	      id: this.id,
	      sig: this.sig
	    };
	  }
	  set author(user) {
	    this.pubkey = user.pubkey;
	    this._author = user;
	    this._author.ndk ??= this.ndk;
	  }
	  /**
	   * Returns an NDKUser for the author of the event.
	   */
	  get author() {
	    if (this._author) return this._author;
	    if (!this.ndk) throw new Error("No NDK instance found");
	    const user = this.ndk.getUser({ pubkey: this.pubkey });
	    this._author = user;
	    return user;
	  }
	  /**
	   * NIP-73 tagging of external entities
	   * @param entity to be tagged
	   * @param type of the entity
	   * @param markerUrl to be used as the marker URL
	   *
	   * @example
	   * ```typescript
	   * event.tagExternal("https://example.com/article/123#nostr", "url");
	   * event.tags => [["i", "https://example.com/123"], ["k", "https://example.com"]]
	   * ```
	   *
	   * @example tag a podcast:item:guid
	   * ```typescript
	   * event.tagExternal("e32b4890-b9ea-4aef-a0bf-54b787833dc5", "podcast:item:guid");
	   * event.tags => [["i", "podcast:item:guid:e32b4890-b9ea-4aef-a0bf-54b787833dc5"], ["k", "podcast:item:guid"]]
	   * ```
	   *
	   * @see https://github.com/nostr-protocol/nips/blob/master/73.md
	   */
	  tagExternal(entity, type, markerUrl) {
	    const iTag = ["i"];
	    const kTag = ["k"];
	    switch (type) {
	      case "url": {
	        const url = new URL(entity);
	        url.hash = "";
	        iTag.push(url.toString());
	        kTag.push(`${url.protocol}//${url.host}`);
	        break;
	      }
	      case "hashtag":
	        iTag.push(`#${entity.toLowerCase()}`);
	        kTag.push("#");
	        break;
	      case "geohash":
	        iTag.push(`geo:${entity.toLowerCase()}`);
	        kTag.push("geo");
	        break;
	      case "isbn":
	        iTag.push(`isbn:${entity.replace(/-/g, "")}`);
	        kTag.push("isbn");
	        break;
	      case "podcast:guid":
	        iTag.push(`podcast:guid:${entity}`);
	        kTag.push("podcast:guid");
	        break;
	      case "podcast:item:guid":
	        iTag.push(`podcast:item:guid:${entity}`);
	        kTag.push("podcast:item:guid");
	        break;
	      case "podcast:publisher:guid":
	        iTag.push(`podcast:publisher:guid:${entity}`);
	        kTag.push("podcast:publisher:guid");
	        break;
	      case "isan":
	        iTag.push(`isan:${entity.split("-").slice(0, 4).join("-")}`);
	        kTag.push("isan");
	        break;
	      case "doi":
	        iTag.push(`doi:${entity.toLowerCase()}`);
	        kTag.push("doi");
	        break;
	      default:
	        throw new Error(`Unsupported NIP-73 entity type: ${type}`);
	    }
	    if (markerUrl) {
	      iTag.push(markerUrl);
	    }
	    this.tags.push(iTag);
	    this.tags.push(kTag);
	  }
	  /**
	   * Tag a user with an optional marker.
	   * @param target What is to be tagged. Can be an NDKUser, NDKEvent, or an NDKTag.
	   * @param marker The marker to use in the tag.
	   * @param skipAuthorTag Whether to explicitly skip adding the author tag of the event.
	   * @param forceTag Force a specific tag to be used instead of the default "e" or "a" tag.
	   * @param opts Optional content tagging options to control p tag behavior.
	   * @example
	   * ```typescript
	   * reply.tag(opEvent, "reply");
	   * // reply.tags => [["e", <id>, <relay>, "reply"]]
	   * ```
	   */
	  tag(target, marker, skipAuthorTag, forceTag, opts) {
	    let tags = [];
	    const isNDKUser = target.fetchProfile !== void 0;
	    if (isNDKUser) {
	      forceTag ??= "p";
	      if (forceTag === "p" && opts?.pTags === false) {
	        return;
	      }
	      const tag = [forceTag, target.pubkey];
	      if (marker) tag.push(...["", marker]);
	      tags.push(tag);
	    } else if (target instanceof _NDKEvent) {
	      const event = target;
	      skipAuthorTag ??= event?.pubkey === this.pubkey;
	      tags = event.referenceTags(marker, skipAuthorTag, forceTag, opts);
	      if (opts?.pTags !== false) {
	        for (const pTag of event.getMatchingTags("p")) {
	          if (!pTag[1] || !isValidPubkey(pTag[1])) continue;
	          if (pTag[1] === this.pubkey) continue;
	          if (this.tags.find((t) => t[0] === "p" && t[1] === pTag[1])) continue;
	          this.tags.push(["p", pTag[1]]);
	        }
	      }
	    } else if (Array.isArray(target)) {
	      tags = [target];
	    } else {
	      throw new Error("Invalid argument", target);
	    }
	    this.tags = mergeTags(this.tags, tags);
	  }
	  /**
	   * Return a NostrEvent object, trying to fill in missing fields
	   * when possible, adding tags when necessary.
	   * @param pubkey {string} The pubkey of the user who the event belongs to.
	   * @param opts {ContentTaggingOptions} Options for content tagging.
	   * @returns {Promise<NostrEvent>} A promise that resolves to a NostrEvent.
	   */
	  async toNostrEvent(pubkey, opts) {
	    if (!pubkey && this.pubkey === "") {
	      const user = await this.ndk?.signer?.user();
	      this.pubkey = user?.pubkey || "";
	    }
	    if (!this.created_at) {
	      this.created_at = Math.floor(Date.now() / 1e3);
	    }
	    const { content, tags } = await this.generateTags(opts);
	    this.content = content || "";
	    this.tags = tags;
	    try {
	      this.id = this.getEventHash();
	    } catch (_e) {
	    }
	    return this.rawEvent();
	  }
	  serialize = serialize.bind(this);
	  getEventHash = getEventHash.bind(this);
	  validate = validate.bind(this);
	  verifySignature = verifySignature.bind(this);
	  /**
	   * Is this event replaceable (whether parameterized or not)?
	   *
	   * This will return true for kind 0, 3, 10k-20k and 30k-40k
	   */
	  isReplaceable = isReplaceable.bind(this);
	  isEphemeral = isEphemeral.bind(this);
	  isDvm = () => this.kind && this.kind >= 5e3 && this.kind <= 7e3;
	  /**
	   * Is this event parameterized replaceable?
	   *
	   * This will return true for kind 30k-40k
	   */
	  isParamReplaceable = isParamReplaceable.bind(this);
	  /**
	   * Encodes a bech32 id.
	   *
	   * @param relays {string[]} The relays to encode in the id
	   * @returns {string} - Encoded naddr, note or nevent.
	   */
	  encode = encode.bind(this);
	  encrypt = encrypt.bind(this);
	  decrypt = decrypt.bind(this);
	  /**
	   * Get all tags with the given name
	   * @param tagName {string} The name of the tag to search for
	   * @returns {NDKTag[]} An array of the matching tags
	   */
	  getMatchingTags(tagName, marker) {
	    const t = this.tags.filter((tag) => tag[0] === tagName);
	    if (marker === void 0) return t;
	    return t.filter((tag) => tag[3] === marker);
	  }
	  /**
	   * Check if the event has a tag with the given name
	   * @param tagName
	   * @param marker
	   * @returns
	   */
	  hasTag(tagName, marker) {
	    return this.tags.some((tag) => tag[0] === tagName && (!marker || tag[3] === marker));
	  }
	  /**
	   * Get the first tag with the given name
	   * @param tagName Tag name to search for
	   * @returns The value of the first tag with the given name, or undefined if no such tag exists
	   */
	  tagValue(tagName, marker) {
	    const tags = this.getMatchingTags(tagName, marker);
	    if (tags.length === 0) return void 0;
	    return tags[0][1];
	  }
	  /**
	   * Gets the NIP-31 "alt" tag of the event.
	   */
	  get alt() {
	    return this.tagValue("alt");
	  }
	  /**
	   * Sets the NIP-31 "alt" tag of the event. Use this to set an alt tag so
	   * clients that don't handle a particular event kind can display something
	   * useful for users.
	   */
	  set alt(alt) {
	    this.removeTag("alt");
	    if (alt) this.tags.push(["alt", alt]);
	  }
	  /**
	   * Gets the NIP-33 "d" tag of the event.
	   */
	  get dTag() {
	    return this.tagValue("d");
	  }
	  /**
	   * Sets the NIP-33 "d" tag of the event.
	   */
	  set dTag(value) {
	    this.removeTag("d");
	    if (value) this.tags.push(["d", value]);
	  }
	  /**
	   * Remove all tags with the given name (e.g. "d", "a", "p")
	   * @param tagName Tag name(s) to search for and remove
	   * @param marker Optional marker to check for too
	   *
	   * @example
	   * Remove a tags with a "defer" marker
	   * ```typescript
	   * event.tags = [
	   *   ["a", "....", "defer"],
	   *   ["a", "....", "no-defer"],
	   * ]
	   *
	   * event.removeTag("a", "defer");
	   *
	   * // event.tags => [["a", "....", "no-defer"]]
	   *
	   * @returns {void}
	   */
	  removeTag(tagName, marker) {
	    const tagNames = Array.isArray(tagName) ? tagName : [tagName];
	    this.tags = this.tags.filter((tag) => {
	      const include = tagNames.includes(tag[0]);
	      const hasMarker = marker ? tag[3] === marker : true;
	      return !(include && hasMarker);
	    });
	  }
	  /**
	   * Replace a tag with a new value. If not found, it will be added.
	   * @param tag The tag to replace.
	   * @param value The new value for the tag.
	   */
	  replaceTag(tag) {
	    this.removeTag(tag[0]);
	    this.tags.push(tag);
	  }
	  /**
	   * Sign the event if a signer is present.
	   *
	   * It will generate tags.
	   * Repleacable events will have their created_at field set to the current time.
	   * @param signer {NDKSigner} The NDKSigner to use to sign the event
	   * @param opts {ContentTaggingOptions} Options for content tagging.
	   * @returns {Promise<string>} A Promise that resolves to the signature of the signed event.
	   */
	  async sign(signer, opts) {
	    this.ndk?.aiGuardrails?.event?.signing(this);
	    if (!signer) {
	      this.ndk?.assertSigner();
	      signer = this.ndk?.signer;
	    } else {
	      this.author = await signer.user();
	    }
	    const nostrEvent = await this.toNostrEvent(void 0, opts);
	    this.sig = await signer.sign(nostrEvent);
	    return this.sig;
	  }
	  /**
	   *
	   * @param relaySet
	   * @param timeoutMs
	   * @param requiredRelayCount
	   * @returns
	   */
	  async publishReplaceable(relaySet, timeoutMs, requiredRelayCount) {
	    this.id = "";
	    this.created_at = Math.floor(Date.now() / 1e3);
	    this.sig = "";
	    return this.publish(relaySet, timeoutMs, requiredRelayCount);
	  }
	  /**
	   * Attempt to sign and then publish an NDKEvent to a given relaySet.
	   * If no relaySet is provided, the relaySet will be calculated by NDK.
	   * @param relaySet {NDKRelaySet} The relaySet to publish the even to.
	   * @param timeoutM {number} The timeout for the publish operation in milliseconds.
	   * @param requiredRelayCount The number of relays that must receive the event for the publish to be considered successful.
	   * @param opts {ContentTaggingOptions} Options for content tagging.
	   * @returns A promise that resolves to the relays the event was published to.
	   */
	  async publish(relaySet, timeoutMs, requiredRelayCount, opts) {
	    if (!requiredRelayCount) requiredRelayCount = 1;
	    if (!this.sig) await this.sign(void 0, opts);
	    if (!this.ndk) throw new Error("NDKEvent must be associated with an NDK instance to publish");
	    this.ndk.aiGuardrails?.event?.publishing(this);
	    if (!relaySet || relaySet.size === 0) {
	      relaySet = this.ndk.devWriteRelaySet || await calculateRelaySetFromEvent(this.ndk, this, requiredRelayCount);
	    }
	    if (this.kind === 5 /* EventDeletion */ && this.ndk.cacheAdapter?.deleteEventIds) {
	      const eTags = this.getMatchingTags("e").map((tag) => tag[1]);
	      this.ndk.cacheAdapter.deleteEventIds(eTags);
	    }
	    const rawEvent = this.rawEvent();
	    if (this.ndk.cacheAdapter?.addUnpublishedEvent && shouldTrackUnpublishedEvent(this)) {
	      try {
	        this.ndk.cacheAdapter.addUnpublishedEvent(this, relaySet.relayUrls);
	      } catch (e) {
	        console.error("Error adding unpublished event to cache", e);
	      }
	    }
	    if (this.kind === 5 /* EventDeletion */ && this.ndk.cacheAdapter?.deleteEventIds) {
	      this.ndk.cacheAdapter.deleteEventIds(this.getMatchingTags("e").map((tag) => tag[1]));
	    }
	    this.ndk.subManager.dispatchEvent(rawEvent, void 0, true);
	    const relays = await relaySet.publish(this, timeoutMs, requiredRelayCount);
	    relays.forEach((relay) => this.ndk?.subManager.seenEvent(this.id, relay));
	    return relays;
	  }
	  /**
	   * Generates tags for users, notes, and other events tagged in content.
	   * Will also generate random "d" tag for parameterized replaceable events where needed.
	   * @param opts {ContentTaggingOptions} Options for content tagging.
	   * @returns {ContentTag} The tags and content of the event.
	   */
	  async generateTags(opts) {
	    let tags = [];
	    const g = await generateContentTags(this.content, this.tags, opts, this);
	    const content = g.content;
	    tags = g.tags;
	    if (this.kind && this.isParamReplaceable()) {
	      const dTag = this.getMatchingTags("d")[0];
	      if (!dTag) {
	        const title = this.tagValue("title");
	        const randLength = title ? 6 : 16;
	        let str = [...Array(randLength)].map(() => Math.random().toString(36)[2]).join("");
	        if (title && title.length > 0) {
	          str = `${title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}-${str}`;
	        }
	        tags.push(["d", str]);
	      }
	    }
	    if (this.shouldAddClientTag) {
	      const clientTag = ["client", this.ndk?.clientName ?? ""];
	      if (this.ndk?.clientNip89) clientTag.push(this.ndk?.clientNip89);
	      tags.push(clientTag);
	    } else if (this.shouldStripClientTag) {
	      tags = tags.filter((tag) => tag[0] !== "client");
	    }
	    return { content: content || "", tags };
	  }
	  get shouldAddClientTag() {
	    if (!this.ndk?.clientName && !this.ndk?.clientNip89) return false;
	    if (skipClientTagOnKinds.has(this.kind)) return false;
	    if (this.isEphemeral()) return false;
	    if (this.isReplaceable() && !this.isParamReplaceable()) return false;
	    if (this.isDvm()) return false;
	    if (this.hasTag("client")) return false;
	    return true;
	  }
	  get shouldStripClientTag() {
	    return skipClientTagOnKinds.has(this.kind);
	  }
	  muted() {
	    if (this.ndk?.muteFilter && this.ndk.muteFilter(this)) {
	      return "muted";
	    }
	    return null;
	  }
	  /**
	   * Returns the "d" tag of a parameterized replaceable event or throws an error if the event isn't
	   * a parameterized replaceable event.
	   * @returns {string} the "d" tag of the event.
	   *
	   * @deprecated Use `dTag` instead.
	   */
	  replaceableDTag() {
	    if (this.kind && this.kind >= 3e4 && this.kind <= 4e4) {
	      const dTag = this.getMatchingTags("d")[0];
	      const dTagId = dTag ? dTag[1] : "";
	      return dTagId;
	    }
	    throw new Error("Event is not a parameterized replaceable event");
	  }
	  /**
	   * Provides a deduplication key for the event.
	   *
	   * For kinds 0, 3, 10k-20k this will be the event <kind>:<pubkey>
	   * For kinds 30k-40k this will be the event <kind>:<pubkey>:<d-tag>
	   * For all other kinds this will be the event id
	   */
	  deduplicationKey() {
	    if (this.kind === 0 || this.kind === 3 || this.kind && this.kind >= 1e4 && this.kind < 2e4) {
	      return `${this.kind}:${this.pubkey}`;
	    }
	    return this.tagId();
	  }
	  /**
	   * Returns the id of the event or, if it's a parameterized event, the generated id of the event using "d" tag, pubkey, and kind.
	   * @returns {string} The id
	   */
	  tagId() {
	    if (this.isParamReplaceable()) {
	      return this.tagAddress();
	    }
	    return this.id;
	  }
	  /**
	   * Returns a stable reference value for a replaceable event.
	   *
	   * Param replaceable events are returned in the expected format of `<kind>:<pubkey>:<d-tag>`.
	   * Kind-replaceable events are returned in the format of `<kind>:<pubkey>:`.
	   *
	   * @returns {string} A stable reference value for replaceable events
	   */
	  tagAddress() {
	    if (this.isParamReplaceable()) {
	      const dTagId = this.dTag ?? "";
	      return `${this.kind}:${this.pubkey}:${dTagId}`;
	    }
	    if (this.isReplaceable()) {
	      return `${this.kind}:${this.pubkey}:`;
	    }
	    throw new Error("Event is not a replaceable event");
	  }
	  /**
	   * Determines the type of tag that can be used to reference this event from another event.
	   * @returns {string} The tag type
	   * @example
	   * event = new NDKEvent(ndk, { kind: 30000, pubkey: 'pubkey', tags: [ ["d", "d-code"] ] });
	   * event.tagType(); // "a"
	   */
	  tagType() {
	    return this.isParamReplaceable() ? "a" : "e";
	  }
	  /**
	   * Get the tag that can be used to reference this event from another event.
	   *
	   * Consider using referenceTags() instead (unless you have a good reason to use this)
	   *
	   * @example
	   *     event = new NDKEvent(ndk, { kind: 30000, pubkey: 'pubkey', tags: [ ["d", "d-code"] ] });
	   *     event.tagReference(); // ["a", "30000:pubkey:d-code"]
	   *
	   *     event = new NDKEvent(ndk, { kind: 1, pubkey: 'pubkey', id: "eventid" });
	   *     event.tagReference(); // ["e", "eventid"]
	   * @returns {NDKTag} The NDKTag object referencing this event
	   */
	  tagReference(marker) {
	    let tag;
	    if (this.isParamReplaceable()) {
	      tag = ["a", this.tagAddress()];
	    } else {
	      tag = ["e", this.tagId()];
	    }
	    if (this.relay) {
	      tag.push(this.relay.url);
	    } else {
	      tag.push("");
	    }
	    tag.push(marker ?? "");
	    if (!this.isParamReplaceable()) {
	      tag.push(this.pubkey);
	    }
	    return tag;
	  }
	  /**
	   * Get the tags that can be used to reference this event from another event
	   * @param marker The marker to use in the tag
	   * @param skipAuthorTag Whether to explicitly skip adding the author tag of the event
	   * @param forceTag Force a specific tag to be used instead of the default "e" or "a" tag
	   * @example
	   *     event = new NDKEvent(ndk, { kind: 30000, pubkey: 'pubkey', tags: [ ["d", "d-code"] ] });
	   *     event.referenceTags(); // [["a", "30000:pubkey:d-code"], ["e", "parent-id"]]
	   *
	   *     event = new NDKEvent(ndk, { kind: 1, pubkey: 'pubkey', id: "eventid" });
	   *     event.referenceTags(); // [["e", "parent-id"]]
	   * @returns {NDKTag} The NDKTag object referencing this event
	   */
	  referenceTags(marker, skipAuthorTag, forceTag, opts) {
	    let tags = [];
	    if (this.isParamReplaceable()) {
	      tags = [
	        [forceTag ?? "a", this.tagAddress()],
	        [forceTag ?? "e", this.id]
	      ];
	    } else {
	      tags = [[forceTag ?? "e", this.id]];
	    }
	    tags = tags.map((tag) => {
	      if (tag[0] === "e" || marker) {
	        tag.push(this.relay?.url ?? "");
	      } else if (this.relay?.url) {
	        tag.push(this.relay?.url);
	      }
	      return tag;
	    });
	    tags.forEach((tag) => {
	      if (tag[0] === "e") {
	        tag.push(marker ?? "");
	        tag.push(this.pubkey);
	      } else if (marker) {
	        tag.push(marker);
	      }
	    });
	    tags = [...tags, ...this.getMatchingTags("h")];
	    if (!skipAuthorTag && opts?.pTags !== false) tags.push(...this.author.referenceTags());
	    return tags;
	  }
	  /**
	   * Provides the filter that will return matching events for this event.
	   *
	   * @example
	   *    event = new NDKEvent(ndk, { kind: 30000, pubkey: 'pubkey', tags: [ ["d", "d-code"] ] });
	   *    event.filter(); // { "#a": ["30000:pubkey:d-code"] }
	   * @example
	   *    event = new NDKEvent(ndk, { kind: 1, pubkey: 'pubkey', id: "eventid" });
	   *    event.filter(); // { "#e": ["eventid"] }
	   *
	   * @returns The filter that will return matching events for this event
	   */
	  filter() {
	    if (this.isParamReplaceable()) {
	      return { "#a": [this.tagId()] };
	    }
	    return { "#e": [this.tagId()] };
	  }
	  nip22Filter() {
	    if (this.isParamReplaceable()) {
	      return { "#A": [this.tagId()] };
	    }
	    return { "#E": [this.tagId()] };
	  }
	  /**
	   * Generates a deletion event of the current event
	   *
	   * @param reason The reason for the deletion
	   * @param publish Whether to publish the deletion event automatically
	   * @returns The deletion event
	   */
	  async delete(reason, publish = true) {
	    if (!this.ndk) throw new Error("No NDK instance found");
	    this.ndk.assertSigner();
	    const e = new _NDKEvent(this.ndk, {
	      kind: 5 /* EventDeletion */,
	      content: reason || ""
	    });
	    e.tag(this, void 0, true);
	    e.tags.push(["k", this.kind?.toString()]);
	    if (publish) {
	      this.emit("deleted");
	      await e.publish();
	    }
	    return e;
	  }
	  /**
	   * Establishes whether this is a NIP-70-protectede event.
	   * @@satisfies NIP-70
	   */
	  set isProtected(val) {
	    this.removeTag("-");
	    if (val) this.tags.push(["-"]);
	  }
	  /**
	   * Whether this is a NIP-70-protected event.
	   * @@satisfies NIP-70
	   */
	  get isProtected() {
	    return this.hasTag("-");
	  }
	  /**
	   * Fetch an event tagged with the given tag following relay hints if provided.
	   * @param tag The tag to search for
	   * @param marker The marker to use in the tag (e.g. "root")
	   * @returns The fetched event or null if no event was found, undefined if no matching tag was found in the event
	   * * @example
	   * const replyEvent = await ndk.fetchEvent("nevent1qqs8x8vnycyha73grv380gmvlury4wtmx0nr9a5ds2dngqwgu87wn6gpzemhxue69uhhyetvv9ujuurjd9kkzmpwdejhgq3ql2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqz4cwjd")
	   * const originalEvent = await replyEvent.fetchTaggedEvent("e", "reply");
	   * console.log(replyEvent.encode() + " is a reply to event " + originalEvent?.encode());
	   */
	  fetchTaggedEvent = fetchTaggedEvent.bind(this);
	  /**
	   * Fetch the root event of the current event.
	   * @returns The fetched root event or null if no event was found
	   * @example
	   * const replyEvent = await ndk.fetchEvent("nevent1qqs8x8vnycyha73grv380gmvlury4wtmx0nr9a5ds2dngqwgu87wn6gpzemhxue69uhhyetvv9ujuurjd9kkzmpwdejhgq3ql2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqz4cwjd")
	   * const rootEvent = await replyEvent.fetchRootEvent();
	   * console.log(replyEvent.encode() + " is a reply in the thread " + rootEvent?.encode());
	   */
	  fetchRootEvent = fetchRootEvent.bind(this);
	  /**
	   * Fetch the event the current event is replying to.
	   * @returns The fetched reply event or null if no event was found
	   */
	  fetchReplyEvent = fetchReplyEvent.bind(this);
	  /**
	   * NIP-18 reposting event.
	   *
	   * @param publish Whether to publish the reposted event automatically @default true
	   * @param signer The signer to use for signing the reposted event
	   * @returns The reposted event
	   *
	   * @function
	   */
	  repost = repost.bind(this);
	  /**
	   * React to an existing event
	   *
	   * @param content The content of the reaction
	   */
	  async react(content, publish = true) {
	    if (!this.ndk) throw new Error("No NDK instance found");
	    this.ndk.assertSigner();
	    const e = new _NDKEvent(this.ndk, {
	      kind: 7 /* Reaction */,
	      content
	    });
	    e.tag(this);
	    if (this.kind !== 1 /* Text */) {
	      e.tags.push(["k", `${this.kind}`]);
	    }
	    if (publish) await e.publish();
	    return e;
	  }
	  /**
	   * Checks whether the event is valid per underlying NIPs.
	   *
	   * This method is meant to be overridden by subclasses that implement specific NIPs
	   * to allow the enforcement of NIP-specific validation rules.
	   *
	   * Otherwise, it will only check for basic event properties.
	   *
	   */
	  get isValid() {
	    return this.validate();
	  }
	  get inspect() {
	    return JSON.stringify(this.rawEvent(), null, 4);
	  }
	  /**
	   * Dump the event to console for debugging purposes.
	   * Prints a JSON stringified version of rawEvent() with indentation
	   * and also lists all relay URLs for onRelays.
	   */
	  dump() {
	    console.debug(JSON.stringify(this.rawEvent(), null, 4));
	    console.debug("Event on relays:", this.onRelays.map((relay) => relay.url).join(", "));
	  }
	  /**
	   * Creates a reply event for the current event.
	   *
	   * This function will use NIP-22 when appropriate (i.e. replies to non-kind:1 events).
	   * This function does not have side-effects; it will just return an event with the appropriate tags
	   * to generate the reply event; the caller is responsible for publishing the event.
	   *
	   * @param forceNip22 - Optional flag to force NIP-22 style replies (kind 1111) regardless of the original event's kind
	   * @param opts - Optional content tagging options
	   */
	  reply(forceNip22, opts) {
	    const reply = new _NDKEvent(this.ndk);
	    this.ndk?.aiGuardrails?.event?.creatingReply(reply);
	    if (this.kind === 1 && !forceNip22) {
	      reply.kind = 1;
	      const opHasETag = this.hasTag("e");
	      if (opHasETag) {
	        reply.tags = [
	          ...reply.tags,
	          ...this.getMatchingTags("e"),
	          ...this.getMatchingTags("p"),
	          ...this.getMatchingTags("a"),
	          ...this.referenceTags("reply", false, void 0, opts)
	        ];
	      } else {
	        reply.tag(this, "root", false, void 0, opts);
	      }
	    } else {
	      reply.kind = 1111 /* GenericReply */;
	      const carryOverTags = ["A", "E", "I", "P"];
	      const rootTags = this.tags.filter((tag) => carryOverTags.includes(tag[0]));
	      if (rootTags.length > 0) {
	        const rootKind = this.tagValue("K");
	        reply.tags.push(...rootTags);
	        if (rootKind) reply.tags.push(["K", rootKind]);
	        let tag;
	        if (this.isParamReplaceable()) {
	          tag = ["a", this.tagAddress()];
	          const relayHint = this.relay?.url ?? "";
	          if (relayHint) tag.push(relayHint);
	        } else {
	          tag = ["e", this.tagId()];
	          const relayHint = this.relay?.url ?? "";
	          tag.push(relayHint);
	          tag.push(this.pubkey);
	        }
	        reply.tags.push(tag);
	      } else {
	        let lowerTag;
	        let upperTag;
	        const relayHint = this.relay?.url ?? "";
	        if (this.isParamReplaceable()) {
	          lowerTag = ["a", this.tagAddress(), relayHint];
	          upperTag = ["A", this.tagAddress(), relayHint];
	        } else {
	          lowerTag = ["e", this.tagId(), relayHint, this.pubkey];
	          upperTag = ["E", this.tagId(), relayHint, this.pubkey];
	        }
	        reply.tags.push(lowerTag);
	        reply.tags.push(upperTag);
	        reply.tags.push(["K", this.kind?.toString()]);
	        if (opts?.pTags !== false && opts?.pTagOnATags !== false) {
	          reply.tags.push(["P", this.pubkey]);
	        }
	      }
	      reply.tags.push(["k", this.kind?.toString()]);
	      if (opts?.pTags !== false) {
	        reply.tags.push(...this.getMatchingTags("p"));
	        reply.tags.push(["p", this.pubkey]);
	      }
	    }
	    return reply;
	  }
	};
	var untrackedUnpublishedEvents = /* @__PURE__ */ new Set([
	  24133 /* NostrConnect */,
	  13194 /* NostrWaletConnectInfo */,
	  23194 /* NostrWalletConnectReq */,
	  23195 /* NostrWalletConnectRes */
	]);
	function shouldTrackUnpublishedEvent(event) {
	  return !untrackedUnpublishedEvents.has(event.kind);
	}
	var NDKPool = class extends libExports.EventEmitter {
	  // TODO: This should probably be an LRU cache
	  _relays = /* @__PURE__ */ new Map();
	  status = "idle";
	  autoConnectRelays = /* @__PURE__ */ new Set();
	  debug;
	  temporaryRelayTimers = /* @__PURE__ */ new Map();
	  flappingRelays = /* @__PURE__ */ new Set();
	  // A map to store timeouts for each flapping relay.
	  backoffTimes = /* @__PURE__ */ new Map();
	  ndk;
	  // System-wide disconnection detection
	  disconnectionTimes = /* @__PURE__ */ new Map();
	  systemEventDetector;
	  /**
	   * @param relayUrls - The URLs of the relays to connect to.
	   * @param ndk - The NDK instance.
	   * @param opts - Options for the pool.
	   */
	  constructor(relayUrls, ndk, {
	    debug: debug9,
	    name
	  } = {}) {
	    super();
	    this.debug = debug9 ?? ndk.debug.extend("pool");
	    if (name) this._name = name;
	    this.ndk = ndk;
	    this.relayUrls = relayUrls;
	    if (this.ndk.pools) {
	      this.ndk.pools.push(this);
	    }
	  }
	  get relays() {
	    return this._relays;
	  }
	  set relayUrls(urls) {
	    this._relays.clear();
	    for (const relayUrl of urls) {
	      const relay = new NDKRelay(relayUrl, void 0, this.ndk);
	      relay.connectivity.netDebug = this.ndk.netDebug;
	      this.addRelay(relay);
	    }
	  }
	  _name = "unnamed";
	  get name() {
	    return this._name;
	  }
	  set name(name) {
	    this._name = name;
	    this.debug = this.debug.extend(name);
	  }
	  /**
	   * Adds a relay to the pool, and sets a timer to remove it if it is not used within the specified time.
	   * @param relay - The relay to add to the pool.
	   * @param removeIfUnusedAfter - The time in milliseconds to wait before removing the relay from the pool after it is no longer used.
	   */
	  useTemporaryRelay(relay, removeIfUnusedAfter = 3e4, filters) {
	    const relayAlreadyInPool = this.relays.has(relay.url);
	    if (!relayAlreadyInPool) {
	      this.addRelay(relay);
	      this.debug("Adding temporary relay %s for filters %o", relay.url, filters);
	    }
	    const existingTimer = this.temporaryRelayTimers.get(relay.url);
	    if (existingTimer) {
	      clearTimeout(existingTimer);
	    }
	    if (!relayAlreadyInPool || existingTimer) {
	      const timer = setTimeout(() => {
	        if (this.ndk.explicitRelayUrls?.includes(relay.url)) return;
	        this.removeRelay(relay.url);
	      }, removeIfUnusedAfter);
	      this.temporaryRelayTimers.set(relay.url, timer);
	    }
	  }
	  /**
	   * Adds a relay to the pool.
	   *
	   * @param relay - The relay to add to the pool.
	   * @param connect - Whether or not to connect to the relay.
	   */
	  addRelay(relay, connect = true) {
	    const isAlreadyInPool = this.relays.has(relay.url);
	    const isCustomRelayUrl = relay.url.includes("/npub1");
	    let reconnect = true;
	    const relayUrl = relay.url;
	    if (isAlreadyInPool) return;
	    if (this.ndk.relayConnectionFilter && !this.ndk.relayConnectionFilter(relayUrl)) {
	      this.debug(`Refusing to add relay ${relayUrl}: blocked by relayConnectionFilter`);
	      return;
	    }
	    if (isCustomRelayUrl) {
	      this.debug(`Refusing to add relay ${relayUrl}: is a filter relay`);
	      return;
	    }
	    if (this.ndk.cacheAdapter?.getRelayStatus) {
	      const infoOrPromise = this.ndk.cacheAdapter.getRelayStatus(relayUrl);
	      const info = infoOrPromise instanceof Promise ? void 0 : infoOrPromise;
	      if (info?.dontConnectBefore) {
	        if (info.dontConnectBefore > Date.now()) {
	          const delay = info.dontConnectBefore - Date.now();
	          this.debug(`Refusing to add relay ${relayUrl}: delayed connect for ${delay}ms`);
	          setTimeout(() => {
	            this.addRelay(relay, connect);
	          }, delay);
	          return;
	        }
	        reconnect = false;
	      }
	    }
	    const noticeHandler = (notice) => this.emit("notice", relay, notice);
	    const connectHandler = () => this.handleRelayConnect(relayUrl);
	    const readyHandler = () => this.handleRelayReady(relay);
	    const disconnectHandler = () => {
	      this.recordDisconnection(relay);
	      this.emit("relay:disconnect", relay);
	    };
	    const flappingHandler = () => this.handleFlapping(relay);
	    const authHandler = (challenge) => this.emit("relay:auth", relay, challenge);
	    const authedHandler = () => this.emit("relay:authed", relay);
	    relay.off("notice", noticeHandler);
	    relay.off("connect", connectHandler);
	    relay.off("ready", readyHandler);
	    relay.off("disconnect", disconnectHandler);
	    relay.off("flapping", flappingHandler);
	    relay.off("auth", authHandler);
	    relay.off("authed", authedHandler);
	    relay.on("notice", noticeHandler);
	    relay.on("connect", connectHandler);
	    relay.on("ready", readyHandler);
	    relay.on("disconnect", disconnectHandler);
	    relay.on("flapping", flappingHandler);
	    relay.on("auth", authHandler);
	    relay.on("authed", authedHandler);
	    relay.on("delayed-connect", (delay) => {
	      if (this.ndk.cacheAdapter?.updateRelayStatus) {
	        this.ndk.cacheAdapter.updateRelayStatus(relay.url, {
	          dontConnectBefore: Date.now() + delay
	        });
	      }
	    });
	    this._relays.set(relayUrl, relay);
	    if (connect) this.autoConnectRelays.add(relayUrl);
	    if (connect && this.status === "active") {
	      this.emit("relay:connecting", relay);
	      relay.connect(void 0, reconnect).catch((e) => {
	        this.debug(`Failed to connect to relay ${relayUrl}`, e);
	      });
	    }
	  }
	  /**
	   * Removes a relay from the pool.
	   * @param relayUrl - The URL of the relay to remove.
	   * @returns {boolean} True if the relay was removed, false if it was not found.
	   */
	  removeRelay(relayUrl) {
	    const relay = this.relays.get(relayUrl);
	    if (relay) {
	      relay.disconnect();
	      this.relays.delete(relayUrl);
	      this.autoConnectRelays.delete(relayUrl);
	      this.emit("relay:disconnect", relay);
	      return true;
	    }
	    const existingTimer = this.temporaryRelayTimers.get(relayUrl);
	    if (existingTimer) {
	      clearTimeout(existingTimer);
	      this.temporaryRelayTimers.delete(relayUrl);
	    }
	    return false;
	  }
	  /**
	   * Checks whether a relay is already connected in the pool.
	   */
	  isRelayConnected(url) {
	    const normalizedUrl = normalizeRelayUrl(url);
	    const relay = this.relays.get(normalizedUrl);
	    if (!relay) return false;
	    return relay.status === 5 /* CONNECTED */;
	  }
	  /**
	   * Fetches a relay from the pool, or creates a new one if it does not exist.
	   *
	   * New relays will be attempted to be connected.
	   */
	  getRelay(url, connect = true, temporary = false, filters) {
	    let relay = this.relays.get(normalizeRelayUrl(url));
	    if (!relay) {
	      relay = new NDKRelay(url, void 0, this.ndk);
	      relay.connectivity.netDebug = this.ndk.netDebug;
	      if (temporary) {
	        this.useTemporaryRelay(relay, 3e4, filters);
	      } else {
	        this.addRelay(relay, connect);
	      }
	    }
	    return relay;
	  }
	  handleRelayConnect(relayUrl) {
	    const relay = this.relays.get(relayUrl);
	    if (!relay) {
	      console.error("NDK BUG: relay not found in pool", { relayUrl });
	      return;
	    }
	    this.emit("relay:connect", relay);
	    if (this.stats().connected === this.relays.size) {
	      this.emit("connect");
	    }
	  }
	  handleRelayReady(relay) {
	    this.emit("relay:ready", relay);
	  }
	  /**
	   * Attempts to establish a connection to each relay in the pool.
	   *
	   * @async
	   * @param {number} [timeoutMs] - Optional timeout in milliseconds for each connection attempt.
	   * @returns {Promise<void>} A promise that resolves when all connection attempts have completed.
	   * @throws {Error} If any of the connection attempts result in an error or timeout.
	   */
	  async connect(timeoutMs) {
	    this.status = "active";
	    this.debug(`Connecting to ${this.relays.size} relays${timeoutMs ? `, timeout ${timeoutMs}ms` : ""}...`);
	    const relaysToConnect = Array.from(this.autoConnectRelays.keys()).map((url) => this.relays.get(url)).filter((relay) => !!relay);
	    for (const relay of relaysToConnect) {
	      if (relay.status !== 5 /* CONNECTED */ && relay.status !== 4 /* CONNECTING */) {
	        this.emit("relay:connecting", relay);
	        relay.connect().catch((e) => {
	          this.debug(`Failed to connect to relay ${relay.url}: ${e ?? "No reason specified"}`);
	        });
	      }
	    }
	    const allConnected = () => relaysToConnect.every((r) => r.status === 5 /* CONNECTED */);
	    const allConnectedPromise = new Promise((resolve) => {
	      if (allConnected()) {
	        resolve();
	        return;
	      }
	      const listeners = [];
	      for (const relay of relaysToConnect) {
	        const handler = () => {
	          if (allConnected()) {
	            for (let i = 0; i < relaysToConnect.length; i++) {
	              relaysToConnect[i].off("connect", listeners[i]);
	            }
	            resolve();
	          }
	        };
	        listeners.push(handler);
	        relay.on("connect", handler);
	      }
	    });
	    const timeoutPromise = typeof timeoutMs === "number" ? new Promise((resolve) => setTimeout(resolve, timeoutMs)) : new Promise(() => {
	    });
	    await Promise.race([allConnectedPromise, timeoutPromise]);
	  }
	  checkOnFlappingRelays() {
	    const flappingRelaysCount = this.flappingRelays.size;
	    const totalRelays = this.relays.size;
	    if (flappingRelaysCount / totalRelays >= 0.8) {
	      for (const relayUrl of this.flappingRelays) {
	        this.backoffTimes.set(relayUrl, 0);
	      }
	    }
	  }
	  /**
	   * Records when a relay disconnects to detect system-wide events
	   */
	  recordDisconnection(relay) {
	    const now = Date.now();
	    this.disconnectionTimes.set(relay.url, now);
	    for (const [url, time] of this.disconnectionTimes.entries()) {
	      if (now - time > 1e4) {
	        this.disconnectionTimes.delete(url);
	      }
	    }
	    this.checkForSystemWideDisconnection();
	  }
	  /**
	   * Checks if multiple relays disconnected simultaneously, indicating a system event
	   */
	  checkForSystemWideDisconnection() {
	    const now = Date.now();
	    const recentDisconnections = [];
	    for (const time of this.disconnectionTimes.values()) {
	      if (now - time < 5e3) {
	        recentDisconnections.push(time);
	      }
	    }
	    if (recentDisconnections.length > this.relays.size / 2 && this.relays.size > 1) {
	      this.debug(
	        `System-wide disconnection detected: ${recentDisconnections.length}/${this.relays.size} relays disconnected`
	      );
	      this.handleSystemWideReconnection();
	    }
	  }
	  /**
	   * Handles system-wide reconnection (e.g., after sleep/wake or network change)
	   */
	  handleSystemWideReconnection() {
	    if (this.systemEventDetector) {
	      this.debug("System-wide reconnection already in progress, skipping");
	      return;
	    }
	    this.debug("Initiating system-wide reconnection with reset backoff");
	    this.systemEventDetector = setTimeout(() => {
	      this.systemEventDetector = void 0;
	    }, 1e4);
	    for (const relay of this.relays.values()) {
	      if (relay.connectivity) {
	        relay.connectivity.resetReconnectionState();
	        if (relay.status !== 5 /* CONNECTED */ && relay.status !== 4 /* CONNECTING */) {
	          relay.connect().catch((e) => {
	            this.debug(`Failed to reconnect relay ${relay.url} after system event: ${e}`);
	          });
	        }
	      }
	    }
	    this.disconnectionTimes.clear();
	  }
	  handleFlapping(relay) {
	    this.debug(`Relay ${relay.url} is flapping`);
	    let currentBackoff = this.backoffTimes.get(relay.url) || 5e3;
	    currentBackoff = currentBackoff * 2;
	    this.backoffTimes.set(relay.url, currentBackoff);
	    this.debug(`Backoff time for ${relay.url} is ${currentBackoff}ms`);
	    setTimeout(() => {
	      this.debug(`Attempting to reconnect to ${relay.url}`);
	      this.emit("relay:connecting", relay);
	      relay.connect();
	      this.checkOnFlappingRelays();
	    }, currentBackoff);
	    relay.disconnect();
	    this.emit("flapping", relay);
	  }
	  size() {
	    return this.relays.size;
	  }
	  /**
	   * Returns the status of each relay in the pool.
	   * @returns {NDKPoolStats} An object containing the number of relays in each status.
	   */
	  stats() {
	    const stats = {
	      total: 0,
	      connected: 0,
	      disconnected: 0,
	      connecting: 0
	    };
	    for (const relay of this.relays.values()) {
	      stats.total++;
	      if (relay.status === 5 /* CONNECTED */) {
	        stats.connected++;
	      } else if (relay.status === 1 /* DISCONNECTED */) {
	        stats.disconnected++;
	      } else if (relay.status === 4 /* CONNECTING */) {
	        stats.connecting++;
	      }
	    }
	    return stats;
	  }
	  connectedRelays() {
	    return Array.from(this.relays.values()).filter((relay) => relay.status >= 5 /* CONNECTED */);
	  }
	  permanentAndConnectedRelays() {
	    return Array.from(this.relays.values()).filter(
	      (relay) => relay.status >= 5 /* CONNECTED */ && !this.temporaryRelayTimers.has(relay.url)
	    );
	  }
	  /**
	   * Get a list of all relay urls in the pool.
	   */
	  urls() {
	    return Array.from(this.relays.keys());
	  }
	};
	var NDKDVMJobFeedback = class _NDKDVMJobFeedback extends NDKEvent {
	  static kinds = [7e3 /* DVMJobFeedback */];
	  constructor(ndk, event) {
	    super(ndk, event);
	    this.kind ??= 7e3 /* DVMJobFeedback */;
	  }
	  static async from(event) {
	    const e = new _NDKDVMJobFeedback(event.ndk, event.rawEvent());
	    if (e.encrypted) await e.dvmDecrypt();
	    return e;
	  }
	  get status() {
	    return this.tagValue("status");
	  }
	  set status(status) {
	    this.removeTag("status");
	    if (status !== void 0) {
	      this.tags.push(["status", status]);
	    }
	  }
	  get encrypted() {
	    return !!this.getMatchingTags("encrypted")[0];
	  }
	  async dvmDecrypt() {
	    await this.decrypt();
	    const decryptedContent = JSON.parse(this.content);
	    this.tags.push(...decryptedContent);
	  }
	};

	// src/events/kinds/nutzap/mint-list.ts
	var NDKCashuMintList = class _NDKCashuMintList extends NDKEvent {
	  static kind = 10019 /* CashuMintList */;
	  static kinds = [10019 /* CashuMintList */];
	  _p2pk;
	  constructor(ndk, event) {
	    super(ndk, event);
	    this.kind ??= 10019 /* CashuMintList */;
	  }
	  static from(event) {
	    return new _NDKCashuMintList(event.ndk, event);
	  }
	  set relays(urls) {
	    this.tags = this.tags.filter((t) => t[0] !== "relay");
	    for (const url of urls) {
	      this.tags.push(["relay", url]);
	    }
	  }
	  get relays() {
	    const r = [];
	    for (const tag of this.tags) {
	      if (tag[0] === "relay") {
	        r.push(tag[1]);
	      }
	    }
	    return r;
	  }
	  set mints(urls) {
	    this.tags = this.tags.filter((t) => t[0] !== "mint");
	    for (const url of urls) {
	      this.tags.push(["mint", url]);
	    }
	  }
	  get mints() {
	    const r = [];
	    for (const tag of this.tags) {
	      if (tag[0] === "mint") {
	        r.push(tag[1]);
	      }
	    }
	    return Array.from(new Set(r));
	  }
	  get p2pk() {
	    if (this._p2pk) {
	      return this._p2pk;
	    }
	    this._p2pk = this.tagValue("pubkey") ?? this.pubkey;
	    return this._p2pk;
	  }
	  set p2pk(pubkey) {
	    this._p2pk = pubkey;
	    this.removeTag("pubkey");
	    if (pubkey) {
	      this.tags.push(["pubkey", pubkey]);
	    }
	  }
	  get relaySet() {
	    return NDKRelaySet.fromRelayUrls(this.relays, this.ndk);
	  }
	};

	// src/events/kinds/article.ts
	var NDKArticle = class _NDKArticle extends NDKEvent {
	  static kind = 30023 /* Article */;
	  static kinds = [30023 /* Article */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 30023 /* Article */;
	  }
	  /**
	   * Creates a NDKArticle from an existing NDKEvent.
	   *
	   * @param event NDKEvent to create the NDKArticle from.
	   * @returns NDKArticle
	   */
	  static from(event) {
	    return new _NDKArticle(event.ndk, event);
	  }
	  /**
	   * Getter for the article title.
	   *
	   * @returns {string | undefined} - The article title if available, otherwise undefined.
	   */
	  get title() {
	    return this.tagValue("title");
	  }
	  /**
	   * Setter for the article title.
	   *
	   * @param {string | undefined} title - The title to set for the article.
	   */
	  set title(title) {
	    this.removeTag("title");
	    if (title) this.tags.push(["title", title]);
	  }
	  /**
	   * Getter for the article image.
	   *
	   * @returns {string | undefined} - The article image if available, otherwise undefined.
	   */
	  get image() {
	    return this.tagValue("image");
	  }
	  /**
	   * Setter for the article image.
	   *
	   * @param {string | undefined} image - The image to set for the article.
	   */
	  set image(image) {
	    this.removeTag("image");
	    if (image) this.tags.push(["image", image]);
	  }
	  get summary() {
	    return this.tagValue("summary");
	  }
	  set summary(summary) {
	    this.removeTag("summary");
	    if (summary) this.tags.push(["summary", summary]);
	  }
	  /**
	   * Getter for the article's publication timestamp.
	   *
	   * @returns {number | undefined} - The Unix timestamp of when the article was published or undefined.
	   */
	  get published_at() {
	    const tag = this.tagValue("published_at");
	    if (tag) {
	      let val = Number.parseInt(tag);
	      if (val > 1e12) {
	        val = Math.floor(val / 1e3);
	      }
	      return val;
	    }
	    return void 0;
	  }
	  /**
	   * Setter for the article's publication timestamp.
	   *
	   * @param {number | undefined} timestamp - The Unix timestamp to set for the article's publication date.
	   */
	  set published_at(timestamp) {
	    this.removeTag("published_at");
	    if (timestamp !== void 0) {
	      this.tags.push(["published_at", timestamp.toString()]);
	    }
	  }
	  /**
	   * Generates content tags for the article.
	   *
	   * This method first checks and sets the publication date if not available,
	   * and then generates content tags based on the base NDKEvent class.
	   *
	   * @returns {ContentTag} - The generated content tags.
	   */
	  async generateTags() {
	    super.generateTags();
	    if (!this.published_at) {
	      this.published_at = this.created_at;
	    }
	    return super.generateTags();
	  }
	  /**
	   * Getter for the article's URL.
	   *
	   * @returns {string | undefined} - The article's URL if available, otherwise undefined.
	   */
	  get url() {
	    return this.tagValue("url");
	  }
	  /**
	   * Setter for the article's URL.
	   *
	   * @param {string | undefined} url - The URL to set for the article.
	   */
	  set url(url) {
	    if (url) {
	      this.tags.push(["url", url]);
	    } else {
	      this.removeTag("url");
	    }
	  }
	};

	// src/events/kinds/blossom-list.ts
	var NDKBlossomList = class _NDKBlossomList extends NDKEvent {
	  static kinds = [10063 /* BlossomList */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 10063 /* BlossomList */;
	  }
	  static from(ndkEvent) {
	    return new _NDKBlossomList(ndkEvent.ndk, ndkEvent.rawEvent());
	  }
	  /**
	   * Returns all Blossom servers in the list
	   */
	  get servers() {
	    return this.tags.filter((tag) => tag[0] === "server").map((tag) => tag[1]);
	  }
	  /**
	   * Sets the list of Blossom servers
	   */
	  set servers(servers) {
	    this.tags = this.tags.filter((tag) => tag[0] !== "server");
	    for (const server of servers) {
	      this.tags.push(["server", server]);
	    }
	  }
	  /**
	   * Returns the default Blossom server (first in the list)
	   */
	  get default() {
	    const servers = this.servers;
	    return servers.length > 0 ? servers[0] : void 0;
	  }
	  /**
	   * Sets the default Blossom server by moving it to the beginning of the list
	   */
	  set default(server) {
	    if (!server) return;
	    const currentServers = this.servers;
	    const filteredServers = currentServers.filter((s) => s !== server);
	    this.servers = [server, ...filteredServers];
	  }
	  /**
	   * Adds a server to the list if it doesn't already exist
	   */
	  addServer(server) {
	    if (!server) return;
	    const currentServers = this.servers;
	    if (!currentServers.includes(server)) {
	      this.servers = [...currentServers, server];
	    }
	  }
	  /**
	   * Removes a server from the list
	   */
	  removeServer(server) {
	    if (!server) return;
	    const currentServers = this.servers;
	    this.servers = currentServers.filter((s) => s !== server);
	  }
	};

	// src/events/kinds/cashu/fedimint.ts
	var NDKFedimintMint = class _NDKFedimintMint extends NDKEvent {
	  static kind = 38173 /* FedimintMintAnnouncement */;
	  static kinds = [38173 /* FedimintMintAnnouncement */];
	  constructor(ndk, event) {
	    super(ndk, event);
	    this.kind ??= 38173 /* FedimintMintAnnouncement */;
	  }
	  static async from(event) {
	    const mint = new _NDKFedimintMint(event.ndk, event);
	    return mint;
	  }
	  /**
	   * The federation ID
	   */
	  get identifier() {
	    return this.tagValue("d");
	  }
	  set identifier(value) {
	    this.removeTag("d");
	    if (value) this.tags.push(["d", value]);
	  }
	  /**
	   * Invite codes (multiple allowed)
	   */
	  get inviteCodes() {
	    return this.getMatchingTags("u").map((t) => t[1]);
	  }
	  set inviteCodes(values) {
	    this.removeTag("u");
	    for (const value of values) {
	      this.tags.push(["u", value]);
	    }
	  }
	  /**
	   * Supported modules
	   */
	  get modules() {
	    return this.getMatchingTags("modules").map((t) => t[1]);
	  }
	  set modules(values) {
	    this.removeTag("modules");
	    for (const value of values) {
	      this.tags.push(["modules", value]);
	    }
	  }
	  /**
	   * Network (mainnet/testnet/signet/regtest)
	   */
	  get network() {
	    return this.tagValue("n");
	  }
	  set network(value) {
	    this.removeTag("n");
	    if (value) this.tags.push(["n", value]);
	  }
	  /**
	   * Optional metadata
	   */
	  get metadata() {
	    if (!this.content) return void 0;
	    try {
	      return JSON.parse(this.content);
	    } catch {
	      return void 0;
	    }
	  }
	  set metadata(value) {
	    if (value) {
	      this.content = JSON.stringify(value);
	    } else {
	      this.content = "";
	    }
	  }
	};

	// src/events/kinds/cashu/mint.ts
	var NDKCashuMintAnnouncement = class _NDKCashuMintAnnouncement extends NDKEvent {
	  static kind = 38172 /* CashuMintAnnouncement */;
	  static kinds = [38172 /* CashuMintAnnouncement */];
	  constructor(ndk, event) {
	    super(ndk, event);
	    this.kind ??= 38172 /* CashuMintAnnouncement */;
	  }
	  static async from(event) {
	    const mint = new _NDKCashuMintAnnouncement(event.ndk, event);
	    return mint;
	  }
	  /**
	   * The mint's identifier (pubkey)
	   */
	  get identifier() {
	    return this.tagValue("d");
	  }
	  set identifier(value) {
	    this.removeTag("d");
	    if (value) this.tags.push(["d", value]);
	  }
	  /**
	   * The mint URL
	   */
	  get url() {
	    return this.tagValue("u");
	  }
	  set url(value) {
	    this.removeTag("u");
	    if (value) this.tags.push(["u", value]);
	  }
	  /**
	   * Supported NUT protocols
	   */
	  get nuts() {
	    return this.getMatchingTags("nuts").map((t) => t[1]);
	  }
	  set nuts(values) {
	    this.removeTag("nuts");
	    for (const value of values) {
	      this.tags.push(["nuts", value]);
	    }
	  }
	  /**
	   * Network (mainnet/testnet/signet/regtest)
	   */
	  get network() {
	    return this.tagValue("n");
	  }
	  set network(value) {
	    this.removeTag("n");
	    if (value) this.tags.push(["n", value]);
	  }
	  /**
	   * Optional metadata
	   */
	  get metadata() {
	    if (!this.content) return void 0;
	    try {
	      return JSON.parse(this.content);
	    } catch {
	      return void 0;
	    }
	  }
	  set metadata(value) {
	    if (value) {
	      this.content = JSON.stringify(value);
	    } else {
	      this.content = "";
	    }
	  }
	};

	// src/events/kinds/cashu/mint-recommendation.ts
	var NDKMintRecommendation = class _NDKMintRecommendation extends NDKEvent {
	  static kind = 38e3 /* EcashMintRecommendation */;
	  static kinds = [38e3 /* EcashMintRecommendation */];
	  constructor(ndk, event) {
	    super(ndk, event);
	    this.kind ??= 38e3 /* EcashMintRecommendation */;
	  }
	  static async from(event) {
	    const recommendation = new _NDKMintRecommendation(event.ndk, event);
	    return recommendation;
	  }
	  /**
	   * Event kind being recommended (38173 for Fedimint or 38172 for Cashu)
	   */
	  get recommendedKind() {
	    const value = this.tagValue("k");
	    return value ? Number(value) : void 0;
	  }
	  set recommendedKind(value) {
	    this.removeTag("k");
	    if (value) this.tags.push(["k", value.toString()]);
	  }
	  /**
	   * Identifier for the recommended mint event
	   */
	  get identifier() {
	    return this.tagValue("d");
	  }
	  set identifier(value) {
	    this.removeTag("d");
	    if (value) this.tags.push(["d", value]);
	  }
	  /**
	   * Mint connection URLs/invite codes (multiple allowed)
	   */
	  get urls() {
	    return this.getMatchingTags("u").map((t) => t[1]);
	  }
	  set urls(values) {
	    this.removeTag("u");
	    for (const value of values) {
	      this.tags.push(["u", value]);
	    }
	  }
	  /**
	   * Pointers to specific mint events
	   * Returns array of {kind, identifier, relay} objects
	   */
	  get mintEventPointers() {
	    return this.getMatchingTags("a").map((t) => ({
	      kind: Number(t[1].split(":")[0]),
	      identifier: t[1].split(":")[2],
	      relay: t[2]
	    }));
	  }
	  /**
	   * Add a pointer to a specific mint event
	   */
	  addMintEventPointer(kind, pubkey, identifier, relay) {
	    const aTag = [`a`, `${kind}:${pubkey}:${identifier}`];
	    if (relay) aTag.push(relay);
	    this.tags.push(aTag);
	  }
	  /**
	   * Review/recommendation text
	   */
	  get review() {
	    return this.content;
	  }
	  set review(value) {
	    this.content = value;
	  }
	};

	// src/events/kinds/classified.ts
	var NDKClassified = class _NDKClassified extends NDKEvent {
	  static kinds = [30402 /* Classified */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 30402 /* Classified */;
	  }
	  /**
	   * Creates a NDKClassified from an existing NDKEvent.
	   *
	   * @param event NDKEvent to create the NDKClassified from.
	   * @returns NDKClassified
	   */
	  static from(event) {
	    return new _NDKClassified(event.ndk, event);
	  }
	  /**
	   * Getter for the classified title.
	   *
	   * @returns {string | undefined} - The classified title if available, otherwise undefined.
	   */
	  get title() {
	    return this.tagValue("title");
	  }
	  /**
	   * Setter for the classified title.
	   *
	   * @param {string | undefined} title - The title to set for the classified.
	   */
	  set title(title) {
	    this.removeTag("title");
	    if (title) this.tags.push(["title", title]);
	  }
	  /**
	   * Getter for the classified summary.
	   *
	   * @returns {string | undefined} - The classified summary if available, otherwise undefined.
	   */
	  get summary() {
	    return this.tagValue("summary");
	  }
	  /**
	   * Setter for the classified summary.
	   *
	   * @param {string | undefined} summary - The summary to set for the classified.
	   */
	  set summary(summary) {
	    this.removeTag("summary");
	    if (summary) this.tags.push(["summary", summary]);
	  }
	  /**
	   * Getter for the classified's publication timestamp.
	   *
	   * @returns {number | undefined} - The Unix timestamp of when the classified was published or undefined.
	   */
	  get published_at() {
	    const tag = this.tagValue("published_at");
	    if (tag) {
	      return Number.parseInt(tag);
	    }
	    return void 0;
	  }
	  /**
	   * Setter for the classified's publication timestamp.
	   *
	   * @param {number | undefined} timestamp - The Unix timestamp to set for the classified's publication date.
	   */
	  set published_at(timestamp) {
	    this.removeTag("published_at");
	    if (timestamp !== void 0) {
	      this.tags.push(["published_at", timestamp.toString()]);
	    }
	  }
	  /**
	   * Getter for the classified location.
	   *
	   * @returns {string | undefined} - The classified location if available, otherwise undefined.
	   */
	  get location() {
	    return this.tagValue("location");
	  }
	  /**
	   * Setter for the classified location.
	   *
	   * @param {string | undefined} location - The location to set for the classified.
	   */
	  set location(location) {
	    this.removeTag("location");
	    if (location) this.tags.push(["location", location]);
	  }
	  /**
	   * Getter for the classified price.
	   *
	   * @returns {NDKClassifiedPriceTag | undefined} - The classified price if available, otherwise undefined.
	   */
	  get price() {
	    const priceTag = this.tags.find((tag) => tag[0] === "price");
	    if (priceTag) {
	      return {
	        amount: Number.parseFloat(priceTag[1]),
	        currency: priceTag[2],
	        frequency: priceTag[3]
	      };
	    }
	    return void 0;
	  }
	  /**
	   * Setter for the classified price.
	   *
	   * @param price - The price to set for the classified.
	   */
	  set price(priceTag) {
	    if (typeof priceTag === "string") {
	      priceTag = {
	        amount: Number.parseFloat(priceTag)
	      };
	    }
	    if (priceTag?.amount) {
	      const tag = ["price", priceTag.amount.toString()];
	      if (priceTag.currency) tag.push(priceTag.currency);
	      if (priceTag.frequency) tag.push(priceTag.frequency);
	      this.tags.push(tag);
	    } else {
	      this.removeTag("price");
	    }
	  }
	  /**
	   * Generates content tags for the classified.
	   *
	   * This method first checks and sets the publication date if not available,
	   * and then generates content tags based on the base NDKEvent class.
	   *
	   * @returns {ContentTag} - The generated content tags.
	   */
	  async generateTags() {
	    super.generateTags();
	    if (!this.published_at) {
	      this.published_at = this.created_at;
	    }
	    return super.generateTags();
	  }
	};

	// src/events/kinds/drafts.ts
	var NDKDraft = class _NDKDraft extends NDKEvent {
	  _event;
	  static kind = 31234 /* Draft */;
	  static kinds = [31234 /* Draft */, 1234 /* DraftCheckpoint */];
	  /**
	   * Can be used to include a different pubkey as part of the draft.
	   * This is useful when we want to make the draft a proposal for a different user to publish.
	   */
	  counterparty;
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 31234 /* Draft */;
	  }
	  static from(event) {
	    return new _NDKDraft(event.ndk, event);
	  }
	  /**
	   * Sets an identifier (i.e. d-tag)
	   */
	  set identifier(id) {
	    this.removeTag("d");
	    this.tags.push(["d", id]);
	  }
	  get identifier() {
	    return this.dTag;
	  }
	  /**
	   * Event that is to be saved.
	   */
	  set event(e) {
	    if (!(e instanceof NDKEvent)) this._event = new NDKEvent(void 0, e);
	    else this._event = e;
	    this.prepareEvent();
	  }
	  /**
	   * Marks the event as a checkpoint for another draft event.
	   */
	  set checkpoint(parent) {
	    if (parent) {
	      this.tags.push(parent.tagReference());
	      this.kind = 1234 /* DraftCheckpoint */;
	    } else {
	      this.removeTag("a");
	      this.kind = 31234 /* Draft */;
	    }
	  }
	  get isCheckpoint() {
	    return this.kind === 1234 /* DraftCheckpoint */;
	  }
	  get isProposal() {
	    const pTag = this.tagValue("p");
	    return !!pTag && pTag !== this.pubkey;
	  }
	  /**
	   * Gets the event.
	   * @param param0
	   * @returns NDKEvent of the draft event or null if the draft event has been deleted (emptied).
	   */
	  async getEvent(signer) {
	    if (this._event) return this._event;
	    signer ??= this.ndk?.signer;
	    if (!signer) throw new Error("No signer available");
	    if (this.content && this.content.length > 0) {
	      try {
	        const ownPubkey = signer.pubkey;
	        const pubkeys = [this.tagValue("p"), this.pubkey].filter(Boolean);
	        const counterpartyPubkey = pubkeys.find((pubkey) => pubkey !== ownPubkey);
	        let user;
	        user = new NDKUser({ pubkey: counterpartyPubkey ?? ownPubkey });
	        await this.decrypt(user, signer);
	        const payload = JSON.parse(this.content);
	        this._event = await wrapEvent(new NDKEvent(this.ndk, payload));
	        return this._event;
	      } catch (e) {
	        console.error(e);
	        return void 0;
	      }
	    } else {
	      return null;
	    }
	  }
	  prepareEvent() {
	    if (!this._event) throw new Error("No event has been provided");
	    this.removeTag("k");
	    if (this._event.kind) this.tags.push(["k", this._event.kind.toString()]);
	    this.content = JSON.stringify(this._event.rawEvent());
	  }
	  /**
	   * Generates draft event.
	   *
	   * @param signer: Optional signer to encrypt with
	   * @param publish: Whether to publish, optionally specifying relaySet to publish to
	   */
	  async save({ signer, publish, relaySet }) {
	    signer ??= this.ndk?.signer;
	    if (!signer) throw new Error("No signer available");
	    const user = this.counterparty || await signer.user();
	    await this.encrypt(user, signer);
	    if (this.counterparty) {
	      const pubkey = this.counterparty.pubkey;
	      this.removeTag("p");
	      this.tags.push(["p", pubkey]);
	    }
	    if (publish === false) return;
	    return this.publishReplaceable(relaySet);
	  }
	};

	// src/utils/imeta.ts
	function mapImetaTag(tag) {
	  const data = {};
	  if (tag.length === 2) {
	    const parts = tag[1].split(" ");
	    for (let i = 0; i < parts.length; i += 2) {
	      const key = parts[i];
	      const value = parts[i + 1];
	      if (key === "fallback") {
	        if (!data.fallback) data.fallback = [];
	        data.fallback.push(value);
	      } else {
	        data[key] = value;
	      }
	    }
	    return data;
	  }
	  const tags = tag.slice(1);
	  for (const val of tags) {
	    const parts = val.split(" ");
	    const key = parts[0];
	    const value = parts.slice(1).join(" ");
	    if (key === "fallback") {
	      if (!data.fallback) data.fallback = [];
	      data.fallback.push(value);
	    } else {
	      data[key] = value;
	    }
	  }
	  return data;
	}
	function imetaTagToTag(imeta) {
	  const tag = ["imeta"];
	  for (const [key, value] of Object.entries(imeta)) {
	    if (Array.isArray(value)) {
	      for (const v of value) {
	        tag.push(`${key} ${v}`);
	      }
	    } else if (value) {
	      tag.push(`${key} ${value}`);
	    }
	  }
	  return tag;
	}

	// src/events/kinds/follow-pack.ts
	var NDKFollowPack = class _NDKFollowPack extends NDKEvent {
	  static kind = 39089 /* FollowPack */;
	  static kinds = [39089 /* FollowPack */, 39092 /* MediaFollowPack */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 39089 /* FollowPack */;
	  }
	  /**
	   * Converts a generic NDKEvent to an NDKFollowPack.
	   */
	  static from(ndkEvent) {
	    return new _NDKFollowPack(ndkEvent.ndk, ndkEvent);
	  }
	  /**
	   * Gets the title from the tags.
	   */
	  get title() {
	    return this.tagValue("title");
	  }
	  /**
	   * Sets the title tag.
	   */
	  set title(value) {
	    this.removeTag("title");
	    if (value) this.tags.push(["title", value]);
	  }
	  /**
	   * Gets the image URL from the tags.
	   */
	  /**
	   * Gets the image URL from the tags.
	   * Looks for an imeta tag first (returns its url), then falls back to the image tag.
	   */
	  get image() {
	    const imetaTag = this.tags.find((tag) => tag[0] === "imeta");
	    if (imetaTag) {
	      const imeta = mapImetaTag(imetaTag);
	      if (imeta.url) return imeta.url;
	    }
	    return this.tagValue("image");
	  }
	  /**
	   * Sets the image URL tag.
	   */
	  /**
	   * Sets the image tag.
	   * Accepts a string (URL) or an NDKImetaTag.
	   * If given an NDKImetaTag, sets both the imeta tag and the image tag (using the url).
	   * If undefined, removes both tags.
	   */
	  set image(value) {
	    this.tags = this.tags.filter((tag) => tag[0] !== "imeta" && tag[0] !== "image");
	    if (typeof value === "string") {
	      if (value !== void 0) {
	        this.tags.push(["image", value]);
	      }
	    } else if (value && typeof value === "object") {
	      this.tags.push(imetaTagToTag(value));
	      if (value.url) {
	        this.tags.push(["image", value.url]);
	      }
	    }
	  }
	  /**
	   * Gets all pubkeys from p tags.
	   */
	  get pubkeys() {
	    return Array.from(
	      new Set(this.tags.filter((tag) => tag[0] === "p" && tag[1] && isValidPubkey(tag[1])).map((tag) => tag[1]))
	    );
	  }
	  /**
	   * Sets the pubkeys (replaces all p tags).
	   */
	  set pubkeys(pubkeys) {
	    this.tags = this.tags.filter((tag) => tag[0] !== "p");
	    for (const pubkey of pubkeys) {
	      this.tags.push(["p", pubkey]);
	    }
	  }
	  /**
	   * Gets the description from the tags.
	   */
	  get description() {
	    return this.tagValue("description");
	  }
	  /**
	   * Sets the description tag.
	   */
	  set description(value) {
	    this.removeTag("description");
	    if (value) this.tags.push(["description", value]);
	  }
	};
	var NDKHighlight = class _NDKHighlight extends NDKEvent {
	  _article;
	  static kind = 9802 /* Highlight */;
	  static kinds = [9802 /* Highlight */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 9802 /* Highlight */;
	  }
	  static from(event) {
	    return new _NDKHighlight(event.ndk, event);
	  }
	  get url() {
	    return this.tagValue("r");
	  }
	  /**
	   * Context tag.
	   */
	  set context(context) {
	    if (context === void 0) {
	      this.tags = this.tags.filter(([tag, _value]) => tag !== "context");
	    } else {
	      this.tags = this.tags.filter(([tag, _value]) => tag !== "context");
	      this.tags.push(["context", context]);
	    }
	  }
	  get context() {
	    return this.tags.find(([tag, _value]) => tag === "context")?.[1] ?? void 0;
	  }
	  /**
	   * Will return the article URL or NDKEvent if they have already been
	   * set (it won't attempt to load remote events)
	   */
	  get article() {
	    return this._article;
	  }
	  /**
	   * Article the highlight is coming from.
	   *
	   * @param article Article URL or NDKEvent.
	   */
	  set article(article) {
	    this._article = article;
	    if (typeof article === "string") {
	      this.tags.push(["r", article]);
	    } else {
	      this.tag(article);
	    }
	  }
	  getArticleTag() {
	    return this.getMatchingTags("a")[0] || this.getMatchingTags("e")[0] || this.getMatchingTags("r")[0];
	  }
	  async getArticle() {
	    if (this._article !== void 0) return this._article;
	    let taggedBech32;
	    const articleTag = this.getArticleTag();
	    if (!articleTag) return void 0;
	    switch (articleTag[0]) {
	      case "a": {
	        const [kind, pubkey, identifier] = articleTag[1].split(":");
	        taggedBech32 = nip19_exports$1.naddrEncode({
	          kind: Number.parseInt(kind),
	          pubkey,
	          identifier
	        });
	        break;
	      }
	      case "e":
	        taggedBech32 = nip19_exports$1.noteEncode(articleTag[1]);
	        break;
	      case "r":
	        this._article = articleTag[1];
	        break;
	    }
	    if (taggedBech32) {
	      let a = await this.ndk?.fetchEvent(taggedBech32);
	      if (a) {
	        if (a.kind === 30023 /* Article */) {
	          a = NDKArticle.from(a);
	        }
	        this._article = a;
	      }
	    }
	    return this._article;
	  }
	};

	// src/events/kinds/image.ts
	var NDKImage = class _NDKImage extends NDKEvent {
	  static kind = 20 /* Image */;
	  static kinds = [20 /* Image */];
	  _imetas;
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 20 /* Image */;
	  }
	  /**
	   * Creates a NDKImage from an existing NDKEvent.
	   *
	   * @param event NDKEvent to create the NDKImage from.
	   * @returns NDKImage
	   */
	  static from(event) {
	    return new _NDKImage(event.ndk, event.rawEvent());
	  }
	  get isValid() {
	    return this.imetas.length > 0;
	  }
	  get imetas() {
	    if (this._imetas) return this._imetas;
	    this._imetas = this.tags.filter((tag) => tag[0] === "imeta").map(mapImetaTag).filter((imeta) => !!imeta.url);
	    return this._imetas;
	  }
	  set imetas(tags) {
	    this._imetas = tags;
	    this.tags = this.tags.filter((tag) => tag[0] !== "imeta");
	    this.tags.push(...tags.map(imetaTagToTag));
	  }
	};

	// src/events/kinds/lists/index.ts
	var NDKList = class _NDKList extends NDKEvent {
	  _encryptedTags;
	  static kinds = [
	    30001 /* CategorizedBookmarkList */,
	    10004 /* CommunityList */,
	    10050 /* DirectMessageReceiveRelayList */,
	    10030 /* EmojiList */,
	    10015 /* InterestList */,
	    10001 /* PinList */,
	    10002 /* RelayList */,
	    10007 /* SearchRelayList */,
	    10006 /* BlockRelayList */,
	    10003 /* BookmarkList */
	  ];
	  /**
	   * Stores the number of bytes the content was before decryption
	   * to expire the cache when the content changes.
	   */
	  encryptedTagsLength;
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 30001 /* CategorizedBookmarkList */;
	  }
	  /**
	   * Wrap a NDKEvent into a NDKList
	   */
	  static from(ndkEvent) {
	    return new _NDKList(ndkEvent.ndk, ndkEvent);
	  }
	  /**
	   * Returns the title of the list. Falls back on fetching the name tag value.
	   */
	  get title() {
	    const titleTag = this.tagValue("title") || this.tagValue("name");
	    if (titleTag) return titleTag;
	    if (this.kind === 3 /* Contacts */) {
	      return "Contacts";
	    }
	    if (this.kind === 1e4 /* MuteList */) {
	      return "Mute";
	    }
	    if (this.kind === 10001 /* PinList */) {
	      return "Pinned Notes";
	    }
	    if (this.kind === 10002 /* RelayList */) {
	      return "Relay Metadata";
	    }
	    if (this.kind === 10003 /* BookmarkList */) {
	      return "Bookmarks";
	    }
	    if (this.kind === 10004 /* CommunityList */) {
	      return "Communities";
	    }
	    if (this.kind === 10005 /* PublicChatList */) {
	      return "Public Chats";
	    }
	    if (this.kind === 10006 /* BlockRelayList */) {
	      return "Blocked Relays";
	    }
	    if (this.kind === 10007 /* SearchRelayList */) {
	      return "Search Relays";
	    }
	    if (this.kind === 10050 /* DirectMessageReceiveRelayList */) {
	      return "Direct Message Receive Relays";
	    }
	    if (this.kind === 10015 /* InterestList */) {
	      return "Interests";
	    }
	    if (this.kind === 10030 /* EmojiList */) {
	      return "Emojis";
	    }
	    return this.tagValue("d");
	  }
	  /**
	   * Sets the title of the list.
	   */
	  set title(title) {
	    this.removeTag(["title", "name"]);
	    if (title) this.tags.push(["title", title]);
	  }
	  /**
	   * Returns the name of the list.
	   * @deprecated Please use "title" instead.
	   */
	  get name() {
	    return this.title;
	  }
	  /**
	   * Sets the name of the list.
	   * @deprecated Please use "title" instead. This method will use the `title` tag instead.
	   */
	  set name(name) {
	    this.title = name;
	  }
	  /**
	   * Returns the description of the list.
	   */
	  get description() {
	    return this.tagValue("description");
	  }
	  /**
	   * Sets the description of the list.
	   */
	  set description(name) {
	    this.removeTag("description");
	    if (name) this.tags.push(["description", name]);
	  }
	  /**
	   * Returns the image of the list.
	   */
	  get image() {
	    return this.tagValue("image");
	  }
	  /**
	   * Sets the image of the list.
	   */
	  set image(name) {
	    this.removeTag("image");
	    if (name) this.tags.push(["image", name]);
	  }
	  isEncryptedTagsCacheValid() {
	    return !!(this._encryptedTags && this.encryptedTagsLength === this.content.length);
	  }
	  /**
	   * Returns the decrypted content of the list.
	   */
	  async encryptedTags(useCache = true) {
	    if (useCache && this.isEncryptedTagsCacheValid()) return this._encryptedTags;
	    if (!this.ndk) throw new Error("NDK instance not set");
	    if (!this.ndk.signer) throw new Error("NDK signer not set");
	    const user = await this.ndk.signer.user();
	    try {
	      if (this.content.length > 0) {
	        try {
	          const decryptedContent = await this.ndk.signer.decrypt(user, this.content);
	          const a = JSON.parse(decryptedContent);
	          if (a?.[0]) {
	            this.encryptedTagsLength = this.content.length;
	            return this._encryptedTags = a;
	          }
	          this.encryptedTagsLength = this.content.length;
	          return this._encryptedTags = [];
	        } catch (_e) {
	        }
	      }
	    } catch (_e) {
	    }
	    return [];
	  }
	  /**
	   * This method can be overriden to validate that a tag is valid for this list.
	   *
	   * (i.e. the NDKPersonList can validate that items are NDKUser instances)
	   */
	  validateTag(_tagValue) {
	    return true;
	  }
	  getItems(type) {
	    return this.tags.filter((tag) => tag[0] === type);
	  }
	  /**
	   * Returns the unecrypted items in this list.
	   */
	  get items() {
	    return this.tags.filter((t) => {
	      return ![
	        "d",
	        "L",
	        "l",
	        "title",
	        "name",
	        "description",
	        "published_at",
	        "summary",
	        "image",
	        "thumb",
	        "alt",
	        "expiration",
	        "subject",
	        "client"
	      ].includes(t[0]);
	    });
	  }
	  /**
	   * Adds a new item to the list.
	   * @param relay Relay to add
	   * @param mark Optional mark to add to the item
	   * @param encrypted Whether to encrypt the item
	   * @param position Where to add the item in the list (top or bottom)
	   */
	  async addItem(item, mark = void 0, encrypted = false, position = "bottom") {
	    if (!this.ndk) throw new Error("NDK instance not set");
	    if (!this.ndk.signer) throw new Error("NDK signer not set");
	    let tags;
	    if (item instanceof NDKEvent) {
	      tags = [item.tagReference(mark)];
	    } else if (item instanceof NDKUser) {
	      tags = item.referenceTags();
	    } else if (item instanceof NDKRelay) {
	      tags = item.referenceTags();
	    } else if (Array.isArray(item)) {
	      tags = [item];
	    } else {
	      throw new Error("Invalid object type");
	    }
	    if (mark) tags[0].push(mark);
	    if (encrypted) {
	      const user = await this.ndk.signer.user();
	      const currentList = await this.encryptedTags();
	      if (position === "top") currentList.unshift(...tags);
	      else currentList.push(...tags);
	      this._encryptedTags = currentList;
	      this.encryptedTagsLength = this.content.length;
	      this.content = JSON.stringify(currentList);
	      await this.encrypt(user);
	    } else {
	      if (position === "top") this.tags.unshift(...tags);
	      else this.tags.push(...tags);
	    }
	    this.created_at = Math.floor(Date.now() / 1e3);
	    this.emit("change");
	  }
	  /**
	   * Removes an item from the list from both the encrypted and unencrypted lists.
	   * @param value value of item to remove from the list
	   * @param publish whether to publish the change
	   * @returns
	   */
	  async removeItemByValue(value, publish = true) {
	    if (!this.ndk) throw new Error("NDK instance not set");
	    if (!this.ndk.signer) throw new Error("NDK signer not set");
	    const index = this.tags.findIndex((tag) => tag[1] === value);
	    if (index >= 0) {
	      this.tags.splice(index, 1);
	    }
	    const user = await this.ndk.signer.user();
	    const encryptedTags = await this.encryptedTags();
	    const encryptedIndex = encryptedTags.findIndex((tag) => tag[1] === value);
	    if (encryptedIndex >= 0) {
	      encryptedTags.splice(encryptedIndex, 1);
	      this._encryptedTags = encryptedTags;
	      this.encryptedTagsLength = this.content.length;
	      this.content = JSON.stringify(encryptedTags);
	      await this.encrypt(user);
	    }
	    if (publish) {
	      return this.publishReplaceable();
	    }
	    this.created_at = Math.floor(Date.now() / 1e3);
	    this.emit("change");
	  }
	  /**
	   * Removes an item from the list.
	   *
	   * @param index The index of the item to remove.
	   * @param encrypted Whether to remove from the encrypted list or not.
	   */
	  async removeItem(index, encrypted) {
	    if (!this.ndk) throw new Error("NDK instance not set");
	    if (!this.ndk.signer) throw new Error("NDK signer not set");
	    if (encrypted) {
	      const user = await this.ndk.signer.user();
	      const currentList = await this.encryptedTags();
	      currentList.splice(index, 1);
	      this._encryptedTags = currentList;
	      this.encryptedTagsLength = this.content.length;
	      this.content = JSON.stringify(currentList);
	      await this.encrypt(user);
	    } else {
	      this.tags.splice(index, 1);
	    }
	    this.created_at = Math.floor(Date.now() / 1e3);
	    this.emit("change");
	    return this;
	  }
	  has(item) {
	    return this.items.some((tag) => tag[1] === item);
	  }
	  /**
	   * Creates a filter that will result in fetching
	   * the items of this list
	   * @example
	   * const list = new NDKList(...);
	   * const filters = list.filterForItems();
	   * const events = await ndk.fetchEvents(filters);
	   */
	  filterForItems() {
	    const ids = /* @__PURE__ */ new Set();
	    const nip33Queries = /* @__PURE__ */ new Map();
	    const filters = [];
	    for (const tag of this.items) {
	      if (tag[0] === "e" && tag[1]) {
	        ids.add(tag[1]);
	      } else if (tag[0] === "a" && tag[1]) {
	        const [kind, pubkey, dTag] = tag[1].split(":");
	        if (!kind || !pubkey) continue;
	        const key = `${kind}:${pubkey}`;
	        const item = nip33Queries.get(key) || [];
	        item.push(dTag || "");
	        nip33Queries.set(key, item);
	      }
	    }
	    if (ids.size > 0) {
	      filters.push({ ids: Array.from(ids) });
	    }
	    if (nip33Queries.size > 0) {
	      for (const [key, values] of nip33Queries.entries()) {
	        const [kind, pubkey] = key.split(":");
	        filters.push({
	          kinds: [Number.parseInt(kind)],
	          authors: [pubkey],
	          "#d": values
	        });
	      }
	    }
	    return filters;
	  }
	};

	// src/events/kinds/nip89/app-handler.ts
	var NDKAppHandlerEvent = class _NDKAppHandlerEvent extends NDKEvent {
	  profile;
	  static kinds = [31990 /* AppHandler */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 31990 /* AppHandler */;
	  }
	  static from(ndkEvent) {
	    const event = new _NDKAppHandlerEvent(ndkEvent.ndk, ndkEvent.rawEvent());
	    if (event.isValid) {
	      return event;
	    }
	    return null;
	  }
	  get isValid() {
	    const combinations = /* @__PURE__ */ new Map();
	    const combinationFromTag = (tag) => [tag[0], tag[2]].join(":").toLowerCase();
	    const tagsToInspect = ["web", "android", "ios"];
	    for (const tag of this.tags) {
	      if (tagsToInspect.includes(tag[0])) {
	        const combination = combinationFromTag(tag);
	        if (combinations.has(combination)) {
	          if (combinations.get(combination) !== tag[1].toLowerCase()) {
	            return false;
	          }
	        }
	        combinations.set(combination, tag[1].toLowerCase());
	      }
	    }
	    return true;
	  }
	  /**
	   * Fetches app handler information
	   * If no app information is available on the kind:31990,
	   * we fetch the event's author's profile and return that instead.
	   */
	  async fetchProfile() {
	    if (this.profile === void 0 && this.content.length > 0) {
	      try {
	        const profile = JSON.parse(this.content);
	        if (profile?.name) {
	          return profile;
	        }
	        this.profile = null;
	      } catch (_e) {
	        this.profile = null;
	      }
	    }
	    return new Promise((resolve, reject) => {
	      const author = this.author;
	      author.fetchProfile().then(() => {
	        resolve(author.profile);
	      }).catch(reject);
	    });
	  }
	};
	var NDKNutzap = class _NDKNutzap extends NDKEvent {
	  debug;
	  _proofs = [];
	  static kind = 9321 /* Nutzap */;
	  static kinds = [_NDKNutzap.kind];
	  constructor(ndk, event) {
	    super(ndk, event);
	    this.kind ??= 9321 /* Nutzap */;
	    this.debug = ndk?.debug.extend("nutzap") ?? createDebug5("ndk:nutzap");
	    if (!this.alt) this.alt = "This is a nutzap";
	    try {
	      const proofTags = this.getMatchingTags("proof");
	      if (proofTags.length) {
	        this._proofs = proofTags.map((tag) => JSON.parse(tag[1]));
	      } else {
	        this._proofs = JSON.parse(this.content);
	      }
	    } catch {
	      return;
	    }
	  }
	  static from(event) {
	    const e = new _NDKNutzap(event.ndk, event);
	    if (!e._proofs || !e._proofs.length) return;
	    return e;
	  }
	  set comment(comment) {
	    this.content = comment ?? "";
	  }
	  get comment() {
	    const c = this.tagValue("comment");
	    if (c) return c;
	    return this.content;
	  }
	  set proofs(proofs) {
	    this._proofs = proofs;
	    this.tags = this.tags.filter((tag) => tag[0] !== "proof");
	    for (const proof of proofs) {
	      this.tags.push(["proof", JSON.stringify(proof)]);
	    }
	  }
	  get proofs() {
	    return this._proofs;
	  }
	  get rawP2pk() {
	    const firstProof = this.proofs[0];
	    try {
	      const secret = JSON.parse(firstProof.secret);
	      let payload;
	      if (typeof secret === "string") {
	        payload = JSON.parse(secret);
	        this.debug("stringified payload", firstProof.secret);
	      } else if (typeof secret === "object") {
	        payload = secret;
	      }
	      if (Array.isArray(payload) && payload[0] === "P2PK" && payload.length > 1 && typeof payload[1] === "object" && payload[1] !== null) {
	        return payload[1].data;
	      }
	      if (typeof payload === "object" && payload !== null && typeof payload[1]?.data === "string") {
	        return payload[1].data;
	      }
	    } catch (e) {
	      this.debug("error parsing p2pk pubkey", e, this.proofs[0]);
	    }
	    return void 0;
	  }
	  /**
	   * Gets the p2pk pubkey that is embedded in the first proof.
	   *
	   * Note that this returns a nostr pubkey, not a cashu pubkey (no "02" prefix)
	   */
	  get p2pk() {
	    const rawP2pk = this.rawP2pk;
	    if (!rawP2pk) return;
	    return rawP2pk.startsWith("02") ? rawP2pk.slice(2) : rawP2pk;
	  }
	  /**
	   * Get the mint where this nutzap proofs exist
	   */
	  get mint() {
	    return this.tagValue("u");
	  }
	  set mint(value) {
	    this.replaceTag(["u", value]);
	  }
	  get unit() {
	    let _unit = this.tagValue("unit") ?? "sat";
	    if (_unit?.startsWith("msat")) _unit = "sat";
	    return _unit;
	  }
	  set unit(value) {
	    this.removeTag("unit");
	    if (value?.startsWith("msat")) throw new Error("msat is not allowed, use sat denomination instead");
	    if (value) this.tag(["unit", value]);
	  }
	  get amount() {
	    const amount = this.proofs.reduce((total, proof) => total + proof.amount, 0);
	    return amount;
	  }
	  sender = this.author;
	  /**
	   * Set the target of the nutzap
	   * @param target The target of the nutzap (a user or an event)
	   */
	  set target(target) {
	    this.tags = this.tags.filter((t) => t[0] !== "p");
	    if (target instanceof NDKEvent) {
	      this.tags.push(target.tagReference());
	    }
	  }
	  set recipientPubkey(pubkey) {
	    this.removeTag("p");
	    this.tag(["p", pubkey]);
	  }
	  get recipientPubkey() {
	    return this.tagValue("p");
	  }
	  get recipient() {
	    const pubkey = this.recipientPubkey;
	    if (this.ndk) return this.ndk.getUser({ pubkey });
	    return new NDKUser({ pubkey });
	  }
	  async toNostrEvent() {
	    if (this.unit === "msat") {
	      this.unit = "sat";
	    }
	    this.removeTag("amount");
	    this.tags.push(["amount", this.amount.toString()]);
	    const event = await super.toNostrEvent();
	    event.content = this.comment;
	    return event;
	  }
	  /**
	   * Validates that the nutzap conforms to NIP-61
	   */
	  get isValid() {
	    let eTagCount = 0;
	    let pTagCount = 0;
	    let mintTagCount = 0;
	    for (const tag of this.tags) {
	      if (tag[0] === "e") eTagCount++;
	      if (tag[0] === "p") pTagCount++;
	      if (tag[0] === "u") mintTagCount++;
	    }
	    return (
	      // exactly one recipient and mint
	      pTagCount === 1 && mintTagCount === 1 && // must have at most one e tag
	      eTagCount <= 1 && // must have at least one proof
	      this.proofs.length > 0
	    );
	  }
	};

	// src/events/kinds/project.ts
	var NDKProject = class _NDKProject extends NDKEvent {
	  static kind = 31933 /* Project */;
	  static kinds = [31933 /* Project */];
	  _signer;
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind = 31933 /* Project */;
	  }
	  static from(event) {
	    return new _NDKProject(event.ndk, event.rawEvent());
	  }
	  set repo(value) {
	    this.removeTag("repo");
	    if (value) this.tags.push(["repo", value]);
	  }
	  set hashtags(values) {
	    this.removeTag("hashtags");
	    if (values.filter((t) => t.length > 0).length) this.tags.push(["hashtags", ...values]);
	  }
	  get hashtags() {
	    const tag = this.tags.find((tag2) => tag2[0] === "hashtags");
	    return tag ? tag.slice(1) : [];
	  }
	  get repo() {
	    return this.tagValue("repo");
	  }
	  get title() {
	    return this.tagValue("title");
	  }
	  set title(value) {
	    this.removeTag("title");
	    if (value) this.tags.push(["title", value]);
	  }
	  get picture() {
	    return this.tagValue("picture");
	  }
	  set picture(value) {
	    this.removeTag("picture");
	    if (value) this.tags.push(["picture", value]);
	  }
	  set description(value) {
	    this.content = value;
	  }
	  get description() {
	    return this.content;
	  }
	  /**
	   * The project slug, derived from the 'd' tag.
	   */
	  get slug() {
	    return this.dTag ?? "empty-dtag";
	  }
	  async getSigner() {
	    if (this._signer) return this._signer;
	    const encryptedKey = this.tagValue("key");
	    if (!encryptedKey) {
	      this._signer = NDKPrivateKeySigner.generate();
	      await this.encryptAndSaveNsec();
	    } else {
	      const decryptedKey = await this.ndk?.signer?.decrypt(this.ndk.activeUser, encryptedKey);
	      if (!decryptedKey) {
	        throw new Error("Failed to decrypt project key or missing signer context.");
	      }
	      this._signer = new NDKPrivateKeySigner(decryptedKey);
	    }
	    return this._signer;
	  }
	  async getNsec() {
	    const signer = await this.getSigner();
	    return signer.privateKey;
	  }
	  async setNsec(value) {
	    this._signer = new NDKPrivateKeySigner(value);
	    await this.encryptAndSaveNsec();
	  }
	  async encryptAndSaveNsec() {
	    if (!this._signer) throw new Error("Signer is not set.");
	    const key = this._signer.privateKey;
	    const encryptedKey = await this.ndk?.signer?.encrypt(this.ndk.activeUser, key);
	    if (encryptedKey) {
	      this.removeTag("key");
	      this.tags.push(["key", encryptedKey]);
	    }
	  }
	};

	// src/events/kinds/project-template.ts
	var NDKProjectTemplate = class _NDKProjectTemplate extends NDKEvent {
	  static kind = 30717 /* ProjectTemplate */;
	  static kinds = [30717 /* ProjectTemplate */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind = 30717 /* ProjectTemplate */;
	  }
	  static from(event) {
	    return new _NDKProjectTemplate(event.ndk, event.rawEvent());
	  }
	  /**
	   * Template identifier from 'd' tag
	   */
	  get templateId() {
	    return this.dTag ?? "";
	  }
	  set templateId(value) {
	    this.dTag = value;
	  }
	  /**
	   * Template name from 'title' tag
	   */
	  get name() {
	    return this.tagValue("title") ?? "";
	  }
	  set name(value) {
	    this.removeTag("title");
	    if (value) this.tags.push(["title", value]);
	  }
	  /**
	   * Template description from 'description' tag
	   */
	  get description() {
	    return this.tagValue("description") ?? "";
	  }
	  set description(value) {
	    this.removeTag("description");
	    if (value) this.tags.push(["description", value]);
	  }
	  /**
	   * Git repository URL from 'uri' tag
	   */
	  get repoUrl() {
	    return this.tagValue("uri") ?? "";
	  }
	  set repoUrl(value) {
	    this.removeTag("uri");
	    if (value) this.tags.push(["uri", value]);
	  }
	  /**
	   * Template preview image URL from 'image' tag
	   */
	  get image() {
	    return this.tagValue("image");
	  }
	  set image(value) {
	    this.removeTag("image");
	    if (value) this.tags.push(["image", value]);
	  }
	  /**
	   * Command to run from 'command' tag
	   */
	  get command() {
	    return this.tagValue("command");
	  }
	  set command(value) {
	    this.removeTag("command");
	    if (value) this.tags.push(["command", value]);
	  }
	  /**
	   * Agent configuration from 'agent' tag
	   */
	  get agentConfig() {
	    const agentTag = this.tagValue("agent");
	    if (!agentTag) return void 0;
	    try {
	      return JSON.parse(agentTag);
	    } catch {
	      return void 0;
	    }
	  }
	  set agentConfig(value) {
	    this.removeTag("agent");
	    if (value) {
	      this.tags.push(["agent", JSON.stringify(value)]);
	    }
	  }
	  /**
	   * Template tags from 't' tags
	   */
	  get templateTags() {
	    return this.getMatchingTags("t").map((tag) => tag[1]).filter(Boolean);
	  }
	  set templateTags(values) {
	    this.tags = this.tags.filter((tag) => tag[0] !== "t");
	    values.forEach((value) => {
	      if (value) this.tags.push(["t", value]);
	    });
	  }
	};

	// src/events/kinds/relay-list.ts
	var READ_MARKER = "read";
	var WRITE_MARKER = "write";
	var NDKRelayList = class _NDKRelayList extends NDKEvent {
	  static kinds = [10002 /* RelayList */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 10002 /* RelayList */;
	  }
	  static from(ndkEvent) {
	    return new _NDKRelayList(ndkEvent.ndk, ndkEvent.rawEvent());
	  }
	  get readRelayUrls() {
	    return this.tags.filter((tag) => tag[0] === "r" || tag[0] === "relay").filter((tag) => !tag[2] || tag[2] && tag[2] === READ_MARKER).map((tag) => tryNormalizeRelayUrl(tag[1])).filter((url) => !!url);
	  }
	  set readRelayUrls(relays) {
	    for (const relay of relays) {
	      this.tags.push(["r", relay, READ_MARKER]);
	    }
	  }
	  get writeRelayUrls() {
	    return this.tags.filter((tag) => tag[0] === "r" || tag[0] === "relay").filter((tag) => !tag[2] || tag[2] && tag[2] === WRITE_MARKER).map((tag) => tryNormalizeRelayUrl(tag[1])).filter((url) => !!url);
	  }
	  set writeRelayUrls(relays) {
	    for (const relay of relays) {
	      this.tags.push(["r", relay, WRITE_MARKER]);
	    }
	  }
	  get bothRelayUrls() {
	    return this.tags.filter((tag) => tag[0] === "r" || tag[0] === "relay").filter((tag) => !tag[2]).map((tag) => tag[1]);
	  }
	  set bothRelayUrls(relays) {
	    for (const relay of relays) {
	      this.tags.push(["r", relay]);
	    }
	  }
	  get relays() {
	    return this.tags.filter((tag) => tag[0] === "r" || tag[0] === "relay").map((tag) => tag[1]);
	  }
	  /**
	   * Provides a relaySet for the relays in this list.
	   */
	  get relaySet() {
	    if (!this.ndk) throw new Error("NDKRelayList has no NDK instance");
	    return new NDKRelaySet(
	      new Set(this.relays.map((u) => this.ndk?.pool.getRelay(u)).filter((r) => !!r)),
	      this.ndk
	    );
	  }
	};
	function relayListFromKind3(ndk, contactList) {
	  try {
	    const content = JSON.parse(contactList.content);
	    const relayList = new NDKRelayList(ndk);
	    const readRelays = /* @__PURE__ */ new Set();
	    const writeRelays = /* @__PURE__ */ new Set();
	    for (let [key, config] of Object.entries(content)) {
	      try {
	        key = normalizeRelayUrl(key);
	      } catch {
	        continue;
	      }
	      if (!config) {
	        readRelays.add(key);
	        writeRelays.add(key);
	      } else {
	        const relayConfig = config;
	        if (relayConfig.write) writeRelays.add(key);
	        if (relayConfig.read) readRelays.add(key);
	      }
	    }
	    relayList.readRelayUrls = Array.from(readRelays);
	    relayList.writeRelayUrls = Array.from(writeRelays);
	    return relayList;
	  } catch {
	  }
	  return void 0;
	}

	// src/events/kinds/repost.ts
	var NDKRepost = class _NDKRepost extends NDKEvent {
	  _repostedEvents;
	  static kinds = [6, 16];
	  // Repost, GenericRepost
	  static from(event) {
	    return new _NDKRepost(event.ndk, event.rawEvent());
	  }
	  /**
	   * Returns all reposted events by the current event.
	   *
	   * @param klass Optional class to convert the events to.
	   * @returns
	   */
	  async repostedEvents(klass, opts) {
	    const items = [];
	    if (!this.ndk) throw new Error("NDK instance not set");
	    if (this._repostedEvents !== void 0) return this._repostedEvents;
	    for (const eventId of this.repostedEventIds()) {
	      const filter = filterForId(eventId);
	      const event = await this.ndk.fetchEvent(filter, opts);
	      if (event) {
	        items.push(klass ? klass.from(event) : event);
	      }
	    }
	    return items;
	  }
	  /**
	   * Returns the reposted event IDs.
	   */
	  repostedEventIds() {
	    return this.tags.filter((t) => t[0] === "e" || t[0] === "a").map((t) => t[1]);
	  }
	};
	function filterForId(id) {
	  if (id.match(/:/)) {
	    const [kind, pubkey, identifier] = id.split(":");
	    return {
	      kinds: [Number.parseInt(kind)],
	      authors: [pubkey],
	      "#d": [identifier]
	    };
	  }
	  return { ids: [id] };
	}

	// src/events/kinds/simple-group/member-list.ts
	var NDKSimpleGroupMemberList = class _NDKSimpleGroupMemberList extends NDKEvent {
	  relaySet;
	  memberSet = /* @__PURE__ */ new Set();
	  static kind = 39002 /* GroupMembers */;
	  static kinds = [39002 /* GroupMembers */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 39002 /* GroupMembers */;
	    this.memberSet = new Set(this.members);
	  }
	  static from(event) {
	    return new _NDKSimpleGroupMemberList(event.ndk, event);
	  }
	  get members() {
	    return this.getMatchingTags("p").map((tag) => tag[1]);
	  }
	  hasMember(member) {
	    return this.memberSet.has(member);
	  }
	  async publish(relaySet, timeoutMs, requiredRelayCount) {
	    relaySet ??= this.relaySet;
	    return super.publishReplaceable(relaySet, timeoutMs, requiredRelayCount);
	  }
	};

	// src/events/kinds/simple-group/metadata.ts
	var NDKSimpleGroupMetadata = class _NDKSimpleGroupMetadata extends NDKEvent {
	  static kind = 39e3 /* GroupMetadata */;
	  static kinds = [39e3 /* GroupMetadata */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 39e3 /* GroupMetadata */;
	  }
	  static from(event) {
	    return new _NDKSimpleGroupMetadata(event.ndk, event);
	  }
	  get name() {
	    return this.tagValue("name");
	  }
	  get picture() {
	    return this.tagValue("picture");
	  }
	  get about() {
	    return this.tagValue("about");
	  }
	  get scope() {
	    if (this.getMatchingTags("public").length > 0) return "public";
	    if (this.getMatchingTags("public").length > 0) return "private";
	    return void 0;
	  }
	  set scope(scope) {
	    this.removeTag("public");
	    this.removeTag("private");
	    if (scope === "public") {
	      this.tags.push(["public", ""]);
	    } else if (scope === "private") {
	      this.tags.push(["private", ""]);
	    }
	  }
	  get access() {
	    if (this.getMatchingTags("open").length > 0) return "open";
	    if (this.getMatchingTags("closed").length > 0) return "closed";
	    return void 0;
	  }
	  set access(access) {
	    this.removeTag("open");
	    this.removeTag("closed");
	    if (access === "open") {
	      this.tags.push(["open", ""]);
	    } else if (access === "closed") {
	      this.tags.push(["closed", ""]);
	    }
	  }
	};
	function strToPosition(positionStr) {
	  const [x, y] = positionStr.split(",").map(Number);
	  return { x, y };
	}
	function strToDimension(dimensionStr) {
	  const [width, height] = dimensionStr.split("x").map(Number);
	  return { width, height };
	}
	var NDKStorySticker = class _NDKStorySticker {
	  static Text = "text" /* Text */;
	  static Pubkey = "pubkey" /* Pubkey */;
	  static Event = "event" /* Event */;
	  static Prompt = "prompt" /* Prompt */;
	  static Countdown = "countdown" /* Countdown */;
	  type;
	  value;
	  position;
	  dimension;
	  properties;
	  constructor(arg) {
	    if (Array.isArray(arg)) {
	      const tag = arg;
	      if (tag[0] !== "sticker" || tag.length < 5) {
	        throw new Error("Invalid sticker tag");
	      }
	      this.type = tag[1];
	      this.value = tag[2];
	      this.position = strToPosition(tag[3]);
	      this.dimension = strToDimension(tag[4]);
	      const props = {};
	      for (let i = 5; i < tag.length; i++) {
	        const [key, ...rest] = tag[i].split(" ");
	        props[key] = rest.join(" ");
	      }
	      if (Object.keys(props).length > 0) {
	        this.properties = props;
	      }
	    } else {
	      this.type = arg;
	      this.value = void 0;
	      this.position = { x: 0, y: 0 };
	      this.dimension = { width: 0, height: 0 };
	    }
	  }
	  static fromTag(tag) {
	    try {
	      return new _NDKStorySticker(tag);
	    } catch {
	      return null;
	    }
	  }
	  get style() {
	    return this.properties?.style;
	  }
	  set style(style) {
	    if (style) this.properties = { ...this.properties, style };
	    else delete this.properties?.style;
	  }
	  get rotation() {
	    return this.properties?.rot ? Number.parseFloat(this.properties.rot) : void 0;
	  }
	  set rotation(rotation) {
	    if (rotation !== void 0) {
	      this.properties = { ...this.properties, rot: rotation.toString() };
	    } else {
	      delete this.properties?.rot;
	    }
	  }
	  /**
	   * Checks if the sticker is valid.
	   *
	   * @returns {boolean} - True if the sticker is valid, false otherwise.
	   */
	  get isValid() {
	    return this.hasValidDimensions() && this.hasValidPosition();
	  }
	  hasValidDimensions = () => {
	    return typeof this.dimension.width === "number" && typeof this.dimension.height === "number" && !Number.isNaN(this.dimension.width) && !Number.isNaN(this.dimension.height);
	  };
	  hasValidPosition = () => {
	    return typeof this.position.x === "number" && typeof this.position.y === "number" && !Number.isNaN(this.position.x) && !Number.isNaN(this.position.y);
	  };
	  toTag() {
	    if (!this.isValid) {
	      const errors = [
	        !this.hasValidDimensions() ? "dimensions is invalid" : void 0,
	        !this.hasValidPosition() ? "position is invalid" : void 0
	      ].filter(Boolean);
	      throw new Error(`Invalid sticker: ${errors.join(", ")}`);
	    }
	    let value;
	    switch (this.type) {
	      case "event" /* Event */:
	        value = this.value.tagId();
	        break;
	      case "pubkey" /* Pubkey */:
	        value = this.value.pubkey;
	        break;
	      default:
	        value = this.value;
	    }
	    const tag = ["sticker", this.type, value, coordinates(this.position), dimension(this.dimension)];
	    if (this.properties) {
	      for (const [key, propValue] of Object.entries(this.properties)) {
	        tag.push(`${key} ${propValue}`);
	      }
	    }
	    return tag;
	  }
	};
	var NDKStory = class _NDKStory extends NDKEvent {
	  static kind = 23 /* Story */;
	  static kinds = [23 /* Story */];
	  _imeta;
	  _dimensions;
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 23 /* Story */;
	    if (rawEvent) {
	      for (const tag of rawEvent.tags) {
	        switch (tag[0]) {
	          case "imeta":
	            this._imeta = mapImetaTag(tag);
	            break;
	          case "dim":
	            this.dimensions = strToDimension(tag[1]);
	            break;
	        }
	      }
	    }
	  }
	  /**
	   * Creates a NDKStory from an existing NDKEvent.
	   *
	   * @param event NDKEvent to create the NDKStory from.
	   * @returns NDKStory
	   */
	  static from(event) {
	    return new _NDKStory(event.ndk, event);
	  }
	  /**
	   * Checks if the story is valid (has exactly one imeta tag).
	   */
	  get isValid() {
	    return !!this.imeta;
	  }
	  /**
	   * Gets the first imeta tag (there should only be one).
	   */
	  get imeta() {
	    return this._imeta;
	  }
	  /**
	   * Sets a single imeta tag, replacing any existing ones.
	   */
	  set imeta(tag) {
	    this._imeta = tag;
	    this.tags = this.tags.filter((t) => t[0] !== "imeta");
	    if (tag) {
	      this.tags.push(imetaTagToTag(tag));
	    }
	  }
	  /**
	   * Getter for the story dimensions.
	   *
	   * @returns {NDKStoryDimension | undefined} - The story dimensions if available, otherwise undefined.
	   */
	  get dimensions() {
	    const dimTag = this.tagValue("dim");
	    if (!dimTag) return void 0;
	    return strToDimension(dimTag);
	  }
	  /**
	   * Setter for the story dimensions.
	   *
	   * @param {NDKStoryDimension | undefined} dimensions - The dimensions to set for the story.
	   */
	  set dimensions(dimensions) {
	    this.removeTag("dim");
	    if (dimensions) {
	      this.tags.push(["dim", `${dimensions.width}x${dimensions.height}`]);
	    }
	  }
	  /**
	   * Getter for the story duration.
	   *
	   * @returns {number | undefined} - The story duration in seconds if available, otherwise undefined.
	   */
	  get duration() {
	    const durTag = this.tagValue("dur");
	    if (!durTag) return void 0;
	    return Number.parseInt(durTag);
	  }
	  /**
	   * Setter for the story duration.
	   *
	   * @param {number | undefined} duration - The duration in seconds to set for the story.
	   */
	  set duration(duration) {
	    this.removeTag("dur");
	    if (duration !== void 0) {
	      this.tags.push(["dur", duration.toString()]);
	    }
	  }
	  /**
	   * Gets all stickers from the story.
	   *
	   * @returns {NDKStorySticker[]} - Array of stickers in the story.
	   */
	  get stickers() {
	    const stickers = [];
	    for (const tag of this.tags) {
	      if (tag[0] !== "sticker" || tag.length < 5) continue;
	      const sticker = NDKStorySticker.fromTag(tag);
	      if (sticker) stickers.push(sticker);
	    }
	    return stickers;
	  }
	  /**
	   * Adds a sticker to the story.
	   *
	   * @param {NDKStorySticker|StorySticker} sticker - The sticker to add.
	   */
	  addSticker(sticker) {
	    let stickerToAdd;
	    if (sticker instanceof NDKStorySticker) {
	      stickerToAdd = sticker;
	    } else {
	      const tag = [
	        "sticker",
	        sticker.type,
	        typeof sticker.value === "string" ? sticker.value : "",
	        coordinates(sticker.position),
	        dimension(sticker.dimension)
	      ];
	      if (sticker.properties) {
	        for (const [key, value] of Object.entries(sticker.properties)) {
	          tag.push(`${key} ${value}`);
	        }
	      }
	      stickerToAdd = new NDKStorySticker(tag);
	      stickerToAdd.value = sticker.value;
	    }
	    if (stickerToAdd.type === "pubkey" /* Pubkey */) {
	      this.tag(stickerToAdd.value);
	    } else if (stickerToAdd.type === "event" /* Event */) {
	      this.tag(stickerToAdd.value);
	    }
	    this.tags.push(stickerToAdd.toTag());
	  }
	  /**
	   * Removes a sticker from the story.
	   *
	   * @param {number} index - The index of the sticker to remove.
	   */
	  removeSticker(index) {
	    const stickers = this.stickers;
	    if (index < 0 || index >= stickers.length) return;
	    let stickerCount = 0;
	    for (let i = 0; i < this.tags.length; i++) {
	      if (this.tags[i][0] === "sticker") {
	        if (stickerCount === index) {
	          this.tags.splice(i, 1);
	          break;
	        }
	        stickerCount++;
	      }
	    }
	  }
	};
	var coordinates = (position) => `${position.x},${position.y}`;
	var dimension = (dimension2) => `${dimension2.width}x${dimension2.height}`;
	var NDKSubscriptionReceipt = class _NDKSubscriptionReceipt extends NDKEvent {
	  debug;
	  static kinds = [7003 /* SubscriptionReceipt */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 7003 /* SubscriptionReceipt */;
	    this.debug = ndk?.debug.extend("subscription-start") ?? createDebug5("ndk:subscription-start");
	  }
	  static from(event) {
	    return new _NDKSubscriptionReceipt(event.ndk, event.rawEvent());
	  }
	  /**
	   * This is the person being subscribed to
	   */
	  get recipient() {
	    const pTag = this.getMatchingTags("p")?.[0];
	    if (!pTag) return void 0;
	    const user = new NDKUser({ pubkey: pTag[1] });
	    return user;
	  }
	  set recipient(user) {
	    this.removeTag("p");
	    if (!user) return;
	    this.tags.push(["p", user.pubkey]);
	  }
	  /**
	   * This is the person subscribing
	   */
	  get subscriber() {
	    const PTag = this.getMatchingTags("P")?.[0];
	    if (!PTag) return void 0;
	    const user = new NDKUser({ pubkey: PTag[1] });
	    return user;
	  }
	  set subscriber(user) {
	    this.removeTag("P");
	    if (!user) return;
	    this.tags.push(["P", user.pubkey]);
	  }
	  set subscriptionStart(event) {
	    this.debug(`before setting subscription start: ${this.rawEvent}`);
	    this.removeTag("e");
	    this.tag(event, "subscription", true);
	    this.debug(`after setting subscription start: ${this.rawEvent}`);
	  }
	  get tierName() {
	    const tag = this.getMatchingTags("tier")?.[0];
	    return tag?.[1];
	  }
	  get isValid() {
	    const period = this.validPeriod;
	    if (!period) {
	      return false;
	    }
	    if (period.start > period.end) {
	      return false;
	    }
	    const pTags = this.getMatchingTags("p");
	    const PTags = this.getMatchingTags("P");
	    if (pTags.length !== 1 || PTags.length !== 1) {
	      return false;
	    }
	    return true;
	  }
	  get validPeriod() {
	    const tag = this.getMatchingTags("valid")?.[0];
	    if (!tag) return void 0;
	    try {
	      return {
	        start: new Date(Number.parseInt(tag[1]) * 1e3),
	        end: new Date(Number.parseInt(tag[2]) * 1e3)
	      };
	    } catch {
	      return void 0;
	    }
	  }
	  set validPeriod(period) {
	    this.removeTag("valid");
	    if (!period) return;
	    this.tags.push([
	      "valid",
	      Math.floor(period.start.getTime() / 1e3).toString(),
	      Math.floor(period.end.getTime() / 1e3).toString()
	    ]);
	  }
	  get startPeriod() {
	    return this.validPeriod?.start;
	  }
	  get endPeriod() {
	    return this.validPeriod?.end;
	  }
	  /**
	   * Whether the subscription is currently active
	   */
	  isActive(time) {
	    time ??= /* @__PURE__ */ new Date();
	    const period = this.validPeriod;
	    if (!period) return false;
	    if (time < period.start) return false;
	    if (time > period.end) return false;
	    return true;
	  }
	};

	// src/events/kinds/subscriptions/amount.ts
	var possibleIntervalFrequencies = [
	  "daily",
	  "weekly",
	  "monthly",
	  "quarterly",
	  "yearly"
	];
	function newAmount(amount, currency, term) {
	  return ["amount", amount.toString(), currency, term];
	}
	function parseTagToSubscriptionAmount(tag) {
	  const amount = Number.parseInt(tag[1]);
	  if (Number.isNaN(amount) || amount === void 0 || amount === null || amount <= 0) return void 0;
	  const currency = tag[2];
	  if (currency === void 0 || currency === "") return void 0;
	  const term = tag[3];
	  if (term === void 0) return void 0;
	  if (!possibleIntervalFrequencies.includes(term)) return void 0;
	  return {
	    amount,
	    currency,
	    term
	  };
	}

	// src/events/kinds/subscriptions/tier.ts
	var NDKSubscriptionTier = class _NDKSubscriptionTier extends NDKArticle {
	  static kind = 37001 /* SubscriptionTier */;
	  static kinds = [37001 /* SubscriptionTier */];
	  constructor(ndk, rawEvent) {
	    const k = rawEvent?.kind ?? 37001 /* SubscriptionTier */;
	    super(ndk, rawEvent);
	    this.kind = k;
	  }
	  /**
	   * Creates a new NDKSubscriptionTier from an event
	   * @param event
	   * @returns NDKSubscriptionTier
	   */
	  static from(event) {
	    return new _NDKSubscriptionTier(event.ndk, event);
	  }
	  /**
	   * Returns perks for this tier
	   */
	  get perks() {
	    return this.getMatchingTags("perk").map((tag) => tag[1]).filter((perk) => perk !== void 0);
	  }
	  /**
	   * Adds a perk to this tier
	   */
	  addPerk(perk) {
	    this.tags.push(["perk", perk]);
	  }
	  /**
	   * Returns the amount for this tier
	   */
	  get amounts() {
	    return this.getMatchingTags("amount").map((tag) => parseTagToSubscriptionAmount(tag)).filter((a) => a !== void 0);
	  }
	  /**
	   * Adds an amount to this tier
	   * @param amount Amount in the smallest unit of the currency (e.g. cents, msats)
	   * @param currency Currency code. Use msat for millisatoshis
	   * @param term One of daily, weekly, monthly, quarterly, yearly
	   */
	  addAmount(amount, currency, term) {
	    this.tags.push(newAmount(amount, currency, term));
	  }
	  /**
	   * Sets a relay where content related to this tier can be found
	   * @param relayUrl URL of the relay
	   */
	  set relayUrl(relayUrl) {
	    this.tags.push(["r", relayUrl]);
	  }
	  /**
	   * Returns the relay URLs for this tier
	   */
	  get relayUrls() {
	    return this.getMatchingTags("r").map((tag) => tag[1]).filter((relay) => relay !== void 0);
	  }
	  /**
	   * Gets the verifier pubkey for this tier. This is the pubkey that will generate
	   * subscription payment receipts
	   */
	  get verifierPubkey() {
	    return this.tagValue("p");
	  }
	  /**
	   * Sets the verifier pubkey for this tier.
	   */
	  set verifierPubkey(pubkey) {
	    this.removeTag("p");
	    if (pubkey) this.tags.push(["p", pubkey]);
	  }
	  /**
	   * Checks if this tier is valid
	   */
	  get isValid() {
	    return this.title !== void 0 && // Must have a title
	    this.amounts.length > 0;
	  }
	};

	// src/events/kinds/subscriptions/subscription-start.ts
	var NDKSubscriptionStart = class _NDKSubscriptionStart extends NDKEvent {
	  debug;
	  static kinds = [7001 /* Subscribe */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 7001 /* Subscribe */;
	    this.debug = ndk?.debug.extend("subscription-start") ?? createDebug5("ndk:subscription-start");
	  }
	  static from(event) {
	    return new _NDKSubscriptionStart(event.ndk, event.rawEvent());
	  }
	  /**
	   * Recipient of the subscription. I.e. The author of this event subscribes to this user.
	   */
	  get recipient() {
	    const pTag = this.getMatchingTags("p")?.[0];
	    if (!pTag) return void 0;
	    const user = new NDKUser({ pubkey: pTag[1] });
	    return user;
	  }
	  set recipient(user) {
	    this.removeTag("p");
	    if (!user) return;
	    this.tags.push(["p", user.pubkey]);
	  }
	  /**
	   * The amount of the subscription.
	   */
	  get amount() {
	    const amountTag = this.getMatchingTags("amount")?.[0];
	    if (!amountTag) return void 0;
	    return parseTagToSubscriptionAmount(amountTag);
	  }
	  set amount(amount) {
	    this.removeTag("amount");
	    if (!amount) return;
	    this.tags.push(newAmount(amount.amount, amount.currency, amount.term));
	  }
	  /**
	   * The event id or NIP-33 tag id of the tier that the user is subscribing to.
	   */
	  get tierId() {
	    const eTag = this.getMatchingTags("e")?.[0];
	    const aTag = this.getMatchingTags("a")?.[0];
	    if (!eTag || !aTag) return void 0;
	    return eTag[1] ?? aTag[1];
	  }
	  set tier(tier) {
	    this.removeTag("e");
	    this.removeTag("a");
	    this.removeTag("event");
	    if (!tier) return;
	    this.tag(tier);
	    this.removeTag("p");
	    this.tags.push(["p", tier.pubkey]);
	    this.tags.push(["event", JSON.stringify(tier.rawEvent())]);
	  }
	  /**
	   * Fetches the tier that the user is subscribing to.
	   */
	  async fetchTier() {
	    const eventTag = this.tagValue("event");
	    if (eventTag) {
	      try {
	        const parsedEvent = JSON.parse(eventTag);
	        return new NDKSubscriptionTier(this.ndk, parsedEvent);
	      } catch {
	        this.debug("Failed to parse event tag");
	      }
	    }
	    const tierId = this.tierId;
	    if (!tierId) return void 0;
	    const e = await this.ndk?.fetchEvent(tierId);
	    if (!e) return void 0;
	    return NDKSubscriptionTier.from(e);
	  }
	  get isValid() {
	    if (this.getMatchingTags("amount").length !== 1) {
	      this.debug("Invalid # of amount tag");
	      return false;
	    }
	    if (!this.amount) {
	      this.debug("Invalid amount tag");
	      return false;
	    }
	    if (this.getMatchingTags("p").length !== 1) {
	      this.debug("Invalid # of p tag");
	      return false;
	    }
	    if (!this.recipient) {
	      this.debug("Invalid p tag");
	      return false;
	    }
	    return true;
	  }
	};

	// src/events/kinds/task.ts
	var NDKTask = class _NDKTask extends NDKEvent {
	  static kind = 1934 /* Task */;
	  static kinds = [1934 /* Task */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind = 1934 /* Task */;
	  }
	  static from(event) {
	    return new _NDKTask(event.ndk, event.rawEvent());
	  }
	  set title(value) {
	    this.removeTag("title");
	    if (value) this.tags.push(["title", value]);
	  }
	  get title() {
	    return this.tagValue("title");
	  }
	  set project(project) {
	    this.removeTag("a");
	    this.tags.push(project.tagReference());
	  }
	  get projectSlug() {
	    const tag = this.getMatchingTags("a")[0];
	    return tag ? tag[1].split(/:/)?.[2] : void 0;
	  }
	};

	// src/events/kinds/thread.ts
	var NDKThread = class _NDKThread extends NDKEvent {
	  static kind = 11 /* Thread */;
	  static kinds = [11 /* Thread */];
	  constructor(ndk, rawEvent) {
	    super(ndk, rawEvent);
	    this.kind ??= 11 /* Thread */;
	  }
	  /**
	   * Creates an NDKThread from an existing NDKEvent.
	   *
	   * @param event NDKEvent to create the NDKThread from.
	   * @returns NDKThread
	   */
	  static from(event) {
	    return new _NDKThread(event.ndk, event);
	  }
	  /**
	   * Gets the title of the thread.
	   */
	  get title() {
	    return this.tagValue("title");
	  }
	  /**
	   * Sets the title of the thread.
	   */
	  set title(title) {
	    this.removeTag("title");
	    if (title) {
	      this.tags.push(["title", title]);
	    }
	  }
	};

	// src/events/kinds/video.ts
	var NDKVideo = class _NDKVideo extends NDKEvent {
	  static kind = 21 /* Video */;
	  static kinds = [34235 /* HorizontalVideo */, 34236 /* VerticalVideo */, 22 /* ShortVideo */, 21 /* Video */];
	  _imetas;
	  /**
	   * Creates a NDKArticle from an existing NDKEvent.
	   *
	   * @param event NDKEvent to create the NDKArticle from.
	   * @returns NDKArticle
	   */
	  static from(event) {
	    return new _NDKVideo(event.ndk, event.rawEvent());
	  }
	  /**
	   * Getter for the article title.
	   *
	   * @returns {string | undefined} - The article title if available, otherwise undefined.
	   */
	  get title() {
	    return this.tagValue("title");
	  }
	  /**
	   * Setter for the article title.
	   *
	   * @param {string | undefined} title - The title to set for the article.
	   */
	  set title(title) {
	    this.removeTag("title");
	    if (title) this.tags.push(["title", title]);
	  }
	  /**
	   * Getter for the article thumbnail.
	   *
	   * @returns {string | undefined} - The article thumbnail if available, otherwise undefined.
	   */
	  get thumbnail() {
	    let thumbnail;
	    if (this.imetas && this.imetas.length > 0) {
	      thumbnail = this.imetas[0].image?.[0];
	    }
	    return thumbnail ?? this.tagValue("thumb");
	  }
	  get imetas() {
	    if (this._imetas) return this._imetas;
	    this._imetas = this.tags.filter((tag) => tag[0] === "imeta").map(mapImetaTag);
	    return this._imetas;
	  }
	  set imetas(tags) {
	    this._imetas = tags;
	    this.tags = this.tags.filter((tag) => tag[0] !== "imeta");
	    this.tags.push(...tags.map(imetaTagToTag));
	  }
	  get url() {
	    if (this.imetas && this.imetas.length > 0) {
	      return this.imetas[0].url;
	    }
	    return this.tagValue("url");
	  }
	  /**
	   * Getter for the article's publication timestamp.
	   *
	   * @returns {number | undefined} - The Unix timestamp of when the article was published or undefined.
	   */
	  get published_at() {
	    const tag = this.tagValue("published_at");
	    if (tag) {
	      return Number.parseInt(tag);
	    }
	    return void 0;
	  }
	  /**
	   * Generates content tags for the article.
	   *
	   * This method first checks and sets the publication date if not available,
	   * and then generates content tags based on the base NDKEvent class.
	   *
	   * @returns {ContentTag} - The generated content tags.
	   */
	  async generateTags() {
	    super.generateTags();
	    if (!this.kind) {
	      if (this.imetas?.[0]?.dim) {
	        const [width, height] = this.imetas[0].dim.split("x");
	        const isPortrait = width && height && Number.parseInt(width) < Number.parseInt(height);
	        const isShort = this.duration && this.duration < 120;
	        if (isShort && isPortrait) this.kind = 22 /* ShortVideo */;
	        else this.kind = 21 /* Video */;
	      }
	    }
	    return super.generateTags();
	  }
	  get duration() {
	    const tag = this.tagValue("duration");
	    if (tag) {
	      return Number.parseInt(tag);
	    }
	    return void 0;
	  }
	  /**
	   * Setter for the video's duration
	   *
	   * @param {number | undefined} duration - The duration to set for the video (in seconds)
	   */
	  set duration(dur) {
	    this.removeTag("duration");
	    if (dur !== void 0) {
	      this.tags.push(["duration", Math.floor(dur).toString()]);
	    }
	  }
	};

	// src/events/kinds/wiki.ts
	var NDKWiki = class _NDKWiki extends NDKArticle {
	  static kind = 30818 /* Wiki */;
	  static kinds = [30818 /* Wiki */];
	  static from(event) {
	    return new _NDKWiki(event.ndk, event.rawEvent());
	  }
	  get isDefered() {
	    return this.hasTag("a", "defer");
	  }
	  get deferedId() {
	    return this.tagValue("a", "defer");
	  }
	  /**
	   * Defers the author's wiki event to another wiki event.
	   *
	   * Wiki-events can tag other wiki-events with a `defer` marker to indicate that it considers someone else's entry as a "better" version of itself. If using a `defer` marker both `a` and `e` tags SHOULD be used.
	   *
	   * @example
	   * myWiki.defer = betterWikiEntryOnTheSameTopic;
	   * myWiki.publishReplaceable()
	   */
	  set defer(deferedTo) {
	    this.removeTag("a", "defer");
	    this.tag(deferedTo, "defer");
	  }
	};
	var NDKWikiMergeRequest = class _NDKWikiMergeRequest extends NDKEvent {
	  static kinds = [818 /* WikiMergeRequest */];
	  static from(event) {
	    return new _NDKWikiMergeRequest(event.ndk, event.rawEvent());
	  }
	  /**
	   * The target ID (<kind:pubkey:d-tag>) of the wiki event to merge into.
	   */
	  get targetId() {
	    return this.tagValue("a");
	  }
	  /**
	   * Sets the target ID (<kind:pubkey:d-tag>) of the wiki event to merge into.
	   */
	  set target(targetEvent) {
	    this.tags = this.tags.filter((tag) => {
	      if (tag[0] === "a") return true;
	      if (tag[0] === "e" && tag[3] !== "source") return true;
	    });
	    this.tag(targetEvent);
	  }
	  /**
	   * The source ID of the wiki event to merge from.
	   */
	  get sourceId() {
	    return this.tagValue("e", "source");
	  }
	  /**
	   * Sets the event we are asking to get merged into the target.
	   */
	  set source(sourceEvent) {
	    this.removeTag("e", "source");
	    this.tag(sourceEvent, "source", false, "e");
	  }
	};

	// src/events/wrap.ts
	var registeredEventClasses = /* @__PURE__ */ new Set();
	function wrapEvent(event) {
	  const eventWrappingMap = /* @__PURE__ */ new Map();
	  const builtInClasses = [
	    NDKImage,
	    NDKVideo,
	    NDKCashuMintList,
	    NDKArticle,
	    NDKHighlight,
	    NDKDraft,
	    NDKWiki,
	    NDKWikiMergeRequest,
	    NDKNutzap,
	    NDKProject,
	    NDKTask,
	    NDKProjectTemplate,
	    NDKSimpleGroupMemberList,
	    NDKSimpleGroupMetadata,
	    NDKSubscriptionTier,
	    NDKSubscriptionStart,
	    NDKSubscriptionReceipt,
	    NDKList,
	    NDKRelayList,
	    NDKStory,
	    NDKBlossomList,
	    NDKFollowPack,
	    NDKThread,
	    NDKRepost,
	    NDKClassified,
	    NDKAppHandlerEvent,
	    NDKDVMJobFeedback,
	    NDKCashuMintAnnouncement,
	    NDKFedimintMint,
	    NDKMintRecommendation
	  ];
	  const allClasses = [...builtInClasses, ...registeredEventClasses];
	  for (const klass2 of allClasses) {
	    for (const kind of klass2.kinds) {
	      eventWrappingMap.set(kind, klass2);
	    }
	  }
	  const klass = eventWrappingMap.get(event.kind);
	  if (klass) return klass.from(event);
	  return event;
	}

	// src/ai-guardrails/event/signing.ts
	function checkMissingKind(event, error) {
	  if (event.kind === void 0 || event.kind === null) {
	    error(
	      "event-missing-kind",
	      `Cannot sign event without 'kind'.

\u{1F4E6} Event data:
   \u2022 content: ${event.content ? `"${event.content.substring(0, 50)}${event.content.length > 50 ? "..." : ""}"` : "(empty)"}
   \u2022 tags: ${event.tags.length} tag${event.tags.length !== 1 ? "s" : ""}
   \u2022 kind: ${event.kind} \u274C

Set event.kind before signing.`,
	      "Example: event.kind = 1; // for text note",
	      false
	      // Fatal error - cannot be disabled
	    );
	  }
	}
	function checkContentIsObject(event, error) {
	  if (typeof event.content === "object") {
	    const contentPreview = JSON.stringify(event.content, null, 2).substring(0, 200);
	    error(
	      "event-content-is-object",
	      `Event content is an object. Content must be a string.

\u{1F4E6} Your content (${typeof event.content}):
${contentPreview}${JSON.stringify(event.content).length > 200 ? "..." : ""}

\u274C event.content = { ... }  // WRONG
\u2705 event.content = JSON.stringify({ ... })  // CORRECT`,
	      "Use JSON.stringify() for structured data: event.content = JSON.stringify(data)",
	      false
	      // Fatal error - cannot be disabled
	    );
	  }
	}
	function checkCreatedAtMilliseconds(event, error) {
	  if (event.created_at && event.created_at > 1e10) {
	    const correctValue = Math.floor(event.created_at / 1e3);
	    const dateString = new Date(event.created_at).toISOString();
	    error(
	      "event-created-at-milliseconds",
	      `Event created_at is in milliseconds, not seconds.

\u{1F4E6} Your value:
   \u2022 created_at: ${event.created_at} \u274C
   \u2022 Interpreted as: ${dateString}
   \u2022 Should be: ${correctValue} \u2705

Nostr timestamps MUST be in seconds since Unix epoch.`,
	      "Use Math.floor(Date.now() / 1000) instead of Date.now()",
	      false
	      // Fatal error - cannot be disabled
	    );
	  }
	}
	function checkInvalidPTags(event, error) {
	  const pTags = event.getMatchingTags("p");
	  pTags.forEach((tag, idx) => {
	    if (tag[1] && !/^[0-9a-f]{64}$/i.test(tag[1])) {
	      const tagPreview = JSON.stringify(tag);
	      error(
	        "tag-invalid-p-tag",
	        `p-tag[${idx}] has invalid pubkey.

\u{1F4E6} Your tag:
   ${tagPreview}

\u274C Invalid value: "${tag[1]}"
   \u2022 Length: ${tag[1].length} (expected 64)
   \u2022 Format: ${tag[1].startsWith("npub") ? "bech32 (npub)" : "unknown"}

p-tags MUST contain 64-character hex pubkeys.`,
	        tag[1].startsWith("npub") ? "Use ndkUser.pubkey instead of npub:\n   \u2705 event.tags.push(['p', ndkUser.pubkey])\n   \u274C event.tags.push(['p', 'npub1...'])" : "p-tags must contain valid hex pubkeys (64 characters, 0-9a-f)",
	        false
	        // Fatal error - cannot be disabled
	      );
	    }
	  });
	}
	function checkInvalidETags(event, error) {
	  const eTags = event.getMatchingTags("e");
	  eTags.forEach((tag, idx) => {
	    if (tag[1] && !/^[0-9a-f]{64}$/i.test(tag[1])) {
	      const tagPreview = JSON.stringify(tag);
	      const isBech32 = tag[1].startsWith("note") || tag[1].startsWith("nevent");
	      error(
	        "tag-invalid-e-tag",
	        `e-tag[${idx}] has invalid event ID.

\u{1F4E6} Your tag:
   ${tagPreview}

\u274C Invalid value: "${tag[1]}"
   \u2022 Length: ${tag[1].length} (expected 64)
   \u2022 Format: ${isBech32 ? "bech32 (note/nevent)" : "unknown"}

e-tags MUST contain 64-character hex event IDs.`,
	        isBech32 ? "Use event.id instead of bech32:\n   \u2705 event.tags.push(['e', referencedEvent.id])\n   \u274C event.tags.push(['e', 'note1...'])" : "e-tags must contain valid hex event IDs (64 characters, 0-9a-f)",
	        false
	        // Fatal error - cannot be disabled
	      );
	    }
	  });
	}
	function checkManualReplyMarkers(event, warn, replyEvents) {
	  if (event.kind !== 1) return;
	  if (replyEvents.has(event)) return;
	  const eTagsWithMarkers = event.tags.filter((tag) => tag[0] === "e" && (tag[3] === "reply" || tag[3] === "root"));
	  if (eTagsWithMarkers.length > 0) {
	    const tagList = eTagsWithMarkers.map((tag, idx) => `   ${idx + 1}. ${JSON.stringify(tag)}`).join("\n");
	    warn(
	      "event-manual-reply-markers",
	      `Event has ${eTagsWithMarkers.length} e-tag(s) with manual reply/root markers.

\u{1F4E6} Your tags with markers:
${tagList}

\u26A0\uFE0F  Manual reply markers detected! This will cause incorrect threading.`,
	      `Reply events MUST be created using .reply():

   \u2705 CORRECT:
   const replyEvent = originalEvent.reply();
   replyEvent.content = 'good point!';
   await replyEvent.publish();

   \u274C WRONG:
   event.tags.push(['e', eventId, '', 'reply']);

NDK handles all reply threading automatically - never add reply/root markers manually.`
	    );
	  }
	}
	function checkHashtagsWithPrefix(event, error) {
	  const tTags = event.getMatchingTags("t");
	  tTags.forEach((tag, idx) => {
	    if (tag[1] && tag[1].startsWith("#")) {
	      const tagPreview = JSON.stringify(tag);
	      error(
	        "tag-hashtag-with-prefix",
	        `t-tag[${idx}] contains hashtag with # prefix.

\u{1F4E6} Your tag:
   ${tagPreview}

\u274C Invalid value: "${tag[1]}"

Hashtag tags should NOT include the # symbol.`,
	        `Remove the # prefix from hashtag tags:
   \u2705 event.tags.push(['t', 'nostr'])
   \u274C event.tags.push(['t', '#nostr'])`,
	        false
	        // Fatal error - cannot be disabled
	      );
	    }
	  });
	}
	function checkReplaceableWithOldTimestamp(event, warn) {
	  if (event.kind === void 0 || event.kind === null || !event.created_at) return;
	  if (!event.isReplaceable()) return;
	  const nowSeconds = Math.floor(Date.now() / 1e3);
	  const ageSeconds = nowSeconds - event.created_at;
	  const TEN_SECONDS = 10;
	  if (ageSeconds > TEN_SECONDS) {
	    const ageMinutes = Math.floor(ageSeconds / 60);
	    const ageDescription = ageMinutes > 0 ? `${ageMinutes} minute${ageMinutes !== 1 ? "s" : ""}` : `${ageSeconds} seconds`;
	    warn(
	      "event-replaceable-old-timestamp",
	      `Publishing a replaceable event with an old created_at timestamp.

\u{1F4E6} Event details:
   \u2022 kind: ${event.kind} (replaceable)
   \u2022 created_at: ${event.created_at}
   \u2022 age: ${ageDescription} old
   \u2022 current time: ${nowSeconds}

\u26A0\uFE0F  This is wrong and will be rejected by relays.`,
	      `For replaceable events, use publishReplaceable():

   \u2705 CORRECT:
   await event.publishReplaceable();
   // Automatically updates created_at to now

   \u274C WRONG:
   await event.publish();
   // Uses old created_at`
	    );
	  }
	}
	function signing(event, error, warn, replyEvents) {
	  checkMissingKind(event, error);
	  checkContentIsObject(event, error);
	  checkCreatedAtMilliseconds(event, error);
	  checkInvalidPTags(event, error);
	  checkInvalidETags(event, error);
	  checkHashtagsWithPrefix(event, error);
	  checkManualReplyMarkers(event, warn, replyEvents);
	}
	function publishing(event, warn) {
	  checkReplaceableWithOldTimestamp(event, warn);
	}

	// src/ai-guardrails/ndk/fetch-events.ts
	function isNip33Pattern(filters) {
	  const filterArray = Array.isArray(filters) ? filters : [filters];
	  if (filterArray.length !== 1) return false;
	  const filter = filterArray[0];
	  return filter.kinds && Array.isArray(filter.kinds) && filter.kinds.length === 1 && filter.authors && Array.isArray(filter.authors) && filter.authors.length === 1 && filter["#d"] && Array.isArray(filter["#d"]) && filter["#d"].length === 1;
	}
	function isReplaceableEventFilter(filters) {
	  const filterArray = Array.isArray(filters) ? filters : [filters];
	  if (filterArray.length === 0) {
	    return false;
	  }
	  return filterArray.every((filter) => {
	    if (!filter.kinds || !Array.isArray(filter.kinds) || filter.kinds.length === 0) {
	      return false;
	    }
	    if (!filter.authors || !Array.isArray(filter.authors) || filter.authors.length === 0) {
	      return false;
	    }
	    const allKindsReplaceable = filter.kinds.every((kind) => {
	      return kind === 0 || kind === 3 || kind >= 1e4 && kind <= 19999;
	    });
	    return allKindsReplaceable;
	  });
	}
	function formatFilter(filter) {
	  const formatted = JSON.stringify(filter, null, 2);
	  return formatted.split("\n").map((line, idx) => idx === 0 ? line : `   ${line}`).join("\n");
	}
	function fetchingEvents(filters, opts, warn, shouldWarnRatio, incrementCount) {
	  incrementCount();
	  if (opts?.cacheUsage === "ONLY_CACHE") {
	    return;
	  }
	  const filterArray = Array.isArray(filters) ? filters : [filters];
	  const formattedFilters = filterArray.map(formatFilter).join("\n\n   ---\n\n   ");
	  if (isNip33Pattern(filters)) {
	    filterArray[0];
	    warn(
	      "fetch-events-usage",
	      "For fetching a NIP-33 addressable event, use fetchEvent() with the naddr directly.\n\n\u{1F4E6} Your filter:\n   " + formattedFilters + `

  \u274C BAD:  const decoded = nip19.decode(naddr);
           const events = await ndk.fetchEvents({
             kinds: [decoded.data.kind],
             authors: [decoded.data.pubkey],
             "#d": [decoded.data.identifier]
           });
           const event = Array.from(events)[0];

  \u2705 GOOD: const event = await ndk.fetchEvent(naddr);
  \u2705 GOOD: const event = await ndk.fetchEvent('naddr1...');

fetchEvent() handles naddr decoding automatically and returns the event directly.`
	    );
	  } else if (isReplaceableEventFilter(filters)) {
	    return;
	  } else {
	    if (!shouldWarnRatio()) {
	      return;
	    }
	    let filterAnalysis = "";
	    const hasLimit = filterArray.some((f) => f.limit !== void 0);
	    const totalKinds = new Set(filterArray.flatMap((f) => f.kinds || [])).size;
	    const totalAuthors = new Set(filterArray.flatMap((f) => f.authors || [])).size;
	    if (hasLimit) {
	      const maxLimit = Math.max(...filterArray.map((f) => f.limit || 0));
	      filterAnalysis += `
   \u2022 Limit: ${maxLimit} event${maxLimit !== 1 ? "s" : ""}`;
	    }
	    if (totalKinds > 0) {
	      filterAnalysis += `
   \u2022 Kinds: ${totalKinds} type${totalKinds !== 1 ? "s" : ""}`;
	    }
	    if (totalAuthors > 0) {
	      filterAnalysis += `
   \u2022 Authors: ${totalAuthors} author${totalAuthors !== 1 ? "s" : ""}`;
	    }
	    warn(
	      "fetch-events-usage",
	      "fetchEvents() is a BLOCKING operation that waits for EOSE.\nIn most cases, you should use subscribe() instead.\n\n\u{1F4E6} Your filter" + (filterArray.length > 1 ? "s" : "") + ":\n   " + formattedFilters + (filterAnalysis ? "\n\n\u{1F4CA} Filter analysis:" + filterAnalysis : "") + "\n\n  \u274C BAD:  const events = await ndk.fetchEvents(filter);\n  \u2705 GOOD: ndk.subscribe(filter, { onEvent: (e) => ... });\n\nOnly use fetchEvents() when you MUST block until data arrives.",
	      "For one-time queries, use fetchEvent() instead of fetchEvents() when expecting a single result."
	    );
	  }
	}

	// src/ai-guardrails/types.ts
	var GuardrailCheckId = {
	  // NDK lifecycle
	  NDK_NO_CACHE: "ndk-no-cache",
	  // Filter-related
	  FILTER_BECH32_IN_ARRAY: "filter-bech32-in-array",
	  FILTER_INVALID_HEX: "filter-invalid-hex",
	  FILTER_ONLY_LIMIT: "filter-only-limit",
	  FILTER_EMPTY: "filter-empty",
	  FILTER_SINCE_AFTER_UNTIL: "filter-since-after-until",
	  FILTER_INVALID_A_TAG: "filter-invalid-a-tag",
	  FILTER_HASHTAG_WITH_PREFIX: "filter-hashtag-with-prefix"};

	// src/ai-guardrails/ndk.ts
	function checkCachePresence(ndk, shouldCheck) {
	  if (!shouldCheck(GuardrailCheckId.NDK_NO_CACHE)) return;
	  setTimeout(() => {
	    if (!ndk.cacheAdapter) {
	      const isBrowser = typeof window !== "undefined";
	      const suggestion = isBrowser ? "Consider using @nostr-dev-kit/ndk-cache-dexie or @nostr-dev-kit/ndk-cache-sqlite-wasm" : "Consider using @nostr-dev-kit/ndk-cache-redis or @nostr-dev-kit/ndk-cache-sqlite";
	      const message = `
\u{1F916} AI_GUARDRAILS WARNING: NDK initialized without a cache adapter. Apps perform significantly better with caching.

\u{1F4A1} ${suggestion}

\u{1F507} To disable this check:
   ndk.aiGuardrails.skip('${GuardrailCheckId.NDK_NO_CACHE}')
   or set: ndk.aiGuardrails = { skip: new Set(['${GuardrailCheckId.NDK_NO_CACHE}']) }`;
	      console.warn(message);
	    }
	  }, 2500);
	}

	// src/ai-guardrails/index.ts
	var AIGuardrails = class {
	  enabled = false;
	  skipSet = /* @__PURE__ */ new Set();
	  extensions = /* @__PURE__ */ new Map();
	  _nextCallDisabled = null;
	  _replyEvents = /* @__PURE__ */ new WeakSet();
	  _fetchEventsCount = 0;
	  _subscribeCount = 0;
	  constructor(mode = false) {
	    this.setMode(mode);
	  }
	  /**
	   * Register an extension namespace with custom guardrail hooks.
	   * This allows external packages to add their own guardrails.
	   *
	   * @example
	   * ```typescript
	   * // In NDKSvelte package:
	   * ndk.aiGuardrails.register('ndkSvelte', {
	   *   constructing: (params) => {
	   *     if (!params.session) {
	   *       warn('ndksvelte-no-session', 'NDKSvelte instantiated without session parameter...');
	   *     }
	   *   }
	   * });
	   *
	   * // In NDKSvelte constructor:
	   * this.ndk.aiGuardrails?.ndkSvelte?.constructing(params);
	   * ```
	   */
	  register(namespace, hooks) {
	    if (this.extensions.has(namespace)) {
	      console.warn(`AIGuardrails: Extension '${namespace}' already registered, overwriting`);
	    }
	    const wrappedHooks = {};
	    for (const [key, fn] of Object.entries(hooks)) {
	      if (typeof fn === "function") {
	        wrappedHooks[key] = (...args) => {
	          if (!this.enabled) return;
	          fn(...args, this.shouldCheck.bind(this), this.error.bind(this), this.warn.bind(this));
	        };
	      }
	    }
	    this.extensions.set(namespace, wrappedHooks);
	    this[namespace] = wrappedHooks;
	  }
	  /**
	   * Set the guardrails mode.
	   */
	  setMode(mode) {
	    if (typeof mode === "boolean") {
	      this.enabled = mode;
	      this.skipSet.clear();
	    } else if (mode && typeof mode === "object") {
	      this.enabled = true;
	      this.skipSet = mode.skip || /* @__PURE__ */ new Set();
	    }
	  }
	  /**
	   * Check if guardrails are enabled at all.
	   */
	  isEnabled() {
	    return this.enabled;
	  }
	  /**
	   * Check if a specific guardrail check should run.
	   */
	  shouldCheck(id) {
	    if (!this.enabled) return false;
	    if (this.skipSet.has(id)) return false;
	    if (this._nextCallDisabled === "all") return false;
	    if (this._nextCallDisabled && this._nextCallDisabled.has(id)) return false;
	    return true;
	  }
	  /**
	   * Disable a specific guardrail check.
	   */
	  skip(id) {
	    this.skipSet.add(id);
	  }
	  /**
	   * Re-enable a specific guardrail check.
	   */
	  enable(id) {
	    this.skipSet.delete(id);
	  }
	  /**
	   * Get all currently skipped guardrails.
	   */
	  getSkipped() {
	    return Array.from(this.skipSet);
	  }
	  /**
	   * Capture the current _nextCallDisabled set and clear it atomically.
	   * This is used by hook methods to handle one-time guardrail disabling.
	   */
	  captureAndClearNextCallDisabled() {
	    const captured = this._nextCallDisabled;
	    this._nextCallDisabled = null;
	    return captured;
	  }
	  /**
	   * Increment fetchEvents call counter for ratio tracking.
	   */
	  incrementFetchEventsCount() {
	    this._fetchEventsCount++;
	  }
	  /**
	   * Increment subscribe call counter for ratio tracking.
	   */
	  incrementSubscribeCount() {
	    this._subscribeCount++;
	  }
	  /**
	   * Check if fetchEvents usage ratio exceeds the threshold.
	   * Returns true if more than 50% of calls are fetchEvents AND total calls > 6.
	   */
	  shouldWarnAboutFetchEventsRatio() {
	    const totalCalls = this._fetchEventsCount + this._subscribeCount;
	    if (totalCalls <= 6) {
	      return false;
	    }
	    const ratio = this._fetchEventsCount / totalCalls;
	    return ratio > 0.5;
	  }
	  /**
	   * Throw an error if the check should run.
	   * Also logs to console.error in case the throw gets swallowed.
	   * @param canDisable - If false, this is a fatal error that cannot be disabled (default: true)
	   */
	  error(id, message, hint, canDisable = true) {
	    if (!this.shouldCheck(id)) return;
	    const fullMessage = this.formatMessage(id, "ERROR", message, hint, canDisable);
	    console.error(fullMessage);
	    throw new Error(fullMessage);
	  }
	  /**
	   * Throw a warning if the check should run.
	   * Also logs to console.error in case the throw gets swallowed.
	   * Warnings can always be disabled.
	   */
	  warn(id, message, hint) {
	    if (!this.shouldCheck(id)) return;
	    const fullMessage = this.formatMessage(id, "WARNING", message, hint, true);
	    console.error(fullMessage);
	    throw new Error(fullMessage);
	  }
	  /**
	   * Format a guardrail message with helpful metadata.
	   */
	  formatMessage(id, level, message, hint, canDisable = true) {
	    let output = `
\u{1F916} AI_GUARDRAILS ${level}: ${message}`;
	    if (hint) {
	      output += `

\u{1F4A1} ${hint}`;
	    }
	    if (canDisable) {
	      output += `

\u{1F507} To disable this check:
   ndk.guardrailOff('${id}').yourMethod()  // For one call`;
	      output += `
   ndk.aiGuardrails.skip('${id}')  // Permanently`;
	      output += `
   or set: ndk.aiGuardrails = { skip: new Set(['${id}']) }`;
	    }
	    return output;
	  }
	  // ============================================================================
	  // Hook Methods - Type-safe, domain-organized insertion points
	  // ============================================================================
	  /**
	   * Called when NDK instance is created.
	   * Checks for cache presence and other initialization concerns.
	   */
	  ndkInstantiated(ndk) {
	    if (!this.enabled) return;
	    checkCachePresence(ndk, this.shouldCheck.bind(this));
	  }
	  /**
	   * NDK-related guardrails
	   */
	  ndk = {
	    /**
	     * Called when fetchEvents is about to be called
	     */
	    fetchingEvents: (filters, opts) => {
	      if (!this.enabled) return;
	      fetchingEvents(
	        filters,
	        opts,
	        this.warn.bind(this),
	        this.shouldWarnAboutFetchEventsRatio.bind(this),
	        this.incrementFetchEventsCount.bind(this)
	      );
	    }
	  };
	  /**
	   * Event-related guardrails
	   */
	  event = {
	    /**
	     * Called when an event is about to be signed
	     */
	    signing: (event) => {
	      if (!this.enabled) return;
	      signing(event, this.error.bind(this), this.warn.bind(this), this._replyEvents);
	    },
	    /**
	     * Called before an event is published
	     */
	    publishing: (event) => {
	      if (!this.enabled) return;
	      publishing(event, this.warn.bind(this));
	    },
	    /**
	     * Called when an event is received from a relay
	     */
	    received: (_event, _relay) => {
	      if (!this.enabled) return;
	    },
	    /**
	     * Called when a reply event is being created via .reply()
	     * This allows guardrails to track legitimate reply events
	     */
	    creatingReply: (event) => {
	      if (!this.enabled) return;
	      this._replyEvents.add(event);
	    }
	  };
	  /**
	   * Subscription-related guardrails
	   */
	  subscription = {
	    /**
	     * Called when a subscription is created
	     */
	    created: (_filters, _opts) => {
	      if (!this.enabled) return;
	      this.incrementSubscribeCount();
	    }
	  };
	  /**
	   * Relay-related guardrails
	   */
	  relay = {
	    /**
	     * Called when a relay connection is established
	     */
	    connected: (_relay) => {
	      if (!this.enabled) return;
	    }
	  };
	};
	function processFilters(filters, mode = "validate" /* VALIDATE */, debug9, ndk) {
	  if (mode === "ignore" /* IGNORE */) {
	    return filters;
	  }
	  const issues = [];
	  const processedFilters = filters.map((filter, index) => {
	    if (ndk?.aiGuardrails.isEnabled()) {
	      runAIGuardrailsForFilter(filter, index, ndk);
	    }
	    const result = processFilter(filter, mode, index, issues, debug9);
	    return result;
	  });
	  if (mode === "validate" /* VALIDATE */ && issues.length > 0) {
	    throw new Error(`Invalid filter(s) detected:
${issues.join("\n")}`);
	  }
	  return processedFilters;
	}
	function processFilter(filter, mode, filterIndex, issues, debug9) {
	  const isValidating = mode === "validate" /* VALIDATE */;
	  const cleanedFilter = isValidating ? filter : { ...filter };
	  if (filter.ids) {
	    const validIds = [];
	    filter.ids.forEach((id, idx) => {
	      if (id === void 0) {
	        if (isValidating) {
	          issues.push(`Filter[${filterIndex}].ids[${idx}] is undefined`);
	        } else {
	          debug9?.(`Fixed: Removed undefined value at ids[${idx}]`);
	        }
	      } else if (typeof id !== "string") {
	        if (isValidating) {
	          issues.push(`Filter[${filterIndex}].ids[${idx}] is not a string (got ${typeof id})`);
	        } else {
	          debug9?.(`Fixed: Removed non-string value at ids[${idx}] (was ${typeof id})`);
	        }
	      } else if (!isValidHex64(id)) {
	        if (isValidating) {
	          issues.push(`Filter[${filterIndex}].ids[${idx}] is not a valid 64-char hex string: "${id}"`);
	        } else {
	          debug9?.(`Fixed: Removed invalid hex string at ids[${idx}]`);
	        }
	      } else {
	        validIds.push(id);
	      }
	    });
	    if (!isValidating) {
	      cleanedFilter.ids = validIds.length > 0 ? validIds : void 0;
	    }
	  }
	  if (filter.authors) {
	    const validAuthors = [];
	    filter.authors.forEach((author, idx) => {
	      if (author === void 0) {
	        if (isValidating) {
	          issues.push(`Filter[${filterIndex}].authors[${idx}] is undefined`);
	        } else {
	          debug9?.(`Fixed: Removed undefined value at authors[${idx}]`);
	        }
	      } else if (typeof author !== "string") {
	        if (isValidating) {
	          issues.push(`Filter[${filterIndex}].authors[${idx}] is not a string (got ${typeof author})`);
	        } else {
	          debug9?.(`Fixed: Removed non-string value at authors[${idx}] (was ${typeof author})`);
	        }
	      } else if (!isValidHex64(author)) {
	        if (isValidating) {
	          issues.push(
	            `Filter[${filterIndex}].authors[${idx}] is not a valid 64-char hex pubkey: "${author}"`
	          );
	        } else {
	          debug9?.(`Fixed: Removed invalid hex pubkey at authors[${idx}]`);
	        }
	      } else {
	        validAuthors.push(author);
	      }
	    });
	    if (!isValidating) {
	      cleanedFilter.authors = validAuthors.length > 0 ? validAuthors : void 0;
	    }
	  }
	  if (filter.kinds) {
	    const validKinds = [];
	    filter.kinds.forEach((kind, idx) => {
	      if (kind === void 0) {
	        if (isValidating) {
	          issues.push(`Filter[${filterIndex}].kinds[${idx}] is undefined`);
	        } else {
	          debug9?.(`Fixed: Removed undefined value at kinds[${idx}]`);
	        }
	      } else if (typeof kind !== "number") {
	        if (isValidating) {
	          issues.push(`Filter[${filterIndex}].kinds[${idx}] is not a number (got ${typeof kind})`);
	        } else {
	          debug9?.(`Fixed: Removed non-number value at kinds[${idx}] (was ${typeof kind})`);
	        }
	      } else if (!Number.isInteger(kind)) {
	        if (isValidating) {
	          issues.push(`Filter[${filterIndex}].kinds[${idx}] is not an integer: ${kind}`);
	        } else {
	          debug9?.(`Fixed: Removed non-integer value at kinds[${idx}]: ${kind}`);
	        }
	      } else if (kind < 0 || kind > 65535) {
	        if (isValidating) {
	          issues.push(`Filter[${filterIndex}].kinds[${idx}] is out of valid range (0-65535): ${kind}`);
	        } else {
	          debug9?.(`Fixed: Removed out-of-range kind at kinds[${idx}]: ${kind}`);
	        }
	      } else {
	        validKinds.push(kind);
	      }
	    });
	    if (!isValidating) {
	      cleanedFilter.kinds = validKinds.length > 0 ? validKinds : void 0;
	    }
	  }
	  for (const key in filter) {
	    if (key.startsWith("#") && key.length === 2) {
	      const tagValues = filter[key];
	      if (Array.isArray(tagValues)) {
	        const validValues = [];
	        tagValues.forEach((value, idx) => {
	          if (value === void 0) {
	            if (isValidating) {
	              issues.push(`Filter[${filterIndex}].${key}[${idx}] is undefined`);
	            } else {
	              debug9?.(`Fixed: Removed undefined value at ${key}[${idx}]`);
	            }
	          } else if (typeof value !== "string") {
	            if (isValidating) {
	              issues.push(`Filter[${filterIndex}].${key}[${idx}] is not a string (got ${typeof value})`);
	            } else {
	              debug9?.(`Fixed: Removed non-string value at ${key}[${idx}] (was ${typeof value})`);
	            }
	          } else {
	            if ((key === "#e" || key === "#p") && !isValidHex64(value)) {
	              if (isValidating) {
	                issues.push(
	                  `Filter[${filterIndex}].${key}[${idx}] is not a valid 64-char hex string: "${value}"`
	                );
	              } else {
	                debug9?.(`Fixed: Removed invalid hex string at ${key}[${idx}]`);
	              }
	            } else {
	              validValues.push(value);
	            }
	          }
	        });
	        if (!isValidating) {
	          cleanedFilter[key] = validValues.length > 0 ? validValues : void 0;
	        }
	      }
	    }
	  }
	  if (!isValidating) {
	    Object.keys(cleanedFilter).forEach((key) => {
	      if (cleanedFilter[key] === void 0) {
	        delete cleanedFilter[key];
	      }
	    });
	  }
	  return cleanedFilter;
	}
	function runAIGuardrailsForFilter(filter, filterIndex, ndk) {
	  const guards = ndk.aiGuardrails;
	  const filterPreview = JSON.stringify(filter, null, 2);
	  if (Object.keys(filter).length === 1 && filter.limit !== void 0) {
	    guards.error(
	      GuardrailCheckId.FILTER_ONLY_LIMIT,
	      `Filter[${filterIndex}] contains only 'limit' without any filtering criteria.

\u{1F4E6} Your filter:
${filterPreview}

\u26A0\uFE0F  This will fetch random events from relays without any criteria.`,
	      `Add filtering criteria:
   \u2705 { kinds: [1], limit: 10 }
   \u2705 { authors: [pubkey], limit: 10 }
   \u274C { limit: 10 }`
	    );
	  }
	  if (Object.keys(filter).length === 0) {
	    guards.error(
	      GuardrailCheckId.FILTER_EMPTY,
	      `Filter[${filterIndex}] is empty.

\u{1F4E6} Your filter:
${filterPreview}

\u26A0\uFE0F  This will request ALL events from relays, which is never what you want.`,
	      `Add filtering criteria like 'kinds', 'authors', or tags.`,
	      false
	      // Fatal error - cannot be disabled
	    );
	  }
	  if (filter.since !== void 0 && filter.until !== void 0 && filter.since > filter.until) {
	    const sinceDate = new Date(filter.since * 1e3).toISOString();
	    const untilDate = new Date(filter.until * 1e3).toISOString();
	    guards.error(
	      GuardrailCheckId.FILTER_SINCE_AFTER_UNTIL,
	      `Filter[${filterIndex}] has 'since' AFTER 'until'.

\u{1F4E6} Your filter:
${filterPreview}

\u274C since: ${filter.since} (${sinceDate})
\u274C until: ${filter.until} (${untilDate})

No events can match this time range!`,
	      `'since' must be BEFORE 'until'. Both are Unix timestamps in seconds.`,
	      false
	      // Fatal error - cannot be disabled
	    );
	  }
	  const bech32Regex = /^n(addr|event|ote|pub|profile)1/;
	  if (filter.ids) {
	    filter.ids.forEach((id, idx) => {
	      if (typeof id === "string") {
	        if (bech32Regex.test(id)) {
	          guards.error(
	            GuardrailCheckId.FILTER_BECH32_IN_ARRAY,
	            `Filter[${filterIndex}].ids[${idx}] contains bech32: "${id}". IDs must be hex, not bech32.`,
	            `Use filterFromId() to decode bech32 first: import { filterFromId } from "@nostr-dev-kit/ndk"`,
	            false
	            // Fatal error - cannot be disabled
	          );
	        } else if (!isValidHex64(id)) {
	          guards.error(
	            GuardrailCheckId.FILTER_INVALID_HEX,
	            `Filter[${filterIndex}].ids[${idx}] is not a valid 64-char hex string: "${id}"`,
	            `Event IDs must be 64-character hexadecimal strings. Invalid IDs often come from corrupted data in user-generated lists. Always validate hex strings before using them in filters:

   const validIds = ids.filter(id => /^[0-9a-f]{64}$/i.test(id));`,
	            false
	            // Fatal error - cannot be disabled
	          );
	        }
	      }
	    });
	  }
	  if (filter.authors) {
	    filter.authors.forEach((author, idx) => {
	      if (typeof author === "string") {
	        if (bech32Regex.test(author)) {
	          guards.error(
	            GuardrailCheckId.FILTER_BECH32_IN_ARRAY,
	            `Filter[${filterIndex}].authors[${idx}] contains bech32: "${author}". Authors must be hex pubkeys, not npub.`,
	            `Use ndkUser.pubkey instead. Example: { authors: [ndkUser.pubkey] }`,
	            false
	            // Fatal error - cannot be disabled
	          );
	        } else if (!isValidHex64(author)) {
	          guards.error(
	            GuardrailCheckId.FILTER_INVALID_HEX,
	            `Filter[${filterIndex}].authors[${idx}] is not a valid 64-char hex pubkey: "${author}"`,
	            `Kind:3 follow lists can contain invalid entries like labels ("Follow List"), partial strings ("highlig"), or other corrupted data. You MUST validate all pubkeys before using them in filters.

   Example:
   const validPubkeys = pubkeys.filter(p => /^[0-9a-f]{64}$/i.test(p));
   ndk.subscribe({ authors: validPubkeys, kinds: [1] });`,
	            false
	            // Fatal error - cannot be disabled
	          );
	        }
	      }
	    });
	  }
	  for (const key in filter) {
	    if (key.startsWith("#") && key.length === 2) {
	      const tagValues = filter[key];
	      if (Array.isArray(tagValues)) {
	        tagValues.forEach((value, idx) => {
	          if (typeof value === "string") {
	            if (key === "#e" || key === "#p") {
	              if (bech32Regex.test(value)) {
	                guards.error(
	                  GuardrailCheckId.FILTER_BECH32_IN_ARRAY,
	                  `Filter[${filterIndex}].${key}[${idx}] contains bech32: "${value}". Tag values must be decoded.`,
	                  `Use filterFromId() or nip19.decode() to get the hex value first.`,
	                  false
	                  // Fatal error - cannot be disabled
	                );
	              } else if (!isValidHex64(value)) {
	                guards.error(
	                  GuardrailCheckId.FILTER_INVALID_HEX,
	                  `Filter[${filterIndex}].${key}[${idx}] is not a valid 64-char hex string: "${value}"`,
	                  `${key === "#e" ? "Event IDs" : "Public keys"} in tag filters must be 64-character hexadecimal strings. Kind:3 follow lists and other user-generated content can contain invalid data. Always filter before using:

   const validValues = values.filter(v => /^[0-9a-f]{64}$/i.test(v));`,
	                  false
	                  // Fatal error - cannot be disabled
	                );
	              }
	            }
	          }
	        });
	      }
	    }
	  }
	  if (filter["#a"]) {
	    const aTags = filter["#a"];
	    aTags?.forEach((aTag, idx) => {
	      if (typeof aTag === "string") {
	        if (!/^\d+:[0-9a-f]{64}:.*$/.test(aTag)) {
	          guards.error(
	            GuardrailCheckId.FILTER_INVALID_A_TAG,
	            `Filter[${filterIndex}].#a[${idx}] has invalid format: "${aTag}". Must be "kind:pubkey:d-tag".`,
	            `Example: "30023:fa984bd7dbb282f07e16e7ae87b26a2a7b9b90b7246a44771f0cf5ae58018f52:my-article"`,
	            false
	            // Fatal error - cannot be disabled
	          );
	        } else {
	          const kind = Number.parseInt(aTag.split(":")[0], 10);
	          if (kind < 3e4 || kind > 39999) {
	            guards.error(
	              GuardrailCheckId.FILTER_INVALID_A_TAG,
	              `Filter[${filterIndex}].#a[${idx}] uses non-addressable kind ${kind}: "${aTag}". #a filters are only for addressable events (kinds 30000-39999).`,
	              `Addressable events include:
   \u2022 30000-30039: Parameterized Replaceable Events (profiles, settings, etc.)
   \u2022 30040-39999: Other addressable events

For regular events (kind ${kind}), use:
   \u2022 #e filter for specific event IDs
   \u2022 kinds + authors filters for event queries`,
	              false
	              // Fatal error - cannot be disabled
	            );
	          }
	        }
	      }
	    });
	  }
	  if (filter["#t"]) {
	    const tTags = filter["#t"];
	    tTags?.forEach((tag, idx) => {
	      if (typeof tag === "string" && tag.startsWith("#")) {
	        guards.error(
	          GuardrailCheckId.FILTER_HASHTAG_WITH_PREFIX,
	          `Filter[${filterIndex}].#t[${idx}] contains hashtag with # prefix: "${tag}". Hashtag values should NOT include the # symbol.`,
	          `Remove the # prefix from hashtag filters:
   \u2705 { "#t": ["nostr"] }
   \u274C { "#t": ["#nostr"] }`,
	          false
	          // Fatal error - cannot be disabled
	        );
	      }
	    });
	  }
	}
	function queryFullyFilled(subscription) {
	  if (filterIncludesIds(subscription.filter)) {
	    if (resultHasAllRequestedIds(subscription)) {
	      return true;
	    }
	  }
	  return false;
	}
	function filterIncludesIds(filter) {
	  return !!filter.ids;
	}
	function resultHasAllRequestedIds(subscription) {
	  const ids = subscription.filter.ids;
	  return !!ids && ids.length === subscription.eventFirstSeen.size;
	}
	function filterFromId(id) {
	  let decoded;
	  if (id.match(NIP33_A_REGEX)) {
	    const [kind, pubkey, identifier] = id.split(":");
	    const filter = {
	      authors: [pubkey],
	      kinds: [Number.parseInt(kind)]
	    };
	    if (identifier) {
	      filter["#d"] = [identifier];
	    }
	    return filter;
	  }
	  if (id.match(BECH32_REGEX)) {
	    try {
	      decoded = nip19_exports$1.decode(id);
	      switch (decoded.type) {
	        case "nevent": {
	          const filter = { ids: [decoded.data.id] };
	          if (decoded.data.author) filter.authors = [decoded.data.author];
	          if (decoded.data.kind) filter.kinds = [decoded.data.kind];
	          return filter;
	        }
	        case "note":
	          return { ids: [decoded.data] };
	        case "naddr": {
	          const filter = {
	            authors: [decoded.data.pubkey],
	            kinds: [decoded.data.kind]
	          };
	          if (decoded.data.identifier) filter["#d"] = [decoded.data.identifier];
	          return filter;
	        }
	      }
	    } catch (e) {
	      console.error("Error decoding", id, e);
	    }
	  }
	  return { ids: [id] };
	}
	function isNip33AValue(value) {
	  return value.match(NIP33_A_REGEX) !== null;
	}
	var NIP33_A_REGEX = /^(\d+):([0-9A-Fa-f]+)(?::(.*))?$/;
	var BECH32_REGEX = /^n(event|ote|profile|pub|addr)1[\d\w]+$/;
	function relaysFromBech32(bech322, ndk) {
	  try {
	    const decoded = nip19_exports$1.decode(bech322);
	    if (["naddr", "nevent"].includes(decoded?.type)) {
	      const data = decoded.data;
	      if (data?.relays) {
	        return data.relays.map((r) => new NDKRelay(r, ndk.relayAuthDefaultPolicy, ndk));
	      }
	    }
	  } catch (_e) {
	  }
	  return [];
	}
	var defaultOpts = {
	  closeOnEose: false,
	  cacheUsage: "CACHE_FIRST" /* CACHE_FIRST */,
	  dontSaveToCache: false,
	  groupable: true,
	  groupableDelay: 100,
	  groupableDelayType: "at-most",
	  cacheUnconstrainFilter: ["limit", "since", "until"],
	  includeMuted: false
	};
	var NDKSubscription = class extends libExports.EventEmitter {
	  subId;
	  filters;
	  opts;
	  pool;
	  skipVerification = false;
	  skipValidation = false;
	  exclusiveRelay = false;
	  /**
	   * Tracks the filters as they are executed on each relay
	   */
	  relayFilters;
	  relaySet;
	  ndk;
	  debug;
	  /**
	   * Events that have been seen by the subscription, with the time they were first seen.
	   */
	  eventFirstSeen = /* @__PURE__ */ new Map();
	  /**
	   * Relays that have sent an EOSE.
	   */
	  eosesSeen = /* @__PURE__ */ new Set();
	  /**
	   * The time the last event was received by the subscription.
	   * This is used to calculate when EOSE should be emitted.
	   */
	  lastEventReceivedAt;
	  /**
	   * The most recent event timestamp from cache results.
	   * This is used for addSinceFromCache functionality.
	   */
	  mostRecentCacheEventTimestamp;
	  internalId;
	  /**
	   * Whether the subscription should close when all relays have reached the end of the event stream.
	   */
	  closeOnEose;
	  /**
	   * Pool monitor callback
	   */
	  poolMonitor;
	  skipOptimisticPublishEvent = false;
	  /**
	   * Filters to remove when querying the cache.
	   */
	  cacheUnconstrainFilter;
	  constructor(ndk, filters, opts, subId) {
	    super();
	    this.ndk = ndk;
	    this.opts = { ...defaultOpts, ...opts || {} };
	    this.pool = this.opts.pool || ndk.pool;
	    const rawFilters = Array.isArray(filters) ? filters : [filters];
	    const validationMode = ndk.filterValidationMode === "validate" ? "validate" /* VALIDATE */ : ndk.filterValidationMode === "fix" ? "fix" /* FIX */ : "ignore" /* IGNORE */;
	    this.filters = processFilters(rawFilters, validationMode, ndk.debug, ndk);
	    if (this.filters.length === 0) {
	      throw new Error("Subscription must have at least one filter");
	    }
	    this.subId = subId || this.opts.subId;
	    this.internalId = Math.random().toString(36).substring(7);
	    this.debug = ndk.debug.extend(`subscription[${this.opts.subId ?? this.internalId}]`);
	    if (this.opts.relaySet) {
	      this.relaySet = this.opts.relaySet;
	    } else if (this.opts.relayUrls) {
	      this.relaySet = NDKRelaySet.fromRelayUrls(this.opts.relayUrls, this.ndk);
	    }
	    this.skipVerification = this.opts.skipVerification || false;
	    this.skipValidation = this.opts.skipValidation || false;
	    this.closeOnEose = this.opts.closeOnEose || false;
	    this.skipOptimisticPublishEvent = this.opts.skipOptimisticPublishEvent || false;
	    this.cacheUnconstrainFilter = this.opts.cacheUnconstrainFilter;
	    this.exclusiveRelay = this.opts.exclusiveRelay || false;
	    if (this.opts.onEvent) {
	      this.on("event", this.opts.onEvent);
	    }
	    if (this.opts.onEose) {
	      this.on("eose", this.opts.onEose);
	    }
	    if (this.opts.onClose) {
	      this.on("close", this.opts.onClose);
	    }
	  }
	  /**
	   * Returns the relays that have not yet sent an EOSE.
	   */
	  relaysMissingEose() {
	    if (!this.relayFilters) return [];
	    const relaysMissingEose = Array.from(this.relayFilters?.keys()).filter(
	      (url) => !this.eosesSeen.has(this.pool.getRelay(url, false, false))
	    );
	    return relaysMissingEose;
	  }
	  /**
	   * Provides access to the first filter of the subscription for
	   * backwards compatibility.
	   */
	  get filter() {
	    return this.filters[0];
	  }
	  get groupableDelay() {
	    if (!this.isGroupable()) return void 0;
	    return this.opts?.groupableDelay;
	  }
	  get groupableDelayType() {
	    return this.opts?.groupableDelayType || "at-most";
	  }
	  isGroupable() {
	    return this.opts?.groupable || false;
	  }
	  shouldQueryCache() {
	    if (this.opts.addSinceFromCache) return true;
	    if (this.opts?.cacheUsage === "ONLY_RELAY" /* ONLY_RELAY */) return false;
	    const hasNonEphemeralKind = this.filters.some((f) => f.kinds?.some((k) => kindIsEphemeral(k)));
	    if (hasNonEphemeralKind) return true;
	    return true;
	  }
	  shouldQueryRelays() {
	    return this.opts?.cacheUsage !== "ONLY_CACHE" /* ONLY_CACHE */;
	  }
	  shouldWaitForCache() {
	    if (this.opts.addSinceFromCache) return true;
	    return (
	      // Must want to close on EOSE; subscriptions
	      // that want to receive further updates must
	      // always hit the relay
	      !!this.opts.closeOnEose && // Cache adapter must claim to be fast
	      !!this.ndk.cacheAdapter?.locking && // If explicitly told to run in parallel, then
	      // we should not wait for the cache
	      this.opts.cacheUsage !== "PARALLEL" /* PARALLEL */
	    );
	  }
	  /**
	   * Start the subscription. This is the main method that should be called
	   * after creating a subscription.
	   *
	   * @param emitCachedEvents - Whether to emit events coming from a synchronous cache
	   *
	   * When using a synchronous cache, the events will be returned immediately
	   * by this function. If you will use those returned events, you should
	   * set emitCachedEvents to false to prevent seeing them as duplicate events.
	   */
	  start(emitCachedEvents = true) {
	    let cacheResult;
	    const updateStateFromCacheResults = (events) => {
	      for (const event of events) {
	        if (event.created_at && (!this.mostRecentCacheEventTimestamp || event.created_at > this.mostRecentCacheEventTimestamp)) {
	          this.mostRecentCacheEventTimestamp = event.created_at;
	        }
	        this.eventReceived(event, void 0, true, false);
	      }
	      if (!emitCachedEvents) {
	        cacheResult = events;
	      }
	    };
	    const loadFromRelays = () => {
	      if (this.shouldQueryRelays()) {
	        this.startWithRelays();
	        this.startPoolMonitor();
	      } else {
	        this.emit("eose", this);
	      }
	    };
	    if (this.shouldQueryCache()) {
	      cacheResult = this.startWithCache();
	      if (cacheResult instanceof Promise) {
	        if (this.shouldWaitForCache()) {
	          cacheResult.then((events) => {
	            updateStateFromCacheResults(events);
	            if (queryFullyFilled(this)) {
	              this.emit("eose", this);
	              return;
	            }
	            loadFromRelays();
	          });
	          return null;
	        }
	        cacheResult.then((events) => {
	          updateStateFromCacheResults(events);
	          if (!this.shouldQueryRelays()) {
	            this.emit("eose", this);
	          }
	        });
	        if (this.shouldQueryRelays()) {
	          loadFromRelays();
	        }
	        return null;
	      }
	      updateStateFromCacheResults(cacheResult);
	      if (queryFullyFilled(this)) {
	        this.emit("eose", this);
	      } else {
	        loadFromRelays();
	      }
	      return cacheResult;
	    }
	    loadFromRelays();
	    return null;
	  }
	  /**
	   * We want to monitor for new relays that are coming online, in case
	   * they should be part of this subscription.
	   */
	  startPoolMonitor() {
	    this.debug.extend("pool-monitor");
	    this.poolMonitor = (relay) => {
	      if (this.relayFilters?.has(relay.url)) return;
	      const calc = calculateRelaySetsFromFilters(this.ndk, this.filters, this.pool, this.opts.relayGoalPerAuthor);
	      if (calc.get(relay.url)) {
	        this.relayFilters?.set(relay.url, this.filters);
	        relay.subscribe(this, this.filters);
	      }
	    };
	    this.pool.on("relay:connect", this.poolMonitor);
	  }
	  onStopped;
	  stop() {
	    this.emit("close", this);
	    this.poolMonitor && this.pool.off("relay:connect", this.poolMonitor);
	    this.onStopped?.();
	  }
	  /**
	   * @returns Whether the subscription has an authors filter.
	   */
	  hasAuthorsFilter() {
	    return this.filters.some((f) => f.authors?.length);
	  }
	  startWithCache() {
	    if (this.ndk.cacheAdapter?.query) {
	      return this.ndk.cacheAdapter.query(this);
	    }
	    return [];
	  }
	  /**
	   * Find available relays that should be part of this subscription and execute in them.
	   *
	   * Note that this is executed in addition to using the pool monitor, so even if the relay set
	   * that is computed (i.e. we don't have any relays available), when relays come online, we will
	   * check if we need to execute in them.
	   */
	  startWithRelays() {
	    let filters = this.filters;
	    if (this.opts.addSinceFromCache && this.mostRecentCacheEventTimestamp) {
	      const sinceTimestamp = this.mostRecentCacheEventTimestamp + 1;
	      filters = filters.map((filter) => ({
	        ...filter,
	        since: Math.max(filter.since || 0, sinceTimestamp)
	      }));
	    }
	    if (!this.relaySet || this.relaySet.relays.size === 0) {
	      this.relayFilters = calculateRelaySetsFromFilters(
	        this.ndk,
	        filters,
	        this.pool,
	        this.opts.relayGoalPerAuthor
	      );
	    } else {
	      this.relayFilters = /* @__PURE__ */ new Map();
	      for (const relay of this.relaySet.relays) {
	        this.relayFilters.set(relay.url, filters);
	      }
	    }
	    for (const [relayUrl, filters2] of this.relayFilters) {
	      const relay = this.pool.getRelay(relayUrl, true, true, filters2);
	      relay.subscribe(this, filters2);
	    }
	  }
	  /**
	   * Refresh relay connections when outbox data becomes available.
	   * This recalculates which relays should receive this subscription and
	   * connects to any newly discovered relays.
	   */
	  refreshRelayConnections() {
	    if (this.relaySet && this.relaySet.relays.size > 0) {
	      return;
	    }
	    const updatedRelaySets = calculateRelaySetsFromFilters(
	      this.ndk,
	      this.filters,
	      this.pool,
	      this.opts.relayGoalPerAuthor
	    );
	    for (const [relayUrl, filters] of updatedRelaySets) {
	      if (!this.relayFilters?.has(relayUrl)) {
	        this.relayFilters?.set(relayUrl, filters);
	        const relay = this.pool.getRelay(relayUrl, true, true, filters);
	        relay.subscribe(this, filters);
	      }
	    }
	  }
	  // EVENT handling
	  /**
	   * Called when an event is received from a relay or the cache
	   * @param event
	   * @param relay
	   * @param fromCache Whether the event was received from the cache
	   * @param optimisticPublish Whether this event is coming from an optimistic publish
	   */
	  eventReceived(event, relay, fromCache = false, optimisticPublish = false) {
	    const eventId = event.id;
	    const eventAlreadySeen = this.eventFirstSeen.has(eventId);
	    let ndkEvent;
	    if (event instanceof NDKEvent) ndkEvent = event;
	    if (!eventAlreadySeen) {
	      ndkEvent ??= new NDKEvent(this.ndk, event);
	      ndkEvent.ndk = this.ndk;
	      ndkEvent.relay = relay;
	      if (!fromCache && !optimisticPublish) {
	        if (!this.skipValidation) {
	          if (!ndkEvent.isValid) {
	            this.debug("Event failed validation %s from relay %s", eventId, relay?.url);
	            return;
	          }
	        }
	        if (relay) {
	          const shouldVerify = relay.shouldValidateEvent();
	          if (shouldVerify && !this.skipVerification) {
	            ndkEvent.relay = relay;
	            if (this.ndk.asyncSigVerification) {
	              ndkEvent.verifySignature(true);
	            } else {
	              if (!ndkEvent.verifySignature(true)) {
	                this.debug("Event failed signature validation", event);
	                this.ndk.reportInvalidSignature(ndkEvent, relay);
	                return;
	              }
	              relay.addValidatedEvent();
	            }
	          } else {
	            relay.addNonValidatedEvent();
	          }
	        }
	        if (this.ndk.cacheAdapter && !this.opts.dontSaveToCache) {
	          this.ndk.cacheAdapter.setEvent(ndkEvent, this.filters, relay);
	        }
	      }
	      if (!this.opts.includeMuted && this.ndk.muteFilter && this.ndk.muteFilter(ndkEvent)) {
	        this.debug("Event muted, skipping");
	        return;
	      }
	      if (!optimisticPublish || this.skipOptimisticPublishEvent !== true) {
	        this.emitEvent(this.opts?.wrap ?? false, ndkEvent, relay, fromCache, optimisticPublish);
	        this.eventFirstSeen.set(eventId, Date.now());
	      }
	    } else {
	      const timeSinceFirstSeen = Date.now() - (this.eventFirstSeen.get(eventId) || 0);
	      this.emit("event:dup", event, relay, timeSinceFirstSeen, this, fromCache, optimisticPublish);
	      if (this.opts?.onEventDup) {
	        this.opts.onEventDup(event, relay, timeSinceFirstSeen, this, fromCache, optimisticPublish);
	      }
	      if (!fromCache && !optimisticPublish && relay && this.ndk.cacheAdapter?.setEventDup && !this.opts.dontSaveToCache) {
	        ndkEvent ??= event instanceof NDKEvent ? event : new NDKEvent(this.ndk, event);
	        this.ndk.cacheAdapter.setEventDup(ndkEvent, relay);
	      }
	      if (relay) {
	        const signature = verifiedSignatures.get(eventId);
	        if (signature && typeof signature === "string") {
	          if (event.sig === signature) {
	            relay.addValidatedEvent();
	          } else {
	            const eventToReport = event instanceof NDKEvent ? event : new NDKEvent(this.ndk, event);
	            this.ndk.reportInvalidSignature(eventToReport, relay);
	          }
	        }
	      }
	    }
	    this.lastEventReceivedAt = Date.now();
	  }
	  /**
	   * Optionally wraps, sync or async, and emits the event (if one comes back from the wrapper)
	   */
	  emitEvent(wrap, evt, relay, fromCache, optimisticPublish) {
	    const wrapped = wrap ? wrapEvent(evt) : evt;
	    if (wrapped instanceof Promise) {
	      wrapped.then((e) => this.emitEvent(false, e, relay, fromCache, optimisticPublish));
	    } else if (wrapped) {
	      this.emit("event", wrapped, relay, this, fromCache, optimisticPublish);
	    }
	  }
	  closedReceived(relay, reason) {
	    this.emit("closed", relay, reason);
	  }
	  // EOSE handling
	  eoseTimeout;
	  eosed = false;
	  eoseReceived(relay) {
	    this.debug("EOSE received from %s", relay.url);
	    this.eosesSeen.add(relay);
	    let lastEventSeen = this.lastEventReceivedAt ? Date.now() - this.lastEventReceivedAt : void 0;
	    const hasSeenAllEoses = this.eosesSeen.size === this.relayFilters?.size;
	    const queryFilled = queryFullyFilled(this);
	    const performEose = (reason) => {
	      this.debug("Performing EOSE: %s %d", reason, this.eosed);
	      if (this.eosed) return;
	      if (this.eoseTimeout) clearTimeout(this.eoseTimeout);
	      this.emit("eose", this);
	      this.eosed = true;
	      if (this.opts?.closeOnEose) this.stop();
	    };
	    if (queryFilled || hasSeenAllEoses) {
	      performEose("query filled or seen all");
	    } else if (this.relayFilters) {
	      let timeToWaitForNextEose = 1e3;
	      const connectedRelays = new Set(this.pool.connectedRelays().map((r) => r.url));
	      const connectedRelaysWithFilters = Array.from(this.relayFilters.keys()).filter(
	        (url) => connectedRelays.has(url)
	      );
	      if (connectedRelaysWithFilters.length === 0) {
	        this.debug(
	          "No connected relays, waiting for all relays to connect",
	          Array.from(this.relayFilters.keys()).join(", ")
	        );
	        return;
	      }
	      const percentageOfRelaysThatHaveSentEose = this.eosesSeen.size / connectedRelaysWithFilters.length;
	      this.debug("Percentage of relays that have sent EOSE", {
	        subId: this.subId,
	        percentageOfRelaysThatHaveSentEose,
	        seen: this.eosesSeen.size,
	        total: connectedRelaysWithFilters.length
	      });
	      if (this.eosesSeen.size >= 2 && percentageOfRelaysThatHaveSentEose >= 0.5) {
	        timeToWaitForNextEose = timeToWaitForNextEose * (1 - percentageOfRelaysThatHaveSentEose);
	        if (timeToWaitForNextEose === 0) {
	          performEose("time to wait was 0");
	          return;
	        }
	        if (this.eoseTimeout) clearTimeout(this.eoseTimeout);
	        const sendEoseTimeout = () => {
	          lastEventSeen = this.lastEventReceivedAt ? Date.now() - this.lastEventReceivedAt : void 0;
	          if (lastEventSeen !== void 0 && lastEventSeen < 20) {
	            this.eoseTimeout = setTimeout(sendEoseTimeout, timeToWaitForNextEose);
	          } else {
	            performEose(`send eose timeout: ${timeToWaitForNextEose}`);
	          }
	        };
	        this.eoseTimeout = setTimeout(sendEoseTimeout, timeToWaitForNextEose);
	      }
	    }
	  }
	};
	var kindIsEphemeral = (kind) => kind >= 2e4 && kind < 3e4;

	// src/user/follows.ts
	async function follows(opts, outbox, kind = 3 /* Contacts */) {
	  if (!this.ndk) throw new Error("NDK not set");
	  const contactListEvent = await this.ndk.fetchEvent(
	    { kinds: [kind], authors: [this.pubkey] },
	    opts || { groupable: false }
	  );
	  if (contactListEvent) {
	    const pubkeys = /* @__PURE__ */ new Set();
	    contactListEvent.tags.forEach((tag) => {
	      if (tag[0] === "p" && tag[1] && isValidPubkey(tag[1])) {
	        pubkeys.add(tag[1]);
	      }
	    });
	    if (outbox) {
	      this.ndk?.outboxTracker?.trackUsers(Array.from(pubkeys));
	    }
	    return [...pubkeys].reduce((acc, pubkey) => {
	      const user = new NDKUser({ pubkey });
	      user.ndk = this.ndk;
	      acc.add(user);
	      return acc;
	    }, /* @__PURE__ */ new Set());
	  }
	  return /* @__PURE__ */ new Set();
	}

	// src/user/nip05.ts
	var NIP05_REGEX = /^(?:([\w.+-]+)@)?([\w.-]+)$/;
	async function getNip05For(ndk, fullname, _fetch = fetch, fetchOpts = {}) {
	  return await ndk.queuesNip05.add({
	    id: fullname,
	    func: async () => {
	      if (ndk.cacheAdapter?.loadNip05) {
	        const profile = await ndk.cacheAdapter.loadNip05(fullname);
	        if (profile !== "missing") {
	          if (profile) {
	            const user = new NDKUser({
	              pubkey: profile.pubkey,
	              relayUrls: profile.relays,
	              nip46Urls: profile.nip46
	            });
	            user.ndk = ndk;
	            return user;
	          }
	          if (fetchOpts.cache !== "no-cache") {
	            return null;
	          }
	        }
	      }
	      const match = fullname.match(NIP05_REGEX);
	      if (!match) return null;
	      const [_, name = "_", domain] = match;
	      try {
	        const res = await _fetch(`https://${domain}/.well-known/nostr.json?name=${name}`, fetchOpts);
	        const { names, relays, nip46 } = parseNIP05Result(await res.json());
	        const pubkey = names[name.toLowerCase()];
	        let profile = null;
	        if (pubkey) {
	          profile = { pubkey, relays: relays?.[pubkey], nip46: nip46?.[pubkey] };
	        }
	        if (ndk?.cacheAdapter?.saveNip05) {
	          ndk.cacheAdapter.saveNip05(fullname, profile);
	        }
	        return profile;
	      } catch (_e) {
	        if (ndk?.cacheAdapter?.saveNip05) {
	          ndk?.cacheAdapter.saveNip05(fullname, null);
	        }
	        console.error("Failed to fetch NIP05 for", fullname, _e);
	        return null;
	      }
	    }
	  });
	}
	function parseNIP05Result(json) {
	  const result = {
	    names: {}
	  };
	  for (const [name, pubkey] of Object.entries(json.names)) {
	    if (typeof name === "string" && typeof pubkey === "string") {
	      result.names[name.toLowerCase()] = pubkey;
	    }
	  }
	  if (json.relays) {
	    result.relays = {};
	    for (const [pubkey, relays] of Object.entries(json.relays)) {
	      if (typeof pubkey === "string" && Array.isArray(relays)) {
	        result.relays[pubkey] = relays.filter((relay) => typeof relay === "string");
	      }
	    }
	  }
	  if (json.nip46) {
	    result.nip46 = {};
	    for (const [pubkey, nip46] of Object.entries(json.nip46)) {
	      if (typeof pubkey === "string" && Array.isArray(nip46)) {
	        result.nip46[pubkey] = nip46.filter((relay) => typeof relay === "string");
	      }
	    }
	  }
	  return result;
	}

	// src/user/profile.ts
	function profileFromEvent(event) {
	  const profile = {};
	  let payload;
	  try {
	    payload = JSON.parse(event.content);
	  } catch (error) {
	    throw new Error(`Failed to parse profile event: ${error}`);
	  }
	  profile.profileEvent = JSON.stringify(event.rawEvent());
	  for (const key of Object.keys(payload)) {
	    switch (key) {
	      case "name":
	        profile.name = payload.name;
	        break;
	      case "display_name":
	        profile.displayName = payload.display_name;
	        break;
	      case "image":
	      case "picture":
	        profile.picture = payload.picture || payload.image;
	        profile.image = profile.picture;
	        break;
	      case "banner":
	        profile.banner = payload.banner;
	        break;
	      case "bio":
	        profile.bio = payload.bio;
	        break;
	      case "nip05":
	        profile.nip05 = payload.nip05;
	        break;
	      case "lud06":
	        profile.lud06 = payload.lud06;
	        break;
	      case "lud16":
	        profile.lud16 = payload.lud16;
	        break;
	      case "about":
	        profile.about = payload.about;
	        break;
	      case "website":
	        profile.website = payload.website;
	        break;
	      default:
	        profile[key] = payload[key];
	        break;
	    }
	  }
	  profile.created_at = event.created_at;
	  return profile;
	}
	function serializeProfile(profile) {
	  const payload = {};
	  for (const [key, val] of Object.entries(profile)) {
	    switch (key) {
	      case "username":
	      case "name":
	        payload.name = val;
	        break;
	      case "displayName":
	        payload.display_name = val;
	        break;
	      case "image":
	      case "picture":
	        payload.picture = val;
	        break;
	      case "bio":
	      case "about":
	        payload.about = val;
	        break;
	      default:
	        payload[key] = val;
	        break;
	    }
	  }
	  return JSON.stringify(payload);
	}

	// src/user/index.ts
	var NDKUser = class _NDKUser {
	  ndk;
	  profile;
	  profileEvent;
	  _npub;
	  _pubkey;
	  relayUrls = [];
	  nip46Urls = [];
	  constructor(opts) {
	    if (opts.npub) this._npub = opts.npub;
	    if (opts.hexpubkey) this._pubkey = opts.hexpubkey;
	    if (opts.pubkey) this._pubkey = opts.pubkey;
	    if (opts.relayUrls) this.relayUrls = opts.relayUrls;
	    if (opts.nip46Urls) this.nip46Urls = opts.nip46Urls;
	    if (opts.nprofile) {
	      try {
	        const decoded = nip19_exports$1.decode(opts.nprofile);
	        if (decoded.type === "nprofile") {
	          this._pubkey = decoded.data.pubkey;
	          if (decoded.data.relays && decoded.data.relays.length > 0) {
	            this.relayUrls.push(...decoded.data.relays);
	          }
	        }
	      } catch (e) {
	        console.error("Failed to decode nprofile", e);
	      }
	    }
	  }
	  get npub() {
	    if (!this._npub) {
	      if (!this._pubkey) throw new Error("pubkey not set");
	      this._npub = nip19_exports$1.npubEncode(this.pubkey);
	    }
	    return this._npub;
	  }
	  get nprofile() {
	    const relays = this.profileEvent?.onRelays?.map((r) => r.url);
	    return nip19_exports$1.nprofileEncode({
	      pubkey: this.pubkey,
	      relays
	    });
	  }
	  set npub(npub2) {
	    this._npub = npub2;
	  }
	  /**
	   * Get the user's pubkey
	   * @returns {string} The user's pubkey
	   */
	  get pubkey() {
	    if (!this._pubkey) {
	      if (!this._npub) throw new Error("npub not set");
	      this._pubkey = nip19_exports$1.decode(this.npub).data;
	    }
	    return this._pubkey;
	  }
	  /**
	   * Set the user's pubkey
	   * @param pubkey {string} The user's pubkey
	   */
	  set pubkey(pubkey) {
	    this._pubkey = pubkey;
	  }
	  /**
	   * Equivalent to NDKEvent.filters().
	   * @returns {NDKFilter}
	   */
	  filter() {
	    return { "#p": [this.pubkey] };
	  }
	  /**
	   * Gets NIP-57 and NIP-61 information that this user has signaled
	   *
	   * @param getAll {boolean} Whether to get all zap info or just the first one
	   */
	  async getZapInfo(timeoutMs) {
	    if (!this.ndk) throw new Error("No NDK instance found");
	    const promiseWithTimeout = async (promise) => {
	      if (!timeoutMs) return promise;
	      let timeoutId;
	      const timeoutPromise = new Promise((_, reject) => {
	        timeoutId = setTimeout(() => reject(new Error("Timeout")), timeoutMs);
	      });
	      try {
	        const result = await Promise.race([promise, timeoutPromise]);
	        if (timeoutId) clearTimeout(timeoutId);
	        return result;
	      } catch (e) {
	        if (e instanceof Error && e.message === "Timeout") {
	          try {
	            const result = await promise;
	            return result;
	          } catch (_originalError) {
	            return void 0;
	          }
	        }
	        return void 0;
	      }
	    };
	    const [userProfile, mintListEvent] = await Promise.all([
	      promiseWithTimeout(this.fetchProfile()),
	      promiseWithTimeout(
	        this.ndk.fetchEvent({ kinds: [10019 /* CashuMintList */], authors: [this.pubkey] })
	      )
	    ]);
	    const res = /* @__PURE__ */ new Map();
	    if (mintListEvent) {
	      const mintList = NDKCashuMintList.from(mintListEvent);
	      if (mintList.mints.length > 0) {
	        res.set("nip61", {
	          mints: mintList.mints,
	          relays: mintList.relays,
	          p2pk: mintList.p2pk
	        });
	      }
	    }
	    if (userProfile) {
	      const { lud06, lud16 } = userProfile;
	      res.set("nip57", { lud06, lud16 });
	    }
	    return res;
	  }
	  /**
	   * Instantiate an NDKUser from a NIP-05 string
	   * @param nip05Id {string} The user's NIP-05
	   * @param ndk {NDK} An NDK instance
	   * @param skipCache {boolean} Whether to skip the cache or not
	   * @returns {NDKUser | undefined} An NDKUser if one is found for the given NIP-05, undefined otherwise.
	   */
	  static async fromNip05(nip05Id, ndk, skipCache = false) {
	    if (!ndk) throw new Error("No NDK instance found");
	    const opts = {};
	    if (skipCache) opts.cache = "no-cache";
	    const profile = await getNip05For(ndk, nip05Id, ndk?.httpFetch, opts);
	    if (profile) {
	      const user = new _NDKUser({
	        pubkey: profile.pubkey,
	        relayUrls: profile.relays,
	        nip46Urls: profile.nip46
	      });
	      user.ndk = ndk;
	      return user;
	    }
	  }
	  /**
	   * Fetch a user's profile
	   * @param opts {NDKSubscriptionOptions} A set of NDKSubscriptionOptions
	   * @param storeProfileEvent {boolean} Whether to store the profile event or not
	   * @returns User Profile
	   */
	  async fetchProfile(opts, storeProfileEvent = false) {
	    if (!this.ndk) throw new Error("NDK not set");
	    let setMetadataEvent = null;
	    if (this.ndk.cacheAdapter && (this.ndk.cacheAdapter.fetchProfile || this.ndk.cacheAdapter.fetchProfileSync) && opts?.cacheUsage !== "ONLY_RELAY" /* ONLY_RELAY */) {
	      let profile = null;
	      if (this.ndk.cacheAdapter.fetchProfileSync) {
	        profile = this.ndk.cacheAdapter.fetchProfileSync(this.pubkey);
	      } else if (this.ndk.cacheAdapter.fetchProfile) {
	        profile = await this.ndk.cacheAdapter.fetchProfile(this.pubkey);
	      }
	      if (profile) {
	        this.profile = profile;
	        return profile;
	      }
	    }
	    opts ??= {};
	    opts.cacheUsage ??= "ONLY_RELAY" /* ONLY_RELAY */;
	    opts.closeOnEose ??= true;
	    opts.groupable ??= true;
	    opts.groupableDelay ??= 250;
	    if (!setMetadataEvent) {
	      setMetadataEvent = await this.ndk.fetchEvent(
	        { kinds: [0], authors: [this.pubkey] },
	        opts
	      );
	    }
	    if (!setMetadataEvent) return null;
	    this.profile = profileFromEvent(setMetadataEvent);
	    if (storeProfileEvent && this.profile && this.ndk.cacheAdapter && this.ndk.cacheAdapter.saveProfile) {
	      this.ndk.cacheAdapter.saveProfile(this.pubkey, this.profile);
	    }
	    return this.profile;
	  }
	  /**
	   * Returns a set of users that this user follows.
	   *
	   * @deprecated Use followSet instead
	   */
	  follows = follows.bind(this);
	  /**
	   * Returns a set of pubkeys that this user follows.
	   *
	   * @param opts - NDKSubscriptionOptions
	   * @param outbox - boolean
	   * @param kind - number
	   */
	  async followSet(opts, outbox, kind = 3 /* Contacts */) {
	    const follows2 = await this.follows(opts, outbox, kind);
	    return new Set(Array.from(follows2).map((f) => f.pubkey));
	  }
	  /** @deprecated Use referenceTags instead. */
	  /**
	   * Get the tag that can be used to reference this user in an event
	   * @returns {NDKTag} an NDKTag
	   */
	  tagReference() {
	    return ["p", this.pubkey];
	  }
	  /**
	   * Get the tags that can be used to reference this user in an event
	   * @returns {NDKTag[]} an array of NDKTag
	   */
	  referenceTags(marker) {
	    const tag = [["p", this.pubkey]];
	    if (!marker) return tag;
	    tag[0].push("", marker);
	    return tag;
	  }
	  /**
	   * Publishes the current profile.
	   */
	  async publish() {
	    if (!this.ndk) throw new Error("No NDK instance found");
	    if (!this.profile) throw new Error("No profile available");
	    this.ndk.assertSigner();
	    const event = new NDKEvent(this.ndk, {
	      kind: 0,
	      content: serializeProfile(this.profile)
	    });
	    await event.publish();
	  }
	  /**
	   * Add a follow to this user's contact list
	   *
	   * @param newFollow {NDKUser | Hexpubkey} The user to follow
	   * @param currentFollowList {Set<NDKUser | Hexpubkey>} The current follow list
	   * @param kind {NDKKind} The kind to use for this contact list (defaults to `3`)
	   * @returns {Promise<boolean>} True if the follow was added, false if the follow already exists
	   */
	  async follow(newFollow, currentFollowList, kind = 3 /* Contacts */) {
	    if (!this.ndk) throw new Error("No NDK instance found");
	    this.ndk.assertSigner();
	    if (!currentFollowList) {
	      currentFollowList = await this.follows(void 0, void 0, kind);
	    }
	    const newFollowPubkey = typeof newFollow === "string" ? newFollow : newFollow.pubkey;
	    const isAlreadyFollowing = Array.from(currentFollowList).some(
	      (item) => typeof item === "string" ? item === newFollowPubkey : item.pubkey === newFollowPubkey
	    );
	    if (isAlreadyFollowing) {
	      return false;
	    }
	    currentFollowList.add(newFollow);
	    const event = new NDKEvent(this.ndk, { kind });
	    for (const follow of currentFollowList) {
	      if (typeof follow === "string") {
	        event.tags.push(["p", follow]);
	      } else {
	        event.tag(follow);
	      }
	    }
	    await event.publish();
	    return true;
	  }
	  /**
	   * Remove a follow from this user's contact list
	   *
	   * @param user {NDKUser | Hexpubkey} The user to unfollow
	   * @param currentFollowList {Set<NDKUser | Hexpubkey>} The current follow list
	   * @param kind {NDKKind} The kind to use for this contact list (defaults to `3`)
	   * @returns The relays were the follow list was published or false if the user wasn't found
	   */
	  async unfollow(user, currentFollowList, kind = 3 /* Contacts */) {
	    if (!this.ndk) throw new Error("No NDK instance found");
	    this.ndk.assertSigner();
	    if (!currentFollowList) {
	      currentFollowList = await this.follows(void 0, void 0, kind);
	    }
	    const unfollowPubkey = typeof user === "string" ? user : user.pubkey;
	    const newUserFollowList = /* @__PURE__ */ new Set();
	    let foundUser = false;
	    for (const follow of currentFollowList) {
	      const followPubkey = typeof follow === "string" ? follow : follow.pubkey;
	      if (followPubkey !== unfollowPubkey) {
	        newUserFollowList.add(follow);
	      } else {
	        foundUser = true;
	      }
	    }
	    if (!foundUser) return false;
	    const event = new NDKEvent(this.ndk, { kind });
	    for (const follow of newUserFollowList) {
	      if (typeof follow === "string") {
	        event.tags.push(["p", follow]);
	      } else {
	        event.tag(follow);
	      }
	    }
	    return await event.publish();
	  }
	  /**
	   * Validate a user's NIP-05 identifier (usually fetched from their kind:0 profile data)
	   *
	   * @param nip05Id The NIP-05 string to validate
	   * @returns {Promise<boolean | null>} True if the NIP-05 is found and matches this user's pubkey,
	   * False if the NIP-05 is found but doesn't match this user's pubkey,
	   * null if the NIP-05 isn't found on the domain or we're unable to verify (because of network issues, etc.)
	   */
	  async validateNip05(nip05Id) {
	    if (!this.ndk) throw new Error("No NDK instance found");
	    const profilePointer = await getNip05For(this.ndk, nip05Id);
	    if (profilePointer === null) return null;
	    return profilePointer.pubkey === this.pubkey;
	  }
	};

	// src/signers/registry.ts
	var signerRegistry = /* @__PURE__ */ new Map();
	function registerSigner(type, signerClass) {
	  signerRegistry.set(type, signerClass);
	}

	// src/signers/private-key/index.ts
	var NDKPrivateKeySigner = class _NDKPrivateKeySigner {
	  _user;
	  _privateKey;
	  _pubkey;
	  /**
	   * Create a new signer from a private key.
	   * @param privateKey - The private key to use in hex form or nsec.
	   * @param ndk - The NDK instance to use.
	   *
	   * @ai-guardrail
	   * If you have an nsec (bech32-encoded private key starting with "nsec1"), you can pass it directly
	   * to this constructor without decoding it first. The constructor handles both hex and nsec formats automatically.
	   * DO NOT use nip19.decode() to convert nsec to hex before passing it here - just pass the nsec string directly.
	   */
	  constructor(privateKeyOrNsec, ndk) {
	    if (typeof privateKeyOrNsec === "string") {
	      if (privateKeyOrNsec.startsWith("nsec1")) {
	        const { type, data } = nip19_exports$1.decode(privateKeyOrNsec);
	        if (type === "nsec") this._privateKey = data;
	        else throw new Error("Invalid private key provided.");
	      } else if (privateKeyOrNsec.length === 64) {
	        this._privateKey = hexToBytes(privateKeyOrNsec);
	      } else {
	        throw new Error("Invalid private key provided.");
	      }
	    } else {
	      this._privateKey = privateKeyOrNsec;
	    }
	    this._pubkey = getPublicKey(this._privateKey);
	    if (ndk) this._user = ndk.getUser({ pubkey: this._pubkey });
	    this._user ??= new NDKUser({ pubkey: this._pubkey });
	  }
	  /**
	   * Get the private key in hex form.
	   */
	  get privateKey() {
	    if (!this._privateKey) throw new Error("Not ready");
	    return bytesToHex(this._privateKey);
	  }
	  /**
	   * Get the public key in hex form.
	   */
	  get pubkey() {
	    if (!this._pubkey) throw new Error("Not ready");
	    return this._pubkey;
	  }
	  /**
	   * Get the private key in nsec form.
	   */
	  get nsec() {
	    if (!this._privateKey) throw new Error("Not ready");
	    return nip19_exports$1.nsecEncode(this._privateKey);
	  }
	  /**
	   * Get the public key in npub form.
	   */
	  get npub() {
	    if (!this._pubkey) throw new Error("Not ready");
	    return nip19_exports$1.npubEncode(this._pubkey);
	  }
	  /**
	   * Encrypt the private key with a password to ncryptsec format.
	   * @param password - The password to encrypt the private key.
	   * @param logn - The log2 of the scrypt N parameter (default: 16).
	   * @param ksb - The key security byte (0x00, 0x01, or 0x02, default: 0x02).
	   * @returns The encrypted private key in ncryptsec format.
	   *
	   * @example
	   * ```ts
	   * const signer = new NDKPrivateKeySigner(nsec);
	   * const ncryptsec = signer.encryptToNcryptsec("my-password");
	   * console.log('encrypted key:', ncryptsec);
	   * ```
	   */
	  encryptToNcryptsec(password, logn = 16, ksb = 2) {
	    if (!this._privateKey) throw new Error("Private key not available");
	    return encrypt$1(this._privateKey, password, logn, ksb);
	  }
	  /**
	   * Generate a new private key.
	   */
	  static generate() {
	    const privateKey = generateSecretKey();
	    return new _NDKPrivateKeySigner(privateKey);
	  }
	  /**
	   * Create a signer from an encrypted private key (ncryptsec) using a password.
	   * @param ncryptsec - The encrypted private key in ncryptsec format.
	   * @param password - The password to decrypt the private key.
	   * @param ndk - Optional NDK instance.
	   * @returns A new NDKPrivateKeySigner instance.
	   *
	   * @example
	   * ```ts
	   * const signer = NDKPrivateKeySigner.fromNcryptsec(
	   *   "ncryptsec1qgg9947rlpvqu76pj5ecreduf9jxhselq2nae2kghhvd5g7dgjtcxfqtd67p9m0w57lspw8gsq6yphnm8623nsl8xn9j4jdzz84zm3frztj3z7s35vpzmqf6ksu8r89qk5z2zxfmu5gv8th8wclt0h4p",
	   *   "my-password"
	   * );
	   * console.log('your pubkey is', signer.pubkey);
	   * ```
	   */
	  static fromNcryptsec(ncryptsec, password, ndk) {
	    const privateKeyBytes = decrypt$1(ncryptsec, password);
	    return new _NDKPrivateKeySigner(privateKeyBytes, ndk);
	  }
	  /**
	   * Noop in NDKPrivateKeySigner.
	   */
	  async blockUntilReady() {
	    return this._user;
	  }
	  /**
	   * Get the user.
	   */
	  async user() {
	    return this._user;
	  }
	  /**
	   * Get the user.
	   */
	  get userSync() {
	    return this._user;
	  }
	  async sign(event) {
	    if (!this._privateKey) {
	      throw Error("Attempted to sign without a private key");
	    }
	    return finalizeEvent(event, this._privateKey).sig;
	  }
	  async encryptionEnabled(scheme) {
	    const enabled = [];
	    if (!scheme || scheme === "nip04") enabled.push("nip04");
	    if (!scheme || scheme === "nip44") enabled.push("nip44");
	    return enabled;
	  }
	  async encrypt(recipient, value, scheme) {
	    if (!this._privateKey || !this.privateKey) {
	      throw Error("Attempted to encrypt without a private key");
	    }
	    const recipientHexPubKey = recipient.pubkey;
	    if (scheme === "nip44") {
	      const conversationKey = nip44_exports.v2.utils.getConversationKey(this._privateKey, recipientHexPubKey);
	      return await nip44_exports.v2.encrypt(value, conversationKey);
	    }
	    return await nip04_exports.encrypt(this._privateKey, recipientHexPubKey, value);
	  }
	  async decrypt(sender, value, scheme) {
	    if (!this._privateKey || !this.privateKey) {
	      throw Error("Attempted to decrypt without a private key");
	    }
	    const senderHexPubKey = sender.pubkey;
	    if (scheme === "nip44") {
	      const conversationKey = nip44_exports.v2.utils.getConversationKey(this._privateKey, senderHexPubKey);
	      return await nip44_exports.v2.decrypt(value, conversationKey);
	    }
	    return await nip04_exports.decrypt(this._privateKey, senderHexPubKey, value);
	  }
	  /**
	   * Serializes the signer's private key into a storable format.
	   * @returns A JSON string containing the type and the hex private key.
	   */
	  toPayload() {
	    if (!this._privateKey) throw new Error("Private key not available");
	    const payload = {
	      type: "private-key",
	      payload: this.privateKey
	      // Use the hex private key
	    };
	    return JSON.stringify(payload);
	  }
	  /**
	   * Deserializes the signer from a payload string.
	   * @param payloadString The JSON string obtained from toPayload().
	   * @param ndk Optional NDK instance.
	   * @returns An instance of NDKPrivateKeySigner.
	   */
	  static async fromPayload(payloadString, ndk) {
	    const payload = JSON.parse(payloadString);
	    if (payload.type !== "private-key") {
	      throw new Error(`Invalid payload type: expected 'private-key', got ${payload.type}`);
	    }
	    if (!payload.payload || typeof payload.payload !== "string") {
	      throw new Error("Invalid payload content for private-key signer");
	    }
	    return new _NDKPrivateKeySigner(payload.payload, ndk);
	  }
	};
	registerSigner("private-key", NDKPrivateKeySigner);

	// src/events/dedup.ts
	function dedup(event1, event2) {
	  if (event1.created_at > event2.created_at) {
	    return event1;
	  }
	  return event2;
	}

	// src/utils/get-users-relay-list.ts
	async function getRelayListForUser(pubkey, ndk) {
	  const list = await getRelayListForUsers([pubkey], ndk);
	  return list.get(pubkey);
	}
	async function getRelayListForUsers(pubkeys, ndk, skipCache = false, timeout = 1e3, relayHints) {
	  const pool = ndk.outboxPool || ndk.pool;
	  const set = /* @__PURE__ */ new Set();
	  for (const relay of pool.relays.values()) set.add(relay);
	  if (relayHints) {
	    for (const hints of relayHints.values()) {
	      for (const url of hints) {
	        const relay = pool.getRelay(url, true, true);
	        if (relay) set.add(relay);
	      }
	    }
	  }
	  const relayLists = /* @__PURE__ */ new Map();
	  const fromContactList = /* @__PURE__ */ new Map();
	  const relaySet = new NDKRelaySet(set, ndk);
	  if (ndk.cacheAdapter?.locking && !skipCache) {
	    const cachedList = await ndk.fetchEvents(
	      { kinds: [3, 10002], authors: Array.from(new Set(pubkeys)) },
	      { cacheUsage: "ONLY_CACHE" /* ONLY_CACHE */, subId: "ndk-relay-list-fetch" }
	    );
	    for (const relayList of cachedList) {
	      if (relayList.kind === 10002) relayLists.set(relayList.pubkey, NDKRelayList.from(relayList));
	    }
	    for (const relayList of cachedList) {
	      if (relayList.kind === 3) {
	        if (relayLists.has(relayList.pubkey)) continue;
	        const list = relayListFromKind3(ndk, relayList);
	        if (list) fromContactList.set(relayList.pubkey, list);
	      }
	    }
	    pubkeys = pubkeys.filter((pubkey) => !relayLists.has(pubkey) && !fromContactList.has(pubkey));
	  }
	  if (pubkeys.length === 0) return relayLists;
	  const relayListEvents = /* @__PURE__ */ new Map();
	  const contactListEvents = /* @__PURE__ */ new Map();
	  return new Promise((resolve) => {
	    let resolved = false;
	    const handleSubscription = async () => {
	      const subscribeOpts = {
	        closeOnEose: true,
	        pool,
	        groupable: true,
	        subId: "ndk-relay-list-fetch",
	        addSinceFromCache: true,
	        relaySet
	      };
	      if (relaySet) subscribeOpts.relaySet = relaySet;
	      ndk.subscribe({ kinds: [3, 10002], authors: pubkeys }, subscribeOpts, {
	        onEvent: (event) => {
	          if (event.kind === 10002 /* RelayList */) {
	            const existingEvent = relayListEvents.get(event.pubkey);
	            if (existingEvent && existingEvent.created_at > event.created_at) return;
	            relayListEvents.set(event.pubkey, event);
	          } else if (event.kind === 3 /* Contacts */) {
	            const existingEvent = contactListEvents.get(event.pubkey);
	            if (existingEvent && existingEvent.created_at > event.created_at) return;
	            contactListEvents.set(event.pubkey, event);
	          }
	        },
	        onEose: () => {
	          if (resolved) return;
	          resolved = true;
	          ndk.debug(
	            `[getRelayListForUsers] EOSE - relayListEvents: ${relayListEvents.size}, contactListEvents: ${contactListEvents.size}`
	          );
	          for (const event of relayListEvents.values()) {
	            relayLists.set(event.pubkey, NDKRelayList.from(event));
	          }
	          for (const pubkey of pubkeys) {
	            if (relayLists.has(pubkey)) continue;
	            const contactList = contactListEvents.get(pubkey);
	            if (!contactList) continue;
	            const list = relayListFromKind3(ndk, contactList);
	            if (list) relayLists.set(pubkey, list);
	          }
	          ndk.debug(
	            `[getRelayListForUsers] Returning ${relayLists.size} relay lists for ${pubkeys.length} pubkeys`
	          );
	          resolve(relayLists);
	        }
	      });
	      const hasDisconnectedRelays = Array.from(set).some(
	        (relay) => relay.status <= 2
	        // DISCONNECTING, DISCONNECTED, or RECONNECTING
	      );
	      const hasConnectingRelays = Array.from(set).some(
	        (relay) => relay.status === 4
	        // CONNECTING
	      );
	      let effectiveTimeout = timeout;
	      if (hasDisconnectedRelays || hasConnectingRelays) {
	        effectiveTimeout = timeout + 3e3;
	      }
	      ndk.debug(
	        `[getRelayListForUsers] Setting fallback timeout to ${effectiveTimeout}ms (disconnected: ${hasDisconnectedRelays}, connecting: ${hasConnectingRelays})`,
	        { pubkeys }
	      );
	      setTimeout(() => {
	        if (!resolved) {
	          resolved = true;
	          ndk.debug(`[getRelayListForUsers] Timeout reached, returning ${relayLists.size} relay lists`);
	          resolve(relayLists);
	        }
	      }, effectiveTimeout);
	    };
	    handleSubscription();
	  });
	}

	// src/outbox/tracker.ts
	var OutboxItem = class {
	  /**
	   * Type of item
	   */
	  type;
	  /**
	   * The relay URLs that are of interest to this item
	   */
	  relayUrlScores;
	  readRelays;
	  writeRelays;
	  constructor(type) {
	    this.type = type;
	    this.relayUrlScores = /* @__PURE__ */ new Map();
	    this.readRelays = /* @__PURE__ */ new Set();
	    this.writeRelays = /* @__PURE__ */ new Set();
	  }
	};
	var OutboxTracker = class extends libExports.EventEmitter {
	  data;
	  ndk;
	  debug;
	  constructor(ndk) {
	    super();
	    this.ndk = ndk;
	    this.debug = ndk.debug.extend("outbox-tracker");
	    this.data = new distExports.LRUCache({
	      maxSize: 1e5,
	      entryExpirationTimeInMS: 2 * 60 * 1e3
	    });
	  }
	  /**
	   * Adds a list of users to the tracker.
	   * @param items
	   * @param skipCache
	   */
	  async trackUsers(items, skipCache = false) {
	    const promises = [];
	    for (let i = 0; i < items.length; i += 400) {
	      const slice = items.slice(i, i + 400);
	      const pubkeys = slice.map((item) => getKeyFromItem(item)).filter((pubkey) => !this.data.has(pubkey));
	      if (pubkeys.length === 0) continue;
	      for (const pubkey of pubkeys) {
	        this.data.set(pubkey, new OutboxItem("user"));
	      }
	      const relayHints = /* @__PURE__ */ new Map();
	      for (const item of slice) {
	        if (item instanceof NDKUser && item.relayUrls.length > 0) {
	          relayHints.set(item.pubkey, item.relayUrls);
	        }
	      }
	      promises.push(
	        new Promise((resolve) => {
	          getRelayListForUsers(pubkeys, this.ndk, skipCache, 1e3, relayHints).then((relayLists) => {
	            this.debug(
	              `Received relay lists for ${relayLists.size} pubkeys out of ${pubkeys.length} requested`
	            );
	            for (const [pubkey, relayList] of relayLists) {
	              let outboxItem = this.data.get(pubkey);
	              outboxItem ??= new OutboxItem("user");
	              if (relayList) {
	                outboxItem.readRelays = new Set(normalize(relayList.readRelayUrls));
	                outboxItem.writeRelays = new Set(normalize(relayList.writeRelayUrls));
	                if (this.ndk.relayConnectionFilter) {
	                  for (const relayUrl of outboxItem.readRelays) {
	                    if (!this.ndk.relayConnectionFilter(relayUrl)) {
	                      outboxItem.readRelays.delete(relayUrl);
	                    }
	                  }
	                  for (const relayUrl of outboxItem.writeRelays) {
	                    if (!this.ndk.relayConnectionFilter(relayUrl)) {
	                      outboxItem.writeRelays.delete(relayUrl);
	                    }
	                  }
	                }
	                this.data.set(pubkey, outboxItem);
	                this.emit("user:relay-list-updated", pubkey, outboxItem);
	                this.debug(
	                  `Adding ${outboxItem.readRelays.size} read relays and ${outboxItem.writeRelays.size} write relays for ${pubkey}`,
	                  relayList?.rawEvent()
	                );
	              }
	            }
	          }).finally(resolve);
	        })
	      );
	    }
	    return Promise.all(promises);
	  }
	  /**
	   *
	   * @param key
	   * @param score
	   */
	  track(item, type, _skipCache = true) {
	    const key = getKeyFromItem(item);
	    type ??= getTypeFromItem(item);
	    let outboxItem = this.data.get(key);
	    if (!outboxItem) {
	      outboxItem = new OutboxItem(type);
	      if (item instanceof NDKUser) {
	        this.trackUsers([item]);
	      }
	    }
	    return outboxItem;
	  }
	};
	function getKeyFromItem(item) {
	  if (item instanceof NDKUser) {
	    return item.pubkey;
	  }
	  return item;
	}
	function getTypeFromItem(item) {
	  if (item instanceof NDKUser) {
	    return "user";
	  }
	  return "kind";
	}

	// src/relay/sets/utils.ts
	function correctRelaySet(relaySet, pool) {
	  const connectedRelays = pool.connectedRelays();
	  const includesConnectedRelay = Array.from(relaySet.relays).some((relay) => {
	    return connectedRelays.map((r) => r.url).includes(relay.url);
	  });
	  if (!includesConnectedRelay) {
	    for (const relay of connectedRelays) {
	      relaySet.addRelay(relay);
	    }
	  }
	  if (connectedRelays.length === 0) {
	    for (const relay of pool.relays.values()) {
	      relaySet.addRelay(relay);
	    }
	  }
	  return relaySet;
	}
	var NDKSubscriptionManager = class {
	  subscriptions;
	  // Use LRU cache instead of unbounded Map to prevent memory leaks
	  seenEvents = new distExports.LRUCache({
	    maxSize: 1e4,
	    // Keep last 10k events
	    entryExpirationTimeInMS: 5 * 60 * 1e3
	    // 5 minutes
	  });
	  constructor() {
	    this.subscriptions = /* @__PURE__ */ new Map();
	  }
	  add(sub) {
	    this.subscriptions.set(sub.internalId, sub);
	    if (sub.onStopped) ;
	    sub.onStopped = () => {
	      this.subscriptions.delete(sub.internalId);
	    };
	    sub.on("close", () => {
	      this.subscriptions.delete(sub.internalId);
	    });
	  }
	  seenEvent(eventId, relay) {
	    const current = this.seenEvents.get(eventId) || [];
	    if (!current.some((r) => r.url === relay.url)) {
	      current.push(relay);
	    }
	    this.seenEvents.set(eventId, current);
	  }
	  /**
	   * Whenever an event comes in, this function is called.
	   * This function matches the received event against all the
	   * known (i.e. active) NDKSubscriptions, and if it matches,
	   * it sends the event to the subscription.
	   *
	   * This is the single place in the codebase that matches
	   * incoming events with parties interested in the event.
	   *
	   * This is also what allows for reactivity in NDK apps, such that
	   * whenever an active subscription receives an event that some
	   * other active subscription would want to receive, both receive it.
	   *
	   * TODO This also allows for subscriptions that overlap in meaning
	   * to be collapsed into one.
	   *
	   * I.e. if a subscription with filter: kinds: [1], authors: [alice]
	   * is created and EOSEs, and then a subsequent subscription with
	   * kinds: [1], authors: [alice] is created, once the second subscription
	   * EOSEs we can safely close it, increment its refCount and close it,
	   * and when the first subscription receives a new event from Alice this
	   * code will make the second subscription receive the event even though
	   * it has no active subscription on a relay.
	   * @param event Raw event received from a relay
	   * @param relay Relay that sent the event
	   * @param optimisticPublish Whether the event is coming from an optimistic publish
	   */
	  dispatchEvent(event, relay, optimisticPublish = false) {
	    if (relay) this.seenEvent(event.id, relay);
	    const subscriptions = this.subscriptions.values();
	    const matchingSubs = [];
	    for (const sub of subscriptions) {
	      if (matchFilters(sub.filters, event)) {
	        matchingSubs.push(sub);
	      }
	    }
	    for (const sub of matchingSubs) {
	      if (sub.exclusiveRelay && sub.relaySet) {
	        let shouldAccept = false;
	        if (optimisticPublish) {
	          shouldAccept = !sub.skipOptimisticPublishEvent;
	        } else if (!relay) {
	          const eventOnRelays = this.seenEvents.get(event.id) || [];
	          shouldAccept = eventOnRelays.some((r) => sub.relaySet.relays.has(r));
	        } else {
	          shouldAccept = sub.relaySet.relays.has(relay);
	        }
	        if (!shouldAccept) {
	          sub.debug.extend("exclusive-relay")(
	            "Rejected event %s from %s (relay not in exclusive set)",
	            event.id,
	            relay?.url || (optimisticPublish ? "optimistic" : "cache")
	          );
	          continue;
	        }
	      }
	      sub.eventReceived(event, relay, false, optimisticPublish);
	    }
	  }
	};
	var debug6 = createDebug5("ndk:active-user");
	async function getUserRelayList(user) {
	  if (!this.autoConnectUserRelays) return;
	  const userRelays = await getRelayListForUser(user.pubkey, this);
	  if (!userRelays) return;
	  for (const url of userRelays.relays) {
	    let relay = this.pool.relays.get(url);
	    if (!relay) {
	      relay = new NDKRelay(url, this.relayAuthDefaultPolicy, this);
	      this.pool.addRelay(relay);
	    }
	  }
	  debug6("Connected to %d user relays", userRelays.relays.length);
	  return userRelays;
	}
	async function setActiveUser(user) {
	  if (!this.autoConnectUserRelays) return;
	  const pool = this.outboxPool || this.pool;
	  if (pool.connectedRelays.length > 0) {
	    await getUserRelayList.call(this, user);
	  } else {
	    pool.once("connect", async () => {
	      await getUserRelayList.call(this, user);
	    });
	  }
	}
	function getEntity(entity) {
	  try {
	    const decoded = nip19_exports$1.decode(entity);
	    if (decoded.type === "npub") return npub(this, decoded.data);
	    if (decoded.type === "nprofile") return nprofile(this, decoded.data);
	    return decoded;
	  } catch (_e) {
	    return null;
	  }
	}
	function npub(ndk, pubkey) {
	  return ndk.getUser({ pubkey });
	}
	function nprofile(ndk, profile) {
	  const user = ndk.getUser({ pubkey: profile.pubkey });
	  if (profile.relays) user.relayUrls = profile.relays;
	  return user;
	}

	// src/ndk/fetch-event-from-tag.ts
	function isValidHint(hint) {
	  if (!hint || hint === "") return false;
	  try {
	    new URL(hint);
	    return true;
	  } catch (_e) {
	    return false;
	  }
	}
	async function fetchEventFromTag(tag, originalEvent, subOpts, fallback = {
	  type: "timeout"
	}) {
	  const d4 = this.debug.extend("fetch-event-from-tag");
	  const [_, id, hint] = tag;
	  subOpts = {};
	  d4("fetching event from tag", tag, subOpts, fallback);
	  const authorRelays = getRelaysForSync(this, originalEvent.pubkey);
	  if (authorRelays && authorRelays.size > 0) {
	    d4("fetching event from author relays %o", Array.from(authorRelays));
	    const relaySet2 = NDKRelaySet.fromRelayUrls(Array.from(authorRelays), this);
	    const event2 = await this.fetchEvent(id, subOpts, relaySet2);
	    if (event2) return event2;
	  } else {
	    d4("no author relays found for %s", originalEvent.pubkey, originalEvent);
	  }
	  const relaySet = calculateRelaySetsFromFilters(this, [{ ids: [id] }], this.pool);
	  d4("fetching event without relay hint", relaySet);
	  const event = await this.fetchEvent(id, subOpts);
	  if (event) return event;
	  if (hint && hint !== "") {
	    const event2 = await this.fetchEvent(id, subOpts, this.pool.getRelay(hint, true, true, [{ ids: [id] }]));
	    if (event2) return event2;
	  }
	  let result;
	  const relay = isValidHint(hint) ? this.pool.getRelay(hint, false, true, [{ ids: [id] }]) : void 0;
	  const fetchMaybeWithRelayHint = new Promise((resolve) => {
	    this.fetchEvent(id, subOpts, relay).then(resolve);
	  });
	  if (!isValidHint(hint) || fallback.type === "none") {
	    return fetchMaybeWithRelayHint;
	  }
	  const fallbackFetchPromise = new Promise(async (resolve) => {
	    const fallbackRelaySet = fallback.relaySet;
	    const timeout = fallback.timeout ?? 1500;
	    const timeoutPromise = new Promise((resolve2) => setTimeout(resolve2, timeout));
	    if (fallback.type === "timeout") await timeoutPromise;
	    if (result) {
	      resolve(result);
	    } else {
	      d4("fallback fetch triggered");
	      const fallbackEvent = await this.fetchEvent(id, subOpts, fallbackRelaySet);
	      resolve(fallbackEvent);
	    }
	  });
	  switch (fallback.type) {
	    case "timeout":
	      return Promise.race([fetchMaybeWithRelayHint, fallbackFetchPromise]);
	    case "eose":
	      result = await fetchMaybeWithRelayHint;
	      if (result) return result;
	      return fallbackFetchPromise;
	  }
	}

	// src/ndk/queue/index.ts
	var Queue = class {
	  queue = [];
	  maxConcurrency;
	  processing = /* @__PURE__ */ new Set();
	  promises = /* @__PURE__ */ new Map();
	  constructor(_name, maxConcurrency) {
	    this.maxConcurrency = maxConcurrency;
	  }
	  add(item) {
	    if (this.promises.has(item.id)) {
	      return this.promises.get(item.id);
	    }
	    const promise = new Promise((resolve, reject) => {
	      this.queue.push({
	        ...item,
	        func: () => item.func().then(
	          (result) => {
	            resolve(result);
	            return result;
	          },
	          (error) => {
	            reject(error);
	            throw error;
	          }
	        )
	      });
	      this.process();
	    });
	    this.promises.set(item.id, promise);
	    promise.finally(() => {
	      this.promises.delete(item.id);
	      this.processing.delete(item.id);
	      this.process();
	    });
	    return promise;
	  }
	  process() {
	    if (this.processing.size >= this.maxConcurrency || this.queue.length === 0) {
	      return;
	    }
	    const item = this.queue.shift();
	    if (!item || this.processing.has(item.id)) {
	      return;
	    }
	    this.processing.add(item.id);
	    item.func();
	  }
	  clear() {
	    this.queue = [];
	  }
	  clearProcessing() {
	    this.processing.clear();
	  }
	  clearAll() {
	    this.clear();
	    this.clearProcessing();
	  }
	  length() {
	    return this.queue.length;
	  }
	};

	// src/ndk/index.ts
	var DEFAULT_OUTBOX_RELAYS = ["wss://purplepag.es/", "wss://nos.lol/"];
	var NDK = class extends libExports.EventEmitter {
	  _explicitRelayUrls;
	  pool;
	  outboxPool;
	  _signer;
	  _activeUser;
	  cacheAdapter;
	  debug;
	  devWriteRelaySet;
	  outboxTracker;
	  muteFilter;
	  relayConnectionFilter;
	  clientName;
	  clientNip89;
	  queuesZapConfig;
	  queuesNip05;
	  asyncSigVerification = false;
	  initialValidationRatio = 1;
	  lowestValidationRatio = 0.1;
	  validationRatioFn;
	  filterValidationMode = "validate";
	  subManager;
	  aiGuardrails;
	  /**
	   * Private storage for the signature verification function
	   */
	  _signatureVerificationFunction;
	  /**
	   * Private storage for the signature verification worker
	   */
	  _signatureVerificationWorker;
	  /**
	   * Rolling total of time spent (in ms) performing signature verifications.
	   * Users can read this to monitor or display aggregate verification cost.
	   */
	  signatureVerificationTimeMs = 0;
	  publishingFailureHandled = false;
	  pools = [];
	  /**
	   * Default relay-auth policy that will be used when a relay requests authentication,
	   * if no other policy is specified for that relay.
	   *
	   * @example Disconnect from relays that request authentication:
	   * ```typescript
	   * ndk.relayAuthDefaultPolicy = NDKAuthPolicies.disconnect(ndk.pool);
	   * ```
	   *
	   * @example Sign in to relays that request authentication:
	   * ```typescript
	   * ndk.relayAuthDefaultPolicy = NDKAuthPolicies.signIn({ndk})
	   * ```
	   *
	   * @example Sign in to relays that request authentication, asking the user for confirmation:
	   * ```typescript
	   * ndk.relayAuthDefaultPolicy = (relay: NDKRelay) => {
	   *     const signIn = NDKAuthPolicies.signIn({ndk});
	   *     if (confirm(`Relay ${relay.url} is requesting authentication, do you want to sign in?`)) {
	   *        signIn(relay);
	   *     }
	   * }
	   * ```
	   */
	  relayAuthDefaultPolicy;
	  /**
	   * Fetch function to use for HTTP requests.
	   *
	   * @example
	   * ```typescript
	   * import fetch from "node-fetch";
	   *
	   * ndk.httpFetch = fetch;
	   * ```
	   */
	  httpFetch;
	  /**
	   * Provide a caller function to receive all networking traffic from relays
	   */
	  netDebug;
	  autoConnectUserRelays = true;
	  _wallet;
	  walletConfig;
	  constructor(opts = {}) {
	    super();
	    this.debug = opts.debug || createDebug5("ndk");
	    this.netDebug = opts.netDebug;
	    this._explicitRelayUrls = opts.explicitRelayUrls || [];
	    this.subManager = new NDKSubscriptionManager();
	    this.pool = new NDKPool(opts.explicitRelayUrls || [], this);
	    this.pool.name = "Main";
	    this.pool.on("relay:auth", async (relay, challenge) => {
	      if (this.relayAuthDefaultPolicy) {
	        await this.relayAuthDefaultPolicy(relay, challenge);
	      }
	    });
	    this.autoConnectUserRelays = opts.autoConnectUserRelays ?? true;
	    this.clientName = opts.clientName;
	    this.clientNip89 = opts.clientNip89;
	    this.relayAuthDefaultPolicy = opts.relayAuthDefaultPolicy;
	    if (!(opts.enableOutboxModel === false)) {
	      this.outboxPool = new NDKPool(opts.outboxRelayUrls || DEFAULT_OUTBOX_RELAYS, this, {
	        debug: this.debug.extend("outbox-pool"),
	        name: "Outbox Pool"
	      });
	      this.outboxTracker = new OutboxTracker(this);
	      this.outboxTracker.on("user:relay-list-updated", (pubkey, _outboxItem) => {
	        this.debug(`Outbox relay list updated for ${pubkey}`);
	        for (const subscription of this.subManager.subscriptions.values()) {
	          const isRelevant = subscription.filters.some((filter) => filter.authors?.includes(pubkey));
	          if (isRelevant && typeof subscription.refreshRelayConnections === "function") {
	            this.debug(`Refreshing relay connections for subscription ${subscription.internalId}`);
	            subscription.refreshRelayConnections();
	          }
	        }
	      });
	    }
	    this.signer = opts.signer;
	    this.cacheAdapter = opts.cacheAdapter;
	    this.muteFilter = opts.muteFilter;
	    this.relayConnectionFilter = opts.relayConnectionFilter;
	    if (opts.devWriteRelayUrls) {
	      this.devWriteRelaySet = NDKRelaySet.fromRelayUrls(opts.devWriteRelayUrls, this);
	    }
	    this.queuesZapConfig = new Queue("zaps", 3);
	    this.queuesNip05 = new Queue("nip05", 10);
	    if (opts.signatureVerificationWorker) {
	      this.signatureVerificationWorker = opts.signatureVerificationWorker;
	    }
	    if (opts.signatureVerificationFunction) {
	      this.signatureVerificationFunction = opts.signatureVerificationFunction;
	    }
	    this.initialValidationRatio = opts.initialValidationRatio || 1;
	    this.lowestValidationRatio = opts.lowestValidationRatio || 0.1;
	    this.validationRatioFn = opts.validationRatioFn || this.defaultValidationRatioFn;
	    this.filterValidationMode = opts.filterValidationMode || "validate";
	    this.aiGuardrails = new AIGuardrails(opts.aiGuardrails || false);
	    this.aiGuardrails.ndkInstantiated(this);
	    try {
	      this.httpFetch = fetch;
	    } catch {
	    }
	  }
	  set explicitRelayUrls(urls) {
	    this._explicitRelayUrls = urls.map(normalizeRelayUrl);
	    this.pool.relayUrls = urls;
	  }
	  get explicitRelayUrls() {
	    return this._explicitRelayUrls || [];
	  }
	  /**
	   * Set a Web Worker for signature verification.
	   *
	   * This method initializes the worker and sets the asyncSigVerification flag.
	   * The actual verification is handled by the verifySignatureAsync function in signature.ts,
	   * which will use the worker if available.
	   */
	  set signatureVerificationWorker(worker2) {
	    this._signatureVerificationWorker = worker2;
	    if (worker2) {
	      signatureVerificationInit(worker2);
	      this.asyncSigVerification = true;
	    } else {
	      this.asyncSigVerification = false;
	    }
	  }
	  /**
	   * Set a custom signature verification function.
	   *
	   * This method is particularly useful for platforms that don't support Web Workers,
	   * such as React Native.
	   *
	   * When a function is provided, it will be used for signature verification
	   * instead of the default worker-based verification. This enables signature
	   * verification on platforms where Web Workers are not available.
	   *
	   * @example
	   * ```typescript
	   * import { verifySignatureAsync } from "@nostr-dev-kit/mobile";
	   *
	   * ndk.signatureVerificationFunction = verifySignatureAsync;
	   * ```
	   */
	  set signatureVerificationFunction(fn) {
	    this._signatureVerificationFunction = fn;
	    this.asyncSigVerification = !!fn;
	  }
	  /**
	   * Get the custom signature verification function
	   */
	  get signatureVerificationFunction() {
	    return this._signatureVerificationFunction;
	  }
	  /**
	   * Adds an explicit relay to the pool.
	   * @param url
	   * @param relayAuthPolicy Authentication policy to use if different from the default
	   * @param connect Whether to connect to the relay automatically
	   * @returns
	   */
	  addExplicitRelay(urlOrRelay, relayAuthPolicy, connect = true) {
	    let relay;
	    if (typeof urlOrRelay === "string") {
	      relay = new NDKRelay(urlOrRelay, relayAuthPolicy, this);
	    } else {
	      relay = urlOrRelay;
	    }
	    this.pool.addRelay(relay, connect);
	    this.explicitRelayUrls?.push(relay.url);
	    return relay;
	  }
	  toJSON() {
	    return { relayCount: this.pool.relays.size }.toString();
	  }
	  get activeUser() {
	    return this._activeUser;
	  }
	  /**
	   * Sets the active user for this NDK instance, typically this will be
	   * called when assigning a signer to the NDK instance.
	   *
	   * This function will automatically connect to the user's relays if
	   * `autoConnectUserRelays` is set to true.
	   */
	  set activeUser(user) {
	    const differentUser = this._activeUser?.pubkey !== user?.pubkey;
	    this._activeUser = user;
	    if (differentUser) {
	      this.emit("activeUser:change", user);
	    }
	    if (user && differentUser) {
	      setActiveUser.call(this, user);
	    }
	  }
	  get signer() {
	    return this._signer;
	  }
	  set signer(newSigner) {
	    this._signer = newSigner;
	    if (newSigner) this.emit("signer:ready", newSigner);
	    newSigner?.user().then((user) => {
	      user.ndk = this;
	      this.activeUser = user;
	    });
	  }
	  /**
	   * Connect to relays with optional timeout.
	   * If the timeout is reached, the connection will be continued to be established in the background.
	   */
	  async connect(timeoutMs) {
	    if (this._signer && this.autoConnectUserRelays) {
	      this.debug(
	        "Attempting to connect to user relays specified by signer %o",
	        await this._signer.relays?.(this)
	      );
	      if (this._signer.relays) {
	        const relays = await this._signer.relays(this);
	        relays.forEach((relay) => this.pool.addRelay(relay));
	      }
	    }
	    const connections = [this.pool.connect(timeoutMs)];
	    if (this.outboxPool) {
	      connections.push(this.outboxPool.connect(timeoutMs));
	    }
	    if (this.cacheAdapter?.initializeAsync) {
	      connections.push(this.cacheAdapter.initializeAsync(this));
	    }
	    return Promise.allSettled(connections).then(() => {
	    });
	  }
	  /**
	   * Centralized method to report an invalid signature, identifying the relay that provided it.
	   * A single invalid signature means the relay is considered malicious.
	   * All invalid signature detections (synchronous or asynchronous) should delegate to this method.
	   *
	   * @param event The event with an invalid signature
	   * @param relay The relay that provided the invalid signature
	   */
	  reportInvalidSignature(event, relay) {
	    this.debug(`Invalid signature detected for event ${event.id}${relay ? ` from relay ${relay.url}` : ""}`);
	    this.emit("event:invalid-sig", event, relay);
	  }
	  /**
	   * Default function to calculate validation ratio based on historical validation results.
	   * The more events validated successfully, the lower the ratio goes (down to the minimum).
	   */
	  defaultValidationRatioFn(_relay, validatedCount, _nonValidatedCount) {
	    if (validatedCount < 10) return this.initialValidationRatio;
	    const trustFactor = Math.min(validatedCount / 100, 1);
	    const calculatedRatio = this.initialValidationRatio * (1 - trustFactor) + this.lowestValidationRatio * trustFactor;
	    return Math.max(calculatedRatio, this.lowestValidationRatio);
	  }
	  /**
	   * Get a NDKUser object
	   *
	   * @deprecated Use `fetchUser` instead - this method will be removed in the next major version
	   * @param opts - User parameters object or a string (npub, nprofile, or hex pubkey)
	   * @returns NDKUser instance
	   *
	   * @example
	   * ```typescript
	   * // Using parameters object
	   * const user1 = ndk.getUser({ pubkey: "hex..." });
	   *
	   * // Using npub string
	   * const user2 = ndk.getUser("npub1...");
	   *
	   * // Using nprofile string (includes relay hints)
	   * const user3 = ndk.getUser("nprofile1...");
	   *
	   * // Using hex pubkey directly
	   * const user4 = ndk.getUser("deadbeef...");
	   * ```
	   */
	  getUser(opts) {
	    if (typeof opts === "string") {
	      if (opts.startsWith("npub1")) {
	        const { type, data } = nip19_exports$1.decode(opts);
	        if (type !== "npub") throw new Error(`Invalid npub: ${opts}`);
	        return this.getUser({ pubkey: data });
	      } else if (opts.startsWith("nprofile1")) {
	        const { type, data } = nip19_exports$1.decode(opts);
	        if (type !== "nprofile") throw new Error(`Invalid nprofile: ${opts}`);
	        return this.getUser({
	          pubkey: data.pubkey,
	          relayUrls: data.relays
	        });
	      } else {
	        return this.getUser({ pubkey: opts });
	      }
	    }
	    const user = new NDKUser(opts);
	    user.ndk = this;
	    return user;
	  }
	  /**
	   * Get a NDKUser from a NIP05
	   * @deprecated Use `fetchUser` instead - this method will be removed in the next major version
	   * @param nip05 NIP-05 ID
	   * @param skipCache Skip cache
	   * @returns
	   */
	  async getUserFromNip05(nip05, skipCache = false) {
	    return NDKUser.fromNip05(nip05, this, skipCache);
	  }
	  /**
	   * Fetch a NDKUser from a string identifier
	   *
	   * Supports multiple input formats:
	   * - NIP-05 identifiers (e.g., "pablo@test.com" or "test.com")
	   * - npub (NIP-19 encoded public key)
	   * - nprofile (NIP-19 encoded profile with optional relay hints)
	   * - Hex public key
	   *
	   * @param input - String identifier for the user (NIP-05, npub, nprofile, or hex pubkey)
	   * @param skipCache - Skip cache when resolving NIP-05 (only applies to NIP-05 lookups)
	   * @returns Promise resolving to NDKUser or undefined if not found
	   *
	   * @example
	   * ```typescript
	   * // Using NIP-05
	   * const user1 = await ndk.fetchUser("pablo@test.com");
	   * const user2 = await ndk.fetchUser("test.com"); // defaults to _@test.com
	   *
	   * // Using npub
	   * const user3 = await ndk.fetchUser("npub1...");
	   *
	   * // Using nprofile (includes relay hints)
	   * const user4 = await ndk.fetchUser("nprofile1...");
	   *
	   * // Using hex pubkey
	   * const user5 = await ndk.fetchUser("deadbeef...");
	   * ```
	   */
	  async fetchUser(input, skipCache = false) {
	    if (isValidNip05(input)) {
	      return NDKUser.fromNip05(input, this, skipCache);
	    } else if (input.startsWith("npub1")) {
	      const { type, data } = nip19_exports$1.decode(input);
	      if (type !== "npub") throw new Error(`Invalid npub: ${input}`);
	      const user = new NDKUser({ pubkey: data });
	      user.ndk = this;
	      return user;
	    } else if (input.startsWith("nprofile1")) {
	      const { type, data } = nip19_exports$1.decode(input);
	      if (type !== "nprofile") throw new Error(`Invalid nprofile: ${input}`);
	      const user = new NDKUser({
	        pubkey: data.pubkey,
	        relayUrls: data.relays
	      });
	      user.ndk = this;
	      return user;
	    } else {
	      const user = new NDKUser({ pubkey: input });
	      user.ndk = this;
	      return user;
	    }
	  }
	  /**
	   * Creates and starts a new subscription.
	   *
	   * Subscriptions automatically start unless `autoStart` is set to `false`.
	   * You can control automatic closing on EOSE via `opts.closeOnEose`.
	   *
	   * @param filters - A single NDKFilter object or an array of filters.
	   * @param opts - Optional NDKSubscriptionOptions to customize behavior (e.g., caching, grouping).
	   * @param handlers - Optional handlers for subscription events. Passing handlers is the preferred method of using ndk.subscribe.
	   *   - `onEvent`: Called for each event received.
	   *  - `onEvents`: Called once with an array of events when the subscription starts (from the cache).
	   *  - `onEose`: Called when the subscription receives EOSE.
	   *  For backwards compatibility, this third parameter also accepts a relaySet, the relaySet should be passed via `opts.relaySet`.
	   *
	   * @param _autoStart - For backwards compatibility, this can be a boolean indicating whether to start the subscription immediately.
	   *  This parameter is deprecated and will be removed in a future version.
	   *   - `false`: Creates the subscription but does not start it (call `subscription.start()` manually).
	   * @returns The created NDKSubscription instance.
	   *
	   * @example Basic subscription
	   * ```typescript
	   * const sub = ndk.subscribe(
	   *   { kinds: [1], authors: [pubkey] },
	   *   {
	   *     onEvent: (event) => console.log("Kind 1 event:", event.content)
	   *   }
	   * );
	   * ```
	   *
	   * @example Subscription with options and direct handlers
	   * ```typescript
	   * const sub = ndk.subscribe(
	   *   { kinds: [0], authors: [pubkey] },
	   *   { closeOnEose: true, cacheUsage: NDKSubscriptionCacheUsage.PARALLEL },
	   *   undefined, // Use default relay set calculation
	   *   {
	   *     onEvents: (events) => { // Renamed parameter
	   *       if (events.length > 0) {
	   *         console.log(`Got ${events.length} profile events from cache:`, events[0].content);
	   *       }
	   *     },
	   *     onEvent: (event) => { // Renamed parameter
	   *       console.log("Got profile update from relay:", event.content); // Clarified source
	   *     },
	   *     onEose: () => console.log("Profile subscription finished.")
	   *   }
	   * );
	   * ```
	   *
	   * @since 2.13.0 `relaySet` parameter removed; pass `relaySet` or `relayUrls` via `opts`.
	   */
	  subscribe(filters, opts, autoStartOrRelaySet = true, _autoStart = true) {
	    let _relaySet = opts?.relaySet;
	    let autoStart = _autoStart;
	    if (autoStartOrRelaySet instanceof NDKRelaySet) {
	      console.warn("relaySet is deprecated, use opts.relaySet instead. This will be removed in version v2.14.0");
	      _relaySet = autoStartOrRelaySet;
	      autoStart = _autoStart;
	    } else if (typeof autoStartOrRelaySet === "boolean" || typeof autoStartOrRelaySet === "object") {
	      autoStart = autoStartOrRelaySet;
	    }
	    let eventsHandler;
	    const finalOpts = { relaySet: _relaySet, ...opts };
	    if (autoStart && typeof autoStart === "object") {
	      if (autoStart.onEvent) finalOpts.onEvent = autoStart.onEvent;
	      if (autoStart.onEose) finalOpts.onEose = autoStart.onEose;
	      if (autoStart.onClose) finalOpts.onClose = autoStart.onClose;
	      if (autoStart.onEvents) eventsHandler = autoStart.onEvents;
	    }
	    const subscription = new NDKSubscription(this, filters, finalOpts);
	    this.subManager.add(subscription);
	    this.aiGuardrails?.subscription?.created(Array.isArray(filters) ? filters : [filters], finalOpts);
	    const pool = subscription.pool;
	    if (subscription.relaySet) {
	      for (const relay of subscription.relaySet.relays) {
	        pool.useTemporaryRelay(relay, void 0, subscription.filters);
	      }
	    }
	    if (this.outboxPool && subscription.hasAuthorsFilter()) {
	      const authors = subscription.filters.filter((filter) => filter.authors && filter.authors?.length > 0).flatMap((filter) => filter.authors);
	      this.outboxTracker?.trackUsers(authors);
	    }
	    if (autoStart) {
	      setTimeout(async () => {
	        if (this.cacheAdapter?.initializeAsync && !this.cacheAdapter.ready) {
	          await this.cacheAdapter.initializeAsync(this);
	        }
	        const cachedEvents = subscription.start(!eventsHandler);
	        if (cachedEvents && cachedEvents.length > 0 && !!eventsHandler) eventsHandler(cachedEvents);
	      }, 0);
	    }
	    return subscription;
	  }
	  /**
	   * Attempts to fetch an event from a tag, following relay hints and
	   * other best practices.
	   * @param tag Tag to fetch the event from
	   * @param originalEvent Event where the tag came from
	   * @param subOpts Subscription options to use when fetching the event
	   * @param fallback Fallback options to use when the hint relay doesn't respond
	   * @returns
	   */
	  fetchEventFromTag = fetchEventFromTag.bind(this);
	  /**
	   * Fetch an event from the cache synchronously.
	   * @param idOrFilter event id in bech32 format or filter
	   * @returns events from the cache or null if the cache is empty
	   */
	  fetchEventSync(idOrFilter) {
	    if (!this.cacheAdapter) throw new Error("Cache adapter not set");
	    let filters;
	    if (typeof idOrFilter === "string") filters = [filterFromId(idOrFilter)];
	    else filters = idOrFilter;
	    const sub = new NDKSubscription(this, filters);
	    const events = this.cacheAdapter.query(sub);
	    if (events instanceof Promise) throw new Error("Cache adapter is async");
	    return events.map((e) => {
	      e.ndk = this;
	      return e;
	    });
	  }
	  /**
	   * Fetch a single event.
	   *
	   * @param idOrFilter event id in bech32 format or filter
	   * @param opts subscription options
	   * @param relaySetOrRelay explicit relay set to use
	   */
	  async fetchEvent(idOrFilter, opts, relaySetOrRelay) {
	    let filters;
	    let relaySet;
	    if (relaySetOrRelay instanceof NDKRelay) {
	      relaySet = new NDKRelaySet(/* @__PURE__ */ new Set([relaySetOrRelay]), this);
	    } else if (relaySetOrRelay instanceof NDKRelaySet) {
	      relaySet = relaySetOrRelay;
	    }
	    if (!relaySetOrRelay && typeof idOrFilter === "string") {
	      if (!isNip33AValue(idOrFilter)) {
	        const relays = relaysFromBech32(idOrFilter, this);
	        if (relays.length > 0) {
	          relaySet = new NDKRelaySet(new Set(relays), this);
	          relaySet = correctRelaySet(relaySet, this.pool);
	        }
	      }
	    }
	    if (typeof idOrFilter === "string") {
	      filters = [filterFromId(idOrFilter)];
	    } else if (Array.isArray(idOrFilter)) {
	      filters = idOrFilter;
	    } else {
	      filters = [idOrFilter];
	    }
	    if (typeof idOrFilter !== "string") {
	      this.aiGuardrails?.ndk?.fetchingEvents(filters);
	    }
	    if (filters.length === 0) {
	      throw new Error(`Invalid filter: ${JSON.stringify(idOrFilter)}`);
	    }
	    return new Promise((resolve, reject) => {
	      let fetchedEvent = null;
	      const subscribeOpts = {
	        ...opts || {},
	        closeOnEose: true
	      };
	      if (relaySet) subscribeOpts.relaySet = relaySet;
	      const t2 = setTimeout(() => {
	        s.stop();
	        this.aiGuardrails["_nextCallDisabled"] = null;
	        resolve(fetchedEvent);
	      }, 1e4);
	      const s = this.subscribe(filters, subscribeOpts, {
	        onEvent: (event) => {
	          event.ndk = this;
	          if (!event.isReplaceable()) {
	            clearTimeout(t2);
	            this.aiGuardrails["_nextCallDisabled"] = null;
	            resolve(event);
	          } else if (!fetchedEvent || fetchedEvent.created_at < event.created_at) {
	            fetchedEvent = event;
	          }
	        },
	        onEose: () => {
	          clearTimeout(t2);
	          this.aiGuardrails["_nextCallDisabled"] = null;
	          resolve(fetchedEvent);
	        }
	      });
	    });
	  }
	  /**
	   * Fetch events
	   */
	  async fetchEvents(filters, opts, relaySet) {
	    this.aiGuardrails?.ndk?.fetchingEvents(filters, opts);
	    return new Promise((resolve) => {
	      const events = /* @__PURE__ */ new Map();
	      const subscribeOpts = {
	        ...opts || {},
	        closeOnEose: true
	      };
	      if (relaySet) subscribeOpts.relaySet = relaySet;
	      const onEvent = (event) => {
	        let _event;
	        if (!(event instanceof NDKEvent)) _event = new NDKEvent(void 0, event);
	        else _event = event;
	        const dedupKey = _event.deduplicationKey();
	        const existingEvent = events.get(dedupKey);
	        if (existingEvent) {
	          _event = dedup(existingEvent, _event);
	        }
	        _event.ndk = this;
	        events.set(dedupKey, _event);
	      };
	      this.subscribe(filters, {
	        ...subscribeOpts,
	        onEvent,
	        onEose: () => {
	          this.aiGuardrails["_nextCallDisabled"] = null;
	          resolve(new Set(events.values()));
	        }
	      });
	    });
	  }
	  /**
	   * Ensures that a signer is available to sign an event.
	   */
	  assertSigner() {
	    if (!this.signer) {
	      this.emit("signer:required");
	      throw new Error("Signer required");
	    }
	  }
	  getEntity = getEntity.bind(this);
	  /**
	   * Temporarily disable AI guardrails for the next method call.
	   *
	   * @param ids - Optional guardrail IDs to disable. If omitted, all guardrails are disabled for the next call.
	   *              Can be a single string or an array of strings.
	   * @returns This NDK instance for method chaining
	   *
	   * @example Disable all guardrails for one call
	   * ```typescript
	   * ndk.guardrailOff().fetchEvents({ kinds: [1] });
	   * ```
	   *
	   * @example Disable specific guardrail
	   * ```typescript
	   * ndk.guardrailOff('fetch-events-usage').fetchEvents({ kinds: [1] });
	   * ```
	   *
	   * @example Disable multiple guardrails
	   * ```typescript
	   * ndk.guardrailOff(['fetch-events-usage', 'filter-large-limit']).fetchEvents({ kinds: [1], limit: 5000 });
	   * ```
	   */
	  guardrailOff(ids) {
	    if (!ids) {
	      this.aiGuardrails["_nextCallDisabled"] = "all";
	    } else if (typeof ids === "string") {
	      this.aiGuardrails["_nextCallDisabled"] = /* @__PURE__ */ new Set([ids]);
	    } else {
	      this.aiGuardrails["_nextCallDisabled"] = new Set(ids);
	    }
	    return this;
	  }
	  set wallet(wallet) {
	    if (!wallet) {
	      this._wallet = void 0;
	      this.walletConfig = void 0;
	      return;
	    }
	    this._wallet = wallet;
	    this.walletConfig ??= {};
	    this.walletConfig.lnPay = wallet?.lnPay?.bind(wallet);
	    this.walletConfig.cashuPay = wallet?.cashuPay?.bind(wallet);
	  }
	  get wallet() {
	    return this._wallet;
	  }
	};

	// src/nip19/index.ts
	var nip19_exports = {};
	__reExport(nip19_exports, nip19_star);

	// src/nip49/index.ts
	var nip49_exports = {};
	__reExport(nip49_exports, nip49_star);
	function disconnect(pool, debug9) {
	  debug9 ??= createDebug5("ndk:relay:auth-policies:disconnect");
	  return async (relay) => {
	    debug9?.(`Relay ${relay.url} requested authentication, disconnecting`);
	    pool.removeRelay(relay.url);
	  };
	}
	async function signAndAuth(event, relay, signer, debug9, resolve, reject) {
	  try {
	    await event.sign(signer);
	    resolve(event);
	  } catch (e) {
	    debug9?.(`Failed to publish auth event to relay ${relay.url}`, e);
	    reject(event);
	  }
	}
	function signIn({ ndk, signer, debug: debug9 } = {}) {
	  debug9 ??= createDebug5("ndk:auth-policies:signIn");
	  return async (relay, challenge) => {
	    debug9?.(`Relay ${relay.url} requested authentication, signing in`);
	    const event = new NDKEvent(ndk);
	    event.kind = 22242 /* ClientAuth */;
	    event.tags = [
	      ["relay", relay.url],
	      ["challenge", challenge]
	    ];
	    signer ??= ndk?.signer;
	    return new Promise(async (resolve, reject) => {
	      if (signer) {
	        await signAndAuth(event, relay, signer, debug9, resolve, reject);
	      } else {
	        ndk?.once("signer:ready", async (signer2) => {
	          await signAndAuth(event, relay, signer2, debug9, resolve, reject);
	        });
	      }
	    });
	  };
	}
	var NDKRelayAuthPolicies = {
	  disconnect,
	  signIn
	};

	// src/signers/deserialization.ts
	async function ndkSignerFromPayload(payloadString, ndk) {
	  let parsed;
	  try {
	    parsed = JSON.parse(payloadString);
	  } catch (e) {
	    console.error("Failed to parse signer payload string", payloadString, e);
	    return void 0;
	  }
	  if (!parsed || typeof parsed.type !== "string") {
	    console.error("Failed to parse signer payload string", payloadString, new Error("Missing type field"));
	    return void 0;
	  }
	  const SignerClass = signerRegistry.get(parsed.type);
	  if (!SignerClass) {
	    throw new Error(`Unknown signer type: ${parsed.type}`);
	  }
	  try {
	    return await SignerClass.fromPayload(payloadString, ndk);
	  } catch (e) {
	    const errorMsg = e instanceof Error ? e.message : String(e);
	    throw new Error(`Failed to deserialize signer type ${parsed.type}: ${errorMsg}`);
	  }
	}
	var NDKNip07Signer = class _NDKNip07Signer {
	  _userPromise;
	  encryptionQueue = [];
	  encryptionProcessing = false;
	  debug;
	  waitTimeout;
	  _pubkey;
	  ndk;
	  _user;
	  /**
	   * @param waitTimeout - The timeout in milliseconds to wait for the NIP-07 to become available
	   */
	  constructor(waitTimeout = 1e3, ndk) {
	    this.debug = createDebug5("ndk:nip07");
	    this.waitTimeout = waitTimeout;
	    this.ndk = ndk;
	  }
	  get pubkey() {
	    if (!this._pubkey) throw new Error("Not ready");
	    return this._pubkey;
	  }
	  async blockUntilReady() {
	    await this.waitForExtension();
	    const pubkey = await window.nostr?.getPublicKey();
	    if (!pubkey) {
	      throw new Error("User rejected access");
	    }
	    this._pubkey = pubkey;
	    let user;
	    if (this.ndk) user = this.ndk.getUser({ pubkey });
	    else user = new NDKUser({ pubkey });
	    this._user = user;
	    return user;
	  }
	  /**
	   * Getter for the user property.
	   * @returns The NDKUser instance.
	   */
	  async user() {
	    if (!this._userPromise) {
	      this._userPromise = this.blockUntilReady();
	    }
	    return this._userPromise;
	  }
	  get userSync() {
	    if (!this._user) throw new Error("User not ready");
	    return this._user;
	  }
	  /**
	   * Signs the given Nostr event.
	   * @param event - The Nostr event to be signed.
	   * @returns The signature of the signed event.
	   * @throws Error if the NIP-07 is not available on the window object.
	   */
	  async sign(event) {
	    await this.waitForExtension();
	    const signedEvent = await window.nostr?.signEvent(event);
	    if (!signedEvent) throw new Error("Failed to sign event");
	    return signedEvent.sig;
	  }
	  async relays(ndk) {
	    await this.waitForExtension();
	    const relays = await window.nostr?.getRelays?.() || {};
	    const activeRelays = [];
	    for (const url of Object.keys(relays)) {
	      if (relays[url].read && relays[url].write) {
	        activeRelays.push(url);
	      }
	    }
	    return activeRelays.map((url) => new NDKRelay(url, ndk?.relayAuthDefaultPolicy, ndk));
	  }
	  async encryptionEnabled(nip) {
	    const enabled = [];
	    if ((!nip || nip === "nip04") && Boolean(window.nostr?.nip04)) enabled.push("nip04");
	    if ((!nip || nip === "nip44") && Boolean(window.nostr?.nip44)) enabled.push("nip44");
	    return enabled;
	  }
	  async encrypt(recipient, value, nip = "nip04") {
	    if (!await this.encryptionEnabled(nip))
	      throw new Error(`${nip}encryption is not available from your browser extension`);
	    await this.waitForExtension();
	    const recipientHexPubKey = recipient.pubkey;
	    return this.queueEncryption(nip, "encrypt", recipientHexPubKey, value);
	  }
	  async decrypt(sender, value, nip = "nip04") {
	    if (!await this.encryptionEnabled(nip))
	      throw new Error(`${nip}encryption is not available from your browser extension`);
	    await this.waitForExtension();
	    const senderHexPubKey = sender.pubkey;
	    return this.queueEncryption(nip, "decrypt", senderHexPubKey, value);
	  }
	  async queueEncryption(scheme, method, counterpartyHexpubkey, value) {
	    return new Promise((resolve, reject) => {
	      this.encryptionQueue.push({
	        scheme,
	        method,
	        counterpartyHexpubkey,
	        value,
	        resolve,
	        reject
	      });
	      if (!this.encryptionProcessing) {
	        this.processEncryptionQueue();
	      }
	    });
	  }
	  async processEncryptionQueue(item, retries = 0) {
	    if (!item && this.encryptionQueue.length === 0) {
	      this.encryptionProcessing = false;
	      return;
	    }
	    this.encryptionProcessing = true;
	    const currentItem = item || this.encryptionQueue.shift();
	    if (!currentItem) {
	      this.encryptionProcessing = false;
	      return;
	    }
	    const { scheme, method, counterpartyHexpubkey, value, resolve, reject } = currentItem;
	    this.debug("Processing encryption queue item", {
	      method,
	      counterpartyHexpubkey,
	      value
	    });
	    try {
	      const result = await window.nostr?.[scheme]?.[method](counterpartyHexpubkey, value);
	      if (!result) throw new Error("Failed to encrypt/decrypt");
	      resolve(result);
	    } catch (error) {
	      const errorMessage = error instanceof Error ? error.message : String(error);
	      if (errorMessage.includes("call already executing") && retries < 5) {
	        this.debug("Retrying encryption queue item", {
	          method,
	          counterpartyHexpubkey,
	          value,
	          retries
	        });
	        setTimeout(() => {
	          this.processEncryptionQueue(currentItem, retries + 1);
	        }, 50 * retries);
	        return;
	      }
	      reject(error instanceof Error ? error : new Error(errorMessage));
	    }
	    this.processEncryptionQueue();
	  }
	  waitForExtension() {
	    return new Promise((resolve, reject) => {
	      if (window.nostr) {
	        resolve();
	        return;
	      }
	      let timerId;
	      const intervalId = setInterval(() => {
	        if (window.nostr) {
	          clearTimeout(timerId);
	          clearInterval(intervalId);
	          resolve();
	        }
	      }, 100);
	      timerId = setTimeout(() => {
	        clearInterval(intervalId);
	        reject(new Error("NIP-07 extension not available"));
	      }, this.waitTimeout);
	    });
	  }
	  /**
	   * Serializes the signer type into a storable format.
	   * NIP-07 signers don't have persistent state to serialize beyond their type.
	   * @returns A JSON string containing the type.
	   */
	  toPayload() {
	    const payload = {
	      type: "nip07",
	      payload: ""
	      // No specific payload needed for NIP-07
	    };
	    return JSON.stringify(payload);
	  }
	  /**
	   * Deserializes the signer from a payload string.
	   * Creates a new NDKNip07Signer instance.
	   * @param payloadString The JSON string obtained from toPayload().
	   * @param ndk Optional NDK instance.
	   * @returns An instance of NDKNip07Signer.
	   */
	  static async fromPayload(payloadString, ndk) {
	    const payload = JSON.parse(payloadString);
	    if (payload.type !== "nip07") {
	      throw new Error(`Invalid payload type: expected 'nip07', got ${payload.type}`);
	    }
	    return new _NDKNip07Signer(void 0, ndk);
	  }
	};
	registerSigner("nip07", NDKNip07Signer);
	var NDKNostrRpc = class extends libExports.EventEmitter {
	  ndk;
	  signer;
	  relaySet;
	  debug;
	  encryptionType = "nip04";
	  pool;
	  constructor(ndk, signer, debug9, relayUrls) {
	    super();
	    this.ndk = ndk;
	    this.signer = signer;
	    if (relayUrls) {
	      this.pool = new NDKPool(relayUrls, ndk, {
	        debug: debug9.extend("rpc-pool"),
	        name: "Nostr RPC"
	      });
	      this.relaySet = new NDKRelaySet(/* @__PURE__ */ new Set(), ndk, this.pool);
	      for (const url of relayUrls) {
	        const relay = this.pool.getRelay(url, false, false);
	        relay.authPolicy = NDKRelayAuthPolicies.signIn({ ndk, signer, debug: debug9 });
	        this.relaySet.addRelay(relay);
	        relay.connect();
	      }
	    }
	    this.debug = debug9.extend("rpc");
	  }
	  /**
	   * Subscribe to a filter. This function will resolve once the subscription is ready.
	   */
	  subscribe(filter) {
	    return new Promise((resolve) => {
	      const sub = this.ndk.subscribe(filter, {
	        closeOnEose: false,
	        groupable: false,
	        cacheUsage: "ONLY_RELAY" /* ONLY_RELAY */,
	        pool: this.pool,
	        relaySet: this.relaySet,
	        onEvent: async (event) => {
	          try {
	            const parsedEvent = await this.parseEvent(event);
	            if (parsedEvent.method) {
	              this.emit("request", parsedEvent);
	            } else {
	              this.emit(`response-${parsedEvent.id}`, parsedEvent);
	              this.emit("response", parsedEvent);
	            }
	          } catch (e) {
	            this.debug("error parsing event", e, event.rawEvent());
	          }
	        },
	        onEose: () => {
	          this.debug("eosed");
	          resolve(sub);
	        }
	      });
	    });
	  }
	  async parseEvent(event) {
	    if (this.encryptionType === "nip44" && event.content.includes("?iv=")) {
	      this.encryptionType = "nip04";
	    } else if (this.encryptionType === "nip04" && !event.content.includes("?iv=")) {
	      this.encryptionType = "nip44";
	    }
	    const remoteUser = this.ndk.getUser({ pubkey: event.pubkey });
	    remoteUser.ndk = this.ndk;
	    let decryptedContent;
	    try {
	      decryptedContent = await this.signer.decrypt(remoteUser, event.content, this.encryptionType);
	    } catch (_e) {
	      const otherEncryptionType = this.encryptionType === "nip04" ? "nip44" : "nip04";
	      decryptedContent = await this.signer.decrypt(remoteUser, event.content, otherEncryptionType);
	      this.encryptionType = otherEncryptionType;
	    }
	    const parsedContent = JSON.parse(decryptedContent);
	    const { id, method, params, result, error } = parsedContent;
	    if (method) {
	      return { id, pubkey: event.pubkey, method, params, event };
	    }
	    return { id, result, error, event };
	  }
	  async sendResponse(id, remotePubkey, result, kind = 24133 /* NostrConnect */, error) {
	    const res = { id, result };
	    if (error) {
	      res.error = error;
	    }
	    const localUser = await this.signer.user();
	    const remoteUser = this.ndk.getUser({ pubkey: remotePubkey });
	    const event = new NDKEvent(this.ndk, {
	      kind,
	      content: JSON.stringify(res),
	      tags: [["p", remotePubkey]],
	      pubkey: localUser.pubkey
	    });
	    event.content = await this.signer.encrypt(remoteUser, event.content, this.encryptionType);
	    await event.sign(this.signer);
	    await event.publish(this.relaySet);
	  }
	  /**
	   * Sends a request.
	   * @param remotePubkey
	   * @param method
	   * @param params
	   * @param kind
	   * @param id
	   */
	  async sendRequest(remotePubkey, method, params = [], kind = 24133, cb) {
	    const id = Math.random().toString(36).substring(7);
	    const localUser = await this.signer.user();
	    const remoteUser = this.ndk.getUser({ pubkey: remotePubkey });
	    const request = { id, method, params };
	    const promise = new Promise(() => {
	      const responseHandler = (response) => {
	        if (response.result === "auth_url") {
	          this.once(`response-${id}`, responseHandler);
	          this.emit("authUrl", response.error);
	        } else if (cb) {
	          cb(response);
	        }
	      };
	      this.once(`response-${id}`, responseHandler);
	    });
	    const event = new NDKEvent(this.ndk, {
	      kind,
	      content: JSON.stringify(request),
	      tags: [["p", remotePubkey]],
	      pubkey: localUser.pubkey
	    });
	    event.content = await this.signer.encrypt(remoteUser, event.content, this.encryptionType);
	    await event.sign(this.signer);
	    await event.publish(this.relaySet);
	    return promise;
	  }
	};

	// src/signers/nip46/nostrconnect.ts
	function nostrConnectGenerateSecret() {
	  return Math.random().toString(36).substring(2, 15);
	}
	function generateNostrConnectUri(pubkey, secret, relay, options) {
	  const meta = {
	    name: options?.name ? encodeURIComponent(options.name) : "",
	    url: options?.url ? encodeURIComponent(options.url) : "",
	    image: options?.image ? encodeURIComponent(options.image) : "",
	    perms: options?.perms ? encodeURIComponent(options.perms) : ""
	  };
	  let uri = `nostrconnect://${pubkey}?image=${meta.image}&url=${meta.url}&name=${meta.name}&perms=${meta.perms}&secret=${encodeURIComponent(secret)}`;
	  if (relay) {
	    uri += `&relay=${encodeURIComponent(relay)}`;
	  }
	  return uri;
	}

	// src/signers/nip46/index.ts
	var NDKNip46Signer = class _NDKNip46Signer extends libExports.EventEmitter {
	  ndk;
	  _user;
	  /**
	   * The pubkey of the bunker that will be providing signatures
	   */
	  bunkerPubkey;
	  /**
	   * The pubkey of the user that events will be published as
	   */
	  userPubkey;
	  get pubkey() {
	    if (!this.userPubkey) throw new Error("Not ready");
	    return this.userPubkey;
	  }
	  /**
	   * An optional secret value provided to connect to the bunker
	   */
	  secret;
	  localSigner;
	  nip05;
	  rpc;
	  debug;
	  relayUrls;
	  subscription;
	  /**
	   * If using nostrconnect://, stores the nostrConnectURI
	   */
	  nostrConnectUri;
	  /**
	   * The random secret used for nostrconnect:// flows.
	   */
	  nostrConnectSecret;
	  /**
	   *
	   * Don't instantiate this directly. Use the static methods instead.
	   *
	   * @example:
	   * // for bunker:// flow
	   * const signer = NDKNip46Signer.bunker(ndk, "bunker://<connection-token>")
	   * const signer = NDKNip46Signer.bunker(ndk, "<your-nip05>"); // with nip05 flow
	   * // for nostrconnect:// flow
	   * const signer = NDKNip46Signer.nostrconnect(ndk, "wss://relay.example.com")
	   *
	   * @param ndk - The NDK instance to use
	   * @param userOrConnectionToken - The public key, or a connection token, of the npub that wants to be published as
	   * @param localSigner - The signer that will be used to request events to be signed
	   */
	  constructor(ndk, userOrConnectionToken, localSigner, relayUrls, nostrConnectOptions) {
	    super();
	    this.ndk = ndk;
	    this.debug = ndk.debug.extend("nip46:signer");
	    this.relayUrls = relayUrls;
	    if (!localSigner) {
	      this.localSigner = NDKPrivateKeySigner.generate();
	    } else {
	      if (typeof localSigner === "string") {
	        this.localSigner = new NDKPrivateKeySigner(localSigner);
	      } else {
	        this.localSigner = localSigner;
	      }
	    }
	    if (userOrConnectionToken === false) ; else if (!userOrConnectionToken) {
	      this.nostrconnectFlowInit(nostrConnectOptions);
	    } else if (userOrConnectionToken.startsWith("bunker://")) {
	      this.bunkerFlowInit(userOrConnectionToken);
	    } else {
	      this.nip05Init(userOrConnectionToken);
	    }
	    this.rpc = new NDKNostrRpc(this.ndk, this.localSigner, this.debug, this.relayUrls);
	  }
	  /**
	   * Connnect with a bunker:// flow
	   * @param ndk
	   * @param userOrConnectionToken bunker:// connection string
	   * @param localSigner If you have previously authenticated with this signer, you can restore the session by providing the previously authenticated key
	   */
	  static bunker(ndk, userOrConnectionToken, localSigner) {
	    return new _NDKNip46Signer(ndk, userOrConnectionToken, localSigner);
	  }
	  /**
	   * Connect with a nostrconnect:// flow
	   * @param ndk
	   * @param relay - Relay used to connect with the signer
	   * @param localSigner If you have previously authenticated with this signer, you can restore the session by providing the previously authenticated key
	   */
	  static nostrconnect(ndk, relay, localSigner, nostrConnectOptions) {
	    return new _NDKNip46Signer(ndk, void 0, localSigner, [relay], nostrConnectOptions);
	  }
	  nostrconnectFlowInit(nostrConnectOptions) {
	    this.nostrConnectSecret = nostrConnectGenerateSecret();
	    const pubkey = this.localSigner.pubkey;
	    this.nostrConnectUri = generateNostrConnectUri(
	      pubkey,
	      this.nostrConnectSecret,
	      this.relayUrls?.[0],
	      nostrConnectOptions
	    );
	  }
	  bunkerFlowInit(connectionToken) {
	    const bunkerUrl = new URL(connectionToken);
	    const bunkerPubkey = bunkerUrl.hostname || bunkerUrl.pathname.replace(/^\/\//, "");
	    const userPubkey = bunkerUrl.searchParams.get("pubkey");
	    const relayUrls = bunkerUrl.searchParams.getAll("relay");
	    const secret = bunkerUrl.searchParams.get("secret");
	    this.bunkerPubkey = bunkerPubkey;
	    this.userPubkey = userPubkey;
	    this.relayUrls = relayUrls;
	    this.secret = secret;
	  }
	  nip05Init(nip05) {
	    this.nip05 = nip05;
	  }
	  /**
	   * We start listening for events from the bunker
	   */
	  async startListening() {
	    if (this.subscription) return;
	    const localUser = await this.localSigner.user();
	    if (!localUser) throw new Error("Local signer not ready");
	    this.subscription = await this.rpc.subscribe({
	      kinds: [24133 /* NostrConnect */],
	      "#p": [localUser.pubkey]
	    });
	  }
	  /**
	   * Get the user that is being published as
	   */
	  async user() {
	    if (this._user) return this._user;
	    return this.blockUntilReady();
	  }
	  get userSync() {
	    if (!this._user) throw new Error("Remote user not ready synchronously");
	    return this._user;
	  }
	  async blockUntilReadyNostrConnect() {
	    return new Promise((resolve, reject) => {
	      const connect = (response) => {
	        if (response.result === this.nostrConnectSecret) {
	          this._user = response.event.author;
	          this.userPubkey = response.event.pubkey;
	          this.bunkerPubkey = response.event.pubkey;
	          this.rpc.off("response", connect);
	          resolve(this._user);
	        }
	      };
	      this.startListening();
	      this.rpc.on("response", connect);
	    });
	  }
	  async blockUntilReady() {
	    if (!this.bunkerPubkey && !this.nostrConnectSecret && !this.nip05) {
	      throw new Error("Bunker pubkey not set");
	    }
	    if (this.nostrConnectSecret) return this.blockUntilReadyNostrConnect();
	    if (this.nip05 && !this.userPubkey) {
	      const user = await NDKUser.fromNip05(this.nip05, this.ndk);
	      if (user) {
	        this._user = user;
	        this.userPubkey = user.pubkey;
	        this.relayUrls = user.nip46Urls;
	        this.rpc = new NDKNostrRpc(this.ndk, this.localSigner, this.debug, this.relayUrls);
	      }
	    }
	    if (!this.bunkerPubkey && this.userPubkey) {
	      this.bunkerPubkey = this.userPubkey;
	    } else if (!this.bunkerPubkey) {
	      throw new Error("Bunker pubkey not set");
	    }
	    await this.startListening();
	    this.rpc.on("authUrl", (...props) => {
	      this.emit("authUrl", ...props);
	    });
	    return new Promise((resolve, reject) => {
	      const connectParams = [this.userPubkey ?? ""];
	      if (this.secret) connectParams.push(this.secret);
	      if (!this.bunkerPubkey) throw new Error("Bunker pubkey not set");
	      this.rpc.sendRequest(this.bunkerPubkey, "connect", connectParams, 24133, (response) => {
	        if (response.result === "ack") {
	          this.getPublicKey().then((pubkey) => {
	            this.userPubkey = pubkey;
	            this._user = this.ndk.getUser({ pubkey });
	            resolve(this._user);
	          });
	        } else {
	          reject(response.error);
	        }
	      });
	    });
	  }
	  stop() {
	    this.subscription?.stop();
	    this.subscription = void 0;
	  }
	  async getPublicKey() {
	    if (this.userPubkey) return this.userPubkey;
	    return new Promise((resolve, _reject) => {
	      if (!this.bunkerPubkey) throw new Error("Bunker pubkey not set");
	      this.rpc.sendRequest(this.bunkerPubkey, "get_public_key", [], 24133, (response) => {
	        resolve(response.result);
	      });
	    });
	  }
	  async encryptionEnabled(scheme) {
	    if (scheme) return [scheme];
	    return Promise.resolve(["nip04", "nip44"]);
	  }
	  async encrypt(recipient, value, scheme = "nip04") {
	    return this.encryption(recipient, value, scheme, "encrypt");
	  }
	  async decrypt(sender, value, scheme = "nip04") {
	    return this.encryption(sender, value, scheme, "decrypt");
	  }
	  async encryption(peer, value, scheme, method) {
	    const promise = new Promise((resolve, reject) => {
	      if (!this.bunkerPubkey) throw new Error("Bunker pubkey not set");
	      this.rpc.sendRequest(
	        this.bunkerPubkey,
	        `${scheme}_${method}`,
	        [peer.pubkey, value],
	        24133,
	        (response) => {
	          if (!response.error) {
	            resolve(response.result);
	          } else {
	            reject(response.error);
	          }
	        }
	      );
	    });
	    return promise;
	  }
	  async sign(event) {
	    const promise = new Promise((resolve, reject) => {
	      if (!this.bunkerPubkey) throw new Error("Bunker pubkey not set");
	      this.rpc.sendRequest(
	        this.bunkerPubkey,
	        "sign_event",
	        [JSON.stringify(event)],
	        24133,
	        (response) => {
	          if (!response.error) {
	            const json = JSON.parse(response.result);
	            resolve(json.sig);
	          } else {
	            reject(response.error);
	          }
	        }
	      );
	    });
	    return promise;
	  }
	  /**
	   * Allows creating a new account on the remote server.
	   * @param username Desired username for the NIP-05
	   * @param domain Desired domain for the NIP-05
	   * @param email Email address to associate with this account -- Remote servers may use this for recovery
	   * @returns The public key of the newly created account
	   */
	  async createAccount(username, domain, email) {
	    await this.startListening();
	    const req = [];
	    if (username) req.push(username);
	    if (domain) req.push(domain);
	    if (email) req.push(email);
	    return new Promise((resolve, reject) => {
	      if (!this.bunkerPubkey) throw new Error("Bunker pubkey not set");
	      this.rpc.sendRequest(
	        this.bunkerPubkey,
	        "create_account",
	        req,
	        24133 /* NostrConnect */,
	        (response) => {
	          if (!response.error) {
	            const pubkey = response.result;
	            resolve(pubkey);
	          } else {
	            reject(response.error);
	          }
	        }
	      );
	    });
	  }
	  /**
	   * Serializes the signer's connection details and local signer state.
	   * @returns A JSON string containing the type, connection info, and local signer payload.
	   */
	  toPayload() {
	    if (!this.bunkerPubkey || !this.userPubkey) {
	      throw new Error("NIP-46 signer is not fully initialized for serialization");
	    }
	    const payload = {
	      type: "nip46",
	      payload: {
	        bunkerPubkey: this.bunkerPubkey,
	        userPubkey: this.userPubkey,
	        relayUrls: this.relayUrls,
	        secret: this.secret,
	        localSignerPayload: this.localSigner.toPayload(),
	        // Store nip05 if it was used for initialization, otherwise null
	        nip05: this.nip05 || null
	      }
	    };
	    return JSON.stringify(payload);
	  }
	  /**
	   * Deserializes the signer from a payload string.
	   * @param payloadString The JSON string obtained from toPayload().
	   * @param ndk The NDK instance, required for NIP-46.
	   * @returns An instance of NDKNip46Signer.
	   */
	  static async fromPayload(payloadString, ndk) {
	    if (!ndk) {
	      throw new Error("NDK instance is required to deserialize NIP-46 signer");
	    }
	    const parsed = JSON.parse(payloadString);
	    if (parsed.type !== "nip46") {
	      throw new Error(`Invalid payload type: expected 'nip46', got ${parsed.type}`);
	    }
	    const payload = parsed.payload;
	    if (!payload || typeof payload !== "object" || !payload.localSignerPayload) {
	      throw new Error("Invalid payload content for nip46 signer");
	    }
	    const localSigner = await ndkSignerFromPayload(payload.localSignerPayload, ndk);
	    if (!localSigner) {
	      throw new Error("Failed to deserialize local signer for NIP-46");
	    }
	    if (!(localSigner instanceof NDKPrivateKeySigner)) {
	      throw new Error("Local signer must be an instance of NDKPrivateKeySigner");
	    }
	    let signer;
	    signer = new _NDKNip46Signer(ndk, false, localSigner, payload.relayUrls);
	    signer.userPubkey = payload.userPubkey;
	    signer.bunkerPubkey = payload.bunkerPubkey;
	    signer.relayUrls = payload.relayUrls;
	    signer.secret = payload.secret;
	    if (payload.userPubkey) {
	      signer._user = new NDKUser({ pubkey: payload.userPubkey });
	      if (signer._user) signer._user.ndk = ndk;
	    }
	    return signer;
	  }
	};
	registerSigner("nip46", NDKNip46Signer);
	createDebug5("ndk:zapper:ln");

	// src/zapper/index.ts
	createDebug5("ndk:zapper");

	/**
	 * Entry point for bundling Nostr libraries
	 * This file imports all the libraries needed by NostrChat
	 */


	// Export everything for use in the extension
	window.NostrLibs = {
		NDK: NDK,
		NDKEvent: NDKEvent,
		NDKUser: NDKUser,
		NDKPrivateKeySigner: NDKPrivateKeySigner
	};

	// Also set NDKModule for backward compatibility with existing code
	window.NDKModule = window.NostrLibs;

	// Dispatch event when libraries are loaded
	window.dispatchEvent( new CustomEvent( 'nostrLibsReady', {
		detail: { source: 'bundled' }
	} ) );

})();
