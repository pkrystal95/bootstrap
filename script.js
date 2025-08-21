document.addEventListener("DOMContentLoaded", () => {
  // 🔹 탭 닫기 기능
  document.querySelectorAll(".tab-close").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // 탭 클릭 이벤트 막기
      const tab = e.target.closest(".nav-link");
      const tabId = tab.getAttribute("href"); // 연결된 콘텐츠 ID
      const li = tab.parentElement;

      // 탭 제거
      li.remove();

      // 콘텐츠 제거
      if (tabId) {
        const pane = document.querySelector(tabId);
        if (pane) pane.remove();
      }

      // 다른 탭 하나 자동 활성화
      const firstTab = document.querySelector(
        ".editor-tabs .nav-link:not(.active)"
      );
      if (firstTab) {
        new bootstrap.Tab(firstTab).show();
      }
    });
  });

  // 🔹 드래그 앤 드롭으로 탭 순서 변경
  const tabsContainer = document.querySelector(".editor-tabs");

  let draggedItem = null;

  tabsContainer.querySelectorAll(".nav-item").forEach((item) => {
    item.setAttribute("draggable", true);

    item.addEventListener("dragstart", (e) => {
      draggedItem = item;
      setTimeout(() => item.classList.add("dragging"), 0);
    });

    item.addEventListener("dragend", () => {
      draggedItem.classList.remove("dragging");
      draggedItem = null;
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(tabsContainer, e.clientX);
      if (afterElement == null) {
        tabsContainer.appendChild(draggedItem);
      } else {
        tabsContainer.insertBefore(draggedItem, afterElement);
      }
    });
  });

  // 위치 계산 함수
  function getDragAfterElement(container, x) {
    const draggableElements = [
      ...container.querySelectorAll(".nav-item:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
});
