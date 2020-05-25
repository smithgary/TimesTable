/**
 * Load in jQuery
 * @type {HTMLScriptElement}
 */
    var s = document.createElement("script");
    s.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
    //s.onload = function(e){alert("loaded")}
    document.head.appendChild(s);
    document.head.innerHTML += "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script>";
    document.title = "Times table by Gary";
    /**
     * Global variables, used across functions
     */
    let maxTimes;
    let outStandingQuestions = [];
    let currentQuestionId;
    let timeLimit = 8000;

    let questionOptions = []; //holds the numbers to choose from // 2020-05-23
    let selectedOptions = []; // holds the list of chosen numbers to use // 2020-05-23


/**
 * Initialise the data arrays holding information.
 * Needs to be called by populateOptions, once the details of the rows is known
 */
function startUp(){

    let mapKeyId;
    let jOffset;
    for (let i = 0; i < selectedOptions.length; i++) {

        for (let j = 0; j < maxTimes; j++) {
            jOffset = j + 1;
            mapKeyId = selectedOptions[i] + "_" + jOffset;
            let q = {
                mapKey: mapKeyId,
                optionMultiple: selectedOptions[i],
                rangeMultiple: jOffset,
                correctAnswer: selectedOptions[i] * jOffset,
                responseAnswer: 0,
                asked: false,
                answered: false,
                answeredStart: new Date(),
                answeredEnd: new Date(),
                answeredInTime: false,
                answeredCorrectly: false
            };
            outStandingQuestions.push(q);
        }
    }
}
            
    function testArray(){
        //generateRandomQuestion();
        generateQuestionFromUnanswered();
    }

    function askQuestion(){
        window.setTimeout(testArray, 12000);
    }

    /**
     * Adds the elements to the div for the options the user can select
     * Created 23rd May 2020
     */
    function populateOptions(){
        var options = ["2 Times", "3 Times", "4 Times", "5 Times", "6 Times", "7 Times", "8 Times", "9 Times", "10 Times", "11 Times", "12 Times"];
        var optionsDiv = document.getElementById("chkBoxes");

        for(var i=0; i < options.length; i++){
            var checkBox = document.createElement("input");
            var label = document.createElement("label");
            var idLbl = document.createElement("id");
            checkBox.type = "checkbox";
            checkBox.value = options[i];
            checkBox.id = "chkBoxTimes" + (i + 2);
            optionsDiv.appendChild(checkBox);
            optionsDiv.appendChild(label);
            optionsDiv.appendChild(idLbl);
            label.appendChild(document.createTextNode(options[i]));
        }
    }

/**
 * Add chosen items to array of selectedOptions
 * Created 23rd May 2020
 */
function finaliseChoices(){
    //TODO replace with dynamic fill
    questionOptions[2] = document.getElementById("chkBoxTimes2");
    questionOptions[3] = document.getElementById("chkBoxTimes3");
    questionOptions[4] = document.getElementById("chkBoxTimes4");
    questionOptions[5] = document.getElementById("chkBoxTimes5");
    questionOptions[6] = document.getElementById("chkBoxTimes6");
    questionOptions[7] = document.getElementById("chkBoxTimes7");
    questionOptions[8] = document.getElementById("chkBoxTimes8");
    questionOptions[9] = document.getElementById("chkBoxTimes9");
    questionOptions[10] = document.getElementById("chkBoxTimes10");
    questionOptions[11] = document.getElementById("chkBoxTimes11");
    questionOptions[12] = document.getElementById("chkBoxTimes12");

    maxTimes = 12; //document.getElementById("tb1").value;

    let maxTimesOffset = maxTimes + 1;
    let indx = 0;
    let strg = ""; //testing remove later.
     for(let k=2; k< maxTimesOffset; k++){
         if (questionOptions[k].checked){
             selectedOptions[indx]=k;
             indx += 1;
             strg += k + " "; //used for testing
         }
     }
    //Remove this
    document.getElementById("statusText").innerHTML = "No of Selected Items: " + selectedOptions.length
    + ", which were: " + strg;
     //to here.. used for testing
    //Initialise the data for background calculations as well.
    //startUp();
}

/**
 * Add selected items to visible row
 * Created 23rd May 2020
 */
function addVisibleTable(){
    let tab; //table
    let tbo; //table body
    let row; //table row
    let cell; // cell within row

    if (selectedOptions.length > 0) {
        row = [];
        cell = [];

        tab = document.createElement('table');
        tab.setAttribute('id', 'newtable');
        tab.setAttribute('border',1);
        tbo = document.createElement('tbody');

        for (let c = 0; c < selectedOptions.length; c++) {
            row[c] = document.createElement('tr');

            for (let k = 0; k < maxTimes; k++) {
                let l = k + 1;
                cell[k] = document.createElement('td');
                let cont = document.createTextNode(selectedOptions[c] + ' x ' + l);
                cell[k].appendChild(cont);
                row[c].appendChild(cell[k]);
            }
            tbo.appendChild(row[c]);
        }

        tab.appendChild(tbo);
        document.getElementById('mytable').appendChild(tab);
    } else {
        alert("Please choose which times tables to display");
    }
}

function changeColour(){
    //Written by Gary Smith copyright Sperringold.com
    var b = document.getElementById("colr").value;
    var x = document.getElementById('mytable').getElementsByTagName('td');
    if(b < 10) x[b].style.backgroundColor = "yellow";
    if(b < 20 && b > 10) x[b].style.backgroundColor = "green";
    if(b > 20) x[b].style.backgroundColor = "red";

}
// function getTotalQuestions(){
//     let totalElements = asked.length * asked[0].length;
// }
function generateQuestionFromUnanswered(){
    let qsRemaining = getNumberOfRemainingQuestions();
    if (qsRemaining > 0) {
        //Get a random question from a filtered list, where asked is false
        let randomQuestion = getRandomItem(outStandingQuestions.filter(function (question) {
            return question.asked === false;
        }));
        console.log(randomQuestion);

        let mKId = randomQuestion.mapKey;
        //Set the 'global' variable for the current question
        currentQuestionId = mKId;
        console.log(mKId);
        //Set outStandingQuestions, with mapKey = mkId, asked = true;

        document.getElementById("questionText").innerHTML = randomQuestion.optionMultiple + ' X ' + randomQuestion.rangeMultiple;

        //Update outStandingQuestions, set asked = true.
        let found = outStandingQuestions.find(element => element.mapKey === mKId);
        found = getCurrentQuestion();
        found.asked = true;
        found.answeredStart = new Date();
        let foundIndex = outStandingQuestions.findIndex(element => element.mapKey === mKId);
        console.log(foundIndex);
        outStandingQuestions[foundIndex] = found;

        qsRemaining = getNumberOfRemainingQuestions();

        console.log(qsRemaining);
    }else
    {
        document.getElementById("questionText").innerHTML = 'All Questions answered';
    }
}


function getNumberOfRemainingQuestions(){
    return outStandingQuestions.filter(function(question){
        return question.asked === false;
    }).length
}
function getRandomItem(set) {
    let items = Array.from(set);
    return items[Math.floor(Math.random() * items.length)];
}
function calculate(){
    let ans = document.getElementById("answer").value;

    let x = document.getElementById('mytable').getElementsByTagName('td');
    //Get the current question being answered
    let found = getCurrentQuestion();
        found.answered = true;
        found.answeredEnd = new Date();
        found.responseAnswer = parseInt(ans);
        let timeToAnswer = found.answeredEnd - found.answeredStart;
            if (timeToAnswer <= timeLimit){found.answeredInTime = true}
            if (parseInt(ans) === found.correctAnswer){found.answeredCorrectly = true}
    let foundIndex = getCurrentIndex();
        console.log(foundIndex);
        outStandingQuestions[foundIndex] = found;
        console.log(outStandingQuestions[foundIndex]);
    updateStatus();
    clearResponse();
}

function updateStatus(){
    /**
     * Use current question. getCurrentQuestion();
     * Update successMessage, post into status
     * Update % complete, % correct, add to status
     * Update grid.
     */
    let msgDestination = document.getElementById("statusText").innerHTML;
    let found = getCurrentQuestion();
    if (found.answeredCorrectly && found.answeredInTime){msgDestination = "Question not yet answered";}
    if (found.answeredCorrectly && !found.answeredInTime){msgDestination = "Correct, just took a bit longer";}
    let numberAnswered = outStandingQuestions.length - getNumberOfRemainingQuestions();
    let percentageAnswered = 100 * numberAnswered / outStandingQuestions.length;
    let numberCorrect = outStandingQuestions.filter(function (question) {
        return question.answeredCorrectly === true;
    }).length;
    let percentageCorrect = 100 * numberCorrect / outStandingQuestions.length;
    let successMessage = "Answered: " + numberAnswered + ", " + percentageAnswered + "complete. <br> Correct: " + numberCorrect + ", " + percentageCorrect + " perc";
    if (found.answered != true)
        {
            document.getElementById("statusText").innerHTML = "Question not yet answered"
        }else
            {
                document.getElementById("statusText").innerHTML = successMessage
            };
}

function getCurrentQuestion(){
    let found = outStandingQuestions.find(element => element.mapKey === currentQuestionId);
    return found;
}
function getCurrentIndex(){
    let foundIndex = outStandingQuestions.findIndex(element => element.mapKey === currentQuestionId);
    return foundIndex;
}
function clearResponse(){
    document.getElementById("answer").value = "";
}

// function calculateStatus(){
//     sumCounted = 0;
//     sumCorrected = 0;
//     for(var i=0;i<gridSize; i++){
//         for (var j=0;j<gridSize;j++){
//             if(asked[i][j] === true){
//                 sumCounted ++;
//             }
//             if(passFail[i][j] === true){
//                 sumCorrect ++;
//             }
//         }
//     }
//     percentageCounted = 100 * sumCounted / (asked.length * asked[0].length);
//     percentageCorrect = 100 * sumCorrect / (asked.length * asked[0].length);
// }

// function calculate(){
//     ans = document.getElementById("answer").value;
//     var successMessage;
//     var x = document.getElementById('mytable').getElementsByTagName('td');
//     asked[currentI][currentJ] = true;
//     //answerTimer.stop();
//     if (ans === currentI * currentJ){
//         passFail[currentI][currentJ] = true;
//         if (answeredInTime[currentI][currentJ] === true){
//             successMessage = "You are correct";
//             x[indexCurrent].style.backgroundColor = "green";
//         }else{
//             successMessage = "You are correct, but you had to think about it!";
//             x[indexCurrent].style.backgroundColor = "orange";
//         }
//
//     } else{
//         successMessage = "You're wrong this time";
//         passFail[currentI][currentJ] = false;
//         x[indexCurrent].style.backgroundColor = "red";
//     }
// }