import ArticleDetailPage from '@/components/articles/article-detail-page';
import { prisma } from '@/lib/prisma';
import React from 'react';

type ArticleDetailPageProps = {
  params: { id: string }
};

export default async function Page({ params }: ArticleDetailPageProps) {
  const { id } = params;

  const article = await prisma.articles.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!article) {
    return <h1>Article not found</h1>;
  }
  return (
    <div>
      <ArticleDetailPage article={article} />
    </div>
  );
}