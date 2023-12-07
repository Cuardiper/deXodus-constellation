// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

//import "../lib/hardhat/packages/hardhat-core/console.sol"; //only for debugging

/*
NEXT ITERATIONS:
- CORE check
- APPLY GOVERNANCE check
- SET FEES
- UPGRADEABLE
- EVENTS
*/

contract LiquidityPool is
    UUPSUpgradeable,
    ERC20Upgradeable,
    Ownable2StepUpgradeable
{
    using SafeERC20 for IERC20;

    error LiquidityPool__InsufficientAvailableLiquidity(
        uint256 available,
        uint256 required
    );

    IERC20 public USDC;

    uint256 public blockedAmount; // see if it is more efficient use an available variable, compare.
    address public futuresContract;
    address public governance;
    uint256 public protocolFee;

    modifier onlyGov() {
        require(msg.sender == governance);
        _;
    }

    modifier onlyFutures() {
        require(msg.sender == futuresContract);
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _usdc,
        string memory _name,
        string memory _symbol,
        address _futuresContract) external initializer {
        __UUPSUpgradeable_init();
        __Ownable2Step_init();
        __ERC20_init(_name, _symbol);
        _transferOwnership(msg.sender);

        USDC = IERC20(_usdc);
        futuresContract = _futuresContract;
    }

    function setGovernance(address _governance) external onlyGov {
        governance = _governance;
    }

    function setProtocolFee(uint256 _protocolFee) external onlyGov {
        protocolFee = _protocolFee;
    }

    function setFuturesContract(address _futuresContract) external onlyGov {
        futuresContract = _futuresContract;
    }

    function addLiquidity(address to, uint256 amount) external {
        // calculate lp amount
        uint256 lpAmountOut = calcLpOut(amount);

        // transfer usdc to the LP
        USDC.transferFrom(msg.sender, address(this), amount);

        // transfer lp token to the user
        _mint(to, lpAmountOut);
    }

    /* Do we need a function to block transfers??
    function transfer() external {
        revert();
    } */

    function withdrawLiquidity(address to, uint256 amount) external {
        // calc share
        uint256 liquidityOut = calcUsdcOut(amount);

        uint256 available = availableLiquidity();

        if (liquidityOut > available)
            revert LiquidityPool__InsufficientAvailableLiquidity({
                available: available,
                required: amount
            });

        // burn lp
        _burn(msg.sender, amount);

        // transfer liq
        USDC.safeTransfer(to, liquidityOut);
    }

    function benefitsToTrader(
        address _to,
        uint256 _amount
    ) external onlyFutures {
        // USDC.safeApprove(_to, _amount);
        USDC.safeTransfer(_to, _amount);
    }

    function blockLiquidity(uint256 _amount) external onlyFutures {
        uint256 available = availableLiquidity();
        if (_amount > available)
            revert LiquidityPool__InsufficientAvailableLiquidity({
                available: available,
                required: _amount
            });
        blockedAmount += _amount;
    }

    function unblockLiquidity(uint256 _amount) external onlyFutures {
        if (blockedAmount < _amount) _amount = blockedAmount;
        blockedAmount -= _amount;
    }

    // HELPERS

    // function claimRewards() external {}

    function availableLiquidity() public view returns (uint256) {
        return USDC.balanceOf(address(this)) - blockedAmount;
    }

    function calcUsdcOut(
        uint256 amount
    ) public view returns (uint256 liquidityOut) {
        liquidityOut = (USDC.balanceOf(address(this)) * amount) / totalSupply();
    }

    function calcLpOut(uint256 amountIn) public returns (uint256 lpOut) {
        if (totalSupply() == 0) {
            lpOut = (amountIn * 10 * 1e18) / 1e6;
        } else {
            uint256 price = (totalSupply() * 1e6) /
                USDC.balanceOf(address(this));
            lpOut = (amountIn * price) / 1e6;
        }
        return lpOut;
    }

    function version() external pure returns (uint256) {
        return 1;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal virtual override onlyOwner {}

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
