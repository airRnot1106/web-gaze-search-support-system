import time

import tobii_research as tr

# デバイスの取得
found_eyetrackers = tr.find_all_eyetrackers()
my_eyetracker = found_eyetrackers[0]

if my_eyetracker is None:
    print("No eyetracker found", flush=True)
    exit(1)


# サブスクライブで実行するコールバック関数
def gaze_data_callback(gaze_data):
    gaze_left_eye = gaze_data["left_gaze_point_on_display_area"]
    gaze_right_eye = gaze_data["right_gaze_point_on_display_area"]

    unixtime = int(time.time() * 1000)

    gaze_left_point = (gaze_left_eye[0] + gaze_right_eye[0]) / 2
    gaze_right_point = (gaze_left_eye[1] + gaze_right_eye[1]) / 2

    print(
        "{unixtime}/{gaze_left_point}/{gaze_right_point}".format(
            unixtime=unixtime,
            gaze_left_point=gaze_left_point,
            gaze_right_point=gaze_right_point,
        ),
        flush=True,
    )


# サブスクライブの開始
my_eyetracker.subscribe_to(
    tr.EYETRACKER_GAZE_DATA, gaze_data_callback, as_dictionary=True
)

# プロセスが終了しないようにする
while True:
    time.sleep(1)
