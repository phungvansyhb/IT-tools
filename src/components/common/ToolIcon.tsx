import React from 'react';
import {
  Activity,
  Image as ImageIcon,
  FileCode2,
  Type,
  Palette,
  Calculator,
  BookOpen,
  Info,
  HelpCircle,
  Shield,
  FileText,
  Mail,
  ExternalLink,
  Wrench,
} from 'lucide-react';

interface ToolIconProps {
  name: string;
  size?: number;
}

export function ToolIcon({ name, size = 16 }: ToolIconProps) {
  switch (name) {
    case 'Activity':
      return <Activity size={size} aria-hidden="true" />;
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
    case 'Info':
      return <Info size={size} aria-hidden="true" />;
    case 'HelpCircle':
      return <HelpCircle size={size} aria-hidden="true" />;
    case 'Shield':
      return <Shield size={size} aria-hidden="true" />;
    case 'FileText':
      return <FileText size={size} aria-hidden="true" />;
    case 'Mail':
      return <Mail size={size} aria-hidden="true" />;
    case 'ExternalLink':
      return <ExternalLink size={size} aria-hidden="true" />;
    default:
      return <Wrench size={size} aria-hidden="true" />;
  }
}
