import { Link } from 'react-router-dom';

// Placeholder catalog — replace SERVICES with the finalized 27-item list
// (AI & Automation / Web & Platform Development / Brand & Growth) once
// copy is fully approved. Structural Engineering items are intentionally
// excluded per standing instruction.
const SERVICES = [
  { id: 'ai-consultation', name: 'AI Consultation', priceCents: 4995 },
  { id: 'custom-ai-agent', name: 'Custom AI Agent', priceCents: 699900 },
  // ...remaining items go here once finalized
];

export default function ServicesCatalog() {
  return (
    <div>
      <h1>Our Services</h1>
      {SERVICES.map((s) => (
        <div key={s.id}>
          <h2>{s.name}</h2>
          <p>${(s.priceCents / 100).toFixed(2)}</p>
        </div>
      ))}
      <p>
        Already a client? <Link to="/login">Log in to your portal</Link>
      </p>
    </div>
  );
}
