var inputFields = document.getElementsByClassName("word-in");
var gridFields = document.getElementsByClassName("grid-item")
var currIn = 0;
var currLine = 0;

var words
var word
var lettersFound = []
var lettersCorrect = 0;

var done = false

var time
var displayWrong
var wrongTime = 500
var wrong = document.getElementById("wrong")


var client = new XMLHttpRequest();
client.open('GET', '/OrdelListe.csv');
client.onreadystatechange = function() {
  words = client.responseText.split("\n")
  word = words[Math.floor(Math.random()*words.length)]
  console.log(word)
  console.log(words)
}
client.send();

function alphaOnlyAndShiftInput(event) {
    var key = event.keyCode;
    console.log(key)
    console.log("current in: " + currIn);
    if(!done){
        if((key >= 65 && key <= 90) || (key == 219 || key == 222 || key == 186)){
            if(currIn < 5){
                
                console.log(currIn + " pressed")
                gridFields[(currIn + currLine*5)].style.borderColor = "#a8adc2"
                inputFields[(currIn + currLine*5)].focus()
                currIn++;
                //console.log(inputFields[currIn])
            }   
        }
        if(key == 8 && currIn > 0){
                currIn--
                inputFields[(currIn + currLine*5)].focus()
                gridFields[(currIn + currLine*5)].style.borderColor = "#dee1e9"
        }
        if(event.key == 'Enter' && currIn == 5 && currLine < 6){
            lettersCorrect = 0
            if(checkWord(getWord())==true){
                if(currLine == 5){
                    if(!checkWin()){
                        document.getElementById("lose").style.display = "flex"
                        done = true
                        document.getElementById("gOrd").innerHTML = word
                    }
                }else{
                    currLine++
                    currIn = 0
                    console.log("nex line: " + currLine)
                }
                
            }else{
                popUpTimer()
            }
            
        }
    }
    checkWin()
    return ((key >= 65 && key <= 90) || (key == 8 || key == 219 || key == 222 || key == 186) && !done);
};
function popUpTimer(){
    displayWrong = true
    const d = new Date()
    time = d.getTime()
}

function checkWin(){
    var win = false
    if(lettersCorrect == 5){
        document.getElementById("win").style.display = "flex"
        win = true;
        done = true
    }
    return win
}

function getWord(){
    var word = []
    for(var i = 0; i < 5; i++){
        word.push(inputFields[(i + currLine*5)].value)
    } 
    return word.join("")
}

function checkWord(word){
    var hasMatch = false
    var word = word.toUpperCase()
    var thisWord = this.word.toUpperCase()
    console.log(word)
    words.forEach(element => {
        if(word == element.toUpperCase()){
            hasMatch = true
        }
    });

    if(hasMatch){
        for(var i = 0; i < word.length; i++){
            if(thisWord[i] == word[i]){
                setCorrect(i)
            }
            else if(thisWord.includes(word[i])){
                console.log("contained " + word[i])
                setContains(i)
            }
            else{
                setWrong(i)
            }
        }
        
    }
    return hasMatch
}
function setCorrect(letter){
    var let = inputFields[letter + currLine*5].style.value
    gridFields[letter + currLine*5].style.backgroundColor = "#77b94a"
    gridFields[letter + currLine*5].style.borderColor = "#77b94a"
    inputFields[letter + currLine*5].style.color = "white"
    lettersCorrect++
}

function setContains(letter){
    console.log(letter + ' contained')
    gridFields[letter + currLine*5].style.backgroundColor = "#f4c31e"
    gridFields[letter + currLine*5].style.borderColor = "#f4c31e"
    inputFields[letter + currLine*5].style.color = "white"
}
    
function setWrong(letter){
    gridFields[letter + currLine*5].style.backgroundColor = "#a4aec4"
    gridFields[letter + currLine*5].style.borderColor = "#a4aec4"
    inputFields[letter + currLine*5].style.color = "white"
}

var myTimer = setInterval( function() {
    if(displayWrong){
        var newDate = new Date()
        wrong.style.display = "flex"
        console.log(newDate.getTime()-time)
        if(newDate.getTime()-time >= wrongTime){
            wrong.style.display = "none"
            displayWrong = false
        }
    }
    if(currIn < 5){
        inputFields[(currIn + currLine*5)].focus()
    }
    if(currIn == 5){
        inputFields[(4 + currLine*5)].focus()
    }
  }, 1 )