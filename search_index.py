encodings = ['utf-8', 'utf-8-sig', 'cp949', 'euc-kr', 'utf-16']
lines = []
for enc in encodings:
    try:
        with open("index.html", "r", encoding=enc) as f:
            lines = f.readlines()
        print(f"Loaded successfully with encoding: {enc}")
        break
    except Exception as e:
        print(f"Failed with {enc}: {e}")

if lines:
    for i, line in enumerate(lines):
        if "preview" in line.lower() or "laundry" in line.lower() or "rope" in line.lower() or "사진" in line or "집게" in line:
            print(f"Line {i+1}: {line.strip()}")
