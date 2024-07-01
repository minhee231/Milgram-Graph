import boto3
import json

class S3:
    def __init__(self, aws_access_key_id: str, aws_secret_access_key: str):
        self.aws_access_key_id = aws_access_key_id  # 수정: self.aws_key_id -> self.aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key  # 수정: self.aws_access_key -> self.aws_secret_access_key
        self.region_name = "ap-northeast-2"

    def set_bucket(self):
        s3 = boto3.client('s3', aws_access_key_id=self.aws_access_key_id, aws_secret_access_key=self.aws_secret_access_key, region_name=self.region_name)

        return s3

    def upload_s3(self, data, s3_file_path: str):
        s3 = self.set_bucket()
        s3.put_object(
            Body=json.dumps(data),
            Bucket="milgram-character",
            Key=s3_file_path,
            ACL='public-read',
            ContentType='application/json'
        )

    def load_s3_file(self, s3_file_path: str):
        s3 = self.set_bucket()
        file_obj = s3.get_object(Bucket="milgram-character", Key=s3_file_path)
        file_content = file_obj['Body'].read().decode('utf-8')
        file_data = json.loads(file_content)

        return file_data