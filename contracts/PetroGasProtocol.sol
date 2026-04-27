// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PetroGasProtocol
 * @dev Main contract for PetroGas Protocol - Gas refunds indexed to oil prices
 */
contract PetroGasProtocol is Ownable, ReentrancyGuard {
    
    // Structures
    struct GasReceipt {
        address user;
        uint256 gasUsed;
        uint256 gasPriceGwei;
        uint256 ethPriceUSD; // Scaled by 1e8 (e.g., $3000 = 300000000000)
        uint256 feePaidUSD;  // Scaled by 1e8
        uint256 timestamp;
        uint256 stakedUntil;
        bool claimed;
    }
    
    struct OilPriceData {
        uint256 price;       // USD price scaled by 1e8
        uint256 timestamp;
    }
    
    // State variables
    mapping(uint256 => GasReceipt) public receipts;
    mapping(address => uint256[]) public userReceipts;
    uint256 public nextReceiptId;
    
    uint256 public constant BASELINE_OIL_PRICE = 75 * 1e8; // $75 baseline
    uint256 public constant MAX_OIL_PEG = 2 * 1e18;        // 2x max
    uint256 public constant MIN_OIL_PEG = 5 * 1e17;        // 0.5x min
    
    uint256 public treasuryBalance;
    uint256 public totalFeesCollected;
    
    OilPriceData public currentOilPrice;
    address public oilPriceOracle;
    
    uint256 public buybackPercentage = 60;  // 60% for buyback
    uint256 public refundPercentage = 30;   // 30% for refunds
    uint256 public protocolPercentage = 10; // 10% for protocol
    
    // Events
    event ReceiptCreated(
        uint256 indexed receiptId,
        address indexed user,
        uint256 gasUsed,
        uint256 gasPriceGwei,
        uint256 feePaidUSD
    );
    
    event ReceiptStaked(uint256 indexed receiptId, uint256 stakedUntil);
    event RefundClaimed(uint256 indexed receiptId, address indexed user, uint256 amount);
    event OilPriceUpdated(uint256 newPrice, uint256 timestamp);
    event BuybackExecuted(uint256 amount);
    
    constructor(address _oilPriceOracle) Ownable(msg.sender) {
        oilPriceOracle = _oilPriceOracle;
        currentOilPrice = OilPriceData({
            price: 75 * 1e8,
            timestamp: block.timestamp
        });
    }
    
    /**
     * @dev Create a gas receipt when user pays transaction fees
     */
    function createReceipt(
        uint256 _gasUsed,
        uint256 _gasPriceGwei,
        uint256 _ethPriceUSD
    ) external payable nonReentrant {
        require(_gasUsed > 0, "Gas used must be > 0");
        require(_gasPriceGwei > 0, "Gas price must be > 0");
        require(_ethPriceUSD > 0, "ETH price must be > 0");
        
        // Calculate fee in USD (scaled by 1e8)
        // gasUsed * gasPriceGwei (in gwei) * ethPriceUSD / 1e9 (gwei to ETH)
        uint256 feePaidUSD = (_gasUsed * _gasPriceGwei * _ethPriceUSD) / 1e9;
        
        // Store receipt
        receipts[nextReceiptId] = GasReceipt({
            user: msg.sender,
            gasUsed: _gasUsed,
            gasPriceGwei: _gasPriceGwei,
            ethPriceUSD: _ethPriceUSD,
            feePaidUSD: feePaidUSD,
            timestamp: block.timestamp,
            stakedUntil: 0,
            claimed: false
        });
        
        userReceipts[msg.sender].push(nextReceiptId);
        
        // Add to treasury
        treasuryBalance += msg.value;
        totalFeesCollected += feePaidUSD;
        
        emit ReceiptCreated(nextReceiptId, msg.sender, _gasUsed, _gasPriceGwei, feePaidUSD);
        
        nextReceiptId++;
    }
    
    /**
     * @dev Stake a receipt for enhanced refunds
     */
    function stakeReceipt(uint256 _receiptId, uint256 _stakeDays) external {
        GasReceipt storage receipt = receipts[_receiptId];
        require(receipt.user == msg.sender, "Not receipt owner");
        require(!receipt.claimed, "Already claimed");
        require(_stakeDays > 0 && _stakeDays <= 365, "Stake days must be 1-365");
        
        receipt.stakedUntil = block.timestamp + (_stakeDays * 1 days);
        
        emit ReceiptStaked(_receiptId, receipt.stakedUntil);
    }
    
    /**
     * @dev Calculate refund amount for a receipt
     */
    function calculateRefund(uint256 _receiptId) public view returns (uint256) {
        GasReceipt memory receipt = receipts[_receiptId];
        require(!receipt.claimed, "Already claimed");
        
        // Base refund = fee paid
        uint256 baseRefund = receipt.feePaidUSD;
        
        // Oil Peg Factor
        uint256 oilPegFactor = calculateOilPegFactor();
        
        // Time Multiplier (1 + days/365)
        uint256 timeMultiplier = 1e18; // 1.0x default
        if (receipt.stakedUntil > receipt.timestamp) {
            uint256 stakeDays = (receipt.stakedUntil - receipt.timestamp) / 1 days;
            timeMultiplier = 1e18 + ((stakeDays * 1e18) / 365);
        }
        
        // Gwei Efficiency (simplified - would use actual average in production)
        uint256 avgGwei = 45;
        uint256 gweiEfficiency = 1e18;
        if (receipt.gasPriceGwei < avgGwei) {
            gweiEfficiency = (avgGwei * 1e18) / receipt.gasPriceGwei;
            gweiEfficiency = sqrt(gweiEfficiency);
        } else {
            gweiEfficiency = sqrt((avgGwei * 1e18) / receipt.gasPriceGwei);
        }
        
        // Final calculation
        uint256 refund = (baseRefund * oilPegFactor * timeMultiplier * gweiEfficiency) / (1e18 * 1e18 * 1e18);
        
        return refund;
    }
    
    /**
     * @dev Claim refund for a receipt
     */
    function claimRefund(uint256 _receiptId) external nonReentrant {
        GasReceipt storage receipt = receipts[_receiptId];
        require(receipt.user == msg.sender, "Not receipt owner");
        require(!receipt.claimed, "Already claimed");
        
        if (receipt.stakedUntil > 0) {
            require(block.timestamp >= receipt.stakedUntil, "Still staked");
        }
        
        uint256 refundAmount = calculateRefund(_receiptId);
        require(treasuryBalance >= refundAmount, "Insufficient treasury");
        
        receipt.claimed = true;
        treasuryBalance -= refundAmount;
        
        // Transfer refund
        (bool success, ) = msg.sender.call{value: refundAmount}("");
        require(success, "Transfer failed");
        
        emit RefundClaimed(_receiptId, msg.sender, refundAmount);
    }
    
    /**
     * @dev Calculate Oil Peg Factor based on current oil price
     */
    function calculateOilPegFactor() public view returns (uint256) {
        uint256 factor = (currentOilPrice.price * 1e18) / BASELINE_OIL_PRICE;
        
        if (factor > MAX_OIL_PEG) return MAX_OIL_PEG;
        if (factor < MIN_OIL_PEG) return MIN_OIL_PEG;
        
        return factor;
    }
    
    /**
     * @dev Update oil price (only oracle)
     */
    function updateOilPrice(uint256 _newPrice) external {
        require(msg.sender == oilPriceOracle, "Not oracle");
        require(_newPrice > 0, "Invalid price");
        
        currentOilPrice = OilPriceData({
            price: _newPrice,
            timestamp: block.timestamp
        });
        
        emit OilPriceUpdated(_newPrice, block.timestamp);
    }
    
    /**
     * @dev Get user's receipts
     */
    function getUserReceipts(address _user) external view returns (uint256[] memory) {
        return userReceipts[_user];
    }
    
    /**
     * @dev Execute buyback (only owner)
     */
    function executeBuyback(uint256 _amount) external onlyOwner {
        require(_amount <= treasuryBalance, "Insufficient balance");
        treasuryBalance -= _amount;
        
        // In production, this would interact with a DEX to buy ETH
        emit BuybackExecuted(_amount);
    }
    
    /**
     * @dev Update percentages (only owner)
     */
    function updatePercentages(
        uint256 _buyback,
        uint256 _refund,
        uint256 _protocol
    ) external onlyOwner {
        require(_buyback + _refund + _protocol == 100, "Must sum to 100");
        buybackPercentage = _buyback;
        refundPercentage = _refund;
        protocolPercentage = _protocol;
    }
    
    /**
     * @dev Update oracle address (only owner)
     */
    function updateOracle(address _newOracle) external onlyOwner {
        require(_newOracle != address(0), "Invalid address");
        oilPriceOracle = _newOracle;
    }
    
    /**
     * @dev Square root function (Babylonian method)
     */
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
    
    receive() external payable {
        treasuryBalance += msg.value;
    }
}
