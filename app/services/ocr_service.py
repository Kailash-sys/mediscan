import easyocr

# Create EasyOCR reader only once
reader = easyocr.Reader(['en'])

def extract_text(image_path):
    """
    Reads text from an image using EasyOCR.
    Returns a list of detected text strings.
    """

    results = reader.readtext(image_path)

    extracted_text = []

    for detection in results:
        text = detection[1]   # detected text
        extracted_text.append(text)

    return extracted_text