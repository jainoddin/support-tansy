import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const customName = formData.get("name");
    const folder = formData.get("folder");
    const subFolder = formData.get("subFolder");

    if (!file) {
      return NextResponse.json(
        { error: "File is required." },
        { status: 400 }
      );
    }

    if (!process.env.R2_BUCKET_NAME) {
      return NextResponse.json(
        { error: "Vercel Environment Variable R2_BUCKET_NAME is missing! Please add it to your Vercel project settings." },
        { status: 500 }
      );
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Invalid file type. Only images and videos are allowed." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name || "uploaded-media.bin";
    const fileExtension = originalName.includes('.') ? originalName.split('.').pop() : "jpg";
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    // Instead of saving to a database, we just return the object shape the frontend expects
    const newImage = {
      id: fileName,
      url: publicUrl,
      r2Key: fileName,
      name: customName || originalName,
      folder: folder || null,
      subFolder: subFolder || null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ image: newImage, success: true });
  } catch (error) {
    console.error("Upload error:", error);
    import('fs').then(fs => fs.writeFileSync('upload-error.log', String(error.stack || error)));
    return NextResponse.json(
      { error: "Failed to upload file. Details: " + String(error.message || error) },
      { status: 500 }
    );
  }
}
