var words = {
    'rainbow': 5,
    'unicorn': 3,
    'doom': -3,
    'gloom': -2
}

console.log('server is starting');

const express = require('express');
const app = express();
var server = app.listen(3000, listening);

function listening(){
    console.log('listening. . .')
}

app.use(express.static('websites'));

app.get('/add/:word/:score', sendFlower);
function sendFlower(request, response){
    
    var data = request.params;
    var word = data.word;
    var score = data.score;
    
    words[word] = score;
    
    var reply = {
        msg: 'Thank you for your word!'
    }
    
    response.send(reply);
    
};

app.get('/all', sendAll);

function sendAll(request, response){
    response.send(words);
}