package il.tsaadkatan.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import android.widget.Toast;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import org.json.JSONObject;

/** Home screen widget: today's step, the progress, and a mood row that works without opening the app.
 *  The page sends the data through TsaadApp.setWidget(); a mood tapped here waits in prefs until the page takes it. */
public class Widget extends AppWidgetProvider {
    static final String MOOD = "il.tsaadkatan.WIDGET_MOOD";
    static final int[] IDS = {R.id.w_m0, R.id.w_m1, R.id.w_m2, R.id.w_m3, R.id.w_m4};

    static String today() { return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date()); }

    static void save(Context c, String json) {
        Reminders.prefs(c).edit().putString("widget", json).apply();
        refresh(c);
    }

    static String takeMood(Context c) {
        SharedPreferences p = Reminders.prefs(c);
        String m = p.getString("widgetMood", null);
        if (m != null) p.edit().remove("widgetMood").apply();
        return m;
    }

    static void refresh(Context c) {
        AppWidgetManager m = AppWidgetManager.getInstance(c);
        int[] ids = m.getAppWidgetIds(new ComponentName(c, Widget.class));
        if (ids.length > 0) for (int id : ids) m.updateAppWidget(id, views(c));
    }

    static RemoteViews views(Context c) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget);
        SharedPreferences p = Reminders.prefs(c);
        String t = today();
        int mood = -1;
        try {
            JSONObject o = new JSONObject(p.getString("widget", "{}"));
            if (t.equals(o.optString("date"))) {
                v.setTextViewText(R.id.w_title, o.optString("title", "☀️ הצעד של היום"));
                v.setTextViewText(R.id.w_text, o.optString("text", ""));
                v.setTextViewText(R.id.w_progress, o.optString("progress", "🌱"));
                mood = o.optInt("mood", -1);
            } else if (o.has("date")) {
                v.setTextViewText(R.id.w_title, "🌤️ יום חדש");
                v.setTextViewText(R.id.w_text, "לפתוח ולראות מה מחכה היום");
                v.setTextViewText(R.id.w_progress, "🌱 צעד קטן");
            }
            if (o.has("ask")) v.setTextViewText(R.id.w_ask, o.optString("ask"));
        } catch (Exception e) { }
        // a mood tapped here today, not yet taken by the page
        try {
            String wm = p.getString("widgetMood", null);
            if (wm != null) { JSONObject o = new JSONObject(wm); if (t.equals(o.optString("date"))) mood = o.optInt("m", mood); }
        } catch (Exception e) { }
        for (int i = 0; i < 5; i++) {
            v.setInt(IDS[i], "setBackgroundResource", i == mood ? R.drawable.mood_on : R.drawable.mood_off);
            Intent mi = new Intent(c, Widget.class).setAction(MOOD).putExtra("m", i);
            v.setOnClickPendingIntent(IDS[i], PendingIntent.getBroadcast(c, 700 + i, mi, Reminders.FLAGS));
        }
        Intent open = new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        v.setOnClickPendingIntent(R.id.w_root, PendingIntent.getActivity(c, 710, open, Reminders.FLAGS));
        return v;
    }

    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        for (int id : ids) m.updateAppWidget(id, views(c));
    }

    @Override
    public void onReceive(Context c, Intent intent) {
        super.onReceive(c, intent);
        if (MOOD.equals(intent.getAction())) {
            int m = intent.getIntExtra("m", -1);
            if (m < 0 || m > 4) return;
            try {
                Reminders.prefs(c).edit().putString("widgetMood", new JSONObject().put("date", today()).put("m", m).toString()).apply();
            } catch (Exception e) { }
            refresh(c);
            String[] words = {"💜 תודה ששיתפת. אפשר ללכת לאט היום", "🤍 קיבלנו. נלך בעדינות היום", "🙂 בסדר זה גם טוב", "😊 איזה כיף לשמוע", "😄 יש! יום טוב"};
            try { Toast.makeText(c, words[m], Toast.LENGTH_SHORT).show(); } catch (Exception e) { }
        }
    }
}
