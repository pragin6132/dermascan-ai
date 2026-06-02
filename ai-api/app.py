from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
import numpy as np
import cv2
import io

app = FastAPI()

# Allow CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
model = load_model("best_dermascan_model.keras")

class_names = [
    'Acne And Rosacea Photos',
    'Actinic Keratosis Basal Cell Carcinoma And Other Malignant Lesions',
    'Atopic Dermatitis Photos',
    'Ba Cellulitis',
    'Ba Impetigo',
    'Benign',
    'Bullous Disease Photos',
    'Cellulitis Impetigo And Other Bacterial Infections',
    'Eczema Photos',
    'Exanthems And Drug Eruptions',
    'Fu Athlete Foot',
    'Fu Nail Fungus',
    'Fu Ringworm',
    'Hair Loss Photos Alopecia And Other Hair Diseases',
    'Heathy',
    'Herpes Hpv And Other Stds Photos',
    'Light Diseases And Disorders Of Pigmentation',
    'Lupus And Other Connective Tissue Diseases',
    'Malignant',
    'Melanoma Skin Cancer Nevi And Moles',
    'Nail Fungus And Other Nail Disease',
    'Pa Cutaneous Larva Migrans',
    'Poison Ivy Photos And Other Contact Dermatitis',
    'Psoriasis Pictures Lichen Planus And Related Diseases',
    'Rashes',
    'Scabies Lyme Disease And Other Infestations And Bites',
    'Seborrheic Keratoses And Other Benign Tumors',
    'Systemic Disease',
    'Tinea Ringworm Candidiasis And Other Fungal Infections',
    'Urticaria Hives',
    'Vascular Tumors',
    'Vasculitis Photos',
    'Vi Chickenpox',
    'Vi Shingles',
    'Warts Molluscum And Other Viral Infections'
]

from fastapi.responses import JSONResponse

def is_skin_image(img: Image.Image) -> bool:
    # Resize to speed up calculation
    img_small = img.resize((100, 100))
    ycbcr_data = np.array(img_small.convert("YCbCr"))
    
    y = ycbcr_data[:, :, 0]
    cb = ycbcr_data[:, :, 1]
    cr = ycbcr_data[:, :, 2]
    
    # Skin tones definition in YCbCr:
    # Cb: 77 to 127
    # Cr: 133 to 173
    skin_mask = (cb >= 77) & (cb <= 127) & (cr >= 133) & (cr <= 173)
    skin_ratio = np.sum(skin_mask) / cb.size
    print(f"[VALIDATION] YCbCr skin ratio: {skin_ratio:.4f}")
    return skin_ratio >= 0.25

@app.get("/")
def home():
    return {"message": "DermaScan AI API Running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()

    img = Image.open(io.BytesIO(contents))
    
    # Validate if image is a skin image
    if not is_skin_image(img):
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid image. Please upload a skin disease or skin allergy image."}
        )

    # Prepare image for model prediction
    img_rgb = img.convert("RGB").resize((224, 224))
    img_array = np.array(img_rgb)
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)[0]

    top3_idx = np.argsort(prediction)[-3:][::-1]

    results = []

    for i in top3_idx:
        results.append({
            "disease": class_names[i],
            "confidence": round(float(prediction[i] * 100), 2)
        })

    return {
        "predictions": results
    }
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)