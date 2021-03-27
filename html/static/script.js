/*
script.js

*/

// Create DOM elements

var canvas = document.createElement("canvas");
const SIZE = 400;
canvas.width = canvas.height = SIZE;

var submit_button = document.createElement("button");
submit_button.appendChild(document.createTextNode('Send'));

var clear_button = document.createElement("button");
clear_button.appendChild(document.createTextNode('Clear'));

var message =  document.createElement('p');


// Draw on canvas

var ctx = canvas.getContext("2d");

ctx.lineWidth = 10;
ctx.lineJoin="round";
ctx.miterLimit=1;
ctx.lineCap='round';

var scrollX = 0;
var scrollY = 0;

const getX = event => event.clientX - canvas.offsetLeft + scrollX + .5;
const getY = event => event.clientY - canvas.offsetTop + scrollY + .5;

function draw(event) {
    ctx.lineTo(getX(event), getY(event));
    ctx.stroke();
    ctx.moveTo(getX(event), getY(event));
}

function stop() {
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mouseout', draw);
    canvas.removeEventListener('mouseup', stop);
}

canvas.addEventListener('mousedown',(event)=>{
    ctx.beginPath();
    ctx.moveTo(getX(event), getY(event));
    ctx.lineTo(getX(event)+.1, getY(event));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(getX(event)+.1, getY(event));
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseout', draw);
    document.addEventListener('mouseup', stop);
    message.innerHTML='';
});

document.addEventListener('scroll',(event)=>{
    scrollX = event.pageX;
    scrollY = event.pageY;
});


// Clear canvas

clear_button.addEventListener('click', () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    message.innerHTML='';
});


// Send request to server

submit_button.addEventListener('click', () => {
    var img = canvas.toDataURL();
    if (isImageBlank(img)) {
        message.innerHTML = '<span style="color:red">Error</span><br/>Can\'t send blank image';
        return;
    }
    fetch('http://127.0.0.1:5000/image',{
        method:'POST',
        body: JSON.stringify({image:img}), 
        headers:{'Content-Type':'application/json'}
    })
    .then(res=>res.json())
    .then( res => {
        const text = (res.digit!==undefined && res.result!==undefined)?
            'Digit: '+res.digit+'<br/>Confidence: '+(res.result[res.digit]*100.).toFixed(2)+'%':
             '<span style="color:red">Error</span><br/>Unexpected response';
        message.innerHTML = text;
    }).catch(err => {
        message.innerHTML = '<span style="color:red">Error</span><br/>'
        console.log(err);
    });
});

function isImageBlank(image) {
    let blank = document.createElement('canvas');
    blank.width = blank.height = SIZE;
    return blank.toDataURL()===image;
}


// Add all DOM elements to document body

document.body.appendChild(canvas);
document.body.appendChild(submit_button);
document.body.appendChild(clear_button);
document.body.appendChild(message);