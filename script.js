document.addEventListener("DOMContentLoaded", () => {
    // 요소 가져오기
    const coverImg = document.getElementById("cover-img");
    const mainTitle = document.getElementById("book-title-main");
    const authorText = document.getElementById("book-author");
    const topBarTitle = document.getElementById("top-bar-title");
    const tocList = document.getElementById("toc-list");
    const bookContent = document.getElementById("book-content");
    
    // 모달, 토스트 관련 요소 (기존과 동일)
    const modalOverlay = document.getElementById("modal-overlay");
    const modalTitle = document.getElementById("modal-title");
    const modalText = document.getElementById("modal-text");
    const closeModalBtn = document.getElementById("btn-close-modal");
    const toast = document.getElementById("toast");
    const saveBtn = document.getElementById("btn-save-bookmark");

    // 데이터 불러오기
    fetch('content.json')
        .then(res => res.json())
        .then(data => {
            renderCover(data); // 표지 그리기
            renderTOC(data);   // 목차 그리기
            renderBody(data);  // 본문 그리기
            setupFootnotes();  // 주석 연결
            checkBookmark();   // 북마크 확인
        })
        .catch(err => console.error(err));

    // 1. 표지 정보 렌더링
    function renderCover(data) {
        document.title = data.bookTitle;
        topBarTitle.textContent = data.bookTitle;
        coverImg.src = data.coverImage;
        mainTitle.textContent = data.bookTitle;
        authorText.textContent = data.author;
    }

    // 2. 목차(TOC) 생성 함수
    function renderTOC(data) {
        data.chapters.forEach(chapter => {
            const li = document.createElement("li");
            li.className = "toc-item";
            li.textContent = chapter.title;

            if (chapter.isTranslated) {
                // 번역 완료된 경우: 클릭 시 해당 ID로 스크롤 이동
                li.addEventListener("click", () => {
                    const targetSection = document.getElementById(chapter.id);
                    if (targetSection) {
                        // 스무스 스크롤 이동
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            } else {
                // 번역 미완료인 경우: 스타일 변경 및 알림
                li.classList.add("not-translated");
                li.addEventListener("click", () => {
                    showToast("🚧 열심히 번역 중인 파트입니다!");
                });
            }

            tocList.appendChild(li);
        });
    }

    // 3. 본문 렌더링 (번역된 챕터만 표시)
    function renderBody(data) {
        data.chapters.forEach(chapter => {
            // 번역된 챕터만 본문에 추가
            if (chapter.isTranslated) {
                const article = document.createElement("article");
                article.className = "chapter";
                article.id = chapter.id; // 목차 이동을 위한 ID 설정

                const h2 = document.createElement("h2");
                h2.textContent = chapter.title;
                article.appendChild(h2);

                chapter.paragraphs.forEach(text => {
                    const p = document.createElement("p");
                    p.innerHTML = text;
                    article.appendChild(p);
                });

                bookContent.appendChild(article);
            }
        });
    }

    // 4. 주석 설정 (기존과 동일)
    function setupFootnotes() {
        document.querySelectorAll(".footnote-word").forEach(word => {
            word.addEventListener("click", () => {
                modalTitle.textContent = word.innerText;
                modalText.innerHTML = word.getAttribute("data-note");
                modalOverlay.classList.remove("hidden");
                document.body.style.overflow = "hidden";
            });
        });
    }

    // 모달 닫기
    const closeModal = () => {
        modalOverlay.classList.add("hidden");
        document.body.style.overflow = "auto";
    };
    closeModalBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if(e.target === modalOverlay) closeModal();
    });

});