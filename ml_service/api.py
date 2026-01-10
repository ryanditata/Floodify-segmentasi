from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64

# ===============================
# APP INITIALIZATION
# ===============================
app = FastAPI(title="Floodify ML Service")

# Enable CORS (required for Laravel / React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# MODEL CONFIGURATION
# ===============================
IMG_HEIGHT = 256
IMG_WIDTH = 256
MODEL_PATH = "models/model_unet_best.h5"

print("🔄 Loading U-Net model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("✅ Model loaded successfully")

# ===============================
# PREPROCESSING FUNCTION
# ===============================
def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess image to match U-Net training configuration
    """
    # Resize image
    image = image.resize((IMG_WIDTH, IMG_HEIGHT))

    # Convert to numpy array
    img_array = np.array(image)

    # NOTE:
    # Aktifkan baris di bawah HANYA jika training pakai cv2.imread()
    # img_array = img_array[:, :, ::-1]  # RGB -> BGR

    # Normalize (0–1)
    img_array = img_array / 255.0

    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)

    return img_array

# ===============================
# PREDICTION ENDPOINT
# ===============================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predict flood area using U-Net segmentation model
    """
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png"]:
        return {
            "status": "error",
            "message": "File harus berupa gambar JPG atau PNG"
        }

    try:
        # Read uploaded image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Preprocess image
        processed_img = preprocess_image(image)

        # Model prediction
        prediction = model.predict(processed_img)
        pred_mask = prediction[0]

        # Post-processing (binary segmentation)
        mask_array = (pred_mask > 0.5).astype(np.uint8) * 255

        # Remove channel dimension if exists
        if mask_array.shape[-1] == 1:
            mask_array = mask_array.squeeze()

        # Convert mask to PNG Base64
        mask_image = Image.fromarray(mask_array)
        buffered = io.BytesIO()
        mask_image.save(buffered, format="PNG")
        mask_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return {
            "status": "success",
            "image_base64": mask_base64
        }

    except Exception as e:
        return {
            "status": "error",
            "message": f"Prediction failed: {str(e)}"
        }
