package il.tsaadkatan.app;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;

/** Scheduled gentle reminders (the web page decides the times, already avoiding night, Shabbat and holidays) and the background update check. */
public class Reminders extends BroadcastReceiver {
    static final String SITE = "https://smkrot3-sudo.github.io/tsaad-katan/";
    static final String PREFS = "tsaad";
    static final int FLAGS = PendingIntent.FLAG_UPDATE_CURRENT | 0x04000000; // FLAG_IMMUTABLE
    static final long UPDATE_EVERY = 6 * 3600 * 1000L;

    static SharedPreferences prefs(Context c) { return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE); }

    /** Replace all reminders with this list: [{id, at, title, body}] */
    static void schedule(Context c, String json) {
        SharedPreferences p = prefs(c);
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        try {
            JSONArray old = new JSONArray(p.getString("reminders", "[]"));
            for (int i = 0; i < old.length(); i++) am.cancel(pending(c, old.getJSONObject(i)));
        } catch (Exception e) { }
        p.edit().putString("reminders", json).apply();
        arm(c);
    }

    static void arm(Context c) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        long now = System.currentTimeMillis();
        try {
            JSONArray list = new JSONArray(prefs(c).getString("reminders", "[]"));
            for (int i = 0; i < list.length(); i++) {
                JSONObject r = list.getJSONObject(i);
                if (r.getLong("at") > now) am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, r.getLong("at"), pending(c, r));
            }
        } catch (Exception e) { }
        Intent u = new Intent(c, Reminders.class).setAction("il.tsaadkatan.UPDATE");
        am.setInexactRepeating(AlarmManager.RTC, now + UPDATE_EVERY, UPDATE_EVERY, PendingIntent.getBroadcast(c, 9999, u, FLAGS));
    }

    static PendingIntent pending(Context c, JSONObject r) throws Exception {
        Intent i = new Intent(c, Reminders.class).setAction("il.tsaadkatan.NOTIFY")
            .putExtra("title", r.optString("title", "צעד קטן")).putExtra("body", r.optString("body", ""));
        return PendingIntent.getBroadcast(c, r.getInt("id"), i, FLAGS);
    }

    @Override
    public void onReceive(final Context c, Intent intent) {
        if ("il.tsaadkatan.NOTIFY".equals(intent.getAction())) {
            notify(c, 1, intent.getStringExtra("title"), intent.getStringExtra("body"));
        } else if ("il.tsaadkatan.UPDATE".equals(intent.getAction())) {
            final PendingResult done = goAsync();
            new Thread(new Runnable() { public void run() { try { checkUpdate(c); } finally { done.finish(); } } }).start();
        }
    }

    /** One notification per new version */
    static void checkUpdate(Context c) {
        try {
            HttpURLConnection h = (HttpURLConnection) new URL(SITE + "app-version.json?t=" + System.currentTimeMillis()).openConnection();
            h.setConnectTimeout(15000); h.setReadTimeout(15000); h.setUseCaches(false);
            BufferedReader r = new BufferedReader(new InputStreamReader(h.getInputStream(), "UTF-8"));
            StringBuilder sb = new StringBuilder(); String line;
            while ((line = r.readLine()) != null) sb.append(line);
            r.close();
            JSONObject v = new JSONObject(sb.toString());
            int latest = v.getInt("versionCode");
            int mine = c.getPackageManager().getPackageInfo(c.getPackageName(), 0).versionCode;
            SharedPreferences p = prefs(c);
            if (latest > mine && p.getInt("notifiedVersion", 0) < latest) {
                p.edit().putInt("notifiedVersion", latest).apply();
                notify(c, 2, "יש עדכון לצעד קטן 🎁", "גרסה " + v.optString("versionName") + " מחכה לך. אפשר לעדכן מתוך האפליקציה.");
            }
        } catch (Exception e) { }
    }

    static void notify(Context c, int id, String title, String body) {
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        Notification.Builder b;
        try {
            if (Build.VERSION.SDK_INT >= 26) {
                // compiled against API 23, so the channel API is reached by reflection
                Class<?> ch = Class.forName("android.app.NotificationChannel");
                Object channel = ch.getConstructor(String.class, CharSequence.class, int.class).newInstance("gentle", "תזכורות עדינות", 3);
                NotificationManager.class.getMethod("createNotificationChannel", ch).invoke(nm, channel);
                b = Notification.Builder.class.getConstructor(Context.class, String.class).newInstance(c, "gentle");
            } else b = new Notification.Builder(c);
        } catch (Exception e) { b = new Notification.Builder(c); }
        Intent open = new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        b.setSmallIcon(R.drawable.ic_stat).setColor(0xFFFF7F50).setContentTitle(title).setContentText(body)
            .setStyle(new Notification.BigTextStyle().bigText(body)).setAutoCancel(true)
            .setContentIntent(PendingIntent.getActivity(c, 0, open, FLAGS));
        try { nm.notify(id, b.build()); } catch (Exception e) { }
    }
}
