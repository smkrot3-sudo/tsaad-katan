#!/usr/bin/env bash
# Builds out/tsaad-katan.apk (a WebView of the live site, with an offline copy) using Ubuntu's Android tools (aapt, dalvik-exchange, zipalign, apksigner).
set -euo pipefail
cd "$(dirname "$0")"
SDK=/usr/lib/android-sdk/platforms/android-23/android.jar
# the signing key is NOT in the repo; it is kept in the project files. Every version must use the same key.
KEYSTORE=${KEYSTORE:-keystore/tsaad-katan.jks}
[ -f "$KEYSTORE" ] || { echo "missing $KEYSTORE (copy it from the project files)"; exit 1; }
rm -rf build out && mkdir -p build/obj out

# 1. web assets: built by tools/build_web.py (the site + an offline copy in android/assets)
python3 ../tools/build_web.py

# 2. compile Java
mkdir -p build/gen
aapt package -f -m -J build/gen -M AndroidManifest.xml -S res -I "$SDK"
javac -nowarn -Xlint:-options -source 8 -target 8 -bootclasspath "$SDK" -classpath "$SDK" -d build/obj src/il/tsaadkatan/app/*.java build/gen/il/tsaadkatan/app/R.java
dalvik-exchange --dex --output=build/classes.dex build/obj

# 3. package resources + assets, add dex
aapt package -f -M AndroidManifest.xml -S res -A assets -I "$SDK" -F build/app.unsigned.apk -0 arsc
(cd build && aapt add -f app.unsigned.apk classes.dex >/dev/null)

# 4. align + sign
zipalign -p -f 4 build/app.unsigned.apk build/app.aligned.apk
apksigner sign --ks "$KEYSTORE" --ks-pass pass:android --key-pass pass:android --ks-key-alias tsaadkatan --out out/tsaad-katan.apk build/app.aligned.apk
apksigner verify --print-certs out/tsaad-katan.apk | head -2
cp out/tsaad-katan.apk ../docs/apk/tsaad-katan.apk
ls -la out/tsaad-katan.apk
