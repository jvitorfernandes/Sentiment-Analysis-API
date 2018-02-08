
const fs = require('fs');
var data = fs.readFileSync('words.json');
var words = JSON.parse(data);
console.log(words);

const express = require('express');
const app = express();
var server = app.listen(3000, listening);

function listening(){
    console.log('listening. . .')
}

app.use(express.static('websites'));

app.get('/all', sendAll);

function sendAll(request, response){
    response.send(words);
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
        
        words[word] = score;
        var data = JSON.stringify(words, null, 4);
        
        fs.writeFile('words.json', data, finished);
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