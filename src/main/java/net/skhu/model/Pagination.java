package net.skhu.model;

import lombok.Data;

@Data
public class Pagination {
    int pg = 1;        // 현재 페이지 번호
    int sz = 15;       // 페이지 당 레코드 수
    int recordCount;   // 전체 레코드 수

    public int getFirstRecordIndex() {
        return (pg - 1) * sz;
    }

    public String getQueryString() {
        return String.format("pg=%d&sz=%d", pg, sz);
    }
}
/*
페이지 단위 조회 기능을 구현하기 위해서,
액션 메소드와 뷰 사이에 전달되어야 하는 정보를 담은 객체이다.

pg 속성과 sz 속성
pg 속성: 현재 페이지 번호 (1부터 시작함)
sz 속성: 페이지 크기 (한 페이지의 레코드 수)
recordCount 속성: 전체 레코드 수
                  페이지 하단에 페이지 번호 목록을 출력하려면, 레코드 수를 알아야 함.

http://localhost:8088/student/list?pg=3&sz=15
   위의 URL을 서버에 요청했을 때,
   query string 값들은 request parameter가 되어 서버에 전송된다.
   이 request parameter 값은 액션 메소드의 파라미터 Pagination 객체에 채워진다.

getFirstRecordIndex 메소드
pg 번째 페이지의 첫 레코드의 인덱스를 계산하는 메소드 이다.
예를 들어 페이지 당 레코드 수 즉 sz 값이 15일 때,
1번 페이지의 첫 레코드의 인덱스는 0,
2번 페이지의 첫 레코드의 인덱스는 15,
3번 페이지의 첫 레코드의 인덱스는 30 이다.
이 값을 계산하는 메소드이다.

 
getQueryString 메소드
"pg=%d&sz=%d" 형태의 URL query string을 출력하기 위한 메소드이다.
뷰에서 이 메소드의 리턴값을 출력하려면 ${pagination.queryString} 이렇게 하면 된다.

예를 pagination 객체의 pg 속성값이 3이고, sz 속성값이 15이면,
  ${pagination.queryString} 소스코드는 
  pg=3&sz=15 문자열을 출력한다.


서버에서 뷰를 출력할 때,
   학생 등록 버튼은 a 태그는 다음과 같이 출력되어야 한다.
     <a href="create?pg=3&sz=15">
   위와 같이 출력하기 위한 소스 코드는 다음과 같다.
     <a th:href="'create?' + ${pagination.queryString}">

   학생 목록 페이지로 나가기 a 태그는 다음과 같이 출력되어야 한다.
     <a href="list?pg=3&sz=15">
   위와 같이 출력하기 위한 소스 코드는 다음과 같다.
     <a th:href="'list?' + ${pagination.queryString}">

   학생 수정 페이지로 넘어가기 위한 a 태그는 다음과 같이 출력되어야 한다.
     <a href="edit?id=5&pg=3&sz=15">
  위와 같이 출력하기 위한 소스 코드는 다음과 같다.
     <a th:href="'edit?id=' + ${st.id} + '&' + ${pagination.queryString}">


목록으로 되돌아가기 위한 redirect URL은 다음과 같아야 한다.
    return "redirect:list?pg=3&sz=15";
그때 그때 달라지는 페이지 번호를 위와 같이 3으로 고정할 수는 없으니, 다음과 같이 구현해야 한다.
    return "redirect:list?" + pagination.getQueryString();
    html 부분과 java 소스 코드가 다르게 구현되는 점에 주의하자.
*/