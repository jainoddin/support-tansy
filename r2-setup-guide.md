# Cloudflare R2 Image Upload Guide

This guide covers everything you need to know about setting up and using the Cloudflare R2 image upload API in your Next.js application.

## Prerequisites

- A Cloudflare account with R2 enabled (requires a payment method on file, though the free tier is very generous).
- A Vercel account for deployment.

---

## 1. Creating an R2 Bucket

1. Log in to your Cloudflare dashboard.
2. Navigate to **R2** in the sidebar.
3. Click **Create bucket**.
4. Choose a unique name for your bucket (e.g., `my-nextjs-images`).
5. Choose a location (or leave it as Automatic).
6. Click **Create bucket**.

---

## 2. Enabling Public URL for the Bucket

To serve images directly to users, you need to enable public access.

1. Go to your newly created bucket's settings.
2. Click on the **Settings** tab.
3. Scroll down to **Public Access**.
4. Click **Connect Domain** to use a custom domain (recommended for production) OR click **Allow Access** under **R2.dev subdomain** to get a free testing URL.
5. If using the `r2.dev` subdomain, copy the URL provided (e.g., `https://pub-xxxxxx.r2.dev`). This will be your `R2_PUBLIC_URL`.

---

## 3. Creating a Cloudflare R2 API Token

You need an API token to allow your Next.js app to upload files.

1. Go back to the main **R2** dashboard page.
2. On the right side, click **Manage R2 API Tokens**.
3. Click **Create API token**.
4. Set a name (e.g., `Next.js Image Uploader`).
5. Under **Permissions**, select **Object Read & Write**.
6. Under **Specify bucket(s)**, select your specific bucket or leave as "Apply to all R2 buckets".
7. Click **Create API Token**.
8. **IMPORTANT:** Copy the **Access Key ID** and **Secret Access Key**. You will not be able to see the secret key again.
9. Also note your **Account ID**, which is displayed on the token success page or on the main R2 dashboard URL (`dash.cloudflare.com/{Account_ID}/r2`).

---

## 4. Environment Variables Setup

Create a `.env.local` file in the root of your Next.js project and add the credentials you gathered:

```env
R2_ACCOUNT_ID="your_account_id_here"
R2_ACCESS_KEY_ID="your_access_key_id_here"
R2_SECRET_ACCESS_KEY="your_secret_access_key_here"
R2_BUCKET_NAME="your_bucket_name_here"
R2_PUBLIC_URL="https://pub-xxxxxx.r2.dev"
```

---

## 5. Deploying to Vercel

1. Push your Next.js project to a GitHub, GitLab, or Bitbucket repository.
2. Log in to Vercel and click **Add New** -> **Project**.
3. Import your repository.
4. Open the **Environment Variables** section during setup.
5. Add all 5 environment variables from your `.env.local` file.
6. Click **Deploy**.

---

## 6. Best Practices for Image Uploads

- **Validation:** Always validate the file type (`image/jpeg`, `image/png`, `image/webp`, etc.) on the backend to prevent malicious uploads.
- **Size Limits:** Enforce file size limits (e.g., 5MB) to prevent abuse and manage storage costs.
- **Unique Filenames:** Always generate unique filenames (using `crypto.randomUUID()` or `Date.now()`) to prevent overriding existing images.
- **Sanitization:** Do not trust the original filename provided by the user.
- **Optimization:** Consider optimizing images (resizing, compressing, converting to WebP) before uploading. This can be done on the client-side or backend before calling the S3 `PutObjectCommand`.
