import { CheckCircle, XCircle, Edit2, Trash2, History } from 'lucide-react';
import './habitcard.css';
import { useNavigate } from 'react-router-dom';
import type { HabitResponse } from '../../Types';

interface Props extends HabitResponse {
  streak?: number;
  totalConcluidos?: number;
  concluidoHoje?: boolean;
  onConclude?: (id: string | number) => Promise<void>;
  onUnconclude?: (id: string | number) => Promise<void>;
  onEdit?: (habit: HabitResponse) => void;
  onPause?: (id: string | number) => Promise<void>;
  onDelete?: (id: string | number) => Promise<void>;
}

export default function HabitCardSimNao(props: Props) {
  const navigate = useNavigate();
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
    onUnconclude,
    onEdit,
    onDelete,
  } = props;

  function formatDate(d?: string | null): string {
    if (!d) return '-';
    const date = new Date(d);
    if (!isNaN(date.getTime())) return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    return '-';
  }

  const createdAtText = formatDate(criadoEm);

  return (
    <article className="mf-card">
      <div className="mf-top">
        <div>
          <div className="mf-title-row">
            <h3 className="mf-title">{nome}</h3>
            <span className={`mf-status-dot ${status === 'CONCLUIDO' ? 'mf-status-green' : status === 'ATRASADO' ? 'mf-status-gray' : 'mf-status-green'}`} title={status}></span>
          </div>

          <div className="mf-meta">
            <span className="mf-type-badge mf-type-green">
              <span className="mf-type-text">{tipo}</span>
            </span>

            <span className="mf-frequency-badge">{frequencia}</span>

            <span className="mf-start-text">Desde {createdAtText}</span>
          </div>

          <div className="mf-habit-stats">
            <small>Streak: {streak} dias</small>
            <small>Total: {totalConcluidos}</small>
            <small>{concluidoHoje ? '✅ Concluído hoje' : '— Ainda não'}</small>
          </div>
        </div>
      </div>

      <div className="mf-actions">
        {!concluidoHoje ? (
          <button className="mf-btn mf-btn-success" onClick={async () => onConclude && (await onConclude(id))}>
            <CheckCircle size={16} />
            <span>Concluir</span>
          </button>
        ) : (
          <button className="mf-btn mf-btn-secondary" onClick={async () => onUnconclude && (await onUnconclude(id))}>
            <XCircle size={16} />
            <span>Desconcluir</span>
          </button>
        )}

        <button className="mf-icon-btn" onClick={() => navigate(`/habits/${id}/history`)} title="Ver Histórico">
          <History size={16} />
        </button>

        <button className="mf-icon-btn" onClick={() => onEdit && onEdit(props)} title="Editar">
          <Edit2 size={16} />
        </button>

        <button className="mf-icon-btn mf-delete" onClick={async () => onDelete && (await onDelete(id))} title="Excluir">
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
