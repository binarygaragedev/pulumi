import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Get configuration
const config = new pulumi.Config();
const projectName = config.require("projectName") || "my-awesome-site";
// const organizationName = config.require("organization") || "binarygaragedev";
const stackName = pulumi.getStack();

// Create a unique storage bucket name
const bucketName = `${projectName}-${Date.now()}`;

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
export const bucketWebsiteUrl = pulumi.interpolate`http://${bucket.name}.storage.googleapis.com`;