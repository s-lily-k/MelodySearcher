// タブボタンにクリックイベントを追加
switchingTabs.forEach(tabButton => {
    tabButton.addEventListener('click', () => {
        const targetTab = tabButton.getAttribute('data-switch-tab');
        switchContents(targetTab);

        // クリックされたタブボタンに.is-currentクラスを付与
        switchingTabs.forEach(tab => {
            if (tab === tabButton) {
                tab.classList.add('is-current');
            } else {
                tab.classList.remove('is-current');
            }
        });
    });
});

// コンテンツの切り替えを行う関数
function switchContents(targetTab) {
    switchingContents.forEach(switchingContent => {
        if (switchingContent.getAttribute('data-switch-contents') === targetTab) {
            switchingContent.classList.add('is-open');
        } else {
            switchingContent.classList.remove('is-open');
        }
    });
}
