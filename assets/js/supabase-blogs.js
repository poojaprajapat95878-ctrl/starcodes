// supabase-blogs.js

document.addEventListener('DOMContentLoaded', async () => {
  const SUPABASE_URL = 'https://mqjnlctdmponvxmkucoa.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xam5sY3RkbXBvbnZ4bWt1Y29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTY3NTEsImV4cCI6MjA3NjA5Mjc1MX0.zBshZBeC44aRehc0B27QrBiW4QlNL2SCgv0Y7X7Zdw8';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Supabase library not loaded. Make sure the CDN script is included before this file.');
    return;
  }
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Helper to format date
  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return iso; }
  };

  async function fetchBlogs(limit = null) {
    try {
      let query = supabaseClient.from('blogs').select('*').order('created_at', { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching blogs:', err);
      return null;
    }
  }

  function renderBlogCard(blog) {
    const image = blog.imageUrl || 'assets/images/blog/blog-img-1.jpg';
    const author = blog.author || 'Starcode Team';
    const date = fmtDate(blog.created_at || blog.published_at || new Date().toISOString());
    const title = blog.title || 'Untitled Post';
    const slug = blog.slug || blog.id || '#';
    const link = blog.link || `blog-details.html?id=${slug}`;

    return `
      <div class="col-lg-4 col-md-6 col-sm-6">
        <div class="blog-card tmp-hover-link image-box-hover tmp-scroll-trigger tmp-fade-in">
          <div class="img-box">
            <a href="${link}">
              <img class="w-100" src="${image}" alt="Blog Thumbnail">
            </a>
            <ul class="blog-tags">
              <li><span class="tag-icon"><i class="fa-regular fa-user"></i></span>${author}</li>
              <li><span class="tag-icon"><i class="fa-solid fa-calendar-days"></i></span>${date}</li>
            </ul>
          </div>
          <div class="blog-content-wrap">
            <h3 class="blog-title"><a class="link" href="${link}">${title}</a></h3>
            <div class="more-btn tmp-link-animation">
              <a href="${link}" class="read-more-btn">Read More <span class="read-more-icon"><i class="fa-solid fa-angle-right"></i></span></a>
            </div>
          </div>
        </div>
      </div>`;
  }

  // Index page: render latest 3 if container exists
  const indexContainer = document.querySelector('.blog-and-news-are .row');
  if (indexContainer) {
    const blogs = await fetchBlogs(3);
    if (blogs && blogs.length) {
      indexContainer.innerHTML = '';
      blogs.forEach((b, i) => {
        const el = renderBlogCard(b);
        indexContainer.insertAdjacentHTML('beforeend', el);
      });
    }
  }

  // Blog page: render all in the blog-classic-area-wrapper
  const blogListContainer = document.querySelector('.blog-classic-area-wrapper .row');
  if (blogListContainer) {
    const blogs = await fetchBlogs();
    if (blogs && blogs.length) {
      blogListContainer.innerHTML = '';
      blogs.forEach((b, i) => {
        const el = renderBlogCard(b);
        blogListContainer.insertAdjacentHTML('beforeend', el);
      });
    }
  }

});
