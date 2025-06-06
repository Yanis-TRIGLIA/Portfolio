
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TerminalCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  onClose?: () => void;
}

export const TerminalCard: React.FC<TerminalCardProps> = ({ 
  id,
  title, 
  description, 
  image, 
  tags,
  onClose 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleCardClick = () => {
    navigate(`/project/${id}`);
  };

  return (
    <div className={`bg-gray-900 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
      isMinimized ? 'h-12 hover:h-auto' : isMaximized ? 'fixed inset-4 z-50 h-auto' : 'transform hover:scale-105'
    }`}>
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-2">
          <button
            onClick={handleClose}
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors cursor-pointer"
            title="Fermer"
          />
          <button
            onClick={handleMinimize}
            className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors cursor-pointer"
            title="Minimiser"
          />
          <button
            onClick={handleMaximize}
            className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors cursor-pointer"
            title={isMaximized ? "Restaurer" : "Agrandir"}
          />
        </div>
        <div className="ml-4 text-gray-400 text-sm font-mono">
          {title.toLowerCase().replace(/\s+/g, '-')}.project
        </div>
      </div>
      
      {/* Terminal Content */}
      {!isMinimized && (
        <div 
          className="p-4 bg-gray-900 text-green-400 font-mono text-sm cursor-pointer hover:bg-gray-850 transition-colors"
          onClick={handleCardClick}
        >
          <div className="mb-4">
            <span className="text-blue-400">$</span> cat project_info.md
          </div>
          
          {/* Project Image */}
          <div className="mb-4 bg-gray-800 p-2 rounded">
            <img 
              src={image} 
              alt={title}
              className="w-full h-32 object-cover rounded"
            />
          </div>
          
          {/* Project Details */}
          <div className="space-y-2">
            <div>
              <span className="text-yellow-400">## </span>
              <span className="text-white font-semibold">{title}</span>
            </div>
            
            <div className="text-gray-300 text-xs leading-relaxed">
              {description}
            </div>
            
            {/* Tags */}
            <div className="mt-3">
              <span className="text-purple-400">Technologies:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-800 text-cyan-400 text-xs rounded border border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-green-400">
            <span className="text-blue-400">$</span> <span className="animate-pulse">_</span>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Cliquez pour voir les détails du projet
          </div>
        </div>
      )}
    </div>
  );
};
