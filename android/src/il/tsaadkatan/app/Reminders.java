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
    static final String SB = "https://jgqlwuvmwbsgrcqddeyw.supabase.co";
    static final String SB_KEY = "sb_publishable_0LbF_Fxj9W3RbHVri_VFHQ_FCG_GQJy"; // public key, access is limited by the database

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
        // admins: check for new sign-ups about every 15 minutes
        PendingIntent admin = PendingIntent.getBroadcast(c, 9998, new Intent(c, Reminders.class).setAction("il.tsaadkatan.ADMIN"), FLAGS);
        if (prefs(c).getString("adminToken", "").length() > 0)
            am.setInexactRepeating(AlarmManager.RTC_WAKEUP, now + 60000, AlarmManager.INTERVAL_FIFTEEN_MINUTES, admin);
        else am.cancel(admin);
    }

    static void setAdmin(Context c, String token) {
        SharedPreferences.Editor e = prefs(c).edit().putString("adminToken", token == null ? "" : token);
        if (!prefs(c).contains("adminSince")) e.putString("adminSince", new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", java.util.Locale.US) {{ setTimeZone(java.util.TimeZone.getTimeZone("UTC")); }}.format(new java.util.Date()));
        e.apply();
        arm(c);
    }

    /** New sign-ups since the last check, one notification each */
    static void checkSignups(Context c) {
        SharedPreferences p = prefs(c);
        String token = p.getString("adminToken", "");
        if (token.length() == 0) return;
        try {
            HttpURLConnection h = (HttpURLConnection) new URL(SB + "/rest/v1/rpc/admin_new_users").openConnection();
            h.setConnectTimeout(15000); h.setReadTimeout(15000);
            h.setRequestMethod("POST"); h.setDoOutput(true);
            h.setRequestProperty("apikey", SB_KEY);
            h.setRequestProperty("Content-Type", "application/json");
            JSONObject body = new JSONObject().put("p_token", token).put("p_since", p.getString("adminSince", "2026-01-01T00:00:00Z"));
            h.getOutputStream().write(body.toString().getBytes("UTF-8"));
            if (h.getResponseCode() != 200) return;
            BufferedReader r = new BufferedReader(new InputStreamReader(h.getInputStream(), "UTF-8"));
            StringBuilder sb = new StringBuilder(); String line;
            while ((line = r.readLine()) != null) sb.append(line);
            r.close();
            JSONArray list = new JSONArray(sb.toString());
            for (int i = 0; i < list.length(); i++) {
                JSONObject u = list.getJSONObject(i);
                String name = u.optString("name", "");
                notify(c, 100 + (int) (System.currentTimeMillis() % 100000) + i, "🎉 משתמש חדש נרשם", (name.length() > 0 ? name + " · " : "") + u.optString("email", ""));
                p.edit().putString("adminSince", u.getString("created_at")).apply();
            }
        } catch (Exception e) { }
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
        } else if ("il.tsaadkatan.ADMIN".equals(intent.getAction())) {
            final PendingResult done = goAsync();
            new Thread(new Runnable() { public void run() { try { checkSignups(c); } finally { done.finish(); } } }).start();
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
