import { useState } from 'react';
import { CheckCircle, XCircle, Edit2, Pause, Trash2, History } from 'lucide-react';
import './habitcard.css';
import { useNavigate } from 'react-router-dom';
import type { HabitResponse } from '../../Types';

interface Props extends HabitResponse {
  streak?: number;
  totalConcluidos?: number;
  concluidoHoje?: boolean;
  onConclude?: (id: string, valor?: number) => Promise<void>;
  onUnconclude?: (id: string) => Promise<void>;
  onEdit?: (habit: HabitResponse) => void;
  onPause?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export default function HabitCardQuantitativo(props: Props) {
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
    progresso = 0,
    metaValor = 0,
    unidade = '',
    onConclude,
    onUnconclude,
    onEdit,
    onPause,
    onDelete,
  } = props;

  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const percent = metaValor && metaValor > 0 ? Math.min(100, Math.round((progresso / metaValor) * 100)) : 0;

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
            <span className="mf-type-badge mf-type-blue">
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

          <div className="mf-quant-progress">
            <div className="mf-quant-row">
              <div className="mf-quant-value">{displayValue} {unidade || ''}</div>
              <div className="mf-quant-meta">/ {metaValor ?? '-'} {unidade || ''}</div>
            </div>
            <div className="mf-quant-bar">
              <div className="mf-quant-fill" style={{ width: `${percent}%` }} />
            </div>
            <div className="mf-quant-percent">{percent}%</div>
          </div>
        </div>
      </div>

      <div className="mf-actions">
        {!concluidoHoje ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!showInput ? (
              <button className="mf-btn mf-btn-success" onClick={() => setShowInput(true)}>
                <CheckCircle size={16} />
                <span>Registrar</span>
              </button>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                    }}
                    placeholder={metaValor ? `0 - ${metaValor}` : 'Valor'}
                    className="mf-quant-input"
                  />
                  <button
                    className="mf-btn mf-btn-success"
                    onClick={async () => {
                      try {
                        const val = inputValue === '' ? undefined : Number(inputValue);
                        if (onConclude) await onConclude(id, val);
                        setShowInput(false);
                        setInputValue('');
                      } catch (err) {
                        console.error('Erro ao registrar valor:', err);
                        // silently fail, caller will handle errors
                      }
                    }}
                  >
                    <span>OK</span>
                  </button>
                  <button className="mf-btn mf-btn-secondary" onClick={() => { setShowInput(false); setInputValue(''); }}>
                    Cancel
                  </button>
                </div>
                
              </>
            )}
          </div>
          ) : (
          <button className="mf-btn mf-btn-secondary" onClick={async () => { if (onUnconclude) await onUnconclude(id); }}>
            <XCircle size={16} />
            <span>Desregistrar</span>
          </button>
        )}

        <button className="mf-icon-btn" onClick={() => navigate(`/habits/${id}/history`)} title="Ver Histórico">
          <History size={16} />
        </button>

        <button className="mf-icon-btn" onClick={() => onEdit && onEdit(props)} title="Editar">
          <Edit2 size={16} />
        </button>

        <button className="mf-icon-btn" onClick={async () => onPause && (await onPause(id))} title="Pausar">
          <Pause size={16} />
        </button>

        <button className="mf-icon-btn mf-delete" onClick={async () => onDelete && (await onDelete(id))} title="Excluir">
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
