import os
from glob import glob
import re

pages = ['festivals.html', 'foreign-group-trips.html', 'city-tours.html', 'north-tours.html']

for page in pages:
    with open(page, 'r', encoding='utf-8') as f:
        html = f.read()
    
    cards = re.findall(r'<article class="tour-card[^"]*".*?</article>', html, re.DOTALL)
    print(f"=== {page}: {len(cards)} tour cards ===")
    for idx, card in enumerate(cards[:5]): # print first 5 per page
        img_m = re.search(r'src="([^"]+)"', card)
        title_m = re.search(r'<h3 class="tour-title"[^>]*>(.*?)</h3>', card, re.DOTALL)
        
        img_src = img_m.group(1) if img_m else 'N/A'
        title_text = re.sub(r'<[^>]+>', '', title_m.group(1)).strip() if title_m else 'N/A'
        
        exists = os.path.exists(img_src)
        print(f"  [{idx+1}] {title_text[:40]} -> {img_src} (Exists: {exists})")
