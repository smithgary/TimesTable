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
    let currentI; //private Integer currentI;
let currentJ; //private Integer currentJ;;
let indexCurrent;
// let ans; //private Integer ans;
let questionOptions = []; //holds the numbers to choose from // 2020-05-23
let selectedOptions = []; // holds the list of chosen numbers to use // 2020-05-23
let answers = [[],[]]; //private Integer [][] answers;
let passFail = [[],[]]; //private Boolean [][] passFail;
let asked = [[],[]]; //private Boolean [][] asked;
let answeredInTime = [[],[]]; //private Boolean [][] answeredInTime;

let sumCounted; //private Double sumCounted;
// let sumCorrect;
// let percentageCounted; //private Double percentageCounted;
// let percentageCorrect; //private Double percentageCorrect;
//
// let gridSize; //private Integer gridSize;

/**
 * Initialise the data arrays holding information.
 * Needs to be called by populateOptions, once the details of the rows is known
 */
function startUp(){
    sumCounted = 0; //what's this?
    let strgOut = ""; // for test
    let mapKey = "";
    //initialise arrays

    for(let i=0;i<selectedOptions.length;i++){
            //answers.push([0]);
            //passFail.push([false]);
            //asked.push([false]);
            //answeredInTime.push([false]);
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
                    answeredInTime: false,
                    answeredCorrectly: false};

                outStandingQuestions.push(q);
            }
    }
}
            
    function testArray(){
        generateRandomQuestion();
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

    // function answeredInTime(){
    //     //Called by timer, triggered when question is created and not answered within given time period
    //     //get active question;
    //     answeredInTime[currentI][currentJ] = false;
    // }

/**
 * Add chosen items to array of selectedOptions
 * Created 23rd May 2020
 */
function finaliseChoices(){
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
        console.log(mKId);
        //Set outStandingQuestions, with mapKey = mkId, asked = true;

        document.getElementById("questionText").innerHTML = randomQuestion.optionMultiple + ' X ' + randomQuestion.rangeMultiple;

        //Update outStandingQuestions, set asked = true.
        let found = outStandingQuestions.find(element => element.mapKey === mKId);
        found.asked = true;
        let foundIndex = outStandingQuestions.findIndex(element => element.mapKey === mKId);
        console.log(foundIndex);
        outStandingQuestions[foundIndex] = found;

        qsRemaining = getNumberOfRemainingQuestions();

        console.log(qsRemaining);
        //Begin timer for 8s, upon which time call function to set answeredInTime to false;
        //window.setTimeout(answeredInTime, 8000);
    }else
    {
        document.getElementById("questionText").innerHTML = 'All Questions answered';
    }
        /*
        mapKey: mapKeyId,
                    optionMultiple: selectedOptions[i],
                    rangeMultiple: jOffset,
                    correctAnswer: selectedOptions[i] * jOffset,
                    responseAnswer: 0,
                    asked: false,
                    answered: false,
                    answeredInTime: false,
                    answeredCorrectly: false};
         */
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
function generateRandomQuestion(){
    let totalElement = selectedOptions.length * maxTimes;
    let selectedIndex = "";
    let numberOfSelected = 1;
    let uniqueCalcFound = false;
    outerloop:
        do{
            for(let indx=0; indx<numberOfSelected; indx++){
                let indexToSelect = Math.floor((Math.random() * totalElement));
                const tmpValOf = selectedIndex.indexOf(indexToSelect.valueOf());
                //JAVASCRIPT>>>
                //indexOf returns the position the position of the first occurence of a specified string in a string
                //, returns -1 if not found
                //valueOf returns the primitive value of a string..?
                //JAVA valueOf returns the string representation of the char, data etc. element
                while(selectedIndex.indexOf(indexToSelect.valueOf())>0){
                    indexToSelect = Math.floor((Math.random()*totalElement));
                }

                selectedIndex = selectedIndex + indexToSelect;
                indexCurrent = indexToSelect; //Allow use by other functions.
                xIndex = Math.floor(indexToSelect/asked.length);
                yIndex = indexToSelect%asked.length;
                document.getElementById("statusText").innerHTML =
                    "Total Elements: " + totalElement +
                    ", Asked.Length: " + asked.length +
                    ", Asked[0].Length: " + asked[0].length +
                    ", XIndex: " + xIndex +
                    ", YIndex: " + yIndex +
                    ", SelectedIndex: " + selectedIndex +
                    ", IndexToSelect: " + indexToSelect +
                    ", ValOf: " + tmpValOf;
                //alert("Fist and Second are: " + xIndex + " " + yIndex);
                if(asked[xIndex][yIndex]===false){
                    currentI = xIndex;
                    currentJ = yIndex;

                    document.getElementById("questionText").innerHTML = xIndex + ' X ' + yIndex;
                    uniqueCalcFound = true;
                    //Begin timer for 8s, upon which time call function to set answeredInTime to false;
                    window.setTimeout(answeredInTime, 8000);
                    break outerloop;
                }
            }
        }while (uniqueCalcFound !== true);
}

// function generateRandomQuestion(){
//     var totalElement = asked.length * asked[0].length;
//     var selectedIndex = "";
//     var numberOfSelected = 1;
//     var uniqueCalcFound = false;
//     outerloop:
//             do{
//                 for(var indx=0; indx<numberOfSelected;indx++){
//                     //if(sumCounted>(gridSize * gridSize -2)){
//                     //alert("Reached second from last");
//                     //break outerloop;
//                     //}
//
//                     var indexToSelect = Math.floor((Math.random()* totalElement));
//                     var tmpValOf = selectedIndex.indexOf(indexToSelect.valueOf());
//                     //JAVASCRIPT>>>
//                     //indexOf returns the position the position of the first occurence of a specified string in a string
//                     //, returns -1 if not found
//                     //valueOf returns the primitive value of a string..?
//                     //JAVA valueOf returns the string representation of the char, data etc. element
//                     while(selectedIndex.indexOf(indexToSelect.valueOf())>0){
//                         indexToSelect = Math.floor((Math.random()*totalElement));
//                     }
//
//                     selectedIndex = selectedIndex + indexToSelect;
//                     indexCurrent = indexToSelect; //Allow use by other functions.
//                     xIndex = Math.floor(indexToSelect/asked.length);
//                     yIndex = indexToSelect%asked.length;
//                     document.getElementById("statusText").innerHTML =
//                             "Total Elements: " + totalElement +
//                             ", Asked.Length: " + asked.length +
//                             ", Asked[0].Length: " + asked[0].length +
//                             ", XIndex: " + xIndex +
//                             ", YIndex: " + yIndex +
//                             ", SelectedIndex: " + selectedIndex +
//                             ", IndexToSelect: " + indexToSelect +
//                             ", ValOf: " + tmpValOf;
//                     //alert("Fist and Second are: " + xIndex + " " + yIndex);
//                     if(asked[xIndex][yIndex]===false){
//                         currentI = xIndex;
//                         currentJ = yIndex;
//
//                         document.getElementById("questionText").innerHTML = xIndex + ' X ' + yIndex;
//                         uniqueCalcFound = true;
//                         //Begin timer for 8s, upon which time call function to set answeredInTime to false;
//                         window.setTimeout(answeredInTime, 8000);
//                         break outerloop;
//                     }
//                 }
//             }while (uniqueCalcFound !== true);
// }

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