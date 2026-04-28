import { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { api } from '../services/api';
import type { Blog as BlogType } from '../lib/type';
import { Button } from '../components/ui/button';

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 20;

  const getAll = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blog', null);
      const all = (response as BlogType[]).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setBlogs(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  const totalPages = Math.max(1, Math.ceil(blogs.length / perPage));
  const start = (page - 1) * perPage;
  const pageItems = blogs.slice(start, start + perPage);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <p className="text-sm text-gray-600">{blogs.length} article(s)</p>
      </div>

      {loading && <p>Chargement...</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map((post) => (
          <Card key={post.id} className="cursor-pointer" onClick={() => window.open(`/blog/${post.id}`, '_blank')}>
            <div className="aspect-video overflow-hidden">
              <img src={`${import.meta.env.VITE_API_BASE}${post.cover}`} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600">{post.short_description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-3 mt-8">
        <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Précédent</Button>
        <div className="space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <Button key={p} variant={p === page ? undefined : 'outline'} onClick={() => setPage(p)}>{p}</Button>
            );
          })}
        </div>
        <Button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Suivant</Button>
      </div>
    </div>
  );
};

export default Blog;
