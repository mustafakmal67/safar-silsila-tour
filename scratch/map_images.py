import os
import re
import shutil

# Read AI_IMAGE_GENERATION_PROMPTS.md
with open('AI_IMAGE_GENERATION_PROMPTS.md', 'r', encoding='utf-8') as f:
    content = f.read()

entries = []
current_section = ""

lines = content.splitlines()
for line in lines:
    if line.startswith('## '):
        current_section = line.strip()
    m_full = re.search(r'\d+\.\s+\*\*`([^`]+)`\*\*\s*(?:\(([^)]+)\))?(?::\s*`([^`]+)`)?', line)
    if m_full:
        target_path = m_full.group(1)
        title = m_full.group(2) or ""
        prompt = m_full.group(3) or ""
        entries.append({
            'section': current_section,
            'target': target_path,
            'title': title,
            'prompt': prompt,
            'raw': line
        })

# Fill missing prompts/titles from adjacent lines
for i, entry in enumerate(entries):
    if not entry['prompt']:
        idx = content.find(entry['target'])
        if idx != -1:
            snippet = content[idx:idx+400]
            m_p = re.search(r'Prompt:\s*`([^`]+)`', snippet, re.IGNORECASE)
            if m_p:
                entry['prompt'] = m_p.group(1)
            m_t = re.search(r'\*?\*? Destination:\*?\*?\s*(.+)', snippet, re.IGNORECASE)
            if m_t:
                entry['title'] = m_t.group(1).strip()

dir_files = sorted(os.listdir('international images'))

print(f"Total catalog entries: {len(entries)}")
print(f"Total image files in folder: {len(dir_files)}")

def clean_words(text):
    return set(re.findall(r'[a-zA-Z0-9]+', text.lower()))

# Score matrix between each file and each entry
scores = []
for f_idx, fname in enumerate(dir_files):
    fname_clean = re.sub(r'_\d{12}\.jpeg$', '', fname, flags=re.IGNORECASE).lower()
    f_words = set(re.findall(r'[a-zA-Z0-9]+', fname_clean))
    
    for e_idx, entry in enumerate(entries):
        target = entry['target']
        title = entry['title']
        prompt = entry['prompt']

        combined_text = (target + " " + title + " " + prompt).lower()
        e_words = set(re.findall(r'[a-zA-Z0-9]+', combined_text))

        # Check prefix match
        fname_prefix = fname_clean.replace('_', '').replace('-', '')
        combined_prefix = combined_text.replace('_', '').replace('-', '').replace(' ', '')
        
        score = 0
        overlap = len(f_words.intersection(e_words))
        score += overlap * 10
        
        # Give huge priority if key words from file name match target/title/prompt
        if fname_clean and fname_clean in combined_text:
            score += 100
        
        scores.append((score, f_idx, e_idx))

# Sort by highest score first
scores.sort(key=lambda x: x[0], reverse=True)

assigned_files = set()
assigned_entries = set()
mapping = {}

for score, f_idx, e_idx in scores:
    if f_idx not in assigned_files and e_idx not in assigned_entries:
        assigned_files.add(f_idx)
        assigned_entries.add(e_idx)
        mapping[e_idx] = f_idx

print(f"Mapped {len(mapping)} entries out of {len(entries)}")

unassigned_entries = [i for i in range(len(entries)) if i not in assigned_entries]
if unassigned_entries:
    print("Unassigned entries:")
    for idx in unassigned_entries:
        print(entries[idx]['target'], "|", entries[idx]['title'])

# Perform file copying and replacement!
# Destination images go to:
# - root for root files (e.g. international_travelers.webp, pakistan_visa_help.webp, etc.)
# - images/festivals/card_X.webp
# - images/foreign/card_X.webp
# - images/city-tours/card_X.webp
# - images/north/card_X.webp

copied_count = 0
for e_idx, f_idx in mapping.items():
    entry = entries[e_idx]
    fname = dir_files[f_idx]
    
    src_path = os.path.join('international images', fname)
    dest_rel_path = entry['target']
    dest_path = os.path.join('d:\\websites client\\safar silsila travel agency', dest_rel_path)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    
    # Copy file over
    shutil.copy2(src_path, dest_path)
    copied_count += 1

print(f"Successfully copied/updated {copied_count} images to target paths!")
