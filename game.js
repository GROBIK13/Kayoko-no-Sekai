const W=4200,H=2800,SPEED=5,limits={cats:5,photos:5,rest:3,music:3};
const spots={kitten:[1000,680],photo:[2020,600],cafe:[1240,1180],shop:[2420,890],music:[1450,1230]};
const solid=[
 [420,610,300,210],[1120,1110,300,210],[2300,820,330,220],[430,1580,390,250],
 [1200,860,210,100],[3200,930,190,100]
];
const outfits=[["🎒","Школьная форма",0],["☕","Кафе",100],["🌸","Весенняя",250],["🌧️","Дождливая",350],["🎧","Музыкальная",500],["🌃","Токио ночью",700],["🐈","Кошачий наряд",900],["🌌","Звёздная Каёко",1500],["👗","Мейд Каёко",2000]];
let s={name:"Игрок",x:1805,y:1150,score:0,cats:0,photos:0,rest:0,music:0,coins:0,outfit:0,owned:[0]},keys={},frame=0,clock=0,walkStarted=false;
const $=id=>document.getElementById(id);
try{s={...s,...JSON.parse(localStorage.getItem("kayokoGameV2"))}}catch(e){}
$("name").value=s.name;
function save(){localStorage.setItem("kayokoGameV2",JSON.stringify(s))}
function hud(){$("score").textContent=s.score;$('cats').textContent=s.cats;$('photos').textContent=s.photos;$('coins').textContent=s.coins}
function pos(){$("kayoko").style.left=s.x-45+"px";$('kayoko').style.top=s.y-75+"px"}
function camera(){let x=Math.max(0,Math.min(W-innerWidth,s.x-innerWidth/2)),y=Math.max(0,Math.min(H-innerHeight,s.y-innerHeight/2));$("world").style.transform=`translate(${-x}px,${-y}px)`}
function near(x,y,d=145){return Math.hypot(s.x-x,s.y-y)<d}
function say(t){$("msg").textContent=t;$("msg").classList.add("show");clearTimeout(window.msgTimer);window.msgTimer=setTimeout(()=>$("msg").classList.remove("show"),1800)}
function blocked(nx,ny){if(nx<55||ny<55||nx>W-55||ny>H-55)return true;return solid.some(([x,y,w,h])=>nx+32>x&&nx-32<x+w&&ny+48>y&&ny-48<y+h)}
function start(){s.name=$("name").value.trim()||"Игрок";newWalk(false);$("start").classList.add("hidden");$("game").classList.remove("hidden");hud();pos();camera();say("🌸 Добро пожаловать в Токио!")}
function newWalk(saveCurrent=true){if(saveCurrent)record();s.x=1805;s.y=1150;s.cats=0;s.photos=0;s.rest=0;s.music=0;walkStarted=true;save();hud();$("menuBox").classList.add("hidden");pos();camera();say("🌸 Новая прогулка началась!")}
function record(){if(!walkStarted)return;let r=JSON.parse(localStorage.getItem("kayokoRankingV2")||"[]");r.push({name:s.name,cats:s.cats,photos:s.photos,score:s.score,date:Date.now()});r=r.sort((a,b)=>b.score-a.score).slice(0,20);localStorage.setItem("kayokoRankingV2",JSON.stringify(r))}
function action(t,fn){$("action").classList.remove("hidden");$("actionBtn").textContent=t;$("actionBtn").onclick=fn}
function noaction(){$("action").classList.add("hidden")}
function interact(){if(near(...spots.kitten))action("🐈 Погладить котёнка",pet);else if(near(...spots.photo))action("📸 Сделать фото",photo);else if(near(...spots.cafe,180))action("☕ Отдохнуть",rest);else if(near(...spots.shop,190))action("👗 Войти в магазин",shop);else if(near(...spots.music,145))action("🎵 Послушать музыку",music);else noaction()}
function pet(){if(s.cats>=limits.cats)return say("🐈 Лимит поглаживаний достигнут");$("pet").classList.remove("hidden")}
$("finishPet").onclick=()=>{$("pet").classList.add("hidden");s.cats++;s.score+=100;s.coins+=100;save();hud();say("🐈 +1 поглаживание · ⭐ +100")}
function photo(){if(s.photos>=limits.photos)return say("📸 Лимит фотографий достигнут");s.photos++;s.score+=60;s.coins+=60;save();hud();say("📸 Фото сохранено! +60")}
function rest(){if(s.rest>=limits.rest)return say("☕ Лимит отдыха достигнут");s.rest++;s.score+=30;s.coins+=30;save();hud();say("☕ Каёко немного отдохнула. +30")}
function music(){if(s.music>=limits.music)return say("🎵 Лимит музыки достигнут");s.music++;s.score+=25;s.coins+=25;save();hud();say("🎵 Каёко послушала музыку. +25")}
function shop(){renderShop();$("shop").classList.remove("hidden")}
function renderShop(){let box=$("items");box.innerHTML="";outfits.forEach((o,i)=>{let owned=s.owned.includes(i),b=document.createElement("button");b.textContent=s.outfit===i?"Надето":owned?"Надеть":`Купить ${o[2]} 💰`;b.disabled=s.outfit===i||(!owned&&s.coins<o[2]);b.onclick=()=>{if(!owned){s.coins-=o[2];s.owned.push(i)}s.outfit=i;save();hud();renderShop()};let d=document.createElement("div");d.className="item";d.innerHTML=`<span>${o[0]} <b>${o[1]}</b></span>`;d.appendChild(b);box.appendChild(d)})}
function menu(){let r=JSON.parse(localStorage.getItem("kayokoRankingV2")||"[]");let current={name:s.name,cats:s.cats,photos:s.photos,score:s.score};let all=[...r,current].sort((a,b)=>b.score-a.score);$("progress").innerHTML=`🐈 ${s.cats}/${limits.cats}<br>📸 ${s.photos}/${limits.photos}<br>☕ ${s.rest}/${limits.rest}<br>🎵 ${s.music}/${limits.music}<br>⭐ ${s.score}<br>💰 ${s.coins}`;$("ranking").innerHTML=all.slice(0,10).map((x,i)=>`<div class="rank"><span>${i+1}. ${x.name}</span><span>🐈 ${x.cats} · 📸 ${x.photos} · ⭐ ${x.score}</span></div>`).join("");$("menuBox").classList.remove("hidden")}
$("startBtn").onclick=start;$("menu").onclick=menu;$("newWalk").onclick=()=>newWalk(true);
document.querySelectorAll(".controls button").forEach(b=>{b.onpointerdown=e=>{e.preventDefault();keys[b.dataset.k]=1};b.onpointerup=b.onpointercancel=b.onpointerleave=()=>keys[b.dataset.k]=0});
onkeydown=e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key))e.preventDefault();keys[e.key]=1};onkeyup=e=>keys[e.key]=0;
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).classList.add("hidden"));
function loop(){let dx=(keys.ArrowRight?1:0)-(keys.ArrowLeft?1:0),dy=(keys.ArrowDown?1:0)-(keys.ArrowUp?1:0);if(dx||dy){let l=Math.hypot(dx,dy),nx=s.x+dx/l*SPEED,ny=s.y+dy/l*SPEED;if(!blocked(nx,s.y))s.x=nx;if(!blocked(s.x,ny))s.y=ny;clock++;if(clock>7){clock=0;frame=(frame+1)%4;$("kayoko").src=`kayoko-walk-${frame+1}.PNG`}}else $("kayoko").src="kayoko-walk-1.PNG";pos();camera();interact();requestAnimationFrame(loop)}
loop();hud();
