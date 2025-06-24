import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Sobre Nosotros</h1>
        <p className="text-lg text-gray-700 mb-6">
          Somos una panadería dedicada a ofrecer productos frescos y de la mejor
          calidad. Creemos en mantener las tradiciones mientras aprovechamos las
          comodidades modernas para llegar a tu mesa.
        </p>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Misión</h2>
          <p className="text-gray-700">
            Elaborar panes y postres que alegren cada momento de nuestros clientes,
            utilizando ingredientes selectos y un servicio cercano.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Visión</h2>
          <p className="text-gray-700">
            Ser la panadería líder de la región, reconocida por su sabor casero y
            la innovación en cada producto que ofrecemos.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">Nuestro Futuro</h2>
          <p className="text-gray-700">
            Planeamos incorporar nuevas delicias y mejorar esta plataforma para que
            tu experiencia de compra sea cada vez mejor.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
