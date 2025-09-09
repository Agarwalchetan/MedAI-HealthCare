import React, { useState, useMemo } from 'react';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES, Language } from './translateService';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedLang = SUPPORTED_LANGUAGES.find((lang: Language) => lang.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) {
      return SUPPORTED_LANGUAGES;
    }
    
    const query = searchQuery.toLowerCase();
    return SUPPORTED_LANGUAGES.filter((language: Language) => 
      language.name.toLowerCase().includes(query) ||
      language.nativeName.toLowerCase().includes(query) ||
      language.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Language Selector Button */}
      <button
        onClick={handleDropdownToggle}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
      >
        <Globe className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {selectedLang.nativeName}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Select Language ({filteredLanguages.length})
              </div>
              
              {/* Search Box */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search languages..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Language List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((language: Language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-gray-100 transition-colors duration-150 ${
                      selectedLanguage === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{language.nativeName}</span>
                      <span className="text-xs text-gray-500">{language.name}</span>
                    </div>
                    {selectedLanguage === language.code && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-gray-500 text-sm">
                  No languages found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;