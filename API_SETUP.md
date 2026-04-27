# 🔑 API Configuration Guide

Este documento explica cómo obtener y configurar todas las API keys necesarias para PetroGas Protocol.

## 📋 APIs Requeridas

### 1. Ankr (Ethereum Data) ⚡

**Para qué:** Obtener datos en tiempo real de Ethereum (gas prices, bloques, transacciones)

**Cómo obtenerla:**
1. Ve a [https://www.ankr.com/rpc/](https://www.ankr.com/rpc/)
2. Crea una cuenta gratis
3. Ve a "Advanced APIs"
4. Copia tu API key
5. Pégala en `.env.local`:
```env
NEXT_PUBLIC_ANKR_API_KEY=tu_ankr_api_key_aqui
```

**Plan Gratis:** 
- 3,000,000 requests/mes
- Más que suficiente para desarrollo

---

### 2. EIA (Oil Prices) 🛢️

**Para qué:** Obtener precios de petróleo WTI y Brent en tiempo real

**Cómo obtenerla:**
1. Ve a [https://www.eia.gov/opendata/register.php](https://www.eia.gov/opendata/register.php)
2. Registra una cuenta (gratis)
3. Recibirás tu API key por email
4. Pégala en `.env.local`:
```env
NEXT_PUBLIC_EIA_API_KEY=tu_eia_api_key_aqui
```

**Plan Gratis:** 
- Ilimitado
- Datos oficiales del gobierno de USA
- Actualización diaria

**Endpoint usado:**
```
https://api.eia.gov/v2/petroleum/pri/spt/data/
```

---

### 3. Alpha Vantage (Backup Oil & Commodity Prices) 📊

**Para qué:** Backup para precios de petróleo si EIA falla

**Cómo obtenerla:**
1. Ve a [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. Completa el formulario (gratis)
3. Recibirás tu API key inmediatamente
4. Pégala en `.env.local`:
```env
NEXT_PUBLIC_ALPHA_VANTAGE_KEY=tu_alpha_vantage_key_aqui
```

**Plan Gratis:** 
- 25 requests/día (limitado)
- Solo como backup
- Commodities incluidos

---

### 4. Privy (Wallet Authentication) 🔐

**Para qué:** Login con wallet, email, y social (Google, Twitter)

**Cómo obtenerla:**
1. Ve a [https://privy.io](https://privy.io)
2. Crea una cuenta
3. Crea una nueva app
4. Copia tu App ID
5. Pégala en `.env.local`:
```env
NEXT_PUBLIC_PRIVY_APP_ID=tu_privy_app_id_aqui
```

**Plan Gratis:**
- 1,000 active users/mes
- Todos los métodos de login
- Embedded wallets incluidas

**Configuración recomendada:**
- Enable: Email, Google, Wallet
- Theme: Light
- Accent Color: `#ee865d` (rust)

---

### 5. Supabase (Backend Database) 🗄️

**Para qué:** Almacenar receipts, stats de usuarios, histórico

**Cómo obtenerla:**
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta
3. Crea un nuevo proyecto
4. Ve a Settings > API
5. Copia:
   - Project URL
   - Anon/Public key
6. Pégalas en `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Plan Gratis:**
- 500MB database
- 1GB file storage
- 2GB bandwidth
- Real-time subscriptions

**Setup SQL:** Ver `SETUP.md` para crear las tablas necesarias

---

### 6. Alchemy (Blockchain RPC) ⛓️

**Para qué:** Deploy de contratos, interacción con blockchain

**Cómo obtenerla:**
1. Ve a [https://www.alchemy.com](https://www.alchemy.com)
2. Crea una cuenta
3. Crea una nueva app (Ethereum Mainnet y Sepolia)
4. Copia tu API Key
5. Pégala en `.env.local`:
```env
NEXT_PUBLIC_ALCHEMY_ID=tu_alchemy_key_aqui
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/tu_alchemy_key_aqui
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/tu_alchemy_key_aqui
```

**Plan Gratis:**
- 300M compute units/mes
- Suficiente para desarrollo y testing

---

## 🚀 Orden de Setup Recomendado

1. **Primero:** Ankr, EIA, Privy, Supabase (necesarios para dev)
2. **Segundo:** Alchemy (solo cuando vayas a deployar contratos)
3. **Opcional:** Alpha Vantage (solo como backup)

## ✅ Verificar Configuración

Después de configurar todas las APIs, verifica que funcionan:

```bash
# Asegúrate de tener las variables
cat .env.local | grep -E "ANKR|EIA|PRIVY|SUPABASE"

# Inicia el servidor
npm run dev

# Ve a http://localhost:3000/dashboard
# Deberías ver datos en tiempo real
```

## 🐛 Troubleshooting

### "Gas price not loading"
- Verifica que `NEXT_PUBLIC_ANKR_API_KEY` esté correcta
- Chequea que no tenga espacios al inicio/final
- Reinicia el servidor (`npm run dev`)

### "Oil price shows --"
- Verifica `NEXT_PUBLIC_EIA_API_KEY`
- EIA a veces tarda ~1 hora en activar nuevas keys
- El sistema automáticamente usará Alpha Vantage como backup

### "Wallet connection fails"
- Verifica `NEXT_PUBLIC_PRIVY_APP_ID`
- Asegúrate de estar en localhost:3000 (configurado en Privy)
- Limpia cache del browser

### "Supabase errors"
- Ejecuta el SQL setup del archivo `SETUP.md`
- Verifica que las tablas existan
- Chequea que los policies estén habilitados

## 📊 Monitoreo de Uso

Todas las APIs tienen dashboards donde puedes ver tu uso:

- **Ankr:** https://www.ankr.com/rpc/dashboard
- **EIA:** No tiene dashboard (es ilimitado)
- **Alpha Vantage:** https://www.alphavantage.co/account/
- **Privy:** https://dashboard.privy.io
- **Supabase:** https://app.supabase.com (Settings > Usage)
- **Alchemy:** https://dashboard.alchemy.com

## 🎯 Next Steps

Después de configurar todas las APIs:

1. ✅ Verifica que el dashboard cargue datos
2. ✅ Comprueba que las gráficas se actualicen
3. ✅ Prueba conectar tu wallet
4. ✅ Crea tu primer gas receipt (cuando hayas deployado el contrato)

---

## 💰 Upgrade Paths (Opcional)

Si tu app crece y necesitas más:

- **Ankr Pro:** $50/mes → 30M requests/mes
- **EIA:** Gratis siempre
- **Alpha Vantage Premium:** $50/mes → ilimitado
- **Privy Pro:** $99/mes → 10K users
- **Supabase Pro:** $25/mes → 8GB database
- **Alchemy Growth:** $49/mes → más compute units

Para desarrollo, el plan gratis de todo es más que suficiente.
