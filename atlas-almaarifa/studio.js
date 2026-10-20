const form = $("#ficheForm") || $("#scheduleForm");
const isFiche = page === "fiche";
const storageKey = `atlas-v2-${page}-draft`;
let activities = [];
const status = text => { $("#draftStatus").textContent = text; };
const getFields = () => Object.fromEntries(new FormData(form).entries());
const numericLatin = value => String(value).replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d));
const lines = value => String(value || "").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
function putFields(values) {
  for (const [key,value] of Object.entries(values || {})) {
    const field = form.elements.namedItem(key);
    if (field && typeof value === "string" && ["INPUT","TEXTAREA","SELECT"].includes(field.tagName)) field.value=value;
  }
}
function paperHeader(d,kicker) {
  return `<header class="paper-header"><div><strong>أطلس المعرفة</strong><span>التاريخ والجغرافيا · وثيقة الأستاذ</span></div><div><span>الموسم الدراسي: <bdi dir="ltr">${esc(d.year || "—")}</bdi></span><span>${esc(d.school || "اسم المؤسسة")}</span></div></header><p class="paper-kicker">${kicker}</p><h2>${esc(d.title || "عنوان الوثيقة")}</h2><div class="paper-info"><div><b>الأستاذ(ة):</b> ${esc(d.teacher || "................................")}</div><div><b>المستوى:</b> ${esc(d.level || "—")}</div>${isFiche?`<div><b>المادة:</b> ${esc(d.subject)}</div><div><b>المدة:</b> ${esc(d.duration)}</div>`:""}</div>`;
}
const paperFooter = () => `<footer class="paper-footer"><span>أطلس المعرفة · مسودة قابلة للتعديل</span><span>تُراجع من طرف الأستاذ قبل الاعتماد.</span></footer>`;
function activityFromDOM() {
  activities = $$(".activity-editor").map(row=>({
    title:$('[data-field="title"]',row).value,
    minutes:$('[data-field="minutes"]',row).value,
    teacher:$('[data-field="teacher"]',row).value,
    learner:$('[data-field="learner"]',row).value,
    assessment:$('[data-field="assessment"]',row).value
  }));
}
function activityEditors() {
  $("#activitiesEditor").innerHTML=activities.map((a,i)=>`<fieldset class="activity-editor"><legend class="sr-only">المرحلة ${i+1}</legend><div class="activity-editor-head"><strong>المرحلة ${i+1}</strong><button type="button" class="activity-remove" data-remove="${i}" aria-label="حذف المرحلة ${i+1}" ${activities.length===1?"disabled":""}>${icon("close")}حذف</button></div><div class="form-columns"><label>اسم المرحلة<input data-field="title" value="${esc(a.title)}" maxlength="120"></label><label>الدقائق<input data-field="minutes" type="number" min="1" max="240" value="${esc(a.minutes)}"></label></div><label>أنشطة الأستاذ<textarea data-field="teacher" rows="2" maxlength="2000">${esc(a.teacher)}</textarea></label><label>أنشطة المتعلّم<textarea data-field="learner" rows="2" maxlength="2000">${esc(a.learner)}</textarea></label><label>التقويم<textarea data-field="assessment" rows="2" maxlength="1000">${esc(a.assessment)}</textarea></label></fieldset>`).join("");
  $$("[data-remove]").forEach(b=>b.addEventListener("click",()=>{activityFromDOM();activities.splice(Number(b.dataset.remove),1);activityEditors();render();status("تعديلات غير محفوظة");$("#addActivity").focus();}));
}
function loadTemplate(id) {
  const r=resources.find(r=>r.id===id);
  if (r) {
    putFields({template:r.id,title:r.title,subject:r.type,level:r.level,duration:r.duration,problem:r.problem,objectives:r.objectives.join("\n")});
    activities=r.steps.map((s,i)=>({title:s[0],minutes:"20",teacher:s[1],learner:"ملاحظة الوثائق، إنجاز المطلوب، ومناقشة النتائج مع المجموعة.",assessment:r.questions[i]}));
  } else {
    putFields({title:"",problem:"",objectives:""});
    activities=[{title:"وضعية الانطلاق",minutes:"10",teacher:"",learner:"",assessment:""}];
  }
  activityEditors();
}
function renderFiche() {
  const d=getFields();
  $("#printDocument").innerHTML=paperHeader(d,"جذاذة تربوية")+
    `<section><h3>إشكالية الدرس</h3><p>${esc(d.problem || "حدّد إشكالية الدرس في مساحة التحرير.")}</p></section><section><h3>أهداف التعلّم</h3><ul>${lines(d.objectives).map(v=>`<li>${esc(v)}</li>`).join("") || "<li>أضف أهداف التعلّم.</li>"}</ul></section><section><h3>الوسائل والدعامات</h3><p>${esc(d.materials)}</p></section><section><h3>سيرورة التعلّم</h3><table><thead><tr><th>المرحلة / الزمن</th><th>أنشطة الأستاذ</th><th>أنشطة المتعلّم</th><th>التقويم</th></tr></thead><tbody>${activities.map(a=>`<tr><td><strong>${esc(a.title || "مرحلة")}</strong><small>${esc(a.minutes || "—")} دقيقة</small></td><td>${esc(a.teacher)}</td><td>${esc(a.learner)}</td><td>${esc(a.assessment)}</td></tr>`).join("")}</tbody></table></section>${d.notes?`<section><h3>ملاحظات الأستاذ</h3><p>${esc(d.notes)}</p></section>`:""}`+paperFooter();
}
function scheduleData(d) {
  const weeks=Number(d.weeks),sessions=Number(d.sessions),minutes=Number(d.minutes);
  const start=new Date(`${d.start}T12:00:00Z`);
  const breaks=lines(numericLatin(d.breaks).replace(/[،,;]/g,"\n")).map(Number);
  const invalidBreak=breaks.some(v=>!Number.isInteger(v)||v<1||v>weeks);
  form.elements.breaks.setCustomValidity(invalidBreak?"أدخل أرقام أسابيع صحيحة ضمن الفترة المحددة.":"");
  const units=lines(d.units).map(line=>{
    const parts=line.split("|");
    return {title:parts[0].trim(),count:parts[1]===undefined?2:Number(numericLatin(parts[1].trim()))};
  });
  const invalidUnit=units.some(u=>!u.title||!Number.isInteger(u.count)||u.count<1||u.count>320);
  form.elements.units.setCustomValidity(invalidUnit?"لكل درس، أدخل عنوانًا وعدد حصص صحيحًا من 1 إلى 320.":"");
  if(!Number.isFinite(start.getTime())||!Number.isInteger(weeks)||weeks<1||weeks>40||!Number.isInteger(sessions)||sessions<1||sessions>8||!Number.isInteger(minutes)||minutes<15||minutes>180||invalidBreak||invalidUnit) return null;
  const holidays=new Set(breaks), rows=[];
  let unit=0, consumed=0, assigned=0;
  const dateText=date=>`${String(date.getUTCDate()).padStart(2,"0")}/${String(date.getUTCMonth()+1).padStart(2,"0")}/${date.getUTCFullYear()}`;
  for(let w=1;w<=weeks;w++){
    const from=new Date(start);
    from.setUTCDate(start.getUTCDate()+(w-1)*7);
    const end=new Date(from);end.setUTCDate(from.getUTCDate()+5);
    const holiday=holidays.has(w), lessons=[];
    let remaining=holiday?0:sessions;
    while(remaining>0 && unit<units.length){
      const current=units[unit],take=Math.min(remaining,current.count-consumed);
      lessons.push({title:current.title,take,part:consumed>0?"تتمة":""});
      remaining-=take;consumed+=take;assigned+=take;
      if(consumed===current.count){unit++;consumed=0;}
    }
    rows.push({week:w,date:`${dateText(from)}\n${dateText(end)}`,holiday,lessons,free:remaining});
  }
  const total=units.reduce((n,u)=>n+u.count,0),capacity=(weeks-holidays.size)*sessions;
  return {rows,total,assigned,capacity,minutes,unallocated:total-assigned};
}
function renderSchedule() {
  const d=getFields(), s=scheduleData(d), summary=$("#scheduleSummary");
  if(!s){summary.className="schedule-summary warning";summary.textContent="راجع تواريخ الفترة وأرقام الأسابيع والحصص. ستظهر المعاينة بعد تصحيح المدخلات.";$("#printDocument").innerHTML=paperHeader(d,"التوزيع الزمني")+`<p>مدخلات غير مكتملة أو غير صحيحة. صحّح الحقول قبل الطباعة.</p>`;return;}
  summary.className=`schedule-summary${s.unallocated?" warning":""}`;
  summary.textContent=`${s.assigned} حصة موزّعة من أصل ${s.total} مطلوبة · ${s.capacity} حصة متاحة${s.unallocated?` · تنبيه: ${s.unallocated} حصة خارج الفترة، زد عدد الأسابيع.`:` · ${s.capacity-s.assigned} حصة احتياطية`}`;
  $("#printDocument").innerHTML=paperHeader(d,"تخطيط الحصص حسب الأسابيع")+`<section><p>عدد الأسابيع: ${esc(d.weeks)} · حصص الأسبوع: ${esc(d.sessions)} · مدة الحصة: ${esc(d.minutes)} دقيقة</p></section><table><thead><tr><th>الأسبوع</th><th>الفترة</th><th>الدروس والأنشطة</th><th>الحصص</th></tr></thead><tbody>${s.rows.map(r=>`<tr class="${r.holiday?"holiday-row":""}"><td>${String(r.week).padStart(2,"0")}</td><td dir="ltr">${r.date}</td><td>${r.holiday?"عطلة مدرسية — حسب إدخال الأستاذ":r.lessons.map(l=>`${esc(l.title)}${l.part?" (تتمة)":""} — ${l.take} حصة`).join("\n")}${r.free?`${r.lessons.length?"\n":""}<span class="free-week">حصص احتياطية / دعم — ${r.free} حصة</span>`:""}</td><td>${r.holiday?"—":esc(d.sessions)}</td></tr>`).join("")}</tbody></table>${s.unallocated?`<section><h3>تنبيه التخطيط</h3><p>بقيت ${s.unallocated} حصة من البرنامج دون توزيع. يجب توسيع الفترة أو مراجعة عدد الحصص قبل اعتماد الوثيقة.</p></section>`:""}${d.notes?`<section><h3>ملاحظات</h3><p>${esc(d.notes)}</p></section>`:""}<section><p>المواعيد والعطل مبنية على المدخلات، ويُرجع إلى المقرر الوزاري للتحقق من التقويم الرسمي.</p></section>`+paperFooter();
}
function render(){if(isFiche)renderFiche();else renderSchedule();}
if(isFiche){
  resources.forEach(r=>{const option=document.createElement("option");option.value=r.id;option.textContent=r.title;$("#templateSelect").append(option);});
  loadTemplate("ecosystem");
  $("#templateSelect").addEventListener("change",()=>{
    if(!confirm("استبدال محتوى الدرس والأنشطة بالقالب المحدد؟ تُحفظ بيانات الأستاذ والمؤسسة.")){form.elements.template.value=previousTemplate;return;}
    loadTemplate(form.elements.template.value);previousTemplate=form.elements.template.value;render();status("تم تحميل القالب · يمكنك تعديله وحفظه");
  });
  $("#addActivity").addEventListener("click",()=>{activityFromDOM();if(activities.length>=20){toast("الحد الأقصى 20 مرحلة في الوثيقة.");return;}activities.push({title:"مرحلة جديدة",minutes:"10",teacher:"",learner:"",assessment:""});activityEditors();render();$('[data-field="title"]',$$(".activity-editor").at(-1)).focus();status("تعديلات غير محفوظة");});
}
let previousTemplate=isFiche?form.elements.template.value:"";
try{
  const saved=JSON.parse(localStorage.getItem(storageKey) || "null");
  if(saved && saved.fields && typeof saved.fields==="object"){putFields(saved.fields);if(isFiche && Array.isArray(saved.activities) && saved.activities.length){activities=saved.activities.slice(0,20).map(a=>({title:String(a.title||""),minutes:String(a.minutes||"10"),teacher:String(a.teacher||""),learner:String(a.learner||""),assessment:String(a.assessment||"")}));activityEditors();}status("تم استرجاع المسودة المحفوظة على هذا المتصفح");}
}catch{status("لا تتوفر مسودة قابلة للاسترجاع؛ يمكنك البدء من النموذج.");}
if(isFiche){
  const requested=new URLSearchParams(location.search).get("lesson");
  if(resources.some(r=>r.id===requested)){loadTemplate(requested);status("تم تحميل الدرس من المكتبة · المسودة السابقة لا تُستبدل إلا عند الحفظ");}
  previousTemplate=form.elements.template.value;
}
form.addEventListener("submit",e=>e.preventDefault());
form.addEventListener("input",()=>{if(isFiche)activityFromDOM();render();status("تعديلات غير محفوظة · احفظ المسودة للعودة إليها");});
form.addEventListener("change",()=>{if(isFiche)activityFromDOM();render();});
$("#saveDraft").addEventListener("click",()=>{try{if(isFiche)activityFromDOM();localStorage.setItem(storageKey,JSON.stringify({fields:getFields(),activities:isFiche?activities:[],savedAt:new Date().toISOString()}));status("المسودة محفوظة على هذا المتصفح");toast("تم حفظ مسودتك. يمكنك العودة إليها من المتصفح نفسه.");}catch{toast("تعذر الحفظ المحلي. يمكنك طباعة الوثيقة أو حفظها PDF.");}});
$("#printButton").addEventListener("click",async()=>{if(!form.reportValidity())return;render();if(!isFiche&&!scheduleData(getFields()))return;await document.fonts.ready;window.print();});
render();
