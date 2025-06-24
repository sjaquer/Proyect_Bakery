import React from 'react';
import { Cake, HeartHandshake, Rocket } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Sobre Nosotros</h1>

        <section className="bg-white/70 backdrop-blur-md rounded-lg shadow p-8 mb-8">
          <div className="flex items-center mb-4">
            <Cake className="h-8 w-8 text-amber-600 mr-2" />
            <h2 className="text-2xl font-semibold">Visión</h2>
          </div>
          <p className="text-gray-700">
            Nos especializamos en ofrecer productos horneados frescos y de alta calidad,
            elaborados con ingredientes cuidadosamente seleccionados. Nos enfocamos en
            satisfacer los gustos de nuestros clientes mediante una atención excepcional,
            creando un ambiente cálido y acogedor que convierte cada visita en una experiencia
            única. Buscamos que cada momento sea especial al disfrutar y saborear nuestras
            innovadoras creaciones en panadería y repostería.
          </p>
        </section>

        <section className="bg-white/70 backdrop-blur-md rounded-lg shadow p-8 mb-8">
          <div className="flex items-center mb-4">
            <HeartHandshake className="h-8 w-8 text-amber-600 mr-2" />
            <h2 className="text-2xl font-semibold">Misión</h2>
          </div>
          <p className="text-gray-700">
            Estamos proyectándonos como la panadería y pastelería líder en toda la ciudad,
            destacándonos por la superioridad de nuestros productos, la creatividad en nuestras
            propuestas y el fuerte compromiso con la satisfacción de nuestros consumidores.
            Aspiramos a ampliar nuestra presencia de forma responsable, preservando siempre los
            principios de autenticidad, honestidad y dedicación como bases fundamentales para
            nuestro desarrollo constante.
          </p>
        </section>

        <section className="bg-white/70 backdrop-blur-md rounded-lg shadow p-8">
          <div className="flex items-center mb-4">
            <Rocket className="h-8 w-8 text-amber-600 mr-2" />
            <h2 className="text-2xl font-semibold">Nuestro Futuro</h2>
          </div>
          <p className="text-gray-700 mb-4">
            En nuestra panadería, no solo horneamos con pasión, también miramos hacia el futuro con
            visión e innovación. Nos encontramos trabajando activamente para transformar nuestra tienda
            en línea en una plataforma más accesible, eficiente y personalizada, tanto para nuestros
            clientes como para nuestros administradores.
          </p>
          <p className="text-gray-700 mb-4">
            Nuestro objetivo es convertirnos en un referente digital en el sector de la panadería,
            integrando nuevas tecnologías y funcionalidades basadas en inteligencia artificial. Estas
            herramientas permitirán a nuestros clientes disfrutar de recomendaciones personalizadas,
            asistencia en tiempo real y una experiencia de compra más ágil y satisfactoria.
          </p>
          <p className="text-gray-700">
            Al mismo tiempo, buscamos optimizar la gestión interna con sistemas inteligentes que
            faciliten la administración del inventario, los pedidos y la atención al cliente. Con
            cada mejora, reafirmamos nuestro compromiso con la calidad, la innovación y la cercanía,
            ofreciendo no solo productos deliciosos, sino también una experiencia digital moderna y
            accesible para todos.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
