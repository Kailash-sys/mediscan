import os
import requests
import re
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set in .env")

client = Groq(api_key=GROQ_API_KEY)

# Indian generic name -> US/FDA generic name
INDIAN_TO_US_NAME = {
    "paracetamol": "acetaminophen",
    "salbutamol": "albuterol",
    "frusemide": "furosemide",
    "adrenaline": "epinephrine",
    "amoxycillin": "amoxicillin",
    "diclofenac sodium": "diclofenac",
    "chlorpheniramine maleate": "chlorpheniramine",
    "noradrenaline": "norepinephrine",
    "pethidine": "meperidine",
    "isoprenaline": "isoproterenol",
}


def to_us_name(drug_name):
    return INDIAN_TO_US_NAME.get(drug_name.lower().strip(), drug_name)


def get_fda_label_text(drug_name):
    """Fetch drug_interactions + warnings text from FDA label."""
    us_name = to_us_name(drug_name)
    url = "https://api.fda.gov/drug/label.json"
    params = {"search": f'openfda.generic_name:"{us_name}"', "limit": 1}

    try:
        resp = requests.get(url, params=params, timeout=10)
    except requests.RequestException:
        return None

    if resp.status_code != 200:
        return None

    results = resp.json().get("results", [])
    if not results:
        return None

    label = results[0]
    combined = []
    for field in ["drug_interactions", "warnings", "precautions"]:
        if field in label:
            combined.append(" ".join(label[field]))
    return " ".join(combined) if combined else None


def ask_llm_for_interaction(drug_a, drug_b, text_a, text_b):
    """Send both raw label texts to Groq and get back a clean structured result."""

    prompt = f"""You are a clinical pharmacology assistant. Based ONLY on the FDA label text below, 
determine if there is an interaction between {drug_a} and {drug_b}.

FDA label text for {drug_a}:
\"\"\"{text_a or "No data available"}\"\"\"

FDA label text for {drug_b}:
\"\"\"{text_b or "No data available"}\"\"\"

Respond with ONLY a JSON object in this exact format, nothing else, no markdown formatting:
{{
  "interaction_found": true or false,
  "severity": "Major" or "Moderate" or "Minor" or "None" or "Unknown",
  "description": "A clear 2-3 sentence explanation of the interaction (or why none was found), written in plain language for a general user."
}}"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",  # good balance of speed + quality on Groq
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )

    raw_text = response.choices[0].message.content.strip()
    raw_text = re.sub(r"^```json|```$", "", raw_text, flags=re.MULTILINE).strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        return {
            "interaction_found": False,
            "severity": "Unknown",
            "description": "Could not parse a structured response. Raw output: " + raw_text
        }


def check_drug_interaction(drug_a, drug_b):
    text_a = get_fda_label_text(drug_a)
    text_b = get_fda_label_text(drug_b)

    if text_a is None and text_b is None:
        return {
            "interaction_found": False,
            "severity": "Unknown",
            "description": f"Could not find FDA label data for '{drug_a}' or '{drug_b}'."
        }

    result = ask_llm_for_interaction(drug_a, drug_b, text_a, text_b)
    return result


if __name__ == "__main__":
    print("=== Drug Interaction Checker (Indian Names + Groq LLM Explanation) ===")
    print("(Type 'exit' anytime to quit)\n")

    while True:
        drug1 = input("Enter first drug name: ").strip()
        if drug1.lower() == "exit":
            break
        drug2 = input("Enter second drug name: ").strip()
        if drug2.lower() == "exit":
            break

        print("\nFetching FDA data and analyzing...\n")
        result = check_drug_interaction(drug1, drug2)

        print(f"Interaction Found: {result['interaction_found']}")
        print(f"Severity: {result['severity']}")
        print(f"Description: {result['description']}")
        print("-" * 60)