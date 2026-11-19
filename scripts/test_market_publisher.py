import unittest
from dataclasses import replace
from datetime import date, timedelta
from decimal import Decimal

from market_news import trusted, valid_draft
from market_trade_data import parse_rates, public_report, same_exposure_pnl, selection, verified_pair
from publish_market_brief import markdown


class MarketPublisherTests(unittest.TestCase):
    def setUp(self):
        self.day = date(2026, 11, 18)
        self.selected = {"GOLD": {"local-strategy"}}
        self.event = {
            "symbol": "GOLD#", "strategy_name": "local-strategy",
            "dry_run": False, "environment": "Live", "flat_confirmed": True,
            "history_complete": True, "virtual_profit_final": True,
            "closed_at": "2026-11-18T13:31:00+09:00",
            "virtual_profit_at": "2026-11-18T13:30:00+09:00",
            "virtual_profit_krw": 200, "filled": "0.1", "currency": "USD",
            "mt5_deals": [
                dict(ticket="1", position_id="3", entry=0, volume="0.1", profit="0", commission="-1", swap="0", fee="0"),
                dict(ticket="2", position_id="3", entry=1, volume="0.1", profit="3", commission="-0.2", swap="0.5", fee="-0.3"),
            ],
        }

    def test_selected_strategy_and_complete_position(self):
        self.assertEqual(selection("mt5", {"mt5_symbol": "GOLD#", "check_list": [" local-strategy "]}), self.selected)
        pair = verified_pair(self.event, self.selected, [self.day])
        self.assertEqual(pair.live, Decimal(2))
        self.assertIsNone(verified_pair(self.event, {}, [self.day]))
        self.event["mt5_deals"][1]["volume"] = "0.05"
        self.assertIsNone(verified_pair(self.event, self.selected, [self.day]))

    def test_report_fx_omissions_and_public_fields(self):
        pair = verified_pair(self.event, self.selected, [self.day])
        rates = parse_rates("observation_date,DEXKOUS\n2026-11-17,1300\n2026-11-18,1400\n")
        coverage = {"mt5_rust1": "partial", "mt5": "unavailable"}
        report = public_report([self.day - timedelta(days=1), self.day], [("mt5_rust1", pair)], coverage, rates)
        self.assertEqual(report["series"]["GOLD"], [None, {"simulated": None, "live": 2600, "count": 1, "virtualOriginal": 200}])
        self.assertNotIn("local-strategy", str(report))
        self.assertNotIn("ticket", str(report))
        with self.assertRaises(ValueError):
            public_report([self.day], [("mt5_rust1", pair)], coverage, {})

    def test_structured_article_and_trusted_urls(self):
        sources = [{"id": 1, "publisher": "BLS", "url": "https://www.bls.gov/news.release/", "published": "2026-11-18T17:00:00+00:00"}]
        draft = {"title": "고용 지표와 금 시장", "excerpt": "고용 소식을 살핍니다.",
                 "items": [{"source": 1, "fact": "고용 지표가 나왔습니다.", "analysis": "금리 흐름을 확인할 필요가 있습니다."}]}
        valid_draft(draft, {1: sources[0]})
        pair = replace(verified_pair(self.event, self.selected, [self.day]), normalized=Decimal("1.5"))
        report = public_report([self.day], [("mt5_rust1", pair)], {"mt5_rust1": "partial"}, {self.day - timedelta(days=1): Decimal(1300)})
        post = markdown(self.day.isoformat(), report, sources, draft)
        self.assertIn("marketBrief: true", post)
        self.assertIn("| GOLD | 1 | +1,950원 | +2,600원 |", post)
        self.assertIn("https://www.bls.gov/news.release/", post)
        self.assertFalse(trusted("https://www.bls.gov@127.0.0.1/"))
        draft["items"][0]["source"] = 2
        with self.assertRaises(ValueError):
            valid_draft(draft, {1: sources[0]})

    def test_equal_exposure_uses_prices_and_not_engine_cash(self):
        self.event["side"] = "SELL"
        self.event["mt5_deals"][0]["price"] = "3827.72"
        self.event["mt5_deals"][1].update(price="3816.71", profit="22.02")
        pair = verified_pair(self.event, self.selected, [self.day])
        prices = ("SELL", Decimal("3827.62"), Decimal("3817.03"))
        self.assertEqual(same_exposure_pnl(pair, self.event, prices), Decimal("21.18"))
        self.assertIsNone(same_exposure_pnl(pair, self.event, ("BUY", *prices[1:])))


if __name__ == "__main__":
    unittest.main()
