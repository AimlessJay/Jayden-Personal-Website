// Notes
const sound = {65:"http://carolinegabriel.com/demo/js-keyboard/sounds/040.wav",
                87:"http://carolinegabriel.com/demo/js-keyboard/sounds/041.wav",
                83:"http://carolinegabriel.com/demo/js-keyboard/sounds/042.wav",
                69:"http://carolinegabriel.com/demo/js-keyboard/sounds/043.wav",
                68:"http://carolinegabriel.com/demo/js-keyboard/sounds/044.wav",
                70:"http://carolinegabriel.com/demo/js-keyboard/sounds/045.wav",
                84:"http://carolinegabriel.com/demo/js-keyboard/sounds/046.wav",
                71:"http://carolinegabriel.com/demo/js-keyboard/sounds/047.wav",
                89:"http://carolinegabriel.com/demo/js-keyboard/sounds/048.wav",
                72:"http://carolinegabriel.com/demo/js-keyboard/sounds/049.wav",
                85:"http://carolinegabriel.com/demo/js-keyboard/sounds/050.wav",
                74:"http://carolinegabriel.com/demo/js-keyboard/sounds/051.wav",
                75:"http://carolinegabriel.com/demo/js-keyboard/sounds/052.wav",
                79:"http://carolinegabriel.com/demo/js-keyboard/sounds/053.wav",
                76:"http://carolinegabriel.com/demo/js-keyboard/sounds/054.wav",
                80:"http://carolinegabriel.com/demo/js-keyboard/sounds/055.wav",
                186:"http://carolinegabriel.com/demo/js-keyboard/sounds/056.wav"};

const note1 = new Audio(sound[65]);
const note2 = new Audio(sound[87]);
const note3 = new Audio(sound[83]);
const note4 = new Audio(sound[69]);
const note5 = new Audio(sound[68]);
const note6 = new Audio(sound[70]);
const note7 = new Audio(sound[84]);
const note8 = new Audio(sound[71]);
const note9 = new Audio(sound[89]);
const note10 = new Audio(sound[72]);
const note11 = new Audio(sound[85]);
const note12 = new Audio(sound[74]);
const note13 = new Audio(sound[75]);
const note14 = new Audio(sound[79]);
const note15 = new Audio(sound[76]);
const note16 = new Audio(sound[80]);
const note17 = new Audio(sound[186]);

const creepyBackUp = new Audio('https://tuna.voicemod.net/sound/4978c579-6256-4b44-be81-33ff48df7266');
const creepySound = new Audio('https://us-tuna-sounds-files.voicemod.net/4978c579-6256-4b44-be81-33ff48df7266-1667962810089.mp3');

// Reveal key id for each piano key
const whiteKey = document.getElementsByClassName('white-key');
const blackKey = document.getElementsByClassName('black-key');
const whiteLabel = document.getElementsByClassName('keylabelw');
const blackLabel = document.getElementsByClassName('keylabelb');

for(const wkey of whiteKey){
    wkey.addEventListener('mouseover', keyReveal);
    wkey.addEventListener('mouseout', keyHide);
}
for(const bkey of blackKey){
    bkey.addEventListener('mouseover', keyReveal);
    bkey.addEventListener('mouseout', keyHide);
}

function keyReveal(e){
    for(const lw of whiteLabel){
        lw.style.display= "flex";
    }
    for(const lb of blackLabel){
        lb.style.display= "flex";
    }
}
function keyHide(e){
    for(const lw2 of whiteLabel){
        lw2.style.display= "none";
    }
    for(const lb2 of blackLabel){
        lb2.style.display = "none";
    }
}

// Piano key reaction
const w1 = document.querySelector('#w1');
const w2 = document.querySelector('#w2');
const w3 = document.querySelector('#w3');
const w4 = document.querySelector('#w4');
const w5 = document.querySelector('#w5');
const w6 = document.querySelector('#w6');
const w7 = document.querySelector('#w7');
const w8 = document.querySelector('#w8');
const w9 = document.querySelector('#w9');
const w10 = document.querySelector('#w10');
const b1 = document.querySelector('#b1');
const b2 = document.querySelector('#b2');
const b3 = document.querySelector('#b3');
const b4 = document.querySelector('#b4');
const b5 = document.querySelector('#b5');
const b6 = document.querySelector('#b6');
const b7 = document.querySelector('#b7');

//key down
document.addEventListener('keydown', (event) => {
    var name = event.key;
    if (name === 'a') {
        w1.style.backgroundColor= "grey";
        note1.play();

    }else if(name === 's'){
        w2.style.backgroundColor="grey";
        note3.play();

    }else if(name === 'd'){
        w3.style.backgroundColor="grey";
        note5.play();

    }else if(name === 'f'){
        w4.style.backgroundColor="grey";
        note6.play();

    }else if(name === 'g'){
        w5.style.backgroundColor="grey";
        note8.play();

    }else if(name === 'h'){
        w6.style.backgroundColor="grey";
        note10.play();

    }else if(name === 'j'){
        w7.style.backgroundColor="grey";
        note12.play();

    }else if(name === 'k'){
        w8.style.backgroundColor="grey";
        note13.play();

    }else if(name === 'l'){
        w9.style.backgroundColor="grey";
        note15.play();

    }else if(name === ';'){
        w10.style.backgroundColor="grey";
        note17.play();

    }else if(name === 'w'){
        b1.style.backgroundColor="grey";
        note2.play();

    }else if(name === 'e'){
        b2.style.backgroundColor="grey";
        note4.play();

    }else if(name === 't'){
        b3.style.backgroundColor="grey";
        note7.play();

    }else if(name === 'y'){
        b4.style.backgroundColor="grey";
        note9.play();

    }else if(name === 'u'){
        b5.style.backgroundColor="grey";
        note11.play();

    }else if(name === 'o'){
        b6.style.backgroundColor="grey";
        note14.play();

    }else if(name === 'p'){
        b7.style.backgroundColor="grey";
        note16.play();

    }else{
        return;
    }
},false);
  
//key up
document.addEventListener('keyup', (event) => {
    var name = event.key;
    if (name === 'a') {
        w1.style.backgroundColor= "azure";
        note1.pause();
        note1.currentTime = 0;

    }else if(name === 's'){
        w2.style.backgroundColor="azure";
        note3.pause();
        note3.currentTime = 0;

    }else if(name === 'd'){
        w3.style.backgroundColor="azure";
        note5.pause();
        note5.currentTime = 0;

    }else if(name === 'f'){
        w4.style.backgroundColor="azure";
        note6.pause();
        note6.currentTime = 0;

    }else if(name === 'g'){
        w5.style.backgroundColor="azure";
        note8.pause();
        note8.currentTime = 0;

    }else if(name === 'h'){
        w6.style.backgroundColor="azure";
        note10.pause();
        note10.currentTime = 0;

    }else if(name === 'j'){
        w7.style.backgroundColor="azure";
        note12.pause();
        note12.currentTime = 0;

    }else if(name === 'k'){
        w8.style.backgroundColor="azure";
        note13.pause();
        note13.currentTime = 0;

    }else if(name === 'l'){
        w9.style.backgroundColor="azure";
        note15.pause();
        note15.currentTime = 0;

    }else if(name === ';'){
        w10.style.backgroundColor="azure";
        note17.pause();
        note17.currentTime = 0;

    }else if(name === 'w'){
        b1.style.backgroundColor="black";
        note2.pause();
        note2.currentTime = 0;

    }else if(name === 'e'){
        b2.style.backgroundColor="black";
        note4.pause();
        note4.currentTime = 0;

    }else if(name === 't'){
        b3.style.backgroundColor="black";
        note7.pause();
        note7.currentTime = 0;

    }else if(name === 'y'){
        b4.style.backgroundColor="black";
        note9.pause();
        note9.currentTime = 0;

    }else if(name === 'u'){
        b5.style.backgroundColor="black";
        note11.pause();
        note11.currentTime = 0;

    }else if(name === 'o'){
        b6.style.backgroundColor="black";
        note14.pause();
        note14.currentTime = 0;

    }else if(name === 'p'){
        b7.style.backgroundColor="black";
        note16.pause();
        note16.currentTime = 0;

    }else{
        return;
    }
},false);

// We see you event
const cover  = document.querySelector('.cover');
const image  = document.querySelector('.seeimg');

var code;

document.addEventListener('keypress', (event) => {
    var name = event.key;

    if (name === 'w'){
        code = name;
    }else{
        code += name;
    }

    if (code === 'weseeyou'){

    //show weseeyou image and background
        // attempt at fading in
          /*  var el = document.querySelector('.seeimg');
            setInterval(function() {
               var opacity = el.style.opacity;
               if (opacity <= 0) {
                  opacity += 0.1;
                  el.style.opacity = opacity;
               }
            }, 50);*/
        cover.style.display = "block";
        image.style.display = "block";
        //disable keypress reactions
        document.onkeydown = function(){return false};
        //play creepy sound
        creepySound.play();
    }
    console.log(code);

}, false);

function keyCodeLine(e){

}
