const fs = require('fs');
const path = require('path');

let tourData = null;
function getTourData() {
  if (!tourData) {
    try {
      const tourFile = fs.readFileSync(path.join(process.cwd(), 'tour-data.js'), 'utf8');
      const windowObj = {};
      const fn = new Function('window', tourFile);
      fn(windowObj);
      tourData = windowObj.TOUR_DATA || {};
    } catch (e) {
      console.error('Error loading tour-data.js:', e);
      tourData = {};
    }
  }
  return tourData;
}

module.exports = async (req, res) => {
  try {
    const tours = getTourData();
    const tourId = req.query.tour;
    const tour = tourId ? tours[tourId] : null;

    const templatePath = path.join(process.cwd(), 'tour-details.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'safarsilsila.pk';
    const baseUrl = `${proto}://${host}`;

    let title = "Tour Details | Safar Silsila";
    let description = "Explore detailed itineraries and booking options for Safar Silsila tours. Custom and group departures available.";
    let imageUrl = `${baseUrl}/api/og-image?img=bg_image.webp`;
    let pageUrl = `${baseUrl}/tour-details.html`;

    if (tour) {
      title = `${tour.title} | Safar Silsila`;
      if (tour.about) {
        let cleanAbout = tour.about.replace(/<[^>]*>?/gm, '').trim();
        if (cleanAbout.length > 200) {
          cleanAbout = cleanAbout.substring(0, 197) + '...';
        }
        description = cleanAbout;
      }
      imageUrl = `${baseUrl}/api/og-image?tour=${encodeURIComponent(tour.id)}&img=${encodeURIComponent(tour.image)}`;
      pageUrl = `${baseUrl}/tour-details.html?tour=${encodeURIComponent(tour.id)}`;
    }

    // Replace basic tags
    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
    html = html.replace(/<meta name="description" id="meta-description" content=".*?">/i, `<meta name="description" id="meta-description" content="${escapeHtml(description)}">`);
    html = html.replace(/<link rel="canonical" id="canonical-link" href=".*?">/i, `<link rel="canonical" id="canonical-link" href="${escapeHtml(pageUrl)}">`);

    // Replace OpenGraph tags
    html = html.replace(/<meta property="og:title" id="og-title" content=".*?">/i, `<meta property="og:title" id="og-title" content="${escapeHtml(title)}">`);
    html = html.replace(/<meta property="og:description" id="og-description" content=".*?">/i, `<meta property="og:description" id="og-description" content="${escapeHtml(description)}">`);
    html = html.replace(/<meta property="og:image" id="og-image" content=".*?">/i, 
      `<meta property="og:image" id="og-image" content="${escapeHtml(imageUrl)}">\n  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">\n  <meta property="og:image:type" content="image/jpeg">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">`);
    html = html.replace(/<meta property="og:url" id="og-url" content=".*?">/i, `<meta property="og:url" id="og-url" content="${escapeHtml(pageUrl)}">`);

    // Replace Twitter tags
    html = html.replace(/<meta name="twitter:title" id="twitter-title" content=".*?">/i, `<meta name="twitter:title" id="twitter-title" content="${escapeHtml(title)}">`);
    html = html.replace(/<meta name="twitter:description" id="twitter-description" content=".*?">/i, `<meta name="twitter:description" id="twitter-description" content="${escapeHtml(description)}">`);
    html = html.replace(/<meta name="twitter:image" id="twitter-image" content=".*?">/i, `<meta name="twitter:image" id="twitter-image" content="${escapeHtml(imageUrl)}">`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(html);
  } catch (err) {
    console.error('Error handling tour details route:', err);
    res.status(500).send('Internal Server Error');
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
