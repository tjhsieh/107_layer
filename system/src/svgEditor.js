var nowShape = "rect";
var nowSelected = "";
var dragStartX = "";
var dragStartY = "";
var dragEndX;
var dragEndY;
var customMap = {};
var innerObstacleSet;
var oldMapData;
var dragMoveHover = false;
var parentSelectTarget = "";
var parentSelectTargetGroup = "";

function switchMode(id)//切換模式
{
	if(id=="paintModeCheck") document.getElementById("dragModeCheck").checked=false;
	if(id=="dragModeCheck") document.getElementById("paintModeCheck").checked=false;
	clearSelect();
}

function pathDisplace()
{
	var dOfPath = d3.select("#"+nowSelected).attr("d")
	var pointsArray = getPointsFromD(dOfPath);
	for(var i in pointsArray)
	{
		pointsArray[i][0] = pointsArray[i][0]*1 + document.getElementById("displaceXValue").value*1;
		pointsArray[i][1] = pointsArray[i][1]*1 + document.getElementById("displaceYValue").value*1;
	}

	var newPathD = "M ";
	for(var point in pointsArray)
	{
		if(point != pointsArray.length-1)
		 newPathD = newPathD + pointsArray[point][0] + "," + pointsArray[point][1] + " L ";
		else
		{
		 newPathD = newPathD + pointsArray[point][0] + "," + pointsArray[point][1] + " L "
		 + pointsArray[0][0] + "," + pointsArray[0][1];
		}
	}
	d3.select("#"+nowSelected).attr("d",newPathD);
	selectCube(nowSelected);
}

function transferToPath(transferTarget)
{
	if(transferTarget=="") return;
	var selectTagName = document.getElementById(transferTarget).tagName;
	if(selectTagName== "rect")
	{
		var originOuter;
		
		var oriX = d3.select("#"+transferTarget).attr("x");
		var oriY = d3.select("#"+transferTarget).attr("y");
		var oriWidth = d3.select("#"+transferTarget).attr("width");
		var oriHeight = d3.select("#"+transferTarget).attr("height");
		var verticalInPath = [oriX,oriY,oriX*1+oriWidth*1,oriY,oriX,oriY*1+oriHeight*1,oriX*1+oriWidth*1,oriY*1+oriHeight*1];
		var pathOuterHTML;
		if(d3.select("#"+transferTarget).attr("transform")==null)
		{
			originOuter = document.getElementById(transferTarget).outerHTML;
			originOuter = getDataInOriginRect(originOuter);
			pathOuterHTML = "<path d=\"M " +verticalInPath[0]+","+verticalInPath[1]+
			" L "+ verticalInPath[2] + ","+ verticalInPath[3] +
			" L "+ verticalInPath[6] + ","+ verticalInPath[7] +
			" L "+ verticalInPath[4] + ","+ verticalInPath[5] +
			" L "+ verticalInPath[0] + ","+ verticalInPath[1] + " \"" +
			originOuter;
		}
		else
		{
			var rotateData = getRotateData(d3.select("#"+transferTarget).attr("transform"));
			var rotateAngle = rotateData[0];
			var rotateMidX = rotateData[1];
			var rotateMidY = rotateData[2];
			var rotateRadian = -(Math.PI / 180 * rotateAngle);
			var tempVerticalInPath = JSON.parse(JSON.stringify(verticalInPath));
			for(var i=0;i<verticalInPath.length;i++)
			{
				if(i%2==0)//偶數為x
				{
					verticalInPath[i]=(tempVerticalInPath[i]-rotateMidX)*Math.cos(rotateRadian)+(tempVerticalInPath[i*1+1]-rotateMidY)*Math.sin(rotateRadian)+rotateMidX*1;					
				}
				else//奇數為y
				{
					verticalInPath[i]=-(tempVerticalInPath[i-1]-rotateMidX)*Math.sin(rotateRadian)+(tempVerticalInPath[i]-rotateMidY)*Math.cos(rotateRadian)+rotateMidY*1;
				}
			}
			d3.select("#"+transferTarget).attr("transform",null);
			originOuter = document.getElementById(transferTarget).outerHTML;
			originOuter = getDataInOriginRect(originOuter);
			pathOuterHTML = "<path d=\"M " +verticalInPath[0]+","+verticalInPath[1]+
			" L "+ verticalInPath[2] + ","+ verticalInPath[3] +
			" L "+ verticalInPath[6] + ","+ verticalInPath[7] +
			" L "+ verticalInPath[4] + ","+ verticalInPath[5] +
			" L "+ verticalInPath[0] + ","+ verticalInPath[1] + " \"" +
			originOuter;
		}
		document.getElementById(transferTarget).outerHTML = pathOuterHTML;
	}
	else if(selectTagName== "ellipse")
	{
		var originOuter = document.getElementById(transferTarget).outerHTML;
		originOuter = getDataInOriginRect(originOuter);
		var oriCX = d3.select("#"+transferTarget).attr("cx");
		var oriCY = d3.select("#"+transferTarget).attr("cy");
		var oriRX = d3.select("#"+transferTarget).attr("rx");
		var oriRY = d3.select("#"+transferTarget).attr("ry");
		var pathOuterHTML = "<path d=\"M " + oriCX + "," + (oriCY*1-oriRY*1) +
		" a " + oriRX + "," + oriRY +
		" 0 1,0 1,0\""+	originOuter;
		document.getElementById(transferTarget).outerHTML = pathOuterHTML;
	}
}

function getPathTransferPoints(transferTarget)
{
	if(transferTarget=="") return;
	var selectTagName = document.getElementById(transferTarget).tagName;
	if(selectTagName== "rect")
	{
		var originOuter = document.getElementById(transferTarget).outerHTML;
		originOuter = getDataInOriginRect(originOuter);
		var oriX = d3.select("#"+transferTarget).attr("x");
		var oriY = d3.select("#"+transferTarget).attr("y");
		var oriWidth = d3.select("#"+transferTarget).attr("width");
		var oriHeight = d3.select("#"+transferTarget).attr("height");
		var verticalInPath = [oriX,oriY,oriX*1+oriWidth*1,oriY,oriX,oriY*1+oriHeight*1,oriX*1+oriWidth*1,oriY*1+oriHeight*1];
		var pathOuterHTML = "M " +verticalInPath[0]+","+verticalInPath[1]+
		" L "+ verticalInPath[2] + ","+ verticalInPath[3] +
		" L "+ verticalInPath[6] + ","+ verticalInPath[7] +
		" L "+ verticalInPath[4] + ","+ verticalInPath[5] +
		" L "+ verticalInPath[0] + ","+ verticalInPath[1] + " \"";
	}
	else if(selectTagName== "ellipse")
	{
		var originOuter = document.getElementById(transferTarget).outerHTML;
		originOuter = getDataInOriginRect(originOuter);
		var oriCX = d3.select("#"+transferTarget).attr("cx");
		var oriCY = d3.select("#"+transferTarget).attr("cy");
		var oriRX = d3.select("#"+transferTarget).attr("rx");
		var oriRY = d3.select("#"+transferTarget).attr("ry");
		var pathOuterHTML = "M " + oriCX + "," + (oriCY*1-oriRY*1) +
		" a " + oriRX + "," + oriRY +
		" 0 1,0 1,0\"";
		pathOuterHTML = "Ellipse_"+transferTarget;
	}
	return pathOuterHTML;
}

function selectShape(id)//選擇要產生的圖形
{
	var selectTagName = document.getElementById(id).tagName;
	if(selectTagName== "rect")
	{
		d3.select("#selectStrokeForCube").attr("x",d3.select("#"+id).attr("x")-10)
									 .attr("y",d3.select("#"+id).attr("y")-10);									 
	}
	else if(selectTagName== "ellipse")
	{
		d3.select("#selectStrokeForCube").attr("x",d3.select("#"+id).attr("cx")-40)
									 .attr("y",d3.select("#"+id).attr("cy")-40);
	}
	else if(selectTagName== "path")
	{
		d3.select("#selectStrokeForCube").attr("x",180)
									 .attr("y",10);
	}

	nowShape = id.split("CreateIcon")[0];
}

function clearSelect()//重製畫布中的選取狀態
{
	nowSelected = "";
	d3.select("#objSelectStroke").remove();
	document.getElementById("obsId").innerText="";
	document.getElementById("obsName").value="";
	document.getElementById("obsWidth").value="";
	document.getElementById("obsHeight").value="";
	document.getElementById("obsX").value="";
	document.getElementById("obsY").value="";
	document.getElementById("obsStrokeWidth").value="";
}

function selectCube(id)//點擊畫布中的對象，應該要區分點到的是什麼圖形
{
	clearSelect();	
	var strokeX;
	var strokeY;
	var strokeHeight;
	var strokeWidth;	
	if(typeof(id)=="object")//不知道為甚麼會這樣但是先這樣解決，點圖層那邊的時候有時候是element過來
	{
		id = id.id;
	} 
	nowSelected = id;
	if(typeof layerNameCorrespond[id] == "undefined")
	{
		document.getElementById("obsName").value = "";
	}
	else
	{
		document.getElementById("obsName").value = layerNameCorrespond[id];
	}
	if(document.getElementById(id).tagName=="rect")
	{
		document.getElementById("obsId").innerText=id;
		document.getElementById("obsWidth").value=d3.select("#"+id).attr("width");
		document.getElementById("obsHeight").value=d3.select("#"+id).attr("height");
		document.getElementById("obsX").value=d3.select("#"+id).attr("x");
		document.getElementById("obsY").value=d3.select("#"+id).attr("y");
		document.getElementById("obsColor").value=d3.select("#"+id).attr("fill");
		if(d3.select("#"+id).attr("stroke")) document.getElementById("obsStrokeColor").value=d3.select("#"+id).attr("stroke");
		if(d3.select("#"+id).attr("stroke-width")) document.getElementById("obsStrokeWidth").value=d3.select("#"+id).attr("stroke-width");

		if(d3.select("#"+id).attr("transform"))
		{
			document.getElementById("obsRotate").value = getRotateData(d3.select("#"+id).attr("transform"))[0];
		}
		else
		{
			document.getElementById("obsRotate").value = 0;
		}		

		strokeX = d3.select("#"+id).attr("x")-10;
		strokeY = d3.select("#"+id).attr("y")-10;
		strokeHeight = Number(d3.select("#"+id).attr("height"))+20;
		strokeWidth = Number(d3.select("#"+id).attr("width"))+20;
	}	
	else if(document.getElementById(id).tagName=="ellipse")
	{
		document.getElementById("obsId").innerText=id;
		document.getElementById("obsWidth").value=d3.select("#"+id).attr("rx");
		document.getElementById("obsHeight").value=d3.select("#"+id).attr("ry");
		document.getElementById("obsX").value=d3.select("#"+id).attr("cx");
		document.getElementById("obsY").value=d3.select("#"+id).attr("cy");
		document.getElementById("obsColor").value=d3.select("#"+id).attr("fill");
		if(d3.select("#"+id).attr("stroke")) document.getElementById("obsStrokeColor").value=d3.select("#"+id).attr("stroke");
		if(d3.select("#"+id).attr("stroke-width")) document.getElementById("obsStrokeWidth").value=d3.select("#"+id).attr("stroke-width");

		if(d3.select("#"+id).attr("transform"))
		{
			document.getElementById("obsRotate").value = getRotateData(d3.select("#"+id).attr("transform"))[0];
		}
		else
		{
			document.getElementById("obsRotate").value = 0;
		}

		strokeX = d3.select("#"+id).attr("cx")-d3.select("#"+id).attr("rx")-10;
		strokeY = d3.select("#"+id).attr("cy")-d3.select("#"+id).attr("ry")-10;
		strokeHeight = Number(d3.select("#"+id).attr("ry"))*2+20;
		strokeWidth = Number(d3.select("#"+id).attr("rx"))*2+20;
	}
	else if(document.getElementById(id).tagName=="path")
	{
		document.getElementById("obsId").innerText=id;
		document.getElementById("obsColor").value=d3.select("#"+id).attr("fill");
		document.getElementById("obsStrokeColor").value=d3.select("#"+id).attr("stroke");
		if(d3.select("#"+id).attr("stroke")) document.getElementById("obsStrokeColor").value=d3.select("#"+id).attr("stroke");
		if(d3.select("#"+id).attr("stroke-width")) document.getElementById("obsStrokeWidth").value=d3.select("#"+id).attr("stroke-width");

		//別用一樣的處理方式，你會後悔：改開發點選取調整點的方式，rect也應該要有
		var leftValue;
		var rightValue;
		var topValue;
		var downValue;
		var pointSet;
		var firstTime = true;
		var dOfPath = d3.select("#"+id).attr("d");
		var pointsArray = getPointsFromD(dOfPath);
		document.getElementById("vertexsCons").value = pointsArray.length;
		for(var point in pointsArray)
		{
			if(firstTime)
			{
				leftValue = pointsArray[point][0];
				rightValue = pointsArray[point][0];
				topValue = pointsArray[point][1];
				downValue = pointsArray[point][1];
				firstTime = false;
				document.getElementById("consVextexsDiv").innerHTML = "";
			}
			else
			{
				if(Number(pointsArray[point][0])<Number(leftValue)) leftValue = pointsArray[point][0];
				if(Number(pointsArray[point][0])>Number(rightValue)) rightValue = pointsArray[point][0];
				if(Number(pointsArray[point][1])<Number(topValue)) topValue = pointsArray[point][1];
				if(Number(pointsArray[point][1])>Number(downValue)) downValue = pointsArray[point][1];
			}	

			
			d3.select("#consVextexsDiv").append("text").text("x"+(point*1+1)+":");
			d3.select("#consVextexsDiv").append("input").attr({
				"size":5,
				"id":"vx"+(point*1+1),
				"style":"margin-right:5px",
			});
			document.getElementById("vx"+(point*1+1)).value = pointsArray[point][0];
			d3.select("#consVextexsDiv").append("text").text("y"+(point*1+1)+":");
			d3.select("#consVextexsDiv").append("input").attr({
				"size":5,
				"id":"vy"+(point*1+1),
				"style":"margin-right:5px",
			});
			document.getElementById("vy"+(point*1+1)).value = pointsArray[point][1];
		}
		strokeX = leftValue-10;
		strokeWidth = (rightValue - leftValue)*1 + 20 ;
		strokeY = topValue-10;
		strokeHeight = (downValue - topValue)*1 + 20 ;
	}

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
	      'transform':d3.select("#"+id).attr("transform"),
	      'stroke-dasharray':"10",
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
	      'transform':d3.select("#"+id).attr("transform"),
	      'stroke-dasharray':"10",
	      });
	}

	if(d3.select("#"+id).attr("style")=="display:None") clearSelect();
}

function removeCube()//移除圖形，不用區分形狀
{
	var id = document.getElementById("obsId").innerText;
	deleteLayer();
	nowSelected = "";
	d3.select("#"+id).remove();
	d3.select("#objSelectStroke").remove();
}

function clearFill()
{
	d3.select("#"+document.getElementById("obsId").innerText).attr("fill","None");
	d3.select("#"+document.getElementById("obsId").innerText+"LayerIcon").attr("fill",document.getElementById("obsStrokeColor").value);
}

function applyShapeData()//透過輸入讓圖形在畫布中調整位置大小
{
	var id = document.getElementById("obsId").innerText;
	var midX;
	var midY;
	var nameLayer;
	if(document.getElementById("obsName").value!="")
	{
		layerNameCorrespond[id] = document.getElementById("obsName").value;
		d3.select("#"+nowSelected).attr("name",document.getElementById("obsName").value);
	}

	if(typeof parentRelationship[id] == 'undefined')
	{
		//do sth to apply content to combine shape
	}
	if(document.getElementById(id).tagName=="rect")
	{
		midX = document.getElementById("obsX").value*1+document.getElementById("obsWidth").value/2;
	    midY = document.getElementById("obsY").value*1+document.getElementById("obsHeight").value/2;
		d3.select("#"+id).attr(
		{
			"width":document.getElementById("obsWidth").value,
			"height":document.getElementById("obsHeight").value,
			"x":document.getElementById("obsX").value,
			"y":document.getElementById("obsY").value,
			"fill":document.getElementById("obsColor").value,
			"stroke":document.getElementById("obsStrokeColor").value,
			"stroke-width":document.getElementById("obsStrokeWidth").value,
			"transform":"rotate("+document.getElementById("obsRotate").value+","+midX+","+midY+")",
		});
		dynaicAdjust(nowSelected);
	}
	else if(document.getElementById(id).tagName=="ellipse")
	{
		d3.select("#"+id).attr(
		{
			"rx":document.getElementById("obsWidth").value,
			"ry":document.getElementById("obsHeight").value,
			"cx":document.getElementById("obsX").value,
			"cy":document.getElementById("obsY").value,
			"fill":document.getElementById("obsColor").value,
			"stroke":document.getElementById("obsStrokeColor").value,
			"stroke-width":document.getElementById("obsStrokeWidth").value,
			"transform":"rotate("+document.getElementById("obsRotate").value+","+document.getElementById("obsX").value+","+document.getElementById("obsY").value+")",
		});
	}
	else if(document.getElementById(id).tagName=="path")
	{
		var consVertexs = document.getElementById("vertexsCons").value;
		var pathD = "M ";	
		for(var i=1 ; i<=consVertexs;i++)
		{
			if(i!=1) pathD = pathD+"L ";
			pathD = pathD + document.getElementById("vx"+i).value + "," + document.getElementById("vy"+i).value+" ";
		}
		pathD = pathD + "L " + document.getElementById("vx1").value + "," + document.getElementById("vy1").value+" ";
		
		d3.select("#"+id).attr(
		{
			"d":pathD,
			"fill":document.getElementById("obsColor").value,
			"stroke":document.getElementById("obsStrokeColor").value,
			"stroke-width":document.getElementById("obsStrokeWidth").value,
			//沒處理rotate
		});
		dynaicAdjust(nowSelected);
	}

	//d3.select("#"+id+"LayerIcon").attr("fill",document.getElementById("obsColor").value);
	updateLayerUI();
	selectCube(id);
}
function resetCanvas()//原reset視圖功能，寫放大功能能用到
{
	document.getElementById("canvasULX").innerText=0;
    document.getElementById("canvasULY").innerText=0;
	d3.select("#basicSVG").attr("viewBox","0,0,500,500");
    d3.select("#basicSVGBG").attr("x",0).attr("y",0);
}

function copyLayer()
{
	if(nowSelected!="")
	{
		var inner = document.getElementById(nowSelected).innerHTML;
		var tagName = d3.select("#"+nowSelected).node().tagName;
		var obsCount = 1;
		while(alreadyUsedName("obs"+obsCount))
        {
        	obsCount++;
        }
		var result = d3.select("#basicSVG").node().appendChild(d3.select("#"+nowSelected).node().cloneNode(true));
		result.id = "obs" + obsCount;
		newLayer(result.id);
		clearSelect();
	}
}

function consInputGenerate()
{
	document.getElementById("consVextexsDiv").innerHTML = "";
	var consVertexs = document.getElementById("vertexsCons").value;
	if(consVertexs<3)
	{
		consVertexs = 3;
		document.getElementById("vertexsCons").value = consVertexs;
	}
	for(var i=0;i<consVertexs;i++)
	{
		d3.select("#consVextexsDiv").append("text").text("x"+(i+1)+":");
		d3.select("#consVextexsDiv").append("input").attr({
			"size":5,
			"id":"vx"+(i+1),
			"style":"margin-right:5px",
		});
		d3.select("#consVextexsDiv").append("text").text("y"+(i+1)+":");
		d3.select("#consVextexsDiv").append("input").attr({
			"size":5,
			"id":"vy"+(i+1),
			"style":"margin-right:5px",
		});
	}
}

function consShape()
{
	var consVertexs = document.getElementById("vertexsCons").value;
	var pathD = "M ";
	var obsCount = 1;
	while(alreadyUsedName("obs"+obsCount))
    {
    	obsCount++;
    }
	var shapeId = "obs" + obsCount;		
	for(var i=1 ; i<=consVertexs;i++)
	{
		if(i!=1) pathD = pathD+"L ";
		pathD = pathD + document.getElementById("vx"+i).value + "," + document.getElementById("vy"+i).value+" ";
	}
	pathD = pathD + "L " + document.getElementById("vx1").value + "," + document.getElementById("vy1").value+" ";
	d3.select("#basicSVG").append("path").attr({
		"d":pathD,
		"stroke":"#000000",
		"stroke-width":5,
		"fill":"#FFFFFF",
		"id":shapeId,
		'onclick': "selectCube(this.id)",
		//"fill":"#FFD700",
	});
	newLayer(shapeId);
}

function applyCanvas()
{
	d3.select("#basicSVG").attr({
		"width":document.getElementById("canvasWidthValue").value,
		"height":document.getElementById("canvasHeightValue").value,
	});
	d3.select("#basicSVGBG").attr({
		"width":document.getElementById("canvasWidthValue").value,
		"height":document.getElementById("canvasHeightValue").value,
	});
}

//拖曳行為對應監聽，取得座標與作對應操作
var dragCreate = d3.behavior.drag()  
    .on('dragstart', function() {
    	dragStartX="";
    	dragStartY="";
    	parentSelectTarget = "";
    	parentSelectTargetGroup = "";
    	dragMoveHover = false;
    })
    .on('drag', function() { 
   	  if(dragStartX==""&&dragStartY=="")
   	  {
   	  	var dim = document.getElementById("basicSVG").getBoundingClientRect();
   	  	dragStartX = d3.event.sourceEvent.clientX - dim.left//d3.event.sourceEvent.offsetX;
   	  	dragStartY = d3.event.sourceEvent.clientY - dim.top//d3.event.sourceEvent.offsetY;
   	  	if(document.getElementById("obsId").innerText)
   	  	if(d3.select("#"+document.getElementById("obsId").innerText))
   	  	if(typeof parentRelationship[document.getElementById("obsId").innerText] == 'undefined')
   	  	{
   	  		var targetId = document.getElementById("obsId").innerText;
   	  		var DAExist;
   	  		if(typeof d3.select('#DA'+ targetId) == 'undefined') DAExist = false;
   	  		else DAExist = true;
   	  		if($('#'+ targetId).is(":hover")) dragMoveHover = true;
   	  		else if(DAExist)
   	  		{
   	  			if($('#DA'+ targetId).is(":hover")) dragMoveHover = true;
   	  		}
   	  	}
   	  	else//父狀態拖曳
  		{
  			var leafList = [];
  			leafList = reLeafFromParent(leafList,document.getElementById("obsId").innerText);
  			for(var eachId in leafList)
  			{
  				if($('#'+leafList[eachId]).is(":hover")) 
  				{
  					dragMoveHover = true;
  					parentSelectTarget = parentRelationship[document.getElementById("obsId").innerText][eachId];
  					parentSelectTargetGroup = parentRelationship[document.getElementById("obsId").innerText];
  				}	
  			}
  			
  		}
   	  }
   	  else
   	  {
   	  	var dim = document.getElementById("basicSVG").getBoundingClientRect();
   	  	dragEndX = d3.event.sourceEvent.clientX - dim.left//d3.event.sourceEvent.offsetX;
   	  	dragEndY = d3.event.sourceEvent.clientY - dim.top//d3.event.sourceEvent.offsetY;
   	  	if(document.getElementById("dragModeCheck").checked)//拖曳移動模式
	      {
	      	if($.isNumeric(dragEndX)&&$.isNumeric(dragEndY))
	      	{
	      		if(document.getElementById("obsId").innerText)//防止第一次是空的時候跳錯誤
	      		{
	      			//第一下點擊在形狀範圍內才移動
	      			if( dragMoveHover )
		      		{   		
	      				//內部點擊相對位置 來決定 拖曳後的相對位置
	      				var innerX;
				      	var innerY;
				      	var movedX;
				      	var movedY;

				      	if(parentSelectTargetGroup==""&&document.getElementById(document.getElementById("obsId").innerText).tagName=="rect")
				      	{
				      		innerX = dragStartX - d3.select("#"+document.getElementById("obsId").innerText).attr('x');
				      		innerY = dragStartY - d3.select("#"+document.getElementById("obsId").innerText).attr('y');
				      		movedX = dragEndX;
				      		movedY = dragEndY;

				      		movedX = movedX - Math.abs(innerX);
					      	movedY = movedY - Math.abs(innerY);

					      	d3.select("#"+document.getElementById("obsId").innerText).
								      attr({
								      'x':movedX,
								      'y':movedY,
								      });

							if(d3.select("#"+document.getElementById("obsId").innerText).attr("transform"))//旋轉中心校正
					      	{
					      		var midX = movedX*1 + d3.select("#"+document.getElementById("obsId").innerText).attr("width")*0.5;
						      	var midY = movedY*1 + d3.select("#"+document.getElementById("obsId").innerText).attr("height")*0.5;
						      	var rAngle = getRotateData(d3.select("#"+document.getElementById("obsId").innerText).attr("transform"))[0];
								var newTransform = setRotateData(rAngle,midX,midY);
						      	d3.select("#"+document.getElementById("obsId").innerText).attr("transform",newTransform)
					      	}
					      	dynaicAdjust(document.getElementById("obsId").innerText);
				      	}
				      	else if(parentSelectTargetGroup==""&&document.getElementById(document.getElementById("obsId").innerText).tagName=="ellipse")
				      	{
				      		innerX = dragStartX - d3.select("#"+document.getElementById("obsId").innerText).attr('cx') - d3.select("#"+document.getElementById("obsId").innerText).attr('rx');
				      		innerY = dragStartY - d3.select("#"+document.getElementById("obsId").innerText).attr('cy') - d3.select("#"+document.getElementById("obsId").innerText).attr('ry');
				      		movedX = dragEndX//- dim.left;
				      		movedY = dragEndY//- dim.top;

					      	movedX = d3.select("#"+document.getElementById("obsId").innerText).attr('cx')*1 + dragEndX*1 - dragStartX;
					      	movedY = d3.select("#"+document.getElementById("obsId").innerText).attr('cy')*1 + dragEndY*1 - dragStartY;
					      	d3.select("#"+document.getElementById("obsId").innerText).
								      attr({
								      'cx':movedX,
								      'cy':movedY,
								      });

							if(d3.select("#"+document.getElementById("obsId").innerText).attr("transform"))//旋轉中心校正
					      	{
					      		var midX = movedX*1 + d3.select("#"+document.getElementById("obsId").innerText).attr("rx")*1;
						      	var midY = movedY*1 + d3.select("#"+document.getElementById("obsId").innerText).attr("ry")*1;
						      	var rAngle = getRotateData(d3.select("#"+document.getElementById("obsId").innerText).attr("transform"))[0];
								var newTransform = setRotateData(rAngle,midX,midY);
						      	d3.select("#"+document.getElementById("obsId").innerText).attr("transform",newTransform)
					      	}
				      	}
				      	if(parentSelectTargetGroup==""&&document.getElementById(document.getElementById("obsId").innerText).tagName=="path")
				      	{
				      		var dOfPath = d3.select("#"+document.getElementById("obsId").innerText).attr("d");
							var pointsArray = getPointsFromD(dOfPath);
							for(var point in pointsArray)
							{
								pointsArray[point][0]= dragEndX - dragStartX + pointsArray[point][0]*1;
								pointsArray[point][1]= dragEndY - dragStartY + pointsArray[point][1]*1;
							}						

							var newPathD = "M ";
							for(var point in pointsArray)
							{
								if(point != pointsArray.length-1)
								 newPathD = newPathD + pointsArray[point][0] + "," + pointsArray[point][1] + " L ";
								else
								{
								 newPathD = newPathD + pointsArray[point][0] + "," + pointsArray[point][1] + " L "
								 + pointsArray[0][0] + "," + pointsArray[0][1];
								}
							}
							d3.select("#"+document.getElementById("obsId").innerText).attr("d",newPathD);
							dynaicAdjust(document.getElementById("obsId").innerText);
				      	}
				      	else if(parentSelectTargetGroup!="")//拖曳父圖層對象
				      	{   		
				      		var leafList = [];
				      		leafList = reLeafFromParent(leafList,document.getElementById("obsId").innerText);
				      		for(var eachChild in leafList)
					      	{
					      		movedX = dragEndX - dragStartX;
					      		movedY = dragEndY - dragStartY;
					      		movedX = d3.select("#"+leafList[eachChild]).attr('x')*1 + movedX*1;
					      		movedY = d3.select("#"+leafList[eachChild]).attr('y')*1 + movedY*1;

						      	d3.select("#"+leafList[eachChild]).
								      attr({
								      'x':movedX,
								      'y':movedY,
								      });

								if(d3.select("#"+leafList[eachChild]).attr("transform"))//旋轉中心校正
						      	{
						      		var midX = movedX*1 + d3.select("#"+leafList[eachChild]).attr("width")*0.5;
							      	var midY = movedY*1 + d3.select("#"+leafList[eachChild]).attr("height")*0.5;
							      	var rAngle = getRotateData(d3.select("#"+leafList[eachChild]).attr("transform"))[0];
									var newTransform = setRotateData(rAngle,midX,midY);
							      	d3.select("#"+leafList[eachChild]).attr("transform",newTransform);
						      	}
					      	}						
				      	}
						if(parentSelectTargetGroup=="") selectCube(document.getElementById("obsId").innerText);			
						else selectParent(document.getElementById("obsId").innerText);
						dragStartX="";
    					dragStartY="";
		      		}
	      		}      			      	
			}
	      } 
   	  }
    })
    .on('dragend', function() {
      var width = Math.abs(dragEndX-dragStartX);
      var height = Math.abs(dragEndY-dragStartY);
      var dim = document.getElementById("basicSVG").getBoundingClientRect();
      var x = dragStartX<dragEndX? dragStartX:dragEndX;
      var y = dragStartY<dragEndY? dragStartY:dragEndY;

      var obsCount = document.getElementById("basicSVG").childElementCount;
      while(alreadyUsedName("obs"+obsCount))
      {
      	obsCount++;
      }
      if(document.getElementById("paintModeCheck").checked)//拖曳繪製模式
      {
      	if(nowShape=="rect")
      	{
      		d3.select("#basicSVG").append("rect").
		      attr({
		      'x':x,
		      'y':y,
		      'height':height,
		      'width':width,
		      'fill':document.getElementById("obsColor").value,
		      'id': "obs"+obsCount,
		      'onclick': "selectCube(this.id)",
		      'stroke-width':0,
		      });
      	}
      	else if(nowShape=="ellipse")
      	{
      		width = width/2;
      		height = height/2;
      		d3.select("#basicSVG").append("ellipse").
		      attr({
		      'cx':x+width*1,
		      'cy':y+height*1,
		      'ry':height,
		      'rx':width,
		      'fill':document.getElementById("obsColor").value,
		      'id': "obs"+obsCount,
		      'onclick': "selectCube(this.id)",
		      'stroke-width':0,
		      });
      	}
      	else if(nowShape=="path")
      	{
      		d3.select("#basicSVG").append("path").
		      attr({
		      'd':"M "+dragStartX+","+dragStartY+" L "+dragEndX+","+dragEndY,
		      'stroke':document.getElementById("obsStrokeColor").value,
		      'stroke-width':5,
		      'id': "obs"+obsCount,
		      'onclick': "selectCube(this.id)",
		      'stroke-width':0,
		      });
      	}
      	else if(nowShape=="pentagon")
      	{
      		var edgeLength;
      		if(dragEndX-dragStartX>=dragEndY-dragStartY) edgeLength = (dragEndX-dragStartX)/2;
      		else edgeLength = (dragEndY-dragStartY)/2;
      		d3.select("#basicSVG").append("path").
		      attr({
		      'd':"M "+(dragStartX*1+edgeLength*0.81)+","+dragStartY+
		      	  " L "+dragStartX+","+(dragStartY*1+edgeLength*0.59)+
		      	  " L "+(dragStartX*1+edgeLength*0.31)+","+(dragStartY*1+edgeLength*1.54)+
		      	  " L "+(dragStartX*1+edgeLength*1.31)+","+(dragStartY*1+edgeLength*1.54)+
		      	  " L "+(dragStartX*1+edgeLength*1.62)+","+(dragStartY*1+edgeLength*0.59)+
		      	  " L "+(dragStartX*1+edgeLength*0.81)+","+dragStartY,
		      'stroke':document.getElementById("obsStrokeColor").value,
		      'stroke-width':5,
		      'id': "obs"+obsCount,
		      'onclick': "selectCube(this.id)",
		      'stroke-width':0,
		      });
      	}
      	
      	newLayer("obs"+obsCount);
      }
    });

//替畫布綁上拖曳監聽功能
d3.select('#basicSVG')
  .call(dragCreate);