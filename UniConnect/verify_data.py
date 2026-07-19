import requests
import re
from collections import Counter

# Check the universities page
r = requests.get("https://uniconnect-pk.vercel.app/universities")
m = re.search(r'(\d+)\s+universit', r.text)
if m:
    print(f"Universities on page: {m.group(1)}")

# Check API
r2 = requests.get("https://uniconnect-pk.vercel.app/api/universities")
if r2.status_code == 200:
    data = r2.json()
    if isinstance(data, list):
        print(f"Universities via API: {len(data)}")
        provinces = Counter(u.get("province", "?") for u in data)
        for p, c in provinces.most_common():
            print(f"  {p}: {c}")
else:
    print(f"API returned {r2.status_code}")

# Check a detail page
r3 = requests.get("https://uniconnect-pk.vercel.app/api/universities?limit=1")
if r3.status_code == 200:
    data = r3.json()
    if isinstance(data, list) and len(data) > 0:
        first = data[0]
        print(f"\nSample: {first.get('name')} ({first.get('city')}, {first.get('province')})")
        print(f"  Type: {first.get('type')}")
        print(f"  Website: {first.get('websiteUrl')}")
