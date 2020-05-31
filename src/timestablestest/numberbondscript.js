/**
 * Written by Gary Smith, gary@meteorsoftware.co.uk
 * Load in jQuery
 * @type {HTMLScriptElement}
 */
    document.title = "Number Bonds by Gary";

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
    let compliment;
    for (let i = 0; i < selectedOptions.length; i++) {
        for (let j = selectedOptions[i]; j > 0; j--) {
            compliment = selectedOptions[i] - j;
            mapKeyId = selectedOptions[i] - compliment + "_" + compliment;
            console.log("MKID:" + mapKeyId);
            console.log("j = " + j);
            console.log("compliment: " + compliment);
            console.log("selectedOptions[i]" + selectedOptions[i]);
            let q = {
                mapKey: mapKeyId,
                optionNumber: j,
                rangeNumber: compliment,
                correctAnswer: j + compliment,
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
    let input = document.getElementById("answer");

// Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("submitAnswer").click();
        }
    });
}

/**
 * Adds the elements to the div for the options the user can select
 * Created 23rd May 2020
 */
function populateOptions(){
    var options = ["5 Bonds", "6 Bonds", "7 Bonds", "8 Bonds", "9 Bonds", "10 Bonds", "11 Bonds", "12 Bonds"];
    var optionsDiv = document.getElementById("chkBoxes");

    for(var i=0; i < options.length; i++){
        var checkBox = document.createElement("input");
        var label = document.createElement("label");
        var idLbl = document.createElement("id");
        checkBox.type = "checkbox";
        checkBox.value = options[i];
        checkBox.id = "chkBoxBond" + (i + 5);   //Starts at 5..
        optionsDiv.appendChild(checkBox);
        optionsDiv.appendChild(label);
        optionsDiv.appendChild(idLbl);
        label.appendChild(document.createTextNode(options[i]));
    }
    document.getElementById("initialChoices").style.display = "block";
    //document.getElementById("maxNumber").value = 12;
}

/**
 * Add chosen items to array of selectedOptions
 * Created 23rd May 2020
 */
function finaliseChoices(){
    let firstOption = 5;
    let lastOption = 12;
    for(let i=firstOption; i<(lastOption + 1); i++){
        let chkBoxString = "chkBoxBond" + i;
        questionOptions[i] = document.getElementById(chkBoxString);
    }

    let indx = 0;
     for(let k=firstOption; k<(lastOption + 1); k++){
         if (questionOptions[k].checked){
             selectedOptions[indx]=k;
             console.log(selectedOptions[indx]);
             indx += 1;
         }
     }
    //Hide the div where initial choices were made.
     document.getElementById("initialChoices").style.display = "none";

    addVisibleTable();
}

/**
 * Add selected items to visible row
 * Created 23rd May 2020
 */
function addVisibleTable(){
    let tab;
    let tbo;
    let row;
    let cell;
    if (selectedOptions.length > 0) {
        row = [];
        cell = [];

        tab = document.createElement('table');
        tab.setAttribute('id', 'newtable');
        tab.setAttribute('border', 1);
        tbo = document.createElement('tbody');

        for (let c = 0; c < selectedOptions.length; c++) {
            row[c] = document.createElement('tr');
            for(let k=selectedOptions[c]; k > 0; k--){
                cell[k] = document.createElement('td');
                let cont = document.createTextNode(k + ' + ' + (selectedOptions[c] - k));
                cell[k].setAttribute("id", k + '_' + (selectedOptions[c] - k));
                cell[k].appendChild(cont);
                row[c].appendChild(cell[k]);
            }
            tbo.appendChild(row[c]);
        }

        tab.appendChild(tbo);
        document.getElementById('mytable').appendChild(tab);
        document.getElementById("mytable").style.display = "block";
    } else {
        alert("Please choose which times tables to display");
    }
    startUp();
}

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

        document.getElementById("questionText").innerHTML = randomQuestion.optionNumber + ' + ' + randomQuestion.rangeNumber;

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
        //Hide 'check answer button
        document.getElementById("submitAnswer").style.display = "none";
        // Add option to email data to parent!
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
    generateQuestionFromUnanswered();
    //hide 'Next question' button.
    document.getElementById("genQuestion").style.display = "none";
    //Set focus on Entry field
    document.getElementById("answer").focus();
}

function updateStatus(){
    /**
     * Use current question. getCurrentQuestion();
     * Update successMessage, post into status
     * Update % complete, % correct, add to status
     * Update grid.
     */
    let outputMessage;
    let found = getCurrentQuestion();
    console.log(found);
    let currentCell = getTableCell();
    if (found.answeredCorrectly === true && found.answeredInTime === true){
        outputMessage = "Correct!, well done!";
        currentCell.style.backgroundColor = "green";
        }
    if (found.answeredCorrectly === true && found.answeredInTime === false){
        outputMessage = "Correct, just took a bit longer";
        currentCell.style.backgroundColor = "orange";
    }
    if (found.answeredCorrectly === false){
        outputMessage = "Sorry, wrong answer";
        currentCell.style.backgroundColor = "red";
    }
    //Get statistics
    let numberAnswered = outStandingQuestions.length - getNumberOfRemainingQuestions();
    let percentageAnswered = 100 * numberAnswered / outStandingQuestions.length;
    let numberCorrect = outStandingQuestions.filter(function (question) {
        return question.answeredCorrectly === true;
    }).length;
    let percentageCorrect = 100 * numberCorrect / outStandingQuestions.length;
    let successMessage = outputMessage; //+ "<br>Answered: " + numberAnswered + ", " + percentageAnswered + "complete. <br> Correct: " + numberCorrect + ", " + percentageCorrect + " perc";
    if (found.answered === false) { document.getElementById("statusText").innerHTML = "Question not yet answered"}
    if (found.answered === true) { document.getElementById("statusText").innerHTML = successMessage };
    let elem = document.getElementById("myBar");
    elem.style.width = Math.floor(percentageAnswered) + '%';
    elem.innerHTML = Math.floor(percentageAnswered) * 1 + '%';
    let correctBar = document.getElementById("correctBar");
    correctBar.style.width = Math.floor(percentageCorrect) + '%';
    correctBar.innerHTML = Math.floor(percentageCorrect) * 1 + '%';
}

function getTableCell(){
    let found = getCurrentQuestion();
    let tableCell = document.getElementById(found.mapKey);
    return tableCell;
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