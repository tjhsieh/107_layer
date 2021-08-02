function autoChildCut()
{	
	if(nowSelected=="") return;
	parentRelationship[nowSelected]=["child1"+nowSelected,"child2"+nowSelected];	
	var targetIndex = shapeLayerOrder.indexOf(nowSelected);
	var parentOriginData={
		"x":d3.select("#"+nowSelected).attr("x"),
		"y":d3.select("#"+nowSelected).attr("y"),
		"width":d3.select("#"+nowSelected).attr("width"),
		"height":d3.select("#"+nowSelected).attr("height"),
		"fill":d3.select("#"+nowSelected).attr("fill"),
		"id":nowSelected,
		"transform":d3.select("#"+nowSelected).attr("transform"),
		"stroke":d3.select("#"+nowSelected).attr("stroke"),
		"strokeWidth":d3.select("#"+nowSelected).attr("stroke-width"),
	}//先取得原圖層全部資料 準備套給兩個新圖層用

	//預設用直切 切成上下兩塊 並放入對應位置
	//先把子圖層兩個產生在直接顯示區(append)
	//並放入正確排序,更新畫面
	//父子關係列新增父層

	var tempArray = [];

	for(var eachId in shapeLayerOrder)
	{
		if(shapeLayerOrder[eachId]!=nowSelected)
		{
			tempArray.push(shapeLayerOrder[eachId]);
			document.getElementById(shapeLayerOrder[eachId]).parentNode.appendChild(document.getElementById(shapeLayerOrder[eachId]));
		}
		else
		{			
			tempArray.push("child1"+nowSelected);
			tempArray.push("child2"+nowSelected);

			var	midX;
	      	var midY;
	      	var rAngle;
			var newTransform = "";

			if(d3.select("#"+parentOriginData["id"]).attr("transform"))
			{
				midX = parentOriginData["x"]*1 + parentOriginData["width"]*0.5;
	      		midY = parentOriginData["y"]*1 + parentOriginData["height"]*0.5;
	      		rAngle = getRotateData(parentOriginData["transform"])[0];
				newTransform = setRotateData(rAngle,midX,midY);
			}

			d3.select("#basicSVG").
			    append('rect').
			    attr({
				  'x':parentOriginData["x"],
			      'y':parentOriginData["y"],
			      'width':parentOriginData["width"],
			      'height':parentOriginData["height"]/2,
			      'fill':parentOriginData["fill"],
			      'id': "child1"+parentOriginData["id"],
			      'onclick': "selectCube(this.id)",
				  'stroke-width':parentOriginData["strokeWidth"],
				  'stroke':parentOriginData["stroke"],
				  'transform':newTransform,
				});

			if(d3.select("#"+parentOriginData["id"]).attr("transform"))
			{
				midX = parentOriginData["x"]*1 + parentOriginData["width"]*0.5;
		      	midY = parentOriginData["y"]*1 + parentOriginData["height"]/2 + parentOriginData["height"]*0.5;
		      	rAngle = getRotateData(parentOriginData["transform"])[0];
				newTransform = setRotateData(rAngle,midX,midY);
			}

			d3.select("#basicSVG").
			      append('rect').
			      attr({
			      'x':parentOriginData["x"],
			      'y':parentOriginData["y"]*1+parentOriginData["height"]/2,
			      'width':parentOriginData["width"],
			      'height':parentOriginData["height"]/2,
			      'fill':parentOriginData["fill"],
			      'id':"child2"+parentOriginData["id"],
			      'onclick': "selectCube(this.id)",
				  'stroke-width':parentOriginData["strokeWidth"],
				  'stroke':parentOriginData["stroke"],
				  'transform':newTransform,
			      });
		}
	}
	shapeLayerOrder = JSON.parse(JSON.stringify(tempArray));
	

	d3.select("#"+nowSelected).remove();
	clearSelect();
	updateLayerUI();
	drawParentLayerUI(parentOriginData["id"]);
	
	//>relationship區顯示原圖層名字 點擊時察看parentRelationship中的對象並一同框起，用大框框住兩者範圍
}

function drawParentLayerUI(id)
{
	var countOfLayers=0;
	var i=0;
	for(var eachId in parentRelationship)
	{
		if(eachId==id) countOfLayers = i*1+1;
		i++;
	}
	var colorOfIcon;

	if(d3.select("#child1"+id).attr("fill")!="None") colorOfIcon = d3.select("#child1"+id).attr("fill");
	else colorOfIcon = d3.select("#"+id).attr("stroke");

	var layerName;
	if(typeof layerNameCorrespond[id]=="undefined")//無特別對應名字
	{
		layerName = id;
	}
	else
	{
		layerName = layerNameCorrespond[id];
	}

	d3.select("#relationshipSVG").append("g")
	.attr(
		{
			"id":id+"LayerUI",
			"onclick":"selectParent(\""+id+"\")",
		});
	d3.select("#"+id+"LayerUI").append("rect").
	attr(
		{
			"width":layerSet["width"],
			"height":layerSet["height"],
			"x":5,
			"y":layerSet["height"]*countOfLayers,
			"fill":layerSet["background"],
			"stroke":layerSet["stroke"],
			"stroke-width":layerSet["stroke-width"],
			"id":id+"LayerBG",
		});
	d3.select("#"+id+"LayerUI").append("text").text(layerName).
	attr(
		{
			"width":layerSet["width"],
			"height":layerSet["height"],
			"x":layerSet["iconLeftMargin"]*2+layerSet["iconSize"]*1,
			"y":layerSet["height"]*countOfLayers+layerSet["textTopMargin"]*1,
			"fill":layerSet["textColor"],
			"style":"font-size:"+layerSet["textSize"]+";",
			"id":id+"LayerName",
		});

	//rect的狀況先寫  因為現在只能切rect
	d3.select("#"+id+"LayerUI").append("rect").
	attr(
		{
			"width":layerSet["iconSize"],
			"height":layerSet["iconSize"],
			"x":layerSet["iconLeftMargin"],
			"y":layerSet["height"]*countOfLayers+layerSet["iconTopMargin"]*1,
			"fill":colorOfIcon,
			"onclick":"hideFromParent(this.id)",
			"opacity":"1",
			"id":id+"LayerIcon",				
		});

}

function drawCustomParentLayerUI(id,joinChild)
{
	var countOfLayers=0;
	var i=0;
	for(var eachId in parentRelationship)
	{
		if(eachId==id) countOfLayers = i*1+1;
		i++;
	}
	var colorOfIcon;

	if(d3.select("#"+joinChild).attr("fill")!="None") colorOfIcon = d3.select("#"+joinChild).attr("fill");
	else colorOfIcon = d3.select("#"+joinChild).attr("stroke");

	var layerName;
	if(typeof layerNameCorrespond[id]=="undefined")//無特別對應名字
	{
		layerName = id;
	}
	else
	{
		layerName = layerNameCorrespond[id];
	}

	d3.select("#relationshipSVG").append("g")
	.attr(
		{
			"id":id+"LayerUI",
			"onclick":"selectParent(\""+id+"\")",
		});
	d3.select("#"+id+"LayerUI").append("rect").
	attr(
		{
			"width":layerSet["width"],
			"height":layerSet["height"],
			"x":5,
			"y":layerSet["height"]*countOfLayers,
			"fill":layerSet["background"],
			"stroke":layerSet["stroke"],
			"stroke-width":layerSet["stroke-width"],
			"id":id+"LayerBG",
		});
	d3.select("#"+id+"LayerUI").append("text").text(layerName).
	attr(
		{
			"width":layerSet["width"],
			"height":layerSet["height"],
			"x":layerSet["iconLeftMargin"]*2+layerSet["iconSize"]*1,
			"y":layerSet["height"]*countOfLayers+layerSet["textTopMargin"]*1,
			"fill":layerSet["textColor"],
			"style":"font-size:"+layerSet["textSize"]+";",
			"id":id+"LayerName",
		});

	//rect的狀況先寫  因為現在只能切rect
	d3.select("#"+id+"LayerUI").append("rect").
	attr(
		{
			"width":layerSet["iconSize"],
			"height":layerSet["iconSize"],
			"x":layerSet["iconLeftMargin"],
			"y":layerSet["height"]*countOfLayers+layerSet["iconTopMargin"]*1,
			"fill":colorOfIcon,
			"onclick":"hideFromParent(this.id)",
			"opacity":"1",
			"id":id+"LayerIcon",				
		});

}


function selectParent(id)//點擊父子關係
{
	document.getElementById("parentWidth").value="";
	document.getElementById("parentHeight").value="";
	document.getElementById("parentX").value="";
	document.getElementById("parentY").value="";

	if(d3.select("#"+id+"LayerIcon").attr("opacity")==0.3) return;
	clearSelect();	
	var strokeX;
	var strokeY;
	var strokeHeight;
	var strokeWidth;	
	if(typeof(id)=="object")//不知道為甚麼會這樣但是先這樣解決，點圖層那邊的時候有時候是element過來
	{
		id = id.id;
	}

	var selectGroup = parentRelationship[id];

	var groupMinX = 0;
	var groupMinY = 0;
	var groupMaxX = 0;
	var groupMaxY = 0;

	var leafList = [];
	selectGroup = reLeafFromParent(leafList,id);
	for(var eachId in selectGroup)
	{		
		if(eachId==0)
		{
			groupMinX = d3.select("#"+selectGroup[eachId]).attr('x');
			groupMinY = d3.select("#"+selectGroup[eachId]).attr('y');
		}
		if(d3.select("#"+selectGroup[eachId]).attr('x')*1<groupMinX*1)
			groupMinX = d3.select("#"+selectGroup[eachId]).attr('x');
		if(d3.select("#"+selectGroup[eachId]).attr('y')*1<groupMinY*1) 
			groupMinY = d3.select("#"+selectGroup[eachId]).attr('y');
		if(d3.select("#"+selectGroup[eachId]).attr('x')*1+d3.select("#"+selectGroup[eachId]).attr('width')*1>groupMaxX*1)
			groupMaxX = d3.select("#"+selectGroup[eachId]).attr('x')*1+d3.select("#"+selectGroup[eachId]).attr('width')*1; 
		if(d3.select("#"+selectGroup[eachId]).attr('y')*1+d3.select("#"+selectGroup[eachId]).attr('height')*1>groupMaxY*1)
			groupMaxY = d3.select("#"+selectGroup[eachId]).attr('y')*1+d3.select("#"+selectGroup[eachId]).attr('height')*1;
	}
	document.getElementById("obsId").innerText = id;

	strokeX = groupMinX-10;
	strokeY = groupMinY-10;
	strokeWidth = groupMaxX - groupMinX + 20;
	strokeHeight = groupMaxY - groupMinY + 20;

	if(d3.select("#objSelectStroke")[0][0]==null)
	{
		d3.select("#basicSVG").append("rect").
	    attr({
	      'x':strokeX,
	      'y':strokeY,
	      'height':strokeHeight,
	      'width':strokeWidth,
	      'fill':"None",
	      'id': "objSelectStroke",
	      'stroke':"#AA0000",
	      'stroke-width':"5",
	      //先把變形拿掉 所以轉角度可能會框不對 'transform':d3.select("#"+id).attr("transform")
	      });
	}
	else
	{
		d3.select("#objSelectStroke").
	    attr({
	      'x':strokeX,
	      'y':strokeY,
	      'height':strokeHeight,
	      'width':strokeWidth,
	      'fill':"None",
	      'id': "objSelectStroke",
	      'stroke':"#AA0000",
	      'stroke-width':"5",
	      //同上方說明 'transform':d3.select("#"+id).attr("transform")
	      });
	}

	//if(d3.select("#"+id).attr("style")=="display:None") clearSelect();
}


function reLeafFromParent(list,parent)//遞迴並回傳所有的葉子節點
{
	if(typeof parentRelationship[parent] == 'undefined')//leaf
	{
		list.push(parent);		
	}
	else
	{
		for(eachId in parentRelationship[parent])
		{
			list = reLeafFromParent(list,parentRelationship[parent][eachId]);			
		}		
	}
	return list;
}

function createCustomParentLayer()
{
	console.log("creating");
	var targetChild = document.getElementById("customChildLayerName").value;
	var targetParent = document.getElementById("jointoParentLayerName").value;
	for(var eachId in layerNameCorrespond)//id 翻譯，使用者可以輸入id或自訂的名字
	{
		if(layerNameCorrespond[eachId]==targetChild)
		{
			targetChild = eachId;
		}
		else if(layerNameCorrespond[eachId]==targetParent)
		{
			targetParent = eachId;
		}
	}
	console.log(targetChild,targetParent);
	if(!d3.select("#"+targetChild).empty())
	{
		if(typeof parentRelationship[targetParent]=="undefined")
		{
			parentRelationship[targetParent]=[];
			parentRelationship[targetParent].push(targetChild);
			drawCustomParentLayerUI(targetParent,targetChild);
		}
		else
		{
			parentRelationship[targetParent].push(targetChild);
		}		
	}
}

function hideFromParent(id)
{
	var oriId = id.split("LayerIcon")[0];	
	var hideList =[];
	hideList = reLeafFromParent(hideList,oriId);
	var shouldHide = false;
	for(var eachId in hideList)
	{
		if(d3.select("#"+hideList[eachId]+"LayerIcon").attr("opacity")==1)
		{
			shouldHide=true;			
			break;
		}	
	}

	if(shouldHide)
	{
		for(var eachId in hideList)
		{
			d3.select("#"+hideList[eachId]+"LayerIcon").attr("opacity",0.3);
			d3.select("#"+hideList[eachId]).attr("style","display:None");			
		}
		d3.select("#"+id).attr("opacity",0.3);
	}
	else
	{
		for(var eachId in hideList)
		{
			d3.select("#"+hideList[eachId]+"LayerIcon").attr("opacity",1);
			d3.select("#"+hideList[eachId]).attr("style","display:true");
		}
		d3.select("#"+id).attr("opacity",1);
	}
	clearSelect();
}

function parentDataApply()
{
	if(typeof parentRelationship[document.getElementById("obsId").innerText] != 'undefined')
	{
		var parentData=
		{
			"widthX":document.getElementById("parentWidth").value,
			"heightX":document.getElementById("parentHeight").value,
			"xDis":document.getElementById("parentX").value,
			"yDis":document.getElementById("parentY").value,
			"fill":document.getElementById("parentFill").value,
		}
		var childList =[];
		childList = reLeafFromParent(childList,document.getElementById("obsId").innerText);
		for(var eachId in childList)
		{
			var childWidth = d3.select("#"+childList[eachId]).attr("width");
			var childHeight = d3.select("#"+childList[eachId]).attr("height");
			var childX = d3.select("#"+childList[eachId]).attr("x");
			var childY = d3.select("#"+childList[eachId]).attr("y");
			if(document.getElementById(childList[eachId]).tagName=="rect")
			{
				if(parentData["widthX"]!="" ) d3.select("#"+childList[eachId]).attr("width",childWidth*parentData["widthX"]);
				if(parentData["heightX"]!="" ) d3.select("#"+childList[eachId]).attr("height",childHeight*parentData["heightX"]);
				if(parentData["xDis"]!="" ) d3.select("#"+childList[eachId]).attr("x",childX*1+parentData["xDis"]*1);
				if(parentData["yDis"]!="" ) d3.select("#"+childList[eachId]).attr("y",childY*1+parentData["yDis"]*1);
				d3.select("#"+childList[eachId]).attr("fill",parentData["fill"]);
			}			
		}
	}
	selectParent(document.getElementById("obsId").innerText);
}