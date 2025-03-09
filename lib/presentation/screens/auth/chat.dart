import 'package:flutter/material.dart';

// Dummy Chat User Model
class ChatUser {
  final String name;
  final String message;
  final String profilePic;

  ChatUser({required this.name, required this.message, required this.profilePic});
}

// Sample chat users
List<ChatUser> chatUsers = [
  ChatUser(
    name: "Bob Smith",
    message: "Hey, how are you?",
    profilePic: "lib/assets/profile.png",
  ),

  ChatUser(
    name: "Alice Johnson",
    message: "Let's meet up later!",
    profilePic: "lib/assets/profile2.png",
  ),

  ChatUser(
    name: "Charlie Davis",
    message: "Great job on the project!",
    profilePic: "lib/assets/profile3.png",
  ),

  ChatUser(
    name: "Marvin McKinney",
    message: "Check out this link!",
    profilePic: "lib/assets/profile4.png",
  ),
];


class InboxScreen extends StatefulWidget {
  const InboxScreen({super.key});

  @override
  _InboxScreenState createState() => _InboxScreenState();
}

class _InboxScreenState extends State<InboxScreen> {
  int _selectedIndex = 1; // Default to 'Chats' tab

  static final List<Widget> _pages = <Widget>[
    Center(child: Text("Profile Page", style: TextStyle(fontSize: 20))),
    InboxPage(), // Chat List Page
    Center(child: Text("Call History Page", style: TextStyle(fontSize: 20))),
    Center(child: Text("Settings Page", style: TextStyle(fontSize: 20))),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex], // Switch between pages
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        selectedItemColor: Color(0xFF2E7D32),
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profile"),
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: "Chats"),
          BottomNavigationBarItem(icon: Icon(Icons.call), label: "Calls"),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: "Settings"),
        ],
      ),
    );
  }
}

// 📌 Chat List UI
class InboxPage extends StatelessWidget {
  const InboxPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AppBar(title: const Text("Inbox"), centerTitle: true),
        Expanded(
          child: ListView.separated(
            itemCount: chatUsers.length,
            itemBuilder: (context, index) {
              final user = chatUsers[index];
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 5.0, horizontal: 12.0), // Added spacing
                child: ListTile(
                  contentPadding: const EdgeInsets.all(10),
                  tileColor: Colors.grey[200], // Light background for better visibility
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  leading: CircleAvatar(
                    backgroundImage: AssetImage(user.profilePic),
                    radius: 25,
                  ),
                  title: Text(user.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(user.message, style: const TextStyle(color: Colors.grey)),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => ChatScreen(user: user)),
                    );
                  },
                ),
              );
            },
            separatorBuilder: (context, index) => const SizedBox(height: 8), // Space between items
          ),
        ),
      ],
    );
  }
}

// 📌 Chat Screen with Messaging Functionality
class ChatScreen extends StatefulWidget {
  final ChatUser user;
  const ChatScreen({super.key, required this.user});

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final List<String> messages = []; // Store chat messages

  final ScrollController _scrollController = ScrollController();

  void _sendMessage() {
    if (_messageController.text.isNotEmpty) {
      setState(() {
        messages.add(_messageController.text);
      });

      _messageController.clear();

      // Auto-scroll to the latest message
      Future.delayed(const Duration(milliseconds: 100), () {
        _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.user.name)),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              itemCount: messages.length,
              itemBuilder: (context, index) {
                return Align(
                  alignment: Alignment.centerRight,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 5, horizontal: 10),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Color(0xFF2E7D32),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(messages[index], style: const TextStyle(color: Colors.white)),
                  ),
                );
              },
            ),
          ),

          // Message Input Section (Fixed Padding Issue)
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: InputDecoration(
                      hintText: "Type a message...",
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(30)),
                    ),
                  ),
                ),

                const SizedBox(width: 10), // Adjusted spacing

                IconButton(
                  icon: const Icon(Icons.send, color: Color(0xFF2E7D32)),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
