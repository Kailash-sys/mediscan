from itertools import combinations


def make_pairs(medicines):
    """
    Create all unique medicine pairs.

    Example:
    ["Paracetamol", "Amoxicillin", "Ibuprofen"]

    returns:

    [
        ("Paracetamol", "Amoxicillin"),
        ("Paracetamol", "Ibuprofen"),
        ("Amoxicillin", "Ibuprofen")
    ]
    """

    if not medicines:
        return []

    return list(combinations(medicines, 2))