import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuth } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Auth middleware
const handleAuth = async ({ req }: { req: any }) => {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) throw new UploadThingError("Unauthorized");
  
  return { userId };
};

// Upload complete handler
const onUploadComplete = async ({ metadata, file }: { metadata: { userId: string }, file: { url: string } }) => {
  console.log("File uploaded by userId:", metadata.userId);
  console.log("File URL:", file.url);
  
  return { uploadedBy: metadata.userId, url: file.url };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique route key
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(handleAuth)
    .onUploadComplete(onUploadComplete),

  // Profile photos have a special route for optimized image handling
  profileImage: f({ image: { maxFileSize: "2MB" } })
    .middleware(handleAuth)
    .onUploadComplete(onUploadComplete),

  // Multiple destination images upload for admin
  destinationImages: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(handleAuth)
    .onUploadComplete(onUploadComplete),

  tourImages: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(handleAuth)
    .onUploadComplete(onUploadComplete),

  // Hero section background image upload
  heroImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(onUploadComplete),

  // About page image upload
  aboutImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
