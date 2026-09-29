from backend.app.services.ocr_service import extract_text
from backend.app.services.text_cleaner import clean_text
from backend.app.services.medicine_extractor import extract_medicine_names
from itertools import combinations
from backend.app.services.fda_service import check_drug_interaction
import os


# ============================================================
# 1. FIND ALL IMAGES
# ============================================================

IMAGE_FOLDER = "images"

image_files = [
    os.path.join(IMAGE_FOLDER, file)
    for file in os.listdir(IMAGE_FOLDER)
    if file.lower().endswith((".jpg", ".jpeg", ".png"))
]

print("\n========== IMAGE FILES ==========")

for image in image_files:
    print(image)

if not image_files:
    raise ValueError("No images found in the images folder.")


# ============================================================
# 2. OCR
# ============================================================

print("\n========== OCR ==========")

all_texts = []

for image_path in image_files:

    print(f"\nProcessing: {image_path}")

    text = extract_text(image_path)

    if isinstance(text, list):
        all_texts.extend(text)
    else:
        all_texts.append(text)

all_text = "\n".join(all_texts)

print("\n========== RAW OCR ==========")
print(all_text)


if not all_text.strip():
    raise ValueError(
        "OCR text is empty. Check EasyOCR extraction or image paths."
    )


# ============================================================
# 3. TEXT CLEANING
# ============================================================

print("\n========== CLEANING TEXT ==========")

# Your cleaner expects OCR lines/list
cleaned_words = clean_text(all_texts)

# Convert cleaned list into string
cleaned = " ".join(cleaned_words)

print("\n========== CLEANED TEXT ==========")
print(cleaned)

print("\nCLEANED TEXT LENGTH:", len(cleaned))

if not cleaned.strip():
    raise ValueError(
        "Cleaned OCR text is empty. Check text_cleaner.py."
    )


# ============================================================
# 4. MEDICINE EXTRACTION
# ============================================================

print("\n========== MEDICINE EXTRACTION ==========")

result = extract_medicine_names(cleaned)

# Safety check
if not isinstance(result, dict):
    raise ValueError(
        "Medicine extractor did not return a dictionary."
    )

if "medicines" not in result:
    raise ValueError(
        "Medicine extractor response does not contain 'medicines'."
    )


medi = []

print("\n===== MEDICINES FOUND =====")

for medicine in result["medicines"]:

    medicine = medicine.strip()

    if medicine and medicine not in medi:
        medi.append(medicine)

        print(f"- {medicine}")


print("\nMEDI:", medi)
print("NUMBER OF MEDICINES:", len(medi))


# ============================================================
# 5. CREATE MEDICINE PAIRS
# ============================================================

print("\n========== MEDICINE PAIRS ==========")

# IMPORTANT:
# Convert combinations() into a list because we need
# to use the pairs more than once.

pairs = list(combinations(medi, 2))

print("NUMBER OF PAIRS:", len(pairs))

if not pairs:

    print("\nNo medicine pairs were created.")

    if len(medi) == 0:
        print("Reason: No medicines were detected.")

    elif len(medi) == 1:
        print("Reason: Only one medicine was detected.")
        print("At least 2 medicines are required.")

else:

    for drug1, drug2 in pairs:
        print(f"- {drug1} + {drug2}")


# ============================================================
# 6. FDA API + GROQ ANALYSIS
# ============================================================

print("\n========== DRUG INTERACTION ANALYSIS ==========")

results = []

for drug1, drug2 in pairs:

    print(f"\nChecking: {drug1} + {drug2}")
    print("-" * 70)

    try:

        result = check_drug_interaction(
            drug1,
            drug2
        )

        results.append({
            "drug_a": drug1,
            "drug_b": drug2,
            "result": result
        })

        print(
            f"Interaction Found : "
            f"{result.get('interaction_found', 'Unknown')}"
        )

        print(
            f"Severity          : "
            f"{result.get('severity', 'Unknown')}"
        )

        print(
            f"Description       : "
            f"{result.get('description', 'No description available')}"
        )

    except Exception as e:

        print(f"ERROR checking {drug1} + {drug2}: {e}")

        results.append({
            "drug_a": drug1,
            "drug_b": drug2,
            "result": {
                "interaction_found": False,
                "severity": "Unknown",
                "description": f"Error while checking interaction: {str(e)}"
            }
        })


# ============================================================
# 7. FINAL RESULTS
# ============================================================

print("\n========== FINAL RESULTS ==========")

if not results:

    print("No interaction analysis was performed.")

else:

    for item in results:

        drug_a = item["drug_a"]
        drug_b = item["drug_b"]
        result = item["result"]

        print("\n" + "-" * 70)

        print(f"Medicine Pair : {drug_a} + {drug_b}")

        print(
            f"Interaction   : "
            f"{result.get('interaction_found', 'Unknown')}"
        )

        print(
            f"Severity      : "
            f"{result.get('severity', 'Unknown')}"
        )

        print(
            f"Description   : "
            f"{result.get('description', 'No description available')}"
        )


# ============================================================
# 8. PIPELINE COMPLETED
# ============================================================

print("\n" + "=" * 70)
print("PIPELINE COMPLETED")
print("=" * 70)