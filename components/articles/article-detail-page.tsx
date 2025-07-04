import React from "react";

import type { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LikeButton from "./like-button";
import CommentList from "../comments/comment-list";
import Image from "next/image";
import CommentInput from "../comments/comment-input";
import { prisma } from "@/lib/prisma";

type ArticleDetailPageProps = {
  article: Prisma.ArticlesGetPayload<{
    include: {
      author: {
        select: {
          name: true;
          email: true;
          imageUrl: true;
        };
      };
    };
  }>;
};

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = async ({ article }) => {
    const comments = await prisma.comment.findMany({
        where:{articleId:article.id},
        include:{
            author:{
                select:{
                    name:true,
                    email:true,
                    imageUrl:true
                }
            }
        }
    })
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <header>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 text-sm">web-developement</span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={article.author.imageUrl || ""} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{article.author.name}</p>
                <p className="text-sm">{article.createdAt.toDateString()}</p>
              </div>
            </div>
          </header>
          <Image src={article.featuredImage} alt="image" width='200' height='100'/>
          <div className="mt-10" dangerouslySetInnerHTML={{ __html: article.content }} />
          <div className="m-5">
            <LikeButton />
          </div>
          {/* Article action button */}

          <CommentInput articleId={article.id}/>

          {/* Comment section */}
          <CommentList comments={comments} />
        </article>
      </main>
    </div>
  );
};

export default ArticleDetailPage;
