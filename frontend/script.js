let milgram_data;

function fetchData() {
    return fetch("https://milgram-character.s3.ap-northeast-2.amazonaws.com/latest/character_view.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('데이터를 불러오는 데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            processData(data);
            return data;
        })
        .catch(error => {
            console.error('에러 발생:', error);
            return null;
        });
}

let data = {};

function processData(data) {
    Object.keys(data).forEach(name_key => {
        const name_value = data[name_key];
        data[name_key] = {}; // 각 name_key에 대한 빈 객체 생성

        Object.keys(name_value).forEach(key => {
            const value = name_value[key];
            let total_count = 0;

            Object.keys(value).forEach(type_key => {
                const type_value = value[type_key];
                total_count += type_value;
            });

            data[name_key][key] = total_count;
        });
    });

    //console.log(view_data);
}

fetchData().then(data => {
    console.log(Object.keys(data))
const labels = Object.keys(data);
const values = Object.values(data).map(character => character.total_views);
console.log(Object.values(data).map(character => character.total_views))

// 아이콘 이미지 로드
const iconUrls = {
    "HARUKA": "./images/haruka.webp",
    "YUNO": "./images/yuno.webp",
    "FUTA": "./images/futa.webp",
    "MU": "./images/mu.webp",
    "SHIDOU": "./images/shidou.webp",
    "MAHIRU": "./images/mahiru.webp",
    "KAZUI": "./images/kazui.webp",
    "AMANE": "./images/amane.webp",
    "MIKOTO": "./images/mikoto.webp",
    "KOTOKO": "./images/kotoko.webp",
    "ES": "./images/es.webp",
};
const icons = {};
const iconPromises = [];

for (const label in iconUrls) {
    const img = new Image();
    img.src = iconUrls[label];
    icons[label] = img;
    iconPromises.push(new Promise(resolve => {
        img.onload = resolve;
    }));
}

Promise.all(iconPromises).then(() => {
    // 차트 설정
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar', // 차트 유형: 막대 그래프
        data: {
            labels: labels, // x축 라벨
            datasets: [{
                label: 'Total Views', // 차트 라벨
                data: values, // 데이터 값
                backgroundColor: [
                    'rgba(0, 64, 232, 1)', // 막대 배경색
                    'rgba(249, 127, 181, 1)',
                    'rgba(234, 23, 10, 1)',
                    'rgba(237, 219, 0, 1)',
                    'rgba(101, 93, 198, 1)',
                    'rgba(255, 164, 0, 1)',
                    'rgba(0, 178, 227, 1)',
                    'rgba(0, 187, 180, 1)',
                    'rgba(123, 160, 196, 1)',
                    'rgba(201, 17, 190, 1)',
                    'rgba(234, 16, 22, 1)'
                ],
                borderColor: [
                    'rgba(0, 64, 232, 1)', // 막대 테두리색
                    'rgba(249, 127, 181, 1)',
                    'rgba(234, 23, 10, 1)',
                    'rgba(237, 219, 0, 1)',
                    'rgba(101, 93, 198, 1)',
                    'rgba(255, 164, 0, 1)',
                    'rgba(0, 178, 227, 1)',
                    'rgba(0, 187, 180, 1)',
                    'rgba(123, 160, 196, 1)',
                    'rgba(201, 17, 190, 1)',
                    'rgba(234, 16, 22, 1)'
                ],
                borderWidth: 1 // 테두리 두께
            }]
        },
        options: {
            scales: {
                x: {
                    barPercentage: 0.5, // 막대 너비 비율 조정
                    categoryPercentage: 0.5, // 카테고리 너비 비율 조정
                    grid: {
                        display: false // x축 격자선 숨기기
                    }
                },
                y: {
                    beginAtZero: true, // y축 0부터 시작
                    grid: {
                        display: false // y축 격자선 숨기기
                    }
                }
            },
            plugins: {
                legend: {
                    display: true // 범례 표시
                }
            }
        },
        plugins: [{
            // 플러그인 작성
            id: 'iconPlugin',
            afterDraw: chart => {
                const ctx = chart.ctx;
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    meta.data.forEach((bar, index) => {
                        const model = bar.$context.raw;
                        const icon = icons[labels[index]];
                        if (icon) {
                            const x = bar.x - 11; // 막대 중심으로 x좌표 조정
                            const y = bar.y - 30; // 막대 끝 위로 y좌표 조정
                            ctx.drawImage(icon, x, y, 25, 25); // 이미지 크기 조정
                        }
                    });
                });
            }
        }]
    });

    myChart.data.datasets.forEach(dataset => {
        dataset.barThickness = 30; // 막대의 두께를 픽셀 단위로 설정
    });

    myChart.update();
});
});

// const data = {
//     "HARUKA": {
//         "total_views": {
//             "mv": 5887950,
//             "ch_album": 443564,
//             "cover": 645537,
//             "voice_drama": 56811,
//             "cover_off_voice": 26802,
//             "ch_off_voice": 28896
//         },
//         "view_diffs": {
//             "1day": {
//                 "mv": 0,
//                 "ch_album": 0,
//                 "cover": 0,
//                 "voice_drama": 0,
//                 "cover_off_voice": 0,
//                 "ch_off_voice": 0
//             },
//             "7day": {
//                 "mv": 0,
//                 "ch_album": 0,
//                 "cover": 0,
//                 "voice_drama": 0,
//                 "cover_off_voice": 0,
//                 "ch_off_voice": 0
//             },
//             "1month": {
//                 "mv": 0,
//                 "ch_album": 0,
//                 "cover": 0,
//                 "voice_drama": 0,
//                 "cover_off_voice": 0,
//                 "ch_off_voice": 0
//             },
//             "1year": {
//                 "mv": 0,
//                 "ch_album": 0,
//                 "cover": 0,
//                 "voice_drama": 0,
//                 "cover_off_voice": 0,
//                 "ch_off_voice": 0
//             }
//         }
//     },
//     "YUNO": {
//         "total_views": {
//             "mv": 5487583,
//             "ch_album": 469685,
//             "cover": 599712,
//             "voice_drama": 44894,
//             "cover_off_voice": 27732,
//             "ch_off_voice": 33582
//         },
//         "view_diffs": {
//             "1day": {
//                 "mv": 0,
//                 "ch_album": 0,
//                 "cover": 0,
//                 "voice_drama": 0,
//                 "cover_off_voice": 0,
//                 "ch_off_voice": 0
//             },
//             "7day": {
//                 "mv": 0,
//                 "ch_album": 0,
//                 "cover": 0,
//                 "voice_drama": 0,
//                 "cover_off_voice": 0,
//                 "ch_off_voice": 0
//             },
//             "1month": {
//                 "mv": 0,
//                 "ch_album": 0,
//                 "cover": 0,
//                 "voice_drama": 0,
//                 "cover_off_voice": 0,
//                 "ch_off_voice": 0
//             },
//             "1year": {
//                 "mv": 0,
//                 "ch_album": 0,
//                 "cover": 0,
//                 "voice_drama": 0,
//                 "cover_off_voice": 0,
//                 "ch_off_voice": 0
//             }
//         }
//     }
// };

//processData(data);
// fetchData();
// console.log(data,"dasdasd");
// console.log(data,"dasdasd");
// console.log(Object.keys(data))
// const labels = Object.keys(data);
// const values = Object.values(data).map(character => character.total_views);
// console.log(Object.values(data).map(character => character.total_views))

// // 아이콘 이미지 로드
// const iconUrls = {
//     "HARUKA": "./icon_74.png",
//     "YUNO": "./icon_74.png",
//     "FUTA": "./icon_74.png",
//     "MU": "./icon_74.png",
//     "SHIDOU": "./icon_74.png",
//     "MAHIRU": "./icon_74.png",
//     "KAZUI": "./icon_74.png",
//     "AMANE": "./icon_74.png",
//     "MIKOTO": "./icon_74.png",
//     "KOTOKO": "./icon_74.png",
//     "ES": "./icon_74.png",
// };
// const icons = {};
// const iconPromises = [];

// for (const label in iconUrls) {
//     const img = new Image();
//     img.src = iconUrls[label];
//     icons[label] = img;
//     iconPromises.push(new Promise(resolve => {
//         img.onload = resolve;
//     }));
// }

// Promise.all(iconPromises).then(() => {
//     // 차트 설정
//     const ctx = document.getElementById('myChart').getContext('2d');
//     const myChart = new Chart(ctx, {
//         type: 'bar', // 차트 유형: 막대 그래프
//         data: {
//             labels: labels, // x축 라벨
//             datasets: [{
//                 label: 'Total Views', // 차트 라벨
//                 data: values, // 데이터 값
//                 backgroundColor: [
//                     'rgba(75, 192, 192, 0.2)', // 막대 배경색
//                     'rgba(54, 162, 235, 0.2)',
//                     'rgba(255, 206, 86, 0.2)',
//                     'rgba(255, 99, 132, 0.2)',
//                     'rgba(153, 102, 255, 0.2)',
//                     'rgba(255, 159, 64, 0.2)',
//                     'rgba(0, 0, 0, 0.2)',        // 추가: 검정색
//                     'rgba(128, 128, 128, 0.2)',  // 추가: 회색
//                     'rgba(255, 0, 0, 0.2)',      // 추가: 빨강색
//                     'rgba(0, 255, 0, 0.2)',      // 추가: 초록색
//                     'rgba(0, 0, 255, 0.2)'       // 추가: 파랑색
//                 ],
//                 borderColor: [
//                     'rgba(75, 192, 192, 1)', // 막대 테두리색
//                     'rgba(54, 162, 235, 1)',
//                     'rgba(255, 206, 86, 1)',
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(153, 102, 255, 1)',
//                     'rgba(255, 159, 64, 1)',
//                     'rgba(0, 0, 0, 1)',        // 추가: 검정색
//                     'rgba(128, 128, 128, 1)',  // 추가: 회색
//                     'rgba(255, 0, 0, 1)',      // 추가: 빨강색
//                     'rgba(0, 255, 0, 1)',      // 추가: 초록색
//                     'rgba(0, 0, 255, 1)'       // 추가: 파랑색
//                 ],
//                 borderWidth: 1 // 테두리 두께
//             }]
//         },
//         options: {
//             scales: {
//                 x: {
//                     barPercentage: 0.5, // 막대 너비 비율 조정
//                     categoryPercentage: 0.5, // 카테고리 너비 비율 조정
//                     grid: {
//                         display: false // x축 격자선 숨기기
//                     }
//                 },
//                 y: {
//                     beginAtZero: true, // y축 0부터 시작
//                     grid: {
//                         display: false // y축 격자선 숨기기
//                     }
//                 }
//             },
//             plugins: {
//                 legend: {
//                     display: true // 범례 표시
//                 }
//             }
//         },
//         plugins: [{
//             // 플러그인 작성
//             id: 'iconPlugin',
//             afterDraw: chart => {
//                 const ctx = chart.ctx;
//                 chart.data.datasets.forEach((dataset, datasetIndex) => {
//                     const meta = chart.getDatasetMeta(datasetIndex);
//                     meta.data.forEach((bar, index) => {
//                         const model = bar.$context.raw;
//                         const icon = icons[labels[index]];
//                         if (icon) {
//                             const x = bar.x - 7; // 막대 중심으로 x좌표 조정
//                             const y = bar.y - 20; // 막대 끝 위로 y좌표 조정
//                             ctx.drawImage(icon, x, y, 15, 15); // 이미지 크기 조정
//                         }
//                     });
//                 });
//             }
//         }]
//     });

//     myChart.data.datasets.forEach(dataset => {
//         dataset.barThickness = 30; // 막대의 두께를 픽셀 단위로 설정
//     });

//     myChart.update();
// });
