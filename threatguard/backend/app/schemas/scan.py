import re
from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field, field_validator

SENDER_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")


class AnalyzeRequest(BaseModel):
    subject: str = Field(default="", max_length=998)
    sender: str = Field(min_length=3, max_length=320)
    body: str = Field(min_length=1, max_length=50000)

    @field_validator("subject", "body")
    @classmethod
    def strip_text(cls, v: str) -> str:
        return v.strip()

    @field_validator("sender")
    @classmethod
    def valid_sender(cls, v: str) -> str:
        v = v.strip()
        if not SENDER_RE.search(v):
            raise ValueError("Sender must contain a valid email address")
        return v

    @field_validator("body")
    @classmethod
    def body_not_blank(cls, v: str) -> str:
        if not v:
            raise ValueError("Email body cannot be empty")
        return v


class Factor(BaseModel):
    type: str
    title: str
    severity: Literal["low", "medium", "high"]
    detail: str
    evidence: List[str] = []


class TermContribution(BaseModel):
    term: str
    weight: float
    direction: Literal["phishing", "legitimate"]


class Explanation(BaseModel):
    summary: str
    factors: List[Factor] = []
    top_terms: List[TermContribution] = []


class ScanResult(BaseModel):
    id: str
    subject: str
    sender: str
    body: str
    prediction: Literal["phishing", "safe"]
    probability: float
    risk_score: float
    confidence_score: float
    risk_level: Literal["low", "medium", "high", "critical"]
    explanation: Explanation
    created_at: datetime


class ScanSummary(BaseModel):
    id: str
    subject: str
    sender: str
    prediction: Literal["phishing", "safe"]
    risk_score: float
    confidence_score: float
    created_at: datetime


class HistoryResponse(BaseModel):
    items: List[ScanSummary]
    total: int
    page: int
    page_size: int
    total_pages: int
