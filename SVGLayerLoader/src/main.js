function loadSVGFile(svgFile)
{
	console.log("loading "+svgFile);
	$('#divForLoadSVG').load('./svgFile/'+svgFile+'.svg', function() {  	
	var svgtarget = d3.select("#divForLoadSVG").select("svg")[0][0];
	document.getElementsByTagName("svg")[0].setAttribute("id","loadedSVGFile");
	d3.select("#loadedSVGFile").attr(
	{
		"width":2000,
		"height":2000,
		"viewBox":"0 0 3000 1000",//給非ai讀入的用
	})

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
	}
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