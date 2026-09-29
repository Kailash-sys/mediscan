import os
import uuid
from typing import Annotated

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.ocr_service import extract_text
from app.services.text_cleaner import clean_text
from app.services.medicine_extractor import extract_medicine_names
from app.services.pair_maker import make_pairs
from app.services.fda_service import check_drug_interaction


router = APIRouter(
    prefix="/analysis",
    tags=["Medical Analysis"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/analyze-images")
async def analyze_images(
    files: list[UploadFile] = File(...)
):

    if not files:
        raise HTTPException(
            status_code=400,
            detail="Please upload at least one image."
        )

    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/jpg"
    ]

    all_texts = []
    uploaded_files = []

    # =====================================================
    # 1. SAVE + OCR ALL IMAGES
    # =====================================================

    for file in files:

        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file.filename}"
            )

        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        contents = await file.read()

        with open(file_path, "wb") as f:
            f.write(contents)

        uploaded_files.append(filename)

        # OCR
        text = extract_text(file_path)

        if isinstance(text, list):
            all_texts.extend(text)
        else:
            all_texts.append(text)

    # =====================================================
    # 2. TEXT CLEANING
    # =====================================================

    cleaned_words = clean_text(all_texts)

    cleaned_text = " ".join(cleaned_words)

    if not cleaned_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No useful text was extracted from the images."
        )

    # =====================================================
    # 3. MEDICINE EXTRACTION
    # =====================================================

    medicine_result = extract_medicine_names(
        cleaned_text
    )

    if not isinstance(medicine_result, dict):
        raise HTTPException(
            status_code=500,
            detail="Medicine extractor returned invalid data."
        )

    medicines = medicine_result.get(
        "medicines",
        []
    )

    # Remove duplicates
    medicines = list(dict.fromkeys(medicines))

    # =====================================================
    # 4. CREATE MEDICINE PAIRS
    # =====================================================

    pairs = make_pairs(medicines)

    # =====================================================
    # 5. DRUG INTERACTION ANALYSIS
    # =====================================================

    interactions = []

    for drug1, drug2 in pairs:

        try:

            result = check_drug_interaction(
                drug1,
                drug2
            )

            interactions.append({
                "drug_a": drug1,
                "drug_b": drug2,
                "result": result
            })

        except Exception as e:

            interactions.append({
                "drug_a": drug1,
                "drug_b": drug2,
                "result": {
                    "interaction_found": False,
                    "severity": "Unknown",
                    "description": str(e)
                }
            })

    # =====================================================
    # 6. FINAL RESPONSE
    # =====================================================

    return {
        "success": True,

        "files": uploaded_files,

        "number_of_images": len(files),

        "ocr_text": all_texts,

        "cleaned_text": cleaned_words,

        "medicines": medicines,

        "number_of_medicines": len(medicines),

        "pairs": pairs,

        "number_of_pairs": len(pairs),

        "interactions": interactions
    }