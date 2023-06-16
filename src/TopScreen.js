export default function TopScreen({ $target, createTaskButtonClick, showRankingButtonClick }) {
    const $topScreen = document.createElement('div');

    $topScreen.className = "topScreen";

    $target.appendChild($topScreen);

    const $createTaskButton = document.createElement('button');
    $createTaskButton.textContent = "Task 추가"

    const $showRankingButton = document.createElement('button');
    $showRankingButton.textContent = "랭킹 보기"

    $topScreen.appendChild($createTaskButton);

    $topScreen.appendChild($showRankingButton);

    $createTaskButton.addEventListener('click', () => {
        createTaskButtonClick();
    })

    $showRankingButton.addEventListener('click', () => {
        showRankingButtonClick();
    })
}