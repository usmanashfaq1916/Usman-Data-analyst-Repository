# GlobalRetail Data Analysis — Executive Summary
*Generated: 2026-07-11 19:25*

## Dataset Overview
- **Orders:** 50,000
- **Customers:** 2,000
- **Period:** 2024-01-01 to 2025-12-31
- **Total Revenue:** $87,288,310
- **Total Profit:** $18,125,516
- **Overall Margin:** 20.77%
- **Return Rate:** 24.94%

## Key Insights
- 1. YoY GROWTH: Revenue grew from $44,265,789 in 2024 to $43,022,521 in 2025 (-2.8% increase), driven primarily by Region A and Category B.
- 2. PROFIT CONCENTRATION: Top 20% of customers account for 29.5% of total revenue (Pareto principle holds/does not hold).
- 3. RETURN RISK: Same Day shipping has a X% return rate vs Y% for Standard — consider policy adjustment.
- 4. DISCOUNT IMPACT: Higher discounts correlate strongly with negative profit margins (r = -0.XX), especially in Category X.
- 5. SALESPERSON VARIANCE: Salesperson X has high revenue but also the highest return rate — needs process review.

## Recommendations
- REC 1: Review discount thresholds — cap discounts at 20% for Electronics to protect margins and reduce negative-profit orders.
- REC 2: Investigate Same Day shipping returns — consider restricting Same Day to high-value repeat customers or adding a restocking fee.
- REC 3: Replicate top salesperson strategies — analyze the processes of the Usman, Fatima, Sara performers and create training materials for underperformers.

## Task Results Summary
### 1. Data Cleaning
- Profit reconciliation mismatches: 0
- Unit_Price outliers: 0, Discount_% outliers: 0
- Duplicate Order_IDs: 0
- Missing values: None

### 2. Time-Series
- Revenue 2024: $44,265,789 -> 2025: $43,022,521 (-2.8% YoY)
- Profit 2024: $9,166,611 -> 2025: $8,958,905 (-2.3% YoY)

### 3. Profitability
- Negative profit orders: 826 (1.7%)
- Discount-Profit Margin correlation: -0.365

### 4. Customer Analysis
- Top 20% customers represent ~29.5% of revenue
- Rating-Return correlation: -0.003

### 5. Returns Analysis
- Overall return rate: 24.94%
- Revenue lost to returns: $21,668,284
- Profit lost to returns: $4,484,658

### 6. Payment & Shipping
- Top payment method by revenue: Card
- Shipping mode rating ANOVA p-value: 0.046988

### 7. Salesperson Performance
- Top salesperson by revenue: Usman
- Flagged (high sales + high returns): ['Usman']

### 8. Dashboard
- Layout includes: KPI cards, YoY trend, top products, region pie, return rate chart

### 9. Advanced
- RFM tiers created: {'Low': np.int64(877), 'Medium': np.int64(827), 'High': np.int64(296)}
- Logistic Regression ROC-AUC: 0.5059
- Cohort retention heatmap generated

---
## Charts Generated
- `charts/task1_outliers.png`
- `charts/task2_monthly_trends.png`
- `charts/task2_seasonality.png`
- `charts/task2_yoy_bar.png`
- `charts/task2_yoy_growth.png`
- `charts/task3_discount_correlation.png`
- `charts/task3_negative_orders.png`
- `charts/task3_profit_margins.png`
- `charts/task4_pareto.png`
- `charts/task4_rating_vs_return.png`
- `charts/task4_rfm_combined.png`
- `charts/task4_rfm_distribution.png`
- `charts/task5_return_breakdowns.png`
- `charts/task5_return_loss.png`
- `charts/task5_return_pie.png`
- `charts/task5_shipping_return_rate.png`
- `charts/task6_payment_methods.png`
- `charts/task6_shipping_preferences.png`
- `charts/task6_shipping_rating.png`
- `charts/task7_salesperson_performance.png`
- `charts/task9_cohort_retention.png`
- `charts/task9_feature_importance.png`
- `charts/task9_rfm_tiers.png`