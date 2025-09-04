import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { Map, BusFront } from 'lucide-react';
import { customIcon } from './MapComponent';
import { containerVariants, itemVariants } from '../hooks/useAnimationVariants';

// Fix for default marker icon issue (same as in MapComponent.tsx)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._get
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Interface for a single route data
interface BusRouteData {
  id: number;
  name: string;
  color: string;
  path: [number, number][]; // Array of [latitude, longitude] pairs
}

const RoutesMapPage: React.FC = () => {
  // Hardcoded example data for demonstration purposes
const exampleRoutesData: BusRouteData[] = [
  {
    id: 1,
    name: 'Mandalay to Yangon',
    color: '#FF0000', // Red
    path: [
      [21.96109, 96.11397], // Mandalay (approx)
      [20.5000, 95.0000],  // Mid-point (approx)
      [16.8409, 96.1735]   // Yangon (approx)
    ]
  },
  {
    id: 2,
    name: 'Mandalay to Taunggyi', // New route: Mandalay to Taunggyi
    color: '#0000FF', // Blue
    path: [
      [21.96109, 96.11397], // Mandalay (approx)
      [21.3000, 96.6000],  // Mid-point (approx)
      [20.7850, 97.0340]   // Taunggyi (approx)
    ]
  },
  {
    id: 3,
    name: 'Mandalay to Bagan',
    color: '#008000', // Green
    path: [
      [21.96109, 96.11397], // Mandalay (approx)
      [21.5000, 95.5000],  // Mid-point (approx)
      [21.1667, 94.8667]   // Bagan (approx)
    ]
  },
  {
    id: 4,
    name: 'Mandalay to Naypyidaw', // New route: Mandalay to Naypyidaw
    color: '#FFA500', // Orange
    path: [
      [21.96109, 96.11397], // Mandalay (approx)
      [20.8000, 96.1500],  // Mid-point (approx)
      [19.7400, 96.1200]   // Naypyidaw (approx)
    ]
  },
  {
    id: 5,
    name: 'Mandalay to Myitkyina', // New route: Mandalay to Myitkyina
    color: '#800080', // Purple
    path: [
      [21.96109, 96.11397], // Mandalay (approx)
      [24.0000, 96.5000],  // Mid-point (approx)
      [25.3833, 97.3833]   // Myitkyina (approx)
    ]
  },
  {
    id: 6,
    name: 'Mandalay to Mawlamyine', // New route: Mandalay to Mawlamyine
    color: '#00CED1', // Dark Turquoise
    path: [
     [21.96109, 96.11397],   // Mandalay (approx)
      [ 16.923945,97.367652],  // Mid-point (approx)
      [16.4800, 97.6200]    // Mawlamyine (approx)
    ]
  },
  {
    id: 7,
    name: 'Mandalay to Kalaw', // New route: Mandalay to Kalaw
    color: '#FF4500', // OrangeRed
    path: [
      [21.96109, 96.11397], // Mandalay (approx)
      [20.8000, 96.8000],  // Mid-point (approx)
      [20.6200, 96.5700]   // Kalaw (approx)
    ]
  },
  // You can add more Mandalay-centric routes here if needed
];
  // Set routesData directly from the example data
  const [routesData] = useState<BusRouteData[]>(exampleRoutesData); // Removed setRoutesData as it's not needed for static data
  // Removed loading and error states as data is hardcoded for this example

  // Center of Myanmar (approximate)
  const myanmarCenter: [number, number] = [20.0000, 96.0000];
  const initialZoom = 6; // Adjust zoom level to show most of Myanmar

  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
    

      <div className="container mx-auto flex-grow py-8 px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 flex items-center justify-center gap-3">
          <Map className="w-8 h-8 text-orange-500" /> Our Bus Routes Map
        </h1>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Map Container - Increased height using Tailwind classes */}
          {/* Removed inline style height: "100rem" */}
          <motion.div className="w-full h-[32rem] md:h-[30rem] lg:h-[38rem] rounded-lg overflow-hidden border border-gray-200 shadow-md mb-6" variants={itemVariants}>
            <MapContainer
              center={myanmarCenter}
              zoom={initialZoom}
              scrollWheelZoom={true} // Allow scroll wheel zoom on map page
              className="h-full w-full" // MapContainer takes 100% height of its parent
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {routesData.map((route) => (
                <Polyline
                  key={route.id}
                  positions={route.path}
                  color={route.color}
                  weight={6} // Thickness of the line
                  opacity={0.7}
                >
                  <Popup>
                    <strong>{route.name}</strong>
                  </Popup>
                </Polyline>
              ))}

              {/* Markers for major cities */}
              {/* Removed customIcon if it's not defined globally or imported */}
           <Marker position={[16.8409, 96.1735]} icon={customIcon}>
                           <Popup>Yangon</Popup>
                         </Marker>
                         <Marker position={[21.96109, 96.11397]}  icon={customIcon}>
                           <Popup>Mandalay</Popup>
                         </Marker>
                         <Marker position={[20.7850, 97.0340]}  icon={customIcon}>
                           <Popup>Taunggyi</Popup>
                         </Marker>
                         <Marker position={[21.1667, 94.8667]}  icon={customIcon}>
                           <Popup>Bagan</Popup>
                         </Marker>
                         {/* New City Markers for added routes */}
                         <Marker position={[19.7400, 96.1200]}  icon={customIcon}>
                           <Popup>Naypyidaw</Popup>
                         </Marker>
                         <Marker position={[25.3833, 97.3833]}  icon={customIcon}>
                           <Popup>Myitkyina</Popup>
                         </Marker>
                         <Marker position={[16.4800, 97.6200]}  icon={customIcon}>
                           <Popup>Mawlamyine</Popup>
                         </Marker>
                         <Marker position={[20.6200, 96.5700]}  icon={customIcon}>
                           <Popup>Kalaw</Popup>
                         </Marker>
                       
            </MapContainer>
          </motion.div>

          {/* Route Legend */}
          <motion.div className="mt-4" variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BusFront className="w-6 h-6 text-blue-600" /> Route Legend
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {routesData.map((route) => (
                <div key={route.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg shadow-sm">
                  <div className="w-6 h-2 rounded-full" style={{ backgroundColor: route.color }}></div>
                  <span className="text-gray-700 font-medium">{route.name}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              *Route paths are approximate for illustration purposes.
            </p>
          </motion.div>
        </motion.div>
      </div>

     
    </div>
  );
};

export default RoutesMapPage;
