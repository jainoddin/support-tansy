import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export const dynamic = 'force-dynamic';

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function GET() {
  try {
    if (!process.env.R2_BUCKET_NAME) {
      return NextResponse.json({ error: "Vercel Environment Variable R2_BUCKET_NAME is missing!" }, { status: 500 });
    }

    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
    });

    const response = await s3Client.send(command);
    
    const images = (response.Contents || []).map((item) => {
      return {
        id: item.Key, // use the R2 key as the unique ID
        url: `${process.env.R2_PUBLIC_URL}/${item.Key}`,
        r2Key: item.Key,
        name: item.Key,
        folder: null,
        subFolder: null,
        createdAt: item.LastModified,
      };
    });

    // Sort by newest first
    images.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Fetch images error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images.", details: String(error.message || error) },
      { status: 500 }
    );
  }
}
