"use server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createArticleSchema = z.object({
  title: z.string().min(1).max(100),
  category: z.string().min(3).max(50),
  content: z.string().min(10),
});

type CreateArticlesFormstate = {
  errors: {
    title?: string[];
    category?: string[];
    featuredImage?: string[];
    content?: string[];
    formErrors?: string[];
  };
};
export const editArticle = async (
  articleId: string,
  prevState: CreateArticlesFormstate,
  formData: FormData
): Promise<CreateArticlesFormstate> => {
  const result = createArticleSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
  const { userId } = await auth();
  if (!userId) {
    return {
      errors: {
        formErrors: ["You have to login first"],
      },
    };
  }

  const exisitingArticle = await prisma.articles.findUnique({
    where: { id: articleId },
  });
  if (!exisitingArticle) {
    return {
      errors: { formErrors: ["Article not found"] },
    };
  }

  const exisitingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!exisitingUser || exisitingArticle.authorId !== exisitingUser.id) {
    return {
      errors: {
        formErrors: [
          "Usern not found. Please register before creating an article",
        ],
      },
    };
  }

  //start editing article
  let imageUrl = exisitingArticle.featuredImage;

  const imageFile = formData.get("featuredImage") as File | null;
  if (imageFile && imageFile.name !== "undefined") {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse: UploadApiResponse | undefined = await new Promise(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(buffer);
        }
      );

      if (uploadResponse?.secure_url) {
        imageUrl = uploadResponse.secure_url;
      } else {
        return {
          errors: {
            featuredImage: ["failed to upload image. Please try again"],
          },
        };
      }
    } catch{
      return {
        errors: {
          formErrors: ["Error uploading Image. Please try again"],
        },
      };
    }
  }

  try {
    await prisma.articles.update({
      where: { id: articleId },
      data: {
        title: result.data.title,
        category: result.data.category,
        content: result.data.content,
        featuredImage: imageUrl,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          formErrors: [error.message],
        },
      };
    } else {
      return {
        errors: {
          formErrors: ["Some internal server error occured"],
        },
      };
    }
  }
  revalidatePath("/dashboard");
  redirect("/dashboard");
};
