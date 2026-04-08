import { Eye, Globe, FileText, Mail } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

export function Footer() {
  return (
    <footer className="border-t border-card-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold gradient-text">Eye-Guard</span>
            </div>
            <p className="text-muted text-sm max-w-md">
              Research-grade AI system for real-time digital eye strain detection.
              Built with computer vision and personalized temporal modeling.
            </p>
            <p className="text-muted/60 text-xs mt-4">
              JisTech Research Lab &middot; Conference Publication 2026
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link></li>
              <li><Link href="/community" className="hover:text-accent transition-colors">Community</Link></li>
              <li><Link href="/docs" className="hover:text-accent transition-colors">Research Paper</Link></li>
            </ul>
          </div>

          {/* External */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Connect</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Globe className="h-4 w-4" /> GitHub
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <FileText className="h-4 w-4" /> Research Paper
                </a>
              </li>
              <li>
                <a href="mailto:research@eyeguard.ai" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Mail className="h-4 w-4" /> Contact
                </a>
              </li>
            </ul>
            <div className="mt-4 rounded-md border border-card-border bg-card/40 p-2 inline-block">
              <QRCodeSVG value="https://eye-guard.app/community" size={72} bgColor="transparent" fgColor="#06b6d4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
