function loadSVGFile(svgFile)
{
	stopAutoStep();
	document.getElementById("nowDrawing").innerHTML = svgFile;
	console.log("loading "+svgFile);
	$('#divForLoadSVG').load('./svgFile/'+svgFile+'.svg', function() {  	
	var svgtarget = d3.select("#divForLoadSVG").select("svg")[0][0];
	document.getElementsByTagName("svg")[0].setAttribute("id","loadedSVGFile");
	d3.select("#loadedSVGFile").attr(
	{
		"width":3000,
		"height":1000,
		"transform":"scale(0.5)",
		"viewBox":"0 0 2000 750",//給非ai讀入的用
		"preserveAspectRatio":"xMinYMin slice",
	})
	/*
	for( var item in d3.select("#loadedSVGFile").selectAll("g")[0])
	{
		if(d3.select("#loadedSVGFile").selectAll("g")[0][item].id!="loadedSVGFile")
		{
			d3.select("#divForOperation").append("text").text(d3.select("#loadedSVGFile").selectAll("g")[0][item].id);
			d3.select("#divForOperation").append("input").attr({
			"type":"checkbox",
			"id":d3.select("#loadedSVGFile").selectAll("g")[0][item].id+"checkbox",
			"onchange":"layerShowHide(this.id)",
			})
			.property("checked","true");
			d3.select("#divForOperation").append("br");
		}		
	}*/
	originStatus()
	});
}

function layerShowHide(layerName)
{	
	var show;
	console.log(d3.select("#"+layerName).property("checked"));
	if(d3.select("#"+layerName).property("checked"))
		show = "true";
	else
		show = "none";	
	layerName = layerName.split("checkbox")[0];
	d3.select("#"+layerName).attr("style","display:"+show);
}

function applySize()
{
	d3.select("#loadedSVGFile").attr({
		"height":document.getElementById("inputSVGHeight").value,
		"width":document.getElementById("inputSVGWidth").value,
	});
}

var step = -1;

function nextStep()
{
	var allGs = document.getElementsByTagName('g');
	var breakItem;
	if(step < allGs[0].childNodes.length-1)
	{
		step++;
	}
	else
	{
		clearInterval(autoEvent);
		//alert("已完成繪圖！");
		return;
	}
	for(var index in allGs)//走訪SVG內所有圖形做相交比較
	{
		if(typeof allGs[index].childNodes == "undefined") continue;
		var tagVertify = allGs[index].childNodes[step].tagName;
		while(tagVertify!="rect"&&tagVertify!="ellipse"&&tagVertify!="path")
		{
			step++;
			tagVertify = allGs[index].childNodes[step].tagName;
			if(step>allGs[0].childNodes.length) break
		}
		if(tagVertify=="rect"||tagVertify=="ellipse"||tagVertify=="path")
		{
			allGs[index].childNodes[step].setAttribute("style","null");
			if(allGs[index].childNodes[step].getAttribute("name")=="deco")
			{
				//clearInterval(autoEvent);
				//showDecoStep();
			}
		}		
	}	
}

function showDecoStep()
{
	var decoElements = document.getElementsByName("deco");;
	for(var element in decoElements)
	{
		console.log(element.name)//.setAttribute("style","null");
	}
}

function lastStep()
{	
	var allGs = document.getElementsByTagName('g');
	for(var index in allGs)//走訪SVG內所有圖形做相交比較
	{
		if(typeof allGs[index].childNodes == "undefined") continue;
		var tagVertify = allGs[index].childNodes[step].tagName;		
		while(tagVertify!="rect"&&tagVertify!="ellipse"&&tagVertify!="path")
		{
			step--;
			tagVertify = allGs[index].childNodes[step].tagName;
			if(step<0) break
		}
		if(tagVertify=="rect"||tagVertify=="ellipse"||tagVertify=="path")
			allGs[index].childNodes[step].setAttribute("style","display:None");
	}
	if(step >= 0)
		step = step -1 ;
	else
		alert("已回到初始狀態！");
}

function originStatus()
{
	step = -1;
	var allGs = document.getElementsByTagName('g');
	for(var index in allGs)//找到整個頁面的group
	{
		for(var childIndex in allGs[index].childNodes)
		{
			var tagVertify = allGs[index].childNodes[childIndex].tagName;
			if(tagVertify=="rect"||tagVertify=="ellipse"||tagVertify=="path")
				allGs[index].childNodes[childIndex].setAttribute("style","display:None");
		}		
	}
	console.log("隱藏狀態");
}
var autoEvent;
function autoStep()
{
	var msSwitch = document.getElementById("msOfAuto").value;	
	autoEvent = setInterval(function(){nextStep()},msSwitch);
}

function applyScale()
{
	var scaleValue = document.getElementById("inputSVGScale").value;
	d3.select("#loadedSVGFile").attr("transform","scale("+scaleValue+")");
}

function beginningLoading()
{
	var urlData = location.href;
	urlData = urlData.split("?name=");
	urlData = urlData[1];

	if( urlData == "jiaojiao") loadSVGFile('交腳五彩');
	else if( urlData == "liuchu") loadSVGFile('六出五彩');
	else if( urlData == "luodi"){
		loadSVGFile('羅地五彩');
		d3.select("#loadedSVGFile").attr(
		{
			"width":3000,
			"height":1000,
			"transform":"scale(0.5)",
			"viewBox":"250 250 2500 1000",//給非ai讀入的用
			"preserveAspectRatio":"xMinYMin meet",
		});
	}
	else if( urlData == "ISHIDATAMI") loadSVGFile('ISHIDATAMI');
	else if( urlData == "ASANOHA") loadSVGFile('ASANOHA');
	else if( urlData == "SEIGAIHA") loadSVGFile('SEIGAIHA');
	else if( urlData == "YAGASURI") loadSVGFile('YAGASURI');
	else if( urlData == "KASUMIMATO") loadSVGFile('KASUMIMATO');
	else if( urlData == "TOKUTENMATO") loadSVGFile('TOKUTENMATO');
}

function stopAutoStep()
{
	clearInterval(autoEvent);	
}

var colorPalette = [];
function getColors()
{
	var myNode = document.getElementById("colorAdjDropDown");
	myNode.innerHTML = '';
	d3.select("#colorAdjDropDown").append("a").text("取得顏色").attr(
				{
					"class":"nav-link",
					"href":"#",
					"onclick":"getColors()",
				});
	colorPalette = [];
	for(var i in d3.select("#basicPattern").node().childNodes)
	{
		var targetName = d3.select("#basicPattern").node().childNodes[i];
		var targetTagType = d3.select("#basicPattern").node().childNodes[i].tagName;		
		
		if(targetTagType=="rect"||targetTagType=="path"||targetTagType=="ellipse")//確定是畫出來的圖形
		{
			var targetId = d3.select("#basicPattern").node().childNodes[i].id;
			if(typeof targetId != "undefined")
			{			
				if(d3.select("#"+targetId).attr("fill")!=null&&d3.select("#"+targetId).attr("fill")!="None")
				{
					colorPalette.push(d3.select("#"+targetId).attr("fill"));
				}
				if(d3.select("#"+targetId).attr("stroke")!=null&&d3.select("#"+targetId).attr("stroke")!="None")
				{
					colorPalette.push(d3.select("#"+targetId).attr("stroke"));
				}

			}
		}
	}
	colorPalette = colorPalette.filter(function (el, i, arr){
	return arr.indexOf(el) === i;});
	console.log(colorPalette);
	for(var i in colorPalette)
	{
		d3.select("#colorAdjDropDown").append("text").text("　　　　　").attr("style","background-color: "+colorPalette[i]);
		d3.select("#colorAdjDropDown").append("input").attr("type","color").attr("value",colorPalette[i]).attr("id","color"+colorPalette[i].split("#")[1]);
		d3.select("#colorAdjDropDown").append("br");	
		if(i==colorPalette.length-1)
		{
			d3.select("#colorAdjDropDown").append("a").text("套用顏色").attr(
				{
					"class":"nav-link",
					"href":"#",
					"onclick":"applyColorChange()",
				});
		}	
	}
}
function applyColorChange()
{
	for(var c in colorPalette)
	{	
		for(var i in d3.select("#basicPattern").node().childNodes)
		{
			var targetName = d3.select("#basicPattern").node().childNodes[i];
			var targetTagType = d3.select("#basicPattern").node().childNodes[i].tagName;		
			
			if(targetTagType=="rect"||targetTagType=="path"||targetTagType=="ellipse")//確定是畫出來的圖形
			{
				var targetId = d3.select("#basicPattern").node().childNodes[i].id;
				if(typeof targetId != "undefined")
				{			
					if(d3.select("#"+targetId).attr("fill")==colorPalette[c])
					{				
						d3.selectAll("#"+targetId).attr("fill",document.getElementById("color"+colorPalette[c].split("#")[1]).value);
					}
					if(d3.select("#"+targetId).attr("stroke")==colorPalette[c])
					{
						d3.selectAll("#"+targetId).attr("stroke",document.getElementById("color"+colorPalette[c].split("#")[1]).value);
					}
				}
			}
		}		
	}
}
beginningLoading();