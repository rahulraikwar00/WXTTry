export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    browser.runtime.onMessage.addListener((message) => {
      console.log("Message received from background script:", message.message);
      return true;
    });
  },
});
