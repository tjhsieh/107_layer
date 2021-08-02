var uiCate=
{
	"saveUI":["saveLoadBlock"],
	"traceUI":["traceSettingBlock"],
	"editUI":["editLineInput"],
	"layerUI":["layerLineUI"],
	"parentUI":["relationshipSVG","parentAddLineUI","parentApplyLineUI"],
	"zAxisUI":["zAxisUI"],
	"controlUI":["commonFunctionBlock","editLine"],
	"refLineUI":["refLineSettingBlock"],
}

function uiShowHide(cate)
{	
	for(var eachId in uiCate[cate])
	{
		if(d3.select("#"+uiCate[cate][eachId]).attr("style"))
		{
			d3.select("#"+uiCate[cate][eachId]).attr("style",null);
		}
		else
		{
			d3.select("#"+uiCate[cate][eachId]).attr("style","display:None");
			if(cate=="editUI"&&!d3.select("#vertexsConsUI").attr("style"))
			{
				d3.select("#vertexsConsUI").attr("style","display:None");
			}
		}
	}
}

function displayVertexsConsUI()
{
	if(d3.select("#vertexsConsUI").attr("style"))
	{
			d3.select("#vertexsConsUI").attr("style",null);
	}
	else
	{
		d3.select("#vertexsConsUI").attr("style","display:None");
	}
}