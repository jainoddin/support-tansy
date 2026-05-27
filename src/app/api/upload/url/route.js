import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

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
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the file from the provided URL
    const fetchResponse = await fetch(url);
    if (!fetchResponse.ok) {
      return NextResponse.json({ error: "Failed to download media from URL." }, { status: 400 });
    }

    const contentType = fetchResponse.headers.get("content-type") || "";
    const isImage = contentType.startsWith("image/");
    const isVideo = contentType.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "URL does not point to a valid image or video." },
        { status: 400 }
      );
    }

    const arrayBuffer = await fetchResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract filename from URL or use default
    let originalName = url.split("/").pop().split("?")[0];
    if (!originalName || !originalName.includes('.')) {
      originalName = "downloaded-media.bin";
    }

    const fileExtension = originalName.includes('.') ? originalName.split('.').pop() : "jpg";
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    // Create database entry
    const newImage = await prisma.image.create({
      data: {
        url: publicUrl,
        r2Key: fileName,
        name: originalName,
        folder: null,
        subFolder: null,
      },
    });

    return NextResponse.json({ image: newImage, success: true });
  } catch (error) {
    console.error("Upload from URL error:", error);
    return NextResponse.json(
      { error: "Failed to upload from URL. Details: " + String(error.message || error) },
      { status: 500 }
    );
  }
}
