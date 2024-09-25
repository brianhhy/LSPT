# 개발 목적

IOT 기반 기술을 이용하여 환자 상태 정보를 실시간으로 파악하고 메타버스 내에서 제공하는 다양한 서비스를 활용할 수 있도록 한다.

---

## 서비스 구성도(서비스 시나리오)

![서비스 구성도](https://prod-files-secure.s3.us-west-2.amazonaws.com/e999e7d5-ddb5-48d8-91db-be43426e0c00/fc1c7d92-0724-4f15-bf65-6671fd2e2b1f/image.png)

- **백엔드**
  - 스마트 워치 API를 활용한 사용자 데이터 수집
  - ChatGPT를 활용한 24시간 건강 상담 서비스 구현
  - 비대면 의료 상담 서비스 구현
  - 소켓 통신을 이용한 멀티플레이 메타버스 서버 구현

- **프론트 엔드**
  - 회원 가입 화면 구현
  - Babylon.js를 활용한 메타버스 구현
  - 리엑트를 활용한 반응형 웹 구현

---

## 서비스 흐름도

![서비스 흐름도](https://prod-files-secure.s3.us-west-2.amazonaws.com/e999e7d5-ddb5-48d8-91db-be43426e0c00/fd17f4c2-bfe6-4e95-9122-1b8761ee5e47/image.png)

### 사용자 건강 정보 수집 및 모니터링 흐름

1. 사용자(건강 모니터링 대상자)가 착용한 스마트 워치를 통해 현재 신체 정보 수집
2. 웹 서버의 데이터베이스로 사용자의 신체 정보 전송
3. 메타버스를 통해 사용자의 현재 신체 정보를 시각적으로 표현
4. 관리자(모니터링 담당자)가 모니터링 대상자들의 상태를 간단하게 확인 가능

### 건강 정보 상담 및 비대면 진료

- **비대면 진료**: 의료 종사자와 연계하여 메타버스 상에서 비대면 진료 및 상담 제공. 의료 종사자가 부재 중이거나 특이 상황일 경우 AI 챗봇(ChatGPT)을 통해 24시간 건강 상담 진행.
  
- **메타버스 상호작용**: 메타버스를 활용하여 사용자 간의 다양한 상호작용 가능.

---

## 기술 스택

- **프론트 엔드**: React, Tailwindcss
- **백엔드**: Spring
- **메타버스**: Babylon.js, Blender
- **API**: Google Fitbit API, Chat GPT API

---

## UI/UX 설명

### Home 화면

- 서비스가 제공하는 기능들을 요약해서 보여준다.
- `Features`를 통해 서비스 소개 화면으로, `Login` 버튼을 통해 메타버스 화면으로 이동할 수 있다.

### Features 화면

- 서비스를 구체적으로 소개하는 화면이다.
- 팀원 소개, 기술 스택 소개, 기능 소개로 이루어져 있다.

### Login 화면

- 메타버스로 로그인하기 위한 화면이다.
- 일반 회원과 관리자 회원을 선택한다.
  - 일반 회원: Fitbit 연동을 통해 메타버스로 진입.
  - 관리자 회원: 자체 서비스 회원가입 및 로그인을 통해 관리자 페이지로 이동.

### 메타버스 화면

- 일반 회원으로 Fitbit 연동에 성공했을 때 볼 수 있는 메타버스 화면.
- 좌측에는 IoT 기술로 받아온 사용자의 신체정보 출력. AI 채팅, 관리자 채팅 기능으로 이동 가능.
- 화면 중앙에는 메타버스가 존재하며, 다른 사용자와 상호작용 가능.
- 우측에는 실시간 채팅 시스템이 구현되어 있어 다른 사용자와 채팅 가능.

### 관리자 화면

- 관리자 회원으로 로그인했을 때 볼 수 있는 관리자 화면.
- 연결된 사용자(환자)에게 이상이 생겼을 때 경고 메시지가 출력됨.
- 연결된 사용자들을 한눈에 볼 수 있으며, `채팅하기` 버튼을 통해 바로 채팅 가능.

### AI 채팅 화면

- 메타버스 내 병원 건물에 들어갔을 때 나오는 화면.
- IoT 기술로 받아온 신체 정보와 실시간으로 수집된 심박수, 호흡률, 걸음걸이 등을 AI에게 전송하여 분석 및 피드백 제공.
- 특정 날짜를 지정해 지난 신체정보도 불러올 수 있음.

### 관리자 채팅 서비스

- 메타버스 내 상담소 건물에 들어갔을 때 나오는 화면.
- 사용자(환자)와 관리자(의료 종사자)가 실시간으로 채팅할 수 있는 공간.
- 환자의 신체지표가 정상 범위를 벗어났을 경우 관리자에게 알림이 나타나며, 바로 소통 가능.

---

## 실제 소프트웨어 화면

### Home 화면

![Home 화면](https://prod-files-secure.s3.us-west-2.amazonaws.com/e999e7d5-ddb5-48d8-91db-be43426e0c00/bbee2cd2-a600-49a0-aa89-3d61e4542288/KakaoTalk_20240925_192257821.png)

### Features 화면

![Features 화면](https://prod-files-secure.s3.us-west-2.amazonaws.com/e999e7d5-ddb5-48d8-91db-be43426e0c00/f0351099-2c29-4ea7-877f-68227f6a877a/KakaoTalk_20240925_192310053.png)

### Login 화면

![Login 화면](https://prod-files-secure.s3.us-west-2.amazonaws.com/e999e7d5-ddb5-48d8-91db-be43426e0c00/e601cf20-0d2f-4589-b953-cc2b9cb16e9a/KakaoTalk_20240925_192320400.png)

### 메타버스 화면

![메타버스 화면](https://prod-files-secure.s3.us-west-2.amazonaws.com/e999e7d5-ddb5-48d8-91db-be43426e0c00/76530ca9-4237-44af-a39f-bc2ed5e1b582/KakaoTalk_20240925_192424624.png)

### AI 채팅 화면

![AI 채팅 화면](https://prod-files-secure.s3.us-west-2.amazonaws.com/e999e7d5-ddb5-48d8-91db-be43426e0c00/b639e95e-5733-4a55-baed-102bd2ad9c94/KakaoTalk_20240925_192458409.png)

### 관리자 채팅 서비스

![관리자 채팅 서비스](https://prod-files-secure.s3.us-west-2.amazonaws.com/e999e7d5-ddb5-48d8-91db-be43426e0c00/88e0630b-cc9b-4531-8daa-454f495b0258/KakaoTalk_20240925_192504885.png)

### 관리자 화면

![관리자 화면](https://prod-files-secure.s3.us-west-2.amazonaws.com/e999e7d5-ddb5-48d8-91db-be43426e0c00/877ff753-9f02-483e-a506-183d8ac8e59b/KakaoTalk_20240925_192653269.png)

---

## 영상

[YouTube 영상](https://www.youtube.com/watch?v=4p9idJ8D2C8)
