# Deploying a Next.js Static Site to Google Cloud with Pulumi

This guide documents the complete journey of setting up a Next.js static website and deploying it to Google Cloud Platform (GCP) using Pulumi for infrastructure as code. I'll cover everything from initial setup to final deployment, sharing insights and best practices along the way.

## Table of Contents

1. [Why Next.js and Pulumi?](#why-nextjs-and-pulumi)
2. [Prerequisites](#prerequisites)
3. [Setting Up the Development Environment](#setting-up-the-development-environment)
4. [Creating a Next.js Project](#creating-a-nextjs-project)
5. [Configuring Next.js for Static Export](#configuring-nextjs-for-static-export)
6. [Setting Up Pulumi](#setting-up-pulumi)
7. [Writing the Pulumi Infrastructure Code](#writing-the-pulumi-infrastructure-code)
8. [Deploying to Google Cloud](#deploying-to-google-cloud)
9. [Setting Up a Custom Domain](#setting-up-a-custom-domain)
10. [Implementing CI/CD](#implementing-cicd)
11. [Performance Optimization](#performance-optimization)
12. [Monitoring and Maintenance](#monitoring-and-maintenance)
13. [Lessons Learned and Best Practices](#lessons-learned-and-best-practices)

## Why Next.js and Pulumi?

### Next.js
I chose Next.js for this project because it offers:
- **Static Site Generation (SSG)**: Perfect for content-focused websites
- **Performance optimization**: Built-in image optimization and code splitting
- **Developer experience**: Hot reloading, TypeScript support, and intuitive routing
- **Scalability**: Easy to grow from a simple static site to a more complex application if needed

### Pulumi
Pulumi is my infrastructure as code tool of choice because:
- **Native language support**: Write infrastructure code in TypeScript/JavaScript (matching our frontend)
- **Immutable infrastructure**: Ensures consistent environments
- **Easy integration with CI/CD**: Automates deployments
- **State management**: Tracks infrastructure changes over time
- **Multi-cloud support**: If we decide to change cloud providers later, the transition will be easier

## Prerequisites

Before starting, ensure you have the following:

- Node.js (v14.x or later)
- npm or yarn
- Google Cloud Platform account
- Pulumi CLI
- Google Cloud SDK (gcloud CLI)
- A code editor (VS Code recommended)

## Setting Up the Development Environment

First, I'll prepare my development environment:

```bash
# Install Node.js and npm if not already installed
# On macOS with Homebrew:
brew install node

# On Windows with Chocolatey:
choco install nodejs

# On Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Pulumi CLI
# On macOS with Homebrew:
brew install pulumi

# On Windows with Chocolatey:
choco install pulumi

# On Linux:
curl -fsSL https://get.pulumi.com | sh

# Install Google Cloud SDK
# Follow instructions at: https://cloud.google.com/sdk/docs/install

# Verify installations
node --version
npm --version
pulumi version
gcloud --version
```

## Creating a Next.js Project

Now I'll create a new Next.js project:

```bash
# Create a new Next.js app
npx create-next-app@latest my-awesome-site
cd my-awesome-site

# Install dependencies for static site
npm install --save-dev prettier
```

I'll add some essential files to the project:

```bash
# Create a .prettierrc file for consistent code formatting
echo '{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}' > .prettierrc
```

## Configuring Next.js for Static Export

Next, I'll configure the Next.js project for static site generation:

1. Update `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
```

2. Create my static site awesome content in `pages/index.js`:

```jsx
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>My Static Site</title>
        <meta name="description" content="Static site generated with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to my static site!
        </h1>

        <p className={styles.description}>
          Deployed to Google Cloud using Pulumi
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Powered by Next.js and Google Cloud</p>
      </footer>
    </div>
  )
}
```

3. Test the static export:

```bash
# Build and export the static site
npm run build

# This will generate a folder named 'out' with the static files
```

## Setting Up Pulumi

Now I'll set up Pulumi for infrastructure as code:

```bash
# Create a new Pulumi project
mkdir -p infra
cd infra
pulumi new gcp-typescript

# This will prompt for:
# - Project name: my-awesome-site-infra
# - Project description: Infrastructure for my static site
# - Stack name: dev (for development environment)
# - GCP Project ID: your-gcp-project-id
# - GCP Region: us-central1 (or your preferred region)
```

Configure Google Cloud authentication:

```bash
# Log in to Google Cloud
gcloud auth login

# Set the active project
gcloud config set project your-gcp-project-id

# Create application default credentials
gcloud auth application-default login
```

## Writing the Pulumi Infrastructure Code

I'll update the `index.ts` file created by Pulumi to define our infrastructure:

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Get configuration
const config = new pulumi.Config();
const projectName = config.require("projectName") || "my-awesome-site";
const stackName = pulumi.getStack();

// Create a unique storage bucket name
const bucketName = `${projectName}-${stackName}-${Date.now()}`;

// Create a storage bucket for our static website
const bucket = new gcp.storage.Bucket(bucketName, {
  location: "US",
  website: {
    mainPageSuffix: "index.html",
    notFoundPage: "404.html",
  },
  uniformBucketLevelAccess: true,
  forceDestroy: true,
});

// Make the bucket publicly readable
const bucketIAMBinding = new gcp.storage.BucketIAMBinding("bucket-iam-binding", {
  bucket: bucket.name,
  role: "roles/storage.objectViewer",
  members: ["allUsers"],
});

// Create a backend bucket for the load balancer
const backendBucket = new gcp.compute.BackendBucket("backend-bucket", {
  bucketName: bucket.name,
  enableCdn: true,
});

// Reserve a static IP address
const staticIp = new gcp.compute.GlobalAddress("static-ip", {});

// Create a URL map
const urlMap = new gcp.compute.URLMap("url-map", {
  defaultService: backendBucket.selfLink,
});

// Create an HTTPS certificate (we'll use a self-signed one for demo purposes)
// In production, you should use a managed certificate or your own certificate
const sslCertificate = new gcp.compute.ManagedSslCertificate("ssl-certificate", {
  managed: {
    domains: [`${projectName}.example.com`], // Replace with your domain
  },
});

// Create a target HTTPS proxy
const targetHttpsProxy = new gcp.compute.TargetHttpsProxy("target-https-proxy", {
  urlMap: urlMap.selfLink,
  sslCertificates: [sslCertificate.selfLink],
});

// Create a global forwarding rule for HTTPS
const httpsForwardingRule = new gcp.compute.GlobalForwardingRule("https-forwarding-rule", {
  target: targetHttpsProxy.selfLink,
  portRange: "443",
  ipAddress: staticIp.address,
  loadBalancingScheme: "EXTERNAL",
});

// Create a target HTTP proxy for redirecting HTTP to HTTPS
const targetHttpProxy = new gcp.compute.TargetHttpProxy("target-http-proxy", {
  urlMap: urlMap.selfLink,
});

// Create a global forwarding rule for HTTP
const httpForwardingRule = new gcp.compute.GlobalForwardingRule("http-forwarding-rule", {
  target: targetHttpProxy.selfLink,
  portRange: "80",
  ipAddress: staticIp.address,
  loadBalancingScheme: "EXTERNAL",
});

// Export the bucket name and website URL
export const websiteBucket = bucket.name;
export const websiteUrl = pulumi.interpolate`https://${staticIp.address}`;
export const bucketWebsiteUrl = bucket.websiteEndpoint;
```

I'll also create a script to upload the static site to the bucket after deployment:

```typescript
// Create this as upload.ts in the infra directory
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as fs from "fs";
import * as path from "path";
import * as mime from "mime";

// Get outputs from the main stack
const stack = new pulumi.StackReference(`${pulumi.organization}/${pulumi.project}/${pulumi.getStack()}`);
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
      const contentType = mime.getType(filePath) || "application/octet-stream";

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
```

## Deploying to Google Cloud

Now I'm ready to deploy the infrastructure and the static site:

```bash
# Install required dependencies for the upload script
cd infra
npm install --save mime @types/mime

# Preview the infrastructure changes
pulumi preview

# Deploy the infrastructure
pulumi up

# After successful deployment, run the upload script
npx ts-node upload.ts
```

## Setting Up a Custom Domain

To use a custom domain with my static site:

1. Get the IP address from Pulumi outputs:
```bash
pulumi stack output staticIpAddress
```

2. Add DNS records for the domain:
   - Create an A record pointing the domain to the static IP
   - Create a CNAME record for www subdomain

3. Update the SSL certificate in the Pulumi code to use the actual domain name.

## Implementing CI/CD

For continuous deployment, I'll set up a GitHub Actions workflow:

```yaml
# Create this file as .github/workflows/deploy.yml
name: Deploy Static Site

on:
  push:
    branches: [ master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build static site
        run: npm run build
        
      - name: Setup Pulumi
        uses: pulumi/actions@v3
        with:
          command: preview
          stack-name: dev
          comment-on-pr: true
          github-token: ${{ secrets.GITHUB_TOKEN }}
        env:
          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
          GOOGLE_CREDENTIALS: ${{ secrets.GOOGLE_CREDENTIALS }}
          
      - name: Deploy infrastructure
        uses: pulumi/actions@v3
        with:
          command: up
          stack-name: dev
          github-token: ${{ secrets.GITHUB_TOKEN }}
        env:
          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
          GOOGLE_CREDENTIALS: ${{ secrets.GOOGLE_CREDENTIALS }}
          
      - name: Upload static site
        run: cd infra && npx ts-node upload.ts
        env:
          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
          GOOGLE_CREDENTIALS: ${{ secrets.GOOGLE_CREDENTIALS }}
```

## Performance Optimization

To optimize the performance of my static site:

1. Enable compression and caching in the Pulumi code:

```typescript
// Update the BucketObject creation in upload.ts
new gcp.storage.BucketObject(objectName, {
  bucket: bucketName,
  source: new pulumi.asset.FileAsset(filePath),
  name: objectName,
  contentType: contentType,
  cacheControl: "public, max-age=86400", // 24 hour cache for static assets
});

// Use a different cache policy for HTML files
if (contentType === "text/html") {
  objectArgs.cacheControl = "public, max-age=3600"; // 1 hour cache for HTML
}
```

2. Add a Content-Security-Policy header for better security:

```typescript
// Add this to the bucket object creation
metadata: {
  "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';"
}
```

## Monitoring and Maintenance

For monitoring the deployed site:

1. Set up Google Cloud Monitoring:

```typescript
// Add this to index.ts
const alertPolicy = new gcp.monitoring.AlertPolicy("error-alert-policy", {
  displayName: "HTTP 5xx Error Rate",
  conditions: [{
    displayName: "HTTP 5xx Error Rate",
    conditionThreshold: {
      filter: `resource.type="https_lb_rule" AND resource.labels.url_map_name="${urlMap.name}" AND metric.type="loadbalancing.googleapis.com/https/request_count" AND metric.labels.response_code_class="500"`,
      aggregations: [{
        alignmentPeriod: "60s",
        perSeriesAligner: "ALIGN_RATE",
        crossSeriesReducer: "REDUCE_SUM",
      }],
      comparison: "COMPARISON_GT",
      thresholdValue: 0.01,
      duration: "60s",
    },
  }],
  alertStrategy: {
    autoClose: "604800s",
  },
  notificationChannels: [
    // Add your notification channels here
  ],
});
```

2. Set up logging and regular maintenance tasks:

```typescript
// Add this to index.ts to enable logging
const logBucket = new gcp.logging.LogBucket("log-bucket", {
  location: "global",
  retentionDays: 30,
});

const logSink = new gcp.logging.ProjectSink("log-sink", {
  destination: pulumi.interpolate`logging.googleapis.com/projects/${gcp.config.project}/locations/global/buckets/${logBucket.name}`,
  filter: `resource.type="http_load_balancer" AND resource.labels.url_map_name="${urlMap.name}"`,
  uniqueWriterIdentity: true,
});
```

## Lessons Learned and Best Practices

After completing this deployment journey, here are the key learnings and best practices:

### Infrastructure as Code
- **Keep configuration separate**: Store environment-specific values in Pulumi config
- **Use stack references**: They allow separating infrastructure into manageable pieces
- **Version everything**: Infrastructure code should be versioned alongside application code

### Security
- **Use HTTPS exclusively**: Always redirect HTTP to HTTPS
- **Implement CSP headers**: Protect against XSS and other injection attacks
- **Regular updates**: Keep all dependencies up to date

### Performance
- **CDN caching**: Enable Cloud CDN for edge caching
- **Proper cache headers**: Different cache policies for different content types
- **Image optimization**: Use Next.js built-in image optimization

### Maintainability
- **Documentation**: Comment code and maintain a README
- **CI/CD automation**: Automate all deployment steps
- **Monitoring and alerts**: Set up alerts for critical issues

### Cost Optimization
- **Right-sizing**: Use appropriate instance types for your traffic
- **Budget alerts**: Set up billing alerts to avoid surprises
- **Clean up unused resources**: Regularly audit and remove unused resources

## Conclusion

This journey has taken me from a simple Next.js project to a fully deployed, optimized, and monitored static website on Google Cloud Platform using Pulumi for infrastructure as code. While there's always room for improvement, this architecture provides a solid foundation for a high-performance, secure, and maintainable static website.

For larger sites or more complex requirements, consider these potential next steps:
- Implementing A/B testing capabilities
- Setting up feature flags
- Adding a headless CMS integration
- Implementing security scanning in the CI/CD pipeline
- Adding automated testing for infrastructure code