
import React, { useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface MapSectionProps {
  visibleSections: Set<string>;
  onSectionVisibilityChange: (section: string, isVisible: boolean) => void;
}

const MapSection = ({ visibleSections, onSectionVisibilityChange }: MapSectionProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver(mapRef as React.RefObject<Element>, (isVisible) => {
    onSectionVisibilityChange('map', isVisible);
  });

  return (
    <section id="map" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden" ref={mapRef}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-200/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-cyan-200/30 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div 
          className={`transition-all duration-1000 ${
            visibleSections.has('map') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="text-3xl font-bold mb-8 font-serif text-gray-800 leading-tight text-center">
            <MapPin className="inline-block mr-3 text-blue-600" />
            Mon adresse
          </h2>

          <div className="max-w-6xl mx-auto">
            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div 
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 transition-all duration-1000 ${
                  visibleSections.has('map') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="flex items-center mb-3">
                  <MapPin className="h-5 w-5 text-red-500 mr-2" />
                  <span className="font-semibold text-gray-800">Localisation</span>
                </div>
                <p className="text-gray-600 text-sm">4 Avenue du géneral de gaulle</p>
              </div>

              <div 
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 transition-all duration-1000 ${
                  visibleSections.has('map') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="flex items-center mb-3">
                  <Navigation className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-semibold text-gray-800">Région</span>
                </div>
                <p className="text-gray-600 text-sm">Marignane, Bouches-du-Rhône</p>
              </div>

              <div 
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 transition-all duration-1000 ${
                  visibleSections.has('map') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <div className="flex items-center mb-3">
                  <span className="text-lg mr-2">🚗</span>
                  <span className="font-semibold text-gray-800">Mobilité</span>
                </div>
                <p className="text-gray-600 text-sm">Permis B</p>
              </div>
            </div>

            {/* Map Container */}
            <div 
              className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-1000 ${
                visibleSections.has('map') ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              {/* Map Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-white font-medium">Où suis-je ?</span>
                  </div>
                  <MapPin className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Google Maps Iframe */}
              <div className="relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5796.667915736193!2d5.200136093353844!3d43.41184879663602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9e6483a82f933%3A0x4722ed195a75bf61!2s4%20Av.%20du%20G%C3%A9n%C3%A9ral%20de%20Gaulle%2C%2013700%20Marignane!5e0!3m2!1sfr!2sfr!4v1749731511497!5m2!1sfr!2sfr" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
                
                {/* Overlay gradient for better integration */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/10 to-transparent"></div>
              </div>

              {/* Map Footer */}
              <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Disponible pour projets dans les Bouches-du-Rhône
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
