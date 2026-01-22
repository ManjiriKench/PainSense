import cv2
from mediapipe.python.solutions.face_mesh import FaceMesh
from ai.facial.engines.paic_engine import PAICFacialEngine

paic = PAICFacialEngine()

face_mesh = FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = face_mesh.process(rgb)

    if result.multi_face_landmarks:
        for face in result.multi_face_landmarks:
            h, w, _ = frame.shape
            landmarks = [(int(p.x * w), int(p.y * h)) for p in face.landmark]

            raw_score, features = paic.compute_paic(landmarks)
            pain = paic.temporal_score(raw_score)

            cv2.putText(
                frame, f"PAIC Pain Level: {pain}/10",
                (20, 40), cv2.FONT_HERSHEY_SIMPLEX,
                1.0, (0, 0, 255), 2
            )

            y = 80
            for k, v in features.items():
                cv2.putText(
                    frame, f"{k}: {v}",
                    (20, y), cv2.FONT_HERSHEY_SIMPLEX,
                    0.6, (255, 0, 255), 1
                )
                y += 25

    cv2.imshow("PAIC Facial Pain Detection", frame)
    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
