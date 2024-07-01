import requests

def get_video_info(youtube_id: str, key: str):
    req_url = f"https://www.googleapis.com/youtube/v3/videos?id={youtube_id}&key={key}&part=statistics,snippet"
    r = requests.get(req_url)

    return r.json()

def get_past_data(s3_path: str):
    url = f"https://milgram-character.s3.ap-northeast-2.amazonaws.com/past/{s3_path}.json"
    r = requests.get(url)

    return r.json()





# print(ds["items"][0]["id"]) # 유튜브 id 호출
# print(ds["items"][0]["snippet"]["title"]) #영상 제목 호출
# print(ds["items"][0]["snippet"]["thumbnails"]["maxres"]["url"]) #썸네일 url 호출
# print(ds["items"][0]["statistics"]["viewCount"]) #조회수 호출
# print(ds["items"][0]["statistics"]["likeCount"]) #좋아요수 호출

