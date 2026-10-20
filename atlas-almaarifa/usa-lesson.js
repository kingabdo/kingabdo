/* The original pedagogical text is rendered verbatim from USA_SOURCE.
   UI labels and editorial cautions are separate from source content. */
function renderUSALesson(resource){
  document.body.classList.add("full-course");
  const source=n=>USA_SOURCE[n-1];
  const originalText=t=>`<span class="source-verbatim">${esc(t)}</span>`;
  const originalTitle=s=>s.titles.map(t=>t.title).join(" · ");
  const imageMap={
    4:["s04-image09"],5:["s05-image02"],6:["s06-image08"],
    14:["s14-image02"],15:["s15-image02"],16:["s16-image02"],17:["s17-image02"],
    19:["s19-image10"],32:["s32-image09"],33:["s33-image09"],34:["s34-image02"],
    35:["s35-image02"],36:["s36-image08"],40:["s40-image09"],44:["s44-image02"],
    46:["s46-image09"],48:["s48-image10"],49:["s49-image02"],50:["s50-image12"],
    53:["s53-image18"],54:["s54-image09"],55:["s55-image10"]
  };
  const notes={
    9:"ملاحظة تحريرية: يظهر نصيب الولايات المتحدة 29% في الجدول و39% في الجواب الأصلي. احتُفظ بالنصين كما وردا؛ لا يُعتمد هذا التعارض دون مراجعة.",
    10:"ملاحظة تحريرية: وحدة إنتاج القطن ونِسَبه ورتبه في الملف تحتاج التحقق. الأرقام هنا منقولة دون تصحيح.",
    11:"ملاحظة تحريرية: يعطي الجدول المرتبة الخامسة للولايات المتحدة، بينما يذكر الجواب المرتبة الرابعة. احتُفظ بالصياغتين الأصليتين.",
    18:"ملاحظة تحريرية: بعض الرتب في هذه الخلاصة تختلف عن الجداول السابقة؛ النص الأصلي محفوظ دون تعديل.",
    20:"ملاحظة تحريرية: عنوان الجدول يذكر 2023، والإحالة الأصلية تجمع 2022 و2023. البيانات وثيقة من الملف وليست تحديثًا إحصائيًا.",
    23:"ملاحظة تحريرية: أعداد العاملين ومقار الشركات والمقارنات الواردة في النصوص تحتاج تحققًا مؤرخًا قبل اعتمادها كمعطيات حالية.",
    24:"ملاحظة تحريرية: النصوص والأعداد من الملف كما هي. لم تُصحَّح مقار الشركات أو أعداد العاملين أو معطيات الطاقة النووية.",
    28:"ملاحظة تحريرية: مجموع القيم الأصلية 106. عُرضت في أعمدة مستقلة دون تطبيعها إلى 100%، حتى لا تُقدَّم كأجزاء من كلّ متّسق.",
    33:"ملاحظة تحريرية: عنوان الخريطة الإنجليزية يتناول الأراضي داخل المستغلات الفلاحية؛ ليس مرادفًا تلقائيًا للأراضي الصالحة للزراعة. احتُفظ بتسمية المصدر.",
    37:"ملاحظة تحريرية: وحدة التساقطات غير مذكورة صراحة في الجدول الأصلي، ولم تُضف وحدة من خارج الملف.",
    41:"ملاحظة تحريرية: وحدات النفط والغاز وسنة المقارنة تحتاج مراجعة. نُقلت عناوين الجداول وقيمها دون تغيير.",
    43:"ملاحظة تحريرية: أسماء الشركات ونسب العاملين في النص تعكس الملف المرفق؛ لا تُعد توثيقًا محدثًا لمقار الشركات.",
    47:"ملاحظة تحريرية: بعض وحدات أطوال الشبكات غير منسجمة في المصدر. لم تُصحَّح أو تُحوَّل أثناء إعادة التصميم.",
    51:"ملاحظة تحريرية: وردت «335 020 960 مليون نسمة» و«1,2 %» للفقر في الملف. هذه قيم وصياغات تحتاج مراجعة؛ احتُفظ بها حرفيًا هنا.",
    54:"ملاحظة تحريرية: آخر فئة في نص الشريحة «أقل من 16 %» بينما يشير مفتاح الصورة إلى أكثر من 16%. لم يُعدَّل أي من النص أو الخريطة.",
    55:"ملاحظة تحريرية: المقارنة بين خريطتين لا تثبت علاقة سببية. لا يجوز اعتبار الانتماء العرقي تفسيرًا بذاته للفقر؛ يلزم فحص السياق الاجتماعي والمنهجي وتواريخ البيانات.",
    57:"ملاحظة تحريرية: المصدر يقدّم تقديرات ممتدة إلى 2028، ولا يحدّد هنا منهج احتساب الناتج. لا تُقرأ هذه السلسلة كقيم فعلية حديثة أو مقارنة للناتج الاسمي."
  };
  const stages=[
    {id:"intro",label:"تقديم الدرس",number:"01",sections:[{id:"introduction",label:"أهداف التعلم والمقدمة",slides:[2,3]},{id:"location",label:"الموقع والحدود",slides:[4,5]}]},
    {id:"power",label:"مظاهر القوة",number:"02",sections:[{id:"agriculture",label:"الفلاحة",slides:[6,7,8,9,10,11,12,13,14,15,16,17,18]},{id:"manufacturing",label:"الصناعة",slides:[19,20,21,22,23,24,25]},{id:"trade",label:"التجارة",slides:[26,27,28,29,30,31]}]},
    {id:"factors",label:"العوامل المفسّرة",number:"03",sections:[{id:"farm-factors",label:"العوامل المفسرة لقوة الفلاحة",slides:[32,33,34,35,36,37,38,39]},{id:"industrial-factors",label:"العوامل المفسرة لقوة الصناعة",slides:[40,41,42,43,44,45]},{id:"trade-factors",label:"العوامل المفسرة لقوة التجارة",slides:[46,47,48,49,50,51,52]}]},
    {id:"challenges",label:"المشاكل والتحديات",number:"04",sections:[{id:"environment",label:"المشاكل الطبيعية والبيئية",slides:[53]},{id:"society",label:"المشاكل الاجتماعية",slides:[54,55]},{id:"competition",label:"المنافسة الاقتصادية",slides:[56,57,58]}]},
    {id:"recap",label:"حصيلة التعلّم",number:"05",sections:[{id:"recap-power",label:"مظاهر القوة",slides:[18,25,31]},{id:"recap-factors",label:"العوامل المفسرة",slides:[39,45,52]},{id:"recap-challenges",label:"المشاكل",slides:[58]}]}
  ];
  const slug=s=>s.replace(/ـ/g,"").replace(/\s+/g," ").trim();
  const isQuestion=t=>/^[\sـ\-–]*(?:حدد|سم |سمي|سمّي|استعن|استنتج|استخرج|استخرح|صف|بين|بيـ|ابـ|أبـ|استخلص|حلل|علق|يقوم المدرس|ـ)/.test(t) || t.includes("يقوم المدرس");
  function renderTexts(s){
    if(s.slide===2)return "";
    if(s.slide===57)return renderTexts({...s,slide:0,text:s.text.filter(t=>!/^\d{4}$/.test(t))});
    if([23,24].includes(s.slide)){
      const labels=s.slide===23?[4,7,6,5]:[4,5,6,7];
      return `<div class="company-profiles">${s.text.slice(0,4).map((t,i)=>`<section class="company-profile"><h4>${originalText(s.text[labels[i]])}</h4><p>${originalText(t)}</p></section>`).join("")}</div>${renderTexts({...s,slide:0,text:s.text.slice(8)})}`;
    }
    if(s.slide===38)return renderTexts({...s,slide:0,text:s.text.slice(14)});
    if([5,53,54,55].includes(s.slide)){
      const terms=s.text.filter(t=>!isQuestion(t)&&t.length<45);
      return `<div class="map-terms">${terms.map(t=>originalText(t)).join("")}</div>${renderTexts({...s,slide:0,text:s.text.filter(t=>!terms.includes(t))})}`;
    }
    if(s.slide>=8&&s.slide<=13)return `<div class="source-statistics"><div><p>${originalText(s.text[0])}</p><strong>${originalText(s.text[1])}</strong></div><div><p>${originalText(s.text[3])}</p><strong>${originalText(s.text[2])}</strong><small>${originalText(s.text[4])}</small></div></div>${renderTexts({...s,slide:0,text:s.text.slice(5)})}`;
    let html="";
    for(let i=0;i<s.text.length;i++){
      const t=s.text[i];if(t.trim()==="الجواب")continue;
      if(s.text[i+1]?.trim()==="الجواب"){html+=`<details class="source-answer"><summary><span>${icon("check")} الجواب الأصلي</span><span>+</span></summary><div>${originalText(t)}</div></details>`;continue;}
      const sourceLabel=/^(Statista|World of statistics|https?:|منظمة الأغذية|الأمـ|بلومبرغ|المكتب التجاري|بيانات أطلس|صحيفة الديلي|موقع أرقام|CNN)/.test(t.trim());
      html+=`<p class="${sourceLabel?"source-reference":isQuestion(t)?"source-question":"source-prose"}">${isQuestion(t)?`<span class="question-icon">${icon("book")}</span>`:""}${originalText(t)}</p>`;
    }
    return html;
  }
  function tableHTML(table,n){
    const columns=table[0].map((_,c)=>c).filter(c=>table.some(row=>row[c]?.trim()));
    if(!columns.length)return "";
    if(table.length===1)return `<div class="source-instruction">${columns.map(c=>originalText(table[0][c])).join(" ")}</div>`;
    return `<div class="source-table-wrap" role="region" tabindex="0" aria-label="جدول من الشريحة ${n}"><table class="source-table"><tbody>${table.map((row,i)=>`<tr>${[...columns].reverse().map(c=>`<${i===0?"th":"td"}${i===0?' scope="col"':""}>${originalText(row[c]||"")}</${i===0?"th":"td"}>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  function figure(file,caption,n){
    return `<figure class="evidence-figure"><button class="evidence-zoom" data-image="assets/usa/${file}.webp" data-caption="${esc(caption)}" aria-label="تكبير ${esc(slug(caption))}"><img src="assets/usa/${file}.webp" alt="${esc(slug(caption))}" loading="lazy" width="1000" height="660"><span class="zoom-hint">${icon("search")} تكبير الوثيقة</span></button><figcaption><span>${originalText(caption)}</span><small>من الشريحة ${n}</small></figcaption></figure>`;
  }
  function bars(rows,unit=""){
    const max=Math.max(...rows.map(r=>Number(r[1])));
    return `<div class="horizontal-chart" aria-label="تمثيل بصري للأرقام الأصلية">${rows.map(r=>`<div class="h-bar-row${/الولايات|و م أ/.test(r[0])?" highlighted":""}"><span>${esc(r[0])}</span><div class="h-bar-track"><i style="width:${Number(r[1])/max*100}%"></i></div><b dir="ltr">${esc(r[1])}${unit}</b></div>`).join("")}</div>`;
  }
  const exports=[1.08,1.02,.99,1.03,1.17,1.29,1.46,1.66,1.85,1.59,1.87,2.14,2.25,2.31,2.39,2.28,2.24,2.39,2.54,2.55,2.16,2.57,3.02,3.05];
  function exportChart(){
    return `<div class="export-chart-wrap" tabindex="0" aria-label="تطور الصادرات، اسحب أفقيًا لاستعراض السنوات"><div class="export-chart" dir="ltr">${exports.map((v,i)=>`<div class="export-column" tabindex="0" aria-label="${2000+i}: ${v} ترليون دولار"><b>${v}</b><i style="height:${v/3.5*210}px"></i><span>${2000+i}</span></div>`).join("")}</div></div><p class="chart-caption">القيم المنقولة من المبيان الأصلي · ترليون دولار · 2000–2023</p>`;
  }
  function competitionChart(){
    const china=[16.69,17.16,18.07,18.42,18.35,18.73,19.01,19.17,19.29,19.38,19.44];
    const usa=[15.81,15.74,15.78,15.74,15.54,15.42,15.2,15,14.84,14.7,14.57];
    const x=i=>60+i*62,y=v=>280-v/20*240;
    const line=(values,color,name)=>`<polyline fill="none" stroke="${color}" stroke-width="3" points="${values.map((v,i)=>`${x(i)},${y(v)}`).join(" ")}"/>${values.map((v,i)=>`<circle tabindex="0" aria-label="${name} ${2018+i}: ${v}%" cx="${x(i)}" cy="${y(v)}" r="4" fill="${color}"><title>${name} ${2018+i}: ${v}%</title></circle>`).join("")}`;
    return `<div class="comparison-chart"><p class="chart-axis-label">% من الناتج العالمي</p><svg viewBox="0 0 735 330" role="img" aria-labelledby="forecastTitle"><title id="forecastTitle">نصيب الصين والولايات المتحدة من الناتج العالمي، أرقام وتقديرات الملف</title>${[0,5,10,15,20].map(v=>`<line x1="60" x2="680" y1="${y(v)}" y2="${y(v)}" stroke="#e3e8e0"/><text x="40" y="${y(v)+4}" fill="#7a8771">${v}%</text>`).join("")}${china.map((_,i)=>`<text x="${x(i)}" y="309" text-anchor="middle" fill="#74816b">${2018+i}</text>`).join("")}${line(china,"#ad7549","الصين")}${line(usa,"#24664f","الولايات المتحدة")}</svg><div class="chart-legend"><span><i style="background:#ad7549"></i>نصيب الصين</span><span><i style="background:#24664f"></i>نصيب الولايات المتحدة</span></div></div><details class="chart-data"><summary>عرض قيم المبيان</summary>${tableHTML([["نصيب الولايات المتحدة","نصيب الصين","السنة"],...china.map((v,i)=>[String(usa[i]),String(v),String(2018+i)])],57)}</details>`;
  }
  function agroDiagram(s){
    return `<div class="agro-diagram"><div class="agro-title">${originalText(s.text[7])}</div><div class="agro-core"><span>${originalText(s.text[10])}</span><b>${originalText(s.text[11])}</b><span>${originalText(s.text[8])}</span><b>${originalText(s.text[11])}</b><span>${originalText(s.text[9])}</span></div><div class="agro-support">${s.text.slice(0,6).map(t=>`<div>${originalText(t)}</div>`).join("")}</div><p class="agro-source-label">${originalText(s.text[6])}</p></div>`;
  }
  function visuals(s){
    const n=s.slide;
    if(n===2)return `<div class="learning-goals">${[0,1,2].map((i)=>`<section class="learning-goal"><div><b>${originalText(s.text[[2,0,1][i]])}</b><h4>${originalText(s.text[i+3])}</h4></div><p>${originalText(s.tables[0][i][0])}</p></section>`).join("")}</div>`;
    if(n>=8&&n<=13){const t=s.tables.find(t=>t.length>2);return t?bars(t.slice(1).map(r=>[r[3],r[2].trim()])):"";}
    if(n===20){const t=s.tables.find(t=>t.length>5);return bars(t.slice(1).map(r=>[r[2],r[0].replace("%","").trim()]),"%");}
    if(n===27)return exportChart();
    if(n===28)return bars(s.charts[0].categories.map((v,i)=>[v,s.charts[0].series[0].values[i]]));
    if(n===38)return agroDiagram(s);
    if(n===57)return competitionChart();
    if(n===7){const names=[...s.tables[0][0]].reverse().concat([...s.tables[0][2]].reverse());return `<div class="products-gallery">${[10,11,12,13,14,15].map((i,j)=>`<figure><img src="assets/usa/s07-image${i}.webp" alt="${esc(names[j])}" width="160" height="120" loading="lazy"><figcaption>${originalText(names[j])}</figcaption></figure>`).join("")}</div>`;}
    return (imageMap[n]||[]).map(file=>figure(file,originalTitle(s),n)).join("");
  }
  function documentHTML(n,context=""){
    const s=source(n),title=originalTitle(s),photo=[14,15,16,17,34,35,44].includes(n);
    const isSummary=[18,25,31,39,45,52,58].includes(n);
    const containsData=[8,9,10,11,12,13,20,27,28,37,41,42,47,51,57].includes(n);
    return `<article class="course-document${photo?" photo-document":""}${isSummary?" summary-document":""}" data-source-slide="${n}" id="${context}-doc-${n}"><div class="document-heading"><div><span class="document-type">${photo?"وثيقة مصورة":isSummary?"حصيلة التعلمات":containsData?"قراءة المعطيات":"من وثائق الدرس"}</span><h3>${title?originalText(title):n===2?"أهــــداف التعلــــم":n===3?"المقدمــــــــــــة":"نصوص الوثيقة"}</h3></div><span class="source-page" title="رقم الشريحة الأصلية">${String(n).padStart(2,"0")}</span></div>${notes[n]?`<aside class="editorial-note"><strong>للمراجعة</strong>${esc(notes[n])}</aside>`:""}${visuals(s)}${[2,7].includes(n)?"":s.tables.map(t=>tableHTML(t,n)).join("")}<div class="document-texts">${renderTexts(s)}</div></article>`;
  }
  function stageHTML(stage){
    return `<section class="course-panel" id="panel-${stage.id}" role="tabpanel" aria-labelledby="tab-${stage.id}" ${stage.id!=="intro"?"hidden":""}><div class="chapter-layout"><aside class="chapter-sidebar"><span class="eyebrow">مسار الدرس</span><strong>${stage.label}</strong><nav aria-label="فهرس ${stage.label}">${stage.sections.map((s,i)=>`<a href="#section-${s.id}" data-section="${s.id}"><span>0${i+1}</span>${s.label}${icon("arrow")}</a>`).join("")}</nav><div class="sidebar-provenance">${icon("document")}<p>النصوص كما وردت في الملف.<br>الوثائق في عرض جديد.</p></div></aside><div class="chapter-body">${stage.sections.map(section=>`<section class="course-section" id="section-${section.id}"><header class="course-section-head"><span>${stage.number}</span><div><p>${stage.label}</p><h2>${section.label}</h2></div></header>${section.slides.map(n=>documentHTML(n,section.id)).join("")}</section>`).join("")}<div class="chapter-bottom"><span>أكملت محور «${stage.label}»</span>${stages.indexOf(stage)<4?`<button class="button primary" data-stage-next="${stages[stages.indexOf(stage)+1].id}">المحور التالي ${icon("arrow")}</button>`:`<a class="button primary" href="fiche.html?lesson=usa">إعداد جذاذة الدرس ${icon("arrow")}</a>`}</div></div></div></section>`;
  }
  $("#lessonCrumb").textContent="الثالثة إعدادي · الجغرافيا";
  $("#lessonContent").innerHTML=`
    <section class="usa-hero"><div class="usa-hero-copy"><div class="usa-meta"><span>الثالثة إعدادي</span><span>الجغرافيا</span><span>الدورة الثانية</span></div><p class="usa-lesson-number">الدرس 07</p><h1>الولايات المتحدة<br>الأمريكية <span>قوة عالمية</span></h1><p class="usa-subtitle">النصوص الأصلية، وقراءة جديدة للوثائق.</p><div class="usa-hero-actions"><a class="button light-button" href="#usa-intro">ابدأ الدرس ${icon("arrow")}</a><button class="presentation-toggle" id="presentationToggle" aria-pressed="false">${icon("grid")} وضع العرض</button></div><div class="usa-hero-meta"><span>${icon("clock")} حصتان</span><span>${icon("document")} 58 شريحة مرجعية</span><span>${icon("book")} 3 أنشطة رئيسية</span></div></div><figure class="usa-hero-photo"><img src="assets/new-york.jpg" alt="أفق نيويورك عند الغروب" width="900" height="600" fetchpriority="high"><figcaption><span>NEW YORK, UNITED STATES</span><strong>قراءة في القوة الاقتصادية.</strong></figcaption></figure></section>
    <div class="source-integrity">${icon("check")}<p><strong>أُعيد تصميم طريقة العرض، مع الحفاظ على النصوص.</strong> نُقلت النصوص والجداول دون إعادة صياغة. تظهر ملاحظات التدقيق منفصلة بلون مميز؛ الأرقام مؤرخة بحسب الملف وليست تحديثًا لعام 2026.</p><a href="#sourcePolicy">تفاصيل المصدر ↓</a></div>
    <nav class="course-tabs" aria-label="محاور الدرس" role="tablist">${stages.map((s,i)=>`<button role="tab" id="tab-${s.id}" aria-controls="panel-${s.id}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-stage="${s.id}"><span>${s.number}</span>${s.label}</button>`).join("")}</nav>
    <div class="course-reading-progress" aria-hidden="true"><i id="courseProgress"></i></div>
    ${stages.map(stageHTML).join("")}
    <section class="source-policy" id="sourcePolicy"><div><p class="eyebrow">أمانة المحتوى</p><h2>الملف هو مرجع النص.</h2><p>حُفظت النصوص والأسئلة والأجوبة وخلايا الجداول كما وردت في العرض. أُزيلت عناصر التنقل المتكررة الخاصة بالشرائح، مع إعادة توزيع الوثائق على محاور الدرس.</p></div><div><details><summary>ما الذي تغيّر في التصميم؟ <span>+</span></summary><p>أُعيد بناء الجداول والمبيانات رقميًا، وأصبحت الأجوبة قابلة للإظهار عند الحاجة. أُعيد تنظيم خطاطة الأكروبيزنيس، وأتيحت الخرائط والصور للتكبير دون تغيير حدودها أو مفاتيحها. حُفظت القيم الأصلية حتى عندما ظهر تعارض داخل الملف.</p></details><details><summary>تواريخ البيانات وملاحظات المراجعة <span>+</span></summary><p>يتضمن الملف معطيات من سنوات متعددة، منها 2022 و2023 و2024، وتقديرات إلى 2028. التنبيهات باللون الرملي ملاحظات تحريرية خارج النص الأصلي، وليست تعديلات عليه أو تدقيقًا شاملاً لكل إحصاء.</p></details><details><summary>المستوى الدراسي وملف المرجع <span>+</span></summary><p>المادة: الجغرافيا. المستوى: الثالثة إعدادي. الدورة الثانية. رقم الدرس 07 ومدته حصتان كما في الشريحة الأولى. المرجع: ملف «الولايـــــات المتحدة الأمريكية قوة عالميـــــة.pptx» المقدم من الأستاذ.</p><a href="https://www.alloschool.com/element/132807/doc" target="_blank" rel="noopener" class="text-link">مرجع مطابقة عنوان الدرس بالمستوى ←</a><p class="original-cover-text">${originalText(source(1).text[0])}</p></details></div></section>
    <dialog id="evidenceDialog" class="evidence-dialog" aria-labelledby="evidenceDialogTitle"><div class="dialog-toolbar"><h2 id="evidenceDialogTitle"></h2><button id="closeEvidence" aria-label="إغلاق الوثيقة">${icon("close")}</button></div><div class="dialog-image"><img id="largeEvidence" alt=""></div><a id="openEvidence" target="_blank" rel="noopener">فتح الصورة بحجمها الأصلي ↗</a></dialog>`;

  const tabButtons=$$("[data-stage]"),panels=$$(".course-panel");
  function activate(id,scroll=false){
    if(!stages.some(s=>s.id===id))id="intro";
    panels.forEach(p=>p.hidden=p.id!==`panel-${id}`);
    tabButtons.forEach(b=>{const active=b.dataset.stage===id;b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1;});
    if(scroll)$(".course-tabs").scrollIntoView({behavior:"smooth",block:"start"});
    updateProgress();
  }
  function goStage(id){history.pushState(null,"",`#usa-${id}`);activate(id,true);}
  $(".usa-hero-actions a").addEventListener("click",e=>{e.preventDefault();goStage("intro");});
  tabButtons.forEach((button,i)=>{button.addEventListener("click",()=>goStage(button.dataset.stage));button.addEventListener("keydown",e=>{let next;if(e.key==="ArrowLeft")next=(i+1)%tabButtons.length;else if(e.key==="ArrowRight")next=(i-1+tabButtons.length)%tabButtons.length;else if(e.key==="Home")next=0;else if(e.key==="End")next=tabButtons.length-1;else return;e.preventDefault();tabButtons[next].focus();goStage(tabButtons[next].dataset.stage);});});
  $$("[data-stage-next]").forEach(b=>b.addEventListener("click",()=>goStage(b.dataset.stageNext)));
  $$("[data-section]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();document.getElementById(`section-${a.dataset.section}`).scrollIntoView({behavior:"smooth",block:"start"});}));
  addEventListener("hashchange",()=>{if(location.hash.startsWith("#usa-"))activate(location.hash.slice(5),true);});
  addEventListener("popstate",()=>activate(location.hash.startsWith("#usa-")?location.hash.slice(5):"intro"));
  function updateProgress(){const panel=$(".course-panel:not([hidden])");if(!panel)return;const rect=panel.getBoundingClientRect(),distance=Math.max(1,panel.offsetHeight-innerHeight);$("#courseProgress").style.width=`${Math.max(0,Math.min(100,-rect.top/distance*100))}%`;}
  addEventListener("scroll",updateProgress,{passive:true});
  $("#presentationToggle").addEventListener("click",()=>{const on=document.body.classList.toggle("presentation-mode");$("#presentationToggle").setAttribute("aria-pressed",String(on));toast(on?"وضع العرض مفعّل: نص أكبر ومساحة أوسع للوثائق.":"العودة إلى وضع القراءة.");});
  const dialog=$("#evidenceDialog");let opener=null;
  $$("[data-image]").forEach(b=>b.addEventListener("click",()=>{opener=b;$("#evidenceDialogTitle").textContent=slug(b.dataset.caption);$("#largeEvidence").src=b.dataset.image;$("#largeEvidence").alt=slug(b.dataset.caption);$("#openEvidence").href=b.dataset.image;dialog.showModal();}));
  $("#closeEvidence").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener("close",()=>opener?.focus());
  activate(location.hash.startsWith("#usa-")?location.hash.slice(5):"intro");
}
