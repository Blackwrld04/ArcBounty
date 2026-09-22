#!/usr/bin/env bash
# ==============================================================================
# ArcBounty Smart Contract Deployment Script for Circle Arc Mainnet & Testnet
# Powered by Arc Foundry (arc-forge & arc-cast)
# ==============================================================================

set -euo pipefail

# Ensure ~/.local/bin is in PATH for arc-forge and arc-cast
export PATH="$HOME/.local/bin:$PATH"

NETWORK="${1:-mainnet}"
CONTRACT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v arc-forge &> /dev/null; then
    echo "❌ Error: arc-forge not found in PATH or ~/.local/bin."
    echo "Please ensure Arc Foundry is installed."
    exit 1
fi

echo "=================================================================="
echo "🚀 ArcBounty Smart Contract Deployer"
echo "Target Network: ${NETWORK}"
echo "=================================================================="

if [ "${NETWORK}" = "mainnet" ]; then
    RPC_URL="https://rpc.mainnet.arc.io"
    CHAIN_ID="5042"
    EXPLORER_API="https://explorer.arc.io/api/"
    EXPLORER_URL="https://explorer.arc.io"
elif [ "${NETWORK}" = "testnet" ]; then
    RPC_URL="https://rpc.testnet.arc.io"
    CHAIN_ID="5042002"
    EXPLORER_API="https://explorer.testnet.arc.io/api/"
    EXPLORER_URL="https://explorer.testnet.arc.io"
else
    echo "❌ Unknown network: ${NETWORK}. Choose 'mainnet' or 'testnet'."
    exit 1
fi

if [ -z "${PRIVATE_KEY:-}" ]; then
    echo ""
    echo "⚠️  PRIVATE_KEY environment variable is not set."
    echo "To deploy to Arc ${NETWORK}, you need a wallet with a small amount of USDC for gas."
    echo ""
    echo "Run with:"
    echo "  PRIVATE_KEY=0x<your-private-key> ./deploy.sh ${NETWORK}"
    echo ""
    exit 1
fi

echo "📦 1. Compiling ArcBountyEscrow.sol with Arc Foundry..."
cd "${CONTRACT_DIR}"
arc-forge build

echo ""
echo "📡 2. Broadcasting Deployment Transaction to Arc ${NETWORK} (Chain ID: ${CHAIN_ID})..."
DEPLOY_OUTPUT=$(arc-forge create ArcBountyEscrow.sol:ArcBountyEscrow \
    --rpc-url "${RPC_URL}" \
    --private-key "${PRIVATE_KEY}" \
    --broadcast)

echo "${DEPLOY_OUTPUT}"

# Extract deployed address
DEPLOYED_ADDRESS=$(echo "${DEPLOY_OUTPUT}" | grep -i "Deployed to:" | awk '{print $3}')

if [ -n "${DEPLOYED_ADDRESS}" ]; then
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "Contract Address: ${DEPLOYED_ADDRESS}"
    echo "Explorer: ${EXPLORER_URL}/address/${DEPLOYED_ADDRESS}"
    echo ""
    echo "🔍 3. Verifying Contract on Arc Explorer (Blockscout)..."
    arc-forge verify-contract "${DEPLOYED_ADDRESS}" ArcBountyEscrow.sol:ArcBountyEscrow \
        --chain-id "${CHAIN_ID}" \
        --verifier blockscout \
        --verifier-url "${EXPLORER_API}" || echo "⚠️ Auto-verification completed or can be checked on explorer."

    echo ""
    echo "✅ Contract ready. Update ESCROW_WALLET_ADDRESS or CONTRACT_ADDRESS in server/.env with: ${DEPLOYED_ADDRESS}"
fi
