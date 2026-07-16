"""Display identity for the portfolio demo.

Market series may be pulled from a liquid public ticker for illustration, but the
dashboard and reports always present a hypothetical Canadian bank — never a named
employer or listed issuer.
"""

from __future__ import annotations

DISPLAY_TICKER = "HCB"
DISPLAY_NAME = "Hypothetical Canadian Bank"

# Used only by yfinance for market/statement trends. Never shown in UI or reports.
MARKET_DATA_TICKER = "TD"

# Peer set is anonymized so focus-bank ratios cannot be reverse-mapped to a named issuer.
PEER_TICKERS = ["HCB", "PB1", "PB2", "PB3", "PB4"]

PEER_SHORT_NAMES = {
    "HCB": "Focus Bank",
    "PB1": "Peer Bank Alpha",
    "PB2": "Peer Bank Beta",
    "PB3": "Peer Bank Gamma",
    "PB4": "Peer Bank Delta",
}

DISCLAIMER = (
    "Educational portfolio project. The obligor is presented as a hypothetical Canadian bank. "
    "Market and statement figures are drawn from public market data providers for illustration only; "
    "regulatory-style ratios are a stylized overlay calibrated to publicly reported Canadian "
    "large-bank ranges. Internal ratings, PDs, LGDs, facilities, peer labels, and stress scenarios "
    "are illustrative — not official bank models, agency ratings, actual exposures, or the views of "
    "any employer or financial institution. Not investment or credit advice."
)
