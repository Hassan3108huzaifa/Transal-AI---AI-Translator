import React from 'react';
import Select from 'react-select';

interface LanguageOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: LanguageOption | null;
  onChange: (newValue: LanguageOption | null) => void;
  options: LanguageOption[];
  placeholder: string;
  className?: string;
}

export default function LanguageDropdown({ value, onChange, options, placeholder, className }: DropdownProps) {
  return (
    <Select
      className={className}
      classNamePrefix="select"
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      isClearable={true}
      isSearchable={true}
    />
  );
}

