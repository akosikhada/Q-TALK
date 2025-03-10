# Mobile Messaging App Architecture

> A comprehensive guide for building a messaging app without a backend

## 📱 Application Flow

### 1. Splash Screen

![Splash Screen](https://via.placeholder.com/150?text=Splash)

**Purpose:** First screen users see when opening the app

**Elements:**

- App logo prominently displayed in center
- "Get Started" button at bottom
- Minimal, clean design for brand recognition

### 2. Authentication

![Authentication](https://via.placeholder.com/150?text=Auth)

**Purpose:** Allow users to create accounts or access existing ones

**Sign Up Flow:**

- Phone number or email input
- Password creation with strength indicator
- Terms of service acceptance
- Submit button

**Sign In Flow:**

- Username/email field
- Password field
- "Forgot Password" option
- Sign in button
- Alternative sign-in methods (optional)

### 3. OTP Verification

![OTP](https://via.placeholder.com/150?text=OTP)

**Purpose:** Verify user identity through one-time password

**Elements:**

- Clear instructions for OTP entry
- Input fields for OTP digits (auto-focus)
- Countdown timer for OTP expiration
- "Resend OTP" option
- "Verify" button

### 4. Messages List (Home Screen)

![Messages](https://via.placeholder.com/150?text=Messages)

**Purpose:** Central hub for all conversations

**Elements:**

- Search bar at top
- Conversation list showing:
  - Contact name and photo
  - Message preview (last message)
  - Timestamp
  - Unread message indicator
- Floating Action Button (FAB) for new message
- Pull-to-refresh functionality

### 5. Bottom Navigation

![Navigation](https://via.placeholder.com/150?text=Navigation)

**Purpose:** Quick access to primary app sections

**Tabs:**

- **💬 Chats:** Main messages list
- **📞 Calls:** Call history (future feature)
- **👥 Contacts:** Contact directory
- **⚙️ Settings:** App configuration

### 6. Chat Screen

![Chat](https://via.placeholder.com/150?text=Chat)

**Purpose:** Send and receive messages in a conversation

**Elements:**

- Header with contact info and options
- Message bubbles (right for user, left for recipient)
- Timestamp for messages
- Message status indicators (sent, delivered, read)
- Input field with:
  - Text entry area
  - Attachment option
  - Send button
- Typing indicator

### 7. Settings Page

![Settings](https://via.placeholder.com/150?text=Settings)

**Purpose:** Customize app experience and manage account

**Sections:**

- **Profile Management:**
  - Profile picture
  - Name/username
  - Status/bio
- **Preferences:**
  - Notifications
  - Theme (light/dark)
  - Chat background
  - Font size
- **Privacy & Security:**
  - Privacy options
  - Blocked contacts
- **Logout** option

## 🛠️ Tech Stack: React Native with Expo Go

### Core Technologies

| Technology       | Purpose              | Benefits                                             |
| ---------------- | -------------------- | ---------------------------------------------------- |
| React Native     | UI framework         | Cross-platform, component-based architecture         |
| Expo             | Development platform | Simplified workflow, pre-built native modules        |
| TypeScript       | Programming language | Type safety, better code organization                |
| React Navigation | Navigation library   | Screen transitions, tab navigation, stack navigation |
| Async Storage    | Local storage        | Persistent data storage without a backend            |
| NativeWind       | Styling solution     | Tailwind CSS for React Native                        |

#### Setup with Expo

1. **Installation**:

   ```bash
   npm install nativewind
   npm install --dev tailwindcss@3.3.2
   ```

2. **Initialize Tailwind configuration**:

   ```bash
   npx tailwindcss init
   ```

3. **Configure `tailwind.config.js`**:

   ```javascript
   module.exports = {
     content: [
       "./App.{js,jsx,ts,tsx}",
       "./screens/**/*.{js,jsx,ts,tsx}",
       "./components/**/*.{js,jsx,ts,tsx}",
     ],
     theme: {
       extend: {
         colors: {
           primary: "#5B37B7",
           secondary: "#C9F0FF",
           // Custom colors for the messaging app
           bubble: {
             sent: "#DCF8C6",
             received: "#FFFFFF",
           },
         },
       },
     },
     plugins: [],
   };
   ```

4. **Configure Babel**:
   Add to `babel.config.js`:

   ```javascript
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: ["babel-preset-expo"],
       plugins: ["nativewind/babel"],
     };
   };
   ```

5. **Setup TypeScript** (if using TypeScript):
   Add to `app.d.ts`:
   ```typescript
   /// <reference types="nativewind/types" />
   ```

#### Usage Examples

**Basic Component Styling**:

```jsx
import { View, Text, TouchableOpacity } from "react-native";

export default function ChatBubble({ message, isSent }) {
  return (
    <View
      className={`p-3 rounded-lg my-1 max-w-[80%] ${
        isSent
          ? "bg-bubble-sent self-end rounded-tr-none"
          : "bg-bubble-received self-start rounded-tl-none"
      }`}
    >
      <Text className="text-base text-gray-800">{message.text}</Text>
      <Text className="text-xs text-gray-500 self-end mt-1">
        {message.time}
      </Text>
    </View>
  );
}
```

**Button Component**:

```jsx
export function PrimaryButton({ title, onPress }) {
  return (
    <TouchableOpacity
      className="bg-primary py-3 px-6 rounded-full shadow-md active:opacity-80"
      onPress={onPress}
    >
      <Text className="text-white font-bold text-center">{title}</Text>
    </TouchableOpacity>
  );
}
```

**Input Field**:

```jsx
export function MessageInput({ value, onChangeText, onSend }) {
  return (
    <View className="flex-row items-center border border-gray-300 rounded-full px-4 py-2 mx-2 my-1 bg-white">
      <TextInput
        className="flex-1 text-base px-2"
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a message..."
      />
      <TouchableOpacity
        className="bg-primary h-10 w-10 rounded-full items-center justify-center"
        onPress={onSend}
      >
        <Icon name="send" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
```

#### Dark Mode Support

```jsx
// In a component
import { useColorScheme } from "nativewind";

function MyComponent() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View className="bg-white dark:bg-gray-900">
      <Text className="text-black dark:text-white">
        Current theme: {colorScheme}
      </Text>
      <Button onPress={toggleColorScheme} title="Toggle theme" />
    </View>
  );
}
```

### Project Structure

```
messaging-app/
├── assets/              # Images, fonts, and other static assets
├── components/          # Reusable UI components
│   ├── ChatBubble.tsx
│   ├── ContactItem.tsx
│   └── ...
├── screens/             # Screen components
│   ├── SplashScreen.tsx
│   ├── AuthScreen.tsx
│   ├── OTPScreen.tsx
│   ├── MessagesScreen.tsx
│   ├── ChatScreen.tsx
│   └── ...
├── navigation/          # Navigation configuration
│   ├── AppNavigator.tsx
│   └── AuthNavigator.tsx
├── services/            # Business logic and services
│   ├── authService.ts
│   ├── messageService.ts
│   └── storageService.ts
├── hooks/               # Custom React hooks
├── contexts/            # React context providers
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── App.tsx              # Entry point
└── app.json             # Expo configuration
```
