/**
 * Global variables, used across functions
 */
    var currentI; //private Integer currentI;
    var currentJ; //private Integer currentJ;;
    var indexCurrent;
    var ans; //private Integer ans;
    var answers = [[],[]]; //private Integer [][] answers;
    var passFail = [[],[]]; //private Boolean [][] passFail;
    var asked = [[],[]]; //private Boolean [][] asked;
    var answeredInTime = [[],[]]; //private Boolean [][] answeredInTime;
    var labels; // NEEDED?  private JLabel [][] labels;
    var sumCounted; //private Double sumCounted;
    var sumCorrect;
    var percentageCounted; //private Double percentageCounted;
    var percentageCorrect; //private Double percentageCorrect;
    var answerTimer; //private Timer answerTimer;
    var gridSize; //private Integer gridSize;
    function startUp(){
        var a = document.getElementById("tb1").value;
        var row_num = parseInt(a);
        gridSize = row_num; 
        sumCounted = 0;
        //initialise arrays
        for(var i=0;i<gridSize;i++){
            answers.push([0]);
            passFail.push([false]);
            asked.push([false]);
            answeredInTime.push([false]);
            for (var j = 0; j < gridSize; j++) {
                answers [i][j] = i * j;
                passFail [i][j] = false;
                asked [i][j] = false;
                answeredInTime[i][j] = false;
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
     */
    function populateOptions(){
        var options = ["2 Times", "3 Times", "4 Times", "5 Times", "6 Times", "7 Times", "8 Times", "9 Times", "10 Times", "11 Times", "12 Times"];
        var optionsDiv = document.getElementById("chkBoxes");

        for(var i=0; i < options.length; i++){
            var checkBox = document.createElement("input");
            var label = document.createElement("label");
            checkBox.type = "checkbox";
            checkBox.value = options[i];
            optionsDiv.appendChild(checkBox);
            optionsDiv.appendChild(label);
            label.appendChild(document.createTextNode(options[i]));
        }
    }

    function answeredInTime(){
        //Called by timer, triggered when question is created and not answered within given time period
        answeredInTime[currentI][currentJ] = false;
    }
    function createTimesTable(){
        var selectedOptions = new Array();
        var checkedOptions = document.getElementById("chkBoxes");
        for(var k=0; k < checkedOptions.length; k++){
            if (checkedOptions[k].checked === true){
                selectedOptions.push(k);
            }
        }
        document.getElementById("statusText").innerHTML =
            "Selected Items: " + selectedOptions;
    }
    function createTable(){
            //Written by Gary Smith, copyright Sperringold.com July 2018
            //info@sperringold.com
    let chosenTimesTables = new Array();

    var a = document.getElementById("tb1").value;
        if(a===""){
            alert("Please enter some numeric values for table sizes");
            }else{
 
        row=new Array();
        cell=new Array();
 
        row_num=parseInt(a); //edit this value to suit
        cell_num = row_num;
        //cell_num=parseInt(b); //edit this value to suit
 
        tab=document.createElement('table');
        tab.setAttribute('id','newtable');
 
        tbo=document.createElement('tbody');
 
        for(c=0;c<row_num;c++){
            row[c]=document.createElement('tr');
 
                for(k=0;k<cell_num;k++) {
                    cell[k]=document.createElement('td');
                    //cont=document.createTextNode((c+1)*(k+1));
                    cont=document.createTextNode((c + ' x ' + k));
                    cell[k].appendChild(cont);
                    row[c].appendChild(cell[k]);
                }
            tbo.appendChild(row[c]);
        }
        
        tab.appendChild(tbo);
        document.getElementById('mytable').appendChild(tab);//'myTable' is the parent control of your table, change it as per your requirements
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
        function generateRandomQuestion(){
            var totalElement = asked.length * asked[0].length;
            var selectedIndex = "";
            var numberOfSelected = 1;
            var uniqueCalcFound = false;
            outerloop:
                    do{
                        for(var indx=0; indx<numberOfSelected;indx++){
                            //if(sumCounted>(gridSize * gridSize -2)){
                            //alert("Reached second from last");    
                            //break outerloop;
                            //}
                            
                            var indexToSelect = Math.floor((Math.random()* totalElement));
                            var tmpValOf = selectedIndex.indexOf(indexToSelect.valueOf());
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
        function calculateStatus(){
            sumCounted = 0;
            sumCorrected = 0;
            for(var i=0;i<gridSize; i++){
                for (var j=0;j<gridSize;j++){
                    if(asked[i][j] === true){
                        sumCounted ++;
                    }
                    if(passFail[i][j] === true){
                        sumCorrect ++;
                    }
                }
            }
            percentageCounted = 100 * sumCounted / (asked.length * asked[0].length);
            percentageCorrect = 100 * sumCorrect / (asked.length * asked[0].length);
        }
        function calculate(){
            ans = document.getElementById("answer").value;
            var successMessage;
            var x = document.getElementById('mytable').getElementsByTagName('td');
            asked[currentI][currentJ] = true;
            //answerTimer.stop();
            if (ans === currentI * currentJ){
                passFail[currentI][currentJ] = true;
                if (answeredInTime[currentI][currentJ] === true){
                    successMessage = "You are correct";
                    x[indexCurrent].style.backgroundColor = "green"; 
                }else{
                    successMessage = "You are correct, but you had to think about it!";
                    x[indexCurrent].style.backgroundColor = "orange"; 
                }
                
            } else{
                successMessage = "You're wrong this time";
                passFail[currentI][currentJ] = false;
                x[indexCurrent].style.backgroundColor = "red"; 
            }
        }
        



