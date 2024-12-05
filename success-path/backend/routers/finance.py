from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import FinancialRecord, User
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/transactions/")
async def create_transaction(
    transaction: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_transaction = FinancialRecord(
        user_id=current_user.id,
        type=transaction["type"],
        category=transaction["category"],
        amount=transaction["amount"],
        description=transaction["description"]
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/transactions/")
async def get_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(FinancialRecord).filter(
        FinancialRecord.user_id == current_user.id
    ).order_by(FinancialRecord.date.desc()).all()

@router.get("/transactions/summary")
async def get_transaction_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get transactions from the last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    transactions = db.query(FinancialRecord).filter(
        FinancialRecord.user_id == current_user.id,
        FinancialRecord.date >= thirty_days_ago
    ).all()

    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expenses = sum(t.amount for t in transactions if t.type == "expense")
    
    return {
        "income": total_income,
        "expenses": total_expenses,
        "balance": total_income - total_expenses
    }

@router.get("/transactions/monthly")
async def get_monthly_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get transactions from the last 6 months
    six_months_ago = datetime.utcnow() - timedelta(days=180)
    transactions = db.query(FinancialRecord).filter(
        FinancialRecord.user_id == current_user.id,
        FinancialRecord.date >= six_months_ago
    ).all()

    monthly_summary = {}
    for transaction in transactions:
        month = transaction.date.strftime("%Y-%m")
        if month not in monthly_summary:
            monthly_summary[month] = {"income": 0, "expenses": 0}
        
        if transaction.type == "income":
            monthly_summary[month]["income"] += transaction.amount
        else:
            monthly_summary[month]["expenses"] += transaction.amount

    return monthly_summary
