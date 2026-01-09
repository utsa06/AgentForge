import React, { useState } from 'react';
import { templates } from '../../lib/templateRegistry';
import { TemplateCard } from './TemplateCard';

interface TemplatesGalleryProps {
  onUseTemplate: (templateId: string) => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ onUseTemplate }) => {
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = filter === 'All'
    ? templates
    : templates.filter(t => t.category === filter);

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`
              px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap
              ${filter === category
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <TemplateCard
              key={template.id}
              template={{
                ...template,
                icon: <Icon className="w-8 h-8 text-white" />,
                nodes: template.nodes || 5 // Fallback if missing
              }}
              onUse={() => onUseTemplate(template.id)}
              onPreview={() => onUseTemplate(template.id)}
            />
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400">No templates found in this category</p>
        </div>
      )}
    </div>
  );
};