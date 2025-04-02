import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

// Get the bucket name from command line argument or environment variable
const bucketName = process.env.BUCKET_NAME;

if (!bucketName) {
  console.error("Error: Bucket name not provided");
  console.error("Usage: npx ts-node simple-upload.ts <bucket-name>");
  console.error("Or set the BUCKET_NAME environment variable");
  process.exit(1);
}

// Path to the Next.js static export directory
const staticSitePath = path.resolve(__dirname, "../out");

// Check if the directory exists
if (!fs.existsSync(staticSitePath)) {
  console.error(`Error: Directory not found: ${staticSitePath}`);
  console.error("Make sure you've built your Next.js project with 'npm run build'");
  process.exit(1);
}

// Upload files using gsutil
try {
  console.log(`Uploading files from ${staticSitePath} to gs://${bucketName}/`);
  
  // Use execSync to run the gsutil command
  execSync(`gsutil -m cp -r "${staticSitePath}/*" gs://${bucketName}/`, {
    stdio: 'inherit' // This shows the command output in the console
  });
  
  console.log("Upload completed successfully!");
} catch (error) {
  console.error("Error uploading files:", error);
  process.exit(1);
}