import React from 'react';
import {
  Image as ImageIcon,
  FileCode2,
  Type,
  Palette,
  Calculator,
  BookOpen,
  Wrench,
} from 'lucide-react';

interface ToolIconProps {
  name: string;
  size?: number;
}

export function ToolIcon({ name, size = 16 }: ToolIconProps) {
  switch (name) {
    case 'Image':
      return <ImageIcon size={size} aria-hidden="true" />;
    case 'FileCode2':
      return <FileCode2 size={size} aria-hidden="true" />;
    case 'Type':
      return <Type size={size} aria-hidden="true" />;
    case 'Palette':
      return <Palette size={size} aria-hidden="true" />;
    case 'Calculator':
      return <Calculator size={size} aria-hidden="true" />;
    case 'BookOpen':
      return <BookOpen size={size} aria-hidden="true" />;
    default:
      return <Wrench size={size} aria-hidden="true" />;
  }
}
