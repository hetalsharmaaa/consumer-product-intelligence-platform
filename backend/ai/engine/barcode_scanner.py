"""
Reads a barcode out of an uploaded image using zxing-cpp (robust, multi-format).
Ported from ml/barcode_scanner.py to work off in-memory bytes (Django
UploadedFile) instead of a file path, since the image never touches disk here.
"""
import numpy as np
import cv2
import zxingcpp


def scan_barcode_bytes(image_bytes: bytes) -> dict:
    """
    Returns {"found": False} if no barcode is detected, otherwise
    {"found": True, "barcode_data": str, "barcode_type": str}.
    """
    arr = np.frombuffer(image_bytes, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Could not decode uploaded image.")

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    results = zxingcpp.read_barcodes(img_rgb)

    if not results:
        return {"found": False}

    barcode = results[0]
    return {
        "found": True,
        "barcode_data": barcode.text,
        "barcode_type": str(barcode.format),
    }
