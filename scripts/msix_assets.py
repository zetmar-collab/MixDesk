"""Generate the required MSIX tiles from MixDesk's original icon."""
from pathlib import Path
import sys
from PIL import Image

source = Path(__file__).resolve().parents[1] / 'assets' / 'mixdesk.png'
target = Path(sys.argv[1]).resolve()
target.mkdir(parents=True, exist_ok=True)
logo = Image.open(source).convert('RGBA')

def tile(name: str, width: int, height: int, icon_size: int) -> None:
    canvas = Image.new('RGBA', (width, height), '#11141b')
    mark = logo.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    canvas.alpha_composite(mark, ((width-icon_size)//2, (height-icon_size)//2))
    canvas.save(target / name, format='PNG', optimize=True)

tile('StoreLogo.png', 50, 50, 42)
tile('Square44x44Logo.png', 44, 44, 40)
tile('Square150x150Logo.png', 150, 150, 120)
tile('Wide310x150Logo.png', 310, 150, 118)
tile('SplashScreen.png', 620, 300, 204)
