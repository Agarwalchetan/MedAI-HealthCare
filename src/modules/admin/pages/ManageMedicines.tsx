import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import { adminAPI } from '../services/adminAPI';
import { Medicine } from '../../../shared/types';
import toast from 'react-hot-toast';

const medicineSchema = yup.object({
  name: yup.string().required('Medicine name is required'),
  genericName: yup.string().required('Generic name is required'),
  manufacturer: yup.string().required('Manufacturer is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required'),
  dosageForm: yup.string().required('Dosage form is required'),
  strength: yup.string().required('Strength is required'),
  price: yup.number().min(0).required('Price is required'),
  prescriptionRequired: yup.boolean().required(),
  uses: yup.string().required('Uses are required'),
  sideEffects: yup.string().required('Side effects are required'),
  contraindications: yup.string().required('Contraindications are required')
});

interface MedicineFormData {
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  description: string;
  dosageForm: string;
  strength: string;
  price: number;
  prescriptionRequired: boolean;
  uses: string;
  sideEffects: string;
  contraindications: string;
}

const ManageMedicines: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  const categories = [
    'pain-relief', 'antibiotics', 'diabetes', 'heart-conditions', 
    'respiratory', 'digestive', 'vitamins', 'mental-health'
  ];

  const dosageForms = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Inhaler'];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<MedicineFormData>({
    resolver: yupResolver(medicineSchema)
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await adminAPI.getMedicines();
      setMedicines(response.data?.medicines || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      // Mock data for development
      setMedicines([
        {
          id: '1',
          name: 'Paracetamol',
          genericName: 'Acetaminophen',
          manufacturer: 'Generic Pharma',
          category: 'pain-relief',
          description: 'Pain reliever and fever reducer commonly used for headaches, muscle aches, and fever.',
          dosageForm: 'Tablet',
          strength: '500mg',
          price: 25.50,
          availability: true,
          prescriptionRequired: false,
          sideEffects: ['Nausea', 'Allergic reactions (rare)', 'Liver damage (with overdose)'],
          contraindications: ['Severe liver disease', 'Alcohol dependency'],
          uses: ['Headache', 'Fever', 'Muscle pain', 'Arthritis pain'],
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
          id: '2',
          name: 'Amoxicillin',
          genericName: 'Amoxicillin',
          manufacturer: 'Antibiotic Labs',
          category: 'antibiotics',
          description: 'Broad-spectrum antibiotic used to treat various bacterial infections.',
          dosageForm: 'Capsule',
          strength: '250mg',
          price: 89.99,
          availability: true,
          prescriptionRequired: true,
          sideEffects: ['Diarrhea', 'Nausea', 'Skin rash', 'Allergic reactions'],
          contraindications: ['Penicillin allergy', 'Severe kidney disease'],
          uses: ['Respiratory infections', 'Urinary tract infections', 'Skin infections', 'Dental infections'],
          image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: MedicineFormData) => {
    try {
      const medicineData = {
        ...data,
        uses: data.uses.split(',').map(use => use.trim()),
        sideEffects: data.sideEffects.split(',').map(effect => effect.trim()),
        contraindications: data.contraindications.split(',').map(contra => contra.trim()),
        availability: true,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      };

      if (editingMedicine) {
        await adminAPI.updateMedicine(editingMedicine.id, medicineData);
        setMedicines(prev => prev.map(med => 
          med.id === editingMedicine.id ? { ...med, ...medicineData } : med
        ));
        toast.success('Medicine updated successfully');
        setEditingMedicine(null);
      } else {
        const response = await adminAPI.addMedicine(medicineData);
        setMedicines(prev => [...prev, response.data.medicine]);
        toast.success('Medicine added successfully');
      }
      
      reset();
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save medicine');
    }
  };

  const deleteMedicine = async (medicineId: string) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await adminAPI.deleteMedicine(medicineId);
        setMedicines(prev => prev.filter(med => med.id !== medicineId));
        toast.success('Medicine deleted successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete medicine');
      }
    }
  };

  const editMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setValue('name', medicine.name);
    setValue('genericName', medicine.genericName);
    setValue('manufacturer', medicine.manufacturer);
    setValue('category', medicine.category);
    setValue('description', medicine.description);
    setValue('dosageForm', medicine.dosageForm);
    setValue('strength', medicine.strength);
    setValue('price', medicine.price);
    setValue('prescriptionRequired', medicine.prescriptionRequired);
    setValue('uses', medicine.uses.join(', '));
    setValue('sideEffects', medicine.sideEffects.join(', '));
    setValue('contraindications', medicine.contraindications.join(', '));
    setShowAddForm(true);
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Medicines</h1>
                <p className="text-gray-600 mt-1">Manage the medicine database for patient portal</p>
              </div>
              <button
                onClick={() => {
                  setEditingMedicine(null);
                  reset();
                  setShowAddForm(true);
                }}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
                <span>Add Medicine</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <Pill className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Medicines</p>
                    <p className="text-2xl font-bold text-gray-900">{medicines.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {medicines.filter(m => m.availability).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prescription Required</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {medicines.filter(m => m.prescriptionRequired).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                    <Pill className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                  </div>
                </div>
              </div>
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
                    placeholder="Search medicines by name, generic name, or manufacturer..."
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Medicines Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Medicine Database</h2>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading medicines...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Medicine</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Category</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Manufacturer</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Price</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Prescription</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedicines.map((medicine) => (
                        <tr key={medicine.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <img
                                src={medicine.image}
                                alt={medicine.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{medicine.name}</p>
                                <p className="text-sm text-gray-600">{medicine.genericName}</p>
                                <p className="text-xs text-gray-500">{medicine.dosageForm} • {medicine.strength}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {medicine.category.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-900">{medicine.manufacturer}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm font-medium text-green-600">₹{medicine.price}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              medicine.prescriptionRequired 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {medicine.prescriptionRequired ? 'Required' : 'OTC'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              medicine.availability 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {medicine.availability ? 'Available' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedMedicine(medicine);
                                  setShowMedicineModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => editMedicine(medicine)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteMedicine(medicine.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Medicine Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMedicine(null);
                    reset();
                  }}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="e.g., Paracetamol"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Generic Name</label>
                    <input
                      {...register('genericName')}
                      type="text"
                      placeholder="e.g., Acetaminophen"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.genericName && <p className="mt-1 text-sm text-red-600">{errors.genericName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                    <input
                      {...register('manufacturer')}
                      type="text"
                      placeholder="e.g., Generic Pharma"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.manufacturer && <p className="mt-1 text-sm text-red-600">{errors.manufacturer.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      {...register('category')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dosage Form</label>
                    <select
                      {...register('dosageForm')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select dosage form</option>
                      {dosageForms.map(form => (
                        <option key={form} value={form}>{form}</option>
                      ))}
                    </select>
                    {errors.dosageForm && <p className="mt-1 text-sm text-red-600">{errors.dosageForm.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Strength</label>
                    <input
                      {...register('strength')}
                      type="text"
                      placeholder="e.g., 500mg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.strength && <p className="mt-1 text-sm text-red-600">{errors.strength.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input
                      {...register('price')}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      {...register('prescriptionRequired')}
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Prescription Required
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    placeholder="Detailed description of the medicine"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uses (comma-separated)</label>
                  <input
                    {...register('uses')}
                    type="text"
                    placeholder="e.g., Headache, Fever, Muscle pain"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.uses && <p className="mt-1 text-sm text-red-600">{errors.uses.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Side Effects (comma-separated)</label>
                  <input
                    {...register('sideEffects')}
                    type="text"
                    placeholder="e.g., Nausea, Dizziness, Allergic reactions"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.sideEffects && <p className="mt-1 text-sm text-red-600">{errors.sideEffects.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contraindications (comma-separated)</label>
                  <input
                    {...register('contraindications')}
                    type="text"
                    placeholder="e.g., Liver disease, Kidney problems"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.contraindications && <p className="mt-1 text-sm text-red-600">{errors.contraindications.message}</p>}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingMedicine(null);
                      reset();
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Medicine Details Modal */}
      {showMedicineModal && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Medicine Details</h2>
                <button
                  onClick={() => setShowMedicineModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedMedicine.image}
                    alt={selectedMedicine.name}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{selectedMedicine.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Generic Name:</span>
                          <span className="font-medium">{selectedMedicine.genericName}</span>
                        </div>
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
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowMedicineModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => editMedicine(selectedMedicine)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Edit Medicine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMedicines;