function onClickHref(event) {    
    let url = event.currentTarget.getAttribute("href");
    location.href = url;    
}


//createPageTd(...) 함수는 <td>...</td> 태그를 생성해서 리턴한다.
// 페이지 번호로 넘어가기 위한 a 링크를 포함하는 td 태그를 생성해서 리턴한다.
function createPageTd(no, label, url) {
    // no:    페이지 번호
    // label: a 태그 사이에 출력할 문자열
    // url:   현재 url. 이 url에서 pg query string 값이 no 값으로 치환되어야 한다.

    let td = document.createElement("td"); // td 태그 생성
    let a = document.createElement("a");   // a 태그 생성
    a.appendChild(document.createTextNode(label)); // a 태그의 텍스트에 label 문자열 삽입
    a.setAttribute("href", url.replace(/pg=[0-9]+/, "pg=" + no));
       // url에서 /pg=[0-9]+/ 정규식 패턴에 일치하는 부분을 "pg=" + no 문자열로 치환한다.
       // 그렇게 만들어진 url을 a 태그의 href 속성값으로 한다.
    td.appendChild(a); // a 태그를 td 안에 넣는다.
	
	console.log(td);
	
    return td;          // td 태그  <td class="active"><a href="http://localhost:8088/student/list?pg=1">1</a></td> 리턴
}

/*
pagination() 함수는 
  위의 <table>...</table> 태그를 생성하여,
  현재 웹페이지에서 <div class="pagination"></div> 태그 사이에 삽입한다.
 
pagination() 함수가 위와 같은 태그들을 생성하려면 다음과 같은 정보가 필요하다.
  - 전체 레코드 수 (recordCount)
  - 페이지당 레코드 수 (sz)
  - 현재 페이지 번호 (pg)

  웹브라우저 창에서 실행되는pagination() 자바스크립트 함수에서 위 값들을 읽을 수 있도록,
    <div class="pagination"
         data-record-count="165"
         data-page-size="15" 
         data-current-page="4"></div>  

    위와 같은 형태의 <div class="pagination"> 태그를
    thymeleaf student/list.html 뷰는 출력한다.
*/

// 페이지 번호 목록 table 태그를 생성해서 
// <div class="pagination"> 태그 아래에 삽입하는 함수
function pagination() {
/*	
코드 분석
window.onload = pagination; 이 부분은 onload 이벤트를 사용하여 전체 문서가 로드된 후 pagination() 함수가 실행되도록 설정한 것입니다.
즉, HTML 문서의 DOM과 CSS, JavaScript 등 모든 외부 리소스가 로드된 뒤에 pagination()이 실행됩니다.

HTML 구조 분석

<div class="pagination"> 태그는 이미 DOM에 존재합니다.
pagination() 함수는 이 태그를 DOM에서 선택하고, 자바스크립트를 통해 동적으로 <table> 태그와 페이지 링크를 추가합니다.
실행 흐름

브라우저는 먼저 HTML 문서를 파싱해 DOM을 생성합니다.
모든 CSS와 JavaScript가 로드된 후, window.onload 이벤트로 pagination()이 실행됩니다.
이 시점에서 DOM이 완전히 생성되었기 때문에 getElementsByClassName("pagination")[0]으로 해당 DOM 요소를 문제없이 가져올 수 있습니다.	

<div class="pagination"
     data-record-count="164"
     data-page-size="15" 
     data-current-page="1"></div>  
*/
    let div = document.getElementsByClassName("pagination")[0];
      // 페이지 번호 태그들을 생성해서 삽입할 부모 태그를 찾는다.
      // 이 태그는 <div class="pagination"> 태그이다.
      // 이 태그에는 data-record-count, data-page-size, data-current-page 속성값이 있어야 한다.
      // 이 속성 값들은 각각 전체 레코드 수, 페이지 당 레코드 수, 현재 페이지 번호 이다.

    if (div == undefined) return;
      // 현재 웹페이지에 <div class="pagination"> 태그가 없다면, 그냥 리턴한다.
/*
	  <div class="pagination"
	       data-record-count="164"
	       data-page-size="15" 
	       data-current-page="1"></div>
*/		   
		     
    let recordCount = parseInt(div.getAttribute("data-record-count"));
      // 전체 레코드 수 속성값을 읽는다    164
      
    let pageSize = parseInt(div.getAttribute("data-page-size"));
      // 페이지 당 레코드 수 속성값을 읽는다   15

    let currentPage = parseInt(div.getAttribute("data-current-page"));
      // 현재 페이지 번호 속성값을 읽는다   1

    let pageCount = Math.ceil(recordCount / pageSize);
      // 전체 페이지 수를 계산한다.
      // 전체 페이지 수는 (전체_레코드_수 / 페이지_당_레코드_수)의 올림 이어야 한다.
	  //              (164         /  15 ) = 10.93333333333333의 올림처리   11
	  //               
   
//  if (1           >        11) currentPage = 11;  
    if (currentPage > pageCount) currentPage = pageCount;
       // 현재 페이지 번호는 전체 페이지 수를 초과할 수 없다

    let url = location.href;
       // 웹브라우저 주소칸의 현재 url http://localhost:8088/student/list 을 구한다.

    if (url.indexOf("pg=") < 0)
        url = url + (url.indexOf("?") < 0 ? "?pg=1" : "&pg=1");
       // url에 "pg=" 문자열이 들어있지 않으면
       // "?pg=1" 이나 "&pg=1 문자열 중의 하나를 뒤에 붙인다.
       // url에 이미 "?" 문자가 있다면 "&pg=1" 문자열을, 그렇지 않다면 "?pg=1" 문자열을 붙인다.

	//현재 let url변수에 만들어진 요청주소 -> http://localhost:8088/student/list?pg=1   
	   
	
    let table = document.createElement("table"); // table 태그 생성
    let tr = document.createElement("tr");        // tr 태그 생성

	
	
	
	
	/*
	`baseNo 계산은 페이지네이션(페이지 번호 표시)를 **10개씩 묶어서 출력하기 위해 시작 번호를 결정**하는 논리입니다. 
	---

	### **목적**
	- 페이지 번호를 그룹화하여 한 번에 10개의 번호씩 표시하려고 합니다.
	- 예를 들어:
	  - 페이지 1~10: 시작 번호는 `0`.
	  - 페이지 11~20: 시작 번호는 `10`.
	  - 페이지 21~30: 시작 번호는 `20`.
	  
	### **식 분석**

	```javascript
	let baseNo = Math.floor((currentPage - 1) / 10) * 10;
	```

	#### 1. `(currentPage - 1)`
	- 현재 페이지 번호에서 `1`을 뺍니다.
	- 이유: 페이지 번호를 **0 기반으로 변환**하여 계산하기 위해서입니다.
	  - 예: `currentPage = 1`이면, `1 - 1 = 0`로 변환됩니다.
	  - 예: `currentPage = 11`이면, `11 - 1 = 10`로 변환됩니다.

	---

	#### 2. `/ 10`
	- 위에서 구한 결과를 `10`으로 나눕니다.
	- 이유: 페이지를 10개 단위로 묶기 위해 **그룹 번호**를 계산합니다.
	  - 예: `currentPage - 1 = 0` → `0 / 10 = 0`.
	  - 예: `currentPage - 1 = 10` → `10 / 10 = 1`.

	---

	#### 3. `Math.floor(...)`
	- 계산된 그룹 번호를 **내림 처리**합니다.
	- 이유: 항상 현재 페이지가 속한 그룹의 시작 번호를 찾기 위해서입니다.
	  - 예: `(currentPage - 1) / 10 = 1.5`일 때, `Math.floor(1.5) = 1`.

	---

	#### 4. `* 10`
	- 내림 처리된 그룹 번호에 다시 `10`을 곱해, **그룹의 시작 번호**를 구합니다.
	- 이유: 10개 단위의 그룹 번호에서 실제 페이지 번호의 시작을 결정하기 위함입니다.
	  - 예: `Math.floor(1.5) = 1` → `1 * 10 = 10` (11~20 그룹의 시작).

	---

	### **결과 예시**

	- `currentPage = 1`
	  ```javascript
	  baseNo = Math.floor((1 - 1) / 10) * 10;
	  baseNo = Math.floor(0 / 10) * 10;
	  baseNo = 0; // 1~10 그룹의 시작 번호는 0
	  ```

	- `currentPage = 11`
	  ```javascript
	  baseNo = Math.floor((11 - 1) / 10) * 10;
	  baseNo = Math.floor(10 / 10) * 10;
	  baseNo = 10; // 11~20 그룹의 시작 번호는 10
	  ```

	- `currentPage = 25`
	  ```javascript
	  baseNo = Math.floor((25 - 1) / 10) * 10;
	  baseNo = Math.floor(24 / 10) * 10;
	  baseNo = 20; // 21~30 그룹의 시작 번호는 20
	  ```

	---

	### **요약**
	- 이 식은 페이지를 10개씩 묶어서 표시할 때, **현재 페이지가 속한 그룹의 시작 번호(baseNo)를 계산**하기 위한 것입니다.
	- 계산 과정은 0 기반 인덱스로 변환 → 10 단위 그룹화 → 그룹 시작 번호를 구하는 방식으로 이루어져 있습니다.
	
	*/
    let baseNo = Math.floor((currentPage - 1) / 10) * 10;
          // 페이지 번호를 10개씩 출력할 때,	예) 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
          // 그 시작이 되는 번호를 구한다	예) 위의 10개 번호라면 baseNo는 20

    if (baseNo > 0) tr.appendChild(createPageTd(baseNo, "<", url));
          // baseNo가 0 보다 크다면, 즉 10, 20, 30 ... 중의 하나라면,
          // 이전 페이지로 넘어갈 수 있다.
          // 이전 페이지로 넘어가기 위한 링크를 포함하는 td 태그를 생성해서 tr 태그에 넣는다.

    // baseNo + 1 부터 10 개의 페이지로 넘어가기 위한 태그들을 생성해서 tr 태그에 넣는다.
    for (let i = 1; i <= 10; ++i) {

        let no = baseNo + i;
        if (no > pageCount) break;
        let td = createPageTd(no, String(no), url)
        if (no == currentPage) td.classList.add("active");
               // 현재 페이지 번호와 일치하는 td 태그를 <td class="active"> 형태로
        tr.appendChild(td);   
		/*
		<tr>
			<td class="active"><a href="http://localhost:8088/student/list?pg=1">1</a></td>
			<td><a href="http://localhost:8088/student/list?pg=2">2</a></td>
			<td><a href="http://localhost:8088/student/list?pg=3">3</a></td>
			<td><a href="http://localhost:8088/student/list?pg=4">4</a></td>
			<td><a href="http://localhost:8088/student/list?pg=5">5</a></td>
			<td><a href="http://localhost:8088/student/list?pg=6">6</a></td>
			<td><a href="http://localhost:8088/student/list?pg=7">7</a></td>
			<td><a href="http://localhost:8088/student/list?pg=8">8</a></td>
			<td><a href="http://localhost:8088/student/list?pg=9">9</a></td>
			<td><a href="http://localhost:8088/student/list?pg=10">10</a></td>
			<td><a href="http://localhost:8088/student/list?pg=11">&gt;</a></td>
		</tr>
		*/
    }

// baseNo + 11 이 전체 페이지 수 보다 작거나 같다면,
// 10 개의 페이지 번호 다음으로 넘어가기 위한 링크를 포함하는 td 태그를 생성해서 tr 태그에 넣는다.
    let no = baseNo + 11;
    if (no <= pageCount) tr.appendChild(createPageTd(no, ">", url));

    table.appendChild(tr);  // table 태그 아래에 tr 태그 추가
    div.appendChild(table); // 페이지 번호 목록 table 태그를
                               // <div class="pagination"> 태그에 넣는다.
     console.log(div);
	 /*
	 <div class="pagination" data-record-count="164" data-page-size="15" data-current-page="1">
	 	<table>
			<tr>
				<td class="active"><a href="http://localhost:8088/student/list?pg=1">1</a></td>
				<td><a href="http://localhost:8088/student/list?pg=2">2</a></td>
				<td><a href="http://localhost:8088/student/list?pg=3">3</a></td>
				<td><a href="http://localhost:8088/student/list?pg=4">4</a></td>
				<td><a href="http://localhost:8088/student/list?pg=5">5</a></td>
				<td><a href="http://localhost:8088/student/list?pg=6">6</a></td>
				<td><a href="http://localhost:8088/student/list?pg=7">7</a></td>
				<td><a href="http://localhost:8088/student/list?pg=8">8</a></td>
				<td><a href="http://localhost:8088/student/list?pg=9">9</a></td>
				<td><a href="http://localhost:8088/student/list?pg=10">10</a></td>
				<td><a href="http://localhost:8088/student/list?pg=11">&gt;</a></td>
			</tr>
		</table>
	</div>
	 */
}

//현재 웹페이지 내용 전체가 웹브라우저 창에 로드된 후, pagination() 함수를 실행한다.
window.onload = pagination;

