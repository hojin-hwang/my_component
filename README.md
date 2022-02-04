# Name Card component
+ 간단한 컴포넌트 테스트 페이지 입니다
+ 로그인은 Firebase를 사용했습니다. 
    + firebase Config는 각자 작성하시기 바랍니다.
+ DB는 web sql을 사용했습니다.
    + 따라서 크롬브라우저에서 사용하기를 추천합니다.
+ profile img는 랜덤이미지를 사용합니다.
    + file upload기능은 없습니다.

## 개략적인 설명
+ 모든 이벤트의 처리는 대부분 window.postMessage({msg:message, data:data}, location.origin); 로 처리하고
+ 각 컨포넌트는 메세지를 읽어서 대처합니다. 
 - (firebase-login 컨포넌트에서 로그인 상태를 알려줍니다 : _is_login_status())
 - 로그인 되었는지 (post_message("status_login", null);)
 - 로그아웃 되었는지 post_message("status_logout", null);
 - 메세지로 각 컨포넌트에 전달합니다.

## Web SQL사용 : 데이터 저장을 위해서 
+ web-sql.js는 데이블에 데이터 저장, 삭제, 수정

## ramdom Image 사용
+ https://unsplash.com/ 가입후 
+ https://unsplash.com/developers -> Your Apps에서 Demo App추가
    + Access Key값을 구한다

## Test
+ VS code -> Extension -> Live Server install
+ index.html -> 오른쪽 마우스 -> Open with Live Sever 
<img src="https://github.com/hojin-hwang/my_component/blob/main/assets/imgs/screen_shot.png" width="400px"  title="Screen shot"/>
+ 위 전화번호, 이메일은 Fake입니다.

### nav_bar tag 내에 template code 삽입
