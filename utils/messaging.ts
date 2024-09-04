interface MessageProps {
  message: string;
  tabId?: number;
}

// ############################################################################
// Define functions to send messages to content script and background script
// ############################################################################
const sendMessageToTab = async (
  tabId: number,
  message: string
): Promise<any> => {
  try {
    return await browser.tabs.sendMessage(tabId, { message });
  } catch (error) {
    console.warn(`Error sending message to tab ${tabId}:`, error);
    throw error;
  }
};

const getActiveTabId = async (): Promise<number | undefined> => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.id;
};

// Send message to content script with options to send to current tab or all tabs
export const sendToContent = async (payload: MessageProps): Promise<any> => {
  const tabId = payload.tabId || (await getActiveTabId());

  if (tabId) {
    return sendMessageToTab(tabId, payload.message);
  } else {
    throw new Error("No active tab found to send the message.");
  }
};

// Send message to background script
export const sendToBackground = async (payload: MessageProps): Promise<any> => {
  try {
    return await browser.runtime.sendMessage({ message: payload.message });
  } catch (error) {
    console.warn("Error sending message to the background script:", error);
    throw error;
  }
};

// ############################################################################
// Define a universal message properties interface
// ############################################################################
interface UniversalMessageProps {
  target: "background" | "content" | "popup"; // Possible targets
  message: string; // The message to be sent
  tabId?: number; // Optional tab ID for content messages
  broadcast?: boolean; // Optional broadcast flag
}

/**
 * Sends a universal message to the specified target (background, content, or popup).
 * Can also broadcast the message to all tabs if specified.
 *
 * @param payload - The message payload containing target, message, tabId, and broadcast options.
 * @returns A promise that resolves with the response from the target.
 */
export const sendUniversal = async (
  payload: UniversalMessageProps
): Promise<any> => {
  try {
    switch (payload.target) {
      case "background":
        // Send message to the background script
        return await browser.runtime.sendMessage({ message: payload.message });

      case "content":
        // Send message to a specific content script or broadcast to all tabs
        if (payload.broadcast) {
          // Broadcast the message to all tabs
          const tabs = await browser.tabs.query({});
          const promises = tabs.map((tab) =>
            tab.id
              ? browser.tabs.sendMessage(tab.id, { message: payload.message })
              : null
          );
          return await Promise.all(promises);
        } else {
          // Send message to a specific tab
          const tabId = payload.tabId || (await getActiveTabId());
          if (tabId) {
            return await browser.tabs.sendMessage(tabId, {
              message: payload.message,
            });
          } else {
            throw new Error("No active tab found to send the message.");
          }
        }

      case "popup":
        // Handle sending messages to the popup
        return await browser.runtime.sendMessage({ message: payload.message });

      default:
        throw new Error(`Invalid target: ${payload.target}`);
    }
  } catch (error) {
    console.error(`Error sending message to the ${payload.target}:`, error);
    throw error;
  }
};

/**
 * Retrieves the ID of the currently active tab in the current window.
 *
 * @returns A promise that resolves with the ID of the active tab, or undefined if no active tab is found.
 */
