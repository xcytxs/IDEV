import React, { useState } from 'react';
import { teamTemplates } from '../../templates/teamTemplates';
import { Users, ChevronDown } from 'lucide-react';

interface TeamSelectorProps {
  onSelect: (templateId: string) => void;
  selectedId?: string;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({ onSelect, selectedId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center">
          <Users size={20} className="text-gray-400 mr-2" />
          <span className="text-gray-100">
            {selectedId ? teamTemplates[selectedId].name : 'Select Team Template'}
          </span>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-400 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20">
          {Object.entries(teamTemplates).map(([id, template]) => (
            <button
              key={id}
              onClick={() => {
                onSelect(id);
                setIsOpen(false);
              }}
              className={`w-full text-left p-3 hover:bg-gray-700 transition-colors ${
                selectedId === id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center">
                <span className="text-gray-100">{template.name}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{template.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamSelector;