export default defineBackground(() => {
  browser.runtime.onMessage.addListener(
    (
      request: { messages: string }, // Assuming the request has a 'message' property
      sender,
      sendResponse: (response?: { message: string }) => void
    ) => {
      const response = { message: "Hello from background!" };

      console.log(request.messages);

      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0]?.id) {
          browser.tabs.sendMessage(tabs[0].id, {
            message: request.messages, // Assuming the message is directly on the request object
          });
        }
      });

      sendResponse(response); // Send the response back to the sender

      return true; // Indicate that the response is sent asynchronously
    }
  );
});
