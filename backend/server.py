from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import smtplib
import ssl
import asyncio
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone

from auth import build_auth_router, setup_auth


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class IntakeContact(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = ""

class IntakeSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    contact: IntakeContact
    answers: Dict[str, Any] = Field(default_factory=dict)
    meta: Optional[Dict[str, Any]] = None


# ---------- Intake question metadata (mirrors the frontend) ----------
INTAKE_QUESTIONS_TEXT = {
    "q1":  "What does your business primarily do?",
    "q2":  "How big is your current team?",
    "q3":  "What's eating the most hours in your business right now?",
    "q4":  "What keeps you up at night about your business?",
    "q5":  "How much of your week is spent on work only you can do? (1-10)",
    "q6":  "Where do most of your customers currently come from?",
    "q7":  "What happens to leads or prospects who don't buy immediately?",
    "q8":  "How do you currently track customers, leads, or projects?",
    "q9":  "How often does work get redone because of miscommunication?",
    "q10": "If your top employee or yourself were unavailable for two weeks, what would break first?",
    "q11": "How would you describe the team's tech skill level?",
    "q12": "Where in the sales process do you lose the most potential customers?",
    "q13": "How predictable is your monthly revenue? (1-10)",
    "q14": "Does your business produce recurring revenue?",
    "q15": "How consistently does your business produce marketing content?",
    "q16": "What's the single biggest reason you don't produce more content?",
    "q17": "How has your business used AI so far?",
    "q18": "What's your honest hesitation about adopting AI?",
    "q19": "If AI could handle one thing in your business tomorrow, what would have the biggest immediate impact?",
    "q20": "What does success look like for your business 12 months from now?",
    "q21": "What's something you've tried to fix more than twice but it still isn't solved?",
}


def _format_answer(value: Any) -> str:
    if value is None:
        return "—"
    if isinstance(value, list):
        return ", ".join(str(v) for v in value) if value else "—"
    return str(value)


def _build_email_bodies(submission: IntakeSubmission) -> tuple[str, str]:
    """Return (plain_text, html) email bodies."""
    c = submission.contact
    rows_text = []
    rows_html = []
    for qid, q_text in INTAKE_QUESTIONS_TEXT.items():
        v = _format_answer(submission.answers.get(qid))
        rows_text.append(f"{qid.upper()}: {q_text}\n  → {v}\n")
        rows_html.append(
            f"<tr><td style='padding:10px 14px;border-bottom:1px solid #2a2a40;vertical-align:top;'>"
            f"<div style='font:11px ui-monospace,Menlo,monospace;color:#d4a843;letter-spacing:0.12em;'>"
            f"{qid.upper()}</div>"
            f"<div style='font:14px ui-sans-serif,system-ui;color:#e8e8f0;margin-top:4px;'>{q_text}</div>"
            f"<div style='font:14px ui-sans-serif,system-ui;color:#a0a0b8;margin-top:6px;'><strong style='color:#f0f0f8;'>{v}</strong></div>"
            f"</td></tr>"
        )

    submitted_at = (submission.meta or {}).get("submittedAt") if submission.meta else None
    submitted_str = submitted_at or datetime.now(timezone.utc).isoformat()

    text_body = (
        f"New AI Readiness Diagnostic submission\n"
        f"=======================================\n\n"
        f"Name:    {c.name}\n"
        f"Email:   {c.email}\n"
        f"Company: {c.company or '—'}\n"
        f"Submitted: {submitted_str}\n\n"
        f"--- Answers ---\n\n"
        + "\n".join(rows_text)
    )

    html_body = f"""
<!doctype html>
<html><body style="margin:0;background:#09090f;padding:24px;font-family:ui-sans-serif,system-ui,-apple-system;">
  <div style="max-width:680px;margin:0 auto;background:#111126;border:1px solid #2a2a40;border-radius:16px;overflow:hidden;">
    <div style="padding:24px 28px;background:linear-gradient(135deg,#1a0d3a,#0d1a3a);border-bottom:1px solid #2a2a40;">
      <div style="font:11px ui-monospace,Menlo,monospace;color:#d4a843;letter-spacing:0.18em;text-transform:uppercase;">Tailored Tech Solutions</div>
      <div style="font:700 22px ui-sans-serif,system-ui;color:#f0f0f8;margin-top:6px;">New AI Readiness Diagnostic</div>
    </div>
    <div style="padding:20px 28px;background:#0d0d1a;">
      <table style="width:100%;border-collapse:collapse;font:14px ui-sans-serif,system-ui;color:#e8e8f0;">
        <tr><td style="padding:6px 0;color:#a0a0b8;width:120px;">Name</td><td style="padding:6px 0;"><strong style="color:#f0f0f8;">{c.name}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#a0a0b8;">Email</td><td style="padding:6px 0;"><a href="mailto:{c.email}" style="color:#d4a843;text-decoration:none;">{c.email}</a></td></tr>
        <tr><td style="padding:6px 0;color:#a0a0b8;">Company</td><td style="padding:6px 0;"><strong style="color:#f0f0f8;">{c.company or '—'}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#a0a0b8;">Submitted</td><td style="padding:6px 0;font:13px ui-monospace,Menlo,monospace;color:#a0a0b8;">{submitted_str}</td></tr>
      </table>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#0d0d1a;">{''.join(rows_html)}</table>
    <div style="padding:18px 28px;background:#0a0a14;border-top:1px solid #2a2a40;font:12px ui-sans-serif,system-ui;color:#7a7a95;text-align:center;">
      Sent automatically from tailoredtechsolutions.org · Intake Form
    </div>
  </div>
</body></html>
"""
    return text_body, html_body


def _send_email_smtp(subject: str, text_body: str, html_body: str, reply_to: Optional[str] = None) -> bool:
    """Send via SMTP if env vars are configured. Returns True on success."""
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587") or 587)
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASSWORD")
    sender = os.environ.get("SMTP_FROM") or user
    to_addr = os.environ.get("INTAKE_TO_EMAIL", "gwaltney@tailoredtechsolutions.org")
    use_ssl = (os.environ.get("SMTP_USE_SSL", "false").lower() == "true")

    if not (host and user and password and sender):
        logger.info("SMTP not configured — skipping email send (stored to MongoDB only).")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to_addr
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        if use_ssl:
            ctx = ssl.create_default_context()
            with smtplib.SMTP_SSL(host, port, context=ctx, timeout=20) as s:
                s.login(user, password)
                s.sendmail(sender, [to_addr], msg.as_string())
        else:
            with smtplib.SMTP(host, port, timeout=20) as s:
                s.ehlo()
                s.starttls(context=ssl.create_default_context())
                s.ehlo()
                s.login(user, password)
                s.sendmail(sender, [to_addr], msg.as_string())
        logger.info(f"Intake email sent to {to_addr}")
        return True
    except Exception as e:
        logger.error(f"SMTP send failed: {e}")
        return False


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


@api_router.post("/intake")
async def submit_intake(submission: IntakeSubmission):
    """Save an AI Readiness Diagnostic submission and email the team."""
    try:
        # 1) Persist to MongoDB
        doc = {
            "id": str(uuid.uuid4()),
            "contact": submission.contact.model_dump(),
            "answers": submission.answers,
            "meta": submission.meta or {},
            "received_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.intake_submissions.insert_one(doc)

        # 2) Send the email (off-thread; non-blocking failure)
        subject = f"[Intake] {submission.contact.name} — AI Readiness Diagnostic"
        text_body, html_body = _build_email_bodies(submission)
        email_ok = await asyncio.to_thread(
            _send_email_smtp, subject, text_body, html_body, submission.contact.email
        )

        return {
            "ok": True,
            "id": doc["id"],
            "stored": True,
            "emailed": email_ok,
        }
    except Exception as e:
        logger.exception("intake submission failed")
        raise HTTPException(status_code=500, detail=f"intake_failed: {e.__class__.__name__}")


@api_router.get("/intake/count")
async def intake_count():
    count = await db.intake_submissions.count_documents({})
    return {"count": count}

# Include the router in the main app
app.include_router(api_router)
app.include_router(build_auth_router(db), prefix="/api")

# CORS with credentials requires explicit origins (no wildcard).
_cors_origins = [o.strip() for o in os.environ.get('CORS_ORIGINS', '').split(',') if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=_cors_origins or ["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def _startup_auth():
    await setup_auth(db)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()