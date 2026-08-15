import os
import sys
import subprocess

# Ensure Pillow is installed
try:
    from PIL import Image
except ImportError:
    print("Pillow library not found. Installing it now...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow"])
    from PIL import Image

WORKSPACE_DIR = r"d:\websites client\safar silsila travel agency"
IMAGES_DIR = os.path.join(WORKSPACE_DIR, "transport images")

# Mapping from local JPEGs to target WebP filenames
IMAGE_MAPPING = {
    "transport_5c coaster.jpeg": "transport_5c_coaster.webp",
    "transport_4c coaster.jpeg": "transport_4c_coaster.webp",
    "transport_grandcabin.jpeg": "transport_grandcabin.webp",
    "transport_hiace_standard.jpeg": "transport_hiace_standard.webp",
    "transport_prado.jpeg": "transport_prado.webp",
    "transport_fortuner.jpeg": "transport_fortuner.webp",
    "transport_brv.jpeg": "transport_brv.webp",
    "transport_apv.jpeg": "transport_apv.webp",
    "transport_civic.jpeg": "transport_civic.webp",
    "transport_corolla.jpeg": "transport_corolla.webp",
    "transport_cultus.jpeg": "transport_cultus.webp",
    "transport_alto.jpeg": "transport_alto.webp"
}

def process_images():
    print("Starting local vehicle image optimization...")
    if not os.path.exists(IMAGES_DIR):
        print(f"Error: Transport images folder not found at {IMAGES_DIR}")
        return

    for src_name, dest_name in IMAGE_MAPPING.items():
        src_path = os.path.join(IMAGES_DIR, src_name)
        dest_path = os.path.join(IMAGES_DIR, dest_name)

        if not os.path.exists(src_path):
            print(f"Warning: Source image not found: {src_path}")
            continue

        try:
            with Image.open(src_path) as img:
                # Calculate new size maintaining aspect ratio
                width, height = img.size
                if width > 800:
                    ratio = 800 / float(width)
                    new_height = int(height * ratio)
                    img = img.resize((800, new_height), Image.Resampling.LANCZOS)
                    print(f"Resized {dest_name} to width 800px")
                
                # Convert to RGB if necessary
                if img.mode not in ("RGB", "RGBA"):
                    img = img.convert("RGB")

                # Save as WebP
                img.save(dest_path, "WEBP", quality=75)
                
                original_size = os.path.getsize(src_path) / 1024.0
                new_size = os.path.getsize(dest_path) / 1024.0
                print(f"Optimized {dest_name}: {original_size:.1f} KB -> {new_size:.1f} KB")
        except Exception as e:
            print(f"Error processing {src_name}: {e}")

    print("\nOptimization complete! All vehicle WebP files generated in 'transport images' folder.")
    print("Refresh your HTML page to view the custom images.")

if __name__ == "__main__":
    process_images()
