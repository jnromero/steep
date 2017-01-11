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
    document.getElementById("submitButton").addEventListener("click",checkIfAnswersComplete);


	var select = document.createElement("p");
	select.id="subjectIDLabelQuestionnaire";
	select.innerHTML="subjectID: "+subjectID;
	document.getElementById('mainDiv').appendChild(select);
	var select = document.createElement("p");
	select.id="payoffLabelQuestionnaire";
	select.innerHTML="Earnings: \$"+payoff;
	document.getElementById('mainDiv').appendChild(select);



}



function checkIfAnswersComplete(){
	ids=["genderSelect","ageSelect","majorSelect","yearSelect","microSelect","gameTheorySelect","gpaSelect","strategyText","likedText","confusedText"]
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


function makeButton(){
    var select = document.createElement("button");
    select.id="submitButton";
    select.innerHTML="Submit";
	document.getElementById('mainDiv').appendChild(select);

}

function makeTextBox(id,top){
    var select = document.createElement("textarea");
    select.className="textEntry";
    select.value="";
    select.id=id;
    select.style.top=top+"px";
	document.getElementById('mainDiv').appendChild(select);
}

function makeTextTitle(id,top,title){
    var select = document.createElement("p");
    select.className="textTitle";
    select.id=id;
    select.innerHTML=title;
    select.style.top=top+"px";
	document.getElementById('mainDiv').appendChild(select);
}


function makeDropdown(id,top,options){
    var select = document.createElement("select");
    select.style.top=top+"px";
    select.id=id;
    select.className="selectItem";
    blank=[['','']]
    options=blank.concat(options);
    console.log(options);
    for(k=0;k<options.length;k++){
	    var option = document.createElement("option");
	    option.value=options[k][0];
	    option.innerHTML=options[k][1];
	    select.appendChild(option);
    }
	document.getElementById('mainDiv').appendChild(select);
}


function dropdownTitle(id,top,title){
    var select = document.createElement("p");
    select.style.top=top+"px";
    select.id=id;
    select.innerHTML=title;
    select.className="selectItemTitle";
	document.getElementById('mainDiv').appendChild(select);
}

