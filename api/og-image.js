const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

let tourData = null;
let blogData = null;

function loadData() {
  if (!tourData) {
    try {
      const tourFile = fs.readFileSync(path.join(process.cwd(), 'tour-data.js'), 'utf8');
      const windowObj = {};
      const fn = new Function('window', tourFile);
      fn(windowObj);
      tourData = windowObj.TOUR_DATA || {};
    } catch (e) {
      tourData = {};
    }
  }
  if (!blogData) {
    try {
      const blogFile = fs.readFileSync(path.join(process.cwd(), 'blog-data.js'), 'utf8');
      const windowObj = {};
      const fn = new Function('window', blogFile);
      fn(windowObj);
      blogData = windowObj.BLOG_DATA || {};
    } catch (e) {
      blogData = {};
    }
  }
}

module.exports = async (req, res) => {
  try {
    loadData();
    let imgName = req.query.img;
    const tourId = req.query.tour;
    const blogId = req.query.blog || req.query.id;

    if (!imgName && tourId && tourData[tourId]) {
      imgName = tourData[tourId].image;
    }
    if (!imgName && blogId && blogData[blogId]) {
      imgName = blogData[blogId].image;
    }
    if (!imgName) {
      imgName = 'bg_image.webp';
    }

    // Try finding the image file in the project
    const possiblePaths = [
      path.join(process.cwd(), imgName),
      path.join(process.cwd(), 'images', imgName),
      path.join(__dirname, '..', imgName),
      path.join(__dirname, '..', 'images', imgName)
    ];

    let foundPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        foundPath = p;
        break;
      }
    }

    if (!foundPath) {
      for (const p of [
        path.join(process.cwd(), 'bg_image.webp'),
        path.join(process.cwd(), 'logo-square.webp')
      ]) {
        if (fs.existsSync(p)) {
          foundPath = p;
          break;
        }
      }
    }

    if (!foundPath) {
      res.status(404).send('Image not found');
      return;
    }

    // Resize and crop to 1200x630 (standard 1.91:1 Open Graph aspect ratio) and output as high-quality JPEG
    const jpegBuffer = await sharp(foundPath)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(jpegBuffer);
  } catch (err) {
    console.error('Error generating OG image:', err);
    res.status(500).send('Internal Server Error');
  }
};
