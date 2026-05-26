# 🚀 Guía Completa - PetroGas Protocol Deployment

## ✅ Cambios Realizados

### 1. Cambio de HYPE a ETH Price
He actualizado los siguientes archivos para que muestre el precio de **Ethereum (ETH)** en lugar de HYPE:

#### Archivos modificados:
- ✅ `src/components/LiveStats.tsx` - Cambió "Hyper Price" → "ETH Price"
- ✅ `src/hooks/useRealTimeData.ts` - Usa `getEthPrice()` en lugar de `getHypePrice()`
- ✅ `src/lib/ankr.ts` - Ya tenía la función `getEthPrice()` correcta (usa CoinGecko)

### 2. Datos Mostrados
Ahora el dashboard muestra:
- **Gas Price** (en gwei) - Se actualiza cada 12 segundos
- **ETH Price** (en USD) - Se actualiza cada 30 segundos  
- **Oil Price (WTI)** (en USD por barril) - Se actualiza cada 5 minutos

---

## 📋 Opciones de Deployment

Tienes **2 formas** de deployar tu contrato:

### Opción 1️⃣: Deployment con Hardhat (Automatizado) ⚡
**Recomendado si quieres deployment rápido y verificación automática**

### Opción 2️⃣: Deployment Manual con Remix 🎨
**Recomendado si prefieres interfaz visual y control paso a paso**

---

## 🔧 OPCIÓN 1: Deployment con Hardhat

### Paso 1: Configurar Variables de Entorno

Copia el archivo `.env` y edita los valores:

```bash
cp .env .env.local
```

Edita `.env` con tus valores reales:

```env
# Hardhat/Deployment
PRIVATE_KEY=tu_clave_privada_metamask_aqui
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/TU_API_KEY
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/TU_API_KEY
ETHERSCAN_API_KEY=tu_api_key_etherscan
```

#### 📝 Cómo obtener cada valor:

**PRIVATE_KEY:**
1. Abre MetaMask
2. Click en los 3 puntos → Account details → Export Private Key
3. Ingresa tu contraseña
4. ⚠️ **NUNCA compartas esta clave**

**SEPOLIA_RPC_URL:**
1. Ve a [alchemy.com](https://www.alchemy.com/)
2. Crea una cuenta gratis
3. Create New App → Network: Ethereum Sepolia
4. Copia el HTTP URL

**ETHERSCAN_API_KEY:**
1. Ve a [etherscan.io](https://etherscan.io/)
2. Crea cuenta → My Profile → API Keys → Add
3. Copia tu API Key

### Paso 2: Instalar Dependencias

```bash
npm install
# o
yarn install
```

### Paso 3: Compilar Contratos

```bash
npx hardhat compile
```

### Paso 4: Deploy en Red de Prueba (Sepolia)

```bash
# Deploy en Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

**Salida esperada:**
```
🚀 Deploying PetroGas Protocol...

Deploying with account: 0x1234...
✅ PetroGasProtocol deployed to: 0xABCD...
✅ Oracle address: 0x1234...
✅ Initial oil price set to: $75

📝 Deployment Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contract Address: 0xABCD...
Oracle Address: 0x1234...
Network: sepolia
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 Deployment info saved to: ./deployments/sepolia.json
```

### Paso 5: Verificar Contrato en Etherscan

```bash
npx hardhat verify --network sepolia DIRECCION_DEL_CONTRATO DIRECCION_ORACLE
```

Ejemplo:
```bash
npx hardhat verify --network sepolia 0xABCD1234... 0x5678EFGH...
```

### Paso 6: Actualizar Frontend

Copia la dirección del contrato deployado y actualiza el `.env`:

```env
NEXT_PUBLIC_PETROGAS_CONTRACT_ADDRESS=0xABCD1234...
```

---

## 🎨 OPCIÓN 2: Deployment Manual con Remix

### Paso 1: Preparar el Contrato

1. Ve a [remix.ethereum.org](https://remix.ethereum.org)
2. Crea nuevo archivo: `PetroGasProtocol.sol`
3. Copia el código del contrato desde `contracts/PetroGasProtocol.sol`

### Paso 2: Instalar Dependencias OpenZeppelin

Remix descargará automáticamente las dependencias al compilar.

Los imports necesarios son:
```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
```

### Paso 3: Compilar

1. Ve a la pestaña **"Solidity Compiler"** (ícono S)
2. Selecciona versión: **0.8.24**
3. Activa **"Enable optimization"** → Runs: 200
4. Click **"Compile PetroGasProtocol.sol"**
5. Verifica que compile sin errores ✅

### Paso 4: Conectar MetaMask

#### Para Testing (Sepolia Testnet):

1. **Obtener ETH de prueba:**
   - Ve a [sepoliafaucet.com](https://sepoliafaucet.com)
   - O [faucets.chain.link](https://faucets.chain.link)
   - Pega tu dirección de MetaMask
   - Espera 1-2 minutos

2. **Cambiar red en MetaMask:**
   - Abre MetaMask
   - Click en el dropdown de red (arriba)
   - Selecciona "Sepolia test network"

### Paso 5: Deploy en Remix

1. Ve a **"Deploy & Run Transactions"** (ícono Ethereum)

2. **Configuración:**
   - **Environment**: `Injected Provider - MetaMask`
   - **Account**: Tu cuenta de MetaMask aparecerá
   - **Contract**: Selecciona `PetroGasProtocol`

3. **Parámetro del Constructor:**
   
   En el campo junto a "Deploy", ingresa la dirección del Oracle.
   
   **Para testing**, usa tu propia dirección:
   ```
   "TU_DIRECCION_METAMASK"
   ```
   
   Ejemplo:
   ```
   "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
   ```

4. **Deploy:**
   - Click en **"Deploy"** (botón naranja)
   - MetaMask abrirá un popup
   - Revisa el gas fee
   - Click **"Confirm"**
   - Espera la confirmación (15-30 segundos)

### Paso 6: Verificar Deployment

En "Deployed Contracts" (parte inferior):
- Verás tu contrato desplegado
- Expande para ver todas las funciones
- La dirección del contrato está arriba del dropdown

**Copia la dirección del contrato** ✅

### Paso 7: Configuración Inicial

Después del deploy, configura el precio inicial del petróleo:

1. En "Deployed Contracts", busca la función **`updateOilPrice`**
2. Ingresa el precio actual (ejemplo: $75 = 7500000000)
   ```
   7500000000
   ```
   (El precio está escalado por 10^8, entonces $75 = 75 * 100000000)
3. Click **"transact"**
4. Confirma en MetaMask

### Paso 8: Verificar en Etherscan

1. Ve a [sepolia.etherscan.io](https://sepolia.etherscan.io)
2. Busca la dirección de tu contrato
3. Verás la transacción de deployment

**Para verificar el código (opcional pero recomendado):**

1. En Etherscan, click en "Contract" tab
2. Click "Verify and Publish"
3. Selecciona:
   - Compiler: `v0.8.24`
   - License: `MIT`
   - Optimization: `Yes` con 200 runs
4. Pega el código del contrato (flatten)
5. Submit

---

## 🧪 Testing del Contrato Deployado

### En Remix:

Una vez deployado, puedes probar las funciones directamente:

#### 1. Crear un Receipt (Gas Receipt)
```javascript
// Función: createReceipt
gasUsed: 21000
gasPriceGwei: 30
ethPriceUSD: 300000000000  // $3000 = 3000 * 10^8

// Enviar ETH (por ejemplo): 0.001 ETH
Value: 0.001 Ether
```

#### 2. Ver Receipts del Usuario
```javascript
// Función: getUserReceipts
_user: "TU_DIRECCION"
```

#### 3. Calcular Refund
```javascript
// Función: calculateRefund
_receiptId: 0  // ID del primer receipt
```

#### 4. Actualizar Precio del Petróleo
```javascript
// Función: updateOilPrice (solo owner/oracle)
_newPrice: 8000000000  // $80 = 80 * 10^8
```

---

## 📱 Integrar con el Frontend

### Actualizar la Dirección del Contrato

En tu archivo `.env`:

```env
# Contract Addresses (after deployment)
NEXT_PUBLIC_PETROGAS_CONTRACT_ADDRESS=0xTU_DIRECCION_CONTRATO_AQUI
```

### Iniciar el Frontend

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

Ahora deberías ver:
- ✅ Gas Price actual
- ✅ ETH Price (no HYPE)
- ✅ Oil Price (WTI)
- ✅ Todas las estadísticas en tiempo real

---

## ⚠️ Consideraciones Importantes

### Seguridad:

1. **NUNCA** subas tu `.env` con claves privadas a GitHub
2. Agrega `.env` al `.gitignore`
3. Usa `.env.example` para compartir estructura

### Para Mainnet:

1. **NO DEPLOYAR en mainnet sin auditoría de seguridad**
2. El gas será más caro (~$50-200 USD)
3. Necesitas ETH real
4. Considera un multisig para el owner
5. Usa un Oracle profesional (Chainlink)

### Testing:

1. Usa Sepolia testnet primero
2. Prueba todas las funciones
3. Simula diferentes escenarios
4. Verifica cálculos de refund

---

## 🐛 Troubleshooting

### Error: "Insufficient funds"
- Necesitas más ETH en tu wallet
- Para testnet: obtén de faucets
- Para mainnet: compra ETH

### Error: "Nonce too high"
- Reset MetaMask: Settings → Advanced → Reset Account

### Error: "Cannot estimate gas"
- Verifica parámetros del constructor
- Asegúrate de tener suficiente ETH

### Compilación falla en Remix:
- Verifica versión de Solidity: 0.8.24
- Espera que descargue OpenZeppelin
- Intenta limpiar cache (Ctrl+Shift+R)

### Frontend no conecta:
- Verifica que la dirección del contrato esté en `.env`
- Asegúrate de estar en la red correcta (Sepolia)
- Revisa la consola del navegador para errores

---

## 📞 Siguiente Pasos

1. ✅ Deploy en Sepolia testnet
2. ✅ Probar todas las funciones
3. ✅ Verificar contrato en Etherscan
4. ✅ Conectar frontend
5. ✅ Testing exhaustivo
6. 🔒 Auditoría de seguridad (antes de mainnet)
7. 🚀 Deploy en mainnet (cuando esté listo)

---

## 🎯 Resumen de Cambios Aplicados

### ✅ Ya Actualizado en tu Proyecto:

1. **LiveStats.tsx**: Cambiado "Hyper Price" → "ETH Price"
2. **useRealTimeData.ts**: Hook usa `getEthPrice()` correctamente
3. **ankr.ts**: Ya tiene implementación correcta de ETH price via CoinGecko

### 📊 Datos Mostrados:

- **Gas Price**: Precio actual del gas en gwei (Ankr RPC)
- **ETH Price**: Precio de Ethereum en USD (CoinGecko)
- **Oil Price**: Precio WTI del petróleo en USD (EIA API)

Todo está listo para deployar! 🚀

¿Prefieres hacerlo con Hardhat (automatizado) o con Remix (visual)?
