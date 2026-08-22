# Integración de Klaviyo

Guía rápida de configuración para activar el seguimiento de ecommerce y marketing en **Anbar Home**.

---

## 1. Obtener las credenciales en Klaviyo

1. Inicia sesión en tu cuenta de [Klaviyo](https://www.klaviyo.com).
2. Haz clic en el nombre de tu cuenta (esquina inferior izquierda) y ve a **Settings** > **API Keys**.
3. **Public API Key (Site ID):**
   - Copia tu **Public API Key / Site ID** (cadena alfanumérica de 6 caracteres, ej: `Xy123Z`).
4. **Private API Key:**
   - Haz clic en **Create Private API Key**.
   - Asigna un nombre a la llave (ej: `Anbar Home Production Web`).
   - Selecciona **Custom Key** y activa **únicamente** los siguientes scopes mínimos (Principio de mínimo privilegio):
     - `events:write` (Para registrar eventos de pedidos y navegación)
     - `profiles:write` (Para crear y actualizar perfiles de usuarios)
     - `subscriptions:write` (Para registrar suscripciones al newsletter con consentimiento de marketing)
   - Haz clic en **Create** y copia la Private Key generada (`pk_...`).

---

## 2. Configurar Variables de Entorno

Abre el archivo `.env.local` en la raíz del proyecto y completa las dos variables:

```env
NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY="TU_PUBLIC_API_KEY"
KLAVIYO_PRIVATE_API_KEY="pk_TU_PRIVATE_API_KEY"
```

Reinicia el servidor de desarrollo o despliega en producción:

```bash
pnpm run dev
# o para producción:
pnpm run build && pnpm run start
```

---

## 3. Verificación en el Dashboard de Klaviyo

Para comprobar que todo funciona correctamente:

1. **Perfil y Newsletter:**
   - Abre la web y suscríbete en el modal de **10% OFF**.
   - En Klaviyo, ve a **Audience** > **Profiles**. Deberías ver tu perfil creado con el consentimiento de correo marcado como **Subscribed**.
2. **Viewed Product:**
   - Visita la página de cualquier producto.
   - En Klaviyo, ve a **Analytics** > **Metrics** > **Viewed Product** > **Activity Feed**. Verás el producto visualizado con su nombre, precio, categoría e imagen.
3. **Added to Cart & Removed from Cart:**
   - Añade un producto al carrito y luego elimínalo.
   - Revisa en **Analytics** > **Metrics** los eventos **Added to Cart** y **Removed from Cart**.
4. **Started Checkout:**
   - Ve a la página de `/checkout`.
   - En **Analytics** > **Metrics** > **Started Checkout**, aparecerá el carrito y total.
5. **Placed Order & Ordered Product:**
   - Al completarse una compra aprobada (vía Wompi), el servidor enviará de forma automática y segura los eventos **Placed Order** y los ítems individuales en **Ordered Product**.
