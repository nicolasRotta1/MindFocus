import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import './newhabitmodal.css';
import { createHabit, updateHabit } from '../../Services/HabitsService';
import type { HabitRequest, HabitResponse, HabitType, HabitFrequency } from '../../Types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (habit: HabitResponse) => void;
  editing?: HabitResponse | null;
}

export default function NewHabitModal({ isOpen, onClose, onSaved, editing = null }: Props) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<HabitType>('SIM_NAO');
  const [frequencia, setFrequencia] = useState<HabitFrequency>('DIARIO');
  const [notificacaoAtiva, setNotificacaoAtiva] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setNome(editing.nome ?? '');
      setTipo((editing.tipo as HabitType) ?? 'SIM_NAO');
      setFrequencia((editing.frequencia as HabitFrequency) ?? 'DIARIO');
      setNotificacaoAtiva(editing.notificacaoAtiva ?? true);
    } else {
      setNome('');
      setTipo('SIM_NAO');
      setFrequencia('DIARIO');
      setNotificacaoAtiva(true);
    }
  }, [editing, isOpen]);

  if (!isOpen) return null;

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (saving) return;
    setSaving(true);

    const payload: HabitRequest = {
      nome,
      tipo,
      frequencia,
      notificacaoAtiva,
      concluido: false,
      progresso: 0,
      status: 'PENDENTE',
    };

    try {
      let result: HabitResponse;

      if (editing?.id != null) {
        result = await updateHabit(editing.id as number, payload);
      } else {
        result = await createHabit(payload);
      }

      onSaved?.(result);
      onClose();
    } catch (err) {
      console.error('Erro ao salvar hábito', err);
      alert('Erro ao salvar hábito. Confira o console.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mf-modal-backdrop" role="dialog" aria-modal="true" aria-label={editing ? 'Editar hábito' : 'Criar hábito'}>
      <div className="mf-modal">
        <div className="mf-modal-header">
          <h2>{editing ? 'Editar Hábito' : 'Criar Novo Hábito'}</h2>
          <button onClick={onClose} className="mf-icon-btn" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form className="mf-form" onSubmit={submit}>
          <label className="mf-label" htmlFor="habit-name">Nome do Hábito</label>
          <input
            id="habit-name"
            className="mf-input"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Meditar"
            required
            maxLength={120}
            aria-required
          />

          <label className="mf-label">Tipo do Hábito</label>
          <div className="mf-grid-typeselect" role="tablist" aria-label="Tipo do hábito">
            <button
              type="button"
              className={`mf-type-item ${tipo === 'SIM_NAO' ? 'active' : ''}`}
              onClick={() => setTipo('SIM_NAO')}
              role="tab"
              aria-selected={tipo === 'SIM_NAO'}
            >
              Sim / Não
            </button>

            <button
              type="button"
              className={`mf-type-item ${tipo === 'QUANTITATIVO' ? 'active' : ''}`}
              onClick={() => setTipo('QUANTITATIVO')}
              role="tab"
              aria-selected={tipo === 'QUANTITATIVO'}
            >
              Quantitativo
            </button>
          </div>

          <label className="mf-label">Frequência</label>
          <div className="mf-frequency-row">
            <button
              type="button"
              className={`mf-frequency-btn ${frequencia === 'DIARIO' ? 'active' : ''}`}
              onClick={() => setFrequencia('DIARIO')}
            >
              Diário
            </button>
            <button
              type="button"
              className={`mf-frequency-btn ${frequencia === 'SEMANAL' ? 'active' : ''}`}
              onClick={() => setFrequencia('SEMANAL')}
            >
              Semanal
            </button>
            <button
              type="button"
              className={`mf-frequency-btn ${frequencia === 'MENSAL' ? 'active' : ''}`}
              onClick={() => setFrequencia('MENSAL')}
            >
              Mensal
            </button>
          </div>

          <div className="mf-notif-row">
            <div>
              <p className="mf-notif-title">Habilitar Notificações</p>
              <p className="mf-notif-desc">Receba lembretes</p>
            </div>
            <button
              type="button"
              className={`mf-toggle ${notificacaoAtiva ? 'on' : ''}`}
              onClick={() => setNotificacaoAtiva((s) => !s)}
            >
              <div className="mf-toggle-knob" />
            </button>
          </div>

          <div className="mf-form-actions">
            <button type="button" onClick={onClose} className="mf-btn mf-btn-outline">Cancelar</button>
            <button type="submit" className="mf-btn mf-btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : (editing ? 'Salvar alterações' : 'Salvar Hábito')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
