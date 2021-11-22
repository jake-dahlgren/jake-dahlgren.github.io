document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('redir-chrome').addEventListener('click', function() {
        chrome.tabs.update({ url: 'chrome://chrome-urls' });
    });
});