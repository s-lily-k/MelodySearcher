// HTML要素を取得
const switchingTabs = document.querySelectorAll('.js-switchingTab');
const switchingSelect = document.querySelector('.js-switchingSelect');
const switchingContents = document.querySelectorAll('.js-switchingContents');

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

        // 同じdata-switch-tab属性の値を持つ他のタブボタンにも.is-currentクラスを追加
        switchingTabs.forEach(otherTabButton => {
            if (otherTabButton !== tabButton && otherTabButton.getAttribute('data-switch-tab') === targetTab) {
                otherTabButton.classList.add('is-current');
            }
        });

        // セレクトボックスの選択肢にも.is-currentクラスを付与
        const selectOptions = switchingSelect.options;
        for (let i = 0; i < selectOptions.length; i++) {
            const option = selectOptions[i];
            if (option.value === targetTab) {
                option.classList.add('is-current');
                option.selected = true;
            } else {
                option.classList.remove('is-current');
                option.selected = false;
            }
        }
    });
});

// セレクトボックスにイベントを追加
switchingSelect.addEventListener('change', () => {
    const targetTab = switchingSelect.value;
    switchContents(targetTab);

    // セレクトボックスの選択肢に.is-currentクラスを付与
    const selectOptions = switchingSelect.options;
    for (let i = 0; i < selectOptions.length; i++) {
        const option = selectOptions[i];
        if (option.value === targetTab) {
            option.classList.add('is-current');
            option.selected = true;
        } else {
            option.classList.remove('is-current');
            option.selected = false;
        }
    }

    // クリックされたタブボタンにも.is-currentクラスを付与
    switchingTabs.forEach(tabButton => {
        if (tabButton.getAttribute('data-switch-tab') === targetTab) {
            tabButton.classList.add('is-current');
        } else {
            tabButton.classList.remove('is-current');
        }
    });

    // 同じdata-switch-tab属性の値を持つ他のタブボタンにも.is-currentクラスを追加
    switchingTabs.forEach(otherTabButton => {
        if (otherTabButton !== tabButton && otherTabButton.getAttribute('data-switch-tab') === targetTab) {
            otherTabButton.classList.add('is-current');
        }
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