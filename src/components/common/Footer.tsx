import React from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Panadería Artesanal</h3>
            <p className="text-gray-300 mb-4">
              Ofrecemos productos frescos y de la mejor calidad, elaborados con ingredientes selectos y técnicas tradicionales.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1 text-accent-500" />
                <span>Av. Arequipa 123, Lima, Perú</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-accent-500" />
                <span>+51 987 654 321</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-accent-500" />
                <span>contacto@panaderia.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-1 text-accent-500" />
                <span>Lun - Sáb: 7:00 AM - 8:00 PM<br />Dom: 8:00 AM - 2:00 PM</span>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Nuestros productos</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Sobre nosotros</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Servicios especiales</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Pedidos por WhatsApp</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Términos y condiciones</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Panadería Artesanal. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;