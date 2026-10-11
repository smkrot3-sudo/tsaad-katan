package il.tsaadkatan.app;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Vibrator;
import android.view.View;
import android.content.pm.PackageManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.OutputStream;
import org.json.JSONObject;

/** The app is the live site (always the latest version) in a WebView, plus a small bridge: TsaadApp. */
public class MainActivity extends Activity {
    static final String SITE = Reminders.SITE;
    static final String OFFLINE = "file:///android_asset/index.html";
    static final int REQ_SAVE = 11, REQ_PICK = 12, REQ_NOTIF = 13, REQ_MIC = 14;
    private PermissionRequest micRequest;
    private WebView web;
    private String pendingAuth, saveContent;
    private ValueCallback<Uri[]> pickCallback;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        setBars("#FFF7EF", true);
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#FFF7EF"));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(true);
        s.setTextZoom(100);
        web.addJavascriptInterface(new Bridge(), "TsaadApp");
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (pickCallback != null) pickCallback.onReceiveValue(null);
                pickCallback = cb;
                try { startActivityForResult(p.createIntent(), REQ_PICK); } catch (Exception e) { pickCallback = null; return false; }
                return true;
            }
            // the microphone, for telling the coach about your day
            @Override
            public void onPermissionRequest(PermissionRequest r) {
                boolean audio = false;
                for (String x : r.getResources()) if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(x)) audio = true;
                if (!audio) { r.deny(); return; }
                if (checkSelfPermission("android.permission.RECORD_AUDIO") == PackageManager.PERMISSION_GRANTED) { r.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE}); return; }
                if (micRequest != null) micRequest.deny();
                micRequest = r;
                requestPermissions(new String[]{"android.permission.RECORD_AUDIO"}, REQ_MIC);
            }
        });
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("file:") || (url.startsWith(SITE) && !url.endsWith(".apk"))) return false;
                openExternal(url);
                return true;
            }
            @Override
            public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError err) {
                // no network on the very first launch: the copy inside the app
                if (req.isForMainFrame() && req.getUrl().toString().startsWith(SITE)) view.loadUrl(OFFLINE);
            }
            @Override
            public void onPageFinished(WebView view, String url) {
                if (pendingAuth != null) { view.evaluateJavascript(pendingAuth, null); pendingAuth = null; }
            }
        });
        setContentView(web);
        Reminders.arm(this);
        handleLink(getIntent());
        SharedPreferences p = Reminders.prefs(this);
        if (state != null) web.restoreState(state);
        else if (!p.getBoolean("migrated", false)) {
            // versions before 4 kept data inside the app (file:// storage): hand it over to the site once
            p.edit().putBoolean("migrated", true).apply();
            web.loadUrl("file:///android_asset/migrate.html");
        } else web.loadUrl(SITE);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleLink(intent);
        if (pendingAuth != null) { web.evaluateJavascript(pendingAuth, null); pendingAuth = null; }
    }

    /** tsaadkatan://auth?at=..&rt=.. from auth-return.html after Google sign-in in the browser */
    private void handleLink(Intent intent) {
        Uri u = intent == null ? null : intent.getData();
        if (u == null || !"tsaadkatan".equals(u.getScheme())) return;
        String at = u.getQueryParameter("at"), rt = u.getQueryParameter("rt");
        if (at == null || rt == null) return;
        pendingAuth = "window.onAndroidAuth&&window.onAndroidAuth(" + JSONObject.quote(at) + "," + JSONObject.quote(rt) + ")";
    }

    private void js(final String code) {
        runOnUiThread(new Runnable() { public void run() { if (web != null) web.evaluateJavascript(code, null); } });
    }

    private void openExternal(String url) {
        try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); } catch (Exception e) { }
    }

    private void setBars(String color, boolean light) {
        int c = Color.parseColor(color);
        getWindow().setStatusBarColor(c);
        getWindow().setNavigationBarColor(c);
        getWindow().getDecorView().setSystemUiVisibility(light ? View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR : 0);
    }

    @Override
    public void onRequestPermissionsResult(int req, String[] perms, int[] res) {
        if (req != REQ_MIC || micRequest == null) return;
        if (res.length > 0 && res[0] == PackageManager.PERMISSION_GRANTED) micRequest.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
        else micRequest.deny();
        micRequest = null;
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        if (req == REQ_PICK) {
            if (pickCallback != null) pickCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(res, data));
            pickCallback = null;
        } else if (req == REQ_SAVE) {
            boolean ok = false;
            if (res == RESULT_OK && data != null && data.getData() != null && saveContent != null) {
                try (OutputStream o = getContentResolver().openOutputStream(data.getData())) { o.write(saveContent.getBytes("UTF-8")); ok = true; } catch (Exception e) { }
            }
            saveContent = null;
            if (ok) web.evaluateJavascript("window.TK&&TK.toast('💾 הגיבוי נשמר')", null);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle out) { super.onSaveInstanceState(out); web.saveState(out); }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.evaluateJavascript("window.onAndroidResume&&window.onAndroidResume()", null);
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.onAndroidBack?window.onAndroidBack():false", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String v) { if (!"true".equals(v)) finish(); }
        });
    }

    /** window.TsaadApp in the page */
    class Bridge {
        @JavascriptInterface public int versionCode() {
            try { return getPackageManager().getPackageInfo(getPackageName(), 0).versionCode; } catch (Exception e) { return 0; }
        }
        @JavascriptInterface public String versionName() {
            try { return getPackageManager().getPackageInfo(getPackageName(), 0).versionName; } catch (Exception e) { return ""; }
        }
        @JavascriptInterface public void shareText(String text) {
            Intent i = new Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, text);
            startActivity(Intent.createChooser(i, "לשתף"));
        }
        @JavascriptInterface public void openExternal(String url) { MainActivity.this.openExternal(url); }
        @JavascriptInterface public void vibrate(int ms) {
            try { ((Vibrator) getSystemService(VIBRATOR_SERVICE)).vibrate(Math.min(ms, 400)); } catch (Exception e) { }
        }
        @JavascriptInterface public void setStatusBar(final String color, final boolean light) {
            runOnUiThread(new Runnable() { public void run() { try { setBars(color, light); } catch (Exception e) { } } });
        }
        @JavascriptInterface public void saveFile(String name, String mime, String content) {
            saveContent = content;
            Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType(mime).putExtra(Intent.EXTRA_TITLE, name);
            startActivityForResult(i, REQ_SAVE);
        }
        @JavascriptInterface public void schedule(String json) { Reminders.schedule(MainActivity.this, json); }
        @JavascriptInterface public void askNotifications() {
            if (Build.VERSION.SDK_INT >= 33) requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, REQ_NOTIF);
        }
        @JavascriptInterface public boolean canInstallUpdates() { return true; }
        @JavascriptInterface public void installUpdate(String url) {
            Updater.install(MainActivity.this, url, new Updater.Progress() {
                public void on(final int pct) { js("window.onUpdateProgress&&window.onUpdateProgress(" + pct + ")"); }
                public void fail(String why) { js("window.onUpdateProgress&&window.onUpdateProgress(-2)"); }
            });
        }
        @JavascriptInterface public void setAdminFeed(String token) { Reminders.setAdmin(MainActivity.this, token); }
        @JavascriptInterface public void stash(String json) { Reminders.prefs(MainActivity.this).edit().putString("stash", json).apply(); }
        @JavascriptInterface public String takeStash() {
            SharedPreferences p = Reminders.prefs(MainActivity.this);
            String s = p.getString("stash", null);
            p.edit().remove("stash").apply();
            return s;
        }
        @JavascriptInterface public void goSite() {
            runOnUiThread(new Runnable() { public void run() { web.loadUrl(SITE); } });
        }
    }
}
