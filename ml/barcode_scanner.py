import cv2
import zxingcpp


def scan_barcode(image_path: str) -> dict:
    """
    Reads a barcode from an image file using zxing-cpp (robust, multi-format).
    Returns {"found": False} if no barcode is detected.
    """
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image at path: {image_path}")

    # zxing-cpp expects RGB, OpenCV loads as BGR
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


if __name__ == "__main__":
    test_image = "test_barcode.png"
    result = scan_barcode(test_image)
    print(result)