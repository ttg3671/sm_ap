// Production data structures and utilities for market-standard application

// Data models for type safety and documentation (TypeScript-like approach)
export const DataModels = {
  SliderItem: {
    id: 'number',
    slider_id: 'number', 
    title: 'string',
    poster_image: 'string',
    type: 'string',
    position: 'number'
  },
  
  HomeItem: {
    id: 'number',
    name: 'string',
    title: 'string',
    type: 'string',
    type_id: 'number',
    position: 'number',
    video_id: 'number',
    status: 'string',
    created_by: 'string',
    created_at: 'string'
  }
};

// Professional business rules and validation
export const BusinessRules = {
  HOME_ITEM: {
    MAX_POSITION: 50,
    VALID_STATUSES: ['Active', 'Inactive', 'Draft'],
    VALID_TYPES: ['1', '2', '3'], // Category types
    REQUIRED_FIELDS: ['name', 'type', 'type_id', 'position']
  },
  
  SLIDER_ITEM: {
    MAX_POSITION: 20,
    VALID_TYPES: ['movie', 'series', 'episode'],
    REQUIRED_FIELDS: ['title', 'type', 'position']
  }
};

// Professional utility functions following industry standards
export const dataUtils = {
  // Comprehensive duplicate checking with business rules
  checkDuplicate: (existingData, newItem) => {
    return existingData.find(item => 
      item.type_id === newItem.type_id && 
      item.type === newItem.type &&
      item.position === newItem.position
    );
  },
  
  // Smart position management
  getNextPosition: (existingData, type) => {
    const itemsOfType = existingData.filter(item => item.type === String(type));
    const maxPosition = itemsOfType.length > 0 
      ? Math.max(...itemsOfType.map(item => item.position))
      : 0;
    return Math.min(maxPosition + 1, BusinessRules.HOME_ITEM.MAX_POSITION);
  },
  
  // Professional validation with detailed error reporting
  validateHomeItem: (item) => {
    const errors = [];
    const warnings = [];
    
    // Required field validation
    BusinessRules.HOME_ITEM.REQUIRED_FIELDS.forEach(field => {
      if (!item[field] || (typeof item[field] === 'string' && !item[field].trim())) {
        errors.push(`${field} is required`);
      }
    });
    
    // Business rule validation
    if (item.position && item.position > BusinessRules.HOME_ITEM.MAX_POSITION) {
      errors.push(`Position cannot exceed ${BusinessRules.HOME_ITEM.MAX_POSITION}`);
    }
    
    if (item.status && !BusinessRules.HOME_ITEM.VALID_STATUSES.includes(item.status)) {
      errors.push(`Status must be one of: ${BusinessRules.HOME_ITEM.VALID_STATUSES.join(', ')}`);
    }
    
    if (item.type && !BusinessRules.HOME_ITEM.VALID_TYPES.includes(item.type)) {
      warnings.push(`Type '${item.type}' may not be supported`);
    }
    
    // Data type validation
    if (item.type_id && (!Number.isInteger(item.type_id) || item.type_id <= 0)) {
      errors.push('type_id must be a positive integer');
    }
    
    if (item.position && (!Number.isInteger(item.position) || item.position <= 0)) {
      errors.push('position must be a positive integer');
    }
    
    return { errors, warnings, isValid: errors.length === 0 };
  },
  
  // Professional data sanitization
  sanitizeHomeItem: (item) => {
    return {
      ...item,
      name: typeof item.name === 'string' ? item.name.trim() : '',
      title: typeof item.title === 'string' ? item.title.trim() : item.name?.trim() || '',
      type: String(item.type).trim(),
      type_id: parseInt(item.type_id, 10) || 0,
      position: parseInt(item.position, 10) || 1,
      video_id: parseInt(item.video_id, 10) || 0,
      status: item.status || 'Active',
      created_at: item.created_at || new Date().toISOString()
    };
  }
};

// Professional CSS utilities with design system principles
export const designSystem = {
  // Container utilities following design system
  containers: {
    main: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    content: "w-full max-w-6xl mx-auto",
    narrow: "w-full max-w-4xl mx-auto",
    wide: "w-full max-w-8xl mx-auto"
  },
  
  // Grid system for professional layouts
  grids: {
    responsive: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
    dense: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4",
    comfortable: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
  },
  
  // Professional card styling
  cards: {
    base: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
    elevated: "bg-white rounded-xl shadow-lg border-0 overflow-hidden",
    interactive: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
  },
  
  // Typography scale
  typography: {
    heading1: "text-3xl font-bold text-gray-900",
    heading2: "text-2xl font-semibold text-gray-800", 
    heading3: "text-xl font-medium text-gray-700",
    body: "text-base text-gray-600",
    small: "text-sm text-gray-500"
  },
  
  // Professional spacing system
  spacing: {
    section: "py-8 sm:py-12",
    component: "p-6",
    tight: "p-4",
    loose: "p-8"
  }
};
