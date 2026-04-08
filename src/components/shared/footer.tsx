import { Eye, Globe, FileText, Mail } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Eye className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-teal-700">EyeGuard Clinical</span>
            </div>
            <p className="text-slate-500 text-sm max-w-md">
              Evidence-based ocular health monitoring.
              Privacy-first, HIPAA-aligned architecture.
            </p>
            <p className="text-slate-400 text-xs mt-4">
              &copy; 2026 EyeGuard Clinical AI Research Initiative. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/dashboard" className="hover:text-teal-700 transition-colors">Patient Portal</Link></li>
              <li><Link href="/sign-up" className="hover:text-teal-700 transition-colors">Enrollment</Link></li>
              <li><Link href="/docs" className="hover:text-teal-700 transition-colors">Clinical Protocols</Link></li>
            </ul>
          </div>

          {/* External */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Research</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-teal-700 transition-colors">
                  <Globe className="h-4 w-4" /> GitHub
                </a>
              </li>
              <li>
                <a href="/docs" className="flex items-center gap-2 hover:text-teal-700 transition-colors">
                  <FileText className="h-4 w-4" /> Research Paper
                </a>
              </li>
              <li>
                <a href="mailto:research@eyeguard.ai" className="flex items-center gap-2 hover:text-teal-700 transition-colors">
                  <Mail className="h-4 w-4" /> Contact
                </a>
              </li>
            </ul>
            <div className="mt-4 rounded-md border border-slate-200 bg-white p-2 inline-block">
              <QRCodeSVG value="https://eye-guard.app/community" size={72} bgColor="transparent" fgColor="#0d9488" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
