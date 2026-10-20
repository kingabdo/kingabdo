/* Document-based lesson (Moroccan pedagogy): documents, guided tasks, data extraction, synthesis.
   Document texts are verbatim from WW2_SOURCE. Tasks, suggested answers and tables are editorial
   proposals for the teacher, built only from the documents, and are labelled as such. */
function renderWW2Lesson(resource){
  document.body.classList.add("full-course");
  const T=(n,i)=>WW2_SOURCE[n-1].text[i];
  const orig=t=>`<span class="source-verbatim">${esc(t)}</span>`;
  const slug=s=>s.replace(/ـ/g,"").replace(/\s+/g," ").trim();
  const img=n=>`assets/ww2/s${String(n).padStart(2,"0")}.webp`;
  const store={
    get(k){try{return localStorage.getItem("atlas-ww2:"+k)||"";}catch(e){return "";}},
    set(k,v){try{v?localStorage.setItem("atlas-ww2:"+k,v):localStorage.removeItem("atlas-ww2:"+k);}catch(e){}}
  };

  /* ---------- document building blocks ---------- */
  const prose=t=>`<p class="wd-text">${orig(t)}</p>`;
  const figure=(n,caption)=>`<figure class="wd-figure"><button class="evidence-zoom" data-image="${img(n)}" data-caption="${esc(caption)}" aria-label="تكبير ${esc(slug(caption))}"><img src="${img(n)}" alt="${esc(slug(caption))}" loading="lazy" width="1000" height="563"><span class="zoom-hint">${icon("search")} تكبير الوثيقة</span></button><figcaption>${orig(caption)}</figcaption></figure>`;
  const gallery=items=>`<div class="wd-gallery">${items.map(([n,c])=>figure(n,c)).join("")}</div>`;
  const facts=list=>`<ul class="wd-facts">${list.map(([date,text])=>`<li>${date?`<b>${orig(date)}</b>`:""}${orig(text)}</li>`).join("")}</ul>`;
  const timeline=items=>`<ol class="wd-timeline">${items.map(([date,text])=>`<li><time>${orig(date)}</time><p>${orig(text)}</p></li>`).join("")}</ol>`;
  const bars=(rows)=>{const max=Math.max(...rows.map(r=>r.v));return `<div class="horizontal-chart" role="img" aria-label="تمثيل بصري للأرقام الأصلية">${rows.map(r=>`<div class="h-bar-row side-${r.side||"allies"}"><span>${esc(r.label)}</span><div class="h-bar-track"><i style="width:${Math.max(1.5,r.v/max*100)}%"></i></div><b>${esc(r.text)}</b></div>`).join("")}</div>`;};
  const attribution=(...ts)=>`<p class="wd-source">${ts.map(orig).join(" · ")}</p>`;

  /* ---------- tasks and tables ---------- */
  const verbs={extract:["استخرج","extract"],analyse:["حلّل","analyse"],compare:["قارن","compare"],order:["رتّب","order"],discuss:["ناقش","discuss"],conclude:["استنتج","conclude"]};
  function table(id,spec){
    const head=`<tr>${spec.cols.map(c=>`<th scope="col">${esc(c)}</th>`).join("")}</tr>`;
    const rows=spec.rows.map((r,ri)=>`<tr>${r.map((cell,ci)=>cell===null?`<td><textarea rows="2" class="wd-input" data-key="${id}-${ri}-${ci}" aria-label="${esc(spec.cols[ci])}: ${esc(r[0]||"")}"></textarea></td>`:`<th scope="row">${esc(cell)}</th>`).join("")}</tr>`).join("");
    const ans=spec.answer.map(r=>`<tr>${r.map((c,i)=>i===0?`<th scope="row">${esc(c)}</th>`:`<td>${esc(c)}</td>`).join("")}</tr>`).join("");
    return `<div class="wd-table-wrap" role="region" tabindex="0" aria-label="جدول لاستخراج المعطيات"><table class="wd-table"><thead>${head}</thead><tbody>${rows}</tbody></table></div><details class="wd-answer"><summary><span>${icon("check")} الجدول المقترح</span><span>+</span></summary><div class="wd-table-wrap"><table class="wd-table answer"><thead>${head}</thead><tbody>${ans}</tbody></table></div></details>`;
  }
  function task(id,t){
    const [label,cls]=verbs[t.verb];
    return `<li class="wd-task verb-${cls}"><span class="wd-verb">${label}</span><div class="wd-task-body"><p class="wd-question">${esc(t.q)}</p>${t.table?table(id,t.table):`<textarea class="wd-input" rows="2" data-key="${id}" placeholder="إجابتي" aria-label="إجابتي: ${esc(t.q)}"></textarea>`}${t.a?`<details class="wd-answer"><summary><span>${icon("check")} الجواب المقترح</span><span>+</span></summary><div>${t.a.map(x=>`<p>${esc(x)}</p>`).join("")}</div></details>`:""}${t.hint?`<p class="wd-hint">${esc(t.hint)}</p>`:""}</div></li>`;
  }

  /* ---------- the documents ---------- */
  const sumAllies=21000+290+600+231, sumAxis=6000+2000+280;
  const fmt=v=>(v/1000).toFixed(1).replace(".",",");
  const DOCS=[
    {id:1,stage:"intro",kind:"نص تاريخي",title:"ألمانيا بعد معاهدة فرساي",source:`${T(3,3)} · ${T(3,4)}`,
      text:()=>prose(T(3,2)),
      tasks:[
        {verb:"extract",q:"استخرج الشروط التي فُرضت على ألمانيا بعد الحرب العالمية الأولى.",a:["نزع سلاحها.","اعتبارها المسؤولة الرئيسية عن الحرب.","دفع تعويضات عجز الاقتصاد الألماني عن الوفاء بها.","احتلال بعض أراضيها ضمانًا للوفاء بالتزاماتها المالية."]},
        {verb:"analyse",q:"كيف كان وضع ألمانيا النفسي بعد المعاهدة؟ ومن التفّ حوله الشعب الألماني؟",a:["حالة من الإحباط واليأس.","التفّ الشعب حول قائد أقسم على الثأر وإعادة بعث المجد الألماني، وهو أدولف هتلر."]},
        {verb:"discuss",q:"كيف يمكن لهذه الشروط أن تدفع إلى حرب جديدة؟ صِغ فرضية.",hint:"إجابة مفتوحة: تُدوَّن الفرضيات على السبورة وتُراجَع في آخر النشاط."}
      ]},
    {id:2,stage:"act1",kind:"خطاب",title:T(4,4),source:T(4,5),
      text:()=>prose(T(4,3)),
      tasks:[
        {verb:"extract",q:"استخرج الأهداف الخارجية التي حددها هتلر.",a:["مواجهة بنود معاهدة فرساي.","البحث عن تحالفات وتقوية الجيش الألماني.","فرض إجبارية الخدمة العسكرية.","البحث عن أسواق جديدة."]},
        {verb:"discuss",q:"ما العلاقة بين «البحث عن أسواق جديدة» والأزمة الاقتصادية؟",hint:"اربط الجواب بمعطيات الوثيقة 3."}
      ]},
    {id:3,stage:"act1",kind:"معطيات",title:T(5,20),source:"شريحة 5 من العرض",
      visual:()=>`<div class="wd-crises"><section><h4>${orig(T(5,5))}</h4><ul><li>${orig(T(5,0))}</li><li>${orig(T(5,1))}</li><li>${orig(T(5,2))}</li><li>${orig(T(5,3)+"\n"+T(5,4))}</li></ul></section><section><h4>${orig(T(5,11))}</h4><ul><li>${orig(T(5,6))}</li></ul>${bars([{label:"ألمانيا",v:6,text:"6 ملايين عاطل",side:"axis"},{label:"بريطانيا",v:3,text:"3 ملايين عاطل"},{label:"إيطاليا",v:1,text:"مليون عاطل",side:"axis"},{label:"فرنسا",v:.5,text:"نصف مليون عاطل"}])}</section><section><h4>${orig(T(5,12))}</h4><ul><li>${orig(T(5,13)+"\n"+T(5,14))}</li><li>${orig(T(5,15)+"\n"+T(5,16))}</li></ul></section></div>`,
      tasks:[
        {verb:"extract",q:"أتمم الجدول بمظاهر الأزمة، ثم قارنه بالجواب المقترح.",table:{cols:["نوع الأزمة","مظاهرها"],rows:[["اقتصادية",null],["اجتماعية",null],["سياسية",null]],answer:[["اقتصادية","انهيار الإنتاج، إفلاس المؤسسات المالية والصناعية، إلغاء مبدأ التبادل الحر، تطبيق الحمائية على الأسواق والمستعمرات."],["اجتماعية","ارتفاع معدلات البطالة."],["سياسية","فقدان الثقة في المؤسسات الديمقراطية البرلمانية، وصعود أنظمة ديكتاتورية شمولية (ألمانيا – إيطاليا)."]]}},
        {verb:"compare",q:"رتّب الدول حسب عدد العاطلين. أي دولة كانت الأكثر تضررًا؟",a:["ألمانيا (6 ملايين)، ثم بريطانيا (3 ملايين)، ثم إيطاليا (مليون)، ثم فرنسا (نصف مليون).","ألمانيا هي الأكثر تضررًا، وهي أيضًا الدولة التي صعد فيها نظام شمولي."]},
        {verb:"discuss",q:"كيف أدت الأزمة الاقتصادية إلى عودة التوتر الدولي؟",a:["انهيار الإنتاج والحمائية أضعفا التبادل بين الدول وزادا البطالة.","فقد الناس الثقة في الديمقراطية البرلمانية، فصعدت أنظمة شمولية في ألمانيا وإيطاليا."]}
      ]},
    {id:4,stage:"act1",kind:"خرائط",title:"توسعات ألمانيا وإيطاليا واليابان",source:"شرائح 7 و8 و9 من العرض",note:"ملاحظة تحريرية: تذكر الخريطة «ضم سلوفاكيا 1938»، وتذكر الشريحة 11 «دخول الجيوش النازية براغ» سنة 1939، وتذكر الخريطة الإيطالية «إحتلال ليبيا 1931» وقد بدأ الاحتلال سنة 1911. التسميات والتواريخ منقولة كما وردت وتحتاج إلى مراجعة.",
      imgs:[[7,T(7,23)],[8,T(8,10)],[9,T(9,6)]],
      tasks:[
        {verb:"extract",q:"أنجز جدول مقارنة بين توسعات الدول الثلاث اعتمادًا على الخرائط.",table:{cols:["الدولة","التوسع","السنة"],rows:[["ألمانيا",null,null],["ألمانيا",null,null],["ألمانيا",null,null],["ألمانيا",null,null],["إيطاليا",null,null],["إيطاليا",null,null],["اليابان",null,null]],answer:[["ألمانيا","ضم السار وتسليح رينانيا","1935"],["ألمانيا","ضم النمسا","1938"],["ألمانيا","ضم السوديت","1938"],["ألمانيا","ضم سلوفاكيا","1938"],["إيطاليا","غزو إثيوبيا","1935"],["إيطاليا","إحتلال ليبيا","1931"],["اليابان","منشوريا (الصين)","غير مؤرخ في الخريطة"]]}},
        {verb:"analyse",q:"في أي مجال جغرافي توسعت كل دولة؟",a:["ألمانيا: وسط أوروبا وشرقها (النمسا، السوديت، سلوفاكيا).","إيطاليا: شمال إفريقيا وشرقها (ليبيا، إثيوبيا).","اليابان: شرق آسيا (منشوريا والصين)."]},
        {verb:"discuss",q:"ما القاسم المشترك بين هذه التوسعات؟ وكيف تفسر عدم تدخل الدول الأخرى فورًا؟",hint:"إجابة مفتوحة: يمكن ربط الجواب بالوثيقة 2 (البحث عن أسواق جديدة) وبالوثيقة 5."}
      ]},
    {id:5,stage:"act1",kind:"خط زمني",title:T(10,8),source:"شريحتان 10 و11 من العرض",
      visual:()=>timeline([[T(10,1),T(10,0)],[T(10,3),T(10,2)+"\n"+T(10,4)],[T(10,7),T(10,5)+" "+T(10,6)],[T(11,1),T(11,0)],[T(11,2),T(11,3)],[T(11,5),T(11,4)]]),
      tasks:[
        {verb:"extract",q:"استخرج الحدث الذي يمثل تحالفًا بين ثلاث دول، وحدد تاريخه.",a:["تكوين حلف دول المحور (ألمانيا – إيطاليا – اليابان) سنة 1937."]},
        {verb:"analyse",q:"ما الدليل في الوثيقة على أن التوتر ازداد بين 1933 و1939؟",a:["تتابع الأحداث دون تراجع: الانسحاب من عصبة الأمم (1933)، ضم السار وغزو إثيوبيا (1935)، حلف المحور (1937)، ضم النمسا ومؤتمر ميونيخ (1938)، ثم غزو بولندا (1939)."]},
        {verb:"discuss",q:"ماذا يدل انعقاد مؤتمر ميونيخ بعد ضم النمسا مباشرة؟",hint:"إجابة مفتوحة: تُستثمر معارف التلاميذ حول سياسة التهدئة."}
      ]},
    {id:6,stage:"act1",kind:"خريطة",title:T(12,13),source:"شريحة 12 من العرض",
      imgs:[[12,T(12,13)]],extra:()=>`<p class="wd-callout"><b>${orig(T(12,10)+" "+T(12,11))}</b>${orig(T(12,12))}</p>`,
      tasks:[
        {verb:"extract",q:"حدّد السبب المباشر لاندلاع الحرب، وردّ فعل دول التحالف.",a:["السبب المباشر: غزو ألمانيا لبولندا سنة 1939.","ردّ الفعل: أعلنت دول التحالف الحرب على ألمانيا."]},
        {verb:"conclude",q:"استنتج: ما الفرق بين الأسباب غير المباشرة والسبب المباشر؟",a:["الأسباب غير المباشرة تراكمت على مدى سنوات (أزمة، شروط فرساي، توسعات، أحلاف).","السبب المباشر هو الحدث الذي أشعل الحرب فعليًا: غزو بولندا."]}
      ]},
    {id:7,stage:"act2",kind:"رسم تخطيطي",title:T(13,13),source:"شريحة 13 من العرض",
      visual:()=>`<div class="wd-sides"><section class="axis"><h4>${orig(T(13,6))}</h4><ul><li><b>${orig(T(13,7))}</b>${orig(T(13,1))}</li><li><b>${orig(T(13,8))}</b>${orig(T(13,0))}</li><li><b>${orig(T(13,9))}</b>${orig(T(13,2))}</li></ul></section><section class="allies"><h4>${orig(T(13,14))}</h4><ul><li><b>${orig(T(13,10))}</b>${orig(T(13,4))}</li><li><b>${orig(T(13,11))}</b>${orig(T(13,3))}</li><li><b>${orig(T(13,12))}</b>${orig(T(13,5))}</li></ul></section></div>`,
      tasks:[
        {verb:"extract",q:"أنجز جدولًا بطرفي الحرب وقادتهم.",table:{cols:["المعسكر","الدولة","القائد"],rows:[["دول المحور","ألمانيا",null],["دول المحور","اليابان",null],["دول المحور","إيطاليا",null],["دول التحالف","الاتحاد السوفياتي",null],["دول التحالف","إنجلترا",null],["دول التحالف","فرنسا",null]],answer:[["دول المحور","ألمانيا","هتلر"],["دول المحور","اليابان","هيروهيتو"],["دول المحور","إيطاليا","موسوليني"],["دول التحالف","الاتحاد السوفياتي","ستالين"],["دول التحالف","إنجلترا","تشرشل"],["دول التحالف","فرنسا","ديجول"]]}},
        {verb:"discuss",q:T(13,15)+" عبّر عن توقعك واذكر مبرراته.",hint:"إجابة مفتوحة: تُراجَع التوقعات في نهاية النشاط."}
      ]},
    {id:8,stage:"act2",kind:"خط زمني",title:T(14,13),source:"شريحة 14 من العرض",
      visual:()=>`${timeline([[T(14,0),T(14,4)],[T(14,1),T(14,5)+" "+T(14,6)],[T(14,2),T(14,7)],[T(14,3),T(14,8)]])}<div class="wd-phases"><span>${orig(T(14,14))}: ${orig(T(14,9))}</span><span>${orig(T(14,15))}: ${orig(T(14,10))}</span><span>${orig(T(14,11))}</span></div>`,
      tasks:[
        {verb:"extract",q:"حدّد الحدث الذي يفصل بين المرحلتين، وتاريخه.",a:["هجوم اليابان على قاعدة بيرل هاربر ودخول الولايات المتحدة الحرب، في 7 ديسمبر 1941."]},
        {verb:"compare",q:"قارن بين مدة كل مرحلة وخاصيتها.",a:["المرحلة الأولى (من 1 شتنبر 1939 إلى 7 ديسمبر 1941): الاكتساح الألماني.","المرحلة الثانية (من 7 ديسمبر 1941 إلى 1945): انقلاب موازين القوى لصالح دول الحلفاء."]}
      ]},
    {id:9,stage:"act2",kind:"خرائط",title:"المرحلة الأولى: الاكتساح الألماني",source:"شرائح 17 و18 و19 و20 من العرض",note:"ملاحظة تحريرية: كانت السويد محايدة، والدولتان اللتان غُزيتا سنة 1940 في شمال أوروبا هما الدانمارك والنرويج. الاسم محفوظ كما ورد في الملف ويحتاج إلى تحقق.",
      lead:T(16,1).replace(/\s+/g," "),imgs:[[17,T(17,15)],[18,T(18,9)],[19,T(19,9)],[20,T(20,10)]],extra:()=>`${facts([[T(17,9),T(17,10)],[T(17,11),T(17,12)],[T(17,13),T(17,14)],[T(18,11),T(18,12)],[T(18,13),T(18,14)],[T(20,12),T(20,13)]])}<p class="wd-callout">${orig(T(19,11))}</p>`,
      tasks:[
        {verb:"extract",q:"استخرج أحداث سنة 1940 وأحداث سنة 1941 في جدول زمني.",table:{cols:["السنة","الأحداث"],rows:[["1940",null],["1941",null]],answer:[["1940","احتلال المجر وبلغاريا والسويد وهولندا (كما وردت في الخريطة)، فشل الهجوم الجوي على إنجلترا، اجتياح فرنسا."],["1941","الهجوم على الاتحاد السوفياتي، ووصول الجيوش الألمانية إلى موسكو."]]}},
        {verb:"analyse",q:"لماذا اتجهت الجيوش الألمانية نحو الشرق؟",a:["بعد فشل الهجوم على إنجلترا، قررت مهاجمة الاتحاد السوفياتي."]},
        {verb:"conclude",q:"استنتج: ما الذي يدل على أن سنة 1940 كانت سنة اكتساح؟",a:["اتساع المساحة التي تسيطر عليها ألمانيا في الخريطة، خاصة بعد اجتياح فرنسا."]}
      ]},
    {id:10,stage:"act2",kind:"نص ووثائق مصورة",title:T(22,2),source:`${T(22,1)} · شرائح 21 و22 و23 و24`,
      text:()=>prose(T(22,0)),imgs:[[21,"حصار لينغراد والشتاء الروسي"],[23,T(23,0)],[24,T(24,0)]],extra:()=>facts([["",T(21,10)],["",T(21,11)]]),
      tasks:[
        {verb:"extract",q:"استخرج من النص: تاريخ الغزو، واسم العملية، وعدد الضحايا، ونتيجة الجبهة الشرقية.",table:{cols:["المعطى","القيمة"],rows:[["تاريخ الغزو",null],["اسم العملية",null],["عدد الضحايا",null],["النتيجة",null]],answer:[["تاريخ الغزو","22 يونيو 1941"],["اسم العملية","بارباروسا"],["عدد الضحايا","أكثر من 30 مليون إنسان"],["النتيجة","انتصار ساحق للسوفيات وسحق الجيش الألماني"]]}},
        {verb:"analyse",q:"صف الصورتين (23 و24) وبيّن ما تدلان عليه حول طبيعة الحرب.",hint:"إجابة مفتوحة: لاحظ دمار المدينة وحجم الخسائر البشرية."},
        {verb:"discuss",q:"لماذا وُصفت الجبهة الشرقية بأنها «بداية النهاية لهزيمة ألمانيا»؟",a:["لأنها كانت أكبر خسارة تكبدها الألمان في الحرب، وانتهت بسحق الجيش الألماني."]}
      ]},
    {id:11,stage:"act2",kind:"خريطة ونص",title:T(26,6),source:"شريحة 26 من العرض",
      imgs:[[26,T(26,6)]],extra:()=>facts([["",T(26,8)],["",T(26,9)],["",T(26,10)]]),
      tasks:[
        {verb:"extract",q:"رتّب الأحداث التي أدت إلى دخول الولايات المتحدة الحرب.",a:["غزو اليابان للصين قبل اندلاع الحرب.","مقاطعة اقتصادية على اليابان من الولايات المتحدة وحلفائها.","هجوم اليابان على بيرل هاربر في 7 ديسمبر 1941.","دخول الولايات المتحدة الحرب إلى جانب دول التحالف."]},
        {verb:"discuss",q:"ما أثر دخول الولايات المتحدة على ميزان القوى؟",a:["انقلبت موازين القوى لصالح دول التحالف (المرحلة الثانية)."]}
      ]},
    {id:12,stage:"act2",kind:"خرائط",title:"انقلاب موازين القوى",source:"شرائح 28 و29 و30 من العرض",
      imgs:[[28,T(28,14)],[29,T(29,10)],[30,T(30,9)]],extra:()=>facts([["",T(28,16)],["",T(28,17)],["",T(28,11)],["",T(28,13)]]),
      tasks:[
        {verb:"extract",q:"أين نزلت القوات الأمريكية سنة 1942؟ وماذا فعل هتلر تحسبًا لهجوم الحلفاء؟",a:["نزلت في الدار البيضاء، أي في شمال إفريقيا.","أقام هتلر عدة تحصينات على الساحل الأطلسي."]},
        {verb:"analyse",q:"ماذا تبين الخريطتان 29 و30 عن مسار المعارك على الجبهة الشرقية؟",a:["هزيمة الجيش الألماني في معركة ستالينغراد، ثم تراجع الألمان."]},
        {verb:"discuss",q:"ما أهمية موقع المغرب في الحرب العالمية الثانية انطلاقًا من هذه الوثيقة؟",hint:"إجابة مفتوحة: استثمر خريطة 28 وموقع الدار البيضاء على الساحل الأطلسي."}
      ]},
    {id:13,stage:"act2",kind:"نص وخريطة وصورة",title:T(32,3),source:`${T(32,1)} · شرائح 31 و32 و33`,note:"ملاحظة تحريرية: الرقم «أكثر من مليوني جندي» يخص على الأرجح مجمل حملة النورماندي وليس يوم الإنزال وحده. يحتاج إلى توضيح؛ النص محفوظ كما ورد.",
      text:()=>prose(T(32,0)),imgs:[[31,T(31,9)],[33,T(33,0)]],extra:()=>`<p class="wd-callout">${orig(T(31,11)+" "+T(31,12))}</p>`,
      tasks:[
        {verb:"extract",q:"أنجز بطاقة تعريف لعملية الإنزال.",table:{cols:["المعطى","القيمة"],rows:[["التاريخ",null],["الموقع",null],["منطلق القوات",null],["القائد",null],["الوسائل المذكورة",null]],answer:[["التاريخ","6 يونيو 1944"],["الموقع","سواحل النورماندي، شمال غربي فرنسا"],["منطلق القوات","بريطانيا"],["القائد","الجنرال الأمريكي أيزنهاور"],["الوسائل المذكورة","300 ألف مركبة عسكرية، 6900 سفينة حربية، 12000 طائرة حربية"]]}},
        {verb:"conclude",q:"استنتج هدف الإنزال.",a:["فتح جبهة جديدة ضد ألمانيا من الغرب لحصارها."]}
      ]},
    {id:14,stage:"act2",kind:"خرائط وصور",title:"نهاية الحرب",source:"شرائح 34 إلى 39 من العرض",
      imgs:[[34,T(34,9)],[35,T(35,11)],[36,T(36,5)],[37,T(37,2)],[38,T(38,2)],[39,T(39,2)]],
      tasks:[
        {verb:"extract",q:"أتمم جدول نهاية الحرب.",table:{cols:["البلد","التاريخ","الحدث"],rows:[["ألمانيا",null,null],["اليابان",null,null]],answer:[["ألمانيا","ماي 1945","استسلام ألمانيا وتقسيمها بين الاتحاد السوفياتي من جهة والمملكة المتحدة وفرنسا من جهة أخرى"],["اليابان","غشت 1945","استسلام اليابان بعد إلقاء قنبلتين نوويتين على هيروشيما وناكازاكي"]]}},
        {verb:"discuss",q:"ماذا تكشف صور هيروشيما عن آثار السلاح النووي؟",hint:"إجابة مفتوحة: يُطلب من التلاميذ وصف الصور قبل التعليق عليها."}
      ]},
    {id:15,stage:"act3",kind:"معطيات إحصائية",title:T(41,8),source:"شريحة 41 من العرض",note:"ملاحظة تحريرية: الأرقام منقولة كما وردت، وتقديرات الخسائر تختلف بين المصادر. كتابة «02 مليون» تحتاج على الأرجح إلى تصحيح. الأعمدة والمجاميع محسوبة من القيم المكتوبة فقط.",
      visual:()=>`<div class="wd-legend"><span class="allies">${orig(T(41,9))}</span><span class="axis">${orig(T(41,7))}</span></div>${bars([{label:"الاتحاد السوفياتي",v:21000,text:"21 مليون نسمة"},{label:"ألمانيا",v:6000,text:"6 مليون نسمة",side:"axis"},{label:"اليابان",v:2000,text:"02 مليون نسمة",side:"axis"},{label:"فرنسا",v:600,text:"600 الف نسمة"},{label:"و م أ",v:290,text:"290 الف نسمة"},{label:"إيطاليا",v:280,text:"280 الف نسمة",side:"axis"},{label:"إنجلترا",v:231,text:"231 الف نسمة"}])}`,
      tasks:[
        {verb:"extract",q:"استخرج الدولة الأكثر خسارة والدولة الأقل خسارة.",a:["الأكثر: الاتحاد السوفياتي (21 مليون نسمة).","الأقل: إنجلترا (231 ألف نسمة)."]},
        {verb:"compare",q:"احسب مجموع قتلى كل معسكر بالأرقام المكتوبة في الوثيقة، ثم قارن.",a:[`دول التحالف: 21 مليون + 290 ألفًا + 600 ألف + 231 ألفًا ≈ ${fmt(sumAllies)} مليون نسمة.`,`دول المحور: 6 ملايين + 2 مليون + 280 ألفًا ≈ ${fmt(sumAxis)} مليون نسمة.`,`خسائر التحالف أكبر بنحو ${(sumAllies/sumAxis).toFixed(1).replace(".",",")} مرة، والاتحاد السوفياتي وحده يمثل نحو ${Math.round(21000/sumAllies*100)}% من قتلى التحالف.`]},
        {verb:"discuss",q:"ماذا يفسر الفارق الكبير بين خسائر الاتحاد السوفياتي وخسائر باقي الدول؟",hint:"اربط الجواب بالوثيقة 10 (الجبهة الشرقية)."}
      ]},
    {id:16,stage:"act3",kind:"نصان",title:T(42,6),source:`${T(42,1)} · ${T(42,2)}`,
      text:()=>`${prose(T(42,0))}${attribution(T(42,1),T(42,2))}${prose(T(42,3))}${attribution(T(42,4),T(42,5))}`,
      tasks:[
        {verb:"extract",q:"استخرج الخسائر المادية لكل بلد مع نسبتها أو قيمتها.",table:{cols:["البلد أو المجال","الخسارة"],rows:[["الاتحاد السوفياتي",null],["يوغسلافيا",null],["بولندا",null],["فرنسا",null],["إنتاج أوروبا الصناعي",null]],answer:[["الاتحاد السوفياتي","6 ملايين منزل"],["يوغسلافيا","60 في المائة من إمكانياتها الصناعية والفلاحية"],["بولندا","80 في المائة من صناعتها ووسائل نقلها"],["فرنسا","كل البنية التحتية للموانئ وجزء مهم من السكك الحديدية"],["إنتاج أوروبا الصناعي","انخفض بـ 50 في المائة"]]}},
        {verb:"extract",q:"استخرج النتائج الاجتماعية غير المباشرة، والنتائج المالية.",a:["اجتماعيًا: تراجع الولادات وارتفاع الوفيات، سوء التغذية وتزايد السل والكساح، تجاوز عدد الشيوخ عدد الكهول، نقص اليد العاملة وكبح الإنتاج.","ماليًا: الاقتراض ورفع الضرائب وارتفاع المديونية، وارتفاع الأسعار إلى 132 في المائة في إنجلترا و165 في المائة في فرنسا."]},
        {verb:"conclude",q:"استنتج النتائج البشرية والاجتماعية للحرب.",hint:"اكتب جملتين تجمع فيهما معطيات الوثيقتين 15 و16."}
      ]},
    {id:17,stage:"act3",kind:"نصان",title:T(43,6),source:`${T(43,1)} · ${T(43,2)}`,note:"ملاحظة تحريرية: المبلغان «مليار و100 مليون دولار» و«ملياري دولار» لا ينسجمان مع عبارة «مئات المليارات» في الوثيقة السابقة. يحتاجان إلى مراجعة المصدر؛ النص محفوظ كما ورد.",
      text:()=>`${prose(T(43,0))}${attribution(T(43,1),T(43,2))}${prose(T(43,3))}${attribution(T(43,4),T(43,5))}`,
      tasks:[
        {verb:"extract",q:"استخرج صيغ تمويل الحرب والإجراءات الضريبية المذكورة.",a:["الصيغ: الرفع من الضرائب، اللجوء إلى القروض، نهب الدول المحتلة (ألمانيا واليابان).","الضرائب: ارتفعت على الدخل من 20 إلى 50 في إيطاليا، وفُرضت ضرائب جديدة مثل ضرائب النصر في الولايات المتحدة، وضرائب على الزواج بإيطاليا سنة 1942، وأخرى على الاستهلاك بألمانيا."]},
        {verb:"analyse",q:"كيف خرجت الولايات المتحدة من الحرب مقارنة بأوروبا؟",a:["لم تُصب بنيتها التحتية (طرق وجسور وأبنية وبنوك) بأذى، ولها شبه احتكار للتقنية الحديثة، ووجدت نفسها وحيدة على قمة بنية القوة العالمية."]},
        {verb:"discuss",q:"لماذا وُضعت خطة «مارشال» لمساعدة أوروبا؟",a:["لأن نمو الاقتصاد الأمريكي سيبقى محصورًا في حدوده ما لم تقدر الاقتصادات الأخرى على شراء منتجاته.","ولأن الفشل في مساعدة أوروبا وآسيا قد يسمح بانتشار الشيوعية."]}
      ]},
    {id:18,stage:"act3",kind:"خريطة",title:T(44,23),source:"شريحة 44 من العرض",
      imgs:[[44,T(44,23)]],extra:()=>`<p class="wd-callout">${orig(T(44,22))}</p>`,
      tasks:[
        {verb:"extract",q:"اعتمادًا على مفتاح الخريطة، استخرج الدول الخاضعة للهيمنة السوفياتية.",a:["بولندا، تشيكوسلوفاكيا، هنغاريا، رومانيا، ألمانيا الشرقية، واستونيا ولتونيا ولتوانيا."],hint:"تتحقق من الجواب بمطابقة ألوان الدول مع مفتاح الخريطة."},
        {verb:"analyse",q:"ماذا حدث لألمانيا في هذه الخريطة؟",a:["قُسّمت إلى ألمانيا الشرقية وألمانيا الغربية."]},
        {verb:"conclude",q:"استنتج: كيف تغيّرت خريطة أوروبا السياسية بعد الحرب؟",hint:"اجمع في جملتين تقسيم ألمانيا والهيمنة السوفياتية على جزء من القارة."}
      ]}
  ];

  /* ---------- stages ---------- */
  const stages=[
    {id:"intro",label:"وضعية الانطلاق",number:"01",docs:[1]},
    {id:"act1",label:"النشاط الأول: رصد الأسباب",number:"02",docs:[2,3,4,5,6],activity:[T(3,6),T(3,7)],synth:"causes"},
    {id:"act2",label:"النشاط الثاني: تتبع المراحل",number:"03",docs:[7,8,9,10,11,12,13,14],activity:[T(14,12),T(14,13)],synth:"phases"},
    {id:"act3",label:"النشاط الثالث: استخراج النتائج",number:"04",docs:[15,16,17,18],activity:[T(42,7),T(42,8)],synth:"results"},
    {id:"wrap",label:"التركيب والتقويم",number:"05",docs:[]}
  ];
  const docById=id=>DOCS.find(d=>d.id===id);
  const docBody=d=>`${d.lead?`<p class="wd-lead">${orig(d.lead)}</p>`:""}${d.text?d.text():""}${d.visual?d.visual():""}${d.imgs?(d.imgs.length===1?figure(...d.imgs[0]):gallery(d.imgs)):""}${d.extra?d.extra():""}`;

  function docHTML(d){
    return `<article class="wd-doc" id="doc-${d.id}"><header class="wd-doc-head"><span class="wd-doc-no"><small>الوثيقة</small>${d.id}</span><div><span class="wd-kind">${esc(d.kind)}</span><h3>${orig(d.title)}</h3><p class="wd-doc-source">${orig(d.source)}</p></div><button class="wd-present" data-present-doc="${d.id}">${icon("grid")} اعرض</button></header>${d.note?`<aside class="editorial-note"><strong>للمراجعة</strong>${esc(d.note)}</aside>`:""}<div class="wd-paper">${docBody(d)}</div><section class="wd-work" aria-label="مهام العمل على الوثيقة ${d.id}"><h4><span>${icon("book")}</span> اشتغل على الوثيقة</h4><ol class="wd-tasks">${d.tasks.map((t,i)=>task(`d${d.id}-t${i}`,t)).join("")}</ol></section></article>`;
  }
  const activityBar=(a,n,id)=>`<div class="wd-activity"><div><span>${orig(a[0])}</span><strong>${orig(a[1])}</strong><small>${n} وثائق · أسئلة مقترحة للاستخراج والتحليل والمناقشة</small></div><button class="button light-button" data-present-stage="${id}">${icon("grid")} اعرض النشاط</button></div>`;

  const synths={
    causes:{title:"خلاصة النشاط الأول: أسباب الحرب",head:["نوع السبب","الأسباب"],
      answer:[["اقتصادية","أزمة اقتصادية: انهيار الإنتاج، إفلاس المؤسسات، الحمائية، البحث عن أسواق جديدة."],["اجتماعية","بطالة واسعة (6 ملايين عاطل في ألمانيا)."],["سياسية","شروط فرساي القاسية، فقدان الثقة في الديمقراطية البرلمانية، صعود النازية والفاشية، توسعات ألمانيا وإيطاليا واليابان، وأحلاف مثل حلف المحور."],["مباشرة","غزو ألمانيا لبولندا سنة 1939، فأعلنت دول التحالف الحرب على ألمانيا."]]},
    phases:{title:"خلاصة النشاط الثاني: مراحل الحرب",head:["المرحلة","الفترة","الأحداث الكبرى"],
      answer:[["المرحلة الأولى","من 1 شتنبر 1939 إلى 7 ديسمبر 1941","الاكتساح الألماني: احتلال دول أوروبية واجتياح فرنسا، فشل الهجوم الجوي على إنجلترا، ثم غزو الاتحاد السوفياتي ووصول الجيوش الألمانية إلى موسكو."],["المرحلة الثانية","من 7 ديسمبر 1941 إلى 1945","دخول الولايات المتحدة بعد بيرل هاربر وانقلاب موازين القوى لصالح التحالف: هزيمة ألمانيا في ستالينغراد، إنزال الدار البيضاء 1942، إنزال النورماندي 1944، استسلام ألمانيا ماي 1945 واليابان غشت 1945."]]},
    results:{title:"خلاصة النشاط الثالث: نتائج الحرب",head:["مجال النتائج","النتائج"],
      answer:[["بشرية","أكبر خسائر الاتحاد السوفياتي (21 مليون نسمة)، وتراجع الولادات وارتفاع الوفيات."],["اقتصادية","دمار البنية التحتية والصناعية في أوروبا، وانخفاض إنتاجها الصناعي بـ 50 في المائة، وارتفاع الديون والأسعار."],["اجتماعية","سوء التغذية وانتشار الأمراض، ونقص اليد العاملة، وتراجع مستوى المعيشة."],["سياسية وجغرافية","تقسيم ألمانيا، وخضوع جزء من أوروبا للهيمنة السوفياتية، وصعود الولايات المتحدة وخطة مارشال."]]}
  };
  function synthHTML(key,range){
    const s=synths[key],head=s.head;
    const headRow=`<tr>${head.map(h=>`<th scope="col">${h}</th>`).join("")}</tr>`;
    const rows=s.answer.map((r,ri)=>`<tr>${r.map((c,ci)=>ci===0?`<th scope="row">${esc(c)}</th>`:(key==="phases"&&ci===1)?`<td class="plain">${esc(c)}</td>`:`<td><textarea class="wd-input" rows="3" data-key="synth-${key}-${ri}-${ci}" aria-label="${esc(head[ci])}: ${esc(r[0])}"></textarea></td>`).join("")}</tr>`).join("");
    const ans=s.answer.map(r=>`<tr>${r.map((c,i)=>i===0?`<th scope="row">${esc(c)}</th>`:`<td>${esc(c)}</td>`).join("")}</tr>`).join("");
    return `<section class="wd-synth" id="synth-${key}"><header><span>${icon("check")}</span><div><p>التركيب</p><h3>${esc(s.title)}</h3></div></header><p class="wd-synth-intro">اعتمادًا على الوثائق ${range}، أنجز الجدول بعبارات قصيرة.</p><div class="wd-table-wrap" role="region" tabindex="0" aria-label="جدول التركيب"><table class="wd-table"><thead>${headRow}</thead><tbody>${rows}</tbody></table></div><details class="wd-answer"><summary><span>${icon("check")} الخلاصة المقترحة</span><span>+</span></summary><div class="wd-table-wrap"><table class="wd-table answer"><thead>${headRow}</thead><tbody>${ans}</tbody></table></div></details></section>`;
  }
  const evalTasks=[
    {verb:"extract",q:"اذكر سببين غير مباشرين وسببًا مباشرًا لاندلاع الحرب العالمية الثانية.",a:["غير مباشرين: الأزمة الاقتصادية وما خلّفته من بطالة، وشروط فرساي القاسية مع صعود النازية والفاشية والتوسعات.","مباشر: غزو ألمانيا لبولندا سنة 1939."]},
    {verb:"order",q:"رتّب زمنيًا: إنزال النورماندي، غزو بولندا، هجوم بيرل هاربر، استسلام اليابان، استسلام ألمانيا.",a:["غزو بولندا (1 شتنبر 1939)، هجوم بيرل هاربر (7 ديسمبر 1941)، إنزال النورماندي (6 يونيو 1944)، استسلام ألمانيا (ماي 1945)، استسلام اليابان (غشت 1945)."]},
    {verb:"analyse",q:"لماذا يُعدّ دخول الولايات المتحدة الحرب منعطفًا؟",a:["لأنه بعد بيرل هاربر انقلبت موازين القوى لصالح دول التحالف."]},
    {verb:"compare",q:"قارن بين النتائج الاقتصادية للحرب على أوروبا وعلى الولايات المتحدة.",a:["أوروبا: دمار البنية التحتية، انخفاض الإنتاج الصناعي بـ 50 في المائة، ديون وغلاء.","الولايات المتحدة: بنية سليمة وتفوق تقني، واحتاجت إلى أسواق أوروبية فوضعت خطة مارشال."]},
    {verb:"conclude",q:"وضعية للإدماج: في فقرة من خمسة أسطر، بيّن كيف قادت أسباب متراكمة إلى حرب غيّرت خريطة العالم، مستعينًا بمعطيات من وثائق الدرس.",hint:"تُقيَّم الفقرة بحسب توظيف معطيات مستخرجة من الوثائق (تواريخ، أرقام، أسماء)."}
  ];

  function stageHTML(stage,idx){
    const next=stages[idx+1];
    let body="";
    if(stage.id==="intro"){
      body=`<section class="wd-intro"><div class="wd-method"><h3>طريقة العمل</h3><ol><li><b>أقرأ الوثيقة</b>نوعها، مصدرها، تاريخها.</li><li><b>أستخرج المعطيات</b>تواريخ، أسماء، أرقام، أماكن.</li><li><b>أحلل وأقارن</b>أربط المعطيات ببعضها.</li><li><b>أناقش وأستنتج</b>أدعم رأيي بالوثيقة.</li></ol></div>
      <div class="wd-problem"><span>الإشكالية المقترحة</span><p>كيف قادت أوضاع ما بعد الحرب العالمية الأولى إلى حرب جديدة؟ وكيف سارت هذه الحرب؟ وما نتائجها؟</p></div>
      <div class="wd-goals"><h3>${orig(T(2,6))}</h3><ul>${[[0,1],[2,3],[5,4]].map(([a,b])=>`<li><b>${orig(T(2,a))}</b>${orig(T(2,b))}</li>`).join("")}</ul><p class="wd-goal-note">ملاحظة تحريرية: يحمل الهدف الثالث في الملف عنوان «الهدف الثاني» أيضًا؛ النص محفوظ كما ورد.</p></div></section>
      <h3 class="wd-section-title">وثيقة الانطلاق</h3>${docHTML(docById(1))}
      <section class="wd-hypo"><h4>${icon("search")} فرضياتي قبل دراسة الوثائق</h4><p>${orig(T(3,0)+" "+T(3,1))}</p><textarea class="wd-input" rows="3" data-key="hypothesis" placeholder="أكتب فرضية أو فرضيتين" aria-label="فرضياتي"></textarea></section>`;
    }else if(stage.id==="wrap"){
      body=`<section class="wd-synth final"><header><span>${icon("grid")}</span><div><p>التركيب</p><h3>الخلاصة العامة</h3></div></header><div class="wd-summary"><section><h4>الأسباب</h4><p>أزمة اقتصادية وشروط فرساي وصعود أنظمة شمولية وتوسعات ألمانيا وإيطاليا واليابان، ثم غزو بولندا سنة 1939.</p></section><section><h4>المراحل</h4><p>اكتساح ألماني (1939–1941)، ثم انقلاب موازين القوى لصالح التحالف بعد دخول الولايات المتحدة (1941–1945).</p></section><section><h4>النتائج</h4><p>خسائر بشرية ومادية هائلة، وتقسيم ألمانيا، وهيمنة سوفياتية على جزء من أوروبا، وصعود الولايات المتحدة.</p></section></div><p class="wd-synth-intro">الخلاصة العامة صياغة تربوية مقترحة مبنية على خلاصات الأنشطة الثلاثة.</p></section>
      <section class="wd-eval"><header><span>${icon("clock")}</span><div><p>التقويم</p><h3>أتحقق من تعلماتي</h3></div></header><ol class="wd-tasks">${evalTasks.map((t,i)=>task(`eval-${i}`,t)).join("")}</ol></section>`;
    }else{
      body=activityBar(stage.activity,stage.docs.length,stage.id)+stage.docs.map(id=>docHTML(docById(id))).join("")+synthHTML(stage.synth,`${stage.docs[0]} إلى ${stage.docs[stage.docs.length-1]}`);
    }
    const short=t=>t.length>34?t.slice(0,32)+"…":t;
    const nav=stage.docs.length?stage.docs.map(id=>`<a href="#doc-${id}" data-doc="${id}"><span>${id}</span>${esc(short(docById(id).title))}</a>`).join(""):`<a href="#wrap-top" data-doc="top"><span>•</span>الخلاصة والتقويم</a>`;
    return `<section class="course-panel" id="panel-${stage.id}" role="tabpanel" aria-labelledby="tab-${stage.id}" ${stage.id!=="intro"?"hidden":""}><div class="chapter-layout"><aside class="chapter-sidebar"><span class="eyebrow">${stage.docs.length?"وثائق هذا المحور":"المحور الأخير"}</span><strong>${stage.label}</strong><nav aria-label="فهرس ${stage.label}">${nav}</nav></aside><div class="chapter-body" id="${stage.id}-top">${body}<div class="chapter-bottom"><span>أكملت «${stage.label}»</span>${next?`<button class="button primary" data-stage-next="${next.id}">المحور التالي ${icon("arrow")}</button>`:`<a class="button primary" href="fiche.html?lesson=ww2">إعداد جذاذة الدرس ${icon("arrow")}</a>`}</div></div></div></section>`;
  }


  /* ---------- PowerPoint-style deck ---------- */
  function pzTask(t){
    const [label,cls]=verbs[t.verb];
    const step=!!(t.table||t.a);
    let ans="";
    if(t.table)ans=`<table class="pz-table"><thead><tr>${t.table.cols.map(c=>`<th scope="col">${esc(c)}</th>`).join("")}</tr></thead><tbody>${t.table.answer.map((r,ri)=>`<tr>${r.map((c,ci)=>t.table.rows[ri][ci]===null?`<td><span class="pz-cellans">${esc(c)}</span></td>`:`<th scope="row">${esc(c)}</th>`).join("")}</tr>`).join("")}</tbody></table>`;
    else if(t.a)ans=`<div class="pz-ans">${t.a.map(x=>`<p>${esc(x)}</p>`).join("")}</div>`;
    return `<li class="pz-task verb-${cls}${step?" pz-step":""}"><span class="pz-verb">${label}</span><div class="pz-qbody"><p class="pz-q${step?" pz-step-toggle":""}">${esc(t.q)}</p>${ans}${step?"":`<span class="pz-open-q">${esc(t.hint||"سؤال مفتوح للنقاش")}</span>`}</div></li>`;
  }
  function buildSlides(){
    const S=[],stageStart={},docStart={};
    const stageOf=id=>stages.find(st=>st.id===id);
    const head=(d,part)=>`<div class="pz-head"><span class="pz-no"><small>الوثيقة</small>${d.id}</span><div class="pz-head-text"><span class="pz-kind">${esc(d.kind)}</span><h2>${orig(d.title)}</h2><p class="pz-src">${orig(d.source)}</p></div>${part?`<span class="pz-part">${part}</span>`:""}</div>`;
    const plainHead=(label,title,mark)=>`<div class="pz-head"><span class="pz-no">${mark||icon("check")}</span><div class="pz-head-text"><span class="pz-kind">${esc(label)}</span><h2>${esc(title)}</h2></div></div>`;
    function addDoc(d){
      const st=stageOf(d.stage),base={kind:"content",theme:d.stage,band:st.label};
      const parts=[];
      if(d.text||d.visual)parts.push(`${d.lead?`<p class="pz-lead">${orig(d.lead)}</p>`:""}<div class="pz-fit" data-min="18">${d.text?d.text():""}${d.visual?d.visual():""}</div>`);
      (d.imgs||[]).forEach(([n,c],i)=>parts.push(`${d.lead&&!d.text&&i===0?`<p class="pz-lead">${orig(d.lead)}</p>`:""}<figure class="pz-figure"><img src="${img(n)}" alt="${esc(slug(c))}"><figcaption>${orig(c)}</figcaption></figure>${d.imgs.length===1&&d.extra?`<div class="pz-extra">${d.extra()}</div>`:""}`));
      docStart[d.id]=S.length;
      parts.forEach((html,i)=>S.push({...base,title:`الوثيقة ${d.id}: ${d.title}`+(parts.length>1?` (${i+1}/${parts.length})`:""),html:head(d,parts.length>1?`${i+1} / ${parts.length}`:"")+html}));
      const mini=`${d.text?d.text():""}${d.visual?d.visual():""}${d.imgs?`<div class="pz-thumbs">${d.imgs.map(([n,c])=>`<img src="${img(n)}" alt="${esc(slug(c))}">`).join("")}</div>`:""}${d.extra?d.extra():""}`;
      S.push({...base,title:`الوثيقة ${d.id}: أسئلة`,html:`${head(d,"اشتغل على الوثيقة")}<div class="pz-split"><div class="pz-mini">${mini}</div><ol class="pz-tasks pz-fit" data-min="16">${d.tasks.map(pzTask).join("")}</ol></div>`});
    }
    /* intro */
    stageStart.intro=0;
    S.push({kind:"cover",theme:"intro",title:"الغلاف",html:`<div class="pz-cover" style="background-image:url('assets/ww2.jpg')"><p class="pz-eyebrow"><span>التاريخ</span><span>${esc(resource.level)}</span></p><h1>${orig(T(1,0))}<span>${orig(T(1,1))}</span></h1><p class="pz-years" dir="ltr">${orig(T(1,2))}</p><p class="pz-cover-foot"><span>${DOCS.length} وثيقة</span><span>3 أنشطة</span><span>أطلس المعرفة · تسنيم</span></p></div>`});
    S.push({kind:"content",theme:"intro",band:"وضعية الانطلاق",title:"الإشكالية وأهداف التعلم",html:`<div class="pz-problem"><small>الإشكالية المقترحة</small>كيف قادت أوضاع ما بعد الحرب العالمية الأولى إلى حرب جديدة؟ وكيف سارت هذه الحرب؟ وما نتائجها؟</div><div class="pz-cols">${[[0,1],[2,3],[5,4]].map(([a,b])=>`<section><h3>${orig(T(2,a))}</h3><p>${orig(T(2,b))}</p></section>`).join("")}</div><p class="pz-note">ملاحظة تحريرية: يحمل الهدف الثالث في الملف عنوان «الهدف الثاني» أيضًا؛ النص محفوظ كما ورد.</p>`});
    S.push({kind:"content",theme:"intro",band:"وضعية الانطلاق",title:"طريقة العمل على الوثائق",html:`${plainHead("منهجية","طريقة العمل على الوثائق",icon("book"))}<div class="pz-cols four"><section><h3>1. أقرأ</h3><p>نوع الوثيقة، مصدرها، تاريخها.</p></section><section><h3>2. أستخرج</h3><p>تواريخ، أسماء، أرقام، أماكن.</p></section><section><h3>3. أحلل وأقارن</h3><p>أربط المعطيات ببعضها.</p></section><section><h3>4. أناقش وأستنتج</h3><p>أدعم رأيي بالوثيقة.</p></section></div>`});
    addDoc(docById(1));
    S.push({kind:"content",theme:"intro",band:"وضعية الانطلاق",title:"الفرضيات",html:`<div class="pz-hypo"><div><p>${orig(T(3,5))}<br>${orig(T(3,0)+" "+T(3,1))}</p><small>صُغ فرضية أو فرضيتين قبل دراسة الوثائق</small></div></div>`});
    /* activities */
    stages.filter(st=>st.activity).forEach((st,i)=>{
      stageStart[st.id]=S.length;
      S.push({kind:"divider",theme:st.id,title:st.label,html:`<div class="pz-divider"><span class="pz-big">${i+1}</span><div><p>${orig(st.activity[0])}</p><h2>${orig(st.activity[1])}</h2><ul>${st.docs.map(id=>`<li><b>${id}</b>${orig(docById(id).title)}</li>`).join("")}</ul></div></div>`});
      st.docs.forEach(id=>addDoc(docById(id)));
      const sy=synths[st.synth];
      S.push({kind:"content",theme:st.id,band:st.label,title:sy.title,html:`${plainHead("التركيب",sy.title)}<div class="pz-fit pz-big-table" data-min="16"><table class="pz-table"><thead><tr>${sy.head.map(h=>`<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${sy.answer.map(r=>`<tr class="pz-step">${r.map((c,ci)=>ci===0?`<th scope="row" class="pz-step-toggle">${esc(c)}</th>`:(st.synth==="phases"&&ci===1)?`<td>${esc(c)}</td>`:`<td><span class="pz-cellans">${esc(c)}</span></td>`).join("")}</tr>`).join("")}</tbody></table></div>`});
    });
    /* synthesis and evaluation */
    stageStart.wrap=S.length;
    S.push({kind:"divider",theme:"wrap",title:"التركيب والتقويم",html:`<div class="pz-divider"><span class="pz-big">✓</span><div><p>نهاية الأنشطة</p><h2>التركيب والتقويم</h2><ul><li><b>1</b>الخلاصة العامة</li><li><b>2</b>أتحقق من تعلماتي</li></ul></div></div>`});
    S.push({kind:"content",theme:"wrap",band:"التركيب والتقويم",title:"الخلاصة العامة",html:`${plainHead("التركيب","الخلاصة العامة")}<div class="pz-cols"><section class="pz-step"><h3 class="pz-step-toggle">الأسباب</h3><p class="pz-ans">أزمة اقتصادية وشروط فرساي وصعود أنظمة شمولية وتوسعات ألمانيا وإيطاليا واليابان، ثم غزو بولندا سنة 1939.</p></section><section class="pz-step"><h3 class="pz-step-toggle">المراحل</h3><p class="pz-ans">اكتساح ألماني (1939–1941)، ثم انقلاب موازين القوى لصالح التحالف بعد دخول الولايات المتحدة (1941–1945).</p></section><section class="pz-step"><h3 class="pz-step-toggle">النتائج</h3><p class="pz-ans">خسائر بشرية ومادية هائلة، وتقسيم ألمانيا، وهيمنة سوفياتية على جزء من أوروبا، وصعود الولايات المتحدة.</p></section></div>`});
    [[0,3],[3,5]].forEach(([a,b],k)=>S.push({kind:"content",theme:"wrap",band:"التركيب والتقويم",title:`التقويم (${k+1}/2)`,html:`${plainHead("التقويم","أتحقق من تعلماتي",icon("clock"))}<ol class="pz-tasks pz-fit wide" data-min="16">${evalTasks.slice(a,b).map(pzTask).join("")}</ol>`}));
    return {slides:S,stageStart,docStart};
  }

  $("#lessonCrumb").textContent="التاريخ";
  $("#lessonContent").innerHTML=`
    <section class="usa-hero"><div class="usa-hero-copy"><div class="usa-meta"><span>التعليم الإعدادي</span><span>التاريخ</span></div><p class="usa-lesson-number">1939 – 1945</p><h1>الحرب العالمية<br>الثانية <span>الأسباب والنتائج</span></h1><p class="usa-subtitle">درس يقوم على العمل بالوثائق: أقرأ، أستخرج، أحلل، أناقش، ثم أستنتج.</p><div class="usa-hero-actions"><button class="button light-button pz-launch" data-present-stage="intro">${icon("grid")} اعرض الدرس كشرائح</button><a class="presentation-toggle" href="#ww2-intro">${icon("book")} ابدأ القراءة</a></div><div class="usa-hero-meta"><span>${icon("clock")} ${esc(resource.duration)}</span><span>${icon("document")} ${DOCS.length} وثيقة</span><span>${icon("book")} 3 أنشطة رئيسية</span></div></div><figure class="usa-hero-photo"><img src="assets/ww2.jpg" alt="إنزال النورماندي: سفن وآليات على الشاطئ سنة 1944" width="900" height="690" fetchpriority="high"><figcaption><span>NORMANDY, 6 JUNE 1944</span><strong>من الوثيقة إلى الاستنتاج.</strong></figcaption></figure></section>
    <div class="source-integrity">${icon("check")}<p><strong>نصوص الوثائق من عرض الأستاذ دون تغيير.</strong> الأسئلة والأجوبة والجداول اقتراحات تربوية مبنية على الوثائق وحدها، وللأستاذ أن يعدّلها. الأجوبة مخفية حتى تُفتح.</p><button class="wd-reveal" id="revealAll" aria-pressed="false">إظهار كل الأجوبة المقترحة</button></div>
    <nav class="course-tabs" aria-label="محاور الدرس" role="tablist">${stages.map((s,i)=>`<button role="tab" id="tab-${s.id}" aria-controls="panel-${s.id}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-stage="${s.id}"><span>${s.number}</span>${s.label}</button>`).join("")}</nav>
    <div class="course-reading-progress" aria-hidden="true"><i id="courseProgress"></i></div>
    ${stages.map(stageHTML).join("")}
    <section class="source-policy" id="sourcePolicy"><div><p class="eyebrow">أمانة المحتوى</p><h2>الوثائق هي مرجع النص.</h2><p>نُقلت نصوص الشرائح كما وردت. أما الأسئلة والأجوبة وجداول الاستخراج والخلاصات فمقترحة، وتستند إلى الوثائق فقط.</p></div><div><details><summary>ما الذي لم يُنقل؟ <span>+</span></summary><p>الشريحة 15 فارغة، والشريحة 40 تكرر الشريحة 13، وأُزيلت أزرار التنقل (الدخول والرجوع). حركات الشرائح لا تنتقل إلى الصفحة. الخرائط صور مأخوذة من الشرائح، والصور الفوتوغرافية من الملف الأصلي.</p></details><details><summary>المستوى والمرجع <span>+</span></summary><p>المادة: التاريخ. لم يحدّد الملف المستوى ولا المدة؛ المكتوب في بطاقة الدرس اقتراح يُراجَع. تستشهد الوثائق بـ«كتاب المنار» و«منار الاجتماعيات» و«الشامل في التاريخ».</p><p class="original-cover-text">${orig(T(1,0)+" — "+T(1,1)+" — "+T(1,2))}</p></details><details><summary>حفظ الإجابات <span>+</span></summary><p>تُحفظ كتابات التلميذ في هذا المتصفح فقط، ولا تُرسل إلى أي جهة.</p></details></div></section>
    <dialog id="evidenceDialog" class="evidence-dialog" aria-labelledby="evidenceDialogTitle"><div class="dialog-toolbar"><h2 id="evidenceDialogTitle"></h2><button id="closeEvidence" aria-label="إغلاق الوثيقة">${icon("close")}</button></div><div class="dialog-image"><img id="largeEvidence" alt=""></div><a id="openEvidence" target="_blank" rel="noopener">فتح الصورة بحجمها الكامل</a></dialog>`;

  /* ---------- behaviour ---------- */
  $$(".wd-input").forEach(el=>{el.value=store.get(el.dataset.key);let t;el.addEventListener("input",()=>{clearTimeout(t);t=setTimeout(()=>store.set(el.dataset.key,el.value.trim()?el.value:""),250);});});
  $("#revealAll").addEventListener("click",e=>{const on=e.currentTarget.getAttribute("aria-pressed")!=="true";e.currentTarget.setAttribute("aria-pressed",String(on));e.currentTarget.textContent=on?"إخفاء كل الأجوبة":"إظهار كل الأجوبة المقترحة";$$(".wd-answer").forEach(d=>d.open=on);});
  const tabButtons=$$("[data-stage]"),panels=$$(".course-panel");
  function activate(id,scroll=false){
    if(!stages.some(s=>s.id===id))id="intro";
    panels.forEach(p=>p.hidden=p.id!==`panel-${id}`);
    tabButtons.forEach(b=>{const active=b.dataset.stage===id;b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1;});
    if(scroll)$(".course-tabs").scrollIntoView({behavior:"smooth",block:"start"});
    updateProgress();
  }
  function goStage(id){history.pushState(null,"",`#ww2-${id}`);activate(id,true);}
  $(".usa-hero-actions a").addEventListener("click",e=>{e.preventDefault();goStage("intro");});
  const deck=buildSlides();
  $$("[data-present-stage]").forEach(b=>b.addEventListener("click",()=>Presenter.open({title:resource.title,slides:deck.slides,start:deck.stageStart[b.dataset.presentStage]??0})));
  $$("[data-present-doc]").forEach(b=>b.addEventListener("click",()=>Presenter.open({title:resource.title,slides:deck.slides,start:deck.docStart[b.dataset.presentDoc]??0})));
  if(location.hash==="#present")Presenter.open({title:resource.title,slides:deck.slides,start:0});
  tabButtons.forEach((button,i)=>{button.addEventListener("click",()=>goStage(button.dataset.stage));button.addEventListener("keydown",e=>{let next;if(e.key==="ArrowLeft")next=(i+1)%tabButtons.length;else if(e.key==="ArrowRight")next=(i-1+tabButtons.length)%tabButtons.length;else if(e.key==="Home")next=0;else if(e.key==="End")next=tabButtons.length-1;else return;e.preventDefault();tabButtons[next].focus();goStage(tabButtons[next].dataset.stage);});});
  $$("[data-stage-next]").forEach(b=>b.addEventListener("click",()=>goStage(b.dataset.stageNext)));
  $$("[data-doc]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();const target=a.dataset.doc==="top"?a.closest(".chapter-layout").querySelector(".chapter-body"):document.getElementById(`doc-${a.dataset.doc}`);target.scrollIntoView({behavior:"smooth",block:"start"});}));
  addEventListener("hashchange",()=>{if(location.hash.startsWith("#ww2-"))activate(location.hash.slice(5),true);});
  addEventListener("popstate",()=>activate(location.hash.startsWith("#ww2-")?location.hash.slice(5):"intro"));
  function updateProgress(){const panel=$(".course-panel:not([hidden])");if(!panel)return;const rect=panel.getBoundingClientRect(),distance=Math.max(1,panel.offsetHeight-innerHeight);$("#courseProgress").style.width=`${Math.max(0,Math.min(100,-rect.top/distance*100))}%`;}
  addEventListener("scroll",updateProgress,{passive:true});
  const dialog=$("#evidenceDialog");let opener=null;
  $$("[data-image]").forEach(b=>b.addEventListener("click",()=>{opener=b;$("#evidenceDialogTitle").textContent=slug(b.dataset.caption);$("#largeEvidence").src=b.dataset.image;$("#largeEvidence").alt=slug(b.dataset.caption);$("#openEvidence").href=b.dataset.image;dialog.showModal();}));
  $("#closeEvidence").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener("close",()=>opener?.focus());
  activate(location.hash.startsWith("#ww2-")?location.hash.slice(5):"intro");
}
