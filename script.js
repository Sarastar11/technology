// دليل مونوريل شرق النيل - تفاعلات محلية دون API أو ذكاء اصطناعي.
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const scene = $('scene'), train = $('train'), streetCar = $('streetCar');
  const toggle = $('toggle'), toggleTop = $('toggleTop'), reverseButton = $('reverse'), themeButton = $('themeButton');
  const speedInput = $('speed'), speedValue = $('speedValue'), zoomIn = $('zoomIn'), zoomOut = $('zoomOut'), zoomValue = $('zoomValue'), resetView = $('resetView');
  const statusText = $('statusText'), statusDot = $('statusDot'), directionStatus = $('directionStatus');
  const detailBackdrop = $('detailBackdrop'), detailTitle = $('detailTitle'), detailBody = $('detailBody'), closeDetails = $('closeDetails'), copyDetails = $('copyDetails'), detailMapLink = $('detailMapLink');
  const fareZoneSelect = $('fareZoneSelect'), fareTypeSelect = $('fareTypeSelect'), calculateFare = $('calculateFare'), fareResult = $('fareResult');
  let lastDetailTrigger = null, selectedStationId = null;

  const details = {
    tagline: { title: 'وسيلة نقل ذكية · مصر', body: 'المونوريل نظام نقل كهربائي يسير على مسار توجيه مرتفع. هذه الصفحة نموذج بصري تعليمي يوضح فكرة مرور قطار على مسار علوي، ولا تعرض بيانات تشغيل مباشرة.' },
    mainTitle: { title: 'مستقبل التنقل يتحرك أمامك', body: 'تعرض الصفحة رسمًا متجهيًا لقطار مونوريل فوق أفق عمراني. تم تصميم المشهد ليكون قابلًا للتحكم والتعديل، ويمكن تطوير الرسم والألوان والسرعة باستخدام ملفات HTML وCSS وSVG وJavaScript.' },
    intro: { title: 'عن المحاكاة التفاعلية', body: 'هذه محاكاة مرسومة داخل المتصفح. يتحرك القطار بواسطة JavaScript وتحديث موضع عناصر SVG في كل إطار، لذلك يمكن إيقافه وتغيير سرعته وعكس اتجاهه دون تشغيل فيديو.' },
    sceneCaption: { title: 'التعامل مع مشهد المونوريل', body: 'استخدم أزرار التكبير والتصغير لتقريب المشهد. بعد التكبير، اسحب المشهد بالماوس أو باللمس لتحريك مجال الرؤية. أعد الضبط للعودة إلى الإطار الأصلي.' },
    aboutTag: { title: 'نظرة على التجربة', body: 'انقر على أي عنوان أو معلومة مميزة لفتح شرحها المحفوظ داخل الموقع. وتظهر إجابات الأسئلة الشائعة دون الاتصال بذكاء اصطناعي.' },
    aboutTitle: { title: 'مدينة تتحرك، ومستقبل أقرب', body: 'المشهد عبارة عن رسم SVG متحرك. المدينة والقطار عناصر مرسومة للتوضيح، بينما الحركة والسرعة والاتجاه والكاميرا يتم التحكم فيها مباشرة من واجهة الصفحة.' },
    aboutDescription: { title: 'كيف تعمل المحاكاة؟', body: 'يستخدم JavaScript حلقة requestAnimationFrame لتحديث موضع القطار والسيارة الصغيرة بسلاسة. يستخدم SVG لتعريف الرسم، ويستخدم CSS لتصميم الواجهة والوضع الليلي والاستجابة لحجم الشاشة.' },
    featureRouteTitle: { title: 'مسار مرتفع', body: 'يظهر المسار كعارضة علوية تحمل القطار مع أعمدة دعم ممتدة نحو مستوى الشارع. الأبعاد والشكل هنا تخطيطيان، وليسا رسومات هندسية أو قياسات رسمية.' },
    featureRouteBody: { title: 'تفاصيل المسار المرتفع', body: 'العارضة والأعمدة والخلفية عناصر داخل SVG. يمكنك تعديل ألوانها ومساراتها من ملف scene.svg باستخدام Inkscape، ثم تحديث الرسم المضمن في index.html حتى تظهر التعديلات في المحاكاة.' },
    featureMotionTitle: { title: 'حركة قابلة للتحكم', body: 'استخدم زر الإيقاف والاستئناف لإدارة الحركة، وشريط السرعة لتعديل سرعة العرض، وزر عكس الاتجاه لتغيير اتجاه سير القطار. هذه السرعة معامل نسبي وليست سرعة فعلية بالكيلومتر في الساعة.' },
    featureMotionBody: { title: 'تفاصيل حركة JavaScript', body: 'يتم تحديث موضع القطار بناءً على الوقت المنقضي بين الإطارات. عند وصوله إلى حافة المشهد يعود إلى الطرف الآخر، ما يصنع حركة مستمرة. لا يستخدم الموقع فيديو أو مكتبات خارجية.' },
    featureCityTitle: { title: 'مشهد مستوحى من مصر', body: 'يحتوي المشهد على أبراج ومبانٍ ومسار علوي وسيارة على مستوى الشارع لتكوين أفق عمراني حديث. المشهد تخيلي ولا يمثل موقعًا محددًا أو خريطة دقيقة.' },
    featureCityBody: { title: 'تفاصيل الخلفية العمرانية', body: 'العناصر المعمارية المرسومة أشكال متجهية مبسطة في SVG. يمكن تغيير أشكال المباني وألوان السماء والإضاءة والنوافذ من الرسم المصدري.' },
    notice: { title: 'تنويه عن دقة النموذج', body: 'هذه محاكاة بصرية غير رسمية، وليست نظام تتبع قطارات حقيقيًا أو مخططًا هندسيًا معتمدًا أو مصدرًا لبيانات المواعيد والتشغيل. القيم الظاهرة مرتبطة بالحركة داخل الصفحة فقط.' },
    photosTag: { title: 'صور فوتوغرافية من مونوريل شرق النيل', body: 'هذا القسم يعرض صورًا حقيقية منشورة من المونوريل والمحطات. الصور الخارجية تُحمّل من مصادرها وتتطلب اتصالًا بالإنترنت. مشهد الحركة أعلى الصفحة هو رسم توضيحي منفصل.' },
    photosTitle: { title: 'صور حقيقية للقطار والمحطات', body: 'توضح الصور المنشورة قطار مونوريل شرق النيل والمسار المرتفع وبعض الممرات والأرصفة داخل المحطات. ارجع إلى الروابط المرفقة للتحقق من المصدر وتاريخ النشر.' },
    photosIntro: { title: 'مصادر الصور', body: 'أُرفقت الروابط الأصلية وبيانات المصدر بجانب كل صورة. قد تتغير إمكانية عرض الصور الخارجية حسب موقع الناشر واتصال الإنترنت.' },
    photoTrialTitle: { title: 'تجارب المونوريل بالعاصمة الإدارية', body: 'صورة حقيقية التقطها ونشرها Walid777999 بتاريخ 10 يوليو 2025، وتعرض القطار على المسار المرتفع قرب مبنى محطة خلال تجارب مونوريل شرق النيل. رخصة الصورة Creative Commons Attribution-ShareAlike 4.0.' },
    photoTrialBody: { title: 'الصورة: أعمال التجارب', body: 'تُظهر اللقطة قطارًا على المسار المرتفع وأعمالًا محيطة بالمحطة في العاصمة الإدارية الجديدة. وهي صورة واقعية منشورة على Wikimedia Commons وليست صورة مولدة.' },
    photoPlatformTitle: { title: 'قطار داخل محطة حديثة', body: 'صورة صحفية منشورة للقطار خلف أبواب زجاجية على رصيف محطة. المصدر المصوّر هو صحيفة الشرق الأوسط، وقد تتوقف الصورة عن الظهور إذا غيّر الناشر رابطها.' },
    photoPlatformBody: { title: 'الأبواب الزجاجية على الرصيف', body: 'تساعد الأبواب الزجاجية في فصل منطقة انتظار الركاب عن مسار القطار، ولا تُفتح إلا عند وصول القطار وفق نظام المحطة.' },
    photoStationTitle: { title: 'ممرات محطة الاستاد', body: 'صورة منشورة في اليوم السابع في 28 يونيو 2026 خلال التشغيل الكامل لمونوريل شرق النيل، وتُظهر منطقة داخلية وإرشادات خروج الركاب.' },
    photoStationBody: { title: 'صورة من محطة الاستاد', body: 'اللقطة الصحفية من محطة الاستاد أثناء التشغيل وتوثق الممر الداخلي وحركة الركاب. يمكن فتح رابط المصدر لمراجعة التقرير الأصلي.' },
    photoJusticeTitle: { title: 'رصيف محطة العدالة', body: 'صورة منشورة في اليوم السابع بتاريخ 19 يونيو 2025 تعرض رصيف محطة مونوريل العدالة مع الأبواب الزجاجية وإرشادات الخروج. افتح رابط المصدر أسفل الصورة لمشاهدة التقرير الأصلي.' },
    photoJusticeBody: { title: 'تفاصيل صورة محطة العدالة', body: 'تظهر الصورة جزءًا من رصيف محطة المونوريل الحديثة، بما في ذلك الأبواب الزجاجية التي تفصل منطقة الانتظار عن مسار القطار ولافتة الخروج.' },
    ticketsTag: { title: 'أسعار التذاكر وطرق الدفع', body: 'تُقسم تذكرة مونوريل شرق النيل إلى أربع مناطق تسعير: 20 جنيهًا حتى 5 محطات، و40 جنيهًا حتى 10، و55 جنيهًا حتى 15، و80 جنيهًا للخط كاملًا حتى 22 محطة، وفق إعلان مايو 2026.' },
    ticketsTitle: { title: 'أسعار تذاكر المونوريل', body: 'أسعار الرحلة الواحدة المعلنة في مايو 2026 هي: 20 جنيهًا لمنطقة واحدة (حتى 5 محطات)، و40 جنيهًا لمنطقتين (حتى 10)، و55 جنيهًا لثلاث مناطق (حتى 15)، و80 جنيهًا للخط كاملًا (22 محطة).' },
    ticketsIntro: { title: 'كيف تُحسب التذكرة؟', body: 'تعتمد قيمة التذكرة على عدد المناطق/المحطات التي يقطعها الراكب. هذه الأسعار وفق البيان المنشور من وزارة النقل في 8 مايو 2026، ويُفضّل التأكد من الأسعار في المحطة عند السفر.' },
    fareOneTitle: { title: 'تذكرة منطقة واحدة', body: 'التذكرة الكاملة لمنطقة واحدة، حتى 5 محطات، سعرها 20 جنيهًا وفق إعلان وزارة النقل المنشور في 8 مايو 2026.' },
    fareOneBody: { title: 'حتى 5 محطات', body: 'هذا النطاق يغطي رحلة حتى خمس محطات، وسعر التذكرة الكاملة المعلن 20 جنيهًا.' },
    fareOnePrice: { title: 'سعر المنطقة الواحدة', body: 'التذكرة الكاملة: 20 جنيهًا. نصف التذكرة للفئات المستحقة: 10 جنيهات.' },
    fareTwoTitle: { title: 'تذكرة منطقتين', body: 'التذكرة الكاملة لمنطقتين، حتى 10 محطات، سعرها 40 جنيهًا وفق إعلان وزارة النقل المنشور في 8 مايو 2026.' },
    fareTwoBody: { title: 'حتى 10 محطات', body: 'هذا النطاق يغطي رحلة حتى عشر محطات، وسعر التذكرة الكاملة المعلن 40 جنيهًا.' },
    fareTwoPrice: { title: 'سعر منطقتين', body: 'التذكرة الكاملة: 40 جنيهًا. نصف التذكرة للفئات المستحقة: 20 جنيهًا.' },
    fareThreeTitle: { title: 'تذكرة ثلاث مناطق', body: 'التذكرة الكاملة لثلاث مناطق، حتى 15 محطة، سعرها 55 جنيهًا وفق إعلان وزارة النقل المنشور في 8 مايو 2026.' },
    fareThreeBody: { title: 'حتى 15 محطة', body: 'هذا النطاق يغطي رحلة حتى خمس عشرة محطة، وسعر التذكرة الكاملة المعلن 55 جنيهًا.' },
    fareThreePrice: { title: 'سعر ثلاث مناطق', body: 'التذكرة الكاملة: 55 جنيهًا. نصف التذكرة للفئات المستحقة: 30 جنيهًا.' },
    fareFourTitle: { title: 'تذكرة الخط كاملًا', body: 'التذكرة الكاملة للخط بأكمله، الذي يضم 22 محطة، سعرها 80 جنيهًا وفق إعلان وزارة النقل المنشور في 8 مايو 2026.' },
    fareFourBody: { title: 'حتى 22 محطة', body: 'هذه التذكرة تغطي الخط كاملًا من بدايته إلى نهايته، وسعر التذكرة الكاملة المعلن 80 جنيهًا.' },
    fareFourPrice: { title: 'سعر الخط كاملًا', body: 'التذكرة الكاملة: 80 جنيهًا. نصف التذكرة للفئات المستحقة: 40 جنيهًا.' },
    paymentTitle: { title: 'طرق دفع تذكرة المونوريل', body: 'أوضحت وزارة النقل أن وسائل الدفع المتاحة لشراء التذكرة تشمل الدفع نقدًا أو ببطاقة Visa أو بمحفظة إلكترونية، من خلال شبابيك التذاكر وماكينات TVM وفق بيان تشغيل مونوريل شرق النيل المنشور في مايو 2026.' },
    paymentIntro: { title: 'أماكن ووسائل الدفع', body: 'يمكن للراكب التوجه إلى شباك التذاكر أو استخدام ماكينة بيع التذاكر TVM، ثم استخدام إحدى وسائل الدفع التي تظهر على الشباك أو الماكينة. اتبع التعليمات المعروضة في المحطة.' },
    paymentCashTitle: { title: 'الدفع نقدًا', body: 'يمكن دفع قيمة التذكرة نقدًا من خلال وسائل البيع المذكورة بمحطات المونوريل، بحسب بيان وزارة النقل.' },
    paymentCashBody: { title: 'النقد عند الشباك أو الماكينة', body: 'تحقق من فئات النقد المقبولة والرصيد المطلوب لدى شباك التذاكر أو ماكينة TVM.' },
    paymentVisaTitle: { title: 'الدفع ببطاقة Visa', body: 'تذكر وزارة النقل بطاقة Visa ضمن وسائل الدفع المتاحة عبر منافذ بيع التذاكر وماكينات TVM. توافر الخدمة على ماكينة معينة قد يعتمد على تجهيز المحطة.' },
    paymentVisaBody: { title: 'بطاقة بنكية', body: 'استخدم بطاقة Visa فقط إذا كانت وسيلة الدفع ظاهرة ومتاحة في الشباك أو ماكينة التذاكر التي تستخدمها.' },
    paymentWalletTitle: { title: 'الدفع بمحفظة إلكترونية', body: 'ذكرت وزارة النقل المحافظ الإلكترونية ضمن وسائل دفع التذاكر. اتبع التعليمات في المنفذ واحتفظ بإثبات الشراء عند الحاجة.' },
    paymentWalletBody: { title: 'المحفظة الإلكترونية', body: 'تأكد من أن خيار المحفظة متاح في ماكينة TVM أو الشباك الذي تتعامل معه قبل إتمام الدفع.' },
    calculatorTitle: { title: 'حساب قيمة التذكرة', body: 'تتيح أداة الحساب اختيار نطاق الرحلة وفئة التذكرة. الأسعار المبرمجة هي أسعار الرحلة الواحدة المنشورة في مايو 2026، ولا تشمل الاشتراكات.' },
    calculatorIntro: { title: 'اختيار نطاق الرحلة والفئة', body: 'اختر إحدى مناطق الرحلة الأربعة، ثم اختر التذكرة الكاملة أو نصف التذكرة للفئات المستحقة: كبار السن فوق 60 عامًا وذوو الإعاقة.' },
    fareDiscountNote: { title: 'أسعار نصف التذكرة', body: 'وفق إعلان وزارة النقل في مايو 2026، نصف التذكرة متاح لكبار السن فوق 60 عامًا وذوي الإعاقة: 10 جنيهات لمنطقة واحدة، و20 جنيهًا لمنطقتين، و30 جنيهًا لثلاث مناطق، و40 جنيهًا للخط كاملًا.' },
    subscriptionNote: { title: 'اشتراكات مونوريل شرق النيل', body: 'توجد اشتراكات أسبوعية وشهرية وربع سنوية بأسعار تختلف حسب عدد مناطق الخط وعدد الرحلات. راجع شباك الاشتراكات بالمحطة أو بوابة القاهرة للحصول على الأسعار والشروط الأحدث.' },
    routeTag: { title: 'دليل محطات مونوريل شرق النيل', body: 'يضم المسار الكامل 22 محطة من استاد القاهرة بمدينة نصر إلى مدينة العدالة بالعاصمة الإدارية الجديدة، بطول تقريبي 56.5 كم. الخريطة تخطيطية وليست بمقياس جغرافي.' },
    routeTitleDetail: { title: 'خريطة مسار مونوريل شرق النيل', body: 'يعرض هذا القسم محطات الخط بالترتيب من الغرب إلى الشرق، في ثلاث مجموعات لتسهيل القراءة: مدينة نصر وشرق القاهرة، القاهرة الجديدة، والعاصمة الإدارية الجديدة. اضغط على أي محطة لعرض ملخصها ورابط البحث عن موقعها.' },
    routeIntro: { title: 'مسار مونوريل شرق النيل', body: 'يبدأ الخط من استاد القاهرة، ويعبر مدينة نصر والقاهرة الجديدة، ثم ينتهي في مدينة العدالة بالعاصمة الإدارية الجديدة. يبلغ طول الخط نحو 56.5 كم ويضم 22 محطة وفق بيانات الهيئة القومية للأنفاق.' },
    regionNasrTitle: { title: 'محطات مدينة نصر وشرق القاهرة', body: 'يشمل هذا الجزء أول ست محطات بالترتيب: استاد القاهرة، هشام بركات، جامعة الأزهر، الحي السابع، المشير أحمد إسماعيل، وجيهان السادات.' },
    regionNasrBody: { title: 'نطاق المحطات الأول', body: 'هذا تجميع تخطيطي لأول ست محطات في الخط. اضغط على اسم أي محطة لمعرفة ملخصها وفتح رابط الموقع.' },
    regionNewCairoTitle: { title: 'محطات القاهرة الجديدة', body: 'يشمل هذا الجزء المحطات من المشير طنطاوي إلى بيت الوطن، ويضم مناطق وان ناينتي والمستشفى الجوي والنرجس والمستثمرين واللوتس وجولدن سكوير.' },
    regionNewCairoBody: { title: 'نطاق المحطات الأوسط', body: 'هذا تجميع تخطيطي لمحطات القاهرة الجديدة، من المحطة رقم 7 إلى رقم 14.' },
    regionCapitalTitle: { title: 'محطات العاصمة الإدارية الجديدة', body: 'يشمل هذا الجزء المحطات من مسجد الفتاح العليم إلى مدينة العدالة، بما في ذلك الحيان R1 وR2 وحي المال والأعمال ومدينة الفنون والثقافة والحي الحكومي ومسجد مصر.' },
    regionCapitalBody: { title: 'نطاق المحطات الشرقي', body: 'هذا تجميع تخطيطي للمحطات من رقم 15 إلى رقم 22، وينتهي عند محطة مدينة العدالة.' },
    faqTag: { title: 'الأسئلة الشائعة', body: 'هذه إجابات جاهزة محفوظة محليًا في ملفات الموقع؛ فتح الأسئلة لا يحتاج إلى API أو اتصال بنموذج ذكاء اصطناعي.' },
    faqTitleDetail: { title: 'الأسئلة الشائعة عن المونوريل', body: 'تغطي الأسئلة المسار وعدد المحطات والأسعار وطرق الدفع والربط مع وسائل النقل والمواعيد. اضغط على السؤال نفسه لتوسيع الإجابة تحته.' },
    faqIntroDetail: { title: 'كيف تستخدم الأسئلة الشائعة؟', body: 'اضغط على أي سؤال لفتح الإجابة أو إغلاقها. هذه وظيفة HTML أصلية تعمل محليًا دون ذكاء اصطناعي.' }
  };


  const SVG_WIDTH = 1440, SVG_HEIGHT = 470;
  const TRAIN_START = 500, TRAIN_LEFT_LIMIT = -520, TRAIN_RIGHT_LIMIT = 1550;
  const CAR_LEFT_LIMIT = -140, CAR_RIGHT_LIMIT = 1540;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paused = Boolean(reducedMotion), direction = -1;
  let speedFactor = Number(speedInput?.value || 4) / 4, trainX = TRAIN_START, carX = 1020;
  let nightMode = false, zoom = 1, lastFrame = 0, dragState = null;
  let viewBox = { x: 0, y: 0, w: SVG_WIDTH, h: SVG_HEIGHT };

  function updateTrainTransform() {
    if (!train) return;
    train.setAttribute('transform', direction > 0
      ? `translate(${trainX.toFixed(2)} 0)`
      : `translate(${(trainX + 485).toFixed(2)} 0) scale(-1 1)`);
  }
  function applyViewBox() {
    if (!scene) return;
    scene.setAttribute('viewBox', `${viewBox.x.toFixed(2)} ${viewBox.y.toFixed(2)} ${viewBox.w.toFixed(2)} ${viewBox.h.toFixed(2)}`);
    if (zoomValue) zoomValue.textContent = `${Math.round(zoom * 100)}%`;
    scene.classList.toggle('is-draggable', zoom > 1.001);
    if (zoomOut) zoomOut.disabled = zoom <= 1.001;
    if (zoomIn) zoomIn.disabled = zoom >= 2.501;
  }
  function setZoom(nextZoom) {
    zoom = Math.max(1, Math.min(2.5, Number(nextZoom.toFixed(2))));
    const w = SVG_WIDTH / zoom, h = SVG_HEIGHT / zoom;
    viewBox = { x: (SVG_WIDTH - w) / 2, y: (SVG_HEIGHT - h) / 2, w, h };
    applyViewBox();
  }
  function setPaused(nextPaused) {
    paused = Boolean(nextPaused);
    const label = paused ? '▶ استئناف الحركة' : 'Ⅱ إيقاف الحركة';
    if (toggle) { toggle.textContent = label; toggle.setAttribute('aria-pressed', String(paused)); }
    if (toggleTop) { toggleTop.textContent = paused ? 'استئناف الحركة ▶' : 'إيقاف الحركة مؤقتًا Ⅱ'; toggleTop.setAttribute('aria-pressed', String(paused)); }
    if (statusText) statusText.textContent = paused ? 'الحركة متوقفة مؤقتًا' : 'المونوريل يتحرك';
    if (statusDot) {
      statusDot.style.background = paused ? '#f4b84e' : '#5ae0a0';
      statusDot.style.boxShadow = paused ? '0 0 10px #f4b84e' : '0 0 10px #5ae0a0';
    }
  }
  function setDirection(nextDirection) {
    direction = nextDirection >= 0 ? 1 : -1;
    if (reverseButton) {
      reverseButton.setAttribute('aria-pressed', String(direction < 0));
      reverseButton.textContent = direction > 0 ? '↔ عكس الاتجاه' : '↔ العودة إلى اليمين';
    }
    if (directionStatus) directionStatus.textContent = direction > 0 ? 'الاتجاه: إلى اليمين' : 'الاتجاه: إلى اليسار';
    updateTrainTransform();
  }
  function updateSpeed() {
    speedFactor = Number(speedInput?.value || 4) / 4;
    if (speedValue) speedValue.textContent = `${speedFactor.toFixed(2).replace(/0$/, '').replace(/\.0$/, '')}×`;
  }
  function setNightMode(enabled) {
    nightMode = Boolean(enabled);
    if (scene) scene.classList.toggle('night-mode', nightMode);
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(nightMode));
      themeButton.textContent = nightMode ? '☀ الوضع النهاري' : '☾ الوضع الليلي';
    }
  }
  function renderFrame(timestamp) {
    if (!lastFrame) lastFrame = timestamp;
    const dt = Math.min((timestamp - lastFrame) / 1000, 0.05); lastFrame = timestamp;
    if (!paused) {
      trainX += direction * 160 * speedFactor * dt;
      if (direction > 0 && trainX > TRAIN_RIGHT_LIMIT) trainX = TRAIN_LEFT_LIMIT;
      if (direction < 0 && trainX < TRAIN_LEFT_LIMIT) trainX = TRAIN_RIGHT_LIMIT;
      carX -= 34 * Math.max(0.55, speedFactor) * dt;
      if (carX < CAR_LEFT_LIMIT) carX = CAR_RIGHT_LIMIT;
      updateTrainTransform();
      if (streetCar) streetCar.setAttribute('transform', `translate(${carX.toFixed(2)} 396)`);
    }
    window.requestAnimationFrame(renderFrame);
  }

  toggle?.addEventListener('click', () => setPaused(!paused));
  toggleTop?.addEventListener('click', () => setPaused(!paused));
  speedInput?.addEventListener('input', updateSpeed);
  reverseButton?.addEventListener('click', () => setDirection(-direction));
  themeButton?.addEventListener('click', () => setNightMode(!nightMode));
  zoomIn?.addEventListener('click', () => setZoom(zoom + 0.25));
  zoomOut?.addEventListener('click', () => setZoom(zoom - 0.25));
  resetView?.addEventListener('click', () => {
    trainX = TRAIN_START; carX = 1020; setDirection(-1);
    if (speedInput) speedInput.value = '4'; updateSpeed();
    setZoom(1); setNightMode(false); setPaused(false); updateTrainTransform();
    if (streetCar) streetCar.setAttribute('transform', `translate(${carX} 396)`);
  });

  function showDetail(title, body, trigger = null, mapQuery = null) {
    if (!detailBackdrop || !detailTitle || !detailBody) return;
    lastDetailTrigger = trigger;
    detailTitle.textContent = title;
    detailBody.textContent = body;
    if (detailMapLink) {
      if (mapQuery) {
        detailMapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery + ' Egypt Monorail station')}`;
        detailMapLink.textContent = 'فتح موقع المحطة على خرائط Google ↗';
        detailMapLink.hidden = false;
      } else {
        detailMapLink.href = 'https://thingsincairo.com/cairo-transport/line/monorail-east/';
        detailMapLink.textContent = 'فتح دليل المسار الكامل ↗';
        detailMapLink.hidden = false;
      }
    }
    detailBackdrop.hidden = false;
    document.body.classList.add('dialog-open');
    closeDetails?.focus();
  }
  function closeDetail() {
    if (!detailBackdrop) return;
    detailBackdrop.hidden = true;
    document.body.classList.remove('dialog-open');
    lastDetailTrigger?.focus?.();
  }
  function getNearbyDescription(element) {
    const parent = element.closest('article, .payment-method, .fare-card, .feature, .photo-copy, .section-heading') || element.parentElement;
    const p = parent?.querySelector('p:not(.eyebrow)');
    return p?.textContent?.trim() || element.parentElement?.textContent?.replace(element.textContent, '').trim() || 'هذه المعلومة جزء من دليل مونوريل شرق النيل. راجع المصدر المرفق للتحقق من آخر التحديثات.';
  }
  document.querySelectorAll('.detailable[data-detail-id]').forEach((item) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-haspopup', 'dialog');
    const configured = details[item.dataset.detailId];
    item.setAttribute('aria-label', `عرض تفاصيل: ${configured?.title || item.textContent.trim()}`);
    const openThis = () => {
      const info = details[item.dataset.detailId];
      const title = info?.title || item.textContent.trim();
      const body = info?.body || getNearbyDescription(item);
      showDetail(title, body, item);
    };
    item.addEventListener('click', openThis);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openThis(); }
    });
  });
  closeDetails?.addEventListener('click', closeDetail);
  detailBackdrop?.addEventListener('click', (event) => { if (event.target === detailBackdrop) closeDetail(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && detailBackdrop && !detailBackdrop.hidden) closeDetail();
    const target = event.target;
    if (event.code === 'Space' && detailBackdrop?.hidden && !['BUTTON','INPUT','TEXTAREA','SELECT','A','SUMMARY'].includes(target.tagName)) { event.preventDefault(); setPaused(!paused); }
    if (event.key === 'Escape' && dragState) stopDrag();
  });
  copyDetails?.addEventListener('click', async () => {
    const text = `${detailTitle?.textContent || ''}\n\n${detailBody?.textContent || ''}`;
    try {
      await navigator.clipboard.writeText(text);
      copyDetails.textContent = 'تم النسخ ✓';
    } catch (_) {
      const field = document.createElement('textarea'); field.value = text; field.style.position = 'fixed'; field.style.opacity = '0';
      document.body.appendChild(field); field.select();
      const copied = document.execCommand('copy'); field.remove();
      copyDetails.textContent = copied ? 'تم النسخ ✓' : 'تعذر النسخ';
    }
    window.setTimeout(() => { copyDetails.textContent = 'نسخ التفاصيل'; }, 1600);
  });

  // Station data for the route map. Descriptions deliberately avoid claiming exact coordinates.
  const stations = [
    {id:1,name:'استاد القاهرة',en:'Cairo Stadium',area:'مدينة نصر',body:'بداية خط مونوريل شرق النيل. تُعد محطة الاستاد نقطة تبادل مع الخط الثالث لمترو القاهرة وفق المعلومات المنشورة عن المحطة.'},
    {id:2,name:'هشام بركات',en:'Hisham Barakat',area:'مدينة نصر',body:'إحدى محطات المقطع الغربي من مونوريل شرق النيل في مدينة نصر. تظهر في ترتيب الخط بين الاستاد وجامعة الأزهر.'},
    {id:3,name:'جامعة الأزهر',en:'Al-Azhar University',area:'مدينة نصر',body:'محطة تخدم نطاق جامعة الأزهر بمدينة نصر، وتقع في تسلسل الخط بين هشام بركات والحي السابع.'},
    {id:4,name:'الحي السابع',en:'7th District',area:'مدينة نصر',body:'محطة ضمن نطاق مدينة نصر. ترتيبها المحطة الرابعة من اتجاه استاد القاهرة إلى مدينة العدالة.'},
    {id:5,name:'المشير أحمد إسماعيل',en:'Marshal Ahmed Ismail',area:'شرق القاهرة',body:'محطة في المقطع الغربي من المسار، وتسبق محطة جيهان السادات ثم محطة المشير طنطاوي.'},
    {id:6,name:'جيهان السادات',en:'Jehan Sadat',area:'شرق القاهرة',body:'المحطة السادسة على مسار مونوريل شرق النيل من استاد القاهرة باتجاه العاصمة الإدارية.'},
    {id:7,name:'المشير طنطاوي',en:'Marshal Tantawy',area:'القاهرة الجديدة',body:'محطة انتقالية مهمة في تسلسل الخط بين مدينة نصر والقاهرة الجديدة.'},
    {id:8,name:'وان ناينتي',en:'One Ninety',area:'القاهرة الجديدة',body:'محطة باسم منطقة One Ninety في القاهرة الجديدة، ضمن سلسلة المحطات التي تخدم التجمع والمناطق العمرانية شرق القاهرة.'},
    {id:9,name:'المستشفى الجوي',en:'Air Force Hospital',area:'القاهرة الجديدة',body:'محطة باسم المستشفى الجوي في القاهرة الجديدة. تحقق من مداخل المحطة واتجاهات الوصول ميدانيًا قبل الرحلة.'},
    {id:10,name:'النرجس',en:'El Narges',area:'القاهرة الجديدة',body:'محطة تخدم نطاق النرجس بالقاهرة الجديدة. أشارت بوابة محافظة القاهرة إلى ربط مستقبلي مخطط مع الخط السادس للمترو؛ تحقق من الإعلانات الرسمية لمعرفة آخر حالة للربط.'},
    {id:11,name:'المستثمرين',en:'Investors',area:'القاهرة الجديدة',body:'محطة باسم منطقة المستثمرين، وتقع في تسلسل المحطات بعد النرجس وقبل اللوتس.'},
    {id:12,name:'اللوتس',en:'Al Lotus',area:'القاهرة الجديدة',body:'محطة تخدم نطاق اللوتس في القاهرة الجديدة، ضمن المقطع الأوسط من مونوريل شرق النيل.'},
    {id:13,name:'جولدن سكوير',en:'Golden Square',area:'القاهرة الجديدة',body:'محطة باسم منطقة جولدن سكوير، وتسبق محطة بيت الوطن في اتجاه العاصمة الإدارية الجديدة.'},
    {id:14,name:'بيت الوطن',en:'Beit Al-Watan',area:'القاهرة الجديدة',body:'محطة باسم منطقة بيت الوطن، وتأتي قبل محطة مسجد الفتاح العليم عند الاقتراب من العاصمة الإدارية.'},
    {id:15,name:'مسجد الفتاح العليم',en:'Al-Fattah Al-Aleem Mosque',area:'العاصمة الإدارية',body:'محطة تخدم نطاق مسجد الفتاح العليم، وهي أول محطة في مجموعة العاصمة الإدارية باتجاه مدينة العدالة.'},
    {id:16,name:'الحي R1',en:'R1 Residential District',area:'العاصمة الإدارية',body:'محطة تخدم نطاق الحي السكني R1 في العاصمة الإدارية الجديدة.'},
    {id:17,name:'الحي R2',en:'R2 Residential District',area:'العاصمة الإدارية',body:'محطة تخدم نطاق الحي السكني R2، وتسبق محطة المال والأعمال.'},
    {id:18,name:'حي المال والأعمال',en:'Central Business District',area:'العاصمة الإدارية',body:'محطة منطقة المال والأعمال المركزية في العاصمة الإدارية الجديدة.'},
    {id:19,name:'مدينة الفنون والثقافة',en:'Arts & Culture City',area:'العاصمة الإدارية',body:'محطة تبادل مع القطار الكهربائي الخفيف LRT وفق المعلومات المنشورة عن شبكة النقل بالعاصمة الإدارية.'},
    {id:20,name:'الحي الحكومي',en:'Government District',area:'العاصمة الإدارية',body:'محطة تخدم نطاق الحي الحكومي، وتأتي بعد مدينة الفنون والثقافة وقبل مسجد مصر.'},
    {id:21,name:'مسجد مصر',en:'Misr Mosque',area:'العاصمة الإدارية',body:'محطة تخدم نطاق مسجد مصر في العاصمة الإدارية الجديدة، وتسبق المحطة النهائية للخط.'},
    {id:22,name:'مدينة العدالة',en:'Justice City',area:'العاصمة الإدارية',body:'المحطة النهائية لمونوريل شرق النيل في مدينة العدالة بالعاصمة الإدارية الجديدة.'}
  ];
  const stationDetailTitle = $('stationDetailTitle'), stationDetailText = $('stationDetailText'), stationMapLink = $('stationMapLink'), stationDetailBox = $('stationDetailBox');

  function selectStation(id, trigger) {
    const station = stations.find((item) => item.id === Number(id));
    if (!station) return;
    selectedStationId = station.id;
    document.querySelectorAll('.station-stop').forEach((button) => {
      const selected = Number(button.dataset.stationId) === station.id;
      button.setAttribute('aria-pressed', String(selected));
    });
    if (stationDetailTitle) stationDetailTitle.textContent = `${station.id}. ${station.name}`;
    if (stationDetailText) stationDetailText.textContent = `${station.body} المنطقة: ${station.area}.`;
    const mapQuery = `${station.en} Monorail station`;
    if (stationMapLink) {
      stationMapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery + ' Egypt')}`;
      stationMapLink.textContent = 'فتح موقع المحطة في خرائط Google ↗';
    }
    // Keep the existing detail panel, but place it directly below the selected station.
    const stationButton = document.querySelector(`.station-stop[data-station-id="${station.id}"]`);
    if (stationButton && stationDetailBox) {
      stationDetailBox.classList.add('station-detail-inline');
      stationButton.insertAdjacentElement('afterend', stationDetailBox);
    }
    // Selecting a station updates the detail panel; no modal or photo is opened.
  }
  document.querySelectorAll('.station-stop[data-station-id]').forEach((button) => {
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click', () => selectStation(button.dataset.stationId, button));
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectStation(button.dataset.stationId, button); }
    });
  });

  // Native <details> FAQ works locally without scripts or network access.
  document.querySelectorAll('.faq-item').forEach((item) => {
    const summary = item.querySelector('summary');
    const icon = item.querySelector('.faq-chevron');
    const updateIcon = () => { if (icon) icon.textContent = item.open ? '−' : '＋'; };
    item.addEventListener('toggle', updateIcon); updateIcon();
    if (summary) summary.setAttribute('aria-label', summary.textContent.trim());
  });

  // Fare calculator is entirely local.
  const fareTable = {
    one: { full: 20, half: 10, stops: 'حتى 5 محطات' },
    two: { full: 40, half: 20, stops: 'حتى 10 محطات' },
    three: { full: 55, half: 30, stops: 'حتى 15 محطة' },
    four: { full: 80, half: 40, stops: 'الخط كاملًا · حتى 22 محطة' }
  };
  calculateFare?.addEventListener('click', () => {
    const zone = fareTable[fareZoneSelect?.value];
    const type = fareTypeSelect?.value === 'half' ? 'half' : 'full';
    if (!zone) { if (fareResult) fareResult.textContent = 'يرجى اختيار نطاق رحلة صحيح.'; return; }
    const amount = zone[type];
    const category = type === 'half' ? 'نصف تذكرة للفئات المستحقة' : 'تذكرة كاملة';
    if (fareResult) {
      fareResult.textContent = `${category}: ${amount} جنيهًا (${zone.stops}). الأسعار منشورة في مايو 2026؛ تحقق من السعر الساري عند الشراء.`;
      fareResult.classList.add('fare-result-ready');
    }
  });

  // Graceful fallback when a publisher blocks image embedding.
  document.querySelectorAll('.photo-image').forEach((img) => {
    const showImageFallback = () => {
      img.hidden = true;
      const fallback = img.parentElement?.querySelector('.photo-fallback');
      if (fallback) fallback.hidden = false;
    };
    img.addEventListener('error', showImageFallback, { once: true });
    if (img.complete && img.naturalWidth === 0) showImageFallback();
  });

  // Pan/zoom simulation; every control is wired defensively.
  scene?.addEventListener('pointerdown', (event) => {
    if (zoom <= 1.001 || event.button !== 0) return;
    const rect = scene.getBoundingClientRect();
    dragState = { pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, x: viewBox.x, y: viewBox.y, rect };
    scene.classList.add('is-dragging');
    try { scene.setPointerCapture(event.pointerId); } catch (_) {}
  });
  scene?.addEventListener('pointermove', (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const dx = (event.clientX - dragState.clientX) * viewBox.w / Math.max(1, dragState.rect.width);
    const dy = (event.clientY - dragState.clientY) * viewBox.h / Math.max(1, dragState.rect.height);
    viewBox.x = Math.max(0, Math.min(SVG_WIDTH - viewBox.w, dragState.x - dx));
    viewBox.y = Math.max(0, Math.min(SVG_HEIGHT - viewBox.h, dragState.y - dy)); applyViewBox();
  });
  function stopDrag(event) { if (dragState && (!event || event.pointerId === dragState.pointerId)) { dragState = null; scene?.classList.remove('is-dragging'); } }
  scene?.addEventListener('pointerup', stopDrag); scene?.addEventListener('pointercancel', stopDrag); scene?.addEventListener('lostpointercapture', () => stopDrag());

  updateSpeed(); setDirection(-1); setNightMode(false); setZoom(1); setPaused(paused); updateTrainTransform();
  if (streetCar) streetCar.setAttribute('transform', `translate(${carX} 396)`);
  if (scene && train) window.requestAnimationFrame(renderFrame);
})();
