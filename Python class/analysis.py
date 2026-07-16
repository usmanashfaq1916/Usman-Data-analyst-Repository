import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import warnings
warnings.filterwarnings('ignore')
sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams['figure.figsize'] = (12, 6)
plt.rcParams['figure.dpi'] = 120
OUTPUT_DIR = 'D:\\My website\\Data'
# ─────────────────────────────────────────────
# 1. DATA PREPARATION
# ─────────────────────────────────────────────
df = pd.read_excel(f'{OUTPUT_DIR}\\TechMart_Sales_5000_Rows.xlsx')
print(f"Rows: {len(df)}, Columns: {list(df.columns)}")
print(df.head(3), "\n")
df['Date'] = pd.to_datetime(df['Date'])
df['Month'] = df['Date'].dt.month
df['Quarter'] = df['Date'].dt.quarter
df['Revenue'] = df['Units'] * df['Unit_Price'] * (1 - df['Discount_Percent'] / 100)
print("--- Data Prep Complete ---")
print(f"Revenue range: {df['Revenue'].min():.2f} to {df['Revenue'].max():.2f}")
print(df[['Order_ID','Date','Month','Quarter','Revenue']].head(), "\n")
# ─────────────────────────────────────────────
# 2. TREND ANALYSIS
# ─────────────────────────────────────────────
monthly = df.groupby('Month').agg(Revenue=('Revenue','sum'), Orders=('Order_ID','nunique')).reset_index()
quarterly = df.groupby('Quarter').agg(Revenue=('Revenue','sum'), Orders=('Order_ID','nunique')).reset_index()
print("=== MONTHLY REVENUE ===")
print(monthly.to_string(index=False))
print("\n=== QUARTERLY REVENUE ===")
print(quarterly.to_string(index=False))
peak_month = monthly.loc[monthly['Revenue'].idxmax()]
print(f"\nPeak Month: {int(peak_month['Month'])} — Revenue ${peak_month['Revenue']:,.0f}")
low_month = monthly.loc[monthly['Revenue'].idxmin()]
print(f"Lowest Month: {int(low_month['Month'])} — Revenue ${low_month['Revenue']:,.0f}")
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
axes[0].plot(monthly['Month'], monthly['Revenue']/1000, marker='o', linewidth=2)
axes[0].set_title('Monthly Revenue Trend ($K)')
axes[0].set_xlabel('Month')
axes[0].set_ylabel('Revenue ($K)')
axes[0].set_xticks(range(1,13))
axes[0].grid(True, alpha=0.3)
axes[1].bar(quarterly['Quarter'], quarterly['Revenue']/1000, color=['#4C72B0','#55A868','#C44E52','#8172B2'])
axes[1].set_title('Quarterly Revenue ($K)')
axes[1].set_xlabel('Quarter')
axes[1].set_ylabel('Revenue ($K)')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}\\trend_analysis.png')
plt.close()
print("Chart saved: trend_analysis.png\n")
# ─────────────────────────────────────────────
# 3. REGIONAL ANALYSIS
# ─────────────────────────────────────────────
regional = df.groupby('Region').agg(
    Revenue=('Revenue','sum'),
    Units=('Units','sum'),
    Orders=('Order_ID','nunique')
).reset_index()
regional['Avg_Order_Value'] = regional['Revenue'] / regional['Orders']
print("=== REGIONAL ANALYSIS ===")
print(regional.to_string(index=False))
top_region = regional.loc[regional['Revenue'].idxmax(), 'Region']
bot_region = regional.loc[regional['Revenue'].idxmin(), 'Region']
print(f"\nTop Performing Region: {top_region}")
print(f"Bottom Performing Region: {bot_region}")
fig, axes = plt.subplots(1, 3, figsize=(16, 5))
colors = ['#4C72B0','#55A868','#C44E52','#8172B2']
for i, (col, title) in enumerate(zip(['Revenue','Units','Avg_Order_Value'],
                                       ['Total Revenue ($K)', 'Total Units Sold', 'Avg Order Value ($)'])):
    vals = regional[col] / (1000 if col != 'Avg_Order_Value' else 1)
    axes[i].bar(regional['Region'], vals, color=colors)
    axes[i].set_title(title)
    axes[i].set_xlabel('Region')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}\\regional_analysis.png')
plt.close()
print("Chart saved: regional_analysis.png\n")
# ─────────────────────────────────────────────
# 4. PRODUCT / CATEGORY ANALYSIS
# ─────────────────────────────────────────────
prod_rank = df.groupby('Product').agg(Revenue=('Revenue','sum'), Units=('Units','sum')).reset_index()
prod_rank.sort_values('Revenue', ascending=False, inplace=True)
cat_rank = df.groupby('Category').agg(Revenue=('Revenue','sum'), Units=('Units','sum')).reset_index()
cat_rank.sort_values('Revenue', ascending=False, inplace=True)
print("=== PRODUCT RANKING (by Revenue) ===")
print(prod_rank.to_string(index=False))
print("\n=== CATEGORY RANKING (by Revenue) ===")
print(cat_rank.to_string(index=False))
fig, axes = plt.subplots(1, 2, figsize=(16, 5))
for ax, data, title, label_col in zip(axes,
    [prod_rank, cat_rank],
    ['Top Products by Revenue ($K)', 'Categories by Revenue ($K)'],
    ['Product','Category']):
    vals = data['Revenue'] / 1000
    ax.barh(data[label_col], vals, color='#4C72B0')
    ax.set_title(title)
    ax.set_xlabel('Revenue ($K)')
    ax.invert_yaxis()
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}\\product_category_analysis.png')
plt.close()
print("Chart saved: product_category_analysis.png\n")
# ─────────────────────────────────────────────
# 5. SALESPERSON PERFORMANCE
# ─────────────────────────────────────────────
sp = df.groupby('Salesperson').agg(
    Revenue=('Revenue','sum'),
    Units=('Units','sum'),
    Orders=('Order_ID','nunique')
).reset_index()
sp['Avg_Deal_Size'] = sp['Revenue'] / sp['Orders']
sp.sort_values('Revenue', ascending=False, inplace=True)
sp['Revenue_Rank'] = range(1, len(sp)+1)
sp['Units_Rank'] = sp['Units'].rank(ascending=False).astype(int)
sp['AvgDeal_Rank'] = sp['Avg_Deal_Size'].rank(ascending=False).astype(int)
print("=== SALESPERSON PERFORMANCE ===")
print(sp[['Revenue_Rank','Salesperson','Revenue','Units','Avg_Deal_Size']].to_string(index=False))
print(f"\nTop Salesperson: {sp.iloc[0]['Salesperson']} — ${sp.iloc[0]['Revenue']:,.0f}")
print(f"Bottom Salesperson: {sp.iloc[-1]['Salesperson']} — ${sp.iloc[-1]['Revenue']:,.0f}")
fig, ax = plt.subplots(figsize=(12, 7))
top10 = sp.head(10)
bars = ax.barh(top10['Salesperson'], top10['Revenue']/1000, color='#4C72B0')
ax.set_title('Top 10 Salespeople by Revenue ($K)')
ax.set_xlabel('Revenue ($K)')
ax.invert_yaxis()
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}\\salesperson_performance.png')
plt.close()
print("Chart saved: salesperson_performance.png\n")
# ─────────────────────────────────────────────
# 6. DISCOUNT ANALYSIS
# ─────────────────────────────────────────────
corr, pval = stats.pearsonr(df['Discount_Percent'], df['Units'])
print(f"=== DISCOUNT ANALYSIS ===")
print(f"Pearson correlation (Discount% vs Units): {corr:.4f} (p={pval:.4e})")
# Group by discount bins
df['Discount_Bin'] = pd.cut(df['Discount_Percent'], bins=[-1,0,10,20,30,50,100],
                              labels=['0%','1-10%','11-20%','21-30%','31-50%','50%+'])
disc_group = df.groupby('Discount_Bin', observed=True).agg(Avg_Units=('Units','mean'), Avg_Revenue=('Revenue','mean'), Order_Count=('Order_ID','count')).reset_index()
print("\nAvg Units by Discount Bucket:")
print(disc_group.to_string(index=False))
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
axes[0].scatter(df['Discount_Percent'], df['Units'], alpha=0.3, s=10, c='#4C72B0')
axes[0].set_title(f'Discount % vs Units Sold (r={corr:.3f})')
axes[0].set_xlabel('Discount %')
axes[0].set_ylabel('Units Sold')
axes[1].bar(disc_group['Discount_Bin'].astype(str), disc_group['Avg_Units'], color='#55A868')
axes[1].set_title('Average Units Sold by Discount Bucket')
axes[1].set_xlabel('Discount Range')
axes[1].set_ylabel('Avg Units')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}\\discount_analysis.png')
plt.close()
print("Chart saved: discount_analysis.png\n")
# ─────────────────────────────────────────────
# 7. CROSS ANALYSIS (Category x Region)
# ─────────────────────────────────────────────
cross = df.groupby(['Region','Category']).agg(Revenue=('Revenue','sum'), Units=('Units','sum')).reset_index()
pivot_rev = cross.pivot_table(index='Region', columns='Category', values='Revenue', aggfunc='sum', fill_value=0)
pivot_pct = pivot_rev.div(pivot_rev.sum(axis=1), axis=0) * 100
print("=== CATEGORY MIX BY REGION (Revenue $) ===")
print(pivot_rev.to_string())
print("\n=== CATEGORY MIX BY REGION (% of Region) ===")
print(pivot_pct.round(1).to_string())
fig, ax = plt.subplots(figsize=(12, 6))
pivot_pct.plot(kind='bar', stacked=True, ax=ax, colormap='Set2')
ax.set_title('Category Mix by Region (% of Revenue)')
ax.set_xlabel('Region')
ax.set_ylabel('% of Regional Revenue')
ax.legend(title='Category')
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}\\cross_analysis.png')
plt.close()
print("Chart saved: cross_analysis.png\n")
# ─────────────────────────────────────────────
# 8. SUMMARY — KEY INSIGHTS & RECOMMENDATIONS
# ─────────────────────────────────────────────
print("=" * 70)
print("SUMMARY: 5 KEY INSIGHTS")
print("=" * 70)
# Insight 1: Peak month
print(f"""
1. SEASONALITY — Peak in Month {int(peak_month['Month'])}, Low in Month {int(low_month['Month'])}
   Revenue ranges from ${low_month['Revenue']:,.0f} to ${peak_month['Revenue']:,.0f} per month.
   Q{quarterly.loc[quarterly['Revenue'].idxmax(),'Quarter']} is the strongest quarter. {'Strong holiday / end-of-year effect.' if int(peak_month['Month']) in [11,12] else 'Mid-year spike.'}
""")
# Insight 2: Region comparison
print(f"""2. REGIONAL PERFORMANCE — {top_region} leads, {bot_region} lags
   {top_region} generated ${regional.loc[regional['Region']==top_region,'Revenue'].values[0]:,.0f} vs {bot_region} ${regional.loc[regional['Region']==bot_region,'Revenue'].values[0]:,.0f}.
   Avg order value: ${regional.loc[regional['Region']==top_region,'Avg_Order_Value'].values[0]:.0f} vs ${regional.loc[regional['Region']==bot_region,'Avg_Order_Value'].values[0]:.0f}.
""")
# Insight 3: Top product / category
print(f"""3. PRODUCT & CATEGORY HIGHLIGHTS
   Best-selling product: {prod_rank.iloc[0]['Product']} (${prod_rank.iloc[0]['Revenue']:,.0f})
   Top category: {cat_rank.iloc[0]['Category']} (${cat_rank.iloc[0]['Revenue']:,.0f})
   Underperformer: {prod_rank.iloc[-1]['Product']} (${prod_rank.iloc[-1]['Revenue']:,.0f})
""")
# Insight 4: Discount
insight4 = (f"4. DISCOUNT IMPACT — Correlation is {corr:.3f} ({'weak' if abs(corr) < 0.2 else 'moderate' if abs(corr) < 0.5 else 'strong'})"
            f"\n   Discounting {'does not drive significantly more volume' if abs(corr) < 0.3 else 'shows a modest positive relationship with units sold'}."
            f"\n   {'Discounts may be eroding margin without commensurate volume increase.' if abs(corr) < 0.3 else 'Discounts moderately boost volume — optimize thresholds.'}")
print(insight4 + "\n")
# Insight 5: Salesperson disparity
print(f"""5. SALESPERSON DISPARITY
   Top: {sp.iloc[0]['Salesperson']} (${sp.iloc[0]['Revenue']:,.0f}, {sp.iloc[0]['Units']} units)
   Bottom: {sp.iloc[-1]['Salesperson']} (${sp.iloc[-1]['Revenue']:,.0f}, {sp.iloc[-1]['Units']} units)
   Ratio top-to-bottom: {sp.iloc[0]['Revenue']/sp.iloc[-1]['Revenue']:.1f}x
""")
print("=" * 70)
print("BUSINESS RECOMMENDATIONS")
print("=" * 70)
top_prod = prod_rank.iloc[0]['Product']
bot_prod = prod_rank.iloc[-1]['Product']
top_cat = cat_rank.iloc[0]['Category']
print(f"""
1. REGIONAL STRATEGY — Replicate {top_region} success factors in {bot_region}. 
   Consider targeted marketing or sales staffing in the underperforming region.
2. PRODUCT FOCUS — Double down on {top_prod} and {top_cat}. 
   Evaluate discontinuing or repositioning {bot_prod}.
3. DISCOUNT OPTIMIZATION — Since correlation is weak, run A/B tests: 
   narrow discount bands (5-10%) to protect margin while testing if deeper discounts 
   in specific categories actually move volume.
""")
print("=" * 70)
print("DASHBOARD CHART SUGGESTIONS")
print("=" * 70)
print("""
Chart Type                  | Use Case
----------------------------|-----------------------------
Line chart (trend)          | Monthly revenue trend (saved)
Grouped bar chart           | Regional comparison (revenue, units, AOV) (saved)
Horizontal bar chart        | Top-N products / salespeople leaderboard (saved)
Scatter plot                | Discount % vs Units sold (saved)
Stacked bar (100%)          | Category mix by region (saved)
Heatmap                     | Month x Region revenue (bonus for dashboard)
""")
# BONUS: Heatmap Month x Region
heat = df.pivot_table(index='Month', columns='Region', values='Revenue', aggfunc='sum', fill_value=0) / 1000
fig, ax = plt.subplots(figsize=(10, 6))
sns.heatmap(heat, annot=True, fmt='.0f', cmap='Blues', ax=ax, linewidths=0.5)
ax.set_title('Revenue by Month & Region ($K)')
ax.set_ylabel('Month')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}\\heatmap_month_region.png')
plt.close()
print("Bonus chart saved: heatmap_month_region.png")
print("\nAll analyses complete. Charts saved to:", OUTPUT_DIR)
