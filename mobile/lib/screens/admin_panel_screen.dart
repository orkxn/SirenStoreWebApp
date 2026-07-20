import 'package:flutter/material.dart';
import 'package:siren_store_mobile/models/admin.dart';
import 'package:siren_store_mobile/services/api_service.dart';

class AdminPanelScreen extends StatefulWidget {
  const AdminPanelScreen({super.key});

  @override
  State<AdminPanelScreen> createState() => _AdminPanelScreenState();
}

class _AdminPanelScreenState extends State<AdminPanelScreen> {
  List<UserManagement> _users = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  Future<void> _loadUsers() async {
    setState(() => _isLoading = true);
    try {
      final users = await ApiService.getAllUsers();
      setState(() {
        _users = users;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _toggleBan(UserManagement user) async {
    try {
      if (user.isBanned) {
        await ApiService.unbanUser(user.id);
      } else {
        await ApiService.banUser(user.id);
      }
      _loadUsers();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Hata: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Admin Paneli')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _users.length,
              itemBuilder: (ctx, i) {
                final u = _users[i];
                return ListTile(
                  title: Text(u.fullName),
                  subtitle: Text('${u.email} | Rol: ${u.role}'),
                  trailing: ElevatedButton(
                    onPressed: () => _toggleBan(u),
                    style: ElevatedButton.styleFrom(backgroundColor: u.isBanned ? Colors.green : Colors.red, foregroundColor: Colors.white),
                    child: Text(u.isBanned ? 'Ban Kaldır' : 'Banla'),
                  ),
                );
              },
            ),
    );
  }
}
