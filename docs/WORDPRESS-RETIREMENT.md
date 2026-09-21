# WordPress retirement boundary

The public production origin is Cloudflare Workers Static Assets. WordPress runtime endpoints, PHP, MySQL, and WordPress administration are not deployed. Requests to historical login/admin paths return a real non-indexable 404; they are not redirected to a public page.

`source/wordpress/` is intentionally retained as approved, versioned HTML input for the static build. It is not a live WordPress installation. `source/media/` retains approved media paths for link and image-search continuity.

Keep any original hosting backup private. Do not commit database dumps, plugin archives, SSL keys, web-hosting credentials, or backup archives to this public repository.
