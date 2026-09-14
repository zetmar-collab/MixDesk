"""Reproducible original MixDesk mark; no downloaded artwork or fonts."""
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1] / 'assets'
root.mkdir(exist_ok=True)
scale = 4
im = Image.new('RGBA', (256*scale, 256*scale), (0, 0, 0, 0))
d = ImageDraw.Draw(im)
def box(coords): return tuple(int(v*scale) for v in coords)
d.rounded_rectangle(box((8,8,248,248)), radius=56*scale, fill='#b7a0fa')
d.rounded_rectangle(box((20,20,236,236)), radius=47*scale, outline='#d2bfff', width=2*scale)
# A continuous waveform forms a small m, ending in the playback symbol.
points=[(53,161),(53,112),(70,93),(90,93),(107,112),(107,160),(107,112),(126,93),(147,93),(165,111),(165,159)]
d.line([(x*scale,y*scale) for x,y in points], fill='#272137', width=14*scale, joint='curve')
for x,y in [(53,161),(165,159)]: d.ellipse(box((x-7,y-7,x+7,y+7)), fill='#272137')
d.polygon([(184*scale,125*scale),(184*scale,164*scale),(210*scale,144*scale)], fill='#272137')
d.rounded_rectangle(box((77,185,164,193)), radius=4*scale, fill='#675281')
im = im.resize((256,256),Image.Resampling.LANCZOS)
im.save(root/'mixdesk.png')
im.save(root/'mixdesk.ico',sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])
