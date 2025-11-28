import './progresssection.css';

export default function ProgressSection({
  completedDays = [false, false, false, false, false, false, false],
  weeklyStats = [0, 0, 0, 0, 0, 0, 0],
  monthProgress = 0,
}: {
  completedDays?: boolean[];
  weeklyStats?: number[];
  monthProgress?: number;
}) {
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <section className="mf-progress">
      <h3>Progresso Semanal</h3>

      <div className="mf-streak-area">
        <p className="mf-small">Streak de dias</p>
        <div className="mf-streak-row">
          {completedDays.map((c, i) => (
            <div key={i} className="mf-streak-item">
              <div className={`mf-streak-circle ${c ? 'done' : 'miss'}`}>{i + 1}</div>
              <span className="mf-small">{weekDays[i]}</span>
            </div>
          ))}
        </div>
      </div>

    <div className="mf-weekly-chart">
      <p className="mf-small">Hábitos concluídos na semana</p>
      <div className="mf-bars-row">
        {weeklyStats.map((v, i) => {
        const max = Math.max(...weeklyStats, 1); 
        const percent = Math.round((v / max) * 100);
            return (
              <div key={i} className="mf-bar-col">
                <div className="mf-bar-bg">
                  <div className="mf-bar-fill" style={{ height: `${percent}%` }} />
                </div>
                <span className="mf-small">{weekDays[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mf-month-progress">
        <div className="mf-month-row">
          <span className="mf-small">Progresso geral do mês</span>
          <span className="mf-month-percent">{monthProgress}%</span>
        </div>
        <div className="mf-month-bar">
          <div className="mf-month-fill" style={{ width: `${monthProgress}%` }} />
        </div>
      </div>
    </section>
  );
}
