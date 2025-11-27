import { Plus } from 'lucide-react';
import './floatingbutton.css';

interface FloatingButtonProps {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button onClick={onClick} className="mf-floating-button" aria-label="Adicionar hábito">
      <Plus size={24} />
    </button>
  );
}
