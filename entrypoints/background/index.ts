import { sendToContent } from "@/utils/messaging";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(
    async ({ message, tabId }: { message: string; tabId?: number }) => {
      const response = await sendToContent({ message, tabId });
      browser.tabs.sendMessage(tabId || 0, { message: response });
    }
  );
});
