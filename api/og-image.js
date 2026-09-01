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
    const tourId = req.query.tour || req.query.id;
    const blogId = req.query.blog || req.query.id;

    if (!imgName && tourId) {
      const norm = String(tourId).toLowerCase().trim();
      const tour = tourData[tourId] || Object.values(tourData).find(t => t.id && t.id.toLowerCase() === norm);
      if (tour) imgName = tour.image;
    }
    if (!imgName && blogId) {
      const norm = String(blogId).toLowerCase().trim();
      const blog = blogData[blogId] || Object.values(blogData).find(b => b.id && b.id.toLowerCase() === norm);
      if (blog) imgName = blog.image;
    }
    if (!imgName) {
      imgName = 'bg_image.jpg';
    }

    const baseJpg = path.basename(imgName, path.extname(imgName)) + '.jpg';
    const preRenderedPath = path.join(process.cwd(), 'og-images', baseJpg);

    if (fs.existsSync(preRenderedPath)) {
      const buf = fs.readFileSync(preRenderedPath);
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.status(200).send(buf);
      return;
    }

    // Fallback: search source images and convert on the fly
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
      const defaultJpg = path.join(process.cwd(), 'og-images', 'bg_image.jpg');
      if (fs.existsSync(defaultJpg)) {
        const buf = fs.readFileSync(defaultJpg);
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.status(200).send(buf);
        return;
      }
      res.status(404).send('Image not found');
      return;
    }

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
