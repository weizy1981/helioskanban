/**                
 * **************************************************************
 * *********************  JavaScript Util Library  **************
 * **************************************************************
 */
/**
 * Point class
 */
function Point(x,y){
	this.x=x;
	this.y=y;
}

/**
 * refresh page with href
 * href URL string 
 * reloadSelf if reload current page
 * filter array for removing some paramters 
 */
function reload(href,reloadSelf,filter){
   if(href==null || href==undefined){
      try { 
         window.location.reload(true); 
         window.location.href = window.location.href; 
      } catch(e) {}
   }else{
      try { 
         window.location.href=href; 
         if(reloadSelf!=undefined && reloadSelf==true){
            var a_param=getParamsArray();
            if(a_param!=null){
	            for(var i=0;i<a_param.length;i++){
	               var param=a_param[i].split("=");
			       if(inArray(param[0],filter)){
			          return;
			       }
	            }
	        }
         	window.location.reload(true);
         } 
      } catch(e) {}
   }
}

/**
 * get parameter value
 * a_param parameter array 
 * name parameter name
 */
function getParam(paramArray,name){
   for(var i= 0;i<paramArray.length;i++){ 
       var param=paramArray[i].split("=");
       if(param[0]==name)return param[1];
   } 
   return "";
}

/**
 * get parameter value
 * name parameter name
 */
function getParameter(name){
   var a_param=getParamsArray();
   return getParam(a_param,name);
}

/**
 *get parameters array
 */
function getParamsArray(){
    var href=window.location.href;
    var q_index=href.indexOf("?");
    if(q_index>0){
	    var params = href.substr(q_index+1);
	    var s_index= params.indexOf("#");
	    if(s_index>0) params=params.substr(0,s_index);
		var reg = /([^&]*?)\=([^&]*)/g;
		return params.match(reg); 
	}else{
	    return null;
	}
}

/**
 *Clear # in URL
 */
function clearSharp(href){
    var s_index= href.indexOf("#");
	if(s_index>0){href=href.substr(0,s_index);};
	return href;
}

/**
 * get new URL without the filter parameter
 * filter the parameter for filter
 * addSharp if add # for the new URL
 */
function getNewUrl(filter,addSharp,url){
    var href=null;
    if(url!=undefined && url!=null)href=url;
    else href=window.location.href;
    var q_index=href.indexOf("?");
    if(q_index>=0){
	    var params = href.substr(q_index+1);
	    params=clearSharp(params);
		var reg = /([^&]*?)\=([^&]*)/g;
		var a_param = params.match(reg); 
		var str_param="";
		var isFirst=true;
		for(var i=0;i<a_param.length;i++){
		   var param=a_param[i].split("=");
		   if(!inArray(param[0],filter)){
		      if(!isFirst)str_param+="&";
		      str_param+=param[0]+"="+param[1];
		      isFirst=false;
		   }
		}
		var href_load=null;
		if(str_param.isBlank()){
			href_load=href.substr(0,q_index);
		}else{
			href_load=href.substr(0,q_index+1)+str_param;
		}
		
		if(addSharp==undefined || addSharp==null || addSharp==true){
			href_load+=window.location.hash;
		}
		return href_load;
	}else{
	    return href;
	}
}

/**
 * refresh current page without the parameter(filter)
 * filter the parameter for filter
 */
function refresh(filter){
    reload(getNewUrl(filter),true,filter);
}

/**
 * check if item in the array
 * item string item
 * array string array
 * ignoreCase if ignore case
 */
function inArray(item,array,ignoreCase){
   if(ignoreCase==undefined){
      ignoreCase=true;
   }
   if(array!=undefined && array!=null){
	   for(var i=0;i<array.length;i++){
	       if(ignoreCase){
		      if(item.toLowerCase()==array[i].toLowerCase()){
		         return true;
		      }
		  }else{
		      if(item==array[i]){
		         return true;
		      }
		  }
	   }
   }
   return false;
}

/**
 * get index for a string in a array
 * array string array
 * strFind string to need find
 */
function getIndex(array,strFind){
   if(array!=undefined && array!=null && strFind!=null){
	   for(var i=0;i<array.length;i++){
	       if(strFind==array[i]){
	           return i;
	       }
	   }
   }
   return -1;
}

/**
 * get a item in a array
 * array items array(the first column data as the key in 2 dimensions array)
 * key  item key
 */
function getItemOfArray(array,key){
   if(array!=undefined && array!=null && key!=null){
	   for(var i=0;i<array.length;i++){
	       if(key.toLowerCase()==array[i][0].toLowerCase()){
	           return array[i];
	       }
	   }
   }
   return null;
}

/**
 * get a item in a array by key
 * array items array
 * keyValue the value for item key
 */
function getItemOfArrayByKey(array,keyValue){
   if(array!=undefined && array!=null && keyValue!=null){
   	   for(key in array){
	       if(keyValue.toLowerCase()==key.toLowerCase()){
	           return array[key];
	       }
	   }
   }
   return null;
}

/**
 * go to page URL
 * url page URL string
 */
function goPage(url){
   var index=url.indexOf('#');
   if(index==-1){
      url=url+window.location.hash;
   }
   reload(url);
}

/**
 * get available width for current browser
 */
function getAvailableWidth(){
  var myWidth=0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
  } else if( document.documentElement && document.documentElement.clientWidth) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
  } else if( document.body && document.body.clientWidth) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
  }
  return myWidth;
}

/**
 * get available height for current browser
 */
function getAvailableHeight(){
  var myHeight=0;
  if( typeof( window.innerHeight) == 'number') {
    //Non-IE
    myHeight = window.innerHeight;
  } else if( document.documentElement && document.documentElement.clientHeight) {
    //IE 6+ in 'standards compliant mode'
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && document.body.clientHeight) {
    //IE 4 compatible
    myHeight = document.body.clientHeight;
  }
  return myHeight;
}

/**
 *get scroll position point
 */
function getScrollXY() {
  var scrOfX = 0, scrOfY = 0;
  if(window.pageYOffset) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  }else if(document.body && (document.body.scrollLeft || document.body.scrollTop)){
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  }else if(document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop)){
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return new Point(scrOfX,scrOfY);
}

/**
 * get current XY
 * @param event event handler
 * @return 
 */
function getSelfXY(event){
    var yScrolltop;
    var xScrollleft;
    event=window.event || event;
    if (self.pageYOffset || self.pageXOffset) {
        yScrolltop = self.pageYOffset;
        xScrollleft = self.pageXOffset;
    } else if (document.documentElement && document.documentElement.scrollTop || document.documentElement.scrollLeft ){//IE 6 Strict
        yScrolltop = document.documentElement.scrollTop;
        xScrollleft = document.documentElement.scrollLeft;
    } else if (document.body) {// all other Explorers
        yScrolltop = document.body.scrollTop;
        xScrollleft = document.body.scrollLeft;
    }
    var cp = new Point(xScrollleft + event.clientX ,yScrolltop + event.clientY);
    return cp;
}

/**
 * Get an object left position from the upper left viewport corner
 * @param object target object
 * @return 
 */
function getAbsoluteLeft(object) {
	if(object!=null){
		return $(object).offset().left;
	}else{
		return 0;
	}
}

/**
 * Get an object top position from the upper left viewport corner
 * @param object target object
 * @return 
 */
function getAbsoluteTop(object) {
	if(object!=null){
		return $(object).offset().top;
	}else{
		return 0;
	}
}

/**
 *Copy text to system clipboard
 *txt text content
 */
function copyToClipboard(txt) {
	if(window.clipboardData) {
	    window.clipboardData.clearData();
	    window.clipboardData.setData('Text', txt);
	} else if(navigator.userAgent.indexOf("Opera") != -1) {
	    window.location = txt;
	} else if (window.netscape) {
		try {
		    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		} catch (e) {
		   alert("Please open your firefox security constraint by 'about:config' to set signed.applets.codebase_principal_support' as 'true'");
		   return false;
		}
		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
		if (!clip)return;
		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if (!trans)return;
		trans.addDataFlavor('text/unicode');
		var str = new Object();
		var len = new Object();
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		var copytext = txt;
		str.data = copytext;
		trans.setTransferData('text/unicode',str,copytext.length*2);
		var clipid = Components.interfaces.nsIClipboard;
		if (!clip)return false;
		clip.setData(trans,null,clipid.kGlobalClipboard);
	}
}

/**
 * get a random integer
 * @param max random max value
 * @return random value
 */
function getRandom(max){
	return Math.round(Math.random()*max);
}

/*get random numer with specified length*/
function MathRand(len) {
	if(isNull(len)){
		len=6;
	}
    var Num=""; 
    for(var i=0;i<len;i++) {
        Num+=Math.floor(Math.random()*10);
    }
    return Num;
}

/**
 * get last element value separated by comma
 */
function getLastValue(value,separator){
	if(isNull(separator))separator=',';
	if(!isNull(value)){
		var index=value.lastIndexOf(separator);
		value=value.substring(index+1).trim();
	}
	return value;
}

/**
 * get query string for the input array which can be id or class
 * for example: new Array('.round','id1') etc
 */
function getQueryString(idsArray){
	if(!isNull(idsArray)){
		var strQuery="";
		if(idsArray.constructor == Array){
			for(var i=0;i<idsArray.length;i++){
				if(idsArray[i].indexOf('.')==0){//class
					$(idsArray[i]).each(function(){
						strQuery=_getQueryStringByObj($(this),strQuery);
					});
				}else{
					var obj=$('#'+idsArray[i]);
					strQuery=_getQueryStringByObj(obj,strQuery);
				}
			}
		}else{
			var obj=$('#'+idsArray);
			strQuery=_getQueryStringByObj(obj,strQuery);
		}
		return strQuery;
	}
	return "";
}

/**
 * get query string by jQuery object
 * @param obj jQuery object
 * @param strQuery old query string
 * @return 
 */
function _getQueryStringByObj(obj,strQuery){
	var name=obj.attr('name');
	if(isBlank(name)){
		name=obj.attr('id');
	}
	var q_val=obj.val();
	if(obj.attr('type')=='checkbox'){
		q_val=$('#'+obj.attr('id')+':checked').val();
	}
	if(!isBlank(name) && !isBlank(q_val)){
		if(!isBlank(strQuery)){
			strQuery+="&";
		}
		strQuery+=name+"="+escape(q_val);
	}
	return strQuery;
}

/**
 * reset all value as blank
 * for example: new Array('.round','id1') etc
 */
function reset(idsArray){
	if(!isNull(idsArray)){
		if(idsArray.constructor == Array){
			for(var i=0;i<idsArray.length;i++){
				if(idsArray[i].indexOf('.')==0){//class
					$(idsArray[i]).each(function(){
						$(this).val('');
					});
				}else{
					$('#'+idsArray[i]).val('');
				}
			}
		}else{
			var obj=$('#'+idsArray).val('');
		}
	}
}

/**
 * format number with or without px
 * @param num number or string like this:12px
 * @return
 */
function formatNum(num){
	if(!isNull(num) && isNaN(num)){
		if(num.indexOf("%")){//invalid number
			return false;
		}else{
			var index=num.indexOf("px");
			if(index>0){
				return new Number(num.substring(0,index));
			}else{
				return new Number(num);
			}
		}
	}else{
		return num;
	}
}
/**
 * formar number with specified precision
 * @param value number value
 * @param precision specified precision
 * @return
 */
function formatNumber(value,precision){
    if(isBlank(value))return 0;
    if(isNaN(value))return 0;
    if(precision==-1){//if -1 then ignore
    	return value;
    }
    try{
       return (Number(value)).toFixed(parseInt(precision));
    }catch(err){
       return 0;
    }
}

/**
 * Clone object
 * @param myObj Object instance
 * @return
 */
function clone(myObj){
    if(typeof(myObj) != 'object') return myObj;
    if(myObj == null) return myObj;
    var myNewObj = new Object();
    for(var i in myObj) myNewObj[i] = clone(myObj[i]);
    return myNewObj;
} 

/**
 * check obj is null or undefined
 * @param obj
 * @return
 */
function isNull(obj){
	return obj==undefined || obj==null;
}

/**
 * check String is null or equal ''
 * @return
 */
function isBlank(str){
	return isNull(str) || str.toString().isBlank();
}

/**
 * check String is equal ''
 * @return
 */
String.prototype.isBlank=function(){
	return this.trim()=='';
};

/**
 * extend String class to trim space
 */
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

/**
 * check if argent value is string
 * @param arg argent value
 * @returns {Boolean}
 */
function isString(arg) {
	return typeof arg === 'string';
}

/**
 * Parse string to JSON object
 */
String.prototype.toJSON = function () {
    try {
        return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
                 this.replace(/"(\\.|[^"\\])*"/g, ''))) 
               && eval('(' + this.trim() + ')');
    } catch (e){
        return false;
    }
};

/**
 * Parse javascript object to JSON string
 */
function serialize (object) {
    var type = typeof object;
    if ('object' == type) {
        if (Array == object.constructor)
            type = 'array';
        else if (RegExp == object.constructor)
            type = 'regexp';
        else
            type = 'object';
    }
    switch (type) {
        case 'undefined':
        case 'unknown':
            return;
            break;
        case 'function':
        case 'boolean':
        case 'regexp':
            return object.toString();
            break;
        case 'number':
            return isFinite(object) ? object.toString() : 'null';
            break;
        case 'string':
            return '"' + object.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g,
               function() {
                   var a = arguments[0];
                   return (a == '\n') ? '\\n' :(a == '\r') ? '\\r' :(a == '\t') ? '\\t' : "";
               }) + '"';
            break;
        case 'object':
            if (object === null) return 'null';
            var results = [];
            for (var property in object) {
            	if(!isNull(object[property])){
                    var value = serialize(object[property]);
	                if (value !== undefined){
	                    results.push(serialize(property) + ':' + value);
	                }
            	}
            }
            return '{' + results.join(',') + '}';
            break;
        case 'array':
            var results = [];
            for (var i = 0; i < object.length; i++) {
            	if(!isNull(object[i])){
	                var value = serialize(object[i]);
	                if (value !== undefined) results.push(value);
            	}
            }
            return '[' + results.join(',') + ']';
            break;
    }
};

/**
 * get the file size of the file input element 
 * @param fileInput the file input element or the id of the file input element
 * @return	file size in bytes
 */
function getFileSize(fileInput){
	var fileSize = 0;
	if(typeof fileInput === 'string'){
		fileInput = document.getElementById(fileInput);
	}
	if(fileInput && fileInput.nodeType===1){//if it is a file input element
		if(fileInput.files){//works in firefox
			fileSize = fileInput.files[0].fileSize;
		}else if(false){//typeof ActiveXObject==='function'){//may work in IE
			try{
				var fso = new ActiveXObject("Scripting.FileSystemObject");
				fileSize = fso.getFile(fileInput.value).size;
			}catch(e){
				//do nothing
			}
		}
	}
	return fileSize;
}

/**
 * decode HTML string
 * @param str
 * @returns HTML String
 */
function HTMLDecode(str)  {  
	var s= "";  
	if(str.length==0) return "";  
	s = str.replace(/&amp;/g, "&");  
	s = s.replace(/&lt;/g,  "<");  
	s = s.replace(/&gt;/g,  ">");  
	s = s.replace(/&nbsp;/g,  " ");  
	s = s.replace(/'/g,"\'");  
	s = s.replace(/&quot;/g,"\"");  
	s = s.replace(/<br>/g,"\n");  
	s = s.replace(/&#39;/g,"\'"); 
	return s;
 }

//***********implement remove item from Array**********//
Array.prototype.remove = function(dx){
    if(isNaN(dx)||dx>this.length){return false;}
    this.splice(dx,1);
};

//*****************************************************//
/**
 * show result dialog for the output from server
 * @param result the result from server
 * @param callback callback function for the dialog.
 */
function showResult(result,callback){
 	$ui.dialog.CloseLoadingDialog();
	if(result.error){
		if(isString(result.error)){
			$ui.dialog.Alert(result.error,"Error",350,callback);
		}else{
			$ui.dialog.Alert(JSON.stringify(result.error),"Error",350,callback);
		}
	}else if(result.message){
		if(isString(result.message)){
			$ui.dialog.Alert(result.message,"Message",350,callback);
		}else{
			$ui.dialog.Alert(JSON.stringify(result.message),"Message",350,callback);
		}
	}
}