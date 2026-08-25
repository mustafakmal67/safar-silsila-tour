import os
from glob import glob

html_files = glob('*.html')
missing = []
total_imgs = 0

for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple extraction of src="..." or src='...'
    import re
    srcs = re.findall(r'src=["\']([^"\']+)["\']', content)
    for src in srcs:
        if src.startswith('http') or src.startswith('//') or src.endswith('.js') or src.endswith('.css'):
            continue
        total_imgs += 1
        clean_src = src.split('?')[0].split('#')[0]
        if not os.path.exists(clean_src):
            missing.append((hf, src))

print(f"Checked {total_imgs} local image links across {len(html_files)} HTML pages.")
if missing:
    print(f"FOUND {len(missing)} MISSING IMAGES:")
    for hf, src in missing:
        print(f"  {hf} -> {src}")
else:
    print("ALL IMAGE LINKS ARE VALID AND ACCESSIBLE! 100% PERFECT!")
