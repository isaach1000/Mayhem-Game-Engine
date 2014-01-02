
/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.9+ Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */

var requirejs, require, define;
(function(global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.1.9+',
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        apsp = ap.splice,
        isBrowser = !! (typeof window !== 'undefined' && typeof navigator !==
            'undefined' && window.document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
        //PS3 indicates loaded and complete, but need to wait for complete
        //specifically. Sequence is 'loading', 'loaded', execution,
        // then 'complete'. The UA check is unfortunate, but not sure how
        //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
            /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
        //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
        isOpera = typeof opera !== 'undefined' && opera.toString() ===
            '[object Opera]',
        contexts = {},
        cfg = {},
        globalDefQueue = [],
        useInteractive = false;

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function(value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value === 'object' &&
                        value && !isArray(value) && !isFunction(value) && !
                        (value instanceof RegExp)) {

                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force,
                            deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }

    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function() {
            return fn.apply(obj, arguments);
        };
    }

    function scripts() {
        return document.getElementsByTagName('script');
    }

    function defaultOnError(err) {
        throw err;
    }

    //Allow getting a global that expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function(part) {
            g = g[part];
        });
        return g;
    }

    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' +
            id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }

    if (typeof define !== 'undefined') {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //Do not overwrite and existing requirejs instance.
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }

    //Allow for a require config object
    if (typeof require !== 'undefined' && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
    }

    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                //Defaults. Do not set a default for map
                //config to speed up normalize(), which
                //will run faster if there is no default.
                waitSeconds: 7,
                baseUrl: './',
                paths: {},
                pkgs: {},
                shim: {},
                config: {}
            },
            registry = {},
            //registry of just enabled modules, to speed
            //cycle breaking code when lots of modules
            //are registered, but not activated.
            enabledRegistry = {},
            undefEvents = {},
            defQueue = [],
            defined = {},
            urlFetched = {},
            requireCounter = 1,
            unnormalizedCounter = 1;

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; ary[i]; i += 1) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                        //End of the line. Keep at least one non-dot
                        //path segment at the front so it can be mapped
                        //correctly to disk. Otherwise, there is likely
                        //no path mapping for a path starting with '..'.
                        //This can still fail, but catches the most reasonable
                        //uses of ..
                        break;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgName, pkgConfig, mapValue, nameParts, i, j, nameSegment,
                foundMap, foundI, foundStarMap, starI,
                baseParts = baseName && baseName.split('/'),
                normalizedBaseParts = baseParts,
                map = config.map,
                starMap = map && map['*'];

            //Adjust any relative paths.
            if (name && name.charAt(0) === '.') {
                //If have a base name, try to normalize against it,
                //otherwise, assume it is a top-level require that will
                //be relative to baseUrl in the end.
                if (baseName) {
                    if (getOwn(config.pkgs, baseName)) {
                        //If the baseName is a package name, then just treat it as one
                        //name to concat the name with.
                        normalizedBaseParts = baseParts = [baseName];
                    } else {
                        //Convert baseName to array, and lop off the last part,
                        //so that . matches that 'directory' and not name of the baseName's
                        //module. For instance, baseName of 'one/two/three', maps to
                        //'one/two/three.js', but we want the directory, 'one/two' for
                        //this normalization.
                        normalizedBaseParts = baseParts.slice(0, baseParts.length -
                            1);
                    }

                    name = normalizedBaseParts.concat(name.split('/'));
                    trimDots(name);

                    //Some use of packages may use a . path to reference the
                    //'main' module name, so normalize for that.
                    pkgConfig = getOwn(config.pkgs, (pkgName = name[0]));
                    name = name.join('/');
                    if (pkgConfig && name === pkgName + '/' + pkgConfig.main) {
                        name = pkgName;
                    }
                } else if (name.indexOf('./') === 0) {
                    // No baseName, so this is ID is resolved relative
                    // to baseUrl, pull off the leading dot.
                    name = name.substring(2);
                }
            }

            //Apply map config if available.
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');

                for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join(
                                '/'));

                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break;
                                }
                            }
                        }
                    }

                    if (foundMap) {
                        break;
                    }

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && getOwn(starMap,
                        nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }

            return name;
        }

        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function(scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') ===
                        name &&
                        scriptNode.getAttribute('data-requirecontext') ===
                        context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }

        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.require.undef(id);
                context.require([id]);
                return true;
            }
        }

        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap, isNormalized,
            applyMap) {
            var url, pluginModule, suffix, nameParts,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }

            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name,
                            function(name) {
                                return normalize(name, parentName, applyMap);
                            });
                    } else {
                        normalizedName = normalize(name, parentName,
                            applyMap);
                    }
                } else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);

                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;

                    url = context.nameToUrl(normalizedName);
                }
            }

            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                '_unnormalized' + (unnormalizedCounter += 1) :
                '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !! suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                    prefix + '!' + normalizedName :
                    normalizedName) + suffix
            };
        }

        function getModule(depMap) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }

            return mod;
        }

        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (hasProp(defined, id) &&
                (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            } else {
                mod = getModule(depMap);
                if (mod.error && name === 'error') {
                    fn(mod.error);
                } else {
                    mod.on(name, fn);
                }
            }
        }

        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
            } else {
                each(ids, function(id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });

                if (!notified) {
                    req.onError(err);
                }
            }
        }

        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                //Array splice in the values since the context code has a
                //local var ref to defQueue, so cannot just reassign the one
                //on context.
                apsp.apply(defQueue, [defQueue.length, 0].concat(
                    globalDefQueue));
                globalDefQueue = [];
            }
        }

        handlers = {
            'require': function(mod) {
                if (mod.require) {
                    return mod.require;
                } else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function(mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return mod.exports;
                    } else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function(mod) {
                if (mod.module) {
                    return mod.module;
                } else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function() {
                            var c,
                                pkg = getOwn(config.pkgs, mod.map.id);
                            // For packages, only support config targeted
                            // at the main module.
                            c = pkg ? getOwn(config.config, mod.map.id +
                                '/' + pkg.main) :
                                getOwn(config.config, mod.map.id);
                            return c || {};
                        },
                        exports: defined[mod.map.id]
                    });
                }
            }
        };

        function cleanRegistry(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];
            delete enabledRegistry[id];
        }

        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;

            if (mod.error) {
                mod.emit('error', mod.error);
            } else {
                traced[id] = true;
                each(mod.depMaps, function(depMap, i) {
                    var depId = depMap.id,
                        dep = getOwn(registry, depId);

                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                        } else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }

        function checkLoaded() {
            var err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) <
                    new Date().getTime(),
                noLoads = [],
                reqCalls = [],
                stillLoading = false,
                needCycleCheck = true;

            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
            }

            inCheckLoaded = true;

            //Figure out the state of all the modules.
            eachProp(enabledRegistry, function(mod) {
                var map = mod.map,
                    modId = map.id;

                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
                }

                if (!map.isDefine) {
                    reqCalls.push(mod);
                }

                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        } else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    } else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });

            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' +
                    noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }

            //Not expired, check for a cycle.
            if (needCycleCheck) {
                each(reqCalls, function(mod) {
                    breakCycle(mod, {}, {});
                });
            }

            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function() {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }

            inCheckLoaded = false;
        }

        Module = function(map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;

            /* this.exports this.factory
               this.depMaps = [],
               this.enabled, this.fetched
            */
        };

        Module.prototype = {
            init: function(depMaps, factory, errback, options) {
                options = options || {};

                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }

                this.factory = factory;

                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
                } else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function(err) {
                        this.emit('error', err);
                    });
                }

                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);

                this.errback = errback;

                //Indicate this module has be initialized
                this.inited = true;

                this.ignore = options.ignore;

                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                } else {
                    this.check();
                }
            },

            defineDep: function(i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },

            fetch: function() {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function() {
                        return map.prefix ? this.callPlugin() :
                            this.load();
                    }));
                } else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },

            load: function() {
                var url = this.map.url;

                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },

            /**
             * Checks if the module is ready to define itself, and if so,
             * define it.
             */
            check: function() {
                if (!this.enabled || this.enabling) {
                    return;
                }

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    this.fetch();
                } else if (this.error) {
                    this.emit('error', this.error);
                } else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error. However,
                            //only do it for define()'d  modules. require
                            //errbacks should not be called for failures in
                            //their callbacks (#699). However if a global
                            //onError is set, use that.
                            if ((this.events.error && this.map.isDefine) ||
                                req.onError !== defaultOnError) {
                                try {
                                    exports = context.execCb(id, factory,
                                        depExports, exports);
                                } catch (e) {
                                    err = e;
                                }
                            } else {
                                exports = context.execCb(id, factory,
                                    depExports, exports);
                            }

                            if (this.map.isDefine) {
                                //If setting exports via 'module' is in play,
                                //favor that over return value and exports. After that,
                                //favor a non-undefined return value over exports use.
                                cjsModule = this.module;
                                if (cjsModule &&
                                    cjsModule.exports !== undefined &&
                                    //Make sure it is not already the exports value
                                    cjsModule.exports !== this.exports) {
                                    exports = cjsModule.exports;
                                } else if (exports === undefined && this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                                }
                            }

                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = this.map.isDefine ? [
                                    this.map.id] : null;
                                err.requireType = this.map.isDefine ?
                                    'define' : 'require';
                                return onError((this.error = err));
                            }

                        } else {
                            //Just a literal value
                            exports = factory;
                        }

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                req.onResourceLoad(context, this.map, this.depMaps);
                            }
                        }

                        //Clean up
                        cleanRegistry(id);

                        this.defined = true;
                    }

                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;

                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }

                }
            },

            callPlugin: function() {
                var map = this.map,
                    id = map.id,
                    //Map already normalized the prefix.
                    pluginMap = makeModuleMap(map.prefix);

                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(pluginMap);

                on(pluginMap, 'defined', bind(this, function(plugin) {
                    var load, normalizedMap, normalizedMod,
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap
                            .name : null,
                        localRequire = context.makeRequire(map.parentMap, {
                            enableBuildCallback: true
                        });

                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function(
                                name) {
                                return normalize(name,
                                    parentName, true);
                            }) || '';
                        }

                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        normalizedMap = makeModuleMap(map.prefix +
                            '!' + name,
                            this.map.parentMap);
                        on(normalizedMap,
                            'defined', bind(this, function(value) {
                                this.init([], function() {
                                    return value;
                                }, null, {
                                    enabled: true,
                                    ignore: true
                                });
                            }));

                        normalizedMod = getOwn(registry,
                            normalizedMap.id);
                        if (normalizedMod) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(normalizedMap);

                            if (this.events.error) {
                                normalizedMod.on('error', bind(this,
                                    function(err) {
                                        this.emit('error', err);
                                    }));
                            }
                            normalizedMod.enable();
                        }

                        return;
                    }

                    load = bind(this, function(value) {
                        this.init([], function() {
                            return value;
                        }, null, {
                            enabled: true
                        });
                    });

                    load.error = bind(this, function(err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];

                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function(mod) {
                            if (mod.map.id.indexOf(id +
                                '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });

                        onError(err);
                    });

                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = bind(this, function(text,
                        textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name,
                            moduleMap = makeModuleMap(
                                moduleName),
                            hasInteractive = useInteractive;

                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (textAlt) {
                            text = textAlt;
                        }

                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                        }

                        //Prime the system by creating a module instance for
                        //it.
                        getModule(moduleMap);

                        //Transfer any config to this other module.
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[
                                id];
                        }

                        try {
                            req.exec(text);
                        } catch (e) {
                            return onError(makeError(
                                'fromtexteval',
                                'fromText eval for ' + id +
                                ' failed: ' + e,
                                e, [id]));
                        }

                        if (hasInteractive) {
                            useInteractive = true;
                        }

                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(moduleMap);

                        //Support anonymous modules.
                        context.completeLoad(moduleName);

                        //Bind the value of that module to the value for this
                        //resource ID.
                        localRequire([moduleName], load);
                    });

                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, localRequire, load,
                        config);
                }));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },

            enable: function() {
                enabledRegistry[this.map.id] = this;
                this.enabled = true;

                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;

                //Enable each dependency
                each(this.depMaps, bind(this, function(depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap, (this.map.isDefine ?
                                this.map : this.map.parentMap),
                            false, !this.skipMap);
                        this.depMaps[i] = depMap;

                        handler = getOwn(handlers, depMap.id);

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function(
                            depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                        }));

                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        }
                    }

                    id = depMap.id;
                    mod = registry[id];

                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));

                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function(pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));

                this.enabling = false;

                this.check();
            },

            on: function(name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },

            emit: function(name, evt) {
                each(this.events[name], function(cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[name];
                }
            }
        };

        function callGetModule(args) {
            //Skip modules already defined.
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1],
                    args[2]);
            }
        }

        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            } else {
                node.removeEventListener(name, func, false);
            }
        }

        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;

            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load',
                'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }

        function intakeDefines() {
            var args;

            //Any defined modules in the global queue, intake them now.
            takeGlobalQueue();

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch',
                        'Mismatched anonymous define() module: ' + args[
                            args.length - 1]));
                } else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    callGetModule(args);
                }
            }
        }

        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,

            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function(cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }

                //Save off the paths and packages since they require special processing,
                //they are additive.
                var pkgs = config.pkgs,
                    shim = config.shim,
                    objs = {
                        paths: true,
                        config: true,
                        map: true
                    };

                eachProp(cfg, function(value, prop) {
                    if (objs[prop]) {
                        if (!config[prop]) {
                            config[prop] = {};
                        }
                        mixin(config[prop], value, true, true);
                    } else {
                        config[prop] = value;
                    }
                });

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function(value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(
                                value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function(pkgObj) {
                        var location;

                        pkgObj = typeof pkgObj === 'string' ? {
                            name: pkgObj
                        } : pkgObj;
                        location = pkgObj.location;

                        //Create a brand new object on pkgs, since currentPackages can
                        //be passed in again, and config.pkgs is the internal transformed
                        //state for all package configs.
                        pkgs[pkgObj.name] = {
                            name: pkgObj.name,
                            location: location || pkgObj.name,
                            //Remove leading dot in main, so main paths are normalized,
                            //and remove any trailing .js, since different package
                            //envs have different conventions: some use a module name,
                            //some use a file name.
                            main: (pkgObj.main || 'main')
                                .replace(currDirRegExp, '')
                                .replace(jsSuffixRegExp, '')
                        };
                    });

                    //Done with modifications, assing packages back to context config
                    config.pkgs = pkgs;
                }

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function(mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id);
                    }
                });

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },

            makeShimExports: function(value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },

            makeRequire: function(relMap, options) {
                options = options || {};

                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;

                    if (options.enableBuildCallback && callback &&
                        isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }

                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs',
                                'Invalid require call'), errback);
                        }

                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }

                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(context, deps, relMap,
                                localRequire);
                        }

                        //Normalize module name, if it contains . or ..
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;

                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded',
                                'Module name "' +
                                id +
                                '" has not been loaded yet for context: ' +
                                contextName +
                                (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }

                    //Grab defines waiting in the global queue.
                    intakeDefines();

                    //Mark all the dependencies as needing to be loaded.
                    context.nextTick(function() {
                        //Some defines could have been added since the
                        //require call, collect them.
                        intakeDefines();

                        requireMod = getModule(makeModuleMap(null,
                            relMap));

                        //Store if map config should be applied to this require
                        //call for dependencies.
                        requireMod.skipMap = options.skipMap;

                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });

                        checkLoaded();
                    });

                    return localRequire;
                }

                mixin(localRequire, {
                    isBrowser: isBrowser,

                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function(moduleNamePlusExt) {
                        var ext,
                            index = moduleNamePlusExt.lastIndexOf('.'),
                            segment = moduleNamePlusExt.split('/')[0],
                            isRelative = segment === '.' || segment ===
                                '..';

                        //Have a file extension alias, and it is not the
                        //dots from a relative path.
                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index,
                                moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(
                                0, index);
                        }

                        return context.nameToUrl(normalize(
                            moduleNamePlusExt,
                            relMap && relMap.id, true), ext, true);
                    },

                    defined: function(id) {
                        return hasProp(defined, makeModuleMap(id,
                            relMap, false, true).id);
                    },

                    specified: function(id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry,
                            id);
                    }
                });

                //Only allow undef on top level require calls
                if (!relMap) {
                    localRequire.undef = function(id) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        takeGlobalQueue();

                        var map = makeModuleMap(id, relMap, true),
                            mod = getOwn(registry, id);

                        removeScript(id);

                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];

                        //Clean queued defines too. Go backwards
                        //in array so that the splices do not
                        //mess up the iteration.
                        eachReverse(defQueue, function(args, i) {
                            if (args[0] === id) {
                                defQueue.splice(i, 1);
                            }
                        });

                        if (mod) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }

                            cleanRegistry(id);
                        }
                    };
                }

                return localRequire;
            },

            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. A second arg, parent, the parent module,
             * is passed in for context, when this method is overriden by
             * the optimizer. Not shown here to keep code compact.
             */
            enable: function(depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function(moduleName) {
                var found, args, mod,
                    shim = getOwn(config.shim, moduleName) || {},
                    shExports = shim.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                        }
                        found = true;
                    } else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                    }

                    callGetModule(args);
                }

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);

                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(
                        shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        } else {
                            return onError(makeError('nodefine',
                                'No define call for ' + moduleName,
                                null, [moduleName]));
                        }
                    } else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }

                checkLoaded();
            },

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function(moduleName, ext, skipExt) {
                var paths, pkgs, pkg, pkgPath, syms, i, parentModule, url,
                    parentPath;

                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
                } else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;
                    pkgs = config.pkgs;

                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');
                        pkg = getOwn(pkgs, parentModule);
                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        } else if (pkg) {
                            //If module name is just the package name, then looking
                            //for the main module.
                            if (moduleName === pkg.name) {
                                pkgPath = pkg.location + '/' + pkg.main;
                            } else {
                                pkgPath = pkg.location;
                            }
                            syms.splice(0, i, pkgPath);
                            break;
                        }
                    }

                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/^data\:|\?/.test(url) || skipExt ? '' :
                        '.js'));
                    url = (url.charAt(0) === '/' || url.match(
                        /^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }

                return config.urlArgs ? url +
                    ((url.indexOf('?') === -1 ? '?' : '&') +
                    config.urlArgs) : url;
            },

            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function(id, url) {
                req.load(context, id, url);
            },

            /**
             * Executes a module callback function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function(name, callback, args, exports) {
                return callback.apply(exports, args);
            },

            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function(evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                    (readyRegExp.test((evt.currentTarget || evt.srcElement)
                        .readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;

                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },

            /**
             * Callback for script errors.
             */
            onScriptError: function(evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    return onError(makeError('scripterror',
                        'Script error for: ' + data.id, evt, [data.id]));
                }
            }
        };

        context.require = context.makeRequire();
        return context;
    }

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function(deps, callback, errback, optional) {

        //Find the right context, use default
        var context, config,
            contextName = defContextName;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }

        if (config) {
            context.configure(config);
        }

        return context.require(deps, callback, errback);
    };

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function(config) {
        return req(config);
    };

    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function} fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== 'undefined' ? function(fn) {
        setTimeout(fn, 4);
    } : function(fn) {
        fn();
    };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    req.version = version;

    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };

    //Create default context.
    req({});

    //Exports some context-sensitive methods on global require.
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function(prop) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[prop] = function() {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });

    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = defaultOnError;

    /**
     * Creates the node for the load command. Only used in browser envs.
     */
    req.createNode = function(config, moduleName, url) {
        var node = config.xhtml ?
            document.createElementNS('http://www.w3.org/1999/xhtml',
                'html:script') :
            document.createElement('script');
        node.type = config.scriptType || 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        return node;
    };

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function(context, moduleName, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = req.createNode(config, moduleName, url);

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                //Check if node.attachEvent is artificially added by custom script or
                //natively supported by browser
                //read https://github.com/jrburke/requirejs/issues/187
                //if we can NOT find [native code] then it must NOT natively supported.
                //in IE8, node.attachEvent does not have toString()
                //Note the test for "[native code" with no closing brace, see:
                //https://github.com/jrburke/requirejs/issues/273
                !(node.attachEvent.toString && node.attachEvent.toString().indexOf(
                    '[native code') < 0) && !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEventListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation that a build has been done so that
                //only one script needs to be loaded anyway. This may need to be
                //reevaluated if other use cases become common.
                importScripts(url);

                //Account for anonymous modules
                context.completeLoad(moduleName);
            } catch (e) {
                context.onError(makeError('importscripts',
                    'importScripts failed for ' +
                    moduleName + ' at ' + url,
                    e, [moduleName]));
            }
        }
    };

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState ===
            'interactive') {
            return interactiveScript;
        }

        eachReverse(scripts(), function(script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser && !cfg.skipDataMain) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function(script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Preserve dataMain in case it is a path (i.e. contains '?')
                mainScript = dataMain;

                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = mainScript.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/') + '/' : './';

                    cfg.baseUrl = subPath;
                }

                //Strip off any trailing .js since mainScript is now
                //like a module name.
                mainScript = mainScript.replace(jsSuffixRegExp, '');

                //If mainScript is still a path, fall back to dataMain
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [
                    mainScript];

                return true;
            }
        });
    }

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function(name, deps, callback) {
        var node, context;

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps && isFunction(callback)) {
            deps = [];
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function(match, dep) {
                        deps.push(dep);
                    });

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require',
                    'exports', 'module']).concat(deps);
            }
        }

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (context ? context.defQueue : globalDefQueue).push([name, deps,
            callback]);
    };

    define.amd = {
        jQuery: true
    };


    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function(text) {
        /*jslint evil: true */
        return eval(text);
    };

    //Set up with config info.
    req(cfg);
}(this));

define("lib/require.js", function(){});

//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function() {
    var n = this,
        t = n._,
        r = {}, e = Array.prototype,
        u = Object.prototype,
        i = Function.prototype,
        a = e.push,
        o = e.slice,
        c = e.concat,
        l = u.toString,
        f = u.hasOwnProperty,
        s = e.forEach,
        p = e.map,
        h = e.reduce,
        v = e.reduceRight,
        g = e.filter,
        d = e.every,
        m = e.some,
        y = e.indexOf,
        b = e.lastIndexOf,
        x = Array.isArray,
        w = Object.keys,
        _ = i.bind,
        j = function(n) {
            return n instanceof j ? n : this instanceof j ? (this._wrapped =
                n, void 0) : new j(n)
        };
    "undefined" != typeof exports ? ("undefined" != typeof module && module
        .exports && (exports = module.exports = j), exports._ = j) : n._ =
        j, j.VERSION = "1.5.2";
    var A = j.each = j.forEach = function(n, t, e) {
        if (null != n)
            if (s && n.forEach === s) n.forEach(t, e);
            else if (n.length === +n.length) {
            for (var u = 0, i = n.length; i > u; u++)
                if (t.call(e, n[u], u, n) === r) return
        } else
            for (var a = j.keys(n), u = 0, i = a.length; i > u; u++)
                if (t.call(e, n[a[u]], a[u], n) === r) return
    };
    j.map = j.collect = function(n, t, r) {
        var e = [];
        return null == n ? e : p && n.map === p ? n.map(t, r) : (A(n,
            function(n, u, i) {
                e.push(t.call(r, n, u, i))
            }), e)
    };
    var E = "Reduce of empty array with no initial value";
    j.reduce = j.foldl = j.inject = function(n, t, r, e) {
        var u = arguments.length > 2;
        if (null == n && (n = []), h && n.reduce === h) return e && (t = j.bind(
            t, e)), u ? n.reduce(t, r) : n.reduce(t);
        if (A(n, function(n, i, a) {
            u ? r = t.call(e, r, n, i, a) : (r = n, u = !0)
        }), !u) throw new TypeError(E);
        return r
    }, j.reduceRight = j.foldr = function(n, t, r, e) {
        var u = arguments.length > 2;
        if (null == n && (n = []), v && n.reduceRight === v) return e && (t =
            j.bind(t, e)), u ? n.reduceRight(t, r) : n.reduceRight(t);
        var i = n.length;
        if (i !== +i) {
            var a = j.keys(n);
            i = a.length
        }
        if (A(n, function(o, c, l) {
            c = a ? a[--i] : --i, u ? r = t.call(e, r, n[c], c, l) :
                (r = n[c], u = !0)
        }), !u) throw new TypeError(E);
        return r
    }, j.find = j.detect = function(n, t, r) {
        var e;
        return O(n, function(n, u, i) {
            return t.call(r, n, u, i) ? (e = n, !0) : void 0
        }), e
    }, j.filter = j.select = function(n, t, r) {
        var e = [];
        return null == n ? e : g && n.filter === g ? n.filter(t, r) : (A(n,
            function(n, u, i) {
                t.call(r, n, u, i) && e.push(n)
            }), e)
    }, j.reject = function(n, t, r) {
        return j.filter(n, function(n, e, u) {
            return !t.call(r, n, e, u)
        }, r)
    }, j.every = j.all = function(n, t, e) {
        t || (t = j.identity);
        var u = !0;
        return null == n ? u : d && n.every === d ? n.every(t, e) : (A(n,
            function(n, i, a) {
                return (u = u && t.call(e, n, i, a)) ? void 0 : r
            }), !! u)
    };
    var O = j.some = j.any = function(n, t, e) {
        t || (t = j.identity);
        var u = !1;
        return null == n ? u : m && n.some === m ? n.some(t, e) : (A(n,
            function(n, i, a) {
                return u || (u = t.call(e, n, i, a)) ? r : void 0
            }), !! u)
    };
    j.contains = j.include = function(n, t) {
        return null == n ? !1 : y && n.indexOf === y ? n.indexOf(t) != -1 :
            O(n, function(n) {
                return n === t
            })
    }, j.invoke = function(n, t) {
        var r = o.call(arguments, 2),
            e = j.isFunction(t);
        return j.map(n, function(n) {
            return (e ? t : n[t]).apply(n, r)
        })
    }, j.pluck = function(n, t) {
        return j.map(n, function(n) {
            return n[t]
        })
    }, j.where = function(n, t, r) {
        return j.isEmpty(t) ? r ? void 0 : [] : j[r ? "find" : "filter"](n,
            function(n) {
                for (var r in t)
                    if (t[r] !== n[r]) return !1;
                return !0
            })
    }, j.findWhere = function(n, t) {
        return j.where(n, t, !0)
    }, j.max = function(n, t, r) {
        if (!t && j.isArray(n) && n[0] === +n[0] && n.length < 65535) return Math
            .max.apply(Math, n);
        if (!t && j.isEmpty(n)) return -1 / 0;
        var e = {
            computed: -1 / 0,
            value: -1 / 0
        };
        return A(n, function(n, u, i) {
            var a = t ? t.call(r, n, u, i) : n;
            a > e.computed && (e = {
                value: n,
                computed: a
            })
        }), e.value
    }, j.min = function(n, t, r) {
        if (!t && j.isArray(n) && n[0] === +n[0] && n.length < 65535) return Math
            .min.apply(Math, n);
        if (!t && j.isEmpty(n)) return 1 / 0;
        var e = {
            computed: 1 / 0,
            value: 1 / 0
        };
        return A(n, function(n, u, i) {
            var a = t ? t.call(r, n, u, i) : n;
            a < e.computed && (e = {
                value: n,
                computed: a
            })
        }), e.value
    }, j.shuffle = function(n) {
        var t, r = 0,
            e = [];
        return A(n, function(n) {
            t = j.random(r++), e[r - 1] = e[t], e[t] = n
        }), e
    }, j.sample = function(n, t, r) {
        return arguments.length < 2 || r ? n[j.random(n.length - 1)] : j.shuffle(
            n).slice(0, Math.max(0, t))
    };
    var k = function(n) {
        return j.isFunction(n) ? n : function(t) {
            return t[n]
        }
    };
    j.sortBy = function(n, t, r) {
        var e = k(t);
        return j.pluck(j.map(n, function(n, t, u) {
            return {
                value: n,
                index: t,
                criteria: e.call(r, n, t, u)
            }
        }).sort(function(n, t) {
            var r = n.criteria,
                e = t.criteria;
            if (r !== e) {
                if (r > e || r === void 0) return 1;
                if (e > r || e === void 0) return -1
            }
            return n.index - t.index
        }), "value")
    };
    var F = function(n) {
        return function(t, r, e) {
            var u = {}, i = null == r ? j.identity : k(r);
            return A(t, function(r, a) {
                var o = i.call(e, r, a, t);
                n(u, o, r)
            }), u
        }
    };
    j.groupBy = F(function(n, t, r) {
        (j.has(n, t) ? n[t] : n[t] = []).push(r)
    }), j.indexBy = F(function(n, t, r) {
        n[t] = r
    }), j.countBy = F(function(n, t) {
        j.has(n, t) ? n[t]++ : n[t] = 1
    }), j.sortedIndex = function(n, t, r, e) {
        r = null == r ? j.identity : k(r);
        for (var u = r.call(e, t), i = 0, a = n.length; a > i;) {
            var o = i + a >>> 1;
            r.call(e, n[o]) < u ? i = o + 1 : a = o
        }
        return i
    }, j.toArray = function(n) {
        return n ? j.isArray(n) ? o.call(n) : n.length === +n.length ? j.map(
            n, j.identity) : j.values(n) : []
    }, j.size = function(n) {
        return null == n ? 0 : n.length === +n.length ? n.length : j.keys(n)
            .length
    }, j.first = j.head = j.take = function(n, t, r) {
        return null == n ? void 0 : null == t || r ? n[0] : o.call(n, 0, t)
    }, j.initial = function(n, t, r) {
        return o.call(n, 0, n.length - (null == t || r ? 1 : t))
    }, j.last = function(n, t, r) {
        return null == n ? void 0 : null == t || r ? n[n.length - 1] : o.call(
            n, Math.max(n.length - t, 0))
    }, j.rest = j.tail = j.drop = function(n, t, r) {
        return o.call(n, null == t || r ? 1 : t)
    }, j.compact = function(n) {
        return j.filter(n, j.identity)
    };
    var M = function(n, t, r) {
        return t && j.every(n, j.isArray) ? c.apply(r, n) : (A(n, function(
            n) {
            j.isArray(n) || j.isArguments(n) ? t ? a.apply(r, n) :
                M(n, t, r) : r.push(n)
        }), r)
    };
    j.flatten = function(n, t) {
        return M(n, t, [])
    }, j.without = function(n) {
        return j.difference(n, o.call(arguments, 1))
    }, j.uniq = j.unique = function(n, t, r, e) {
        j.isFunction(t) && (e = r, r = t, t = !1);
        var u = r ? j.map(n, r, e) : n,
            i = [],
            a = [];
        return A(u, function(r, e) {
            (t ? e && a[a.length - 1] === r : j.contains(a, r)) || (a.push(
                r), i.push(n[e]))
        }), i
    }, j.union = function() {
        return j.uniq(j.flatten(arguments, !0))
    }, j.intersection = function(n) {
        var t = o.call(arguments, 1);
        return j.filter(j.uniq(n), function(n) {
            return j.every(t, function(t) {
                return j.indexOf(t, n) >= 0
            })
        })
    }, j.difference = function(n) {
        var t = c.apply(e, o.call(arguments, 1));
        return j.filter(n, function(n) {
            return !j.contains(t, n)
        })
    }, j.zip = function() {
        for (var n = j.max(j.pluck(arguments, "length").concat(0)), t = new Array(
                n), r = 0; n > r; r++) t[r] = j.pluck(arguments, "" + r);
        return t
    }, j.object = function(n, t) {
        if (null == n) return {};
        for (var r = {}, e = 0, u = n.length; u > e; e++) t ? r[n[e]] = t[e] :
            r[n[e][0]] = n[e][1];
        return r
    }, j.indexOf = function(n, t, r) {
        if (null == n) return -1;
        var e = 0,
            u = n.length;
        if (r) {
            if ("number" != typeof r) return e = j.sortedIndex(n, t), n[e] ===
                t ? e : -1;
            e = 0 > r ? Math.max(0, u + r) : r
        }
        if (y && n.indexOf === y) return n.indexOf(t, r);
        for (; u > e; e++)
            if (n[e] === t) return e;
        return -1
    }, j.lastIndexOf = function(n, t, r) {
        if (null == n) return -1;
        var e = null != r;
        if (b && n.lastIndexOf === b) return e ? n.lastIndexOf(t, r) : n.lastIndexOf(
            t);
        for (var u = e ? r : n.length; u--;)
            if (n[u] === t) return u;
        return -1
    }, j.range = function(n, t, r) {
        arguments.length <= 1 && (t = n || 0, n = 0), r = arguments[2] || 1;
        for (var e = Math.max(Math.ceil((t - n) / r), 0), u = 0, i = new Array(
                e); e > u;) i[u++] = n, n += r;
        return i
    };
    var R = function() {};
    j.bind = function(n, t) {
        var r, e;
        if (_ && n.bind === _) return _.apply(n, o.call(arguments, 1));
        if (!j.isFunction(n)) throw new TypeError;
        return r = o.call(arguments, 2), e = function() {
            if (!(this instanceof e)) return n.apply(t, r.concat(o.call(
                arguments)));
            R.prototype = n.prototype;
            var u = new R;
            R.prototype = null;
            var i = n.apply(u, r.concat(o.call(arguments)));
            return Object(i) === i ? i : u
        }
    }, j.partial = function(n) {
        var t = o.call(arguments, 1);
        return function() {
            return n.apply(this, t.concat(o.call(arguments)))
        }
    }, j.bindAll = function(n) {
        var t = o.call(arguments, 1);
        if (0 === t.length) throw new Error(
            "bindAll must be passed function names");
        return A(t, function(t) {
            n[t] = j.bind(n[t], n)
        }), n
    }, j.memoize = function(n, t) {
        var r = {};
        return t || (t = j.identity),
        function() {
            var e = t.apply(this, arguments);
            return j.has(r, e) ? r[e] : r[e] = n.apply(this, arguments)
        }
    }, j.delay = function(n, t) {
        var r = o.call(arguments, 2);
        return setTimeout(function() {
            return n.apply(null, r)
        }, t)
    }, j.defer = function(n) {
        return j.delay.apply(j, [n, 1].concat(o.call(arguments, 1)))
    }, j.throttle = function(n, t, r) {
        var e, u, i, a = null,
            o = 0;
        r || (r = {});
        var c = function() {
            o = r.leading === !1 ? 0 : new Date, a = null, i = n.apply(e, u)
        };
        return function() {
            var l = new Date;
            o || r.leading !== !1 || (o = l);
            var f = t - (l - o);
            return e = this, u = arguments, 0 >= f ? (clearTimeout(a), a =
                null, o = l, i = n.apply(e, u)) : a || r.trailing === !1 ||
                (a = setTimeout(c, f)), i
        }
    }, j.debounce = function(n, t, r) {
        var e, u, i, a, o;
        return function() {
            i = this, u = arguments, a = new Date;
            var c = function() {
                var l = new Date - a;
                t > l ? e = setTimeout(c, t - l) : (e = null, r || (o = n.apply(
                    i, u)))
            }, l = r && !e;
            return e || (e = setTimeout(c, t)), l && (o = n.apply(i, u)), o
        }
    }, j.once = function(n) {
        var t, r = !1;
        return function() {
            return r ? t : (r = !0, t = n.apply(this, arguments), n = null,
                t)
        }
    }, j.wrap = function(n, t) {
        return function() {
            var r = [n];
            return a.apply(r, arguments), t.apply(this, r)
        }
    }, j.compose = function() {
        var n = arguments;
        return function() {
            for (var t = arguments, r = n.length - 1; r >= 0; r--) t = [n[r]
                .apply(this, t)];
            return t[0]
        }
    }, j.after = function(n, t) {
        return function() {
            return --n < 1 ? t.apply(this, arguments) : void 0
        }
    }, j.keys = w || function(n) {
        if (n !== Object(n)) throw new TypeError("Invalid object");
        var t = [];
        for (var r in n) j.has(n, r) && t.push(r);
        return t
    }, j.values = function(n) {
        for (var t = j.keys(n), r = t.length, e = new Array(r), u = 0; r >
            u; u++) e[u] = n[t[u]];
        return e
    }, j.pairs = function(n) {
        for (var t = j.keys(n), r = t.length, e = new Array(r), u = 0; r >
            u; u++) e[u] = [t[u], n[t[u]]];
        return e
    }, j.invert = function(n) {
        for (var t = {}, r = j.keys(n), e = 0, u = r.length; u > e; e++) t[
            n[r[e]]] = r[e];
        return t
    }, j.functions = j.methods = function(n) {
        var t = [];
        for (var r in n) j.isFunction(n[r]) && t.push(r);
        return t.sort()
    }, j.extend = function(n) {
        return A(o.call(arguments, 1), function(t) {
            if (t)
                for (var r in t) n[r] = t[r]
        }), n
    }, j.pick = function(n) {
        var t = {}, r = c.apply(e, o.call(arguments, 1));
        return A(r, function(r) {
            r in n && (t[r] = n[r])
        }), t
    }, j.omit = function(n) {
        var t = {}, r = c.apply(e, o.call(arguments, 1));
        for (var u in n) j.contains(r, u) || (t[u] = n[u]);
        return t
    }, j.defaults = function(n) {
        return A(o.call(arguments, 1), function(t) {
            if (t)
                for (var r in t) n[r] === void 0 && (n[r] = t[r])
        }), n
    }, j.clone = function(n) {
        return j.isObject(n) ? j.isArray(n) ? n.slice() : j.extend({}, n) :
            n
    }, j.tap = function(n, t) {
        return t(n), n
    };
    var S = function(n, t, r, e) {
        if (n === t) return 0 !== n || 1 / n == 1 / t;
        if (null == n || null == t) return n === t;
        n instanceof j && (n = n._wrapped), t instanceof j && (t = t._wrapped);
        var u = l.call(n);
        if (u != l.call(t)) return !1;
        switch (u) {
            case "[object String]":
                return n == String(t);
            case "[object Number]":
                return n != +n ? t != +t : 0 == n ? 1 / n == 1 / t : n == +
                    t;
            case "[object Date]":
            case "[object Boolean]":
                return +n == +t;
            case "[object RegExp]":
                return n.source == t.source && n.global == t.global && n.multiline ==
                    t.multiline && n.ignoreCase == t.ignoreCase
        }
        if ("object" != typeof n || "object" != typeof t) return !1;
        for (var i = r.length; i--;)
            if (r[i] == n) return e[i] == t;
        var a = n.constructor,
            o = t.constructor;
        if (a !== o && !(j.isFunction(a) && a instanceof a && j.isFunction(
            o) && o instanceof o)) return !1;
        r.push(n), e.push(t);
        var c = 0,
            f = !0;
        if ("[object Array]" == u) {
            if (c = n.length, f = c == t.length)
                for (; c-- && (f = S(n[c], t[c], r, e)););
        } else {
            for (var s in n)
                if (j.has(n, s) && (c++, !(f = j.has(t, s) && S(n[s], t[s],
                    r, e)))) break;
            if (f) {
                for (s in t)
                    if (j.has(t, s) && !c--) break;
                f = !c
            }
        }
        return r.pop(), e.pop(), f
    };
    j.isEqual = function(n, t) {
        return S(n, t, [], [])
    }, j.isEmpty = function(n) {
        if (null == n) return !0;
        if (j.isArray(n) || j.isString(n)) return 0 === n.length;
        for (var t in n)
            if (j.has(n, t)) return !1;
        return !0
    }, j.isElement = function(n) {
        return !(!n || 1 !== n.nodeType)
    }, j.isArray = x || function(n) {
        return "[object Array]" == l.call(n)
    }, j.isObject = function(n) {
        return n === Object(n)
    }, A(["Arguments", "Function", "String", "Number", "Date", "RegExp"],
        function(n) {
            j["is" + n] = function(t) {
                return l.call(t) == "[object " + n + "]"
            }
        }), j.isArguments(arguments) || (j.isArguments = function(n) {
        return !(!n || !j.has(n, "callee"))
    }), "function" != typeof / . / && (j.isFunction = function(n) {
        return "function" == typeof n
    }), j.isFinite = function(n) {
        return isFinite(n) && !isNaN(parseFloat(n))
    }, j.isNaN = function(n) {
        return j.isNumber(n) && n != +n
    }, j.isBoolean = function(n) {
        return n === !0 || n === !1 || "[object Boolean]" == l.call(n)
    }, j.isNull = function(n) {
        return null === n
    }, j.isUndefined = function(n) {
        return n === void 0
    }, j.has = function(n, t) {
        return f.call(n, t)
    }, j.noConflict = function() {
        return n._ = t, this
    }, j.identity = function(n) {
        return n
    }, j.times = function(n, t, r) {
        for (var e = Array(Math.max(0, n)), u = 0; n > u; u++) e[u] = t.call(
            r, u);
        return e
    }, j.random = function(n, t) {
        return null == t && (t = n, n = 0), n + Math.floor(Math.random() *
            (t - n + 1))
    };
    var I = {
        escape: {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;"
        }
    };
    I.unescape = j.invert(I.escape);
    var T = {
        escape: new RegExp("[" + j.keys(I.escape).join("") + "]", "g"),
        unescape: new RegExp("(" + j.keys(I.unescape).join("|") + ")", "g")
    };
    j.each(["escape", "unescape"], function(n) {
        j[n] = function(t) {
            return null == t ? "" : ("" + t).replace(T[n], function(t) {
                return I[n][t]
            })
        }
    }), j.result = function(n, t) {
        if (null == n) return void 0;
        var r = n[t];
        return j.isFunction(r) ? r.call(n) : r
    }, j.mixin = function(n) {
        A(j.functions(n), function(t) {
            var r = j[t] = n[t];
            j.prototype[t] = function() {
                var n = [this._wrapped];
                return a.apply(n, arguments), z.call(this, r.apply(j, n))
            }
        })
    };
    var N = 0;
    j.uniqueId = function(n) {
        var t = ++N + "";
        return n ? n + t : t
    }, j.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var q = /(.)^/,
        B = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "	": "t",
            "\u2028": "u2028",
            "\u2029": "u2029"
        }, D = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    j.template = function(n, t, r) {
        var e;
        r = j.defaults({}, r, j.templateSettings);
        var u = new RegExp([(r.escape || q).source, (r.interpolate || q).source, (
            r.evaluate || q).source].join("|") + "|$", "g"),
            i = 0,
            a = "__p+='";
        n.replace(u, function(t, r, e, u, o) {
            return a += n.slice(i, o).replace(D, function(n) {
                return "\\" + B[n]
            }), r && (a += "'+\n((__t=(" + r +
                "))==null?'':_.escape(__t))+\n'"), e && (a +=
                "'+\n((__t=(" + e + "))==null?'':__t)+\n'"), u && (a +=
                "';\n" + u + "\n__p+='"), i = o + t.length, t
        }), a += "';\n", r.variable || (a = "with(obj||{}){\n" + a + "}\n"),
        a = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" + a +
            "return __p;\n";
        try {
            e = new Function(r.variable || "obj", "_", a)
        } catch (o) {
            throw o.source = a, o
        }
        if (t) return e(t, j);
        var c = function(n) {
            return e.call(this, n, j)
        };
        return c.source = "function(" + (r.variable || "obj") + "){\n" + a +
            "}", c
    }, j.chain = function(n) {
        return j(n).chain()
    };
    var z = function(n) {
        return this._chain ? j(n).chain() : n
    };
    j.mixin(j), A(["pop", "push", "reverse", "shift", "sort", "splice",
        "unshift"], function(n) {
        var t = e[n];
        j.prototype[n] = function() {
            var r = this._wrapped;
            return t.apply(r, arguments), "shift" != n && "splice" != n ||
                0 !== r.length || delete r[0], z.call(this, r)
        }
    }), A(["concat", "join", "slice"], function(n) {
        var t = e[n];
        j.prototype[n] = function() {
            return z.call(this, t.apply(this._wrapped, arguments))
        }
    }), j.extend(j.prototype, {
        chain: function() {
            return this._chain = !0, this
        },
        value: function() {
            return this._wrapped
        }
    })
}).call(this);
//# sourceMappingURL=underscore-min.map
;
define("underscore", (function (global) {
    return function () {
        var ret, fn;
        return ret || global._;
    };
}(this)));

/**
   Hash class used to generate hashcodes for JavaScript objects. The hashcode
   is stored as a property of the object, but it is set to non-enumerable and
   cannot be changed, thereby guaranteeing the consistency of hashcodes.

   @module util/hash
   @class Hash
 */
define('util/hash',['underscore'], function(_) {
    

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var currentHash = 0,
        INIT_CAPACITY = 16,
        LOAD_FACTOR = 2;

    var module = {

        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
           Return a hashcode for this object. Does not conform to the Java
           standard that two objects that are structurally identical should
           yield the same hashcode.
           @param   {Object} object     -   Object to get hashcode for
           @return  {integer}           Hashcode for object
         */
        hashcode: function(object) {
            if (object._hashId === undefined) {
                Object.defineProperty(object, '_hashId', {
                    value: currentHash,
                    enumerable: false
                });
                currentHash++;
            }
            return object._hashId;
        },
        /**
           Hashset data structure used to store unique objects without duplicates.
           The hashset will add identical items of the same type, as long as they are
           not the exact same object (or the hashcode property is identical). For more
           info, see the {{#crossLink module}}{{/crossLink}} class.

           @class Hashset
        */
        /**
           @class Hashset
           @constructor
         */
        Hashset: function() {
            var _this = this;
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            var bucket = new Array(INIT_CAPACITY),
                size = 0,
                capacity = INIT_CAPACITY,
                indicesTaken = [];
            /**
               Resolve a collision in the hashset.

               @method resolveCollision
               @private
               @param  {Object} object
               @param  {integer} index Index where collision occurred
               @return {boolean} Whether or not the item was added to the set
             */
            function resolveCollision(object, index) {
                var location = bucket[index];
                if (_.isArray(location)) {
                    if (_.contains(location, object)) {
                        return false;
                    } else {
                        location.push(object);
                        return true;
                    }
                } else {
                    bucket[index] = [location, object];
                    return true;
                }
            }
            /**
               Add the index of a location that is currently occupied in the
               array.

               @method addIndex
               @private
               @param  {integer} idx Index of occupied location
             */
            function addIndex(idx) {
                // Add idx to the sorted indicesTaken array
                var spot = _.sortedIndex(indicesTaken, idx);
                if (indicesTaken[spot] !== idx) {
                    indicesTaken.splice(spot, 0, idx);
                }
            }
            /**
               Helper method to rehash the array when the objects inserted
               exceeds half of the total capacity.

               @method rehash
               @private
               @return {void}
             */
            function rehash() {
                // Create new bucket that is double the size
                var oldBucket = bucket;
                capacity *= 2;
                bucket = new Array(capacity);
                indicesTaken = [];
                // Transfer all elements to new array
                var bucketLen = oldBucket.length;
                for (var i = 0; i < bucketLan; i++) {
                    var object = oldBucket[i];
                    if (_.isArray(object)) {
                        var subArray = object,
                            subArrayLen = subArray.length;
                        for (var j = 0; j < subArrayLen; j++) {
                            var element = subArray[j];
                            insert(element);
                        }
                    } else {
                        insert(object);
                    }
                }
            }
            /**
               Insert an object into the internal array.

               @method insert
               @private
               @param  {Object} object An object to insert into the array
               @param  {Object} [hashTarget=`object`] An object used to generate a
               hashcode
               @return {boolean} Whether or not the object was inserted into the
               array
             */
            function insert(object, hashTarget) {
                var originalTarget = hashTarget || null;
                hashTarget = hashTarget || object;
                var index = module.hashcode(hashTarget) % capacity,
                    location = bucket[index];
                var locKey;
                if (location) {
                    locKey = location.key;
                }
                if (location === undefined) {
                    bucket[index] = object;
                    addIndex(index);
                    return true;
                } else if (location === object || originalTarget === locKey) {
                    return false;
                } else {
                    return resolveCollision(object, index);
                }
            }
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            Object.defineProperties(this, {
                /**
                   The size of the Hashset
                   @type {integer}
                   @property length
                 */
                length: {
                    get: function() {
                        return size;
                    }
                }
            });
            /**
               Add an object
               @function
               @param   {Object} object         -   Object to add
               @param   {Object} [hashTarget]   -   Object to module
               @return  {boolean}           Whether or not the insertion was successful
             */
            this.add = function(object, hashTarget) {
                var originalTarget = hashTarget || null;
                hashTarget = hashTarget || object;
                if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                    object)) {
                    return false;
                }
                var inserted = insert(object, hashTarget);
                if (inserted) {
                    size++;
                    if (size / capacity > LOAD_FACTOR) {
                        rehash();
                    }
                    return true;
                }
                return false;
            };
            /**
               Clear the Hashset instance of all elements
               @return  {void}
             */
            this.clear = function() {
                bucket = new Array(INIT_CAPACITY);
                size = 0;
                capacity = INIT_CAPACITY;
                indicesTaken = [];
            };
            /**
               Check if an object is an element of this set
               @function
               @param   {Object} object     -   An object _this may be an element
               @return  {boolean}           Whether or not the object is an element
             */
            this.contains = function(object, hashTarget) {
                var originalTarget = hashTarget || null;
                hashTarget = hashTarget || object;
                if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                    object)) {
                    return false;
                }
                var index = module.hashcode(hashTarget) % capacity,
                    location = bucket[index];
                var locKey;
                if (location) {
                    locKey = location.key;
                }
                if (location === object || originalTarget === locKey) {
                    return true;
                } else if (_.isArray(location)) {
                    for (var i = 0; i < location.length; i++) {
                        var elem = location[i];
                        var elemKey;
                        if (elem) {
                            elemKey = elem.key;
                        }
                        if (elem === object || originalTarget === elemKey) {
                            return true;
                        }
                    }
                }
                return false;
            };
            /**
               Remove an object
               @function
               @param {Object} object       - An object
               @return {boolean}            True if removed object from set, false if object could not be removed from set
             */
            this.remove = function(object, hashTarget) {
                var originalTarget = hashTarget || null;
                hashTarget = hashTarget || object;
                if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                    object)) {
                    return false;
                }
                var contained = _this.contains(object, originalTarget);
                if (contained) {
                    var index = module.hashcode(hashTarget) % capacity,
                        location = bucket[index];
                    var locKey;
                    if (location) {
                        locKey = location.key;
                    }
                    if (location === object || locKey === originalTarget) {
                        bucket[index] = undefined;
                        indicesTaken = _.without(indicesTaken, index);
                        size--;
                        return true;
                    } else {
                        for (var i = 0; i < location.length; i++) {
                            if (location[i] === object) {
                                location[i] = undefined;
                                size--;
                                return true;
                            }
                        }
                    }
                }
                return false;
            };
            this.get = function(object, hashTarget) {
                var originalTarget = hashTarget || null;
                hashTarget = hashTarget || object;
                var index = module.hashcode(hashTarget) % capacity,
                    location = bucket[index];
                var locKey;
                if (location) {
                    locKey = location.key;
                }
                if (location === undefined) {
                    return null;
                } else if (location === object || locKey === originalTarget) {
                    return location;
                } else {
                    var arrLen = location.length;
                    for (var i = 0; i < arrLen; i++) {
                        var element = location[i],
                            elemKey = element.key;
                        if (element === object || elemKey ===
                            originalTarget) {
                            return element;
                        }
                    }
                    return null;
                }
            };
            this.forEach = function(f) {
                var
                numIndices = indicesTaken.length,
                    done;

                for (var i = 0; i < numIndices; i++) {
                    var idx = indicesTaken[i],
                        current = bucket[idx];
                    if (_.isArray(current)) {
                        var arrLen = current.length;
                        for (var j = 0; j < arrLen; j++) {
                            var element = current[j];
                            done = f(element);
                        }
                        if (done === true) {
                            return;
                        }
                    } else {
                        done = f(current);
                        if (done === true) {
                            return;
                        }
                    }
                }
            };
        },
        /**
            Hashtable implementation to map objects to other objects.

            @class Hashtable
         */
        /**
            @class Hashtable
            @constructor
         */
        Hashtable: function() {
            var _this = this;
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            var hashset = new module.Hashset();
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            this.put = function(key, value) {
                var entry = {
                    key: key,
                    value: value
                };
                return hashset.add(entry, key);
            };
            this.get = function(key) {
                return hashset.get(key, key).value;
            };
            this.containsKey = function(key) {
                return hashset.contains(key, key);
            };
            this.remove = function(key) {
                return hashset.remove(key, key);
            };
            this.clear = function() {
                hashset.clear();
            };
            this.forEach = function(f) {
                hashset.forEach(function(entry) {
                    f(entry.key, entry.value);
                });
            };
            Object.defineProperties(this, {
                length: {
                    get: function() {
                        return hashset.length;
                    }
                }
            });
        }
    };
    return module;
});

define('util/minheap',[], function() {
    
    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    var DEFAULT_SIZE = 16;
    /**
       @module modulePath
       @module modulePath
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        /**
           @class MinHeap
           @constructor
           @param {Function|number} [arg1=numeric_comparator|16] Comparator function (if one argument) or size (if two arguments)
           @param {Function} [arg2=numeric_comparator] Comparator function
         */
        MinHeap: function() {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var size = DEFAULT_SIZE,
                comparator = function(data1, data2) {
                    return data1 - data2;
                };
            if (arguments.length === 2) {
                // parameters are size then comparator
                size = arguments[0];
                comparator = arguments[1];
            } else if (arguments.length === 1) {
                comparator = arguments[0];
            } else if (arguments.length > 2) {
                throw new Error(
                    'Invalid parameters for MinHeap constructor');
            }
            var _this = this,
                data = new Array(size),
                heapSize = 0;

            /**
                Get index in array of left child

                @method getLeftChildIndex
                @private
                @param  {number} nodeIndex Index of parent
                @return {number} Index of left child in array
             */
            function getLeftChildIndex(nodeIndex) {
                return 2 * nodeIndex + 1;
            }

            /**
                Get index in array of right child

                @method getRightChildIndex
                @private
                @param  {number} nodeIndex Index of parent
                @return {number} Index of right child in array
             */
            function getRightChildIndex(nodeIndex) {
                return 2 * nodeIndex + 2;
            }

            /**
                Get index of parent

                @method getParentIndex
                @private
                @param  {number} nodeIndex Index of child
                @return {number} Index of parent
             */
            function getParentIndex(nodeIndex) {
                return Math.floor((nodeIndex + 1) / 2) - 1;
            }

            /**
                Heapify

                @method bubbleUp
                @private
                @param  {number} nodeIndex Index to bubbleUp
                @return {void}
             */
            function bubbleUp(nodeIndex) {
                if (nodeIndex === 0) {
                    return;
                }
                var parentIndex = getParentIndex(nodeIndex);
                if (comparator(data[parentIndex], data[nodeIndex]) > 0 &&
                    parentIndex >= 0) {
                    var newNodeIndex = data[parentIndex];
                    data[parentIndex] = data[nodeIndex];
                    data[nodeIndex] = newNodeIndex;
                    nodeIndex = parentIndex;
                    bubbleUp(nodeIndex);
                } else {
                    return;
                }
            }

            /**
                Remove minimum element from heap

                @method removeMin
                @private
                @return {Object} Data of minimum node
             */
            function removeMin() {
                if (heapSize === 0) {
                    return;
                }
                data[0] = data[heapSize - 1];
                heapSize--;
                if (heapSize > 0) {
                    bubbleDown(0);
                }
            }

            /**
                Heapify

                @method bubbleDown
                @private
                @param  {number} nodeIndex Index of node to modify
                @return {void}
             */
            function bubbleDown(nodeIndex) {
                var leftChildIndex = getLeftChildIndex(nodeIndex),
                    rightChildIndex = getRightChildIndex(nodeIndex),
                    smallerValueIndex;
                // This long if else assigns the smaller child
                if (leftChildIndex < heapSize && rightChildIndex < heapSize) {
                    if (comparator(data[leftChildIndex], data[
                        rightChildIndex]) < 0) {
                        smallerValueIndex = leftChildIndex;
                    } else {
                        smallerValueIndex = rightChildIndex;
                    }
                } else if (leftChildIndex < heapSize) {
                    smallerValueIndex = leftChildIndex;
                } else if (rightChildIndex < heapSize) {
                    smallerValueIndex = rightChildIndex;
                } else {
                    return;
                }
                if (smallerValueIndex >= 0 && comparator(data[
                    smallerValueIndex], data[nodeIndex]) < 0) {
                    var temp = data[nodeIndex];
                    data[nodeIndex] = data[smallerValueIndex];
                    data[smallerValueIndex] = temp;
                    nodeIndex = smallerValueIndex;
                    bubbleDown(nodeIndex);
                }
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            /**
                Add object to MinHeap

                @method add
                @param  {Object} object Object to add
                @return {void}
             */
            this.add = function(object) {
                heapSize++;
                var currentIndex = heapSize - 1;
                data[currentIndex] = object;
                bubbleUp(currentIndex);
            };

            /**
                Return the minimum element and extract it

                @method poll
                @return {Object} The minimum element
             */
            this.poll = function() {
                var min = data[0];
                removeMin();
                return min;
            };

            /**
                Return the minimum element without extracting it

                @method peek
                @return {Object} The minimum element
             */
            this.peek = function() {
                return data[0];
            };

            /**
                Clear the MinHeap of all elements

                @method clear
                @return {void}
             */
            this.clear = function() {
                heapSize = 0;
                data.forEach(function(element, index) {
                    delete data[index];
                });
            };

            Object.defineProperties(this, {
                /**
                    Number of elements in the MinHeap

                    @property length
                    @type {number}
                 */
                length: {
                    get: function() {
                        return heapSize;
                    }
                }
            });
        }
    };

    return module;
});

/**
    Graph abstract data structure to represent maze structure.

    @class Graph
 */
define('util/graph',[
    'util/hash',
    'util/minheap'
], function(Hash, MinHeap) {
    

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
       @module util/graph
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        construct: function(dictionary) {
            var
            graph = new module.Graph(),
                key;

            // Add the nodes to the graph
            for (key in dictionary) {
                if (dictionary.hasOwnProperty(key)) {
                    key = parseInt(key);
                    graph.addNode(key);
                }
            }
            // Add the edges
            for (key in dictionary) {
                if (dictionary.hasOwnProperty(key)) {
                    key = parseInt(key);

                    var
                    node = graph.getNode(key),
                        neighborArr = dictionary[key],
                        neighborArrLen = neighborArr.length;

                    for (var i = 0; i < neighborArrLen; i++) {
                        var
                        neighborKey = neighborArr[i],
                            neighbor = graph.getNode(neighborKey);

                        graph.addEdge(node, neighbor);
                    }
                }
            }
            return graph;
        },

        /**
           @class Graph
           @constructor
         */
        Graph: function() {
            var _this = this;
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var nodes = new Hash.Hashset(),
                edges = new Hash.Hashset(),
                adjacencyList = new Hash.Hashtable();


            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            Object.defineProperties(this, {
                nodes: {
                    get: function() {
                        return nodes;
                    }
                },

                edges: {
                    get: function() {
                        return edges;
                    }
                },

                adjacencyList: {
                    get: function() {
                        return adjacencyList;
                    }
                }
            });

            /**
                Inner GraphNode class

                @class GraphNode
                @for Graph
                @constructor
                @param  {[type]} data [description]
             */
            function GraphNode(data) {
                var thisNode = this;
                this.data = data;
                var edges = new Hash.Hashset();
                adjacencyList.put(this, edges);

                Object.defineProperties(this, {
                    /**
                        Edges of node

                        @property edges
                        @type {Hashset}
                     */
                    edges: {
                        get: function() {
                            return adjacencyList.get(thisNode);
                        }
                    },

                    /**
                        Neighbors of node

                        @property neighbors
                        @type {Hashset}
                     */
                    neighbors: {
                        get: function() {
                            var neighborSet = new Hash.Hashset();
                            thisNode.edges.forEach(function(edge) {
                                neighborSet.add(edge.head);
                            });
                            return neighborSet;
                        }
                    }
                });

                /**
                    Find all the nodes that are reachable from this node

                    @for Graph
                    @method reachableNodes
                    @return {Hashset} Set of reachable nodes
                 */
                this.reachableNodes = function() {
                    // Inner helper function
                    function reachableNodesHelper(node, set, visitedSet) {
                        if (visitedSet.contains(node)) {
                            return;
                        }
                        set.add(node);
                        node.neighbors.forEach(function(otherNode) {
                            reachableNodesHelper(otherNode, set,
                                visitedSet);
                        });
                    }

                    // Main code
                    var reachableSet = new Hash.Hashset();
                    reachableNodesHelper(thisNode, reachableSet,
                        new Hash.Hashset());
                    return reachableSet;
                };
            }

            /**
                @class GraphEdge
                @for Graph
                @constructor
                @param {GraphNode} tail Tail node of edge
                @param {GraphNode} head Head node of edge
                @param {number} [weight=0] Weight of edge
                @param {Object} [data=undefined] Data object for node
             */
            function GraphEdge(tail, head, weight, data) {
                /**
                    Tail node of edge

                    @property tail
                    @type {GraphNode}
                 */
                this.tail = tail;

                /**
                    Head node of edge

                    @property head
                    @type {GraphNode}
                 */
                this.head = head;

                /**
                    Weight of edge

                    @property weight
                    @type {number}
                    @for Graph
                 */
                this.weight = weight || 0;

                this.data = data;
            }

            /**
                Add a node to the graph

                @method addNode
                @param   {Object} data Data to be stored in the node
                @return  {GraphNode} A node with the data
             */
            this.addNode = function(data) {
                var node = new GraphNode(data);
                nodes.add(node);
                return node;
            };

            /**
                Add an edge to the graph

                @method addEdge
                @param   {GraphNode} tail The origin node of the edge
                @param   {GraphNode} head The destination node of the edge
                @return  {GraphEdge} A directed edge connecting the nodes
             */
            this.addEdge = function(tail, head) {
                var edge = new GraphEdge(tail, head);
                edges.add(edge);
                adjacencyList.get(tail).add(edge);
                return edge;
            };

            /**
                Get edge with given tail and head.

                @method getEdge
                @param  {GraphNode} tail Tail node
                @param  {GraphNode} head Head node
                @return {GraphEdge} If edge exists, the edge, otherwise,
                undefined.
             */
            this.getEdge = function(tail, head) {
                return this.adjacencyList.get(tail).toArray()
                    .filter(function(edge) {
                        return edge.head === head;
                    })[0];
            };

            /**
                Remove an edge from the graph

                @method removeEdge
                @param   {GraphNode} tail       The origin node of the edge
                @param   {GraphNode} head       The destination node of the edge
                @return  {void}
             */
            this.removeEdge = function(tail, head) {
                var removeEdge;
                tail.edges.forEach(function(edge) {
                    if (edge.tail === tail && edge.head === head) {
                        removeEdge = edge;
                        // Terminate iter
                        return true;
                    }
                });
                edges.remove(removeEdge);
                tail.edges.remove(removeEdge);
            };

            /**
                Perform a depth first search of the graph

                @method depthFirstSearch
                @param {Function} f The operation to perform on the visited
                nodes
                @return {void}
             */
            this.depthFirstSearch = function(f) {
                // Inner helper function
                function depthFirstSearchHelper(node) {
                    if (visitedSet.contains(node)) {
                        return true;
                    }
                    visitedSet.add(node);
                    var doneSearching = f(node);
                    if (doneSearching !== true) {
                        var ret;
                        node.neighbors.forEach(function(neighbor) {
                            ret = depthFirstSearchHelper(neighbor) ||
                                ret;
                        });
                        return ret;
                    }
                    return doneSearching;
                }

                // Main code
                var visitedSet = new Hash.Hashset(),
                    doneSearching = false;
                nodes.forEach(function(node) {
                    if (doneSearching === true) {
                        return;
                    }
                    doneSearching = depthFirstSearchHelper(node);
                });
            };

            /**
               Perform a breadth first search on the graph

               @method breadthFirstSearch
               @param {function} f The operation to perform on the visited
               nodes
               @return {void}
             */
            this.breadthFirstSearch = function(f) {
                var visitedSet = new Hash.Hashset(),
                    nodeQueue = [],
                    nodeQueueIndex = 0;
                nodes.forEach(function(node) {
                    nodeQueue.push(node);
                });
                while (nodeQueueIndex < nodeQueue.length) {
                    var node = nodeQueue[nodeQueueIndex++],
                        doneSearching = breadthFirstSearchHelper(node);
                    if (doneSearching) {
                        return; // Terminate the search
                    }
                }
                // Inner helper function
                function breadthFirstSearchHelper(node) {
                    if (visitedSet.contains(node)) {
                        return; // Skip this node
                    }
                    visitedSet.add(node);
                    var doneSearching = f(node) || false;
                    if (doneSearching !== true) {
                        node.neighbors.forEach(function(neighbor) {
                            nodeQueue.push(neighbor);
                        });
                    }
                    return doneSearching;
                }
            };

            /**
                Dijkstra's algorithm

                @method dijkstra
                @param  {GraphNode} source Source node
                @param  {GraphNode} destination Destination node
                @return {void}
             */
            this.dijkstra = function(source, destination) {
                nodes.forEach(function(node) {
                    node.weight = Infinity;
                    node.visited = false;
                    // Set node.previous to undefined
                    delete node.previous;
                });

                // Distance of source to itself is 0
                source.weight = 0;

                // MinHeap for graph nodes
                var queue = new MinHeap.MinHeap(function(graphNode1,
                    graphNode2) {
                    // Comparator function that handles Infinity too
                    if (isFinite(graphNode1.weight) && isFinite(
                        graphNode2)) {
                        return graphNode1.weight - graphNode2.weight;
                    } else if (isFinite(graphNode1)) {
                        return -1;
                    } else if (isFinite(graphNode2)) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                queue.add(source);

                // Function to use as parameter in forEach function below
                var relaxEdge = function(v) {
                    // Assuming all edges have equal distance, the distance
                    // between all nodes is 1
                    var alt = u.weight + 1;
                    if (alt < v.weight) {
                        v.weight = alt;
                        v.previous = u;
                        if (!v.visited) {
                            queue.add(v);
                        }
                    }
                };

                while (queue.length !== 0) {
                    var u = queue.poll();
                    u.visited = true;
                    if (u === destination) {
                        return;
                    }
                    u.neighbors.forEach(relaxEdge);
                }
            };

            this.kruskal = function(set) {
                var minSpanningTree = new module.Graph(),
                    clonedNodesTable = new Hash.Hashtable();

                nodes.forEach(function(node) {
                    var nodeClone = minSpanningTree.addNode(node.data);
                    clonedNodesTable.put(node, nodeClone);
                });

                var edgeArr = edges.toArray();
                edgeArr.sort(function(edge1, edge2) {
                    return edge1.weight - edge2.weight;
                });
                edgeArr.forEach(function(edge) {
                    var tailClone = clonedNodesTable.get(edge.tail),
                        tailSet = tailClone.reachableNodes(),
                        headClone = clonedNodesTable.get(edge.head),
                        headSet = headClone.reachableNodes();

                    if (!tailSet.equals(headSet)) {
                        minSpanningTree.addEdge(tailClone, headClone);
                    }
                });
                return minSpanningTree;
            };

            /**
                Convert the graph to dictionary of node hashcodes with a
                corresponding array of edges.

                @method toDictionary
                @return {Object} Dictionary representing graph
             */
            this.toDictionary = function() {
                var dictionary = {};
                this.nodes.forEach(function(node) {
                    var neighbors = [];
                    node.neighbors.forEach(function(neighbor) {
                        var hashcode = Hash.hashcode(neighbor);
                        neighbors.push(hashcode);
                    });
                    var hashId = Hash.hashcode(node);
                    dictionary[hashId] = neighbors;
                });
                return dictionary;
            };

            /**
               Get a node with the given data

               @method getNode
               @param  {Object} data The data in the desired node
               @return {GraphNode} The desired node
            */
            this.getNode = function(data) {
                var ret;
                this.nodes.forEach(function(node) {
                    if (node.data === data) {
                        ret = node;
                        return true;
                    }
                });
                return ret;
            };
        }
    };

    return module;
});

require.config({
    baseUrl: './',
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore'
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});

addEventListener('message', function(mainEvent) {
    require(['util/graph'], function(Graph) {
        



        var g = new Graph.Graph();
        console.debug(g);

        var source = g.addNode(0);
        g.addNode(1);
        g.addNode(2);
        g.addNode(3);
        g.addNode(4);
        var dest = g.addNode(5);
        g.addNode(6);
        g.addNode(7);
        g.addNode(8);
        g.addNode(9);
        g.addNode(10);


        g.addEdge(source, g.getNode(2));
        g.addEdge(g.getNode(2), g.getNode(3));
        g.addEdge(g.getNode(3), g.getNode(4));
        g.addEdge(g.getNode(4), dest);
        g.addEdge(source, g.getNode(6));
        g.addEdge(g.getNode(6), g.getNode(7));
        g.addEdge(g.getNode(7), g.getNode(8));
        g.addEdge(g.getNode(8), dest);
        g.addEdge(source, g.getNode(9));
        g.addEdge(g.getNode(9), g.getNode(10));
        g.addEdge(g.getNode(10), dest);

        //g.dijsktra(source);


        var neighs = source.neighbors;
        neighs.forEach(function(
            neighbor) {
            console.debug(neighbor.data);
        });


        /*var
        obj = {
            0: [1, 2, 3],
            1: [0, 3],
            2: [0, 2],
            3: [1, 2]
        },
            graph = Graph.construct(obj);

        nodes = graph.getNode(0).neighbors;

        nodes.forEach(function(neighbor) {
            console.debug(neighbor.data);
        });*/
    });
});

define("task", function(){});
