#!/bin/sh
# Renders the scene-6 mock-ups to PNG with headless Chrome (no Playwright needed). Run from this directory.
# Heights are per page so nothing is cut off; adjust if you change the content.
set -e
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
render() { "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1280,$2 --screenshot="$PWD/$1.png" "file://$PWD/$1.html" >/dev/null 2>&1; echo "rendered $1.png (1280x$2)"; }
render 1-deal-memo 1150
render 2-settlement-sheet 1200
render 3-payout-split 1130
