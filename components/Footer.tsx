import Link from "next/link";
import { Mail, MapPin, Facebook } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "ACDACON", href: "/acdacon" },
      { name: "Events", href: "/events" },
      { name: "About", href: "/about" },
      { name: "Membership", href: "/membership" },
    ],
    resources: [
      {
        name: "Facebook",
        href: "https://www.facebook.com/share/16ZiaeyVtn",
        icon: Facebook,
      },
    ],
    contact: [
      { icon: Mail, text: "info@acda.org.in" },
      {
        icon: MapPin,
        url: "https://maps.app.goo.gl/eGHY5eYpNhPh7XT5A",
        text: "Office Location",
      },
    ],
  };

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="sm:gap-15 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src={"/logos/logo.jpg"}
                className="h-12 w-12 flex-shrink-0"
                width={48}
                height={48}
                alt={"acda_logo"}
              />
              <span className="text-base font-bold leading-tight sm:text-lg">
                Asansol Coalfield Diabetes Association
              </span>
            </Link>
          </div>

          {/* Links and Social Media Combined */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-1">
            {/* Company Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Links</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 transition-colors hover:text-accent"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Social Media</h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm text-gray-300 transition-colors hover:text-accent"
                    >
                      <link.icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              {footerLinks.contact.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="line-clamp-1 text-primary hover:underline"
                  >
                    <span className="break-words text-sm text-gray-300 underline">{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-primary-800 pt-8">
          <p className="text-center text-sm text-gray-300">
            &copy; {currentYear} Asansol Coalfield Diabetes Association. All rights reserved.
          </p>
          <p className="text-center text-xs text-gray-400">
            Designed & Developed by{" "}
            <a
              href="https://gourav-portfolio-ten.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white underline transition-colors hover:text-primary-300"
            >
              Gourav Mukherjee
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
