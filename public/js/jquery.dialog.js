/**
 * All Dialog and loading components  
 * Dependence files:util.js,jquery.js,ui.package.js,ui.draggable.js
 */
/**
 * Show background layer
 */
ui.dialog._showMask = function(id) {
	if(isNull(id) || id==$ui.dialog.DEFAULT_ID){
		id=$ui.dialog.DEFAULT_MASK_ID;
	}else{
		id="MASK_"+id;
	}
    if ($("#"+id).size() == 0) {
        var html = "<div id='"+id+"' class='DialogMask'></div>";
        $(window.document.body).append(html);
        var c_mask=$("#"+id);
        c_mask.css("width", $(document).width());
        c_mask.css("height", $(document).height());
        $(window).resize(function() {
            $("div.DialogMask").css("width", $(document).width());
            $("div.DialogMask").css("height", $(document).height());
        });
        $(window).scroll(function() {
            $("div.DialogMask").css("width", $(document).width());
            $("div.DialogMask").css("height", $(document).height());
        });
    }
    return $("#"+id);
};

/**
 * Hide background layer
 */
ui.dialog._hideMask = function(id) {
	if(isNull(id) || id==$ui.dialog.DEFAULT_ID){
		id=$ui.dialog.DEFAULT_MASK_ID;
		//[Notice]:don't allow there are same ModalDialog and ModalCustomDialog class for the other usage
		var dlgCount=$("div.ModalDialog").size()+$("div.ModalCustomDialog").size();
		if(dlgCount>1){//just one then close
			return;
		}
	}else{
		id="MASK_"+id;
	}
    if (window.parent != null) {
        $("#"+id, window.parent.document).remove();
        $(window.parent.window).unbind("resize").unbind("scroll");
    }
    $("#"+id).remove();
    $(window).unbind("resize").unbind("scroll");
};

/**
 * Add loading image, also you could add loading text
 * @param img loading image, default is $ui.IMG_ROOT+loading/loading8.gif
 * @param id add loading into this id
 * @param text loading text
 * @return 
 */
ui.dialog.Loading=function(img,id,text,center){
	this.id=id;
	this.img_root=$ui.IMG_ROOT+"loading/";
	text = text || "";
	if(isNull(img)){
		img=this.img_root+"loading.gif";
	}else if(img.indexOf('/')<0){
		img=this.img_root+img;
	}
	if(!text.isBlank()){
		text="&nbsp;&nbsp;"+text;
	}
	var imgHtml="<img align='absMiddle' border='0' src='"+img+"'>"+text;
	if(center){
		imgHtml="<table border='0' width='100%' height='100%'><tr><td align='center' valign='middle'>"
		       +imgHtml+"</td></tr></table>";
	}
	if(isNull(id)){
		return imgHtml;
	}else{
		$('#'+id).html(imgHtml);
	}
};

/**
 * hide loading
 */
ui.dialog.Loading.prototype.hide=function(){
	$('#'+this.id).html("");
};

/**
 * hide loading by id
 * @param {} id
 */
ui.dialog.HideLoading=function(id){
	if(isNull(id))id=$ui.dialog.LOADING_ID;
	$('#'+id).html("");
};

/**
 * Show normal or customized dialog
 * @param link dialog content source URL
 * @param html dialog content HTML
 * @param isModal modal dialog or modeless dialog?
 * @param width dialog width
 * @param height dialog height
 * @param id dialog id
 * @param imgRoot round image root
 * @param corner round image corner setting
 * @param bgcolor round box background color
 * @param template template path
 * @param callback callback function
 * @param dragHandle handle for draggable
 * @param title table title HTML string
 * @param imgFormat image format,for example:png, gif, jpg etc.
 */
ui.dialog.Dialog=function(link,html,isModal,width,height,id,imgRoot,corner,
                          bgcolor,template,callback,dragHandle,title,imgFormat){
	if(isNull(id)){
		id=$ui.dialog.DEFAULT_ID;
	}
	var modalClass='';
	if(isNull(isModal) || isModal){
		$ui.dialog._showMask();
		modalClass='Modal';
	}
	//**set object properties***//
	this.id=id;
	this.html=html;
	this.link=link;
	this.isModal=isModal;
	this.width=width;
	this.height=height;
	this.imgRoot=imgRoot;
	this.corner=corner;
	this.bgcolor=bgcolor;
	this.template=template;
	this.template_root=$ui.IMG_ROOT+"dialog/template/";
	//**************************//
	if(document.getElementById(id)==null){
		var container="<div id='"+id+"' class='"+modalClass+"Dialog'></div>";
		if(!isNull(imgRoot) || !isNull(template)){
			container="<div id='"+id+"' class='"+modalClass+"CustomDialog'></div>";
		}
		$(document.body).append(container);
	}
	var dialog=$('#'+id);
	var body=dialog;
	if(!isNull(imgRoot)){//For round box
		var td_id=id+"_TD";
		var round_html=$ui.util.Grid9(imgRoot,id+"_T",corner,'100%',"",td_id,bgcolor,null,title,imgFormat);
		if (!isNull(title)) {
			round_html = round_html.replace(/{ID}/g, id);
			if(isNull(dragHandle))dragHandle="#td_"+id+"_T_Title";
		}
		body.html(round_html);
		body=$('#'+td_id);
	}
	if(!isNull(template)){//For template file
		var body_id=id+"_Body";
		var objThis=this;
		if(template.indexOf("/")<0){
			template=this.template_root+template;
		}
		body.load(template,function(){
			var templateHtml=body.html();
			if(!isBlank(templateHtml)){
				templateHtml=templateHtml.replace(/{ID}/g,id);
				body.html(templateHtml);
			}
			body=$('#'+body_id);
			objThis._load(dialog,body,html,link,width,height,callback,dragHandle);
		});
	}else{
		this._load(dialog,body,html,link,width,height,callback,dragHandle);
	}
};

/**
 * 
 * @param dialog current dialog root jQuery object
 * @param body dialog container body
 * @param html dialog content HTML
 * @param link dialog content source URL
 * @param width  width to be set
 * @param height height to be set
 * @param callback callback function
 * @param dragHandle handle for draggable
 */
ui.dialog.Dialog.prototype._load=function(dialog,body,html,link,width,height,callback,dragHandle){
	if(isNull(html)){
		if(!isNull(link)){
			var objThis=this;
			var loading_html="<div style='padding:15px 10px 15px 10px;font-weight:bold;' align='center'>"
				            +$ui.dialog.Loading(null,null,LOADING_DATA)+"</div>";
			body.html(loading_html);//$ui.dialog.LoadingDialog(LOADING_DATA);//show waiting
			$.get(link,function(data){
				body.html(data);//load page data
				//$ui.dialog.CloseLoadingDialog();//close waiting
				objThis._setDialog(dialog,width,height,dragHandle);
				if(!isNull(callback))callback(objThis);
			});
		}else{
			dialog.remove();
		}
	}else{
		body.html(html);
		if(!isNull(callback))callback(this);
		this._setDialog(dialog,width,height,dragHandle);
	}
};

/**
 * Set dialog attributes
 * @param dialog current dialog root jQuery object
 * @param width  width to be set
 * @param height height to be set
 * @param dragHandle handle for draggable
 */
ui.dialog.Dialog.prototype._setDialog=function(dialog,width,height,dragHandle){
	if(isNull(width) || width===false){
		width=dialog.width();
	}else{
		dialog.width(width);
	}
	if(isNull(height) || height===false){
		height=dialog.height();
	}else{
		dialog.height(height);
	}
	var left = (getAvailableWidth() - width) / 2;
    var top  = (getAvailableHeight() - height)/ 2-20;
    if(top<10) top=10;//min value for top
    var sxy=getScrollXY();
    dialog.css("left", left+sxy.x);
    dialog.css("top", top+sxy.y);
    dialog.show();
    if(dragHandle!=false){//don't let it drag
    	dialog.draggable({handle:dragHandle});
    }
};

/**
 * Close current dialog
 */
ui.dialog.Dialog.prototype.close=function(isCloseMask){
	$ui.dialog.CloseDialog(this.id,isCloseMask);
};

/**
 * Close dialog with id
 * @param id dialog id
 */
ui.dialog.CloseDialog=function(id,isCloseMask){
	if(isNull(isCloseMask)){
		isCloseMask=true;
	}
	if(isCloseMask){
		$ui.dialog._hideMask();
	}
	if(isNull(id)){
		id=$ui.dialog.DEFAULT_ID;
	}
	$('#'+id).remove();
};

/**
 * Create dialog by JSON object(JSON string)
 * @param obj JSON object(JSON string),there are 12 properties:
 * link,html,isModal,width,height,id,imgRoot,corner,bgcolor,template,dragHandle,imgFormat
 * @param callback callback function
 */
ui.dialog.DialogByJSON=function(obj,callback){
	if(obj!=null){
		return new ui.dialog.Dialog(obj.link,obj.html,obj.isModal,obj.width,obj.height,obj.id,
		    obj.imgRoot,obj.corner,obj.bgcolor,obj.template,callback,obj.dragHandle,obj.imgFormat);
	}else{
		return null;
	}
};

/**
 * Show round dialog
 * @param link dialog content source URL
 * @param html dialog content HTML
 * @param isModal modal dialog or modeless dialog?
 * @param width dialog width
 * @param height dialog height
 * @param id dialog id
 * @param template template path
 * @param dragHandle handle for draggable
 * @param imgRoot round image root
 * @param corner round image corner setting
 * @param bgcolor round box background color
 * @param imgFormat image format,for example:png, gif, jpg etc.
 */
ui.dialog.RoundDialog=function(link,html,isModal,width,height,id,template,
                  callback,dragHandle,imgRoot,corner,bgcolor,imgFormat){
	if(isNull(imgRoot)){
		imgRoot = $ui.IMG_ROOT + "dialog/round_box1/";
		if(isNull(bgcolor)) bgcolor='#FFFFFF';//for round_box1
	}
	if(isNull(corner)) corner=new ui.util.Corner(6);
	var dialog=new ui.dialog.Dialog(link,html,isModal,width,height,id,imgRoot,
	                   corner,bgcolor,template,callback,dragHandle,imgFormat);
	return dialog;
};

/**
 * Create round dialog by JSON object(JSON string)
 * @param obj JSON object(JSON string),there are 8 properties:
 * link,html,isModal,width,height,id,template,dragHandle,imgRoot,corner,bgcolor,imgFormat
 * @param callback callback function
 */
ui.dialog.RoundDialogByJSON=function(obj,callback){
	if(obj!=null){
		return $ui.dialog.RoundDialog(obj.link,obj.html,obj.isModal,obj.width,obj.height,obj.id,
		     obj.template,callback,obj.dragHandle,obj.imgRoot,obj.corner,obj.bgcolor,obj.imgFormat);
	}else{
		return null;
	}
};

/**
 * Show round dialog with URL link
 * @param link dialog content source URL
 * @param isModal modal dialog or modeless dialog?
 * @param width dialog width
 * @param height dialog height
 * @param id dialog id
 * @param template template path
 * @param callback callback function
 * @param dragHandle handle for draggable
 * @param imgFormat image format,for example:png, gif, jpg etc.
 */
ui.dialog.RoundDialogByLink=function(link,isModal,width,height,id,template,callback,dragHandle,imgFormat){
	return $ui.dialog.RoundDialog(link,null,isModal,width,height,id,template,callback,dragHandle,imgFormat);
};

/**
 * Show round dialog with inner HTML
 * @param html dialog content HTML
 * @param isModal modal dialog or modeless dialog?
 * @param width dialog width
 * @param height dialog height
 * @param id dialog id
 * @param template template path
 * @param callback callback function
 * @param dragHandle handle for draggable
 * @param imgFormat image format,for example:png, gif, jpg etc.
 */
ui.dialog.RoundDialogByHtml=function(html,isModal,width,height,id,template,callback,dragHandle,imgFormat){
	return $ui.dialog.RoundDialog(null,html,isModal,width,height,id,template,callback,dragHandle,imgFormat);
};

/**
 * Show round dialog with title bar
 * @param link dialog content source URL
 * @param html dialog content HTML
 * @param isModal modal dialog or modeless dialog?
 * @param width dialog width
 * @param height dialog height
 * @param title dialog title
 * @param id dialog id
 * @param callback callback function
 * @param closeCallback the callback for close image button
 * @param imgRoot round image root
 * @param corner round image corner setting
 * @param bgcolor round box background color
 * @param imgFormat image format,for example:png, gif, jpg etc.
 */
ui.dialog.RoundTitleDialog = function(link, html, isModal, width, height, title, id, 
                             callback, closeCallback,imgRoot,corner,bgcolor,imgFormat){
	if(isNull(imgRoot)){
		imgRoot = $ui.IMG_ROOT + "dialog/round_box2.gif";
		if(isNull(bgcolor)) bgcolor='#dfe8f6';//for round_box2
		if(isNull(corner)) corner=new ui.util.Corner(5,33,5,5);//for round_box2
	}
	var dialog=new ui.dialog.Dialog(link,html,isModal,width,height,id,imgRoot,
	               corner,bgcolor,null,function(obj){
					   var img_close=$('#'+obj.id+"_Close");
		           	   img_close.click(function(){
							obj.close(isModal);
							//for close callback
							if(!isNull(closeCallback)){
								closeCallback(false);
		           		    }
					   })
					   if(!isNull(callback)){callback(obj);}
				   },null,title,imgFormat);
	return dialog;
};

/**
 * Show round dialog with title bar
 * @param obj JSON object(JSON string),there are 10 properties:
 *  link dialog content source URL
 *  html dialog content HTML
 *  isModal modal dialog or modeless dialog?
 *  width dialog width
 *  height dialog height
 *  title dialog title
 *  id dialog id
 *  imgRoot round image root
 *  corner round image corner setting
 *  bgcolor round box background color
 *  imgFormat image format,for example:png, gif, jpg etc.
 * @param callback callback function
 * @param closeCallback the callback for close image button
 */
ui.dialog.RoundTitleDialogByJSON=function(obj,callback,closeCallback){
	return $ui.dialog.RoundTitleDialog(obj.link, obj.html, obj.isModal, obj.width, obj.height, 
	       obj.title, obj.id, callback, closeCallback,obj.imgRoot,obj.corner,obj.bgcolor,obj.imgFormat);
};

/**
 * Show round dialog with title bar,close button and loading division
 * @param link dialog content source URL
 * @param html dialog content HTML
 * @param isModal modal dialog or modeless dialog?
 * @param width dialog width
 * @param height dialog height
 * @param title dialog title
 * @param id dialog id
 * @param callback callback function
 * @param closeCallback the callback for close image button
 * @param imgRoot round image root
 * @param corner round image corner setting
 * @param bgcolor round box background color
 * @param imgFormat image format,for example:png, gif, jpg etc.
 * @param titleClass title class style
 */
ui.dialog.RoundTitleCloseDialog = function(link, html, isModal, width, height, title, id, 
                    callback, closeCallback, imgRoot, corner, bgcolor,imgFormat,titleClass){
	if(isNull(titleClass))titleClass="DialogTitle";
	var title_html ="<table width='100%' cellSpacing='0' cellPadding='0'><tr>"
		           +"<td align='left' id='{ID}_Title' class='"+titleClass+"'>"+title+"</td><td>" 
				   +"<div style='float:right'><img title='Close' src='"+$ui.IMG_ROOT+"dialog/close.gif'" 
				   +" id='{ID}_Close' align='absMiddle' class='WindowClose'></div>" 
				   +"<div id='{ID}_Loading' style='float:right'></div>"
				   +"<div style='clear:both;'></div></td></tr></table>";	
    return 	$ui.dialog.RoundTitleDialog(link, html, isModal, width, height, title_html, id, 
	                    function(obj){
							var img_close=$('#'+obj.id+"_Close");
							img_close.hover(function(){
						   	   $(this).attr('src',$ui.IMG_ROOT+"dialog/close_over.gif");
						    },function(){
						   	   $(this).attr('src',$ui.IMG_ROOT+"dialog/close.gif");
						    });
							if(!isNull(callback)){callback(obj);}
						}, closeCallback, imgRoot, corner, bgcolor,imgFormat);						  	
};

/**
 * Show round dialog with title bar,close button and loading division
 * @param obj JSON object(JSON string),there are 12 properties:
 *  link dialog content source URL
 *  html dialog content HTML
 *  isModal modal dialog or modeless dialog?
 *  width dialog width
 *  height dialog height
 *  title dialog title
 *  id dialog id
 *  imgRoot round image root
 *  corner round image corner setting
 *  bgcolor round box background color
 *  imgFormat image format,for example:png, gif, jpg etc.
 *  titleClass title class style
 * @param callback callback function
 * @param closeCallback the callback for close image button
 */
ui.dialog.RoundTitleCloseDialogByJSON=function(obj,callback,closeCallback){
	return $ui.dialog.RoundTitleCloseDialog(obj.link, obj.html, obj.isModal, obj.width,  
		   obj.height,obj.title, obj.id, callback, closeCallback,obj.imgRoot,obj.corner,
		   obj.bgcolor,obj.imgFormat,obj.titleClass);
};

/**
 * Show round dialog with title bar,close button and loading division with round_box3 group pictures
 * @param link dialog content source URL
 * @param html dialog content HTML
 * @param isModal modal dialog or modeless dialog?
 * @param width dialog width
 * @param height dialog height
 * @param title dialog title
 * @param id dialog id
 * @param callback callback function
 * @param closeCallback the callback for close image button
 */
ui.dialog.RoundTitleDialog3 = function(link, html, isModal, width, height, title, id, callback, closeCallback){
	return $ui.dialog.RoundTitleCloseDialog(link, html, isModal, width, height, title, id, 
	                  callback, closeCallback,$ui.IMG_ROOT+"dialog/round_box3.gif",
	                  new ui.util.Corner(12,33,12,7),"#FFFFFF");
};

/**Show round dialog with title bar,close button and loading division with round_box3 group pictures
 * @param obj JSON object(JSON string),there are 7 properties:
 *  link dialog content source URL
 *  html dialog content HTML
 *  isModal modal dialog or modeless dialog?
 *  width dialog width
 *  height dialog height
 *  title dialog title
 *  id dialog id
 * @param callback callback function
 * @param closeCallback the callback for close image button
 */
ui.dialog.RoundTitleDialog3ByJSON = function(obj,callback,closeCallback){
	return $ui.dialog.RoundTitleDialog3(obj.link, obj.html, obj.isModal, obj.width,  
		   obj.height,obj.title, obj.id, callback, closeCallback);
};

/**
 * Show round dialog with title bar,close button and loading division with round_box4 group pictures
 * @param link dialog content source URL
 * @param html dialog content HTML
 * @param isModal modal dialog or modeless dialog?
 * @param width dialog width
 * @param height dialog height
 * @param title dialog title
 * @param id dialog id
 * @param callback callback function
 * @param closeCallback the callback for close image button
 */
ui.dialog.RoundTitleDialog4 = function(link, html, isModal, width, height, title, id, callback, closeCallback){
	return $ui.dialog.RoundTitleCloseDialog(link, html, isModal, width, height, title, id, 
	       callback, closeCallback,$ui.IMG_ROOT+"dialog/round_box4.png",
	       new ui.util.Corner(9,37,9,9,9),null,"png","RoundDialogTitle");
};

/**Show round dialog with title bar,close button and loading division with round_box4 group pictures
 * @param obj JSON object(JSON string),there are 7 properties:
 *  link dialog content source URL
 *  html dialog content HTML
 *  isModal modal dialog or modeless dialog?
 *  width dialog width
 *  height dialog height
 *  title dialog title
 *  id dialog id
 * @param callback callback function
 * @param closeCallback the callback for close image button
 */
ui.dialog.RoundTitleDialog4ByJSON = function(obj,callback,closeCallback){
	return $ui.dialog.RoundTitleDialog4(obj.link, obj.html, obj.isModal, obj.width,  
		   obj.height,obj.title, obj.id, callback, closeCallback);
};
/**
 * Show template dialog
 * @param link dialog content source URL
 * @param html dialog content HTML
 * @param isModal modal dialog or modeless dialog?
 * @param width dialog width
 * @param height dialog height
 * @param title dialog title
 * @param id dialog id
 * @param template template path
 * @param callback callback function
 * @param closeCallback the callback for close image button
 */
ui.dialog.TemplateDialog=function(link,html,isModal,width,height,title,id,template,callback,closeCallback){
	if(isNull(template)){
		template="window_dialog.htm";
	}
	var dialog=new ui.dialog.Dialog(link,html,isModal,width,height,id,
	               null,null,null,template,function(obj){
				   	   var img_close=$('#'+obj.id+"_Close");
		           	   img_close.click(function(){
							obj.close(isModal);
							//for close callback
							if(!isNull(closeCallback)){
								closeCallback(false);
		           		    }
					   })
					   if(img_close.attr('src').indexOf("dialog/close.gif")>=0){
						   img_close.hover(function(){
						   	   $(this).attr('src',$ui.IMG_ROOT+"dialog/close_over.gif");
						   },function(){
						   	   $(this).attr('src',$ui.IMG_ROOT+"dialog/close.gif");
						   });
					   }
					   if(!isNull(title)){
					   	   $('#'+obj.id+"_Title").html(title);
					   }
					   if(!isNull(callback)){
						   callback(obj);
					   }
		           },'.DialogTop');
	return dialog;
};

/**
 * Create template dialog by JSON object(JSON string)
 * @param obj JSON object(JSON string),there are 8 properties:
 * link,html,isModal,width,height,title,id,template
 * @param callback callback function
 * @param closeCallback the callback for close image button
 */
ui.dialog.TemplateDialogByJSON=function(obj,callback,closeCallback){
	if(obj!=null){
		return $ui.dialog.TemplateDialog(obj.link,obj.html,obj.isModal,obj.width,obj.height,
		                                 obj.title, obj.id, obj.template,callback,closeCallback);
	}else{
		return null;
	}
};

/**
 * Show template dialog
 * @param link dialog content source URL
 * @param isModal modal dialog or modeless dialog?
 * @param width dialog width
 * @param height dialog height
 * @param title dialog title
 * @param id dialog id
 * @param template template path
 * @param callback callback function
 */
ui.dialog.TemplateDialogByLink=function(link,isModal,width,height,title,id,template,callback){
	return $ui.dialog.TemplateDialog(link,null,isModal,width,height,title,id,template,callback);
};

/**
 * Show template dialog
 * @param html dialog content HTML
 * @param isModal modal dialog or modeless dialog?
 * @param width dialog width
 * @param height dialog height
 * @param title dialog title
 * @param id dialog id
 * @param template template path
 * @param callback callback function
 */
ui.dialog.TemplateDialogByHtml=function(html,isModal,width,height,title,id,template,callback){
	return $ui.dialog.TemplateDialog(null,html,isModal,width,height,title,id,template,callback);
};

/**
 * Round laoding dialog
 * @param text loading text
 * @param img loading image, the default image is $ui.IMG_ROOT+loading/loading8.gif
 * @param width dialog width
 * @return 
 */
ui.dialog.LoadingDialog=function(text,img,width){
	if(isNull(width))width=200;
	var html="<center>"+$ui.dialog.Loading(img,null,text)+"</center>";
	var imgRoot=$ui.IMG_ROOT + "dialog/round_box1.gif";
	return $ui.dialog.RoundDialogByJSON({html:html,isModal:true,width:width,height:30,
	                  id:$ui.dialog.LOADING_ID,imgRoot:imgRoot,bgcolor:"#FFFFFF"});
};

/**
 * Close loading dialog
 */
ui.dialog.CloseLoadingDialog=function(){
	$ui.dialog.CloseDialog($ui.dialog.LOADING_ID,true);
};

/**
 * Simulate Alert dialog
 * @param text showing text
 * @param title dialog title
 * @param width dialog width
 * @param callback callback function
 * @return 
 */
ui.dialog.Alert=function(text,title,width,callback){
	this.id='Alter_Dialog';
	var html="<div style='padding:20px 10px 30px 10px;font-size:12px'>"
	        +"<table width='100%'><tr><td width='35px'><img src='"+$ui.IMG_ROOT+"dialog/icon-info.gif' border='0'>"
   		    +"</td><td align='left'>"+text+"</td></tr>";
    if(!isNull(callback)){
    	html+="<tr><td style='padding-top:15px' colspan='2' align='center'>"
    		 +"<input id='"+this.id+"_Ok' type='button' value='Ok' style='width:60px' class='button'>"
    		 +"</td></tr>";
    }
    html+="</table></div>";
    if(isNull(title))title="Alert";
    if(isNull(width))width=300;
    var dialog=$ui.dialog.RoundTitleDialog4ByJSON({html:html,isModal:true,title:title,width:width,id:this.id},
    		function(dialog){
		    	$('#'+dialog.id+"_Ok").click(function(){
		    		dialog.close();
			    	if(!isNull(callback)){
						callback();
			    	}
			    });
	        },null);
    return dialog;
};

/**
 * Custom Confirm dialog, you could add more than 2 buttons
 * @param text showing text
 * @param title dialog title
 * @buttons buttons array, for example: pls see the above usage in Confirm
 * @param callback callback function
 * @param width dialog width
 * @param id dialog id
 * @return 
 */
ui.dialog.CustomConfirm = function(text, title, buttons, callback, width,id){
	if(buttons==null)return false;
	if(isNull(id)){
		this.id='Custom_Confirm_Dialog';
	}else{
		this.id=id;
	}
	var html="<div style='padding:20px 10px 30px 10px;font-size:12px'>"
	        +"<table width='100%'><tr><td width='35px'><img src='"+$ui.IMG_ROOT+"dialog/icon-question.gif' border='0'>"
   		    +"</td><td align='left'>"+text+"</td></tr><tr><td style='padding-top:15px' colspan='2' align='center'>";
	for(var i=0;i<buttons.length;i++){
		if(i>0){
			html+="&nbsp;&nbsp;&nbsp;&nbsp;";
		}
		html+="<input name='"+buttons[i].name+"' type='button' value=\""+buttons[i].value+"\"";
		if(!isNull(buttons[i].width)){
			html+=" style='width:"+buttons[i].width+"'";
		}
		var cssClass='button';
		if(!isNull(buttons[i].cssClass)){
			cssClass=buttons[i].cssClass;
		}
		html+=" class='"+cssClass+"'";
		html+=">";
	}		
    html+="</td></tr></table></div>";
	if(isNull(width))width=300;
	var dialog=$ui.dialog.RoundTitleDialog4ByJSON({html:html,isModal:true,title:title,width:width,
        id:this.id},function(dialog){
			if (!isNull(callback)) {
				$("input[type='button']",$('#' + dialog.id)).click(function(){
					callback($(this).attr('name'),dialog);
				});
			}
        });
    return dialog;
};

/**
 * Simulate Confirm dialog
 * @param text showing text
 * @param callback callback function
 * @param title dialog title
 * @param width dialog width
 * @return 
 */
ui.dialog.Confirm=function(text,callback,title,width){
	var buttons=[{name:'OK', value:'OK', width:'60px'},{name:'Cancel', value:'Cancel',width:'60px'}];
	if(isNull(title))title="Confirm";
	return ui.dialog.CustomConfirm(text,title,buttons,function(btnSelect,dialog){
		      dialog.close();
			  if(!isNull(callback)) {
			  	 callback(btnSelect=='OK');
			  }   
	       },width,'Confirm_Dialog');
};

/**
 * Simulate Prompt dialog
 * @param text showing text
 * @param title dialog title
 * @param width dialog width
 * @return 
 */
ui.dialog.Prompt=function(text,callback,title,width){
	this.id='Prompt_Dialog';
	var html="<div style='padding:20px 10px 30px 10px;font-size:12px'>"
	        +"<table width='100%'><tr><td width='35px'><img src='"+$ui.IMG_ROOT+"dialog/icon-question.gif' border='0'>"
   		    +"</td><td align='left'>"+text+"</td></tr><tr><td style='padding-top:5px;padding-left:38px' colspan='2'>"
   		    +"<input id='"+this.id+"_Input' type='text' style='width:90%'>"
   		    +"</td></tr><tr><td style='padding-top:15px' colspan='2' align='center'>"
   		    +"<input id='"+this.id+"_Ok' type='button' value='Ok' style='width:60px' class='button'>"
   		    +"&nbsp;&nbsp;&nbsp;&nbsp;"
   		    +"<input id='"+this.id+"_Cancel' type='button' value='Cancel' style='width:60px' class='button'>"
   		    +"</td></tr></table></div>";
    if(isNull(title))title="Prompt";
    if(isNull(width))width=300;
    var dailog=$ui.dialog.RoundTitleDialog4ByJSON({html:html,isModal:true,title:title,width:width,
        id:this.id},function(dialog){
	    $('#'+dialog.id+"_Ok").click(function(){
	    	var value=$('#'+dailog.id+"_Input").val();
	    	dailog.close();
	        callback(value);
	    });
	    $('#'+dialog.id+"_Cancel").click(function(){
	    	dailog.close();
	    });
    });
    return dailog;
};

jQuery.fn.extend({
	showLoading : function(text,img,center){
		$ui.dialog.Loading(img,$(this).attr('id'),text,center);
	},
	hideLoading :function(){
		$(this).html("");
	}
})
