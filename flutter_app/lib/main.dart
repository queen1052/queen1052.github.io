import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_markdown/flutter_markdown.dart';

void main() {
  runApp(const QueenSite());
}

class QueenSite extends StatelessWidget {
  const QueenSite({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Queen Site',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<String> posts = [];
  String? selected;
  String content = '';
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadPosts();
  }

  Future<void> _loadPosts() async {
    setState(() {
      loading = true;
    });
    final manifestContent = await rootBundle.loadString('AssetManifest.json');
    final Map<String, dynamic> manifestMap = json.decode(manifestContent);
    final postKeys = manifestMap.keys
        .where((k) => k.startsWith('assets/posts/') && k.endsWith('.md'))
        .toList()
      ..sort((a, b) => b.compareTo(a)); // newest first by filename if dated

    setState(() {
      posts = postKeys;
    });

    if (posts.isNotEmpty) {
      await _loadPost(posts.first);
    }
    setState(() {
      loading = false;
    });
  }

  Future<void> _loadPost(String assetPath) async {
    final md = await rootBundle.loadString(assetPath);
    setState(() {
      selected = assetPath;
      content = md;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Queen Site'),
        centerTitle: true,
      ),
      body: Row(
        children: [
          NavigationRail(
            extended: MediaQuery.of(context).size.width > 1200,
            destinations: const [
              NavigationRailDestination(icon: Icon(Icons.home), label: Text('Home')),
            ],
            selectedIndex: 0,
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Card(
                elevation: 4,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Row(
                  children: [
                    Container(
                      width: 320,
                      padding: const EdgeInsets.all(16.0),
                      decoration: BoxDecoration(
                        border: Border(right: BorderSide(color: Colors.grey.shade200)),
                      ),
                      child: loading
                          ? const Center(child: CircularProgressIndicator())
                          : ListView.builder(
                              itemCount: posts.length,
                              itemBuilder: (context, index) {
                                final p = posts[index];
                                final title = p.split('/').last.replaceAll('.md', '');
                                return ListTile(
                                  title: Text(title),
                                  selected: selected == p,
                                  onTap: () => _loadPost(p),
                                );
                              },
                            ),
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: content.isEmpty
                            ? const Center(child: Text('No content'))
                            : Markdown(
                                data: content,
                                selectable: true,
                                styleSheet: MarkdownStyleSheet.fromTheme(Theme.of(context)),
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
