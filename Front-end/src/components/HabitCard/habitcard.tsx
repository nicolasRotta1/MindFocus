import {
  Edit2,
  Pause,
  Trash2,
  CheckCircle,
  Briefcase,
} from 'lucide-react';
import './habitcard.css';
import type { HabitResponse, HabitType, HabitFrequency, HabitStatus } from '../../Types';

interface Props extends HabitResponse {
  onConclude?: (id: number) => Promise<void>;
  onEdit?: (habit: HabitResponse) => void;
  onPause?: (id: number) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

const typeMap: Record<HabitType, { className: string; Icon: any }> = {
  SIM_NAO: { className: 'mf-type-simnao', Icon: CheckCircle },
  QUANTITATIVO: { className: 'mf-type-quant', Icon: Briefcase },
};

const statusColor: Record<HabitStatus, string> = {
  PENDENTE: 'mf-status-pending',
  CONCLUIDO: 'mf-status-done',
  ATRASADO: 'mf-status-late',
};

const frequencyLabel: Record<HabitFrequency, string> = {
  DIARIO: 'Diário',
  SEMANAL: 'Semanal',
  MENSAL: 'Mensal',
};

export default function HabitCard(props: Props) {
  const {
    id,
    nome,
    tipo,
    frequencia,
    status = 'PENDENTE',
    criadoEm,
    onConclude,
    onEdit,
    onPause,
    onDelete,
  } = props;

  const { className: typeClass, Icon } = typeMap[tipo];
  const createdAtText = criadoEm ? new Date(criadoEm).toLocaleDateString() : '-';

  return (
    <article className="mf-habit-card">
      <div className="mf-habit-top">
        <div>
          <div className="mf-habit-title-row">
            <h3 className="mf-habit-title">{nome}</h3>
            <span
              className={`mf-status-dot ${statusColor[status]}`}
              title={status}
            ></span>
          </div>

          <div className="mf-habit-meta">
            <span className={`mf-type-badge ${typeClass}`}>
              <Icon size={14} />
              <span className="mf-type-text">{tipo}</span>
            </span>

            <span className="mf-frequency-badge">{frequencyLabel[frequencia]}</span>

            <span className="mf-start-text">Criado em {createdAtText}</span>
          </div>
        </div>
      </div>

      <div className="mf-habit-actions">
        <button
          className="mf-btn mf-btn-ghost"
          onClick={async () => onConclude && (await onConclude(id))}
          title="Concluir"
        >
          <CheckCircle size={16} />
          <span>Concluir</span>
        </button>

        <button className="mf-icon-btn" onClick={() => onEdit && onEdit(props)} title="Editar">
          <Edit2 size={16} />
        </button>

        <button
          className="mf-icon-btn"
          onClick={async () => onPause && (await onPause(id))}
          title="Pausar"
        >
          <Pause size={16} />
        </button>

        <button
          className="mf-icon-btn mf-delete"
          onClick={async () => onDelete && (await onDelete(id))}
          title="Excluir"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
