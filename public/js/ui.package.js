/**                
 * **************************************************************
 * *********************  UI JavaScript Library  ****************
 * ************************************************************** 
 * API Version: 1.0
 * It's base on jQuery 1.3.2 and jQuery UI 1.7.1
 * JavaScript Library Developed By IBM P735 Team.
 * Copyright (c) 2008 - 2009 IBM P735 Team.
 * Dependence files:util.js,jquery.js
 * Thanks for Aries Zeng's help from OMC team
 */
ui = window.$ui = new function() {
    this.Version = "V1.0  Copyright (c) 2008 - 2009 IBM P735 Team.";
    this.IMG_ROOT= "/theme/css/";
};

/*For dialog package: Modal Dialog,Modeless Dialog etc.*/
ui.dialog=new function(){
	this.Desciption="It is the package for Dialog components";
	this.DEFAULT_ID='DialogWindow';
	this.DEFAULT_MASK_ID='9E45FA5E990F';
	this.LOADING_ID="Loading_Dialog";
};

/*For util package which includes some common functions*/
ui.util=new function(){
	this.Desciption="It is the package for common functions";
};

/**
 * Common function for nine grid
 * @param  imgRoot image root folder or independent corner image file
 * @param  id table id
 * @param  corner round corner setting
 * @param  width table width;
 * @param  html  the TD inner HTML
 * @param  tdId  TD id for this table
 * @param  bgcolor background color
 * @param  height table height;
 * @param  title table title HTML string
 * @param  imgFormat image format,for example:png, gif, jpg etc.
 * @param  gridNum grid numbers
 * @return 
 */
ui.util.Grid=function(imgRoot,id,corner,width,html,tdId,bgcolor,height,title,imgFormat,gridNum){
	if(isNull(imgRoot)) return "";
	if(isNull(gridNum)) gridNum=9;
	var idAttr="",tdAttr="",titleId="";
	if(!isNull(id)){
		if(isNull(tdId)){
			tdId="td_"+id;
			idAttr=" id='table_"+id+"'";
		}else{
			idAttr=" id='"+id+"'";
		}
	}
	if(!isNull(tdId)){
		tdAttr=" id='"+tdId+"'";
	}
	if(!isNull(height)){
		tdAttr+=" height='"+height+"'";
	}
	var widthAttr="";
	if(!isNull(width)){
		widthAttr=" width='"+width+"'";
	}
	//new corner with same width and height for 4 corners
	if(!isNull(corner) && (corner.constructor == String || corner.constructor == Number)){
		corner=new ui.util.Corner(corner);
	}

	html=html || "";
	var bgcolorAttr="";
	if(!isNull(bgcolor)){
		bgcolorAttr=";background-color:"+bgcolor;
	}
	
	//you could add title now in first line and second column
	var tdTitleAttr="";
	if(isNull(title)){
		title="";
	}else if(!isNull(id)){
		tdTitleAttr=" id=\"td_"+id+"_Title\"";
	}
	
	//Just support jpg,gif,png format,if isImage is false then imgRoot is a folder
	var periodIndex=imgRoot.lastIndexOf(".");
	var isImage=(periodIndex==(imgRoot.length-4));
	//get image root for top,left,right,bottom repeat,for example:
	//the corner image is images/round_box1.gif, then image root is:images/round_box1/
	if(isImage){//for independent corner image
		var imgCorner=imgRoot;//save corner image
		imgRoot=imgRoot.substring(0,periodIndex)+"/";
		if(isNull(imgFormat))imgFormat=imgCorner.substring(periodIndex+1);
		if(isNull(corner)){//background image must have a corner
			corner=new ui.util.Corner(5);
		}
	}
	if(!isImage && imgRoot.lastIndexOf("/")!=imgRoot.length-1)imgRoot+="/";
	if(isNull(imgFormat))imgFormat="gif";
	var n_width=formatNum(width);
	if(!isNull(width) && n_width!=false){
		tdAttr+=" width='"+(n_width-formatNum(corner.left_top_w)-formatNum(corner.right_top_w))+"px'";
	}
	
	var isNullCorner=isNull(corner);
	var table_str= []; 
	table_str.push("<table"+idAttr+" cellSpacing='0' cellPadding='0'"+widthAttr+">");
	if(isNullCorner){
		table_str.push("<tr>");
	}else{
		table_str.push("<tr style='height:"+corner.left_top_h+"px;'>");
	}

	if(isImage){//for independent corner image
		if(gridNum==9){
			table_str.push("<td style='background-image:url("+imgCorner+");background-repeat:no-repeat;"
					      +"background-position: 0px 0px;width:"+corner.left_top_w+"px;'></td>");
			table_str.push("<td style='background:url("+imgRoot+"top."+imgFormat+") repeat-x"+bgcolorAttr+"'"+tdTitleAttr+">"+title+"</td>");
			table_str.push("<td style='background-image:url("+imgCorner+");background-repeat:no-repeat;"
					      +"background-position: -"+corner.left_top_w+"px 0px;width:"+corner.right_top_w+"px;'></td>");
			
			table_str.push("</tr><tr>");
			table_str.push("<td style='background:url("+imgRoot+"left."+imgFormat+") repeat-y"+bgcolorAttr+"'></td>");
			table_str.push("<td"+tdAttr+" style='background:url("+imgRoot+"body."+imgFormat+") repeat"+bgcolorAttr+"' valign='middle'>"+html+"</td>");
			table_str.push("<td style='background:url("+imgRoot+"right."+imgFormat+") repeat-y"+bgcolorAttr+"'></td>");
			
			table_str.push("</tr><tr style='height:"+corner.left_bottom_h+"px;'>");
			table_str.push("<td style='background-image:url("+imgCorner+");background-repeat:no-repeat;"
					      +"background-position: 0px -"+corner.left_top_h+"px;width:"+corner.left_top_w+"px;'></td>");
			table_str.push("<td style='background-image:url("+imgRoot+"bottom."+imgFormat+");background-repeat:repeat-x"+bgcolorAttr+"'></td>");
			table_str.push("<td style='background-image:url("+imgCorner+");background-repeat:no-repeat;"
					      +"background-position: -"+corner.left_top_w+"px -"+corner.left_top_h+"px;width:"+corner.right_top_w+"px;'></td>");
		}else if(gridNum==3){
			table_str.push("<td style='background-image:url("+imgCorner+");background-repeat:no-repeat;"
				          +"background-position: 0px 0px;width:"+corner.left_top_w+"px;'></td>");
			table_str.push("<td"+tdAttr+" style='background:url("+imgRoot+"body."+imgFormat+") repeat"+bgcolorAttr+"' valign='middle'>"+html+"</td>");
			table_str.push("<td style='background-image:url("+imgCorner+");background-repeat:no-repeat;"
				          +"background-position: -"+corner.left_top_w+"px 0px;width:"+corner.right_top_w+"px;'></td>");
		}
	}else{//for image folder
		var imageName="left_up.";//picture name for gird 9
		if(gridNum==3){//picture name for gird 3
			imageName="left.";
		}
		if(isNullCorner){
			table_str.push("<td align='right'><img src='"+imgRoot+imageName+imgFormat+"'></td>");
		}else{
			table_str.push("<td width='"+corner.left_top_w+"'><img src='"+imgRoot+imageName+imgFormat+"'></td>");
		}
		
		if(gridNum==9){
			table_str.push("<td style='background:url("+imgRoot+"top."+imgFormat+") repeat-x"+bgcolorAttr+"'"+tdTitleAttr+">"+title+"</td>");
			if(isNullCorner){
				table_str.push("<td><img src='"+imgRoot+"right_up."+imgFormat+"'></td>");
			}else{
				table_str.push("<td width='"+corner.right_top_w+"'><img src='"+imgRoot+"right_up."+imgFormat+"'></td>");
			}
			
			table_str.push("</tr><tr>");
			table_str.push("<td style='background:url("+imgRoot+"left."+imgFormat+") right repeat-y"+bgcolorAttr+"'></td>");
		}
		//body picture
		table_str.push("<td"+tdAttr+" style='background:url("+imgRoot+"body."+imgFormat+") repeat"+bgcolorAttr+"' valign='middle'>"+html+"</td>");
		
		if(gridNum==9){
			table_str.push("<td style='background:url("+imgRoot+"right."+imgFormat+") repeat-y"+bgcolorAttr+"'></td>");
			
			if(isNullCorner){
				table_str.push("</tr><tr>");
			}else{
				table_str.push("</tr><tr style='height:"+corner.left_bottom_h+"px;'>");
			}
			if(isNullCorner){
				table_str.push("<td align='right'><img src='"+imgRoot+"left_down."+imgFormat+"'></td>");
			}else{
				table_str.push("<td width='"+corner.left_top_w+"'><img src='"+imgRoot+"left_down."+imgFormat+"'></td>");
			}
			table_str.push("<td style='background-image:url("+imgRoot+"bottom."+imgFormat+");background-repeat:repeat-x"+bgcolorAttr+"'></td>");
		}
		
		//picture name for gird 9
		imageName="right_down.";
		if(gridNum==3){//picture name for gird 9
			imageName="right.";
		}
		if(isNullCorner){
			table_str.push("<td><img src='"+imgRoot+imageName+imgFormat+"'></td>");
		}else{
			table_str.push("<td width='"+corner.right_top_w+"'><img src='"+imgRoot+imageName+imgFormat+"'></td>");
		}
	}
	table_str.push("</tr></table>");
	return table_str.join("");
};

/**
 * Common function for nine/three grid
 * obj JSON object parameter
 *  imgRoot image root folder or independent corner image file
 *  id table id
 *  corner round corner setting
 *  width table width;
 *  html  the TD inner HTML
 *  tdId  TD id for this table
 *  bgcolor background color
 *  height table height;
 *  title table title HTML string
 *  imgFormat image format,for example:png, gif, jpg etc.
 *  gridNum grid numbers
 */
ui.util.GridByJSON=function(obj){
	if(isNull(obj))return "";
	return $ui.util.Grid9(obj.imgRoot,(obj.id || $(this).attr('id')),obj.corner,obj.width,
	       obj.html,obj.tdId, obj.bgcolor,obj.height,obj.title,obj.imgFormat,obj.gridNum);
};

/**
 * Common function for nine grid
 * @param  imgRoot image root folder or independent corner image file
 * @param  id table id
 * @param  corner round corner setting
 * @param  width table width;
 * @param  html  the TD inner HTML
 * @param  tdId  TD id for this table
 * @param  bgcolor background color
 * @param  height table height;
 * @param  title table title HTML string
 * @param  imgFormat image format,for example:png, gif, jpg etc.
 * @return 
 */
ui.util.Grid9=function(imgRoot,id,corner,width,html,tdId,bgcolor,height,title,imgFormat){
	return $ui.util.Grid(imgRoot,id,corner,width,html,tdId,bgcolor,height,title,imgFormat,9);
};

/**
 * Common function for three grid
 * @param  imgRoot image root folder or independent corner image file
 * @param  id table id
 * @param  corner round corner setting
 * @param  width table width;
 * @param  html  the TD inner HTML
 * @param  tdId  TD id for this table
 * @param  bgcolor background color
 * @param  height table height;
 * @param  title table title HTML string
 * @param  imgFormat image format,for example:png, gif, jpg etc.
 * @return 
 */
ui.util.Grid3=function(imgRoot,id,corner,width,html,tdId,bgcolor,height,title,imgFormat){
	return $ui.util.Grid(imgRoot,id,corner,width,html,tdId,bgcolor,height,title,imgFormat,3);
};

/**
 * Corner class for Grid 9 or more
 * @param left_top_w left top width
 * @param left_top_h left top height
 * @param right_top_w right top width
 * @param left_bottom_h left bottom height
 * @param center_w center width, it is optional for more than 9 grids such as go input
 */
ui.util.Corner=function(left_top_w,left_top_h,right_top_w,left_bottom_h,center_w){
	this.left_top_w=left_top_w;
	if(!isNull(left_top_h)){
		this.left_top_h=left_top_h;
	}else{
		this.left_top_h=this.left_top_w;
	}
	if(!isNull(right_top_w)){
		this.right_top_w=right_top_w;
	}else{
		this.right_top_w=this.left_top_w;
	}
	if(!isNull(left_bottom_h)){
		this.left_bottom_h=left_bottom_h;
	}else{
		this.left_bottom_h=this.left_top_h;
	}
	if(!isNull(center_w)){
		this.center_w=center_w;
	}else{
		this.center_w=this.left_top_w;
	}
};
/**
 * Corner class for Grid 9 or more
 * @param obj JSON object(JSON string),there are 5 properties:
 *  left_top_w left top width
 *  left_top_h left top height
 *  right_top_w right top width
 *  left_bottom_h left bottom height
 *  center_w center width, it is optional for more than 9 grids such as go input
 */
ui.util.CornerByJSON=function(obj){
	return new ui.util.Corner(obj.left_top_w,obj.left_top_h,obj.right_top_w,obj.left_bottom_h,obj.center_w);
};

/**
 * get element width
 * @param object target object
 * @return 
 */
ui.util.getElementWidth=function(object) {
	if(object!=null){
		return object.offsetWidth;
	}else{
		return 0;
	}
};

/**
 * get mouse X and Y coordinate by event
 * @param e mouse event
 */
ui.util.getMouseXY=function(e){
	return new Point(e.pageX,e.pageY);
};

/*For common plug-in*/
jQuery.fn.extend({
   /**
    * Nine grid plug-in
    * obj JSON object parameter
    *  imgRoot image root folder or independent corner image file
    *  id table id
	*  corner round corner setting
	*  width table width;
	*  html  the TD inner HTML
	*  tdId  TD id for this table
	*  bgcolor background color
	*  height table height;
	*  title table title HTML string
	*  imgFormat image format,for example:png, gif, jpg etc.
    */
   grid9 : function(obj){
   	  this.each(function(i){
	   	  var box_html=$ui.util.Grid9(obj.imgRoot,(obj.id || $(this).attr('id')),obj.corner,obj.width,
	   			              obj.html,obj.tdId, obj.bgcolor,obj.height,obj.title,obj.imgFormat);
	   	  $(this).after(box_html);
	   	  $("#td_"+$(this).attr('id')).append(this);
   	  });
   }
});