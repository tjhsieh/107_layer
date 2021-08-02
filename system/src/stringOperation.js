function getRotateData(data)
{
	//範例字串 transform="rotate(10,224,333.5)"
    var rotateData = data.split("rotate");
    rotateData = rotateData[1].split("(");
    rotateData = rotateData[1].split(")");
    rotateData = rotateData[0].split(",");
 	var rotatedAngle = rotateData[0];
 	var rotatedMidX = rotateData[1];
 	var rotatedMidY = rotateData[2];
	return [rotatedAngle,rotatedMidX,rotatedMidY];
}
function setRotateData(angle,midX,midY)
{
	var rotateSentence = "rotate("+angle+","+midX+","+midY+")";
	return rotateSentence;
}

function getDataInOriginRect(data)
{
	var targetData = data;
	targetData = targetData.split("fill=");
	targetData = targetData[1].split("</rect>");
	targetData = " fill="+targetData[0]+"</path>";
	return targetData;
}

function getDataInOriginEllipse(data)
{
	var targetData = data;
	targetData = targetData.split("fill=");
	targetData = targetData[1].split("</ellipse>");
	targetData = " fill="+targetData[0]+"</path>";
	return targetData;
}