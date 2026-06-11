#!/usr/bin/env python3
"""Generate the PWA icons (stopwatch + lightning bolt) into src/icons/.

Requires Pillow:  uv venv .venv && source .venv/bin/activate && uv pip install Pillow
"""
import os

from PIL import Image, ImageDraw

BG = '#1a1a2e'      # matches --color-bg (dark theme)
RING = '#eeeeee'    # matches --color-text (dark theme)
BOLT = '#e74c3c'    # matches --color-work

# Draw at 1024 then downscale for crisp edges.
# Full-bleed square: iOS rounds the corners itself, and the artwork stays
# inside the center 80% safe zone required by Android maskable icons.
S = 1024
img = Image.new('RGB', (S, S), BG)
d = ImageDraw.Draw(img)

# Stopwatch stem (top button)
d.rounded_rectangle([432, 116, 592, 220], radius=28, fill=RING)

# Stopwatch ring: outer circle, then punch the inner disc with bg color
cx, cy, r_out, r_in = 512, 576, 312, 256
d.ellipse([cx - r_out, cy - r_out, cx + r_out, cy + r_out], fill=RING)
d.ellipse([cx - r_in, cy - r_in, cx + r_in, cy + r_in], fill=BG)

# Lightning bolt
d.polygon([(560, 380), (420, 620), (512, 620), (464, 790), (604, 560), (512, 560)], fill=BOLT)

out_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'icons')
os.makedirs(out_dir, exist_ok=True)
for size, name in [(512, 'icon-512.png'), (192, 'icon-192.png'), (180, 'apple-touch-icon.png')]:
    path = os.path.join(out_dir, name)
    img.resize((size, size), Image.LANCZOS).save(path, optimize=True)
    print(f'{name}: {os.path.getsize(path)} bytes')
