// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/WinnerBadge.sol";
import "../src/TournamentPlatform.sol";

contract DeployScript is Script {
    function run() external {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy WinnerBadge first
        console.log("\n1. Deploying WinnerBadge...");
        WinnerBadge winnerBadge = new WinnerBadge();
        console.log("WinnerBadge deployed at:", address(winnerBadge));
        
        // 2. Deploy TournamentPlatform with treasury and badge address
        console.log("\n2. Deploying TournamentPlatform...");
        address treasury = deployer; // Use deployer as treasury for now
        TournamentPlatform platform = new TournamentPlatform(
            treasury,
            address(winnerBadge)
        );
        console.log("TournamentPlatform deployed at:", address(platform));
        console.log("Treasury address:", treasury);
        
        // 3. Authorize TournamentPlatform to mint badges
        console.log("\n3. Authorizing TournamentPlatform to mint badges...");
        winnerBadge.authorizeMinter(address(platform));
        console.log("TournamentPlatform authorized as minter");
        
        vm.stopBroadcast();
        
        // Print deployment summary
        console.log("\n========================================");
        console.log("DEPLOYMENT SUMMARY");
        console.log("========================================");
        console.log("Network: Sepolia Testnet");
        console.log("Deployer:", deployer);
        console.log("WinnerBadge:", address(winnerBadge));
        console.log("TournamentPlatform:", address(platform));
        console.log("Treasury:", treasury);
        console.log("========================================");
        console.log("\nNext steps:");
        console.log("1. Verify contracts on Etherscan");
        console.log("2. Update frontend with contract addresses");
        console.log("3. Test on Sepolia testnet");
        console.log("========================================");
    }
}
