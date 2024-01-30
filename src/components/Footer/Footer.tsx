import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import Logo from "../Logo/Logo";

function Footer() {
  return (
    <footer className="footer py-10 bg-primary text-[#FEF5E7]">
      <div className="footer w-4/5 m-auto">
        <aside>
          <Logo variant="secondary" />
          <p className="mt-2">
            We Are a Health Care Company located <br />
            in Indonesia ready to make your life easier!!!
          </p>
          <div className="flex gap-4 mt-2">
            <Facebook className="cursor-pointer" />
            <Instagram className="cursor-pointer" />
            <Twitter className="cursor-pointer" />
            <Youtube className="cursor-pointer" />
          </div>
        </aside>
        <nav>
          <header className="footer-title max-md:mt-4">Services</header>
          <Link href="/" className="link link-hover">
            Home
          </Link>
          <Link href="/products" className="link link-hover">
            Product
          </Link>
          <Link href="/consultations" className="link link-hover">
            Consult
          </Link>
        </nav>
        <nav>
          <header className="footer-title max-md:mt-4">Company</header>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Feedback</a>
        </nav>
        <nav>
          <header className="footer-title max-md:mt-4">Legal</header>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
