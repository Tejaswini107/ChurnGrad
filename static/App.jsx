const { useState, useRef } = React;

const FIELDS = {
  personal: [
    { id: "gender", label: "Gender", type: "select", options: ["Male", "Female"], tip: "Customer's gender. Some demographics correlate with service usage patterns." },
    { id: "SeniorCitizen", label: "Senior Citizen", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], tip: "Whether the customer is 65 years or older. Senior customers may have different service needs." },
    { id: "Partner", label: "Partner", type: "select", options: ["Yes", "No"], tip: "Whether the customer has a partner. Customers with partners tend to have more stable contracts." },
    { id: "Dependents", label: "Dependents", type: "select", options: ["No", "Yes"], tip: "Whether the customer has dependents (children/family). Affects long-term commitment likelihood." },
    { id: "tenure", label: "Tenure (months)", type: "number", min: 0, max: 72, step: 1, tip: "How long the customer has been with the company. Longer tenure = lower churn risk typically." },
  ],
  services: [
    { id: "PhoneService", label: "Phone Service", type: "select", options: ["Yes", "No"], tip: "Whether the customer has a telephone service." },
    { id: "MultipleLines", label: "Multiple Lines", type: "select", options: ["No", "Yes", { value: "No phone service", label: "No phone service" }], tip: "Whether the customer has multiple phone lines. Indicates deeper service engagement." },
    { id: "InternetService", label: "Internet Service", type: "select", options: ["Fiber optic", "DSL", "No"], tip: "Type of internet service. Fiber optic customers show higher churn rates due to competitive alternatives." },
    { id: "OnlineSecurity", label: "Online Security", type: "select", options: ["No", "Yes", { value: "No internet service", label: "No internet service" }], tip: "Online security add-on. Value-added services reduce churn likelihood." },
    { id: "OnlineBackup", label: "Online Backup", type: "select", options: ["Yes", "No", { value: "No internet service", label: "No internet service" }], tip: "Online backup service. More add-ons = more engagement = lower churn." },
    { id: "DeviceProtection", label: "Device Protection", type: "select", options: ["No", "Yes", { value: "No internet service", label: "No internet service" }], tip: "Device protection plan add-on." },
    { id: "TechSupport", label: "Tech Support", type: "select", options: ["No", "Yes", { value: "No internet service", label: "No internet service" }], tip: "Tech support add-on. Customers with support resolve issues rather than leaving." },
    { id: "StreamingTV", label: "Streaming TV", type: "select", options: ["No", "Yes", { value: "No internet service", label: "No internet service" }], tip: "TV streaming service. Entertainment services increase switching cost." },
    { id: "StreamingMovies", label: "Streaming Movies", type: "select", options: ["No", "Yes", { value: "No internet service", label: "No internet service" }], tip: "Movie streaming service. More services = higher retention typically." },
  ],
  billing: [
    { id: "Contract", label: "Contract Type", type: "select", options: ["Month-to-month", "One year", "Two year"], tip: "Contract duration. Month-to-month customers are highest churn risk — no long-term commitment." },
    { id: "PaperlessBilling", label: "Paperless Billing", type: "select", options: ["Yes", "No"], tip: "Whether the customer uses paperless billing. Digital customers tend to be more price-sensitive." },
    { id: "PaymentMethod", label: "Payment Method", type: "select", options: ["Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"], tip: "How the customer pays. Automatic payments correlate with lower churn (set-and-forget behaviour)." },
    { id: "MonthlyCharges", label: "Monthly Charges ($)", type: "number", min: 0, max: 200, step: 0.01, tip: "Amount charged monthly. Higher charges increase price-sensitivity and churn risk." },
    { id: "TotalCharges", label: "Total Charges ($)", type: "number", min: 0, step: 0.01, tip: "Total amount charged to date. Reflects overall relationship length and value." },
  ]
};

const DEFAULT_VALUES = {
  gender: "Male", SeniorCitizen: "0", Partner: "Yes", Dependents: "No",
  tenure: 12, PhoneService: "Yes", MultipleLines: "No", InternetService: "Fiber optic",
  OnlineSecurity: "No", OnlineBackup: "Yes", DeviceProtection: "No", TechSupport: "No",
  StreamingTV: "No", StreamingMovies: "No", Contract: "Month-to-month",
  PaperlessBilling: "Yes", PaymentMethod: "Electronic check",
  MonthlyCharges: 70.35, TotalCharges: 844.20
};

const HIGH_RISK = {
  gender: "Female", SeniorCitizen: "1", Partner: "No", Dependents: "No",
  tenure: 2, PhoneService: "Yes", MultipleLines: "No", InternetService: "Fiber optic",
  OnlineSecurity: "No", OnlineBackup: "No", DeviceProtection: "No", TechSupport: "No",
  StreamingTV: "Yes", StreamingMovies: "Yes", Contract: "Month-to-month",
  PaperlessBilling: "Yes", PaymentMethod: "Electronic check",
  MonthlyCharges: 95.50, TotalCharges: 191.00
};

const LOW_RISK = {
  gender: "Male", SeniorCitizen: "0", Partner: "Yes", Dependents: "Yes",
  tenure: 60, PhoneService: "Yes", MultipleLines: "Yes", InternetService: "DSL",
  OnlineSecurity: "Yes", OnlineBackup: "Yes", DeviceProtection: "Yes", TechSupport: "Yes",
  StreamingTV: "No", StreamingMovies: "No", Contract: "Two year",
  PaperlessBilling: "No", PaymentMethod: "Bank transfer (automatic)",
  MonthlyCharges: 55.00, TotalCharges: 3300.00
};

function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block", marginLeft: 5 }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 14, height: 14, borderRadius: "50%", fontSize: 9, fontWeight: 500,
          background: "var(--color-background-tertiary)",
          color: "var(--color-text-secondary)",
          border: "0.5px solid var(--color-border-secondary)",
          cursor: "help", userSelect: "none", verticalAlign: "middle"
        }}
      >?</span>
      {show && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
          transform: "translateX(-50%)", width: 190, padding: "8px 10px",
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-primary)",
          borderRadius: "var(--border-radius-md)",
          fontSize: 12, lineHeight: 1.5, color: "var(--color-text-secondary)",
          zIndex: 999, pointerEvents: "none"
        }}>
          {text}
          <span style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            borderWidth: "5px 5px 0", borderStyle: "solid",
            borderColor: "var(--color-border-primary) transparent transparent"
          }} />
        </span>
      )}
    </span>
  );
}

function GaugeMeter({ probability }) {
  const pct = Math.round(probability * 100);
  const toRad = d => (d * Math.PI) / 180;
  const cx = 70, cy = 68, r = 52;
  const startDeg = -215, totalDeg = 250;
  const valueDeg = startDeg + probability * totalDeg;
  const arcPath = (s, e) => {
    const sr = toRad(s), er = toRad(e);
    const x1 = cx + r * Math.cos(sr), y1 = cy + r * Math.sin(sr);
    const x2 = cx + r * Math.cos(er), y2 = cy + r * Math.sin(er);
    const large = e - s > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const nx = cx + (r - 14) * Math.cos(toRad(valueDeg));
  const ny = cy + (r - 14) * Math.sin(toRad(valueDeg));
  const color = probability < 0.4 ? "#3B6D11" : probability < 0.65 ? "#BA7517" : "#A32D2D";
  const label = probability < 0.4 ? "Low risk" : probability < 0.65 ? "Medium risk" : "High risk";

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={140} height={100} viewBox="0 0 140 100">
        <path d={arcPath(startDeg, startDeg + totalDeg)} fill="none" stroke="var(--color-border-tertiary)" strokeWidth={9} strokeLinecap="round" />
        <path d={arcPath(startDeg, valueDeg)} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={4.5} fill={color} />
        <text x={cx} y={cy + 20} textAnchor="middle" fontSize={20} fontWeight="500" fill={color}>{pct}%</text>
      </svg>
      <div style={{ fontSize: 12, fontWeight: 500, color, marginTop: -6 }}>{label}</div>
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  if (field.type === "select") {
    return (
      <select value={value} onChange={e => onChange(field.id, e.target.value)} style={{ width: "100%", fontSize: 13 }}>
        {field.options.map(opt => {
          const v = typeof opt === "object" ? opt.value : opt;
          const l = typeof opt === "object" ? opt.label : opt;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    );
  }
  return (
    <input type="number" value={value} min={field.min} max={field.max} step={field.step || 1}
      onChange={e => onChange(field.id, parseFloat(e.target.value) || 0)}
      style={{ width: "100%", fontSize: 13 }}
    />
  );
}

function Section({ title, fields, values, onChange }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{
        fontSize: 11, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase",
        color: "var(--color-text-secondary)", marginBottom: "0.75rem",
        paddingBottom: "0.5rem", borderBottom: "0.5px solid var(--color-border-tertiary)"
      }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "12px" }}>
        {fields.map(f => (
          <div key={f.id}>
            <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", marginBottom: 5 }}>
              {f.label}<Tooltip text={f.tip} />
            </label>
            <FieldInput field={f} value={values[f.id]} onChange={onChange} />
          </div>
        ))}
      </div>
    </div>
  );
}

window.App = function App() {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [mode, setMode] = useState("predict");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  const handleChange = (id, val) => setValues(prev => ({ ...prev, [id]: val }));
  const handleClear = () => { setValues(DEFAULT_VALUES); setResult(null); setError(null); };

  const handleSubmit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const endpoint = mode === "explain" ? "/explain" : "/predict";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.detail || "Request failed");
      }
      const data = await res.json();
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const isChurn = result?.prediction;
  const statusColor = isChurn ? "#A32D2D" : "#3B6D11";
  const statusBg = isChurn ? "#FCEBEB" : "#EAF3DE";

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem", fontFamily: "var(--font-sans)" }}>

      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 6 }}>
          ChurnGrad Analytics
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 6, color: "var(--color-text-primary)" }}>
          Customer Churn Risk Assessment
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
          Enter customer details to predict churn probability. Hover the <strong style={{ fontWeight: 500 }}>?</strong> on any field for guidance.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Quick presets:</span>
        <button onClick={() => { setValues(HIGH_RISK); setResult(null); }} style={{ fontSize: 12, padding: "5px 12px" }}>
          High risk example
        </button>
        <button onClick={() => { setValues(LOW_RISK); setResult(null); }} style={{ fontSize: 12, padding: "5px 12px" }}>
          Low risk example
        </button>
      </div>

      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1.5rem"
      }}>
        <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: 4 }}>
          {[["predict", "Predict only"], ["explain", "Predict + explain"]].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "8px 12px", fontSize: 13,
              borderRadius: "var(--border-radius-md)",
              background: mode === m ? "var(--color-background-primary)" : "transparent",
              color: mode === m ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              fontWeight: mode === m ? 500 : 400, cursor: "pointer",
              border: mode === m ? "0.5px solid var(--color-border-tertiary)" : "0.5px solid transparent"
            }}>{label}</button>
          ))}
        </div>

        <Section title="Personal information" fields={FIELDS.personal} values={values} onChange={handleChange} />
        <Section title="Services" fields={FIELDS.services} values={values} onChange={handleChange} />
        <Section title="Billing & contract" fields={FIELDS.billing} values={values} onChange={handleChange} />

        <div style={{ display: "flex", gap: 8, marginTop: "0.5rem" }}>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: "10px 16px", fontWeight: 500, fontSize: 14 }}>
            {loading ? "Analysing..." : "Analyse customer risk"}
          </button>
          <button onClick={handleClear} style={{ padding: "10px 16px", fontSize: 14 }}>
            Clear form
          </button>
        </div>

        {error && (
          <div style={{ marginTop: "1rem", padding: "10px 14px", background: "#FCEBEB", border: "0.5px solid #F7C1C1", borderRadius: "var(--border-radius-md)", fontSize: 13, color: "#A32D2D" }}>
            {error}
          </div>
        )}

        {result && (
          <div ref={resultRef} style={{ marginTop: "1.5rem" }}>
            <div style={{ height: "0.5px", background: "var(--color-border-tertiary)", marginBottom: "1.5rem" }} />

            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{
                background: "var(--color-background-secondary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-lg)", padding: "1rem 1.5rem",
                minWidth: 155, textAlign: "center"
              }}>
                <GaugeMeter probability={result.churn_probability} />
              </div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{
                  display: "inline-block", fontSize: 12, fontWeight: 500,
                  padding: "4px 12px", borderRadius: "var(--border-radius-md)",
                  background: statusBg, color: statusColor, marginBottom: 10
                }}>
                  {isChurn ? "Likely to churn" : "Likely to stay"}
                </div>
                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 10 }}>
                  {result.message}
                </p>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                  Churn probability: <span style={{ fontWeight: 500, color: statusColor }}>{(result.churn_probability * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {result.feature_importances && (
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: "0.75rem" }}>
                  Key influencing factors
                </div>
                {(() => {
                  const entries = Object.entries(result.feature_importances).slice(0, 8);
                  const max = Math.max(...entries.map(([, v]) => Math.abs(v)));
                  return entries.map(([name, val]) => {
                    const pct = (Math.abs(val) / max * 100).toFixed(1);
                    const isPos = val > 0;
                    return (
                      <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 140, fontSize: 12, color: "var(--color-text-secondary)", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                        <div style={{ flex: 1, height: 5, background: "var(--color-background-tertiary)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: isPos ? "#E24B4A" : "#639922", borderRadius: 99 }} />
                        </div>
                        <div style={{ width: 52, textAlign: "right", fontSize: 12, fontWeight: 500, flexShrink: 0, color: isPos ? "#A32D2D" : "#3B6D11" }}>
                          {val > 0 ? "+" : ""}{val.toFixed(3)}
                        </div>
                      </div>
                    );
                  });
                })()}
                <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 8, lineHeight: 1.5 }}>
                  Red = pushes toward churn · Green = pushes away from churn · Longer bar = stronger influence
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", textAlign: "center", marginTop: "1.5rem" }}>
        Powered by XGBoost + SHAP &nbsp;·&nbsp; <a href="/docs" style={{ color: "var(--color-text-secondary)" }}>API docs ↗</a>
      </p>
    </div>
  );
}
