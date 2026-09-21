import mediapipe as mp
import numpy as np

print('mp', mp.__version__)
for complexity in (0, 1):
    print('testing', complexity)
    try:
        pose = mp.solutions.pose.Pose(model_complexity=complexity)
        res = pose.process(np.zeros((480, 640, 3), dtype=np.uint8))
        print('result', res is not None)
        pose.close()
    except Exception as exc:
        print('error', exc)
