const duration = Number(document.body.dataset.duration);
const totalSeconds = duration * 60;
let remaining = totalSeconds;
let deadline = Date.now() + totalSeconds * 1000;
let timerId = null;
let running = true;
const clock = document.getElementById('clock');
const start = document.getElementById('start');
const reset = document.getElementById('reset');
const status = document.getElementById('status');
function render(){const m=Math.floor(remaining/60),s=remaining%60;clock.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;document.title=`${clock.textContent} · Stillpoint`;}
async function keepScreenAwake(){if(!('wakeLock' in navigator)||document.visibilityState!=='visible')return;try{await navigator.wakeLock.request('screen');}catch(_){}}
function finish(){clearInterval(timerId);timerId=null;running=false;remaining=0;render();start.textContent='Start again';status.textContent=duration===180?'Simulation complete. Put your pen down.':'Session complete. Take a breath.';document.body.classList.add('complete');if('vibrate'in navigator)navigator.vibrate([250,120,250,120,400]);}
function tick(){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));render();if(remaining===0)finish();}
function run(){running=true;deadline=Date.now()+remaining*1000;start.textContent='Pause';status.textContent=duration===180?'Exam in progress':'Focus in progress';document.body.classList.remove('complete');clearInterval(timerId);timerId=setInterval(tick,250);tick();keepScreenAwake();}
start.addEventListener('click',()=>{if(running){tick();clearInterval(timerId);timerId=null;running=false;start.textContent='Resume';status.textContent='Paused. Return when ready.';return;}if(remaining<=0)remaining=totalSeconds;run();});
reset.addEventListener('click',()=>{remaining=totalSeconds;run();});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){if(running)tick();keepScreenAwake();}});
window.addEventListener('pageshow',()=>{if(running)tick();});
render();run();
