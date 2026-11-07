/**
 * AICR · AI Career Readiness — Creativa Minya
 * اختبارات وتصويتات لايف مربوطة بـ Google Sheet.
 *
 * الصفحات:
 *   ?page=quiz&quiz=d1-exit&round=minya-g1     صفحة المشاركين (من الموبايل)
 *   ?page=results&quiz=d1-exit&round=minya-g1  شاشة النتائج اللحظية
 *   ?action=results&quiz=d1-exit&round=...     النتائج JSON (يستخدمها ملف العرض)
 */

const SHEET_NAME = 'Responses';

const QUIZZES = {
  'd1-pre': {
    title: 'تقييم سريع قبل البداية',
    type: 'poll',
    questions: [
      { q: 'استخدمت أداة ذكاء اصطناعي قبل كده؟', options: ['لأ خالص', 'مرة أو اتنين', 'أحيانًا', 'كتير', 'كل يوم'] },
      { q: 'أنهي أداة استخدمتها أكتر؟', options: ['ChatGPT', 'Gemini', 'Claude', 'Copilot', 'ولا واحدة'] },
      { q: 'نفسك تستخدم AI في إيه أكتر؟', options: ['المذاكرة', 'الشغل', 'التصميم', 'التسويق', 'لسه مش عارف'] }
    ]
  },
  'd1-exit': {
    title: 'اختبار ختام اليوم الأول',
    type: 'quiz',
    questions: [
      { q: 'أداة AI إدتك رقم أو تاريخ تستخدمه في عرضك. تعمل إيه؟',
        options: ['أستخدمه فورًا لأن الأداة ذكية', 'أتحقق منه من مصدر موثوق', 'أطلب من الأداة نفسها تأكده وخلاص'], answer: 1,
        why: 'الأدوات ممكن تكتب معلومة غلط بثقة كاملة. المراجعة مسؤوليتك.' },
      { q: 'أنهي حاجة ما ينفعش ترفعها لأداة AI عامة؟',
        options: ['قائمة أفكار لبوستات', 'أرقام تليفونات وعناوين عملاء حقيقيين', 'وصف عام لمشروعك'], answer: 1,
        why: 'بيانات العملاء الشخصية ما تترفعش. بدّلها برموز أو بيانات وهمية.' },
      { q: 'أنهي طلب (برومبت) أوضح؟',
        options: ['اكتب عن التسويق', 'أنت مسوق لمشروعات صغيرة. اكتب 5 نصائح لمشروع حلويات منزلي في المنيا، كل نصيحة في سطرين', 'تسويق حلويات'], answer: 1,
        why: 'الطلب الواضح فيه دور ومهمة وسياق وشكل للمخرج.' },
      { q: 'عايز تكتب نص عربي على تصميم متولد بالـ AI. الأحسن؟',
        options: ['أطلب من أداة توليد الصور تكتبه', 'أكتبه بنفسي في Canva فوق الصورة', 'أكتبه بالإنجليزي'], answer: 1,
        why: 'أدوات توليد الصور غالبًا بتشوه الحروف العربي.' },
      { q: 'أنهي مثال يعتبر أتمتة؟',
        options: ['أنسخ كل طلب من واتساب لدفتر بإيدي', 'كل رد على Google Form يتسجل لوحده صف في جدول', 'أحسب المبيعات بالآلة الحاسبة كل يوم'], answer: 1,
        why: 'الأتمتة = حدث يحصل فيتنفذ إجراء لوحده.' }
    ]
  },
  'd2-tracks': {
    title: 'أي تراك أقرب لك؟',
    type: 'poll',
    tally: ['Product Builder', 'Marketer', 'Creative', 'AI Automation & Data'],
    questions: [
      { q: 'أنهي تطبيق كان الأمتع ليك؟', options: ['النموذج الأولي للمنتج', 'حزمة المحتوى التسويقي', 'بوست التصميم', 'جدول الطلبات والمعادلات'] },
      { q: 'في وقت فراغك بتحب…', options: ['أجرب تطبيقات وأفكر اتعملت إزاي', 'أتابع صفحات وأحلل ليه بوست نجح', 'أصور وأعدل صور وفيديوهات', 'أنظم حاجات في جداول وقوائم'] },
      { q: 'لو صاحبك عنده محل، هتساعده إزاي؟', options: ['أعمله موقع أو تطبيق طلبات', 'أدير صفحته وأعمله محتوى', 'أصمم له لوجو وبوستات', 'أنظم له الطلبات والحسابات لوحدها'] },
      { q: 'أنهي مخرج نهائي يفرحك أكتر؟', options: ['منتج منشور برابط الناس بتستخدمه', 'صفحة بتكبر وأرقام بتتحسن', 'Portfolio تصميمات وفيديوهات', 'نظام شغال بيوفر ساعات شغل'] }
    ]
  },
  'd2-exit': {
    title: 'اختبار ختام اليوم الثاني',
    type: 'quiz',
    questions: [
      { q: 'يعني إيه نموذج أولي (MVP)؟',
        options: ['المنتج النهائي بكل خصائصه', 'أبسط نسخة تحل المشكلة الأساسية وتتجرب', 'خطة مكتوبة للمنتج'], answer: 1,
        why: 'النموذج الأولي يخليك تختبر الفكرة بسرعة وبتكلفة قليلة.' },
      { q: 'إيه اللي يميز الشركة الناشئة عن المشروع العادي؟',
        options: ['لازم يكون فيها برمجة', 'بتدور على نموذج يكبر بسرعة ويتكرر في أماكن كتير', 'لازم تاخد تمويل'], answer: 1,
        why: 'المشروع ممكن يكون ناجح من غير ما يكبر بسرعة. الناشئة هدفها النمو السريع.' },
      { q: 'لازم رأس مال ضخم عشان تبدأ؟',
        options: ['أيوه، من غير فلوس مفيش مشروع', 'لأ، ممكن تبدأ صغير وتختبر بأدوات مجانية', 'حسب الحظ'], answer: 1,
        why: 'Airbnb وBreadfast بدأوا بإمكانيات بسيطة.' },
      { q: 'أول خطوة لاكتشاف فرصة مشروع؟',
        options: ['أختار اسم ولوجو', 'ألاحظ مشكلة حقيقية لناس محددين', 'أعمل حسابات على كل المنصات'], answer: 1,
        why: 'كل القصص بدأت من مشكلة حقيقية لفئة محددة.' },
      { q: 'تختار التراك على أساس إيه؟',
        options: ['اهتماماتي والمهارة اللي عايز أبنيها', 'التراك اللي صحابي داخلينه', 'اللي في رأيي بيكسب فلوس أكتر'], answer: 0,
        why: 'كل تراك مستقل، والاختيار الصح هو اللي هتستمتع بيه وتكمل فيه.' }
    ]
  }
};

/* ---------------- web app ---------------- */

function doGet(e) {
  const p = (e && e.parameter) || {};
  const quizId = QUIZZES[p.quiz] ? p.quiz : '';
  const round = cleanRound_(p.round);

  if (p.action === 'results') {
    return ContentService.createTextOutput(JSON.stringify(getResults(quizId, round)))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const isResults = p.page === 'results';
  const t = HtmlService.createTemplateFromFile(isResults ? 'Results' : 'Quiz');
  t.quizId = quizId;
  t.round = round;
  t.quizJson = JSON.stringify(publicQuiz_(quizId, isResults));
  t.baseUrl = ScriptApp.getService().getUrl();
  return t.evaluate()
    .setTitle('AICR · كرياتيفا المنيا')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** يستدعيها صفحة المشارك عند الإرسال */
function submit(quizId, round, answers) {
  const quiz = QUIZZES[quizId];
  if (!quiz) throw new Error('الاختبار ده مش موجود.');
  if (!Array.isArray(answers) || answers.length !== quiz.questions.length) throw new Error('جاوب على كل الأسئلة.');
  const clean = answers.map(function (a, i) {
    const n = Number(a);
    if (!(n >= 0 && n < quiz.questions[i].options.length && Math.floor(n) === n)) throw new Error('إجابة غير صالحة.');
    return n;
  });
  round = cleanRound_(round);

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    sheet_().appendRow([new Date(), quizId, round].concat(clean.map(function (n) { return n + 1; })));
  } finally {
    lock.releaseLock();
  }

  if (quiz.type === 'quiz') {
    const correct = quiz.questions.map(function (q) { return q.answer; });
    return {
      score: clean.filter(function (a, i) { return a === correct[i]; }).length,
      total: clean.length,
      correct: correct,
      why: quiz.questions.map(function (q) { return q.why || ''; })
    };
  }
  return { ok: true };
}

/** النتائج المجمعة — يستدعيها شاشة النتائج وملف العرض */
function getResults(quizId, round) {
  const quiz = QUIZZES[quizId];
  if (!quiz) return { ok: false, error: 'الاختبار ده مش موجود.' };
  round = cleanRound_(round);
  const n = quiz.questions.length;
  const counts = quiz.questions.map(function (q) { return q.options.map(function () { return 0; }); });
  let total = 0;

  const sh = sheet_();
  const last = sh.getLastRow();
  if (last > 1) {
    const rows = sh.getRange(2, 1, last - 1, 3 + n).getValues();
    rows.forEach(function (r) {
      if (r[1] !== quizId) return;
      if (round && String(r[2]) !== round) return;
      total++;
      for (let i = 0; i < n; i++) {
        const v = Number(r[3 + i]) - 1;
        if (v >= 0 && v < counts[i].length) counts[i][v]++;
      }
    });
  }

  const out = { ok: true, quiz: publicQuiz_(quizId, true), total: total, counts: counts, round: round };
  if (quiz.tally) {
    out.tally = quiz.tally.map(function (_, ti) {
      return counts.reduce(function (s, c) { return s + (c[ti] || 0); }, 0);
    });
  }
  return out;
}

/* ---------------- helpers ---------------- */

function publicQuiz_(quizId, withAnswers) {
  const quiz = QUIZZES[quizId];
  if (!quiz) return null;
  return {
    id: quizId,
    title: quiz.title,
    type: quiz.type,
    tally: quiz.tally || null,
    questions: quiz.questions.map(function (q) {
      const o = { q: q.q, options: q.options };
      if (withAnswers && typeof q.answer === 'number') o.answer = q.answer;
      return o;
    })
  };
}

function cleanRound_(r) {
  return String(r || '').replace(/[^A-Za-z0-9_\-؀-ۿ]/g, '').slice(0, 40);
}

/* ---------------- spreadsheet & tabs ---------------- */

const SS_PROP = 'AICR_SPREADSHEET_ID';
const LINKS_SHEET = 'الروابط';
const BRAND = { blue: '#0B4F9E', magenta: '#B01C83', purple: '#5B2C83', yellow: '#F5B11A', soft: '#F2F4FA', green: '#1E8C5A' };

function maxQuestions_() {
  return Object.keys(QUIZZES).reduce(function (m, k) { return Math.max(m, QUIZZES[k].questions.length); }, 0);
}

/** الشيت اللي السكريبت مربوط بيه، ولو السكريبت مستقل بيعمل شيت جديد ويفتكره */
function ss_() {
  let ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  if (ss) return ss;
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty(SS_PROP);
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) {} }
  ss = SpreadsheetApp.create('AICR Live Quiz · كرياتيفا المنيا');
  props.setProperty(SS_PROP, ss.getId());
  return ss;
}

/** تاب الإجابات الخام — بيتعمل لوحده لو مش موجود */
function sheet_() {
  const ss = ss_();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = buildResponses_(ss);
  return sh;
}

function buildResponses_(ss) {
  const sh = ss.insertSheet(SHEET_NAME, 0);
  const n = maxQuestions_();
  const head = ['الوقت', 'الاختبار', 'المجموعة'];
  for (let i = 1; i <= n; i++) head.push('س' + i);
  sh.getRange(1, 1, 1, head.length).setValues([head])
    .setFontWeight('bold').setBackground(BRAND.blue).setFontColor('#FFFFFF').setHorizontalAlignment('center');
  sh.setFrozenRows(1);
  sh.setRightToLeft(true);
  sh.setColumnWidth(1, 160); sh.setColumnWidth(2, 110); sh.setColumnWidth(3, 120);
  sh.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  sh.getRange(2, 4, sh.getMaxRows() - 1, n).setHorizontalAlignment('center');
  sh.getRange(1, 1).setNote('ما تعدّلش في التاب ده بإيدك. كل صف = إجابة مشارك (بدون اسم). الأرقام في الأسئلة = رقم الاختيار.');
  sh.protect().setDescription('إجابات AICR — للقراءة فقط').setWarningOnly(true);
  return sh;
}

/** تاب ملخص لكل اختبار: الأسئلة والاختيارات وعدّاد لحظي بالمعادلات */
function buildSummary_(ss, quizId) {
  const quiz = QUIZZES[quizId];
  const name = quizId;
  const old = ss.getSheetByName(name);
  if (old) ss.deleteSheet(old);
  const sh = ss.insertSheet(name);
  sh.setRightToLeft(true);
  sh.setColumnWidth(1, 380); sh.setColumnWidth(2, 90); sh.setColumnWidth(3, 90); sh.setColumnWidth(4, 260); sh.setColumnWidth(5, 90);

  sh.getRange('A1').setValue(quiz.title).setFontSize(16).setFontWeight('bold').setFontColor(BRAND.blue);
  sh.getRange('A2').setValue('كود المجموعة (سيبه فاضي لكل المجموعات):').setFontWeight('bold');
  sh.getRange('B2').setBackground(BRAND.yellow).setNote('اكتب هنا كود المجموعة زي minya-g1 عشان تشوف نتايجها بس');
  sh.getRange('A3').setValue('عدد المشاركين:').setFontWeight('bold');
  sh.getRange('B3').setFormula('=IF($B$2="",COUNTIF(' + SHEET_NAME + '!$B:$B,"' + quizId + '"),COUNTIFS(' + SHEET_NAME + '!$B:$B,"' + quizId + '",' + SHEET_NAME + '!$C:$C,$B$2))')
    .setFontSize(14).setFontWeight('bold').setFontColor(BRAND.magenta);

  let r = 5;
  quiz.questions.forEach(function (q, qi) {
    const col = columnLetter_(4 + qi);
    sh.getRange(r, 1, 1, 5).setValues([[(qi + 1) + '. ' + q.q, 'العدد', 'النسبة', 'رسم', quiz.type === 'quiz' ? 'الإجابة' : '']])
      .setFontWeight('bold').setBackground(BRAND.purple).setFontColor('#FFFFFF');
    sh.getRange(r, 1).setWrap(true);
    const first = r + 1;
    q.options.forEach(function (o, oi) {
      const row = first + oi;
      const cnt = '=IF($B$2="",COUNTIFS(' + SHEET_NAME + '!$B:$B,"' + quizId + '",' + SHEET_NAME + '!$' + col + ':$' + col + ',' + (oi + 1) + '),' +
        'COUNTIFS(' + SHEET_NAME + '!$B:$B,"' + quizId + '",' + SHEET_NAME + '!$C:$C,$B$2,' + SHEET_NAME + '!$' + col + ':$' + col + ',' + (oi + 1) + '))';
      sh.getRange(row, 1).setValue(o);
      sh.getRange(row, 2).setFormula(cnt).setHorizontalAlignment('center');
      sh.getRange(row, 3).setFormula('=IF($B$3=0,0,B' + row + '/$B$3)').setNumberFormat('0%').setHorizontalAlignment('center');
      sh.getRange(row, 4).setFormula('=SPARKLINE(B' + row + ',{"charttype","bar";"max",MAX(1,$B$3);"color1","' + BRAND.blue + '"})');
      if (quiz.type === 'quiz' && q.answer === oi) {
        sh.getRange(row, 5).setValue('✓ صح').setFontColor(BRAND.green).setFontWeight('bold');
        sh.getRange(row, 1, 1, 4).setBackground('#E3F4EC');
      }
    });
    sh.getRange(first, 1, q.options.length, 5).setBorder(true, true, true, true, true, true, '#E0E4EF', SpreadsheetApp.BorderStyle.SOLID);
    r = first + q.options.length + 1;
  });

  if (quiz.tally) {
    sh.getRange(r, 1, 1, 4).setValues([['توزيع القاعة على التراكات', 'العدد', 'النسبة', 'رسم']])
      .setFontWeight('bold').setBackground(BRAND.magenta).setFontColor('#FFFFFF');
    const first = r + 1;
    const total = '(' + quiz.questions.length + '*MAX(1,$B$3))';
    quiz.tally.forEach(function (t, ti) {
      const row = first + ti;
      // كل سؤال: الاختيار رقم ti بيروح للتراك ti
      const parts = [];
      for (let qi = 0; qi < quiz.questions.length; qi++) {
        const rowInQ = 5 + 1 + ti + qi * (quiz.questions[0].options.length + 2);
        parts.push('B' + rowInQ);
      }
      sh.getRange(row, 1).setValue(t);
      sh.getRange(row, 2).setFormula('=' + parts.join('+')).setHorizontalAlignment('center');
      sh.getRange(row, 3).setFormula('=B' + row + '/' + total).setNumberFormat('0%').setHorizontalAlignment('center');
      sh.getRange(row, 4).setFormula('=SPARKLINE(B' + row + ',{"charttype","bar";"max",MAX(1,' + total + ');"color1","' + BRAND.magenta + '"})');
    });
  }
  sh.setFrozenRows(3);
  return sh;
}

/** تاب الروابط: رابط المشاركين وشاشة النتائج لكل اختبار */
function buildLinks_(ss) {
  const old = ss.getSheetByName(LINKS_SHEET);
  if (old) ss.deleteSheet(old);
  const sh = ss.insertSheet(LINKS_SHEET, 0);
  sh.setRightToLeft(true);
  sh.setColumnWidth(1, 220); sh.setColumnWidth(2, 120); sh.setColumnWidth(3, 520); sh.setColumnWidth(4, 520);
  sh.getRange('A1').setValue('AICR · روابط الاختبارات').setFontSize(16).setFontWeight('bold').setFontColor(BRAND.blue);
  sh.getRange('A2').setValue('رابط الـ Web App (ينتهي بـ /exec):').setFontWeight('bold');
  let url = '';
  try { url = ScriptApp.getService().getUrl() || ''; } catch (e) {}
  sh.getRange('B2:D2').merge().setValue(url).setBackground(BRAND.yellow)
    .setNote('بيتملى لوحده بعد Deploy. لو فاضي: اعمل Deploy وبعدين من قائمة AICR اختار «تحديث الروابط»، أو الصق الرابط هنا.');
  sh.getRange('A3').setValue('كود المجموعة:').setFontWeight('bold');
  sh.getRange('B3').setValue('minya-g1').setBackground(BRAND.yellow);
  sh.getRange(5, 1, 1, 4).setValues([['الاختبار', 'الكود', 'رابط المشاركين', 'شاشة النتائج']])
    .setFontWeight('bold').setBackground(BRAND.blue).setFontColor('#FFFFFF');
  const ids = Object.keys(QUIZZES);
  ids.forEach(function (id, i) {
    const row = 6 + i;
    sh.getRange(row, 1).setValue(QUIZZES[id].title);
    sh.getRange(row, 2).setValue(id);
    sh.getRange(row, 3).setFormula('=IF($B$2="","",$B$2&"?page=quiz&quiz=' + id + '"&IF($B$3="","","&round="&$B$3))');
    sh.getRange(row, 4).setFormula('=IF($B$2="","",$B$2&"?page=results&quiz=' + id + '"&IF($B$3="","","&round="&$B$3))');
  });
  sh.getRange(6, 1, ids.length, 4).setBorder(true, true, true, true, true, true, '#E0E4EF', SpreadsheetApp.BorderStyle.SOLID);
  return sh;
}

function columnLetter_(n) {
  let s = '';
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

/**
 * شغّلها مرة واحدة من المحرر (أو من قائمة AICR في الشيت).
 * بتعمل كل التابات والجداول: الإجابات، ملخص لكل اختبار، والروابط.
 * آمنة تتشغل تاني: مش بتمسح الإجابات، بس بتعيد بناء تابات الملخص والروابط.
 */
function setup() {
  const ss = ss_();
  sheet_();
  Object.keys(QUIZZES).forEach(function (id) { buildSummary_(ss, id); });
  buildLinks_(ss);
  // شيل التاب الفاضي الافتراضي لو موجود
  ['Sheet1', 'ورقة1', 'الورقة1'].forEach(function (n) {
    const s = ss.getSheetByName(n);
    if (s && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
  });
  ss.setActiveSheet(ss.getSheetByName(LINKS_SHEET));
  Logger.log('الشيت جاهز: ' + ss.getUrl());
  return ss.getUrl();
}

/** يحدّث تاب الروابط بعد الـ Deploy */
function refreshLinks() { buildLinks_(ss_()); }

/** قائمة AICR جوه الشيت */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('AICR')
    .addItem('تجهيز الشيت (التابات والجداول)', 'setup')
    .addItem('تحديث الروابط بعد الـ Deploy', 'refreshLinks')
    .addToUi();
}
