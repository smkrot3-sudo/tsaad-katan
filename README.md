# צעד קטן 🌱

אפליקציה רכה ומכילה למטרות קטנות ולרשימת היום. כל צעד נחשב.

- האתר: https://smkrot3-sudo.github.io/tsaad-katan/ (GitHub Pages מתוך `docs/`)
- אפליקציה לאנדרואיד: `docs/apk/tsaad-katan.apk`, וגרסה אחרונה ב-`docs/app-version.json`

## איך זה בנוי
- `web/parts/` המקור: `base.css`, `extra.css`, `body.html`, `app.js` (האפליקציה), `cloud.js` (התחברות וסנכרון ל-Supabase), `native.js` (תזכורות ועדכונים באפליקציה)
- `tools/build_web.py` בונה את `docs/index.html`, את `web/preview.html` ואת העותק שבתוך האפליקציה
- `android/` עטיפת WebView לאתר החי. `android/build.sh` בונה וחותם. מפתח החתימה לא בריפו, הוא שמור בקבצי הפרויקט
- `supabase/` SQL שמודבק ידנית בעורך של Supabase

## שחרור גרסה לאנדרואיד
1. להעלות `versionCode` ו-`versionName` ב-`android/AndroidManifest.xml`
2. `cd android && ./build.sh` (בונה, חותם ומעתיק ל-`docs/apk/`)
3. לדחוף, ורק אחרי זה לעדכן את `docs/app-version.json`
