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
  streak?: number;
  totalConcluidos?: number;
  concluidoHoje?: boolean;
  onConclude?: (id: number | string) => Promise<void>;
  onEdit?: (habit: HabitResponse) => void;
  onPause?: (id: number | string) => Promise<void>;
  onDelete?: (id: number | string) => Promise<void>;
}

function formatDate(d?: string | null): string {
  if (!d) return '-';

  // tenta parsear diretamente
  let date = new Date(d);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  date = new Date(d + 'Z');
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  if (d.length >= 10) {
    return d.substring(0, 10).split('-').reverse().join('/');
  }

  return '-';
}

const typeMap: Record<
  HabitType,
  { className: string; Icon: any }
> = {
  SIM_NAO: { className: 'mf-type-green', Icon: CheckCircle },
  QUANTITATIVO: { className: 'mf-type-blue', Icon: Briefcase },
};

const statusColor: Record<HabitStatus, string> = {
  PENDENTE: 'mf-status-green',
  CONCLUIDO: 'mf-status-green',
  ATRASADO: 'mf-status-gray',
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
    streak = 0,
    totalConcluidos = 0,
    concluidoHoje = false,
    onConclude,
    onEdit,
    onPause,
    onDelete,
  } = props;

  const { className: typeClass, Icon } = typeMap[tipo];

  const createdAtText = formatDate(criadoEm);

  return (
    <article className="mf-card">
      <div className="mf-top">
        <div>
          <div className="mf-title-row">
            <h3 className="mf-title">{nome}</h3>
            <span
              className={`mf-status-dot ${statusColor[status]}`}
              title={status}
            ></span>
          </div>

          <div className="mf-meta">
            <span className={`mf-type-badge ${typeClass}`}>
              <Icon size={14} />
              <span className="mf-type-text">{tipo}</span>
            </span>

            <span className="mf-frequency-badge">
              {frequencyLabel[frequencia]}
            </span>

            <span className="mf-start-text">
              Desde {createdAtText}
            </span>
          </div>

          <div className="mf-habit-stats">
            <small>Streak: {streak} dias</small>
            <small>Total: {totalConcluidos}</small>
            <small>{concluidoHoje ? '✅ Concluído hoje' : '— Ainda não'}</small>
          </div>
        </div>
      </div>

      <div className="mf-actions">
        <button
          className="mf-btn mf-btn-success"
          onClick={async () =>
            onConclude && (await onConclude(id))
          }
        >
          <CheckCircle size={16} />
          <span>Concluir</span>
        </button>

        <button
          className="mf-icon-btn"
          onClick={() => onEdit && onEdit(props)}
          title="Editar"
        >
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
          onClick={async () =>
            onDelete && (await onDelete(id))
          }
          title="Excluir"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
