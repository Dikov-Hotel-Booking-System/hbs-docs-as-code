# 📚 Hbs-docs-service

> Портал документации Hotel Booking System

## 📌 Описание

Docusaurus собирает `README.md` и Markdown из `docs/` ветки `master` четырёх сервисов. При каждой сборке он загружает актуальные материалы, отображает Mermaid-диаграммы и связывает страницы внутри портала. Ссылки на файлы исходного кода ведут к ревизии на GitHub, из которой взята документация.

## 📘 Документация по процессам

- ### [GitHub Flow](docs/github_flow.md)

## 🛠️ Стек технологий

- Node.js 24 и pnpm
- Docusaurus и Mermaid
- Nginx, Docker и GitHub Actions

## 🚀 Локальный запуск

Из корня проекта выполнить команды.

```shell
pnpm install --frozen-lockfile
pnpm start
```

Портал доступен на `http://localhost:8081`. Если сервисы уже клонированы, переменная `HBS_DOCS_SOURCE_DIR` может указывать на родительскую папку этих репозиториев. В этом случае сборка читает их локальные ветки `master`.

## 📦 Сборка сайта и Docker-образа

```shell
pnpm test
pnpm build
docker build --tag hbs-docs-service:local .
docker run --rm --publish 8081:8080 hbs-docs-service:local
```

Готовый сайт находится в `build/`. CI проверяет код, собирает сайт и Docker-образ.

## 🔗 Полезные ссылки

| Ссылка | Примечание |
|--------|------------|
| [Репозиторий](https://github.com/Dikov-Hotel-Booking-System/hbs-docs-service) | Исходный код сервиса |
| [GitHub Actions](https://github.com/Dikov-Hotel-Booking-System/hbs-docs-service/actions) | Запуски CI |
