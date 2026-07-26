#!/bin/zsh
# Bakes the hover previews for prose links. Re-run when a prose link is added.
# Chrome shoots most sites; microlink gets through the WAFs that block headless.
# File names mirror shotSrc() in composables/useLinkPreview.js.
set -e
cd "$(dirname "$0")"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SITE="https://upamanyu.in"
TMP=$(mktemp -t linkpreview).png

LINKS=(
  "chrome    https://sirjjsaad.edu.in"
  "chrome    https://www.nid.edu"
  "microlink https://in.bookmyshow.com/explore/home/mumbai"
  "chrome    https://www.cleartrip.com"
  "microlink https://www.tmnz.co.nz"
  "chrome    $SITE/films/aforestsdream/"
  "chrome    $SITE/films/thebirdsofplay/"
)

name() {
  python3 - "$1" "$SITE" <<'PY'
import re, sys
from urllib.parse import urlparse
url, site = urlparse(sys.argv[1]), urlparse(sys.argv[2])
host = '' if url.netloc == site.netloc else url.hostname
print(re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', (host + url.path).lower())))
PY
}

for link in $LINKS; do
  src=${link%% *}
  url=${link##* }
  out=$(name $url).jpg

  if [[ $src == chrome ]]; then
    "$CHROME" --headless --disable-gpu --hide-scrollbars \
      --window-size=1280,800 --virtual-time-budget=8000 \
      --screenshot=$TMP $url 2>/dev/null
  else
    encoded=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1],safe=""))' $url)
    curl -sfL -o $TMP "https://api.microlink.io/?url=$encoded&screenshot=true&meta=false&embed=screenshot.url"
  fi

  sips --resampleWidth 640 -s format jpeg -s formatOptions 72 $TMP --out $out >/dev/null
  echo "$out  ←  $url"
done

rm -f $TMP
