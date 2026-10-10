package il.tsaadkatan.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Alarms are cleared on reboot and on app update: set them again. */
public class Boot extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent intent) { Reminders.arm(c); }
}
