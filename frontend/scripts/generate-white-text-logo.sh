#!/usr/bin/env bash
set -euo pipefail
# Generate a white-text variant from logo.png using ImageMagick
# Usage: ./scripts/generate-white-text-logo.sh [input] [output]
# Defaults: input=frontend/public/assets/images/logo.png
#           output=frontend/public/assets/images/logo-text-white.png

INPUT=${1:-"$(dirname "$0")/../public/assets/images/logo.png"}
OUTPUT=${2:-"$(dirname "$0")/../public/assets/images/logo-text-white.png"}

if ! command -v magick >/dev/null 2>&1 && ! command -v convert >/dev/null 2>&1; then
  echo "Error: ImageMagick is required (magick/convert not found)." >&2
  exit 1
fi

# Prefer 'magick' if available
tool="magick"
command -v magick >/dev/null 2>&1 || tool="convert"

# Replace near-black by white while preserving alpha
"$tool" "$INPUT" -fuzz 15% -fill white -opaque black -alpha on -channel A -evaluate set 100% +channel "$OUTPUT"

echo "Generated: $OUTPUT"
