import React, { useState, useEffect } from 'react';
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

  // Preenche se for edição
  useEffect(() => {
    if (editing) {
      setNome(editing.nome || '');
      setTipo(editing.tipo);
      setFrequencia(editing.frequencia);
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
    setSaving(true);

    const payload: HabitRequest = {
      nome,
      tipo,
      frequencia,
      notificacaoAtiva,
    };

    try {
      if (editing?.id) {
        const updated = await updateHabit(editing.id, payload);
        onSaved?.(updated);
      } else {
        const created = await createHabit(payload);
        onSaved?.(created);
      }
      onClose();
    } catch (err) {
      console.error('Erro ao salvar hábito', err);
      alert('Erro ao salvar hábito. Veja o console.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mf-modal-backdrop" role="dialog" aria-modal="true">
      <div className="mf-modal">
        <div className="mf-modal-header">
          <h2>{editing ? 'Editar Hábito' : 'Criar Novo Hábito'}</h2>
          <button onClick={onClose} className="mf-icon-btn">
            <X size={18} />
          </button>
        </div>

        <form className="mf-form" onSubmit={submit}>
          <label className="mf-label">Nome do Hábito</label>
          <input
            className="mf-input"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Meditar"
            required
          />

          <label className="mf-label">Tipo do Hábito</label>
          <div className="mf-frequency-row">
            <button
              type="button"
              className={`mf-frequency-btn ${tipo === 'SIM_NAO' ? 'active' : ''}`}
              onClick={() => setTipo('SIM_NAO')}
            >
              Sim / Não
            </button>
            <button
              type="button"
              className={`mf-frequency-btn ${tipo === 'QUANTITATIVO' ? 'active' : ''}`}
              onClick={() => setTipo('QUANTITATIVO')}
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
              onClick={() => setNotificacaoAtiva(!notificacaoAtiva)}
            >
              <div className="mf-toggle-knob" />
            </button>
          </div>

          <div className="mf-form-actions">
            <button type="button" onClick={onClose} className="mf-btn mf-btn-outline">
              Cancelar
            </button>
            <button type="submit" className="mf-btn mf-btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Hábito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
