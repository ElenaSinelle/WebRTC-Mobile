# WebRTC Conference – P2P Video Chat Application

A serverless video conferencing application built with **Next.js**, **Trystero**, and **WebRTC**. It enables direct peer-to-peer encrypted video calls. No central signaling server, user accounts, or data storage required.

**Live Demo:** [https://web-rtc-app-ashy.vercel.app/](https://web-rtc-app-ashy.vercel.app/)

---

## Features

- **True P2P & Serverless:** No backend servers. Uses Trystero with the Nostr protocol for decentralized signaling. Trystero ensures reliable work of the application without a VPN in restrictive network environments.
- **Simple Room-Based Access:** Create a room instantly with a random ID or join an existing one by entering its ID.
- **Real-Time Media Controls:** Toggle your microphone and camera on/off during a call.
- **Easy Invitations:** Copy the full room link or just the room ID to share with participants.
- **Responsive Design:** Works seamlessly on desktop and mobile browsers.
- **Platform-Specific Optimizations:** Includes tailored initialization for Android and iOS to ensure stable stream transmission.
- **Telegram WebView Handling:** Automatically detects when the app is opened inside Telegram's built-in browser and prompts users to open it in their native browser (Chrome/Safari) to bypass WebRTC restrictions.

---

## Technical Decisions & Challenges

### Why Trystero?

I chose **Trystero** over traditional solutions like PeerJS or a custom Socket.io server for several reasons:

1.  **Serverless Signaling:** Trystero relies on existing networks (Nostr in my case) for peer discovery. There is no need to host and manage a separate signaling server. This simplifies deployment and reduces infrastructure costs.
2.  **Decentralized & Resilient:** By default, I use the **Nostr** strategy. Nostr relays are decentralized; if one relay is unreachable or rate-limited, the connection can still be established via another. This makes the application robust against censorship and regional network blocks, functioning correctly without a VPN in many restricted regions.
3.  **Native Room Abstraction:** Unlike raw WebRTC or libraries like PeerJS, Trystero provides a straightforward `joinRoom()` interface. It automatically handles the complexities of SDP negotiation, ICE candidate exchange, and connection management.

### Overcoming Telegram's WebView Limitations

A significant challenge was making WebRTC work when a user opens the app link inside the Telegram messenger. Telegram's built-in WebView (specifically on iOS WKWebView and Android Custom Tabs) imposes strict limitations on WebRTC and camera access.

The solution involved a two-step approach:

1.  **Reliable Detection:** To reliably detect if the page is loaded within Telegram's in-app browser, I used a combination of `navigator.userAgent` inspection and checks for Telegram-specific JavaScript objects (`TelegramWebviewProxy`, `Telegram.WebApp`, and `TelegramWebview`).
2.  **User Guidance:** Once a Telegram WebView is detected, a full-screen overlay is automatically displayed. It includes a clear message explaining that video calls are not supported inside Telegram. It provides an **"Open in Browser"** button which, when clicked, opens the exact room link in the user's default external browser (e.g., Chrome or Safari), where WebRTC functions perfectly.

---

## How to Use the Application

1.  **Navigate to the App:** Open [https://web-rtc-app-ashy.vercel.app/](https://web-rtc-app-ashy.vercel.app/) in a modern web browser (Chrome, Firefox, Safari, Edge).
2.  **Create a Room:**
    - Click the **"Create new room"** button.
    - You will be redirected to a unique room URL (e.g., `/room/abc123xyz`). Grant access to your camera and microphone when prompted.
3.  **Invite Others:**
    - From inside the room, you can use the **"Copy room link"** button to share the full URL, or the **"Copy room ID"** button to share only the alphanumeric ID.
4.  **Join a Room:**
    - On the home page, enter a room ID into the input field and click **"Join"**.
    - Alternatively, if you received a full link, simply open it in your browser.
5.  **During the Call:**
    - Use the **"Enable/Disable microphone"** and **"Enable/Disable camera"** buttons to control your media.
    - A status indicator shows connection progress ("Connecting...", "Connected").
    - The participant count is displayed at the top.
6.  **Leave a Room:**
    - Click the **"Leave room"** button.
    - A confirmation dialog will appear. If you are the last participant in the room, the room will be automatically destroyed upon leaving.
7.  **If Opened in Telegram:**
    - The app will display a message instructing you to open the link in your system browser for full functionality. Click the button to be redirected.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **P2P & Signaling:** Trystero (Nostr strategy)
- **Deployment:** Vercel
