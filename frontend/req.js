export function fetchDataSync() {
    const url = 'https://milgram-character.s3.ap-northeast-2.amazonaws.com/latest/character_view.json';

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('데이터 가져오기 실패:', error);
            return null;
        });
}
