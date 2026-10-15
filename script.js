const SEG=["Small","Medium","Large","X-Large"],GST=18;
const RAW=`Interior|Int - Premium|2100,2800,3500,4200
Interior|Int - Premium Plus|3500,4500,5500,6500
Interior|Int - Antibacterial|2800,3600,4900,6000
Interior|Int - Antibacterial Plus|4000,5100,6900,8400
Exterior|UV|1600,1800,2100,2400
Exterior|Gloss Boost Neo|8800,11600,13800,15400
Exterior|Gloss Boost|12000,14000,16500,18000
Exterior|Paint Sealant Advance|6200,8100,10000,11900
Exterior|Ceramic Glass Shield New|2700,3100,3500,3800
Exterior|Ceramic Glass Shield OLD|5000,5500,6000,6500
Exterior|Glass Polish Front|1500,1800,2000,2200
Exterior|Glass Polish F + R|2900,3000,3500,4000
Exterior|Carpet Vacuuming & Cleaning|200
Exterior|1 Seat Cleaning|300,500,-,-
Exterior|Exterior - Superb|4000,5000,6000,6500
Exterior|Alloy Wheel Cleaning|1400,-,1600,-
Exterior|Exterior - Trizact|-,13700,15600,17800
Anti-Rust & Engine|Anti-Rust Coating 2Y|2500,3100,4300,4600
Anti-Rust & Engine|Anti-Rust Coating 5Y|5100,5900,7100,7400
Anti-Rust & Engine|Silencer Coating|1500
Anti-Rust & Engine|Rodent Coating|1400
Anti-Rust & Engine|HRS|2000,2000,2300,2600
Anti-Rust & Engine|3M Nomad Mats (per sq ft)|@400
Anti-Rust & Engine|5 Point Correction|600,700,800,900
Anti-Rust & Engine|A/C Vent Cleaning - Front|1600
Anti-Rust & Engine|A/C Vent Cleaning - Front & Rear|2800
Wash & Combo|Wash (Mon to Fri)|500,600,700,800
Wash & Combo|Wash (Sat to Sun)|700,800,1000,1200
Wash & Combo|Exterior Superb & Interior Premium Combo|6000,7000,7500,8500
Ceramic & Graphene|Ceramic Classic|14000,16000,18000,20000
Ceramic & Graphene|Ceramic Coating|20000,23000,26000,29000
Ceramic & Graphene|Graphene Shield Coating - Plan 1|24000,27000,31000,34000
Ceramic & Graphene|Graphene Shield Coating - Plan 2|32000,37000,42000,47000
PPF (per sq ft)|PPF 50 Gloss - 5 Years|@590
PPF (per sq ft)|PPF 100 Gloss - 7 Years|@725
PPF (per sq ft)|PPF 150 Gloss - 10 Years|@1200
PPF (per sq ft)|PPF Matte Finish - 10 Years|@1000
CR 70 Sunfilm|CR 70 Front|12600,13700,14200,15200
CR 70 Sunfilm|CR 70 Front + 4W|32600,35700,37800,41200
CR 70 Sunfilm|CR 70 Rear|9800,10400,11200,12400
CR 70 Sunfilm|CR 70 Rear + 4W|27800,30400,31500,34600
CR 70 Sunfilm|CR 70 Full Car|42400,46100,49000,53600
CR 70 Sunfilm|CR 70 Single Window|5000,5500,5900,6500
IM 70 Sunfilm|IM 70 Front|7000,7500,8000,8500
IM 70 Sunfilm|IM 70 Front + 4W|19000,19500,20000,20500
IM 70 Sunfilm|IM 70 Rear|5000
IM 70 Sunfilm|IM 70 Rear + 4W|17000
IM 70 Sunfilm|IM 70 Full Car|24000,24500,25000,25500
IM 70 Sunfilm|IM 70 Single Window|3000`;
const IT=RAW.split("\n").map(l=>{const[c,n,p]=l.split("|");const sq=p[0]=="@";let a=(sq?p.slice(1):p).split(",").map(x=>x=="-"?null:+x);if(a.length==1)a=[a[0],a[0],a[0],a[0]];const q=/^(CR|IM) 70/.test(n)?(/Full Car/.test(n)?6:/4W/.test(n)?5:1):1;return{c,n,a,sq,q}});
const $=i=>document.getElementById(i),E=s=>String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const today=()=>new Date().toISOString().slice(0,10);
let S,saved=[],db=null,editing=null;
const blank=()=>({showTotal:true,offer:"",remarks:"",hon:"auto",date:today(),name:"",phone:"",addr:"",model:"",reg:"",seg:0,inc:true,lines:[]});
S=blank();
// ---- calc
const calc=(s)=>{const k=1+GST/100;let tx=0;const rows=s.lines.map(l=>{const base=s.inc?l.rate/k:l.rate,amt=Math.round(l.qty*base*(1-l.disc/100)*100)/100;tx+=amt;return{...l,base,amt,wt:Math.round(amt*k*100)/100}});
tx=Math.round(tx*100)/100;const gst=Math.round(tx*GST)/100;return{rows,tx,gst,tot:tx+gst,grand:Math.round(tx+gst)}};
const FEM=new Set("divya priya sneha pooja puja neha riya rani anjali kavita sunita anita sangeeta shweta swati smita sakshi komal ashwini pallavi rutuja rupali vaishnavi shruti shital sayali snehal archana madhuri meera mira seema geeta gita lata laxmi lakshmi sarita savita sonali sonal tejal trupti vidya vrushali yogita aarti arti pratiksha prerna kajal kiran jyoti jaya ketaki manisha mamta namrata nisha payal poonam radha rekha renuka roshni sana sara zoya fatima ayesha".split(" ")),MAL=new Set("aditya arya atharva krishna kishna surya shiva siva hari ravi rama raja harsha sai satya vishnu ganesha yash vijaya ajay sanjay vijay jay rahul prasad kiran? amit sumit".split(" "));
function guess(n){const w=(n||"").trim().split(/\s+/)[0].toLowerCase();if(!w)return"Sir";if(FEM.has(w))return"Ma'am";if(MAL.has(w))return"Sir";return/(a|i|ee|ya)$/.test(w)?"Ma'am":"Sir"}
const hon=q=>q.hon&&q.hon!="auto"?q.hon:guess(q.name);
const f2=n=>n.toFixed(2);
const inr=n=>n.toLocaleString("en-IN");
function words(n){const a="Zero One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen Sixteen Seventeen Eighteen Nineteen".split(" "),t="  Twenty Thirty Forty Fifty Sixty Seventy Eighty Ninety".split(" ");
const two=x=>x<20?a[x]:t[x/10|0]+(x%10?" "+a[x%10]:""),th=x=>x>=100?a[x/100|0]+" Hundred"+(x%100?" And "+two(x%100):""):two(x);
if(!n)return"Zero Only.";let o=[];[[1e7,"Crore"],[1e5,"Lakh"],[1e3,"Thousand"]].forEach(([d,w])=>{const q=Math.floor(n/d);if(q){o.push(th(q)+" "+w);n%=d}});if(n)o.push(th(n));return o.join(" ")+" Only."}
// ---- UI
function render(){
 $("seg").innerHTML=SEG.map((s,i)=>`<button data-s="${i}" class="${S.seg==i?"on":""}">${s}</button>`).join("");
 $("inc").checked=S.inc;$("hon").value=S.hon||"auto";$("stot").checked=S.showTotal!==false;
 ["name","phone","addr","model","reg","date","offer","remarks"].forEach(k=>$(k).value=S[k]);
 const c=calc(S);
 $("lines").innerHTML=c.rows.map((l,i)=>`<tr><td>${E(l.name)}${l.rate==null||l.rate===""?' <span class="mu">(set price)</span>':""}</td>
 <td style="width:90px"><input data-i="${i}" data-k="qty" type="number" step="any" value="${+(+l.qty).toFixed(2)}">${l.sq?'<div class="mu">sq ft</div>':""}</td>
 <td style="width:100px"><input data-i="${i}" data-k="rate" type="number" step="any" value="${l.rate===""||l.rate==null?"":+(+l.rate).toFixed(2)}"></td>
 <td style="width:70px"><input data-i="${i}" data-k="disc" type="number" step="any" value="${l.disc}"></td>
 <td class="r">${f2(l.wt)}</td><td><button data-d="${i}">✕</button></td></tr>`).join("");
 $("empty").hidden=S.lines.length>0;
 $("sum").innerHTML=`<small>Total (incl. GST)</small>₹${inr(c.grand)}`;
 $("cnt").textContent=saved.length;if(!$("pl").hidden)fillPl();
}
function fillPl(){const t=$("ps").value.toLowerCase().trim();let h="",cur="";
 IT.forEach((x,i)=>{if(t&&!(x.n+" "+x.c).toLowerCase().includes(t))return;if(x.c!=cur){h+=`<h4>${E(x.c)}</h4>`;cur=x.c}
 const p=x.a[S.seg];h+=`<div class="it" data-i="${i}"><span>${E(x.n)}</span>`+(p==null?'<span class="pr na">set price</span>':`<span class="pr">₹${inr(p)}${x.sq?" <small>/sq ft</small>":""}</span>`)+"</div>"});
 $("pl").innerHTML=h||'<div class="none">No treatment found — use “+ Custom item”.</div>'}
function pickInit(){const ps=$("ps"),pl=$("pl");ps.onfocus=ps.oninput=()=>{fillPl();pl.hidden=false};
 pl.onmousedown=e=>{const r=e.target.closest(".it");if(r){e.preventDefault();addItem(+r.dataset.i);pl.hidden=true;ps.value="";ps.blur()}};
 document.addEventListener("mousedown",e=>{if(!e.target.closest(".pk"))pl.hidden=true});
 document.addEventListener("touchstart",e=>{if(!e.target.closest(".pk"))pl.hidden=true},{passive:true})}
const price=(i,s)=>IT[i].a[s];
async function addItem(i){const x=IT[i];let qty=x.q,disc=0,sq=false;const p=price(i,S.seg);
 if(x.sq){disc=x.c.startsWith("PPF")?10:0;const r=await askQty(p,disc);if(!r)return;qty=r;sq=true}
 S.lines.push({idx:i,sq,name:x.n+(x.sq?"":" - "+SEG[S.seg]),qty,rate:p==null?"":p/x.q,disc});render()}
function askQty(p,disc){return new Promise(r=>{let m=1;const u=p*(S.inc?1:1+GST/100)*(1-disc/100);const o=document.createElement("div");o.className="ov";
 o.innerHTML=`<div class="md"><h3>Enter size or amount</h3><div class="row seg" style="margin-bottom:10px"><button id="m1" class="on">Sq ft</button><button id="m2">Amount (₹)</button></div><input id="mi" inputmode="decimal" placeholder="e.g. 175.9"><div class="mu" id="mp" style="margin-top:8px"></div><div class="row" style="margin-top:12px;justify-content:flex-end"><button id="mc">Cancel</button><button id="mo" class="p">Add</button></div></div>`;
 document.body.appendChild(o);const i=o.querySelector("#mi"),pv=o.querySelector("#mp"),q=()=>{const v=parseFloat(i.value);return v>0?(m==1?v:v/u):0};
 const up=()=>{const n=q();pv.innerHTML=`Rate${disc?" after "+disc+"% discount":""}: ₹${u.toFixed(2)}/sq ft`+(n?`<br><b>${+n.toFixed(2)} sq ft = ₹${inr(+(n*u).toFixed(2))}</b>`:"")};
 const f=v=>{o.remove();r(v)};i.focus();up();i.oninput=up;
 o.querySelector("#m1").onclick=o.querySelector("#m2").onclick=e=>{m=e.target.id=="m1"?1:2;o.querySelector("#m1").className=m==1?"on":"";o.querySelector("#m2").className=m==2?"on":"";i.placeholder=m==1?"e.g. 175.9":"e.g. 80000";up();i.focus()};
 o.querySelector("#mc").onclick=()=>f(null);o.querySelector("#mo").onclick=()=>f(q()||null);o.onclick=e=>{if(e.target==o)f(null)};i.onkeydown=e=>{if(e.key=="Enter")f(q()||null)}})}
function ask(t,ph,ok,im){return new Promise(r=>{const o=document.createElement("div");o.className="ov";o.innerHTML=`<div class="md"><h3>${E(t)}</h3>${ph!=null?`<input id="mi" placeholder="${E(ph)}" inputmode="${im||"text"}">`:""}<div class="row" style="margin-top:12px;justify-content:flex-end"><button id="mc">Cancel</button><button id="mo" class="p">${ok||"OK"}</button></div></div>`;document.body.appendChild(o);const i=o.querySelector("#mi");if(i)i.focus();const f=v=>{o.remove();r(v)};o.querySelector("#mc").onclick=()=>f(null);o.querySelector("#mo").onclick=()=>f(i?i.value:"");o.onclick=e=>{if(e.target==o)f(null)};if(i)i.onkeydown=e=>{if(e.key=="Enter")f(i.value)}})}
function toast(m){const t=document.createElement("div");t.className="ts";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
$("cust").onclick=async()=>{const n=await ask("Item description","e.g. Headlight restoration","Add");if(n){S.lines.push({idx:-1,name:n,qty:1,rate:"",disc:0});render()}};
$("seg").onclick=e=>{const b=e.target.closest("button");if(!b)return;S.seg=+b.dataset.s;
 S.lines.forEach(l=>{if(l.idx>=0&&!IT[l.idx].sq){{const p=price(l.idx,S.seg);l.rate=p==null?"":p/IT[l.idx].q}l.name=IT[l.idx].n+" - "+SEG[S.seg]}});render()};
$("lines").onchange=e=>{const t=e.target;if(t.dataset.k){S.lines[+t.dataset.i][t.dataset.k]=t.value===""?"":+t.value;render()}};
$("lines").onclick=e=>{const b=e.target.closest("[data-d]");if(b){S.lines.splice(+b.dataset.d,1);render()}};
["name","phone","addr","model","reg","date","offer","remarks"].forEach(k=>$(k).oninput=e=>S[k]=e.target.value);
$("stot").onchange=e=>S.showTotal=e.target.checked;
$("hon").onchange=e=>S.hon=e.target.value;
$("inc").onchange=e=>{S.inc=e.target.checked;render()};
$("t1").onclick=()=>tab(1);$("t2").onclick=()=>tab(2);
function tab(n){$("bar").hidden=n!=1;$("v1").hidden=n!=1;$("v2").hidden=n!=2;$("t1").className=n==1?"on":"";$("t2").className=n==2?"on":"";if(n==2)list()}
$("new").onclick=()=>{S=blank();editing=null;render()};
// ---- storage
const LK="kk_quotes";
function loadLocal(){try{return JSON.parse(localStorage.getItem(LK)||"[]")}catch(e){return[]}}
function setStatus(){$("st").textContent=db?"Saved to cloud (shared)":"Saved on this device only"}
async function init(){
 pickInit();saved=loadLocal();render();setStatus();
 try{const cl=window.claude&&await claude.use("db");if(cl){db=cl;db.collection("quotes").onSnapshot(s=>{saved=s.docs.map(d=>d.data());render();if(!$("v2").hidden)list()},()=>{db=null;setStatus()});}}catch(e){db=null}
 setStatus()}
async function save(){
 if(!S.lines.length){toast("Add at least one item.");return null}
 const no=editing??(Math.max(0,...saved.map(q=>+q.no||0))+1);
 const q={...JSON.parse(JSON.stringify(S)),no,ts:Date.now()};editing=no;
 try{if(db)await db.collection("quotes").doc("q"+no).set(q);else throw 0}catch(e){db=null;saved=saved.filter(x=>x.no!=no);saved.push(q);localStorage.setItem(LK,JSON.stringify(saved))}
 setStatus();render();S.no=no;return q}
$("save").onclick=async()=>{const q=await save();if(q)toast("Saved as quotation #"+q.no)};
$("savepdf").onclick=async()=>{const q=await save();if(q)pdf(q)};
function list(){const t=$("q").value.toLowerCase();
 $("list").innerHTML=[...saved].sort((a,b)=>b.no-a.no).filter(q=>[q.no,q.name,q.phone,q.model,q.reg].join(" ").toLowerCase().includes(t)).map(q=>`<div class="card row"><div style="flex:1"><b>#${q.no}</b> ${E(q.name)||"(no name)"} <span class="mu">${E(q.model)} · ${q.date}</span><div class="mu">₹${inr(calc(q).grand)}</div></div>
 <button data-p="${q.no}">PDF</button><button data-e="${q.no}">Edit</button><button data-x="${q.no}">Delete</button></div>`).join("")||'<div class="mu">Nothing saved yet.</div>'}
$("q").oninput=list;
$("list").onclick=async e=>{const b=e.target.closest("button");if(!b)return;const d=b.dataset,no=+(d.p||d.e||d.x),q=saved.find(x=>x.no==no);
 if(d.p)pdf(q);else if(d.e){S=JSON.parse(JSON.stringify(q));editing=no;tab(1);render()}
 else if(d.x&&(await ask("Delete quotation #"+no+"?",null,"Delete"))!==null){try{if(db)await db.collection("quotes").doc("q"+no).delete();else throw 0}catch(_){saved=saved.filter(x=>x.no!=no);localStorage.setItem(LK,JSON.stringify(saved))}list();render()}};
// ---- PDF
async function pdf(q){
 const {jsPDF}=window.jspdf,d=new jsPDF({unit:"mm",format:"a4"}),c=calc(q),L=14,R=196,k=1+GST/100,INK=[28,27,34],RED=[215,25,32],MU=[120,116,110];
 const fi=n=>(+n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}),dt=new Date(q.date+"T00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});
 d.setFillColor(...INK);d.rect(0,0,210,3,"F");d.setFillColor(...RED);d.rect(0,3,210,1,"F");
 d.setFont("helvetica","bold");d.setFontSize(25);d.setTextColor(...RED);d.setDrawColor(...RED);d.setLineWidth(.45);["3M Car Care Studio","Aundh Balewadi"].forEach((t,i)=>d.text(t,L,22+i*8.6,{renderingMode:"fillThenStroke"}));d.setLineWidth(.2);
 
 d.setFont("helvetica","normal");d.setFontSize(9.5);d.setTextColor(...MU);
 ["Sr.No 157/158 Kalamkar Corner, near Jupiter Hospital,","Opposite Rutupurna Society, Baner, Pune 411045","Phone: 9090381999, 7066771999  |  3mcarcareaundh.balewadi@gmail.com","GSTIN: 27ABBFK2867K1ZZ"].forEach((t,i)=>d.text(t,L,38+i*4.8));
 d.setFont("helvetica","bold");d.setFontSize(24);d.setTextColor(...INK);d.text("QUOTATION",R,20,{align:"right"});
 d.setFontSize(10.5);d.setFont("helvetica","normal");d.setTextColor(...MU);
 d.setFont("helvetica","normal");d.setTextColor(...MU);d.text("Date",R,30,{align:"right"});d.setFont("helvetica","bold");d.setFontSize(12);d.setTextColor(...INK);d.text(dt,R,36,{align:"right"});
 d.setDrawColor(225,220,212);d.line(L,56,R,56);
 const blk=(x,t,rows)=>{d.setFont("helvetica","bold");d.setFontSize(9);d.setTextColor(...RED);d.text(t,x,64);let y=71;rows.filter(r=>r[1]).forEach(r=>{if(r[0]){d.setFont("helvetica","normal");d.setFontSize(9.5);d.setTextColor(...MU);d.text(r[0],x,y)}
  const by=r[0]?y+5.6:y+1;d.setFont("helvetica","bold");d.setFontSize(12.5);d.setTextColor(...INK);const ln=d.splitTextToSize(String(r[1]),80);d.text(ln,x,by);y=by+5.6*(ln.length-1)+7});return y};
 const y1=blk(L,"CUSTOMER NAME",[["",q.name?q.name+" "+hon(q):"-"],["Phone",q.phone],["Address",q.addr]]),y2=blk(112,"VEHICLE/MODEL",[["",q.model||"-"],["Registration no.",q.reg]]);
 const rows=c.rows.map((l,i)=>{const unit=q.inc?l.rate:l.rate*k;return[String(i+1),l.name,l.sq?(+(+l.qty).toFixed(2))+" sq ft":l.qty,fi(unit),+l.disc?(+l.disc)+"%":"-",fi(l.qty*unit),fi(l.wt)]});
 d.autoTable({startY:Math.max(y1,y2,80)+2,margin:{left:L,right:210-R},theme:"plain",styles:{font:"helvetica",fontSize:10,textColor:INK,cellPadding:{top:4.2,bottom:4.2,left:2.5,right:2.5},lineColor:[230,225,217],lineWidth:{bottom:.2}},
  headStyles:{fillColor:INK,textColor:255,fontSize:9.5,fontStyle:"bold",lineWidth:0},alternateRowStyles:{fillColor:[250,248,244]},
  head:[["#","Description","Qty","Rate (Rs.)","Disc.","Amount (Rs.)","Amount after discount (Rs.)"]],body:rows,
  columnStyles:{0:{cellWidth:9,textColor:MU},1:{cellWidth:"auto"},2:{halign:"right",cellWidth:24},3:{halign:"right",cellWidth:26},4:{halign:"right",cellWidth:15},5:{halign:"right",cellWidth:28},6:{halign:"right",cellWidth:32,fontStyle:"bold"}},
  didParseCell:h=>{if(h.section=="head"&&h.column.index>=2)h.cell.styles.halign="right"}});
 let y=d.lastAutoTable.finalY+10;if(y>225){d.addPage();y=20}
 const st=q.showTotal!==false;if(st){
 d.setFillColor(...INK);d.roundedRect(116,y,R-116,16,2,2,"F");d.setTextColor(255);d.setFont("helvetica","normal");d.setFontSize(9.5);d.text("TOTAL AMOUNT",121,y+10);
 d.setFont("helvetica","bold");d.setFontSize(14.5);d.text("Rs. "+inr(c.grand)+".00",R-5,y+10.4,{align:"right"});
 d.setTextColor(...MU);d.setFont("helvetica","normal");d.setFontSize(9);d.text("Amount in words",L,y+4);
 d.setTextColor(...INK);d.setFont("helvetica","bold");d.setFontSize(11);d.text(d.splitTextToSize(words(c.grand),92),L,y+10);
 }
 d.setTextColor(...MU);d.setFont("helvetica","normal");d.setFontSize(9);d.text("All prices are inclusive of 18% GST.",R,y+(st?25:3),{align:"right"});
 y+=st?32:12;const nb=(t,tx)=>{if(!tx)return;const ln=d.splitTextToSize(tx,R-L);if(y+ln.length*5+10>275){d.addPage();y=20}d.setFont("helvetica","bold");d.setFontSize(9);d.setTextColor(...RED);d.text(t,L,y);d.setFont("helvetica","normal");d.setFontSize(10.5);d.setTextColor(...INK);d.text(ln,L,y+5.5);y+=5.5+ln.length*5+5};
 nb("OFFER",(q.offer||"").trim());nb("REMARKS",(q.remarks||"").trim());y+=20;if(y>268){d.addPage();y=40}
 d.setDrawColor(...INK);d.line(L,y,L+58,y);d.line(R-62,y,R,y);d.setFont("helvetica","normal");d.setFontSize(9.5);d.setTextColor(...MU);d.text("Customer Signature",L,y+5.5);d.text("Authorised Signature",R,y+5.5,{align:"right"});
 const n=d.getNumberOfPages();for(let p=1;p<=n;p++){d.setPage(p);d.setFontSize(8.5);d.setTextColor(...MU);d.text("Thank you for choosing 3M Car Care Studio.",105,290,{align:"center"})}
 const fn="Quotation-"+q.no+(q.name?"-"+q.name.replace(/[^\w]+/g,"_"):"")+".pdf";
 try{const dl=await claude.use("downloads");if(dl){await dl.save({filename:fn,data:d.output("blob")});return}}catch(e){if(e&&e.code=="declined")return}
 d.save(fn)}
init();
