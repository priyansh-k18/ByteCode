"use client";

import React, {
  FormEvent,
  startTransition,
  useActionState,
  useState,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import "react-quill-new/dist/quill.snow.css";
import type { Articles } from "@prisma/client";
import { editArticle } from "@/actions/edit-article";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type EditArticleProps = {
  article: Articles;
};
const EditArticlesPage: React.FC<EditArticleProps> = ({ article }) => {
  const [content, setContent] = useState(article.content || "");
  const [formState, action, isPending] = useActionState(editArticle.bind(null,article.id), {
    errors: {},
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("content", content);

    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Article</CardTitle>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 mt-4">
                <Input
                  type="text"
                  name="title"
                  defaultValue={article.title}
                  placeholder="Enter a article title"
                />
                {formState.errors.title && (
                  <span className="text-red-600 text-sm">
                    {formState.errors.title}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  name="category"
                  id="category"
                  defaultValue={article.category}
                  className="flex h-10 w-full rounded-md bg-background text-foreground border border-input px-3 py-2"
                >
                  <option value={""}>Select category</option>
                  <option value={"technology"}>Technology</option>
                  <option value={"programming"}>Programming</option>
                  <option value={"web-development"}>Web developement</option>
                </select>
                {formState.errors.category && (
                  <span className="text-red-600 text-sm">
                    {formState.errors.category}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="featuredImage">featured Image</Label>
                <Input
                  type="file"
                  id="featuredImage"
                  name="featuredImage"
                  accept="image/*"
                />
                <div className="mb-4">
                  {article.featuredImage && (
                    <img
                      src={article.featuredImage}
                      alt="featured-image"
                      className="w-48 h-32 object-cover rounded-md"
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                />
                {formState.errors.content && (
                  <span className="text-red-600 text-sm">
                    {formState.errors.content[0]}
                  </span>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <Button variant={"outline"}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Loading..." : "Edit Article"}
                </Button>
              </div>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default EditArticlesPage;
