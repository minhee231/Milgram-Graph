from datetime import datetime, timedelta
from video import VideoInfo
from s3 import S3
import times
import info_req
import json

def process_url_data(url_data, youtube_api):
    total_dict = {}
    
    for name_key, name_value in url_data.items():
        character = VideoInfo(name_key)
        total_dict[name_key] = character
        if name_key == "ES":
            break
            
        for trial_key, trial_value in name_value.items():
            for key, value in trial_value.items():
                r = info_req.get_video_info(value, youtube_api)
                if r and "items" in r and len(r["items"]) > 0:
                    view = int(r["items"][0]["statistics"]["viewCount"])
                    character.set_total_views(key, view)

    return total_dict

def es_thema(key, view, data):

    #data["thema"][key] = view
    if key in data["thema"]:
        data["thema"][key] += view
    else:
        data["thema"][key] = view

    return data

def es_cover(youtube_api,data,url_data):
    total = 0
    for type_key, type_value in url_data["first_trial_cover"].items():
        for num_key, num_value in type_value.items():
            if num_value:
                r = info_req.get_video_info(num_value, youtube_api)
                view = int(r["items"][0]["statistics"]["viewCount"])
                data["first_trial_cover"][num_key] += view
                total += view
    data["first_trial_cover"]["total"] = total
    data["thema"]["first_trial_cover"] = total
    return data

def es(name_value, youtube_api):
    data = {
        "thema": {
            "mv": 0,
            "ch_album": 0,
            "cover": 0,
            "voice_drama": 0,
            "cover_off_voice": 0,
            "ch_off_voice": 0,
            "first_trial_cover": 0
        },

        "first_trial_cover": {
            "total": 0,
            "001": 0,
            "002": 0,
            "003": 0,
            "004": 0,
            "005": 0,
            "006": 0,
            "007": 0,
            "008": 0,
            "009": 0,
            "010": 0
        },

        "view_diffs": {
            "1day": {
                "mv": 0,
                "ch_album": 0,
                "cover": 0,
                "voice_drama": 0,
                "cover_off_voice": 0,
                "ch_off_voice": 0,
                "first_trial_cover": 0
            },
            "7day": {
                "mv": 0,
                "ch_album": 0,
                "cover": 0,
                "voice_drama": 0,
                "cover_off_voice": 0,
                "ch_off_voice": 0,
                "first_trial_cover": 0
            },
            "1month": {
                "mv": 0,
                "ch_album": 0,
                "cover": 0,
                "voice_drama": 0,
                "cover_off_voice": 0,
                "ch_off_voice": 0,
                "first_trial_cover": 0
            },
            "1year": {
                "mv": 0,
                "ch_album": 0,
                "cover": 0,
                "voice_drama": 0,
                "cover_off_voice": 0,
                "ch_off_voice": 0,
                "first_trial_cover": 0
            }
        }
    }

    for key, value in name_value["thema"].items():
        if value:
            r = info_req.get_video_info(value, youtube_api)
            if r and "items" in r and len(r["items"]) > 0:
                view = int(r["items"][0]["statistics"]["viewCount"])
                data = es_thema(key, view, data)
    
    data = es_cover(youtube_api,data,name_value)

    return data


def set_1day_diff(now_data, one_day_ago_data):
    for name_key, name_value in one_day_ago_data.items():
        if name_key == "ES":
            for type_key, type_value in name_value["thema"].items():
                diff_data =  now_data[name_key]["thema"][type_key] - one_day_ago_data[name_key]["thema"][type_key]
                now_data[name_key]["view_diffs"]["1day"][type_key] = diff_data
            return now_data

        for type_key, type_value in name_value["total_views"].items():
            diff_data =  now_data[name_key]["total_views"][type_key] - one_day_ago_data[name_key]["total_views"][type_key]

            now_data[name_key]["view_diffs"]["1day"][type_key] = diff_data
    return now_data

def set_7day_diff(now_data, seven_day_ago_data):
    for name_key, name_value in seven_day_ago_data.items():
        if name_key == "ES":
            for type_key, type_value in name_value["thema"].items():
                diff_data =  now_data[name_key]["thema"][type_key] - seven_day_ago_data[name_key]["thema"][type_key]
                now_data[name_key]["view_diffs"]["7day"][type_key] = diff_data
            return now_data
        
        for type_key, type_value in name_value["total_views"].items():
            diff_data =  now_data[name_key]["total_views"][type_key] - seven_day_ago_data[name_key]["total_views"][type_key]

            now_data[name_key]["view_diffs"]["7day"][type_key] = diff_data
    return now_data

def set_1month_diff(now_data, one_month_ago_data):
    if name_key == "ES":
            for type_key, type_value in name_value["thema"].items():
                diff_data =  now_data[name_key]["thema"][type_key] - one_month_ago_data[name_key]["thema"][type_key]
                now_data[name_key]["view_diffs"]["1month"][type_key] = diff_data
            return now_data
    
    for name_key, name_value in one_month_ago_data.items():
        for type_key, type_value in name_value["total_views"].items():
            diff_data =  now_data[name_key]["total_views"][type_key] - one_month_ago_data[name_key]["total_views"][type_key]

            now_data[name_key]["view_diffs"]["1month"][type_key] = diff_data
    return now_data

def set_1year_diff(now_data, one_year_ago_data):
    if name_key == "ES":
            for type_key, type_value in name_value["thema"].items():
                diff_data =  now_data[name_key]["thema"][type_key] - one_year_ago_data[name_key]["thema"][type_key]
                now_data[name_key]["view_diffs"]["1year"][type_key] = diff_data
            return now_data
    
    for name_key, name_value in one_year_ago_data.items():
        for type_key, type_value in name_value["total_views"].items():
            diff_data =  now_data[name_key]["total_views"][type_key] - one_year_ago_data[name_key]["total_views"][type_key]

            now_data[name_key]["view_diffs"]["1year"][type_key] = diff_data
    return now_data

def get_past_data(s3,all_characters_data):
    try:
        one_day_ago_data = s3.load_s3_file(f"character_view_{times.get_1day_ago()}.json")
        all_characters_data = set_1day_diff(all_characters_data, one_day_ago_data)

        seven_day_ago_data = s3.load_s3_file(f"character_view_{times.get_7day_ago()}.json")
        all_characters_data = set_7day_diff(all_characters_data, seven_day_ago_data)

        one_month_ago_data = s3.load_s3_file(f"character_view_{times.get_1month_ago()}.json")
        all_characters_data = set_1month_diff(all_characters_data, one_month_ago_data)

        one_year_ago_data = s3.load_s3_file(f"character_view_{times.get_1year_ago()}.json")
        all_characters_data = set_1year_diff(all_characters_data, one_year_ago_data)
    except:
        return all_characters_data

def lambda_handler(event, context):
    with open("./key.json", "r") as file:
        key_data = json.load(file)
    YOUTUBE_API = key_data["youtube_api"]
    AWS_ACCESS_KEY_ID = key_data["aws"]["aws_access_key_id"]
    AWS_SECRET_ACCESS_KEY = key_data["aws"]["aws_secret_access_key"]

    with open("./character_video_url.json", 'r') as file:
        URL_DATA = json.load(file)

    processed_data = process_url_data(URL_DATA, YOUTUBE_API)

    all_characters_data = {name: character.character_data for name, character in processed_data.items()}
    all_characters_data["ES"] = es(URL_DATA["ES"],YOUTUBE_API)

    latest_s3_path = "latest/character_view.json"
    past_s3_path = f"character_view_{times.get_current_kst_time()}.json"
    local_file_path = f"{past_s3_path}"


    s3 = S3(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)

    all_characters_data = get_past_data(s3,all_characters_data)

    #맨 마지막=======

    with open(local_file_path, "+w") as file:
        file.write(json.dumps(all_characters_data, indent=4))
    s3.upload_s3(local_file_path, latest_s3_path)
    s3.upload_s3(local_file_path, f"past/{past_s3_path}")
    return "Good"