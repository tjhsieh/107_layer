function getPlaneFunction(vertexSet)
{
	var vectorA = [vertexSet[1][0] - vertexSet[0][0],
					vertexSet[1][1] - vertexSet[0][1],
					vertexSet[1][2] - vertexSet[0][2]];
	var vectorB = [vertexSet[2][0] - vertexSet[0][0],
					vertexSet[2][1] - vertexSet[0][1],
					vertexSet[2][2] - vertexSet[0][2]];
	var productResult = [vectorA[1]*vectorB[2]-vectorA[2]*vectorB[1],
							vectorA[2]*vectorB[0]-vectorA[0]*vectorB[2],
							vectorA[0]*vectorB[1]-vectorA[1]*vectorB[0]];
	var n = vertexSet[0][0]*productResult[0]+vertexSet[0][1]*productResult[1]+vertexSet[0][2]*productResult[2];
	n=n*-1;
	return [Math.round(productResult[0]),Math.round(productResult[1]),Math.round(productResult[2]),Math.round(n)];
}

function systemOfTwoUnknownsEquations(equation1,equation2)//ax+by+c=0
{
	//用方程式反向拆解結果式，蠻複雜的，要寫在紙上才好推導
	var secondRatio = equation2[1]/equation1[1];
	var firstVar =  -(equation2[2]-secondRatio*equation1[2])/(equation2[0]-secondRatio*equation1[0]);
	var secondVar = -(equation2[2]+equation2[0]*firstVar)/equation2[1];
	return [firstVar,secondVar];
}

function planeIntersectProcess(para1,para2,zeroItem,para1ZeroSit,para2ZeroSit)
{

	var zeroItemVector = [zeroItem==0?1:0,zeroItem==1?1:0,zeroItem==2?1:0];
	para1ZeroSit = [para1ZeroSit[0]|zeroItemVector[0],para1ZeroSit[1]|zeroItemVector[1],para1ZeroSit[2]|zeroItemVector[2]];
	para2ZeroSit = [para2ZeroSit[0]|zeroItemVector[0],para2ZeroSit[1]|zeroItemVector[1],para2ZeroSit[2]|zeroItemVector[2]];
	//計算各式中有幾個零
	para1ZeroSit[3] = para1ZeroSit[0]+para1ZeroSit[1]+para1ZeroSit[2];
	para2ZeroSit[3] = para2ZeroSit[0]+para2ZeroSit[1]+para2ZeroSit[2];

	var nonZeroItem = [!zeroItemVector[0],!zeroItemVector[1],!zeroItemVector[2]];
	var answerOfOneVar = [];//var mean varible
	var answerOfTwoVars = [];
	var answerOfThreeVars = [];
	//將零項套入，並從此依據套用完的式子進行二元一元做法篩檢
	para1=[para1[0]*nonZeroItem[0],para1[1]*nonZeroItem[1],para1[2]*nonZeroItem[2],para1[3]];
	para2=[para2[0]*nonZeroItem[0],para2[1]*nonZeroItem[1],para2[2]*nonZeroItem[2],para2[3]];

	if(para1ZeroSit[3]>para2ZeroSit[3])//把零項多的往後換
	{
		var t = para1ZeroSit;
		para1ZeroSit = para2ZeroSit;
		para2ZeroSit = t;
		t = para1;
		para1 = para2;
		para2 = t;
	}
	//兩個式子皆不可能有沒有0係數項的況狀，因為必有一係數項被設為0來演算
	if(para1ZeroSit[3]==1&&para2ZeroSit[3]==1)//套用完後兩個皆一項係數是零->兩二元方程
	{
		if(zeroItem==0)
		{
			answerOfTwoVars = systemOfTwoUnknownsEquations([para1[1],para1[2],para1[3]],[para2[1],para2[2],para2[3]]);
			answerOfThreeVars = [0,answerOfTwoVars[0],answerOfTwoVars[1]];
		}  
		if(zeroItem==1)
		{
			answerOfTwoVars = systemOfTwoUnknownsEquations([para1[0],para1[2],para1[3]],[para2[0],para2[2],para2[3]]);
			answerOfThreeVars = [answerOfTwoVars[0],0,answerOfTwoVars[1]];
		}  
		if(zeroItem==2)  
		{
			answerOfTwoVars = systemOfTwoUnknownsEquations([para1[0],para1[1],para1[3]],[para2[0],para2[1],para2[3]]);
			answerOfThreeVars = [answerOfTwoVars[0],answerOfTwoVars[1],0];
		}
	}
	else if(para1ZeroSit[3]==1&&para2ZeroSit[3]==2)//套用完後有一個一項係數是零一個兩項係數是零->一一元方程一二元方程
	{
		for(var i=0;i<3;i++)
		{
			if(para2[i]!=0)
			{
				answerOfOneVar[0] = para2[i];
				answerOfOneVar[1] = i;
			} 
		}		
		if(para2[3]!=0) answerOfOneVar[0] = para2[3]/answerOfOneVar[0];
		else answerOfOneVar[0]=0;
		answerOfThreeVars[answerOfOneVar[1]] = answerOfOneVar[0];
		answerOfThreeVars[zeroItem] = 0;
		//找皆不為0項 出來值為零表示兩項都為零
		var crossPara12ZeroSit = [para1ZeroSit[0]|para2ZeroSit[0],para1ZeroSit[1]|para2ZeroSit[1],para1ZeroSit[2]|para2ZeroSit[2]];
		var nonZeroCross;
		if(crossPara12ZeroSit[0]==0) nonZeroCross=0;
		else if (crossPara12ZeroSit[1]==0) nonZeroCross=1;
		else if (crossPara12ZeroSit[2]==0) nonZeroCross=2;
		var origin3 = 3;//用來知道剩下那項是哪項，index0,1,2加總為3，減掉另外兩者為剩下的index
		origin3 = origin3 - zeroItem -answerOfOneVar[1];
		answerOfThreeVars[origin3] = -(para1[3]+para1[answerOfOneVar[1]]*answerOfOneVar[0])/para1[origin3];
	}
	else if(para1ZeroSit[3]==2&&para2ZeroSit[3]==2)//套用完後有兩個式子皆有兩項係數是零->兩一元方程
	{
		for(var i=0;i<3;i++)
		{
			if(para2[i]!=0)
			{
				answerOfOneVar[0] = para2[i];
				answerOfOneVar[1] = i;
			} 
		}//得出para1該參數的解
		answerOfThreeVars[answerOfOneVar[1]] = answerOfOneVar[0];
		answerOfThreeVars[zeroItem] = 0;
		var origin3 = 3;
		origin3 = origin3 - zeroItem -answerOfOneVar[1];
		answerOfThreeVars[origin3] = para1[3]/para1[origin3];
	}
	
	
	var constantParaRatio = para1[2]/para2[2];
	var noConstantPara2 = [para2[0]*constantParaRatio,para2[1]*constantParaRatio,para2[2]*constantParaRatio];
	var productResult = [para1[1]*noConstantPara2[2]-para1[2]*noConstantPara2[1],
						para1[2]*noConstantPara2[0]-para1[0]*noConstantPara2[2],
						para1[0]*noConstantPara2[1]-para1[1]*noConstantPara2[0]];
	var newPara = [[Math.floor(answerOfThreeVars[0]),Math.floor(productResult[0])],[Math.floor(answerOfThreeVars[1]),Math.floor(productResult[1])],[Math.floor(answerOfThreeVars[2]),Math.floor(productResult[2])]];
	return newPara;
}

function getPlaneIntersection(para1,para2)//input為兩平面方程式
{
	var paraRatio = [para1[0]/para2[0],para1[1]/para2[1],para1[2]/para2[2]];
	var constantParaRatio = para1[3]/para2[3]; 
	var needCompared = [];
	var intersect = false;
	for(var i in paraRatio)
	{
		if(paraRatio[i]!=0&&!isNaN(paraRatio[i])) needCompared.push(paraRatio[i]);
		else if((paraRatio[i]==0||isNaN(paraRatio[i]))&&((para1[i]!=0&&para2[i]==0)||(para1[i]==0&&para2[i]!=0)))
		{
			intersect = true;
			break;
		}
	}
	if(intersect==false)
	{
		for(var i in needCompared)
		{
			if(needCompared[0]!=needCompared[i])
			{
				intersect = true;
				break;
			}
		}
	}
	if(intersect==true)
	{
		//賦予Z一易於計算的變量，代回原消去常數的兩平面，得兩二元一次方程式，解聯立得一點(x1,y1,z1)
		//原消去常數的兩平面取其x,y,z係數做外積，做完外積後得一(a,b,c)
		//則 t = (x-x1)/a= (y-y1)/b = (z-z1)/c
		//用上式反求出交線之參數式

		var countPara10 = [(para1[0]==0?1:0)  , (para1[1]==0?1:0) , (para1[2]==0?1:0)];
		var countPara20 = [(para2[0]==0?1:0)  , (para2[1]==0?1:0) , (para2[2]==0?1:0)];
		var crossPara1020 = [countPara10[0]&&countPara20[0],countPara10[1]&&countPara20[1],countPara10[2]&&countPara20[2]];
		countPara10[3] = countPara10[0]+countPara10[1]+countPara10[2];
		countPara20[3] = countPara20[0]+countPara20[1]+countPara20[2];

		if(countPara10>countPara20)//把0比較多的項擺後面，減少情況從9->6
		{
			var temp = para1;
			para1 = para2;
			para2 = temp;
			temp = countPara10;
			countPara10 = countPara20;
			countPara20 = temp;
		}
		var zeroLocation;//避免零元產生，故讓兩者同位皆無數者優先為零
		if(crossPara1020[0]==1) zeroLocation = 0;
		else if(crossPara1020[1]==1) zeroLocation = 1;
		else if(crossPara1020[2]==1) zeroLocation = 2;
		else if(countPara20[0]==1) zeroLocation = 0;
		else if(countPara20[1]==1) zeroLocation = 1;
		else if(countPara20[2]==1) zeroLocation = 2;
		else//兩者都沒有位數為0的狀況
		{
			zeroLocation = 2;
		}
		//會回傳參數式
		var tFunction = planeIntersectProcess(para1,para2,zeroLocation,countPara10,countPara20);
		return tFunction;
	}
	else
	{
		if(needCompared[0]==constantParaRatio)//
		{
			return false;
		}
		else
		{
			return false;
		}
	}
}

function getParafunction(pointGiven,vectorGiven)
{
	var parafunction=[];
	//for example x=1+t y=2-t z=2t
	//parafunction = [[1,1],[2,-1],[0,2]]
	//parafunction=[[pointGiven[0],vectorGiven[0]],[pointGiven[1],vectorGiven[1]],[pointGiven[2],vectorGiven[2]]];
	parafunction=[[Math.round(pointGiven[0]),Math.round(vectorGiven[0])],
				[Math.round(pointGiven[1]),Math.round(vectorGiven[1])],
				[Math.round(pointGiven[2]),Math.round(vectorGiven[2])]];
	return parafunction;
}

function isParafunctionsIntersect(parafunctionA,parafunctionB)
{
	
	var tempNumber;
	//任二參數式皆沒有t且常數不相等的情況下必不相交
	if(parafunctionA[0][1]==0&&parafunctionB[0][1]==0&&parafunctionA[0][0]!=parafunctionB[0][0]) return false;
	if(parafunctionA[1][1]==0&&parafunctionB[1][1]==0&&parafunctionA[1][0]!=parafunctionB[1][0]) return false;
	if(parafunctionA[2][1]==0&&parafunctionB[2][1]==0&&parafunctionA[2][0]!=parafunctionB[2][0]) return false;

	//特例：t前的係數在該參數式只有一項有t且該項無常數時，t前係數可自由換成一不等於零的常數(即此項為任意數)
	//此種情況下應該省略與此項得比較
	
	var paraASp = -1;//判斷該參數式中有沒有異常項
	var paraBSp = -1;//判斷該參數式中有沒有異常項
	var paraACheck0 = [parafunctionA[0][1]!=0?1:0,parafunctionA[1][1]!=0?1:0,parafunctionA[2][1]!=0?1:0];
	paraACheck0[3] = paraACheck0[0]+paraACheck0[1]+paraACheck0[2];
	var paraBCheck0 = [parafunctionB[0][1]!=0?1:0,parafunctionB[1][1]!=0?1:0,parafunctionB[2][1]!=0?1:0];
	paraBCheck0[3] = paraBCheck0[0]+paraBCheck0[1]+paraBCheck0[2];
	if(paraACheck0[3]==1)
	{
		var tempIndex = paraACheck0.indexOf(1);
		if(parafunctionA[tempIndex][0]==0) paraASp=tempIndex;
	} 
	if(paraBCheck0[3]==1)
	{
		var tempIndex = paraBCheck0.indexOf(1);
		if(parafunctionB[tempIndex][0]==0) paraBSp=tempIndex;
	}
	if(paraASp!=-1) parafunctionA[paraASp][1] = 1;
	if(paraBSp!=-1) parafunctionB[paraBSp][1] = 1;

	if(paraASp!=0&&paraBSp!=0)
	{
		tempNumber=(parafunctionB[0][0] - parafunctionA[0][0])/(parafunctionA[0][1]-parafunctionB[0][1])
		if(isNaN(tempNumber)) tempNumber=0;	
	}
	else if((paraASp==0&&paraBSp==0)||(paraASp==0&&paraBSp==-1)||(paraASp==0&&paraBSp==2)||(paraASp==-1&&paraBSp==0))
	{
		tempNumber=(parafunctionB[1][0] - parafunctionA[1][0])/(parafunctionA[1][1]-parafunctionB[1][1])
		if(isNaN(tempNumber)) tempNumber=0;	
	}
	else if((paraASp==0&&paraBSp==2)||(paraASp==1&&paraBSp==0)||(paraASp==2&&paraBSp==0))
	{
		tempNumber=(parafunctionB[2][0] - parafunctionA[2][0])/(parafunctionA[2][1]-parafunctionB[2][1])
		if(isNaN(tempNumber)) tempNumber=0;
	}

	var intersectPoint;
	intersectPoint = [(parafunctionA[0][0]*1+parafunctionA[0][1]*tempNumber),
						(parafunctionA[1][0]*1+parafunctionA[1][1]*tempNumber),
						(parafunctionA[2][0]*1+parafunctionA[2][1]*tempNumber)];
	if(paraASp==0) intersectPoint[0]=parafunctionB[0][0]*1+parafunctionB[0][1]*tempNumber;
	if(paraASp==1) intersectPoint[1]=parafunctionB[1][0]*1+parafunctionB[1][1]*tempNumber;
	if(paraASp==2) intersectPoint[2]=parafunctionB[2][0]*1+parafunctionB[2][1]*tempNumber;
	return intersectPoint;
}

function compareNumbers(a, b) {
  return a - b;
}

function getPointFromPath(targetPathID)
{
	var targetPath;
	if(d3.select("#"+targetPathID).node().tagName=="rect"||d3.select("#"+targetPathID).node().tagName=="ellipse")
	{
		targetPath = getPathTransferPoints(targetPathID);
	}
	else if(d3.select("#"+targetPathID).node().tagName=="path")
	{
		targetPath = d3.select("#"+targetPathID).attr("d");
	}

	var pointsSet = [];
	var pointsSetWithoutZ = [];

	pointsSetWithoutZ = getPointsFromD(targetPath);
	if(d3.select("#"+targetPathID).attr("z1")!= null)//直向具Z值，以y排序
	{		
		var bubbleSortOfPoints = [];
		for(var i in pointsSetWithoutZ)
		{
			bubbleSortOfPoints[i]=pointsSetWithoutZ[i][1];	
		}
		bubbleSortOfPoints.sort(compareNumbers);
		var detectTimes = bubbleSortOfPoints.length;
		for(var i=0;i<detectTimes;i++)
		{
			if(bubbleSortOfPoints[i]==bubbleSortOfPoints[i*1+1]) bubbleSortOfPoints.splice(i+1,1);
		}
		var indexOrder = [];
		for(var i in bubbleSortOfPoints)
		{
			for(var j in pointsSetWithoutZ)
			{
				if(bubbleSortOfPoints[i] == pointsSetWithoutZ[j][1])
				{
					if(!Array.isArray(indexOrder[i])) indexOrder[i]=[];
					indexOrder[i].push(j);
				}
			}
		}

		var zDiff = d3.select("#"+targetPathID).attr("z2") - d3.select("#"+targetPathID).attr("z1");
		if(zDiff!=0) zDiff = zDiff / (pointsSetWithoutZ[indexOrder[indexOrder.length-1][0]][1] - pointsSetWithoutZ[indexOrder[0][0]][1]);
		else zDiff = 0;
		for (var i = 0; i < indexOrder.length; i++)
		{
			if(i==0)//最上點
			{
				for(var j in indexOrder[i])
				{
					pointsSetWithoutZ[indexOrder[i][j]].push(d3.select("#"+targetPathID).attr("z1"));
				}
			}
			else if(i==indexOrder.length-1)//最下點
			{
				for(var j in indexOrder[i])
				{
					pointsSetWithoutZ[indexOrder[i][j]].push(d3.select("#"+targetPathID).attr("z2"));
				}
			}
			else//中間點 用差距*Ziff線性算
			{
				var zValue = d3.select("#"+targetPathID).attr("z1")*1+(pointsSetWithoutZ[indexOrder[i][0]][1] - pointsSetWithoutZ[indexOrder[0][0]][1])*zDiff;
				for(var j in indexOrder[i])
				{
					pointsSetWithoutZ[indexOrder[i][j]].push(zValue);
				}
			}
		}
		pointsSet = pointsSetWithoutZ;
	}
	else if(d3.select("#"+targetPathID).attr("z3")!= null)//橫向具Z值，以x排序
	{		
		var bubbleSortOfPoints = [];
		for(var i in pointsSetWithoutZ)
		{
			bubbleSortOfPoints[i]=pointsSetWithoutZ[i][0];	
		}
		bubbleSortOfPoints.sort(compareNumbers);
		var detectTimes = bubbleSortOfPoints.length;
		for(var i=0;i<detectTimes;i++)
		{
			if(bubbleSortOfPoints[i]==bubbleSortOfPoints[i*1+1]) bubbleSortOfPoints.splice(i+1,1);
		}
		var indexOrder = [];
		for(var i in bubbleSortOfPoints)
		{
			for(var j in pointsSetWithoutZ)
			{
				if(bubbleSortOfPoints[i] == pointsSetWithoutZ[j][0])
				{
					if(!Array.isArray(indexOrder[i])) indexOrder[i]=[];
					indexOrder[i].push(j);
				}
			}
		}

		var zDiff = d3.select("#"+targetPathID).attr("z4") - d3.select("#"+targetPathID).attr("z3");
		if(zDiff!=0) zDiff = zDiff / (pointsSetWithoutZ[indexOrder[indexOrder.length-1][0]][0] - pointsSetWithoutZ[indexOrder[0][0]][0]);
		else zDiff = 0;
		for (var i = 0; i < indexOrder.length; i++)
		{
			if(i==0)//最左點
			{
				for(var j in indexOrder[i])
				{
					pointsSetWithoutZ[indexOrder[i][j]].push(d3.select("#"+targetPathID).attr("z3"));
				}
			}
			else if(i==indexOrder.length-1)//最右點
			{
				for(var j in indexOrder[i])
				{
					pointsSetWithoutZ[indexOrder[i][j]].push(d3.select("#"+targetPathID).attr("z4"));
				}
			}
			else//中間點 用差距*Ziff線性算
			{
				var zValue = d3.select("#"+targetPathID).attr("z3")*1+(pointsSetWithoutZ[indexOrder[i][0]][0] - pointsSetWithoutZ[indexOrder[0][0]][0])*zDiff;
				for(var j in indexOrder[i])
				{
					pointsSetWithoutZ[indexOrder[i][j]].push(zValue);
				}
			}
		}
		pointsSet = JSON.parse(JSON.stringify(pointsSetWithoutZ));
	}
	else
	{	
		for(var i in pointsSetWithoutZ)
		{
			pointsSetWithoutZ[i].push(0);
			pointsSet[i] = pointsSetWithoutZ[i];
		}
	}
	return pointsSet;
}

function getPointsFromD(dOfPath)
{
	var pointsArray = [];
	//處理圓的時候查找D裡面有沒有a，有就用圓的邏輯處理
	if(dOfPath.indexOf("Ellipse")!=-1)//橢圓特別case標記
	{
		var splitStr = dOfPath.split("_");
		var idOfEllipse = splitStr[1];
		var oriCX = d3.select("#"+idOfEllipse).attr("cx");
		var oriCY = d3.select("#"+idOfEllipse).attr("cy");
		var oriRX = d3.select("#"+idOfEllipse).attr("rx");
		var oriRY = d3.select("#"+idOfEllipse).attr("ry");
		pointsArray.push( [(oriCX-oriRX) , (oriCY-oriRY)]);
		pointsArray.push( [(oriCX*1+oriRX*1) , (oriCY-oriRY)]);
		pointsArray.push( [(oriCX*1+oriRX*1) , (oriCY*1+oriRY*1)]);		
		pointsArray.push( [(oriCX-oriRX) , (oriCY*1+oriRY*1)]);
	}
	else//其他用直線的邏輯處理
	{
		var splitStr = dOfPath.split(/(?=[LMC])/);
		for(var i in splitStr)
		{
			splitStr[i]=splitStr[i].slice(2);
			splitStr[i]=splitStr[i].slice(0,-1);
		}
		for(var i in splitStr)
		{
			if(i==splitStr.length-1) break;//轉路徑我最後會畫回去，所以不用理最後一個點(重複第一個)
			var splitTemp = splitStr[i].split(",");
			pointsArray.push([splitTemp[0],splitTemp[1]]);
		}
	}	
	return pointsArray;
}

function getLengthWithPoints(points)
{	
	var totalLengthPow=0;
	for(var i=0; i<(points.length-1) ; i++)
	{		
		totalLengthPow = totalLengthPow*1 + Math.sqrt(Math.pow(points[i][0]-points[i*1+1][0],2)+Math.pow(points[i][1]-points[i*1+1][1],2)+Math.pow(points[i][2]-points[i*1+1][2],2));
	}
	return totalLengthPow;
}

function getDistanceWithPoints(point1,point2)
{
	var distance;
	distance = Math.pow((point2[0]-point1[0]),2) + Math.pow((point2[1]-point1[1]),2) + Math.pow((point2[2]-point1[2]),2);
	distance = Math.sqrt(distance);
	return distance;
}

function get2DDistanceWithPoints(point1,point2)
{
	var distance;
	distance = Math.pow((point2[0]-point1[0]),2) + Math.pow((point2[1]-point1[1]),2);
	distance = Math.sqrt(distance);
	return distance;
}

function pointsVertify(point1,point2,point3,point4)//4points detect
{
	if(point1[0]==point2[0]&&point3[0]==point4[0]) //x相同
	{
		//y做比較基準
		var yOrder = [point1[1],point2[1],point3[1],point4[1]];
		var yOrderIndex = [0,0];//max min
		for(var i in yOrder)
		{
			if(i!=0)
			{
				if(yOrder[i]>yOrder[yOrderIndex[0]]) yOrderIndex[0]=i;
				if(yOrder[i]<yOrder[yOrderIndex[1]]) yOrderIndex[1]=i;
			}
		}
		//邏輯是相交如果皆在兩個平面內，則相交四點會由其中同屬一形的兩點包著另兩點
		if((yOrderIndex[0]==0&&yOrderIndex[1]==1)||(yOrderIndex[0]==1&&yOrderIndex[1]==0)||
			(yOrderIndex[0]==2&&yOrderIndex[1]==3)||(yOrderIndex[0]==3&&yOrderIndex[1]==2)) return true;
		else return false;
	}
	else if(point1[1]==point2[1]&&point3[1]==point4[1]) //y相同
	{
		//x做比較基準
		var xOrder = [point1[0],point2[0],point3[0],point4[0]];
		var xOrderIndex = [0,0];//max min
		for(var i in xOrder)
		{
			if(i!=0)
			{
				if(xOrder[i]>xOrder[xOrderIndex[0]]) xOrderIndex[0]=i;
				if(xOrder[i]<xOrder[xOrderIndex[1]]) xOrderIndex[1]=i;
			}
		}
		if((xOrderIndex[0]==0&&xOrderIndex[1]==1)||(xOrderIndex[0]==1&&xOrderIndex[1]==0)||
			(xOrderIndex[0]==2&&xOrderIndex[1]==3)||(xOrderIndex[0]==3&&xOrderIndex[1]==2)) return true;
		else return false;
	}
}

function dynaicAdjust(objAdj)//obj表調整對象，compared表比較對象
{
	for(var j in d3.select("#basicSVG").node().childNodes)//走訪SVG內所有圖形做相交比較
	{
		var id = d3.select("#basicSVG").node().childNodes[j].id;
		if(id=="DA"+objAdj)
			d3.select("#"+id).remove();
	}
	var pointsOfObj = getPointFromPath(objAdj);//逆時針或順時針(同一方向即可)取得點
	var planeFunctionOfObj = getPlaneFunction(pointsOfObj);//OBJ的平面方程式
	var parafunctionsFromObj = [];//OBJ所有邊，兩兩計算的參數式(邊-1條)
	var paraIntersectPointsFromObj = [];//相交線的參數式與OBJ參數式交點
	var waitToGenerate = [];
	for(var i =0 ; i<pointsOfObj.length ; i++)//取所有點，用點兩兩算邊的參數式(必須照順序)
	{
		if(i!=(pointsOfObj.length-1))
		{
			var tempVector = [pointsOfObj[i*1+1][0]-pointsOfObj[i][0],
							pointsOfObj[i*1+1][1]-pointsOfObj[i][1],
							pointsOfObj[i*1+1][2]-pointsOfObj[i][2],];
		}
		else//最後一點連回去起點的參數式
		{
			var tempVector = [pointsOfObj[0][0]-pointsOfObj[i][0],
							pointsOfObj[0][1]-pointsOfObj[i][1],
							pointsOfObj[0][2]-pointsOfObj[i][2],];
		}		
		parafunctionsFromObj[i]=getParafunction(pointsOfObj[i],tempVector);		
	}
	
	for(var j in d3.select("#basicSVG").node().childNodes)//走訪SVG內所有圖形做相交比較
	{
		//reset about obj
		paraIntersectPointsFromObj = [];//相交線的參數式與OBJ參數式交點
		//reset ok

		var targetTagType = d3.select("#basicSVG").node().childNodes[j].tagName;
		var targetName = d3.select("#basicSVG").node().childNodes[j];		
		var comparedObj ;
		if(targetTagType=="rect"||targetTagType=="path"||targetTagType=="ellipse")//確定是畫出來的圖形
		{
			if(targetName.id!="basicSVGBG"&&targetName.id!=objAdj&&targetName.id!="objSelectStroke") 
			{
				if(targetName.id.indexOf("DA")==-1)//別跟DA比 沒有DA才繼續比下去
				{
					comparedObj = targetName.id;
				}
				else continue;
			}
			else continue;
		}
		else continue;

		var pointsOfCompared = getPointFromPath(comparedObj);//取得被比較圖形的點
		var planeFunctionOfCompared = getPlaneFunction(pointsOfCompared);//被比較圖形的平面方程式
		var parafunctionsFromCompared = [];//被比較圖形的邊兩兩構成的參數式(有幾邊就有幾條)
		var paraIntersectPointsFromCompared = [];//相交線的參數式與COM參數式交點

		var intersetLineFunction = getPlaneIntersection(planeFunctionOfObj,planeFunctionOfCompared);//被比較圖形與更動圖形的相交方程式(線)
		if(intersetLineFunction)//iX + jY + kZ + n =0 =>[i,j,k,n]，具相交情況時
		{			
			var intersectParaFunction = intersetLineFunction; 

			for(var i =0 ; i<pointsOfCompared.length ; i++)//取所有點，用點兩兩算邊的參數式(必須照順序)
			{
				if(i!=(pointsOfCompared.length-1))
				{
					var tempVector = [pointsOfCompared[i*1+1][0]-pointsOfCompared[i][0],
										pointsOfCompared[i*1+1][1]-pointsOfCompared[i][1],
										pointsOfCompared[i*1+1][2]-pointsOfCompared[i][2],];
				}
				else//最後一點要連回去起點
				{
					var tempVector = [pointsOfCompared[0][0]-pointsOfCompared[i][0],
										pointsOfCompared[0][1]-pointsOfCompared[i][1],
										pointsOfCompared[0][2]-pointsOfCompared[i][2],];
				}
				parafunctionsFromCompared[i]=getParafunction(pointsOfCompared[i],tempVector);
			}

			for(var i = 0 ; i<parafunctionsFromObj.length;i++)//OBJ與相交線的相交
			{
				//paraFunction 算相交
				var paraIntersect = isParafunctionsIntersect(parafunctionsFromObj[i],intersectParaFunction);
				if(paraIntersect)//具相交的case，回傳的結果是交點
				{
					paraIntersectPointsFromObj.push(i);//要記是哪條線，方便最後切割的時候別重算
					paraIntersectPointsFromObj.push(paraIntersect);
				}				
			}
			for(var i = 0 ; i<parafunctionsFromCompared.length;i++)//COM與相交線的相交
			{
				//paraFunction 算相交
				var paraIntersect = isParafunctionsIntersect(parafunctionsFromCompared[i],intersectParaFunction);
				if(paraIntersect)//具相交的case，回傳的結果是交點
				{
					paraIntersectPointsFromCompared.push(i);//要記是哪條線，方便最後切割的時候別重算
					paraIntersectPointsFromCompared.push(paraIntersect);
				}				
			}

			var vertifyIntersect = [false,false];
			//有兩個交點表示穿過，多個交點表示重合
			if(1)//paraIntersectPointsFromCompared.length==paraIntersectPointsFromObj.length&&paraIntersectPointsFromObj.length==4)
			{
				//穿過的狀態下，用點跟原本的點做連結，算長度判斷是否為在邊上
				//慮到最後理論上只會剩下兩點
				var tempPoints=[];
				for(var j=0;j<=paraIntersectPointsFromObj.length-2;j+=2)
				{						
					var point1Index = paraIntersectPointsFromObj[j];
					var point2Index = paraIntersectPointsFromObj[j];
					if(paraIntersectPointsFromObj[j]==pointsOfObj.length-1)//最尾點的話回來
					{
						point1Index=0;//j???
						point2Index=pointsOfObj.length-1;
					}
					else
					{
						point1Index=paraIntersectPointsFromObj[j];
						point2Index=paraIntersectPointsFromObj[j]*1+1;
					}
					var testLength = getLengthWithPoints([pointsOfObj[point1Index],paraIntersectPointsFromObj[j*1+1],pointsOfObj[point2Index]]);					
					var trueLength = getLengthWithPoints([pointsOfObj[point1Index],pointsOfObj[point2Index]]);
					if(Math.abs(trueLength-testLength)<trueLength*(0.01))//比較點到兩端點長度 可能需要容許值
					{
						tempPoints.push(paraIntersectPointsFromObj[j]);
						tempPoints.push(paraIntersectPointsFromObj[j*1+1]);

						vertifyIntersect[0]=true;
					}
				}
				paraIntersectPointsFromObj = JSON.parse(JSON.stringify(tempPoints));
			}
			if(1)
			{
				//算出交叉點與其兩端點的距離，與兩端點本身距離比較
				var tempPoints=[];
				for(var j=0;j<=paraIntersectPointsFromCompared.length/2;j+=2)
				{						
					var point1Index = paraIntersectPointsFromCompared[j];
					var point2Index = paraIntersectPointsFromCompared[j];
					if(paraIntersectPointsFromCompared[j]==pointsOfCompared.length-1)//最尾點的話回來
					{
						point1Index=j;
						point2Index=pointsOfCompared.length-1;
					}
					else
					{
						point1Index=paraIntersectPointsFromCompared[j];
						point2Index=paraIntersectPointsFromCompared[j]*1+1;
					}
					var testLength = getLengthWithPoints([pointsOfCompared[point1Index],paraIntersectPointsFromCompared[j*1+1],pointsOfCompared[point2Index]]);
					var trueLength = getLengthWithPoints([pointsOfCompared[point1Index],pointsOfCompared[point2Index]]);
					if(Math.abs(trueLength-testLength)<trueLength*(0.01))//比較點到兩端點長度 可能需要容許值
					{
						tempPoints.push(paraIntersectPointsFromCompared[j]);
						tempPoints.push(paraIntersectPointsFromCompared[j*1+1]);
						vertifyIntersect[1]=true;
					}
				}
				paraIntersectPointsFromCompared = JSON.parse(JSON.stringify(tempPoints));
			}
			if(areaInsideVertify(pointsOfObj,paraIntersectPointsFromObj)&&areaInsideVertify(pointsOfCompared,paraIntersectPointsFromCompared))
			if(vertifyIntersect[0]&&vertifyIntersect[1])//皆為true就可以開切了
			{
				//演算法比較，看要切誰，然後取點跟本來的點做切割
				var pointCons1S = paraIntersectPointsFromObj[0];//偶數是index，奇數是點
				var pointCons1E = paraIntersectPointsFromObj[2] != (pointsOfObj.length-1)? paraIntersectPointsFromObj[2]*1+1 : 0;
				var pointCons2S = paraIntersectPointsFromObj[0] != (pointsOfObj.length-1)? paraIntersectPointsFromObj[0]*1+1 : 0;
				var pointCons2E = paraIntersectPointsFromObj[2];

				var upperPointSet=[];
				if(pointsOfObj[pointCons1S][2]==0&&pointsOfObj[pointCons2S][2]==0)//Z軸為0
				{
					pointCons1S = paraIntersectPointsFromCompared[0];//偶數是index，奇數是點
					pointCons1E = paraIntersectPointsFromCompared[2] != (pointsOfObj.length-1)? paraIntersectPointsFromCompared[2]*1+1 : 0;
					pointCons2S = paraIntersectPointsFromCompared[0] != (pointsOfObj.length-1)? paraIntersectPointsFromCompared[0]*1+1 : 0;
					pointCons2E = paraIntersectPointsFromCompared[2];
					if(pointsOfCompared[pointCons1S][2]>pointsOfCompared[pointCons2S][2]) upperPointSet = [pointCons1S,pointCons1E];
					else upperPointSet = [pointCons2S,pointCons2E];

					pointsOfCompared = backTo2DPoints(pointsOfCompared);
					paraIntersectPointsFromCompared = backTo2DPoints(paraIntersectPointsFromCompared);
					waitToGenerate.push("M "+paraIntersectPointsFromCompared[1]+
						    " L "+pointsOfCompared[upperPointSet[0]]+" L "+pointsOfCompared[upperPointSet[1]]+
						    " L "+paraIntersectPointsFromCompared[3]);
				}
				else
				{
					if(pointsOfObj[pointCons1S][2]>pointsOfObj[pointCons2S][2]) upperPointSet = [pointCons1S,pointCons1E];
					else upperPointSet = [pointCons2S,pointCons2E];

					var copyPointsOfObj = JSON.parse(JSON.stringify(pointsOfObj));
					copyPointsOfObj = backTo2DPoints(copyPointsOfObj);
					paraIntersectPointsFromObj = backTo2DPoints(paraIntersectPointsFromObj);
					waitToGenerate.push("M "+paraIntersectPointsFromObj[1]+
						    " L "+copyPointsOfObj[upperPointSet[0]]+" L "+copyPointsOfObj[upperPointSet[1]]+
						    " L "+paraIntersectPointsFromObj[3]);
				}				
			}

		}
	}

	//濾去相同區塊，避免重複產生
	var generateItem = waitToGenerate.filter(function(element, index, arr){
	    return arr.indexOf(element) === index;
	});
	for(var item in generateItem)
	{
		d3.select("#basicSVG").append("path").attr(
		{
			"d":generateItem[item],
			"fill":d3.select("#"+objAdj).attr("fill"),
			"id":"DA"+objAdj,
			'originid':objAdj,
			'onclick': "selectCube($(this).attr('originid'))",
		});
	}
}

function areaInsideVertify(pointsOfShape,points)
{
	var originArea = 0;
	var p2pArea = 0;
	var sidesOfOrigin = [];
	var sidesOfp2p = [];
	var tempSide = [];
	var tempArea = 0;
	for(var i=1 ; i<pointsOfShape.length-1;i++)
	{
		tempSide = [];
		tempSide.push(get2DDistanceWithPoints(pointsOfShape[0],pointsOfShape[i]));
		tempSide.push(get2DDistanceWithPoints(pointsOfShape[0],pointsOfShape[i*1+1]));
		tempSide.push(get2DDistanceWithPoints(pointsOfShape[i],pointsOfShape[i*1+1]));
		originArea = originArea*1 + heronsFormula(tempSide);
	}

	for(var index=1;index<=points.length/2;index+=2)
	{		
		p2pArea = 0;
		for(var i=0 ; i<pointsOfShape.length;i++)
		{			
			tempSide = [];

			if(i==pointsOfShape.length-1)
			{
				tempSide.push(get2DDistanceWithPoints(points[index],pointsOfShape[i]));
				tempSide.push(get2DDistanceWithPoints(points[index],pointsOfShape[0]));
				tempSide.push(get2DDistanceWithPoints(pointsOfShape[i],pointsOfShape[0]));
				//防止在邊上的時候算到連成一條線的圖形
				if(calculateSlopeFromPoints(points[index],pointsOfShape[i]) == calculateSlopeFromPoints(points[index],pointsOfShape[0]))
				{
					continue;
				}
			}	
			else
			{
				tempSide.push(get2DDistanceWithPoints(points[index],pointsOfShape[i]));
				tempSide.push(get2DDistanceWithPoints(points[index],pointsOfShape[i*1+1]));
				tempSide.push(get2DDistanceWithPoints(pointsOfShape[i],pointsOfShape[i*1+1]));
				//防止在邊上的時候算到連成一條線的圖形
				if(calculateSlopeFromPoints(points[index],pointsOfShape[i]) == calculateSlopeFromPoints(points[index],pointsOfShape[i*1+1]))
				{
					continue;
				}
			}					
			p2pArea = p2pArea*1 + heronsFormula(tempSide);		
		}		
		if(!(originArea*0.99<p2pArea && p2pArea<originArea*1.01)) return false;		
	}
	return true;
}

function calculateSlopeFromPoints(point1,point2)
{
	if(point2[1]-point1[1]==0) return -1;
	if(point2[0]-point1[0]==0) return -2;
	return (point2[1]-point1[1])/(point2[0]-point1[0]);
}

function heronsFormula(sides) {

  var sides;
  var nsides = sides.length; //Splits content into array format
  //Convert Array instances to integer values a,b,c
  var a=sides[0];
  var b=sides[1];
  var c=sides[2];

  //Area Calculation
  var s = (a+b+c)*0.5 ; //represents the semiperimeter 
  var area = Math.sqrt(s*(s-a)*(s-b)*(s-c)) //area calculation

      //Result
  //sides = alert("The triangle's area is " + area + " square cm");
  return area;
}

function insideVertify(pointsOfShape,points)//驗證是否在圖形內，用水平XY距離驗證
{
	var originCountX = 0;
	var pointCountX = 0;
	var originCountY = 0;
	var pointCountY = 0;
	for(var i=1;i<=points.length-1;i+=2)
	{
		originCountX = 0;
		pointCountX = 0;
		originCountY = 0;
		pointCountY = 0;
		for(var j in pointsOfShape)
		{
			pointCountX = pointCountX + Math.abs(pointsOfShape[j][0]-points[i][0]);
			pointCountY = pointCountY + Math.abs(pointsOfShape[j][1]-points[i][1]);
			if(j != pointsOfShape.length-1)
			{
				originCountX = originCountX + Math.abs(pointsOfShape[j][0]-pointsOfShape[j*1+1][0]);
				originCountY = originCountY + Math.abs(pointsOfShape[j][1]-pointsOfShape[j*1+1][1]);
			}
			else
			{
				originCountX = originCountX + Math.abs(pointsOfShape[j][0]-pointsOfShape[0][0]);
				originCountY = originCountY + Math.abs(pointsOfShape[j][1]-pointsOfShape[0][1]);				
			}
		}		
		//容許率給原數值平均的1%
		if(Math.abs(pointCountX-originCountX)<=((originCountX+pointCountX)/2*0.01) 
			&& Math.abs(pointCountY-originCountY)<=((originCountY+pointCountY)/2*0.01))
		{
			if(i == points.length-1)
			{
				return true;
			}
		}
		else
		{
			return false;
		}
	}
}

function backTo2DPoints(points)
{
	for(var i in points)
	{
		points[i] = [points[i][0],points[i][1]];
	}
	return points;
}

function zValueInput()
{
	if(document.getElementById("obsZ1").value!=""&&document.getElementById("obsZ2").value!="")
	{
		d3.select("#"+nowSelected).attr("z1",null).attr("z2",null).attr("z3",null).attr("z4",null);
		d3.select("#"+nowSelected).attr("z1",document.getElementById("obsZ1").value).attr("z2",document.getElementById("obsZ2").value);
		dynaicAdjust(nowSelected);
	}
	else if(document.getElementById("obsZ3").value!=""&&document.getElementById("obsZ4").value!="")
	{
		d3.select("#"+nowSelected).attr("z1",null).attr("z2",null).attr("z3",null).attr("z4",null);
		d3.select("#"+nowSelected).attr("z3",document.getElementById("obsZ3").value).attr("z4",document.getElementById("obsZ4").value);
		dynaicAdjust(nowSelected);
	}
}

function zValueTest(value1,value2)
{
	d3.select("#"+nowSelected).attr("z3",value1).attr("z4",value2);
}