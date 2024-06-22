async function main() {
    // Get the list of available accounts from the Hardhat local network
  const [deployer] = await ethers.getSigners();
  
  // Log the address of the deployer to the console
  console.log('Deploying contracts with the account:', deployer.address);
    const hre = require("hardhat");
    const EfficiencyToken = await hre.ethers.getContractFactory("EfficiencyToken");
    console.log("EfficiencyToken: ", EfficiencyToken);
    
   

    console.log("Deploying contract...");
    const efficiencyToken = await EfficiencyToken.deploy();
    

    // Correctly wait for the contract to be deployed
    await efficiencyToken.waitForDeployment();
    console.log(`EfficiencyToken deployed to: ${efficiencyToken.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});