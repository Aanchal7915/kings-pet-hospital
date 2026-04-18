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

        const url = ctx.originalUrl || '/';
        const pathParts = url.split('/').filter(p => p);
        let section = 'home';
        
        // 1. Identify Section based on URL (Mapping Paths to Admin Sections)
        if (url === '/' || url === '' || pathParts.length === 0) {
            section = 'home';
        } else {
            const firstPart = pathParts[0];
            // Match to known sections
            const validSections = ['services', 'gallery', 'about', 'team', 'blog', 'booking', 'contact', 'pets-care', 'privacy', 'terms'];
            if (validSections.includes(firstPart)) {
                section = firstPart;
            } else {
                section = 'home'; // Default
            }
        }

        try {
          const response = await axios.get('http://localhost:5000/api/seo');
          const seoDataRes = response.data;
          let seoData = seoDataRes.data.find(item => item.section === section);
          
          let title = seoData?.title || 'Kings Pet Hospital | Trusted Pet Care';
          let description = seoData?.metaDescription || 'Professional pet care services and expert veterinarians.';
          let keywords = seoData?.seoText || 'Kings Pet Hospital, Veterinary';

          // Handle Individual Blog Post SEO
          if (url.startsWith('/blog/') && url.length > 6) {
            const blogId = url.split('/')[2];
            try {
              const blogResponse = await axios.get(`http://localhost:5000/api/blogs/${blogId}`);
              const blog = blogResponse.data.data;
              if (blog) {
                title = blog.metaTitle || blog.title || title;
                description = blog.metaDescription || description;
                keywords = blog.metaKeywords || keywords;
              }
            } catch (err) {
              console.log('Vite Dev SEO: Individual Blog not found or invalid ID.');
            }
          }
          
          return html
            .replace(/{{SEO_TITLE}}/g, title)
            .replace(/{{SEO_DESCRIPTION}}/g, description)
            .replace(/{{SEO_KEYWORDS}}/g, keywords);

        } catch (err) {
          console.log('Vite SEO Dev Plugin: Backend not reachable, using defaults.');
        }
        
        // Fallbacks if backend is down or section not found
        return html
          .replace(/{{SEO_TITLE}}/g, 'Kings Pet Hospital | Trusted Pet Care')
          .replace(/{{SEO_DESCRIPTION}}/g, 'Professional pet care services and expert veterinarians.')
          .replace(/{{SEO_KEYWORDS}}/g, 'Kings Pet Hospital, Veterinary');
      }
    }
  ]
}))

