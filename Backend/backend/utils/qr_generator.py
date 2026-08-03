import os
import uuid

import qrcode


# Directory where QR images will be stored
QR_FOLDER = "uploads/qrcodes"

os.makedirs(
    QR_FOLDER,
    exist_ok=True,
)


def generate_qr_code(data: str) -> str:
    """
    Generate a QR code image and return its file path.
    """

    filename = f"{uuid.uuid4().hex}.png"

    filepath = os.path.join(
        QR_FOLDER,
        filename,
    )

    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=4,
    )

    qr.add_data(data)
    qr.make(fit=True)

    image = qr.make_image(
        fill_color="black",
        back_color="white",
    )

    image.save(filepath)

    return filepath