// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./RandomlyAssigned.sol";

/**
 * @title TheSample Contract
 */
contract TheSample is ERC721, ERC721Enumerable, EIP712, Ownable, ReentrancyGuard, RandomlyAssigned {

    using ECDSA for bytes32;

    uint8 constant MAX_MINTS_PER_WALLET = 1;
    uint16 constant MAX_SUPPLY = 100;
    // Final price - 0.1 ETH
    uint256 constant FINAL_PRICE = 100000000000000000;

    // Used to validate mint addresses
    address private signerAddress = 0xd19A6eC87f54B13455089d7C1115f73561508f40;

    string public constant PROVENANCE = "36641656665d499e9409ec6a055268e7300cb6a40ef72b31f4900307d97a96c6";

    // Remember the number of mints per wallet to control max mints value
    mapping (address => uint8) public totalMintsPerAddress;

    string private baseURI;

    // Public vars
    bool public saleActive;

    modifier whenSaleActive()
    {
        require(saleActive, "SALE_NOT_ACTIVE");
        _;
    }

    constructor(string memory _baseTokenURI, string memory name, string memory symbol)
    ERC721(name, symbol)
    EIP712(name, "1")
    RandomlyAssigned(MAX_SUPPLY, 0)
    {
        baseURI = _baseTokenURI;
    }

    /**
     * @notice Contract might receive/hold ETH as part of the maintenance process.
     */
    receive() external payable {}

    /**
     * @notice Change signer address
     */
    function setSignerAddress(address _signerAddress) external onlyOwner {
        require(_signerAddress != address(0));
        signerAddress = _signerAddress;
    }

    /**
     * @notice Start public sale
     */
    function startPublicSale() external onlyOwner
    {
        require(!saleActive, "SALE_HAS_BEGUN");
        saleActive = true;
    }

    /**
     * @notice Pause public sale
     */
    function pausePublicSale() external onlyOwner
    {
        require(saleActive, "SALE_PAUSED");
        saleActive = false;
    }

    /**
     * @notice Allow withdrawing funds
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        Address.sendValue(payable(msg.sender), balance);
    }

    /**
     * @notice Minting
     */
    function mint(bytes memory signature) external payable whenSaleActive nonReentrant
    {
        require(
            totalSupply() + 1 <= MAX_SUPPLY,
            "MAX_SUPPLY_ERROR"
        );
        require(
            totalMintsPerAddress[msg.sender] < MAX_MINTS_PER_WALLET,
            "MAX_MINTS_PER_WALLET_ERROR"
        );

        require(verifyAddressSigner(signature), "SIGNATURE_VALIDATION_FAILED");

        require(FINAL_PRICE <= msg.value, "INVALID_PRICE");

        totalMintsPerAddress[msg.sender] = 1;

        uint256 mintIndex = nextToken();
        _safeMint(msg.sender, mintIndex);

        if (msg.value > FINAL_PRICE) {
            Address.sendValue(payable(msg.sender), msg.value - FINAL_PRICE);
        }
    }

    /**
     * @notice Verify signature
     */
    function verifyAddressSigner(bytes memory signature) private view returns (bool) {
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender));
        return signerAddress == messageHash.toEthSignedMessageHash().recover(signature);
    }

    /**
     * @notice Read the base token URI
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @notice Update the base token URI
     */
    function setBaseURI(string memory uri) external onlyOwner {
        baseURI = uri;
    }

    /**
     * @notice Add json extension to all token URI's
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory)
    {
        return string(abi.encodePacked(super.tokenURI(tokenId), '.json'));
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}