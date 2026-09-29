import re
from backend.app.services.ocr_service import extract_text

# Words that are usually not medicine names
REMOVE_WORDS = {
    "tablet", "tablets",
    "capsule", "capsules",
    "syrup",
    "ip",
    "mg",
    "ml",
    "batch",
    "expiry",
    "exp",
    "mfg",
    "manufactured",
    "mrp",
    "take",
    "after",
    "before",
    "meal",
    "meals"
}

def clean_text(extracted_text):
    cleaned = []

    for text in extracted_text:

        # Convert to lowercase
        text = text.lower()

        # Remove special characters
        text = re.sub(r'[^a-zA-Z0-9 ]', '', text)

        words = text.split()

        for word in words:

            # Remove numbers
            if word.isdigit():
                continue

            # Remove unwanted words
            if word in REMOVE_WORDS:
                continue

            # Remove very short words
            if len(word) <= 2:
                continue

            cleaned.append(word)

    # Remove duplicates
    cleaned = list(dict.fromkeys(cleaned))

    return cleaned