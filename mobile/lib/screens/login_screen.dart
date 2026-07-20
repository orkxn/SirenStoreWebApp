import 'package:flutter/material.dart';
import 'package:siren_store_mobile/services/api_service.dart';

class LoginScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;
  const LoginScreen({super.key, required this.onLoginSuccess});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isLogin = true;
  bool _isLoading = false;

  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _firstNameCtrl = TextEditingController();
  final _lastNameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();

  Future<void> _submit() async {
    final email = _emailCtrl.text.trim();
    final pass = _passCtrl.text.trim();

    if (email.isEmpty || pass.isEmpty) {
      _showMsg('Lütfen e-posta ve şifre giriniz.');
      return;
    }

    setState(() => _isLoading = true);
    try {
      if (_isLogin) {
        final ok = await ApiService.login(email, pass);
        if (ok) {
          _showMsg('Giriş başarılı!');
          widget.onLoginSuccess();
        } else {
          _showMsg('Giriş başarısız. Bilgilerinizi kontrol edin.');
        }
      } else {
        final msg = await ApiService.register(
          _firstNameCtrl.text.trim(),
          _lastNameCtrl.text.trim(),
          email,
          pass,
          _phoneCtrl.text.trim(),
        );
        _showMsg(msg);
        setState(() => _isLogin = true);
      }
    } catch (e) {
      _showMsg('Hata: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _showMsg(String text) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_isLogin ? 'Giriş Yap' : 'Kayıt Ol')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (!_isLogin) ...[
              TextField(
                controller: _firstNameCtrl,
                decoration: const InputDecoration(labelText: 'Ad'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _lastNameCtrl,
                decoration: const InputDecoration(labelText: 'Soyad'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _phoneCtrl,
                decoration: const InputDecoration(labelText: 'Telefon (5XXXXXXXXX)'),
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 12),
            ],
            TextField(
              controller: _emailCtrl,
              decoration: const InputDecoration(labelText: 'E-posta'),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _passCtrl,
              decoration: const InputDecoration(labelText: 'Şifre'),
              obscureText: true,
            ),
            const SizedBox(height: 24),
            _isLoading
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _submit,
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size.fromHeight(48),
                    ),
                    child: Text(_isLogin ? 'Giriş Yap' : 'Kayıt Ol'),
                  ),
            TextButton(
              onPressed: () => setState(() => _isLogin = !_isLogin),
              child: Text(_isLogin ? 'Hesabınız yok mu? Kayıt Olun' : 'Zaten hesabınız var mı? Giriş Yapın'),
            ),
          ],
        ),
      ),
    );
  }
}
