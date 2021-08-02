var tracingTargetChange = function(input) 
{
	document.activeElement.blur();
    if ( input.files && input.files[0] )
    {
        var FR= new FileReader();
        FR.onload = function(e) {
          //e.target.result = base64 format picture
          if(d3.select("#tracingTarget")[0][0])
          {
          	d3.select("image").attr(
	          {
	          	"id":"tracingTarget",
	          	"x":0,
	          	"y":0,
	          	"height":500,
	          	"href":e.target.result,
	          	"viewBox":"0,0,500,500",
	          	"opacity":0.3,
	          });
          	console.log(d3.select("#tracingTarget")[0][0]);
          }
          else
          {
          	d3.select("#basicSVG").append("image").attr(
	          {
	          	"id":"tracingTarget",
	          	"x":0,
	          	"y":0,
	          	"height":500,
	          	"href":e.target.result,
	          	"viewBox":"0,0,500,500",
	          	"opacity":0.3,
	          });
          }
        };       
        FR.readAsDataURL( input.files[0] );
    }
};

function clearTracingTarget()
{
	d3.select("#tracingTarget").remove();
}

function applyTracingTarget()
{
	d3.select("#tracingTarget").attr(
	{
		"x": document.getElementById('tTX').value,
		"y": document.getElementById('tTY').value,
		"width": document.getElementById('tTWidth').value,
		"height": document.getElementById('tTHeight').value,
		"opacity": document.getElementById('tTOpacity').value,
	});
}

function clearTTSet()
{
	d3.select("#tracingTarget").attr(
	{
		"x": null,
		"y": null,
		"width": null,
		"height": 500,
		"opacity": 0.3,
	});
}

function createRefLine()
{
	removeRefLine();
	var rLX = document.getElementById("rLX").value;
	var rLY = document.getElementById("rLY").value;
	if(rLX=="") rLX = 0;
	if(rLY=="") rLY = 0;
	d3.select("#basicSVG").append("g").attr("id","refLineSet");
	var canvasWidth = d3.select("#basicSVG").attr("width");
	var canvasHeight = d3.select("#basicSVG").attr("height");
	if(rLX!=0)
	{
		for(var i=0; i<Math.floor(canvasHeight/rLX);i++)
		{
			d3.select("#refLineSet").append("rect").attr(
				{
					"x":i*rLX-2,
					"y":d3.select("#basicSVGBG").attr("stroke-width"),
					"width":3,
					"height":canvasHeight-d3.select("#basicSVGBG").attr("stroke-width")*2,
					"fill":document.getElementById("rLColor").value,					
				});
		}
	}
	if(rLY!=0)
	{
		for(var i=0; i<Math.floor(canvasWidth/rLY);i++)
		{
			d3.select("#refLineSet").append("rect").attr(
				{
					"x": d3.select("#basicSVGBG").attr("stroke-width"),
					"y": i*rLY-2,
					"width":canvasHeight-d3.select("#basicSVGBG").attr("stroke-width")*2,
					"height":3,
					"fill":document.getElementById("rLColor").value,					
				});
		}
	}
	clearSelect();
	nowSelected = "refLineSet";
	raiseToBottom();
	nowSelected = "";
}

function removeRefLine()
{
	d3.select("#refLineSet").remove();
}