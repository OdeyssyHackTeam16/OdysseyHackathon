require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  settings: {
    optimizer: {
      enabled: true, // Enable the optimizer
      runs: 200,     // Set the number of optimization runs
    },
  },
  defaultNetwork:"hardhat",
  networks:{
    hardhat: {
      accounts: [
        {
          privateKey: "9c54b8fa8702d0ea3adc46f20c56ccf55d50bb3b5e1a2d8a44ab359310325436",
          balance: "10000000000000000000000" // 10000 ETH
        },
        {
          privateKey:  "096aef34f123c3af57ee4e43c7a3318daa9b1c11b128fafc294613c10c4c4009",
          balance: "10000000000000000000000" // 10000 ETH
        }

      ]
    },
    
  }
};