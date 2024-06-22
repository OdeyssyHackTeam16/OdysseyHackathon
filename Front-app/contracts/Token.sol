// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EfficiencyToken is ERC20 {
    uint256 private constant _maxSupply = 1000000 * 10 ** 18;
    mapping(address => uint256) private pointsBalance;

    event PointsRedeemed(address indexed employee, uint256 points, string reward);
    event TokensRewarded(address indexed branch, uint256 amount);
    event PointsConverted(address indexed user, uint256 tokenAmount, uint256 points);

    constructor() ERC20("EfficiencyToken", "EFT") {
        _mint(address(this), _maxSupply); // Mint max supply to contract address initially
    }

    function rewardBranch(address branch) public {
        uint256 _rewardAmount = 1 * 10 ** 18; // 1 token
        require(balanceOf(address(this)) >= _rewardAmount, "Insufficient tokens in contract");
        _transfer(address(this), branch, _rewardAmount);
        emit TokensRewarded(branch, _rewardAmount);
    }

    function convertToPoints(uint256 tokenAmount) public {
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance");
        _burn(msg.sender, tokenAmount);
        uint256 points = tokenAmount * 10; // Example conversion rate: 1 token = 10 points
        pointsBalance[msg.sender] += points;
        emit PointsConverted(msg.sender, tokenAmount, points);
    }

    function redeemPoints(uint256 points, string memory reward) public {
        require(pointsBalance[msg.sender] >= points, "Insufficient points balance");
        pointsBalance[msg.sender] -= points;
        emit PointsRedeemed(msg.sender, points, reward);
    }

    function getMaxSupply() public pure returns (uint256) {
        return _maxSupply;
    }

    function getPointsBalance(address add) public view returns (uint256) {
        return pointsBalance[add];
    }
}
