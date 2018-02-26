//common constants
var UNDEF = 'undefined',
	NULL = 'null';

//core definition
var Core = function()
{
	//Css manipulation utility
	this.cssMan = new function () {
		this.getStyleSheet = function (name)
		{
			return document.styleSheets[name] || document.styleSheets.item(name);
		}
	}
	
	//mutation observer
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	//core prototype - implements utility functions into elements
	this.prototype = function(_elem, apply)
	{
		this[0] = _elem;

		//write a line to the element
		this.writeLine = function (str)
		{
			try {
				var elem = this[0];
	
				function insertText(str)
				{
					elem.insertAdjacentText("beforeEnd", str);
				}
	
				var typecheck = new core.TypeCheck(str);
				if (typecheck.isArray)
					str.forEach(insertText);
				else if (typecheck.isString)
					insertText(str);
				else
					core.debugging.warning("Core: Cannot write line to element text. Make sure the argument is either a String or an Array.");
			}
			catch (err)
			{
				core.debugging.warning("Core: Invalid operation.")
			}

			return this;
		}

		//prepend the element to another element
		this.prependTo = function (dest)
		{
			try
			{
				dest.insertBefore(this, dest.childNodes[0]);
			}
			catch (err)
			{
				core.debugging.warning("Core: Invalid operation.")
			}

			return this;
		}

		//get the element's absolute coordinates
		this.cumulativeOffset = function ()
		{
			var left = 0,
				top = 0,
				elem = this[0];

			do {
				//sum offset
				left += elem.offsetLeft || 0;
				top += elem.offsetTop || 0;

				//get parent
				elem = elem.offsetParent;
			} while (elem)

			return {
				left: left,
				top: top
				};
		}
		
		this.animate = function (properties) {
			return core.animation.animate(this[0], properties)
		}
		
		//Prototype Application
		//applies the Core prototype to an element
		if (apply != false)
		{
			return new core.prototype(_elem, false);
		}
	}

	//Enables the use of simple Web Animations API animations.
	this.animation = new function () {
		var _animation = this;
		
		this.presetKeyframes = {
			fadeIn: { filter: ["opacity(0)", "opacity(1)"] }, 
			fadeOut: { filter: ["opacity(1)", "opacity(0)"] },
			bounce: { transform: ["translate(0, 0)", "translate(10%, 0)", "translate(-10%, 0)", 
				"translate(10%, 0)", "translate(-10%, 0)", "translate(0, 0)"] },
			grow: { transform: ["scale(.8)", "scale(1)"] },
			shrink: { transform: ["scale(1.2)", "scale(1)"] },
			flip: { transform: ["rotateX(90deg)", "rotateX(0deg)"] }
		}
		
		this.registerPresetKeyframes = function (name, keyframesObj)
		{
			//Check for duplicates
			if (core.typeCheck.isUndefined(this.presetKeyframes[name]))
				this.presetKeyframes[name] = keyframesObj;
			else
			{
				core.debugging.warning("Could not register keframes. The specified name is already in use.");
				return false;
			}
			
			return true;
		}
		
		this.removePresetKeyframes = function (name)
		{
			delete this.presetKeyframes[name];
		}
		
		this.AnimationProperties = function (keyframes, options)
		{
			this.keyframes = keyframes;
			this.options = options;
		}
		
		this.animate = function (elem, properties)
		{
			return elem.animate(properties.keyframes, properties.options);
		}
	}

	//array manipulator utility
	this.arrayMan = new function () {
		this.syncArrays = function (sourceArray, destArray, removeCallback, insertCallback, changeCallback, thisArg)
		{
			//check argument validity
			if (core.typeCheck.isArray(sourceArray) && core.typeCheck.isArray(destArray) && core.typeCheck.isFunction(removeCallback)
				&& core.typeCheck.isFunction(insertCallback) && core.typeCheck.isFunction(changeCallback))
			{
				//change the items both arrays have in common
				for (var i = 0; i < sourceArray.length && i < destArray.length; i++)
					//call <function removeCallback(sourceArray, destArray, index) { }>
					changeCallback.call(thisArg, sourceArray, destArray, i);

				//if there are not enough items, insert new ones
				if (sourceArray.length > destArray.length)
					for (var i = Math.max(destArray.length - 1, 0); i < sourceArray.length; i++)
					{
						destArray.splice(i, 0,
							//call <function removeCallback(sourceArray, index) { }>
							insertCallback.call(thisArg, sourceArray, i));
					}

				//if there are items in excess, remove those
				else if (sourceArray.length < destArray.length)
					for (var i = Math.max(sourceArray.length - 1, 0); i < destArray.length; i++)
					{
						var removedItem = destArray.splice(i, 1)[0];
						//call <function removeCallback(splicedItem, index) { }>
						removeCallback.call(thisArg, removedItem, i);
					}
			}
			else
				core.debugging.error("Core: Invalid operation. Please make sure both <sourceArray> and <destArray> are of type <Array>, "
					+ "and that <removeCallback>, <insertCallback> and <changeCallback> are functions.");
		}
		
		this.selectByAttribute = function (arr, attrName, attrVal)
		{
			if (core.typeCheck.isArray(arr))
			{
				//iterate through array items
				for (var i = 0; i < arr.length; i++)
					//check if item attribute value corresponds to desired value
					if (arr[i][attrName] === attrVal)
						return arr[i];
			}
			else
				core.debugging.error("Core: Invalid operation. Parameter <arr> is not a valid <Array>.");
			
			return null;
		}
	}

	//array synchronization utility class
	this.ArraySync = function (src, dest) {
		this.source = src;
		this.destination = dest;

		this.syncArrays = function (removeCallback, insertCallback, changeCallback, thisArg)
		{
			core.arrayMan.syncArrays(this.source, this.destination, removeCallback, insertCallback, changeCallback);
		}
	}

	//utility for logging application debug information
	this.debugging = new function ()
	{
		var _debugging = this;
		this.entries = [];

		function log (title, message, internalErr)
		{
			try
			{
				var stack = !!Error ? new Error().stack : null,
					date = new Date();

				_debugging.entries.push({
					title: title,
					message: message,
					stackString: String(stack),
					dateString: date.toString(),
					internalMessage: !!internalErr ? internalErr.message : ""
				});
			}
			catch(err)
			{
				_debugging.entries.push("Core: Could not log debug information. Internal error: \"" + err.message + "\".");
			}
		}

		this.error = function (message, internalErr)
		{
			log("Failed", message, internalErr);
			console.error(message);
		}

		this.warning = function (message)
		{
			log("Warned", message);
			console.warn(message);
		}
	}

    //this.scriptLoader.loadScript("user-interface.core.js");
    import UserInterface as Core.UserInterface from "user-interface.core.js";

	//guid attribution
	this.guid = new function()
	{
		this.ocurrences = [];
		this.generate = function ()
		{
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
			}
			var guid = null;
			while (guid == null || core.guid.ocurrences.includes(guid))
				guid = s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
			core.guid.ocurrences.push(guid);
			return guid;
		}
	}

	//utility for associating an object to another object
	this.association = new function ()
	{
		//internal declarations
		this._internal.entities = {};

		this._internal.getEntityFromObject = function(obj)
		{
			return this.entities[obj.ghost_coreAssociationGuid];
		}
		
		//public declarations
		//associates or extends a value with the specified key
		this.set = function (keyObj, valueObj)
		{
			if (!keyObj || !valueObj)
				return;
			
			var entity = this._internal.getEntityFromObject(keyObj);
			
			if (!!entity && core.typeCheck.isObject(entity.value))
			{
				//entity exists and is an object, extend it with the specified value
				//get guid
				var guid = keyObj.ghost_coreAssociationGuid;
				//extend value
				this._internal.entities[guid].value = core.objectMan.extend(this._internal.entities[guid].value, valueObj);
			}
			else
			{
				//entity doesn't exist or its value is not an object, create another entity
				//generate guid
				var guid = core.guid.generate();
				//set identification ghost guid
				keyObj.ghost_coreAssociationGuid = guid;
				valueObj.ghost_coreAssociationGuid = guid;
				//set entity
				this._internal.entities[guid] = {
					key: keyObj,
					value: valueObj
				};
			}
		}
		//gets the specified key's associated value
		this.getValue = function (keyObj)
		{
			var entity = this._internal.getEntityFromObject(keyObj);
			if (!!entity)
				return entity.value;
			return null;
		}
		//gets key from specified value
		this.getKey = function (valueObj)
		{
			var entity = this._internal.getEntityFromObject(valueObj);
			if (!!entity)
				return entity.key;
			return null;
		}
	}

	//binding engine
	if (Proxy)
		this.binding = new function()
		{
			function setTargetProperty(elem, key, value)
			{
				//get ghost
				var ghost = elem["ghost_" + key];

				//set the target property value
				ghost.target[ghost.targetPropName] = value;
			}

			//intercept changes in element attribute
			function onElemAttrMutation(mutations)
			{
				var mutation = mutations[0],
					attrName = mutation.attributeName,
					target = mutation.target,
					value = target.getAttribute(attrName);

				setTargetProperty(target, attrName, value);

				delete mutation, attrName, target, value;
			}

			//intercept changes in the element itself
			function onElementChanged()
			{
				if (this.tagName == "INPUT")
				{
					//get the value property name
					var key = null;
					switch (this.type)
					{
					case "checkbox":
					case "radio":
						key = "checked";
						break;
					default:
						key = "value";
						break;
					}
					setTargetProperty(this, key, this[key]);
				}
			}

			//intercept changes in target property
			function onTargetPropertySet(target, key, value)
			{
				//get ghost
				var ghost = target["ghost_" + key];

				//set element property
				ghost.assocElement[ghost.assocElemPropName] = value;
			}

			//initialize binder - fired from a form's cb-init event
			this.init = function()
			{
				//get target
				var targetVal = this.attributes["cb-target"].value,
					target = eval(targetVal) || null;
				//check if target exists
				if (target != null)
				{
					Array.prototype.slice.apply(this.elements).forEach(function (elem)
					{
						//element bind succeeded flag
						var elementBindedFlag = false;

						//iterate through element property names
						Array.prototype.slice.apply(elem.attributes).forEach(function (attr)
						{
							//get target property name
							var targetPropName = core.stringMan.getBinderPropertyName(attr.value);

							if (!core.typeCheck.isUndefined(elem[attr.name]))
							{
								//get attribute name
								var attrName = attr.name;

								//check property name validity
								if (targetPropName !== null)
								{
									//set element property to target's property value
									elem.setAttribute(attrName, target[targetPropName]);

									//create ghost element property
									elem["ghost_" + attrName] = {
										target: target,
										targetPropName: targetPropName
									}

									target["ghost_" + targetPropName] = {
										assocElement: elem,
										assocElemPropName: attrName
									}

									//binding the element succeeded, so set flag to true
									elementBindedFlag = true;
								}

								delete attrName;
							}

							delete targetPropName;
						});

						//check if binding succeeded
						if (elementBindedFlag)
						{
							//monitor changes in element attributes
							var observer = new MutationObserver(onElemAttrMutation);
							observer.observe(elem, {
								attributes: true
							});

							//monitor changes in the element itself
							elem.addEventListener("change", onElementChanged);
						}
					});

					//monitor changes in target properties
					eval(targetVal + "=" + "new Proxy(target, {	set: onTargetPropertySet });");
				}
				else
					core.debugging.error("Core: Cannot bind form. Form attribute \"cb-target\" does not represent a valid"
						+ " local variable.")
			}
			//window load event - loop through forms and call their cb-init expression
			this.initialize = function ()
			{
				Array.prototype.slice.apply(document.forms).forEach(function (form) {
					var initVal = form.attributes["cb-init"];
					//if init is not empty
					if (!!initVal)
						(function () {
							eval(initVal.value);
						}).apply(form);
				});
			}
			window.addEventListener("load", this.initialize);
		}

	//ajax xml http requests handler
	this.ajax = new function()
	{
		var _ajax = this;
		
		this.responseTypes = {
			ArrayBuffer: "arraybuffer",
			Blob: "blob",
			Document: "document",
			JSON: "json",
			Text: "text",
			MozBlob: "moz-blob",
			MozChunkedArrayBuffer: "moz-chunked-arraybuffer",
			MSStream: "ms-stream"
		}
		
		this.cache = [];
		
		//simulated ajax request response
		var XMLHttpRequestResponse = function (response, resURL, resText, resHTML, resXML, resBody) {
			this.response = response;
			this.responseURL = resURL;
			this.responseText = resText;
			this.responseHTML = resHTML;
			this.responseXML = resXML;
			this.responseBody = resBody;
		}
		
		function send(method, url, flags)
		{
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open(method, url, flags.async, flags.user, flags.password)
			xmlHttp.send(flags.data);
			
			if (flags.cache === true && (method === "get" || method === "head"))
			{
				var cached = core.arrayMan.selectByAttribute(_ajax.cache, "url", url);
				
				//check if cached version is available
				if (cached !== null)
					flags.onload.call(new XMLHttpRequestResponse(cached.response, cached.responseText, cached.responseHTML, cached.responseXML))
				else
				{
					xmlHttp.onload = function ()
					{
						//push response data to cache
						_ajax.cache.push({
							guid: core.guid.generate(),
							response: this.response,
							responseURL: this.responseURL,
							responseText: this.responseText,
							responseHTML: this.responseHTML,
							responseXML: this.responseXML,
							responseBody: this.responseText,
						});
						
						//call <flags.onload>
						flags.onload.call(this, arguments);
					}
					
					xmlHttp.onprogress = flags.onprogress;
				}
			}
			else
			{
				xmlHttp.url = url;
				xmlHttp.onload = flags.onload;
				xmlHttp.onerror = flags.onerror;
				xmlHttp.onprogress = flags.onprogress;
				xmlHttp.responseType = flags.responseType;
				
				if (!!flags.overrideMimeType)
					xmlHttp.overrideMimeType(flags.overrideMimeType);
			}

			return xmlHttp;
		}
		this.get = function(url, flags)
		{
			send('get', url, flags);
		}
		this.head = function(url, flags)
		{
			send('head', url, flags);
		}
		this.post = function(url, flags)
		{
			send('post', url, flags);
		}
		this.put = function(url, flags)
		{
			send('put', url, flags);
		}
		this.delete = function(url, flags)
		{
			send('delete', url, flags);
		}
		this.connect = function(url, flags)
		{
			send('connect', url, flags);
		}
		this.options = function(url, flags)
		{
			send('options', url, flags);
		}
		this.trace = function(url, flags)
		{
			send('trace', url, flags);
		}
	}

	//script loader
	//- loads, applies and saves scripts to the local storage.
	this.scriptLoader = new function() {
		var queue = [];
		queue.totalCount = 0;
		queue.loadedCount = 0;

		//dequeue the script
		function dequeueScript(guid)
		{
			//get queue item
			var item = core.arrayMan.selectByAttribute(queue, "guid", guid);

			if (item !== null)
			{
				var dest = item.dest;
				
				//clear queue item
				queue.splice(queue.indexOf(item), 1);
			}
			
			return item;
		}
		
		//apply the script
		function applyScript(data)
		{
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.innerHTML = data;
			document.head.appendChild(script);
		}
		
		//ajax onload event
		function scriptLoaded(guid, args)
		{
			//dequeue and get info
			var item = dequeueScript(guid);
			
			if (item !== null)
			{
				var onload = item.onload;

				applyScript(this.responseText);
				
				if (!!onload)
					onload.call(this, args);
			}
			else
				core.debugging.error("Core: unspecified error. Script queue failed.");
			
			queue.loadedCount++;
		}
		
		//user accessible - loads, saves and applies a script
		this.loadScript = function (url, onload, cache, onprogress)
		{
			if (!core.typeCheck.isString(url))
				return;

			onload = onload || null;
			cache = cache || true;
			onprogress = onprogress || null;
			
			//generate a new guid to this request
			var guid = core.guid.generate();
			
			//queue a script
			queue.push({ guid: guid, url: url, onload: onload });

			core.ajax.get(url, { 
				async: true,
				//pass guid attribute through anonymous function
				onload: function () {
					scriptLoaded.call(this, guid, arguments);
				},
				onprogress: onprogress,
				cache: cache
			});

			queue.totalCount++;
		}
	}

	//title tooltip
	//-default tooltip for titles
	this.titleTooltip = new function()
	{
		var _titleTooltip = this;

		this.isShowing = false;
		this.tooltip = null;
		//refresh the tooltip
		this.refreshTooltip = function ()
		{
			if (!this.tooltip)
				return;

			function showTooltip()
			{
				_titleTooltip.tooltip.removeAttribute("core-hidden");
				_titleTooltip.tooltip.animate(core.animation.presetKeyframes.fadeIn, 218);

				_titleTooltip.isShowing = true;
			}

			function hideTooltip()
			{
				function animationFinished()
				{
					if (!_titleTooltip.isShowing)
						_titleTooltip.tooltip.setAttribute("core-hidden", "");
				}
				
				with (_titleTooltip.tooltip.animate(core.animation.presetKeyframes.fadeOut, 218))
					onfinish = animationFinished;

				_titleTooltip.isShowing = false;
			}

			Array.prototype.slice.apply(window.document.querySelectorAll("*[title]")).forEach(function (elem) {

				var timeoutShow = null, //timeout
					timeoutHide = null, //timeout
					cx = 0, //mouse coordinate x
					cy = 0; //mouse coordinate y
				elem.addEventListener('mouseenter', function ()
				{
					//transfer title to data-title
					elem.setAttribute("core-title-tooltip", elem.title);
					_titleTooltip.tooltip.textContent = elem.title;
					//clear timeouts
					clearTimeout(timeoutShow);
					clearTimeout(timeoutHide);
					//show timeout
					function timeoutshow()
					{
						_titleTooltip.tooltip.style.top = cy + "px";
						_titleTooltip.tooltip.style.left = cx + "px";
						showTooltip();
					}
					//hide timeout
					timeoutShow = setTimeout(timeoutshow, 1000);
					function timeouthide()
					{
						hideTooltip();
					}
					timeoutHide = setTimeout(timeouthide, 11000);
					//clear title to prevent it from popping up
					elem.title = "";
				});
				elem.addEventListener('mousemove', function (evt) {
					cy = evt.clientY || evt.pageY;
					cx = evt.clientX || evt.pageX;
				});
				elem.addEventListener('mouseleave', function ()
				{
					elem.title = elem.getAttribute("core-title-tooltip");
					//hide tooltip
					hideTooltip();
					//clear timeouts
					clearTimeout(timeoutShow);
					clearTimeout(timeoutHide);
					//set timeouts to null
					timeoutShow = null;
					timeoutHide = null;
				});
			});
		}
		//create and append tooltip
		this.loadTooltip = function ()
		{
			_titleTooltip.tooltip = new core.UserInterface.CoreTitleTooltip(); //tooltip
			_titleTooltip.tooltip.setAttribute("core-hidden", "");
			document.body.appendChild(_titleTooltip.tooltip);
			_titleTooltip.refreshTooltip();
		}

		this.initialize = function ()
		{
			//add window load event
			window.addEventListener('load', _titleTooltip.loadTooltip);
		}
	}

	//jQuery available
	//-the jQuery available flag
	this.jQueryAvailable = false;
	this.jQueryAvailabilityCallback = null;

	//string utility
	//-deals with simple string operations
	this.string = new function ()
	{
		this.arrayContains = function (s, a)
		{
			return a.indexOf(s) >= 0;
		}
	}

	//initializes, loads jquery and gets everything set up
	this.initialize = function ()
	{
		//Auxiliary Initializers
		this.objectMan.initialize.call(this.objectMan);

		this.UserInterface.initialize.call(this.UserInterface);

		this.iconPackMan.initialize.call(this.iconPackMan);

		this.titleTooltip.initialize.call(this.titleTooltip);
		
		//load polyfill loader
		core.scriptLoader.loadScript("polyfill-loader.core.js");
		
		//once Core has been initialized, there's no need for it to be initialized again
		delete this.initialize;
	}
}

//assign core to a property in window
window.core = new Core;

//initialize core
core.initialize.call(core);