# my_component
+ 간단한 컴포넌트 테스트 페이지 입니다
+ 로그인은 Firebase를 사용했습니다. 
+ firebase Config는 각자 작성하시기 바랍니다.

## 개략적인 설명
+ 모든 이벤트의 처리는 대부분 window.postMessage({msg:message, data:data}, location.origin); 로 처리하고
+ 각 컨포넌트는 메세지를 읽어서 대처합니다. 
 - (firebase-login 컨포넌트에서 로그인 상태를 알려줍니다 : _is_login_status())
 - 로그인 되었는지 (post_message("status_login", null);)
 - 로그아웃 되었는지 post_message("status_logout", null);
 - 메세지로 각 컨포넌트에 전달합니다.
