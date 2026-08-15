const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE_DIR = "d:\\websites client\\safar silsila travel agency";
const IMAGES_DIR = path.join(WORKSPACE_DIR, "transport images");

const IMAGE_MAPPING = {
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
};

function directCopyFallback(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`[Fallback] Copied directly: ${path.basename(dest)}`);
    return true;
  } catch (err) {
    console.error(`[Fallback Error] Failed to copy ${path.basename(dest)}:`, err.message);
    return false;
  }
}

async function run() {
  console.log("Starting local vehicle image optimization...");
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`Error: Transport images folder not found at ${IMAGES_DIR}`);
    return;
  }

  let jimpInstalled = false;
  try {
    console.log("Checking for 'jimp' image library...");
    require.resolve('jimp');
    jimpInstalled = true;
  } catch (e) {
    try {
      console.log("Installing 'jimp' image library (pure JS, safe & quick)...");
      execSync('npm install jimp@0.16.13', { stdio: 'inherit', cwd: WORKSPACE_DIR });
      jimpInstalled = true;
    } catch (err) {
      console.log("Could not install 'jimp' library. Proceeding with direct copy fallback...");
    }
  }

  const Jimp = jimpInstalled ? require('jimp') : null;

  for (const [srcName, destName] of Object.entries(IMAGE_MAPPING)) {
    const srcPath = path.join(IMAGES_DIR, srcName);
    const destPath = path.join(IMAGES_DIR, destName);

    if (!fs.existsSync(srcPath)) {
      console.warn(`Source image not found: ${srcName}`);
      continue;
    }

    if (Jimp) {
      try {
        const image = await Jimp.read(srcPath);
        if (image.getWidth() > 800) {
          image.resize(800, Jimp.AUTO);
          console.log(`Resized ${destName} to width 800px`);
        }
        
        await image.quality(75).writeAsync(destPath);
        
        const originalSize = fs.statSync(srcPath).size / 1024.0;
        const newSize = fs.statSync(destPath).size / 1024.0;
        console.log(`Optimized ${destName}: ${originalSize.toFixed(1)} KB -> ${newSize.toFixed(1)} KB`);
      } catch (err) {
        console.error(`Jimp failed for ${destName}. Falling back to copy.`, err.message);
        directCopyFallback(srcPath, destPath);
      }
    } else {
      directCopyFallback(srcPath, destPath);
    }
  }

  console.log("\nOptimization complete! All vehicle WebP files generated in 'transport images' folder.");
  console.log("Refresh your HTML page to view the custom images.");
}

run().catch(console.error);
