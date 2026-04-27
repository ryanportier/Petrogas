const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying PetroGas Protocol...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  // For now, use deployer as oracle (in production, use Chainlink or custom oracle)
  const oracleAddress = deployer.address;

  // Deploy PetroGasProtocol
  console.log("Deploying PetroGasProtocol contract...");
  const PetroGasProtocol = await hre.ethers.getContractFactory("PetroGasProtocol");
  const protocol = await PetroGasProtocol.deploy(oracleAddress);
  await protocol.waitForDeployment();

  const protocolAddress = await protocol.getAddress();
  console.log("✅ PetroGasProtocol deployed to:", protocolAddress);
  console.log("✅ Oracle address:", oracleAddress);

  // Initial setup
  console.log("\n⚙️  Setting up initial configuration...");
  
  // Update oil price to current market price (example: $75)
  const initialOilPrice = BigInt(75) * BigInt(10 ** 8); // $75 with 8 decimals
  const tx = await protocol.updateOilPrice(initialOilPrice);
  await tx.wait();
  console.log("✅ Initial oil price set to: $75");

  console.log("\n📝 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contract Address:", protocolAddress);
  console.log("Oracle Address:", oracleAddress);
  console.log("Network:", hre.network.name);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: protocolAddress,
    oracleAddress: oracleAddress,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  const deploymentsDir = './deployments';
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    `${deploymentsDir}/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to:", `${deploymentsDir}/${hre.network.name}.json`);
  
  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 To verify the contract, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${protocolAddress} ${oracleAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
