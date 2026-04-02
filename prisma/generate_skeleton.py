import csv
import json
import os

# Define the pattern for the 6 questions per block
patterns = [
    ("ENTRY", 1, False, "E"), ("ENTRY", 2, False, "E"),
    ("JUNIOR", 1, True, "M"), ("JUNIOR", 2, True, "M"), 
    ("SENIOR", 1, True, "S"), ("SENIOR", 2, True, "S")
]

output_path = 'prisma/seed_data.csv'

with open(output_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    # Headers matching the logic in seed.ts
    writer.writerow(["id", "question", "options", "answer", "level", "subIndex", "isPremium", "blockId", "physicalId", "category"])
    
    for num in range(1, 55):
        block_id = f"BLOCK-{str(num).zfill(2)}"
        category = "Python OOP" # Default category
        
        for lvl, sub, prem, p_id in patterns:
            unique_quiz_id = f"B{str(num).zfill(2)}-{p_id}{sub}"
            
            # Sample Duolingo-style data
            options = ["def __init__(self):", "self.name = name", "class Jenga:"]
            answer = [2, 0, 1] 
            
            writer.writerow([
                unique_quiz_id,
                f"Order the code for {block_id} ({lvl}):",
                json.dumps(options),
                json.dumps(answer),
                lvl,
                sub,
                str(prem).upper(), # "TRUE" or "FALSE"
                block_id,
                num,
                category
            ])

print(f"Success! Generated 324 rows in {output_path}")