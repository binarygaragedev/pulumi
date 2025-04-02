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

First, we need to prepare development environment:

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

Now lets create a new Next.js project:

```bash
# Create a new Next.js app
npx create-next-app@latest my-awesome-site
cd my-awesome-site

# Install dependencies for static site
npm install --save-dev prettier
```

Add some essential files to the project:

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

Next, we will configure the Next.js project for static site generation:

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
export default function Home() {
  return (
    <div>
      <style jsx global>{`
        :root {
            --primary: #4f46e5;
            --primary-dark: #4338ca;
            --secondary: #06b6d4;
            --dark: #1e293b;
            --light: #f8fafc;
            --accent: #f97316;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        body {
            background-color: var(--light);
            color: var(--dark);
            line-height: 1.6;
            overflow-x: hidden;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 2rem 0;
            position: relative;
            overflow: hidden;
        }
        
        header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 80%);
            transform: rotate(-15deg);
        }
        
        .header-content {
            position: relative;
            z-index: 2;
            padding: 4rem 0;
            text-align: center;
        }
        
        h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            line-height: 1.2;
            background: linear-gradient(90deg, white, #c7d2fe);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .sub-heading {
            font-size: 1.5rem;
            max-width: 600px;
            margin: 0 auto 2rem;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .cta-button {
            display: inline-block;
            padding: 1rem 2.5rem;
            background-color: var(--accent);
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
            text-decoration: none;
            border-radius: 50px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            margin-top: 1rem;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            background-color: #ea580c;
        }
        
        .features {
            padding: 5rem 0;
            background-color: white;
        }
        
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 4rem;
            color: var(--dark);
            font-weight: 700;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2.5rem;
        }
        
        .feature-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            border-color: rgba(79, 70, 229, 0.2);
        }
        
        .feature-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            font-size: 1.8rem;
            border-radius: 20px;
            margin-bottom: 1.5rem;
            box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
        }
        
        .feature-title {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            font-weight: 600;
            color: var(--dark);
        }
        
        .how-it-works {
            padding: 5rem 0;
            background-color: #f1f5f9;
        }
        
        .timeline {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%;
            width: 4px;
            background: linear-gradient(to bottom, var(--primary), var(--secondary));
            transform: translateX(-50%);
            border-radius: 2px;
        }
        
        .timeline-item {
            display: flex;
            justify-content: center;
            padding: 3rem 0;
            position: relative;
        }
        
        .timeline-content {
            width: 45%;
            padding: 2rem;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            position: relative;
        }
        
        .timeline-item:nth-child(even) {
            flex-direction: row-reverse;
        }
        
        .timeline-content::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 20px;
            height: 20px;
            background: white;
            transform: rotate(45deg) translateY(-50%);
        }
        
        .timeline-item:nth-child(odd) .timeline-content::after {
            right: -10px;
        }
        
        .timeline-item:nth-child(even) .timeline-content::after {
            left: -10px;
        }
        
        .timeline-dot {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .timeline-dot i {
            color: var(--primary);
            font-size: 1.2rem;
        }
        
        .timeline-step {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--primary);
        }
        
        .get-started {
            padding: 5rem 0;
            background: linear-gradient(135deg, var(--primary-dark), var(--primary));
            color: white;
            text-align: center;
        }
        
        .get-started h2 {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
        }
        
        .get-started p {
            max-width: 600px;
            margin: 0 auto 2rem;
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        footer {
            background-color: var(--dark);
            color: white;
            padding: 3rem 0;
            text-align: center;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .social-links a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            border-radius: 50%;
            transition: all 0.3s;
        }
        
        .social-links a:hover {
            background-color: var(--primary);
            transform: translateY(-3px);
        }
        
        .copyright {
            opacity: 0.7;
            font-size: 0.9rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animated {
            animation: fadeIn 0.8s ease forwards;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2.5rem;
            }
            
            .sub-heading {
                font-size: 1.2rem;
            }
            
            .timeline::before {
                left: 30px;
            }
            
            .timeline-item {
                flex-direction: row !important;
                justify-content: flex-start;
            }
            
            .timeline-content {
                width: calc(100% - 80px);
                margin-left: 80px;
            }
            
            .timeline-item:nth-child(odd) .timeline-content::after,
            .timeline-item:nth-child(even) .timeline-content::after {
                left: -10px;
                right: auto;
            }
            
            .timeline-dot {
                left: 30px;
            }
        }
      `}</style>

      <header>
        <div className="container">
          <div className="header-content animated">
            <h1>Next.js + GCP + Pulumi</h1>
            <p className="sub-heading">The ultimate stack for building and deploying lightning-fast static websites</p>
            <a href="https://github.com/binarygaragedev/pulumi" className="cta-button">Get Started Now</a>
          </div>
        </div>
      </header>
    
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Next.js + GCP + Pulumi?</h2>
          <div className="features-grid">
            <div className="feature-card animated" style={{animationDelay: "0.1s"}}>
              <div className="feature-icon">
                <i className="fab fa-react"></i>
              </div>
              <h3 className="feature-title">Next.js Power</h3>
              <p>Build with React, benefit from SSG, image optimization, and the best developer experience.</p>
            </div>
            
            <div className="feature-card animated" style={{animationDelay: "0.2s"}}>
              <div className="feature-icon">
                <i className="fas fa-cloud"></i>
              </div>
              <h3 className="feature-title">GCP Infrastructure</h3>
              <p>Google Cloud Platform provides enterprise-grade reliability, scalability, and global reach.</p>
            </div>
            
            <div className="feature-card animated" style={{animationDelay: "0.3s"}}>
              <div className="feature-icon">
                <i className="fas fa-code-branch"></i>
              </div>
              <h3 className="feature-title">Pulumi IaC</h3>
              <p>Infrastructure as Code in your favorite language, making deployments reproducible and versioned.</p>
            </div>
            
            <div className="feature-card animated" style={{animationDelay: "0.4s"}}>
              <div className="feature-icon">
                <i className="fas fa-globe"></i>
              </div>
              <h3 className="feature-title">Global CDN</h3>
              <p>GCP&apos;s Cloud CDN delivers your Next.js static content at blazing speeds worldwide.</p>
            </div>
            
            <div className="feature-card animated" style={{animationDelay: "0.5s"}}>
              <div className="feature-icon">
                <i className="fas fa-lock"></i>
              </div>
              <h3 className="feature-title">Enterprise Security</h3>
              <p>Benefit from Google&apos;s world-class security infrastructure and compliance certifications.</p>
            </div>
            
            <div className="feature-card animated" style={{animationDelay: "0.6s"}}>
              <div className="feature-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <h3 className="feature-title">Performance Optimized</h3>
              <p>Next.js&apos;s optimizations combined with GCP&apos;s infrastructure deliver sub-second page loads.</p>
            </div>
          </div>
        </div>
      </section>
    
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-content animated">
                <h3 className="timeline-step">Step 1</h3>
                <p>Create your Next.js project and build stunning static pages with React components.</p>
              </div>
              <div className="timeline-dot">
                <i className="fab fa-react"></i>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-content animated" style={{animationDelay: "0.2s"}}>
                <h3 className="timeline-step">Step 2</h3>
                <p>Set up your Google Cloud Platform project and configure your cloud resources.</p>
              </div>
              <div className="timeline-dot">
                <i className="fas fa-cloud"></i>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-content animated" style={{animationDelay: "0.4s"}}>
                <h3 className="timeline-step">Step 3</h3>
                <p>Define your infrastructure as code with Pulumi using TypeScript, JavaScript, or Python.</p>
              </div>
              <div className="timeline-dot">
                <i className="fas fa-code-branch"></i>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-content animated" style={{animationDelay: "0.6s"}}>
                <h3 className="timeline-step">Step 4</h3>
                <p>Deploy with a single command: &quot;pulumi up&quot; and watch your site go live on GCP in minutes.</p>
              </div>
              <div className="timeline-dot">
                <i className="fas fa-rocket"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      <section className="get-started" id="get-started">
        <div className="container">
          <h2>Ready to Build with Next.js + GCP + Pulumi?</h2>
          <p>Join forward-thinking teams leveraging this powerful stack for lightning-fast static websites with enterprise reliability.</p>
          <a href="https://github.com/binarygaragedev/pulumi" className="cta-button">Start Your Next.js Project</a>
        </div>
      </section>
    
      <footer>
        <div className="container">
          <div className="social-links">
            <a href="#"><i className="fab fa-github"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
          
          <p className="copyright">© 2025 Fast Static Website Deployment. All rights reserved.</p>
        </div>
      </footer>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Simple animation on scroll
          document.addEventListener('DOMContentLoaded', () => {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.style.opacity = 1;
                  entry.target.style.transform = 'translateY(0)';
                }
              });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.animated').forEach(el => {
              el.style.opacity = 0;
              el.style.transform = 'translateY(20px)';
              el.style.transition = 'all 0.6s ease';
              observer.observe(el);
            });
          });
        `
      }} />
    </div>
  );
}
```

3. Test the static export:

```bash
# Build and export the static site
npm run build

# This will generate a folder named 'out' with the static files
```

## Setting Up Pulumi

Now lets set up Pulumi for infrastructure as code:

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

Now update the `index.ts` file created by Pulumi to define our infrastructure:

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

Next we need to create a script to upload the static site to the bucket after deployment:

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

Now we are ready to deploy the infrastructure and the static site:

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
## Optional steps

### Setting Up a Custom Domain

To use a custom domain with our static site:

1. Get the IP address from Pulumi outputs:
```bash
pulumi stack output staticIpAddress
```

2. Add DNS records for the domain:
   - Create an A record pointing the domain to the static IP
   - Create a CNAME record for www subdomain

3. Update the SSL certificate in the Pulumi code to use the actual domain name.

### Implementing CI/CD

For continuous deployment, we can set up a GitHub Actions workflow:

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

### Performance Optimization

To optimize the performance of our static site:

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

### Monitoring and Maintenance

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