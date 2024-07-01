class VideoInfo:
    def __init__(self, character_name: str):
        self.character_name = character_name
        self.character_data = {
            "total_views": self.get_default_media(),
            "view_diffs": {
                "1day": self.get_default_media(),
                "7day": self.get_default_media(),
                "1month": self.get_default_media(),
                "1year": self.get_default_media()
            }
        }

    def get_default_media(self):
        return {
            "mv": 0,
            "ch_album": 0,
            "cover": 0,
            "voice_drama": 0,
            "cover_off_voice": 0,
            "ch_off_voice": 0
        }

    def set_total_views(self, key, view):
        if key in self.character_data["total_views"]:
            self.character_data["total_views"][key] += view
        else:
            self.character_data["total_views"][key] = view

    