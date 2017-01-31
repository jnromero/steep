function showQuestionnaire(subjectID,payoff){
    clearAll();
    makeDropdown("genderSelect",100,[['male',"Male"],['female','Female']]);
    makeDropdown("ageSelect",175,[['16',"Under 17"],['17','17'],['18','18'],['19','19'],['20','20'],['21','21'],['22','22'],['23','23'],['24','24'],['25','25'],['26','Over 25']]);
    makeDropdown("majorSelect",250,[['economics',"Economics"],['business','Other Business'],['engineering','Engineering'],['science','Science'],['other','Other']]);
    makeDropdown("yearSelect",325,[['1',"1"],['2','2'],['3','3'],['4','4'],['5','5'],['6','6+']]);
    makeDropdown("microSelect",400,[['yes',"Yes"],['no','No']]);
    makeDropdown("gameTheorySelect",475,[['yes',"Yes"],['no','No']]);
    makeDropdown("gpaSelect",550,[['4.0','4.0'],['3.9','3.9'],['3.8','3.8'],['3.7','3.7'],['3.6','3.6'],['3.5','3.5'],['3.4','3.4'],['3.3','3.3'],['3.2','3.2'],['3.1','3.1'],['3.0','3.0'],['2.9','2.9'],['2.8','2.8'],['2.7','2.7'],['2.6','2.6'],['2.5','2.5'],['2.4','2.4'],['2.3','2.3'],['2.2','2.2'],['2.1','2.1'],['2.0','2.0'],['1.9','1.9'],['1.8','1.8'],['1.7','1.7'],['1.6','1.6'],['1.5','1.5'],['1.4','1.4'],['1.3','1.3'],['1.2','1.2'],['1.1','1.1'],['1.0','1.0'],['0.9','0.9'],['0.8','0.8'],['0.7','0.7'],['0.6','0.6'],['0.5','0.5'],['0.4','0.4'],['0.3','0.3'],['0.2','0.2'],['0.1','0.1']]);

    titles=[["genderSelectTitle","Gender:"],["ageSelectTitle","Age:"],["majorSelectTitle","Major:"],["yearSelectTitle","Academic Year:"],["microSelectTitle","Have you taken Intermediate Micro (ECON 361)?:"],["gameTheorySelectTitle","Have you taken Game Theory (ECON 431)?:"],["gpaSelect","What is your GPA?:"]];
    for(title in titles){
        dropdownTitle(titles[title][0],100+75*title,titles[title][1])
    }

    makeTextTitle("strategyTitle",50,"What type of strategy did you use for this experiment?");
    makeTextBox("strategyText",100);
    makeTextTitle("strategyTitle",300,"Was there anything that you especially liked about this experiment?");
    makeTextBox("likedText",350);
    makeTextTitle("strategyTitle",550,"Was there anything that was confusing to you in this expeirment");
    makeTextBox("confusedText",600);
    makeButton();
    document.getElementById("submitButton").addEventListener("click",checkIfAnswersComplete,[["genderSelect","ageSelect","majorSelect","yearSelect","microSelect","gameTheorySelect","gpaSelect","strategyText","likedText","confusedText"]]);


	var select = document.createElement("p");
	select.id="subjectIDLabelQuestionnaire";
	select.innerHTML="subjectID: "+subjectID;
	document.getElementById('mainDiv').appendChild(select);
	var select = document.createElement("p");
	select.id="payoffLabelQuestionnaire";
	select.innerHTML="Earnings: \$"+payoff;
	document.getElementById('mainDiv').appendChild(select);



}



function checkIfAnswersComplete(args){
	var ids=args[0];
    console.log(ids);
	incomplete=0;
	answers={}
	for(id in ids){
		answers[ids[id]]=document.getElementById(ids[id]).value;
		if(document.getElementById(ids[id]).value==""){
			incomplete=1;
		}
	}
	if(incomplete==1){
		alert("Please answer all questions.");
	}
	else{
		var message={"type":"questionnaireAnswers","answers":answers};
        sendMessage(message);
	}
}



function makeButton(incoming){
    if(incoming['backgroundColor']==undefined){incoming['backgroundColor']="rgba(0,255,0,.3)"}
    if(incoming['height']==undefined){incoming['height']="100px"}
    if(incoming['width']==undefined){incoming['height']="200px"}
    if(incoming['left']==undefined){incoming['left']="300px"}
    if(incoming['top']==undefined){incoming['top']="700px"}
    if(incoming['fontSize']==undefined){incoming['fontSize']="150%"}
    if(incoming['lineHeight']==undefined){incoming['lineHeight']="150%"}
    if(incoming['id']==undefined){incoming['id']="submitButton"}
    if(incoming['top']==undefined){incoming['top']="50px"}
    if(incoming['title']==undefined){incoming['title']="Submit"}
    if(incoming['listOfIds']==undefined){incoming['listOfIds']=[]}
    var submitButton = createAndAddElement("button",incoming['id'],"mainDiv");
    submitButton.innerHTML=incoming['title'];
    submitButton.style.top=incoming['top'];
    submitButton.style.position="absolute";
    submitButton.style.width=incoming['width'];
    submitButton.style.height=incoming['height'];
    submitButton.style.fontSize=incoming['fontSize'];
    submitButton.style.lineHeight=incoming['lineHeight'];
    submitButton.style.left=incoming['left'];
    submitButton.style.backgroundColor=incoming['backgroundColor'];
    clickButton("many",incoming['id'],checkIfAnswersComplete,[incoming['listOfIds']]);
}

function makeTextBox(incoming){
    if(incoming['left']==undefined){incoming['left']="800px"}
    if(incoming['fontSize']==undefined){incoming['fontSize']="150%"}
    if(incoming['width']==undefined){incoming['width']="600px"}
    if(incoming['height']==undefined){incoming['height']="150px"}
    if(incoming['lineHeight']==undefined){incoming['lineHeight']="150%"}
    if(incoming['width']==undefined){incoming['width']="200px"}
    if(incoming['id']==undefined){incoming['id']="randomID"}
    if(incoming['top']==undefined){incoming['top']="50px"}
    var select = createAndAddElement("textarea",incoming['id'],"mainDiv");
    select.style.top=incoming['top'];
    select.style.position="absolute";
    select.style.width=incoming['width'];
    select.style.height=incoming['height'];
    select.style.fontSize=incoming['fontSize'];
    select.style.lineHeight=incoming['lineHeight'];
    select.style.left=incoming['left'];
    select.style.top=incoming['top'];
    select.style.resize="none";
    select.value="";
}

function makeTextTitle(incoming){
    if(incoming['left']==undefined){incoming['left']="800px"}
    if(incoming['fontSize']==undefined){incoming['fontSize']="150%"}
    if(incoming['width']==undefined){incoming['width']="900px"}
    if(incoming['height']==undefined){incoming['height']="150px"}
    if(incoming['lineHeight']==undefined){incoming['lineHeight']="150%"}
    if(incoming['width']==undefined){incoming['width']="200px"}
    if(incoming['id']==undefined){incoming['id']="randomID"}
    if(incoming['top']==undefined){incoming['top']="50px"}
    if(incoming['title']==undefined){incoming['title']="Some Title Here"}
    var select = createAndAddElement("p",incoming['id'],"mainDiv");
    select.style.position="absolute";
    select.style.width=incoming['width'];
    select.style.height=incoming['height'];
    select.style.fontSize=incoming['fontSize'];
    select.style.lineHeight=incoming['lineHeight'];
    select.style.left=incoming['left'];
    select.style.top=incoming['top'];
    select.style.resize="none";
    select.innerHTML=incoming['title'];
}


function makeDropdown(incoming){
    if(incoming['left']==undefined){incoming['left']="400px"}
    if(incoming['fontSize']==undefined){incoming['fontSize']="150%"}
    if(incoming['width']==undefined){incoming['width']="200px"}
    if(incoming['id']==undefined){incoming['id']="randomID"}
    if(incoming['top']==undefined){incoming['top']="50px"}
    if(incoming['options']==undefined){incoming['options']=[["yes","yes"],["no","No"]]}
    var select = createAndAddElement("select",incoming['id'],"mainDiv");
    select.style.top=incoming['top'];
    select.style.position="absolute";
    select.style.left=incoming['left'];
    select.style.fontSize=incoming['fontSize'];
    select.style.width=incoming['width'];
    blank=[['','']]
    incoming['options']=blank.concat(incoming['options']);
    for(k=0;k<incoming['options'].length;k++){
        var option = createAndAddElement("option","option_"+incoming['id']+"_"+k,incoming['id']);
	    option.value=incoming['options'][k][0];
	    option.innerHTML=incoming['options'][k][1];
    }
}

function dropdownTitle(incoming){
    if(incoming['id']==undefined){incoming['id']="randomID"}
    if(incoming['top']==undefined){incoming['top']="50px"}
    if(incoming['title']==undefined){incoming['title']="Some Title Here"}
    if(incoming['left']==undefined){incoming['left']="90px"}
    if(incoming['fontSize']==undefined){incoming['fontSize']="150%"}
    if(incoming['width']==undefined){incoming['width']="300px"}
    if(incoming['textAlign']==undefined){incoming['textAlign']="right"}
    var select = createAndAddElement("p",incoming['id'],"mainDiv");
    select.style.top=incoming['top'];
    select.innerHTML=incoming['title'];
    select.style.position="absolute";
    select.style.left=incoming['left'];
    select.style.fontSize=incoming['fontSize'];
    select.style.width=incoming['width'];
    select.style.textAlign=incoming['textAlign'];
}

