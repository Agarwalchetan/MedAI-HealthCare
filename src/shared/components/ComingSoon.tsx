import React from 'react';
import { Clock, Wrench, Star } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  phase: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description, phase }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-full">
              <Wrench className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Clock className="h-4 w-4" />
            <span>{phase}</span>
          </div>

          {/* Content */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {description}
          </p>

          {/* Features Preview */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Coming Features</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Advanced Dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Real-time Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>AI-powered Tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Mobile Application</span>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="space-y-4">
            <p className="text-gray-500">
              Want to be notified when this feature launches?
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;