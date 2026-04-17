import qrcode
import os

# 1. Setup Directory (Saves to public/qrs)
base_dir = os.path.dirname(os.path.abspath(__file__))
output_dir = os.path.join(base_dir, "public", "qrs")

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 2. THE PERMANENT URL 
# This points to the 'scan' route we will create in Next.js
base_url = "https://jenga-architect.vercel.app/multi/scan/"

print(f"Generating 54 QRs targeting: {base_url}")

for i in range(1, 55):
    # Format: BLOCK-01, BLOCK-02...
    block_id = f"BLOCK-{i:02}"
    url = f"{base_url}{block_id}"
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    
    qr.add_data(url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save file
    file_path = os.path.join(output_dir, f"{block_id}.png")
    img.save(file_path)

print(f"Success! 54 QRs ready in {output_dir}")