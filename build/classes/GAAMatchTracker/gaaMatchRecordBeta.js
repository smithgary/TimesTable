/* 
 * Copyright Gary Smith, Meteor Software Limited
 * gary@meteorsoftware.co.uk
 */
//Global variables
var home = true;
var updatePlayer = false;
var isPlayerListLoaded = false;
var isMatchStarted = false;
var activeTimer;
var clubTeams = [];

var matchDetails = {
    "location" : '',
    "date" : 0,
    "activePeriod" : 0,
    "startFirstHalf" : 0,
    "startSeondHalf" : 0,
    "startExtraTime" : 0,
    "startExtraTime2" : 0,
    "scores" : []
};
var homeTeam = {
    "goals" : 0,
    "points" : 0,
    "name" : '',
    "team" : []
};
var opposingTeam = {
    "goals" : 0,
    "points" : 0,
    "name" : '', 
    "team" : []
};


function StoredTeam (ageGroup, teamList){
    this.ageGroup = ageGroup;
    this.teamList = teamList;
};
function Score (home, Player, time, goal, point){
        this.home = home;
        this.Player = Player;
        this.time = time;
        this.goal = goal;
        this.point = point;
};
//Object player, Instantiated when new player is created.
//similar to a Java Class
function Player (number, name, goalsScored, pointsScored) {
        this.number = number;
        this.name = name;
        this.goalsScored = goalsScored;
        this.pointScored = pointsScored;
    };
function configureMatch(){
    var a = document.getElementById("location").value;
    var b = document.getElementById("homeTeamName").value;
    var c = document.getElementById("opposingTeamName").value;
    if(a !== matchDetails.location){
        matchDetails.location = a;
    }
    if(b !== homeTeam.name){
        homeTeam.name = b;
    }
    if(c !== opposingTeam.name){
        opposingTeam.name = c;
    }
    matchDetails.date = new Date();
    
    var display = homeTeam.name + " v " 
            + opposingTeam.name 
            + " @" 
            + matchDetails.location
            + " "
            + dateDisplay();
    document.getElementById("matchTitle").innerHTML = display;
    
    //Clear input boxes
    document.getElementById("location").value = '';
    document.getElementById("homeTeamName").value = '';
    document.getElementById("opposingTeamName").value = '';
    
}   
function loadTeam(){
    
    var a = document.getElementById("player").value;
    var b = document.getElementById("jerseyNo").value;
    if(!updatePlayer){
        var p = new Player(b,a,0,0);
        if (home){
            homeTeam.team.push(p);  
        }else{
            opposingTeam.team.push(p);
        }
    }
    if(updatePlayer){
        var selectedPlayer = document.getElementById("playerToEdit");
        var playerIndex = selectedPlayer.selectedIndex;
        if (home){
            homeTeam.team[playerIndex].name = a;
            homeTeam.team[playerIndex].number = b;
        }else{
            opposingTeam.team[playerIndex].name = a;
            opposingTeam.team[playerIndex].number = b;
        }
        updatePlayer = false;
    }
    

    displayTeam();
    //Clear input boxes
    document.getElementById("player").value = '';
    document.getElementById("jerseyNo").value = '';
}
function removeTeamMember(){
        
        var selectedPlayer = document.getElementById("playerToEdit");
        var playerIndex = selectedPlayer.selectedIndex;
        
        if (home){
            homeTeam.team.splice(playerIndex,1);
        }else{
            opposingTeam.team.splice(playerIndex,1);
        }
        
    displayTeam();
    //Clear input boxes
    document.getElementById("player").value = '';
    document.getElementById("jerseyNo").value = '';
}
function editPlayer(){
    //retrieve selected player
    //load name and jersey number
    //set flag to update when saving
    //Get player reference from dropdown
    var selectedPlayer = document.getElementById("playerToEdit");
    var playerIndex = selectedPlayer.selectedIndex;
    
    //try to return player Object, given dropdown reference
    //var playerWhoScored = homeTeam.team[playerIndex];
    document.getElementById('player').value = homeTeam.team[playerIndex].name;
    document.getElementById('jerseyNo').value = homeTeam.team[playerIndex].number;
    if(!home){
        //playerWhoScored = opposingTeam.team[playerIndex];
        document.getElementById('player').value = opposingTeam.team[playerIndex].name;
        document.getElementById('jerseyNo').value = opposingTeam.team[playerIndex].number;
    }
    updatePlayer = true;
    
    
}
function setHomeAway(loc){
    //Same function called from 2 different locations
    //1 = Choosing when inputting team members
    //2 = Choosing when inputting scores.
    var isHomeTeamActive = document.getElementById("homeOrAwayScore").checked;
    if(loc === 2){
        isHomeTeamActive = document.getElementById("homeOrAwayScore").checked;
    }else{
        isHomeTeamActive = document.getElementById("homeOrAway").checked;
    }
    
    home = false;
    if(isHomeTeamActive){
        home = true;
    }
    
    if (home){
        document.getElementById("preLoad").style.visibility = 'visible';
        document.getElementById("homeTeamTitle").innerHTML = "<b>" + homeTeam.name + "</b>";
        document.getElementById("homeTeamTitleScore").innerHTML = "<b>" + homeTeam.name + "</b>";
        document.getElementById("opposingTeamTitle").innerHTML = opposingTeam.name;
        document.getElementById("opposingTeamTitleScore").innerHTML = opposingTeam.name;
   
    }else{
        document.getElementById("preLoad").style.visibility = 'hidden';
        document.getElementById("homeTeamTitle").innerHTML = homeTeam.name;
        document.getElementById("homeTeamTitleScore").innerHTML = homeTeam.name;
        document.getElementById("opposingTeamTitle").innerHTML = "<b>" + opposingTeam.name + "</b>";
        document.getElementById("opposingTeamTitleScore").innerHTML = "<b>" + opposingTeam.name + "</b>";
    }
    populateAgeGroups();
    populateTimers();
    displayTeam();
}
function displayTeam(){
    var outputText = "<table>";
    
    if (home){
        
        for(var i=0; i<homeTeam.team.length; i++){
            outputText += "<tr><td>";
            outputText += homeTeam.team[i].name;
            outputText += "</td><td>";
            outputText += homeTeam.team[i].number;
            outputText += "</td></tr>";
        }
    }else{
        
        for(var i=0; i<opposingTeam.team.length; i++){
            outputText += "<tr><td>";
            outputText += opposingTeam.team[i].name;
            outputText += "</td><td>";
            outputText += opposingTeam.team[i].number;
            outputText += "</td></tr>";
        }
    }
    outputText += "</table>";
    var select = document.getElementById("playerScore");
    var selectEdit = document.getElementById("playerToEdit");
    select.options.length = 0;
    selectEdit.options.length = 0;
    
    var teamList = homeTeam.team;
    if (home){
        document.getElementById("homeTeam").innerHTML = outputText;
        document.getElementById("opposingTeam").innerHTML = "";
    }else{
       document.getElementById("opposingTeam").innerHTML = outputText;
       document.getElementById("homeTeam").innerHTML = ""; 
       teamList = opposingTeam.team;
    }
    for (var i=0; i<teamList.length; i++){
            var option = document.createElement("OPTION");
            var optionScore = document.createElement("OPTION");
            option.innerHTML = teamList[i].number + " " + teamList[i].name;
            optionScore.innerHTML = teamList[i].number + " " + teamList[i].name;
            option.value = teamList[i].index;
            optionScore.value = teamList[i].index;    
            selectEdit.options.add(option);
            select.options.add(optionScore);
        }
    
}

function goalScored(goal){
    //Register a goal or point
    var goals = 0;
    var points = 0;
    if(goal===1){
        points = 1;
    }
    if(goal === 3){
        goals = 1;
    }
    //Get player reference from dropdown
    var selectedPlayer = document.getElementById("playerScore");
    var playerIndex = selectedPlayer.selectedIndex;
    //try to return player Object, given dropdown reference
    var playerWhoScored = homeTeam.team[playerIndex];
    if(! home){
        playerWhoScored = opposingTeam.team[playerIndex];
    }
    var score = new Score(home, playerWhoScored, new Date(), goals,points);
    matchDetails.scores.push(score);
    displayDetailScores();
    displaySummaryScoreBoard();
    setTwitterMessage(goal);
}
function displayDetailScores(){
    var outputText = "<br><h5>Individual Scores</h5><br><table border=1>";
    outputText += "<tr><td>";
        outputText += "Team";
        outputText += "</td><td>";
        outputText += "Player";
        outputText += "</td><td>";
        outputText += "Time";
        outputText += "</td><td>";
        outputText += "Goal";
        outputText += "</td><td>";
        outputText += "Point";
        outputText += "</td></tr>";
        for(var i=0;i<matchDetails.scores.length;i++){
            outputText += "<tr><td>";
            if(matchDetails.scores[i].home){
                outputText += homeTeam.name;
            }else{
                outputText += opposingTeam.name;
            }
            outputText += "</td><td>";
            outputText += matchDetails.scores[i].Player.name;
            outputText += "</td><td>";
            outputText += matchDetails.scores[i].time.getHours() + ":";
            outputText += matchDetails.scores[i].time.getMinutes() + ":";
            outputText += matchDetails.scores[i].time.getSeconds();
            outputText += "</td><td>";
            outputText += matchDetails.scores[i].goal;
            outputText += "</td><td>";
            outputText += matchDetails.scores[i].point;
            outputText += "</td></tr>";
        }
    outputText += "</table>";
    document.getElementById("detailScores").innerHTML=outputText;  
}
function displaySummaryScoreBoard(){
    var homeGoals = 0;
    var homePoints = 0;
    var opposingGoals = 0;
    var opposingPoints = 0;

    for(var i=0;i<matchDetails.scores.length;i++){
        if(matchDetails.scores[i].home){
            homeGoals += matchDetails.scores[i].goal;
            homePoints += matchDetails.scores[i].point;
        }else{
            opposingGoals += matchDetails.scores[i].goal;
            opposingPoints += matchDetails.scores[i].point;    
        }
    }
    //Set global variables, used by twitter output etc.
    homeTeam.goals = homeGoals;
    homeTeam.points = homePoints;
    opposingTeam.goals = opposingGoals;
    opposingTeam.points = opposingPoints;
    
    var homeTotal = 3 * homeGoals + homePoints;
    var opposingTotal = 3 * opposingGoals + opposingPoints;
    
        var outputText = "<br><h5>Scoreboard</h5><br><table border='1'>";
        outputText += "<tr><td>";
        outputText += "Team";
        outputText += "</td><td>";
        outputText += "Goals";
        outputText += "</td><td>";
        outputText += "Points";
        outputText += "</td><td>";
        outputText += "Equavalent";
        outputText += "</td></tr>";
        outputText += "<tr><td>";
        outputText += homeTeam.name;
        outputText += "</td><td>";
        outputText += homeGoals;
        outputText += "</td><td>";
        outputText += homePoints;
        outputText += "</td><td>";
        outputText += homeTotal;
        outputText += "</td></tr>";
        outputText += "<tr><td>";
        outputText += opposingTeam.name;
        outputText += "</td><td>";
        outputText += opposingGoals;
        outputText += "</td><td>";
        outputText += opposingPoints;
        outputText += "</td><td>";
        outputText += opposingTotal;
        outputText += "</td></tr>";
    outputText += "</table>";
    document.getElementById("summaryScoreBoard").innerHTML=outputText;
}
function openTab(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
function loadDefaultHomeTeam(){
    //replace with json download from database on website
    var selectedTeam = document.getElementById("ageGroup");
    var teamIndex = selectedTeam.selectedIndex;
    console.log(teamIndex);
    var teamToLoad = clubTeams[teamIndex]; 
    for(var i=0;i<teamToLoad.teamList.length;i++){
        var p = new Player(i, teamToLoad.teamList[i],0,0);
        homeTeam.team.push(p);
    }
displayTeam();
}
function dateDisplay(){
    var dayOfWeek = matchDetails.date.getDay(); //0-6
    var actualDay = "";
    var dayOfMonth = matchDetails.date.getDate(); //1-31
    var dayTh = "";
    var monthOfYear = matchDetails.date.getMonth(); //0-11
    var actualMonth = "";
    var yearOfMatch = matchDetails.date.getFullYear(); //2018
    //Get Day
    switch(dayOfWeek){
    case 0:
        actualDay = "Sunday";
        break;
    case 1:
        actualDay = "Monday";
        break;
    case 2:
        actualDay = "Tuesday";
        break;
    case 3: 
        actualDay = "Wednesday";
        break;
    case 4:
        actualDay = "Thursday";
        break;
    case 5:
        actualDay = "Friday";
        break;
    case 6:
        actualDay = "Saturday";
    }
    
    switch(dayOfMonth){
    case 1:
    case 21:
    case 31:
        dayTh = "st";
        break;
    case 2:
    case 22:
        dayTh = "nd";
        break;
    case 3:
    case 23:
        dayTh = "rd";
        break;
    default:
        dayTh = "th";
    }
    
    switch(monthOfYear){
    case 0:
        actualMonth = "January";
        break;
    case 1:
        actualMonth = "February";
        break;
    case 2:
        actualMonth = "March";
        break;
    case 3: 
        actualMonth = "April";
        break;
    case 4:
        actualMonth = "May";
        break;
    case 5:
        actualMonth = "June";
        break;
    case 6:
        actualMonth = "July";
        break;
    case 7:
        actualMonth = "August";
        break;
    case 8:
        actualMonth = "September";
        break;   
    case 9:
        actualMonth = "October";
        break; 
    case 10:
        actualMonth = "November";
        break;
    case 11:
        actualMonth = "December";
        break;
    }
    var outputString = "";
    outputString = actualDay + ", " 
            + dayOfMonth + dayTh + " " 
            + actualMonth + " "
            + yearOfMatch;
    return outputString;
}
function loadCasementsTeams(){
    //To be replaced with JSON download from Server
    if(!isPlayerListLoaded){
    var ageGroup = "Senior Football";
    var teamList = ["Adrian Anderson",
        "Adrian Carey",
        "Paddy Carey",
        "Johnny Convery",
        "Ryan Convery",
        "Tony Convery",
        "Peter Cushnahan",
        "Conall Delargy",
        "Niall Delargy",
        "Ronan Delargy",
        "Shane Delargy",
        "Damian Dillon",
        "Declan Dobbin",
        "Declan Doherty",
        "Owen Doherty",
        "Brendan J. Donnelly",
        "Michael Donnelly",
        "Peter Duffin",
        "Patrick Graffin",
        "Mark Graham",
        "Michael Hagan",
        "Aidan Jr. Kearney",
        "Donagh Kelly",
        "Owen Kelly",
        "Patrick Kelly",
        "Ronan Kelly",
        "Stephen Kelly",
        "Michael Kelly Jnr",
        "John Lewis",
        "Dermot McAleese",
        "Gerard Jr McAleese",
        "Mark McAleese",
        "Paul McAleese",
        "Peter McAleese",
        "Bryan McCann",
        "Phelim McCloskey",
        "Reece McDonnell",
        "Declan McErlean",
        "Lee McFall",
        "Connor McGhee",
        "Ryan McGuigan",
        "Aidan McKee",
        "Adrian McKeever",
        "Niall McKeever",
        "Kieran McKenna",
        "James McLarnon",
        "Corey McLaughlin",
        "Brian McManus",
        "Donal Murphy",
        "Fergal O'Kane",
        "Thomas O'Kane",
        "Ryan O'Neill",
        "Caolan Tierney"
        ];
    var seniorFootball = new StoredTeam(ageGroup, teamList);
    clubTeams.push(seniorFootball);
    
    ageGroup = "Under 8 Football";
    teamList = ["Tom Convery",
        "Cillian McKenna",
        "Cillian McDonald",
        "Charlie Convery",
        "Ronan McAleer",
        "Connor McKeever",
        "Cormac Hyndman",
        "Eoghan Smith",
        "Patrick O'Boyle",
        "Thomas Douthart",
        "Thomas Kearney",
        "Connor Burns",
        "Phelim McCloskey",
        "Oscar Eddis"];
    var u8Football = new StoredTeam(ageGroup, teamList);
    clubTeams.push(u8Football);
    
    ageGroup = "Under 6 Football";
    teamList = ["Jack Kearney",
        "Caden Convery",
        "Tom Burns",
        "Conan McKeever"
        ];
    var u6Football = new StoredTeam(ageGroup, teamList);
    clubTeams.push(u6Football);
    
    ageGroup = "Under 6 Camogie";
    teamList = ["Niamh Mulholland",
        "Aoife Kelly",
        "Niamh Smith",
        "Olivia McFerran"
        ];
    var u6Camogie = new StoredTeam(ageGroup, teamList);
    clubTeams.push(u6Camogie);
    
    isPlayerListLoaded = true;
    }
}
function populateAgeGroups(){
    loadCasementsTeams();
    var ageOption = document.getElementById("ageGroup");
    ageOption.length = 0;
    for (var i=0; i<clubTeams.length; i++){
            var option = document.createElement("OPTION");
            option.innerHTML = clubTeams[i].ageGroup;
            option.value = clubTeams[i].index;    
            ageOption.options.add(option);
        }
}
function populateTimers(){
    var timeOption = document.getElementById("timeOption");
    timeOption.length = 0;
    for (var i=0; i<35; i++){
            var option = document.createElement("OPTION");
            option.innerHTML = i + 1;
            option.value = i + 1;    
            timeOption.options.add(option);
        }
}
function stopTimer(){
    clearInterval(activeTimer);
}
function startTimer(){
    //Check not already pressed..
    //Make a Singleton.
    if(!isMatchStarted){
    var duration = document.getElementById("timeOption");
    var durationIndex = duration.selectedIndex;
    var throwIn = new Date().getTime();
    //NEW - Set matchDetails.activePeriod
    switch(matchDetails.activePeriod){
        case 0:
        //Match not started. Set first half to start   
            matchDetails.startFirstHalf = throwIn;
            matchDetails.activePeriod = 1;
            break;
        case 1:
        //First half active.
        //How does case 2 get set?
            break;
        //Additional time at end of 1st half
        case 2: 
            matchDetails.startSecondHalf = throwIn;
            matchDetails.activePeriod = 3;
            break;
        case 3:
            break;
        case 4:
            break;
    }
    //
    var timeUp = throwIn + (durationIndex + 1) * 60 * 1000;
    countdown(timeUp, throwIn);
    //document.getElementById("startCountdownTimer").innerHTML = 'Stop Timer';
    isMatchStarted = true;
    } else {
        //?
        //alert("Match already started. Want to reset?");
        //handle.
        if (confirm("Match already started. Want to reset?") ) {
            if (confirm("Ready to reset?") ) {
                // code here for save then leave (Yes)
                //stop the timer??
                isMatchStarted = false;
                clearInterval(activeTimer);
                document.getElementById("minutes").innerHTML = "0";
                document.getElementById("seconds").innerHTML = "0";
                document.getElementById("elapsedMinutes").innerHTML = "0";
                document.getElementById("elapsedSeconds").innerHTML = "0";

                document.getElementById("startCountdownTimer").innerHTML = 'Start Timer';
            } else {
                //code here for no save but leave (No)
                return;
            }
        } else {
            //code here for don't leave (Cancel)
            return;
        }
    }
}

function countdown(endDate, throwIn) {
  var days, hours, minutes, seconds;
  var daysElapsed, hoursElapsed, minutesElapsed, secondsElapsed;
  var eTdaysElapsed, eThoursElapsed, eTminutesElapsed, eTsecondsElapsed;
  
  endDate = new Date(endDate).getTime();
  
  if (isNaN(endDate)) {
	return;
  }
  
  activeTimer = setInterval(calculate, 1000);
  
  function calculate() {
    var startDate = new Date();
    startDate = startDate.getTime();
    
    var timeRemaining = parseInt((endDate - startDate) / 1000);
    var timeElapsed = parseInt((startDate - throwIn) / 1000);
    //var extraTime = parseInt((startDate - endDate)/1000);
    
    if (timeRemaining >= 0) {
      days = parseInt(timeRemaining / 86400);
      daysElapsed = parseInt(timeElapsed / 86400);
      //eTdaysElapsed = parseInt(extraTime / 86400);
      
      timeRemaining = (timeRemaining % 86400);
      timeElapsed = (timeElapsed % 86400);
      //extraTime = (extraTime % 86400);
      
      hours = parseInt(timeRemaining / 3600);
      hoursElapsed = parseInt(timeElapsed / 3600);
      //eThoursElapsed = parseInt(extraTime / 3600);
      
      timeRemaining = (timeRemaining % 3600);
      timeElapsed = (timeElapsed % 3600);
      //extraTime = (extraTime % 3600);
      
      minutes = parseInt(timeRemaining / 60);
      minutesElapsed = parseInt(timeElapsed / 60);
      //eTminutesElapsed = parseInt(extraTime / 60);
      
      timeRemaining = (timeRemaining % 60);
      timeElapsed = (timeElapsed % 60);
      //extraTime = (extraTime % 60);
      
      seconds = parseInt(timeRemaining);
      secondsElapsed = parseInt(timeElapsed);
      //eTsecondsElapsed = parseInt(extraTime);
      
      document.getElementById("minutes").innerHTML = ("0" + minutes).slice(-2);
      document.getElementById("seconds").innerHTML = ("0" + seconds).slice(-2);
      document.getElementById("elapsedMinutes").innerHTML = ("0" + minutesElapsed).slice(-2);
      document.getElementById("elapsedSeconds").innerHTML = ("0" + secondsElapsed).slice(-2);
    } else {
      //Not working?
      //alert("Time is up");
      //Works, but called every second - not what was intended..
      //matchDetails.activePeriod += 1;
      //Count up extra time.?
      var extraTime = parseInt((startDate - endDate)/1000);
      //document.getElementById("elapsedMinutes").innerHTML = ("<font color='red'>0" + eTminutesElapsed).slice(-2) + "</font>";
      //document.getElementById("elapsedSeconds").innerHTML = ("<font color='red'>0" + eTsecondsElapsed).slice(-2) + "</font>";
      document.getElementById("elapsedMinutes").innerHTML = ("<font color='red'>0"  + parseInt(extraTime/60)).slice(-2) + "</font>";
      document.getElementById("elapsedSeconds").innerHTML = ("<font color='red'>0" + extraTime % 60).slice(-2) + "</font>";

      isMatchStarted = false;
          return;
    }
  }
}
function setTwitterMessage(score){
var cr = "%0D%0A";

var twitterHref="https://twitter.com/intent/tweet?text=";

twitterHref += homeTeam.name + " v " 
        + opposingTeam.name + " at "
        + matchDetails.location + "." + cr;

    if(score === 1){
        twitterHref += "Point scored by " + 
        matchDetails.scores[matchDetails.scores.length -1].Player.name
        + "." + cr;
    }
    if(score === 3){
        twitterHref += "Goal scored by " + 
        matchDetails.scores[matchDetails.scores.length -1].Player.name
        + "." + cr;
    }
 
twitterHref += homeTeam.name + " " + homeTeam.goals + ":"  + homeTeam.points + cr;
twitterHref += opposingTeam.name + " " + opposingTeam.goals + ":"  + opposingTeam.points + cr;

document.getElementById("sendTweet").href = twitterHref;
}
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
  fjs = d.getElementById("sendTweet");
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));
/* Autostart function
//(function () { 
//  countdown('04/01/2333 05:00:00 PM'); 
//}());
*/
/* Singleton function
var Singleton = (function () {
    var instance;
 
    function createInstance() {
        var object = new Object("I am the instance");
        return object;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
 
function run() {
 
    var instance1 = Singleton.getInstance();
    var instance2 = Singleton.getInstance();
 
    alert("Same instance? " + (instance1 === instance2));  
}
*/