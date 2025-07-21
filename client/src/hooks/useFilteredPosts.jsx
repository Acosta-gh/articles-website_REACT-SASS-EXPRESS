import { useMemo } from 'react';

export function useFilteredPosts(posts, categories, searchTerm, currentCategory, currentOrder, currentPage, postsPerPage) {
  const categoryMap = useMemo(
    () => categories.reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {}),
    [categories]
  );

  const filteredSorted = useMemo(() => {
    return (posts || [])
      .filter(post => {
        const categoryMatch = currentCategory === 'All' || categoryMap[post.categoryId] === currentCategory;
        const searchMatch = [post.title, post.content, post.author].some(
          field => typeof field === 'string' && field.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return categoryMatch && searchMatch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt), dateB = new Date(b.createdAt);
        return currentOrder === 'Newest' ? dateB - dateA : dateA - dateB;
      });
  }, [posts, categoryMap, searchTerm, currentCategory, currentOrder]);

  const start = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredSorted.slice(start, start + postsPerPage);

  return [filteredSorted, currentPosts];
}