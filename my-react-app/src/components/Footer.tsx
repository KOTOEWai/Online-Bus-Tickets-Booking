import { Facebook, Twitter, Instagram } from "lucide-react";


export default function Footer() {
  return (
    <footer className="py-8 px-6 md:px-12 bg-gray-900 text-gray-300 text-center ">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Yadanar Express</h3>
            <p className="text-sm">
              Your reliable partner for bus ticket booking. Travel smart, travel safe.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Site Map</a></li>
            </ul>
          </div>
          {/* Contact Us & Socials */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <p className="text-sm">
              123 Bus Lane, Travel City, TC 12345<br />
              Email: info@busbooker.com<br />
              Phone: +1 (234) 567-8900
            </p>
            <div className="flex justify-start space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-700 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} BusBooker. All rights reserved.
        </div>
      </footer>
  )
}
