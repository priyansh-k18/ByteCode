import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Search } from "lucide-react";
import { fetchArticleByQuery } from "@/lib/query/fetch-article-by-query";
import Link from "next/link";
import { Button } from "../ui/button";

const ITEMS_PER_PAGE = 3;

type AllArticlePageProps = {
  searchText: string;
  page: number;
};

const AllArticlePage = async ({ searchText, page }: AllArticlePageProps) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;
  const { articles, total } = await fetchArticleByQuery(searchText, skip, take);
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  if (articles.length <= 0) {
    return <NoSearchResult />;
  }
  return (
    <div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="group relative overflow-hidden translate-all hover:shadow-lg"
          >
            <div className="p-6">
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded">
                <Image
                  src={article.featuredImage}
                  alt="blog-image"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Article content */}
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {article.category}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={article.author.imageUrl || ""} />
                    <AvatarFallback>
                      {article.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{article.author.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {article.createdAt.toDateString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="mt-12 flex justify-center gap-2">
        <Link href={`/articles?search=${encodeURIComponent(searchText)}&page=${page - 1}`}>
          <Button disabled={page <= 1} variant="ghost">
            ← Prev
          </Button>
        </Link>
        {Array.from({ length: totalPages }).map((_, index) => (
          <Link
            key={index}
            href={`/articles?search=${encodeURIComponent(searchText)}&page=${index + 1}`}
          >
            <Button
              variant={page === index + 1 ? "default" : "ghost"}
              size="sm"
            >
              {index + 1}
            </Button>
          </Link>
        ))}
        <Link href={`/articles?search=${encodeURIComponent(searchText)}&page=${page + 1}`}>
          <Button disabled={page >= totalPages} variant="ghost">
            → Next
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AllArticlePage;

const NoSearchResult = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No results found</h3>
      <p className="text-sm text-muted-foreground">
        try again with different search
      </p>
    </div>
  );
};
