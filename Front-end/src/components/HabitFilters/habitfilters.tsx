import { useState } from 'react';
import { X } from 'lucide-react';
import './habitfilters.css';
import type { HabitType, HabitStatus, HabitFrequency } from '../../Types';

export interface HabitFilters {
  nome?: string;
  tipo?: HabitType;
  status?: HabitStatus;
  frequencia?: HabitFrequency;
  concluido?: boolean;
}

interface HabitFiltersProps {
  onFilter: (filters: HabitFilters) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function HabitFiltersComponent({ onFilter, isOpen, onClose }: HabitFiltersProps) {
  const [filters, setFilters] = useState<HabitFilters>({
    nome: '',
    tipo: undefined,
    status: undefined,
    frequencia: undefined,
    concluido: undefined,
  });

  const handleChange = (key: keyof HabitFilters, value: any) => {
    setFilters((prev: HabitFilters) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const handleApply = () => {
    onFilter(filters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters: HabitFilters = {
      nome: '',
      tipo: undefined,
      status: undefined,
      frequencia: undefined,
      concluido: undefined,
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mf-filters-backdrop" onClick={onClose}>
      <div className="mf-filters-modal" onClick={e => e.stopPropagation()}>
        <div className="mf-filters-header">
          <h2>Filtrar Hábitos</h2>
          <button className="mf-filters-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="mf-filters-content">
          <div className="mf-filter-group">
            <label htmlFor="filter-nome">Nome</label>
            <input
              id="filter-nome"
              type="text"
              placeholder="Buscar por nome..."
              value={filters.nome || ''}
              onChange={(e) => handleChange('nome', e.target.value)}
              className="mf-filter-input"
            />
          </div>

          <div className="mf-filter-group">
            <label htmlFor="filter-tipo">Tipo</label>
            <select
              id="filter-tipo"
              value={filters.tipo || ''}
              onChange={(e) => handleChange('tipo', e.target.value)}
              className="mf-filter-select"
            >
              <option value="">Todos os tipos</option>
              <option value="SIM_NAO">Sim/Não</option>
              <option value="QUANTITATIVO">Quantitativo</option>
            </select>
          </div>

          <div className="mf-filter-group">
            <label htmlFor="filter-status">Status</label>
            <select
              id="filter-status"
              value={filters.status || ''}
              onChange={(e) => handleChange('status', e.target.value)}
              className="mf-filter-select"
            >
              <option value="">Todos os status</option>
              <option value="PENDENTE">Pendente</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="ATRASADO">Atrasado</option>
            </select>
          </div>

          <div className="mf-filter-group">
            <label htmlFor="filter-frequencia">Frequência</label>
            <select
              id="filter-frequencia"
              value={filters.frequencia || ''}
              onChange={(e) => handleChange('frequencia', e.target.value)}
              className="mf-filter-select"
            >
              <option value="">Todas as frequências</option>
              <option value="DIARIO">Diário</option>
              <option value="SEMANAL">Semanal</option>
              <option value="MENSAL">Mensal</option>
            </select>
          </div>

          <div className="mf-filter-group">
            <label htmlFor="filter-concluido">Conclusão Hoje</label>
            <select
              id="filter-concluido"
              value={filters.concluido === undefined ? '' : String(filters.concluido)}
              onChange={(e) => {
                if (e.target.value === '') {
                  handleChange('concluido', undefined);
                } else {
                  handleChange('concluido', e.target.value === 'true');
                }
              }}
              className="mf-filter-select"
            >
              <option value="">Todos</option>
              <option value="true">Concluído hoje</option>
              <option value="false">Não concluído hoje</option>
            </select>
          </div>
        </div>

        <div className="mf-filters-footer">
          <button className="mf-filters-btn mf-filters-btn-outline" onClick={handleReset}>
            Limpar Filtros
          </button>
          <button className="mf-filters-btn mf-filters-btn-primary" onClick={handleApply}>
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
