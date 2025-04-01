// Create this as upload.ts in the infra directory
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as fs from "fs";
import * as path from "path";
import * as mime from "mime";

// Get outputs from the main stack
const stack = new pulumi.StackReference(`${pulumi.getOrganization()}/${pulumi.getProject}/${pulumi.getStack()}`);
const bucketName = stack.getOutput("websiteBucket");

// Function to upload files recursively
async function uploadDirectory(bucketName: string, directoryPath: string, prefix: string = "") {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await uploadDirectory(bucketName, filePath, path.join(prefix, file));
    } else {
      const objectName = path.join(prefix, file);
      const contentType = "application/octet-stream";

      new gcp.storage.BucketObject(objectName, {
        bucket: bucketName,
        source: new pulumi.asset.FileAsset(filePath),
        name: objectName,
        contentType: contentType,
        cacheControl: "public, max-age=3600", // 1 hour cache
      });

      console.log(`Uploaded: ${objectName}`);
    }
  }
}

// Path to the Next.js static export directory (relative to this script)
const staticSitePath = "../out";

// Upload the static site to the bucket
bucketName.apply(async (name) => {
  if (name) {
    console.log(`Uploading static site to bucket: ${name}`);
    await uploadDirectory(name, staticSitePath);
  }
});