/*
 * HTML5 Forms Chapter JavaScript Library
 * http://thecssninja.com/javascript/H5F
 *
 * Copyright (c) 2010 Ryan Seddon - http://thecssninja.com/
 * Dual-licensed under the BSD and MIT licenses.
 * http://thecssninja.com/H5F/license.txt
 *
 */

var H5F = H5F || {};

(function(d){
	
	var field = document.createElement("input"),
		emailPatt = new RegExp("([a-z0-9_.-]+)@([0-9a-z.-]+).([a-z.]{2,6})","i"), 
		urlPatt = new RegExp("^http:\/\/","i"),
		pattern, curEvt, args;
	
	H5F.setup = function(form,settings) {
		var isCollection = !form.nodeType || false;
		
		var opts = {
			validClass : "valid",
			invalidClass : "error",
			requiredClass : "required"
        }

        if(typeof settings === "object") {
			for (var i in opts) {
				if(typeof settings[i] === "undefined") settings[i] = opts[i];
			}
		}
		
		args = settings || opts;
		
		if(isCollection) {
			for(var i=0,len=form.length;i<len;i++) {
				H5F.validation(form[i]);
			}
		} else {
			H5F.validation(form);
		}
	};
	
	H5F.validation = function(form) {
		var	f = form.elements,
			flen = f.length,
			isRequired;
		
		H5F.listen(form,"invalid",H5F.checkField,true);
		H5F.listen(form,"blur",H5F.checkField,true);
		H5F.listen(form,"input",H5F.checkField,true);
		H5F.listen(form,"focus",H5F.checkField,true);
		H5F.listen(form,"submit",function(e,f){H5F.checkValidity(e,form);},false);
		
		form.checkValidity = function(e,f) { H5F.checkValidity("",form); };
		
		while(flen--) {
			isRequired = !!(f[flen].attributes["required"]);
			// Firefox includes fieldsets inside elements nodelist so we filter it out.
			if(f[flen].nodeName !== "FIELDSET" && isRequired) {
				H5F.validity(f[flen]); // Add validity object to field
			}
		}
	};
	H5F.validity = function(el) {
		if(!H5F.support()) {
			var elem = el,
				missing = H5F.valueMissing(elem),
				type = elem.getAttribute("type"),
				pattern = elem.getAttribute("pattern"),
				placeholder = elem.getAttribute("placeholder"),
				isType = /^(email|url|password)$/i,
				fType = ((isType.test(type)) ? type : ((pattern) ? pattern : false)),
				patt = H5F.pattern(elem,fType),
				step = H5F.range(elem,"step"),
				min = H5F.range(elem,"min"),
				max = H5F.range(elem,"max");
			
			elem.validity = {
				patternMismatch: patt,
				rangeOverflow: max,
				rangeUnderflow: min,
				stepMismatch: step,
				valid: (!missing && !patt && !step && !min && !max),
				valueMissing: missing
			};
			
			if(placeholder && curEvt !== "input") { H5F.placeholder(elem); }
			elem.checkValidity = function(e,el) { H5F.checkValidity(e,elem); };
		}
	};
	H5F.checkField = function (e) {
		var el = H5F.getTarget(e) || e, // checkValidity method passes element not event
			events = /^(input|focusin|focus)$/i;
		
		curEvt = e.type;
		H5F.validity(el);
		
		if(el.validity.valid) {
			el.className = args.validClass;
		} else if(!events.test(curEvt)) {
			if(el.validity.valueMissing) {
				el.className = args.requiredClass;
			} else {
				el.className = args.invalidClass;
			}
		} else if(el.validity.valueMissing) {
			el.className = "";
		}
	};
	H5F.checkValidity = function (e,el) {
		var f, ff, isRequired, invalid = false;
		
		if(el.nodeName === "FORM") {
			f = el.elements;
			
			for(var i = 0,len = f.length;i < len;i++) {
				ff = f[i];
				
				isRequired = !!(ff.attributes["required"]);
				
				if(ff.nodeName !== "FIELDSET" && isRequired) {
					H5F.checkField(ff);
					if(!ff.validity.valid && !invalid) {
						ff.focus();
						invalid = true;
					}
				}
			}
		} else {
			H5F.checkField(el);
			return el.validity.valid;
		}
		
		if(e.type === "submit" && invalid) { H5F.preventActions(e); }
		
		return !invalid;
	};
	
	H5F.support = function() {
		// Check for native support
		return (H5F.isCVAEventSupported("invalid") && H5F.isHostMethod(field,"validity") && H5F.isHostMethod(field,"checkValidity"));
	};

	// Create helper methods if browser doesn't support new methods
	H5F.pattern = function(el, type) {
		if(type === "email") {
			return !emailPatt.test(el.value);
		} else if(type === "url") {
			return !urlPatt.test(el.value);
		} else if(!type || type === "password") { // Password can't be evalutated.
			return false;
		} else {
			pattern = new RegExp(type);
			return !pattern.test(el.value);
		}
	};
	H5F.valueMissing = function(el) {
		var placeholder = el.getAttribute("placeholder");
		return !!(el.value === "" || el.value === placeholder);
	};
	H5F.placeholder = function(el) {
		var placeholder = el.getAttribute("placeholder"),
			focus = /^(focus|focusin)$/i,
			node = /^(input|textarea)$/i,
			isNative = !!("placeholder" in field);
		
		if(!isNative && node.test(el.nodeName)) {
			if(el.value === "") {
				el.value = placeholder;
			} else if(el.value === placeholder && focus.test(curEvt)) {
				el.value = "";
			}
		}
	};
	H5F.range = function(el,type) {
		// Emulate min, max and step
		var min = parseInt(el.getAttribute("min"),10) || 0,
			max = parseInt(el.getAttribute("max"),10) || false,
			step = parseInt(el.getAttribute("step"),10) || 1,
			val = parseInt(el.value,10),
			mismatch = (val-min)%step;
		
		if(!H5F.valueMissing(el) && !isNaN(val)) {
			if(type === "step") {
				return (el.getAttribute("step")) ? (mismatch !== 0) : false;
			} else if(type === "min") {
				return (el.getAttribute("min")) ? (val < min) : false;
			} else if(type === "max") {
				return (el.getAttribute("max")) ? (val > max) : false;
			} 
		} else if(el.getAttribute("type") === "number") { 
			return true;
		} else {
			return false;
		}
	};
	H5F.required = function(el) {
		var required = el.getAttribute("required");
		
		return (required === "" || required === "required") ? H5F.valueMissing(el) : false;
	};
	
	/* Util methods */
	H5F.listen = function (node,type,fn,capture) {
		if(H5F.isHostMethod(window,"addEventListener")) {
			/* FF & Other Browsers */
			node.addEventListener( type, fn, capture );
		} else if(H5F.isHostMethod(window,"attachEvent") && typeof window.event !== "undefined") {
			/* Internet Explorer way */
			if(type === "blur") {
				type = "focusout";
			} else if(type === "focus") {
				type = "focusin";
			}
			node.attachEvent( "on" + type, fn );
		}
	};
	H5F.preventActions = function (evt) {
		evt = evt || window.event;
		
		if(evt.stopPropagation && evt.preventDefault) {
			evt.stopPropagation();
			evt.preventDefault();
		} else {
			evt.cancelBubble = true;
			evt.returnValue = false;
		}
	};
	H5F.getTarget = function (evt) {
		evt = evt || window.event;
	    return evt.target || evt.srcElement;
	};
	H5F.isHostMethod = function(o, m) {
		var t = typeof o[m], reFeaturedMethod = new RegExp('^function|object$', 'i');
		return !!((reFeaturedMethod.test(t) && o[m]) || t == 'unknown');
	};
	H5F.isCVAEventSupported = function (eventName) {
		var el = document.createElement('input');
		eventName = 'on' + eventName;
		var isSupported = (eventName in el);
		if (!isSupported) {
			el.setAttribute(eventName, 'return;');
			isSupported = typeof el[eventName] == 'function';
		}
		el = null;
		return isSupported;
	};

})(document);