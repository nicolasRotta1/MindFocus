import { X } from 'lucide-react';
import './habitofilter.css';
import type { HabitType, HabitFrequency, HabitStatus } from '../../Types';

interface HabitoFilterProps {
  tipo?: HabitType | '';
  status?: HabitStatus | '';
  frequencia?: HabitFrequency | '';
  onTipoChange: (tipo: HabitType | '') => void;
  onStatusChange: (status: HabitStatus | '') => void;
  onFrequenciaChange: (frequencia: HabitFrequency | '') => void;
  onClear: () => void;
}

export default function HabitoFilter({
  tipo = '',
  status = '',
  frequencia = '',
  onTipoChange,
  onStatusChange,
  onFrequenciaChange,
  onClear,
}: HabitoFilterProps) {
  const hasFilters = tipo || status || frequencia;

  return (
    <div className="mf-habito-filter">
      <div className="mf-filter-header">
        <h3 className="mf-filter-title">Filtrar Hábitos</h3>
        {hasFilters && (
          <button onClick={onClear} className="mf-filter-clear" title="Limpar filtros">
            <X size={16} />
            <span>Limpar</span>
          </button>
        )}
      </div>

      <div className="mf-filter-grid">
        <div className="mf-filter-group">
          <label htmlFor="filter-tipo" className="mf-filter-label">Tipo</label>
          <select
            id="filter-tipo"
            className="mf-filter-select"
            value={tipo}
            onChange={(e) => onTipoChange(e.target.value as HabitType | '')}
          >
            <option value="">Todos os tipos</option>
            <option value="SIM_NAO">Sim / Não</option>
            <option value="QUANTITATIVO">Quantitativo</option>
          </select>
        </div>

        <div className="mf-filter-group">
          <label htmlFor="filter-status" className="mf-filter-label">Status</label>
          <select
            id="filter-status"
            className="mf-filter-select"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as HabitStatus | '')}
          >
            <option value="">Todos os status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="ATRASADO">Atrasado</option>
          </select>
        </div>

        <div className="mf-filter-group">
          <label htmlFor="filter-frequencia" className="mf-filter-label">Frequência</label>
          <select
            id="filter-frequencia"
            className="mf-filter-select"
            value={frequencia}
            onChange={(e) => onFrequenciaChange(e.target.value as HabitFrequency | '')}
          >
            <option value="">Todas as frequências</option>
            <option value="DIARIO">Diário</option>
            <option value="SEMANAL">Semanal</option>
            <option value="MENSAL">Mensal</option>
          </select>
        </div>
      </div>
    </div>
  );
}
