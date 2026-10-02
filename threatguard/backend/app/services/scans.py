"""Supabase persistence for scans and dashboard aggregation."""
from __future__ import annotations

import math
import re
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone
from typing import Any, Dict, List

from app.core.supabase import get_supabase
from ml.inference.predictor import risk_level

SUMMARY_COLUMNS = "id,subject,sender,prediction,risk_score,confidence_score,created_at"


def _parse_ts(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def ensure_profile(user_id: str, email: str) -> None:
    get_supabase().table("profiles").upsert({"id": user_id, "email": email}, on_conflict="id").execute()


def create_scan(user_id: str, email: str, subject: str, sender: str, body: str, result: Dict[str, Any]) -> Dict[str, Any]:
    ensure_profile(user_id, email)
    row = {
        "user_id": user_id,
        "subject": subject,
        "sender": sender,
        "body": body,
        "prediction": result["prediction"],
        "probability": result["probability"],
        "risk_score": result["risk_score"],
        "confidence_score": result["confidence_score"],
        "explanation": result["explanation"],
    }
    inserted = get_supabase().table("scans").insert(row).execute()
    return inserted.data[0]


def to_scan_result(row: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "subject": row["subject"] or "",
        "sender": row["sender"] or "",
        "body": row["body"] or "",
        "prediction": row["prediction"],
        "probability": row["probability"] if row.get("probability") is not None else row["risk_score"] / 100,
        "risk_score": row["risk_score"],
        "confidence_score": row["confidence_score"],
        "risk_level": risk_level(row["risk_score"]),
        "explanation": row.get("explanation") or {"summary": "No explanation stored.", "factors": [], "top_terms": []},
        "created_at": row["created_at"],
    }


def get_scan(user_id: str, scan_id: str) -> Dict[str, Any] | None:
    res = get_supabase().table("scans").select("*").eq("id", scan_id).eq("user_id", user_id).limit(1).execute()
    return to_scan_result(res.data[0]) if res.data else None


def list_scans(user_id: str, page: int, page_size: int, search: str | None, prediction: str | None,
               sort: str = "newest") -> Dict[str, Any]:
    query = get_supabase().table("scans").select(SUMMARY_COLUMNS, count="exact").eq("user_id", user_id)
    if prediction in ("phishing", "safe"):
        query = query.eq("prediction", prediction)
    if search:
        term = re.sub(r"[,()%*\\]", " ", search).strip()
        if term:
            query = query.or_(f"subject.ilike.%{term}%,sender.ilike.%{term}%")
    sort_map = {
        "newest": ("created_at", True),
        "oldest": ("created_at", False),
        "risk_desc": ("risk_score", True),
        "risk_asc": ("risk_score", False),
    }
    column, desc = sort_map.get(sort, sort_map["newest"])
    start = (page - 1) * page_size
    res = query.order(column, desc=desc).range(start, start + page_size - 1).execute()
    total = res.count or 0
    return {
        "items": res.data or [],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": max(1, math.ceil(total / page_size)),
    }


def dashboard(user_id: str) -> Dict[str, Any]:
    res = (
        get_supabase().table("scans").select("prediction,risk_score,created_at")
        .eq("user_id", user_id).order("created_at", desc=True).limit(10000).execute()
    )
    rows = res.data or []
    total = len(rows)
    phishing = sum(1 for r in rows if r["prediction"] == "phishing")
    avg_risk = round(sum(r["risk_score"] for r in rows) / total, 2) if total else 0.0

    today = datetime.now(timezone.utc).date()

    # Weekly trend: last 8 weeks, weeks starting Monday
    this_monday = today - timedelta(days=today.weekday())
    week_starts = [this_monday - timedelta(weeks=i) for i in range(7, -1, -1)]
    weekly: Dict[date, Counter] = {w: Counter() for w in week_starts}

    # Daily activity: last 14 days
    days = [today - timedelta(days=i) for i in range(13, -1, -1)]
    daily: Dict[date, int] = {d: 0 for d in days}

    buckets = [0] * 5
    for r in rows:
        ts = _parse_ts(r["created_at"]).date()
        monday = ts - timedelta(days=ts.weekday())
        if monday in weekly:
            weekly[monday][r["prediction"]] += 1
        if ts in daily:
            daily[ts] += 1
        buckets[min(4, int(r["risk_score"] // 20))] += 1

    labels = ["0-20", "20-40", "40-60", "60-80", "80-100"]
    return {
        "metrics": {
            "total_scans": total,
            "phishing_detected": phishing,
            "safe_emails": total - phishing,
            "average_risk_score": avg_risk,
        },
        "weekly_trend": [
            {"week": w.strftime("%b %d"), "phishing": weekly[w]["phishing"], "safe": weekly[w]["safe"]} for w in week_starts
        ],
        "daily_activity": [{"date": d.strftime("%b %d"), "scans": daily[d]} for d in days],
        "risk_distribution": [{"range": l, "count": c} for l, c in zip(labels, buckets)],
        "phishing_vs_safe": [
            {"name": "Phishing", "value": phishing},
            {"name": "Safe", "value": total - phishing},
        ],
    }
