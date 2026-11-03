
const express=require('express');
const http=require('http');
const {Server}=require('socket.io');
const path=require('path');
const app=express(),server=http.createServer(app),io=new Server(server,{cors:{origin:"*"}});
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(__dirname));
const rooms=new Map();
const WORDS=['mountain','river','waterfall','forest','cave','desert','beach','island'];
function makeRoom(){return {groups:[{answers:{}},{answers:{}},{answers:{}}],checked:false,startedAt:null,duration:120,teacher:null};}
function snapshot(r){return {groups:r.groups,checked:r.checked,startedAt:r.startedAt,duration:r.duration};}
function emit(room){io.to(room).emit('state',snapshot(rooms.get(room)));}
io.on('connection',s=>{
 s.on('create',(_,cb)=>{let code;do{code=Math.random().toString(36).slice(2,8).toUpperCase()}while(rooms.has(code));
  rooms.set(code,makeRoom());s.join(code);s.data={room:code,role:'teacher'};rooms.get(code).teacher=s.id;cb({ok:true,code,state:snapshot(rooms.get(code))});});
 s.on('join',({code,group,role},cb)=>{code=String(code||'').toUpperCase().trim();const r=rooms.get(code);
  if(!r)return cb({ok:false,error:'Không tìm thấy phòng. Giáo viên hãy mở phòng trước.'});
  if(role==='teacher'&&r.teacher&&r.teacher!==s.id)return cb({ok:false,error:'Phòng đã có giáo viên điều khiển.'});
  if(role!=='teacher'&&![0,1,2].includes(Number(group)))return cb({ok:false,error:'Nhóm không hợp lệ.'});
  s.join(code);s.data={room:code,role:role==='teacher'?'teacher':'student',group:Number(group)};
  if(role==='teacher')r.teacher=s.id;
  cb({ok:true,code,state:snapshot(r)});});
 s.on('answer',({slot,word})=>{const {room,role,group}=s.data||{};const r=rooms.get(room);
  if(!r||role!=='student'||r.checked||!Number.isInteger(slot)||slot<0||slot>7||!WORDS.includes(word))return;
  const answers=r.groups[group].answers;
  for(const k of Object.keys(answers))if(answers[k]===word)delete answers[k];
  answers[slot]=word;emit(room);});
 s.on('control',({action},cb=()=>{})=>{const {room,role}=s.data||{};const r=rooms.get(room);if(!r||role!=='teacher')return;
  if(action==='check')r.checked=true;
  if(action==='reset'){r.groups.forEach(g=>g.answers={});r.checked=false;r.startedAt=null;}
  if(action==='start'){r.startedAt=Date.now();r.checked=false;}
  if(action==='pause'){if(r.startedAt){r.duration=Math.max(0,Math.ceil((r.duration*1000-(Date.now()-r.startedAt))/1000));r.startedAt=null;}}
  if(action==='restartTimer'){r.duration=120;r.startedAt=null;}
  emit(room);cb({ok:true});});
 s.on('disconnect',()=>{const {room,role}=s.data||{};const r=rooms.get(room);if(r&&role==='teacher'&&r.teacher===s.id)r.teacher=null;});
});
server.listen(process.env.PORT||3000,()=>console.log('Nature game listening'));
