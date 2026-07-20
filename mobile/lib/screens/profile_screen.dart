import 'package:flutter/material.dart';
import 'package:siren_store_mobile/models/user_profile.dart';
import 'package:siren_store_mobile/models/seller.dart';
import 'package:siren_store_mobile/services/api_service.dart';

class ProfileScreen extends StatefulWidget {
  final VoidCallback onLogout;
  final VoidCallback onOpenSellerPanel;
  final VoidCallback onOpenAdminPanel;

  const ProfileScreen({
    super.key,
    required this.onLogout,
    required this.onOpenSellerPanel,
    required this.onOpenAdminPanel,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  UserProfile? _profile;
  SellerStatusInfo? _sellerStatus;
  bool _isLoading = true;

  final _storeNameCtrl = TextEditingController();
  final _taxNumCtrl = TextEditingController();
  final _taxOfficeCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final p = await ApiService.getProfile();
      final s = await ApiService.getMySellerStatus();
      setState(() {
        _profile = p;
        _sellerStatus = s;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _applySeller() async {
    if (_profile == null) return;
    try {
      await ApiService.becomeSeller(
        storeName: _storeNameCtrl.text.trim(),
        contactEmail: _profile!.email,
        contactPhone: _phoneCtrl.text.trim(),
        supportLine: _phoneCtrl.text.trim(),
        taxNumber: _taxNumCtrl.text.trim(),
        taxOffice: _taxOfficeCtrl.text.trim(),
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Satıcı başvurusu yapıldı!')));
      }
      _loadData();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Hata: $e')));
      }
    }
  }

  void _showBecomeSellerDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Satıcı Başvurusu'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: _storeNameCtrl, decoration: const InputDecoration(labelText: 'Mağaza Adı')),
              TextField(controller: _phoneCtrl, decoration: const InputDecoration(labelText: 'Telefon (5XXXXXXXXX)')),
              TextField(controller: _taxNumCtrl, decoration: const InputDecoration(labelText: 'Vergi No (10-11 Hane)')),
              TextField(controller: _taxOfficeCtrl, decoration: const InputDecoration(labelText: 'Vergi Dairesi')),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('İptal')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              _applySeller();
            },
            child: const Text('Başvur'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    if (_profile == null) return const Scaffold(body: Center(child: Text('Profil bulunamadı.')));

    final p = _profile!;
    return Scaffold(
      appBar: AppBar(title: const Text('Profilim')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ListTile(
            leading: const CircleAvatar(child: Icon(Icons.person)),
            title: Text('${p.firstName} ${p.lastName}', style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('${p.email} | Rol: ${p.role}'),
          ),
          const Divider(),
          if (p.role == 'Admin')
            ElevatedButton.icon(
              onPressed: widget.onOpenAdminPanel,
              icon: const Icon(Icons.admin_panel_settings),
              label: const Text('Admin Paneli'),
            ),
          if (p.role == 'Seller')
            ElevatedButton.icon(
              onPressed: widget.onOpenSellerPanel,
              icon: const Icon(Icons.store),
              label: const Text('Satıcı Paneli'),
            ),
          if (p.role == 'Customer') ...[
            if (_sellerStatus != null && _sellerStatus!.hasApplied)
              Card(
                color: Colors.amber[100],
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text('Satıcı Başvuru Durumu: ${_sellerStatus!.status}', style: const TextStyle(fontWeight: FontWeight.bold)),
                ),
              )
            else
              OutlinedButton.icon(
                onPressed: _showBecomeSellerDialog,
                icon: const Icon(Icons.storefront),
                label: const Text('Satıcı Ol Başvurusu Yap'),
              ),
          ],
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: widget.onLogout,
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            child: const Text('Çıkış Yap'),
          ),
        ],
      ),
    );
  }
}
