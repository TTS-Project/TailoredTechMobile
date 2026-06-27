// AI Readiness Diagnostic — 21 questions across 7 sections.
// type: 'radio' | 'checkbox' | 'scale' | 'textarea'

export const INTAKE_SECTIONS = [
  {
    label: 'Context',
    questions: [
      {
        id: 'q1', type: 'radio', text: 'What does your business primarily do?', hint: "Pick the closest fit — we'll get into specifics shortly.",
        options: [
          { value: 'sells products', label: 'Sells physical or digital products' },
          { value: 'delivers services', label: 'Delivers services or consulting' },
          { value: 'manages operations', label: 'Manages internal operations or logistics' },
          { value: 'generates leads', label: 'Generates leads and closes deals' },
          { value: 'builds things', label: 'Builds, constructs, or manufactures' },
          { value: 'education content', label: 'Teaches, trains, or creates content' },
        ],
      },
      {
        id: 'q2', type: 'radio', text: 'How big is your current team?',
        options: [
          { value: 'just me', label: 'Just me' },
          { value: '2-10', label: '2–10 people' },
          { value: '11-50', label: '11–50 people' },
          { value: '51-200', label: '51–200 people' },
          { value: '200+', label: '200+' },
        ],
      },
      {
        id: 'q3', type: 'checkbox', text: "What's eating the most hours in your business right now?", hint: 'Select everything that feels true.',
        options: [
          { value: 'admin', label: 'Admin and paperwork' },
          { value: 'customer support', label: 'Customer questions and support' },
          { value: 'scheduling', label: 'Scheduling and coordination' },
          { value: 'sales follow up', label: 'Following up with leads or clients' },
          { value: 'content creation', label: 'Creating content or reports' },
          { value: 'data entry', label: 'Data entry or manual tracking' },
        ],
      },
    ],
  },
  {
    label: 'Pressure Points',
    questions: [
      {
        id: 'q4', type: 'radio', text: 'If something consistently keeps you up at night about your business, what category does it fall into?',
        options: [
          { value: 'cash flow', label: 'Cash flow and revenue' },
          { value: 'not enough leads', label: 'Not enough leads or customers' },
          { value: 'team capacity', label: "Team can't keep up with demand" },
          { value: 'quality control', label: 'Quality and consistency issues' },
          { value: 'owner dependency', label: 'Everything depends on me personally' },
          { value: 'competitor pressure', label: 'Losing ground to competitors' },
        ],
      },
      {
        id: 'q5', type: 'scale', text: 'How much of your week is spent on work only you can do?',
        hint: '1 = almost all repetitive tasks · 10 = nearly everything requires my expertise',
        min: 1, max: 10, endpoints: ['Mostly repetitive', 'Truly irreplaceable'],
      },
      {
        id: 'q6', type: 'radio', text: 'Where do most of your customers currently come from?',
        options: [
          { value: 'referrals', label: 'Word of mouth or referrals' },
          { value: 'social media', label: 'Social media or content' },
          { value: 'paid ads', label: 'Paid advertising' },
          { value: 'search', label: 'Google / search' },
          { value: 'outbound', label: 'Outbound sales or cold outreach' },
          { value: 'partnerships', label: 'Partners or events' },
        ],
      },
      {
        id: 'q7', type: 'radio', text: "What happens to leads or prospects who don't buy immediately?", columns: 1,
        options: [
          { value: 'manual followup', label: 'We follow up manually when we remember' },
          { value: 'automated', label: 'They go into an automated email or message sequence' },
          { value: 'fall through', label: 'Honestly — most of them fall through the cracks' },
          { value: 'not enough leads', label: "We don't have enough leads to worry about follow-up yet" },
        ],
      },
    ],
  },
  {
    label: 'People & Systems',
    questions: [
      {
        id: 'q8', type: 'radio', text: 'How do you currently track customers, leads, or projects?',
        options: [
          { value: 'crm', label: 'A CRM or project management tool' },
          { value: 'spreadsheets', label: 'Spreadsheets' },
          { value: 'notes email', label: 'Notes, email, or memory' },
          { value: 'paper', label: 'Paper or whiteboard' },
          { value: 'no system', label: 'No real system yet' },
        ],
      },
      {
        id: 'q9', type: 'radio', text: 'How often does work get redone or corrected because of miscommunication?',
        options: [
          { value: 'rarely', label: 'Rarely — clear processes in place' },
          { value: 'sometimes', label: 'Sometimes — maybe once a week' },
          { value: 'often', label: "Often — it's a real drag on output" },
          { value: 'all the time', label: "All the time — it's a major problem" },
        ],
      },
      {
        id: 'q10', type: 'textarea', text: 'If your top employee or yourself were unavailable for two weeks, what would break first?',
        placeholder: 'Be specific — this reveals your biggest operational dependency…', rows: 3,
      },
      {
        id: 'q11', type: 'radio', text: 'How would you describe the average skill level of your team with technology?',
        options: [
          { value: 'resistant', label: 'Resistant or not tech-savvy' },
          { value: 'basic', label: 'Can handle basic tools with guidance' },
          { value: 'comfortable', label: 'Comfortable — they adapt quickly' },
          { value: 'tech forward', label: 'Tech-forward — they seek new tools' },
        ],
      },
    ],
  },
  {
    label: 'Revenue & Sales',
    questions: [
      {
        id: 'q12', type: 'radio', text: 'Where in the sales process do you lose the most potential customers?', columns: 1,
        options: [
          { value: 'awareness', label: "People don't know we exist" },
          { value: 'interest', label: "They show interest but don't reach out" },
          { value: 'proposal', label: 'They reach out but ghost after a quote' },
          { value: 'closing', label: 'We talk, but struggle to close' },
          { value: 'retention', label: "We close but customers don't return" },
        ],
      },
      {
        id: 'q13', type: 'scale', text: 'How predictable is your monthly revenue?',
        hint: "1 = completely unpredictable · 10 = we know exactly what's coming in",
        min: 1, max: 10, endpoints: ['Unpredictable', 'Highly predictable'],
      },
      {
        id: 'q14', type: 'radio', text: 'Does your business produce recurring revenue (subscriptions, retainers, repeat orders)?',
        options: [
          { value: 'yes strong', label: "Yes — it's core to our model" },
          { value: 'some', label: 'Some, but it could be stronger' },
          { value: 'no want to', label: 'No, but I want to build it in' },
          { value: 'no doesnt fit', label: "No — it doesn't fit our model" },
        ],
      },
    ],
  },
  {
    label: 'Marketing & Content',
    questions: [
      {
        id: 'q15', type: 'radio', text: 'How consistently does your business produce marketing content?',
        hint: 'Posts, emails, videos, ads — anything public-facing.', columns: 1,
        options: [
          { value: 'daily', label: 'Daily or near-daily' },
          { value: 'weekly', label: 'A few times per week' },
          { value: 'monthly', label: 'A few times per month' },
          { value: 'rarely', label: 'Rarely — when we have time' },
          { value: 'never', label: "We basically don't produce content" },
        ],
      },
      {
        id: 'q16', type: 'radio', text: "What's the single biggest reason you don't produce more content?",
        options: [
          { value: 'no time', label: 'No time' },
          { value: 'no ideas', label: "Don't know what to say" },
          { value: 'no skills', label: 'Lack writing or design skills' },
          { value: 'no budget', label: 'No budget to hire creators' },
          { value: 'not priority', label: "It's just not a priority yet" },
          { value: 'enough already', label: 'We already produce plenty' },
        ],
      },
    ],
  },
  {
    label: 'AI Readiness',
    questions: [
      {
        id: 'q17', type: 'checkbox', text: 'How has your business used AI so far?', hint: 'Check all that apply.',
        options: [
          { value: 'writing ai', label: 'ChatGPT or Claude for writing' },
          { value: 'images', label: 'Image generation' },
          { value: 'chatbots', label: 'Customer-facing chatbots' },
          { value: 'automation', label: 'Workflow automation tools' },
          { value: 'analytics', label: 'AI analytics or insights' },
          { value: 'none', label: "We haven't used AI yet" },
        ],
      },
      {
        id: 'q18', type: 'radio', text: "What's your honest hesitation about adopting AI into your business?", columns: 1,
        options: [
          { value: 'cost', label: "Cost — I don't know if the ROI is there" },
          { value: 'trust', label: "Trust — I'm not sure AI output is reliable" },
          { value: 'complexity', label: 'Complexity — it feels overwhelming to start' },
          { value: 'team buyin', label: 'Team buy-in — my people may resist it' },
          { value: 'ready', label: "Honestly — I'm ready to move fast" },
        ],
      },
      {
        id: 'q19', type: 'textarea', text: 'If AI could handle one thing in your business starting tomorrow, what would have the biggest immediate impact?',
        placeholder: "Don't overthink it — first instinct is usually right…", rows: 3,
      },
    ],
  },
  {
    label: 'Goals & Vision',
    questions: [
      {
        id: 'q20', type: 'radio', text: 'What does success look like for your business 12 months from now?',
        options: [
          { value: 'revenue', label: 'Significantly more revenue' },
          { value: 'freedom', label: 'More personal freedom, less hustle' },
          { value: 'team', label: 'A bigger, more capable team' },
          { value: 'markets', label: 'Expansion into new markets' },
          { value: 'operations', label: 'Cleaner, more predictable operations' },
          { value: 'exit', label: 'A business ready to sell or hand off' },
        ],
      },
      {
        id: 'q21', type: 'textarea', text: "What's something you've tried to fix in your business more than twice but it still isn't solved?",
        hint: 'This is the real bottleneck. Nothing is too simple or too messy to say here.',
        placeholder: "Describe it plainly — what's the thing that keeps coming back…", rows: 4,
      },
    ],
  },
];

export const TOTAL_QUESTIONS = INTAKE_SECTIONS.reduce((s, sec) => s + sec.questions.length, 0);

export function isAnswered(q, answers) {
  const v = answers[q.id];
  if (q.type === 'checkbox') return Array.isArray(v) && v.length > 0;
  if (q.type === 'scale') return v !== undefined && v !== null && v !== '';
  if (q.type === 'textarea') return typeof v === 'string' && v.trim().length > 0;
  return v !== undefined && v !== null && v !== '';
}
