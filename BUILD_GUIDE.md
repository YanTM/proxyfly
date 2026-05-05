# Как собрать приложение из этих исходников

Чтобы превратить эти файлы в рабочий APK для телефона, вам понадобится **Android Studio**.

## Шаг 1: Установка инструментов
1. Скачайте и установите [Android Studio](https://developer.android.com/studio).
2. При установке выберите "Standard installation".

## Шаг 2: Создание проекта
1. Откройте Android Studio.
2. Выберите **New Project** -> **Empty Views Activity**.
3. Укажите:
   - **Name:** Proxfier
   - **Package name:** com.proxfier
   - **Language:** Kotlin
   - **Minimum SDK:** 24 (Android 7.0)

## Шаг 3: Перенос кода
1. Скопируйте содержимое папки `mobile/app/src/main/` из этого проекта в папку `app/src/main/` созданного вами проекта в Android Studio.
2. Замените файлы, если они уже существуют.

## Шаг 4: Подключение sing-box
Для работы прокси на Android нужно добавить скомпилированную библиотеку `sing-box`. 
1. Скачайте официальный [sing-box для Android (lib-android.aar)](https://github.com/SagerNet/sing-box/releases).
2. Поместите её в папку `libs/` вашего проекта.
3. Добавьте в `build.gradle` зависимость: `implementation files('libs/lib-android.aar')`.

## Шаг 5: Сборка APK
1. В верхнем меню Android Studio выберите **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
2. Когда сборка закончится, в углу появится уведомление со ссылкой **locate**.
3. Нажмите её — там будет лежать ваш файл `app-debug.apk`.

**Поздравляю! Этот файл теперь можно скидывать на телефон.**
