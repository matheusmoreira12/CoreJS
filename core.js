//common constants
var UNDEF = 'undefined',
	NULL = 'null';

//define custom prototype properties
Object.prototype._internal = {};

Object.prototype.inherit = function (prototype)
{
	var obj = Object.create(prototype);
	//create and populate base prototype object
	obj._base = {}
	for (n in prototype)
		if (prototype.hasOwnProperty(n))
			obj._base[n] = prototype[n];

	return obj;
}

Object.prototype.release = function () {
	for (n in this)
		delete this[n];
	
	if (typeof this.releasedCallback != UNDEF)
		this.releasedCallback.call(this);
	
	return undefined;
};

Object.prototype.reflect = function (reflectedObj, prototype)
{
	var result = !!prototype ? Object.create(prototype) : {};
	
	for (nome in reflectedObj)
		if (reflectedObj.hasOwnProperty(nome))
			Object.defineProperty(result, nome, {
				get: function () 
				{
					return reflectedObj[nome];
				},
				set: function (value) {
					reflectedObj[nome] = value;
				}
			});
	
	return result;
}

//core definition
var Core = function()
{
	//Note: every <initialize> function is called from external code after <Core> has been created,
	//via the <Core.initialize> function.
	
	//Css manipulation utility
	this.cssMan = new function () {
		this.getStyleSheet = function (name)
		{
			return document.styleSheets[name] || document.styleSheets.item(name);
		}
	}
	
	//Object Manager utility
	this.objectMan = new function () {
		//extends an object
		this.extend = function (obj, src) {
			for (var key in src)
				if (src.hasOwnProperty(key)) obj[key] = src[key];
			return obj;
		}
		//taps into object function properties and changes their functionality
		this.tapIntoObjectFunction = function (obj, propName, oldPrefix, newPrefix, callback)
		{
			//read from <obj[[prototype]]>
			var proto = Object.getPrototypeOf(obj);

			//change <string> <"example"> to <"example0">
			var newPropName = newPrefix + propName + "0";

			//check for number, replacing it with the next number in the sequence until there's no property named
			//with <newPropName>'s value
			while (!core.typeCheck.isUndefined(proto[newPrefix + newPropName]))
				newPropName = newPropName.replace(/[0-9]+/, function (match) {
					return match * 1 + 1;
				});

			//set "new" property
			proto[newPropName] = callback;

			delete newPropName;

			//get "old" name
			var oldPropName = oldPrefix + propName;

			//if "old" property does not exist yet
			if (core.typeCheck.isUndefined(proto[oldPropName]))
			{
				//assign "old" property
				proto[oldPropName] = proto[propName];

				function intCallback(args)
				{
					//call "original" function and get returned value
					var result = proto[oldPropName].apply(this, arguments);

					//iterate through <obj>'s properties
					for (prop in proto)
						//if property is a function and is a "new" property
						if (core.typeCheck.isFunction(proto[prop]) && prop.indexOf(newPrefix + propName) >= 0)
						{
							//call property by name and get returned value
							var retValue = proto[prop].apply(this, arguments) || null;

							//check if <retValue> is not null
							if (retValue !== null)
								return retValue;
						}

					return result;
				}

				//finally, replace the "original" property with the internal callback
				proto[propName] = intCallback;
			}

			//transfer changes to <obj[[prototype]]>
			Object.setPrototypeOf(obj, proto);
		}

		this.mirrorProperty = function (obj, mirroredObj, propName, setCallback, getCallback)
		{
			Object.defineProperty(obj, propName, {
				get: function () {
					if (core.typeCheck.isFunction(getCallback))
						getCallback(mirroredObj, propName);

					return mirroredObj[propName];
				},
				set: function (value) {
					if (core.typeCheck.isFunction(setCallback))
						setCallback(mirroredObj, propName, value);

					mirroredObj[propName] = value;
				}
			});
		}

		this.mirrorObject = function (obj, mirroredObj, setCallback, getCallback)
		{
			for (var prop in mirroredObj)
				this.mirrorProperty(obj, mirroredObj, prop, setCallback, getCallback)
		}
			
		this.initialize = function ()
		{
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

	//icon package manager
	this.iconPackMan = new function()
	{
		var _iconPackMan = this;

		//registered available icons
		this.availableIcons = { };

		//ghost data object for <availableIcons>
		this.ghost_availableIcons = { };

		//adds an icon set according to <obj>
		//<obj>: <object {
		//	String setName,
		//	iconDimensions: {
		//		Int width,
		//		Int height
		//		},
		//	icons: [
		//		{
		//			Int x,
		//			Int y,
		//			String iconName
		//			},
		//		...
		//	]}>
		this.addIconSet = function(obj)
		{
			var styleSheet = _iconPackMan.styleSheet,
				//retrieve icon dimensions
				height = obj.iconDimensions.width,
				width = obj.iconDimensions.height,
				//retrieve set name
				iconSetName = obj.setName;
				
			//create a new succession of substrings for class names
			var cnSuccession = new core.stringMan.Succession("core-icon", ".");

			//advance in classname succession and get icon dimensions class name
			cnSuccession.add("-" + width + "x" + height);
			var iconCNDimensions = cnSuccession.generate();

			//add set name to icons list
			_iconPackMan.availableIcons[iconSetName] = { };

			//update <availableIcons> ghost data
			_iconPackMan.ghost_availableIcons[iconSetName] = { };

			//write dimensions to a class rule
			styleSheet.addRule("." + iconCNDimensions, "height: " + height + "px; line-height: " + height + "px; width:" + width + "px;");
			_iconPackMan.ghost_availableIcons[iconSetName].sizeRuleIndex = styleSheet.rules.length - 1;

			//advance in classname succession and get icon group class name
			cnSuccession.add("-" + iconSetName);
			var iconCNGroup = cnSuccession.generate();

			//write background info to another class rule
			styleSheet.addRule("." + iconCNGroup, "background-image: url(\"" + obj.spriteUrl + "\"); background-size: auto; background-repeat: no-repeat;");
			_iconPackMan.ghost_availableIcons[iconSetName].setRuleIndex = styleSheet.rules.length - 1;

			//loop through the icons
			obj.icons.forEach(function (icon)
				{
					//retrieve icon name
					var iconName = icon.name;

					//advance in icon classname succession and get icon class name
					cnSuccession.add("-" + iconName);
					var iconCNIndividual = cnSuccession.generate();

					//write icon background-position information to stylesheet
					styleSheet.addRule("." + iconCNIndividual, "background-position: -" + icon.x + "px -" + icon.y + "px;");

					//final camel-cased name that will get stored
					var storedName = [core.stringMan.toCamelCase(iconSetName), core.stringMan.toCamelCase(iconName)]

					//add icon name to icons list
					_iconPackMan.availableIcons[storedName[0]][storedName[1]] = {
						//get class name without dots
						className: iconCNIndividual.replace(/\./g, " ")
					};

					//update <availableIcons> ghost data
					_iconPackMan.ghost_availableIcons[storedName[0]][storedName[1]] = {
						ruleIndex: styleSheet.rules.length - 1
					}
					
					delete storedName;

					//go back in icon classname succession
					cnSuccession.remove();

					delete iconName, iconCNIndividual;
				});

			delete height, width, iconSetName, cnSuccession, iconCNDimensions, iconCNGroup, styleSheet;
		}

		//removes an specific icon set, but keeps the reference
		this.removeIconSet = function (iconSetName)
		{
			var ghost_iconSet = _iconPackMan.ghost_availableIcons[iconSetName],
				styleSheet = _iconPackMan.styleSheet;
				
			//remove icon size rule
			styleSheet.removeRule(ghost_iconSet.sizeRuleIndex);
			//remove icon set rule
			styleSheet.removeRule(ghost_iconSet.setRuleIndex);

			//remove each of the rules
			Array.prototype.slice.apply(ghost_iconSet).forEach(function (icon)
			{
				styleSheet.removeRule(icon.ruleIndex);
			});

			delete ghost_iconSet, styleSheet;
		}

		this.initialize = function ()
		{
			var styleSheet = document.createElement("style");
			styleSheet.type = "text/css";
			styleSheet.id = "iconManagerStylesheet";
			// WebKit hack - add a text node
			styleSheet.appendChild(document.createTextNode(""));
			//append stylesheet to head
			document.head.appendChild(styleSheet);
			delete styleSheet;

			this.styleSheet = core.cssMan.getStyleSheet("iconManagerStylesheet");

			this.addIconSet(
				{
					setName: "default",
					spriteUrl: "ui-icon-sprite-21x21.svg",
					iconDimensions:
					{
						width: 21,
						height: 21
					},
					icons: [
						{
							name: "page",
							x: 41,
							y: 1
						},
						{
							name: "folderop",
							x: 41,
							y: 21
						},
						{
							name: "foldercl",
							x: 41,
							y: 41
						},
						{
							name: "plus",
							x: 62,
							y: 2
						},
						{
							name: "minus",
							x: 62,
							y: 22
						},
						{
							name: "info",
							x: 62,
							y: 42
						},
						{
							name: "check",
							x: 82,
							y: 2
						},
						{
							name: "close",
							x: 82,
							y: 22
						},
						{
							name: "help",
							x: 82,
							y: 41
						}
					]
				}
			);
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
	//User Interface utility
	this.userInterface = new function ()
	{
		var _userInterface = this;

		//Progress pipe
		this.ProgressPipe = function (progressBar)
		{
			var _progressPipe = this;
			
			//internal declarations
			this._internal.progressBars = [];
			
			//public declarations
			this.addProgressBar = function (progressBar)
			{
				this._internal.progressBars.push(progressBar);
			}
			
			this.progressListener = function (evt)
			{
			    _progressPipe._internal.progressBars.forEach(function (pb)
				{
					pb.min = 0;
					pb.max = evt.total;
					pb.value = evt.loaded;
				});
			}
		}

		//polyfill for the <HTMLDialogElement> tag
		if (!window.HTMLDialogElement)
		{
		    var HTMLDialogElement_prototype = Object.create(HTMLElement.prototype);
			
			HTMLDialogElement_prototype.show = function () {
				this.style.display = "inline-block";
				this.style.margin = "auto";
			}
			HTMLDialogElement_prototype.showModal = function () {
				this.show();
			}
			HTMLDialogElement_prototype.close = function () {
				this.style.display = "none";
			}
			
			window.HTMLDialogElement = HTMLElement;
			Object.setPrototypeOf(HTMLDialogElement, HTMLDialogElement_prototype);
		}

		//Draggability class
		//make a control moveable (draggable)
		this.Draggability = function (elem, moveBar)
		{
			var _draggability = this;

			this.elem = elem;
			this.moveBar = moveBar;

			this.moving = false;
			//element position offset
			this.offsetX = 0;
			this.offsetY = 0;
			//cursor offset
			this.curOffsetX = 0;
			this.curOffsetY = 0;

			//warn about layout disturbance problems
			if (/relative/.test(elem.style.position))
				core.debugging.warning("Core: please note that making a relatively-positioned control moveable might"
					+ " disturb your intended layout.")

			//check if element is not absolutely positioned
			if (!/absolute/.test(elem.style.position) && !/fixed/.test(elem.style.position))
				//make it relatively-positioned
				elem.style.position = "relative";

			//remove margin and position the element relative
			elem.style.left = _draggability.elem.offsetLeft;
			elem.style.top = _draggability.elem.offsetTop;
			elem.style.margin = "0";

			//stop moving when mouseup is fired
			function mouseUp()
			{
				//remove event listeners
				window.removeEventListener("mouseup", mouseUp);
				window.removeEventListener("mousemove", mouseMove);
			}

			//update drag position every time the cursor moves
			function mouseMove()
			{
				with (_draggability)
				{
					elem.style.left = offsetX + event.pageX - curOffsetX + "px";
					elem.style.top = offsetY + event.pageY - curOffsetY + "px";
				}
			}

			//start moving when mousedown is fired
			function mouseDown()
			{
				with (_draggability)
				{
					//store position offset
					offsetX = elem.style.left.replace("px", "") * 1;
					offsetY = elem.style.top.replace("px", "") * 1;

					//store cursor offset
					curOffsetX = event.pageX;
					curOffsetY = event.pageY;
				}

				//add event listeners for drag-stop
				window.addEventListener("mouseup", mouseUp);
				window.addEventListener("mousemove", mouseMove);
			}
			moveBar.addEventListener("mousedown", mouseDown);
		}

		//Register Element utility
		this.register = function (name, prototype, extend) {
			if (!name)
				return;
			return  document.registerElement(name, {
				prototype: prototype,
				extends: extend
			});
		}

		//Custom Components

		//{primitives} namespace
		//Contains primitive elements
		this.primitves = new function() {
			//CoreLabel
			var CoreLabel_prototype = Object.create(HTMLLabelElement.prototype);
			
			Object.defineProperty(CoreLabel_prototype, "text", { get: function () {
				return this.innerText || this.textContent;
			}, set: function (value) {
				if (core.typeCheck.isUndefined(this.innerText))
					this.textContent = value;
				else
					this.innerText = value;
			}});

			CoreLabel_prototype.setText = function (text, params)
			{
				this.text = core.stringMan.includeParams.apply(null, arguments)
			}

			this.CoreLabel = _userInterface.register("core-label", CoreLabel_prototype, "label");

			//CoreLabelableContainer
			var CoreLabelableContainer_prototype = Object.create(HTMLElement.prototype);
			CoreLabelableContainer_prototype.createdCallback = function () 
			{
				//give element an if, if no id is present
				if (!this.id)
					this.id = core.guid.generate();

				//create and associate label
				this.labelElement = new _userInterface.primitves.CoreLabel();
				this.labelElement.htmlFor = this.id;
			}

			Object.defineProperty(CoreLabelableContainer_prototype, "label", { set: function (value) {
				this.labelElement.remove();				
				
				//if parent exists, insert after
				if (!!this.parentElement)
					this.parentElement.insertBefore(this.labelElement, this.nextSibling);

				this.labelElement.text = value;
			}, get: function (value) {
				if (this.labelElement !== null)
					return this.labelElement.text;
				else
					return "";
			}});

			CoreLabelableContainer_prototype.setLabel = function (text, params)
			{
				this.label = "";
				this.labelElement.setText.apply(this.labelElement, arguments);
			}

			this.CoreLabelableContainer = _userInterface.register("core-labelablecontainer", CoreLabelableContainer_prototype);
			
			//CoreElementContainer
			CoreElementContainer_prototype = Object.create(HTMLElement.prototype);
			
			CoreElementContainer_prototype.createdCallback = function ()
			{
				this.elements = [];
			}

			CoreElementContainer_prototype.addElement = function (elem)
			{
				try
				{
					this.elements.push(elem);
					this.appendChild(elem);
				}
				catch (err)
				{
					core.debugging.error("Core: Invalid operation.", err);
				}
			}

			CoreElementContainer_prototype.addElements = function (arr)
			{
				if (core.typeCheck.isObject(arr))
					arr.forEach(function (elem) {
						this.addElement(elem)
					}, this);
				else
					core.debugging.error("Core: Cannot add elements to this container. Parameter <arr> is not a"
						+ " valid array.");
			}

			CoreElementContainer_prototype.addMessage = function (str)
			{
				var message = new _userInterface.CoreDialogMessage();
				message.innerText = str;
				this.addElement(message);
			}

			CoreElementContainer_prototype.removeElement = function (elem)
			{
				var index = this.elements.indexOf(elem);
				if (index >= 0)
					this.elements.splice(index, 1);
				else
					core.debugging.warning("Core: Cannot remove specified element. Make sure the element belongs to this" +
						" container.");
			}

			CoreElementContainer_prototype.insertElementBefore = function (elem)
			{
				var index = this.elements.indexOf(elem);
				if (index >= 0)
					this.elements.splice(index, 1);
				else
					core.debugging.warning("Core: Cannot insert before specified element. Make sure the element belongs to"
						+ " this container.");
			}

			this.CoreElementContainer = _userInterface.register("core-elementcontainer", CoreElementContainer_prototype);			
		}
		
		//CoreSelect
		var CoreSelect_prototype = Object.create(HTMLElement.prototype);
		
		CoreSelect_prototype.createdCallback = function () {
			//enable tabing
			this.tabIndex = -1;

			//Create a shadow root
			this._internal.shadowRoot = this.createShadowRoot();
			
			//create and append value element
			this._internal.valueElement = new core.userInterface._internal.CoreSelectValue();
			this._internal.shadowRoot.appendChild(this._internal.valueElement)
			
			//create and append list element
			this._internal.listElement = new core.userInterface._internal.CoreSelectList();
			this._internal.shadowRoot.appendChild(this._internal.listElement);
						
			//internal flag for allowing multiple selection
			this._internal.allowMultipleSelection = false;
			
			//options list
			this.options = [];
			
			//selected indexes list
			this.selected = [];
			
			this.addOption = function (value, text) {
				var options = this.options;
				
				var optionElement = new core.userInterface._internal.CoreSelectOption();
				optionElement.innerText = text;
				optionElement.value = value;
				optionElement._internal.selectElement = this;
				//get index for this option
				optionElement.index = options.length;

				this._internal.listElement.appendChild(optionElement);
				
				var option = {
					value: value,
					text: text
				}
				option._internal = { element : optionElement };
				
				options.push(option);
			}
			
			//removes an option
			this.removeOption = function (index)
			{
				if (index < 0 || index >= this.options.length)
					return;
				
				var option = this.options[index];
				option._internal.element.remove();
				
				this.options.splice(index, 1);
			}

			//updates the selection display
			this._internal.updateSelection = function ()
			{
				for (var i = 0; i < this.options.length; i++)
					//check if option is included
					this.options[i]._internal.element.selected = (this.selected.includes(i));
					
				if (this.selected.length > 1)
					this._internal.valueElement.innerText = this.selected.length + " ítens selecionados";
				else if (this.selected.length == 0)
					this._internal.valueElement.innerText = "Selecione";
				else
					this._internal.valueElement.innerText = this.options[this.selected[0]].text;
			}
			
			//internal function for removing an index from the selection
			this._internal.removeFromSelection = function (index)
			{
				var i = this.selected.indexOf(index)
				
				if (i >= 0)
					this.selected.splice(i, 1);
			}
			
			//internal function adding an index to the selection
			this._internal.addToSelection = function (index) { this.selected.push(index); }
			
			//internal function for toggling the selection on an item index
			this._internal.toggleSelection = function (index)
			{
				var alreadySelected = this.selected.includes(index);

				if (alreadySelected)
					this._internal.removeFromSelection.call(this, index);
				else
					this._internal.addToSelection.call(this, index);
			}
			
			//selects an option
			this.selectOption = function (index, multipleSelection)
			{
				if (index < 0 || index >= this.options.length)
					return;
				
				var doMultipleSelection = this.allowMultipleSelection && multipleSelection;

				if (doMultipleSelection)
					this._internal.toggleSelection.call(this, index);
				else
				{
					this.selected = [];
					this._internal.addToSelection.call(this, index);
				}
				
				//update selection
				this._internal.updateSelection.call(this);
			}

			//internal flag which indicates wether this combo input is expanded
			this._internal.expanded = false;

			function onblur()
			{
				//close this combo input on blur
				this.expanded = false;
				
				this.removeEventListener("blur", onblur);
			}
			
			function onmousedown()
			{
				//close this combo input on mouse down
				this.expanded = true;
	
				this.addEventListener("blur", onblur);
			}
			this.addEventListener("mousedown", onmousedown);
			
			//updates visually the input size
			this._internal.updateSize = function () { this._internal.valueElement.style.width = this._internal.size + "em"; }
		}
		
		CoreSelect_prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
			if (attrName == "core-expanded")
				this._internal.expanded = (newVal != "false");
				
			if (attrName == "core-allowmultipleselection")
				this._internal.allowMultipleSelection = (newVal != "false");
				
			if (attrName == "core-size")
			{
				this._internal.size = newVal;
				this._internal.updateSize.call(this);
			}
		}

		Object.defineProperties(CoreSelect_prototype, { 
			"expanded" : {
				get: function () {
					return this._internal.expanded;
					},
				set: function (value) {
					this._internal.expanded = value;

					if (value == true)
						this.setAttribute("core-expanded", "");
					else
						this.removeAttribute("core-expanded");
					}},
			"allowMultipleSelection" : {
				get: function () {
					return this._internal.allowMultipleSelection;
					},
				set: function (value) {
					this._internal.allowMultipleSelection = value;
					
					this.setAttribute("core-allowmultipleselection", value);
					}},
			"size" : {
				get: function () {
					return this._internal.size;
					},
				set: function (value) {
					if (isNaN(value))
					{
						core.debugging.warning("Core: Warning: The size specified is not a valid number.");
						return;
					}
					else if (value < 3)
					{
						core.debugging.warning("Core: Warning: The size specified is too small. No changes were made.");
						return;
					}
					
					this._internal.size = value;
					this._internal.updateSize.call(this);
										
					this.setAttribute("core-size", value);
					}},
			});

		this.CoreSelect = _userInterface.register("core-select", CoreSelect_prototype);

		var CoreSelectValue_prototype = Object.create(HTMLElement.prototype);
				
		this._internal.CoreSelectValue = _userInterface.register("core-selectvalue", CoreSelectValue_prototype);		

		var CoreSelectList_prototype = Object.create(HTMLUListElement.prototype);
				
		this._internal.CoreSelectList = _userInterface.register("core-selectlist", CoreSelectList_prototype, "ul");		
		
		var CoreSelectOption_prototype = Object.create(HTMLLIElement.prototype);
		
		CoreSelectOption_prototype.createdCallback = function () {
			this._internal.selected = false;
			this._internal.selectElement = null;
			this._internal.value = null;
			this.index = -1;
			
			function onmouseup(event)
			{
				var selectElement = this._internal.selectElement;
				
				//select option
				selectElement.selectOption(this.index, event.shiftKey);

				var doMultipleSelection = selectElement.allowMultipleSelection && event.shiftKey;

				if (!doMultipleSelection)
					//hide menu
					selectElement.expanded = false;
			}
			this.addEventListener("mouseup", onmouseup);
		}
		
		CoreSelectOption_prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
			if (attrName == "core-selected")
				this._internal.selected = (newVal != "false");
				
			if (attrName == "core-value")
				this._internal.value = newVal;
		}

		Object.defineProperties(CoreSelectOption_prototype, {
			"selected": {
				get: function () {
						return this._internal.selected;
					},
				set: function (value) {
						this._internal.selected = value;
						
						if (value == true)
							this.setAttribute("core-selected", "");
						else
							this.removeAttribute("core-selected");
					}
				},
				
			"value": {
				get: function () {
						return this._internal.value;
					},
				set: function (value) {
						this._internal.value = value;
						
						this.setAttribute("core-value", value);
					}
				}
			});
		
		this._internal.CoreSelectOption = _userInterface.register("core-selectoption", CoreSelectOption_prototype, "li");

		//CoreInput
		var CoreInput_prototype = Object.create(HTMLInputElement.prototype);
		this.CoreInput = _userInterface.register("core-input", CoreInput_prototype, "input");
		
		//CoreDataGrid
		var CoreDataGrid_prototype = Object.create(HTMLElement.prototype);
		CoreDataGrid_prototype.bodyElement = null;
		
		CoreDataGrid_prototype.createdCallback = function ()
		{
			this.shadowRoot = this.createShadowRoot();

			//The table element
			this.table = new _userInterface.CoreDataGridTable();
			this.shadowRoot.appendChild(this.table);
			
			Object.defineProperty(this, "head", { get: function  () {
				return this.table.head;
			}});

			Object.defineProperty(this, "body", { get: function  () {
				return this.table.body;
			}});
		}
		
		this.CoreDataGrid = _userInterface.register("core-datagrid", CoreDataGrid_prototype);

		//CoreDataGridTable
		var CoreDataGridTable_prototype = Object.create(HTMLElement.prototype);
		
		CoreDataGridTable_prototype.createdCallback = function () {
			this.setAttribute("cellspacing", 0);
			
			//The head element
			this.head = new _userInterface.CoreDataGridHead();
			this.appendChild(this.head);
			
			//The body element
			this.body = new _userInterface.CoreDataGridBody();
			this.appendChild(this.body);
		}
		
		this.CoreDataGridTable = _userInterface.register("core-datagridtable", CoreDataGridTable_prototype, "table");

		//CoreDataGridBody
		var CoreDataGridBody_prototype = Object.create(HTMLElement.prototype);

		CoreDataGridBody_prototype.createdCallback = function () {
			//The array which contains all the rows of this Data Grid
			this.rows = [];
		}

		//use this to read information from an array
		CoreDataGridBody_prototype.readFromArray = function (array)
		{
			//create the array that will receive the rows
			this.rows = new Array(array.length);
			
			//acquire row info from the array
			for (var i = 0; i < array.length; i++)
			{
				//create each row
				var rowElem = new _userInterface.CoreDataGridRow();
				rowElem.readFromArray(array[i]);
				//append each row
				this.rowElements[i] = rowElem;
				bodyElem.appendChild(rowElem);
			}
			//append table body
			this.appendChild(bodyElem);
			this.bodyElement = bodyElem;
		}

		this.CoreDataGridBody = _userInterface.register("core-datagridbody", CoreDataGridBody_prototype, "tbody");

		//CoreDataGridHead 
		var CoreDataGridHead_prototype = Object.inherit(CoreDataGridBody_prototype);

		CoreDataGridHead_prototype.createdCallback = function ()
		{
			this._base.createdCallback.call(this);
		}

		this.CoreDataGridHead = _userInterface.register("core-datagridhead", CoreDataGridHead_prototype, "thead");

		//CoreDataGridRow
		var CoreDataGridRow_prototype = Object.create(HTMLElement.prototype);
		
		CoreDataGridRow_prototype.createdCallback = function ()
		{
			this.cellElements = [];
		}
		
		CoreDataGridRow_prototype.readFromArray = function (array)
		{
			this.cellElements = new Array(array.length);
			//acquire cell info from the array
			for (var i = 0; i < array.length; i++)
			{
				//create each cell
				var cellElem = new _userInterface.CoreDataGridCell(),
					cellObj = array[i];
				
				if (core.typeCheck.isObject(cellObj))
				{
					cellElem.elements = cellObj.elements;
					cellElem.span = cellObj.span;
				}
				else
					cellElem.textContent = String(array[i]);
				//append each cell
				this.appendChild(cellElem);
				this.cellElements[i] = cellElem;
			}
		}

		this.CoreDataGridRow = _userInterface.register("core-datagridrow", CoreDataGridRow_prototype, "tr");

		//CoreDataGridCell
		var CoreDataGridCell_prototype = Object.create(_userInterface.primitves.CoreElementContainer.prototype);
		
		CoreDataGridCell_prototype.selected = false;

		this.CoreDataGridCell = _userInterface.register("core-datagridcell", CoreDataGridCell_prototype, "td");

		//CoreTitleTooltip
		var CoreTitleTooltip_prototype = Object.create(HTMLElement.prototype);

		this.CoreTitleTooltip = _userInterface.register("core-titletooltip", CoreTitleTooltip_prototype);
		//CoreHGroup
		var CoreHGroup_prototype = Object.create(HTMLElement.prototype);
		CoreHGroup_prototype.createdCallback = function ()
		{
			this.itemElements = [];
		}
	
		Object.defineProperty(CoreHGroup_prototype, "items", { set: function (value)
		{
			//array sync callbacks
			function removeItemCallback(removedItem, index)
			{
				removedItem.remove();
			}

			function insertItemCallback(src, index)
			{
				var item = new _userInterface.CoreHGroupItem();
				item.readFromObject(src[index]);
				this.appendChild(item);
				return item;
			}

			function changeItemCallback(src, dest, index)
			{
				dest[index].readFromObject(src[index]);
			}

			//sync <items> array with <arr> array
			core.arrayMan.syncArrays(value, this.itemElements, removeItemCallback, insertItemCallback, changeItemCallback, this);
		}});

		this.CoreHGroup = _userInterface.register("core-hgroup", CoreHGroup_prototype);

		//CoreHGroupItem
		var CoreHGroupItem_prototype = Object.create(HTMLElement.prototype);
		CoreHGroupItem_prototype.element = null;
		
		CoreHGroupItem_prototype.readFromObject = function (obj)
		{
			//if an element is already present, remove it
			if (this.element !== null)
				this.element.remove();
			//append new element
			this.appendChild(this.element = obj.element);

			//set label if needed
			if (!!obj.label)
				this.label = obj.label;
		}

		this.CoreHGroupItem = _userInterface.register("core-hgroupitem", CoreHGroupItem_prototype);

		//shorthand for creating a <CoreHGroup>
		this.createCoreHGroup = function (items)
		{
			var hGroup = new _userInterface.CoreHGroup();
			hGroup.items = items;
			return hGroup;
		}
		
		//CoreProgressBar
		var CoreProgressBar_prototype = Object.inherit(_userInterface.primitves.CoreLabelableContainer.prototype);
		
		CoreProgressBar_prototype.createdCallback = function ()
		{
			this._base.createdCallback.call(this);

			//internal initializers
			this._internal.min = 0;
			this._internal.max = 1;
			this._internal.value = null;
			this._internal.labelFormat = "LOADING %3%%"
			
			//public initializers
			var fillElem = new _userInterface.CoreProgressBarFill();
			this.appendChild(fillElem);
			this.fillElement = fillElem;

			this.max = 0;
		}
		
		//internal declarations
		CoreProgressBar_prototype._update = function ()
		{
			//BE CAREFUL WHEN EDITING: {this._internal} is now part of the context.
			with (this._internal)
			{
				if (value !== null)
				{
					var percent = (value - min + 1) / (max - min + 1) * 100 | 0;
					
					//update fill width
					this.fillElement.style.width = percent + "%";
					this.classList.remove("core-progressbar-indeterminate");
					
					//update label
					this.setLabel(this.labelFormat, min, max, percent);
				}
				else
					this.classList.add("core-progressbar-indeterminate");
			}
		}
				
		//public declarations
		Object.defineProperties(CoreProgressBar_prototype, { 
			"labelFormat" : { set: function (value) {
				this._internal.labelFormat = value;
				this._update();
				}, get: function() {
					return this._internal.labelFormat;
				}
			},
			"value" : { set: function (value) {
				this._internal.value = Math.max(this.min, Math.min(this.max, value));
				this._update();
				}, get: function() {
					return this._internal.value;
				}
			},
			"min" : { set: function (value) {
				this._internal.min = value;
				this._update();
				}, get: function() {
					return this._internal.min;
				}
			},
			"max" : { set: function (value) {
				this._internal.max = value;
				this._update();
				}, get: function() {
					return this._internal.max;
				}
			}
		});

		this.CoreProgressBar = _userInterface.register("core-progressbar", CoreProgressBar_prototype);
		
		//CoreProgressBarFill
		var CoreProgressBarFill_prototype = Object.create(HTMLElement.prototype);

		this.CoreProgressBarFill = _userInterface.register("core-progressbarfill", CoreProgressBarFill_prototype);
		
		//CoreIcon
		var CoreIcon_prototype = Object.create(HTMLElement.prototype);
		Object.defineProperty(CoreIcon_prototype, "icon", { set: function (value)
		{
			try
			{
				this.className = value.className;
			}
			catch (err)
			{
				core.logging.warning("Core: Invalid icon object. The requested icon will not be displayed correctly.");
			}
		}});

		this.CoreIcon = _userInterface.register("core-icon", CoreIcon_prototype);

		//CoreIconButton
		var CoreButton_prototype = Object.create(_userInterface.primitves.CoreLabel.prototype);

		this.CoreButton = _userInterface.register("core-button", CoreButton_prototype, "button");

		//CoreIconButton
		var CoreIconButton_prototype = Object.create(_userInterface.primitves.CoreLabel.prototype);
		CoreIconButton_prototype.iconElement = null;
		CoreIconButton_prototype.icon = null;

		CoreIconButton_prototype.createdCallback = function ()
		{
			//create, assign and append CoreIcon
			this.iconElement = new _userInterface.CoreIcon();
			this.appendChild(this.iconElement);
		}

		Object.defineProperty(CoreIconButton_prototype, "icon", { set: function (value)
		{
			if (this.iconElement !== null)
				//set the icon
				this.iconElement.icon = value;
		}});

		this.createIconButton = function (iconObj)
		{
			var iconBtn = new _userInterface.CoreIconButton();
			iconBtn.icon = iconObj;
			return iconBtn;
		}

		this.CoreIconButton = _userInterface.register("core-iconbutton", CoreIconButton_prototype, "button");

		//CoreCloseButton, based on CoreIconButton
		var CoreCloseButton_prototype = Object.inherit(CoreIconButton_prototype);
		
		CoreCloseButton_prototype.createdCallback = function () {
			this._base.createdCallback.call(this);
			
			this.addEventListener("focus", function () {
				this.blur();
			});
			
			this.tabIndex = -1;
			this.icon = core.iconPackMan.availableIcons.default.close;
		}

		this.CoreCloseButton = _userInterface.register("core-closebutton", CoreCloseButton_prototype, "button");

		//CoreDialogTitle
		var CoreDialogTitle_prototype = Object.create(HTMLElement.prototype);

		this.CoreDialogTitle = _userInterface.register("core-dialogtitle", CoreDialogTitle_prototype);

		//CoreDialogTitleBar
		var CoreDialogTitleBar_prototype = Object.create(HTMLElement.prototype);
		CoreDialogTitleBar_prototype.titleElement = null;
		CoreDialogTitleBar_prototype.closeButton = null;

		CoreDialogTitleBar_prototype.createdCallback = function () {
			this.titleElement = new _userInterface.CoreDialogTitle();
			this.appendChild(this.titleElement);

			this.closeButton = new _userInterface.CoreCloseButton();
			this.appendChild(this.closeButton);
		}

		CoreDialogTitleBar_prototype.setTitle = function (str)
		{
			this.titleElement.innerText = str;
		}

		this.CoreDialogTitleBar = _userInterface.register("core-dialogtitlebar", CoreDialogTitleBar_prototype);

		//CoreDialogContent
		var CoreDialogContent_prototype = Object.create(_userInterface.primitves.CoreElementContainer.prototype);
		
		this.CoreDialogContent = _userInterface.register("core-dialogcontent", CoreDialogContent_prototype);

		//CoreDialogMessage
		var CoreDialogMessage_prototype = Object.create(HTMLElement.prototype);

		this.CoreDialogMessage = _userInterface.register("core-dialogmessage", CoreDialogMessage_prototype);

		//CoreFormItem
		var CoreFormItem_prototype = Object.create(_userInterface.primitves.CoreLabelableContainer.prototype);
		CoreFormItem_prototype.createdCallback = function ()
		{
		}
		
		//internal declarations
		CoreFormItem_prototype._internal.element = null;
		
		//public declarations
		Object.defineProperty(CoreFormItem_prototype, "element", { get: function () {
			return this._internal.element;
		}, set: function (value) {
			//remove old element
			if (this._internal.element != null)
				this._internal.element.remove();
			//append new element
			this.appendChild(this._element)
			this._internal.element = value;
		}});

		this.CoreFormItem = _userInterface.register("core-formitem", CoreFormItem_prototype);

		//CoreDialogButtonBar
		var CoreDialogButtonBar_prototype = Object.create(HTMLElement.prototype);
		CoreDialogButtonBar_prototype.createdCallback = function ()
		{
			this.buttonElements = [];
		}
		
		CoreDialogButtonBar_prototype.defaultButton = null;

		Object.defineProperty(CoreDialogButtonBar_prototype, "buttons", { set: function (value)
		{
			//update button attributes
			function updateButton(button, obj)
			{
				//check if button is an icon button
				if (!core.typeCheck.isUndefined(button.icon))
				{
					//give it an icon
					button.icon = obj.icon;
					//give it some text
					button.text = obj.text;
				}
				else
					//give button some text
					button.innerText = obj.text;
				
				//give button title, type, name and value
				button.title = obj.title || "";
				button.type = obj.type || "";
				button.value = obj.value || 0;

				//determine if the button is supposed to be default
				if (obj.default)
				{
					this.defaultButton = this;
					button.setAttribute("core-default", "");
				}
			}

			//array sync callbacks
			function removeButtonCallback(removedItem, index)
			{
				removedItem.remove();
			}

			function insertButtonCallback(src, index)
			{
				var button,
					obj = src[index];

				if (core.typeCheck.isObject(obj))
				{
					if (!!obj.icon)
						button = new _userInterface.CoreIconButton();
					else
						//create and assign a new button to <button>
						button = new _userInterface.CoreButton();

					//update the button
					updateButton(button, obj);
				}
				else
					core.debugging.warning("Core: Invalid data for dialog button descriptor object. The requested "
						+ " button will not be displayed correctly.")

				delete obj;

				//append the button
				this.appendChild(button);
				return button;
			}

			function changeButtonCallback(src, dest, index)
			{
				//update the button
				updateButton(dest[index], src[index]);
			}

			//sync <buttonElements> array with <value> array attribute
			core.arrayMan.syncArrays(value, this.buttonElements, removeButtonCallback, insertButtonCallback, changeButtonCallback, this);
		}});

		this.CoreDialogButtonBar = _userInterface.register("core-dialogbuttonbar", CoreDialogButtonBar_prototype);

		//CoreDialog
		var CoreDialog_prototype = Object.create(HTMLDialogElement.prototype);
		CoreDialog_prototype.titleBar = null;
		CoreDialog_prototype.content = null;
		CoreDialog_prototype.buttonBar = null;
		CoreDialog_prototype.draggabilityInstance = null;

		CoreDialog_prototype.createdCallback = function ()
		{
			this.returnValue = -1;

			this.titleBar = new _userInterface.CoreDialogTitleBar();
			this.appendChild(this.titleBar);

			this.content = new _userInterface.CoreDialogContent();
			this.appendChild(this.content);

			this.buttonBar = new _userInterface.CoreDialogButtonBar();
			this.appendChild(this.buttonBar);
		}

		this.CoreDialog = _userInterface.register("core-dialog", CoreDialog_prototype, "dialog");

		//interface dialogs
		this.dialogs = new function ()
		{
			Object.defineProperty(this, "buttonTypes", {
				value: {
					yesNo: [
						{
							value: 0,
							text: "yes"
						},
						{
							value: 1,
							text: "no",
							default: true
						}],
					yesNoCancel: [
						{
							value: 0,
							text: "yes"
						},
						{
							value: 1,
							text: "no"
						},
						{
							value: 2,
							text: "cancel",
							default: true
						}],
					yesCancel: [
						{
							value: 0,
							text: "yes"
						},
						{
							value: 1,
							text: "cancel",
							default: true
						}],
					noCancel: [
						{
							value: 0,
							text: "no"
						},
						{
							value: 1,
							text: "cancel",
							default: true
						}],
					ok: [
						{
							value: 0,
							text: "ok"
						}],
					okCancel: [
						{
							value: 0,
							text: "ok"
						},
						{
							value: 1,
							text: "cancel"
						}]
					},
					writable: false
				});

			//open a dialog
			//<flags>: <object { title, Array elements | message, [Array buttons], [function resultCallback],
			//[closeButton = true], [draggable = true], [removeWhenDone = true], [Object animation = core.animation.presetKeyframes.fadeIn] }>
			function openDialog (flags, callback, modal)
			{
				var dialog = new _userInterface.CoreDialog();

				const DEFAULT_OPEN_ANIM_DURATION = 218,
					DEFAULT_CLOSE_ANIM_DURATION = 218;

				//set dialog title
				dialog.titleBar.setTitle(flags.title);

				function closeDialog () {
					//POTENTIALLY UGLY hack: callback for closing when animation completes
					function closeAnimationEnd()
					{
						dialog.close();

						//remove dialog draggability
						if (dialog.draggabilityInstance != null)
							dialog.draggabilityInstance = dialog.draggabilityInstance.release();

						//detect if dialog should be removed after closing
						if (flags.removeWhenDone != false)
						{
							dialog.remove();
							dialog = dialog.release();
						}
					}

					//Check close animation flag and validate it
					var closeAnimationKeyframes = flags.closeAnimationKeyframes || core.animation.presetKeyframes.fadeOut,
						closeAnimationDuration = flags.closeAnimationDuration || DEFAULT_CLOSE_ANIM_DURATION;
					
					with (dialog.animate(closeAnimationKeyframes, closeAnimationDuration))
						onfinish = closeAnimationEnd;

					//Check if a function is to be called back when the dialog is closed
					if (core.typeCheck.isFunction(flags.returnCallback))
						flags.returnCallback.call(dialog, dialog.returnValue);
				}

				//Check if a close button is required
				if (flags.closeButton == false)
					dialog.titleBar.closeButton.remove();
				else
					//define onclick for close button
					dialog.titleBar.closeButton.onclick = closeDialog;

				//check if <flags.message> is not undefined
				if (!core.typeCheck.isUndefined(flags.message))
					//set dialog message
					dialog.content.addMessage(flags.message);
				//check if <flags.elements> is an array
				else if (core.typeCheck.isObject(flags.elements))
					//add elements to dialog content
					dialog.content.addElements(flags.elements);
				else
					core.debugging.error("Core: Cannot define dialog content. property <flags.message> is not defined, and obligatory property <flags.elements>"
						+ " is not a valid array.");

				function dialogButtonClicked()
				{
					closeDialog();
					dialog.returnValue = this.value;
				}
				//check if there are dialog buttons
				if (!!flags.buttons)
				{
					//set the buttons
					dialog.buttonBar.buttons = flags.buttons;

					//catch the "onclick" event of each button
					dialog.buttonBar.buttonElements.forEach(function (button)
					{
						button.addEventListener("click", dialogButtonClicked);
					});
				}
				else
					//hide the button bar
					dialog.buttonBar.setAttribute("core-hidden", "");

				//Check for dialog animation type
				var openAnimationKeyframes = flags.openAnimationKeyframes || core.animation.presetKeyframes.fadeIn,
					openAnimationDuration = flags.openAnimationDuration || DEFAULT_OPEN_ANIM_DURATION;;

				dialog.animate(openAnimationKeyframes, openAnimationDuration);

				//append the dialog to the document body
				document.body.appendChild(dialog);

				//detect if dialog is to be shown modal - default false
				if (modal == true)
					dialog.showModal();
				else
					dialog.show();

				//check if dialog is draggable - default true
				if (flags.draggable != false)
					dialog.draggabilityInstance = new _userInterface.Draggability(dialog, dialog.titleBar);

				//call <callback>, if it is a valid function
				if (core.typeCheck.isFunction(callback))
					//call <function callback(form, dialog) { }>
					return callback.call(dialog);
				else
					core.debugging.error("Core: Cannot call function. Argument <callback> is not a valid function");
			}

			//public show modal dialog
			this.showModal = function (flags, callback) {
				openDialog(flags, callback, true);
			}
		}

		this.initialize = function ()
		{			
		}
	}

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
	//type check utility - offers a simple type check interface
	this.typeCheck = new function()
	{
		var STRING = "string",
			UNDEF = "undefined",
			NUMBER = "number",
			OBJECT = "object",
			BOOL = "boolean",
			FUNCTION = "function";

		this.isString = function (obj)
		{
			return typeof obj == STRING;
		}
		this.isUndefined = function (obj)
		{
			return typeof obj == UNDEF;
		}
		this.isNumber = function (obj)
		{
			return typeof obj == NUMBER;
		}
		this.isObject = function (obj)
		{
			return typeof obj == OBJECT;
		}
		this.isArray = function (obj)
		{
			return (obj instanceof Array) ||
				!!Array.isArray && Array.isArray(obj);
		}
		this.isBoolean = function (obj)
		{
			return typeof obj == BOOL;
		}
		this.isFunction = function (obj)
		{
			return typeof obj == FUNCTION;
		}
	}
	this.TypeCheck = function (obj) {
		this.isString = core.typeCheck.isString(obj);
		this.isUndefined = core.typeCheck.isUndefined(obj);
		this.isNumber = core.typeCheck.isNumber(obj);
		this.isObject = core.typeCheck.isObject(obj);
		this.isArray = core.typeCheck.isArray(obj);
		this.isBoolean = core.typeCheck.isBoolean(obj);
		this.isFunction = core.typeCheck.isFunction(obj);
	}
	//string manipulator - offers some advanced string manipulation capabilities
  	this.stringMan = new function() {
		var _stringMan = this; 

		// This encoding function is from Philippe Tenenhaus's example at http://www.philten.com/us-xmlhttprequest-image/
		this.encodeBase64 = function(inputStr) 
		{
			var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var outputStr = "";
			var i = 0;
			
			while (i < inputStr.length)
			{
				//all three "& 0xff" added below are there to fix a known bug 
				//with bytes returned by xhr.responseText
				var byte1 = inputStr.charCodeAt(i++) & 0xff;
				var byte2 = inputStr.charCodeAt(i++) & 0xff;
				var byte3 = inputStr.charCodeAt(i++) & 0xff;
		
				var enc1 = byte1 >> 2;
				var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
				
				var enc3, enc4;
				if (isNaN(byte2))
				{
					enc3 = enc4 = 64;
				}
				else
				{
					enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
					if (isNaN(byte3))
					{
						enc4 = 64;
					}
					else
					{
						enc4 = byte3 & 63;
					}
				}
		
				outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
			} 
			
			return outputStr;
		}

      	this.capitalize = function (str) {
          	return str.replace(/(?:^|s)S/g, function(a) { return a.toUpperCase(); });
        }
        this.toCamelCase = function(str) {
         	return str.replace(/^\w|[\s-]\w/g, function(match, index) {
				match = match.replace(/[\s-]/, "");
              	return index == 0 ? match.toLowerCase() : match.toUpperCase();
            });
        }
        this.ToCamelCase = function(str) {
          	Core.stringMan.toCamelCase(str);
        }
        this.fromCamelCase = function(str) {
         	return str.replace(/^[a-z]|[A-Z]/g, function(match, index) {
              	return (index > 0 ? " " : "") + match.toUpperCase();
            });
        }
		this.removeQuotes = function(str)
		{
			return str.replace("\"", "\\\"");
		}
		this.getBinderPropertyName = function (attrVal)
		{
			if (/{{[\w.]*}}/g.test(attrVal))
				return attrVal.replace(/{{|}}/g, "");
			return null;
		}
		this.splice = function(str, start, delCount, newSubStr) {
				return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));
		}
		this.Succession = function (origStr, separator)
		{
			var _succession = this;

			this.originalString = origStr;
			this.separator = separator || "";
			this.addedStrings = [];

			this.add = function (str)
			{
				_succession.addedStrings.push(str);
			}
			this.remove = function ()
			{
				var arr = _succession.addedStrings;
				_succession.addedStrings = arr.slice(0, arr.length - 1);
			}
			this.clear = function ()
			{
				_succession.addedStrings = [];
			}
			this.generate = function ()
			{
				var result,
					str = result = _succession.originalString;
					addedStrs = _succession.addedStrings;

				for (var i = 0, l = addedStrs.length; i < l; i++)
				{
					str += addedStrs[i];
					result += _succession.separator + str;
				}
				return result;
			}
		}
		//include parameters in string, preceded by %
		this.includeParams = function(text, params)
		{
			//get params from arguments
			params = Array.prototype.slice.apply(arguments).slice(1);
			
			return text.replace(/%[0-9]+|%%/g, function(match) {
				var index = match.replace("%", "") * 1 - 1;
				if (match == "%%") return "%"; else return String(params[index]);
			});
		}
		//performatic eval
		this.evalParse = function (str, context)
		{
			var word = "", //current word
				exp = "", //expression
				charOChord = ""; //command char of chord
			for (var i = 0; i < str.length; i++)
			{
				var char = str[i],
					nextChar = str[i + 1] || null;
				word += char;
				
				if ("[](){}=".indexOf(char) >= 0)
				{
					charOChord = char;
					exp = word.slice(0, word.length - 1);
					word = "";
				}
				//insert space if <char> is in <"="> <nextChar> is [a-zA-Z]
				if ("=".indexOf(char) >= 0 && nextChar !== null && /[a-zA-Z]/.test(nextChar))
					str = _stringMan.splice(str, i, 0, " ")
			}
		}
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
				_titleTooltip.isShowing = true;

				_titleTooltip.tooltip.removeAttribute("core-hidden");
				core.animation.animate(_titleTooltip.tooltip, core.animation.presetKeyframes.fadeIn, {});
			}

			function hideTooltip()
			{
				_titleTooltip.isShowing = false;

				core.animation.animate(_titleTooltip.tooltip, core.animation.presetKeyframes.fadeOut, {}, function ()
				{
					if (!_titleTooltip.isShowing)
						_titleTooltip.tooltip.setAttribute("core-hidden", "");
				});
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
			_titleTooltip.tooltip = new core.userInterface.CoreTitleTooltip(); //tooltip
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

		this.userInterface.initialize.call(this.userInterface);

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