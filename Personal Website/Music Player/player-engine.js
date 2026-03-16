/* =========================
   SONG LIST
========================= */

const songs = [
{
title:"Low Mileage - Hold You",
src:"/assets/audio/song2.mp3"
},
{
title:"BIMINI, Avi Snow - No Way",
src:"/assets/audio/song3.mp3"
},
{
title:"Glitch Cat - REACHOUT",
src:"/assets/audio/song1.mp3"
},
{
title:"Eli Raain, Cadmium - Ghost (feat. Eli Raain) [NCS Release]",
src:"/assets/audio/song4.mp3"
},
{
title:"Eli Raain, Syndec - Lost (feat. Eli Raain) [NCS Release]",
src:"/assets/audio/song5.mp3"
},
{
title:"Low Mileage - Hold You [NCS Release]",
src:"/assets/audio/song6.mp3"
},
{
title:"Max Landry, Zeus X Crona - Lights Turn Out [NCS Release]",
src:"/assets/audio/song7.mp3"
},
{
    title:"November Lights, Diviners - Change [NCS Release]",
    src:"/assets/audio/song8.mp3"
},

];


let DB=JSON.parse(localStorage.getItem("fmPlayer"))||{
song:0,
time:0,
volume:0.7,
speed:1,
playing:false
};

function saveDB(){
localStorage.setItem("fmPlayer",JSON.stringify(DB));
}

const player=document.querySelector(".music-player");

const audio=document.getElementById("audio");

const title=document.getElementById("song-title");

const play=document.getElementById("play");
const next=document.getElementById("next");
const prev=document.getElementById("prev");

const volume=document.getElementById("volume");
const speed=document.getElementById("speed");

const progress=document.querySelector(".progress-bar");

const orb=document.querySelector(".orb");

/* LOAD SONG */

function loadSong(i){

audio.src=songs[i].src;

title.textContent=songs[i].title;

DB.song=i;

saveDB();

}

loadSong(DB.song);

/* RESTORE SETTINGS */

audio.volume=DB.volume;
audio.playbackRate=DB.speed;
audio.currentTime=DB.time;

volume.value=DB.volume;
speed.value=DB.speed;

if(DB.playing){

audio.play().catch(()=>{});
play.textContent="⏸";

}

/* PLAY */

play.onclick=()=>{

if(audio.paused){

audio.play();
play.textContent="⏸";
DB.playing=true;

}else{

audio.pause();
play.textContent="▶";
DB.playing=false;

}

saveDB();

};

/* NEXT PREV */

next.onclick=()=>{

DB.song=(DB.song+1)%songs.length;

loadSong(DB.song);

audio.play();

};

prev.onclick=()=>{

DB.song--;

if(DB.song<0) DB.song=songs.length-1;

loadSong(DB.song);

audio.play();

};

/* PROGRESS */

audio.ontimeupdate=()=>{

let p=(audio.currentTime/audio.duration)*100;

progress.style.width=p+"%";

DB.time=audio.currentTime;

saveDB();

};

/* SEEK */

document.querySelector(".progress").onclick=e=>{

let rect=e.target.getBoundingClientRect();

let percent=(e.clientX-rect.left)/rect.width;

audio.currentTime=percent*audio.duration;

};

/* VOLUME */

volume.oninput=()=>{

audio.volume=volume.value;

DB.volume=volume.value;

saveDB();

};

/* SPEED */

speed.onchange=()=>{

audio.playbackRate=speed.value;

DB.speed=speed.value;

saveDB();

};

/* MODES */

document.getElementById("min").onclick=()=>{

player.classList.toggle("minimized");
player.classList.remove("circle");

};

document.getElementById("circle").onclick=()=>{

player.classList.toggle("circle");
player.classList.remove("minimized");

};

/* ORB CLICK */

orb.onclick=()=>{

player.classList.remove("circle");

};

/* AUDIO VISUALIZER */

let audioCtx=new AudioContext();

let analyser=audioCtx.createAnalyser();

let src=audioCtx.createMediaElementSource(audio);

src.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize=128;

let data=new Uint8Array(analyser.frequencyBinCount);

const canvas=document.getElementById("wave");

const ctx=canvas.getContext("2d");

canvas.width=260;
canvas.height=60;

function draw(){

requestAnimationFrame(draw);

analyser.getByteFrequencyData(data);

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.beginPath();

ctx.strokeStyle="#4CAF50";

for(let i=0;i<data.length;i++){

let x=i*2;

let y=canvas.height/2+(data[i]/255*40-20);

if(i===0) ctx.moveTo(x,y);
else ctx.lineTo(x,y);

}

ctx.stroke();

/* BASS ORB */

let bass=data[2];

let scale=1+(bass/255)*0.8;

orb.style.transform=`scale(${scale})`;

}

draw();