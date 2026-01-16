import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from sqlalchemy.orm import Session
from uuid import UUID

from app.models.user import User
from app.models.claim import Claim
from app.models.policy import Policy
from app.models.document import Document
from app.services.timeline_service import get_timeline
from app.config import settings
from app.utils.file_storage import ensure_upload_dir

def generate_claim_summary_pdf(db: Session, current_user: User, claim_id: UUID) -> str:
    """
    Generate a simple PDF summary of the claim.
    Returns the relative file path of the generated PDF.
    """
    # Fetch data
    claim = db.query(Claim).filter(Claim.id == claim_id, Claim.user_id == current_user.id).first()
    policy = db.query(Policy).filter(Policy.id == claim.policy_id).first()
    docs = db.query(Document).filter(Document.claim_id == claim.id).all()
    events = get_timeline(db, claim_id, limit=6)
    
    if not claim:
        raise ValueError("Claim not found")

    # Define path
    # uploads/<claim_id>/summary.pdf
    claim_dir = os.path.join(settings.UPLOAD_DIR, str(claim_id))
    ensure_upload_dir(claim_dir)
    file_name = "summary.pdf"
    file_path = os.path.join(claim_dir, file_name)
    
    # Create PDF
    c = canvas.Canvas(file_path, pagesize=letter)
    width, height = letter
    
    # Header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "SmartClaim AI - Claim Summary")
    
    # Claim Info
    c.setFont("Helvetica", 12)
    y = height - 80
    c.drawString(50, y, f"Claim Number: {claim.claim_number}")
    c.drawString(300, y, f"Status: {claim.status}")
    y -= 20
    c.drawString(50, y, f"Claim Type: {claim.claim_type}")
    c.drawString(300, y, f"Readiness Score: {claim.readiness_score or 0}/100")
    y -= 20
    c.drawString(50, y, f"Fraud Score: {claim.fraud_score or 0}/100")
    c.drawString(300, y, f"Decision: {claim.decision_type or 'N/A'}")
    
    # Amounts
    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Financials")
    c.setFont("Helvetica", 12)
    y -= 20
    c.drawString(50, y, f"Claimed Amount: {claim.claimed_amount}")
    if claim.approved_amount:
        c.drawString(300, y, f"Approved Amount: {claim.approved_amount}")
    
    # Policy Info
    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Policy Details")
    c.setFont("Helvetica", 12)
    y -= 20
    if policy:
        c.drawString(50, y, f"Policy Number: {policy.policy_number}")
        c.drawString(300, y, f"Insurer: {policy.insurer_name}")
        y -= 20
        c.drawString(50, y, f"Sum Insured: {policy.sum_insured}")
    
    # Documents
    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Uploaded Documents")
    c.setFont("Helvetica", 10)
    y -= 20
    for doc in docs:
        dup = "[Duplicate]" if doc.is_duplicate else ""
        text = f"- {doc.document_type}: {doc.file_name} (Quality: {doc.quality_score}) {dup}"
        c.drawString(50, y, text)
        y -= 15
        if y < 100: # New page if needed
            c.showPage()
            y = height - 50
            
    # Timeline
    y -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Recent Activity")
    c.setFont("Helvetica", 10)
    y -= 20
    for event in events:
        text = f"{event.created_at.strftime('%Y-%m-%d %H:%M')}: {event.message} ({event.event_type})"
        c.drawString(50, y, text)
        y -= 15
        if y < 50:
            break

    c.save()
    
    # Return relative path for API
    return os.path.join("uploads", str(claim_id), file_name)
