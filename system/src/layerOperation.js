var shapeLayerOrder = [];
var parentRelationship = {};
var layerNameCorrespond = {};
var layerHeight = 50;
var layerWidth
var layerSet=
{
	"width":240,
	"height":50,
	"background":"#C3C3C3",
	"textColor":"#000000",
	"textSize":25,
	"textTopMargin":30,
	"stroke":"#000000",
	"stroke-width":5,
	"iconLeftMargin":25,
	"iconTopMargin":10,
	"iconSize":30,	
}
//切child layer的時候正中間切一半
//然後把parent層作為array push進parentRelationship中，接著把子Layer放進去
//畫Layer的時候一層一層跟parentRelationship比對 確定每個畫出的都是子Layer或一般的Layer

function newLayer(id)
{
	shapeLayerOrder.push(id);
	drawLayerUI(id);
}

function deleteLayer(id)
{
	var tempArray = [];
	for(var eachId in shapeLayerOrder)
	{
		if(shapeLayerOrder[eachId]!=nowSelected)
		 tempArray.push(shapeLayerOrder[eachId]);
	}
	shapeLayerOrder = tempArray;
	updateLayerUI();
}

//<rect id="layerTopTitle" x="0" y="0" width="250" height="50" fill="black" stroke="black" stroke-width="5"/>
function drawLayerUI(id)
{
	var countOfLayers;
	var layerName;
	if(typeof layerNameCorrespond[id]=="undefined")//無特別對應名字
	{
		layerName = id;
	}
	else
	{
		layerName = layerNameCorrespond[id];
	}
	for(var eachId in shapeLayerOrder)
	{
		if(shapeLayerOrder[eachId]==id) countOfLayers = eachId*1+1;
	}
	//var countOfLayers = shapeLayerOrder.length;
	var colorOfIcon;
	if(d3.select("#"+id).attr("fill")!="None") colorOfIcon = d3.select("#"+id).attr("fill");
	else colorOfIcon = d3.select("#"+id).attr("stroke");
	d3.select("#layerSVG").append("g")
	.attr(
		{
			"id":id+"LayerUI",
			"onclick":"selectCube("+id+")",
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
	if(document.getElementById(id).tagName=="rect")
	{
		d3.select("#"+id+"LayerUI").append("rect").
		attr(
			{
				"width":layerSet["iconSize"],
				"height":layerSet["iconSize"],
				"x":layerSet["iconLeftMargin"],
				"y":layerSet["height"]*countOfLayers+layerSet["iconTopMargin"]*1,
				"fill":colorOfIcon,
				"onclick":"hideLayer(this.id)",
				"opacity":"1",
				"id":id+"LayerIcon",				
			});
	}
	else if(document.getElementById(id).tagName=="ellipse")
	{
		d3.select("#"+id+"LayerUI").append("ellipse").
		attr(
			{
				"rx":layerSet["iconSize"]/2,
				"ry":layerSet["iconSize"]/2,
				"cx":layerSet["iconLeftMargin"]+layerSet["iconSize"]/2,
				"cy":layerSet["height"]*countOfLayers+layerSet["iconTopMargin"]*1+layerSet["iconSize"]/2,
				"fill":d3.select("#"+id).attr("fill"),
				"onclick":"hideLayer(this.id)",
				"opacity":"1",
				"id":id+"LayerIcon",
			});
	}
}

function hideLayer(id)
{
	var oriId = id.split("LayerIcon")[0];
	if(d3.select("#"+id).attr("opacity")==1)
	{
		d3.select("#"+id).attr("opacity",0.3);
		d3.select("#"+oriId).attr("style","display:None");
		clearSelect();
	}
	else
	{
		d3.select("#"+id).attr("opacity",1);
		d3.select("#"+oriId).attr("style","display:true");
	}
}

function raiseToTop()
{
	var tempArray = [];
	if(nowSelected!="")
	{
		for(var eachId in shapeLayerOrder)
		{
			if(shapeLayerOrder[eachId]!=nowSelected)
			 tempArray.push(shapeLayerOrder[eachId]);
		}
		tempArray.push(nowSelected);
		shapeLayerOrder = JSON.parse(JSON.stringify(tempArray));
		document.getElementById(nowSelected).parentNode.appendChild(document.getElementById(nowSelected));
	}
	updateLayerUI();
}

function raiseToBottom()
{
	var tempArray = [];	
	if(nowSelected!="")
	{
		document.getElementById(nowSelected).parentNode.appendChild(document.getElementById(nowSelected));
		tempArray.push(nowSelected);
		for(var eachId in shapeLayerOrder)
		{
			if(shapeLayerOrder[eachId]!=nowSelected)
			{
				tempArray.push(shapeLayerOrder[eachId]);
				document.getElementById(shapeLayerOrder[eachId]).parentNode.appendChild(document.getElementById(shapeLayerOrder[eachId]));
			}
		}		
		shapeLayerOrder = JSON.parse(JSON.stringify(tempArray));	
	}
	updateLayerUI();
}

function raiseOneLayer()
{
	var switchTarget = ""
	var tempArray = [];
	if(nowSelected!=""&&shapeLayerOrder.length!=shapeLayerOrder.indexOf(nowSelected)+1)//防止最上方圖層再被拉抬
	{
		for(var eachId in shapeLayerOrder)
		{
			if(shapeLayerOrder[eachId]!=nowSelected && eachId != switchTarget)//非現在選中的圖層及被放過的圖層(選中圖層的上方層)
			{
			 document.getElementById(shapeLayerOrder[eachId]).parentNode.appendChild(document.getElementById(shapeLayerOrder[eachId]));
			 tempArray.push(shapeLayerOrder[eachId]);
			}
			else if(eachId == switchTarget)
			{
			 
			}
			else
			{				
				tempArray.push(shapeLayerOrder[eachId*1+1]);
				tempArray.push(nowSelected);
				switchTarget = eachId*1+1;
				document.getElementById(shapeLayerOrder[eachId*1+1]).parentNode.appendChild(document.getElementById(shapeLayerOrder[eachId*1+1]));
				document.getElementById(nowSelected).parentNode.appendChild(document.getElementById(nowSelected));
			}
		}		
		shapeLayerOrder = JSON.parse(JSON.stringify(tempArray));
	}
	updateLayerUI();
}

function updateLayerUI()
{
	d3.select("#layerSVG").selectAll("g").remove();
	for(var eachId in shapeLayerOrder)
	{
		drawLayerUI(shapeLayerOrder[eachId]);
	}	
}

function alreadyUsedName(layerName)
{
	for(var eachId in shapeLayerOrder)
	{
		if(shapeLayerOrder[eachId] == layerName)
			return true;
	}
	return false;
}
var layerlinedragStartY="";
var layerlinedragEndY;
var dragLayerLineHover;
var layerLineVerticalDrag = d3.behavior.drag()  
.on('dragstart', function() {
    	layerlinedragStartY="";
    	dragLayerLineHover = false;
    	if($("#layerSVG").is(":hover")) dragLayerLineHover = true;
    })
.on('drag', function() { 
	  if(layerlinedragStartY=="")
	  {
	  	layerlinedragStartY = d3.event.sourceEvent.offsetY;
	  }
	  else
	  {
	  	layerlinedragEndY = d3.event.sourceEvent.offsetY;
	  }

})
.on('dragend', function() {
	if($("#layerSVG").is(":hover")) dragLayerLineHover = true;
	else dragLayerLineHover = false;
	var distanceY;
	if(dragLayerLineHover)
	{
		distanceY = layerlinedragEndY - layerlinedragStartY;
		distanceY = -distanceY;//捲動方向 我習慣這個
		if(d3.select("#layerSVG").attr("viewBox")==null) d3.select("#layerSVG").attr("viewBox","0 0 250 500");
		var viewBox  = d3.select("#layerSVG").attr("viewBox").split(" ");
		var layerLineOriY = viewBox[1];
		var shouldBeDisY = layerLineOriY*1+distanceY*1;

		if(shouldBeDisY<0||isNaN(shouldBeDisY))//reset
		{
			d3.select("#layerSVG").attr("viewBox","0 0 250 500");	
			d3.select("#layerSVGBG").attr("y",0);
			d3.select("#layerTopTitle").attr("y",0);
			d3.select("#layerTopTitleText").attr("y",30);
		} 
		else
		{
			d3.select("#layerSVG").attr("viewBox","0 "+shouldBeDisY+" 250 500");		
			var layerLineBGOriY = d3.select("#layerSVGBG").attr("y");
			d3.select("#layerSVGBG").attr("y",layerLineBGOriY*1+distanceY*1);
			var layerTopTitleOriY = d3.select("#layerTopTitle").attr("y");
			var layerTopTitleTextOriY = d3.select("#layerTopTitleText").attr("y");
			d3.select("#layerTopTitle").attr("y",layerTopTitleOriY*1+distanceY*1);
			d3.select("#layerTopTitleText").attr("y",layerTopTitleTextOriY*1+distanceY*1);
		}
	}
});

var parentLinedragStartY="";
var parentLinedragEndY;
var dragParentLineHover;
var parentLineVerticalDrag = d3.behavior.drag()  
.on('dragstart', function() {
    	parentLinedragStartY="";
    	dragParentLineHover = false;
    	if($("#relationshipSVG").is(":hover")) dragParentLineHover = true;
    })
.on('drag', function() { 
	  if(parentLinedragStartY=="")
	  {
	  	parentLinedragStartY = d3.event.sourceEvent.offsetY;
	  }
	  else
	  {
	  	parentLinedragEndY = d3.event.sourceEvent.offsetY;
	  }
	  if($("#relationshipSVG").is(":hover")) dragParentLineHover = true;
})
.on('dragend', function() {
	if($("#relationshipSVG").is(":hover")) dragParentLineHover = true;
	else dragParentLineHover = false;
	var distanceY;
	console.log(dragParentLineHover);
	if(dragParentLineHover)
	{
		distanceY = parentLinedragEndY - parentLinedragStartY;
		distanceY = -distanceY;//捲動方向 我習慣這個
		if(d3.select("#layerSVG").attr("viewBox")==null) d3.select("#layerSVG").attr("viewBox","0 0 250 500");
		var viewBox  = d3.select("#layerSVG").attr("viewBox").split(" ");
		var layerLineOriY = viewBox[1];
		var shouldBeDisY = layerLineOriY*1+distanceY*1;

		if(shouldBeDisY<0||isNaN(shouldBeDisY))//reset
		{
			d3.select("#relationshipSVG").attr("viewBox","0 0 250 500");	
			d3.select("#relationshipSVGBG").attr("y",0);
			d3.select("#relationshipTopTitle").attr("y",0);
			d3.select("#relationshipTopTitleText").attr("y",30);
		} 
		else
		{
			d3.select("#relationshipSVG").attr("viewBox","0 "+shouldBeDisY+" 250 500");		
			var layerLineBGOriY = d3.select("#relationshipSVGBG").attr("y");
			d3.select("#relationshipSVGBG").attr("y",layerLineBGOriY*1+distanceY*1);
			var layerTopTitleOriY = d3.select("#relationshipTopTitle").attr("y");
			var layerTopTitleTextOriY = d3.select("#relationshipTopTitleText").attr("y");
			d3.select("#relationshipTopTitle").attr("y",layerTopTitleOriY*1+distanceY*1);
			d3.select("#relationshipTopTitleText").attr("y",layerTopTitleTextOriY*1+distanceY*1);
		}
	}
});


function resetLayerLineViewBox()
{
	d3.select("#layerSVG").attr("viewBox","0 0 250 500");	
	d3.select("#layerSVGBG").attr("y",0);
	d3.select("#layerTopTitle").attr("y",0);
	d3.select("#layerTopTitleText").attr("y",30);
}
function resetParentLineViewBox()
{
	d3.select("#relationshipSVG").attr("viewBox","0 0 250 500");	
	d3.select("#relationshipSVGBG").attr("y",0);
	d3.select("#relationshipTopTitle").attr("y",0);
	d3.select("#relationshipTopTitleText").attr("y",30);
}
d3.select('#layerSVG')
    .call(layerLineVerticalDrag);

d3.select('#relationshipSVG')
    .call(parentLineVerticalDrag);