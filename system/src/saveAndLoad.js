function saveSPE()
{
	clearSelect();
	var jsonData=
	{
		"svgContent": document.getElementById("basicSVG").outerHTML,
		"svgNameCorrespond":layerNameCorrespond,
		"svgLayerOrder":shapeLayerOrder,
		"svgParentRelationship":parentRelationship,
	}
	var jsonFinData = JSON.stringify(jsonData);
	var name = "vectorPattern"+".spe";
	var type = "text/plain"
    var a = document.createElement("a");
    var file = new Blob([jsonFinData], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

function loadSPE(event)
{
    document.activeElement.blur();
    var input = event.target;
    var reader = new FileReader();
    
    reader.onload = function(){
        var text = reader.result;
        oldData = JSON.parse(text);
        layerNameCorrespond = oldData["svgNameCorrespond"];
        shapeLayerOrder = oldData["svgLayerOrder"];
        parentRelationship = oldData["svgParentRelationship"];
        document.getElementById("basicSVG").outerHTML = oldData["svgContent"];
        d3.select('#basicSVG')
		  .call(dragCreate);
        updateLayerUI();
    };
    reader.readAsText(input.files[0]);  
}

function loadSVG()
{
    document.activeElement.blur();
    var input = event.target;
    var reader = new FileReader();
    
    reader.onload = function(){
        var text = reader.result;
       	document.getElementById("fakeSVG").innerHTML = text;
       	var childrens = document.getElementById("fakeSVG").children;
       	var segamentList = [];
       	for(var eachId in childrens)
       	{
       		if(childrens[eachId].tagName!="undefined")
       		{
       			segamentList = reSVGSegament(segamentList,childrens[eachId]);
       			
       		}
       	}
       	for(var eachSegament in segamentList)
       	{       		
       		var idOfSegament = "obs"+parseInt(shapeLayerOrder.length*1+1);
       		segamentList[eachSegament].id = idOfSegament;       		
       		shapeLayerOrder.push(idOfSegament);
       		document.getElementById("basicSVG").appendChild(segamentList[eachSegament]);
       		d3.select("#"+idOfSegament).attr("onclick","selectCube(this.id)");
       	}
       	updateLayerUI();
    };
    reader.readAsText(input.files[0]);  
}

function exportSVG()
{
	clearSelect();
	d3.select("#basicSVG").attr(
	{
		"xmlns":"http://www.w3.org/2000/svg",
		"version":"1.1",
	});
	d3.select("#basicSVGBG").attr("style","display:none");
	var svgContent = document.getElementById("basicSVG").outerHTML;
	var name = "vectorPattern"+".svg";
	var type = "text/plain"
    var a = document.createElement("a");
    var file = new Blob([svgContent], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
    d3.select("#basicSVGBG").attr("style",null);
}

function reSVGSegament(list,segament)//遞迴並回傳所有的SVG個體形狀
{
	if(segament.tagName == 'rect'||segament.tagName == 'ellipse')//leaf
	{
		list.push(segament);		
	}
	else
	{
		if(segament.children!=undefined)
		{
			for(eachId in segament.children)
			{
				list = reSVGSegament(list,segament.children[eachId]);			
			}	
		}	
	}
	return list;
}

var synthesisDirection = true;//先直向後橫向
function repeatAndExportSVG()
{
	/*document.getElementById("fakeSVG").innerHTML = text;
    var childrens = document.getElementById("fakeSVG").children;*/
    var repeatDrawX = document.getElementById("repeatDrawX").value;
    var repeatDrawY = document.getElementById("repeatDrawY").value;
    var repeatDrawWidth = document.getElementById("repeatDrawWidth").value;
    var repeatDrawHeight = document.getElementById("repeatDrawHeight").value;
    var repeatEvenX = document.getElementById("repeatEvenX").value;
    var repeatEvenY = document.getElementById("repeatEvenY").value;

    d3.select("#fakeSVG").append("g").attr("id","basicPattern");

    for(var j in d3.select("#basicSVG").node().childNodes)//走訪SVG內所有圖形做相交比較
	{
		var targetTagType = d3.select("#basicSVG").node().childNodes[j].tagName;
		var targetName = d3.select("#basicSVG").node().childNodes[j];
		var movedObj;

		if(targetTagType=="rect"||targetTagType=="path"||targetTagType=="ellipse")//測試先不管圓||targetTagType=="ellipse")//確定是畫出來的圖形
		{
			if(targetName.id!="basicSVGBG"&&targetName.id!="objSelectStroke") movedObj = targetName.id;
			else continue;
		}
		else continue;

		d3.select("#basicPattern").node().appendChild(d3.select("#"+movedObj).node().cloneNode(true));
	}

	
	var repeatTimeForX = repeatDrawWidth - d3.select("#basicSVG").attr("width");
	repeatTimeForX = Math.ceil(repeatTimeForX/repeatDrawX);
	var repeatTimeForY = repeatDrawHeight - d3.select("#basicSVG").attr("height");
	repeatTimeForY = Math.ceil(repeatTimeForY/repeatDrawY);

	if(synthesisDirection)
	{
		for(var i=0 ; i<=repeatTimeForX*1+1; i++)
		{
			for(var j=0; j<=repeatTimeForY*1+1;j++)
			{
				var newNode = d3.select("#basicPattern").node().cloneNode(true);
				var copyId = "copyPatternX"+i+j;
				newNode.setAttribute("id",copyId);
				d3.select("#fakeSVG").node().appendChild(newNode);
				var transformText;
				if(j%2==1 && repeatEvenX!=0)
				{
					if(i%2==1 && repeatEvenY!=0)
						transformText = "translate(" + (i*repeatDrawX-repeatEvenX)+","+(j*repeatDrawY-repeatEvenY) + ")";
					else
						transformText = "translate(" + (i*repeatDrawX-repeatEvenX)+","+j*repeatDrawY + ")";
				}		
				else if(i%2==1 && repeatEvenY!=0)
				{
					transformText = "translate(" + i*repeatDrawX+","+(j*repeatDrawY-repeatEvenY) + ")";
				}
				else 
				{
					transformText = "translate(" + i*repeatDrawX+","+j*repeatDrawY + ")";
				}
				d3.select("#"+copyId).attr("transform",transformText);
			}		
		}
	}
	else//橫向優先
	{
		for(var j=0; j<=repeatTimeForY*1+1;j++)
		{
			for(var i=0 ; i<=repeatTimeForX*1+1; i++)
			{
				var newNode = d3.select("#basicPattern").node().cloneNode(true);
				var copyId = "copyPatternX"+i+j;
				newNode.setAttribute("id",copyId);
				d3.select("#fakeSVG").node().appendChild(newNode);
				var transformText;
				if(j%2==1 && repeatEvenX!=0)
				{
					if(i%2==1 && repeatEvenY!=0)
						transformText = "translate(" + (i*repeatDrawX-repeatEvenX)+","+(j*repeatDrawY-repeatEvenY) + ")";
					else
						transformText = "translate(" + (i*repeatDrawX-repeatEvenX)+","+j*repeatDrawY + ")";
				}		
				else if(i%2==1 && repeatEvenY!=0)
				{
					transformText = "translate(" + i*repeatDrawX+","+(j*repeatDrawY-repeatEvenY) + ")";
				}
				else 
				{
					transformText = "translate(" + i*repeatDrawX+","+j*repeatDrawY + ")";
				}
				d3.select("#"+copyId).attr("transform",transformText);
			}		
		}
	}
	
	d3.select("#fakeSVG").attr("width",repeatDrawWidth);
	d3.select("#fakeSVG").attr("height",repeatDrawHeight);
	d3.select("#fakeSVG").attr("viewbox","0,0,"+repeatDrawWidth+","+repeatDrawHeight);
	d3.select("#fakeSVG").attr("preserveAspectRatio","xMidYMid slice");
	d3.select("#fakeSVG").attr("style",null);
	
	clearSelect();
	d3.select("#fakeSVG").attr(
	{
		"xmlns":"http://www.w3.org/2000/svg",
		"version":"1.1",
	});
	var svgContent = document.getElementById("fakeSVG").outerHTML;
	var name = "vectorPattern"+".svg";
	var type = "text/plain"
    var a = document.createElement("a");
    var file = new Blob([svgContent], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();

    d3.select("#fakeSVG").attr("width",null);
	d3.select("#fakeSVG").attr("height",null);
    d3.select("#fakeSVG").attr("style","display:none");
    d3.select("#fakeSVG").selectAll("*").remove();
}

function changeSynthesisDirection()
{	
	console.log(document.getElementById("sdButton").innerText);
	if(document.getElementById("sdButton").innerText=="優先產生直向")
	{
		document.getElementById("sdButton").innerText = "優先產生橫向";
		synthesisDirection = false;
	}
	else if(document.getElementById("sdButton").innerText=="優先產生橫向")
	{
		document.getElementById("sdButton").innerText = "優先產生直向";
		synthesisDirection = true;
	}
}