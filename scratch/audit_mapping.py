import os
import re

# Load AI_IMAGE_GENERATION_PROMPTS.md
with open('AI_IMAGE_GENERATION_PROMPTS.md', 'r', encoding='utf-8') as f:
    prompt_text = f.read()

# Parse sections and items from prompt_text
# Structure of prompt_text:
# Section 1: international.html
# Section 2: festivals.html
# Section 3: foreign-group-trips.html
# Section 4: city-tours.html
# Section 5: north-tours.html
# Section 6: visa-help.html

lines = prompt_text.splitlines()

catalog = []
current_section = ""

i = 0
while i < len(lines):
    line = lines[i].strip()
    if line.startswith('## '):
        current_section = line
    
    # Check for card entry like: 1. **`images/festivals/card_1.webp`** (Shandur Polo Festival): `...`
    # or numbered items in section 1/6
    m_card = re.search(r'\d+\.\s+\*\*`([^`]+)`\*\*\s*(?:\(([^)]+)\))?(?::\s*`([^`]+)`)?', line)
    if m_card:
        target = m_card.group(1)
        title = m_card.group(2) or ""
        prompt = m_card.group(3) or ""
        
        # If prompt is empty, check next lines for Prompt: `...`
        if not prompt:
            j = i + 1
            while j < len(lines) and not lines[j].strip().startswith(('1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '##')):
                if 'Prompt:' in lines[j]:
                    pm = re.search(r'Prompt:\s*`([^`]+)`', lines[j])
                    if pm:
                        prompt = pm.group(1)
                elif 'Destination:' in lines[j]:
                    dm = re.search(r'Destination:\s*(.+)', lines[j])
                    if dm and not title:
                        title = dm.group(1).replace('*', '').strip()
                j += 1
        
        catalog.append({
            'section': current_section,
            'target': target,
            'title': title,
            'prompt': prompt,
            'raw_line': line
        })
    i += 1

print(f"Total items in catalog: {len(catalog)}")

dir_files = sorted(os.listdir('international images'))
print(f"Total files in international images/: {len(dir_files)}")

# Write catalog out to JSON for auditing
import json
with open('scratch/catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2)

with open('scratch/dir_files.json', 'w', encoding='utf-8') as f:
    json.dump(dir_files, f, indent=2)

print("Saved catalog.json and dir_files.json for detailed auditing.")
