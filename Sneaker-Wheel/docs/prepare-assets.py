"""One-time asset preparation; the website itself has no Python dependency.
Requires Pillow and rembg[cpu]. Pass the original generated atlas as argument.
"""
import sys
from pathlib import Path
from PIL import Image, PngImagePlugin
from rembg import remove, new_session

root = Path(__file__).resolve().parents[1]
source = Image.open(sys.argv[1]).convert('RGB')
session = new_session('u2net')
atlas = Image.new('RGBA', (1536, 1024))
for i in range(6):
    x, y = i % 2 * 768, i // 2 * 1024 // 3
    bottom = (i // 2 + 1) * 1024 // 3
    cut = remove(source.crop((x, y, x + 768, bottom)), session=session)
    atlas.alpha_composite(cut, (x,y))
    print('Extracted colorway', i + 1, flush=True)
meta = PngImagePlugin.PngInfo()
meta.add_text('Source', 'Original sneaker atlas generated with built-in Imagegen on 2026-09-10; local rembg extraction authorized by the user.')
meta.add_text('Prompt', (root/'docs/asset-prompt.txt').read_text(encoding='utf-8'))
atlas.save(root/'assets/sneakers.png', pnginfo=meta, optimize=True)
print('Saved RGBA atlas:', atlas.size, atlas.getchannel('A').getextrema(), flush=True)
