
import logo from "../assets/logo.png"; // update path to your logo

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020524] text-gray-300 py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div>
          <img src={logo} alt="Dunamis Power Logo" className="h-14 mb-4" />
          <p className="text-sm leading-relaxed">
            As an African Services company, our obsession is delivering
            development to the African Continent, one community at a time.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/services" className="hover:text-white">Services</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Our Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Yellow Plant Hire and Fleet Maintenance</li>
            <li>Yellow Plant Maintenance & Servicing</li>
            <li>FME & Commissioning</li>
            <li>Industrial Services</li>
            <li>Solar & Heat Pump Installation</li>
            <li>Construction</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Contact Us</h3>
          <p className="text-sm leading-relaxed">
            98 Party Rd <br />
            Boltonwold AH, <br />
            Meyerton 1961 <br />
            South Africa
          </p>
          <p className="mt-3 text-sm">Phone: 016 013 0461</p>
          <p className="text-sm">Email: info@dunamispower.co.za</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Dunamis Power. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
