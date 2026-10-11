// The gentle AI coach of צעד קטן. Gemini key stays here as a secret (GEMINI_API_KEY), never in the app.
// 20 questions a day per user (unlimited for VIP and the owner). Only a counter and a content-free log are kept.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

// Google retires models often, so the list is read from Google (cached) and the newest "flash" models are tried first
// fastest first: a gentle short answer matters more than the biggest model
const PREFERRED = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"];
let cached: { at: number; list: string[] } | null = null;
async function models(key: string): Promise<string[]> {
  if (cached && Date.now() - cached.at < 6 * 3600 * 1000) return cached.list;
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": key } });
    const all = ((await r.json()).models ?? [])
      .filter((m: any) => (m.supportedGenerationMethods ?? []).includes("generateContent"))
      .map((m: any) => String(m.name).replace(/^models\//, ""))
      .filter((n: string) => /^gemini-[\d.]+-flash(-lite)?$/.test(n));
    const ver = (n: string) => parseFloat(n.split("-")[1]) - (n.endsWith("lite") ? 0.01 : 0);
    all.sort((a: string, b: string) => ver(b) - ver(a));
    const list = [...PREFERRED.filter((p) => all.includes(p)), ...all.filter((n: string) => !PREFERRED.includes(n))].slice(0, 3);
    if (list.length) { cached = { at: Date.now(), list }; return list; }
  } catch { /* fall through */ }
  return PREFERRED;
}
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

// short JSON tasks the app asks for by itself (breaking a goal into steps, a stuck task into tiny actions)
const STEPS = `את/ה מאמן/ת עדין/ה באפליקציה "צעד קטן" שעוזרת לאנשים (כולל מי שמתמודד עם דיכאון, שחיקה או קושי נפשי) להתקדם למטרה בצעדים קטנים, בלי לחץ ובלי שיפוטיות.
פרק/י את המטרה למספר הצעדים שהיא באמת צריכה, לא מספר קבוע: מטרה קטנה ופשוטה 3 עד 4 צעדים, מטרה בינונית 5 עד 8, מטרה גדולה או ארוכה (למשל ללמוד מקצוע, לרוץ 10 ק"מ, להוציא רישיון נהיגה, לעבור דירה) 8 עד 15. אם יש תאריך יעד, התאם/י את מספר הצעדים והקצב לזמן שיש. הראשון קטן מאוד וקל, וכל צעד גדל רק קצת מהקודם. כל צעד הוא פעולה אחת וקונקרטית שאפשר לעשות ביום אחד. המשתמש עובר לצעד הבא כשהוא מרגיש מוכן.
כתוב/י בעברית, בלשון שם פועל, עד 60 תווים לצעד. החזר/י רק JSON: מערך מחרוזות.`;
const SMALLER = `מישהו מנסה כבר כמה ימים לעשות משימה ולא מצליח להתחיל. פרק/י אותה ל-2 עד 4 פעולות זעירות וקונקרטיות, עד 2 דקות כל אחת, שהראשונה כמעט בלי מאמץ. בעברית, בלשון שם פועל, עד 50 תווים. החזר/י רק JSON: מערך מחרוזות.`;

const PLAN = `את/ה המאמן העדין באפליקציה "צעד קטן" (גם לאנשים שמתמודדים עם דיכאון, חרדה או שחיקה).
המשתמש סיפר, בהקלטה או בכתב, מה יש לו היום. הפוך/הפכי את זה לרשימת משימות להיום:
- כל משימה קצרה וברורה, בלשון שם פועל, עד 50 תווים. לא להמציא משימות שלא נאמרו.
- לסדר לפי היגיון של היום: מה שדחוף או של הבוקר קודם.
- energy: light = קל, mid = בינוני, high = דורש הרבה כוח.
- daily = true רק אם נאמר שזה חוזר כל יום (למשל "כל בוקר אני מתפלל").
- משימה ענקית: לכתוב רק את החלק הראשון והקטן שלה.
- note: משפט אחד חם וקצר בעברית, לפי מגדר המשתמש אם ידוע, בלי לחץ.
אם לא נשמע כלום ברור, להחזיר רשימה ריקה ו-note שמבקש בעדינות לנסות שוב.`;
const PLAN_SCHEMA = {
  type: "OBJECT",
  properties: {
    note: { type: "STRING" },
    tasks: { type: "ARRAY", items: { type: "OBJECT", properties: { text: { type: "STRING" }, energy: { type: "STRING", enum: ["light", "mid", "high"] }, daily: { type: "BOOLEAN" } }, required: ["text", "energy"] } },
  },
  required: ["note", "tasks"],
};

async function askJSON(key: string, system: string, parts: any[], schema: any): Promise<{ data: any; model: string } | null> {
  for (const model of await models(key)) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 45000);
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST", signal: ctrl.signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] }, contents: [{ role: "user", parts }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 4096, responseMimeType: "application/json", responseSchema: schema },
        }),
      });
      clearTimeout(t);
      if (!r.ok) { console.error(`gemini json ${model} ${r.status} ${(await r.text().catch(() => "")).slice(0, 300)}`); if (r.status === 404) cached = null; continue; }
      const d = await r.json();
      const raw = (d.candidates?.[0]?.content?.parts ?? []).map((p: any) => p.text ?? "").join("");
      return { data: JSON.parse(raw.replace(/^```(json)?|```$/g, "").trim()), model };
    } catch (e) { clearTimeout(t); console.error(`gemini json ${model} ${e}`); }
  }
  return null;
}

async function jsonList(key: string, system: string, text: string): Promise<{ list: string[]; model: string } | null> {
  const out = await askJSON(key, system, [{ text }], { type: "ARRAY", items: { type: "STRING" } });
  const list = out?.data;
  return Array.isArray(list) && list.length ? { list: list.map((x: unknown) => String(x).slice(0, 90)).filter(Boolean).slice(0, 15), model: out!.model } : null;
}

const SUMMARY = `סכם/י בעברית את המשוב שהמשתמשים שלחו לאפליקציה "צעד קטן": מה חוזר על עצמו, תקלות שכדאי לתקן קודם, ורעיונות בולטים. רשימה קצרה עם תבליטים.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const key = (Deno.env.get("GEMINI_API_KEY") ?? "").trim().replace(/^["']|["']$/g, "");
  if (!key) return json({ error: "no_key" }, 503);

  const url = Deno.env.get("SUPABASE_URL")!;
  const auth = req.headers.get("Authorization") ?? "";
  const asUser = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
  const { data: { user } } = await asUser.auth.getUser();
  if (!user) return json({ error: "auth" }, 401);
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400); }

  const day = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jerusalem" });
  const refund = async () => {
    const { data: u } = await admin.from("ai_usage").select("count").eq("user_id", user.id).eq("day", day).maybeSingle();
    if (u && u.count > 0) await admin.from("ai_usage").update({ count: u.count - 1 }).eq("user_id", user.id).eq("day", day);
  };

  if (body.mode === "plan") {
    const audio = body.audio && typeof body.audio.data === "string" ? body.audio : null;
    const text = String(body.text ?? "").slice(0, 3000).trim();
    if (!audio && !text) return json({ error: "empty" }, 400);
    if (audio && audio.data.length > 8_000_000) return json({ error: "too_long" }, 413);
    const { data: left, error } = await admin.rpc("ai_take", { p_user: user.id, p_day: day, p_limit: DAILY });
    if (error) return json({ error: "quota" }, 500);
    if (left < 0) return json({ error: "limit", limit: DAILY }, 429);
    const parts: any[] = [{ text: `מגדר לפנייה: ${body.address === "f" ? "נקבה" : body.address === "m" ? "זכר" : "לא ידוע"}.${text ? "\nמה שהמשתמש כתב: " + text : ""}${audio ? "\nההקלטה של המשתמש מצורפת." : ""}` }];
    if (audio) parts.push({ inlineData: { mimeType: String(audio.mime || "audio/wav"), data: audio.data } });
    const out = await askJSON(key, PLAN, parts, PLAN_SCHEMA);
    const tasks = Array.isArray(out?.data?.tasks) ? out!.data.tasks.slice(0, 20).map((x: any) => ({ text: String(x.text ?? "").slice(0, 90), energy: ["light", "mid", "high"].includes(x.energy) ? x.energy : "mid", daily: !!x.daily })).filter((x: any) => x.text) : null;
    await admin.from("ai_log").insert({ user_id: user.id, model: out?.model ?? "none", ok: !!tasks });
    if (!tasks) { await refund(); return json({ error: "busy" }, 503); }
    return json({ tasks, note: String(out!.data.note ?? "").slice(0, 300), left });
  }

  if (body.mode === "steps" || body.mode === "smaller") {
    const { data: left, error } = await admin.rpc("ai_take", { p_user: user.id, p_day: day, p_limit: DAILY });
    if (error) return json({ error: "quota" }, 500);
    if (left < 0) return json({ error: "limit", limit: DAILY }, 429);
    const prompt = body.mode === "steps"
      ? `מטרה: ${String(body.title ?? "").slice(0, 200)}\n${body.why ? "למה זה חשוב: " + String(body.why).slice(0, 400) + "\n" : ""}${body.days ? `זמן עד היעד: ${+body.days} ימים.` : "בלי תאריך יעד."}`
      : `המשימה: ${String(body.text ?? "").slice(0, 200)}`;
    const out = await jsonList(key, body.mode === "steps" ? STEPS : SMALLER, prompt);
    await admin.from("ai_log").insert({ user_id: user.id, model: out?.model ?? "none", ok: !!out });
    if (!out) { await refund(); return json({ error: "busy" }, 503); }
    return json({ items: out.list, left });
  }

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
    const { data: left, error } = await admin.rpc("ai_take", { p_user: user.id, p_day: day, p_limit: DAILY });
    if (error) return json({ error: "quota" }, 500);
    if (left < 0) return json({ error: "limit", limit: DAILY }, 429);
    system = COACH + "\n\nהנתונים של המשתמש:\n" + String(body.context ?? "").slice(0, 12000);
    contents = msgs.map((m: any) => ({ role: m.role === "model" ? "model" : "user", parts: [{ text: String(m.text ?? "").slice(0, 4000) }] }));
    (body as any)._left = left;
  }

  // try each model in turn; stream the first one that answers
  const fails: string[] = [];
  for (const model of await models(key)) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 40000);
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, {
        method: "POST", signal: ctrl.signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: { temperature: 0.7, maxOutputTokens: 4096 } }),
      });
      clearTimeout(t);
      if (!r.ok || !r.body) {
        const detail = (await r.text().catch(() => "")).slice(0, 300);
        console.error(`gemini ${model} ${r.status} ${detail}`);
        fails.push(`${model}:${r.status}`);
        if (r.status === 404) cached = null;
        continue;
      }
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
    } catch (e) { clearTimeout(t); console.error(`gemini ${model} ${e}`); fails.push(`${model}:timeout`); }
  }
  await admin.from("ai_log").insert({ user_id: user.id, model: "none", ok: false });
  // nothing answered: give the question back
  if (body.mode !== "feedback_summary") await refund();
  return json({ error: "busy", detail: fails.join(",") }, 503);
});
