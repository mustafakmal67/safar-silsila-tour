const fs = require('fs');
const path = require('path');

let blogData = null;
function getBlogData() {
  if (!blogData) {
    try {
      const blogFile = fs.readFileSync(path.join(process.cwd(), 'blog-data.js'), 'utf8');
      const windowObj = {};
      const fn = new Function('window', blogFile);
      fn(windowObj);
      blogData = windowObj.BLOG_DATA || {};
    } catch (e) {
      console.error('Error loading blog-data.js:', e);
      blogData = {};
    }
  }
  return blogData;
}

module.exports = async (req, res) => {
  try {
    const blogs = getBlogData();
    const blogId = req.query.id || req.query.blog;
    const blog = blogId ? blogs[blogId] : null;

    const templatePath = path.join(process.cwd(), 'blog-details.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'safarsilsila.pk';
    const baseUrl = `${proto}://${host}`;

    let title = "Blog | Safar Silsila";
    let description = "Read travel guides, tips, and itineraries for Pakistan tours with Safar Silsila.";
    let imageUrl = `${baseUrl}/api/og-image?img=bg_image.webp`;
    let pageUrl = `${baseUrl}/blog-details.html`;

    if (blog) {
      title = `${blog.title} | Safar Silsila`;
      description = blog.metaDesc || blog.summary || description;
      imageUrl = `${baseUrl}/api/og-image?blog=${encodeURIComponent(blog.id)}&img=${encodeURIComponent(blog.image)}`;
      pageUrl = `${baseUrl}/blog-details.html?id=${encodeURIComponent(blog.id)}`;
    }

    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
    html = html.replace(/<meta name="description" id="meta-description" content=".*?">/i, `<meta name="description" id="meta-description" content="${escapeHtml(description)}">`);
    html = html.replace(/<link rel="canonical" id="canonical-link" href=".*?">/i, `<link rel="canonical" id="canonical-link" href="${escapeHtml(pageUrl)}">`);

    html = html.replace(/<meta property="og:title" id="og-title" content=".*?">/i, `<meta property="og:title" id="og-title" content="${escapeHtml(title)}">`);
    html = html.replace(/<meta property="og:description" id="og-description" content=".*?">/i, `<meta property="og:description" id="og-description" content="${escapeHtml(description)}">`);
    html = html.replace(/<meta property="og:image" id="og-image" content=".*?">/i, 
      `<meta property="og:image" id="og-image" content="${escapeHtml(imageUrl)}">\n  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">\n  <meta property="og:image:type" content="image/jpeg">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">`);
    html = html.replace(/<meta property="og:url" id="og-url" content=".*?">/i, `<meta property="og:url" id="og-url" content="${escapeHtml(pageUrl)}">`);

    html = html.replace(/<meta name="twitter:title" id="twitter-title" content=".*?">/i, `<meta name="twitter:title" id="twitter-title" content="${escapeHtml(title)}">`);
    html = html.replace(/<meta name="twitter:description" id="twitter-description" content=".*?">/i, `<meta name="twitter:description" id="twitter-description" content="${escapeHtml(description)}">`);
    html = html.replace(/<meta name="twitter:image" id="twitter-image" content=".*?">/i, `<meta name="twitter:image" id="twitter-image" content="${escapeHtml(imageUrl)}">`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(html);
  } catch (err) {
    console.error('Error handling blog details route:', err);
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
