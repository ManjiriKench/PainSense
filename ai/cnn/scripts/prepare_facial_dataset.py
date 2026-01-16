import os
import shutil

# -----------------------------
# CONFIG
# -----------------------------
SOURCE_DIR = r"D:\python\Painsense\PainSense\ai\cnn\Modified"
TARGET_DIR = r"D:\python\Painsense\PainSense\ai\cnn\data\processed"

PAIN_CLASSES = ["Algometer Pain", "Laser Pain"]
NEUTRAL_CLASS = "Neutral"


def safe_mkdir(path):
    os.makedirs(path, exist_ok=True)


def is_colour_full_frame(folder_name: str) -> bool:
    name = folder_name.lower()
    return ("colour" in name) and ("oval" not in name)


def copy_images(src_dir, dst_dir, prefix=None):
    safe_mkdir(dst_dir)

    for img in os.listdir(src_dir):
        if img.lower().endswith((".jpg", ".jpeg", ".png")):
            src = os.path.join(src_dir, img)

            if prefix:
                dst_name = f"{prefix}_{img}"
            else:
                dst_name = img

            dst = os.path.join(dst_dir, dst_name)
            shutil.copy(src, dst)


def process_subject(subject_path, subject_id):
    # -------- Pain classes --------
    for pain_type in PAIN_CLASSES:
        pain_path = os.path.join(subject_path, pain_type)
        if not os.path.exists(pain_path):
            continue

        for subfolder in os.listdir(pain_path):
            if is_colour_full_frame(subfolder):
                src_frames = os.path.join(pain_path, subfolder)
                dst_frames = os.path.join(TARGET_DIR, "pain", subject_id)

                copy_images(
                    src_frames,
                    dst_frames,
                    prefix=pain_type.replace(" ", "")
                )

    # -------- Neutral --------
    neutral_path = os.path.join(subject_path, NEUTRAL_CLASS)
    if not os.path.exists(neutral_path):
        return

    for subfolder in os.listdir(neutral_path):
        if is_colour_full_frame(subfolder):
            src_frames = os.path.join(neutral_path, subfolder)
            dst_frames = os.path.join(TARGET_DIR, "neutral", subject_id)

            copy_images(src_frames, dst_frames)


def main():
    safe_mkdir(os.path.join(TARGET_DIR, "pain"))
    safe_mkdir(os.path.join(TARGET_DIR, "neutral"))

    subjects = sorted(os.listdir(SOURCE_DIR))

    for subject in subjects:
        subject_path = os.path.join(SOURCE_DIR, subject)
        if not os.path.isdir(subject_path):
            continue

        print(f"[INFO] Processing {subject}")
        process_subject(subject_path, subject)

    print("[DONE] Facial dataset prepared successfully (colour full frames only).")


if __name__ == "__main__":
    main()
