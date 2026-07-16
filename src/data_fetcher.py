"""Fetch market and financial statement data for FI credit analysis."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

import pandas as pd
import yfinance as yf


@dataclass
class BankMarketData:
    ticker: str
    name: str
    sector: str
    industry: str
    market_cap: float | None
    price: float | None
    beta: float | None
    currency: str
    info: dict[str, Any] = field(default_factory=dict)
    income_stmt: pd.DataFrame = field(default_factory=pd.DataFrame)
    balance_sheet: pd.DataFrame = field(default_factory=pd.DataFrame)
    cash_flow: pd.DataFrame = field(default_factory=pd.DataFrame)
    history: pd.DataFrame = field(default_factory=pd.DataFrame)


def _pick(df: pd.DataFrame, candidates: list[str]) -> pd.Series | None:
    if df.empty:
        return None
    for name in candidates:
        if name in df.index:
            return df.loc[name]
    # case-insensitive fallback
    lower_map = {str(i).lower(): i for i in df.index}
    for name in candidates:
        key = name.lower()
        if key in lower_map:
            return df.loc[lower_map[key]]
    return None


def _to_annual_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize yfinance statements to year-indexed columns (oldest → newest)."""
    if df is None or df.empty:
        return pd.DataFrame()
    out = df.copy()
    # yfinance: rows = line items, columns = period ends
    cols = []
    for c in out.columns:
        try:
            cols.append(pd.Timestamp(c).year)
        except Exception:
            cols.append(str(c))
    out.columns = cols
    # keep last occurrence if duplicate years
    out = out.loc[:, ~pd.Index(out.columns).duplicated(keep="last")]
    out = out.sort_index(axis=1)
    return out


class FIDataFetcher:
    """Pull Yahoo Finance fundamentals + price history for bank tickers."""

    def __init__(self, ticker: str = "TD"):
        # Default ticker is a liquid public series used only as an illustration source.
        # Downstream pipeline overwrites display identity to a hypothetical bank.
        self.ticker = ticker.upper()
        self._stock = yf.Ticker(self.ticker)

    def fetch(self, history_years: int = 5) -> BankMarketData:
        info = self._stock.info or {}
        income = _to_annual_columns(self._stock.financials)
        balance = _to_annual_columns(self._stock.balance_sheet)
        cash = _to_annual_columns(self._stock.cashflow)
        hist = self._stock.history(period=f"{history_years}y")

        return BankMarketData(
            ticker=self.ticker,
            name=info.get("longName") or info.get("shortName") or self.ticker,
            sector=info.get("sector") or "Financial Services",
            industry=info.get("industry") or "Banks — Diversified",
            market_cap=info.get("marketCap"),
            price=info.get("currentPrice") or info.get("regularMarketPrice"),
            beta=info.get("beta"),
            currency=info.get("currency") or "USD",
            info=info,
            income_stmt=income,
            balance_sheet=balance,
            cash_flow=cash,
            history=hist,
        )

    @staticmethod
    def statement_series(data: BankMarketData, statement: str, candidates: list[str]) -> dict[int, float]:
        df = {
            "income": data.income_stmt,
            "balance": data.balance_sheet,
            "cash": data.cash_flow,
        }.get(statement, pd.DataFrame())
        series = _pick(df, candidates)
        if series is None:
            return {}
        result: dict[int, float] = {}
        for col, val in series.items():
            try:
                year = int(col)
            except (TypeError, ValueError):
                continue
            if pd.notna(val):
                result[year] = float(val)
        return dict(sorted(result.items()))
