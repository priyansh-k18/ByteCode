"use client";
import React, { useOptimistic, useTransition } from "react";
import { Button } from "../ui/button";
import { Bookmark, Share2, ThumbsUp } from "lucide-react";
import { likeDislike } from "@/actions/like-dislike";
import { Like } from "@prisma/client";


type LikeButtonProps = {
   articleId:string;
   Likes:Like[],
   isLiked:boolean
}
const LikeButton:React.FC<LikeButtonProps> = ({articleId,Likes,isLiked}) => {
  const [optimisticLike,setOptimisticLike] = useOptimistic(Likes.length);
  const [isPending,startTransition] = useTransition();

  const handleLikeDislike = async() => {
    startTransition(async() => {
      setOptimisticLike(isLiked ? optimisticLike -1 : optimisticLike + 1);
      await likeDislike(articleId);
    })
    
  }
  return (
    <div className="flex gap-4 mb-12 border-t pt-8">
      <form action={handleLikeDislike}>
        <Button disabled={isPending}type="submit" className="gap-2" variant={"ghost"}>
          <ThumbsUp className="h-5 w-5" /> {optimisticLike}
        </Button>
      </form>

      <Button variant={"ghost"} className="gap-2">
        <Bookmark className="h-5 w-5" />
      </Button>
      <Button className="gap-2" variant={"ghost"}>
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default LikeButton;
