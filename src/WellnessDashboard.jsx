import React, { useMemo, useState } from "react";
import {
  Activity,
  Brain,
  HeartPulse,
  Moon,
  Droplets,
  Users,
  TrendingUp,
  Footprints,
  CalendarDays,
  SlidersHorizontal,
  ShieldCheck,
  Info,
} from "lucide-react";
import "./WellnessDashboard.css";

const sampleData = [
  { day: "Mon", sleep: 7, activity: 45, mood: 7 },
  { day: "Tue", sleep: 6, activity: 30, mood: 6 },
  { day: "Wed", sleep: 8, activity: 55, mood: 8 },
  { day: "Thu", sleep: 6, activity: 25, mood: 5 },
  { day: "Fri", sleep: 7, activity: 60, mood: 8 },
  { day: "Sat", sleep: 9, activity: 70, mood: 9 },
  { day: "Sun", sleep: 8, activity: 40, mood: 8 },
];

const categories = [
  { name: "Academic stress", value: 70, color: "#e99a63" },
  { name: "Physical activity", value: 60, color: "#20a99b" },
  { name: "Social connection", value: 85, color: "#6588df" },
  { name: "Sleep & nutrition", value: 40, color: "#a58ad8" },
  { name: "Mental health support", value: 30, color: "#e47791" },
  { name: "Purposeful activities", value: 75, color: "#7dbd80" },
];

const initialGoals = [
  { id: "sleep", name: "Sleep", target: "8 hours", value: 7, max: 8, unit: "hrs", icon: Moon },
  { id: "activity", name: "Physical activity", target: "60 minutes", value: 35, max: 60, unit: "min", icon: Footprints },
  { id: "water", name: "Hydration", target: "8 glasses", value: 5, max: 8, unit: "glasses", icon: Droplets },
  { id: "stress", name: "Mindfulness", target: "15 minutes", value: 10, max: 15, unit: "min", icon: Brain },
];

function MetricCard({ icon: Icon, label, value, detail, color }) {
  return (
    <article className="ic-metric">
      <div className="ic-metric-top">
        <span className="ic-metric-icon" style={{ "--metric-color": color }}>
          <Icon size={21} />
        </span>
        <TrendingUp size={17} className="ic-trend-icon" />
      </div>
      <p>{label}</p>
      <h3>{value}</h3>
      <span className="ic-metric-detail">{detail}</span>
    </article>
  );
}

function WeeklyChart({ data }) {
  const max = 10;
  const points = data.map((item, i) => ({
    x: 35 + i * 48,
    y: 145 - (item.mood / max) * 115,
    day: item.day,
    value: item.mood,
  }));

  const line = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="ic-chart-scroll">
      <svg
        className="ic-line-chart"
        viewBox="0 0 360 180"
        role="img"
        aria-label="Illustrative weekly mood trend from Monday to Sunday"
      >
        {[0, 2.5, 5, 7.5, 10].map((n) => {
          const y = 145 - (n / max) * 115;
          return (
            <g key={n}>
              <line x1="25" y1={y} x2="340" y2={y} className="ic-grid-line" />
              <text x="17" y={y + 4} textAnchor="end" className="ic-axis-label">
                {n}
              </text>
            </g>
          );
        })}
        <polyline points={line} className="ic-line-path" />
        {points.map((p) => (
          <g key={p.day}>
            <circle cx={p.x} cy={p.y} r="4" className="ic-line-dot">
              <title>{`${p.day}: ${p.value}/10 mood rating`}</title>
            </circle>
            <text x={p.x} y="166" textAnchor="middle" className="ic-axis-label">
              {p.day}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function FactorChart({ items }) {
  return (
    <div className="ic-factor-list">
      {items.map((item) => (
        <div className="ic-factor" key={item.name}>
          <div className="ic-factor-heading">
            <span><i style={{ background: item.color }} />{item.name}</span>
            <strong>{item.value}%</strong>
          </div>
          <div className="ic-bar-track">
            <div
              className="ic-bar-fill"
              style={{ width: `${item.value}%`, background: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function WellbeingDonut({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (score / 100);

  return (
    <div className="ic-donut-wrap">
      <svg viewBox="0 0 150 150" className="ic-donut" role="img" aria-label={`Illustrative well-being score ${score} out of 100`}>
        <circle cx="75" cy="75" r={radius} className="ic-donut-bg" />
        <circle
          cx="75"
          cy="75"
          r={radius}
          className="ic-donut-progress"
          strokeDasharray={`${progress} ${circumference}`}
          transform="rotate(-90 75 75)"
        />
        <text x="75" y="72" className="ic-donut-score">{score}</text>
        <text x="75" y="91" className="ic-donut-label">out of 100</text>
      </svg>
      <div className="ic-donut-legend">
        <p><span className="ic-legend-dot" /> Wellness score <strong>{score}%</strong></p>
        <p><span className="ic-legend-dot muted" /> Remaining <strong>{100 - score}%</strong></p>
        <small>Demonstration score, not a medical assessment.</small>
      </div>
    </div>
  );
}

export default function WellnessDashboard() {
  const [range, setRange] = useState("7");
  const [category, setCategory] = useState("all");
  const [participant, setParticipant] = useState("all");
  const [goals, setGoals] = useState(initialGoals);
  const [water, setWater] = useState(5);
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState("Moderate");
  const [saved, setSaved] = useState(false);

  const visibleData = useMemo(() => {
    const count = Number(range);
    return sampleData.slice(-count);
  }, [range]);

  const filteredCategories = useMemo(() => {
    let items = categories;

    if (category !== "all") {
      items = items.filter((item) => {
        if (category === "mental") {
          return ["Academic stress", "Mental health support"].includes(item.name);
        }
        if (category === "physical") {
          return ["Physical activity", "Sleep & nutrition"].includes(item.name);
        }
        return ["Social connection", "Purposeful activities"].includes(item.name);
      });
    }

    return items;
  }, [category]);

  const score = Math.round(
    visibleData.reduce((total, item) => total + item.mood, 0) /
    visibleData.length * 10
  );

  function updateGoal(id, amount) {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === id
          ? { ...goal, value: Math.max(0, Math.min(goal.max, amount)) }
          : goal
      )
    );
  }

  function saveCheckIn() {
    setSaved(true);
  }

  return (
    <section className="ic-dashboard-section" id="health-dashboard">
      <div className="ic-dashboard-container">
        <div className="ic-dashboard-heading">
          <div>
            <span className="ic-eyebrow"><Activity size={15} /> CAMPUS WELLNESS ANALYTICS</span>
            <h2>Your Health, <span>Your Progress.</span></h2>
            <p>
              Explore wellness indicators, monitor daily habits, and reflect on
              your well-being with this interactive demonstration dashboard.
            </p>
          </div>
          <div className="ic-demo-badge"><span /> Demo dashboard</div>
        </div>

        <div className="ic-filter-panel">
          <div className="ic-filter-title"><SlidersHorizontal size={18} /> Dashboard filters</div>
          <label>
            Date range
            <select value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="7">Last 7 days</option>
              <option value="5">Last 5 days</option>
              <option value="3">Last 3 days</option>
            </select>
          </label>
          <label>
            Wellness category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All categories</option>
              <option value="mental">Mental wellness</option>
              <option value="physical">Physical wellness</option>
              <option value="social">Social wellness</option>
            </select>
          </label>
          <label>
            Participant group
            <select value={participant} onChange={(e) => setParticipant(e.target.value)}>
              <option value="all">All participants</option>
              <option value="students">Students</option>
              <option value="faculty">Faculty</option>
            </select>
          </label>
        </div>

        <div className="ic-data-note">
          <Info size={17} />
          <span>
            Illustrative sample data only. These figures are not verified research
            results, and changing the participant filter does not represent a real
            student or faculty dataset.
          </span>
        </div>

        <div className="ic-metrics-grid">
          <MetricCard icon={HeartPulse} label="Well-being score" value={`${score}/100`} detail="Illustrative mood-based score" color="#14a89a" />
          <MetricCard icon={Brain} label="Academic stress" value="70%" detail="Sample indicator" color="#e9a064" />
          <MetricCard icon={Users} label="Social connection" value="85%" detail="Sample indicator" color="#6588df" />
          <MetricCard icon={Moon} label="Sleep goal" value={`${goals[0].value}/${goals[0].max} hrs`} detail="Editable daily target" color="#a58ad8" />
        </div>

        <div className="ic-charts-grid">
          <article className="ic-panel ic-panel-large">
            <div className="ic-panel-heading">
              <div>
                <h3>Weekly wellness progress</h3>
                <p>Illustrative self-reported mood ratings</p>
              </div>
              <span className="ic-chart-tag"><TrendingUp size={14} /> Trend</span>
            </div>
            <WeeklyChart data={visibleData} />
          </article>

          <article className="ic-panel">
            <div className="ic-panel-heading">
              <div>
                <h3>Well-being overview</h3>
                <p>Calculated from sample mood values</p>
              </div>
            </div>
            <WellbeingDonut score={score} />
          </article>

          <article className="ic-panel">
            <div className="ic-panel-heading">
              <div>
                <h3>Wellness factors</h3>
                <p>Sample participant indicators</p>
              </div>
            </div>
            <FactorChart items={filteredCategories} />
          </article>

          <article className="ic-panel">
            <div className="ic-panel-heading">
              <div>
                <h3>Daily wellness goals</h3>
                <p>Adjust your progress manually</p>
              </div>
              <CalendarDays size={19} className="ic-heading-icon" />
            </div>
            <div className="ic-goal-list">
              {goals.map((goal) => {
                const Icon = goal.icon;
                const percent = Math.round((goal.value / goal.max) * 100);
                return (
                  <div className="ic-goal" key={goal.id}>
                    <div className="ic-goal-top">
                      <span className="ic-goal-icon"><Icon size={17} /></span>
                      <div className="ic-goal-name">
                        <strong>{goal.name}</strong>
                        <small>{goal.value} / {goal.max} {goal.unit}</small>
                      </div>
                      <span className="ic-goal-percent">{percent}%</span>
                    </div>
                    <div className="ic-bar-track">
                      <div className="ic-bar-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <input
                      aria-label={`${goal.name} progress`}
                      type="range"
                      min="0"
                      max={goal.max}
                      value={goal.value}
                      onChange={(e) => updateGoal(goal.id, Number(e.target.value))}
                    />
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        <div className="ic-personal-grid">
          <article className="ic-panel ic-checkin-panel">
            <div className="ic-panel-heading">
              <div>
                <h3>Daily wellness check-in</h3>
                <p>Reflect on how you feel today.</p>
              </div>
              <HeartPulse size={20} className="ic-heading-icon" />
            </div>

            <p className="ic-field-label">How is your mood today?</p>
            <div className="ic-mood-options">
              {[
                ["😞", "Low"],
                ["😐", "Okay"],
                ["🙂", "Good"],
                ["😄", "Great"],
              ].map(([emoji, label]) => (
                <button
                  type="button"
                  key={label}
                  className={`ic-mood-option ${mood === label ? "selected" : ""}`}
                  onClick={() => { setMood(label); setSaved(false); }}
                  aria-pressed={mood === label}
                >
                  <span>{emoji}</span>{label}
                </button>
              ))}
            </div>

            <label className="ic-form-label" htmlFor="ic-stress">Current stress level</label>
            <select id="ic-stress" value={stress} onChange={(e) => { setStress(e.target.value); setSaved(false); }}>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>

            <label className="ic-form-label" htmlFor="ic-water">Water intake today: {water} glasses</label>
            <input
              id="ic-water"
              className="ic-water-slider"
              type="range"
              min="0"
              max="12"
              value={water}
              onChange={(e) => { setWater(Number(e.target.value)); setSaved(false); }}
            />

            <button type="button" className="ic-primary-button" onClick={saveCheckIn}>
              Save demo check-in
            </button>
            {saved && (
              <p className="ic-save-message" role="status">
                Check-in recorded in this page's temporary state. It is not saved to a database.
              </p>
            )}
          </article>

          <article className="ic-panel ic-insights-panel">
            <div className="ic-panel-heading">
              <div>
                <h3>Your wellness suggestions</h3>
                <p>General educational ideas based on your selections</p>
              </div>
              <Brain size={20} className="ic-heading-icon" />
            </div>
            <div className="ic-insight-item">
              <span className="ic-insight-icon"><Moon size={19} /></span>
              <div>
                <strong>Build a sleep routine</strong>
                <p>Try a consistent bedtime and reduce screen use before sleeping.</p>
              </div>
            </div>
            <div className="ic-insight-item">
              <span className="ic-insight-icon"><Footprints size={19} /></span>
              <div>
                <strong>Add movement breaks</strong>
                <p>Take a short walk or stretch between study sessions, as comfortable.</p>
              </div>
            </div>
            <div className="ic-insight-item">
              <span className="ic-insight-icon"><Droplets size={19} /></span>
              <div>
                <strong>Keep water accessible</strong>
                <p>Use regular reminders to help maintain your hydration routine.</p>
              </div>
            </div>
            {stress === "High" && (
              <div className="ic-support-note">
                If stress feels difficult to manage, consider speaking with a
                trusted person or qualified campus counsellor.
              </div>
            )}
            {mood === "Low" && (
              <div className="ic-support-note">
                Consider a gentle activity or reaching out to someone you trust.
                You do not have to manage difficult feelings alone.
              </div>
            )}
            <div className="ic-privacy-note">
              <ShieldCheck size={17} />
              <span>This demo does not transmit or persist personal check-in data.</span>
            </div>
          </article>
        </div>

        <p className="ic-dashboard-disclaimer">
          InfinityCare provides general wellness education, not medical diagnosis
          or treatment. This demonstration uses sample data and temporary
          in-page state; it is not a secure personal health record.
        </p>
      </div>
    </section>
  );
}
