
---

## Шаг 4. Собрать проект локально

На **своём компьютере** (не на сервере):

```bash
cd collage-app
npm install
npm run build
```

После этого появится папка `collage-app/dist/`.

---


## Шаг 6. Настроить Nginx

На **сервере**:

```bash
nano /etc/nginx/sites-available/collage
```

Вставить конфиг (заменить `yourdomain.com` на ваш домен):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/collage;
    index index.html;

    # SPA — все маршруты отдают index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кеширование статических файлов
    location ~* \.(js|css|png|svg|ico|woff2|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip сжатие
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
}
```

Сохранить: `Ctrl+O`, `Enter`, `Ctrl+X`.

Активировать сайт:

```bash
ln -s /etc/nginx/sites-available/collage /etc/nginx/sites-enabled/
nginx -t          # проверка конфига — должно быть "test is successful"
systemctl reload nginx
```

Сайт уже доступен по `http://yourdomain.com`.

---

## Шаг 7. Получить SSL-сертификат (HTTPS)

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot спросит email и предложит автоматически настроить редирект с HTTP на HTTPS — выбрать **Yes**.

Проверить автообновление сертификата:
```bash
certbot renew --dry-run
# должно пройти без ошибок
```

Сайт теперь доступен по `https://yourdomain.com`.

---

## Шаг 8. Проверить работу

Открыть в браузере `https://yourdomain.com` и убедиться:
- [ ] Приложение загружается
- [ ] Можно загружать фото
- [ ] Коллаж рендерится и скачивается

---

## Обновление сайта (при следующих деплоях)

На **своём компьютере**:

```bash
cd collage-app
npm run build

# Очистить старые файлы и залить новые
ssh root@<IP> "rm -rf /var/www/collage/*"
scp -r dist/* root@<IP>:/var/www/collage/
```

---

## Полезные команды на сервере

```bash
systemctl status nginx        # статус Nginx
systemctl reload nginx        # перезагрузить конфиг
tail -f /var/log/nginx/error.log   # смотреть ошибки в реальном времени
certbot certificates          # посмотреть SSL-сертификаты
```
