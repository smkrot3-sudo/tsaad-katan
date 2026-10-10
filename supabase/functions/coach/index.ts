// The gentle AI coach of צעד קטן. Gemini key stays here as a secret (GEMINI_API_KEY), never in the app.
// 20 questions a day per user (unlimited for VIP and the owner). Only a counter and a content-free log are kept.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash"];
const DAILY = 20;
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Expose-Headers": "x-remaining, x-model",
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

const COACH = `את/ה "המאמן העדין" באפליקציה "צעד קטן": אפליקציה רכה ומכילה למטרות קטנות ולרשימת היום, גם לאנשים שמתמודדים עם דיכאון, חרדה או שחיקה.
הסלוגן: כל צעד נחשב.
כללים:
- עברית חמה, קצרה ופשוטה. 2 עד 6 משפטים, אלא אם ביקשו יותר. אימוג'י אחד או שניים.
- לפנות לפי מגדר המשתמש שמופיע בנתונים (m = זכר, f = נקבה).
- בלי שיפוטיות, בלי לחץ, בלי השוואות. אסור להשתמש במילים: כישלון, פספסת, עצלן, חובה.
- כל התקדמות קטנה היא הישג. להציע תמיד את הצעד הכי קטן שאפשר.
- את/ה לא מטפל/ת ולא נותן/ת אבחנות. אם יש סימן למצוקה קשה, מחשבות לפגוע בעצמך או מצב חירום: לומר בעדינות שיש מי שמקשיב עכשיו, ער"ן 1201, סה"ר sahar.org.il, ובחירום 101.
- את/ה רואה את הנתונים של המשתמש (למטה). להשתמש בהם כדי להיות אישי/ת, בלי לצטט הכל.
- כשמתאים להציע פעולה, הוסף/י בסוף שורה אחת בדיוק בפורמט:
  ACTION {"type":"add_task","text":"...","energy":"light|mid|high"}
  או
  ACTION {"type":"add_goal","title":"...","why":"...","steps":["...","..."]}
  המשתמש יאשר בעצמו. לכל היותר 3 שורות ACTION. לא לכתוב ACTION אם לא מתאים.`;

const SUMMARY = `סכם/י בעברית את המשוב שהמשתמשים שלחו לאפליקציה "צעד קטן": מה חוזר על עצמו, תקלות שכדאי לתקן קודם, ורעיונות בולטים. רשימה קצרה עם תבליטים.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) return json({ error: "no_key" }, 503);

  const url = Deno.env.get("SUPABASE_URL")!;
  const auth = req.headers.get("Authorization") ?? "";
  const asUser = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
  const { data: { user } } = await asUser.auth.getUser();
  if (!user) return json({ error: "auth" }, 401);
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400); }

  let system = COACH, contents: any[] = [];
  if (body.mode === "feedback_summary") {
    const { data: isAdmin } = await asUser.rpc("is_admin");
    if (!isAdmin) return json({ error: "forbidden" }, 403);
    const { data: fb } = await admin.from("feedback").select("kind,body,created_at").order("created_at", { ascending: false }).limit(80);
    system = SUMMARY;
    contents = [{ role: "user", parts: [{ text: (fb ?? []).map((f) => `[${f.kind}] ${f.body}`).join("\n---\n") || "אין משוב עדיין" }] }];
  } else {
    const msgs = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    if (!msgs.length) return json({ error: "empty" }, 400);
    const day = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jerusalem" });
    const { data: left, error } = await admin.rpc("ai_take", { p_user: user.id, p_day: day, p_limit: DAILY });
    if (error) return json({ error: "quota" }, 500);
    if (left < 0) return json({ error: "limit", limit: DAILY }, 429);
    system = COACH + "\n\nהנתונים של המשתמש:\n" + String(body.context ?? "").slice(0, 12000);
    contents = msgs.map((m: any) => ({ role: m.role === "model" ? "model" : "user", parts: [{ text: String(m.text ?? "").slice(0, 4000) }] }));
    (body as any)._left = left;
  }

  // try each model in turn; stream the first one that answers
  for (const model of MODELS) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 25000);
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, {
        method: "POST", signal: ctrl.signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: { temperature: 0.7, maxOutputTokens: 1200 } }),
      });
      clearTimeout(t);
      if (!r.ok || !r.body) continue;
      const reader = r.body.getReader(), dec = new TextDecoder(), enc = new TextEncoder();
      const stream = new ReadableStream({
        async start(c) {
          let buf = "", ok = false;
          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              buf += dec.decode(value, { stream: true });
              let i;
              while ((i = buf.indexOf("\n")) >= 0) {
                const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
                if (!line.startsWith("data:")) continue;
                try {
                  const d = JSON.parse(line.slice(5));
                  const txt = (d.candidates?.[0]?.content?.parts ?? []).map((p: any) => p.text ?? "").join("");
                  if (txt) { ok = true; c.enqueue(enc.encode(txt)); }
                } catch { /* partial line */ }
              }
            }
          } finally {
            c.close();
            await admin.from("ai_log").insert({ user_id: user.id, model, ok });
          }
        },
      });
      return new Response(stream, { headers: { ...cors, "Content-Type": "text/plain; charset=utf-8", "x-remaining": String((body as any)._left ?? ""), "x-model": model } });
    } catch { clearTimeout(t); }
  }
  await admin.from("ai_log").insert({ user_id: user.id, model: "none", ok: false });
  return json({ error: "busy" }, 503);
});
