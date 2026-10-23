(function(){
const KEY='tsaad-katan-v2';
const JOYS=['var(--joy1)','var(--joy2)','var(--joy3)','var(--joy4)','var(--joy5)','var(--joy6)'];

/* ---------- words ---------- */
const QUOTES=[
 {t:'🌱 צעד קטן הוא עדיין צעד קדימה.'},
 {t:'☀️ לא צריך לעשות הכל היום. מספיק לעשות משהו.'},
 {t:'🐢 {אתה לא מאחר|את לא מאחרת}. {אתה|את} בקצב שלך.'},
 {t:'🌈 ימים קשים עוברים. ההתקדמות נשארת.'},
 {t:'✅ כל וי הוא הוכחה קטנה שאפשר.'},
 {t:'🍯 אין "מעט מדי". יש "עוד קצת".'},
 {t:'💛 {תהיה עדין|תהיי עדינה} עם עצמך, כמו עם חבר טוב.'},
 {t:'🌻 התקדמות לא חייבת להיות מהירה כדי להיות אמיתית.'},
 {t:'⭐ {אתה עושה|את עושה} יותר ממה {שאתה חושב|שאת חושבת}.'},
 {t:'💪 קדימה, {אתה יכול|את יכולה}. אל {תוותר|תוותרי} לעצמך.'},
 {t:'🚶 מסע של אלף מילין מתחיל בצעד אחד.',w:'לאו דזה'},
 {t:'🐌 לא משנה כמה לאט {אתה הולך|את הולכת}, כל עוד {אתה לא עוצר|את לא עוצרת}.',w:'מיוחס לקונפוציוס'},
 {t:'🪜 לא צריך לראות את כל המדרגות. רק לעלות על הראשונה.',w:'מיוחס למרטין לותר קינג'},
 {t:'🌊 גם זה יעבור.',w:'מתוך האגדה על שלמה המלך'},
 {t:'🔆 כל עוד הנר דולק, אפשר עוד לתקן.',w:'רבי ישראל סלנטר',f:1},
 {t:'🌉 כל העולם כולו גשר צר מאוד, והעיקר לא לפחד כלל.',w:'רבי נחמן מברסלב',f:1},
 {t:'✨ אין שום ייאוש בעולם כלל.',w:'רבי נחמן מברסלב',f:1},
 {t:'🙌 אם אין אני לי, מי לי? וכשאני לעצמי, מה אני?',w:'הלל הזקן, פרקי אבות',f:1},
 {t:'🌤️ לא כל יום צריך להיות טוב. מספיק שיש בו רגע אחד טוב.'},
 {t:'🫖 גם לנוח זה לעשות משהו בשביל עצמך.'},
 {t:'🧩 לא צריך לפתור הכל. רק את החתיכה הבאה.'},
 {t:'🌙 גם יום שרק {עברת|עברת} אותו הוא יום שנחשב.'},
 {t:'🍃 נשימה אחת עמוקה היא כבר התחלה.'},
 {t:'🧸 מותר לבקש עזרה. זה סימן לכוח, לא לחולשה.'},
 {t:'🌱 זרעים לא נראים בהתחלה, אבל הם גדלים מתחת לאדמה.'},
 {t:'🪴 צמחים לא ממהרים, ובכל זאת הם פורחים.'},
 {t:'🐾 צעד, ועוד צעד, וכבר {הלכת|הלכת} דרך.'},
 {t:'💧 טיפה ועוד טיפה בסוף ממלאות כוס.'},
 {t:'🕯️ אור קטן מספיק כדי לראות את הצעד הבא.'},
 {t:'🧭 לא צריך לדעת את כל הדרך. מספיק לדעת את הכיוון.'},
 {t:'🌸 {אתה לא צריך|את לא צריכה} להרוויח את המנוחה שלך.'},
 {t:'🎈 הצלחה קטנה היא עדיין הצלחה.'},
 {t:'🫶 {תדבר|תדברי} עם עצמך כמו שהיית {מדבר|מדברת} עם מישהו שאכפת לך ממנו.'},
 {t:'🌻 היום {אתה|את} מספיק. בדיוק כמו {שאתה|שאת}.'},
 {t:'🐢 לאט זה גם קצב.'},
 {t:'☕ קודם כוס מים. אחר כך נראה.'},
 {t:'🌈 אחרי גשם תמיד מגיע אור.'},
 {t:'🧺 לא צריך לסדר את כל הבית. מגירה אחת זה המון.'},
 {t:'🎵 גם לשיר אחד יש התחלה, אמצע וסוף. גם ליום הזה.'},
 {t:'🌊 גלים באים והולכים. גם הרגשות.'},
 {t:'🪁 {תן|תני} לעצמך רשות להתחיל לא מושלם.'},
 {t:'⏳ חמש דקות זה מספיק כדי להתחיל.'},
 {t:'💛 העובדה {שאתה|שאת} כאן ומנסה, זה כבר אומר הרבה.'},
 {t:'🌼 כל וי קטן מצטרף לסיפור גדול.'},
 {t:'🛤️ דרך ארוכה עשויה מצעדים קצרים.'},
 {t:'🧡 {אתה לא לבד|את לא לבד} בזה.'},
 {t:'🐣 גם להתחיל מחדש זו התקדמות.'},
 {t:'🌅 בוקר חדש הוא דף חדש. גם בצהריים.'},
 {t:'🪞 {תסתכל|תסתכלי} על כמה {עברת|עברת}, לא רק על כמה נשאר.'},
 {t:'🍀 מזל זה נחמד, אבל צעדים קטנים זה בטוח יותר.'},
 {t:'🧗 לא מטפסים הר בקפיצה אחת.'},
 {t:'🐝 גם דבורה בונה כוורת תא אחרי תא.'},
 {t:'🌳 עץ גדול היה פעם זרע קטן שלא ויתר.'},
 {t:'📖 יום קשה הוא עמוד אחד, לא כל הספר.'},
 {t:'🫧 מותר שיהיה קשה. מותר גם שיהיה קצת יותר קל.'},
 {t:'🌿 {תהיה סבלני|תהיי סבלנית} עם התהליך. הוא סבלני איתך.'},
 {t:'🎯 מטרה גדולה היא הרבה מטרות קטנות שהחליטו ללכת ביחד.'},
 {t:'✨ גם ניצוץ קטן הוא אור.'},
 {t:'🧁 {תחגוג|תחגגי} את הדברים הקטנים. הם הכי מתוקים.'},
 {t:'🌧️ גם בימים אפורים דברים צומחים.'},
 {t:'🐌 {אתה לא צריך להיות מהיר|את לא צריכה להיות מהירה}. רק להמשיך.'},
 {t:'🔋 כשהסוללה נמוכה, עושים משהו קטן. זה בסדר גמור.'},
 {t:'🛋️ גם יום של מנוחה הוא חלק מהדרך.'},
 {t:'💪 {עשית|עשית} דברים קשים בעבר. {תוכל|תוכלי} גם הפעם.'},
 {t:'🌟 הכוכבים נראים רק כשחשוך.'},
 {t:'🍂 גם עונות מתחלפות. גם התקופה הזאת.'},
 {t:'🦋 שינוי לוקח זמן. גם לפרפר.'},
 {t:'🕊️ שקט קטן באמצע היום הוא מתנה.'},
 {t:'🎨 אין דרך אחת נכונה. יש את הדרך שלך.'},
 {t:'🪜 מדרגה אחת בכל פעם. לא יותר.'},
 {t:'🌍 העולם צריך גם את הקצב שלך.'},
 {t:'📝 לכתוב משימה זה כבר חצי מהדרך להתחיל אותה.'},
 {t:'🍯 חסד כלפי עצמך הוא לא פינוק. הוא דלק.'},
 {t:'🌤️ אם היום לא יצא, מחר יש עוד ניסיון. בלי ניקוד.'},
 {t:'🧘 {תעצור|תעצרי} רגע. {תנשום|תנשמי}. {אתה|את} עדיין כאן, וזה חשוב.'},
 {t:'🎁 כל יום שבו {ניסית|ניסית} הוא יום ששווה משהו.'},
 {t:'🌠 חלומות גדולים מתחילים ברשימה קטנה.'},
 {t:'🐞 גם הדברים הקטנים בעולם עושים הבדל.'},
 {t:'🌾 מה שזורעים לאט, צומח חזק.'},
 {t:'🧶 גם סוודר נסרג שורה אחרי שורה.'},
 {t:'☀️ לפעמים הצעד הכי אמיץ הוא לקום מהמיטה. וזה נחשב.'},
 {t:'💌 מגיע לך אותה סבלנות שהיית {נותן|נותנת} לחבר טוב.'},
 {t:'🏡 גם לחזור הביתה בשלום זה הישג.'},
 {t:'🪷 פרח הלוטוס צומח דווקא מהבוץ.'},
 {t:'🧃 {תאכל|תאכלי} משהו, {תשתה|תשתי} משהו. גם זה צעד.'},
 {t:'🎒 לא צריך לסחוב הכל היום. אפשר להשאיר משהו למחר.'},
 {t:'🗝️ לפעמים משימה אחת קטנה פותחת את כל היום.'},
 {t:'🌺 {אתה|את} לא הימים הקשים שלך. {אתה|את} גם כל הטובים.'},
 {t:'🫂 גם כשלא רואים את זה, {אתה|את} {חשוב|חשובה}.'},
 {t:'🧭 תקלה בדרך היא לא סוף הדרך.'},
 {t:'🌈 ההתקדמות לא הולכת בקו ישר, וזה בסדר.'},
 {t:'💡 רעיון קטן שעשית שווה יותר מרעיון גדול שחיכה.'},
 {t:'🍓 כל וי הוא פרי קטן של מאמץ.'},
 {t:'🌛 לילה טוב גם הוא צעד. השינה עוזרת למחר.'},
 {t:'🛶 לא צריך לחתור מהר. מספיק לא להפסיק לגמרי.'},
 {t:'🐦 גם ציפור לומדת לעוף מנפילה לנפילה.'},
 {t:'🌵 גם בתנאים קשים אפשר לצמוח.'},
 {t:'🎶 {תעשה|תעשי} את זה עם השיר האהוב עליך. יהיה קל יותר.'},
 {t:'📦 משימה גדולה? {תפתח|תפתחי} רק את הקופסה הראשונה.'},
 {t:'🌻 {תסתובב|תסתובבי} לכיוון האור, גם אם הוא חלש.'},
 {t:'🕰️ אין שעה מאוחרת מדי לצעד קטן.'},
 {t:'🧡 היום {אתה|את} {עושה|עושה} את הכי טוב שאפשר היום. וזה מספיק.'},
 {t:'🌤️ קצת זה לא כלום. קצת זה קצת, וזה המון.'},
 {t:'🌱 {אתה|את} {גדל|גדלה}, גם כשזה לא מרגיש ככה.'},
 {t:'⛵ עוד יש מפרש לבן באופק, מול ענן שחור כבד.',w:'נעמי שמר, "לו יהי"'},
 {t:'🕊️ האומנם עוד יבואו ימים בסליחה ובחסד.',w:'לאה גולדברג'},
 {t:'🔔 יש סדק בכל דבר. כך נכנס האור.',w:'לאונרד כהן'},
 {t:'❄️ באמצע החורף גיליתי שיש בי קיץ שאי אפשר להביס.',w:'אלבר קאמי'},
 {t:'🚪 הדרך הכי טובה לצאת היא תמיד לעבור דרך.',w:'רוברט פרוסט'},
 {t:'🧱 הצלחה היא סכום של מאמצים קטנים שחוזרים עליהם יום אחרי יום.',w:'רוברט קולייר'},
 {t:'🔁 אנחנו מה שאנחנו עושים שוב ושוב.',w:'ויל דוראנט, על אריסטו'},
 {t:'🎒 {תתחיל|תתחילי} מאיפה {שאתה|שאת} {נמצא|נמצאת}. {תשתמש|תשתמשי} במה שיש לך. {תעשה|תעשי} מה {שאתה יכול|שאת יכולה}.',w:'ארתור אש'},
 {t:'🏔️ זה תמיד נראה בלתי אפשרי, עד שזה נעשה.',w:'מיוחס לנלסון מנדלה'},
 {t:'🚲 החיים הם כמו רכיבה על אופניים: כדי לשמור על איזון צריך להמשיך לנוע.',w:'אלברט איינשטיין'},
 {t:'🐦 לאט לאט, הציפור בונה את הקן שלה.',w:'פתגם צרפתי'},
 {t:'🐢 לאט ובטוח מנצחים במרוץ.',w:'איזופוס, הצב והארנבת'},
 {t:'⛵ אי אפשר לשנות את הרוח, אבל אפשר לכוון את המפרשים.',w:'פתגם'},
 {t:'🔑 כשאיננו יכולים עוד לשנות מצב, אנחנו נדרשים לשנות את עצמנו.',w:'ויקטור פרנקל'},
 {t:'🧭 מי שיש לו "למה" לחיות, יכול לשאת כמעט כל "איך".',w:'פרידריך ניטשה'},
 {t:'🌙 ארוך הוא הלילה שאינו מוצא את היום.',w:'שייקספיר, מקבת'},
 {t:'⛈️ אני לא {מפחד|מפחדת} מסערות, כי אני {לומד|לומדת} להשיט את הספינה שלי.',w:'לואיזה מיי אלקוט'},
 {t:'🌳 אף פעם לא מאוחר מדי להיות מי שיכולת להיות.',w:'מיוחס לג\'ורג\' אליוט'},
 {t:'🧸 {אתה אמיץ|את אמיצה} יותר ממה {שאתה מאמין|שאת מאמינה}, {חזק|חזקה} יותר ממה {שאתה נראה|שאת נראית}, ו{חכם|חכמה} יותר ממה {שאתה חושב|שאת חושבת}.',w:'כריסטופר רובין, פו הדב'},
 {t:'🌿 הטבע לא ממהר, ובכל זאת הכל נעשה.',w:'מיוחס ללאו דזה'},
 {t:'🌟 אם תרצו, אין זו אגדה.',w:'בנימין זאב הרצל'},
 {t:'🚪 כל ההתחלות קשות.',w:'מכילתא'},
 {t:'💪 אין דבר העומד בפני הרצון.',w:'פתגם עברי'},
 {t:'🌤️ אולי אי אפשר לשלוט בכל מה שקורה, אבל אפשר להחליט לא לתת לזה להקטין אותך.',w:'מאיה אנג\'לו'},
 {t:'🕯️ אם {אתה מאמין|את מאמינה} שאפשר לקלקל, {תאמין|תאמיני} שאפשר לתקן.',w:'רבי נחמן מברסלב',f:1},
 {t:'😊 מצווה גדולה להיות בשמחה תמיד.',w:'רבי נחמן מברסלב',f:1},
 {t:'🛠️ לא עליך המלאכה לגמור, ולא {אתה בן חורין|את בת חורין} להיבטל ממנה.',w:'רבי טרפון, פרקי אבות',f:1},
 {t:'🌾 הזורעים בדמעה, ברינה יקצורו.',w:'תהלים קכ"ו',f:1},
 {t:'🦁 שבע ייפול צדיק, וקם.',w:'משלי כ"ד',f:1},
 {t:'🦅 וקווי ה\' יחליפו כוח, יעלו אבר כנשרים.',w:'ישעיהו מ\'',f:1},
 {t:'🛡️ גם כי אלך בגיא צלמוות לא אירא רע, כי אתה עמדי.',w:'תהלים כ"ג',f:1},
 {t:'💫 קמתי, כי נפלתי. כי אשב בחושך, ה\' אור לי.',w:'מיכה ז\'',f:1},
 {t:'🍞 איזהו עשיר? השמח בחלקו.',w:'בן זומא, פרקי אבות',f:1},
 {t:'⚖️ לפום צערא אגרא: לפי הקושי, השכר.',w:'בן הא הא, פרקי אבות',f:1},
 {t:'🌻 גם זו לטובה.',w:'נחום איש גם זו',f:1},
 {t:'🙏 תן לי שלווה לקבל את מה שאין ביכולתי לשנות, אומץ לשנות את מה שביכולתי, ותבונה להבחין ביניהם.',w:'תפילת השלווה, ריינהולד ניבור',f:1},
 {t:'🦁 חזק ואמץ, אל תערוץ ואל תחת.',w:'יהושע א\'',f:1},
];
const CHEERS=['🎉 כל הכבוד! עוד צעד קטן','🌟 יפה מאוד, זה נחשב','💪 {עשית|עשית} את זה!','🌈 איזה יופי של התקדמות','👣 צעד ועוד צעד','💛 גאה {בך|בך}','🌼 בדיוק ככה','😊 זה מגיע לך','🦋 הנה עוד כנף קטנה','🍀 היום שלך עוד מתמלא','🎈 וי! זה הרגיש טוב, נכון?','🌻 הגינה שלך מודה לך','🧡 עוד הוכחה שאפשר','🥳 ככה עושים את זה','⭐ {אתה|את} {כוכב|כוכבת}'];
const HALF=['💪 התחלת, וזה כבר המון','🌱 כל ניסיון נחשב','🧡 התחלה זה חצי מהדרך'];
const EMOJI_MAP=[[/מים|לשתות/,'💧'],[/מקלחת|להתקלח|רחצה|אמבטיה/,'🚿'],[/תרופ|כדור/,'💊'],[/להתקשר|טלפון|תור|קופת|רופא/,'📞'],[/הליכה|ללכת|לצאת|טיול|הליכות|מהבית/,'🚶'],[/ספורט|כושר|להתאמן|ריצה|לרוץ|יוגה|לזוז/,'💪'],[/חבר|חברתי|שיחה|לדבר|הודעה|אמא|אבא|משפחה|אינטראקצי|להיפגש|קשרים/,'💬'],[/לאכול|ארוחה|לבשל|אוכל|תזונה/,'🍎'],[/לסדר|לנקות|כביסה|לכבס|כלים|מיטה|חדר|בלגן|הבית/,'🧹'],[/ללמוד|לקרוא|ספר|שיעור|מבחן|קורס/,'📚'],[/לישון|שינה|להירדם|לנוח|מנוחה/,'😴'],[/לקנות|קניות|סופר/,'🛒'],[/עבודה|מייל|לכתוב|מחשב|קורות חיים|ראיון/,'💼'],[/לנשום|מדיטציה|נשימה|רוגע/,'🧘'],[/מוזיקה|לשיר|לנגן/,'🎵'],[/לצייר|יצירה|לצבוע|תחביב/,'🎨'],[/מרפסת|אוויר|שמש|בחוץ/,'🌤️'],[/כסף|חשבון|לשלם/,'💰'],[/כלב|חתול/,'🐾']];
const FALLBACK_E=['🌱','⭐','🌼','✨','🍀','🦋'];
const GOAL_EMOJIS=['🌱','🎯','⭐','💛','✨','🌈','🏆','🔥','🪜','🌻','🚀','🍀'];
// many symbols, grouped by kind of goal; the ones that fit the goal's words are offered first
const GOAL_KINDS=[
 ['בריאות ואוכל',/בריא|רופא|תרופ|שיניים|דיאט|משקל|לאכול|אוכל|תזונה|מים|לשתות|ירקות|סוכר/,['🍎','🥗','🥦','💧','💊','🩺','🦷','⚖️','🍵','🥑','🫐','🍌','🥕','🍳']],
 ['ספורט ותנועה',/ספורט|כושר|להתאמן|אימון|ריצה|לרוץ|הליכ|ללכת|יוגה|שחי|לשחות|אופניים|לזוז|צעדים|פילאטיס|ריקוד|לרקוד/,['💪','🏃','🚶','🧘','🏊','🚴','⚽','🏀','🎾','🏋️','🤸','🥾','💃','⛰️']],
 ['נפש ורוגע',/רוגע|נשימ|מדיטצי|חרדה|דיכאון|מצב רוח|נפש|לנוח|מנוחה|שינה|לישון|להירדם|טיפול|פסיכולוג|לחץ|סטרס/,['🌿','🕊️','😌','💜','🫶','🌙','😴','🛌','🕯️','🌸','☁️','🫧','🧸','🌼']],
 ['לימודים',/ללמוד|לימוד|מבחן|קורס|תואר|לקרוא|קריאה|ספר|שפה|אנגלית|בגרות|שיעור|מבחנים|אוניברסיט/,['📚','📖','✏️','🎓','🧠','📝','🔤','🌍','🗣️','💡','🏫','📐','🔬','🎒']],
 ['עבודה וקריירה',/עבודה|לעבוד|ראיון|קורות חיים|קריירה|עסק|פרויקט|מייל|לקוח|משרה|מקצוע|העסק/,['💼','💻','📈','🗂️','📊','🤝','🏢','📞','⏰','📋','🖊️','🧑‍💻','🛠️','📣']],
 ['כסף',/כסף|לחסוך|חיסכון|חוב|חשבון|לשלם|תקציב|משכורת|הוצאות/,['💰','🪙','💵','🏦','🐷','🧾','💳','📉','🧮','💎']],
 ['בית וסדר',/לסדר|לנקות|ניקיון|בית|דירה|חדר|כביסה|כלים|ארון|לשפץ|מטבח|בלגן|מיטה/,['🏡','🧹','🧺','🧽','🛋️','🪴','🛏️','📦','🔑','🧼','🗑️','🪟','🧴','🪣']],
 ['קשרים ומשפחה',/חבר|משפחה|אמא|אבא|ילד|זוגיות|להתקשר|קשרים|להיפגש|חברתי|שיחה|סבא|סבתא|אח|אחות|אהבה/,['💬','👨‍👩‍👧','🤗','💞','👫','☕','📱','💌','🫂','🎉','👶','🐾','🎁','💐']],
 ['יצירה ותחביבים',/לצייר|ציור|יצירה|לכתוב|כתיבה|מוזיקה|לנגן|לשיר|גיטרה|פסנתר|צילום|לסרוג|לבשל|לאפות|אפייה|תחביב|לתפור/,['🎨','🖌️','✍️','🎸','🎹','🎤','🎵','📷','🧶','🍰','🧑‍🍳','🎭','🧩','🪡']],
 ['אמונה ונשמה',/להתפלל|תפילה|תורה|שבת|דף יומי|תהלים|אמונה|בית כנסת|מצוו|חסד|ללמוד גמרא|שיעור תורה/,['🙏','📜','🕯️','✡️','🕍','💫','🌅','🍷','🤲','⭐','📖','🌟']],
 ['טבע ובחוץ',/טבע|טיול|לצאת|בחוץ|ים|פארק|גינה|לגנן|שמש|אוויר|מרפסת|הר/,['🌳','🌻','🌊','🏞️','🌤️','🍃','🌷','🏕️','🦋','🐦','🌈','🌾','🐶','🐱']],
 ['חלומות ומסעות',/חלום|לטוס|טיסה|חו"ל|נסיעה|רישיון|לנהוג|רכב|לטייל|מסע|להגשים/,['✈️','🗺️','🧳','🚗','🚆','🧭','🏝️','🎯','🏆','🌟','🎈','🪁','🚀','🗽']],
];
const kindsFor=title=>GOAL_KINDS.filter(([,r])=>title&&r.test(title));
const suggestEmoji=title=>{const k=kindsFor(title);if(k.length)return k[0][2][0];const m=EMOJI_MAP.find(([r])=>r.test(title||''));return m?m[1]:'🌱'};
// the picker: first what fits the goal, then (on request) every group
function emojiPickerHTML(cur,title,all){
  const btn=e=>`<button type="button" data-em="${e}" aria-pressed="${e===cur}" aria-label="סמל ${e}">${e}</button>`;
  const fit=[...new Set(kindsFor(title).flatMap(k=>k[2]))].slice(0,14);
  let h=`<div class="emojis">${[...new Set([...(fit.length?fit:GOAL_EMOJIS),cur])].map(btn).join('')}</div>`;
  if(fit.length)h=`<span class="emo-h">✨ מתאים למטרה</span>`+h;
  if(all)h+=`<span class="emo-h">כללי</span><div class="emojis">${GOAL_EMOJIS.map(btn).join('')}</div>`+GOAL_KINDS.map(([n,,l])=>`<span class="emo-h">${n}</span><div class="emojis">${l.map(btn).join('')}</div>`).join('');
  else h+=`<button type="button" class="linkbtn" data-emall style="align-self:flex-start">➕ עוד הרבה אימוג'ים</button>`;
  return h;
}
const MASCOTS={leafy:{e:'🍃',n:'עלעלי הזוהר'},puff:{e:'☁️',n:'פופי הפרוותי'},bloom:{e:'🌸',n:'פרחית הוורודה'},sunny:{e:'🌟',n:'שמשי הזהוב'},plant:{e:'🌱',n:'נבטי, צמח שגדל איתך'},cat:{e:'🐱',n:'מיצי החתולה'},bear:{e:'🧸',n:'דובי'},bunny:{e:'🐰',n:'שפנפן'}};
/* ---------- companions: soft glowing creatures, drawn here (no image files) ---------- */
let petN=0;
const PET_LOOK={
  leafy:{kind:'jelly',c1:'#E9FF9E',c2:'#9BD63A',c3:'#4E9A1F',ear:'leaf',eye:'#123B12',tail:true},
  bloom:{kind:'jelly',c1:'#FFE3F1',c2:'#FF9CC8',c3:'#D2558F',ear:'petal',eye:'#4A1638',tail:true},
  puff:{kind:'fluff',c1:'#FFFFFF',c2:'#E6F1FF',c3:'#4C8DF0',eye:'#1F63C9'},
  sunny:{kind:'fluff',c1:'#FFF9DB',c2:'#FFE082',c3:'#F4A72C',eye:'#8A4B00'},
};
function petSVG(k){
  const p=PET_LOOK[k];if(!p)return '';const id='pt'+(++petN);
  const eyes=`<g><ellipse cx="38" cy="54" rx="9" ry="10.5" fill="${p.eye}"/><ellipse cx="62" cy="54" rx="9" ry="10.5" fill="${p.eye}"/>
    <ellipse cx="38" cy="57" rx="6" ry="5" fill="${p.c3}" opacity=".55"/><ellipse cx="62" cy="57" rx="6" ry="5" fill="${p.c3}" opacity=".55"/>
    <circle cx="35" cy="50" r="3.2" fill="#fff"/><circle cx="59" cy="50" r="3.2" fill="#fff"/><circle cx="41" cy="58" r="1.4" fill="#fff"/><circle cx="65" cy="58" r="1.4" fill="#fff"/></g>
    <ellipse cx="27" cy="66" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><ellipse cx="73" cy="66" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/>`;
  if(p.kind==='jelly'){
    const ear=p.ear==='leaf'
      ?(x,r)=>`<g transform="rotate(${r} ${x} 40)"><ellipse cx="${x}" cy="24" rx="11" ry="20" fill="url(#${id}b)" stroke="${p.c3}" stroke-width="1.4" stroke-opacity=".5"/><path d="M${x} 8 V40 M${x} 20 l-6 -5 M${x} 28 l6 -5 M${x} 28 l-6 -5" stroke="${p.c3}" stroke-width="1.2" stroke-opacity=".55" fill="none" stroke-linecap="round"/></g>`
      :(x,r)=>`<g transform="rotate(${r} ${x} 40)">${[-24,0,24].map(a=>`<ellipse cx="${x}" cy="22" rx="7" ry="15" fill="url(#${id}b)" stroke="${p.c3}" stroke-width="1.2" stroke-opacity=".5" transform="rotate(${a} ${x} 36)"/>`).join('')}</g>`;
    return `<svg class="pet-svg" viewBox="0 0 100 100" aria-hidden="true"><defs>
      <radialGradient id="${id}b" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="${p.c1}"/><stop offset=".6" stop-color="${p.c2}"/><stop offset="1" stop-color="${p.c3}"/></radialGradient></defs>
      <ellipse cx="50" cy="95" rx="26" ry="3.5" fill="#000" opacity=".12"/>
      ${p.tail?`<path d="M70 84 Q92 84 90 68 Q88 58 80 62 Q76 66 82 69" fill="none" stroke="url(#${id}b)" stroke-width="5" stroke-linecap="round"/><circle cx="82" cy="69" r="4" fill="${p.c1}" opacity=".9"/>`:''}
      ${ear(29,-22)}${ear(71,22)}
      <path d="M44 34 Q40 20 33 14" stroke="${p.c2}" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="32" cy="13" r="4.5" fill="url(#${id}b)"/>
      <path d="M56 34 Q60 20 67 14" stroke="${p.c2}" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="68" cy="13" r="4.5" fill="url(#${id}b)"/>
      <ellipse cx="50" cy="80" rx="20" ry="14" fill="url(#${id}b)"/>
      <circle cx="50" cy="56" r="27" fill="url(#${id}b)"/>
      <ellipse cx="40" cy="40" rx="9" ry="5" fill="#fff" opacity=".45" transform="rotate(-25 40 40)"/>
      <circle cx="28" cy="72" r="1.3" fill="#fff" opacity=".8"/><circle cx="70" cy="44" r="1.1" fill="#fff" opacity=".8"/><circle cx="60" cy="76" r="1" fill="#fff" opacity=".8"/>
      ${eyes}<path d="M46 68 q2 2.5 4 0 q2 2.5 4 0" stroke="${p.c3}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <ellipse cx="41" cy="91" rx="6" ry="4" fill="url(#${id}b)"/><ellipse cx="59" cy="91" rx="6" ry="4" fill="url(#${id}b)"/></svg>`;
  }
  // fluffy puff
  const fur=Array.from({length:34},(_,i)=>{const a=i/34*Math.PI*2,r=29+(i%3)*1.2;return `<circle cx="${(50+Math.cos(a)*r).toFixed(1)}" cy="${(60+Math.sin(a)*r*.92).toFixed(1)}" r="${6+(i%2)}" fill="${i%2?p.c2:p.c1}"/>`}).join('');
  return `<svg class="pet-svg" viewBox="0 0 100 100" aria-hidden="true"><defs>
    <radialGradient id="${id}f" cx=".42" cy=".35" r=".85"><stop offset="0" stop-color="${p.c1}"/><stop offset=".75" stop-color="${p.c2}"/><stop offset="1" stop-color="${p.c3}" stop-opacity=".5"/></radialGradient>
    <linearGradient id="${id}t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.c3}"/><stop offset="1" stop-color="${p.c1}"/></linearGradient></defs>
    <ellipse cx="50" cy="96" rx="28" ry="3.5" fill="#000" opacity=".12"/>
    <path d="M44 32 Q42 16 36 8" stroke="${p.c2}" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="35" cy="8" rx="4" ry="6" fill="url(#${id}t)" transform="rotate(-25 35 8)"/>
    <path d="M58 32 Q62 18 70 12" stroke="${p.c2}" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="71" cy="11" rx="4" ry="6" fill="url(#${id}t)" transform="rotate(30 71 11)"/>
    <path d="M18 44 L12 26 L30 36Z" fill="${p.c3}"/><path d="M82 44 L88 26 L70 36Z" fill="${p.c3}"/>
    ${fur}<ellipse cx="50" cy="60" rx="31" ry="28" fill="url(#${id}f)"/>
    ${eyes}<circle cx="50" cy="66" r="1" fill="${p.eye}"/>
    <ellipse cx="38" cy="90" rx="6" ry="3.5" fill="${p.c3}"/><ellipse cx="62" cy="90" rx="6" ry="3.5" fill="${p.c3}"/></svg>`;
}
/* the companion as a small picture: drawn creature, or the old emoji */
const petIcon=k=>{const m=MASCOTS[k]||MASCOTS.plant;return PET_LOOK[k]?petSVG(k):`<span class="e">${m.e}</span>`};

/* ---------- how the app talks to you ---------- */
const VOICES={
  gentle:{e:'🌱',n:'רך ועדין',d:'שקט, חם, בלי לחץ',s:'אין לחץ. צעד אחד קטן, ואם לא היום, אז מחר 💛',
    p:'רך, עדין ושקט. בלי לחץ בכלל.',start:'{הוסף|הוסיפי} משהו קטן, או פשוט {תנוח|תנוחי}.',mid:'הפרח שלך גדל עם כל וי. אין לחץ להספיק הכל.',done:'מגיע לך לנוח. אולי עוד צעד קטן למטרה?',
    cheers:[]},
  friend:{e:'🤗',n:'חבר הכי טוב',d:'צחוק, חיבוק ו"יאללה"',s:'{אחי|אחותי}, יאללה! עוד וי אחד וזה שלנו 😎',
    p:'חבר/ה הכי טוב/ה: סלנג קליל, חם, צוחק יחד, "אחי"/"אחותי", מעודד כמו חבר אמיתי.',start:'יאללה, נתחיל עם משהו ממש קטן? אני איתך 🤙',mid:'{אתה רואה|את רואה}? הולך לך! {אחי התותח|אחותי התותחית} 💥',done:'{סגרת|סגרת} את היום! מגיע לך משהו טעים 🍕',
    cheers:['😎 {אחי, איזה מלך|אחותי, איזו מלכה}','🙌 יאללה! עוד אחד','🔥 {שורף|שורפת} את היום','🤙 ככה אני אוהב אותך']},
  parent:{e:'🫶',n:'הורה אוהב',d:'דאגה, גאווה וחום',s:'{מתוק|מתוקה} שלי, אני כל כך {גאה|גאה} בך. אכלת היום? 💛',
    p:'הורה אוהב/ת: דואג/ת, גאה, חם/ה, "מתוק/ה שלי", שואל/ת אם אכלת ונחת, מחבק/ת במילים.',start:'{מתוק|מתוקה} שלי, נתחיל ממשהו קטן? ואל {תשכח|תשכחי} לאכול 🍲',mid:'אני רואה כמה {אתה משתדל|את משתדלת}. אני גאה בך',done:'{עשית|עשית} הכל. עכשיו לנוח, {מתוק|מתוקה} 💛',
    cheers:['🫶 אני כל כך גאה בך','💛 {מתוק|מתוקה} שלי, כל הכבוד','🥰 ידעתי {שתצליח|שתצליחי}','🍲 יופי! ועכשיו לאכול משהו']},
  psych:{e:'🛋️',n:'פסיכולוג',d:'מקשיב, שואל, משקף',s:'מה {אתה מרגיש|את מרגישה} עכשיו? כל רגש מתקבל כאן 🌿',
    p:'פסיכולוג/ית מקשיב/ה ותומך/ת: משקף/ת רגשות, שואל/ת שאלה פתוחה אחת, מנרמל/ת, מדבר/ת בגובה העיניים. לא מאבחן/ת.',start:'איך {אתה מגיע|את מגיעה} ליום הזה? אפשר להתחיל מצעד אחד קטן 🌿',mid:'{שים|שימי} לב: {אתה מתקדם|את מתקדמת}. איך זה מרגיש?',done:'{עשית|עשית} הרבה היום. מה {למדת|למדת} על עצמך?',
    cheers:['🌿 {שים|שימי} לב לתחושה הזאת','🪞 זה שלך, {עשית|עשית} את זה','💭 צעד קטן, שינוי אמיתי','🌱 התקדמות היא לא קו ישר, והנה עוד צעד']},
  buddy:{e:'🤝',n:'מלווה צמוד',d:'כל הזמן לידך, צעד אחר צעד',s:'אני פה איתך כל היום. מה הצעד הבא? נעשה אותו ביחד 🤝',
    p:'מלווה צמוד/ה: נמצא/ת לצד המשתמש כל הזמן, מתכנן/ת איתו את הצעד הבא, תכליתי/ת וחם/ה, "ביחד", "אני פה".',start:'אני פה. מה הדבר הראשון שנעשה ביחד?',mid:'יופי, אנחנו בדרך. מה הבא בתור?',done:'עשינו את זה ביחד היום 🤝',
    cheers:['🤝 עשינו את זה ביחד','👣 צעד, ועוד צעד','✅ סימנו, ממשיכים','💪 אני פה איתך']},
  rabbi:{e:'📜',n:'רב',d:'אמונה, חיזוק ומשפט מהמקורות',s:'"לא עליך המלאכה לגמור". כל מעשה קטן חשוב בשמיים 🕯️',
    p:'רב חם ומחזק: אמונה ובטחון, משפט קצר מהמקורות כשמתאים (פרקי אבות, תהילים, חסידות), "בעזרת השם", מדגיש שכל מעשה קטן נחשב. בלי הטפה ובלי לחץ.',start:'"כל ההתחלות קשות". נתחיל בעזרת השם ממשהו קטן 🕯️',mid:'"לפום צערא אגרא", כל מאמץ נחשב',done:'ברוך השם, יום מלא. מגיעה לך מנוחה 🙏',
    cheers:['🕯️ ישר כוח!','🙏 ברוך השם, עוד צעד','📜 "מצווה גוררת מצווה"','✨ כל מעשה קטן הוא עולם ומלואו']},
  commander:{e:'🎖️',n:'מפקד בצבא',d:'קצר, נחוש, מאמין בך',s:'{חייל|חיילת}! משימה אחת קטנה, ביצוע. אני סומך {עליך|עלייך} 🎖️',
    p:'מפקד/ת בצבא: משפטים קצרים ונחושים, "חייל/ת", "ביצוע", "קדימה", מאמין/ה במשתמש. תמיד מכבד/ת ותומך/ת, אף פעם לא משפיל/ה, ובימים קשים מוריד/ה הילוך: "גם מנוחה היא חלק מהמשימה".',start:'{חייל|חיילת}, משימה ראשונה קטנה. קדימה!',mid:'יפה! ממשיכים לפי התוכנית 🎖️',done:'משימת היום הושלמה. לנוח, זו פקודה 🫡',
    cheers:['🫡 ביצוע מצוין!','🎖️ כל הכבוד, {חייל|חיילת}','💥 משימה הושלמה','⚔️ ממשיכים קדימה']},
  coach:{e:'🏋️',n:'מאמן כושר',d:'אנרגיה, "עוד חזרה אחת!"',s:'עוד חזרה אחת! הראש מתחזק כמו שריר 💪',
    p:'מאמן/ת כושר אנרגטי/ת: "עוד חזרה אחת", אנרגיה ושמחה, משווה התקדמות לאימון, תמיד מזכיר/ה שגם מנוחה בונה שריר.',start:'חימום: משימה אחת קלה ומתחילים 🏋️',mid:'יאללה עוד סט! {אתה|את} בכושר',done:'אימון מושלם! עכשיו מתיחות ומנוחה 💪',
    cheers:['💪 עוד חזרה!','🏋️ שריר של אלופים','🔥 ככה בונים כוח','🥇 שיא אישי']},
  grandma:{e:'👵',n:'סבתא',d:'חיבוק, מרק ו"חמוד שלי"',s:'{חמוד|חמודה} של סבתא, אכלת משהו? אחר כך משימה קטנה 🍲',
    p:'סבתא חמה: "חמוד/ה של סבתא", דואגת שתאכל/י ותתלבש/י חם, גאה בכל דבר קטן, מלאת אהבה ופולניות עדינה.',start:'{חמוד|חמודה}, קודם תה ועוגה, ואז משהו קטן 🍰',mid:'אוי, איזה {מוכשר|מוכשרת}! סבתא גאה',done:'הכל גמור? {שב|שבי} לנוח, סבתא מביאה מרק 🍲',
    cheers:['👵 {חמוד|חמודה} של סבתא!','🍪 מגיעה לך עוגייה','💋 נשיקה מסבתא','🧶 איזה {מוכשר|מוכשרת}']},
  zen:{e:'🧘',n:'מורה מדיטציה',d:'נשימה, רוגע, רגע אחד',s:'נשימה אחת. צעד אחד. זה מספיק 🍃',
    p:'מורה מדיטציה רגוע/ה: מעט מילים, נשימה, נוכחות ברגע, בלי מאמץ ובלי שיפוט.',start:'נשימה עמוקה. צעד אחד קטן 🍃',mid:'רגע אחד בכל פעם. {אתה|את} כאן',done:'היום התמלא. עכשיו רק לנשום 🧘',
    cheers:['🍃 נשימה, וי','🧘 נוכחות מלאה','🌊 בדיוק כמו גל','☁️ קל ופשוט']},
  funny:{e:'😄',n:'חבר מצחיק',d:'הומור וקלילות',s:'המשימות שלך כבר מתגעגעות. בוא{|י} נראה להן מי הבוס 😜',
    p:'חבר/ה מצחיק/ה: הומור עדין וקליל, משחקי מילים, מגזים בכיף, אף פעם לא צוחק/ת על המשתמש.',start:'רשימה ריקה? אפילו הכביסה {מתגעגעת אליך|מתגעגעת אלייך} 😜',mid:'המשימות בורחות ממך בפאניקה 😂',done:'{סיימת|סיימת} הכל. הרשימה הגישה תלונה במשטרה 🚓',
    cheers:['😂 המשימה לא ראתה את זה מגיע','🦸 {גיבור|גיבורת} על בפעולה','🎤 מיקרופון נופל','🕺 ריקוד ניצחון!']},
};
const voice=()=>VOICES[S.settings.voice]||VOICES.gentle;
function voicePickHTML(cur){
  return `<div class="voices">${Object.entries(VOICES).map(([k,v])=>`<button data-voice="${k}" aria-pressed="${k===cur}"><span class="ve">${v.e}</span><b>${v.n}</b><small>${v.d}</small><span class="vs">"${esc(G(v.s))}"</span></button>`).join('')}</div>`;
}
function petPickHTML(cur){
  return `<div class="pick pets">${Object.entries(MASCOTS).map(([k,v])=>`<button data-masc="${k}" aria-pressed="${k===cur}">${petIcon(k)}${v.n}</button>`).join('')}</div>`;
}
/* once after the update (and from settings): choose how the app talks to you, and meet the new companions */
function openVoicePicker(fromSettings){
  let step=0,sel=S.settings.voice||'',pet=S.settings.mascot;
  if(!fromSettings)$('sheet').dataset.lock='1';
  const draw=()=>{
    const body=step===0
      ?`<div class="big-e">💬</div><h2 id="sheet-title" style="text-align:center">${G('איך {תרצה|תרצי} שאדבר {אליך|אלייך}?')}</h2>
        <p style="text-align:center;color:var(--muted)">${G('{בחר|בחרי} את הסגנון שהכי מרגיש לך נכון. אפשר להחליף בכל רגע בהגדרות.')}</p>${voicePickHTML(sel)}`
      :`<div class="big-e pet-big">${petIcon(pet)}</div><h2 id="sheet-title" style="text-align:center">חברים חדשים ללוות אותך ✨</h2>
        <p style="text-align:center;color:var(--muted)">${G('הגיעו דמויות קטנות וזוהרות. {בחר|בחרי} מי ילווה אותך.')}</p>${petPickHTML(pet)}`;
    openSheet(`<div class="wiz">${body}<div class="actions"><button class="btn wide" id="vp-next" ${step===0&&!sel?'disabled':''}>${step===0&&!fromSettings?'הבא':'יופי, שומרים'}</button></div></div>`);
    const s=$('sheet');
    s.querySelectorAll('[data-voice]').forEach(b=>b.onclick=()=>{sel=b.dataset.voice;s.querySelectorAll('[data-voice]').forEach(x=>x.setAttribute('aria-pressed',x===b));$('vp-next').disabled=false});
    s.querySelectorAll('[data-masc]').forEach(b=>b.onclick=()=>{pet=b.dataset.masc;draw()});
    $('vp-next').onclick=()=>{
      if(step===0){S.settings.voice=sel;save();if(fromSettings){closeSheet();renderAll();toast(G(voice().e+' '+voice().s));return}step=1;draw();return}
      S.settings.mascot=pet;S.seenNew=WHATS_NEW.v;save();delete $('sheet').dataset.lock;closeSheet();lastStage=-1;renderAll();toast(G(voice().e+' '+voice().s))};
  };
  draw();
}

const MOODS=[['😔','קשה לי'],['😕','לא משהו'],['🙂','בסדר'],['😊','טוב'],['😄','מצוין']];
const ENERGY={light:{e:'🪶',n:'קל'},mid:{e:'🌿',n:'בינוני'},high:{e:'🔥',n:'דורש כוח'}};
// the app decides by itself how much strength a task takes (the user can still tap the label to change it)
const E_LIGHT=/לשתות|מים|כוס|תרופ|כדור|לצחצח|שיניים|לפתוח (את ה)?(חלון|תריס)|להתפלל|תפילה|לברך|ברכ|לנשום|נשימ|לשמוע|שיר|הודעה|לשלוח|וואטסאפ|לסמס|לחייך|לאכול|ארוחת בוקר|נשנוש|פרי|לסדר (את ה)?מיטה|לקרוא פרק|תהלים|להשקות|לתלות|לקום|להתלבש|ויטמין|דקה|דקות/;
const E_HIGH=/לנקות את (כל )?ה?(בית|דירה)|ניקיון|ספורט|כושר|חדר כושר|להתאמן|אימון|ריצה|לרוץ|מבחן|בחינה|עבודה ל|להגיש|ראיון|קורות חיים|לשפץ|לעבור דירה|לארוז|פרויקט|שעה|שעתיים|שעות|בנק|ביטוח לאומי|דוח|מס הכנסה|רופא|בדיק|טסט|לנהוג|קניות|סופר|לבשל|ארוחת ערב|כביסה|לגהץ|לסדר את (כל )?ה?(חדר|ארון|בית)|ללמוד|לכתוב|עבודה/;
function guessEnergy(text){
  const t=String(text||'');const m=t.match(/(\d+)\s*דקות/);
  if(m)return +m[1]<=10?'light':+m[1]<=30?'mid':'high';
  if(E_HIGH.test(t))return 'high';
  if(E_LIGHT.test(t))return 'light';
  return t.length>45?'high':'mid';
}
const NICE=['☕ לשתות משהו חם בשקט','🎵 לשמוע שיר שאוהבים','🌳 כמה דקות בחוץ','🛁 מקלחת חמה ונעימה','📞 הודעה קטנה למישהו יקר','🧸 פשוט לנוח, בלי אשמה'];
const TEMPLATES=[
 {t:'לצאת יותר מהבית',e:'🚶',why:'להרגיש יותר חיים ואוויר',s:['לפתוח חלון ולעמוד ליד 2 דקות','לצאת למרפסת או לחצר ל-5 דקות','להקיף את הבניין פעם אחת','הליכה של 10 דקות בשכונה','לצאת למקום נעים (פארק, בית קפה)']},
 {t:'להגדיל קשרים חברתיים',e:'💬',why:'להרגיש פחות לבד',s:['לשלוח הודעה קצרה למישהו קרוב','שיחה של 10 דקות עם חבר או חברה','להאריך את השיחה ל-15 דקות','שיחת וידאו','לקבוע מפגש קטן פנים אל פנים']},
 {t:'למצוא תחביב',e:'🎨',why:'שיהיה משהו שמשמח אותי רק בשבילי',s:['לרשום 3 דברים שפעם אהבתי לעשות','לבחור אחד ולחפש עליו מידע 5 דקות','לנסות אותו 10 דקות','לעשות את זה פעם נוספת','למצוא קבוצה או שיעור בנושא']},
 {t:'לסדר את הבית',e:'🧹',why:'להרגיש נוח ורגוע במקום שלי',s:['לסדר פינה אחת קטנה ל-5 דקות','לזרוק או למסור 5 דברים','10 דקות סידור','לסדר משטח אחד עד הסוף','לסדר חדר אחד']},
 {t:'לשפר שינה',e:'😴',why:'לקום עם יותר כוח',s:['לכבות מסכים 15 דקות לפני השינה','ללכת לישון באותה שעה בערך','לקום באותה שעה ולפתוח וילון','שגרת ערב רגועה של 10 דקות']},
];
const HELP=[['ער"ן, עזרה ראשונה נפשית','1201'],['סה"ר, סיוע והקשבה ברשת','sahar.org.il'],['נט"ל, קו סיוע','1-800-363-363']];
const emojiFor=(text,i)=>{const m=EMOJI_MAP.find(([r])=>r.test(text));return m?m[1]:FALLBACK_E[(i||0)%FALLBACK_E.length]};

/* ---------- helpers ---------- */
const uid=()=>(crypto.randomUUID?crypto.randomUUID():'x'+Math.random().toString(36).slice(2)+Date.now().toString(36));
const z=n=>String(n).padStart(2,'0');
const dkey=(d=new Date())=>d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate());
const kdate=k=>new Date(k+'T12:00');
const addDays=(k,n)=>{const d=kdate(k);d.setDate(d.getDate()+n);return dkey(d)};
const between=(a,b)=>Math.round((kdate(b)-kdate(a))/864e5);
const fmtDate=k=>kdate(k).toLocaleDateString('he-IL',{day:'numeric',month:'long'});
let T=dkey();
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const G=s=>String(s).replace(/\{([^|}]*)\|([^}]*)\}/g,(_,m,f)=>S.settings.address==='f'?f:m);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const nm=()=>S.settings.name?', '+S.settings.name:'';

/* ---------- sample data ---------- */
function sample(){
  const now=Date.now(),D=n=>addDays(T,n);
  const st=(text,done,dd)=>({id:uid(),text,done:!!done,doneAt:done?now-864e5*2:null,doneDays:dd||[]});
  const g1={id:uid(),emoji:'💬',color:3,title:'להגדיל קשרים חברתיים',why:'להרגיש פחות לבד',letter:'הצלחת! זוכר כמה זה נראה רחוק? גאה בך.',deadline:D(20),auto:true,sample:true,createdAt:now-864e5*8,steps:[
    st('לשלוח הודעה קצרה למישהו קרוב',1,[D(-8),D(-7),D(-5)]),st('שיחה של 10 דקות עם חבר או חברה',0,[D(-2),D(-1)]),st('שיחת וידאו'),st('לקבוע מפגש קטן פנים אל פנים')]};
  const g2={id:uid(),emoji:'🚶',color:1,title:'לצאת יותר מהבית',why:'להרגיש יותר חיים ואוויר',letter:'',deadline:'',auto:true,sample:true,createdAt:now-864e5*6,steps:[
    st('לצאת למרפסת ל-5 דקות',1,[D(-6),D(-4)]),st('להקיף את הבניין פעם אחת',0,[D(-1)]),st('הליכה של 10 דקות בשכונה'),st('לצאת לפארק')]};
  const tasks={};
  tasks[T]=[
    {id:uid(),text:'להתקשר לקופת חולים ולקבוע תור',energy:'mid',done:false,color:3,carried:3,sample:true},
    {id:uid(),text:'לשתות כוס מים',energy:'light',done:true,doneAt:now,color:2,sample:true},
    {id:uid(),text:'להתקלח',energy:'light',done:true,doneAt:now,color:4,sample:true},
    {id:uid(),text:'לבשל ארוחה',energy:'high',done:false,partial:true,color:5,sample:true}];
  const hist=[['לצאת למרפסת לחמש דקות','לכבס'],['לדבר עם אמא','לשטוף כלים','לסדר את המיטה'],[],['לקנות לחם','להתקלח'],['לשתות מים']];
  hist.forEach((L,i)=>{tasks[D(-i-1)]=L.map((text,k)=>({id:uid(),text,energy:'light',done:true,doneAt:now-864e5*(i+1),color:k,sample:true}))});
  const moods={};[3,2,0,3,4,2].forEach((m,i)=>moods[D(-i-1)]=m);
  const journal=[
    {id:uid(),date:D(-1),type:'good',text:'אמא צחקה מבדיחה שלי בטלפון',sample:true,at:now-864e5},
    {id:uid(),date:D(-2),type:'thanks',text:'על השמש בבוקר',sample:true,at:now-864e5*2},
    {id:uid(),date:D(-3),type:'letter',text:'אם קשה לך עכשיו, תזכור את היום הזה: יצאת, דיברת, צחקת. זה עוד יחזור. 💛',sample:true,at:now-864e5*3}];
  return {v:3,tasks,goals:[g1,g2],moods,journal,hard:{},seeded:true,onboarded:false,colorIx:0,lastOpen:T,lastSeen:T,carryNote:{date:T,n:1},injectSkip:{},reviewed:{},askNext:{},
    settings:{sound:false,confetti:true,address:'m',name:'',faith:false,mascot:'plant',eveningHour:19,noon:true}};
}

let S=null;
try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!S||!S.tasks||!S.settings)S=sample();
/* upgrade older saves */
if(S.v!==3){
  S.v=3;S.moods=S.moods||{};S.journal=S.journal||[];S.hard=S.hard||{};S.askNext=S.askNext||{};S.onboarded=false;
  S.settings=Object.assign({sound:false,confetti:true,address:'m',name:'',faith:false,mascot:'plant',eveningHour:19,noon:true},S.settings);
  Object.values(S.tasks).forEach(L=>L.forEach(t=>{if(!t.energy)t.energy=t.auto?'light':'mid'}));
  S.goals.forEach(g=>g.steps.forEach(s=>{delete s.days}));
}
S.lastSeenPrev=S.lastSeen||T;
let quiet=false;
function save(){S.u=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}if(!quiet&&window.TKcloud)TKcloud.dirty()}
const tomb=id=>{(S.del=S.del||{})[id]=Date.now()};
const untomb=id=>{if(S.del)delete S.del[id]};
const nextColor=()=>{S.colorIx=((S.colorIx||0)+1)%JOYS.length;return S.colorIx};
const today=()=>S.tasks[T]||(S.tasks[T]=[]);
const goalOf=id=>S.goals.find(g=>g.id===id);
const stepOf=(g,sid)=>g&&g.steps.find(s=>s.id===sid);
const curStep=g=>g.steps.find(s=>!s.done);
const isHard=()=>!!S.hard[T];

/* ---------- daily rhythm ---------- */
function rollover(){
  const last=S.lastOpen;
  if(last&&last<T&&S.tasks[last]){
    const moved=[];
    S.tasks[last].forEach(t=>{
      if(t.done||t.moved||t.letGo)return;
      t.moved=true;
      if(t.auto){const s=stepOf(goalOf(t.goalId),t.stepId);if(s&&!s.done)s.misses=(s.misses||0)+1;return}
      if(t.dailyId)return;
      moved.push({...t,id:uid(),carried:(t.carried||0)+1,startedBefore:!!t.partial||t.startedBefore,partial:false,done:false,doneAt:null,moved:false});
    });
    S.tasks[T]=[...moved,...(S.tasks[T]||[])];
    S.carryNote=moved.length?{date:T,n:moved.length}:null;
  }
  S.lastOpen=T;
}
function inject(){
  const L=today(),skip=(S.injectSkip[T]||[]);
  S.goals.forEach(g=>{
    if(g.auto===false||g.achievedAt)return;
    const s=curStep(g);if(!s)return;
    if(L.some(t=>t.goalId===g.id&&t.auto))return;
    if(skip.includes(s.id))return;
    L.push({id:uid(),text:s.text,energy:'light',done:false,color:nextColor(),goalId:g.id,stepId:s.id,auto:true,carried:s.misses||0,sample:g.sample});
  });
  // tasks marked "every day" (like praying in the morning) are added again each day
  // two phones may each add today's copy: keep one
  const seen={};for(let i=L.length-1;i>=0;i--){const t=L[i];if(!t.dailyId)continue;const o=seen[t.dailyId];if(!o){seen[t.dailyId]=t;continue}
    const drop=t.done&&!o.done?o:t;L.splice(L.indexOf(drop),1);if(drop===o)seen[t.dailyId]=t}
  (S.daily||[]).forEach(d=>{if(L.some(t=>t.dailyId===d.id)||skip.includes(d.id))return;
    L.push({id:uid(),text:d.text,energy:d.energy||'light',done:false,color:d.color||0,dailyId:d.id})});
}
rollover();inject();save();

/* ---------- celebration ---------- */
let actx;
function chime(){
  if(!S.settings.sound)return;
  try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const t0=actx.currentTime;
    [784,988,1319].forEach((f,i)=>{const o=actx.createOscillator(),g=actx.createGain(),s=t0+i*.09;
      o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(.16,s+.02);g.gain.exponentialRampToValueAtTime(.001,s+.55);
      o.connect(g);g.connect(actx.destination);o.start(s);o.stop(s+.6)})}catch(e){}
}
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function confetti(el,big){
  if(reduce||!S.settings.confetti||!el)return;const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
  const c=$('confetti'),ctx=c.getContext('2d'),dpr=window.devicePixelRatio||1;c.width=innerWidth*dpr;c.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const cs=getComputedStyle(document.documentElement);const cols=['--joy1','--joy2','--joy3','--joy4','--joy5','--accent','--ok'].map(v=>cs.getPropertyValue(v).trim());
  const emos=['✨','🌟','💛','🎉','🌸'];
  const ps=Array.from({length:big?80:34},(_,i)=>({x:big?Math.random()*innerWidth:x,y:big?-20:y,vx:(Math.random()-.5)*(big?4:8),vy:big?Math.random()*3+2:-Math.random()*8-2,r:3+Math.random()*4,c:pick(cols),a:1,e:i%6===0?pick(emos):null,rot:Math.random()*6}));
  let f=0;const max=big?120:60;(function tick(){ctx.clearRect(0,0,innerWidth,innerHeight);ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=big?.05:.3;p.a-=big?.008:.018;p.rot+=.1;ctx.globalAlpha=Math.max(p.a,0);
    if(p.e){ctx.font='18px "Noto Color Emoji","Apple Color Emoji",sans-serif';ctx.fillText(p.e,p.x,p.y)}
    else{ctx.fillStyle=p.c;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r);ctx.restore()}});
    if(++f<max)requestAnimationFrame(tick);else ctx.clearRect(0,0,innerWidth,innerHeight)})();
}
let tt,undoFn=null;
function toast(msg,undo){$('toast-msg').textContent=G(msg);undoFn=undo||null;$('toast-undo').hidden=!undo;$('toast').classList.add('show');clearTimeout(tt);tt=setTimeout(()=>{$('toast').classList.remove('show');undoFn=null},undo?5000:2600)}
$('toast-undo').onclick=()=>{if(undoFn){undoFn();undoFn=null}$('toast').classList.remove('show')};
let lastCheer=-1;
function cheer(){const C=voice().cheers.length&&Math.random()<.7?voice().cheers:CHEERS;let i;do{i=Math.floor(Math.random()*C.length)}while(i===lastCheer&&C.length>1);lastCheer=i;return C[i]}
function celebrate(el,msg,big){chime();confetti(el,big);toast(msg||cheer());try{navigator.vibrate&&navigator.vibrate(18)}catch(e){}}

/* ---------- task + step logic ---------- */
function setTask(t,v){
  t.done=v;t.doneAt=v?Date.now():null;if(v)t.partial=false;
  if(t.goalId){const g=goalOf(t.goalId),s=stepOf(g,t.stepId);if(s){s.doneDays=s.doneDays||[];
    if(v){if(!s.doneDays.includes(T))s.doneDays.push(T);s.misses=0;if(!s.done)S.askNext[g.id]=s.id}
    else{s.doneDays=s.doneDays.filter(d=>d!==T);if(S.askNext[g.id]===s.id)delete S.askNext[g.id]}}}
}
function completeStep(g,s){
  s.done=true;s.doneAt=Date.now();delete S.askNext[g.id];
  if(g.steps.every(x=>x.done)&&!g.achievedAt){g.achievedAt=Date.now();addJournal('win','🏆 הגעתי למטרה: '+g.title);return true}
  return false;
}
function addJournal(type,text){S.journal.unshift({id:uid(),date:T,type,text,at:Date.now()})}

/* ---------- breakdown (works offline; Claude in the web preview) ---------- */
function localBreakdown(title){
  const t=TEMPLATES.find(x=>x.t===title)||TEMPLATES.find(x=>EMOJI_MAP.some(([r,e])=>r.test(title)&&e===x.e));
  const s=t?t.s:['לכתוב במשפט אחד למה זה חשוב לי','לבחור את הפעולה הכי קטנה ולעשות אותה 5 דקות','10 דקות של התקדמות','להגדיל ל-20 דקות','לעצור, לחגוג ולבדוק מה הלאה'];
  return s.map((text,i)=>({label:'צעד '+(i+1),text}));
}
const localSmaller=text=>['להכין רק את מה שצריך בשביל: '+text,'לעשות את זה 2 דקות בלבד, ואז מותר לעצור','לעשות רק את החלק הכי קל'];
let sampleFn=null;
if(window.claude&&claude.use)claude.use('sample').then(f=>{sampleFn=f}).catch(()=>{});
const coachOn=()=>!!(window.TKai&&TKai.ready());
const aiOn=()=>coachOn()||!!sampleFn;
async function askSteps(title,why,days){
  if(coachOn())return (await TKai.steps(title,why,days)).map((text,i)=>({label:'צעד '+(i+1),text}));
  if(!sampleFn)throw {code:'unavailable'};
  const p=`את/ה מאמן/ת עדין/ה באפליקציה "צעד קטן" שעוזרת לאנשים (כולל מי שמתמודד עם דיכאון, שחיקה או קושי נפשי) להתקדם למטרה בצעדים קטנים, בלי לחץ ובלי שיפוטיות.
פרק/י את המטרה למספר הצעדים שהיא באמת צריכה, לא מספר קבוע: מטרה קטנה ופשוטה 3 עד 4 צעדים, מטרה בינונית 5 עד 8, מטרה גדולה או ארוכה (למשל ללמוד מקצוע, לרוץ 10 ק"מ, להוציא רישיון נהיגה, לעבור דירה) 8 עד 15. אם יש תאריך יעד, התאם/י את מספר הצעדים והקצב לזמן שיש. הראשון קטן מאוד וקל, וכל צעד גדל רק קצת מהקודם. כל צעד הוא פעולה אחת וקונקרטית שאפשר לעשות ביום אחד. המשתמש עובר לצעד הבא כשהוא מרגיש מוכן.
מטרה: ${title}
${why?'למה זה חשוב: '+why+'\n':''}${days?`זמן עד היעד: ${days} ימים.`:'בלי תאריך יעד.'}
כתוב/י בעברית, בלשון שם פועל, עד 60 תווים לצעד. החזר/י רק JSON: מערך מחרוזות.`;
  const r=await sampleFn.json(p,{modelTier:'default'});
  if(!Array.isArray(r)||!r.length)throw {code:'invalid_json'};
  return r.slice(0,15).map((x,i)=>({label:'צעד '+(i+1),text:String(typeof x==='string'?x:(x.text||'')).slice(0,90)})).filter(x=>x.text);
}
async function askSmaller(text){
  if(coachOn())return (await TKai.smaller(text)).slice(0,4);
  if(!sampleFn)throw {code:'unavailable'};
  const r=await sampleFn.json(`מישהו מנסה כבר כמה ימים לעשות את "${text}" ולא מצליח להתחיל. פרק/י את זה ל-2 עד 4 פעולות זעירות וקונקרטיות, עד 2 דקות כל אחת, שהראשונה כמעט בלי מאמץ. בעברית, בלשון שם פועל, עד 50 תווים. החזר/י רק JSON: מערך מחרוזות.`,{modelTier:'quick'});
  if(!Array.isArray(r)||!r.length)throw {code:'invalid_json'};
  return r.slice(0,4).map(x=>String(x).slice(0,80)).filter(Boolean);
}

/* ---------- illustrations ---------- */
function scene(stage){
  const leaves={
    0:'<path class="stem" d="M80 130 V120"/><ellipse class="leaf" cx="74" cy="119" rx="6" ry="3" transform="rotate(-30 74 119)"/><ellipse class="leaf" cx="86" cy="119" rx="6" ry="3" transform="rotate(30 86 119)"/>',
    1:'<path class="stem" d="M80 130 V104"/><ellipse class="leaf" cx="70" cy="114" rx="11" ry="5" transform="rotate(-30 70 114)"/><ellipse class="leaf" cx="90" cy="108" rx="11" ry="5" transform="rotate(30 90 108)"/>',
    2:'<path class="stem" d="M80 130 Q76 108 80 86"/><ellipse class="leaf" cx="68" cy="116" rx="12" ry="5.5" transform="rotate(-30 68 116)"/><ellipse class="leaf" cx="92" cy="106" rx="12" ry="5.5" transform="rotate(30 92 106)"/><ellipse class="leaf" cx="70" cy="96" rx="10" ry="4.5" transform="rotate(-35 70 96)"/><ellipse class="petal" cx="80" cy="82" rx="6" ry="8"/>',
    3:'<path class="stem" d="M80 130 Q76 106 80 80"/><ellipse class="leaf" cx="68" cy="116" rx="12" ry="5.5" transform="rotate(-30 68 116)"/><ellipse class="leaf" cx="92" cy="104" rx="12" ry="5.5" transform="rotate(30 92 104)"/><ellipse class="leaf" cx="69" cy="94" rx="10" ry="4.5" transform="rotate(-35 69 94)"/>'+
      [0,60,120,180,240,300].map(a=>`<ellipse class="petal" cx="80" cy="64" rx="6.5" ry="10" transform="rotate(${a} 80 74)"/>`).join('')+'<circle class="core" cx="80" cy="74" r="7"/>'+
      '<text x="104" y="62" font-size="16" style="font-family:var(--emoji)">✨</text><text x="44" y="78" font-size="13" style="font-family:var(--emoji)">✨</text>'
  };
  const mk=MASCOTS[S.settings.mascot]?S.settings.mascot:'plant';
  const pet=PET_LOOK[mk]?`<g class="pet-bob"><svg x="100" y="94" width="44" height="44" viewBox="0 0 100 100">${petSVG(mk).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg></g>`:mk!=='plant'?`<text x="116" y="136" font-size="22" style="font-family:var(--emoji)">${MASCOTS[mk].e}</text>`:'';
  return `<svg class="scene" viewBox="0 0 320 150" preserveAspectRatio="xMinYMax slice" aria-hidden="true">
    <defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky1"/><stop offset="1" class="sky2"/></linearGradient></defs>
    <rect width="320" height="150" fill="url(#skyg)"/>
    <circle class="sunglow" cx="40" cy="34" r="28"/><circle class="sun" cx="40" cy="34" r="17"/>
    <g class="cloud drift"><ellipse cx="120" cy="30" rx="22" ry="9"/><ellipse cx="134" cy="24" rx="13" ry="10"/></g>
    <g class="cloud drift2"><ellipse cx="200" cy="18" rx="16" ry="6"/><ellipse cx="210" cy="14" rx="9" ry="7"/></g>
    <path class="hill2" d="M0 116 Q70 94 150 110 T320 102 V150 H0Z"/>
    <path class="hill1" d="M0 130 Q90 112 190 128 T320 122 V150 H0Z"/>
    <ellipse class="soil" cx="80" cy="131" rx="20" ry="5"/>
    <g class="grow" id="plant-g">${leaves[stage]}</g>${pet}
  </svg>`;
}
const POT='<svg viewBox="0 0 120 90" aria-hidden="true"><ellipse cx="60" cy="84" rx="34" ry="4" fill="var(--line)"/><path d="M38 52 H82 L76 82 H44Z" fill="var(--accent)"/><rect x="34" y="46" width="52" height="9" rx="4" fill="var(--accent)"/><path class="stem" d="M60 46 V24"/><ellipse class="leaf" cx="50" cy="30" rx="11" ry="5" transform="rotate(-30 50 30)"/><ellipse class="leaf" cx="70" cy="26" rx="11" ry="5" transform="rotate(30 70 26)"/><circle cx="50" cy="66" r="2" fill="var(--accent-ink)"/><circle cx="70" cy="66" r="2" fill="var(--accent-ink)"/><path d="M54 72 Q60 77 66 72" stroke="var(--accent-ink)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
const MOUNTAIN='<svg viewBox="0 0 120 90" aria-hidden="true"><ellipse cx="60" cy="84" rx="50" ry="4" fill="var(--line)"/><path d="M8 82 L46 30 L62 50 L76 34 L112 82Z" fill="var(--hill1)"/><path d="M46 30 L38 41 L46 38 L52 44Z" fill="var(--cloud)"/><path d="M76 34 V12" stroke="var(--fg)" stroke-width="2.5" stroke-linecap="round"/><path d="M76 12 L94 17 L76 23Z" fill="var(--accent)"/><circle cx="100" cy="20" r="8" fill="var(--sun)"/></svg>';
const CHECK='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
const X='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

/* ---------- header + quote of the day ---------- */
function renderHeader(){
  const h=new Date().getHours();
  $('hello').textContent=(h<5?'לילה טוב':h<12?'בוקר טוב':h<17?'צהריים טובים':h<21?'ערב טוב':'לילה טוב')+(S.settings.name?' '+S.settings.name:'')+' '+(h<5||h>=21?'🌙':h<12?'☀️':h<17?'🌤️':'🌇');
  $('today-date').textContent=new Date().toLocaleDateString('he-IL',{weekday:'long',day:'numeric',month:'long'})+' · כל צעד נחשב';
  $('task-input').placeholder=G('מה {תרצה|תרצי} לעשות היום?');
  showQuote(0);
}

/* motivation lines: swipe, arrows or a tap move between them any time */
let qIx=null;
function showQuote(step){
  const pool=QUOTES.filter(q=>!q.f||S.settings.faith);
  if(qIx==null){let v=null;try{v=localStorage.getItem(KEY+'-quote')}catch(e){}qIx=v!=null&&Number.isFinite(+v)?+v:between('2026-01-01',T)}
  qIx=((qIx+step)%pool.length+pool.length)%pool.length;
  try{localStorage.setItem(KEY+'-quote',qIx)}catch(e){}
  const q=pool[qIx],box=$('quote').parentNode;
  const put=()=>{$('quote').textContent=G(q.t);$('quote-who').textContent=q.w||'';$('quote-who').hidden=!q.w;};
  if(!step||reduce){put();return}
  box.classList.add('fade');setTimeout(()=>{put();box.classList.remove('fade')},160);
}
$('q-next').onclick=e=>{e.stopPropagation();showQuote(1)};
$('q-prev').onclick=e=>{e.stopPropagation();showQuote(-1)};
$('quote-box').onclick=()=>showQuote(1);
(()=>{let x0=null;const el=$('quote-box');
  el.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
  el.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;
    if(Math.abs(dx)>40){showQuote(dx>0?1:-1);el.dataset.swiped='1';setTimeout(()=>delete el.dataset.swiped,300)}});
  el.addEventListener('click',e=>{if(el.dataset.swiped)e.stopImmediatePropagation()},true);
})();

/* ---------- TODAY ---------- */
let addDaily=false;
function renderEnergyPick(){$('energy-pick').innerHTML=`<button type="button" class="daily-tg" data-daily aria-pressed="${addDaily}">🔁 חוזר כל יום</button><span class="hint" style="align-self:center;margin:0">${G('את הקושי האפליקציה מדרגת לבד')}</span>`}
$('energy-pick').onclick=e=>{if(!e.target.closest('[data-daily]'))return;addDaily=!addDaily;renderEnergyPick()};
function addDailyTask(text,energy){const d={id:uid(),text:String(text).slice(0,120),energy:ENERGY[energy]?energy:guessEnergy(text),color:nextColor(),createdAt:Date.now()};(S.daily=S.daily||[]).push(d);
  today().push({id:uid(),text:d.text,energy:d.energy,done:false,color:d.color,dailyId:d.id});return d}

function taskHTML(t){
  const g=t.goalId&&goalOf(t.goalId);
  let tag='';
  if(g)tag=`<span class="tag">${g.emoji||'🎯'} צעד בדרך אל: ${esc(g.title)}</span>`;
  if(t.dailyId)tag+='<span class="tag">🔁 כל יום</span>';
  if(!t.done&&t.partial)tag+='<span class="tag">💪 התחלת, כל ניסיון נחשב</span>';
  else if(!t.done&&t.startedBefore)tag+='<span class="tag">🌱 כבר התחלת את זה פעם</span>';
  else if(!t.done&&t.carried===1&&!t.dailyId)tag+='<span class="tag">🔁 עבר איתך מאתמול</span>';
  const stuck=!t.done&&(t.carried||0)>=3;const longStuck=!t.done&&(t.carried||0)>=7&&!t.auto;
  const e=g?(g.emoji||emojiFor(t.text,t.color)):emojiFor(t.text,t.color);
  return `<li class="task${t.done?' done':''}${t.partial&&!t.done?' partial':''}" data-id="${t.id}"><div class="main"><span class="band" style="background:${JOYS[(t.color||0)%JOYS.length]}"></span>
    <button class="check" data-act="check" aria-pressed="${!!t.done}" aria-label="${t.done?'ביטול סימון':'סימון כבוצע'}: ${esc(t.text)}">${CHECK}</button>
    <span class="t">${esc(t.text)}${t.done?' <span class="e">✨</span>':''} <button type="button" class="lvl lvl-${t.energy||'mid'}" data-act="energy" aria-label="רמת קושי: ${ENERGY[t.energy||'mid'].n}. ללחוץ כדי לשנות">(${ENERGY[t.energy||'mid'].n})</button>${tag}</span>
    ${t.done?'':`<button class="halfbtn" data-act="half" aria-pressed="${!!t.partial}">${t.partial?'½ התחלתי':'התחלתי'}</button>`}
    <span class="emo" style="background:${JOYS[(t.color||0)%JOYS.length]}">${e}</span>
    <button class="del" data-act="del" aria-label="${t.auto?'להוריד מהיום':'מחיקה'}: ${esc(t.text)}">${X}</button></div>
    ${longStuck?`<div class="stuck"><span><span class="e">🍃</span> ${G('זה איתך כבר שבוע. אולי נשחרר את זה בשקט, ונחזור לזה כשיתאים?')}</span><span class="actions"><button class="btn small" data-act="letgo">לשחרר</button><button class="btn small ghost" data-act="keep">להשאיר</button></span></div>`
      :stuck?`<div class="stuck"><span><span class="e">🌧️</span> ${G('זה מחכה כבר כמה ימים. מה הכי מפריע?')}</span><button class="btn small" data-act="stuck">בואו נבדוק</button></div>`:''}</li>`;
}
let lastStage=-1;
function progressOf(L){const n=L.length;if(!n)return 0;return L.reduce((a,t)=>a+(t.done?1:t.partial?.5:0),0)/n}
function renderToday(){
  const L=today();const done=L.filter(t=>t.done).length,n=L.length,pct=progressOf(L);
  const stage=!n||pct===0?0:pct<.5?1:pct<1?2:3;
  if(stage!==lastStage){$('scene').innerHTML=scene(stage);if(lastStage===-1){const p=$('plant-g');p&&p.classList.remove('grow')}lastStage=stage}
  $('mascot').innerHTML=petIcon(S.settings.mascot);
  const hard=isHard();
  $('sum-big').textContent=G(hard?'היום מספיק משהו אחד קטן 💜':!n?'יום חדש מתחיל 🌤️':done===n?'{עשית|עשית} את כל מה {שתכננת|שתכננת} להיום 🌸':pct===0?'אפשר להתחיל מהדבר הכי קטן 🌱':'כבר {עשית|עשית} '+(done===1?'דבר אחד':done>1?done+' דברים':'התחלה')+' היום');
  const V=voice();$('sum-sub').textContent=G(hard?'מותר לנוח. אפילו לנשום זה בסדר.':!n?V.start:done===n?V.done:V.mid);
  $('sum-pill').textContent=n?`✨ ${done} מתוך ${n}`:'🌱 מוכנים להתחיל';
  // mood
  const m=S.moods[T];
  $('mood-label').textContent=G(m==null?'איך {אתה מרגיש|את מרגישה} היום?':'היום: '+MOODS[m][1]);
  $('moods').innerHTML=MOODS.map(([e,l],i)=>`<button data-mood="${i}" aria-pressed="${m===i}" aria-label="${l}">${e}</button>`).join('');
  // hard day
  $('hardbtn').setAttribute('aria-pressed',hard);
  $('hardbtn').innerHTML=hard?'<span class="e">💜</span> מצב יום קשה פעיל · לחזרה ליום רגיל':'<span class="e">😮‍💨</span> יום קשה? להוריד הכל למינימום';
  // banners
  let b='';
  if(between(S.lastSeenPrev,T)>=3&&!S.absenceShown)b+=`<div class="banner"><div class="row1"><span class="bico e">🤗</span><div><h3>חשבנו עליך${esc(nm())} 💛</h3><p class="sub">${G('טוב {שחזרת|שחזרת}. אין מה להשלים ואין מה להסביר. מתחילים מהיום, בקטן.')}</p></div><button class="del" data-act="absence-ok" aria-label="סגירה">${X}</button></div></div>`;
  if(hard)b+=`<div class="banner" style="background:var(--joy5);border-color:var(--joy5);color:var(--joy-ink)"><div class="row1"><span class="bico e">💜</span><div><h3>יום קשה זה בסדר</h3><p>${G('השארנו רק את הדברים הקלים. כל השאר מחכה ליום אחר, בלי שום לחץ.')}</p></div></div>
    <div class="actions"><button class="btn small" data-act="read-letter">💌 מכתב שכתבתי לעצמי</button><button class="btn small ghost" data-act="go-journal">📔 ההישגים שלי</button></div></div>`;
  if((m===0)||hard)b+=helpCard();
  if(S.carryNote&&S.carryNote.date===T)b+=`<div class="banner"><div class="row1"><span class="bico e">🌅</span><div><h3>זה בסדר, היום יום חדש</h3><p class="sub">${S.carryNote.n===1?'משימה אחת עברה':S.carryNote.n+' משימות עברו'} איתך מאתמול. אפשר לנסות שוב, בלי לחץ.</p></div><button class="del" data-act="carry-ok" aria-label="סגירה">${X}</button></div></div>`;
  Object.entries(S.askNext).forEach(([gid,sid])=>{const g=goalOf(gid);if(g&&stepOf(g,sid)&&!stepOf(g,sid).done)b+=nextCard(g,stepOf(g,sid))});
  const h=new Date().getHours();
  if(h>=S.settings.eveningHour&&!S.reviewed[T])b+=`<div class="banner"><div class="row1"><span class="bico e">🌙</span><div><h3>הערב מגיע</h3><p class="sub">${G('{רוצה|רוצה} לעצור רגע ולראות מה היה היום?')}</p></div></div><div class="actions"><button class="btn small" data-act="evening-open">לסקירת ערב</button><button class="btn small ghost" data-act="evening-later">לא עכשיו</button></div></div>`;
  if(S.seeded)b+=`<div class="note"><span>👀 אלה משימות ומטרות לדוגמה, כדי לראות איך זה נראה.</span><button class="linkbtn" data-act="clear-samples">ניקוי הדוגמאות</button></div>`;
  $('banners').innerHTML=b;
  // list, grouped by energy
  const shown=hard?L.filter(t=>t.energy==='light'||t.done):L;const waiting=hard?L.filter(t=>t.energy!=='light'&&!t.done):[];
  let html='';
  if(!n)html='';
  else html=`<ul class="list notebook">${shown.map(taskHTML).join('')}</ul>`;
  if(waiting.length)html+=`<div class="note"><span>🌙 ${waiting.length===1?'משימה אחת מחכה':waiting.length+' משימות מחכות'} ליום עם יותר כוח.</span></div>`;
  $('today-list').innerHTML=html;
  // after the list: suggestions
  $('after-list').innerHTML=afterList(L,done,n);
  $('evening-btn').hidden=!n;
}
function helpCard(){return `<div class="help"><b><span class="e">🫂</span> ${G('{רוצה|רוצה} לדבר עם מישהו?')}</b><span style="font-size:.9rem">${G('לפעמים עוזר לשתף. יש מי שמקשיב, בכל שעה, בלי לשפוט:')}</span>
  <div class="lines">${HELP.map(([n,v])=>`<span>${n}: <b dir="ltr">${v.includes('.')?`<a href="https://${v}" target="_blank" rel="noopener">${v}</a>`:`<a href="tel:${v.replace(/-/g,'')}">${v}</a>`}</b></span>`).join('')}</div></div>`}
function nextCard(g,s){
  return `<div class="banner" data-g="${g.id}"><div class="row1"><span class="bico e">${g.emoji||'🎯'}</span><div><h3>${G('{עשית|עשית} את הצעד של היום!')}</h3><p class="sub">"${esc(s.text)}" · ${G('{מרגיש מוכן|מרגישה מוכנה} לעבור לצעד הבא, או {שתרצה|שתרצי} עוד קצת זמן בצעד הזה?')}</p></div></div>
    <div class="actions"><button class="btn small" data-act="step-ready">🚀 ${G('{מוכן|מוכנה} לצעד הבא')}</button><button class="btn small ghost" data-act="step-more">🌱 עוד קצת בצעד הזה</button></div></div>`;
}
function afterList(L,done,n){
  const nexts=S.goals.filter(g=>!g.achievedAt).map(g=>{const s=curStep(g);if(!s)return null;
    const todays=L.filter(t=>t.goalId===g.id);if(todays.some(t=>!t.done))return null;
    const idx=g.steps.indexOf(s);const nx=todays.some(t=>t.stepId===s.id)?g.steps[idx+1]:s;return nx&&!L.some(t=>t.stepId===nx.id)?{g,s:nx}:null}).filter(Boolean);
  if(!n){
    if(nexts.length)return `<div class="suggest"><b>${G('הרשימה ריקה. {רוצה|רוצה} להתקדם קצת בדרך למטרות?')}</b>${nexts.map(x=>`<div class="next" style="background:var(--surface)" data-g="${x.g.id}"><span>${x.g.emoji||'🎯'} <b>${esc(x.s.text)}</b></span><button class="btn small ghost" data-act="add-next" data-s="${x.s.id}">להוסיף להיום</button></div>`).join('')}</div>`;
    return `<div class="empty">${POT}<span>${G('אין משימות היום, וזה בסדר גמור. אולי זה זמן למנוחה? משהו נחמד שאפשר לעשות:')}</span><div class="chiprow" style="justify-content:center">${NICE.map(x=>`<span class="chip">${x}</span>`).join('')}</div></div>`;
  }
  if(done===n&&nexts.length)return `<div class="suggest"><b>🌸 ${G('{סיימת|סיימת} הכל! {רוצה|רוצה} להתקדם עוד קצת?')}</b>${nexts.map(x=>`<div class="next" style="background:var(--surface)" data-g="${x.g.id}"><span>${x.g.emoji||'🎯'} הבא בתור: <b>${esc(x.s.text)}</b></span><button class="btn small ghost" data-act="add-next" data-s="${x.s.id}">להוסיף</button></div>`).join('')}<span style="font-size:.85rem;color:var(--muted)">${G('ואם לא, מגיע לך לנוח 💛')}</span></div>`;
  return '';
}
$('add-task').onsubmit=e=>{e.preventDefault();const v=$('task-input').value.trim();if(!v)return;
  const addEnergy=guessEnergy(v);
  if(addDaily){addDailyTask(v,addEnergy);addDaily=false;renderEnergyPick();toast(G('🔁 נוסף. המשימה תחכה לך כל יום מחדש.'))}
  else{today().push({id:uid(),text:v,energy:addEnergy,done:false,color:nextColor()});toast(ENERGY[addEnergy].e+' נוסף · '+ENERGY[addEnergy].n+' (אפשר ללחוץ כדי לשנות)')}
  $('task-input').value='';save();renderAll()};
$('moods').onclick=e=>{const b=e.target.closest('[data-mood]');if(!b)return;const i=+b.dataset.mood;S.moods[T]=i;save();renderAll();
  toast(i===0?'💜 תודה {ששיתפת|ששיתפת}. אפשר ללכת לאט היום.':i===1?'🤍 קיבלנו. נלך בעדינות היום.':i===2?'🙂 בסדר זה גם טוב':i===3?'😊 איזה כיף לשמוע':'😄 יש! תהנה מהיום')};

/* ---------- GOALS ---------- */
const open=new Set();
function renderGoals(){
  const box=$('goals');
  if(!S.goals.length){box.innerHTML=`<div class="empty">${MOUNTAIN}<span>עוד אין מטרות. מטרה יכולה להיות גדולה או קטנה, ונפרק אותה יחד לצעדים 🪜</span></div>`;return}
  box.innerHTML=S.goals.map(g=>{
    const total=g.steps.length,got=g.steps.filter(s=>s.done).length;
    const pct=total?Math.round(got/total*100):0;const cur=curStep(g);
    const inToday=cur&&today().some(t=>t.stepId===cur.id);
    let when='🐢 בקצב שלי';if(g.deadline){const dl=between(T,g.deadline);when='📅 עד '+fmtDate(g.deadline)+(dl>1?' · עוד '+dl+' ימים':dl===1?' · מחר':dl===0?' · היום':'')}
    const isOpen=open.has(g.id);
    return `<article class="goal" data-g="${g.id}">
      <div class="goal-head"><span class="avatar" style="background:${JOYS[(g.color||0)%JOYS.length]}">${g.emoji||emojiFor(g.title)}</span><div class="g"><h3>${esc(g.title)}</h3></div>
      <button class="del gedit" data-act="editgoal" aria-label="עריכת המטרה">✏️</button><button class="del" data-act="delgoal" aria-label="מחיקת המטרה">${X}</button></div>
      ${g.why?`<div class="why-big"><span class="e">💛</span> <b>למה זה חשוב לי:</b> ${esc(g.why)}</div>`:''}
      <div class="chips"><span class="chip">${when}</span><span class="chip">🪜 ${got} מתוך ${total} צעדים</span>${g.auto!==false?'<span class="chip">☀️ צעד כל יום</span>':''}${g.letter?'<span class="chip">💌 מחכה מכתב</span>':''}${g.achievedAt?'<span class="chip joy">🏆 הושגה</span>':''}</div>
      <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="התקדמות"><span style="width:${pct}%"></span></div>
      ${cur?`<div class="next"><span>👣 עכשיו: <b>${esc(cur.text)}</b>${(cur.doneDays||[]).length?` · ${G('{עשית|עשית}')} ${(cur.doneDays||[]).length} פעמים`:''}</span>
        ${inToday?'<span class="chip">ברשימה של היום</span>':`<button class="btn small ghost" data-act="totoday">להוסיף להיום</button>`}
        ${(cur.doneDays||[]).length?`<button class="btn small ghost" data-act="step-ready">${G('🚀 {מוכן|מוכנה} לצעד הבא')}</button>`:''}</div>`
        :(g.steps.length?`<div class="next">${G('🏆 כל הצעדים הושלמו. {עצור|עצרי} רגע להרגיש את זה.')}</div>`:'')}
      <div class="actions"><button class="toggle" data-act="toggle" aria-expanded="${isOpen}">${isOpen?'הסתרת הצעדים':'כל הצעדים ('+g.steps.length+')'}</button></div>
      ${isOpen?`<ul class="steps">${g.steps.map(s=>`<li class="step${s.done?' done':''}${s===cur?' current':''}" data-s="${s.id}"><span class="band"></span>
        <button class="check" data-act="step" aria-pressed="${!!s.done}" aria-label="סימון צעד: ${esc(s.text)}">${CHECK}</button>
        <span class="t"><span class="lbl">${s===cur?'👣 הצעד הנוכחי':s.done?'✓ הושלם':'בהמשך'}${(s.doneDays||[]).length?' · '+(s.doneDays||[]).length+' פעמים':''}</span>${esc(s.text)}</span>
        <button class="del" data-act="delstep" aria-label="מחיקת הצעד">${X}</button></li>`).join('')}</ul>
        <form class="add" data-act="addstep"><input id="step-${g.id}" placeholder="צעד קטן נוסף" aria-label="צעד חדש" autocomplete="off"><button class="btn small" type="submit">הוספה</button></form>`:''}
    </article>`}).join('');
}
$('goals').addEventListener('submit',e=>{e.preventDefault();const g=goalOf(e.target.closest('.goal').dataset.g);
  const v=e.target.querySelector('input').value.trim();if(!v)return;g.steps.push({id:uid(),text:v,doneDays:[],done:false});g.achievedAt=null;save();renderAll();
  const ni=$('step-'+g.id);ni&&ni.focus()});

/* goal form */
let dated=false,draft=[],gEmoji='',gEmojiTouched=false;
function renderTemplates(){$('g-templates').innerHTML=TEMPLATES.map((t,i)=>`<button type="button" class="chipbtn" data-tpl="${i}">${t.e} ${t.t}</button>`).join('')}
$('g-templates').onclick=e=>{const b=e.target.closest('[data-tpl]');if(!b)return;const t=TEMPLATES[+b.dataset.tpl];
  $('g-title').value=t.t;if(!$('g-why').value)$('g-why').value=t.why;gEmoji=t.e;gEmojiTouched=true;renderEmojis();draft=t.s.map((text,i)=>({label:'צעד '+(i+1),text}));renderDraft();
  $('g-msg').textContent='💡 הנה צעדים מוצעים. אפשר לערוך, להוסיף או להסיר.';$('g-msg').hidden=false};
let gEmAll=false;
function renderEmojis(){$('g-emojis').innerHTML=emojiPickerHTML(gEmoji,$('g-title').value,gEmAll)}
$('g-emojis').onclick=e=>{if(e.target.closest('[data-emall]')){gEmAll=true;renderEmojis();return}const b=e.target.closest('[data-em]');if(!b)return;gEmoji=b.dataset.em;gEmojiTouched=true;renderEmojis()};
$('g-title').addEventListener('input',()=>{if(!gEmojiTouched)gEmoji=suggestEmoji($('g-title').value);renderEmojis()});
function setDated(v){dated=v;$('g-free').setAttribute('aria-pressed',!v);$('g-dated').setAttribute('aria-pressed',v);$('g-date-wrap').hidden=!v}
$('g-free').onclick=()=>setDated(false);$('g-dated').onclick=()=>setDated(true);
function renderDraft(){
  $('g-draft').innerHTML=draft.map((s,i)=>`<div class="dstep" data-i="${i}"><div class="r"><span style="font-size:.85rem;color:var(--muted);flex:none">${i+1}.</span>
    <input class="t-in" style="flex:1;width:auto" data-f="text" value="${esc(s.text)}" aria-label="תיאור הצעד" placeholder="מה עושים בצעד הזה">
    <button type="button" class="del" data-rm="${i}" aria-label="הסרת הצעד">${X}</button></div></div>`).join('');
}
$('g-draft').addEventListener('input',e=>{const i=+e.target.closest('.dstep').dataset.i,f=e.target.dataset.f;if(!f)return;draft[i][f]=e.target.value});
$('g-draft').addEventListener('click',e=>{const b=e.target.closest('[data-rm]');if(!b)return;draft.splice(+b.dataset.rm,1);renderDraft()});
$('g-addstep').onclick=()=>{draft.push({label:'',text:''});renderDraft();const ins=$('g-draft').querySelectorAll('.t-in');ins[ins.length-1].focus()};
// auto: the coach suggests steps by itself once the title is written (only when AI is reachable and no steps were written yet)
let breaking=false,autoFor='',autoTimer=0;
async function breakGoal(auto){
  const title=$('g-title').value.trim();if(!title){if(!auto){$('g-title').focus();toast('✏️ {כתוב|כתבי} קודם מה המטרה')}return}
  if(breaking)return;breaking=true;
  const days=dated&&$('g-date').value?Math.max(1,between(T,$('g-date').value)):0;
  $('g-break').disabled=true;$('g-msg').hidden=true;
  let next=null,msg;
  if(aiOn()){$('g-thinking').textContent=auto?'✨ המאמן כבר חושב על צעדים בשבילך...':'מפרק את המטרה לצעדים קטנים...';$('g-thinking').hidden=false;
    try{next=await askSteps(title,$('g-why').value.trim(),days);msg=G('✨ המאמן הציע צעדים. אפשר לערוך, להוסיף או להסיר, ומה שלא מתאים {פשוט תמחק|פשוט תמחקי}.')}
    catch(e){if(!auto){next=localBreakdown(title);msg='💡 הנה הצעה לצעדים. אפשר לערוך כל אחד מהם.'}}
    $('g-thinking').hidden=true}
  else{next=localBreakdown(title);msg='💡 הנה הצעה לצעדים. אפשר לערוך, להוסיף או להסיר.'}
  breaking=false;$('g-break').disabled=false;
  if(!next||$('goal-form').hidden||(auto&&draft.some(s=>s.text.trim())))return;
  draft=next;$('g-msg').textContent=msg;$('g-msg').hidden=false;$('g-break').textContent='🔄 לפרק מחדש';renderDraft();
}
$('g-break').onclick=()=>breakGoal(false);
function autoBreak(){clearTimeout(autoTimer);const t=$('g-title').value.trim();
  if(t.length<3||t===autoFor||draft.some(s=>s.text.trim())||!coachOn())return;
  autoTimer=setTimeout(()=>{if($('g-title').value.trim()!==t||draft.some(s=>s.text.trim()))return;autoFor=t;breakGoal(true)},1800)}
$('g-title').addEventListener('input',autoBreak);
$('g-title').addEventListener('blur',()=>{clearTimeout(autoTimer);const t=$('g-title').value.trim();if(t.length>=3&&t!==autoFor&&!draft.some(s=>s.text.trim())&&coachOn()){autoFor=t;breakGoal(true)}});
function openGoalForm(tplIndex){showTab('goals');$('goal-form').hidden=false;$('new-goal-btn').hidden=true;gEmoji='🌱';gEmojiTouched=false;gEmAll=false;renderEmojis();renderTemplates();
  $('g-letter').placeholder=G('מה {תרצה|תרצי} להגיד לעצמך באותו יום?');$('g-why').placeholder=G('מה ישתנה {כשתגיע|כשתגיעי} לשם?');
  if(tplIndex!=null)$('g-templates').querySelector(`[data-tpl="${tplIndex}"]`).click();else $('g-title').focus()}
$('new-goal-btn').onclick=()=>openGoalForm();
function closeForm(){clearTimeout(autoTimer);autoFor='';$('goal-form').reset();setDated(false);draft=[];renderDraft();$('g-msg').hidden=true;$('g-break').textContent='✨ לפרק לי את המטרה לצעדים';$('goal-form').hidden=true;$('new-goal-btn').hidden=false}
$('g-cancel').onclick=closeForm;
$('goal-form').onsubmit=e=>{e.preventDefault();const title=$('g-title').value.trim();if(!title)return;
  let steps=draft.filter(s=>s.text.trim());if(!steps.length)steps=localBreakdown(title);
  const g={id:uid(),emoji:gEmoji||'🌱',color:nextColor(),title,why:$('g-why').value.trim(),letter:$('g-letter').value.trim(),deadline:dated?$('g-date').value:'',auto:$('g-auto').checked,createdAt:Date.now(),
    steps:steps.map(s=>({id:uid(),text:s.text.trim(),doneDays:[],done:false}))};
  S.goals.unshift(g);open.add(g.id);inject();save();closeForm();renderAll();
  toast(g.auto?'🌱 המטרה נשמרה. הצעד הראשון כבר מחכה ברשימה של היום.':'🌱 המטרה נשמרה. מתחילים מהצעד הראשון.')};

/* a task that comes back every day: remove it only today, or stop it */
function openDailyDel(t){
  openSheet(sheetHead('🔁 משימה של כל יום')+`<p>"${esc(t.text)}"</p><div style="display:flex;flex-direction:column;gap:8px">
    <button class="btn" id="dd-today">🍃 רק להיום</button><button class="btn ghost" id="dd-stop">✋ להפסיק שזה יחזור כל יום</button></div>`);
  $('dd-today').onclick=()=>{closeSheet();const L=today(),i=L.indexOf(t);if(i<0)return;L.splice(i,1);tomb(t.id);(S.injectSkip[T]=S.injectSkip[T]||[]).push(t.dailyId);save();renderAll();
    toast('🍃 הורדנו רק מהיום. מחר זה יחזור.',()=>{untomb(t.id);L.splice(i,0,t);S.injectSkip[T]=S.injectSkip[T].filter(x=>x!==t.dailyId);save();renderAll()})};
  $('dd-stop').onclick=()=>{closeSheet();const di=(S.daily||[]).findIndex(d=>d.id===t.dailyId),d=S.daily[di];if(d){S.daily.splice(di,1);tomb(d.id)}
    const L=today(),i=L.indexOf(t),gone=i>=0&&!t.done;if(gone){L.splice(i,1);tomb(t.id)}else delete t.dailyId;save();renderAll();
    toast('המשימה לא תחזור יותר',()=>{if(d){untomb(d.id);S.daily.splice(di,0,d);t.dailyId=d.id}if(gone){untomb(t.id);L.splice(i,0,t)}save();renderAll()})};
}

/* edit an existing goal: name, symbol, why, date, daily step, letter and the steps themselves */
function openGoalEdit(g){
  let em=g.emoji||'🌱';const steps=g.steps.map(x=>({id:x.id,text:x.text,done:x.done}));
  const stepsHtml=()=>steps.map((x,i)=>`<div class="dstep" data-i="${i}"><div class="r"><span style="font-size:.85rem;color:var(--muted);flex:none">${x.done?'✓':(i+1)+'.'}</span>
    <input class="t-in" style="flex:1;width:auto" value="${esc(x.text)}" aria-label="תיאור הצעד" placeholder="מה עושים בצעד הזה">
    <button type="button" class="del" data-up="${i}" aria-label="להזיז למעלה" ${i?'':'disabled'}>▲</button>
    <button type="button" class="del" data-rm="${i}" aria-label="הסרת הצעד">${X}</button></div></div>`).join('');
  openSheet(sheetHead('✏️ עריכת המטרה')+`<form id="ge-form" class="form" style="box-shadow:none;padding:0">
    <label>מה המטרה<input id="ge-title" value="${esc(g.title)}" required autocomplete="off"></label>
    <div class="fl" id="ge-emojis" role="group" aria-label="סמל למטרה"></div>
    <label>למה זה חשוב לי (רשות)<input id="ge-why" value="${esc(g.why||'')}" autocomplete="off"></label>
    <label>תאריך יעד (אפשר להשאיר ריק)<input type="date" id="ge-date" value="${g.deadline||''}"></label>
    <b style="margin-top:6px">🪜 הצעדים</b><div class="draft" id="ge-steps">${stepsHtml()}</div>
    <button type="button" class="linkbtn" id="ge-add" style="align-self:flex-start">+ הוספת צעד</button>
    <label><span>💌 מכתב לעצמי ליום שאגיע (רשות)</span><textarea id="ge-letter">${esc(g.letter||'')}</textarea></label>
    <label class="check-row"><input type="checkbox" id="ge-auto" ${g.auto!==false?'checked':''}>לשבץ לי כל יום צעד אחד ברשימה של היום</label>
    <div class="row" style="display:flex;gap:8px;margin-top:8px"><button class="btn" type="submit" style="flex:1">שמירה</button><button class="btn ghost" type="button" data-act="sheet-close">ביטול</button></div></form>`);
  let all=false;const drawEm=()=>{$('ge-emojis').innerHTML=emojiPickerHTML(em,$('ge-title').value,all)};drawEm();
  $('ge-title').addEventListener('input',drawEm);
  $('ge-emojis').onclick=e=>{if(e.target.closest('[data-emall]')){all=true;drawEm();return}const b=e.target.closest('[data-em]');if(b){em=b.dataset.em;drawEm()}};
  const box=$('ge-steps'),redraw=()=>{box.innerHTML=stepsHtml()};
  box.oninput=e=>{const r=e.target.closest('[data-i]');if(r)steps[+r.dataset.i].text=e.target.value};
  box.onclick=e=>{const up=e.target.closest('[data-up]'),rm=e.target.closest('[data-rm]');
    if(up){const i=+up.dataset.up;if(i){[steps[i-1],steps[i]]=[steps[i],steps[i-1]];redraw()}}
    if(rm){steps.splice(+rm.dataset.rm,1);redraw()}};
  $('ge-add').onclick=()=>{steps.push({id:null,text:'',done:false});redraw();const ins=box.querySelectorAll('.t-in');ins[ins.length-1].focus()};
  $('ge-form').onsubmit=e=>{e.preventDefault();const title=$('ge-title').value.trim();if(!title)return;
    const old=new Map(g.steps.map(x=>[x.id,x]));
    g.steps=steps.filter(x=>x.text.trim()).map(x=>{const o=x.id&&old.get(x.id);if(o){o.text=x.text.trim();return o}return {id:uid(),text:x.text.trim(),doneDays:[],done:false}});
    const keep=new Set(g.steps.map(x=>x.id));
    Object.values(S.tasks).forEach(L=>L.forEach(t=>{if(t.goalId===g.id&&t.stepId&&keep.has(t.stepId)&&!t.done)t.text=stepOf(g,t.stepId).text}));
    Object.assign(g,{title,emoji:em,why:$('ge-why').value.trim(),deadline:$('ge-date').value||'',letter:$('ge-letter').value.trim(),auto:$('ge-auto').checked});
    if(g.steps.length&&g.steps.every(x=>x.done)){if(!g.achievedAt)g.achievedAt=Date.now()}else g.achievedAt=null;
    save();closeSheet();renderAll();toast('✏️ המטרה עודכנה')};
}

/* ---------- PROGRESS + JOURNAL ---------- */
let jf='all';
const JTYPES={all:'הכל',win:'🏆 הישגים',done:'✅ מה עשיתי',good:'🌼 דברים טובים',thanks:'🙏 תודה',letter:'💌 מכתבים לעצמי'};
function goodDay(k){return (S.tasks[k]||[]).some(t=>t.done||t.partial)||S.journal.some(j=>j.date===k&&(j.type==='good'||j.type==='thanks'))}
function renderProgress(){
  const dayNames=['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];let week=0,prev=0,html='';
  for(let i=6;i>=0;i--){const k=addDays(T,-i);const c=(S.tasks[k]||[]).filter(t=>t.done).length;week+=c;const m=S.moods[k];
    html+=`<div class="day${c?' has':''}${i===0?' today':''}"><span class="dot">${m!=null?MOODS[m][0]:c?(c>=3?'🌻':'🌼'):'·'}</span><span class="cnt">${c||''}</span>${i===0?'היום':dayNames[kdate(k).getDay()]}</div>`}
  for(let i=13;i>=7;i--)prev+=(S.tasks[addDays(T,-i)]||[]).filter(t=>t.done).length;
  $('week').innerHTML=html;
  $('st-week').textContent=week;
  $('st-steps').textContent=S.goals.reduce((a,g)=>a+g.steps.reduce((b,s)=>b+(s.doneDays||[]).length,0),0);
  const days=new Set(Object.keys(S.tasks).filter(goodDay));$('st-days').textContent=days.size;
  $('st-goals').textContent=S.goals.filter(g=>g.achievedAt).length;
  $('better').hidden=!(prev>0&&week>prev);
  if(week>prev&&prev>0)$('better').innerHTML=`<div class="suggest"><b>📈 ${G('השבוע {עשית|עשית}')} ${week-prev} דברים יותר מהשבוע שעבר. איזה יופי!</b></div>`;
  $('jfilter').innerHTML=Object.entries(JTYPES).map(([k,v])=>`<button class="chipbtn" data-jf="${k}" aria-pressed="${k===jf}">${v}</button>`).join('');
  const items=[];
  if(jf==='all'||jf==='done')Object.values(S.tasks).forEach(L=>L.forEach(t=>t.done&&items.push({type:'done',text:t.text,at:t.doneAt||0,e:(t.goalId&&goalOf(t.goalId)&&goalOf(t.goalId).emoji)||emojiFor(t.text,t.color),color:t.color})));
  S.journal.forEach(j=>{if(jf==='all'||jf===j.type)items.push({type:j.type,text:j.text,at:j.at,id:j.id})});
  items.sort((a,b)=>b.at-a.at);
  const rel=at=>{const d=between(dkey(new Date(at)),T);return d<=0?'היום':d===1?'אתמול':'לפני '+d+' ימים'};
  const te={win:'🏆',good:'🌼',thanks:'🙏',letter:'💌',feel:'💭'};
  $('wins').innerHTML=items.length?items.slice(0,30).map(w=>w.type==='done'
    ?`<li style="flex-direction:row;align-items:center"><span class="emo" style="background:${JOYS[(w.color||0)%JOYS.length]};width:34px;height:34px;font-size:1.1rem">${w.e}</span><span class="wt">${esc(w.text)}</span><span class="when">${rel(w.at)}</span></li>`
    :`<li><div class="jh"><span>${te[w.type]||'✨'} ${JTYPES[w.type]?JTYPES[w.type].replace(/^\S+ /,''):''}</span><span>${rel(w.at)}</span></div><span class="wt" style="white-space:pre-wrap">${esc(w.text)}</span></li>`).join('')
    :`<li class="empty">${POT}<span>${G('כל דבר {שתעשה|שתעשי}, וכל דבר טוב {שתכתוב|שתכתבי} בערב, יחכה לך כאן לימים שצריך תזכורת.')}</span></li>`;
}
$('jfilter').onclick=e=>{const b=e.target.closest('[data-jf]');if(!b)return;jf=b.dataset.jf;renderProgress()};

/* ---------- sheets ---------- */
let sheetClose=null;
function openSheet(html,onClose){$('sheet').innerHTML='<div class="grab"></div>'+html;$('sheet').hidden=false;$('sheet-bg').hidden=false;sheetClose=onClose||null;$('sheet').scrollTop=0}
function closeSheet(){$('sheet').hidden=true;$('sheet-bg').hidden=true;$('sheet').innerHTML='';const c=sheetClose;sheetClose=null;c&&c()}
$('sheet-bg').onclick=()=>{if(!$('sheet').dataset.lock)closeSheet()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('sheet').hidden&&!$('sheet').dataset.lock)closeSheet()});
const sheetHead=t=>`<div class="head"><h2 id="sheet-title">${t}</h2><button class="del" data-act="sheet-close" aria-label="סגירה">${X}</button></div>`;

/* onboarding wizard: 3 steps, skippable */
function openWizard(){
  let step=0;const st={name:S.settings.name||'',address:S.settings.address||'m',mascot:S.settings.mascot||'leafy',faith:!!S.settings.faith,voice:S.settings.voice||'gentle'};
  $('sheet').dataset.lock='1';
  const draw=()=>{
    const dots=`<div class="dots">${[0,1,2,3].map(i=>`<span class="${i===step?'on':''}"></span>`).join('')}</div>`;
    let body='';
    if(step===0)body=`<div class="big-e">🌱</div><h2 id="sheet-title" style="text-align:center">ברוכים הבאים לצעד קטן</h2><p style="text-align:center;color:var(--muted)">כל צעד נחשב. בואו נכיר רגע.</p>
      <label class="fieldcol" for="wz-name">איך קוראים לך? (רשות)<input id="wz-name" value="${esc(st.name)}" autocomplete="given-name"></label>
      <div class="fieldcol">איך לפנות אליך?<div class="pick"><button data-addr="m" aria-pressed="${st.address==='m'}"><span class="e">🙋‍♂️</span>אתה</button><button data-addr="f" aria-pressed="${st.address==='f'}"><span class="e">🙋‍♀️</span>את</button></div></div>`;
    else if(step===1)body=`<div class="big-e pet-big">${petIcon(st.mascot)}</div><h2 id="sheet-title" style="text-align:center">מי ילווה אותך?</h2><p style="text-align:center;color:var(--muted)">אפשר להחליף בכל רגע בהגדרות.</p>
      ${petPickHTML(st.mascot)}
      <div class="setrow"><span>🕯️ לשלב גם משפטים מהמקורות</span><button class="switch" role="switch" aria-checked="${st.faith}" id="wz-faith" aria-label="משפטים מהמקורות"></button></div>`;
    else if(step===2)body=`<div class="big-e">💬</div><h2 id="sheet-title" style="text-align:center">${st.address==='f'?'איך תרצי שאדבר אלייך?':'איך תרצה שאדבר אליך?'}</h2><p style="text-align:center;color:var(--muted)">אפשר להחליף בכל רגע בהגדרות.</p>${voicePickHTML(st.voice)}`;
    else body=`<div class="big-e">🎯</div><h2 id="sheet-title" style="text-align:center">${st.address==='f'?'לאן היית רוצה להתקדם?':'לאן היית רוצה להתקדם?'}</h2><p style="text-align:center;color:var(--muted)">${st.address==='f'?'בחרי מטרה ראשונה, ונפרק אותה יחד לצעדים קטנים. או דלגי, ותתחילי רק עם רשימה להיום.':'בחר מטרה ראשונה, ונפרק אותה יחד לצעדים קטנים. או דלג, ותתחיל רק עם רשימה להיום.'}</p>
      <div class="chiprow" style="justify-content:center">${TEMPLATES.map((t,i)=>`<button class="chipbtn" data-wtpl="${i}">${t.e} ${t.t}</button>`).join('')}<button class="chipbtn" data-wtpl="own">✏️ מטרה משלי</button></div>`;
    openSheet(`<div class="wiz">${dots}${body}<div class="actions" style="justify-content:space-between"><button class="btn ghost small" id="wz-skip">דילוג</button><button class="btn" id="wz-next" style="flex:1">${step<3?'הבא':'להתחיל בלי מטרה'}</button></div></div>`);
    const s=$('sheet');
    s.querySelectorAll('[data-addr]').forEach(b=>b.onclick=()=>{st.address=b.dataset.addr;st.name=$('wz-name').value;draw()});
    s.querySelectorAll('[data-masc]').forEach(b=>b.onclick=()=>{st.mascot=b.dataset.masc;draw()});
    s.querySelectorAll('[data-voice]').forEach(b=>b.onclick=()=>{st.voice=b.dataset.voice;s.querySelectorAll('[data-voice]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
    if($('wz-faith'))$('wz-faith').onclick=()=>{st.faith=!st.faith;$('wz-faith').setAttribute('aria-checked',st.faith)};
    s.querySelectorAll('[data-wtpl]').forEach(b=>b.onclick=()=>finish(b.dataset.wtpl));
    $('wz-skip').onclick=()=>finish(null);
    $('wz-next').onclick=()=>{if(step===0)st.name=$('wz-name').value.trim();if(step<3){step++;draw()}else finish(null)};
  };
  const finish=tpl=>{if($('wz-name'))st.name=$('wz-name').value.trim();
    Object.assign(S.settings,{name:st.name,address:st.address,mascot:st.mascot,faith:st.faith,voice:st.voice});S.onboarded=true;S.seenNew=WHATS_NEW.v;save();
    delete $('sheet').dataset.lock;closeSheet();lastStage=-1;renderAll();
    if(tpl==='own')openGoalForm();else if(tpl!=null)openGoalForm(+tpl);
    else toast('🌱 '+G('יאללה, מתחילים')+(st.name?' '+st.name:'')+'!')};
  draw();
}

/* ready for the next step → pulse check (faces + words) → next */
function openPulse(g){
  const s=curStep(g);if(!s)return;let face=null;
  const draw=()=>{openSheet(sheetHead('💓 בדיקת דופק')+`<p>${G('{סיימת|סיימת} את הצעד')} "<b>${esc(s.text)}</b>". ${G('לפני שממשיכים: איך {אתה מרגיש|את מרגישה} עם המטרה')} "${esc(g.title)}"?</p>
    ${g.why?`<div class="why-big"><span class="e">💛</span> <b>למה זה חשוב לך:</b> ${esc(g.why)}</div>`:''}
    <div class="pick"><button data-face="hard" aria-pressed="${face==='hard'}"><span class="e">😔</span>קשה לי</button><button data-face="ok" aria-pressed="${face==='ok'}"><span class="e">🙂</span>בסדר, הולך</button><button data-face="great" aria-pressed="${face==='great'}"><span class="e">😄</span>${G('{מרגיש|מרגישה} שיפור')}</button></div>
    <label class="fieldcol" for="pulse-note">רוצה להוסיף כמה מילים? (רשות)<textarea id="pulse-note" placeholder="מה עזר? מה היה קשה?"></textarea></label>
    <div id="pulse-plan"></div>
    <button class="btn wide" id="pulse-go" ${face?'':'disabled'}>🚀 לצעד הבא</button>`);
    $('sheet').querySelectorAll('[data-face]').forEach(b=>b.onclick=()=>{face=b.dataset.face;const note=$('pulse-note').value;draw();$('pulse-note').value=note;plan()});
    $('pulse-go').onclick=go;plan()};
  const plan=()=>{const box=$('pulse-plan');if(!box||!face)return;
    if(face==='hard'){
      box.innerHTML=`<div class="banner"><p>${G('זה בסדר שקשה 💜. אין שום מקום למהר.')}</p><div class="actions">
        <button class="btn small ghost" id="pp-stay">🌱 להישאר עוד קצת בצעד הזה</button>
        ${g.deadline?`<button class="btn small ghost" id="pp-extend">🐢 להאריך את היעד בשבועיים</button>`:''}</div></div>`;
      $('pp-stay').onclick=()=>{addJournal('feel','בדיקת דופק ב"'+g.title+'": קשה לי. '+($('pulse-note').value||''));delete S.askNext[g.id];save();closeSheet();renderAll();toast('🌱 נשארים כאן, בקצב שלך')};
      if($('pp-extend'))$('pp-extend').onclick=()=>{const nd=addDays(g.deadline,14);g.deadline=nd;save();$('pp-extend').outerHTML=`<span class="chip">📅 עודכן: עד ${fmtDate(nd)}</span>`};
    }else if(face==='great'&&g.deadline){box.innerHTML=`<p style="color:var(--muted);font-size:.9rem">${G('איזה כיף! אם {בא לך|בא לך}, אפשר כבר היום להוסיף גם את הצעד הבא.')}</p>`}
    else box.innerHTML='';
  };
  const go=()=>{const note=$('pulse-note').value.trim();
    addJournal('feel','בדיקת דופק ב"'+g.title+'": '+(face==='hard'?'קשה לי':face==='ok'?'בסדר, הולך':G('{מרגיש|מרגישה} שיפור'))+(note?'. '+note:''));
    const won=completeStep(g,s);save();closeSheet();renderAll();
    if(won)openAchieved(g);else{const nx=curStep(g);celebrate($('banners'),'🚀 '+G('עוברים לצעד הבא')+': '+(nx?nx.text:''))}};
  draw();
}
function openAchieved(g){
  celebrate(document.querySelector('.garden'),'🏆 '+G('{הגעת|הגעת}')+' למטרה!',true);
  openSheet(sheetHead('🏆 הגעת למטרה!')+`<div class="big-e" style="font-size:3.6rem;text-align:center" class="e">🌸</div>
    <h2 style="text-align:center">${esc(g.title)}</h2><p style="text-align:center">${G('{עשית|עשית} את זה'+nm()+'. צעד אחרי צעד, בקצב שלך. זה רגע לעצור ולהרגיש גאווה.')}</p>
    ${g.letter?`<h3>💌 מכתב ממך, מהיום שהתחלת:</h3><div class="letter">${esc(g.letter)}</div>`:''}
    <h3>${G('מה הלאה? {רוצה|רוצה} מטרה חדשה?')}</h3>
    <div class="chiprow">${TEMPLATES.filter(t=>t.t!==g.title).map(t=>`<button class="chipbtn" data-ach="${TEMPLATES.indexOf(t)}">${t.e} ${t.t}</button>`).join('')}<button class="chipbtn" data-ach="own">✏️ מטרה משלי</button></div>
    <button class="btn ghost wide" data-act="sheet-close">קודם לחגוג 🎉</button>`);
  $('sheet').querySelectorAll('[data-ach]').forEach(b=>b.onclick=()=>{closeSheet();b.dataset.ach==='own'?openGoalForm():openGoalForm(+b.dataset.ach)});
}

/* stuck: ask gently what's in the way */
function openStuck(t){
  openSheet(sheetHead('🌧️ מה הכי מפריע?')+`<p>${G('"'+esc(t.text)+'" מחכה כבר כמה ימים. זה קורה לכולם. מה הכי קרוב למה {שאתה מרגיש|שאת מרגישה}?')}</p>
    <div class="pick">
      <button data-why="big"><span class="e">🏔️</span>זה גדול מדי</button>
      <button data-why="start"><span class="e">🧭</span>לא ברור איך להתחיל</button>
      <button data-why="energy"><span class="e">🔋</span>אין לי כוח לזה עכשיו</button>
      <button data-why="other"><span class="e">🤷</span>פשוט לא הסתדר</button></div>`);
  $('sheet').querySelectorAll('[data-why]').forEach(b=>b.onclick=()=>{const w=b.dataset.why;
    if(w==='big'||w==='start')openSmaller(t);
    else if(w==='energy'){t.energy='light';t.carried=0;save();closeSheet();renderAll();toast('🪶 '+G('סימנו את זה כקל. אפשר גם רק להתחיל, ולסמן "התחלתי"'))}
    else{t.carried=0;save();closeSheet();renderAll();toast(G('💪 קדימה, {אתה יכול|את יכולה}. אל {תוותר|תוותרי} לעצמך'))}});
}
function openSmaller(t){
  let items=null;
  const draw=()=>{openSheet(sheetHead('✂️ נעשה את זה קטן יותר')+
    `<p style="text-align:center">${G('קדימה, {אתה יכול|את יכולה}. אל {תוותר|תוותרי} לעצמך. לפעמים הצעד פשוט גדול מדי, וזה לא אומר כלום עליך.')}</p>
    <p style="color:var(--muted);font-size:.9rem">במקום: "${esc(t.text)}"</p>
    ${items?`<div class="draft">${items.map((s,i)=>`<div class="dstep"><input class="t-in" data-i="${i}" value="${esc(s)}" aria-label="צעד קטן ${i+1}"></div>`).join('')}</div>
      <button class="btn wide" id="sm-apply">🌱 להחליף בצעדים האלה</button>`:'<div class="thinking">מחפש צעדים קטנים יותר...</div>'}
    <button class="btn ghost wide" data-act="sheet-close">לא עכשיו</button>`);
    if(items){$('sheet').querySelectorAll('[data-i]').forEach(inp=>inp.oninput=()=>items[+inp.dataset.i]=inp.value);
      $('sm-apply').onclick=()=>applySmaller(t,items.map(s=>s.trim()).filter(Boolean))}};
  draw();
  (aiOn()?askSmaller(t.text):Promise.reject()).then(r=>{items=r}).catch(()=>{items=localSmaller(t.text)}).then(()=>{if(!$('sheet').hidden)draw()});
}
function applySmaller(t,list){
  if(!list.length)return;const L=today();const i=L.indexOf(t);
  if(t.auto){const g=goalOf(t.goalId);const si=g.steps.findIndex(s=>s.id===t.stepId);if(si>=0)g.steps[si].misses=0;
    g.steps.splice(Math.max(0,si),0,...list.map(text=>({id:uid(),text,doneDays:[],done:false})));
    if(i>=0){L.splice(i,1);tomb(t.id)}inject();}
  else{const sub=list.map(text=>({id:uid(),text,energy:'light',done:false,color:nextColor()}));if(i>=0){L.splice(i,1,...sub);tomb(t.id)}}
  save();closeSheet();renderAll();toast('🌱 עכשיו זה קטן יותר. מספיק להתחיל מהראשון.');
}

/* evening review */
function openEvening(){
  const L=today(),done=L.filter(t=>t.done),undone=L.filter(t=>!t.done);const choice={};let mood=S.moods[T];
  undone.forEach(t=>choice[t.id]='tomorrow');
  openSheet(sheetHead('🌙 סקירת ערב')+
    `<div class="fieldcol">${G('איך {הרגשת|הרגשת} היום?')}<div class="moods" id="ev-moods" style="justify-content:center">${MOODS.map(([e,l],i)=>`<button data-m="${i}" aria-pressed="${mood===i}" aria-label="${l}">${e}</button>`).join('')}</div></div>
    <p style="text-align:center">${done.length?G('היום {עשית|עשית} '+(done.length===1?'דבר אחד':done.length+' דברים')+'. זה אמיתי, וזה שלך 🌸'):G('היה יום כזה. גם זה בסדר. עצם זה {שאתה|שאת} כאן זה כבר משהו 🫂')}</p>
    ${done.length?`<div class="chips" style="justify-content:center">${done.map(t=>`<span class="chip joy">✅ ${esc(t.text)}</span>`).join('')}</div>`:''}
    ${undone.length?`<h3 style="font-size:1.02rem">${G('🤔 יש משהו {שעשית|שעשית} ורק {שכחת|שכחת} לסמן?')}</h3>
    ${undone.map(t=>`<div class="ev-row" data-id="${t.id}"><span>${esc(t.text)}</span><div class="seg">
      <button data-c="done" aria-pressed="false">${G('✅ {עשיתי|עשיתי}')}</button>
      <button data-c="half" aria-pressed="${!!t.partial}">💪 התחלתי</button>
      <button data-c="tomorrow" aria-pressed="${!t.partial}">🌅 למחר</button>
      ${t.auto?'':`<button data-c="letgo" aria-pressed="false">🍃 לשחרר</button>`}</div></div>`).join('')}`:''}
    <label class="fieldcol" for="ev-good">🌼 משהו טוב שקרה היום<textarea id="ev-good" placeholder="אפילו משהו קטן: קפה טעים, חיוך, שמש"></textarea></label>
    <label class="fieldcol" for="ev-thanks">🙏 תודה על...<input id="ev-thanks" placeholder="על מה או למי תודה היום?"></label>
    <div class="actions"><button class="btn wide" id="ev-finish" style="flex:1">סיום הסקירה 💛</button><button class="btn ghost" id="ev-share">📤 לשתף</button></div>`);
  $('ev-moods').onclick=e=>{const b=e.target.closest('[data-m]');if(!b)return;mood=+b.dataset.m;$('ev-moods').querySelectorAll('[data-m]').forEach(x=>x.setAttribute('aria-pressed',x===b))};
  $('sheet').querySelectorAll('.ev-row').forEach(r=>r.addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(!b)return;choice[r.dataset.id]=b.dataset.c;r.querySelectorAll('[data-c]').forEach(x=>x.setAttribute('aria-pressed',x===b))}));
  const summary=()=>{const parts=['🌙 היום שלי בצעד קטן'];if(mood!=null)parts.push('הרגשתי: '+MOODS[mood][0]+' '+MOODS[mood][1]);
    if(done.length)parts.push('עשיתי: '+done.map(t=>t.text).join(', '));const g=$('ev-good').value.trim(),th=$('ev-thanks').value.trim();
    if(g)parts.push('משהו טוב: '+g);if(th)parts.push('תודה על: '+th);parts.push('כל צעד נחשב 🌱');return parts.join('\n')};
  $('ev-share').onclick=async()=>{const text=summary();try{if(navigator.share){await navigator.share({text});return}}catch(e){if(e&&e.name==='AbortError')return}
    if(window.TsaadApp&&TsaadApp.shareText){TsaadApp.shareText(text);return}
    const a=document.createElement('a');a.href='https://wa.me/?text='+encodeURIComponent(text);a.target='_blank';a.rel='noopener';a.click()};
  $('ev-finish').onclick=()=>{
    let marked=0;
    undone.forEach(t=>{const c=choice[t.id];if(c==='done'){setTask(t,true);marked++}else if(c==='half')t.partial=true;else if(c==='letgo')t.letGo=true});
    L.forEach(t=>t.letGo&&tomb(t.id));const keep=L.filter(t=>!t.letGo);L.splice(0,L.length,...keep);
    if(mood!=null)S.moods[T]=mood;
    const g=$('ev-good').value.trim(),th=$('ev-thanks').value.trim();if(g)addJournal('good',g);if(th)addJournal('thanks',th);
    S.reviewed[T]=true;save();closeSheet();renderAll();
    if(marked){chime();confetti(document.querySelector('.garden'))}
    toast(undone.length-marked>0?'🌙 זה בסדר, מחר יום חדש. לילה טוב'+nm()+'.':'🌸 איזה יום. לילה טוב'+nm()+'.');
  };
}

/* letters to self */
function openLetterNew(){
  openSheet(sheetHead('💌 מכתב לעצמי')+`<p>${G('{כתוב|כתבי} לעצמך ביום טוב. המכתב יחכה לך ביומן, ויופיע כשתסמן "יום קשה".')}</p>
    <textarea id="letter-text" style="min-height:160px" placeholder="${G('מה {היית רוצה|היית רוצה} לשמוע ביום קשה?')}"></textarea>
    <button class="btn wide" id="letter-save">לשמור את המכתב</button>`);
  $('letter-save').onclick=()=>{const v=$('letter-text').value.trim();if(!v)return;addJournal('letter',v);save();closeSheet();renderAll();toast('💌 המכתב נשמר. הוא יחכה לך.')};
}
function openLetterRead(){
  const letters=S.journal.filter(j=>j.type==='letter');
  if(!letters.length){openSheet(sheetHead('💌 מכתב לעצמי')+`<p>${G('עוד אין מכתבים. ביום טוב אפשר לכתוב לעצמך משהו לימים כאלה.')}</p><div class="help"><b>${G('בינתיים, תזכורת ממני: {אתה|את} עושה יותר ממה {שאתה חושב|שאת חושבת}. 💜')}</b></div>`);return}
  const l=pick(letters);
  openSheet(sheetHead('💌 מכתב שכתבת לעצמך')+`<p style="color:var(--muted);font-size:.9rem">נכתב ב-${fmtDate(l.date)}</p><div class="letter">${esc(l.text)}</div>${letters.length>1?'<button class="btn ghost wide" id="letter-another">עוד מכתב</button>':''}`);
  if($('letter-another'))$('letter-another').onclick=openLetterRead;
}

/* look: theme, accent, text size */
const ACCENTS={coral:['#FF7F50','#FFE1D3','#FF9A73','#4A3030','🧡'],pink:['#F2709C','#FFDDEA','#FF96BA','#4A2836','🩷'],lavender:['#9B7BEA','#E9E0FF','#B8A0FF','#352B52','💜'],mint:['#2FAE86','#D6F4EA','#5DD3AA','#1F3F35','💚'],sky:['#3C9BE8','#DCEEFF','#7BBEF5','#1F3550','💙'],sun:['#E9A417','#FFF0C7','#F6C64E','#47391A','💛'],gold:['#C8961E','#FBEFC9','#E8C15A','#3F3415','👑']};
const SIZES=[[1,'רגיל'],[1.12,'גדול'],[1.25,'גדול מאוד']];
function isDark(){const t=S.settings.theme||'system';return t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches)}
function applyLook(size){
  const r=document.documentElement,t=S.settings.theme||'system';
  if(t==='system')r.removeAttribute('data-theme');else r.setAttribute('data-theme',t);
  const a=ACCENTS[S.settings.accent||'coral'],d=isDark();
  r.style.setProperty('--accent',d?a[2]:a[0]);r.style.setProperty('--accent-soft',d?a[3]:a[1]);
  r.style.setProperty('--fs',size||S.settings.size||1);
  const h=S.settings.hide||{};['mood','quote','hard'].forEach(k=>r.classList.toggle('hide-'+k,!!h[k]));
  if(window.TsaadApp&&TsaadApp.setStatusBar)try{TsaadApp.setStatusBar(d?'#1D1A26':'#FFF7EF',!d)}catch(e){}
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>applyLook());

/* what's new, once per version */
const WHATS_NEW={v:'6.2',items:['💬 בוחרים איך האפליקציה מדברת אליך: הורה, חבר, פסיכולוג, רב, מפקד ועוד','✨ ארבעה חברים חדשים וזוהרים שמלווים אותך','🔁 משימה שחוזרת כל יום, והמאמן שמסדר לך את היום מהקלטה']};
function maybeWhatsNew(){
  if(!S.onboarded)return;
  if(S.seenNew===WHATS_NEW.v)return;
  if(!S.settings.voice){openVoicePicker(false);return}
  S.seenNew=WHATS_NEW.v;save();
  openSheet(sheetHead('🎁 מה חדש בצעד קטן')+`<ul class="newlist">${WHATS_NEW.items.map(x=>`<li>${x}</li>`).join('')}</ul><button class="btn wide" data-act="sheet-close">יופי, תודה</button>`);
}

function shareApp(){
  const text=G('מצאתי אפליקציה רכה שעוזרת להתקדם בצעדים קטנים, בלי לחץ. כל צעד נחשב 🌱 ')+(window.TK_SITE||location.href.split('#')[0]);
  if(window.TsaadApp&&TsaadApp.shareText){TsaadApp.shareText(text);return}
  if(navigator.share){navigator.share({text}).catch(()=>{});return}
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');
}
function backup(){
  const name='tsaad-katan-'+T+'.json',data=JSON.stringify({app:'tsaad-katan',at:new Date().toISOString(),state:S},null,1);
  if(window.TsaadApp&&TsaadApp.saveFile){TsaadApp.saveFile(name,'application/json',data);return}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
  toast('💾 הגיבוי ירד לקבצים שלך');
}
function restore(file){
  const rd=new FileReader();rd.onload=()=>{let d;try{d=JSON.parse(rd.result);d=d.state||d}catch(e){d=null}
    if(!d||typeof d.tasks!=='object'||!Array.isArray(d.goals)){toast('🤔 הקובץ הזה לא נראה כמו גיבוי של צעד קטן');return}
    const days=Object.keys(d.tasks).length;
    openSheet(sheetHead('📂 שחזור מגיבוי')+`<p>בגיבוי יש ${d.goals.length} מטרות ו-${days} ימים של משימות. השחזור יחליף את מה שיש עכשיו במכשיר.</p>
      <div class="actions"><button class="btn" id="rs-ok" style="flex:1">לשחזר</button><button class="btn ghost" data-act="sheet-close">ביטול</button></div>`);
    $('rs-ok').onclick=()=>{TK.replace(d);closeSheet();toast('📂 שוחזר. הכל חזר למקום 💛')}};
  rd.readAsText(file);
}
function openFeedback(){
  let kind='idea';
  openSheet(sheetHead('💬 לכתוב לנו')+`<p>${G('כל מילה עוזרת לנו לשפר. מה {תרצה|תרצי} לספר?')}</p>
    <div class="seg" id="fb-kind"><button data-k="idea" aria-pressed="true">💡 רעיון</button><button data-k="bug" aria-pressed="false">🐞 משהו לא עובד</button><button data-k="other" aria-pressed="false">💬 אחר</button></div>
    <textarea id="fb-body" placeholder="אפשר לכתוב בחופשיות"></textarea>
    <button class="btn wide" id="fb-send">לשלוח</button>`);
  $('fb-kind').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;kind=b.dataset.k;$('fb-kind').querySelectorAll('[data-k]').forEach(x=>x.setAttribute('aria-pressed',x===b))};
  $('fb-send').onclick=async()=>{const body=$('fb-body').value.trim();if(!body)return;
    if(!window.TKcloud||!TKcloud.user()){toast('☁️ כדי לשלוח צריך להתחבר קודם (בהגדרות)');return}
    $('fb-send').disabled=true;const ok=await TKcloud.feedback(kind,body);$('fb-send').disabled=false;
    if(ok){closeSheet();toast('💛 תודה! קיבלנו')}else toast('🌧️ לא הצלחנו לשלוח. נסו שוב כשיש רשת')};
}

function openSettings(){
  const sw=(k,l,inv)=>`<div class="setrow"><span>${l}</span><button class="switch" role="switch" aria-checked="${inv?!S.settings[k]:!!S.settings[k]}" data-sw="${k}" ${inv?'data-inv="1"':''} aria-label="${l}"></button></div>`;
  const hide=S.settings.hide||{};const sh2=(k,l)=>`<div class="setrow"><span>${l}</span><button class="switch" role="switch" aria-checked="${!hide[k]}" data-hide="${k}" aria-label="${l}"></button></div>`;
  let armed=false,size=S.settings.size||1;const app=!!window.TsaadApp;
  openSheet(sheetHead('⚙️ הגדרות')+`<div class="sets">
    <div id="acct-slot"></div>
    <h3>🙂 עליי</h3>
    <div class="setrow"><label for="set-name">📛 השם שלך</label><input id="set-name" value="${esc(S.settings.name)}" style="max-width:150px"></div>
    <div class="setrow"><span>🗣️ איך לפנות אליך</span><div class="seg"><button data-addr="m" aria-pressed="${S.settings.address==='m'}">אתה</button><button data-addr="f" aria-pressed="${S.settings.address==='f'}">את</button></div></div>
    <div class="setrow"><span>💬 איך האפליקציה מדברת אליי</span><button class="btn small ghost" id="set-voice">${voice().e} ${voice().n}</button></div>
    <div class="fieldcol" style="padding-block:10px">🧸 מי מלווה אותך<div class="pick pets">${Object.entries(MASCOTS).map(([k,v])=>`<button data-masc="${k}" aria-pressed="${k===S.settings.mascot}">${petIcon(k)}${v.n}</button>`).join('')}</div></div>
    ${sw('faith','🕯️ משפטים מהמקורות')}
    <h3>🎨 מראה</h3>
    <div class="setrow"><span>🌗 תצוגה</span><div class="seg" id="set-theme">${[['light','☀️ בהיר'],['dark','🌙 כהה'],['system','📱 כמו בטלפון']].map(([k,l])=>`<button data-th="${k}" aria-pressed="${(S.settings.theme||'system')===k}">${l}</button>`).join('')}</div></div>
    <div class="setrow"><span>🖍️ צבע מועדף</span><div class="swatches" id="set-accent">${Object.entries(ACCENTS).filter(([k])=>k!=='gold'||document.documentElement.classList.contains('vip')).map(([k,a])=>`<button data-ac="${k}" aria-pressed="${(S.settings.accent||'coral')===k}" style="background:${a[0]}" aria-label="צבע ${a[4]}"></button>`).join('')}</div></div>
    <div class="setrow"><span>🔠 גודל טקסט</span><div class="seg" id="set-size">${SIZES.map(([v,l])=>`<button data-sz="${v}" aria-pressed="${size===v}">${l}</button>`).join('')}</div></div>
    <div id="size-confirm" class="actions" hidden><span style="font-size:.9rem;color:var(--muted)">ככה נוח?</span><button class="btn small" id="size-ok">לשמור</button><button class="btn small ghost" id="size-cancel">ביטול</button></div>
    <h3>🏡 מה מופיע במסך היום</h3>
    ${sh2('mood','😊 שורת מצב הרוח')}${sh2('quote','✨ המשפט של היום')}${sh2('hard','💜 כפתור יום קשה')}
    <h3>🎉 חגיגה ותזכורות</h3>
    ${sw('confetti','🎉 קונפטי בסימון משימה')}
    ${sw('sound','🔔 צליל מתוק בסימון משימה')}
    ${sw('noon','☀️ תזכורת עדינה בצהריים')}
    <div class="setrow"><label for="eve-h">🌙 שעת סקירת הערב</label><select id="eve-h">${[17,18,19,20,21].map(h=>`<option value="${h}"${h===S.settings.eveningHour?' selected':''}>${h}:00</option>`).join('')}</select></div>
    ${sw('shabbatOn','🕯️ תזכורות גם בשבת ובחג',false)}
    <p class="hint">${app?'🔕 בלילה (22:00 עד 09:00) לא נשלחות תזכורות. בשבת ובחג רק אם מסמנים למעלה. ביום שישי תגיע ברכה קטנה שעה לפני כניסת שבת.':'🔔 התזכורות עובדות באפליקציה לאנדרואיד.'}</p>
    <h3>💾 הנתונים שלי</h3>
    <div class="setrow"><span>💾 גיבוי לקובץ</span><button class="btn small ghost" id="bk">גיבוי</button></div>
    <div class="setrow"><span>📂 שחזור מקובץ</span><label class="btn small ghost" style="cursor:pointer">שחזור<input type="file" id="rs" accept="application/json,.json" hidden></label></div>
    <div class="setrow"><span>🧽 להתחיל מחדש עם דף נקי</span><button class="btn small ghost" id="reset">איפוס</button></div>
    <h3>💛 עוד</h3>
    <div class="setrow"><span>📣 לספר לחבר</span><button class="btn small ghost" id="share-app">לשתף</button></div>
    <div class="setrow"><span>💬 רעיון או תקלה</span><button class="btn small ghost" id="fb">לכתוב לנו</button></div>
    <div class="setrow"><span>🎁 מה חדש</span><button class="btn small ghost" id="whatsnew">לראות</button></div>
    <div class="setrow"><span>👋 מסך הפתיחה</span><button class="btn small ghost" id="rewiz">פתיחה</button></div>
    <div class="setrow"><span>🔒 פרטיות</span><a class="btn small ghost" href="privacy.html" target="_blank" rel="noopener">למדיניות</a></div>
    </div>
    <p class="hint" style="text-align:center">${versionLine()}</p>`,()=>applyLook());
  const sh=$('sheet');
  if(window.TKcloud)TKcloud.renderSettings($('acct-slot'));
  $('set-name').oninput=e=>{S.settings.name=e.target.value.trim();save();renderHeader()};
  sh.querySelectorAll('[data-sw]').forEach(b=>b.onclick=()=>{const k=b.dataset.sw;S.settings[k]=!S.settings[k];b.setAttribute('aria-checked',S.settings[k]);save();renderAll();if(k==='sound'&&S.settings.sound)chime();if(window.TKnative)TKnative.reschedule()});
  sh.querySelectorAll('[data-hide]').forEach(b=>b.onclick=()=>{const k=b.dataset.hide;S.settings.hide=Object.assign({},S.settings.hide);S.settings.hide[k]=!S.settings.hide[k];b.setAttribute('aria-checked',!S.settings.hide[k]);save();applyLook()});
  sh.querySelectorAll('[data-addr]').forEach(b=>b.onclick=()=>{S.settings.address=b.dataset.addr;sh.querySelectorAll('[data-addr]').forEach(x=>x.setAttribute('aria-pressed',x===b));save();renderAll()});
  sh.querySelectorAll('[data-masc]').forEach(b=>b.onclick=()=>{S.settings.mascot=b.dataset.masc;sh.querySelectorAll('[data-masc]').forEach(x=>x.setAttribute('aria-pressed',x===b));save();lastStage=-1;renderAll()});
  $('set-theme').onclick=e=>{const b=e.target.closest('[data-th]');if(!b)return;S.settings.theme=b.dataset.th;$('set-theme').querySelectorAll('[data-th]').forEach(x=>x.setAttribute('aria-pressed',x===b));save();applyLook()};
  $('set-accent').onclick=e=>{const b=e.target.closest('[data-ac]');if(!b)return;S.settings.accent=b.dataset.ac;$('set-accent').querySelectorAll('[data-ac]').forEach(x=>x.setAttribute('aria-pressed',x===b));save();applyLook()};
  $('set-size').onclick=e=>{const b=e.target.closest('[data-sz]');if(!b)return;size=+b.dataset.sz;$('set-size').querySelectorAll('[data-sz]').forEach(x=>x.setAttribute('aria-pressed',x===b));applyLook(size);$('size-confirm').hidden=size===(S.settings.size||1)};
  $('size-ok').onclick=()=>{S.settings.size=size;save();$('size-confirm').hidden=true;toast('🔠 נשמר')};
  $('size-cancel').onclick=()=>{size=S.settings.size||1;applyLook();$('set-size').querySelectorAll('[data-sz]').forEach(x=>x.setAttribute('aria-pressed',+x.dataset.sz===size));$('size-confirm').hidden=true};
  $('eve-h').onchange=e=>{S.settings.eveningHour=+e.target.value;save();renderAll();if(window.TKnative)TKnative.reschedule()};
  $('bk').onclick=backup;$('rs').onchange=e=>{const f=e.target.files[0];if(f)restore(f)};
  $('share-app').onclick=shareApp;$('fb').onclick=openFeedback;
  $('whatsnew').onclick=()=>{S.seenNew='x';maybeWhatsNew()};
  $('rewiz').onclick=()=>{closeSheet();openWizard()};
  $('set-voice').onclick=()=>{closeSheet();openVoicePicker(true)};
  $('reset').onclick=()=>{if(!armed){armed=true;$('reset').textContent='בטוח? ללחוץ שוב';return}
    const st=S.settings,old=S;S={v:3,tasks:{},goals:[],moods:{},journal:[],hard:{},seeded:false,onboarded:true,seenNew:old.seenNew,colorIx:0,lastOpen:T,lastSeen:T,carryNote:null,injectSkip:{},reviewed:{},askNext:{},daily:[],settings:st,del:old.del||{}};
    Object.values(old.tasks).forEach(L=>L.forEach(x=>tomb(x.id)));old.goals.forEach(x=>tomb(x.id));old.journal.forEach(x=>tomb(x.id));
    S.lastSeenPrev=T;save();closeSheet();renderAll();toast('🧽 דף נקי. מתחילים מחדש, בקצב שלך.')};
}
function versionLine(){
  const v=window.TsaadApp&&TsaadApp.versionName?' · אפליקציה '+TsaadApp.versionName():'';
  const b=window.TK_BUILD?' · עודכן '+new Date(TK_BUILD).toLocaleString('he-IL',{timeZone:'Asia/Jerusalem',day:'numeric',month:'numeric',year:'2-digit',hour:'2-digit',minute:'2-digit'}):'';
  return 'צעד קטן · גרסה '+WHATS_NEW.v+v+b;
}

/* other scripts (cloud sync, Android bridge) reach the app through this */
window.TK={
  get:()=>S, G, esc, toast, voice:()=>voice(), petIcon, openSheet, closeSheet, sheetHead, X, versionLine, version:WHATS_NEW.v,
  render:()=>{applyLook();renderAll()},
  /* replace all data (from the cloud or a backup) without marking it as a new local change */
  replace(d,fromCloud){const keepDevice={lastSeenPrev:S.lastSeenPrev};S=Object.assign({},d,keepDevice);
    S.settings=Object.assign({sound:false,confetti:true,address:'m',name:'',faith:false,mascot:'plant',eveningHour:19,noon:true},S.settings||{});
    ['moods','hard','askNext','injectSkip','reviewed','del'].forEach(k=>S[k]=S[k]||{});S.journal=S.journal||[];
    quiet=!!fromCloud;rollover();inject();save();quiet=false;lastStage=-1;applyLook();renderAll()},
  markSaved(){quiet=true;save();quiet=false},
  addDaily(text,energy){addDailyTask(text,energy);save();renderAll()},
  addTask(text,energy){today().push({id:uid(),text:String(text).slice(0,120),energy:ENERGY[energy]?energy:guessEnergy(text),done:false,color:nextColor()});save();renderAll()},
  addGoal(o){const steps=(o.steps||[]).map(x=>String(x).trim()).filter(Boolean);if(!o.title)return;
    const g={id:uid(),emoji:emojiFor(o.title),color:nextColor(),title:String(o.title).slice(0,80),why:String(o.why||'').slice(0,160),letter:'',deadline:'',auto:true,createdAt:Date.now(),
      steps:(steps.length?steps:localBreakdown(o.title).map(x=>x.text)).map(text=>({id:uid(),text,doneDays:[],done:false}))};
    S.goals.unshift(g);inject();save();renderAll()},
  tab:()=>curTab,
  setAccent(a){S.settings.accent=a;save();applyLook()},
};

/* ---------- one click handler ---------- */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b||b.tagName==='FORM')return;const act=b.dataset.act;
  const li=b.closest('.task'),t=li&&today().find(x=>x.id===li.dataset.id);
  const art=b.closest('[data-g]'),g=art&&goalOf(art.dataset.g);
  switch(act){
    case 'check':{if(!t)return;const v=!t.done;setTask(t,v);save();renderAll();
      if(v){const el=document.querySelector(`.task[data-id="${t.id}"] .check`);
        if(today().every(x=>x.done))celebrate(el,'🌸 {סימנת|סימנת} הכל להיום'+nm()+'. איזה יום!');else celebrate(el)}break}
    case 'half':{if(!t)return;t.partial=!t.partial;save();renderAll();if(t.partial){confetti(document.querySelector(`.task[data-id="${t.id}"] .halfbtn`));toast(pick(HALF))}break}
    case 'del':{if(!t)return;if(t.dailyId){openDailyDel(t);return}const L=today(),i=L.indexOf(t);L.splice(i,1);tomb(t.id);
      if(t.auto){(S.injectSkip[T]=S.injectSkip[T]||[]).push(t.stepId);save();renderAll();toast('🍃 הורדנו את זה מהיום. זה יחכה לך מחר.',()=>{untomb(t.id);L.splice(i,0,t);S.injectSkip[T]=S.injectSkip[T].filter(x=>x!==t.stepId);save();renderAll()})}
      else{save();renderAll();toast('המשימה נמחקה',()=>{untomb(t.id);L.splice(i,0,t);save();renderAll()})}break}
    case 'stuck':if(t)openStuck(t);break;
    case 'energy':{if(!t)return;const o=['light','mid','high'],n=o[(o.indexOf(t.energy||'mid')+1)%3];t.energy=n;if(t.dailyId){const d=(S.daily||[]).find(x=>x.id===t.dailyId);if(d)d.energy=n}save();renderAll();toast(ENERGY[n].e+' '+ENERGY[n].n);break}
    case 'letgo':{if(!t)return;t.letGo=true;const L=today(),i=L.indexOf(t);L.splice(i,1);tomb(t.id);save();renderAll();toast('🍃 שחררנו בשקט. אפשר תמיד להוסיף שוב.',()=>{t.letGo=false;untomb(t.id);L.splice(i,0,t);save();renderAll()});break}
    case 'keep':if(t){t.carried=3;save();renderAll();toast('💪 נשאר איתך. קדימה!')}break;
    case 'hardday':{S.hard[T]=!S.hard[T];save();renderAll();if(S.hard[T])toast('💜 מצב יום קשה. רק הדברים הקלים נשארו.');break}
    case 'read-letter':openLetterRead();break;
    case 'letter-new':openLetterNew();break;
    case 'go-journal':showTab('progress');break;
    case 'absence-ok':S.absenceShown=true;S.lastSeenPrev=T;save();renderAll();break;
    case 'carry-ok':S.carryNote=null;save();renderAll();break;
    case 'clear-samples':{const prev=JSON.stringify(S);
      Object.values(S.tasks).forEach(L=>L.forEach(x=>x.sample&&tomb(x.id)));S.goals.forEach(x=>x.sample&&tomb(x.id));S.journal.forEach(x=>x.sample&&tomb(x.id));Object.keys(S.tasks).forEach(k=>S.tasks[k]=S.tasks[k].filter(x=>!x.sample));S.goals=S.goals.filter(x=>!x.sample);S.journal=S.journal.filter(x=>!x.sample);S.moods={};S.askNext={};S.seeded=false;S.carryNote=null;save();renderAll();
      toast('✨ הדוגמאות נוקו. הדף שלך.',()=>{S=JSON.parse(prev);save();renderAll()});break}
    case 'evening-open':openEvening();break;
    case 'evening-later':S.reviewed[T]=true;save();renderAll();break;
    case 'settings':openSettings();break;
    case 'sheet-close':closeSheet();break;
    case 'step-ready':if(g)openPulse(g);break;
    case 'step-more':if(g){delete S.askNext[g.id];save();renderAll();toast('🌱 נשארים בצעד הזה עוד קצת. מחר הוא יחכה לך שוב.')}break;
    case 'add-next':{if(!g)return;const s=stepOf(g,b.dataset.s);if(!s)return;
      if(s!==curStep(g)){const c=curStep(g);if(c)completeStep(g,c)}
      today().push({id:uid(),text:s.text,energy:'light',done:false,color:nextColor(),goalId:g.id,stepId:s.id,auto:true,carried:0});save();renderAll();toast('☀️ הצעד נוסף לרשימה של היום');break}
    case 'toggle':open.has(g.id)?open.delete(g.id):open.add(g.id);renderGoals();break;
    case 'totoday':{const s=curStep(g);S.injectSkip[T]=(S.injectSkip[T]||[]).filter(x=>x!==s.id);today().push({id:uid(),text:s.text,energy:'light',done:false,color:nextColor(),goalId:g.id,stepId:s.id,auto:true,carried:s.misses||0});save();renderAll();toast('☀️ הצעד נוסף לרשימה של היום');break}
    case 'step':{const s=stepOf(g,b.closest('[data-s]').dataset.s);
      if(!s.done){const won=completeStep(g,s);const tk=today().find(x=>x.stepId===s.id);if(tk&&!tk.done){tk.done=true;tk.doneAt=Date.now()}save();renderAll();
        if(won)openAchieved(g);else celebrate(document.querySelector(`[data-s="${s.id}"] .check`))}
      else{s.done=false;s.doneAt=null;g.achievedAt=null;save();renderAll()}break}
    case 'delstep':{const i=g.steps.findIndex(s=>s.id===b.closest('[data-s]').dataset.s);const s=g.steps.splice(i,1)[0];save();renderAll();toast('הצעד נמחק',()=>{g.steps.splice(i,0,s);save();renderAll()});break}
    case 'editgoal':openGoalEdit(g);break;
    case 'delgoal':{const i=S.goals.indexOf(g);S.goals.splice(i,1);tomb(g.id);delete S.askNext[g.id];save();renderAll();toast('המטרה נמחקה',()=>{untomb(g.id);S.goals.splice(i,0,g);save();renderAll()});break}
  }
});

function renderAll(){renderHeader();renderToday();renderGoals();renderProgress()}
applyLook();renderEnergyPick();renderAll();
S.lastSeen=T;save();
$('ver-line').textContent=versionLine();
if(!S.onboarded)setTimeout(openWizard,250);else setTimeout(maybeWhatsNew,400);

/* new day while open, or back to front */
function dayCheck(){const k=dkey();if(k!==T){T=k;rollover();inject();S.lastSeen=T;save();renderAll()}else renderToday()}
setInterval(dayCheck,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)dayCheck()});
window.onAndroidResume=dayCheck;

/* tabs */
let curTab='today';
function showTab(v){curTab=v;
  document.querySelectorAll('.tab').forEach(x=>x.setAttribute('aria-selected',x.dataset.v===v));
  ['today','goals','progress'].forEach(x=>$('v-'+x).hidden=x!==v);
  try{localStorage.setItem(KEY+'-tab',v)}catch(e){}
  scrollTo(0,0)}
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>showTab(b.dataset.v));
try{const t=localStorage.getItem(KEY+'-tab');t&&showTab(t)}catch(e){}

/* Android back: close a sheet, then the goal form, then go back to Today, then leave */
window.onAndroidBack=()=>{
  if(!$('sheet').hidden){if($('sheet').dataset.lock)return true;closeSheet();return true}
  if(!$('goal-form').hidden){closeForm();return true}
  if(curTab!=='today'){showTab('today');return true}
  return false;
};
})();
