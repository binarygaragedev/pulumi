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