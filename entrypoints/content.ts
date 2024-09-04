import { sendToBackground } from "@/utils/messaging";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    sendToBackground({ message: "Hello from content script!" });
  },
});
