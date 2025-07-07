/* eslint-disable */
'use client';

interface CarSpecificationsProps {
  car: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function CarSpecifications({ car, activeTab, setActiveTab }: CarSpecificationsProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'fuel', label: 'Fuel Economy' },
    { id: 'performance', label: 'Performance' },
    { id: 'safety', label: 'Safety' },
    { id: 'measurements', label: 'Measurements' },
    { id: 'options', label: 'Options' }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-blue-500' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><span className="font-medium">Make:</span> {car.make}</div>
              <div><span className="font-medium">Model:</span> {car.model}</div>
              <div><span className="font-medium">Year:</span> {car.year}</div>
              <div><span className="font-medium">Trim:</span> {car.trim || 'N/A'}</div>
              <div><span className="font-medium">Body type:</span> {car.bodyType || 'Sedan'}</div>
              <div><span className="font-medium">Exterior color:</span> {car.exteriorColor || 'Predawn Gray Mica'}</div>
            </div>
            <div className="space-y-4">
              <div><span className="font-medium">Interior color:</span> {car.interiorColor || 'Black'}</div>
              <div><span className="font-medium">Mileage:</span> {car.mileage?.toLocaleString() || 'N/A'} mi</div>
              <div><span className="font-medium">Condition:</span> {car.condition || 'Used'}</div>
              <div><span className="font-medium">VIN:</span> {car.vin || '4T1BT1HK6JU019398'}</div>
              <div><span className="font-medium">Stock number:</span> {car.stockNumber || '9943VB'}</div>
            </div>
          </div>
        )}

        {activeTab === 'fuel' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><span className="font-medium">Fuel tank size:</span> {car.fuelTankSize || '16'} gal</div>
              <div><span className="font-medium">Combined gas mileage:</span> {car.mpgCombined || '32'} MPG</div>
              <div><span className="font-medium">City gas mileage:</span> {car.mpgCity || '28'} MPG</div>
            </div>
            <div className="space-y-4">
              <div><span className="font-medium">Highway gas mileage:</span> {car.mpgHighway || '39'} MPG</div>
              <div><span className="font-medium">Fuel type:</span> {car.fuelType || 'Gasoline'}</div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><span className="font-medium">Transmission:</span> {car.transmission || '8-Speed Automatic'}</div>
              <div><span className="font-medium">Drivetrain:</span> {car.drivetrain || 'Front-Wheel Drive'}</div>
            </div>
            <div className="space-y-4">
              <div><span className="font-medium">Engine:</span> {car.engine || '2.5L I4'}</div>
              <div><span className="font-medium">Horsepower:</span> {car.horsepower || '203'} hp</div>
            </div>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">NHTSA overall safety rating:</span>
                  <div className="flex">{renderStars(5)}</div>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">NHTSA frontal crash rating:</span>
                  <div className="flex">{renderStars(5)}</div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">NHTSA side crash rating:</span>
                  <div className="flex">{renderStars(5)}</div>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">NHTSA rollover rating:</span>
                  <div className="flex">{renderStars(5)}</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div>ABS Brakes</div>
                <div>Adaptive Cruise Control</div>
                <div>Backup Camera</div>
                <div>Blind Spot Monitoring</div>
                <div>Curtain Airbags</div>
              </div>
              <div className="space-y-2">
                <div>Driver Airbag</div>
                <div>Front Side Airbags</div>
                <div>Passenger Airbag</div>
                <div>Rear Side Airbags</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'measurements' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><span className="font-medium">Doors:</span> {car.doors || '4'} doors</div>
              <div><span className="font-medium">Front legroom:</span> {car.frontLegroom || '42'} in</div>
            </div>
            <div className="space-y-4">
              <div><span className="font-medium">Back legroom:</span> {car.backLegroom || '38'} in</div>
              <div><span className="font-medium">Cargo volume:</span> {car.cargoVolume || '15'} cu ft</div>
            </div>
          </div>
        )}

        {activeTab === 'options' && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div>Alloy Wheels</div>
              <div>Backup Camera</div>
              <div>Bluetooth</div>
              <div>Cruise Control</div>
              <div>Heated Seats</div>
              <div>Keyless Entry</div>
              <div>Navigation System</div>
            </div>
            <div className="space-y-2">
              <div>Premium Audio</div>
              <div>Remote Start</div>
              <div>Sunroof</div>
              <div>USB Connectivity</div>
              <div>Wireless Charging</div>
              <div>Apple CarPlay</div>
              <div>Android Auto</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 