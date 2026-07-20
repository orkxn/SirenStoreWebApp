import 'package:flutter/material.dart';
import 'package:siren_store_mobile/models/product.dart';
import 'package:siren_store_mobile/models/comment.dart';
import 'package:siren_store_mobile/services/api_service.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;
  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  List<Comment> _comments = [];
  bool _isLoadingComments = true;
  bool _isFavorite = false;

  final _commentCtrl = TextEditingController();
  final int _selectedRating = 5;

  @override
  void initState() {
    super.initState();
    _loadComments();
    _checkFavorite();
  }

  Future<void> _loadComments() async {
    try {
      final comments = await ApiService.getCommentsByProductId(widget.product.id);
      setState(() {
        _comments = comments;
        _isLoadingComments = false;
      });
    } catch (_) {
      setState(() => _isLoadingComments = false);
    }
  }

  Future<void> _checkFavorite() async {
    try {
      final favIds = await ApiService.getMyFavoriteIds();
      setState(() {
        _isFavorite = favIds.contains(widget.product.id);
      });
    } catch (_) {}
  }

  Future<void> _toggleFavorite() async {
    try {
      if (_isFavorite) {
        await ApiService.removeFavorite(widget.product.id);
      } else {
        await ApiService.addFavorite(widget.product.id);
      }
      setState(() => _isFavorite = !_isFavorite);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Hata: $e')));
      }
    }
  }

  Future<void> _addToBasket() async {
    try {
      await ApiService.addToBasket(widget.product.id, 1);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Ürün sepete eklendi!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Hata: $e')));
      }
    }
  }

  Future<void> _addComment() async {
    if (_commentCtrl.text.trim().isEmpty) return;
    try {
      await ApiService.createComment(widget.product.id, _commentCtrl.text.trim(), _selectedRating);
      _commentCtrl.clear();
      _loadComments();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Yorum eklenemedi: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.product;
    return Scaffold(
      appBar: AppBar(
        title: Text(p.name),
        actions: [
          IconButton(
            icon: Icon(_isFavorite ? Icons.favorite : Icons.favorite_border, color: _isFavorite ? Colors.red : null),
            onPressed: _toggleFavorite,
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 250,
              width: double.infinity,
              color: Colors.grey[200],
              child: p.mainImageUrl != null && p.mainImageUrl!.isNotEmpty
                  ? Image.network(p.mainImageUrl!, fit: BoxFit.cover)
                  : const Icon(Icons.shopping_bag, size: 80, color: Colors.grey),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(p.name, style: Theme.of(context).textTheme.headlineSmall),
                      ),
                      Text('${p.price.toStringAsFixed(2)} TL', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.indigo)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text('Mağaza: ${p.storeName}', style: TextStyle(color: Colors.grey[600])),
                  const SizedBox(height: 12),
                  Text(p.description),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: _addToBasket,
                    icon: const Icon(Icons.add_shopping_cart),
                    label: const Text('Sepete Ekle'),
                    style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(48)),
                  ),
                  const Divider(height: 32),
                  Text('Yorumlar (${_comments.length})', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _commentCtrl,
                          decoration: const InputDecoration(hintText: 'Yorum yazınız...'),
                        ),
                      ),
                      IconButton(icon: const Icon(Icons.send), onPressed: _addComment),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _isLoadingComments
                      ? const CircularProgressIndicator()
                      : _comments.isEmpty
                          ? const Text('Henüz yorum yapılmamış.')
                          : ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _comments.length,
                              itemBuilder: (ctx, i) {
                                final c = _comments[i];
                                return ListTile(
                                  title: Text(c.userFullName),
                                  subtitle: Text(c.text),
                                  trailing: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(Icons.star, color: Colors.amber, size: 16),
                                      Text('${c.rating}'),
                                    ],
                                  ),
                                );
                              },
                            ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
