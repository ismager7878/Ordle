var inputFields = document.getElementsByClassName("word-in");
var gridFields = document.getElementsByClassName("grid-item")
var currIn = 0;
var currLine = 0;

var words
var word
var lettersFound = []
var corLettersFound = []
var lettersCorrect = 0;

var done = false

var time
var displayWrong
var wrongTime = 500
var wrong = document.getElementById("wrong")
var lkey = document.getElementsByClassName("l-key")

var client = new XMLHttpRequest();
client.open('GET', 'OrdelListe.csv');
client.onreadystatechange = function() {
  words = client.responseText.split("\n")
  word = words[Math.floor(Math.random()*words.length)]
//   console.log(word)
//   console.log(words)
}
client.send();

document.addEventListener("keydown", function(e){
    var key = e.keyCode
    console.log(key)
    console.log("current in: " + currIn);
    if(!done){
        if((key >= 65 && key <= 90) || (key == 219 || key == 222 || key == 186|| key == 221 || key == 191)){
            if(currIn < 5){
                
                //console.log(currIn + " pressed")
                gridFields[(currIn + currLine*5)].style.borderColor = "#333D47"
                inputFields[(currIn + currLine*5)].innerHTML = e.key
                currIn++;
            }   
        }
        if(key == 8 && currIn > 0){
                currIn--
                inputFields[(currIn + currLine*5)].innerHTML = ""
                gridFields[(currIn + currLine*5)].style.borderColor = "#b0bac5"
        }
        if(e.key == 'Enter' && currIn == 5 && currLine < 6){
            lettersCorrect = 0
            console.log("enter")
            console.log(checkWord(getWord()))
            if(checkWord(getWord())==true){
                if(currLine == 5){
                    if(!checkWin()){
                        document.getElementById("lose").style.display = "flex"
                        done = true
                        document.getElementById("gOrd").innerHTML = "Ord at gætte: " + word.toUpperCase()
                    }
                }else{
                    currLine++
                    currIn = 0
                    //console.log("nex line: " + currLine)
                }
                
            }else{
                popUpTimer()
            }
            
        }
    }
    checkWin();
})

function alphaOnlyAndShiftInput(event) {
    
    return ((key >= 65 && key <= 90) || (key == 219 || key == 222 || key == 186 || key == 221 || key == 191) || key == 8 || key == 'Enter')
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
        word.push(inputFields[(i + currLine*5)].innerHTML)
    } 
    return word.join("")
}

function checkWord(word){
    var hasMatch = false
    lettersFound = []
    corLettersFound = []
    var word = word.toUpperCase()
    var thisWord = this.word.toUpperCase()
    //console.log(word)
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
                //console.log("contained " + word[i])
                setContains(i)
            }
            else{
                setWrong(i)
            }
        }
        
    }
    var lettersCorrected = []
    for(var i = 0; i < lettersFound.length; i++){
        var letter = inputFields[lettersFound[i]].innerHTML
        var letterCount = getLenght(thisWord, letter)
        var foundLetterCount = getLenght(corLettersFound, letter)
        //console.log("word has " + letter + "  " + letterCount + " times")
        if(letterCount == foundLetterCount){
            gridFields[lettersFound[i]].style.backgroundColor = "#333D47"
            gridFields[lettersFound[i]].style.borderColor = "#333D47"
            continue
        }
        var corrLetterCount = getLenght(lettersCorrected, letter)
        if(corrLetterCount + foundLetterCount == letterCount){
            //console.log(letter + " was wrong")
            gridFields[lettersFound[i]].style.backgroundColor = "#333D47"
            gridFields[lettersFound[i]].style.borderColor = "#333D47"
            continue
        }
        lettersCorrected.push(letter)
    }
    return hasMatch
}

function getLenght(array, item){
    var count = 0 
    for(var i = 0; i < array.length; i++){
        var let = array[i]
        //console.log(i + " in " + array + " was " + let)
        if(let.toUpperCase() == item.toUpperCase()){
            count++
        }
    }
    return count
}

function setCorrect(letter){
    var let = inputFields[letter + currLine*5].innerHTML
    corLettersFound.push(let);
    gridFields[letter + currLine*5].style.backgroundColor = "#008148"
    gridFields[letter + currLine*5].style.borderColor = "#008148"
    inputFields[letter + currLine*5].style.color = "#EBFEFF"
    lettersCorrect++
    for(var i = 0; i < lkey.length; i++){
        if(lkey[i].innerHTML == inputFields[letter + currLine*5].innerHTML){
            lkey[i].style.backgroundColor = "#008148"
            lkey[i].style.borderColor = "#008148"
            lkey[i].style.color = "#EBFEFF"
        }
    }
}

function setContains(letter){
    //console.log(letter + ' contained')
    var let = inputFields[letter + currLine*5].innerHTML
    lettersFound.push(letter + currLine*5);
    gridFields[letter + currLine*5].style.backgroundColor = "#B8D04E"
    gridFields[letter + currLine*5].style.borderColor = "#B8D04E"
    inputFields[letter + currLine*5].style.color = "#EBFEFF"
    for(var i = 0; i < lkey.length; i++){
        if(lkey[i].innerHTML == inputFields[letter + currLine*5].innerHTML && lkey[i].style.backgroundColor != "#008148" ){
            lkey[i].style.backgroundColor = "#B8D04E"
            lkey[i].style.borderColor = "#B8D04E"
            lkey[i].style.color = "#EBFEFF"
        }
    }
}
    
function setWrong(letter){
    gridFields[letter + currLine*5].style.backgroundColor = "#333D47"
    gridFields[letter + currLine*5].style.borderColor = "#333D47"
    inputFields[letter + currLine*5].style.color = "#EBFEFF"
    for(var i = 0; i < lkey.length; i++){
        if(lkey[i].innerHTML == inputFields[letter + currLine*5].innerHTML){
            lkey[i].style.backgroundColor = "#333D47"
            lkey[i].style.borderColor = "#333D47"
            lkey[i].style.color = "#EBFEFF"
        }
    }
}
function keyClick(event){
    if(currIn < 5){
        key = event.composedPath()[0].innerHTML
        gridFields[(currIn + currLine*5)].style.borderColor = "#333D47"
        inputFields[(currIn + currLine*5)].innerHTML = key
        currIn++;
    }
}
    
function keyEnter(event){
    lettersCorrect = 0
    if(checkWord(getWord())==true){
        if(currLine == 5){
            if(!checkWin()){
                document.getElementById("lose").style.display = "flex"
                done = true
                document.getElementById("gOrd").innerHTML = "Ord at gætte: " + word
            }
        }else{
            currLine++
            currIn = 0
        }      
    }else{
        popUpTimer()
    }
            
}

function keyDelete(event){
    if(currIn > 0){
        currIn--
        inputFields[(currIn + currLine*5)].innerHTML = ""
        gridFields[(currIn + currLine*5)].style.borderColor = "#7D8EA1"
    }
    
}

function reset(){
    location.reload()
}
var myTimer = setInterval( function() {
    if(displayWrong){
        var newDate = new Date()
        wrong.style.display = "flex"
        //console.log(newDate.getTime()-time)
        if(newDate.getTime()-time >= wrongTime){
            wrong.style.display = "none"
            displayWrong = false
        }
    }
  }, 1 )