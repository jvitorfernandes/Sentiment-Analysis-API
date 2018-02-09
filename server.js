
const fs = require('fs');
var data = fs.readFileSync('additional.json');
var additional = JSON.parse(data);

var afinnData = fs.readFileSync('afinn.json');
var afinn = JSON.parse(afinnData);


const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
var server = app.listen(3000, listening);

function listening(){
    console.log('listening. . .')
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

app.get('/all', sendAll);

function sendAll(request, response){
    var data = {
        additional: additional,
        afinn: afinn
    }
    response.send(data);
}

app.post('/analyze', analyzeThis);

function analyzeThis(request, response){
    var txt = request.body.text;
    var words = txt.split(/\W+/);
    var totalScore = 0;
    var wordlist = [];
    
    words.forEach(function(word, index){
        var found = false;
        var score=0;
        if(additional.hasOwnProperty(word)){
            score += Number(additional[word]);
            found=true;
        }
        else if(afinn.hasOwnProperty(word)){
            score += Number(afinn[word]);
            found=true;
        }
        
        if(found){
            wordlist.push({
                word: word,
                score: score
            })
        }
        
        totalScore += score;
    });
    
    console.log(request.body);
    var reply = {
        score: totalScore,
        comparative: totalScore / words.length,
        wordlist: wordlist
    }
    
    response.send(reply);
}

app.get('/add/:word/:score?', addWord);
function addWord(request, response){
    
    var data = request.params;
    var word = data.word;
    var score = Number(data.score);
    var reply;
    
    if(!score){
        reply = {
            status: "error",
            msg: 'Score is required.'
        }
        response.send(reply);
    }else{
        
        additional[word] = score;
        var data = JSON.stringify(additional, null, 4);
        
        fs.writeFile('additional.json', data, finished);
        function finished(err){
            console.log('all set');
            
            reply = {
                word: word,
                score: score,
                status: 'success',
                msg: "Thanks for your word"
            }
            
            response.send(reply);
        }
    
    }
    
    
    
};

app.get('/search/:word/', searchWord);
function searchWord(request, response){
    var word = request.params.word;
    var reply;
    if(words[word]){
        reply = {
            status: 'found',
            word: word,
            score: words[word]
        }
    }else{
        reply = {
            status: 'not found',
            word: word,
        }
    }
    
    response.send(reply);
};