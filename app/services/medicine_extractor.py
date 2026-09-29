import json
import re
from groq import Groq
from app.services.app_config import GROQ_API_KEY
from app.services.text_cleaner import clean_text

client = Groq(api_key=GROQ_API_KEY)

MAX_CHARS = 20000
MODEL_NAME = "openai/gpt-oss-20b"


def extract_json_from_text(text):
    # Strip any <think>...</think> block if present
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return match.group(0)
    return text


def extract_medicine_names(all_text):

    if not all_text or not all_text.strip():
        raise ValueError("No text to extract from.")

    if len(all_text) > MAX_CHARS:
        all_text = all_text[:MAX_CHARS]

    prompt = f"""You are analyzing noisy OCR text scanned from a medicine label. Your job is to find real medicine/drug names mentioned in the text below, and correct obvious OCR spelling errors.

Ignore: patient names, doctor names, hospital/company names, addresses, phone numbers, dates, batch numbers, and dosage amounts like 500mg.

For example, if the text contained "paracetamol amoxi5t0 hospital delhi batch123", your output should be:
{{"medicines": ["Paracetamol", "Amoxicillin"]}}

Now do the same for this actual text. Do NOT copy the example above — extract real medicine names found in THIS text only. If none are found, return {{"medicines": []}}.

Respond with ONLY the JSON object, nothing else.

TEXT:
{all_text}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=4000,
        reasoning_effort="low",  # keep internal reasoning short so tokens remain for the answer
    )

    choice = response.choices[0]
    text = choice.message.content.strip() if choice.message.content else ""

    print("\nFINISH REASON:", choice.finish_reason)
    print("MODEL RESPONSE:")
    print(repr(text))

    if not text:
        raise ValueError(
            f"Model returned an empty response. finish_reason={choice.finish_reason}. "
            "If finish_reason is 'length', the token budget is still too low."
        )

    json_text = extract_json_from_text(text)

    try:
        return json.loads(json_text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON from model: {e}\nRaw: {text}")

