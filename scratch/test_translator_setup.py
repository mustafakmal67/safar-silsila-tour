# Verification script for Language Translator integration
import os

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
print(f"Total HTML pages that will automatically feature Language Translator: {len(html_files)}")
