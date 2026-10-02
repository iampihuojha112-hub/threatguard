from typing import List

from pydantic import BaseModel


class Metrics(BaseModel):
    total_scans: int
    phishing_detected: int
    safe_emails: int
    average_risk_score: float


class WeeklyPoint(BaseModel):
    week: str
    phishing: int
    safe: int


class DailyPoint(BaseModel):
    date: str
    scans: int


class RiskBucket(BaseModel):
    range: str
    count: int


class DistributionSlice(BaseModel):
    name: str
    value: int


class DashboardResponse(BaseModel):
    metrics: Metrics
    weekly_trend: List[WeeklyPoint]
    daily_activity: List[DailyPoint]
    risk_distribution: List[RiskBucket]
    phishing_vs_safe: List[DistributionSlice]
