import React, { useState, useEffect } from 'react';
import { Search, Cable as Capsule, Info, ShoppingCart, Star, Filter } from 'lucide-react';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { Medicine } from '../../../shared/types';

const MedicinesPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['all']);

  // Function to parse JSON string fields into arrays
  const parseJsonField = (field: string): string[] => {
    try {
      // Remove outer quotes and parse as JSON
      const cleanField = field.replace(/^["']|["']$/g, '');
      return JSON.parse(cleanField);
    } catch {
      // If parsing fails, split by comma as fallback
      return field.replace(/[\[\]"']/g, '').split(',').map(item => item.trim());
    }
  };

  // Function to fetch medicines from JSON file
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch('/Data/medicine.json');
      const data = await response.json();
      
      // Transform the data to match our Medicine interface
      const transformedMedicines: Medicine[] = data.map((medicine: any) => ({
        id: medicine.id,
        name: medicine.name,
        genericName: medicine.genericName,
        manufacturer: medicine.manufacturer,
        category: medicine.category,
        description: medicine.description,
        dosageForm: medicine.dosageForm,
        strength: medicine.strength,
        price: medicine.price,
        availability: medicine.availability,
        prescriptionRequired: medicine.prescriptionRequired,
        sideEffects: parseJsonField(medicine.sideEffects),
        contraindications: parseJsonField(medicine.contraindications),
        uses: parseJsonField(medicine.uses),
        // Only include image if it exists and is not empty
        ...(medicine.image && medicine.image.trim() !== '' && { image: medicine.image })
      }));
      
      setMedicines(transformedMedicines);
      
      // Extract unique categories from the data
      const uniqueCategories = ['all', ...new Set(transformedMedicines.map(medicine => medicine.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      // Fallback to empty array if fetch fails
      setMedicines([]);
      setCategories(['all']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.uses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMedicineClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowDetails(true);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <UserNavbar />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Medicine Database</h1>
              <p className="text-gray-600 mt-1">Search and learn about medications</p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search medicines by name or condition..."
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Medicines...</h3>
                <p className="text-gray-500">Please wait while we fetch the medicine database.</p>
              </div>
            ) : (
              <>
                {/* Medicines Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedicines.map((medicine) => (
                    <div
                      key={medicine.id}
                      onClick={() => handleMedicineClick(medicine)}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105"
                    >
                      <div className="relative mb-4">
                        {medicine.image ? (
                          <img
                            src={medicine.image}
                            alt={medicine.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Capsule className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        {medicine.prescriptionRequired && (
                          <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            Prescription Required
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{medicine.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{medicine.genericName}</p>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{medicine.description}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-green-600">₹{medicine.price}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">4.5</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {medicine.dosageForm}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {medicine.strength}
                        </span>
                      </div>

                      <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                        <Info className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {filteredMedicines.length === 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Capsule className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Medicines Found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Medicine Details Modal */}
      {showDetails && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMedicine.name}</h2>
                  <p className="text-gray-600">{selectedMedicine.genericName}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <img
                    src={selectedMedicine.image}
                    alt={selectedMedicine.name}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Basic Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Manufacturer:</span>
                          <span className="font-medium">{selectedMedicine.manufacturer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dosage Form:</span>
                          <span className="font-medium">{selectedMedicine.dosageForm}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Strength:</span>
                          <span className="font-medium">{selectedMedicine.strength}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium text-green-600">₹{selectedMedicine.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedMedicine.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Uses</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMedicine.uses.map((use, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Side Effects</h3>
                    <ul className="space-y-1">
                      {selectedMedicine.sideEffects.map((effect, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          <span>{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Contraindications</h3>
                    <ul className="space-y-1">
                      {selectedMedicine.contraindications.map((contraindication, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                          <span>{contraindication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedMedicine.prescriptionRequired && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm font-medium">
                        ⚠️ This medication requires a valid prescription from a licensed healthcare provider.
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Find in Stores</span>
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicinesPage;