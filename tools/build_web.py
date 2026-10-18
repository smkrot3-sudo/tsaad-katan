#!/usr/bin/env python3
"""Builds the site (docs/), the Claude preview page (web/preview.html) and the APK's offline copy (android/assets/)
from web/parts. Run from the repo root: python3 tools/build_web.py"""
import json, os, shutil, time
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(R, *a)
read = lambda *a: open(P(*a), encoding='utf8').read()
SITE = 'https://smkrot3-sudo.github.io/tsaad-katan/'
BUILD = int(time.time() * 1000)
css = read('web/parts/base.css') + read('web/parts/extra.css')
body = read('web/parts/body.html')
app = read('web/parts/app.js')
local_fonts = '''<style>
@font-face{font-family:"Varela Round";src:url(fonts/varela-round-hebrew-400-normal.woff2) format("woff2");unicode-range:U+0590-05FF,U+200C-2010,U+20AA,U+25CC,U+FB1D-FB4F;font-display:swap}
@font-face{font-family:"Varela Round";src:url(fonts/varela-round-latin-400-normal.woff2) format("woff2");font-display:swap}
@font-face{font-family:"Suez One";src:url(fonts/suez-one-hebrew-400-normal.woff2) format("woff2");unicode-range:U+0590-05FF,U+200C-2010,U+20AA,U+25CC,U+FB1D-FB4F;font-display:swap}
@font-face{font-family:"Suez One";src:url(fonts/suez-one-latin-400-normal.woff2) format("woff2");font-display:swap}
</style>'''

# 1. preview for the Claude artifact: app only, no cloud
google_fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Suez+One&family=Varela+Round&display=swap">'
open(P('web/preview.html'), 'w', encoding='utf8').write(
    f'<title>צעד קטן</title>\n{google_fonts}\n<style>\n{css}</style>\n{body}<script>\n{app}</script>\n')

# 2. the site
def page(asset_prefix=''):
    return f'''<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>צעד קטן · כל צעד נחשב</title>
<meta name="description" content="אפליקציה רכה ומכילה למטרות קטנות ולרשימת היום. כל צעד נחשב.">
<meta name="theme-color" content="#FFF7EF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1D1A26" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta property="og:title" content="צעד קטן"><meta property="og:description" content="כל צעד נחשב 🌱"><meta property="og:image" content="{SITE}icons/icon-512.png">
{local_fonts}
<style>
{css}</style>
</head>
<body>
{body}<script>window.TK_SITE={json.dumps(SITE)};window.TK_BUILD={BUILD};</script>
<script>
{app}</script>
<script src="vendor/supabase.js"></script>
<script>
{read('web/parts/cloud.js')}</script>
<script>
{read('web/parts/native.js')}</script>
<script>
{read('web/parts/ai.js')}</script>
<script>
{read('web/parts/donate.js')}</script>
<script>
if('serviceWorker' in navigator&&location.protocol==='https:')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{{}}));
</script>
</body>
</html>
'''
# maintenance switch: while web/maintenance.on exists, the site (and so the APK) shows only a 'temporarily unavailable' page
MAINT = os.path.exists(P('web/maintenance.on'))
open(P('docs/index.html'), 'w', encoding='utf8').write(
    read('web/maintenance.html').replace('__FONTS__', local_fonts) if MAINT else page())
sw = read('web/sw.js').replace('__BUILD__', str(BUILD))
open(P('docs/sw.js'), 'w', encoding='utf8').write(sw)

# 3. offline copy inside the APK (used only when the site can't load)
a = P('android/assets')
shutil.rmtree(a, ignore_errors=True)
os.makedirs(a + '/fonts'); os.makedirs(a + '/vendor')
for f in os.listdir(P('docs/fonts')): shutil.copy(P('docs/fonts', f), a + '/fonts/')
for f in os.listdir(P('docs/vendor')): shutil.copy(P('docs/vendor', f), a + '/vendor/')
open(a + '/index.html', 'w', encoding='utf8').write(page())
shutil.copy(P('android/migrate.html'), a + '/migrate.html')
print('built', BUILD, '(MAINTENANCE)' if MAINT else '')
