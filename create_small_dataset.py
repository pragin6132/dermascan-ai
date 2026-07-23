import os
import shutil
import random

# -------------------------------
# Paths
# -------------------------------

SOURCE_DIR = r"D:\dermascan-ai\balanced_dataset\balanced_dataset"
TARGET_DIR = r"D:\dermascan-ai\small_dataset"

IMAGES_PER_CLASS = 100

# -------------------------------
# Create Target Folder
# -------------------------------

if os.path.exists(TARGET_DIR):
    shutil.rmtree(TARGET_DIR)

os.makedirs(TARGET_DIR)

# -------------------------------
# Copy Images
# -------------------------------

for cls in sorted(os.listdir(SOURCE_DIR)):

    cls_path = os.path.join(SOURCE_DIR, cls)

    if not os.path.isdir(cls_path):
        continue

    images = [
        img for img in os.listdir(cls_path)
        if img.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".webp"))
    ]

    random.shuffle(images)

    selected = images[:IMAGES_PER_CLASS]

    target_cls = os.path.join(TARGET_DIR, cls)
    os.makedirs(target_cls)

    for img in selected:
        shutil.copy2(
            os.path.join(cls_path, img),
            os.path.join(target_cls, img)
        )

    print(f"✅ {cls} --> {len(selected)} images")

print("\n🎉 Small dataset created successfully!")