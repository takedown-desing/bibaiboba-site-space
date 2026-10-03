# Биба и Боба: сайт агентства, вариант «Space»

Превью дизайна по промту 2 («Planet Jumping»: тёмный космос, портал-переход между планетами, крупный узкий гротеск). Первый вариант: [bibaiboba-site-light](https://github.com/takedown-desing/bibaiboba-site-light).

- Стек: Astro 7 (статичные страницы), чистый CSS и JS без библиотек, как требует промт.
- Контент: те же markdown-черновики из пайплайна агентства, что и у варианта Light (`src/content/pages/`).
- Публикация: GitHub Actions, затем GitHub Pages. Превью закрыто от индексации (`noindex` и `robots.txt`), пока нет боевого домена.

```bash
npm install
npm run sync     # скопировать свежие черновики из пайплайна (локально)
npm run images   # подобрать фото Pexels (нужен PEXELS_API_KEY)
npm run build
npm run qa       # проверка готовой сборки, отчёт в qa-report.md
```
