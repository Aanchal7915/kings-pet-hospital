import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import axios from 'axios'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'seo-transform',
      async transformIndexHtml(html, ctx) {
        // Skip transformation during build so placeholders remain for the backend to inject
        if (command === 'build') return html;

        const url = (ctx.originalUrl || '/').split('?')[0];
        const pathParts = url.split('/').filter(p => p);
        const firstPart = pathParts[0]?.toLowerCase() || 'home';
        const section = firstPart.trim();

        let title = 'Kings Pet Hospital | Trusted Pet Care';
        let description = 'Professional pet care services and expert veterinarians.';
        let keywords = 'Kings Pet Hospital, Veterinary';

        try {
          // Individual Blog Post SEO override
          if (firstPart === 'blog' && pathParts[1]) {
            try {
              const blogResponse = await axios.get(`http://localhost:5000/api/blogs/${pathParts[1]}`);
              const blog = blogResponse.data?.data;
              if (blog) {
                title = blog.metaTitle || blog.title || title;
                description = blog.metaDescription || blog.description || description;
                keywords = blog.metaKeywords || blog.keywords || keywords;
              }
            } catch (_) { /* fall through to PageSEO */ }
          }

          // Individual Service slug SEO override
          if (firstPart === 'services' && pathParts[1]) {
            try {
              const serviceRes = await axios.get(`http://localhost:5000/api/catalog/services/slug/${pathParts[1]}`);
              const svc = serviceRes.data?.data;
              if (svc) {
                title = `${svc.name} | Kings Pet Hospital`;
                description = (svc.description || description).substring(0, 160);
              }
            } catch (_) { /* fall through */ }
          }

          // PageSEO match (case-insensitive, also try space variant)
          const response = await axios.get('http://localhost:5000/api/seo');
          const list = response.data?.data || [];
          const sectionLower = section.toLowerCase();
          const sectionSpaced = sectionLower.replace(/-/g, ' ');
          const seoData = list.find(item => {
            const s = String(item.section || '').toLowerCase();
            return s === sectionLower || s === sectionSpaced;
          });
          if (seoData) {
            title = seoData.title || title;
            description = seoData.metaDescription || seoData.description || description;
            keywords = seoData.metaKeywords || seoData.seoText || keywords;
          }
        } catch (_) {
          console.log('Vite SEO Dev Plugin: Backend not reachable, using defaults.');
        }

        const protocol = ctx.server?.config?.server?.https ? 'https' : 'http';
        const host = ctx.req?.headers?.host || 'localhost:5173';
        const canonical = `${protocol}://${host}${url}`;

        return html
          .replace(/{{SEO_TITLE}}/g, title)
          .replace(/{{SEO_DESCRIPTION}}/g, description || '')
          .replace(/{{SEO_KEYWORDS}}/g, keywords || '')
          .replace(/{{SEO_CANONICAL}}/g, canonical);
      }
    }
  ]
}))

